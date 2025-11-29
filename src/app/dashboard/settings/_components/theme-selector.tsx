"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { useColorTheme } from "~/components/providers/color-theme-provider";

const themes = [
  { name: "slate", hex: "#64748b" },
  { name: "blue", hex: "#3b82f6" },
  { name: "green", hex: "#22c55e" },
  { name: "rose", hex: "#be123c" },
  { name: "orange", hex: "#ea580c" },
];

export function ThemeSelector() {
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <div className="space-y-1.5">
      <label className="font-medium">Theme</label>
      <p className="text-muted-foreground text-xs leading-snug">
        Select a theme for the application.
      </p>
      <div className="flex items-center gap-2 pt-2">
        <TooltipProvider>
          {themes.map((t) => (
            <Tooltip key={t.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full border-2",
                    colorTheme === t.name && "border-primary",
                  )}
                  onClick={() => setColorTheme(t.name as any)}
                  style={{ backgroundColor: t.hex }}
                >
                  {colorTheme === t.name && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{t.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
