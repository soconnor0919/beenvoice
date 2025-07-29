"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Send, Loader2 } from "lucide-react";

interface SendInvoiceButtonProps {
  invoiceId: string;
  variant?: "default" | "outline" | "ghost" | "icon";
  className?: string;
  showResend?: boolean;
}

export function SendInvoiceButton({
  invoiceId,
  variant = "outline",
  className,
  showResend = false,
}: SendInvoiceButtonProps) {
  const [isSending, setIsSending] = useState(false);

  // Get utils for cache invalidation
  const utils = api.useUtils();

  // Use the new email API mutation
  const sendInvoiceMutation = api.email.sendInvoice.useMutation({
    onSuccess: (data) => {
      // Show detailed success message with delivery info
      toast.success(data.message, {
        description: `Email ID: ${data.emailId}`,
        duration: 5000,
      });

      // Refresh invoice data to show updated status
      void utils.invoices.getById.invalidate({ id: invoiceId });
    },
    onError: (error) => {
      // Enhanced error handling with specific error types
      console.error("Email send error:", error);

      let errorMessage = "Failed to send invoice email";
      let errorDescription = "";

      if (error.message.includes("Invalid recipient")) {
        errorMessage = "Invalid Email Address";
        errorDescription =
          "Please check the client's email address and try again.";
      } else if (error.message.includes("domain not verified")) {
        errorMessage = "Email Configuration Issue";
        errorDescription = "Please contact support to configure email sending.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Too Many Emails";
        errorDescription = "Please wait a moment before sending another email.";
      } else if (error.message.includes("no email address")) {
        errorMessage = "No Email Address";
        errorDescription = "This client doesn't have an email address on file.";
      } else {
        errorDescription = error.message;
      }

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 6000,
      });
    },
  });

  const handleSendInvoice = async () => {
    if (isSending) return;

    setIsSending(true);

    try {
      await sendInvoiceMutation.mutateAsync({
        invoiceId,
      });
    } catch (error) {
      // Error is already handled by the mutation's onError
      console.error("Send invoice error:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        onClick={handleSendInvoice}
        disabled={isSending}
        variant="ghost"
        size="sm"
        className={className}
      >
        {isSending ? (
          <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
        ) : (
          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSendInvoice}
      disabled={isSending}
      variant={variant}
      size="default"
      className={`w-full shadow-sm ${className}`}
      data-testid="send-invoice-button"
    >
      {isSending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Sending Email...</span>
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          <span>{showResend ? "Resend Invoice" : "Send Invoice"}</span>
        </>
      )}
    </Button>
  );
}
