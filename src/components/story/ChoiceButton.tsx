import { Choice } from "@/types/story";
import { soundManager } from "@/lib/sounds";

interface ChoiceButtonProps {
  choice: Choice;
  index: number;
  onSelect: (choice: Choice) => void;
}

export const ChoiceButton = ({ choice, index, onSelect }: ChoiceButtonProps) => {
  const handleClick = () => {
    soundManager.play('buttonClick');
    onSelect(choice);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => soundManager.play('buttonHover')}
      className="pixel-button w-full text-left mb-3 hover:glow-border transition-all duration-200"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <span className="text-secondary mr-2">▸</span>
      {choice.text}
    </button>
  );
};
