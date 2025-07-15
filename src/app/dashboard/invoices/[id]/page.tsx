import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { StatusBadge, type StatusType } from "~/components/ui/status-badge";
import { Separator } from "~/components/ui/separator";
import { PageHeader } from "~/components/page-header";
import { PDFDownloadButton } from "./_components/pdf-download-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Edit,
  Send,
  Copy,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Building,
  User,
  DollarSign,
  Hash,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

function InvoiceStatusBadge({
  status,
  dueDate,
}: {
  status: string;
  dueDate: Date;
}) {
  const getStatus = (): "draft" | "sent" | "paid" | "overdue" => {
    if (status === "paid") return "paid";
    if (status === "draft") return "draft";
    if (status === "sent") {
      const due = new Date(dueDate);
      return due < new Date() ? "overdue" : "sent";
    }
    return "draft";
  };

  const actualStatus = getStatus();

  const icons = {
    draft: FileText,
    sent: Clock,
    paid: CheckCircle,
    overdue: Clock,
  };

  const Icon = icons[actualStatus];

  return (
    <StatusBadge status={actualStatus} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
    </StatusBadge>
  );
}

async function InvoiceDetails({ invoiceId }: { invoiceId: string }) {
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

  const subtotal =
    invoice.items?.reduce((sum, item) => sum + item.hours * item.rate, 0) || 0;
  const taxAmount = (subtotal * (invoice.taxRate || 0)) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Invoice Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                  <Hash className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    {invoice.invoiceNumber}
                  </h1>
                  <p className="text-muted-foreground text-sm">Invoice</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Issued
                    </p>
                    <p className="text-sm font-semibold">
                      {formatDate(invoice.issueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Due
                    </p>
                    <p className="text-sm font-semibold">
                      {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Amount
                    </p>
                    <p className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      Status
                    </p>
                    <InvoiceStatusBadge
                      status={invoice.status}
                      dueDate={invoice.dueDate}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                <Button className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Invoice
                </Button>
              </Link>
              <PDFDownloadButton invoice={invoice} variant="button" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business & Client Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* From Business */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-4 w-4 text-emerald-600" />
              From
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoice.business ? (
              <>
                <div>
                  <p className="font-semibold">{invoice.business.name}</p>
                </div>
                <div className="space-y-1">
                  {invoice.business.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="text-muted-foreground h-3 w-3" />
                      <span className="text-muted-foreground">
                        {invoice.business.email}
                      </span>
                    </div>
                  )}
                  {invoice.business.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="text-muted-foreground h-3 w-3" />
                      <span className="text-muted-foreground">
                        {invoice.business.phone}
                      </span>
                    </div>
                  )}
                  {invoice.business.addressLine1 && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="text-muted-foreground mt-0.5 h-3 w-3" />
                      <div className="text-muted-foreground">
                        <p>{invoice.business.addressLine1}</p>
                        {invoice.business.addressLine2 && (
                          <p>{invoice.business.addressLine2}</p>
                        )}
                        <p>
                          {[
                            invoice.business.city,
                            invoice.business.state,
                            invoice.business.postalCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {invoice.business.country && (
                          <p>{invoice.business.country}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No business information
              </p>
            )}
          </CardContent>
        </Card>

        {/* To Client */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-4 w-4 text-emerald-600" />
              Bill To
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold">{invoice.client.name}</p>
            </div>
            <div className="space-y-1">
              {invoice.client.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground">
                    {invoice.client.email}
                  </span>
                </div>
              )}
              {invoice.client.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground">
                    {invoice.client.phone}
                  </span>
                </div>
              )}
              {invoice.client.addressLine1 && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="text-muted-foreground mt-0.5 h-3 w-3" />
                  <div className="text-muted-foreground">
                    <p>{invoice.client.addressLine1}</p>
                    {invoice.client.addressLine2 && (
                      <p>{invoice.client.addressLine2}</p>
                    )}
                    <p>
                      {[
                        invoice.client.city,
                        invoice.client.state,
                        invoice.client.postalCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {invoice.client.country && <p>{invoice.client.country}</p>}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Line Items ({invoice.items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {invoice.items && invoice.items.length > 0 ? (
              <div className="space-y-0">
                {/* Header - Hidden on mobile */}
                <div className="border-muted/30 bg-muted/20 hidden grid-cols-12 gap-4 border-b px-6 py-3 text-sm font-medium md:grid">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2 text-right">Hours</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-1 text-right">Amount</div>
                </div>

                {/* Items */}
                {invoice.items.map((item, index) => (
                  <div
                    key={index}
                    className="border-muted/30 grid grid-cols-1 gap-2 border-b px-6 py-4 last:border-b-0 md:grid-cols-12 md:items-center md:gap-4"
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      <div className="mb-2 flex items-start justify-between">
                        <p className="font-medium">{item.description}</p>
                        <span className="font-mono text-sm font-semibold text-emerald-600">
                          {formatCurrency(item.hours * item.rate)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Date
                          </span>
                          <p>{formatDate(item.date)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Hours
                          </span>
                          <p className="font-mono">{item.hours}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Rate
                          </span>
                          <p className="font-mono">
                            {formatCurrency(item.rate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="text-muted-foreground col-span-2 hidden text-sm md:block">
                      {formatDate(item.date)}
                    </div>
                    <div className="col-span-5 hidden font-medium md:block">
                      {item.description}
                    </div>
                    <div className="col-span-2 hidden text-right font-mono text-sm md:block">
                      {item.hours}
                    </div>
                    <div className="col-span-2 hidden text-right font-mono text-sm md:block">
                      {formatCurrency(item.rate)}
                    </div>
                    <div className="col-span-1 hidden text-right font-mono font-semibold text-emerald-600 md:block">
                      {formatCurrency(item.hours * item.rate)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-12 text-center">
                <FileText className="mx-auto mb-2 h-8 w-8" />
                <p>No line items found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Totals & Notes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Notes */}
        {invoice.notes && (
          <Card className="border-0 shadow-md lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {invoice.notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Totals */}
        <Card
          className={`border-0 shadow-md ${!invoice.notes ? "lg:col-start-3" : ""}`}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tax ({invoice.taxRate}%):
                  </span>
                  <span className="font-mono">{formatCurrency(taxAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="font-mono text-emerald-600">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Status Actions */}
            <div className="pt-2">
              {invoice.status === "draft" && (
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Send className="mr-2 h-4 w-4" />
                  Send Invoice
                </Button>
              )}

              {invoice.status === "sent" && (
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              )}

              {(invoice.status === "paid" || invoice.status === "overdue") && (
                <div className="text-center">
                  <InvoiceStatusBadge
                    status={invoice.status}
                    dueDate={invoice.dueDate}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice Details"
        description="View and manage invoice information"
        variant="gradient"
      >
        <div className="flex items-center gap-2">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/invoices/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Invoice
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Send Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </PageHeader>

      <HydrateClient>
        <Suspense fallback={<div>Loading invoice details...</div>}>
          <InvoiceDetails invoiceId={id} />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
