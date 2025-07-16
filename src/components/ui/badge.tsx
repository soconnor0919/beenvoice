import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-slate-300 bg-slate-200 text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200",
        secondary:
          "border-slate-300 bg-slate-200/80 text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-700/80 dark:text-slate-300",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 border-slate-300 bg-transparent text-slate-700 dark:border-slate-600 dark:text-slate-300",
        success: "border-transparent bg-status-success [a&]:hover:opacity-90",
        warning: "border-transparent bg-status-warning [a&]:hover:opacity-90",
        error: "border-transparent bg-status-error [a&]:hover:opacity-90",
        info: "border-transparent bg-status-info [a&]:hover:opacity-90",
        // Outlined variants for status badges
        "outline-draft":
          "border-gray-400 text-gray-600 dark:border-gray-500 dark:text-gray-300 bg-transparent",
        "outline-sent":
          "border-blue-400 text-blue-600 dark:border-blue-500 dark:text-blue-300 bg-transparent",
        "outline-paid":
          "border-green-400 text-green-600 dark:border-green-500 dark:text-green-300 bg-transparent",
        "outline-overdue":
          "border-red-400 text-red-600 dark:border-red-500 dark:text-red-300 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
