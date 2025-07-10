"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, FileText, User, DollarSign, Trash2, Edit, Download, Send } from "lucide-react";
import Link from "next/link";
import { generateInvoicePDF } from "~/lib/pdf-export";

interface InvoiceViewProps {
  invoiceId: string;
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
} as const;

const statusLabels = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
} as const;

export function InvoiceView({ invoiceId }: InvoiceViewProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Fetch invoice data
  const { data: invoice, isLoading, refetch } = api.invoices.getById.useQuery({ id: invoiceId });

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

  const handleStatusUpdate = (newStatus: "draft" | "sent" | "paid" | "overdue") => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice not found</h3>
        <p className="text-gray-500 mb-4">The invoice you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link href="/dashboard/invoices">Back to Invoices</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-6 w-6 text-emerald-600" />
                {invoice.invoiceNumber}
              </CardTitle>
              <p className="text-gray-600 mt-1">Created on {formatDate(invoice.createdAt)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[invoice.status as keyof typeof statusColors]}`}>
                {statusLabels[invoice.status as keyof typeof statusLabels]}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate("sent")}
                  disabled={invoice.status === "sent" || updateStatus.isLoading}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Mark Sent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate("paid")}
                  disabled={invoice.status === "paid" || updateStatus.isLoading}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Mark Paid
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePDFExport}
                  disabled={isExportingPDF}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {isExportingPDF ? "Generating..." : "Export PDF"}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Client Name</label>
                  <p className="text-gray-900 font-medium">{invoice.client?.name}</p>
                </div>
                {invoice.client?.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{invoice.client.email}</p>
                  </div>
                )}
                {invoice.client?.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{invoice.client.phone}</p>
                  </div>
                )}
                {(invoice.client?.addressLine1 || invoice.client?.city || invoice.client?.state) && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">
                      {[
                        invoice.client?.addressLine1,
                        invoice.client?.addressLine2,
                        invoice.client?.city,
                        invoice.client?.state,
                        invoice.client?.postalCode,
                      ].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Hours</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900">{formatDate(item.date)}</td>
                        <td className="py-3 px-4 text-gray-900">{item.description}</td>
                        <td className="py-3 px-4 text-gray-900 text-right">{item.hours}</td>
                        <td className="py-3 px-4 text-gray-900 text-right">{formatCurrency(item.rate)}</td>
                        <td className="py-3 px-4 text-gray-900 font-semibold text-right">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-emerald-200 bg-emerald-50/50">
                      <td colSpan={4} className="py-4 px-4 text-right font-semibold text-gray-900">Total:</td>
                      <td className="py-4 px-4 text-right font-bold text-emerald-600 text-lg">{formatCurrency(invoice.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Issue Date</label>
                  <p className="text-gray-900">{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status as keyof typeof statusColors]}`}>
                    {statusLabels[invoice.status as keyof typeof statusLabels]}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <label className="text-lg font-semibold text-gray-900">Total Amount</label>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(invoice.totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium">
                  <Link href={`/dashboard/invoices/${invoiceId}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Invoice
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handlePDFExport}
                  disabled={isExportingPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExportingPDF ? "Generating PDF..." : "Download PDF"}
                </Button>
                <Button
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Delete Invoice</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this invoice? This action cannot be undone.
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
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteInvoice.isLoading}
            >
              {deleteInvoice.isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 