/**
 * Badge Pairing System
 * Provides structured Pro/Free badge combinations with consistent theming
 */

import { BadgePair, BadgeType } from "./themes";

export interface BadgeStyle {
  background: string;
  text: string;
  border: string;
  glow?: string;
}

export interface BadgePairDefinition {
  id: BadgePair;
  name: string;
  description: string;
  pro: BadgeStyle;
  free: BadgeStyle;
}

// Badge Pair Definitions
export const BADGE_PAIRS: Record<BadgePair, BadgePairDefinition> = {
  "white-white": {
    id: "white-white",
    name: "White & White",
    description: "Monochrome minimal pairing - neutral presentation",
    pro: {
      background: "rgba(255,255,255,0.28)",
      text: "#111111",
      border: "rgba(255,255,255,0.7)",
      glow: "rgba(255,255,255,0.5)",
    },
    free: {
      background: "rgba(255,255,255,0.22)",
      text: "#161616",
      border: "rgba(255,255,255,0.55)",
      glow: "rgba(255,255,255,0.4)",
    },
  },
  "red-gold": {
    id: "red-gold",
    name: "Red & Gold",
    description: "Current Pro/Free styling - Bold and premium",
    pro: {
      background: "rgba(228, 42, 66, 0.15)",
      text: "rgb(252, 211, 77)",
      border: "rgba(228, 42, 66, 0.3)",
      glow: "rgba(228, 42, 66, 0.3)",
    },
    free: {
      /* Gold (amber) tones replacing previous green */
      background: "rgba(251, 191, 36, 0.15)" /* amber-400 */,
      text: "rgb(253, 230, 138)" /* amber-200 */,
      border: "rgba(251, 191, 36, 0.3)",
      glow: "rgba(251, 191, 36, 0.35)",
    },
  },
  "purple-blue": {
    id: "purple-blue",
    name: "Purple & Blue",
    description: "Modern tech gradient - Creative and professional",
    pro: {
      background: "rgba(139, 92, 246, 0.15)",
      text: "rgb(196, 181, 253)",
      border: "rgba(139, 92, 246, 0.3)",
      glow: "rgba(139, 92, 246, 0.3)",
    },
    free: {
      background: "rgba(59, 130, 246, 0.15)",
      text: "rgb(147, 197, 253)",
      border: "rgba(59, 130, 246, 0.3)",
      glow: "rgba(59, 130, 246, 0.3)",
    },
  },
  "gold-green": {
    id: "gold-green",
    name: "Gold & Green",
    description: "Owner original theme - Premium gold & vibrant green",
    pro: {
      /* Gold / amber styled for Pro */
      background: "rgba(251, 191, 36, 0.16)" /* amber-400 */,
      text: "rgb(253, 230, 138)" /* amber-200 */,
      border: "rgba(251, 191, 36, 0.38)",
      glow: "rgba(251, 191, 36, 0.45)",
    },
    free: {
      /* Green styled for Free */
      background: "rgba(16, 185, 129, 0.18)",
      text: "rgb(167, 243, 208)",
      border: "rgba(16, 185, 129, 0.38)",
      glow: "rgba(16, 185, 129, 0.45)",
    },
  },
  "orange-yellow": {
    id: "orange-yellow",
    name: "Orange & Yellow",
    description: "Warm energy pairing - Enthusiasm and optimism",
    pro: {
      background: "rgba(249, 115, 22, 0.15)",
      text: "rgb(254, 215, 170)",
      border: "rgba(249, 115, 22, 0.3)",
      glow: "rgba(249, 115, 22, 0.3)",
    },
    free: {
      background: "rgba(234, 179, 8, 0.15)",
      text: "rgb(254, 240, 138)",
      border: "rgba(234, 179, 8, 0.3)",
      glow: "rgba(234, 179, 8, 0.3)",
    },
  },
};

// Helper Functions
export const getBadgePair = (pairId: BadgePair): BadgePairDefinition => {
  return BADGE_PAIRS[pairId];
};

export const getBadgeStyle = (
  pairId: BadgePair,
  type: BadgeType
): BadgeStyle => {
  const pair = getBadgePair(pairId);
  return pair[type];
};

// CSS Variable Generator for Badge Pairs
export const generateBadgeVariables = (
  pairId: BadgePair
): Record<string, string> => {
  const pair = getBadgePair(pairId);

  return {
    "--badge-pro-background": pair.pro.background,
    "--badge-pro-text": pair.pro.text,
    "--badge-pro-border": pair.pro.border,
    "--badge-pro-glow": pair.pro.glow || "transparent",

    "--badge-free-background": pair.free.background,
    "--badge-free-text": pair.free.text,
    "--badge-free-border": pair.free.border,
    "--badge-free-glow": pair.free.glow || "transparent",
  };
};

// Badge CSS Classes
export const BADGE_CSS_CLASSES = {
  base: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200",

  pro: "bg-[var(--badge-pro-background)] text-[var(--badge-pro-text)] border-[var(--badge-pro-border)] shadow-sm hover:shadow-[0_0_0_1px_var(--badge-pro-glow)]",

  free: "bg-[var(--badge-free-background)] text-[var(--badge-free-text)] border-[var(--badge-free-border)] shadow-sm hover:shadow-[0_0_0_1px_var(--badge-free-glow)]",

  // Size variations
  sizes: {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  },

  // Style variations
  styles: {
    solid: "", // Default solid style
    outline: "bg-transparent border-2",
    ghost: "bg-transparent border-transparent hover:border-current",
  },
};

// Current Badge Pair (matches existing design)
export const CURRENT_BADGE_PAIR: BadgePair = "gold-green";

// Badge Pair Options for Theme Selector
export const BADGE_PAIR_OPTIONS = Object.values(BADGE_PAIRS).map((pair) => ({
  id: pair.id,
  name: pair.name,
  description: pair.description,
  preview: {
    pro: pair.pro,
    free: pair.free,
  },
}));
