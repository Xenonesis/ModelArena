"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  ThemeConfig,
  ThemeMode,
  AccentColor,
  FontFamily,
  BackgroundStyle,
  BadgePair,
  DEFAULT_THEME,
  validateThemeConfig,
} from "./themes";
import {
  applyTheme,
  saveTheme,
  loadTheme,
  loadGoogleFont,
  logThemeInfo,
} from "./themeUtils";

// Theme Context Interface
interface ThemeContextType {
  // Current theme configuration
  theme: ThemeConfig;

  // Individual setters for each theme aspect
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setFont: (font: FontFamily) => void;
  setBackground: (background: BackgroundStyle) => void;
  setBadgePair: (badgePair: BadgePair) => void;

  // Convenience methods
  toggleMode: () => void;
  resetTheme: () => void;
  updateTheme: (partial: Partial<ThemeConfig>) => void;

  // State indicators
  isLoading: boolean;
  isInitialized: boolean;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | null>(null);

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<ThemeConfig>;
  enableLogging?: boolean;
}

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = {},
  enableLogging = false,
}) => {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Individual theme setters - Pure state updates without side effects
  const setMode = useCallback((mode: ThemeMode) => {
    setTheme((currentTheme) => ({ ...currentTheme, mode }));
  }, []);

  const setAccent = useCallback((accent: AccentColor) => {
    setTheme((currentTheme) => ({ ...currentTheme, accent }));
  }, []);

  const setFont = useCallback((font: FontFamily) => {
    if (font !== "geist") {
      loadGoogleFont(font); // Fire and forget - don't wait or catch
    }
    setTheme((currentTheme) => ({ ...currentTheme, font }));
  }, []);

  const setBackground = useCallback((background: BackgroundStyle) => {
    setTheme((currentTheme) => ({ ...currentTheme, background }));
  }, []);

  const setBadgePair = useCallback((badgePair: BadgePair) => {
    setTheme((currentTheme) => ({ ...currentTheme, badgePair }));
  }, []);

  // Convenience methods
  const toggleMode = useCallback(() => {
    setTheme((currentTheme) => ({
      ...currentTheme,
      mode: currentTheme.mode === "dark" ? "light" : "dark",
    }));
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME);
  }, []);

  const updateTheme = useCallback((partial: Partial<ThemeConfig>) => {
    setTheme((currentTheme) =>
      validateThemeConfig({ ...currentTheme, ...partial })
    );
  }, []);

  // Apply theme changes via useEffect to avoid side effects in render
  useEffect(() => {
    if (isInitialized) {
      // STEP 1: Test basic theme application without transitions
      applyTheme(theme);

      // STILL DISABLED: Transitions and logging
      // if (enableTransitions) {
      //   withThemeTransition(() => applyTheme(theme));
      // } else {
      //   applyTheme(theme);
      // }

      // if (enableLogging) {
      //   logThemeInfo(theme);
      // }

      saveTheme(theme);
    }
  }, [theme, isInitialized]);

  // Initialize theme on mount - SEPARATE from apply effect to prevent loops
  useEffect(() => {
    if (!isInitialized) {
      const initializeTheme = async () => {
        try {
          // Load theme from localStorage or use initial/default theme
          const savedTheme = loadTheme();
          const baseTheme = savedTheme || { ...DEFAULT_THEME, ...initialTheme };
          const validatedTheme = validateThemeConfig(baseTheme);

          if (validatedTheme.font !== "geist") {
            try {
              await loadGoogleFont(validatedTheme.font);
            } catch (error) {
              console.warn("Failed to load initial font:", error);
            }
          }

          // Apply the theme BEFORE setting state to avoid triggering the other effect
          applyTheme(validatedTheme);

          if (enableLogging) {
            logThemeInfo(validatedTheme);
          }

          // Set theme and mark as initialized - this will NOT trigger the apply effect
          setTheme(validatedTheme);
        } catch (error) {
          console.error("Failed to initialize theme:", error);
          // Fallback to default theme
          applyTheme(DEFAULT_THEME);
          setTheme(DEFAULT_THEME);
        } finally {
          setIsLoading(false);
          setIsInitialized(true);
        }
      };

      initializeTheme();
    }
  }, [isInitialized, initialTheme, enableLogging]);

  // Handle system theme changes (optional enhancement)
  useEffect(() => {
    // Check if we're in a browser environment (not SSR)
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't explicitly set a preference
      const savedTheme = loadTheme();
      if (!savedTheme) {
        setMode(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [setMode]);

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    setMode,
    setAccent,
    setFont,
    setBackground,
    setBadgePair,
    toggleMode,
    resetTheme,
    updateTheme,
    isLoading,
    isInitialized,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

// Custom hook for theme loading state
export const useThemeLoading = (): boolean => {
  const { isLoading } = useTheme();
  return isLoading;
};

// Custom hook for theme initialization state
export const useThemeInitialized = (): boolean => {
  const { isInitialized } = useTheme();
  return isInitialized;
};

// Higher-order component for theme-aware components
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: ThemeConfig }>
) => {
  const ThemedComponent: React.FC<P> = (props) => {
    const { theme } = useTheme();
    return <Component {...props} theme={theme} />;
  };

  ThemedComponent.displayName = `withTheme(${
    Component.displayName || Component.name
  })`;
  return ThemedComponent;
};

// Theme debugging utilities for development
export const ThemeDebugger: React.FC = () => {
  const { theme } = useTheme();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        right: 8,
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "6px",
        borderRadius: "3px",
        fontSize: "10px",
        zIndex: 9999,
        fontFamily: "monospace",
        lineHeight: "1.2",
      }}
    >
      <div style={{ fontSize: "10px", marginBottom: "2px" }}>
        <strong>Theme Debug</strong>
      </div>
      <div style={{ fontSize: "9px" }}>Mode: {theme.mode}</div>
      <div style={{ fontSize: "9px" }}>Accent: {theme.accent}</div>
      <div style={{ fontSize: "9px" }}>Font: {theme.font}</div>
      <div style={{ fontSize: "9px" }}>Background: {theme.background}</div>
      <div style={{ fontSize: "9px" }}>Badge Pair: {theme.badgePair}</div>
    </div>
  );
};
