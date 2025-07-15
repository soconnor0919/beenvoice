"use client";

import { useState } from "react";
import { DataTable } from "~/components/data/data-table";
import { PageHeader } from "~/components/layout/page-header";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/data/data-table";
import { DashboardBreadcrumbs } from "~/components/navigation/dashboard-breadcrumbs";
import Link from "next/link";

// Sample data type
interface DemoItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: Date;
}

// Generate sample data
const sampleData: DemoItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Item ${i + 1}`,
  email: `item${i + 1}@example.com`,
  phone: `555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  status: ["active", "pending", "inactive"][
    Math.floor(Math.random() * 3)
  ] as string,
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
}));

// Define columns with responsive behavior
const columns: ColumnDef<DemoItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-muted-foreground text-xs">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => row.original.phone,
    meta: {
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          row.original.status === "active"
            ? "bg-green-100 text-green-700"
            : row.original.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(date);
    },
    meta: {
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
    },
  },
];

export default function TableLayoutDemo() {
  const [data] = useState(sampleData);

  const filterableColumns = [
    {
      id: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DashboardBreadcrumbs />

      <PageHeader
        title="Table Layout & Breadcrumb Demo"
        description="This demo showcases the improved responsive layouts and dynamic breadcrumbs. The breadcrumbs automatically handle pluralization and capitalization. Navigate to different pages to see how they adapt."
        variant="gradient"
      >
        <Button variant="brand" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Item
        </Button>
      </PageHeader>

      <div className="mt-8">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search items..."
          filterableColumns={filterableColumns}
          showColumnVisibility={true}
          showPagination={true}
          showSearch={true}
          pageSize={10}
        />
      </div>

      <div className="mt-16 space-y-4">
        <h2 className="text-2xl font-bold">Layout Improvements</h2>
        <div className="text-muted-foreground space-y-2 text-sm">
          <p>
            • Page header: Description text wraps below the title and action
            buttons
          </p>
          <p>
            • Filter bar: Search and filters stay inline on mobile with proper
            wrapping
          </p>
          <p>
            • Pagination bar: Entry count and controls remain on the same line
            on mobile
          </p>
          <p>
            • Columns: Responsive hiding with both headers and cells hidden
            together
          </p>
          <p>
            • Compact design: Tighter padding for more efficient space usage
          </p>
        </div>

        <h2 className="mt-8 text-2xl font-bold">Dynamic Breadcrumbs</h2>
        <div className="text-muted-foreground space-y-2 text-sm">
          <p>
            • Automatic pluralization: "Business" becomes "Businesses" on list
            pages
          </p>
          <p>• Smart capitalization: Route segments are properly capitalized</p>
          <p>• Context awareness: Shows resource names instead of UUIDs</p>
          <p>
            • Clean presentation: Edit pages show the resource name, not "Edit"
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Try these example routes:</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/businesses">
              <Button variant="outline" size="sm">
                Businesses List
              </Button>
            </Link>
            <Link href="/dashboard/clients">
              <Button variant="outline" size="sm">
                Clients List
              </Button>
            </Link>
            <Link href="/dashboard/invoices">
              <Button variant="outline" size="sm">
                Invoices List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
