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

import { useSidebar } from "~/components/layout/sidebar-provider";

export function FloatingActionBar({
  leftContent,
  children,
  className,
}: FloatingActionBarProps) {
  const [isDocked, setIsDocked] = useState(false);
  const { isCollapsed } = useSidebar();

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
        "fixed right-0 z-50 transition-all duration-300 ease-in-out",
        // Safe area and sidebar adjustments
        "pb-safe-area-inset-bottom left-0",
        isCollapsed ? "md:left-24" : "md:left-[18rem]",
        // Conditional centering based on dock state
        isDocked ? "flex justify-center" : "",
        // Dynamic bottom positioning
        isDocked ? "bottom-4" : "bottom-0",
        // Add entrance animation
        "animate-slide-in-bottom",
        className,
      )}
    >
      {/* Content container - full width when floating, content width when docked */}
      <div
        className={cn(
          "w-full transition-transform duration-300",
          isDocked ? "mx-auto mb-0 px-4" : "mb-4 px-4",
        )}
      >
        <Card className="hover-lift bg-card border-border border shadow-lg">
          <CardContent className="flex items-center justify-between p-4">
            {/* Left content */}
            {leftContent && (
              <div className="text-card-foreground animate-fade-in flex flex-1 items-center gap-3">
                {leftContent}
              </div>
            )}

            {/* Right actions */}
            <div className="animate-fade-in animate-delay-100 flex items-center gap-2 sm:gap-3">
              {children}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
