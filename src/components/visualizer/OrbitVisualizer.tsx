import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

const Asteroid = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 3;
      meshRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.3, 16, 16]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#FFD700" roughness={0.8} metalness={0.2} />
    </Sphere>
  );
};

const Earth = () => {
  return (
    <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#4169E1" roughness={0.6} />
    </Sphere>
  );
};

export const OrbitVisualizer = () => {
  return (
    <div className="w-full h-[400px] border-2 border-primary glow-border bg-card">
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
        <Earth />
        <Asteroid />
        <OrbitControls enableZoom={true} enablePan={false} />
        <gridHelper args={[10, 10, "#FFD700", "#333"]} />
      </Canvas>
      <div className="text-center mt-2 text-xs pixel-text text-muted-foreground">
        ※ PLACEHOLDER VISUALIZATION - INTEGRATE REAL ORBITAL DATA
      </div>
    </div>
  );
};
