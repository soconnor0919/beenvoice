import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { DataTableSkeleton } from "~/components/data/data-table";
import { PageHeader } from "~/components/layout/page-header";
import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";
import { BusinessesDataTable } from "./_components/businesses-data-table";

// Businesses Table Component
async function BusinessesTable() {
  const businesses = await api.businesses.getAll();

  return <BusinessesDataTable businesses={businesses} />;
}

export default async function BusinessesPage() {
  return (
    <div className="page-enter space-y-8">
      <PageHeader
        title="Businesses"
        description="Manage your businesses and their information"
        variant="gradient"
      >
        <Button asChild variant="default" className="hover-lift shadow-md">
          <Link href="/dashboard/businesses/new">
            <Plus className="mr-2 h-5 w-5" />
            <span>Add Business</span>
          </Link>
        </Button>
      </PageHeader>

      <HydrateClient>
        <Suspense fallback={<DataTableSkeleton columns={6} rows={5} />}>
          <BusinessesTable />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
