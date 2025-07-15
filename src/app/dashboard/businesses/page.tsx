import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { BusinessesTable } from "./_components/businesses-table";
import { PageHeader } from "~/components/page-header";
import { PageContent, PageSection } from "~/components/ui/page-layout";

export default async function BusinessesPage() {
  return (
    <>
      <PageHeader
        title="Businesses"
        description="Manage your businesses and their information."
        variant="gradient"
      >
        <Button asChild variant="brand">
          <Link href="/dashboard/businesses/new">
            <Plus className="mr-2 h-5 w-5" />
            <span>Add Business</span>
          </Link>
        </Button>
      </PageHeader>

      <HydrateClient>
        <BusinessesTable />
      </HydrateClient>
    </>
  );
}
