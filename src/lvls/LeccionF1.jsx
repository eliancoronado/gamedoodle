import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoIosArrowBack } from "react-icons/io";

const LeccionF1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    // Simular carga para la animación
    const timer = setTimeout(() => {
      setContent(location.state?.content || "");
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 to-purple-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-y-auto flex justify-center items-center bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-4">
      <div
        className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="w-full h-full min-h-full overflow-auto" dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* Botón flotante para regresar */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 bg-white/20 text-white p-3 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all z-10"
        data-aos="fade-right"
      >
        <IoIosArrowBack className="text-white text-2xl" />
      </button>
    </div>
  );
};

export default LeccionF1;
