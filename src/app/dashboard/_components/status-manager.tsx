"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  Send,
  DollarSign,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  RefreshCw,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  getEffectiveInvoiceStatus,
  isInvoiceOverdue,
  getDaysPastDue,
  getStatusConfig,
} from "~/lib/invoice-status";
import type { StoredInvoiceStatus } from "~/types/invoice";

interface StatusManagerProps {
  invoiceId: string;
  currentStatus: StoredInvoiceStatus;
  dueDate: Date;
  clientEmail?: string | null;
  onStatusChange?: () => void;
}

const statusIconConfig = {
  draft: FileText,
  sent: Send,
  paid: CheckCircle,
  overdue: AlertCircle,
};

export function StatusManager({
  invoiceId,
  currentStatus,
  dueDate,
  clientEmail,
  onStatusChange,
}: StatusManagerProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const utils = api.useUtils();

  const updateStatus = api.invoices.updateStatus.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      void utils.invoices.getById.invalidate({ id: invoiceId });
      void utils.invoices.getAll.invalidate();
      onStatusChange?.();
      setIsChangingStatus(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update status");
      setIsChangingStatus(false);
    },
  });

  const sendEmail = api.email.sendInvoice.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      void utils.invoices.getById.invalidate({ id: invoiceId });
      void utils.invoices.getAll.invalidate();
      onStatusChange?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleStatusUpdate = async (newStatus: StoredInvoiceStatus) => {
    setIsChangingStatus(true);
    updateStatus.mutate({
      id: invoiceId,
      status: newStatus,
    });
  };

  const handleSendEmail = () => {
    sendEmail.mutate({ invoiceId });
  };

  const effectiveStatus = getEffectiveInvoiceStatus(currentStatus, dueDate);
  const isOverdue = isInvoiceOverdue(currentStatus, dueDate);
  const daysPastDue = getDaysPastDue(currentStatus, dueDate);
  const statusConfig = getStatusConfig(currentStatus, dueDate);

  const StatusIcon = statusIconConfig[effectiveStatus];

  const getAvailableActions = () => {
    const actions = [];

    switch (effectiveStatus) {
      case "draft":
        if (clientEmail) {
          actions.push({
            key: "send",
            label: "Send Invoice",
            action: handleSendEmail,
            variant: "default" as const,
            icon: Send,
            disabled: sendEmail.isPending,
          });
        }
        actions.push({
          key: "markPaid",
          label: "Mark as Paid",
          action: () => handleStatusUpdate("paid"),
          variant: "secondary" as const,
          icon: DollarSign,
          disabled: isChangingStatus,
        });
        break;

      case "sent":
        actions.push({
          key: "markPaid",
          label: "Mark as Paid",
          action: () => handleStatusUpdate("paid"),
          variant: "default" as const,
          icon: DollarSign,
          disabled: isChangingStatus,
        });
        if (clientEmail) {
          actions.push({
            key: "resend",
            label: "Resend Invoice",
            action: handleSendEmail,
            variant: "outline" as const,
            icon: Send,
            disabled: sendEmail.isPending,
          });
        }
        actions.push({
          key: "backToDraft",
          label: "Back to Draft",
          action: () => handleStatusUpdate("draft"),
          variant: "outline" as const,
          icon: FileText,
          disabled: isChangingStatus,
        });
        break;

      case "overdue":
        actions.push({
          key: "markPaid",
          label: "Mark as Paid",
          action: () => handleStatusUpdate("paid"),
          variant: "default" as const,
          icon: DollarSign,
          disabled: isChangingStatus,
        });
        if (clientEmail) {
          actions.push({
            key: "resend",
            label: "Resend Invoice",
            action: handleSendEmail,
            variant: "outline" as const,
            icon: Send,
            disabled: sendEmail.isPending,
          });
        }
        actions.push({
          key: "backToSent",
          label: "Mark as Sent",
          action: () => handleStatusUpdate("sent"),
          variant: "outline" as const,
          icon: Clock,
          disabled: isChangingStatus,
        });
        break;

      case "paid":
        // Paid invoices can be reverted if needed (rare cases)
        actions.push({
          key: "revert",
          label: "Revert to Sent",
          action: () => handleStatusUpdate("sent"),
          variant: "outline" as const,
          icon: RefreshCw,
          disabled: isChangingStatus,
          requireConfirmation: true,
        });
        break;
    }

    return actions;
  };

  const actions = getAvailableActions();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StatusIcon className="h-5 w-5" />
          Invoice Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status Display */}
        <div className="flex items-center gap-3">
          <Badge className={statusConfig.color} variant="secondary">
            {statusConfig.label}
          </Badge>
          <span className="text-muted-foreground text-sm">
            {statusConfig.description}
          </span>
        </div>

        {/* Overdue Warning */}
        {isOverdue && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {daysPastDue} day{daysPastDue !== 1 ? "s" : ""} overdue
            </span>
          </div>
        )}

        {/* Due Date Info */}
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>
            Due:{" "}
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(dueDate))}
          </span>
        </div>

        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">
              Available Actions:
            </div>
            <div className="grid gap-2">
              {actions.map((action) => {
                const ActionIcon = action.icon;

                if (action.requireConfirmation) {
                  return (
                    <AlertDialog key={action.key}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={action.variant}
                          size="sm"
                          disabled={action.disabled}
                          className="w-full justify-start"
                        >
                          <ActionIcon className="mr-2 h-4 w-4" />
                          {action.label}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirm Status Change
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to change this invoice status?
                            This action may affect your records.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={action.action}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  );
                }

                return (
                  <Button
                    key={action.key}
                    variant={action.variant}
                    size="sm"
                    onClick={action.action}
                    disabled={action.disabled}
                    className="w-full justify-start"
                  >
                    {action.disabled &&
                    (action.key === "send" || action.key === "resend") ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : action.disabled &&
                      (action.key === "markPaid" ||
                        action.key === "backToDraft" ||
                        action.key === "backToSent") ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ActionIcon className="mr-2 h-4 w-4" />
                    )}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* No Email Warning */}
        {!clientEmail && effectiveStatus !== "paid" && (
          <div className="rounded-lg bg-amber-50 p-3 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                No email address on file for this client
              </span>
            </div>
            <p className="mt-1 text-xs">
              Add an email address to the client to enable sending invoices.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
