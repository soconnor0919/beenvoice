"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function ModeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
       <div className="space-y-1.5">
        <label className="font-medium">Appearance</label>
        <p className="text-muted-foreground text-xs leading-snug">
          Select a light or dark mode, or sync with your system.
        </p>
      </div>
      <Tabs defaultValue={theme} onValueChange={setTheme} className="w-auto">
        <TabsList>
          <TabsTrigger value="light">
            <Sun className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="dark">
            <Moon className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="system">
            <Laptop className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
