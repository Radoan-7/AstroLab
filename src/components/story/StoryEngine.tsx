import { useState, useEffect } from "react";
import { StoryNode, Choice, GameState } from "@/types/story";
import { DialogueBox } from "./DialogueBox";
import { ChoiceButton } from "./ChoiceButton";
import { DataPanel } from "./DataPanel";
import { TimelineReport } from "./TimelineReport";
import { AIOracle } from "./AIOracle";
import storyData from "@/data/story.json";
import { toast } from "sonner";
import { soundManager } from "@/lib/sounds";
import { fetchAsteroidData } from "@/api/nasa";

interface StoryEngineProps {
  onThreatLevelChange?: (level: 'SAFE' | 'WARNING' | 'CRITICAL') => void;
  onSceneChange?: (act: number, scene: number) => void;
  onStoryStateChange?: (state: {
    act: number;
    scene: number;
    outcome?: string;
    dataPoint?: {
      type: string;
      value: string;
    };
  }) => void;
}

export const StoryEngine = ({ onThreatLevelChange, onStoryStateChange }: StoryEngineProps) => {
  const [gameState, setGameState] = useState<GameState>({
    currentAct: 1,
    currentScene: 1,
    choiceHistory: [],
    unlockedPaths: [],
    dataCollected: {},
  });

  const [showDialogue, setShowDialogue] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    loadStoryNode(gameState.currentAct, gameState.currentScene);
    
    // Update threat level based on act
    if (onThreatLevelChange) {
      if (gameState.currentAct === 1) {
        onThreatLevelChange('WARNING');
      } else if (gameState.currentAct >= 3) {
        onThreatLevelChange('CRITICAL');
      } else {
        onThreatLevelChange('WARNING');
      }
    }
  }, [gameState.currentAct, gameState.currentScene]);

  // Fetch real NASA data on mount
  useEffect(() => {
    fetchAsteroidData().then(data => {
      console.log('NASA Asteroid Data:', data);
      // You can integrate this into the story or data panel
    });
  }, []);

  const loadStoryNode = (act: number, scene: number) => {
    const node = storyData.acts.find(
      (n) => n.act === act && n.scene === scene
    ) as StoryNode | undefined;

    if (node) {
      setCurrentNode(node);
      setShowDialogue(true);
      setShowChoices(false);

      // Play new act sound
      if (scene === 1) {
        soundManager.play('newAct');
        soundManager.playNarration(`act${act}`);
      }

      // Play impact warning for critical acts
      if (act >= 3) {
        soundManager.play('impactWarning');
      }

      if (node.dataPoint) {
        setGameState((prev) => ({
          ...prev,
          dataCollected: {
            ...prev.dataCollected,
            [node.dataPoint!.type]: node.dataPoint!.value,
          },
        }));
      }

      // Update story state for visualizer
      if (onStoryStateChange) {
        onStoryStateChange({
          act,
          scene,
          outcome: gameState.choiceHistory[gameState.choiceHistory.length - 1],
          dataPoint: node.dataPoint,
        });
      }
    } else {
      console.error(`Story node not found: Act ${act}, Scene ${scene}`);
    }
  };

  const handleDialogueComplete = () => {
    setShowDialogue(false);
    setShowChoices(true);
  };

  const handleChoiceSelect = (choice: Choice) => {
    soundManager.play('choiceSelect');
    toast.success(`Choice recorded: ${choice.outcome}`);

    setGameState((prev) => ({
      ...prev,
      choiceHistory: [...prev.choiceHistory, choice.outcome],
      currentAct: choice.nextAct,
      currentScene: choice.nextScene || 1,
    }));

    // Update story state immediately after choice
    if (onStoryStateChange) {
      onStoryStateChange({
        act: choice.nextAct,
        scene: choice.nextScene || 1,
        outcome: choice.outcome,
        dataPoint: currentNode?.dataPoint,
      });
    }

    // Check if this is an ending
    if (choice.outcome.startsWith("end_")) {
      const pathKey = choice.outcome.replace("end_", "") + "_path";
      setGameState((prev) => ({
        ...prev,
        unlockedPaths: [...new Set([...prev.unlockedPaths, pathKey])],
      }));
      setGameEnded(true);
    }

    setShowChoices(false);
  };

  const handleReplay = () => {
    setGameState({
      currentAct: 1,
      currentScene: 1,
      choiceHistory: [],
      unlockedPaths: gameState.unlockedPaths,
      dataCollected: {},
    });
    setGameEnded(false);
    setShowDialogue(true);
    setShowChoices(false);
    toast.info("Starting new playthrough...");

    // Reset visualizer to initial state
    if (onStoryStateChange) {
      onStoryStateChange({
        act: 1,
        scene: 1,
      });
    }
  };

  if (gameEnded) {
    return <TimelineReport gameState={gameState} onReplay={handleReplay} />;
  }

  if (!currentNode) {
    return (
      <div className="text-center py-20">
        <div className="pixel-text text-primary animate-pulse">LOADING MISSION DATA...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto scanlines">
      <div className="mb-4 text-right">
        <span className="text-xs pixel-text text-muted-foreground">
          ACT {gameState.currentAct} - SCENE {gameState.currentScene}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentNode.dataPoint && <DataPanel dataPoint={currentNode.dataPoint} />}

          {showDialogue && (
            <DialogueBox
              character={currentNode.character}
              dialogue={currentNode.dialogue}
              onComplete={handleDialogueComplete}
            />
          )}

          {showChoices && (
            <div className="space-y-3 animate-slide-in">
              {currentNode.choices.map((choice, index) => (
                <ChoiceButton
                  key={index}
                  choice={choice}
                  index={index}
                  onSelect={handleChoiceSelect}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <AIOracle currentAct={gameState.currentAct} />
        </div>
      </div>
    </div>
  );
};