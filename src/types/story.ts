export interface Choice {
  text: string;
  outcome: string;
  nextAct: number;
  nextScene?: number;
}

export interface StoryNode {
  act: number;
  scene: number;
  character: Character;
  dialogue: string[];
  choices: Choice[];
  dataPoint?: {
    type: 'asteroid' | 'earthquake' | 'tsunami' | 'crater';
    value: string;
  };
}

export type Character = 'watcher' | 'seeker' | 'defender' | 'narrator';

export interface CharacterInfo {
  name: string;
  title: string;
  color: string;
}

export interface PathInfo {
  id: string;
  name: string;
  description: string;
  badge: string;
}

export interface GameState {
  currentAct: number;
  currentScene: number;
  choiceHistory: string[];
  unlockedPaths: string[];
  dataCollected: Record<string, string>;
}
