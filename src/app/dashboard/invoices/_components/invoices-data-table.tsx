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
    accessorKey: "client.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="min-w-0 max-w-[80px] sm:max-w-[200px] lg:max-w-[300px]">
          <p className="truncate font-medium">{invoice.client?.name ?? "—"}</p>
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
      const date = row.getValue("issueDate") as Date;
      return (
        <div className="min-w-0">
          <p className="truncate text-sm">{formatDate(date)}</p>
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
    filterFn: (row, id, value) => {
      const invoice = row.original;
      const status = getStatusType(invoice);
      return value.includes(status);
    },
    meta: {
      headerClassName: "hidden xs:table-cell",
      cellClassName: "hidden xs:table-cell",
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return (
        <div className="text-right">
          <p className="font-semibold text-sm">{formatCurrency(amount)}</p>
          <p className="text-muted-foreground text-xs">
            {row.original.items?.length ?? 0} items
          </p>
        </div>
      );
    },
    meta: {
      headerClassName: "hidden xs:table-cell",
      cellClassName: "hidden xs:table-cell",
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
