import * as React from "react";
import { Badge, type badgeVariants } from "~/components/ui/badge";
import { type VariantProps } from "class-variance-authority";

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

const statusVariantMap: Record<
  StatusType,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  draft: "outline-draft",
  sent: "outline-sent",
  paid: "outline-paid",
  overdue: "outline-overdue",
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
