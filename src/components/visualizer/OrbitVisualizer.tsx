import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Stars, Ring } from "@react-three/drei";
import * as THREE from "three";

// Story state type
interface StoryState {
  act: number;
  scene: number;
  outcome?: string;
  dataPoint?: {
    type: string;
    value: string;
  };
}

interface OrbitVisualizerProps {
  storyState: StoryState;
  timeScale?: number;
}

// Enhanced Earth with realistic appearance
const Earth = ({ storyState }: { storyState: StoryState }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const nightRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0018;
      cloudsRef.current.rotation.x = Math.sin(time * 0.1) * 0.02;
    }
    if (nightRef.current) {
      nightRef.current.rotation.y += 0.0015;
    }
    if (atmosphereRef.current) {
      // Subtle atmospheric shimmer
      atmosphereRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.01);
    }
  });

  const showImpactZone = storyState.act === 2;

  return (
    <group position={[0, 0, 0]}>
      {/* Main Earth sphere with better material */}
      <Sphere ref={meshRef} args={[2, 128, 128]}>
        <meshPhysicalMaterial 
          color="#2A5CAA"
          metalness={0.4}
          roughness={0.7}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          emissive="#001133"
          emissiveIntensity={0.15}
        />
      </Sphere>
      
      {/* Continents overlay */}
      <Sphere args={[2.01, 128, 128]}>
        <meshPhysicalMaterial 
          color="#3A7F3A"
          metalness={0.2}
          roughness={0.9}
          transparent
          opacity={0.4}
        />
      </Sphere>
      
      {/* Cloud layer with better appearance */}
      <Sphere ref={cloudsRef} args={[2.03, 64, 64]}>
        <meshPhysicalMaterial 
          color="#FFFFFF"
          transparent
          opacity={0.25}
          roughness={1}
          metalness={0}
          emissive="#FFFFFF"
          emissiveIntensity={0.05}
        />
      </Sphere>
      
      {/* City lights on night side */}
      <Sphere ref={nightRef} args={[2.02, 64, 64]}>
        <meshBasicMaterial 
          color="#FFA500"
          transparent
          opacity={0.15}
        />
      </Sphere>
      
      {/* Atmosphere with gradient */}
      <Sphere ref={atmosphereRef} args={[2.15, 64, 64]}>
        <meshPhysicalMaterial 
          color="#6BA6E3"
          transparent
          opacity={0.2}
          roughness={1}
          metalness={0}
          side={THREE.BackSide}
          emissive="#4A90E2"
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {/* Outer atmosphere glow */}
      <Sphere args={[2.25, 32, 32]}>
        <meshBasicMaterial 
          color="#87CEEB"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Impact warning zone with pulse effect */}
      {showImpactZone && (
        <group>
          <Ring args={[2.3, 2.5, 32]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshBasicMaterial 
              color="#FF0000"
              transparent
              opacity={0.3 + Math.sin(Date.now() * 0.003) * 0.2}
              side={THREE.DoubleSide}
            />
          </Ring>
          <Sphere args={[2.35, 32, 32]}>
            <meshBasicMaterial 
              color="#FF4500"
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </Sphere>
        </group>
      )}
    </group>
  );
};

