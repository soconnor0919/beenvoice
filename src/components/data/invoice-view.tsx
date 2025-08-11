"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

import { StatusBadge, type StatusType } from "~/components/data/status-badge";
import { Separator } from "~/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  FileText,
  User,
  DollarSign,
  Trash2,
  Download,
  Send,
  Clock,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { generateInvoicePDF } from "~/lib/pdf-export";
import { Skeleton } from "~/components/ui/skeleton";

interface InvoiceViewProps {
  invoiceId: string;
}

const statusIconConfig = {
  draft: FileText,
  sent: Send,
  paid: DollarSign,
  overdue: AlertCircle,
} as const;

export function InvoiceView({ invoiceId }: InvoiceViewProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Fetch invoice data
  const {
    data: invoice,
    isLoading,
    refetch,
  } = api.invoices.getById.useQuery({ id: invoiceId });

  // Delete mutation
  const deleteInvoice = api.invoices.delete.useMutation({
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      setDeleteDialogOpen(false);
      router.push("/dashboard/invoices");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete invoice");
    },
  });

  // Update status mutation
  const updateStatus = api.invoices.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update status");
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteInvoice.mutate({ id: invoiceId });
  };

  const handleStatusUpdate = (newStatus: "draft" | "sent" | "paid") => {
    updateStatus.mutate({ id: invoiceId, status: newStatus });
  };

  const handlePDFExport = async () => {
    if (!invoice) return;

    setIsExportingPDF(true);
    try {
      await generateInvoicePDF(invoice);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const isOverdue =
    invoice &&
    new Date(invoice.dueDate) < new Date() &&
    invoice.status !== "paid";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="py-12 text-center">
        <FileText className="text-muted mx-auto mb-4 h-12 w-12" />
        <h3 className="text-foreground mb-2 text-lg font-medium">
          Invoice not found
        </h3>
        <p className="text-muted mb-4">
          The invoice you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
        <Button asChild>
          <Link href="/dashboard/invoices">Back to Invoices</Link>
        </Button>
      </div>
    );
  }

  const StatusIcon =
    statusIconConfig[invoice.status as keyof typeof statusIconConfig];

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {isOverdue && (
        <Card className="border-destructive/20 bg-destructive/10">
          <CardContent className="p-4">
            <div className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">This invoice is overdue</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Invoice Header Card */}
          <Card className="bg-card border-border border">
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2">
                      <FileText className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Professional Invoice
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Issue Date
                      </span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(invoice.issueDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Due Date
                      </span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-right">
                  <StatusBadge
                    status={invoice.status as StatusType}
                    className="px-3 py-1 text-sm font-medium"
                  >
                    <StatusIcon className="mr-1 h-3 w-3" />
                  </StatusBadge>
                  <div className="text-primary text-3xl font-bold">
                    {formatCurrency(invoice.totalAmount)}
                  </div>
                  <Button
                    onClick={handlePDFExport}
                    disabled={isExportingPDF}
                    variant="brand"
                    className="transform-none"
                  >
                    {isExportingPDF ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card className="bg-card border-border border">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <User className="h-5 w-5" />
                Bill To
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {invoice.client?.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                {invoice.client?.email && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    {invoice.client.email}
                  </div>
                )}
                {invoice.client?.phone && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    {invoice.client.phone}
                  </div>
                )}
                {(invoice.client?.addressLine1 ??
                  invoice.client?.city ??
                  invoice.client?.state) && (
                  <div className="flex items-start gap-2 text-gray-600 md:col-span-2 dark:text-gray-300">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                    <div>
                      {invoice.client?.addressLine1 && (
                        <div>{invoice.client.addressLine1}</div>
                      )}
                      {invoice.client?.addressLine2 && (
                        <div>{invoice.client.addressLine2}</div>
                      )}
                      {(invoice.client?.city ??
                        invoice.client?.state ??
                        invoice.client?.postalCode) && (
                        <div>
                          {[
                            invoice.client?.city,
                            invoice.client?.state,
                            invoice.client?.postalCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}
                      {invoice.client?.country && (
                        <div>{invoice.client.country}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card className="bg-card border-border border">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Invoice Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-border overflow-hidden border">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold">
                        Date
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold">
                        Description
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-right text-sm font-semibold">
                        Hours
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-right text-sm font-semibold">
                        Rate
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-right text-sm font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-border hover:bg-muted/50 border-t"
                      >
                        <td className="text-foreground px-4 py-3 text-sm">
                          {formatDate(item.date)}
                        </td>
                        <td className="text-foreground px-4 py-3 text-sm">
                          {item.description}
                        </td>
                        <td className="text-foreground px-4 py-3 text-right text-sm">
                          {item.hours}
                        </td>
                        <td className="text-foreground px-4 py-3 text-right text-sm">
                          {formatCurrency(item.rate)}
                        </td>
                        <td className="text-foreground px-4 py-3 text-right text-sm font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card className="bg-card border-border border">
              <CardHeader>
                <CardTitle className="text-primary">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {invoice.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <Card className="bg-card border-border border">
            <CardHeader>
              <CardTitle className="text-primary">Status Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoice.status === "draft" && (
                <Button
                  onClick={() => handleStatusUpdate("sent")}
                  disabled={updateStatus.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Mark as Sent
                </Button>
              )}

              {invoice.status === "sent" && (
                <Button
                  onClick={() => handleStatusUpdate("paid")}
                  disabled={updateStatus.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              )}

              {invoice.status === "overdue" && (
                <Button
                  onClick={() => handleStatusUpdate("paid")}
                  disabled={updateStatus.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              )}

              {invoice.status === "paid" && (
                <div className="py-4 text-center">
                  <DollarSign className="text-primary mx-auto mb-2 h-8 w-8" />
                  <p className="text-primary font-medium">Invoice Paid</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Summary */}
          <Card className="bg-card border-border border">
            <CardHeader>
              <CardTitle className="text-primary">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal
                  </span>
                  <span className="font-medium dark:text-white">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="font-medium dark:text-white">$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="dark:text-white">Total</span>
                  <span className="text-primary">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="border-border border-t pt-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {invoice.items?.length ?? 0} item
                  {invoice.items?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-card border-destructive/20 border">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="border-destructive/20 text-destructive hover:bg-destructive/10 w-full"
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
        <DialogContent className="bg-card border-border border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
              Delete Invoice
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this invoice? This action cannot
              be undone and will permanently remove the invoice and all its
              data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-border text-muted-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteInvoice.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteInvoice.isPending ? "Deleting..." : "Delete Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
