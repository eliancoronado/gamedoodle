import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { openDB } from "idb";
import {
  FaCoins,
  FaHeart,
  FaTimes,
  FaShoppingCart,
  FaFire,
  FaCrown,
  FaGem,
  FaStar,
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

const packages = [
  {
    id: 1,
    hearts: 3,
    price: 50,
    name: "Paquete Básico",
    description: "Perfecto para empezar tu aventura",
    rarity: "common",
    icon: FaHeart,
  },
  {
    id: 2,
    hearts: 10,
    price: 150,
    name: "Paquete Épico",
    description: "Ideal para jugadores avanzados",
    rarity: "epic",
    icon: FaFire,
  },
  {
    id: 3,
    hearts: 25,
    price: 300,
    name: "Paquete Legendario",
    description: "Para los verdaderos campeones",
    rarity: "legendary",
    icon: FaCrown,
  },
  {
    id: 4,
    hearts: 50,
    price: 500,
    name: "Paquete Diamante",
    description: "Máximo poder y prestigio",
    rarity: "mythic",
    icon: FaGem,
  },
];

const rarityStyles = {
  common: "border-gray-400 bg-gradient-to-br from-gray-600 to-gray-800",
  epic: "border-purple-400 bg-gradient-to-br from-purple-600 to-purple-900",
  legendary:
    "border-yellow-400 bg-gradient-to-br from-yellow-600 to-orange-700",
  mythic: "border-pink-400 bg-gradient-to-br from-pink-600 to-red-800",
};

export default function ShopScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(packages[0]);
  const [user, setUser] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

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

  const handlePurchase = async ({ hearts, price }) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      coins: user.coins - price,
      lives: user.lives + hearts,
    };

    try {
      await updateUserInDB(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al realizar la compra. Intenta nuevamente.");
    }
  };

  const handleBuy = async () => {
    if (!selected) return;
    if (user.coins < selected.price) {
      alert("No tienes suficientes monedas 💰");
      return;
    }

    setIsPurchasing(true);
    try {
      await handlePurchase({
        hearts: selected.hearts,
        price: selected.price,
      });

      setTimeout(() => {
        setIsPurchasing(false);
        alert(`¡Compra exitosa! Obtuviste ${selected.hearts} corazones ❤️`);
      }, 1000);
    } catch (error) {
      setIsPurchasing(false);
      alert("Error al procesar la compra. Intenta nuevamente.");
    }
  };

  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center" data-aos="zoom-in">
          <FaStar className="text-6xl text-yellow-400 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl text-white font-bold">Cargando tienda...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col landscape:flex-row text-white overflow-hidden">
      {/* Header con información del usuario y botón cerrar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-gradient-to-r from-black/80 to-transparent">
        <div className="flex items-center space-x-4" data-aos="fade-right">
          <div className="flex items-center bg-black/50 px-3 py-2 rounded-lg border border-yellow-500">
            <FaCoins className="text-yellow-400 mr-2" />
            <span className="font-bold">{user.coins}</span>
          </div>
          <div className="flex items-center bg-black/50 px-3 py-2 rounded-lg border border-red-500">
            <FaHeart className="text-red-500 mr-2" />
            <span className="font-bold">{user.lives}</span>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-transform hover:scale-110"
          data-aos="fade-left"
        >
          <FaTimes className="text-white" />
        </button>
      </div>

      {/* Sección izquierda - Lista de paquetes */}
      <div className="flex-1 landscape:w-2/5 p-6 pt-20 landscape:pt-6 overflow-y-auto">
        <h2
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
          data-aos="fade-down"
        >
          TIENDA DE CORAZONES
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {packages.map((pack, index) => (
            <div
              key={pack.id}
              onClick={() => setSelected(pack)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                selected?.id === pack.id
                  ? "scale-105 shadow-2xl ring-4 ring-yellow-400"
                  : "hover:shadow-lg"
              } ${rarityStyles[pack.rarity]}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <pack.icon
                    className={`text-2xl mr-3 ${
                      pack.rarity === "common"
                        ? "text-gray-300"
                        : pack.rarity === "epic"
                        ? "text-purple-300"
                        : pack.rarity === "legendary"
                        ? "text-yellow-300"
                        : "text-pink-300"
                    }`}
                  />
                  <div>
                    <h3 className="font-bold text-lg">{pack.name}</h3>
                    <p className="text-sm opacity-80">{pack.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <FaHeart className="text-red-500 mr-1" />
                    <span className="font-bold text-lg">+{pack.hearts}</span>
                  </div>
                  <div className="flex items-center justify-end mt-1">
                    <FaCoins className="text-yellow-400 mr-1" />
                    <span className="font-bold">{pack.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección derecha - Vista previa */}
      <div className="flex-1 overflow-y-auto landscape:w-3/5 bg-gradient-to-br from-gray-800 to-black border-l border-gray-700 p-8 landscape:pt-20 flex flex-col justify-center items-center relative">
        {selected && (
          <div className="text-center w-full max-w-md" data-aos="zoom-in">
            {/* Icono del paquete */}
            <div
              className={`mb-6 p-8 rounded-full inline-flex items-center justify-center ${
                selected.rarity === "common"
                  ? "bg-gradient-to-br from-gray-600 to-gray-800"
                  : selected.rarity === "epic"
                  ? "bg-gradient-to-br from-purple-600 to-purple-900"
                  : selected.rarity === "legendary"
                  ? "bg-gradient-to-br from-yellow-600 to-orange-700"
                  : "bg-gradient-to-br from-pink-600 to-red-800"
              }`}
            >
              <selected.icon
                className={`text-6xl ${
                  selected.rarity === "common"
                    ? "text-gray-300"
                    : selected.rarity === "epic"
                    ? "text-purple-300"
                    : selected.rarity === "legendary"
                    ? "text-yellow-300"
                    : "text-pink-300"
                }`}
              />
            </div>

            {/* Nombre y descripción */}
            <h3
              className={`text-4xl font-bold mb-4 ${
                selected.rarity === "common"
                  ? "text-gray-300"
                  : selected.rarity === "epic"
                  ? "text-purple-300"
                  : selected.rarity === "legendary"
                  ? "text-yellow-300"
                  : "text-pink-300"
              }`}
            >
              {selected.name}
            </h3>

            <p className="text-gray-300 text-lg mb-6">{selected.description}</p>

            {/* Estadísticas */}
            <div className="bg-black/50 rounded-xl p-6 mb-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Corazones incluidos:</span>
                <div className="flex items-center">
                  <FaHeart className="text-red-500 mr-2" />
                  <span className="font-bold text-xl">+{selected.hearts}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Precio:</span>
                <div className="flex items-center">
                  <FaCoins className="text-yellow-400 mr-2" />
                  <span className="font-bold text-xl">{selected.price}</span>
                </div>
              </div>
            </div>

            {/* Botón de compra */}
            <button
              disabled={user.coins < selected.price || isPurchasing}
              onClick={handleBuy}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                user.coins < selected.price
                  ? "bg-gray-600 cursor-not-allowed"
                  : isPurchasing
                  ? "bg-green-600 animate-pulse"
                  : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              }`}
            >
              {isPurchasing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  PROCESANDO...
                </div>
              ) : user.coins < selected.price ? (
                "MONEDAS INSUFICIENTES"
              ) : (
                <div className="flex items-center justify-center">
                  <FaShoppingCart className="mr-2" />
                  COMPRAR AHORA
                </div>
              )}
            </button>

            {/* Saldo después de la compra */}
            {user.coins >= selected.price && (
              <div className="mt-4 text-sm text-gray-400">
                Saldo después de la compra:{" "}
                <span className="text-yellow-400 font-bold">
                  {user.coins - selected.price}
                </span>{" "}
                monedas
              </div>
            )}
          </div>
        )}
      </div>

      {/* Efectos de partículas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
