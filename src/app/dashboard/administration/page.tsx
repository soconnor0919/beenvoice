import { Suspense } from "react";
import { DataTableSkeleton } from "~/components/data/data-table";
import { PageHeader } from "~/components/layout/page-header";
import { HydrateClient } from "~/trpc/server";
import { AdministrationContent } from "./_components/administration-content";

export default async function AdministrationPage() {
  return (
    <div className="page-enter space-y-6">
      <PageHeader
        title="Administration"
        description="Manage account access and platform administration"
        variant="gradient"
      />

      <HydrateClient>
        <Suspense fallback={<DataTableSkeleton columns={1} rows={4} />}>
          <AdministrationContent />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