// Enhanced Asteroid with realistic rocky appearance
const Asteroid = ({ storyState }: { storyState: StoryState }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const debrisRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);

  // Asteroid properties based on story state
  const asteroidData = useMemo(() => {
    // Act 1: Initial detection - normal asteroid
    if (storyState.act === 1) {
      return {
        size: 0.4,
        color: "#8B7355",
        emissive: "#8B4513",
        safe: false,
        glowColor: "#CD853F",
        speed: 0.008,
      };
    }
    
    // Act 2: Confirmed threat - red danger
    if (storyState.act === 2) {
      return {
        size: 0.45,
        color: "#A0522D",
        emissive: "#FF4500",
        safe: false,
        glowColor: "#FF6347",
        speed: 0.012,
      };
    }
    
    // Act 3: Mission planning - orange warning
    if (storyState.act === 3) {
      return {
        size: 0.42,
        color: "#8B7355",
        emissive: "#FF8C00",
        safe: false,
        glowColor: "#FFA500",
        speed: 0.01,
      };
    }
    
    // Act 4: Active deflection mission
    if (storyState.act === 4) {
      if (storyState.outcome === "kinetic_choice") {
        return {
          size: 0.4,
          color: "#8B7355",
          emissive: "#FFA500",
          safe: false,
          glowColor: "#FFB347",
          speed: 0.009,
        };
      } else if (storyState.outcome === "gravity_choice") {
        return {
          size: 0.4,
          color: "#8B7355",
          emissive: "#9370DB",
          safe: false,
          glowColor: "#B19CD9",
          speed: 0.009,
        };
      } else if (storyState.outcome === "nuclear_choice") {
        return {
          size: 0.35,
          color: "#8B7355",
          emissive: "#FFD700",
          safe: false,
          glowColor: "#FFED4E",
          speed: 0.009,
        };
      }
      // Default for act 4
      return {
        size: 0.4,
        color: "#8B7355",
        emissive: "#4169E1",
        safe: false,
        glowColor: "#87CEEB",
        speed: 0.009,
      };
    }

    // Act 5: Success - green safe
    if (storyState.act === 5) {
      return {
        size: 0.38,
        color: "#556B2F",
        emissive: "#00FF00",
        safe: true,
        glowColor: "#90EE90",
        speed: 0.006,
      };
    }

    // Default fallback
    return {
      size: 0.4,
      color: "#8B7355",
      emissive: "#FF4500",
      safe: false,
      glowColor: "#FF6347",
      speed: 0.008,
    };
  }, [storyState.act, storyState.outcome]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      // Complex rotation for realism - speed varies by act
      meshRef.current.rotation.y += asteroidData.speed;
      meshRef.current.rotation.x += asteroidData.speed * 0.4;
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
      
      // Subtle scale animation
      const scale = 1 + Math.sin(time * 1.5) * 0.03;
      meshRef.current.scale.setScalar(scale);
    }
    
    if (debrisRef.current) {
      // Rotate debris field
      debrisRef.current.rotation.y += 0.002;
      debrisRef.current.rotation.z += 0.001;
    }
    
    if (glowRef.current) {
      // Pulsing danger glow
      const intensity = 1.2 + Math.sin(time * 2) * 0.3;
      glowRef.current.scale.setScalar(intensity);
    }
    
    // Shockwave effect for Act 4
    if (shockwaveRef.current && storyState.act === 4) {
      const wave = (time * 2) % 3;
      shockwaveRef.current.scale.setScalar(1 + wave * 0.3);
      shockwaveRef.current.material.opacity = 0.4 * (1 - wave / 3);
    }
  });

  // Create asteroid geometry with irregular shape
  const asteroidGeometry = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(asteroidData.size, 2);
    const positions = geometry.attributes.position.array;
    
    // Add irregularity to make it look more realistic
    for (let i = 0; i < positions.length; i += 3) {
      const noise = (Math.random() - 0.5) * 0.08;
      positions[i] *= (1 + noise);
      positions[i + 1] *= (1 + noise);
      positions[i + 2] *= (1 + noise);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, [asteroidData.size]);

  return (
    <group position={[7.5, 0, 0]}>
      {/* Main asteroid body */}
      <mesh ref={meshRef} geometry={asteroidGeometry}>
        <meshPhysicalMaterial 
          color={asteroidData.color}
          roughness={0.95}
          metalness={0.3}
          emissive={asteroidData.emissive}
          emissiveIntensity={asteroidData.safe ? 0.2 : 0.4}
          clearcoat={0.1}
          clearcoatRoughness={0.9}
        />
      </mesh>
      
      {/* Small debris particles */}
      <group ref={debrisRef}>
        {[...Array(8)].map((_, i) => (
          <Sphere 
            key={i} 
            args={[0.02, 8, 8]} 
            position={[
              Math.sin(i * Math.PI / 4) * 0.6,
              Math.cos(i * Math.PI / 4) * 0.3,
              (Math.random() - 0.5) * 0.4
            ]}
          >
            <meshPhysicalMaterial 
              color="#696969"
              roughness={1}
              metalness={0.2}
            />
          </Sphere>
        ))}
      </group>
      
      {/* Danger/energy glow */}
      <Sphere ref={glowRef} args={[asteroidData.size * 1.2, 16, 16]}>
        <meshBasicMaterial 
          color={asteroidData.glowColor}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Shockwave effect for Act 4 */}
      {storyState.act === 4 && (
        <Sphere ref={shockwaveRef} args={[asteroidData.size * 1.5, 16, 16]}>
          <meshBasicMaterial 
            color={asteroidData.glowColor}
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Approach vector */}
      <Line
        points={[
          [0, 0, 0],
          [-5, 0, 0]
        ]}
        color={asteroidData.safe ? "#00FF00" : "#FF4500"}
        lineWidth={1.5}
        transparent
        opacity={0.5}
        dashed
        dashSize={0.4}
        gapSize={0.2}
      />
      
      {/* Heat trail effect */}
      {!asteroidData.safe && (
        <group>
          {[...Array(5)].map((_, i) => (
            <Sphere 
              key={`trail-${i}`}
              args={[0.05 - i * 0.008, 8, 8]} 
              position={[0.5 + i * 0.3, 0, 0]}
            >
              <meshBasicMaterial 
                color="#FF6347"
                transparent
                opacity={0.3 - i * 0.05}
              />
            </Sphere>
          ))}
        </group>
      )}
    </group>
  );
};

