"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { generateInvoicePDF } from "~/lib/pdf-export";
import { Download, Loader2 } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  totalAmount: number;
  taxRate: number;
  notes?: string | null;
  business?: {
    name: string;
    email?: string | null;
    phone?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
    website?: string | null;
    taxId?: string | null;
  } | null;
  client: {
    name: string;
    email?: string | null;
    phone?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  };
  items: Array<{
    date: Date;
    description: string;
    hours: number;
    rate: number;
    amount: number;
  }>;
}

interface PDFDownloadButtonProps {
  invoice: Invoice;
  variant?: "button" | "menu" | "icon";
}

export function PDFDownloadButton({
  invoice,
  variant = "button",
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      // Transform the invoice data to match the PDF interface
      const pdfData = {
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        totalAmount: invoice.totalAmount,
        taxRate: invoice.taxRate,
        notes: invoice.notes,
        business: invoice.business,
        client: invoice.client,
        items: invoice.items,
      };

      await generateInvoicePDF(pdfData);

      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate PDF",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (variant === "menu") {
    return (
      <button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="hover:bg-accent flex w-full items-center gap-2 px-2 py-1.5 text-sm"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {isGenerating ? "Generating..." : "Download PDF"}
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <Button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      className="w-full justify-start"
      variant="outline"
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  );
}
