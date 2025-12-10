"use client";

import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  animated?: boolean;
}

export function Logo({ className, size = "md", animated = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
    xl: "text-5xl",
    icon: "text-2xl",
  };

  if (!animated) {
    return <LogoContent className={className} size={size} sizeClasses={sizeClasses} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className={cn("flex items-center font-mono", sizeClasses[size], className)}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.02, duration: 0.05, ease: "easeOut" }}
        className="text-primary font-bold tracking-tight"
      >
        $
      </motion.span>
      {size !== "icon" && (
        <>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.03, duration: 0.05, ease: "easeOut" }}
            className="inline-block w-1" // Reduced from w-2 to w-1 (half space)
          ></motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.04, duration: 0.05, ease: "easeOut" }}
            className="text-foreground font-bold tracking-tight"
          >
            been
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.06, duration: 0.05, ease: "easeOut" }}
            className="text-foreground/70 font-bold tracking-tight"
          >
            voice
          </motion.span>
        </>
      )}
    </motion.div>
  );
}

function LogoContent({
  className,
  size,
  sizeClasses,
}: {
  className?: string;
  size: "sm" | "md" | "lg" | "xl" | "icon";
  sizeClasses: Record<string, string>;
}) {
  return (
    <div className={cn("flex items-center font-mono", sizeClasses[size], className)}>
      <span className="text-primary font-bold tracking-tight">$</span>
      {size !== "icon" && (
        <>
          <span className="inline-block w-1"></span>
          <span className="text-foreground font-bold tracking-tight">been</span>
          <span className="text-foreground/70 font-bold tracking-tight">voice</span>
        </>
      )}
    </div>
  );
}
