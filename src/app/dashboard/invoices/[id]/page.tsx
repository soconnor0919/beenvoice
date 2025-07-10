import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { InvoiceView } from "~/components/invoice-view";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit } from "lucide-react";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const session = await auth();
  const { id } = await params;

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

  // Prefetch invoice data
  try {
    await api.invoices.getById.prefetch({ id: id });
  } catch (error) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Invoice Details</h1>
          <p className="text-gray-600 mt-1 text-lg">View and manage invoice information.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="lg" className="bg-white/80 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium shadow-lg hover:shadow-xl">
            <Link href={`/dashboard/invoices/${id}/edit`}>
              <Edit className="mr-2 h-5 w-5" /> Edit Invoice
            </Link>
          </Button>
        </div>
      </div>
      <HydrateClient>
        <InvoiceView invoiceId={id} />
      </HydrateClient>
    </div>
  );
} 