import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { ClientForm } from "~/components/client-form";
import Link from "next/link";

export default async function NewClientPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">Please sign in to create clients</p>
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
          <h2 className="text-3xl font-bold mb-2">Add New Client</h2>
          <p className="text-muted-foreground">
            Create a new client profile
          </p>
        </div>
        <ClientForm mode="create" />
      </div>
    </HydrateClient>
  );
} 