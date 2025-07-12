import { HydrateClient } from "~/trpc/server";
import { ClientForm } from "~/components/client-form";

export default async function NewClientPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
          Add Client
        </h1>
        <p className="mt-1 text-lg text-gray-600">
          Enter client details below to add a new client.
        </p>
      </div>
      <HydrateClient>
        <ClientForm mode="create" />
      </HydrateClient>
    </div>
  );
}
