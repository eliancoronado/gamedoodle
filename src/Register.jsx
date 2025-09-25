import React, { useState, useEffect } from "react";
import { openDB } from "idb";
import { useNavigate } from "react-router-dom";

/**
 * RegisterUser.jsx
 * - Componente React + Tailwind para registrar un usuario pidiendo solo el nombre.
 * - Usa IndexedDB (idb) para guardar un documento completo de 'usuario' con muchos campos
 *   útiles en un juego multijugador: exp, monedas, vidas, progreso de niveles, inventario, etc.
 *
 * Instalación: npm i idb
 * Uso: <RegisterUser onRegistered={(user) => console.log('Nuevo user', user)} />
 */

// ---------- DB helpers ----------
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

async function saveUser(user) {
  const db = await getDb();
  await db.put(USERS_STORE, user);
  return user;
}

async function getUserById(id) {
  const db = await getDb();
  return db.get(USERS_STORE, id);
}

// ---------- User factory ----------
function createNewUserObject({ name }) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `u_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  const now = new Date().toISOString();

  // Starter inventory example
  const starterInventory = [
    {
      id: "item-coin-pack",
      name: "Small coin pack",
      qty: 1,
      meta: { coins: 50 },
    },
    { id: "item-heal", name: "Health potion", qty: 2, meta: { heal: 20 } },
    {
      id: "item-skin-basic",
      name: "Starter skin",
      qty: 1,
      meta: { rarity: "common" },
    },
  ];

  // Schema completo del usuario (puedes extenderlo según necesidades)
  const user = {
    id,
    name,
    createdAt: now,
    updatedAt: now,

    // Progresión y recursos
    level: 1,
    exp: 0,
    coins: 100, // moneda principal
    lives: 3,
    rank: 1, // posición en ranking global
    // Progreso de niveles / quests
    progress: {
      levels: {
        // ejemplo: 'lvl-1': { completed: true, stars: 3, bestTime: 42 }
      },
      quests: {},
      campaignStage: 0,
    },
    // Online / social
    onlineProfile: {
      lastLogin: now,
      status: "offline",
      friends: [],
      rank: null,
      matchmaking: {
        mmr: 1000,
        preferredRegions: [],
      },
    },
    // Inventario y equipo
    inventory: starterInventory,
    equipment: {
      weapon: null,
      armor: null,
      cosmetic: {
        skin: "starter",
      },
    },
    // Estadísticas y logros
    stats: {
      totalGames: 0,
      wins: 0,
      losses: 0,
      playTimeSeconds: 0,
    },
    achievements: [],

    // Preferencias y configuración
    settings: {
      sound: true,
      music: true,
      notifications: true,
      language: "es",
      theme: "dark",
    },
    eventsLog: [], // { type: 'login', at: ISOString, details: {} }
    matchHistory: [
      // { matchId, result: 'win'|'loss', score, date, details: {} }
    ],

    // Flags/futures
    isBanned: false,
    isGuest: false,
    metadata: {
      device: null,
      signupSource: "local",
    },
  };

  return user;
}

// ---------- React component ----------
export default function RegisterUser() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // opcional: focus automático en input
    const el = document.getElementById("register-name-input");
    if (el) el.focus();
  }, []);

  const validateName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "El nombre es obligatorio";
    if (trimmed.length < 2) return "El nombre debe tener al menos 2 caracteres";
    if (trimmed.length > 24) return "El nombre no puede exceder 24 caracteres";
    // podrías agregar validación de caracteres inválidos aquí
    return "";
  };

  useEffect(() => {
    async function checkUser() {
      const user = await getLoggedInUser();
      if (user) {
        // Redirige directamente al principal si ya hay usuario logueado
        navigate("/main");
      }
    }
    checkUser();
  }, [navigate]);

  // ---------- Check logged user ----------
  async function getLoggedInUser() {
    try {
      const id = localStorage.getItem("currentUserId");
      if (!id) return null;

      const user = await getUserById(id);
      if (user) {
        // actualizar último login
        //user.onlineProfile.lastLogin = new Date().toISOString();
        await saveUser(user);
        return user;
      } else {
        // si no existe en la DB, limpiar localStorage
        localStorage.removeItem("currentUserId");
        return null;
      }
    } catch (err) {
      console.error("Error al verificar usuario logueado:", err);
      return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const v = validateName(name);
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const user = createNewUserObject({ name: name.trim() });

      // agrega un evento inicial al log
      user.eventsLog.push({ type: "signup", at: new Date().toISOString() });

      await saveUser(user);

      // guarda en localStorage para sesión rápida
      try {
        localStorage.setItem("currentUserId", user.id);
      } catch (err) {
        // ignore
      }

      setSuccess("Registro completado. ¡Bienvenido, " + user.name + "!");
      setName("");

      //if (typeof onRegistered === "function") onRegistered(user);
      navigate("/main");
    } catch (err) {
      console.error(err);
      setError("Error al guardar usuario. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md overflow-auto mx-auto mt-8 p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-2">Crear tu cuenta</h2>
      <p className="text-sm text-gray-300 mb-6">
        Sólo necesitamos tu nombre para empezar. Podrás personalizar todo
        después.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-gray-300">Nombre</span>
          <input
            id="register-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre o nickname"
            className="mt-1 block w-full rounded-xl bg-gray-900/60 border border-gray-700 px-4 py-3 placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={24}
            autoComplete="off"
          />
        </label>

        {error && <div className="text-red-400 text-sm">{error}</div>}
        {success && <div className="text-green-300 text-sm">{success}</div>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 font-semibold shadow-md"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>

          <button
            type="button"
            className="text-sm text-gray-300 underline"
            onClick={async () => {
              // crear usuario invitado rápido
              setLoading(true);
              setError("");
              try {
                const guestName = `Guest_${
                  Math.floor(Math.random() * 9000) + 1000
                }`;
                const user = createNewUserObject({ name: guestName });
                user.isGuest = true;
                user.metadata.signupSource = "guest";
                await saveUser(user);
                localStorage.setItem("currentUserId", user.id);
                setSuccess(`Sesión como invitado: ${guestName}`);
                //if (typeof onRegistered === "function") onRegistered(user);
                navigate("/princ");
              } catch (err) {
                console.error(err);
                setError("No se pudo crear sesión invitado");
              } finally {
                setLoading(false);
              }
            }}
          >
            Entrar como invitado
          </button>
        </div>

        <div className="pt-3 text-xs text-gray-400">
          Al crear tu cuenta se guardará en tu navegador usando IndexedDB. Si
          quieres sincronizarla en la nube, añade una integración con tu backend
          más tarde.
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-400">
        <strong>Esquema de usuario guardado:</strong>
        <ul className="list-disc list-inside mt-2 text-xs text-gray-300">
          <li>id, name, createdAt, updatedAt</li>
          <li>level, exp, coins, gems, lives, energy</li>
          <li>progress (levels, quests), inventory, equipment</li>
          <li>onlineProfile (lastLogin, matchmaking), matchHistory</li>
          <li>settings, stats, achievements, eventsLog</li>
        </ul>
      </div>
    </div>
  );
}
