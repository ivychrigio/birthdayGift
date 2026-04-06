import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
// Rimuovi PointLight da qui
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function Cupcake({ isLit }) {
  const flameRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (isLit && flameRef.current) {
      flameRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 4) * 0.1;

      const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      flameRef.current.scale.set(scale, scale * 1.2, scale);

      // La luce ora viene gestita correttamente tramite il ref del tag minuscolo
      if (lightRef.current) {
        lightRef.current.intensity =
          1.5 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
      }
    }
  });

  return (
    <group position={[0, -1.5, 0]} scale={1.5}>
      {/* Base Pirottino - Giallo ocra */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.4, 0.6, 32]} />
        <meshStandardMaterial color="#643006" roughness={0.8} />
      </mesh>

      {/* Muffin (La pasta) - Vaniglia/Biscotto */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#e8b10c" roughness={0.6} />
      </mesh>

      {/* Glassa (Top) - Rosa Fragola Pastello */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f48fb1" roughness={0.4} />
      </mesh>

      {/* Candela - Oro bianco */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 16]} />
        <meshStandardMaterial color="#b53cf1" metalness={0.3} />
      </mesh>

      {/* LA FIAMMA */}
      {isLit && (
        <group position={[0, 1.45, 0]} ref={flameRef}>
          {/* CORREZIONE: Usa <pointLight /> in minuscolo, senza importarlo */}
          <pointLight
            ref={lightRef}
            color="#ff9800"
            intensity={2}
            distance={5}
            decay={2}
            castShadow
          />

          <Float speed={5} rotationIntensity={0.1} floatIntensity={0.2}>
            <mesh>
              <coneGeometry args={[0.12, 0.3, 16]} />
              <MeshDistortMaterial
                color="#5aad0c"
                emissive="#e75004"
                emissiveIntensity={1.5}
                distort={0.4}
                speed={4}
                transparent
                opacity={0.9}
              />
            </mesh>
          </Float>
        </group>
      )}
    </group>
  );
}
