import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { ClientsTable } from "./_components/clients-table";
import { PageHeader } from "~/components/layout/page-header";
import { PageContent, PageSection } from "~/components/layout/page-layout";

export default async function ClientsPage() {
  return (
    <>
      <PageHeader
        title="Clients"
        description="Manage your clients and their information."
        variant="gradient"
      >
        <Button asChild className="btn-brand-primary shadow-md">
          <Link href="/dashboard/clients/new">
            <Plus className="mr-2 h-5 w-5" />
            <span>Add Client</span>
          </Link>
        </Button>
      </PageHeader>

      <HydrateClient>
        <ClientsTable />
      </HydrateClient>
    </>
  );
}
