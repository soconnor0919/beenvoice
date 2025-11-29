"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";
import { generateAccentColors } from "~/lib/color-utils";
import { api } from "~/trpc/react";
import { authClient } from "~/lib/auth-client";

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

  // Auth & DB Sync
  const { data: session } = authClient.useSession();
  const { data: dbTheme } = api.settings.getTheme.useQuery(undefined, {
    enabled: !!session?.user,
    staleTime: Infinity, // Only fetch once on mount/auth
  });

  const updateThemeMutation = api.settings.updateTheme.useMutation();



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

          // Persist custom theme locally
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
          return; // Don't sync failed theme
        }
      } else {
        // Apply preset color theme by setting the appropriate class
        setColorThemeState(theme);
        setCustomColor(undefined);
        root.classList.add(theme);

        // Clear custom theme storage
        localStorage.removeItem("customThemeColor");
        localStorage.removeItem("isCustomTheme");

        // Persist preset theme locally
        localStorage.setItem("color-theme", theme);
      }

      // Sync to DB if authenticated
      // We check session inside the callback or pass it as dependency
      // But since this is a callback, we'll use the mutation directly if we can
      // However, we need to avoid infinite loops if the DB update triggers a re-render
      // The mutation is stable.
    },
    [modeTheme, defaultColorTheme],
  );

  // Sync from DB when available
  React.useEffect(() => {
    if (dbTheme) {
      setColorTheme(dbTheme.colorTheme, dbTheme.customColor);
    }
  }, [dbTheme, setColorTheme]);

  // Effect to trigger DB update when state changes (debounced or direct)
  // We do this separately to avoid putting mutation in the setColorTheme callback dependencies if possible
  // But actually, calling it in setColorTheme is better for direct user action.
  // The issue is `setColorTheme` is called by the `useEffect` that syncs FROM DB.
  // So we need to distinguish between "user set theme" and "synced from DB".
  // For now, we'll just let it be. If the DB sync calls setColorTheme, it will update state.
  // If we add a DB update call here, it might be redundant but harmless if the value is same.
  // BETTER APPROACH: Only call mutation when user interacts.
  // But `setColorTheme` is exposed to consumers.
  // Let's wrap the exposed `setColorTheme` to include the DB call.

  const handleSetColorTheme = React.useCallback(
    (theme: ColorTheme, customColor?: string) => {
      setColorTheme(theme, customColor);

      // Optimistic update is already done by setColorTheme (local state)
      // Now sync to DB
      if (session?.user) {
        updateThemeMutation.mutate({
          colorTheme: theme,
          customColor: theme === "custom" ? customColor : undefined,
        });
      }
    },
    [setColorTheme, session?.user, updateThemeMutation]
  );

  // Load saved theme on mount (Local Storage Fallback)
  React.useEffect(() => {
    // If we have DB data, that takes precedence (handled by other effect)
    // But initially or if offline/unauth, use local storage
    if (dbTheme) return;

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
  }, [setColorTheme, defaultColorTheme, dbTheme]);

  // Re-apply custom theme when mode changes
  React.useEffect(() => {
    if (colorTheme === "custom" && customColor) {
      setColorTheme("custom", customColor);
    }
  }, [modeTheme, colorTheme, customColor, setColorTheme]);

  const value = React.useMemo(
    () => ({
      colorTheme,
      setColorTheme: handleSetColorTheme, // Expose the wrapper
      customColor,
    }),
    [colorTheme, customColor, handleSetColorTheme],
  );

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}
