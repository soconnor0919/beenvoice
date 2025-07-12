import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { InvoicesTable } from "./_components/invoices-table";

export default async function InvoicesPage() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
            Invoices
          </h1>
          <p className="mt-1 text-lg text-gray-600">
            Manage your invoices and payments.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-gray-200 bg-white/80 font-medium text-gray-700 shadow-lg hover:bg-gray-50 hover:shadow-xl"
          >
            <Link href="/dashboard/invoices/import">
              <Upload className="mr-2 h-5 w-5" /> Import CSV
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white shadow-lg hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
          >
            <Link href="/dashboard/invoices/new">
              <Plus className="mr-2 h-5 w-5" /> Add Invoice
            </Link>
          </Button>
        </div>
      </div>
      <HydrateClient>
        <InvoicesTable />
      </HydrateClient>
    </div>
  );
}
