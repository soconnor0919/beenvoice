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
import { InvoiceItemsTable } from "./_components/invoice-items-table";
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
    <div className="space-y-6">
      {/* Overdue Alert */}
      {isOverdue && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                This invoice is{" "}
                {Math.ceil(
                  (new Date().getTime() - new Date(invoice.dueDate).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                days overdue
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-4 xl:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-3 xl:col-span-2">
          {/* Invoice Header */}
          <Card className="shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold sm:text-2xl">
                      Invoice #{invoice.invoiceNumber}
                    </h1>
                    <StatusBadge status={getStatusType()} />
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Issued {formatDate(invoice.issueDate)} • Due{" "}
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 sm:text-3xl">
                    {formatCurrency(invoice.totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client & Business Information */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Client Information */}
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Bill To
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-foreground text-lg font-semibold sm:text-xl">
                    {invoice.client.name}
                  </h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {invoice.client.email && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="rounded-lg bg-emerald-100 p-1.5 sm:p-2">
                        <Mail className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" />
                      </div>
                      <span className="text-sm break-all sm:text-base">
                        {invoice.client.email}
                      </span>
                    </div>
                  )}

                  {invoice.client.phone && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="rounded-lg bg-emerald-100 p-1.5 sm:p-2">
                        <Phone className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" />
                      </div>
                      <span className="text-sm sm:text-base">
                        {invoice.client.phone}
                      </span>
                    </div>
                  )}

                  {(invoice.client.addressLine1 ?? invoice.client.city) && (
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="rounded-lg bg-emerald-100 p-1.5 sm:p-2">
                        <MapPin className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" />
                      </div>
                      <div className="text-sm sm:text-base">
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
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-emerald-600">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                    From
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-foreground text-lg font-semibold sm:text-xl">
                      {invoice.business.name}
                    </h3>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {invoice.business.email && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-lg bg-emerald-100 p-1.5 sm:p-2">
                          <Mail className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" />
                        </div>
                        <span className="text-sm break-all sm:text-base">
                          {invoice.business.email}
                        </span>
                      </div>
                    )}

                    {invoice.business.phone && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-lg bg-emerald-100 p-1.5 sm:p-2">
                          <Phone className="h-3 w-3 text-emerald-600 sm:h-4 sm:w-4" />
                        </div>
                        <span className="text-sm sm:text-base">
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
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <InvoiceItemsTable items={invoice.items} />

              {/* Totals */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-full space-y-2 sm:max-w-64">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    {invoice.taxRate > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Tax ({invoice.taxRate}%):
                        </span>
                        <span className="font-medium">
                          {formatCurrency(taxAmount)}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-base font-bold sm:text-lg">
                      <span>Total:</span>
                      <span className="text-emerald-600">
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-1">
          {/* Actions */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                asChild
                variant="outline"
                className="w-full border-0 shadow-sm"
                size="default"
              >
                <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Invoice</span>
                </Link>
              </Button>

              <PDFDownloadButton invoiceId={invoice.id} />

              <SendInvoiceButton invoiceId={invoice.id} />

              <Button
                variant="outline"
                className="w-full border-0 shadow-sm"
                size="default"
              >
                <Copy className="mr-2 h-4 w-4" />
                <span>Duplicate</span>
              </Button>

              <Button variant="destructive" size="default" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Invoice</span>
              </Button>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm">Invoice #</p>
                  <p className="font-medium break-all">
                    {invoice.invoiceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={getStatusType()} />
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Issue Date</p>
                  <p className="font-medium">{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Due Date</p>
                  <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Tax Rate</p>
                  <p className="font-medium">{invoice.taxRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total</p>
                  <p className="font-medium text-emerald-600">
                    {formatCurrency(invoice.totalAmount)}
                  </p>
                </div>
              </div>
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
    <>
      <PageHeader
        title="Invoice Details"
        description="View and manage invoice information"
        variant="gradient"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="outline"
            className="border-0 shadow-sm"
            size="default"
          >
            <Link href="/dashboard/invoices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Invoices</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>

          <InvoiceActionsDropdown invoiceId={id} />
        </div>
      </PageHeader>

      <HydrateClient>
        <Suspense fallback={<InvoiceDetailsSkeleton />}>
          <InvoiceContent invoiceId={id} />
        </Suspense>
      </HydrateClient>
    </>
  );
}
