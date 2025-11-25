"use client";

import { useTheme } from "next-themes";
import { Check, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "light", label: "Light" },
    { name: "dark", label: "Dark" },
    { name: "theme-sunset", label: "Sunset" },
    { name: "theme-forest", label: "Forest" },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1.5">
        <label className="font-medium">Theme</label>
        <p className="text-muted-foreground text-xs leading-snug">
          Select a theme for the application.
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-40 justify-between">
            <span>
              {themes.find((t) => t.name === theme)?.label ?? "Light"}
            </span>
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {themes.map((t) => (
            <DropdownMenuItem
              key={t.name}
              className="flex justify-between"
              onClick={() => setTheme(t.name)}
            >
              <span>{t.label}</span>
              {theme === t.name && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
