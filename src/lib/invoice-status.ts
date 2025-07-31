import type {
  StoredInvoiceStatus,
  EffectiveInvoiceStatus,
} from "~/types/invoice";

// Types are now imported from ~/types/invoice

/**
 * Calculate the effective status of an invoice including overdue computation
 */
export function getEffectiveInvoiceStatus(
  storedStatus: StoredInvoiceStatus,
  dueDate: Date | string,
): EffectiveInvoiceStatus {
  // If already paid, status is always paid regardless of due date
  if (storedStatus === "paid") {
    return "paid";
  }

  // If draft, status is always draft
  if (storedStatus === "draft") {
    return "draft";
  }

  // For sent invoices, check if overdue
  if (storedStatus === "sent") {
    const today = new Date();
    const due = new Date(dueDate);

    // Set both dates to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today ? "overdue" : "sent";
  }

  return storedStatus;
}

/**
 * Check if an invoice is overdue
 */
export function isInvoiceOverdue(
  storedStatus: StoredInvoiceStatus,
  dueDate: Date | string,
): boolean {
  return getEffectiveInvoiceStatus(storedStatus, dueDate) === "overdue";
}

/**
 * Get days past due (returns 0 if not overdue)
 */
export function getDaysPastDue(
  storedStatus: StoredInvoiceStatus,
  dueDate: Date | string,
): number {
  if (!isInvoiceOverdue(storedStatus, dueDate)) {
    return 0;
  }

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Status configuration for UI display
 */
export const statusConfig = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    description: "Invoice is being prepared",
  },
  sent: {
    label: "Sent",
    color: "bg-primary/10 text-primary",
    description: "Invoice sent to client",
  },
  paid: {
    label: "Paid",
    color: "bg-primary/10 text-primary",
    description: "Payment received",
  },
  overdue: {
    label: "Overdue",
    color: "bg-destructive/10 text-destructive",
    description: "Payment is overdue",
  },
} as const;

/**
 * Get status configuration for display
 */
export function getStatusConfig(
  storedStatus: StoredInvoiceStatus,
  dueDate: Date | string,
) {
  const effectiveStatus = getEffectiveInvoiceStatus(storedStatus, dueDate);
  return statusConfig[effectiveStatus];
}

/**
 * Get valid status transitions from current stored status
 */
export function getValidStatusTransitions(
  currentStatus: StoredInvoiceStatus,
): StoredInvoiceStatus[] {
  switch (currentStatus) {
    case "draft":
      return ["sent", "paid"]; // Can send or mark paid directly
    case "sent":
      return ["paid", "draft"]; // Can mark paid or revert to draft
    case "paid":
      return ["sent"]; // Can revert to sent if needed (rare cases)
    default:
      return [];
  }
}

/**
 * Check if a status transition is valid
 */
export function isValidStatusTransition(
  from: StoredInvoiceStatus,
  to: StoredInvoiceStatus,
): boolean {
  const validTransitions = getValidStatusTransitions(from);
  return validTransitions.includes(to);
}
