import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import MainScreen from "./mainscreen.jsx";
import MScreen from "./MScreen.jsx";
import RegisterUser from "./Register.jsx";
import Levels from "./Levels.jsx";
import LvFacil from "./lvls/LvFacil.jsx";
import LeccionF1 from "./lvls/LeccionF1.jsx";
import ShopScreen from "./pagesm/Tienda.jsx";
import LuckyWheelScreen from "./pagesm/Ruleta.jsx";
import GameScreen from "./pagesm/Game.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<RegisterUser />} />
        <Route path="/main" element={<MainScreen />} />
        <Route path="/princ" element={<MScreen />} />
        <Route
          path="/tienda"
          element={<ShopScreen />}
        />
        <Route
          path="/ruleta"
          element={<LuckyWheelScreen />}
        />
        <Route
          path="/game"
          element={<GameScreen />}
        />
      </Routes>
    </Router>
  </StrictMode>
);
