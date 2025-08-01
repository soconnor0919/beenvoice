"use client";

import { useEffect, useState } from "react";

interface UseCountUpOptions {
  /** The target number to count up to */
  end: number;
  /** The starting number (default: 0) */
  start?: number;
  /** Duration of the animation in milliseconds (default: 1000) */
  duration?: number;
  /** Delay before starting the animation in milliseconds (default: 0) */
  delay?: number;
  /** Custom easing function */
  easing?: (t: number) => number;
  /** Whether to format as currency */
  currency?: boolean;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Whether to use number separators (default: true) */
  useGrouping?: boolean;
}

/**
 * Hook for animating numbers with a counting up effect
 */
export function useCountUp({
  end,
  start = 0,
  duration = 1000,
  delay = 0,
  easing = (t: number) => t * t * (3 - 2 * t), // smooth step
  currency = false,
  decimals = 0,
  useGrouping = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Reset when end value changes
    setCount(start);
    setIsAnimating(false);

    const startAnimation = () => {
      setIsAnimating(true);
      const startTime = Date.now();
      const range = end - start;

      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          const easedProgress = easing(progress);
          const currentCount = start + range * easedProgress;
          setCount(currentCount);
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(updateCount);
    };

    const timeoutId = setTimeout(startAnimation, delay);
    return () => clearTimeout(timeoutId);
  }, [end, start, duration, delay, easing]);

  // Format the number for display
  const formatNumber = (num: number): string => {
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping,
    };

    if (currency) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        ...options,
      }).format(num);
    }

    return new Intl.NumberFormat("en-US", options).format(num);
  };

  return {
    /** The current animated value */
    count,
    /** Formatted display value */
    displayValue: formatNumber(count),
    /** Whether the animation is currently running */
    isAnimating,
    /** Reset the animation */
    reset: () => {
      setCount(start);
      setIsAnimating(false);
    },
  };
}

/**
 * Preset for currency counting animation
 */
export function useCurrencyCountUp(
  end: number,
  options?: Omit<UseCountUpOptions, "currency" | "decimals" | "end">,
) {
  return useCountUp({
    ...options,
    end,
    currency: true,
    decimals: 2,
  });
}

/**
 * Preset for integer counting animation
 */
export function useIntegerCountUp(
  end: number,
  options?: Omit<UseCountUpOptions, "decimals" | "end">,
) {
  return useCountUp({
    ...options,
    end,
    decimals: 0,
  });
}
