"use client";

import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

type IconName = "DollarSign" | "Clock" | "Users" | "TrendingDown";

interface AnimatedStatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  iconName: IconName;
  description: string;
  delay?: number;
  isCurrency?: boolean;
  numericValue?: number;
}

const iconMap = {
  DollarSign,
  Clock,
  Users,
  TrendingDown,
} as const;

export function AnimatedStatsCard({
  title,
  value,
  change,
  trend,
  iconName,
  description,
  delay = 0,
  isCurrency = false,
  numericValue,
}: AnimatedStatsCardProps) {
  const Icon = iconMap[iconName];
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const isPositive = trend === "up";

  // For now, always use the formatted value prop to ensure correct display
  // Animation can be added back once the basic display is working correctly
  const displayValue = value;

  // Suppress unused parameter warnings for now
  void delay;
  void isCurrency;
  void numericValue;

  return (
    <Card className="stats-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Icon className="text-muted-foreground h-5 w-5" />
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
          </div>
          <div
            className="flex items-center space-x-1 text-xs"
            style={{
              color: isPositive
                ? "oklch(var(--chart-2))"
                : "oklch(var(--chart-3))",
            }}
          >
            <TrendIcon className="h-3 w-3" />
            <span>{change}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="animate-count-up text-2xl font-bold">{displayValue}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
