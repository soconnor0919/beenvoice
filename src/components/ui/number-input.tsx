"use client";

import * as React from "react";
import { cn } from "~/lib/utils";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  prefix?: string;
  suffix?: string;
  width?: "auto" | "full";
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  placeholder = "0",
  className,
  disabled = false,
  id,
  prefix,
  suffix,
  width = "auto",
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = React.useState(
    value ? value.toFixed(2) : "0.00",
  );

  React.useEffect(() => {
    setDisplayValue(value ? value.toFixed(2) : "0.00");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    if (inputValue === "") {
      onChange(0);
      return;
    }
    const newValue = parseFloat(inputValue);
    if (!isNaN(newValue)) {
      onChange(Math.round(newValue * 100) / 100);
    }
  };

  const handleBlur = () => {
    const numValue = parseFloat(displayValue) || 0;
    const formattedValue = numValue.toFixed(2);
    setDisplayValue(formattedValue);
    onChange(numValue);
  };

  const handleIncrement = () => {
    if (disabled) return;
    onChange((value || 0) + step);
  };

  const handleDecrement = () => {
    if (disabled) return;
    onChange(Math.max(min, (value || 0) - step));
  };

  const widthClass = width === "full" ? "w-full" : "w-24";

  return (
    <div
      className={cn(
        "border-input bg-background ring-offset-background flex h-9 items-center justify-center rounded-md border px-2 text-sm",
        widthClass,
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
      >
        −
      </button>
      <div className="flex flex-1 items-center justify-center">
        {prefix && (
          <span className="text-muted-foreground text-xs">{prefix}</span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="w-16 border-0 bg-transparent text-center outline-none focus-visible:ring-0"
        />
        {suffix && (
          <span className="text-muted-foreground text-xs">{suffix}</span>
        )}
      </div>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && value >= max)}
        className="text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}
