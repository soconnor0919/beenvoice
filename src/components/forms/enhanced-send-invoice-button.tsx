"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Send, Loader2, Mail, MailCheck } from "lucide-react";

interface EnhancedSendInvoiceButtonProps {
  invoiceId: string;
  variant?: "default" | "outline" | "ghost" | "icon";
  className?: string;
  showResend?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export function EnhancedSendInvoiceButton({
  invoiceId,
  variant = "outline",
  className,
  showResend = false,
  size = "default",
}: EnhancedSendInvoiceButtonProps) {
  const router = useRouter();

  // Fetch invoice data
  const { data: invoiceData, isLoading: invoiceLoading } =
    api.invoices.getById.useQuery({
      id: invoiceId,
    });

  // Check if client has email
  const hasClientEmail =
    invoiceData?.client?.email && invoiceData.client.email.trim() !== "";

  const handleSendClick = () => {
    router.push(`/dashboard/invoices/${invoiceId}/send`);
  };

  // Icon variant for compact display
  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={className}
        disabled={invoiceLoading || !hasClientEmail}
        onClick={handleSendClick}
        title={
          !hasClientEmail
            ? "Client has no email address"
            : showResend
              ? "Resend Invoice"
              : "Send Invoice"
        }
      >
        {invoiceLoading ? (
          <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
        ) : hasClientEmail ? (
          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
        ) : (
          <Mail className="h-3 w-3 opacity-50 sm:h-4 sm:w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`shadow-sm ${className}`}
      disabled={invoiceLoading || !hasClientEmail}
      onClick={handleSendClick}
      data-testid="enhanced-send-invoice-button"
    >
      {invoiceLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : !hasClientEmail ? (
        <>
          <Mail className="mr-2 h-4 w-4 opacity-50" />
          <span>No Email Address</span>
        </>
      ) : (
        <>
          {invoiceData?.status === "sent" ? (
            <MailCheck className="mr-2 h-4 w-4" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          <span>{showResend ? "Resend Invoice" : "Send Invoice"}</span>
        </>
      )}
    </Button>
  );
}
