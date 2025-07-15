import Link from "next/link";
import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/layout/page-header";
import { Plus, Upload } from "lucide-react";
import { InvoicesDataTable } from "./_components/invoices-data-table";
import { DataTableSkeleton } from "~/components/data/data-table";

// Invoices Table Component
async function InvoicesTable() {
  const invoices = await api.invoices.getAll();

  return <InvoicesDataTable invoices={invoices} />;
}

export default async function InvoicesPage() {
  return (
    <>
      <PageHeader
        title="Invoices"
        description="Manage your invoices and track payments"
        variant="gradient"
      >
        <Button asChild variant="outline" className="shadow-sm">
          <Link href="/dashboard/invoices/import">
            <Upload className="mr-2 h-5 w-5" />
            <span>Import CSV</span>
          </Link>
        </Button>
        <Button
          asChild
          className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
        >
          <Link href="/dashboard/invoices/new">
            <Plus className="mr-2 h-5 w-5" />
            <span>Create Invoice</span>
          </Link>
        </Button>
      </PageHeader>

      <HydrateClient>
        <Suspense fallback={<DataTableSkeleton columns={7} rows={5} />}>
          <InvoicesTable />
        </Suspense>
      </HydrateClient>
    </>
  );
}
