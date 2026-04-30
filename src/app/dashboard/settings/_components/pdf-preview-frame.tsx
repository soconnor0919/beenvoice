"use client";

import { BlobProvider } from "@react-pdf/renderer";
import {
  InvoicePDF,
  type InvoiceData,
  type PDFGenerationSettings,
} from "~/lib/pdf-export";

const previewInvoice: InvoiceData = {
  invoiceNumber: "BV-2026-001",
  issueDate: new Date("2026-04-30T12:00:00.000Z"),
  dueDate: new Date("2026-05-30T12:00:00.000Z"),
  status: "sent",
  totalAmount: 3150,
  taxRate: 0,
  currency: "USD",
  notes: "Thank you for the work. Payment is due within 30 days.",
  business: {
    name: "Sample Studio",
    email: "hello@beenvoice.test",
    phone: "(555) 014-1024",
    addressLine1: "100 Terminal Way",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "USA",
    website: "beenvoice.test",
  },
  client: {
    name: "Client Studio",
    email: "ap@clientstudio.test",
    addressLine1: "42 Market Street",
    city: "Brooklyn",
    state: "NY",
    postalCode: "11201",
    country: "USA",
  },
  items: [
    {
      date: new Date("2026-04-08T12:00:00.000Z"),
      description: "Invoice workflow design and implementation",
      hours: 12,
      rate: 150,
      amount: 1800,
    },
    {
      date: new Date("2026-04-16T12:00:00.000Z"),
      description: "Client import cleanup",
      hours: 5,
      rate: 150,
      amount: 750,
    },
    {
      date: new Date("2026-04-24T12:00:00.000Z"),
      description: "Reporting polish",
      hours: 4,
      rate: 150,
      amount: 600,
    },
  ],
};

export function PdfPreviewFrame({
  settings,
  businessName,
}: {
  settings: Required<PDFGenerationSettings>;
  businessName: string;
}) {
  const previewBusinessName =
    businessName.trim() !== ""
      ? businessName
      : (previewInvoice.business?.name ?? "Sample Studio");
  const invoice = {
    ...previewInvoice,
    business: {
      ...previewInvoice.business,
      name: previewBusinessName,
    },
  };

  return (
    <div className="bg-muted/30 overflow-hidden border">
      <div className="bg-background flex h-10 items-center justify-between border-b px-3">
        <span className="text-muted-foreground text-xs font-medium">
          PDF preview
        </span>
        <span className="text-muted-foreground text-xs">
          Generated from sample invoice data
        </span>
      </div>
      <BlobProvider
        document={<InvoicePDF invoice={invoice} settings={settings} />}
      >
        {({ url, loading, error }) => {
          if (loading) {
            return (
              <div className="text-muted-foreground flex aspect-[8.5/11] items-center justify-center p-6 text-sm">
                Rendering PDF preview...
              </div>
            );
          }

          if (error || !url) {
            return (
              <div className="text-destructive flex aspect-[8.5/11] items-center justify-center p-6 text-sm">
                PDF preview could not be rendered.
              </div>
            );
          }

          return (
            <iframe
              src={url}
              title="Invoice PDF preview"
              className="h-[640px] w-full bg-white"
            />
          );
        }}
      </BlobProvider>
    </div>
  );
}
