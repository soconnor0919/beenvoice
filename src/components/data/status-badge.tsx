import * as React from "react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

type StatusType =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "success"
  | "warning"
  | "error"
  | "info";

interface StatusBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant"> {
  status: StatusType;
  children?: React.ReactNode;
}

const statusClassMap: Record<StatusType, string> = {
  draft: "border-muted-foreground/40 bg-muted text-muted-foreground shadow-sm",
  sent: "border-primary/40 bg-primary/10 text-primary shadow-sm",
  paid: "border-primary/40 bg-primary/10 text-primary shadow-sm",
  overdue: "border-destructive/40 bg-destructive/10 text-destructive shadow-sm",
  success: "border-primary/40 bg-primary/10 text-primary shadow-sm",
  warning:
    "border-muted-foreground/40 bg-muted text-muted-foreground shadow-sm",
  error: "border-destructive/40 bg-destructive/10 text-destructive shadow-sm",
  info: "border-primary/40 bg-primary/10 text-primary shadow-sm",
};

const statusLabelMap: Record<StatusType, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Info",
};

export function StatusBadge({
  status,
  children,
  className,
  ...props
}: StatusBadgeProps) {
  const statusClass = statusClassMap[status];
  const label = children ?? statusLabelMap[status];

  return (
    <Badge
      className={cn(
        statusClass,
        "transition-all duration-200 hover:scale-105",
        status === "sent" && "animate-pulse",
        className,
      )}
      {...props}
    >
      {label}
    </Badge>
  );
}

export { type StatusType };
