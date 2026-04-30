"use client";

import { useEffect, useState } from "react";
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful";
import { Loader2, PipetteIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  hexToRgb,
  hexToRgba,
  hslToRgb,
  hslaToRgba,
  rgbToHex,
  rgbToHsl,
  rgbaToHex,
  rgbaToHsla,
} from "~/lib/color-converter";
import { cn } from "~/lib/utils";

declare global {
  interface Window {
    EyeDropper?: new () => {
      open: () => Promise<{ sRGBHex: string }>;
    };
  }
}

export const colorSchema = z
  .string()
  .regex(
    /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/,
    "Color must be a valid hex color (e.g., #FF0000 or #FF0000FF)",
  )
  .transform((val) => val.toUpperCase());

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  isLoading?: boolean;
  label: string;
  error?: string;
  className?: string;
  alpha?: boolean;
}

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  rgba?: { r: number; g: number; b: number; a: number };
  hsla?: { h: number; s: number; l: number; a: number };
}

export function InputColor({
  value,
  onChange,
  onBlur = () => undefined,
  isLoading = false,
  label,
  error,
  className = "mt-6",
  alpha = false,
}: ColorPickerProps) {
  const [colorFormat, setColorFormat] = useState(alpha ? "HEXA" : "HEX");
  const [colorValues, setColorValues] = useState<ColorValues>(() =>
    getColorValues(value, alpha),
  );
  const [hexInputValue, setHexInputValue] = useState(value);
  const [hexInputError, setHexInputError] = useState<string | null>(null);

  const updateColorValues = (newColor: string) => {
    const nextValues = getColorValues(newColor, alpha);
    setColorValues(nextValues);
    setHexInputValue(newColor.toUpperCase());
  };

  const handleColorChange = (newColor: string) => {
    updateColorValues(newColor);
    onChange(newColor.toUpperCase());
  };

  const handleHexChange = (nextValue: string) => {
    let formattedValue = nextValue.toUpperCase();
    if (!formattedValue.startsWith("#")) {
      formattedValue = `#${formattedValue}`;
    }

    const maxLength = alpha ? 9 : 7;
    if (
      formattedValue.length <= maxLength &&
      /^#[0-9A-Fa-f]*$/.test(formattedValue)
    ) {
      setHexInputValue(formattedValue);
      onChange(formattedValue);
      updateColorValues(formattedValue);
      try {
        if (formattedValue.length === maxLength) {
          colorSchema.parse(formattedValue);
          setHexInputError(null);
        } else {
          setHexInputError("Enter a valid color");
        }
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          setHexInputError("Enter a valid color");
        }
      }
    }
  };

  const handleRgbChange = (component: "r" | "g" | "b", nextValue: string) => {
    const numValue = Number.parseInt(nextValue) || 0;
    const clampedValue = Math.max(0, Math.min(255, numValue));
    const newRgb = { ...colorValues.rgb, [component]: clampedValue };
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);

    setColorValues({ ...colorValues, hex, rgb: newRgb, hsl });
    setHexInputValue(hex);
    onChange(hex);
  };

  const handleRgbaChange = (
    component: "r" | "g" | "b" | "a",
    nextValue: string,
  ) => {
    if (!alpha || !colorValues.rgba) return;

    const numValue = Number.parseFloat(nextValue) || 0;
    const clampedValue =
      component === "a"
        ? Math.max(0, Math.min(1, numValue))
        : Math.max(0, Math.min(255, Math.floor(numValue)));

    const newRgba = { ...colorValues.rgba, [component]: clampedValue };
    const hex = rgbaToHex(newRgba.r, newRgba.g, newRgba.b, newRgba.a);
    const hsla = rgbaToHsla(newRgba.r, newRgba.g, newRgba.b, newRgba.a);

    setColorValues({
      ...colorValues,
      hex: hex.slice(0, 7),
      rgb: { r: newRgba.r, g: newRgba.g, b: newRgba.b },
      hsl: rgbToHsl(newRgba.r, newRgba.g, newRgba.b),
      rgba: newRgba,
      hsla,
    });
    setHexInputValue(hex);
    onChange(hex);
  };

  const handleHslChange = (component: "h" | "s" | "l", nextValue: string) => {
    const numValue = Number.parseInt(nextValue) || 0;
    const clampedValue =
      component === "h"
        ? Math.max(0, Math.min(360, numValue))
        : Math.max(0, Math.min(100, numValue));
    const newHsl = { ...colorValues.hsl, [component]: clampedValue };
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    setColorValues({ ...colorValues, hex, rgb, hsl: newHsl });
    setHexInputValue(hex);
    onChange(hex);
  };

  const handleHslaChange = (
    component: "h" | "s" | "l" | "a",
    nextValue: string,
  ) => {
    if (!alpha || !colorValues.hsla) return;

    const numValue = Number.parseFloat(nextValue) || 0;
    const clampedValue =
      component === "a"
        ? Math.max(0, Math.min(1, numValue))
        : component === "h"
          ? Math.max(0, Math.min(360, numValue))
          : Math.max(0, Math.min(100, numValue));

    const newHsla = { ...colorValues.hsla, [component]: clampedValue };
    const rgba = hslaToRgba(newHsla.h, newHsla.s, newHsla.l, newHsla.a);
    const hex = rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a);

    setColorValues({
      ...colorValues,
      hex: hex.slice(0, 7),
      rgb: { r: rgba.r, g: rgba.g, b: rgba.b },
      hsl: { h: newHsla.h, s: newHsla.s, l: newHsla.l },
      rgba,
      hsla: newHsla,
    });
    setHexInputValue(hex);
    onChange(hex);
  };

  const handlePopoverChange = (open: boolean) => {
    if (!open) {
      setColorFormat(alpha ? "HEXA" : "HEX");
      onBlur();
    }
  };

  const handleEyeDropper = async () => {
    const EyeDropper = window.EyeDropper;
    if (!EyeDropper) return;
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const pickedColor = result.sRGBHex;
      updateColorValues(pickedColor);
      onChange(pickedColor);
    } catch {
      // User canceled the browser picker.
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize controlled color value into the picker fields.
    updateColorValues(value);
    setHexInputValue(value.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- updateColorValues intentionally derives all picker state from value.
  }, [value]);

  const getCurrentHexValue = () => {
    if (colorFormat === "HEX" || colorFormat === "HEXA") {
      return hexInputValue;
    }
    if (alpha && colorValues.rgba) {
      return rgbaToHex(
        colorValues.rgba.r,
        colorValues.rgba.g,
        colorValues.rgba.b,
        colorValues.rgba.a,
      );
    }
    return colorValues.hex;
  };

  return (
    <div className={cn(className)}>
      <Label className="mb-3">{label}</Label>
      <div className="flex items-center gap-4">
        <Popover onOpenChange={handlePopoverChange}>
          <PopoverTrigger asChild>
            <Button
              className="border-border relative h-12 w-12 overflow-hidden border shadow-none"
              size="icon"
              style={{ backgroundColor: hexInputValue }}
              type="button"
              variant="outline"
            >
              {alpha && colorValues.rgba && colorValues.rgba.a < 1 && (
                <span
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%),
                                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                                    linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                  }}
                />
              )}
              <span className="sr-only">Open {label} picker</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <div className="color-picker space-y-3">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1.5 -left-1 z-10 flex h-7 w-7 items-center gap-1 bg-transparent hover:bg-transparent"
                  onClick={handleEyeDropper}
                  disabled={!isEyeDropperAvailable()}
                  type="button"
                >
                  <PipetteIcon className="h-3 w-3" />
                  <span className="sr-only">Pick color from screen</span>
                </Button>
                {alpha ? (
                  <HexAlphaColorPicker
                    className="!aspect-square !h-[244.79px] !w-[244.79px]"
                    color={value}
                    onChange={handleColorChange}
                  />
                ) : (
                  <HexColorPicker
                    className="!aspect-square !h-[244.79px] !w-[244.79px]"
                    color={value}
                    onChange={handleColorChange}
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Select value={colorFormat} onValueChange={setColorFormat}>
                  <SelectTrigger className="!h-7 !w-[4.8rem] rounded-sm px-2 py-1 !text-sm">
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent className="min-w-20">
                    {alpha ? (
                      <>
                        <SelectItem value="HEXA" className="h-7 text-sm">
                          HEXA
                        </SelectItem>
                        <SelectItem value="RGBA" className="h-7 text-sm">
                          RGBA
                        </SelectItem>
                        <SelectItem value="HSLA" className="h-7 text-sm">
                          HSLA
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="HEX" className="h-7 text-sm">
                          HEX
                        </SelectItem>
                        <SelectItem value="RGB" className="h-7 text-sm">
                          RGB
                        </SelectItem>
                        <SelectItem value="HSL" className="h-7 text-sm">
                          HSL
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <ColorFormatFields
                  alpha={alpha}
                  colorFormat={colorFormat}
                  colorValues={colorValues}
                  currentHexValue={getCurrentHexValue()}
                  handleHexChange={handleHexChange}
                  handleHslChange={handleHslChange}
                  handleHslaChange={handleHslaChange}
                  handleRgbChange={handleRgbChange}
                  handleRgbaChange={handleRgbaChange}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="relative flex-1 sm:flex-none">
          <Input
            placeholder={label}
            value={getCurrentHexValue()}
            onChange={(event) => handleHexChange(event.target.value)}
            onBlur={onBlur}
            className={cn("h-12 uppercase", error && "border-destructive")}
          />
          {isLoading && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
              <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
            </span>
          )}
        </div>
      </div>
      {error && <p className="text-destructive mt-1.5 text-sm">{error}</p>}
      {hexInputError && (
        <p className="text-destructive mt-1.5 text-sm">{hexInputError}</p>
      )}
    </div>
  );
}

function ColorFormatFields({
  alpha,
  colorFormat,
  colorValues,
  currentHexValue,
  handleHexChange,
  handleRgbChange,
  handleRgbaChange,
  handleHslChange,
  handleHslaChange,
}: {
  alpha: boolean;
  colorFormat: string;
  colorValues: ColorValues;
  currentHexValue: string;
  handleHexChange: (value: string) => void;
  handleRgbChange: (component: "r" | "g" | "b", value: string) => void;
  handleRgbaChange: (component: "r" | "g" | "b" | "a", value: string) => void;
  handleHslChange: (component: "h" | "s" | "l", value: string) => void;
  handleHslaChange: (component: "h" | "s" | "l" | "a", value: string) => void;
}) {
  if (colorFormat === "HEX" || colorFormat === "HEXA") {
    return (
      <Input
        className="h-7 w-[160px] rounded-sm text-sm"
        value={currentHexValue}
        onChange={(event) => handleHexChange(event.target.value)}
        placeholder={alpha ? "#FF0000FF" : "#FF0000"}
        maxLength={alpha ? 9 : 7}
      />
    );
  }

  if (colorFormat === "RGB") {
    return (
      <div className="flex items-center">
        <Input
          className="h-7 w-13 rounded-l-sm rounded-r-none text-center text-sm"
          value={colorValues.rgb.r}
          onChange={(event) => handleRgbChange("r", event.target.value)}
          placeholder="255"
          maxLength={3}
        />
        <Input
          className="h-7 w-13 rounded-none border-x-0 text-center text-sm"
          value={colorValues.rgb.g}
          onChange={(event) => handleRgbChange("g", event.target.value)}
          placeholder="255"
          maxLength={3}
        />
        <Input
          className="h-7 w-13 rounded-l-none rounded-r-sm text-center text-sm"
          value={colorValues.rgb.b}
          onChange={(event) => handleRgbChange("b", event.target.value)}
          placeholder="255"
          maxLength={3}
        />
      </div>
    );
  }

  if (colorFormat === "RGBA" && alpha && colorValues.rgba) {
    return (
      <div className="flex items-center">
        <Input
          className="h-7 w-10 rounded-l-sm rounded-r-none px-1 text-center text-sm"
          value={colorValues.rgba.r}
          onChange={(event) => handleRgbaChange("r", event.target.value)}
          placeholder="255"
          maxLength={3}
        />
        <Input
          className="h-7 w-10 rounded-none border-x-0 px-1 text-center text-sm"
          value={colorValues.rgba.g}
          onChange={(event) => handleRgbaChange("g", event.target.value)}
          placeholder="255"
          maxLength={3}
        />
        <Input
          className="h-7 w-10 rounded-none border-x-0 px-1 text-center text-sm"
          value={colorValues.rgba.b}
          onChange={(event) => handleRgbaChange("b", event.target.value)}
          placeholder="255"
          maxLength={3}
        />
        <Input
          className="h-7 w-10 rounded-l-none rounded-r-sm px-1 text-center text-sm"
          value={colorValues.rgba.a.toFixed(2)}
          onChange={(event) => handleRgbaChange("a", event.target.value)}
          placeholder="1.00"
          maxLength={4}
        />
      </div>
    );
  }

  if (colorFormat === "HSL") {
    return (
      <div className="flex items-center">
        <Input
          className="h-7 w-13 rounded-l-sm rounded-r-none text-center text-sm"
          value={colorValues.hsl.h}
          onChange={(event) => handleHslChange("h", event.target.value)}
          placeholder="360"
          maxLength={3}
        />
        <Input
          className="h-7 w-13 rounded-none border-x-0 text-center text-sm"
          value={colorValues.hsl.s}
          onChange={(event) => handleHslChange("s", event.target.value)}
          placeholder="100"
          maxLength={3}
        />
        <Input
          className="h-7 w-13 rounded-l-none rounded-r-sm text-center text-sm"
          value={colorValues.hsl.l}
          onChange={(event) => handleHslChange("l", event.target.value)}
          placeholder="100"
          maxLength={3}
        />
      </div>
    );
  }

  if (colorFormat === "HSLA" && alpha && colorValues.hsla) {
    return (
      <div className="flex items-center">
        <Input
          className="h-7 w-10 rounded-l-sm rounded-r-none px-1 text-center text-sm"
          value={colorValues.hsla.h}
          onChange={(event) => handleHslaChange("h", event.target.value)}
          placeholder="360"
          maxLength={3}
        />
        <Input
          className="h-7 w-10 rounded-none border-x-0 px-1 text-center text-sm"
          value={colorValues.hsla.s}
          onChange={(event) => handleHslaChange("s", event.target.value)}
          placeholder="100"
          maxLength={3}
        />
        <Input
          className="h-7 w-10 rounded-none border-x-0 px-1 text-center text-sm"
          value={colorValues.hsla.l}
          onChange={(event) => handleHslaChange("l", event.target.value)}
          placeholder="100"
          maxLength={3}
        />
        <Input
          className="h-7 w-10 rounded-l-none rounded-r-sm px-1 text-center text-sm"
          value={colorValues.hsla.a.toFixed(2)}
          onChange={(event) => handleHslaChange("a", event.target.value)}
          placeholder="1.00"
          maxLength={4}
        />
      </div>
    );
  }

  return null;
}

function getColorValues(value: string, alpha: boolean): ColorValues {
  if (alpha) {
    const rgba = hexToRgba(value);
    const hsla = rgbaToHsla(rgba.r, rgba.g, rgba.b, rgba.a);
    return {
      hex: value.length === 9 ? value.slice(0, 7) : value,
      rgb: { r: rgba.r, g: rgba.g, b: rgba.b },
      hsl: rgbToHsl(rgba.r, rgba.g, rgba.b),
      rgba,
      hsla,
    };
  }

  const rgb = hexToRgb(value);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return {
    hex: value.toUpperCase(),
    rgb,
    hsl,
  };
}

function isEyeDropperAvailable() {
  return typeof window !== "undefined" && Boolean(window.EyeDropper);
}