// Enhanced spacecraft with better design
const DeflectionCraft = ({ storyState }: { storyState: StoryState }) => {
  const meshRef = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current && storyState.act >= 3) {
      const time = state.clock.elapsedTime;
      
      // Orbit between Earth and asteroid
      meshRef.current.position.x = 4 + Math.cos(time * 0.5) * 0.3;
      meshRef.current.position.y = Math.sin(time * 1.5) * 0.4;
      meshRef.current.position.z = Math.cos(time * 1.5) * 0.4;
      
      meshRef.current.rotation.y += 0.02;
      
      if (engineRef.current) {
        // Engine glow pulse
        const intensity = 0.5 + Math.sin(time * 5) * 0.3;
        engineRef.current.scale.setScalar(intensity);
      }
    }
  });

  if (storyState.act < 3) return null;

  const craftColor = storyState.outcome === "kinetic_choice" ? "#E91E63" :
                     storyState.outcome === "gravity_choice" ? "#00BCD4" :
                     "#FFC107";

  return (
    <group ref={meshRef}>
      {/* Main body */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
        <meshPhysicalMaterial 
          color="#C0C0C0"
          metalness={0.9}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Solar panels */}
      <mesh position={[0.2, 0, 0]}>
        <boxGeometry args={[0.3, 0.01, 0.15]} />
        <meshPhysicalMaterial 
          color="#1E3A8A"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.3, 0.01, 0.15]} />
        <meshPhysicalMaterial 
          color="#1E3A8A"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Engine glow */}
      <Sphere ref={engineRef} args={[0.1, 12, 12]} position={[0, -0.2, 0]}>
        <meshBasicMaterial 
          color={craftColor}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Engine trail particles */}
      <group ref={trailRef}>
        {[...Array(4)].map((_, i) => (
          <Sphere 
            key={`trail-${i}`}
            args={[0.04 - i * 0.008, 8, 8]} 
            position={[0, -0.25 - i * 0.1, 0]}
          >
            <meshBasicMaterial 
              color={craftColor}
              transparent
              opacity={0.4 - i * 0.08}
            />
          </Sphere>
        ))}
      </group>
    </group>
  );
};

