"use client";

import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";

interface FloatingActionBarProps {
  /** Content to display on the left side */
  leftContent?: React.ReactNode;
  /** Action buttons to display on the right */
  children: React.ReactNode;
  /** Additional className for styling */
  className?: string;
}

export function FloatingActionBar({
  leftContent,
  children,
  className,
}: FloatingActionBarProps) {
  const [isDocked, setIsDocked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're truly at the bottom of the page
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      // Only dock when we're within 50px of the actual bottom AND there's content to scroll
      const hasScrollableContent = scrollHeight > clientHeight;
      const shouldDock = hasScrollableContent && distanceFromBottom <= 50;

      // If content is too small, keep it at bottom of viewport
      const contentTooSmall = scrollHeight <= clientHeight + 200;

      setIsDocked(shouldDock && !contentTooSmall);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        // Base positioning - always at bottom
        "fixed right-0 left-0 z-50",
        // Safe area and sidebar adjustments
        "pb-safe-area-inset-bottom md:left-[276px]",
        // Conditional centering based on dock state
        isDocked ? "flex justify-center" : "",
        // Dynamic bottom positioning
        isDocked ? "bottom-4" : "bottom-0",
        className,
      )}
    >
      {/* Content container - full width when floating, content width when docked */}
      <div
        className={cn(
          "w-full transition-all duration-300",
          isDocked ? "mx-auto  px-4 mb-0" : "px-4 mb-4",
        )}
      >
        <Card className="card-primary">
          <CardContent className="flex items-center justify-between p-4">
            {/* Left content */}
            {leftContent && (
              <div className="flex flex-1 items-center gap-3">
                {leftContent}
              </div>
            )}

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">{children}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
