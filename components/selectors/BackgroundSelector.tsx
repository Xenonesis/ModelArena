"use client";

import { useTheme } from "@/lib/themeContext";
import { BACKGROUND_STYLES, type BackgroundStyle } from "@/lib/themes";

interface BackgroundSelectorProps {
  className?: string;
  showLabels?: boolean;
  previewSize?: "sm" | "md" | "lg";
}

export default function BackgroundSelector({
  className = "",
  showLabels = true,
  previewSize = "md",
}: BackgroundSelectorProps) {
  const { theme, setBackground } = useTheme();

  const sizeClasses = {
    sm: "h-12",
    md: "h-16",
    lg: "h-20",
  };

  const handleBackgroundChange = (background: BackgroundStyle) => {
    setBackground(background);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabels && (
        <span className="text-sm font-medium text-white/80">
          Background Style:
        </span>
      )}
      <div className="grid grid-cols-2 gap-2">
        {Object.values(BACKGROUND_STYLES).map((bg) => (
          <button
            key={bg.id}
            onClick={() => handleBackgroundChange(bg.id)}
            className={`p-3 rounded-lg border transition-colors text-left ${
              theme.background === bg.id
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-white/5 hover:bg-white/8"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-medium">{bg.name}</div>
                <div className="text-xs text-white/60">{bg.description}</div>
              </div>
              {theme.background === bg.id && (
                <div className="w-2 h-2 rounded-full bg-green-400" />
              )}
            </div>
            {/* Background Preview */}
            <div
              className={`w-full ${sizeClasses[previewSize]} rounded border border-white/20 ${bg.className} overflow-hidden`}
            >
              <div className="w-full h-full opacity-80" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
