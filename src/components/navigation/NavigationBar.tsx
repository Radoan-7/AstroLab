interface NavigationBarProps {
  currentMode: "story" | "sandbox";
  onModeChange: (mode: "story" | "sandbox") => void;
}

export const NavigationBar = ({ currentMode, onModeChange }: NavigationBarProps) => {
  return (
    <nav className="border-b-2 border-primary mb-8 pb-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="text-3xl">☄</div>
          <div>
            <h1 className="text-2xl font-bold pixel-text glow-primary">
              ASTROLAB
            </h1>
            <p className="text-xs pixel-text text-muted-foreground">
              THE TALE OF IMPACTOR-2025
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onModeChange("story")}
            className={`
              pixel-button text-sm
              ${currentMode === "story" ? "bg-primary text-primary-foreground" : ""}
            `}
          >
            STORY MODE
          </button>
          <button
            onClick={() => onModeChange("sandbox")}
            className={`
              pixel-button text-sm
              ${currentMode === "sandbox" ? "bg-primary text-primary-foreground" : ""}
            `}
          >
            SANDBOX MODE
          </button>
        </div>
      </div>
    </nav>
  );
};
