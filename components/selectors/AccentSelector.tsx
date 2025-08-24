"use client";

import { useTheme } from "@/lib/themeContext";
import { ACCENT_COLORS, type AccentColor } from "@/lib/themes";

interface AccentSelectorProps {
  className?: string;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function AccentSelector({
  className = "",
  showLabels = true,
  size = "md",
}: AccentSelectorProps) {
  const { theme, setAccent } = useTheme();

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const handleAccentChange = (accent: AccentColor) => {
    setAccent(accent);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabels && (
        <span className="text-sm font-medium text-white/80">Accent:</span>
      )}
      <div className="flex gap-1.5">
        {Object.values(ACCENT_COLORS).map((accent) => (
          <button
            key={accent.id}
            onClick={() => handleAccentChange(accent.id)}
            className={`${sizeClasses[size]} rounded-full border-2 transition-all hover:scale-110 accent-swatch`}
            data-tone="primary"
            data-active={theme.accent === accent.id}
            title={`${accent.name} - ${accent.description}`}
            aria-label={`Select ${accent.name} accent color`}
          />
        ))}
      </div>
    </div>
  );
}
