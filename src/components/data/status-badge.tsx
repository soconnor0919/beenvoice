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
  draft:
    "border-slate-400 bg-slate-100/90 text-slate-800 shadow-md dark:border-slate-600 dark:bg-slate-700/90 dark:text-slate-200",
  sent: "border-blue-400 bg-blue-100/90 text-blue-800 shadow-md dark:border-blue-600 dark:bg-blue-700/90 dark:text-blue-200",
  paid: "border-green-400 bg-green-100/90 text-green-800 shadow-md dark:border-green-600 dark:bg-green-700/90 dark:text-green-200",
  overdue:
    "border-red-400 bg-red-100/90 text-red-800 shadow-md dark:border-red-600 dark:bg-red-700/90 dark:text-red-200",
  success:
    "border-green-400 bg-green-100/90 text-green-800 shadow-md dark:border-green-600 dark:bg-green-700/90 dark:text-green-200",
  warning:
    "border-yellow-400 bg-yellow-100/90 text-yellow-800 shadow-md dark:border-yellow-600 dark:bg-yellow-700/90 dark:text-yellow-200",
  error:
    "border-red-400 bg-red-100/90 text-red-800 shadow-md dark:border-red-600 dark:bg-red-700/90 dark:text-red-200",
  info: "border-blue-400 bg-blue-100/90 text-blue-800 shadow-md dark:border-blue-600 dark:bg-blue-700/90 dark:text-blue-200",
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
    <Badge className={cn(statusClass, className)} {...props}>
      {label}
    </Badge>
  );
}

export { type StatusType };
