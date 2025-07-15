"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { StatusBadge, type StatusType } from "~/components/data/status-badge";
import { PDFDownloadButton } from "~/app/dashboard/invoices/[id]/_components/pdf-download-button";
import { DataTable, DataTableColumnHeader } from "~/components/data/data-table";
import { EmptyState } from "~/components/layout/page-layout";
import { Plus, FileText, Eye, Edit } from "lucide-react";

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

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice" />
    ),
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-status-success-muted hidden rounded-lg p-2 sm:flex">
            <FileText className="text-status-success h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{invoice.invoiceNumber}</p>
            <p className="text-muted-foreground truncate text-sm">
              {invoice.items?.length || 0} items
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "client.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="min-w-0">
          <p className="truncate font-medium">{invoice.client?.name || "—"}</p>
          <p className="text-muted-foreground truncate text-sm">
            {invoice.client?.email || "—"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue Date" />
    ),
    cell: ({ row }) => formatDate(row.getValue("issueDate")),
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => formatDate(row.getValue("dueDate")),
    meta: {
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return <p className="font-semibold">{formatCurrency(amount)}</p>;
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
    filterFn: (row, id, value) => {
      const invoice = row.original;
      const status = getStatusType(invoice);
      return value.includes(status);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/dashboard/invoices/${invoice.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </Link>
          {invoice.items && invoice.client && (
            <PDFDownloadButton invoiceId={invoice.id} variant="icon" />
          )}
        </div>
      );
    },
  },
];

export function InvoicesDataTable({ invoices }: InvoicesDataTableProps) {
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
    <DataTable
      columns={columns}
      data={invoices}
      searchKey="invoiceNumber"
      searchPlaceholder="Search invoices..."
      filterableColumns={filterableColumns}
    />
  );
}
