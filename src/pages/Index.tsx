import { useState } from "react";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { StoryEngine } from "@/components/story/StoryEngine";
import { SandboxMode } from "@/components/sandbox/SandboxMode";
import { OrbitVisualizer } from "@/components/visualizer/OrbitVisualizer";
import { DynamicBackground } from "@/components/DynamicBackground";

const Index = () => {
  const [mode, setMode] = useState<"story" | "sandbox">("story");
  const [threatLevel, setThreatLevel] = useState<'SAFE' | 'WARNING' | 'CRITICAL'>('SAFE');

  return (
    <div className="min-h-screen scanlines p-6 relative">
      <DynamicBackground threatLevel={mode === "story" ? threatLevel : 'SAFE'} />
      
      <div className="relative z-10">
        <NavigationBar currentMode={mode} onModeChange={setMode} />

        <main className="max-w-6xl mx-auto flex flex-col gap-6">
          {mode === "story" ? (
            <StoryEngine onThreatLevelChange={setThreatLevel} />
          ) : (
            <SandboxMode />
          )}

          {/* Oracle / OrbitVisualizer below all main content */}
          <div className="mt-6">
            <OrbitVisualizer />
          </div>
        </main>

        <footer className="text-center mt-12 text-xs pixel-text text-muted-foreground">
          <p>POWERED BY NASA NEO API + USGS DATA</p>
          <p className="mt-2">
            REAL NASA DATA INTEGRATED • USGS APIs READY • SEE /src/api/
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
