import { useState, useEffect } from "react";
import {
  FaLock,
  FaCheckCircle,
  FaPlay,
  FaStar,
  FaStarHalfAlt,
  FaCoins,
  FaHeart,
} from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
//import { obtenerUsuario } from "./utils/db";
import AOS from "aos";
import "aos/dist/aos.css";
import lvfondo from "/lvfondo.webp";
import { openDB } from "idb";

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

export default function LvFacil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [completadas, setCompletadas] = useState({});
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Configuración de niveles con posiciones ajustadas para horizontal
  const levels = [
    {
      id: 1,
      title: "Lección 1",
      theme: "from-cyan-400 to-blue-500",
      x: 50,
      y: 50,
      content: `<div class="bg-gradient-to-b from-blue-100 to-purple-100 min-h-screen text-black">
    <div class="container mx-auto px-4 py-8">
        <!-- Encabezado -->
        <header class="text-center mb-12">
            <h1 class="text-3xl md:text-4xl font-bold text-purple-600 mb-4">Operaciones con Números Naturales, Fracciones y Decimales</h1>
            <p class="text-xl text-gray-700">Descubre lo divertido de los números naturales, fracciones y decimales</p>
        </header>

        <!-- Números Naturales -->
        <section class="bg-white rounded-xl shadow-lg p-6 mb-10">
            <div class="flex items-center mb-6">
                <svg class="w-10 h-10 text-blue-500 mr-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7,11H9V13H7V11M21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5M19,5H5V19H19V5M15,11H17V13H15V11M11,11H13V13H11V11Z" />
                </svg>
                <h2 class="text-3xl font-bold text-blue-600">Números Naturales</h2>
            </div>
            
            <p class="text-lg text-gray-700 mb-4">Los números naturales son los que usamos para contar: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...</p>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-blue-700 mb-2">Suma</h3>
                    <p class="mb-2 text-black">Juntamos dos grupos de cosas:</p>
                    <div class="flex items-center justify-center mb-2">
                        <span class="text-2xl text-black">3 manzanas + 2 manzanas = 5 manzanas</span>
                    </div>
                    <div class="flex justify-center">
                        <svg class="w-24 h-24 text-red-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                            <text x="7" y="16" fill="white" font-size="12">3</text>
                        </svg>
                        <span class="text-3xl mx-2">+</span>
                        <svg class="w-24 h-24 text-red-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                            <text x="7" y="16" fill="white" font-size="12">2</text>
                        </svg>
                        <span class="text-3xl mx-2">=</span>
                        <svg class="w-24 h-24 text-red-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                            <text x="7" y="16" fill="white" font-size="12">5</text>
                        </svg>
                    </div>
                </div>
                
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-blue-700 mb-2">Resta</h3>
                    <p class="mb-2 text-black">Quitamos una cantidad de otra:</p>
                    <div class="flex items-center justify-center mb-2">
                        <span class="text-2xl text-blackks">7 galletas - 3 galletas = 4 galletas</span>
                    </div>
                    <div class="flex justify-center">
                        <svg class="w-24 h-24 text-yellow-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                            <text x="7" y="16" fill="white" font-size="12">7</text>
                        </svg>
                        <span class="text-3xl mx-2">-</span>
                        <svg class="w-24 h-24 text-yellow-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                            <text x="7" y="16" fill="white" font-size="12">3</text>
                        </svg>
                        <span class="text-3xl mx-2">=</span>
                        <svg class="w-24 h-24 text-yellow-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                            <text x="7" y="16" fill="white" font-size="12">4</text>
                        </svg>
                    </div>
                </div>
            </div>
        </section>

        <!-- Fracciones -->
        <section class="bg-white rounded-xl shadow-lg p-6 mb-10">
            <div class="flex items-center mb-6">
                <svg class="w-10 h-10 text-green-500 mr-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,14.09 4.8,16 6.11,17.41L17.41,6.11C16,4.8 14.09,4 12,4M12,20A8,8 0 0,0 20,12C20,9.91 19.2,8 17.89,6.59L6.59,17.89C8,19.2 9.91,20 12,20Z" />
                </svg>
                <h2 class="text-3xl font-bold text-green-600">Fracciones</h2>
            </div>
            
            <p class="text-lg text-gray-700 mb-4">Las fracciones representan partes de un todo. Tienen un numerador (parte de arriba) y un denominador (parte de abajo).</p>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-green-50 p-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-green-700 mb-2">Partes de un todo</h3>
                    <p class="mb-2 text-black">Si divides una pizza en 8 partes iguales y tomas 3:</p>
                    <div class="flex justify-center items-center mb-4">
                        <span class="text-3xl text-black font-bold mr-2">3/8</span>
                        <svg class="w-32 h-32" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="#FDE047" stroke="#333" stroke-width="2"/>
                            <!-- Líneas para dividir en 8 partes -->
                            <line x1="50" y1="5" x2="50" y2="95" stroke="#333" stroke-width="1"/>
                            <line x1="5" y1="50" x2="95" y2="50" stroke="#333" stroke-width="1"/>
                            <line x1="20" y1="20" x2="80" y2="80" stroke="#333" stroke-width="1"/>
                            <line x1="80" y1="20" x2="20" y2="80" stroke="#333" stroke-width="1"/>
                            <!-- 3 porciones coloreadas -->
                            <path d="M50,50 L95,50 A45,45 0 0,1 80,20 Z" fill="#F97316" opacity="0.7"/>
                            <path d="M50,50 L80,20 A45,45 0 0,1 50,5 Z" fill="#F97316" opacity="0.7"/>
                            <path d="M50,50 L50,5 A45,45 0 0,1 20,20 Z" fill="#F97316" opacity="0.7"/>
                        </svg>
                    </div>
                </div>
                
                <div class="bg-green-50 p-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-green-700 mb-2">Suma de fracciones</h3>
                    <p class="mb-2 text-black">Para sumar fracciones con el mismo denominador:</p>
                    <div class="text-center mb-4">
                        <span class="text-3xl text-black font-bold">1/4 + 2/4 = 3/4</span>
                    </div>
                    <div class="flex justify-center">
                        <div class="mr-4 text-center">
                            <svg class="w-20 h-20 mx-auto" viewBox="0 0 100 100">
                                <rect x="5" y="5" width="90" height="90" fill="#FDE047" stroke="#333" stroke-width="2"/>
                                <line x1="50" y1="5" x2="50" y2="95" stroke="#333" stroke-width="1"/>
                                <line x1="5" y1="50" x2="95" y2="50" stroke="#333" stroke-width="1"/>
                                <rect x="5" y="5" width="45" height="45" fill="#F97316" opacity="0.7"/>
                            </svg>
                            <span class="block mt-1">1/4</span>
                        </div>
                        <span class="text-3xl self-center">+</span>
                        <div class="mx-4 text-center">
                            <svg class="w-20 h-20 mx-auto" viewBox="0 0 100 100">
                                <rect x="5" y="5" width="90" height="90" fill="#FDE047" stroke="#333" stroke-width="2"/>
                                <line x1="50" y1="5" x2="50" y2="95" stroke="#333" stroke-width="1"/>
                                <line x1="5" y1="50" x2="95" y2="50" stroke="#333" stroke-width="1"/>
                                <rect x="55" y="5" width="40" height="45" fill="#F97316" opacity="0.7"/>
                                <rect x="5" y="55" width="45" height="40" fill="#F97316" opacity="0.7"/>
                            </svg>
                            <span class="block mt-1">2/4</span>
                        </div>
                        <span class="text-3xl self-center">=</span>
                        <div class="ml-4 text-center">
                            <svg class="w-20 h-20 mx-auto" viewBox="0 0 100 100">
                                <rect x="5" y="5" width="90" height="90" fill="#FDE047" stroke="#333" stroke-width="2"/>
                                <line x1="50" y1="5" x2="50" y2="95" stroke="#333" stroke-width="1"/>
                                <line x1="5" y1="50" x2="95" y2="50" stroke="#333" stroke-width="1"/>
                                <rect x="5" y="5" width="45" height="45" fill="#F97316" opacity="0.7"/>
                                <rect x="55" y="5" width="40" height="45" fill="#F97316" opacity="0.7"/>
                                <rect x="5" y="55" width="45" height="40" fill="#F97316" opacity="0.7"/>
                            </svg>
                            <span class="block mt-1">3/4</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Decimales -->
        <section class="bg-white rounded-xl shadow-lg p-6 mb-10">
            <div class="flex items-center mb-6">
                <svg class="w-10 h-10 text-purple-500 mr-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7,13V11H21V13H7M7,19V17H21V19H7M7,7V5H21V7H7M3,8V5H2V4H4V8H3M2,17V16H5V20H2V19H4V18.5H3V17.5H4V17H2M4.25,10A0.75,0.75 0 0,1 5,10.75C5,10.95 4.92,11.14 4.79,11.27L3.12,13H5V14H2V13.08L4,11H2V10H4.25Z" />
                </svg>
                <h2 class="text-3xl font-bold text-purple-600">Números Decimales</h2>
            </div>
            
            <p class="text-lg text-gray-700 mb-4">Los números decimales nos ayudan a representar cantidades más pequeñas que 1. Usamos una coma o punto decimal para separar la parte entera de la parte decimal.</p>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-purple-50 p-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-purple-700 mb-2">Partes de un número decimal</h3>
                    <p class="mb-2">Por ejemplo, en el número 3,75:</p>
                    <div class="text-center mb-4">
                        <div class="inline-block border-2 border-purple-400 rounded-lg p-2">
                            <span class="text-2xl font-bold text-purple-800">3</span>
                            <span class="text-2xl font-bold">,</span>
                            <span class="text-2xl font-bold text-purple-600">7</span>
                            <span class="text-2xl font-bold text-purple-500">5</span>
                        </div>
                        <div class="flex justify-center mt-1">
                            <div class="mr-6 text-center">
                                <span class="block text-sm font-semibold">Parte entera</span>
                                <span class="text-purple-800">3</span>
                            </div>
                            <div class="text-center">
                                <span class="block text-sm font-semibold">Parte decimal</span>
                                <span class="text-purple-600">0,75</span>
                            </div>
                        </div>
                    </div>
                    <p>Esto equivale a 3 unidades y 75 centésimas.</p>
                </div>
                
                <div class="bg-purple-50 p-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-purple-700 mb-2">Suma de decimales</h3>
                    <p class="mb-2">Para sumar decimales, alineamos las comas:</p>
                    <div class="text-center mb-4">
                        <div class="mb-2">
                            <span class="text-xl">1,25 + 0,75 = 2,00</span>
                        </div>
                        <div class="flex justify-center items-end">
                            <div class="text-right mr-4">
                                <span>1,25</span><br>
                                <span>+ 0,75</span><br>
                                <span class="border-t border-gray-700 block">2,00</span>
                            </div>
                            <div class="ml-4">
                                <svg class="w-20 h-20" viewBox="0 0 100 100">
                                    <rect x="5" y="5" width="90" height="90" rx="5" fill="#D8B4FE" stroke="#333" stroke-width="2"/>
                                    <circle cx="30" cy="30" r="10" fill="#9333EA"/>
                                    <circle cx="70" cy="30" r="10" fill="#9333EA" opacity="0.5"/>
                                    <circle cx="30" cy="70" r="10" fill="#9333EA" opacity="0.25"/>
                                    <circle cx="70" cy="70" r="10" fill="#9333EA" opacity="0.25"/>
                                    <text x="26" y="34" fill="white" font-size="8">1</text>
                                    <text x="66" y="34" fill="white" font-size="8">0,25</text>
                                    <text x="26" y="74" fill="white" font-size="8">0,75</text>
                                    <text x="66" y="74" fill="white" font-size="8">0</text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Conclusión -->
        <section class="bg-yellow-50 rounded-xl shadow-lg p-6 text-center">
            <h2 class="text-3xl font-bold text-yellow-600 mb-4">¡En Resumen!</h2>
            <p class="text-lg text-gray-700 mb-4">Los números naturales, fracciones y decimales son diferentes formas de representar cantidades. Cada uno tiene su uso dependiendo de lo que queramos contar o medir.</p>
            
            <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="bg-white p-4 rounded-lg shadow">
                    <h3 class="text-xl font-semibold text-blue-600 mb-2">Números Naturales</h3>
                    <p>Para contar elementos completos: 1, 2, 3...</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow">
                    <h3 class="text-xl font-semibold text-green-600 mb-2">Fracciones</h3>
                    <p>Para representar partes de un todo: 1/2, 3/4, 2/5...</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow">
                    <h3 class="text-xl font-semibold text-purple-600 mb-2">Decimales</h3>
                    <p>Para representar números con parte entera y decimal: 0,5; 2,75; 3,14...</p>
                </div>
            </div>
            
            <p class="text-lg font-semibold text-yellow-700">¡Practicar con ejemplos de la vida real hace que las matemáticas sean más divertidas y fáciles de entender!</p>
            
            <svg class="w-32 h-32 mx-auto mt-6 text-yellow-500" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5M14.5,16C13.5,16 12.8,15.3 12.8,14.3C12.8,13.3 14,12.6 14.5,11C15,12.6 16.2,13.2 16.2,14.3C16.2,15.3 15.5,16 14.5,16M15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11Z" />
            </svg>
        </section>
    </div>
</div>`,
    },
    {
      id: 2,
      title: "Lección 2",
      theme: "from-purple-400 to-indigo-500",
      x: 150,
      y: 50,
      content: `<div class="text-center">
            <h1 class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Fase 2: Multiplicaciones básicas
            </h1>
          </div>`,
    },
    {
      id: 3,
      title: "Lección 3",
      theme: "from-pink-400 to-rose-500",
      x: 250,
      y: 50,
      content: `<div class="text-center">
            <h1 class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Fase 3: Problemas con la tabla del 6
            </h1>
          </div>`,
    },
    {
      id: 4,
      title: "Lección 4",
      theme: "from-amber-400 to-orange-500",
      x: 350,
      y: 50,
      content: `<div class="text-center">
            <h1 class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Fase 4: Desafío de velocidad
            </h1>
          </div>`,
    },
    {
      id: 5,
      title: "Lección 5",
      theme: "from-emerald-400 to-teal-500",
      x: 450,
      y: 50,
      content: `<div class="text-center">
            <h1 class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Fase 5: Repaso general
            </h1>
          </div>`,
    },
    {
      id: 6,
      title: "Lección 6",
      theme: "from-blue-400 to-cyan-500",
      x: 50,
      y: 150,
      content: `<div class="text-center">
            <h1 class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Fase 6: Examen final
            </h1>
          </div>`,
    },
    {
      id: 7,
      title: "Lección 7",
      theme: "from-violet-400 to-purple-500",
      x: 150,
      y: 150,
      content: `<div class="text-center">
            <h1 class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Fase 7: Bonus especial
            </h1>
          </div>`,
    },
    {
      id: 8,
      title: "Lección 8",
      theme: "from-rose-400 to-pink-500",
      x: 250,
      y: 150,
      content: `<div class="text-center">
            <h1 class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Fase 8: Reto avanzado
            </h1>
          </div>`,
    },
    {
      id: 9,
      title: "Lección 9",
      theme: "from-orange-400 to-amber-500",
      x: 350,
      y: 150,
      content: `<div class="text-center">
            <h1 class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Fase 9: Juego de memoria
            </h1>
          </div>`,
    },
    {
      id: 10,
      title: "Lección 10",
      theme: "from-teal-400 to-emerald-500",
      x: 450,
      y: 150,
      content: `<div class="text-center">
            <h1 class="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Fase 10: Certificación
            </h1>
          </div>`,
    },
  ];

  useEffect(() => {
    // Inicializar AOS
    AOS.init({
      duration: 800,
      easing: "ease-out-quart",
      once: true,
      disable: window.innerWidth < 768,
    });

    async function cargarUsuarioYEstado() {
      const userId = localStorage.getItem("currentUserId");
      if (userId) {
        const user = await getUserById(userId);
        if (user) {
          setUsuario(user);
          console.log("Usuario cargado:", user);
        } else {
          console.log("No se encontró usuario con ID:", userId);
          localStorage.removeItem("currentUserId");
          navigate("/register");
        }
      }
      const estado = {};
      levels.forEach((level) => {
        const key = `fs1ac${level.id}`;
        estado[level.id] = localStorage.getItem(key) === "completada";
      });
      setCompletadas(estado);
    }

    cargarUsuarioYEstado();
  }, []);

  const estaBloqueada = (id) => {
    if (id === 1) return false;
    return !completadas[id - 1];
  };

  const handleLevelClick = (levelId) => {
    if (!estaBloqueada(levelId)) {
      setSelectedLevel(levelId);
    }
  };

  const renderStars = (levelId) => {
    const porcentaje = parseInt(
      localStorage.getItem(`fs1ac${levelId}p`) || 0,
      10
    );
    const score =
      porcentaje === 100 ? 3 : porcentaje >= 50 ? 2 : porcentaje > 0 ? 1 : 0;

    return Array(3)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="transition-transform hover:scale-125">
          {i < score ? (
            <FaStar className="text-yellow-400 text-xl drop-shadow-lg" />
          ) : (
            <FaStarHalfAlt className="text-gray-200 text-xl" />
          )}
        </div>
      ));
  };

  const ultimoDesbloqueado = Math.max(
    1,
    ...Object.keys(completadas)
      .filter((id) => completadas[id])
      .map((id) => parseInt(id) + 1)
  );

  if (!usuario) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <div className="text-6xl text-purple-500 animate-spin">
          <FaStar />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen landscape:h-screen bg-gradient-to-b from-blue-50 to-indigo-100 relative overflow-hidden flex flex-col"
      style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
    >
      <div
        className="absolute inset-0 w-full h-full object-cover z-0 animate-zoom"
        style={{
          backgroundImage: `url(${lvfondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "zoom 15s infinite alternate",
          filter: "brightness(0.4)",
        }}
      />
      {/* Encabezado */}
      <div className="w-full px-4 py-2 bg-[rgba(255,255,255,0.2)] shadow-lg z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("/lvs")}
            className="bg-white/20 p-3 rounded-full shadow-md transition-transform z-10 hover:scale-110 active:scale-95"
          >
            <IoIosArrowBack className="text-white text-2xl" />
          </button>

          <div className="text-center">
            <h1 className="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              Nivel Fácil
            </h1>
          </div>

          <div className="flex gap-3 z-10">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full shadow-md transition-transform hover:scale-105">
              <FaCoins className="text-yellow-400 text-xl" />
              <span className="text-white font-bold">{usuario.coins}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full shadow-md transition-transform hover:scale-105">
              <FaHeart className="text-red-400 text-xl" />
              <span className="text-white font-bold">{usuario.lives}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor de niveles en grid */}
      <div className="flex-1 overflow-auto mx-4 my-6">
        <div className="grid grid-cols-5 grid-rows-2 gap-6 justify-items-center items-center">
          {levels.map((level) => {
            const bloqueada = estaBloqueada(level.id);
            const esActual = level.id === ultimoDesbloqueado;
            const completada = completadas[level.id];

            return (
              <div
                key={level.id}
                className="flex flex-col items-center"
                data-aos="fade-up"
                data-aos-delay={level.id * 100}
              >
                <button
                  onClick={() => handleLevelClick(level.id)}
                  disabled={bloqueada || completada}
                  className={`w-16 h-16 landscape:w-14 landscape:h-14 rounded-full shadow-xl flex items-center justify-center relative transition-all duration-300
                ${
                  bloqueada
                    ? "bg-gray-300 cursor-not-allowed"
                    : completada
                    ? `bg-gradient-to-br ${level.theme}`
                    : esActual
                    ? "bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse"
                    : "bg-gradient-to-br from-gray-300 to-gray-400"
                }`}
                >
                  {bloqueada ? (
                    <FaLock className="text-white text-xl landscape:text-lg" />
                  ) : completada ? (
                    <>
                      <FaCheckCircle className="text-white text-xl landscape:text-lg" />
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-pulse">
                        <FaStar className="text-yellow-800 text-xs" />
                      </div>
                    </>
                  ) : esActual ? (
                    <div className="animate-pulse">
                      <FaPlay className="text-white text-lg ml-0.5 landscape:text-base" />
                    </div>
                  ) : (
                    <span className="text-white text-lg landscape:text-base">
                      {level.id}
                    </span>
                  )}
                </button>

                {/* Info del nivel */}
                <div
                  className={`mt-2 text-center w-32 mx-auto ${
                    bloqueada ? "opacity-70" : ""
                  }`}
                >
                  <h3
                    className={`font-bold ${
                      bloqueada ? "text-gray-500" : "text-purple-800"
                    } text-sm landscape:text-xs drop-shadow-sm`}
                  >
                    Lección {level.id}
                  </h3>
                  {!bloqueada && (
                    <div className="flex justify-center gap-1 mt-1">
                      {renderStars(level.id)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de nivel */}
      {selectedLevel && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-500/80 to-pink-500/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div
            className="relative rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400"
            data-aos="zoom-in"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-[2px]"></div>

            <div className="relative z-10">
              <button
                onClick={() => setSelectedLevel(null)}
                className="absolute top-3 right-3 px-3 bg-white/30 rounded-full p-1 text-white shadow-md hover:bg-white/40 transition-colors"
              >
                <span className="text-lg">✕</span>
              </button>

              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-white/30 flex items-center justify-center mb-4 shadow-lg animate-pulse">
                  <span className="text-3xl font-bold text-white drop-shadow-md">
                    {selectedLevel}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md">
                  Lección {selectedLevel}
                </h2>

                <div className="flex justify-center gap-2 mb-6">
                  {renderStars(selectedLevel)}
                </div>

                <div className="bg-white/30 rounded-xl p-4 mb-6 backdrop-blur-sm border-2 border-white/40">
                  <p className="text-white font-bold mb-2 text-lg">
                    🎯 Objetivo:
                  </p>
                  <p className="text-white text-md">
                    Mejorar la comprensión y fluidez de las matemáticas a través
                    de estas lecciones.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedLevel(null);
                    navigate(`/leccion/${selectedLevel}`, {
                      state: {
                        content: levels.find((l) => l.id === selectedLevel)
                          ?.content,
                      },
                    });
                  }}
                  className="bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg mt-2 w-full max-w-xs mx-auto
                hover:from-yellow-300 hover:to-amber-400 transition-all transform hover:scale-105 active:scale-95"
                >
                  ¡Comenzar Aventura!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
