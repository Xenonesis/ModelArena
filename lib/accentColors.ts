/**
 * Dedicated Accent Color System
 * Provides structured accent colors for interactive elements, highlights, and effects
 */

import { AccentColor } from "./themes";

// Accent Color Categories
export interface AccentColorDefinition {
  // Interactive Elements (buttons, links, inputs)
  interactive: {
    primary: string;
    hover: string;
    active: string;
    focus: string;
  };
  // Highlight Elements (status indicators, badges)
  highlight: {
    primary: string;
    secondary: string;
    subtle: string;
  };
  // Status Colors (success, warning, error, info)
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  // Glow Effects (soft, medium, strong)
  glow: {
    soft: string;
    medium: string;
    strong: string;
  };
}

// Accent Color System for each main accent
export const ACCENT_COLOR_SYSTEM: Record<AccentColor, AccentColorDefinition> = {
  black: {
    interactive: {
      primary: "#141414",
      hover: "#1f1f1f",
      active: "#000000",
      focus: "rgba(255,255,255,0.35)",
    },
    highlight: {
      primary: "#ffffff",
      secondary: "#d9d9d9",
      subtle: "rgba(255,255,255,0.12)",
    },
    status: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    glow: {
      soft: "rgba(255,255,255,0.15)",
      medium: "rgba(255,255,255,0.28)",
      strong: "rgba(255,255,255,0.45)",
    },
  },
  crimson: {
    interactive: {
      primary: "#8b2323",
      hover: "#742020",
      active: "#5d1a1a",
      focus: "rgba(139, 35, 35, 0.5)",
    },
    highlight: {
      primary: "#a52a2a",
      secondary: "#8b2323",
      subtle: "rgba(165, 42, 42, 0.16)",
    },
    status: {
      success: "#0e9f71",
      warning: "#d28a17",
      error: "#d13b3b",
      info: "#3374dd",
    },
    glow: {
      soft: "rgba(165, 42, 42, 0.28)",
      medium: "rgba(165, 42, 42, 0.45)",
      strong: "rgba(165, 42, 42, 0.65)",
    },
  },
  emerald: {
    interactive: {
      primary: "#0b7f5a",
      hover: "#086247",
      active: "#044432",
      focus: "rgba(11, 127, 90, 0.5)",
    },
    highlight: {
      primary: "#1f8c67",
      secondary: "#47b993",
      subtle: "rgba(31, 140, 103, 0.16)",
    },
    status: {
      success: "#0e9f71",
      warning: "#d28a17",
      error: "#d13b3b",
      info: "#3374dd",
    },
    glow: {
      soft: "rgba(14, 159, 113, 0.28)",
      medium: "rgba(14, 159, 113, 0.45)",
      strong: "rgba(14, 159, 113, 0.65)",
    },
  },
  blue: {
    interactive: {
      primary: "#2a62ba",
      hover: "#1e4c91",
      active: "#16386c",
      focus: "rgba(42, 98, 186, 0.5)",
    },
    highlight: {
      primary: "#3d72b8",
      secondary: "#6e9edb",
      subtle: "rgba(61, 114, 184, 0.16)",
    },
    status: {
      success: "#0e9f71",
      warning: "#d28a17",
      error: "#d13b3b",
      info: "#3374dd",
    },
    glow: {
      soft: "rgba(51, 116, 221, 0.28)",
      medium: "rgba(51, 116, 221, 0.45)",
      strong: "rgba(51, 116, 221, 0.65)",
    },
  },
  purple: {
    interactive: {
      primary: "#663fba",
      hover: "#522f99",
      active: "#3f2376",
      focus: "rgba(102, 63, 186, 0.5)",
    },
    highlight: {
      primary: "#744fbe",
      secondary: "#a484e3",
      subtle: "rgba(116, 79, 190, 0.16)",
    },
    status: {
      success: "#0e9f71",
      warning: "#d28a17",
      error: "#d13b3b",
      info: "#3374dd",
    },
    glow: {
      soft: "rgba(123, 76, 217, 0.28)",
      medium: "rgba(123, 76, 217, 0.45)",
      strong: "rgba(123, 76, 217, 0.65)",
    },
  },
};

// Helper function to get accent colors for a specific theme
export const getAccentColors = (accent: AccentColor): AccentColorDefinition => {
  return ACCENT_COLOR_SYSTEM[accent];
};

// CSS Variable Generator for Accent Colors
export const generateAccentColorVariables = (
  accent: AccentColor
): Record<string, string> => {
  const colors = getAccentColors(accent);

  return {
    // Interactive
    "--accent-interactive-primary": colors.interactive.primary,
    "--accent-interactive-hover": colors.interactive.hover,
    "--accent-interactive-active": colors.interactive.active,
    "--accent-interactive-focus": colors.interactive.focus,

    // Highlight
    "--accent-highlight-primary": colors.highlight.primary,
    "--accent-highlight-secondary": colors.highlight.secondary,
    "--accent-highlight-subtle": colors.highlight.subtle,

    // Status
    "--accent-success": colors.status.success,
    "--accent-warning": colors.status.warning,
    "--accent-error": colors.status.error,
    "--accent-info": colors.status.info,

    // Glow
    "--accent-glow-soft": colors.glow.soft,
    "--accent-glow-medium": colors.glow.medium,
    "--accent-glow-strong": colors.glow.strong,
  };
};

// Utility classes for accent elements
export const ACCENT_UTILITY_CLASSES = {
  // Interactive Elements
  button: {
    primary:
      "bg-[var(--accent-interactive-primary)] hover:bg-[var(--accent-interactive-hover)] active:bg-[var(--accent-interactive-active)] focus:ring-2 focus:ring-[var(--accent-interactive-focus)]",
    secondary:
      "border border-[var(--accent-interactive-primary)] text-[var(--accent-interactive-primary)] hover:bg-[var(--accent-interactive-primary)] hover:text-white",
    ghost:
      "text-[var(--accent-interactive-primary)] hover:bg-[var(--accent-highlight-subtle)]",
  },

  // Input Elements
  input: {
    focus:
      "focus:border-[var(--accent-interactive-primary)] focus:ring-2 focus:ring-[var(--accent-interactive-focus)]",
    error:
      "border-[var(--accent-error)] focus:border-[var(--accent-error)] focus:ring-[var(--accent-error)]",
  },

  // Link Elements
  link: {
    primary:
      "text-[var(--accent-interactive-primary)] hover:text-[var(--accent-interactive-hover)]",
    underline:
      "text-[var(--accent-interactive-primary)] hover:text-[var(--accent-interactive-hover)] underline decoration-[var(--accent-interactive-primary)]",
  },

  // Status Elements
  status: {
    success:
      "text-[var(--accent-success)] bg-[var(--accent-success)]/10 border-[var(--accent-success)]/20",
    warning:
      "text-[var(--accent-warning)] bg-[var(--accent-warning)]/10 border-[var(--accent-warning)]/20",
    error:
      "text-[var(--accent-error)] bg-[var(--accent-error)]/10 border-[var(--accent-error)]/20",
    info: "text-[var(--accent-info)] bg-[var(--accent-info)]/10 border-[var(--accent-info)]/20",
  },

  // Glow Effects
  glow: {
    soft: "shadow-lg shadow-[var(--accent-glow-soft)]",
    medium: "shadow-xl shadow-[var(--accent-glow-medium)]",
    strong: "shadow-2xl shadow-[var(--accent-glow-strong)]",
  },
};
