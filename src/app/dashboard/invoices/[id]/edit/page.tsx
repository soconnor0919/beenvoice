import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { InvoiceForm } from "~/components/invoice-form";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Access Denied</h1>
          <p className="text-muted-foreground mb-8">Please sign in to edit invoices</p>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Edit Invoice</h1>
        <p className="text-gray-600 mt-1 text-lg">Update the invoice details below.</p>
      </div>
      <HydrateClient>
        <InvoiceForm invoiceId={id} />
      </HydrateClient>
    </div>
  );
} 