"use client";

import { useTheme } from "@/lib/themeContext";
import { FONT_FAMILIES, type FontFamily } from "@/lib/themes";

interface FontSelectorProps {
  className?: string;
  showLabels?: boolean;
  compact?: boolean;
}

export default function FontSelector({
  className = "",
  showLabels = true,
  compact = false,
}: FontSelectorProps) {
  const { theme, setFont } = useTheme();

  const handleFontChange = (font: FontFamily) => {
    setFont(font);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabels && (
          <span className="text-sm font-medium text-white/80">Font:</span>
        )}
        <select
          aria-label="Font family"
          value={theme.font}
          onChange={(e) => handleFontChange(e.target.value as FontFamily)}
          className="px-3 py-1 rounded-md bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          {Object.values(FONT_FAMILIES).map((font) => (
            <option key={font.id} value={font.id} className="bg-zinc-800">
              {font.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabels && (
        <span className="text-sm font-medium text-white/80">Font Family:</span>
      )}
      <div className="space-y-1">
        {Object.values(FONT_FAMILIES).map((font) => (
          <button
            key={font.id}
            onClick={() => handleFontChange(font.id)}
            className={`w-full p-3 rounded-lg border transition-colors text-left ${
              theme.font === font.id
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-white/5 hover:bg-white/8"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="text-sm font-medium">{font.name}</div>
                <div className="text-xs text-white/60">{font.description}</div>
              </div>
              {theme.font === font.id && (
                <div className="w-2 h-2 rounded-full bg-blue-400" />
              )}
            </div>
            <div
              className={`text-sm text-white/80 font-preview font-preview-${font.id}`}
            >
              The quick brown fox jumps 123456
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
