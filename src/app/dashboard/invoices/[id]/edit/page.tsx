"use client";

import { useParams } from "next/navigation";
import InvoiceForm from "~/components/forms/invoice-form";

export default function InvoiceFormPage() {
  const params = useParams();
  const id = params.id as string;

  // Pass the actual id, let the form component handle the logic
  return <InvoiceForm invoiceId={id} />;
}
