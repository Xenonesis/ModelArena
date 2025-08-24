/**
 * Theme Utility Functions
 * Helper functions for theme management, CSS variable updates, and class generation
 */

import {
  ThemeConfig,
  AccentColor,
  FontFamily,
  ACCENT_COLORS,
  FONT_FAMILIES,
  BACKGROUND_STYLES,
  CSS_VARIABLES,
  generateThemeClasses,
} from "./themes";
import { generateBadgeVariables } from "./badgeSystem";

// LocalStorage key for theme persistence
export const THEME_STORAGE_KEY = "ai-fiesta:theme";

// Theme Class Management
export const applyThemeClasses = (
  config: ThemeConfig,
  targetElement?: Element
): void => {
  // Check if we're in a browser environment (not SSR)
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const element = targetElement || document.documentElement;
  const classes = generateThemeClasses(config);

  // Remove existing theme classes
  element.classList.remove(
    "light",
    "dark",
    "accent-crimson",
    "accent-emerald",
    "accent-blue",
    "accent-purple",
    "accent-black",
    "font-geist",
    "font-inter",
    "font-mono",
    "font-poppins",
    "bg-gradient-theme",
    "bg-minimal-theme",
    "chatinput-default",
    "chatinput-frosty"
  );

  // Apply new theme classes
  element.classList.add(...classes);
};

// CSS Variable Management
export const updateCSSVariables = (config: ThemeConfig): void => {
  // Check if we're in a browser environment (not SSR)
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const root = document.documentElement.style;
  const accent = ACCENT_COLORS[config.accent];
  const font = FONT_FAMILIES[config.font];

  // Update accent color variables
  root.setProperty(CSS_VARIABLES.ACCENT_PRIMARY, accent.primary);
  root.setProperty(CSS_VARIABLES.ACCENT_SECONDARY, accent.secondary);
  root.setProperty(CSS_VARIABLES.ACCENT_TERTIARY, accent.tertiary);
  root.setProperty(CSS_VARIABLES.ACCENT_BG_PRIMARY, accent.background.primary);
  root.setProperty(
    CSS_VARIABLES.ACCENT_BG_SECONDARY,
    accent.background.secondary
  );

  // Update font variables
  root.setProperty(CSS_VARIABLES.FONT_PRIMARY, font.primary);
  root.setProperty(
    CSS_VARIABLES.FONT_SECONDARY,
    font.secondary || font.primary
  );

  // Update background pattern
  const gradientKey = config.mode === "dark" ? "dark" : "light";
  root.setProperty(
    CSS_VARIABLES.BACKGROUND_PATTERN,
    accent.gradient[gradientKey]
  );

  // Update badge variables
  const badgeVariables = generateBadgeVariables(config.badgePair);
  Object.entries(badgeVariables).forEach(([key, value]) => {
    root.setProperty(key, value);
  });
};

// Complete Theme Application
export const applyTheme = (config: ThemeConfig): void => {
  // Check if we're in a browser environment (not SSR)
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  applyThemeClasses(config);
  updateCSSVariables(config);
  if (process.env.NODE_ENV === "development") {
    try {
      const rootStyles = getComputedStyle(document.documentElement);
      const fontPrimary = rootStyles.getPropertyValue("--font-primary").trim();
      const fontSecondary = rootStyles
        .getPropertyValue("--font-secondary")
        .trim();
      // Force body font update explicitly (Tailwind base already sets it, but reinforce for debug)
      document.body.style.fontFamily = `${fontPrimary}, system-ui, -apple-system, sans-serif`;
      console.log("[Theme] Applied font:", config.font, {
        fontPrimary,
        fontSecondary,
        bodyFont: document.body.style.fontFamily,
        htmlClassList: Array.from(document.documentElement.classList).filter(
          (c) => c.startsWith("font-")
        ),
      });
    } catch (e) {
      console.warn("[Theme] Font debug failed", e);
    }
  }
};

