import { Suspense } from "react";
import { HydrateClient } from "~/trpc/server";
import { PageHeader } from "~/components/layout/page-header";
import { DataTableSkeleton } from "~/components/data/data-table";
import { SettingsContent } from "./_components/settings-content";
import { Card, CardContent } from "~/components/ui/card";

export default async function SettingsPage() {
  return (
    <div className="page-enter space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and data"
        variant="gradient"
      />

      <Card>
        <CardContent className="p-6">
          <HydrateClient>
            <Suspense fallback={<DataTableSkeleton columns={1} rows={4} />}>
              <SettingsContent />
            </Suspense>
          </HydrateClient>
        </CardContent>
      </Card>
    </div>
  );
}
