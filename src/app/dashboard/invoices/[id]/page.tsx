import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { StatusBadge, type StatusType } from "~/components/data/status-badge";
import { Separator } from "~/components/ui/separator";
import { PageHeader } from "~/components/layout/page-header";
import { PDFDownloadButton } from "./_components/pdf-download-button";
import { SendInvoiceButton } from "./_components/send-invoice-button";
import { InvoiceDetailsSkeleton } from "./_components/invoice-details-skeleton";
import { InvoiceActionsDropdown } from "./_components/invoice-actions-dropdown";
import {
  ArrowLeft,
  Building,
  Calendar,
  Copy,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  AlertTriangle,
  Trash2,
  DollarSign,
  Clock,
  Eye,
  Download,
  Send,
  Check,
} from "lucide-react";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

async function InvoiceContent({ invoiceId }: { invoiceId: string }) {
  const invoice = await api.invoices.getById({ id: invoiceId });

  if (!invoice) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + taxAmount;
  const isOverdue =
    new Date(invoice.dueDate) < new Date() && invoice.status !== "paid";

  const getStatusType = (): StatusType => {
    if (invoice.status === "paid") return "paid";
    if (invoice.status === "draft") return "draft";
    if (invoice.status === "sent") {
      return isOverdue ? "overdue" : "sent";
    }
    return "draft";
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">
            Invoice Details
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage invoice information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InvoiceActionsDropdown invoiceId={invoice.id} />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Invoice Header */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <h2 className="text-foreground truncate text-2xl font-bold">
                        {invoice.invoiceNumber}
                      </h2>
                      <StatusBadge status={getStatusType()} />
                    </div>
                    <div className="text-muted-foreground space-y-1 text-sm sm:space-y-0">
                      <div className="sm:inline">
                        Issued {formatDate(invoice.issueDate)}
                      </div>
                      <div className="sm:inline sm:before:content-['_•_']">
                        Due {formatDate(invoice.dueDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-muted-foreground text-sm">
                      Total Amount
                    </p>
                    <p className="text-primary text-3xl font-bold">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Alert */}
          {isOverdue && (
            <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
              <CardContent className="p-4">
                <div className="text-destructive flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Invoice Overdue</p>
                    <p className="text-sm">
                      {Math.ceil(
                        (new Date().getTime() -
                          new Date(invoice.dueDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days past due date
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client & Business Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Client Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Bill To
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-foreground text-xl font-semibold">
                    {invoice.client.name}
                  </h3>
                </div>

                <div className="space-y-3">
                  {invoice.client.email && (
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Mail className="text-primary h-4 w-4" />
                      </div>
                      <span className="text-sm break-all">
                        {invoice.client.email}
                      </span>
                    </div>
                  )}

                  {invoice.client.phone && (
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Phone className="text-primary h-4 w-4" />
                      </div>
                      <span className="text-sm">{invoice.client.phone}</span>
                    </div>
                  )}

                  {(invoice.client.addressLine1 ?? invoice.client.city) && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <MapPin className="text-primary h-4 w-4" />
                      </div>
                      <div className="space-y-1 text-sm">
                        {invoice.client.addressLine1 && (
                          <div>{invoice.client.addressLine1}</div>
                        )}
                        {invoice.client.addressLine2 && (
                          <div>{invoice.client.addressLine2}</div>
                        )}
                        {(invoice.client.city ??
                          invoice.client.state ??
                          invoice.client.postalCode) && (
                          <div>
                            {[
                              invoice.client.city,
                              invoice.client.state,
                              invoice.client.postalCode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        )}
                        {invoice.client.country && (
                          <div>{invoice.client.country}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            {invoice.business && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    From
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-foreground text-xl font-semibold">
                      {invoice.business.name}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {invoice.business.email && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <Mail className="text-primary h-4 w-4" />
                        </div>
                        <span className="text-sm break-all">
                          {invoice.business.email}
                        </span>
                      </div>
                    )}

                    {invoice.business.phone && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <Phone className="text-primary h-4 w-4" />
                        </div>
                        <span className="text-sm">
                          {invoice.business.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Invoice Items */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground mb-2 text-base font-medium">
                        {item.description}
                      </p>
                      <div className="text-muted-foreground space-y-1 text-sm sm:space-y-0">
                        <span className="sm:inline">
                          {formatDate(item.date)}
                        </span>
                        <span className="block sm:inline sm:before:content-['_•_']">
                          {item.hours} hours
                        </span>
                        <span className="block sm:inline sm:before:content-['_•_']">
                          @ ${item.rate}/hr
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-primary text-lg font-semibold">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {invoice.taxRate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tax ({invoice.taxRate}%):
                      </span>
                      <span className="font-medium">
                        {formatCurrency(taxAmount)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <Card className="sticky top-6 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Invoice
                </Link>
              </Button>

              {invoice.items && invoice.client && (
                <PDFDownloadButton invoiceId={invoice.id} className="w-full" />
              )}

              {invoice.status === "draft" && (
                <SendInvoiceButton invoiceId={invoice.id} className="w-full" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;

  return (
    <HydrateClient>
      <Suspense fallback={<InvoiceDetailsSkeleton />}>
        <InvoiceContent invoiceId={id} />
      </Suspense>
    </HydrateClient>
  );
}
