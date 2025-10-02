import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const SandboxMode = () => {
  const [asteroidSize, setAsteroidSize] = useState(780);
  const [velocity, setVelocity] = useState(25.3);
  const [deflectionTime, setDeflectionTime] = useState(6);

  const handleSimulate = () => {
    toast.success("Running impact simulation...");
    // This would trigger visualizations and calculations
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="dialogue-box p-8 mb-6">
        <h2 className="text-2xl font-bold pixel-text glow-primary mb-6">
          IMPACT SIMULATOR
        </h2>
        <p className="text-sm pixel-text text-muted-foreground mb-8">
          ADJUST PARAMETERS AND RUN CUSTOM SIMULATIONS
        </p>

        <div className="space-y-8">
          <div>
            <label className="block text-sm pixel-text text-primary mb-3">
              ASTEROID DIAMETER: {asteroidSize} METERS
            </label>
            <Slider
              value={[asteroidSize]}
              onValueChange={(value) => setAsteroidSize(value[0])}
              min={100}
              max={2000}
              step={10}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm pixel-text text-primary mb-3">
              VELOCITY: {velocity.toFixed(1)} KM/S
            </label>
            <Slider
              value={[velocity]}
              onValueChange={(value) => setVelocity(value[0])}
              min={10}
              max={50}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm pixel-text text-primary mb-3">
              DEFLECTION TIME: {deflectionTime} MONTHS
            </label>
            <Slider
              value={[deflectionTime]}
              onValueChange={(value) => setDeflectionTime(value[0])}
              min={1}
              max={12}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={handleSimulate} className="pixel-button pulse-glow">
            ▶ RUN SIMULATION
          </button>
        </div>
      </div>

      <div className="border-2 border-accent bg-card p-6 glow-border">
        <h3 className="text-accent font-bold pixel-text mb-4">SIMULATION RESULTS</h3>
        <div className="space-y-3 text-sm pixel-text">
          <div className="flex justify-between">
            <span className="text-muted-foreground">IMPACT ENERGY:</span>
            <span className="text-foreground">2.1 × 10²⁰ JOULES</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CRATER DIAMETER:</span>
            <span className="text-foreground">12.4 KM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">SEISMIC MAGNITUDE:</span>
            <span className="text-foreground">8.5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">DEFLECTION SUCCESS:</span>
            <span className="text-accent">78%</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pixel-text mt-4 text-center">
          ※ PLACEHOLDER DATA - INTEGRATE NASA/USGS APIS FOR REAL CALCULATIONS
        </p>
      </div>
    </div>
  );
};
