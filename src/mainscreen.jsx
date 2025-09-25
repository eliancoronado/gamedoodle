import React, { use, useEffect, useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import screenmainvideo from "/video1.mp4"; // tu video de fondo
import backgroundMusic from "/audiomain.mp3"; // tu audio aparte
import { useNavigate } from "react-router-dom";


const MainScreen = () => {
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const navigate = useNavigate();


  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center relative">
      {/* Video de fondo */}
      <video
        src={screenmainvideo}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover object-center animate-zoom"
      />
      <div
        className="absolute left-10 top-7 bg-opacity-50 text-white p-4 drop-shadow-2xl text-5xl font-bold"
        style={{ fontFamily: "Jua, sans-serif", letterSpacing: "0.06rem" }}
      >
        Doodle
      </div>

      {/* Botones */}
      <div className="absolute right-20 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
        <button
          className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition duration-300"
          onClick={() => navigate("/princ")}
        >
          Comenzar
        </button>

        <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl shadow-lg hover:from-green-500 hover:to-emerald-700 transform hover:scale-105 transition duration-300">
          Opciones
        </button>

        <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl shadow-lg hover:from-pink-600 hover:to-red-600 transform hover:scale-105 transition duration-300">
          Créditos
        </button>
      </div>

      {/* Control de audio */}
      <button
        onClick={toggleAudio}
        className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 transition"
      >
        {isAudioPlaying ? (
          <FaVolumeUp className="text-xl text-black" />
        ) : (
          <FaVolumeMute className="text-xl text-black" />
        )}
      </button>
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-52 h-52 rounded-full z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)",
        }}
      ></div>

      <div className="absolute bottom-1 left-1 text-gray-100 font-medium text-[9px]">
        Sizae Studio All rights Reserved (2025)
      </div>

      {/* Audio aparte */}
      <audio
        ref={audioRef}
        src={backgroundMusic}
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        }}
      />
    </div>
  );
};

export default MainScreen;
