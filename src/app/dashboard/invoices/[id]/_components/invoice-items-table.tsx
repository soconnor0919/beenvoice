"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data/data-table";

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

// Type for invoice item data
interface InvoiceItem {
  id: string;
  invoiceId: string;
  date: Date;
  description: string;
  hours: number;
  rate: number;
  amount: number;
  position: number;
  createdAt: Date;
}

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

const columns: ColumnDef<InvoiceItem>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.getValue("date")),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "hours",
    header: "Hours",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("hours")}</div>
    ),
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("rate"))}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-icon-emerald text-right font-medium">
        {formatCurrency(row.getValue("amount"))}
      </div>
    ),
  },
];

export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={items}
      showSearch={false}
      showColumnVisibility={false}
      showPagination={false}
    />
  );
}
