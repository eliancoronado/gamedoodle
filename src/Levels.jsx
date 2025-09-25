import React, { useState, useEffect } from "react";
import lvfacil from "/lvfacil.webp";
import lvmedio from "/lvmedio.webp";
import lvdificil from "/lvdificil.webp";
import lvfondo from "/lvfondo.webp";
import { FaArrowLeft } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Levels = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializar AOS
    AOS.init({
      duration: 800,
      easing: "ease-out-quart",
      once: true,
      disable: window.innerWidth < 768,
    });
  }, []);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  const handleBack = () => {
    setSelectedLevel(null);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-800 landscape:min-h-0 landscape:h-screen">
      <button
        onClick={() => navigate("/princ")}
        className="absolute top-3 left-3 bg-white/20 p-3 rounded-full shadow-md transition-transform z-30 hover:scale-110 active:scale-95"
      >
        <IoIosArrowBack className="text-white text-2xl" />
      </button>
      {/* Fondo con animación de zoom sutil */}
      <div
        className="absolute inset-0 w-full h-full object-cover z-20 animate-zoom"
        style={{
          backgroundImage: `url(${lvfondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "zoom 5s infinite alternate",
        }}
      />

      {/* Overlay oscuro para mejor contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

      {/* Botón de regreso (solo visible cuando un nivel está seleccionado) */}
      {selectedLevel && (
        <button
          className="absolute top-6 left-6 z-50 bg-white bg-opacity-20 text-white p-3 rounded-full backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300"
          onClick={handleBack}
        >
          <FaArrowLeft size={24} />
        </button>
      )}

      {/* Contenido principal */}
      <div className="relative z-20 w-full max-w-6xl px-4 landscape:max-w-7xl">
        {/* Contenedor de niveles - Diseño horizontal */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 landscape:gap-10 landscape:flex-row">
          {/* Nivel Fácil */}
          <div
            className="relative h-64 w-64 md:h-80 md:w-80 landscape:h-72 landscape:w-72 rounded-2xl overflow-hidden cursor-pointer group"
            data-aos="fade-up"
            data-aos-delay="100"
            onClick={() => handleLevelSelect("facil")}
          >
            <img
              src={lvfacil}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Nivel fácil"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <span className="inline-block px-4 py-1 bg-green-500 text-white text-sm font-semibold rounded-full mb-2">
                Fácil
              </span>
              <h3 className="text-white text-xl font-bold">Principiante</h3>
              <p className="text-gray-200 text-sm mt-1">
                Perfecto para empezar
              </p>
            </div>
          </div>

          {/* Nivel Medio */}
          <div
            className="relative h-64 w-64 md:h-80 md:w-80 landscape:h-72 landscape:w-72 rounded-2xl overflow-hidden cursor-pointer group"
            data-aos="fade-up"
            data-aos-delay="200"
            onClick={() => handleLevelSelect("medio")}
          >
            <img
              src={lvmedio}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Nivel medio"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <span className="inline-block px-4 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full mb-2">
                Medio
              </span>
              <h3 className="text-white text-xl font-bold">Intermedio</h3>
              <p className="text-gray-200 text-sm mt-1">Un buen desafío</p>
            </div>
          </div>

          {/* Nivel Difícil */}
          <div
            className="relative h-64 w-64 md:h-80 md:w-80 landscape:h-72 landscape:w-72 rounded-2xl overflow-hidden cursor-pointer group"
            data-aos="fade-up"
            data-aos-delay="300"
            onClick={() => handleLevelSelect("dificil")}
          >
            <img
              src={lvdificil}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Nivel difícil"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <span className="inline-block px-4 py-1 bg-red-500 text-white text-sm font-semibold rounded-full mb-2">
                Difícil
              </span>
              <h3 className="text-white text-xl font-bold">Experto</h3>
              <p className="text-gray-200 text-sm mt-1">Solo para valientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para nivel seleccionado */}
      {selectedLevel && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full relative"
            data-aos="zoom-in"
          >
            <h2 className="text-2xl font-bold mb-4 text-center capitalize">
              Nivel {selectedLevel}
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              {selectedLevel === "facil" &&
                "¡Perfecto para empezar! Este nivel es ideal para principiantes."}
              {selectedLevel === "medio" &&
                "¡Un buen desafío! Este nivel es para quienes ya tienen algo de experiencia."}
              {selectedLevel === "dificil" &&
                "¡Solo para expertos! Prepárate para el desafío máximo."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                onClick={handleBack}
              >
                Volver
              </button>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                Jugar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS para animaciones personalizadas */}
      <style>
        {`
          @keyframes zoom {
            0% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-zoom {
            animation: zoom 15s infinite alternate;
          }
          /* Estilos para modo horizontal */
          @media (orientation: landscape) {
            .landscape\\:min-h-0 {
              min-height: 0;
            }
            .landscape\\:h-screen {
              height: 100vh;
            }
            .landscape\\:max-w-7xl {
              max-width: 80rem;
            }
            .landscape\\:gap-10 {
              gap: 2.5rem;
            }
            .landscape\\:flex-row {
              flex-direction: row;
            }
            .landscape\\:h-72 {
              height: 18rem;
            }
            .landscape\\:w-72 {
              width: 18rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Levels;
