import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logomain.png";
import AOS from "aos";
import "aos/dist/aos.css";
import logoSound from "/logosound.mp3";

const App = () => {
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setStarted(true);

    // Inicializar AOS
    AOS.init({ once: true });

    // Reproducir sonido
    const audio = new Audio(logoSound);
    audio.volume = 0;
    audio.play().then(() => {
      let vol = 0;
      const fadeIn = setInterval(() => {
        if (vol < 0.7) {
          vol += 0.05;
          audio.volume = vol;
        } else {
          clearInterval(fadeIn);
        }
      }, 300);
    });

    // Navegar después de 7s (logo + texto)
    setTimeout(() => {
      navigate("/main");
    }, 7000);
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-black">
      {!started ? (
        <button
          onClick={handleStart}
          className="px-8 py-4 text-xl font-bold rounded-2xl 
                     bg-gradient-to-r from-purple-500 to-indigo-600 
                     text-white shadow-lg hover:scale-105 transform 
                     transition duration-300"
        >
          Comenzar el Viaje
        </button>
      ) : (
        <>
          <img
            src={logo}
            alt="Logo"
            className="h-[80%]"
            data-aos="zoom-in-up"
            data-aos-duration="2500"
            data-aos-easing="ease-out-cubic"
          />

          {/* Texto SIZAE */}
          <h1
            className="absolute bottom-20 left-[52%] -translate-x-1/2 z-10 text-5xl font-extrabold text-white tracking-widest"
            data-aos="fade-up"
            data-aos-delay="2000" // aparece después de que termine el logo
            data-aos-duration="2000"
            data-aos-easing="ease-out-cubic"
          >
            SIZAE
          </h1>
        </>
      )}
    </div>
  );
};

export default App;
