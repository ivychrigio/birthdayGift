// APP.JSX
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import FallingPetals from "./components/FallingPetals";
import Cupcake from "./components/Cupcake";
import useMicrophoneSnuffer from "./hooks/useMicrophoneSnuffer";
import "./App.css";

function App() {
  const [ISCANDLELIT, SETISCANDLELIT] = useState(true);

  const { isListening, startListening } = useMicrophoneSnuffer(() => {
    SETISCANDLELIT(false);
  }, 0.25);

  return (
    <div className="BIRTHDAY-APP">
      <div className="BACKGROUND-3D">
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={30} />
          <ambientLight intensity={ISCANDLELIT ? 1.5 : 1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <Stars radius={100} count={2000} factor={4} fade />

          <Suspense fallback={null}>
            {ISCANDLELIT ? (
              <Cupcake isLit={true} />
            ) : (
              <FallingPetals count={500} />
            )}
          </Suspense>

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <div className="UI-LAYER">
        {ISCANDLELIT ? (
          /* NOME E CONTROLLI UNITI SOTTO MERY */
          <div className="ACTION-AREA">
            <h1 className="NAME-HEADER">MERY.</h1>
            <p className="HINT">
              {isListening ? "FORZA, SOFFIA!" : "ESPRIMI UN DESIDERIO"}
            </p>
            {!isListening && (
              <button className="MAIN-BTN" onClick={startListening}>
                CLICCA PER SOFFIARE 🎤
              </button>
            )}
          </div>
        ) : (
          /* CARD FINALE */
          <div className="CONGRATS-CARD">
            <h2 className="WISH-TITLE">BUON COMPLEANNO!</h2>
            <div
              style={{
                width: "50px",
                height: "6px",
                background: "#FFD700",
                margin: "0 auto 1.5rem",
              }}
            ></div>
            <p
              style={{
                fontWeight: "700",
                color: "#666",
                marginBottom: "0.5rem",
              }}
            >
              IL TUO DESIDERIO È IN VIAGGIO
            </p>
            <h1 className="NAME-FOOTER">MERY</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
