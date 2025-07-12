"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
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
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  FileText,
  User,
  DollarSign,
  Trash2,
  Edit,
  Download,
  Send,
  ArrowLeft,
  Clock,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { generateInvoicePDF } from "~/lib/pdf-export";
import { InvoiceViewSkeleton } from "~/components/ui/skeleton";

interface InvoiceViewProps {
  invoiceId: string;
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: FileText },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-800", icon: Send },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800",
    icon: DollarSign,
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
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

  const handleStatusUpdate = (
    newStatus: "draft" | "sent" | "paid" | "overdue",
  ) => {
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
    return <InvoiceViewSkeleton />;
  }

  if (!invoice) {
    return (
      <div className="py-12 text-center">
        <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          Invoice not found
        </h3>
        <p className="mb-4 text-gray-500">
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
    statusConfig[invoice.status as keyof typeof statusConfig].icon;

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {isOverdue && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
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
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {invoice.invoiceNumber}
                      </h2>
                      <p className="text-gray-600">Professional Invoice</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">Issue Date</span>
                      <p className="font-medium text-gray-900">
                        {formatDate(invoice.issueDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date</span>
                      <p className="font-medium text-gray-900">
                        {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-right">
                  <Badge
                    className={`${statusConfig[invoice.status as keyof typeof statusConfig].color} px-3 py-1 text-sm font-medium`}
                  >
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {
                      statusConfig[invoice.status as keyof typeof statusConfig]
                        .label
                    }
                  </Badge>
                  <div className="text-3xl font-bold text-emerald-600">
                    {formatCurrency(invoice.totalAmount)}
                  </div>
                  <Button
                    onClick={handlePDFExport}
                    disabled={isExportingPDF}
                    className="transform-none bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white shadow-lg transition-shadow duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
                  >
                    {isExportingPDF ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <User className="h-5 w-5" />
                Bill To
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {invoice.client?.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                {invoice.client?.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {invoice.client.email}
                  </div>
                )}
                {invoice.client?.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {invoice.client.phone}
                  </div>
                )}
                {(invoice.client?.addressLine1 ??
                  invoice.client?.city ??
                  invoice.client?.state) && (
                  <div className="flex items-start gap-2 text-gray-600 md:col-span-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
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
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Clock className="h-5 w-5" />
                Invoice Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Hours
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {item.hours}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {formatCurrency(item.rate)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
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
            <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-700">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700">
                  {invoice.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-700">Status Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoice.status === "draft" && (
                <Button
                  onClick={() => handleStatusUpdate("sent")}
                  disabled={updateStatus.isPending}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Mark as Sent
                </Button>
              )}

              {invoice.status === "sent" && (
                <Button
                  onClick={() => handleStatusUpdate("paid")}
                  disabled={updateStatus.isPending}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              )}

              {invoice.status === "overdue" && (
                <Button
                  onClick={() => handleStatusUpdate("paid")}
                  disabled={updateStatus.isPending}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              )}

              {invoice.status === "paid" && (
                <div className="py-4 text-center">
                  <DollarSign className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <p className="font-medium text-green-600">Invoice Paid</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Summary */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-700">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-emerald-600">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 text-center">
                <p className="text-sm text-gray-500">
                  {invoice.items?.length ?? 0} item
                  {invoice.items?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-0 border-red-200 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="w-full border-red-200 text-red-700 hover:bg-red-50"
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
        <DialogContent className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Delete Invoice
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this invoice? This action cannot
              be undone and will permanently remove the invoice and all its
              data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteInvoice.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteInvoice.isPending ? "Deleting..." : "Delete Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
