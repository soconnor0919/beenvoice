"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

interface FloatingActionBarProps {
  /** Ref to the element that triggers visibility when scrolled out of view */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Title text displayed on the left (deprecated - use leftContent instead) */
  title?: string;
  /** Custom content to display on the left */
  leftContent?: React.ReactNode;
  /** Action buttons to display on the right */
  children: React.ReactNode;
  /** Additional className for styling */
  className?: string;
  /** Whether to show the floating bar (for manual control) */
  show?: boolean;
  /** Callback when visibility changes */
  onVisibilityChange?: (visible: boolean) => void;
}

export function FloatingActionBar({
  triggerRef,
  title,
  leftContent,
  children,
  className,
  show,
  onVisibilityChange,
}: FloatingActionBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const floatingRef = useRef<HTMLDivElement>(null);
  const previousVisibleRef = useRef(false);

  useEffect(() => {
    // If show prop is provided, use it instead of auto-detection
    if (show !== undefined) {
      setIsVisible(show);
      onVisibilityChange?.(show);
      return;
    }

    const handleScroll = () => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom >= 0;

      // Show floating bar when trigger element is out of view
      const shouldShow = !isInView;

      if (shouldShow !== previousVisibleRef.current) {
        previousVisibleRef.current = shouldShow;
        setIsVisible(shouldShow);
        onVisibilityChange?.(shouldShow);
      }
    };

    // Use IntersectionObserver for better detection
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          const shouldShow = !entry.isIntersecting;
          if (shouldShow !== previousVisibleRef.current) {
            previousVisibleRef.current = shouldShow;
            setIsVisible(shouldShow);
            onVisibilityChange?.(shouldShow);
          }
        }
      },
      {
        // Trigger when element is completely out of view
        threshold: 0,
        rootMargin: "0px 0px -100% 0px",
      },
    );

    // Start observing when trigger element is available
    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    // Also add scroll listener as fallback
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial state
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [triggerRef, show, onVisibilityChange]);

  if (!isVisible) return null;

  return (
    <div
      ref={floatingRef}
      className={cn(
        "border-border/40 bg-background/60 animate-in slide-in-from-bottom-4 sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150 duration-300",
        className,
      )}
    >
      <div className="flex-1">
        {leftContent || (
          <p className="text-muted-foreground text-sm">{title}</p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">{children}</div>
    </div>
  );
}
