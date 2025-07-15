import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { ClientForm } from "~/components/client-form";
import Link from "next/link";

interface EditClientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to edit clients
          </p>
          <Link href="/api/auth/signin">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <HydrateClient>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Edit Client</h2>
          <p className="text-muted-foreground">Update client information</p>
        </div>
        <ClientForm mode="edit" clientId={id} />
      </div>
    </HydrateClient>
  );
}