// Orbital path visualization
const OrbitalPath = ({ storyState }: { storyState: StoryState }) => {
  const pathRef = useRef<THREE.Line>(null);
  
  useFrame((state) => {
    if (pathRef.current) {
      pathRef.current.rotation.z += 0.0002;
    }
  });
  
  const asteroidPath = useMemo(() => {
    const points = [];
    const radius = 7.5;
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * 0.2,
        Math.sin(angle) * radius
      ));
    }
    return points;
  }, []);
  
  if (storyState.act < 2) return null;
  
  return (
    <Line
      ref={pathRef}
      points={asteroidPath}
      color={storyState.act >= 5 ? "#00FF00" : "#FF6347"}
      lineWidth={1}
      transparent
      opacity={0.3}
      dashed
      dashSize={0.3}
      gapSize={0.15}
    />
  );
};

// Enhanced space environment
const SpaceEnvironment = () => {
  const nebulaRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z += 0.0001;
    }
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.00005;
    }
  });
  
  return (
    <>
      {/* Deep space nebula effect */}
      <mesh ref={nebulaRef} position={[0, 0, -30]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          color="#0F0350"
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Distant galaxy clusters */}
      <group ref={starsRef}>
        <mesh position={[20, 10, -25]}>
          <circleGeometry args={[2, 32]} />
          <meshBasicMaterial 
            color="#FFB6C1"
            transparent
            opacity={0.15}
          />
        </mesh>
        
        <mesh position={[-25, -5, -20]}>
          <circleGeometry args={[1.5, 32]} />
          <meshBasicMaterial 
            color="#E6E6FA"
            transparent
            opacity={0.1}
          />
        </mesh>
        
        <mesh position={[15, -15, -28]}>
          <circleGeometry args={[1.8, 32]} />
          <meshBasicMaterial 
            color="#B0E0E6"
            transparent
            opacity={0.12}
          />
        </mesh>
      </group>
    </>
  );
};

