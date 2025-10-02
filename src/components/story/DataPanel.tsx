interface DataPanelProps {
  dataPoint?: {
    type: string;
    value: string;
  };
}

export const DataPanel = ({ dataPoint }: DataPanelProps) => {
  if (!dataPoint) return null;

  const typeIcons = {
    asteroid: "☄",
    earthquake: "⚠",
    tsunami: "〰",
    crater: "◯",
  };

  const icon = typeIcons[dataPoint.type as keyof typeof typeIcons] || "◆";

  return (
    <div className="border-2 border-accent bg-card p-4 mb-6 glow-border scanlines animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-2xl text-accent">{icon}</span>
        <div>
          <div className="text-accent text-xs pixel-text mb-1">DATA UPLINK</div>
          <div className="text-foreground pixel-text text-sm">{dataPoint.value}</div>
        </div>
      </div>
    </div>
  );
};
