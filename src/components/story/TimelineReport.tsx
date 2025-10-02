import { useEffect, useState } from "react";
import { GameState } from "@/types/story";
import storyData from "@/data/story.json";
import { soundManager } from "@/lib/sounds";
import { Badge } from "@/components/ui/badge";

interface TimelineReportProps {
  gameState: GameState;
  onReplay: () => void;
}

const generateOracleFinalPrediction = () => {
  const predictions = [
    "ORACLE PREDICTION: 78% SUCCESS RATE - OUTCOME MATCHED",
    "ORACLE PREDICTION: 82% ACCURACY - MISSION PROFILE OPTIMAL",
    "ORACLE PREDICTION: 91% CONFIDENCE - DEFLECTION SUCCESSFUL",
    "ORACLE PREDICTION: 73% PROBABILITY - EARTH IMPACT AVERTED",
  ];
  return predictions[Math.floor(Math.random() * predictions.length)];
};

export const TimelineReport = ({ gameState, onReplay }: TimelineReportProps) => {
  const lastChoice = gameState.choiceHistory[gameState.choiceHistory.length - 1];
  const pathInfo = lastChoice ? storyData.paths[lastChoice as keyof typeof storyData.paths] : null;
  const [oraclePrediction] = useState(generateOracleFinalPrediction());

  useEffect(() => {
    soundManager.play('badgeUnlock');
  }, []);

  return (
    <div className="max-w-2xl mx-auto animate-slide-in scanlines">
      <div className="dialogue-box p-8 mb-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-scale-in">{pathInfo?.badge}</div>
          <h2 className="text-3xl font-bold pixel-text glow-primary mb-2">
            {pathInfo?.name || "MISSION COMPLETE"}
          </h2>
          <p className="text-muted-foreground pixel-text text-sm">
            {pathInfo?.description || "Your journey has ended."}
          </p>
        </div>

        <div className="border-t-2 border-primary pt-6 mb-6">
          <h3 className="text-primary font-bold pixel-text mb-4">MISSION DATA</h3>
          <div className="space-y-3">
            {Object.entries(gameState.dataCollected).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm pixel-text">
                <span className="text-muted-foreground">{key.toUpperCase()}:</span>
                <span className="text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-primary pt-6 mb-6">
          <h3 className="text-primary font-bold pixel-text mb-4">DECISION TIMELINE</h3>
          <div className="space-y-2">
            {gameState.choiceHistory.map((choice, index) => (
              <div key={index} className="text-sm pixel-text text-muted-foreground">
                <span className="text-secondary">▸</span> {choice.replace(/_/g, " ").toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-cyan-500 pt-6 mb-6 bg-cyan-950/20 p-4 rounded">
          <h3 className="text-cyan-400 font-bold pixel-text mb-3 flex items-center gap-2">
            <span className="animate-pulse">◆</span> AI ORACLE ANALYSIS
          </h3>
          <p className="text-sm pixel-text text-cyan-200">
            {oraclePrediction}
          </p>
          <Badge className="mt-3 bg-green-600 pixel-text">VERIFIED</Badge>
        </div>

        <div className="text-center">
          <button
            onClick={onReplay}
            onMouseEnter={() => soundManager.play('buttonHover')}
            className="pixel-button text-sm pulse-glow"
          >
            ◄ REPLAY TO UNLOCK ANOTHER PATH
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground pixel-text">
        PATHS UNLOCKED: {gameState.unlockedPaths.length} / 3
      </div>
    </div>
  );
};
