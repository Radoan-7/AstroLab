import { Character } from "@/types/story";

interface CharacterAvatarProps {
  character: Character;
}

const avatarStyles = {
  narrator: "bg-cyan-900 border-cyan-500",
  watcher: "bg-blue-900 border-blue-500",
  seeker: "bg-orange-900 border-orange-500",
  defender: "bg-yellow-900 border-yellow-500",
};

const avatarIcons = {
  narrator: "▣",
  watcher: "◉",
  seeker: "◈",
  defender: "◆",
};

const avatarImages = {
  narrator: "/avatars/narrator.png",
  watcher: "/avatars/watcher.png",
  seeker: "/avatars/seeker.png",
  defender: "/avatars/defender.png",
};

export const CharacterAvatar = ({ character }: CharacterAvatarProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling;
    if (fallback) {
      (fallback as HTMLElement).style.display = 'flex';
    }
  };

  return (
    <div className={`relative w-16 h-16 border-4 ${avatarStyles[character]} overflow-hidden`}>
      <img
        src={avatarImages[character]}
        alt={character}
        className="w-full h-full object-cover pixel-art"
        style={{ imageRendering: 'pixelated' }}
        onError={handleImageError}
      />
      <div
        className="absolute inset-0 items-center justify-center text-3xl font-bold pixel-text glow-primary"
        style={{ display: 'none' }}
      >
        {avatarIcons[character]}
      </div>
    </div>
  );
};
