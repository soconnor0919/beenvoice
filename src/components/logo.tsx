import { cn } from "~/lib/utils";
import { CircleDollarSign } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <CircleDollarSign className="w-6 h-6 text-green-500"/>
      <div className="flex items-center">
        <span
          className={cn(
            "bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 bg-clip-text font-bold tracking-tight text-transparent",
            sizeClasses[size],
          )}
        >
          been
        </span>
        <span
          className={cn(
            "font-semibold tracking-wide text-gray-800",
            sizeClasses[size],
          )}
        >
          voice
        </span>
      </div>
    </div>
  );
}
