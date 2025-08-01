import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "~/components/layout/page-header";
import { Button } from "~/components/ui/button";
import { HydrateClient } from "~/trpc/server";
import { ClientsTable } from "./_components/clients-table";

export default async function ClientsPage() {
  return (
    <div className="page-enter space-y-8">
      <PageHeader
        title="Clients"
        description="Manage your clients and their information."
        variant="gradient"
      >
        <Button asChild variant="default" className="hover-lift shadow-md">
          <Link href="/dashboard/clients/new">
            <Plus className="mr-2 h-5 w-5" />
            <span>Add Client</span>
          </Link>
        </Button>
      </PageHeader>

      <HydrateClient>
        <ClientsTable />
      </HydrateClient>
    </div>
  );
}
