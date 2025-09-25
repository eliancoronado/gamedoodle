import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { openDB } from "idb";
import { Wheel } from "react-custom-roulette";
import {
  FaCoins,
  FaHeart,
  FaTimes,
  FaFire,
  FaCrown,
  FaGem,
  FaStar,
  FaSyncAlt,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

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

export default function LuckyWheelScreen() {
  const navigate = useNavigate();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [user, setUser] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);

  const SPIN_PRICE = 200; // Precio en monedas por giro

  const data = [
    {
      option: "5 ❤️",
      style: { backgroundColor: "#F9A8D4", textColor: "#831843" },
      hearts: 5,
    },
    {
      option: "10 ❤️",
      style: { backgroundColor: "#FCA5A5", textColor: "#9F1239" },
      hearts: 10,
    },
    {
      option: "15 ❤️",
      style: { backgroundColor: "#F87171", textColor: "#7F1D1D" },
      hearts: 15,
    },
    {
      option: "25 ❤️",
      style: { backgroundColor: "#EF4444", textColor: "#FFFFFF" },
      hearts: 25,
    },
    {
      option: "50 ❤️",
      style: { backgroundColor: "#DC2626", textColor: "#FFFFFF" },
      hearts: 50,
    },
    {
      option: "3 ❤️",
      style: { backgroundColor: "#FDBA74", textColor: "#9A3412" },
      hearts: 3,
    },
    {
      option: "8 ❤️",
      style: { backgroundColor: "#FB923C", textColor: "#9A3412" },
      hearts: 8,
    },
    {
      option: "12 ❤️",
      style: { backgroundColor: "#F97316", textColor: "#FFFFFF" },
      hearts: 12,
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const loadCurrentUser = async () => {
      const userId = localStorage.getItem("currentUserId");
      if (userId) {
        const user = await getUserById(userId);
        if (user) {
          setUser(user);
        }
      }
    };
    loadCurrentUser();
  }, []);

  const handleSpinClick = () => {
    if (!user || user.coins < SPIN_PRICE || mustSpin) return;

    // Seleccionar premio aleatorio
    const randomPrize = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomPrize);
    setMustSpin(true);
    setIsSpinning(true);
  };

  const handlePrizeClaim = () => {
    setIsSpinning(false);
    setMustSpin(false);

    const prize = data[prizeNumber];
    setWonPrize(prize);
    setShowPrize(true);

    // Actualizar usuario con premio
    const updatedUser = {
      ...user,
      coins: user.coins - SPIN_PRICE, // Ya se restó antes
      lives: user.lives + prize.hearts,
    };

    setUser(updatedUser);
    updateUserInDB(updatedUser);

    // Ocultar premio después de 3 segundos
    setTimeout(() => {
      setShowPrize(false);
    }, 3000);
  };

  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-red-900 via-black to-yellow-900">
        <div className="text-center" data-aos="zoom-in">
          <FaSyncAlt className="text-6xl text-yellow-400 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl text-white font-bold">Cargando ruleta...</h1>
        </div>
      </div>
    );
  }

  const canSpin = user.coins >= SPIN_PRICE && !mustSpin;

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-red-900 via-black to-yellow-900 flex flex-col landscape:flex-row text-white overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-gradient-to-r from-black/80 to-transparent">
        <div className="flex items-center space-x-4" data-aos="fade-right">
          <div className="flex items-center bg-black/50 px-4 py-2 rounded-lg border border-yellow-500">
            <FaCoins className="text-yellow-400 mr-2" />
            <span className="font-bold text-lg">{user.coins}</span>
          </div>
          <div className="flex items-center bg-black/50 px-4 py-2 rounded-lg border border-red-500">
            <FaHeart className="text-red-500 mr-2" />
            <span className="font-bold text-lg">{user.lives}</span>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-transform hover:scale-110"
          data-aos="fade-left"
        >
          <FaTimes className="text-white text-lg" />
        </button>
      </div>

      {/* Sección izquierda - Información */}
      <div className="flex-1 landscape:w-2/5 p-2 pt-2 landscape:pt-20 flex flex-col justify-center py-4">
        <div className="max-w-md mx-auto text-center space-y-4 px-4 min-h-screen overflow-y-auto">
          <h1 className="text-5xl font-bold my-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            LUCK ROYALE
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Gira y gana corazones épicos
          </p>

          <div className="bg-black/40 rounded-xl p-6 border border-yellow-500/50 mb-6">
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <FaCrown className="text-yellow-400 mr-2" />
              Premios Disponibles
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {data.map((prize, index) => (
                <div
                  key={index}
                  className="flex items-center bg-black/30 px-3 py-2 rounded"
                >
                  <FaHeart className="text-red-400 mr-2" />
                  <span className="text-sm">{prize.option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de giro */}
          <button
            onClick={handleSpinClick}
            disabled={!canSpin}
            className={`mt-2 px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
              canSpin
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-2xl"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {isSpinning ? (
              <div className="flex items-center">
                <FaSyncAlt className="animate-spin mr-2" />
                GIRANDO...
              </div>
            ) : canSpin ? (
              <div className="flex items-center">
                <FaFire className="mr-2" />
                GIRAR POR {SPIN_PRICE} MONEDAS
              </div>
            ) : (
              <div className="flex items-center">
                <FaCoins className="mr-2" />
                MONEDAS INSUFICIENTES
              </div>
            )}
          </button>

          {/* Información de saldo */}
          <div className="mt-4 text-center text-gray-300">
            {canSpin ? (
              <p>
                Saldo después del giro:{" "}
                <span className="text-yellow-400 font-bold">
                  {user.coins - SPIN_PRICE}
                </span>{" "}
                monedas
              </p>
            ) : (
              <p>
                Necesitas{" "}
                <span className="text-yellow-400 font-bold">
                  {SPIN_PRICE - user.coins}
                </span>{" "}
                monedas más para girar
              </p>
            )}
          </div>

          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FaCoins className="text-yellow-300 mr-2" />
              <span className="font-bold text-lg">
                Precio por giro: {SPIN_PRICE} monedas
              </span>
            </div>
            <p className="text-sm opacity-90">1 oportunidad por pago</p>
          </div>
        </div>
      </div>

      {/* Sección derecha - Ruleta */}
      <div className="flex-1 landscape:w-3/5 flex flex-col items-center justify-center p-8 landscape:pt-20 relative">
        {/* Ruleta */}
        <div className="relative">
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>

          <div className="relative bg-black/30 rounded-full p-6 border-4 border-yellow-500/50">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              outerBorderColor="#F59E0B"
              outerBorderWidth={15}
              innerRadius={15}
              innerBorderColor="#D97706"
              innerBorderWidth={8}
              radiusLineColor="#FBBF24"
              radiusLineWidth={4}
              fontSize={14}
              fontWeight="bold"
              textDistance={65}
              spinDuration={0.6}
              perpendicularText={false}
              onStopSpinning={handlePrizeClaim}
            />
          </div>

          {/* Puntero */}
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
            <div className="w-0 h-0 border-t-8 border-b-8 border-l-16 border-t-transparent border-b-transparent border-l-yellow-400"></div>
          </div>
        </div>
      </div>

      {/* Modal de premio */}
      {showPrize && wonPrize && (
        <div
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
          data-aos="zoom-in"
        >
          <div className="bg-gradient-to-br from-yellow-500 to-red-600 rounded-2xl p-8 text-center max-w-md mx-4">
            <FaStar className="text-6xl text-white mx-auto mb-4 animate-bounce" />
            <h3 className="text-3xl font-bold text-white mb-2">
              ¡FELICIDADES!
            </h3>
            <p className="text-xl text-white mb-4">Has ganado</p>
            <div className="text-4xl font-bold text-white flex items-center justify-center">
              <FaHeart className="text-red-400 mr-2" />
              {wonPrize.hearts} CORAZONES
            </div>
            <p className="text-white/80 mt-4">
              Los corazones se han añadido a tu inventario
            </p>
          </div>
        </div>
      )}

      {/* Efectos de partículas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={i + 15}
            className="absolute w-1 h-1 bg-red-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Efecto de brillo dinámico */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 rounded-full blur-3xl transition-all duration-1000 ${
          isSpinning ? "opacity-30 scale-150" : "opacity-10 scale-100"
        }`}
      ></div>
    </div>
  );
}
