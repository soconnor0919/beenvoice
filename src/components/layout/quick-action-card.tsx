import * as React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "info" | "warning" | "purple";
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const variantStyles = {
  default: {
    icon: "text-foreground",
    background: "bg-muted/50",
    hoverBackground: "group-hover:bg-muted/70",
  },
  success: {
    icon: "text-status-success",
    background: "bg-status-success-muted",
    hoverBackground: "group-hover:bg-status-success-muted/70",
  },
  info: {
    icon: "text-status-info",
    background: "bg-status-info-muted",
    hoverBackground: "group-hover:bg-status-info-muted/70",
  },
  warning: {
    icon: "text-status-warning",
    background: "bg-status-warning-muted",
    hoverBackground: "group-hover:bg-status-warning-muted/70",
  },
  purple: {
    icon: "text-purple-600",
    background: "bg-purple-100 dark:bg-purple-900/30",
    hoverBackground:
      "group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50",
  },
};

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  variant = "default",
  className,
  onClick,
  children,
}: QuickActionCardProps) {
  const styles = variantStyles[variant];

  const content = (
    <CardContent className="p-6 text-center">
      <div
        className={cn(
          "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
          styles.background,
          styles.hoverBackground,
        )}
      >
        <Icon className={cn("h-6 w-6", styles.icon)} />
      </div>
      <h3 className="font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      )}
    </CardContent>
  );

  if (children) {
    return (
      <Card
        className={cn(
          "group cursor-pointer border-0 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg",
          className,
        )}
      >
        {children}
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group cursor-pointer border-0 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg",
        className,
      )}
      onClick={onClick}
    >
      {content}
    </Card>
  );
}

export function QuickActionCardSkeleton() {
  return (
    <Card className="card-primary">
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="bg-muted mx-auto mb-3 h-12 w-12 rounded-full"></div>
          <div className="bg-muted mx-auto mb-2 h-4 w-2/3 rounded"></div>
          <div className="bg-muted mx-auto h-3 w-1/2 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}
