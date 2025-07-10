import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { UniversalTable } from "~/components/ui/universal-table";
import { Plus, Upload } from "lucide-react";

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Access Denied</h1>
          <p className="text-muted-foreground mb-8">Please sign in to view invoices</p>
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

  // Prefetch invoices data
  void api.invoices.getAll.prefetch();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Invoices</h1>
          <p className="text-gray-600 mt-1 text-lg">Manage your invoices and payments.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="lg" className="bg-white/80 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium shadow-lg hover:shadow-xl">
            <Link href="/dashboard/invoices/import">
              <Upload className="mr-2 h-5 w-5" /> Import CSV
            </Link>
          </Button>
          <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl">
            <Link href="/dashboard/invoices/new">
              <Plus className="mr-2 h-5 w-5" /> Add Invoice
            </Link>
          </Button>
        </div>
      </div>
      <HydrateClient>
        <UniversalTable resource="invoices" />
      </HydrateClient>
    </div>
  );
} 