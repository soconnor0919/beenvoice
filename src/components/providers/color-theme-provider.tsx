"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";
import { generateAccentColors } from "~/lib/color-utils";

type ColorTheme = "slate" | "blue" | "green" | "rose" | "orange" | "custom";

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme, customColor?: string) => void;
  customColor?: string;
}

const ColorThemeContext = React.createContext<
  ColorThemeContextType | undefined
>(undefined);

export function useColorTheme() {
  const context = React.useContext(ColorThemeContext);
  if (!context) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }
  return context;
}

interface ColorThemeProviderProps {
  children: React.ReactNode;
  defaultColorTheme?: ColorTheme;
}

export function ColorThemeProvider({
  children,
  defaultColorTheme = "slate",
}: ColorThemeProviderProps) {
  const [colorTheme, setColorThemeState] =
    React.useState<ColorTheme>(defaultColorTheme);
  const [customColor, setCustomColor] = React.useState<string | undefined>();
  const { theme: modeTheme } = useTheme();

  const setColorTheme = React.useCallback(
    (theme: ColorTheme, customColor?: string) => {
      const root = document.documentElement;
      const themes: ColorTheme[] = ["slate", "blue", "green", "rose", "orange"];

      // Clear any existing custom styles
      const customProps = [
        "--primary",
        "--accent",
        "--ring",
        "--secondary",
        "--muted",
      ];
      customProps.forEach((prop) => {
        if (root.style.getPropertyValue(prop)) {
          root.style.removeProperty(prop);
        }
      });

      // Remove all theme classes
      root.classList.remove(...themes);

      if (theme === "custom" && customColor) {
        try {
          const colors = generateAccentColors(customColor);
          const themeColors = modeTheme === "dark" ? colors.dark : colors.light;

          Object.entries(themeColors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
          });

          setColorThemeState("custom");
          setCustomColor(customColor);

          // Persist custom theme
          const themeData = {
            color: customColor,
            timestamp: Date.now(),
            colors: colors,
          };
          localStorage.setItem("customThemeColor", JSON.stringify(themeData));
          localStorage.setItem("isCustomTheme", "true");
          localStorage.removeItem("color-theme");
        } catch (error) {
          console.error("Failed to apply custom theme:", error);
          // Fallback to default
          setColorThemeState(defaultColorTheme);
          setCustomColor(undefined);
          root.classList.add(defaultColorTheme);
          localStorage.setItem("color-theme", defaultColorTheme);
        }
      } else {
        // Apply preset color theme by setting the appropriate class
        setColorThemeState(theme);
        setCustomColor(undefined);
        root.classList.add(theme);

        // Clear custom theme storage
        localStorage.removeItem("customThemeColor");
        localStorage.removeItem("isCustomTheme");

        // Persist preset theme
        localStorage.setItem("color-theme", theme);
      }
    },
    [modeTheme, defaultColorTheme],
  );

  // Load saved theme on mount
  React.useEffect(() => {
    try {
      const isCustom = localStorage.getItem("isCustomTheme") === "true";
      const savedThemeData = localStorage.getItem("customThemeColor");
      const savedColorTheme = localStorage.getItem("color-theme") as ColorTheme | null;

      if (isCustom && savedThemeData) {
        const themeData = JSON.parse(savedThemeData) as {
          color: string;
          colors: Record<string, string>;
        };
        if (themeData?.color && themeData.colors) {
          setColorTheme("custom", themeData.color);
          return;
        }
      }

      if (savedColorTheme) {
        setColorTheme(savedColorTheme);
      } else {
        setColorTheme(defaultColorTheme);
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
      setColorTheme(defaultColorTheme);
    }
  }, [setColorTheme, defaultColorTheme]);

  // Re-apply custom theme when mode changes
  React.useEffect(() => {
    if (colorTheme === "custom" && customColor) {
      setColorTheme("custom", customColor);
    }
  }, [modeTheme, colorTheme, customColor, setColorTheme]);

  const value = React.useMemo(
    () => ({
      colorTheme,
      setColorTheme,
      customColor,
    }),
    [colorTheme, customColor, setColorTheme],
  );

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}
