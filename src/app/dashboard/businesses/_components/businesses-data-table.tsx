"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { DataTable, DataTableColumnHeader } from "~/components/data/data-table";
import { Building, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { toast } from "sonner";

// Type for business data
interface Business {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  website: string | null;
  taxId: string | null;
  logoUrl: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface BusinessesDataTableProps {
  businesses: Business[];
}

const formatAddress = (business: Business) => {
  const parts = [
    business.addressLine1,
    business.addressLine2,
    business.city,
    business.state,
    business.postalCode,
  ].filter(Boolean);
  return parts.join(", ") || "—";
};

export function BusinessesDataTable({ businesses }: BusinessesDataTableProps) {
  const router = useRouter();
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(
    null,
  );

  const utils = api.useUtils();

  const deleteBusinessMutation = api.businesses.delete.useMutation({
    onSuccess: () => {
      toast.success("Business deleted successfully");
      setBusinessToDelete(null);
      void utils.businesses.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete business: ${error.message}`);
    },
  });

  const handleDelete = () => {
    if (!businessToDelete) return;
    deleteBusinessMutation.mutate({ id: businessToDelete.id });
  };

  const handleRowClick = (business: Business) => {
    router.push(`/dashboard/businesses/${business.id}`);
  };

  const columns: ColumnDef<Business>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const business = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-blue-subtle hidden rounded-lg p-2 sm:flex">
              <Building className="text-icon-blue h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">{business.name}</p>
              <p className="text-muted-foreground truncate text-sm">
                {business.email ?? "—"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => row.original.phone ?? "—",
      meta: {
        headerClassName: "hidden md:table-cell",
        cellClassName: "hidden md:table-cell",
      },
    },
    {
      id: "address",
      header: "Address",
      cell: ({ row }) => formatAddress(row.original),
      meta: {
        headerClassName: "hidden lg:table-cell",
        cellClassName: "hidden lg:table-cell",
      },
    },
    {
      accessorKey: "taxId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tax ID" />
      ),
      cell: ({ row }) => row.original.taxId ?? "—",
      meta: {
        headerClassName: "hidden xl:table-cell",
        cellClassName: "hidden xl:table-cell",
      },
    },
    {
      accessorKey: "website",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Website" />
      ),
      cell: ({ row }) => {
        const website = row.original.website;
        if (!website) return "—";

        // Add https:// if not present
        const url = website.startsWith("http") ? website : `https://${website}`;

        return (
          <>
            {/* Desktop: Show full URL */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hidden hover:underline sm:inline"
              data-action-button="true"
            >
              {website}
            </a>
            {/* Mobile: Show link button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 sm:hidden"
              asChild
              data-action-button="true"
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const business = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Link href={`/dashboard/businesses/${business.id}/edit`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                data-action-button="true"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
              data-action-button="true"
              onClick={() => setBusinessToDelete(business)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={businesses}
        searchKey="name"
        searchPlaceholder="Search businesses..."
        onRowClick={handleRowClick}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!businessToDelete}
        onOpenChange={(open) => !open && setBusinessToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              business "{businessToDelete?.name}" and remove all associated
              data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBusinessToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteBusinessMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
