import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface Earth3DProps {
  threatLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
}

export const Earth3D = ({ threatLevel }: Earth3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const getGlowColor = () => {
    switch (threatLevel) {
      case 'CRITICAL': return '#ff0000';
      case 'WARNING': return '#ffaa00';
      default: return '#00ffff';
    }
  };

  const glowIntensity = useMemo(() => {
    switch (threatLevel) {
      case 'CRITICAL': return 1.5;
      case 'WARNING': return 1.0;
      default: return 0.5;
    }
  }, [threatLevel]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 1;
      glowRef.current.scale.setScalar(1.05 + pulse * 0.05);
    }
  });

  const pixelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const pixelSize = 4;
    for (let y = 0; y < canvas.height; y += pixelSize) {
      for (let x = 0; x < canvas.width; x += pixelSize) {
        const lat = (y / canvas.height) * Math.PI;
        const lon = (x / canvas.width) * Math.PI * 2;

        const isLand = Math.sin(lat * 3) * Math.cos(lon * 2) > 0.1;
        const isOcean = !isLand;

        if (isOcean) {
          ctx.fillStyle = `rgb(0, ${100 + Math.random() * 50}, ${150 + Math.random() * 50})`;
        } else {
          ctx.fillStyle = `rgb(${50 + Math.random() * 50}, ${100 + Math.random() * 50}, 50)`;
        }

        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    return texture;
  }, []);

  return (
    <group>
      <Sphere ref={meshRef} args={[2, 32, 32]}>
        <meshStandardMaterial
          map={pixelTexture}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      <Sphere ref={glowRef} args={[2.1, 32, 32]}>
        <meshBasicMaterial
          color={getGlowColor()}
          transparent
          opacity={0.2 * glowIntensity}
          side={THREE.BackSide}
        />
      </Sphere>

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#4444ff" />
    </group>
  );
};
