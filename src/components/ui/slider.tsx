"use client";
/*
Category spacing edit requested, but I don’t have the file’s current line numbers or body available in this interaction to produce a safe minimal patch.

Please resend (or paste) the current contents (or at least the portion containing:
- valueToPct / log scale logic
- pct calculation
- tick positioning loop

Once I have the exact text, I will replace only the necessary lines to:
1. Remove log scale logic (valueToPct, logDenom, etc.)
2. Implement category spacing:
   const index = derivedTicks.indexOf(t);
   const posPct = (index / (derivedTicks.length - 1)) * 100;
3. Ensure snapping uses the existing tick list (already in place).
4. Remove now-unused variables (logDenom, useLogScale).

If you can provide ~50 lines around the current pct / tick rendering block I can return the precise edit block.

Alternatively, if you confirm the existing lines that define:
  const useLogScale ...
  const logDenom ...
  const valueToPct = ...
I will replace them with a simple linear category mapping:
  const valueToPct = (val: number) => {
    if (!derivedTicks.length) return 0;
    const i = derivedTicks.indexOf(val);
    if (i === -1) {
      // fallback: find closest
      const snapped = snapValue(val);
      return (derivedTicks.indexOf(snapped) / (derivedTicks.length - 1)) * 100;
    }
    return (i / (derivedTicks.length - 1)) * 100;
  };

Let me know and I’ll produce the exact patch in the required format.
*/

import * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Lightweight accessible single-thumb Slider with tick marks.
 * - Hides native thumb (uses custom thumb)
 * - Adds labeled tick marks
 * - Honors reduced-motion: locks to 1x and disables interaction
 */

export interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  announceValue?: boolean;
  formatValueText?: (value: number) => string;
  "aria-label"?: string;
  disabled?: boolean;
  className?: string;
  orientation?: "horizontal" | "vertical";
  /**
   * Provide a list of tick values (within min/max) to render markers.
   */
  ticks?: number[];
  /**
   * Optional formatter for tick labels (fall back to raw value).
   */
  formatTick?: (value: number) => string;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  function Slider(
    {
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      onValueCommit,
      announceValue = true,
      formatValueText,
      formatTick,
      ticks,
      "aria-label": ariaLabel,
      disabled,
      className,
      orientation = "horizontal",
    },
    ref,
  ) {
    // Detect reduced motion preference (user toggle adds class on <html>)
    const reducedMotion =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("user-reduce-motion");

    // Lock value to 1 when reduced motion & inside 0.25–4 range scenario
    const lockValue =
      reducedMotion && min <= 1 && max >= 1 && step <= 1 ? 1 : null;

    const isControlled = value !== undefined;
    const initial =
      lockValue ?? (isControlled ? value?.[0] : defaultValue?.[0]);
    const [internal, setInternal] = React.useState<number>(initial ?? min);

    // Track last emitted value to avoid redundant parent updates (prevents loops)
    const lastEmittedRef = React.useRef<number | null>(null);

    // Sync when controlled or when reduced-motion lock toggles
    React.useEffect(() => {
      if (lockValue !== null) {
        // Only update internal & emit if changed
        if (!isControlled && internal !== 1) {
          setInternal(1);
        }
        if (lastEmittedRef.current !== 1) {
          lastEmittedRef.current = 1;
          // Do NOT call onValueChange here to avoid infinite loops; parent
          // logic (provider) already enforces 1x on reduced motion toggle.
        }
      } else if (isControlled && value) {
        const next = value[0] ?? min;
        if (internal !== next) {
          setInternal(next);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isControlled, value, lockValue, min]);

    const currentValue =
      lockValue !== null ? 1 : isControlled ? (value?.[0] ?? min) : internal;

    // Category spacing: each defined tick receives equal horizontal spacing.
    // We treat ticks as discrete categories rather than using numeric/log scaling.
    const buildTicks = () =>
      ticks ?? (min === 0.25 && max === 4 ? [0.25, 0.5, 0.75, 1, 2, 3, 4] : []);

    let derivedTicks = buildTicks();

    // Ensure at least two ticks (fallback to min/max) to avoid divide-by-zero.
    if (derivedTicks.length < 2) {
      derivedTicks = [min, max];
    }

    const snapValue = (val: number) => {
      return derivedTicks.reduce(
        (closest, tick) =>
          Math.abs(tick - val) < Math.abs(closest - val) ? tick : closest,
        derivedTicks[0]!,
      );
    };

    // Map a value to percentage based on its (snapped) index in the tick list.
    const valueToPct = (val: number) => {
      const snapped = snapValue(val);
      const idx = derivedTicks.indexOf(snapped);
      if (idx <= 0) return 0;
      if (idx >= derivedTicks.length - 1) return 100;
      return (idx / (derivedTicks.length - 1)) * 100;
    };

    const pct = valueToPct(currentValue);

    const getValueText = (v: number) =>
      formatValueText ? formatValueText(v) : v.toString();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (lockValue !== null) return;
      const raw = Number(e.target.value);
      // Snap raw value to nearest tick (log scale visually, but input still linear)
      const snapped = snapValue(raw);
      if (!isControlled) setInternal(snapped);
      if (lastEmittedRef.current !== snapped) {
        lastEmittedRef.current = snapped;
        onValueChange?.([snapped]);
      }
    };

    const handleCommit = () => {
      if (lockValue !== null) return;
      onValueCommit?.([currentValue]);
    };

    // Use nullish coalescing for the disabled prop fallback, then combine with lockValue
    const effectiveDisabled = (disabled ?? false) || lockValue !== null;

    // (Derived ticks initialized earlier for category spacing)
    /**
     * Commit a value change (used by ticks & keyboard)
     */
    const commitValue = (val: number) => {
      if (lockValue !== null) return;
      if (!isControlled) setInternal(val);
      if (lastEmittedRef.current !== val) {
        lastEmittedRef.current = val;
        onValueChange?.([val]);
      }
      onValueCommit?.([val]);
    };
    const handleTickSelect = (val: number) => {
      if (effectiveDisabled) return;
      commitValue(val);
    };
    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (effectiveDisabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      let ratio = (e.clientX - rect.left) / rect.width;
      if (Number.isNaN(ratio)) return;
      ratio = Math.min(1, Math.max(0, ratio));
      const idx = Math.round(ratio * (derivedTicks.length - 1));
      const next = derivedTicks[idx]!;
      commitValue(next);
    };

    return (
      <div
        ref={ref}
        data-slot="slider-wrapper"
        className={cn(
          "relative flex w-full flex-col",
          orientation === "vertical" && "h-40 w-fit",
          effectiveDisabled && "cursor-not-allowed opacity-60",
          className,
        )}
        aria-disabled={effectiveDisabled}
      >
        {/* Track + fill + thumb */}
        <div className="relative h-6 w-full">
          <div className="absolute top-1/2 w-full -translate-y-1/2">
            <div
              className="bg-muted relative h-2 w-full cursor-pointer rounded-full"
              onClick={handleTrackClick}
              role="presentation"
              aria-hidden="true"
            >
              <div
                className="bg-primary absolute top-0 left-0 h-full rounded-full"
                style={{ width: `${pct}%` }}
              />
              {/* Custom thumb */}
              <div
                className={cn(
                  "border-border bg-background absolute top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border shadow-sm transition",
                  !effectiveDisabled &&
                    "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                )}
                style={{ left: `${pct}%` }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Native input overlay (thumb hidden) */}
          <input
            type="range"
            aria-label={ariaLabel}
            min={min}
            max={max}
            step={step}
            disabled={effectiveDisabled}
            value={currentValue}
            onChange={handleChange}
            onMouseUp={handleCommit}
            onTouchEnd={handleCommit}
            onKeyUp={(e) => {
              if (["Enter", " ", "Tab"].includes(e.key)) handleCommit();
            }}
            className={cn(
              "absolute top-0 left-0 h-6 w-full cursor-pointer appearance-none bg-transparent focus:outline-none",
              // Hide native thumb (WebKit)
              "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-transparent",
              // Firefox
              "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent",
              // Edge/IE (legacy)
              "[&::-ms-thumb]:appearance-none",
            )}
          />
        </div>

        {/* Tick Marks (interactive) */}
        {derivedTicks.length > 0 && (
          <div className="relative mt-2 h-8 w-full">
            {derivedTicks.map((t) => {
              const active = Math.abs(t - currentValue) < step / 2;
              const posPct = valueToPct(t); // category-based equal spacing
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleTickSelect(t)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleTickSelect(t);
                    }
                  }}
                  aria-label={`Set value to ${t}`}
                  aria-pressed={active}
                  disabled={effectiveDisabled}
                  tabIndex={0}
                  className={cn(
                    "focus-visible:ring-ring focus-visible:ring-offset-background absolute flex -translate-x-1/2 flex-col items-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    "select-none",
                    active && "cursor-default",
                    !active && !effectiveDisabled && "hover:opacity-80",
                    effectiveDisabled && "cursor-not-allowed",
                  )}
                  style={{ left: `${posPct}%`, background: "transparent" }}
                >
                  <div
                    className={cn(
                      "bg-border h-2 w-0.5 rounded-sm",
                      active && "bg-primary h-3",
                    )}
                  />
                  <div
                    className={cn(
                      "text-muted-foreground mt-1 text-[10px] leading-none whitespace-nowrap",
                      active && "text-primary font-medium",
                    )}
                    style={{
                      transform: "translateX(0)",
                      maxWidth: "3.5ch",
                    }}
                  >
                    {formatTick ? formatTick(t) : t}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Reduced motion note */}
        {lockValue !== null && (
          <p className="text-muted-foreground mt-1 text-xs">
            Animation speed locked at 1× (Reduced Motion enabled).
          </p>
        )}

        {announceValue && (
          <span aria-live="polite" className="sr-only">
            {getValueText(currentValue)}
          </span>
        )}
      </div>
    );
  },
);

export const SliderValue: React.FC<{
  value: number | number[] | undefined;
  formatAction?: (v: number) => string;
  className?: string;
}> = ({ value, formatAction = (v) => v.toString(), className }) => {
  if (value == null) return null;
  const vals = Array.isArray(value) ? value : [value];
  return (
    <div
      data-slot="slider-value"
      className={cn(
        "text-muted-foreground inline-flex min-w-[2rem] items-center justify-end text-xs tabular-nums",
        className,
      )}
    >
      {vals.map(formatAction).join(" – ")}
    </div>
  );
};
