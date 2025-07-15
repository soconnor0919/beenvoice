import * as React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

const variantStyles = {
  default: {
    icon: "text-foreground",
    background: "bg-muted/50",
  },
  success: {
    icon: "text-status-success",
    background: "bg-status-success-muted",
  },
  warning: {
    icon: "text-status-warning",
    background: "bg-status-warning-muted",
  },
  error: {
    icon: "text-status-error",
    background: "bg-status-error-muted",
  },
  info: {
    icon: "text-status-info",
    background: "bg-status-info-muted",
  },
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={cn(
        "border-0 shadow-md transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive
                      ? "text-status-success"
                      : "text-status-error",
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground text-xs">{description}</p>
            )}
          </div>
          {Icon && (
            <div className={cn("rounded-full p-3", styles.background)}>
              <Icon className={cn("h-6 w-6", styles.icon)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCardSkeleton() {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="bg-muted mb-2 h-4 w-1/2 rounded"></div>
          <div className="bg-muted mb-2 h-8 w-3/4 rounded"></div>
          <div className="bg-muted h-3 w-1/3 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}
