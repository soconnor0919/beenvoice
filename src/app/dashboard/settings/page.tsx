import { Suspense } from "react";
import { HydrateClient } from "~/trpc/server";
import { PageHeader } from "~/components/layout/page-header";
import { DataTableSkeleton } from "~/components/data/data-table";
import { SettingsContent } from "./_components/settings-content";

export default async function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account preferences and data"
        variant="gradient"
      />

      <HydrateClient>
        <Suspense fallback={<DataTableSkeleton columns={1} rows={4} />}>
          <SettingsContent />
        </Suspense>
      </HydrateClient>
    </>
  );
}
