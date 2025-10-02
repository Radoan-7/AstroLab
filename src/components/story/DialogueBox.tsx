import { useState, useEffect } from "react";
import { Character } from "@/types/story";
import { CharacterAvatar } from "./CharacterAvatar";
import storyData from "@/data/story.json";

interface DialogueBoxProps {
  character: Character;
  dialogue: string[];
  onComplete: () => void;
}

export const DialogueBox = ({ character, dialogue, onComplete }: DialogueBoxProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const characterInfo = storyData.characters[character];
  const currentLine = dialogue[currentLineIndex];

  useEffect(() => {
    if (!currentLine) {
      onComplete();
      return;
    }

    setIsTyping(true);
    setDisplayedText("");

    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < currentLine.length) {
        setDisplayedText(currentLine.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentLine, currentLineIndex]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(currentLine);
      setIsTyping(false);
    } else if (currentLineIndex < dialogue.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="dialogue-box p-6 mb-6 animate-slide-in">
      <div className="flex gap-4 mb-4">
        <CharacterAvatar character={character} />
        <div className="flex-1">
          <div className="text-primary font-bold pixel-text text-sm mb-1 glow-primary">
            {characterInfo.name}
          </div>
          <div className="text-muted-foreground text-xs pixel-text">
            {characterInfo.title}
          </div>
        </div>
      </div>

      <div className="mb-4 min-h-[80px]">
        <p className="text-foreground pixel-text text-sm leading-relaxed">
          {displayedText}
          {isTyping && <span className="animate-flicker">▮</span>}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="pixel-button text-xs"
        >
          {isTyping ? "SKIP" : currentLineIndex < dialogue.length - 1 ? "NEXT ▶" : "CONTINUE ▶"}
        </button>
      </div>
    </div>
  );
};
