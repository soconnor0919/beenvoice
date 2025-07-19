"use client";

import { InvoiceView } from "~/components/data/invoice-view";
import InvoiceForm from "~/components/forms/invoice-form";

interface UnifiedInvoicePageProps {
  invoiceId: string;
  mode: string;
}

export function UnifiedInvoicePage({
  invoiceId,
  mode,
}: UnifiedInvoicePageProps) {
  return (
    <div>
      {/* Always render InvoiceForm to preserve state, but hide when in view mode */}
      <div className={mode === "edit" ? "block" : "hidden"}>
        <InvoiceForm invoiceId={invoiceId} />
      </div>

      {/* Show InvoiceView only when in view mode */}
      {mode === "view" && <InvoiceView invoiceId={invoiceId} />}
    </div>
  );
}