// Main visualizer component
export const OrbitVisualizer = ({ storyState }: OrbitVisualizerProps) => {
  const statusText = useMemo(() => {
    const texts = {
      1: "🔍 TRACKING: NEAR-EARTH OBJECT",
      2: "⚠️ IMPACT TRAJECTORY CONFIRMED",
      3: "📋 DEFLECTION STRATEGY READY",
      4: "🚀 INTERCEPT MISSION ACTIVE",
      5: "✅ THREAT NEUTRALIZED"
    };
    return texts[storyState.act as keyof typeof texts] || "SYSTEM INITIALIZING...";
  }, [storyState.act]);

  const threatLevel = storyState.act <= 2 ? "CRITICAL" : 
                      storyState.act <= 4 ? "HIGH" : "SAFE";

  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-gray-950 via-blue-950/20 to-black relative rounded-xl overflow-hidden shadow-2xl border-2 border-blue-400/60">
      <Canvas camera={{ position: [0, 2, 12], fov: 55 }}>
        <color attach="background" args={["#020307"]} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.15} color="#B0C4DE" />
        <directionalLight position={[15, 10, 5]} intensity={0.9} color="#FFFFFF" castShadow />
        <pointLight position={[-10, -5, -10]} intensity={0.3} color="#4A90E2" />
        <pointLight position={[7.5, 0, 0]} intensity={0.4} color="#FF6347" />
        <spotLight 
          position={[0, 5, 0]} 
          angle={0.3} 
          penumbra={0.5} 
          intensity={0.2} 
          color="#FFFFFF"
          target-position={[0, 0, 0]}
        />
        
        {/* Space environment */}
        <SpaceEnvironment />
        <Stars radius={80} depth={60} count={3000} factor={4} saturation={0.1} fade speed={0.5} />
        
        {/* Main objects */}
        <Earth storyState={storyState} />
        <Asteroid storyState={storyState} />
        <DeflectionCraft storyState={storyState} />
        <OrbitalPath storyState={storyState} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={6}
          maxDistance={20}
          target={[3.5, 0, 0]}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.7}
        />
        
        {/* Fog for depth */}
        <fog attach="fog" color="#020307" near={15} far={50} />
      </Canvas>
      
      {/* Clean HUD Interface */}
      <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none">
        <div className="flex justify-between items-start">
          {/* Status panel */}
          <div className="bg-black/70 backdrop-blur-md border border-blue-500/40 rounded-lg p-4 shadow-xl pointer-events-auto">
            <div className="text-blue-400 text-xs font-bold tracking-wider mb-2 opacity-80">
              MISSION STATUS
            </div>
            <div className="text-white text-sm font-semibold">
              {statusText}
            </div>
            {storyState.dataPoint && (
              <div className="text-cyan-300 text-xs mt-2 opacity-90">
                {storyState.dataPoint.value}
              </div>
            )}
          </div>
          
          {/* Distance and threat */}
          <div className="space-y-3 pointer-events-auto">
            <div className="bg-black/70 backdrop-blur-md border border-orange-500/40 rounded-lg px-4 py-3 shadow-xl">
              <div className="text-orange-400 text-xs font-bold tracking-wider mb-1 opacity-80">
                DISTANCE
              </div>
              <div className="text-white text-lg font-bold font-mono">
                {storyState.act === 1 ? "2.4M km" :
                 storyState.act === 2 ? "1.2M km" :
                 storyState.act === 3 ? "600k km" :
                 storyState.act === 4 ? "300k km" :
                 "SAFE"}
              </div>
            </div>
            
            <div className={`bg-black/70 backdrop-blur-md border rounded-lg px-4 py-3 shadow-xl ${
              threatLevel === "CRITICAL" ? "border-red-500/60" :
              threatLevel === "HIGH" ? "border-yellow-500/60" :
              "border-green-500/60"
            }`}>
              <div className={`text-xs font-bold tracking-wider mb-1 opacity-80 ${
                threatLevel === 'CRITICAL' ? 'text-red-400' :
                threatLevel === 'HIGH' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                THREAT
              </div>
              <div className={`text-sm font-bold ${
                threatLevel === "CRITICAL" ? "text-red-500" :
                threatLevel === "HIGH" ? "text-yellow-500" :
                "text-green-500"
              }`}>
                {threatLevel}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end pointer-events-none">
        <div className="flex gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
            <span>Earth</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
            <span>Asteroid</span>
          </div>
          {storyState.act >= 3 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
              <span>Interceptor</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          Mouse: Rotate • Scroll: Zoom
        </div>
      </div>
    </div>
  );
};

// Demo component with cleaner UI
export default function StoryOrbitDemo() {
  const [currentStory, setCurrentStory] = useState<StoryState>({
    act: 1,
    scene: 1,
    dataPoint: {
      type: "detection",
      value: "Size: 520m • Speed: 28 km/s"
    }
  });

  const scenarios = [
    { act: 1, label: "Detection", icon: "🔍", color: "from-blue-500 to-blue-700" },
    { act: 2, label: "Analysis", icon: "📊", color: "from-amber-500 to-orange-600" },
    { act: 3, label: "Planning", icon: "📋", color: "from-purple-500 to-purple-700" },
    { act: 4, label: "Intercept", icon: "🚀", color: "from-red-500 to-red-700", outcome: "kinetic_choice" },
    { act: 5, label: "Success", icon: "✅", color: "from-green-500 to-green-700", outcome: "end_phoenix" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/10 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-8 text-center">
          Asteroid Defense System
        </h1>
        
        <OrbitVisualizer storyState={currentStory} />
        
        {/* Scenario selector */}
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          {scenarios.map((scenario) => (
            <button
              key={scenario.act}
              onClick={() => setCurrentStory({ 
                act: scenario.act, 
                scene: 1, 
                outcome: scenario.outcome,
                dataPoint: {
                  type: "info",
                  value: `Act ${scenario.act} initialized`
                }
              })}
              className={`px-5 py-3 bg-gradient-to-r ${scenario.color} text-white rounded-xl 
                         font-semibold text-sm hover:scale-105 transform transition-all duration-200 
                         shadow-lg hover:shadow-xl ${currentStory.act === scenario.act ? 
                         'ring-2 ring-white/50 scale-105' : ''}`}
            >
              <span className="mr-2">{scenario.icon}</span>
              {scenario.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}