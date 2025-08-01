"use client";

import { DollarSign, Edit, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StatusBadge, type StatusType } from "~/components/data/status-badge";
import { PageHeader } from "~/components/layout/page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import {
  getEffectiveInvoiceStatus,
  isInvoiceOverdue,
} from "~/lib/invoice-status";
import { api } from "~/trpc/react";
import type { StoredInvoiceStatus } from "~/types/invoice";
import { InvoiceDetailsSkeleton } from "./_components/invoice-details-skeleton";
import { PDFDownloadButton } from "./_components/pdf-download-button";
import { EnhancedSendInvoiceButton } from "~/components/forms/enhanced-send-invoice-button";

import {
  AlertTriangle,
  Building,
  Check,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

function InvoiceViewContent({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: invoice, isLoading } = api.invoices.getById.useQuery({
    id: invoiceId,
  });
  const utils = api.useUtils();

  const deleteInvoice = api.invoices.delete.useMutation({
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      router.push("/dashboard/invoices");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete invoice");
    },
  });

  const updateStatus = api.invoices.updateStatus.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      void utils.invoices.getById.invalidate({ id: invoiceId });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update invoice status");
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleMarkAsPaid = () => {
    updateStatus.mutate({
      id: invoiceId,
      status: "paid" as StoredInvoiceStatus,
    });
  };

  const confirmDelete = () => {
    deleteInvoice.mutate({ id: invoiceId });
  };

  if (isLoading) {
    return <InvoiceDetailsSkeleton />;
  }

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
  const effectiveStatus = getEffectiveInvoiceStatus(
    invoice.status as StoredInvoiceStatus,
    invoice.dueDate,
  );
  const isOverdue = isInvoiceOverdue(
    invoice.status as StoredInvoiceStatus,
    invoice.dueDate,
  );

  const getStatusType = (): StatusType => {
    return effectiveStatus as StatusType;
  };

  return (
    <div className="page-enter space-y-6 pb-24">
      <PageHeader
        title="Invoice Details"
        description="View and manage invoice information"
        variant="gradient"
      >
        <PDFDownloadButton
          invoiceId={invoice.id}
          variant="outline"
          className="hover-lift"
        />
        <Button asChild variant="default" className="hover-lift">
          <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
            <Edit className="h-5 w-5" />
            <span>Edit</span>
          </Link>
        </Button>
      </PageHeader>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Invoice Header */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <h2 className="text-foreground text-2xl font-bold break-words">
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
                  <div className="flex-shrink-0 text-left sm:text-right">
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
            <Card className="border-destructive/20 bg-destructive/5">
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
            <Card>
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
                      <div className="bg-primary/10 p-2">
                        <Mail className="text-primary h-4 w-4" />
                      </div>
                      <span className="text-sm break-all">
                        {invoice.client.email}
                      </span>
                    </div>
                  )}

                  {invoice.client.phone && (
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2">
                        <Phone className="text-primary h-4 w-4" />
                      </div>
                      <span className="text-sm">{invoice.client.phone}</span>
                    </div>
                  )}

                  {(invoice.client.addressLine1 ?? invoice.client.city) && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2">
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
              <Card>
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
                        <div className="bg-primary/10 p-2">
                          <Mail className="text-primary h-4 w-4" />
                        </div>
                        <span className="text-sm break-all">
                          {invoice.business.email}
                        </span>
                      </div>
                    )}

                    {invoice.business.phone && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoice.items.map((item, _index) => (
                <Card key={item.id} className="invoice-item card-secondary">
                  <CardContent className="p-3">
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground mb-2 text-base font-medium break-words">
                            {item.description}
                          </p>
                          <div className="text-muted-foreground text-sm">
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              <span className="whitespace-nowrap">
                                {formatDate(item.date).replace(/ /g, "\u00A0")}
                              </span>
                              <span className="whitespace-nowrap">
                                {item.hours.toString().replace(/ /g, "\u00A0")}
                                &nbsp;hours
                              </span>
                              <span className="whitespace-nowrap">
                                @&nbsp;${item.rate}/hr
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 self-start">
                          <p className="text-primary text-lg font-semibold">
                            {formatCurrency(item.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Totals */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {invoice.taxRate > 0 && (
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                      <span className="text-muted-foreground">
                        Tax ({invoice.taxRate}%):
                      </span>
                      <span className="font-medium">
                        {formatCurrency(taxAmount)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-lg font-bold">
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
            <Card>
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
          <Card className="sticky top-6">
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

              {/* Send Invoice Button - Show for draft, sent, and overdue */}
              {effectiveStatus === "draft" && (
                <EnhancedSendInvoiceButton
                  invoiceId={invoice.id}
                  className="w-full"
                />
              )}

              {(effectiveStatus === "sent" ||
                effectiveStatus === "overdue") && (
                <EnhancedSendInvoiceButton
                  invoiceId={invoice.id}
                  className="w-full"
                  showResend={true}
                />
              )}

              {/* Manual Status Updates */}
              {(effectiveStatus === "sent" ||
                effectiveStatus === "overdue") && (
                <Button
                  onClick={handleMarkAsPaid}
                  disabled={updateStatus.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                >
                  {updateStatus.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <DollarSign className="mr-2 h-4 w-4" />
                  )}
                  Mark as Paid
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={deleteInvoice.isPending}
                className="text-destructive hover:bg-destructive/10 w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete invoice{" "}
              <strong>{invoice.invoiceNumber}</strong>? This action cannot be
              undone and will permanently remove the invoice and all its data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteInvoice.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteInvoice.isPending}
            >
              {deleteInvoice.isPending ? "Deleting..." : "Delete Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function InvoiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Handle /invoices/new route - redirect to dedicated new page
  useEffect(() => {
    if (id === "new") {
      router.replace("/dashboard/invoices/new");
    }
  }, [id, router]);

  // Don't render anything if we're redirecting
  if (id === "new") {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <InvoiceViewContent invoiceId={id} />;
}
