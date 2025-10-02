import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Earth3D } from './visualizer/Earth3D';

type ThreatLevel = 'SAFE' | 'WARNING' | 'CRITICAL';

interface DynamicBackgroundProps {
  threatLevel: ThreatLevel;
}

export const DynamicBackground = ({ threatLevel }: DynamicBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize stars
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.5,
        });
      }
    }

    let targetColor = { r: 0, g: 0, b: 0 };
    let currentColor = { r: 0, g: 0, b: 0 };
    let nebulaPulse = 0;
    let asteroidPosition = -100;

    // Set target colors based on threat level
    switch (threatLevel) {
      case 'SAFE':
        targetColor = { r: 0, g: 0, b: 20 }; // Calm deep space
        break;
      case 'WARNING':
        targetColor = { r: 20, g: 0, b: 0 }; // Dim red nebula
        break;
      case 'CRITICAL':
        targetColor = { r: 40, g: 0, b: 0 }; // Dark red overlay
        break;
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      // Smooth color transition
      currentColor.r += (targetColor.r - currentColor.r) * 0.02;
      currentColor.g += (targetColor.g - currentColor.g) * 0.02;
      currentColor.b += (targetColor.b - currentColor.b) * 0.02;

      // Clear canvas with background color
      ctx.fillStyle = `rgb(${Math.floor(currentColor.r)}, ${Math.floor(currentColor.g)}, ${Math.floor(currentColor.b)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      starsRef.current.forEach((star) => {
        // Update star position
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // Add trembling effect for WARNING state
        let trembleX = 0;
        let trembleY = 0;
        if (threatLevel === 'WARNING' || threatLevel === 'CRITICAL') {
          trembleX = (Math.random() - 0.5) * 2;
          trembleY = (Math.random() - 0.5) * 2;
        }

        // Draw star
        ctx.fillStyle = `rgba(255, 255, 200, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x + trembleX, star.y + trembleY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add nebula glow for WARNING
      if (threatLevel === 'WARNING') {
        nebulaPulse += 0.02;
        const glowIntensity = Math.sin(nebulaPulse) * 0.1 + 0.15;
        
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, `rgba(255, 50, 50, ${glowIntensity})`);
        gradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Add asteroid sprite for CRITICAL
      if (threatLevel === 'CRITICAL') {
        asteroidPosition += 8;
        if (asteroidPosition > canvas.width + 100) {
          asteroidPosition = -100;
        }

        // Draw asteroid
        ctx.save();
        ctx.translate(asteroidPosition, canvas.height * 0.3);
        ctx.rotate(asteroidPosition * 0.01);
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        // Add trail
        const trailGradient = ctx.createLinearGradient(-60, 0, 0, 0);
        trailGradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
        trailGradient.addColorStop(1, 'rgba(255, 215, 0, 0.8)');
        ctx.fillStyle = trailGradient;
        ctx.fillRect(-60, -3, 60, 6);
        
        ctx.restore();

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [threatLevel]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{ background: '#000' }}
      />
      <div className="fixed inset-0 -z-5 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Earth3D threatLevel={threatLevel} />
        </Canvas>
      </div>
      <div className="fixed inset-0 -z-8 pointer-events-none scanline-overlay"></div>
    </>
  );
};
