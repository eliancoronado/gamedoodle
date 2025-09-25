import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { openDB } from "idb";
import { FaHeart, FaCoins, FaTimes, FaCheck, FaTrophy, FaBrain, FaClock, FaChartBar } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Importar preguntas desde el JSON (asumiendo que tienes un archivo questions.json)
import questionsData from '../data/questions.json';

const DB_NAME = "game-db";
const DB_VERSION = 1;
const USERS_STORE = "users";

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const store = db.createObjectStore(USERS_STORE, { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
      }
    },
  });
}

async function getUserById(id) {
  const db = await getDb();
  return db.get(USERS_STORE, id);
}

async function updateUserInDB(updatedUser) {
  const db = await getDb();
  await db.put(USERS_STORE, updatedUser);
  return updatedUser;
}

export default function GameScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('loading'); // loading, playing, finished
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [results, setResults] = useState([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Configuración del juego
  const TOTAL_QUESTIONS = 10;
  const BASE_REWARD = 50;
  const TIME_PER_QUESTION = 30;

  useEffect(() => {
    AOS.init({ duration: 800 });
    loadUserAndStartGame();
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0 && !isAnswerSubmitted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswerSubmitted) {
      handleTimeOut();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, isAnswerSubmitted]);

  const loadUserAndStartGame = async () => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);
        setLives(userData.lives || 3);
        initializeGame();
      }
    }
  };

  const initializeGame = () => {
    // Seleccionar 10 preguntas aleatorias alternando categorías
    const selectedQuestions = selectRandomQuestions();
    setQuestions(selectedQuestions);
    setGameState('playing');
    setTimeLeft(TIME_PER_QUESTION);
  };

  const selectRandomQuestions = () => {
    const allQuestions = [];
    
    // Agrupar preguntas por categoría
    const questionsByCategory = {};
    questionsData.categories.forEach(category => {
      questionsByCategory[category.name] = category.questions;
    });

    // Seleccionar preguntas equitativamente de cada categoría
    const categories = Object.keys(questionsByCategory);
    const questionsPerCategory = Math.ceil(TOTAL_QUESTIONS / categories.length);
    
    categories.forEach(category => {
      const categoryQuestions = [...questionsByCategory[category]];
      const selected = [];
      
      for (let i = 0; i < questionsPerCategory && categoryQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
        selected.push({
          ...categoryQuestions[randomIndex],
          category: category
        });
        categoryQuestions.splice(randomIndex, 1);
      }
      
      allQuestions.push(...selected);
    });

    // Mezclar y tomar solo TOTAL_QUESTIONS
    return allQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_QUESTIONS);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answerIndex);
  };

  const handleTimeOut = () => {
    if (isAnswerSubmitted) return;
    
    const currentQ = questions[currentQuestion];
    const isCorrect = false;
    
    setResults(prev => [...prev, {
      question: currentQ.title,
      correct: isCorrect,
      userAnswer: null,
      correctAnswer: currentQ.correctAnswer,
      timeUsed: TIME_PER_QUESTION - timeLeft
    }]);

    handleAnswerResult(isCorrect);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    
    setResults(prev => [...prev, {
      question: currentQ.title,
      correct: isCorrect,
      userAnswer: selectedAnswer,
      correctAnswer: currentQ.correctAnswer,
      timeUsed: TIME_PER_QUESTION - timeLeft
    }]);

    handleAnswerResult(isCorrect);
  };

  const handleAnswerResult = (isCorrect) => {
    setIsAnswerSubmitted(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setLives(prev => prev - 1);
    }

    // Avanzar a la siguiente pregunta después de un delay
    setTimeout(() => {
      if (currentQuestion + 1 < TOTAL_QUESTIONS && lives > 1) {
        goToNextQuestion();
      } else {
        endGame();
      }
    }, 2000);
  };

  const goToNextQuestion = () => {
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setTimeLeft(TIME_PER_QUESTION);
  };

  const endGame = async () => {
    setGameState('finished');
    
    // Calcular recompensa
    const correctPercentage = (score / TOTAL_QUESTIONS) * 100;
    let reward = Math.round(BASE_REWARD * (correctPercentage / 100));
    
    // Bonus por vidas restantes
    const livesBonus = lives * 10;
    reward += livesBonus;

    // Actualizar usuario en la base de datos
    if (user) {
      const updatedUser = {
        ...user,
        coins: user.coins + reward,
        exp: user.exp + Math.round(reward / 10),
        lives: Math.max(0, lives) // No permitir vidas negativas
      };

      try {
        await updateUserInDB(updatedUser);
        setUser(updatedUser);
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
      }
    }
  };

  const getAnswerColor = (answerIndex) => {
    if (!isAnswerSubmitted) {
      return selectedAnswer === answerIndex 
        ? "bg-blue-500 border-blue-400" 
        : "bg-gray-800 border-gray-600 hover:bg-gray-700";
    }

    const currentQ = questions[currentQuestion];
    if (answerIndex === currentQ.correctAnswer) {
      return "bg-green-500 border-green-400";
    } else if (answerIndex === selectedAnswer && answerIndex !== currentQ.correctAnswer) {
      return "bg-red-500 border-red-400";
    }
    return "bg-gray-800 border-gray-600";
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;
  };

  if (!user || gameState === 'loading') {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-center" data-aos="zoom-in">
          <FaBrain className="text-6xl text-yellow-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl text-white font-bold">Cargando juego...</h1>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const correctPercentage = (score / TOTAL_QUESTIONS) * 100;
    const reward = Math.round(BASE_REWARD * (correctPercentage / 100)) + (lives * 10);

    return (
      <div className="w-full h-auto bg-gradient-to-br from-purple-900 to-blue-900 flex flex-col items-center justify-center p-6 text-white relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 p-3 rounded-full transition-transform hover:scale-110"
        >
          <FaTimes className="text-white" />
        </button>

        <div className="text-center max-w-2xl w-full" data-aos="zoom-in">
          <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ¡JUEGO TERMINADO!
          </h1>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-black/40 rounded-xl p-4 border border-green-500">
              <FaCheck className="text-green-400 text-2xl mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-400">{score}</p>
              <p className="text-gray-300">Correctas</p>
            </div>
            
            <div className="bg-black/40 rounded-xl p-4 border border-red-500">
              <FaTimes className="text-red-400 text-2xl mx-auto mb-2" />
              <p className="text-3xl font-bold text-red-400">{TOTAL_QUESTIONS - score}</p>
              <p className="text-gray-300">Incorrectas</p>
            </div>
          </div>

          <div className="bg-black/40 rounded-xl p-6 mb-6 border border-yellow-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Porcentaje de aciertos:</span>
              <span className="text-2xl font-bold text-yellow-400">{correctPercentage.toFixed(1)}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-400 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${correctPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Recompensa obtenida:</span>
              <div className="flex items-center">
                <FaCoins className="text-yellow-400 mr-2" />
                <span className="text-xl font-bold">{reward} monedas</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/princ')}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-3 rounded-xl font-bold text-lg transition-transform hover:scale-105"
          >
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="w-full h-auto bg-gradient-to-br from-purple-900 to-blue-900 flex flex-col p-4 text-white relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-gradient-to-r from-black/80 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-transform hover:scale-110"
        >
          <FaTimes className="text-white" />
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-black/50 px-4 py-2 rounded-lg border border-yellow-500">
            <FaCoins className="text-yellow-400 mr-2" />
            <span className="font-bold">{user.coins}</span>
          </div>
          <div className="flex items-center bg-black/50 px-4 py-2 rounded-lg border border-red-500">
            <FaHeart className="text-red-500 mr-2" />
            <span className="font-bold">{lives}</span>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-16 mb-6" data-aos="fade-down">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Pregunta {currentQuestion + 1} de {TOTAL_QUESTIONS}</span>
          <span className="text-sm text-gray-300">{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-6" data-aos="fade-down">
        <div className="flex items-center bg-black/40 px-6 py-2 rounded-full border border-yellow-400">
          <FaClock className="text-yellow-400 mr-2" />
          <span className={`font-bold text-xl ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Categoría */}
      <div className="text-center mb-6" data-aos="fade-up">
        <span className="bg-blue-600 px-4 py-1 rounded-full text-sm font-bold">
          {currentQ?.category}
        </span>
      </div>

      {/* Pregunta */}
      <div className="flex-1 flex flex-col justify-center" data-aos="zoom-in">
        <div className="bg-black/30 rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold text-center leading-relaxed">
            {currentQ?.title}
          </h2>
        </div>

        {/* Respuestas */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {currentQ?.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswerSubmitted}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                getAnswerColor(index)
              } ${!isAnswerSubmitted ? 'hover:scale-105' : ''}`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  !isAnswerSubmitted 
                    ? 'bg-gray-600' 
                    : index === currentQ.correctAnswer 
                      ? 'bg-green-500' 
                      : index === selectedAnswer 
                        ? 'bg-red-500' 
                        : 'bg-gray-600'
                }`}>
                  {!isAnswerSubmitted ? (
                    <span className="font-bold">{String.fromCharCode(65 + index)}</span>
                  ) : index === currentQ.correctAnswer ? (
                    <FaCheck className="text-white" />
                  ) : index === selectedAnswer ? (
                    <FaTimes className="text-white" />
                  ) : (
                    <span className="font-bold">{String.fromCharCode(65 + index)}</span>
                  )}
                </div>
                <span className="text-lg">{answer}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Botón de enviar */}
        {!isAnswerSubmitted && selectedAnswer !== null && (
          <button
            onClick={handleSubmitAnswer}
            className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105"
          >
            CONFIRMAR RESPUESTA
          </button>
        )}
      </div>

      {/* Efectos de partículas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          />
        ))}
      </div>
    </div>
  );
}