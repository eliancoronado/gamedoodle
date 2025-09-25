import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import fondo from "/fondo.png";
import perfil from "/perfil.webp";
import bronce1 from "/bronce1.webp";
import pvp from "/pvp.png";
import {
  FaClipboardList,
  FaCoins,
  FaGamepad,
  FaHeart,
  FaSteamSymbol,
  FaX,
  FaCrown,
  FaFire,
  FaStar,
  FaCheck,
  FaStore,
} from "react-icons/fa6";
import { MdOutlineEvent } from "react-icons/md";
import { GiCarWheel } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";
import { BsCreditCard2BackFill } from "react-icons/bs";
import { useLoader, Canvas } from "@react-three/fiber";
import { MTLLoader, OBJLoader } from "three-stdlib";
import { FBXLoader } from "three-stdlib";
import { useAnimations, OrbitControls } from "@react-three/drei";
import AOS from "aos";
import "aos/dist/aos.css";

//"mongodb+srv://cuentaparaelian12:hf9HEYDTsUy6YHPc@cluster0.citmxdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

import { openDB } from "idb";
import { useNavigate } from "react-router-dom";

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

const gameModes = [
  {
    id: 1,
    name: "Duelo de Mentes",
    description: "Enfréntate a otros jugadores en batallas de conocimiento",
    image: pvp, // Asegúrate de importar la imagen
    isNew: true,
    isPopular: false,
    comingSoon: false,
  },
  {
    id: 2,
    name: "Supervivencia",
    description: "Responde la mayor cantidad de preguntas sin cometer errores",
    image: pvp, // Importar esta imagen
    isNew: false,
    isPopular: true,
    comingSoon: true,
  },
  {
    id: 3,
    name: "Contrarreloj",
    description: "Responde tantas preguntas como puedas en tiempo limitado",
    image: pvp, // Importar esta imagen
    isNew: false,
    isPopular: false,
    comingSoon: true,
  },
];

const actions = [
  { id: 1, label: "Bailar", value: "Dance" },
  { id: 2, label: "Reír", value: "Laugh" },
  { id: 3, label: "Saludar", value: "Wave" },
  { id: 4, label: "Enojado", value: "Angry" },
  { id: 5, label: "Sentarse", value: "Sit" },
];

export function Character({ trigger }) {
  const model = useLoader(FBXLoader, "/snoopy/Breathing Idle.fbx");

  // Cargar solo las animaciones adicionales
  const idleAnim = useLoader(FBXLoader, "/snoopy/Breathing Idle.fbx");
  const danceAnim = useLoader(FBXLoader, "/snoopy/Dance1.fbx");

  // Extraer los AnimationClips
  const allAnimations = [...idleAnim.animations, ...danceAnim.animations];

  const { actions, mixer } = useAnimations(allAnimations, model);
  const currentAction = useRef(null);

  const idleName = idleAnim.animations[0]?.name; // "Breathing Idle"
  const danceName = danceAnim.animations[0]?.name; // "Dance"

  useEffect(() => {
    if (actions && idleName) {
      currentAction.current = actions[idleName];
      currentAction.current.reset().fadeIn(0.5).play();
    }
  }, [actions, idleName]);

  useEffect(() => {
    if (!trigger || !actions) return;

    const animName = trigger === "Dance" ? danceName : trigger;

    if (actions[animName]) {
      if (currentAction.current) {
        currentAction.current.fadeOut(0.3);
      }

      const newAction = actions[animName];
      newAction.reset().fadeIn(0.3).play();

      // 👇 Aquí desactivamos el bucle
      newAction.setLoop(THREE.LoopOnce, 1);
      newAction.clampWhenFinished = true;
      currentAction.current = newAction;

      const onFinished = () => {
        newAction.fadeOut(0.3);
        actions[idleName].reset().fadeIn(0.3).play();
        currentAction.current = actions[idleName];
      };

      mixer.addEventListener("finished", onFinished);

      return () => {
        mixer.removeEventListener("finished", onFinished);
      };
    }
  }, [trigger, actions, mixer, idleName, danceName]);

  return <primitive object={model} scale={0.01} position={[0, -1, 0]} />;
}

