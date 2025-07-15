import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { ClientForm } from "~/components/client-form";
import { PageHeader } from "~/components/page-header";

export default async function NewClientPage() {
  return (
    <div>
      <PageHeader
        title="Add Client"
        description="Enter client details below to add a new client."
        variant="gradient"
      />
      <HydrateClient>
        <ClientForm mode="create" />
      </HydrateClient>
    </div>
  );
}
