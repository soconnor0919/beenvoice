"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { StatusBadge, type StatusType } from "~/components/data/status-badge";
import { PDFDownloadButton } from "~/app/dashboard/invoices/[id]/_components/pdf-download-button";
import { DataTable, DataTableColumnHeader } from "~/components/data/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Eye, Edit, Trash2 } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

// Type for invoice data
interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  businessId: string | null;
  issueDate: Date;
  dueDate: Date;
  status: string;
  totalAmount: number;
  taxRate: number;
  notes: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date | null;
  client?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
  business?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
  items?: Array<{
    id: string;
    invoiceId: string;
    date: Date;
    description: string;
    hours: number;
    rate: number;
    amount: number;
    position: number;
    createdAt: Date;
  }> | null;
}

interface InvoicesDataTableProps {
  invoices: Invoice[];
}

const getStatusType = (invoice: Invoice): StatusType => {
  if (invoice.status === "paid") return "paid";
  if (invoice.status === "draft") return "draft";
  if (invoice.status === "overdue") return "overdue";
  if (invoice.status === "sent") {
    const dueDate = new Date(invoice.dueDate);
    return dueDate < new Date() ? "overdue" : "sent";
  }
  return "draft";
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function InvoicesDataTable({ invoices }: InvoicesDataTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const utils = api.useUtils();
  const deleteInvoice = api.invoices.delete.useMutation({
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      void utils.invoices.getAll.invalidate();
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete invoice");
    },
  });

  const handleRowClick = (invoice: Invoice) => {
    router.push(`/dashboard/invoices/${invoice.id}/view`);
  };

  const handleDelete = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoice.mutate({ id: invoiceToDelete.id });
    }
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "client.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Client" />
      ),
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="max-w-[80px] min-w-0 sm:max-w-[200px] lg:max-w-[300px]">
            <p className="truncate font-medium">
              {invoice.client?.name ?? "—"}
            </p>
            <p className="text-muted-foreground truncate text-xs sm:text-sm">
              {invoice.invoiceNumber}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "issueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("issueDate");
        return (
          <div className="min-w-0">
            <p className="truncate text-sm">{formatDate(date as Date)}</p>
            <p className="text-muted-foreground truncate text-xs">
              Due {formatDate(new Date(row.original.dueDate))}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const invoice = row.original;
        return <StatusBadge status={getStatusType(invoice)} />;
      },
      filterFn: (row, id, value: string[]) => {
        const invoice = row.original;
        const status = getStatusType(invoice);
        return value.includes(status);
      },
      meta: {
        headerClassName: "hidden sm:table-cell",
        cellClassName: "hidden sm:table-cell",
      },
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        const amount = row.getValue("totalAmount");
        return (
          <div className="text-right">
            <p className="text-sm font-semibold">
              {formatCurrency(amount as number)}
            </p>
            <p className="text-muted-foreground text-xs">
              {row.original.items?.length ?? 0} items
            </p>
          </div>
        );
      },
      meta: {
        headerClassName: "hidden sm:table-cell",
        cellClassName: "hidden sm:table-cell",
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Link href={`/dashboard/invoices/${invoice.id}/view`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                data-action-button="true"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href={`/dashboard/invoices/${invoice.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                data-action-button="true"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(invoice);
              }}
              data-action-button="true"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            {invoice.items && invoice.client && (
              <div data-action-button="true">
                <PDFDownloadButton invoiceId={invoice.id} variant="icon" />
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const filterableColumns = [
    {
      id: "status",
      title: "Status",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Sent", value: "sent" },
        { label: "Paid", value: "paid" },
        { label: "Overdue", value: "overdue" },
      ],
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={invoices}
        searchKey="invoiceNumber"
        searchPlaceholder="Search invoices..."
        filterableColumns={filterableColumns}
        onRowClick={handleRowClick}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete invoice{" "}
              <strong>{invoiceToDelete?.invoiceNumber}</strong> for{" "}
              <strong>{invoiceToDelete?.client?.name}</strong>? This action
              cannot be undone.
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
    </>
  );
}