// Theme Persistence
export const saveTheme = (config: ThemeConfig): void => {
  try {
    // Check if we're in a browser environment (not SSR)
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
};

export const loadTheme = (): ThemeConfig | null => {
  try {
    // Check if we're in a browser environment (not SSR)
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Failed to load theme from localStorage:", error);
    return null;
  }
};

// Theme Transition Helpers
export const withThemeTransition = (
  callback: () => void,
  duration: number = 300
): void => {
  // Check if we're in a browser environment (not SSR)
  if (typeof window === "undefined" || typeof document === "undefined") {
    // Just execute callback without transition in SSR
    callback();
    return;
  }

  // Add transition class to body
  document.body.style.transition = `all ${duration}ms ease-in-out`;

  // Execute the theme change
  callback();

  // Remove transition after completion
  setTimeout(() => {
    document.body.style.transition = "";
  }, duration);
};

// Color Utility Functions
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getAccentColor = (
  accent: AccentColor,
  variant: "primary" | "secondary" | "tertiary" = "primary"
): string => {
  return ACCENT_COLORS[accent][variant];
};

// Font Loading Helpers - Completely non-blocking approach
export const loadGoogleFont = (fontFamily: FontFamily): void => {
  // Check if we're in a browser environment (not SSR)
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const font = FONT_FAMILIES[fontFamily];

  if (!font.googleFont) {
    return; // Font is already loaded or doesn't require Google Fonts
  }

  try {
    // Check if font is already loaded to avoid duplicate requests
    const existingLink = document.querySelector(
      `link[href*="${font.googleFont}"]`
    );
    if (existingLink) {
      return;
    }

    // Create link elements for Google Fonts (non-blocking)
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;

    // Add loading error handling but don't block UI
    fontLink.onerror = () => {
      console.warn(`Failed to load Google Font ${fontFamily}`);
    };

    // Append to head without waiting
    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(fontLink);

    // Note: We intentionally don't wait for document.fonts.ready
    // to prevent UI blocking. The font will load asynchronously.
  } catch (error) {
    console.warn(`Error loading Google Font ${fontFamily}:`, error);
  }
};

// Theme Preview Helpers
export const previewTheme = (
  config: ThemeConfig,
  previewElement: Element
): void => {
  // Check if we're in a browser environment (not SSR)
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  applyThemeClasses(config, previewElement);

  // Apply inline styles for preview since CSS variables are global
  const accent = ACCENT_COLORS[config.accent];
  const element = previewElement as HTMLElement;

  element.style.setProperty("--accent-primary", accent.primary);
  element.style.setProperty("--accent-secondary", accent.secondary);
  element.style.setProperty("--accent-bg-primary", accent.background.primary);
};

// Accessibility / Contrast Helpers
// Relative luminance calculation per WCAG
const relativeLuminance = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const transform = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rl = transform(r);
  const gl = transform(g);
  const bl = transform(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
};

export const contrastRatio = (hex1: string, hex2: string): number => {
  const L1 = relativeLuminance(hex1);
  const L2 = relativeLuminance(hex2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Evaluate accent contrast against dark/light base text colors
export const evaluateAccentContrast = (
  accent: AccentColor
): { light: number; dark: number } => {
  const accentPrimary = ACCENT_COLORS[accent].primary;
  // Assume body text colors (#000 for light mode, #fff for dark surfaces)
  return {
    light: contrastRatio(accentPrimary, "#000000"),
    dark: contrastRatio(accentPrimary, "#ffffff"),
  };
};

export const logAccentContrastIfLow = (accent: AccentColor): void => {
  if (process.env.NODE_ENV !== "development") return;
  try {
    const ratios = evaluateAccentContrast(accent);
    const MIN_RATIO = 4.5; // WCAG AA for normal text
    if (ratios.light < MIN_RATIO || ratios.dark < MIN_RATIO) {
      console.warn(
        `[Accessibility] Accent '${accent}' contrast warning: light=${ratios.light.toFixed(
          2
        )}, dark=${ratios.dark.toFixed(2)} (target >= ${MIN_RATIO})`
      );
    } else {
      // Subtle debug log (could be silenced later)
      console.log(
        `[Accessibility] Accent '${accent}' contrast OK: light=${ratios.light.toFixed(
          2
        )}, dark=${ratios.dark.toFixed(2)}`
      );
    }
  } catch (e) {
    console.warn("[Accessibility] Contrast evaluation failed", e);
  }
};

// Initial one-time evaluation of stored theme (dev only)
try {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    const stored = loadTheme();
    if (stored) logAccentContrastIfLow(stored.accent);
  }
} catch {
  // ignore
}

// Theme Comparison Helpers
export const getThemeDifferences = (
  theme1: ThemeConfig,
  theme2: ThemeConfig
): (keyof ThemeConfig)[] => {
  const differences: (keyof ThemeConfig)[] = [];

  (Object.keys(theme1) as (keyof ThemeConfig)[]).forEach((key) => {
    if (theme1[key] !== theme2[key]) {
      differences.push(key);
    }
  });

  return differences;
};

// Accessibility Helpers
export const getContrastColor = (
  accent: AccentColor,
  mode: "light" | "dark"
): string => {
  // Return appropriate text color based on accent and mode for accessibility
  const lightColors: Record<AccentColor, string> = {
    crimson: "#ffffff",
    emerald: "#ffffff",
    blue: "#ffffff",
    purple: "#ffffff",
    black: "#ffffff",
  };

  const darkColors: Record<AccentColor, string> = {
    crimson: "#000000",
    emerald: "#000000",
    blue: "#000000",
    purple: "#000000",
    black: "#ffffff", // inverted for readability on very dark surfaces
  };

  return mode === "dark" ? lightColors[accent] : darkColors[accent];
};

// Theme Analytics (for debugging)
export const logThemeInfo = (config: ThemeConfig): void => {
  if (process.env.NODE_ENV !== "development") return;

  console.group("🎨 Theme System Debug Info");
  console.log("Current Configuration:", config);
  console.log("Generated Classes:", generateThemeClasses(config));
  console.log("Accent Colors:", ACCENT_COLORS[config.accent]);
  console.log("Font Family:", FONT_FAMILIES[config.font]);
  console.log("Background Style:", BACKGROUND_STYLES[config.background]);
  console.groupEnd();
};
