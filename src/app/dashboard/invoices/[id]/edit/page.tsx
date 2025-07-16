"use client";

import { useParams } from "next/navigation";
import { InvoiceForm } from "~/components/forms/invoice-form";

export default function EditInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  return <InvoiceForm invoiceId={invoiceId} />;
}