const MScreen = () => {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [user, setUser] = useState(null);
  const [trigger, setTrigger] = useState(null);
  const navigate = useNavigate();
  const [showWheel, setShowWheel] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800, // duración de la animación
      once: true, // solo se anima una vez
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    // Intentar cargar el usuario actual desde localStorage
    const loadCurrentUser = async () => {
      const userId = localStorage.getItem("currentUserId");
      if (userId) {
        const user = await getUserById(userId);
        if (user) {
          setUser(user);
          console.log("Usuario cargado:", user);
        } else {
          console.log("No se encontró usuario con ID:", userId);
        }
      }
    };
    loadCurrentUser();
  }, []);

  const toggleWheel = () => setShowWheel((prev) => !prev);

  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black text-white">
        <h1 className="text-2xl">Cargando usuario...</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center items-center relative overflow-hidden">
      <img
        src={fondo}
        alt=""
        className="absolute inset-0 object-cover object-center animate-zoom z-10"
      />

      <div className="absolute top-0 left-2 w-auto h-10 bg-[rgba(0,0,0,0.5)] z-20 pr-6 text-white flex items-center">
        <div className="h-full rounded overflow-hidden">
          <img src={perfil} className="h-full" />
        </div>
        <div className="flex items-center gap-3 w-24 h-full relative rounded pl-2 pr-1 bg-black">
          <h1
            className="text-xs font-bold"
            style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
          >
            {user.name}
          </h1>
          <div className="w-full h-1 bg-black absolute bottom-0 left-0">
            <div
              className="bg-white h-full"
              style={{ width: `${user.exp / 100}%` }}
            ></div>
          </div>
        </div>
        <div className="px-2 text-sm h-full flex items-center bg-black">
          <img src={bronce1} className="h-3/6" />
        </div>
        <div className="h-full ml-4 flex items-center gap-3">
          <FaCoins className="text-amber-500 text-[13px]" />
          <span
            className="text-sm font-normal text-white"
            style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
          >
            {user.coins}
          </span>
        </div>
        <div className="h-full ml-4 flex items-center gap-3">
          <FaHeart className="text-red-500 text-[13px]" />
          <span
            className="text-sm font-normal text-white"
            style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
          >
            {user.lives}
          </span>
        </div>
        <div className="h-full ml-6 flex items-center gap-3">
          <BsCreditCard2BackFill className="text-white text-[18px]" />
        </div>
      </div>

      <div
        className="absolute bottom-0 right-0 w-auto py-2 z-20 px-4 hite items-cente text-black font-bold cursor-pointer hover:from-amber-400 hover:to-orange-600 transition flex flex-col"
        style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.1rem" }}
        
      >
        <div className="pt-2 w-full bg-[rgba(255,255,255,0.7)] rounded-full px-4 flex justify-center">
          {selectedMode ? (
            <span className="text-sm" onClick={() => setIsSelectMode(true)}>Modo: {selectedMode.name}</span>
          ) : (
            <span className="text-sm" onClick={() => setIsSelectMode(true)}>Seleccionar Modo</span>
          )}
        </div>
        <span className="flex items-center justify-center bg-gradient-to-r rounded-3xl from-amber-300 text-[20px] to-orange-500 w-full" onClick={() => navigate("/game")}>
          Comenzar
        </span>
      </div>

      <div className="absolute top-0 right-2 w-auto h-8 bg-[rgba(0,0,0,0.3)] z-20 px-4 hite flex items-center">
        <div className="h-full flex items-center gap-3 mr-4">
          <HiUsers className="text-white text-[15px]" />
        </div>
        <div className="h-full flex items-center gap-3">
          <IoSettingsSharp className="text-white text-[13px]" />
        </div>
      </div>

      <div className="absolute bottom-1/2 left-2 translate-y-1/2 z-20 text-white text-center flex flex-col gap-1">
        <div
          className="bg-[rgba(0,0,0,0.5)] py-3 px-6 flex items-center gap-3 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
          onClick={() => navigate("/tienda")}
        >
          <FaStore className="text-white text-xl" />
          Tienda
        </div>
        <div
          className="bg-[rgba(0,0,0,0.5)] py-3 px-6 flex items-center gap-3 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
          onClick={() => navigate("/ruleta")}
        >
          <GiCarWheel className="text-white text-xl" />
          Ruletas
        </div>
        <div
          className="bg-[rgba(0,0,0,0.5)] py-3 px-6 flex items-center gap-3 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
        >
          <FaClipboardList className="text-white text-xl" />
          Logros
        </div>
        <div
          className="bg-[rgba(0,0,0,0.5)] py-3 px-6 flex items-center gap-3 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
        >
          <MdOutlineEvent className="text-white text-xl" />
          Eventos
        </div>
      </div>

      <div className="absolute bottom-1/2 right-2 translate-y-1/2 z-20 text-white text-center flex flex-col gap-1 bg-[rgba(0,0,0,0.5)] p-1 rounded-xl max-h-[250px] overflow-y-auto">
        <div
          className="bg-[rgba(0,0,0,0.5)] py-2 px-2 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition flex-col text-xs font-medium"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
        >
          <img src={perfil} className="w-12 h-12 rounded-[8px]" />
          Amigo
        </div>
        <div
          className="bg-[rgba(0,0,0,0.5)] py-2 px-2 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition flex-col text-xs font-medium"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
        >
          <img src={perfil} className="w-12 h-12 rounded-[8px]" />
          Amigo
        </div>
        <div
          className="bg-[rgba(0,0,0,0.5)] py-2 px-2 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition flex-col text-xs font-medium"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
        >
          <img src={perfil} className="w-12 h-12 rounded-[8px]" />
          Amigo
        </div>
        <div
          className="bg-[rgba(0,0,0,0.5)] py-2 px-2 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition flex-col text-xs font-medium"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
        >
          <img src={perfil} className="w-12 h-12 rounded-[8px]" />
          Amigo
        </div>
        <div
          className="bg-[rgba(0,0,0,0.5)] py-2 px-2 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition flex-col text-xs font-medium"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
        >
          <img src={perfil} className="w-12 h-12 rounded-[8px]" />
          Amigo
        </div>
        <div
          className="bg-[rgba(0,0,0,0.5)] py-2 px-2 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition flex-col text-xs font-medium"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
        >
          <img src={perfil} className="w-12 h-12 rounded-[8px]" />
          Amigo
        </div>
        <div
          className="bg-[rgba(0,0,0,0.5)] py-2 px-2 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition flex-col text-xs font-medium"
          style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
        >
          <img src={perfil} className="w-12 h-12 rounded-[8px]" />
          Amigo
        </div>
      </div>

      {/* === MODELO 3D === */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-[400px] h-[400px]"
        onClick={toggleWheel}
      >
        <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 2]} intensity={1} />
          <Character trigger={trigger} />
          <OrbitControls
            enableZoom={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
      {/* === RULETA DE EMOTES === */}
      <AnimatePresence>
        {showWheel && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-[120px] left-1/2 -translate-x-1/2 z-30 w-[250px] h-[250px] rounded-full"
          >
            {actions.map((action, i) => {
              const angle = (i / actions.length) * 2 * Math.PI;
              const x = 100 * Math.cos(angle);
              const y = 100 * Math.sin(angle);
              return (
                <motion.button
                  key={action.id}
                  onClick={() => {
                    setTrigger(action.value);
                    setShowWheel(false);
                  }}
                  className="absolute w-14 h-14 rounded-full bg-orange-500 text-white text-sm font-bold shadow-lg hover:bg-orange-600 flex items-center justify-center"
                  style={{
                    left: `calc(50% + ${x}px - 28px)`,
                    top: `calc(50% + ${y}px - 28px)`,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {action.label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {isSelectMode && (
        <GameModeModal
          isOpen={isSelectMode}
          onClose={() => setIsSelectMode(false)}
          gameModes={gameModes}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
        />
      )}
    </div>
  );
};

const GameModeModal = ({
  isOpen,
  onClose,
  gameModes,
  selectedMode,
  setSelectedMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      data-aos="fade-in"
      className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/80 to-indigo-900/90 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        data-aos="zoom-in"
        data-aos-delay="100"
        className="relative w-full max-w-5xl h-5/6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Marco decorativo */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl transform rotate-2 scale-105 -z-10"></div>
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl transform -rotate-1 scale-105 -z-20"></div>

        <div className="h-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-y-auto flex flex-col p-6">
          <h2
            data-aos="fade-up"
            className="text-3xl font-bold text-white text-center mb-8"
            style={{ fontFamily: "Jua, sans-serif" }}
          >
            Selecciona un Modo de Juego
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameModes.map((mode, index) => (
              <GameModeCard
                key={mode.id}
                mode={mode}
                index={index}
                isSelected={selectedMode?.id === mode.id}
                onSelect={() => setSelectedMode(mode)}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={!selectedMode}
            >
              <FaGamepad className="mr-2" />
              {selectedMode
                ? `Jugar ${selectedMode.name}`
                : "Selecciona un modo"}
            </button>
          </div>
        </div>

        {/* Botón de cerrar */}
        <button
          data-aos="zoom-in"
          data-aos-delay="200"
          className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10"
          onClick={onClose}
        >
          <FaX />
        </button>
      </div>
    </div>
  );
};

// Tarjeta individual para cada modo de juego
const GameModeCard = ({ mode, index, isSelected, onSelect }) => {
  return (
    <div
      className={`relative h-80 group perspective cursor-pointer ${
        mode.comingSoon ? "opacity-70" : ""
      }`}
      onClick={!mode.comingSoon ? onSelect : undefined}
    >
      <div
        className={`relative w-full h-full preserve-3d transition-all duration-500 rounded-2xl overflow-hidden border-2 shadow-xl ${
          isSelected
            ? "border-cyan-400 shadow-cyan-500/30"
            : "border-white/20 hover:border-cyan-300/50"
        } ${mode.comingSoon ? "border-dashed" : ""}`}
      >
        {/* Imagen de fondo */}
        <img
          src={mode.image}
          className="h-full w-full object-cover"
          alt={mode.name}
        />

        {/* Overlay de gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {mode.isNew && (
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform -rotate-6">
              ¡NUEVO!
            </div>
          )}
          {mode.isPopular && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-6 flex items-center gap-1">
              <FaFire /> POPULAR
            </div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="absolute bottom-0 w-full p-5 text-white">
          <h3
            className="text-2xl font-bold mb-2 tracking-wide"
            style={{
              fontFamily: "Jua, sans-serif",
              letterSpacing: "0.08rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
            }}
          >
            {mode.name}
            {isSelected && (
              <span className="ml-2 text-cyan-400 inline-block">
                <FaStar />
              </span>
            )}
          </h3>

          <p className="text-sm mb-4">{mode.description}</p>

          {mode.comingSoon ? (
            <div className="text-center py-2 bg-black/40 rounded-lg">
              <span className="text-cyan-300 flex items-center justify-center gap-1">
                <FaCrown /> Próximamente
              </span>
            </div>
          ) : (
            <button
              className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 ${
                isSelected
                  ? "bg-cyan-600 hover:bg-cyan-700"
                  : "bg-purple-600 hover:bg-purple-700"
              } transition-colors`}
              onClick={onSelect}
            >
              {isSelected ? "Seleccionado" : "Seleccionar"}
              {isSelected && <FaCheck />}
            </button>
          )}
        </div>

        {/* Efecto de selección */}
        {isSelected && (
          <div
            data-aos="fade-in"
            className="absolute inset-0 border-4 border-cyan-400 rounded-2xl pointer-events-none"
            style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
          />
        )}
      </div>
    </div>
  );
};

export default MScreen;
