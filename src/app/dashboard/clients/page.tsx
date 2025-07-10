import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { UniversalTable } from "~/components/ui/universal-table";
import { Plus } from "lucide-react";

export default async function ClientsPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Access Denied</h1>
          <p className="text-muted-foreground mb-8">Please sign in to view clients</p>
          <Link href="/api/auth/signin">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prefetch clients data
  void api.clients.getAll.prefetch();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Clients</h1>
          <p className="text-gray-600 mt-1 text-lg">Manage your clients and their information.</p>
        </div>
        <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl">
          <Link href="/dashboard/clients/new">
            <Plus className="mr-2 h-5 w-5" /> Add Client
          </Link>
        </Button>
      </div>
      <HydrateClient>
        <UniversalTable resource="clients" />
      </HydrateClient>
    </div>
  );
} 