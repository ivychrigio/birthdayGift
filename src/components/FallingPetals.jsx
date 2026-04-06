import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FallingPetals({ count = 500 }) {
  // Aumentato il numero
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const colors = [
    "#FF0055",
    "#00FFCC",
    "#FFFF00",
    "#FF9900",
    "#9900FF",
    "#00CCFF",
  ];

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 25, // Più larghi
        y: Math.random() * 30 - 10, // Distribuiti meglio all'inizio
        z: (Math.random() - 0.5) * 15,
        speed: Math.random() * 0.06 + 0.03,
        rot: Math.random() * Math.PI,
        color: new THREE.Color(
          colors[Math.floor(Math.random() * colors.length)],
        ),
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((p, i) => {
      p.y -= p.speed;
      p.rot += 0.02;

      // Reset quando spariscono in basso
      if (p.y < -20) p.y = 20;

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rot, p.rot * 0.5, p.rot);
      dummy.scale.setScalar(0.18);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, p.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial side={THREE.DoubleSide} transparent />
    </instancedMesh>
  );
}
