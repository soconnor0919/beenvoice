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
  draft: "status-badge-draft",
  sent: "status-badge-sent",
  paid: "status-badge-paid",
  overdue: "status-badge-overdue",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  info: "badge-features",
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
  const label = children || statusLabelMap[status];

  return (
    <Badge className={cn(statusClass, className)} {...props}>
      {label}
    </Badge>
  );
}

export { type StatusType };
