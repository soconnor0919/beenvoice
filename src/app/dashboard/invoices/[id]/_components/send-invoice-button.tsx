"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { generateInvoicePDFBlob } from "~/lib/pdf-export";
import { Send, Loader2 } from "lucide-react";

interface SendInvoiceButtonProps {
  invoiceId: string;
  variant?: "default" | "outline" | "ghost" | "icon";
  className?: string;
}

export function SendInvoiceButton({
  invoiceId,
  variant = "outline",
  className,
}: SendInvoiceButtonProps) {
  const [isSending, setIsSending] = useState(false);

  // Fetch invoice data when sending is triggered
  const { refetch: fetchInvoice } = api.invoices.getById.useQuery(
    { id: invoiceId },
    { enabled: false },
  );

  const handleSendInvoice = async () => {
    if (isSending) return;

    setIsSending(true);

    try {
      // Fetch fresh invoice data
      const { data: invoice } = await fetchInvoice();

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      // Generate PDF blob for potential attachment
      const pdfBlob = await generateInvoicePDFBlob(invoice);

      // Create a temporary download URL for the PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Format currency
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      };

      // Format date
      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(date));
      };

      // Calculate days until due
      const today = new Date();
      const dueDate = new Date(invoice.dueDate);
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Create professional email template
      const subject = `Invoice ${invoice.invoiceNumber} - ${formatCurrency(invoice.totalAmount)}`;

      const body = `Dear ${invoice.client.name},

I hope this email finds you well. Please find attached invoice ${invoice.invoiceNumber} for the services provided.

Invoice Details:
• Invoice Number: ${invoice.invoiceNumber}
• Issue Date: ${formatDate(invoice.issueDate)}
• Due Date: ${formatDate(invoice.dueDate)}
• Amount Due: ${formatCurrency(invoice.totalAmount)}
${daysUntilDue > 0 ? `• Payment Due: In ${daysUntilDue} days` : daysUntilDue === 0 ? `• Payment Due: Today` : `• Status: ${Math.abs(daysUntilDue)} days overdue`}

${invoice.notes ? `\nAdditional Notes:\n${invoice.notes}\n` : ""}
Please review the attached invoice and remit payment by the due date. If you have any questions or concerns regarding this invoice, please don't hesitate to contact me.

Thank you for your business!

Best regards,
${invoice.business?.name ?? "Your Business Name"}
${invoice.business?.email ? `\n${invoice.business.email}` : ""}
${invoice.business?.phone ? `\n${invoice.business.phone}` : ""}`;

      // Create mailto link
      const mailtoLink = `mailto:${invoice.client.email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Create a temporary link element to trigger mailto
      const link = document.createElement("a");
      link.href = mailtoLink;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the PDF URL object
      URL.revokeObjectURL(pdfUrl);

      toast.success("Email client opened with invoice details");
    } catch (error) {
      console.error("Send invoice error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to prepare invoice email",
      );
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
          <span>Preparing Email...</span>
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          <span>Send Invoice</span>
        </>
      )}
    </Button>
  );
}
