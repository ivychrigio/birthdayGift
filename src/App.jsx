import { useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import FallingPetals from "./components/FallingPetals";
import Cupcake from "./components/Cupcake";
import useMicrophoneSnuffer from "./hooks/useMicrophoneSnuffer";
import "./App.css";

const name_brtDate = [
  { name: "CICCI", birthDate: "1996-03-10" },
  { name: "MERY", birthDate: "1970-04-08" },
  { name: "AMIO", birthDate: "1996-05-05" },
  { name: "AGGHIGHI", birthDate: "1970-06-21" },
  { name: "ROBERTINA", birthDate: "1995-06-15" },
  { name: "PRINCIPESSA", birthDate: "1995-09-19" },
  { name: "HONNY", birthDate: "1971-10-24" },
  { name: "MY BRO", birthDate: "1996-12-01" },
];

function App() {
  const [ISCANDLELIT, SETISCANDLELIT] = useState(true);

  // Logica per trovare il festeggiato del giorno
  const currentBirthdayName = useMemo(() => {
    const today = new Date();
    const monthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const match = name_brtDate.find((user) =>
      user.birthDate.includes(monthDay),
    );
    return match ? match.name : "ANONIMOUS"; // Fallback se non trova nessuno
  }, []);

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
          <div className="ACTION-AREA">
            <h1 className="NAME-HEADER">{currentBirthdayName}</h1>
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
            <h1 className="NAME-FOOTER">{currentBirthdayName}</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
