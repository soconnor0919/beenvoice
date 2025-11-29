"use client";

import * as React from "react";
import { Check, Palette } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Label } from "~/components/ui/label";
import { useColorTheme } from "~/components/providers/color-theme-provider";

const presetColors = [
  { name: "Slate", hex: "#64748b" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Rose", hex: "#be123c" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Pink", hex: "#ec4899" },
];

export function AccentColorSwitcher() {
  const {
    colorTheme,
    setColorTheme,
    customColor: savedCustomColor,
  } = useColorTheme();
  const [customColorInput, setCustomColorInput] = React.useState("");
  const [isCustom, setIsCustom] = React.useState(colorTheme === "custom");

  React.useEffect(() => {
    setIsCustom(colorTheme === "custom");
    if (savedCustomColor) {
      setCustomColorInput(savedCustomColor);
    }
  }, [colorTheme, savedCustomColor]);

  const handleColorChange = (color: { name: string; hex: string }) => {
    setColorTheme(color.name.toLowerCase() as any);
  };

  const handleCustomColorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^#[0-9A-F]{6}$/i.test(customColorInput)) {
      setColorTheme("custom", customColorInput);
    }
  };

  const handleReset = () => {
    setColorTheme("slate");
    setCustomColorInput("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Accent Color</Label>
        <p className="text-muted-foreground text-xs leading-snug">
          Choose an accent color for your theme or create a custom one.
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((color) => (
            <Button
              key={color.name}
              variant="outline"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-lg border-2",
                colorTheme === color.name.toLowerCase() &&
                  !isCustom &&
                  "border-primary ring-primary ring-2 ring-offset-2",
                isCustom && "opacity-50",
              )}
              onClick={() => handleColorChange(color)}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {colorTheme === color.name.toLowerCase() && !isCustom && (
                <Check className="h-4 w-4 text-white" />
              )}
            </Button>
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              <Palette className="mr-2 h-4 w-4" />
              Custom Color
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form onSubmit={handleCustomColorSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-color">Hex Color</Label>
                <div className="flex gap-2">
                  <input
                    id="custom-color"
                    type="text"
                    placeholder="#FF6B6B"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    className="flex-1 rounded-md border px-3 py-2"
                  />
                  <input
                    type="color"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-md border"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Apply Custom Color
              </Button>
            </form>
          </PopoverContent>
        </Popover>

        {isCustom && (
          <div className="bg-muted flex items-center gap-2 rounded-lg p-3">
            <div
              className="h-6 w-6 rounded border"
              style={{ backgroundColor: savedCustomColor }}
            />
            <span className="text-sm font-medium">Custom Theme Active</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="ml-auto"
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
