import { api, HydrateClient } from "~/trpc/server";
import { InvoiceView } from "~/components/invoice-view";
import { InvoiceForm } from "~/components/invoice-form";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit, Eye, ArrowLeft } from "lucide-react";
import { UnifiedInvoicePage } from "./_components/unified-invoice-page";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function InvoicePage({
  params,
  searchParams,
}: InvoicePageProps) {
  const { id } = await params;
  const { mode = "view" } = await searchParams;

  return (
    <div>
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
              Invoice Details
            </h1>
            <p className="mt-1 text-lg text-gray-600">
              View and manage invoice information.
            </p>
          </div>

          <div className="relative flex rounded-lg border border-gray-200 bg-gray-100 p-1">
            <div
              className={`absolute top-1 bottom-1 rounded-md bg-white shadow-sm transition-all duration-300 ease-in-out ${
                mode === "view" ? "left-1 w-10" : "left-11 w-10"
              }`}
            />
            <Link
              href={`/dashboard/invoices/${id}?mode=view`}
              className={`relative z-10 rounded-md px-3 py-2 transition-all duration-200 ${
                mode === "view"
                  ? "text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              href={`/dashboard/invoices/${id}?mode=edit`}
              className={`relative z-10 rounded-md px-3 py-2 transition-all duration-200 ${
                mode === "edit"
                  ? "text-emerald-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Edit className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <HydrateClient>
            <UnifiedInvoicePage invoiceId={id} mode={mode} />
          </HydrateClient>
        </div>
      </div>
    </div>
  );
}
