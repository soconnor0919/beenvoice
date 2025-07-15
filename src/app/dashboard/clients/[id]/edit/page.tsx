import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { ClientForm } from "~/components/client-form";
import { PageHeader } from "~/components/page-header";

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Edit Client"
        description="Update client information below."
        variant="gradient"
      />
      <HydrateClient>
        <ClientForm mode="edit" clientId={id} />
      </HydrateClient>
    </div>
  );
}
