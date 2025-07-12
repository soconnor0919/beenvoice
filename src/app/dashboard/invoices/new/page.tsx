import { HydrateClient } from "~/trpc/server";
import { InvoiceForm } from "~/components/invoice-form";

export default async function NewInvoicePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
          Create Invoice
        </h1>
        <p className="mt-1 text-lg text-gray-600">
          Fill out the details below to create a new invoice.
        </p>
      </div>
      <HydrateClient>
        <InvoiceForm />
      </HydrateClient>
    </div>
  );
}
