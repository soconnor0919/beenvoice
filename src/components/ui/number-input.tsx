"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Minus, Plus } from "lucide-react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  placeholder = "0",
  disabled = false,
  className,
  prefix,
  suffix,
  id,
  name,
  "aria-label": ariaLabel,
}: NumberInputProps) {
  const [inputValue, setInputValue] = React.useState(value.toString());

  // Update input when external value changes
  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max ?? Infinity);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);

    // Allow empty input for better UX
    if (inputVal === "") {
      onChange(0);
      return;
    }

    const numValue = parseFloat(inputVal);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(numValue, max ?? Infinity));
      onChange(clampedValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure the input shows the actual value on blur
    setInputValue(value.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && canIncrement) {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown" && canDecrement) {
      e.preventDefault();
      handleDecrement();
    }
  };

  const canDecrement = value > min;
  const canIncrement = !max || value < max;

  return (
    <div
      className={cn("relative flex items-center", className)}
      role="group"
      aria-label={
        ariaLabel || "Number input with increment and decrement buttons"
      }
    >
      {/* Prefix */}
      {prefix && (
        <div className="text-muted-foreground pointer-events-none absolute left-10 z-10 flex items-center text-sm">
          {prefix}
        </div>
      )}

      {/* Decrement Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || !canDecrement}
        onClick={handleDecrement}
        className={cn(
          "h-8 w-8 rounded-r-none border-r-0 p-0 transition-all duration-150",
          "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
          "dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30",
          "focus:z-10 focus:ring-2 focus:ring-emerald-500/20",
          !canDecrement && "cursor-not-allowed opacity-40",
        )}
        aria-label="Decrease value"
        tabIndex={disabled ? -1 : 0}
      >
        <Minus className="h-3 w-3" />
      </Button>

      {/* Input */}
      <Input
        id={id}
        name={name}
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        step={step}
        min={min}
        max={max}
        aria-label={ariaLabel}
        className={cn(
          "h-8 rounded-none border-x-0 text-center font-mono focus:z-10",
          "focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20",
          "dark:focus:border-emerald-600",
          prefix && "pl-12",
          suffix && "pr-12",
        )}
      />

      {/* Increment Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || !canIncrement}
        onClick={handleIncrement}
        className={cn(
          "h-8 w-8 rounded-l-none border-l-0 p-0 transition-all duration-150",
          "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
          "dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30",
          "focus:z-10 focus:ring-2 focus:ring-emerald-500/20",
          !canIncrement && "cursor-not-allowed opacity-40",
        )}
        aria-label="Increase value"
        tabIndex={disabled ? -1 : 0}
      >
        <Plus className="h-3 w-3" />
      </Button>

      {/* Suffix */}
      {suffix && (
        <div className="text-muted-foreground pointer-events-none absolute right-10 z-10 flex items-center text-sm">
          {suffix}
        </div>
      )}
    </div>
  );
}
