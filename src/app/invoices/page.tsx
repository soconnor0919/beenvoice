import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { InvoiceList } from "~/components/data/invoice-list";
import { Plus } from "lucide-react";

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to view invoices
          </p>
          <Link href="/api/auth/signin">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prefetch invoices data
  void api.invoices.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Invoices</h2>
          <p className="text-muted-foreground">
            Manage your invoices and payments
          </p>
        </div>

        <InvoiceList />
      </div>
    </HydrateClient>
  );
}
