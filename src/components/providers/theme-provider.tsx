"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { authClient } from "~/lib/auth-client";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);

  // Auth & DB Sync
  const { data: session } = authClient.useSession();
  const { data: dbTheme } = api.settings.getTheme.useQuery(undefined, {
    enabled: !!session?.user,
    staleTime: Infinity,
  });

  const updateThemeMutation = api.settings.updateTheme.useMutation();

  // Sync from DB
  React.useEffect(() => {
    if (dbTheme?.theme) {
      setTheme(dbTheme.theme);
    }
  }, [dbTheme]);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (savedTheme && !dbTheme) {
      setTheme(savedTheme);
    }
  }, [storageKey, dbTheme]);

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = media.matches ? "dark" : "light";

      root.classList.add(systemTheme);

      const listener = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
      };

      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }

    root.classList.add(theme);
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);

        if (session?.user) {
          updateThemeMutation.mutate({ theme: newTheme });
        }
      },
    }),
    [theme, storageKey, session?.user, updateThemeMutation]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
