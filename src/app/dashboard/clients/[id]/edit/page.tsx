import { HydrateClient } from "~/trpc/server";
import { ClientForm } from "~/components/client-form";

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;

  return (
    <div>
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
          Edit Client
        </h1>
        <p className="mt-1 text-lg text-gray-600">
          Update client information below.
        </p>
      </div>
      <HydrateClient>
        <ClientForm mode="edit" clientId={id} />
      </HydrateClient>
    </div>
  );
}
