import * as React from "react";
import { Badge, type badgeVariants } from "./badge";
import { type VariantProps } from "class-variance-authority";

type StatusType = "draft" | "sent" | "paid" | "overdue" | "success" | "warning" | "error" | "info";

interface StatusBadgeProps extends Omit<React.ComponentProps<typeof Badge>, "variant"> {
  status: StatusType;
  children?: React.ReactNode;
}

const statusVariantMap: Record<StatusType, VariantProps<typeof badgeVariants>["variant"]> = {
  draft: "secondary",
  sent: "info",
  paid: "success",
  overdue: "error",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
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

export function StatusBadge({ status, children, ...props }: StatusBadgeProps) {
  const variant = statusVariantMap[status];
  const label = children || statusLabelMap[status];

  return (
    <Badge variant={variant} {...props}>
      {label}
    </Badge>
  );
}

export { type StatusType };
