"use client";
import { ChevronDown, Download, FileText, Filter, LayoutGrid, List, Plus, Search, Trash2, UserPlus, Pencil } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { generateInvoicePDF } from "~/lib/pdf-export";
import { api } from "~/trpc/react";

interface UniversalTableProps {
  resource: "clients" | "invoices";
}

interface Client {
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
  createdById: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client;
  issueDate: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid" | "overdue";
  totalAmount: number;
  notes: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date | null;
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

export function UniversalTable({ resource }: UniversalTableProps) {
  const [view, setView] = React.useState<"table" | "grid">("table");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [sortField, setSortField] = React.useState<string>("");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [batchStatusDialogOpen, setBatchStatusDialogOpen] = React.useState(false);
  const [exportingPDF, setExportingPDF] = React.useState<string | null>(null);

  // Fetch real data for clients or invoices
  const { data, isLoading, refetch } = resource === "clients"
    ? api.clients.getAll.useQuery()
    : api.invoices.getAll.useQuery();

  const deleteClient = api.clients.delete.useMutation({
    onSuccess: () => {
      toast.success("Client deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setSelected([]);
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete client");
    },
  });

  const deleteInvoice = api.invoices.delete.useMutation({
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setSelected([]);
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete invoice");
    },
  });

  const updateInvoiceStatus = api.invoices.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      setBatchStatusDialogOpen(false);
      setSelected([]);
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update status");
    },
  });

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete && itemToDelete !== "batch") {
      if (resource === "clients") {
        deleteClient.mutate({ id: itemToDelete });
      } else if (resource === "invoices") {
        deleteInvoice.mutate({ id: itemToDelete });
      }
    }
  };

  const handleBatchDelete = () => {
    if (selected.length > 0) {
      setItemToDelete("batch");
      setDeleteDialogOpen(true);
    }
  };

  const handleBatchStatusUpdate = (newStatus: "draft" | "sent" | "paid" | "overdue") => {
    if (selected.length > 0 && resource === "invoices") {
      Promise.all(selected.map(id => updateInvoiceStatus.mutateAsync({ id, status: newStatus })))
        .then(() => {
          toast.success(`Updated ${selected.length} invoice${selected.length > 1 ? 's' : ''} to ${newStatus}`);
          setBatchStatusDialogOpen(false);
          setSelected([]);
          void refetch();
        })
        .catch((error) => {
          toast.error("Failed to update some invoices");
        });
    }
  };

  const handlePDFExport = async (invoice: Invoice) => {
    setExportingPDF(invoice.id);
    try {
      await generateInvoicePDF(invoice);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setExportingPDF(null);
    }
  };

  const confirmBatchDelete = async () => {
    if (selected.length > 0) {
      try {
        if (resource === "clients") {
          await Promise.all(selected.map(id => deleteClient.mutateAsync({ id })));
          toast.success("Selected clients deleted successfully");
        } else if (resource === "invoices") {
          await Promise.all(selected.map(id => deleteInvoice.mutateAsync({ id })));
          toast.success("Selected invoices deleted successfully");
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        setSelected([]);
        void refetch();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : `Failed to delete selected ${resource}`;
        toast.error(errorMessage);
      }
    }
  };

  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    if (!data) return [];
    
    let filtered: (Client | Invoice)[] = data as (Client | Invoice)[];
    
    // Filter by search across all columns
    if (search) {
      const searchLower = search.toLowerCase();
      if (resource === "clients") {
        filtered = (data as Client[]).filter((row) =>
          (row.name?.toLowerCase().includes(searchLower) ?? false) ||
          (row.email?.toLowerCase().includes(searchLower) ?? false) ||
          (row.phone?.toLowerCase().includes(searchLower) ?? false) ||
          (row.addressLine1?.toLowerCase().includes(searchLower) ?? false) ||
          (row.city?.toLowerCase().includes(searchLower) ?? false) ||
          (row.state?.toLowerCase().includes(searchLower) ?? false)
        );
      } else if (resource === "invoices") {
        filtered = (data as Invoice[]).filter((row) =>
          (row.invoiceNumber?.toLowerCase().includes(searchLower) ?? false) ||
          (row.client?.name?.toLowerCase().includes(searchLower) ?? false) ||
          (row.client?.email?.toLowerCase().includes(searchLower) ?? false) ||
          (row.status?.toLowerCase().includes(searchLower) ?? false) ||
          (row.totalAmount?.toString().includes(searchLower) ?? false) ||
          (row.notes?.toLowerCase().includes(searchLower) ?? false)
        );
      }
    }

    // Filter by status
    if (statusFilter !== "all" && resource === "invoices") {
      filtered = filtered.filter((row) => (row as Invoice).status === statusFilter);
    }
    
    // Sort data
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: unknown = (a as unknown as Record<string, unknown>)[sortField];
        let bValue: unknown = (b as unknown as Record<string, unknown>)[sortField];
        
        // Handle nested properties (e.g., client.name)
        if (sortField === "client.name") {
          aValue = (a as Invoice).client?.name;
          bValue = (b as Invoice).client?.name;
        }
        
        // Handle date fields
        if (sortField === "issueDate" || sortField === "dueDate" || sortField === "createdAt") {
          aValue = new Date(aValue as string | number | Date).getTime();
          bValue = new Date(bValue as string | number | Date).getTime();
        }
        
        // Handle numeric fields
        if (sortField === "totalAmount") {
          aValue = parseFloat(String(aValue)) || 0;
          bValue = parseFloat(String(bValue)) || 0;
        }
        
        // Type-safe comparison
        const aNum = typeof aValue === 'number' ? aValue : 0;
        const bNum = typeof bValue === 'number' ? bValue : 0;
        
        if (aNum < bNum) return sortDirection === "asc" ? -1 : 1;
        if (aNum > bNum) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by date (newest first for invoices, name for clients)
      if (resource === "invoices") {
        filtered = [...filtered].sort((a, b) => {
          const aDate = new Date((a as Invoice).issueDate ?? (a as Invoice).createdAt).getTime();
          const bDate = new Date((b as Invoice).issueDate ?? (b as Invoice).createdAt).getTime();
          return bDate - aDate; // Newest first
        });
      } else if (resource === "clients") {
        filtered = [...filtered].sort((a, b) => {
          return ((a as Client).name ?? "").localeCompare((b as Client).name ?? "");
        });
      }
    }
    
    return filtered;
  }, [data, search, resource, sortField, sortDirection, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, sortField, sortDirection, statusFilter]);

  const allSelected = selected.length === (paginatedData?.length ?? 0) && (paginatedData?.length ?? 0) > 0;
  const toggleAll = () => setSelected(allSelected ? [] : (paginatedData ?? []).map((d) => d.id));
  const toggleOne = (id: string) => setSelected((sel) => sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const renderTableHeaders = () => {
    if (resource === "clients") {
      return (
        <>
          <TableHead className="w-12 py-4 px-4">
            <Checkbox 
              checked={allSelected} 
              onCheckedChange={toggleAll} 
              aria-label="Select all"
              className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
            />
          </TableHead>
          <TableHead 
            className="py-4 px-4 font-semibold text-gray-700 text-base cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort("name")}
          >
            <div className="flex items-center gap-1">
              Name
              {sortField === "name" && (
                <ChevronDown className={`h-3 w-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`} />
              )}
            </div>
          </TableHead>
          <TableHead className="py-4 px-4 font-semibold text-gray-700 text-base">Email</TableHead>
          <TableHead className="py-4 px-4 font-semibold text-gray-700 text-base">Phone</TableHead>
          <TableHead className="w-8 py-4 px-4"></TableHead>
        </>
      );
    } else if (resource === "invoices") {
      return (
        <>
          <TableHead className="w-12 py-4 px-4">
            <Checkbox 
              checked={allSelected} 
              onCheckedChange={toggleAll} 
              aria-label="Select all"
              className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
            />
          </TableHead>
          <TableHead 
            className="py-4 px-4 font-semibold text-gray-700 text-base cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort("invoiceNumber")}
          >
            <div className="flex items-center gap-1">
              Invoice #
              {sortField === "invoiceNumber" && (
                <ChevronDown className={`h-3 w-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`} />
              )}
            </div>
          </TableHead>
          <TableHead 
            className="py-4 px-4 font-semibold text-gray-700 text-base cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort("client.name")}
          >
            <div className="flex items-center gap-1">
              Client
              {sortField === "client.name" && (
                <ChevronDown className={`h-3 w-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`} />
              )}
            </div>
          </TableHead>
          <TableHead 
            className="py-4 px-4 font-semibold text-gray-700 text-base cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort("status")}
          >
            <div className="flex items-center gap-1">
              Status
              {sortField === "status" && (
                <ChevronDown className={`h-3 w-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`} />
              )}
            </div>
          </TableHead>
          <TableHead 
            className="py-4 px-4 font-semibold text-gray-700 text-base cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort("totalAmount")}
          >
            <div className="flex items-center gap-1">
              Total
              {sortField === "totalAmount" && (
                <ChevronDown className={`h-3 w-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`} />
              )}
            </div>
          </TableHead>
          <TableHead 
            className="py-4 px-4 font-semibold text-gray-700 text-base cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort("dueDate")}
          >
            <div className="flex items-center gap-1">
              Due Date
              {sortField === "dueDate" && (
                <ChevronDown className={`h-3 w-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`} />
              )}
            </div>
          </TableHead>
          <TableHead className="w-8 py-4 px-4"></TableHead>
        </>
      );
    }
    return null;
  };

  const renderTableRows = () => {
    if (isLoading) {
      const skeletonCount = resource === "invoices" ? 6 : 5;
      return Array.from({ length: skeletonCount }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell className="py-4 px-4"><Skeleton className="h-4 w-4" /></TableCell>
          <TableCell className="py-4 px-4"><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell className="py-4 px-4"><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell className="py-4 px-4"><Skeleton className="h-4 w-28" /></TableCell>
          {resource === "invoices" && (
            <>
              <TableCell className="py-4 px-4"><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell className="py-4 px-4"><Skeleton className="h-4 w-24" /></TableCell>
            </>
          )}
          <TableCell className="py-4 px-4"><Skeleton className="h-8 w-8 rounded" /></TableCell>
        </TableRow>
      ));
    }

    if (paginatedData.length === 0) {
      const colSpan = resource === "invoices" ? 7 : 5;
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="py-12 text-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              {resource === "clients" ? (
                <UserPlus className="h-8 w-8 text-emerald-400 mb-2" />
              ) : (
                <FileText className="h-8 w-8 text-emerald-400 mb-2" />
              )}
              <div className="text-lg font-semibold">No {resource} found</div>
              <div className="text-gray-500 mb-2">Get started by adding your first {resource.slice(0, -1)}.</div>
              <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium">
                <Link href={`/dashboard/${resource}/new`}>
                  <Plus className="mr-2 h-4 w-4" /> Add {resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(0, -1).slice(1)}
                </Link>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return paginatedData.map((row) => {
      if (resource === "clients") {
        const client = row as Client;
        return (
          <TableRow
            key={client.id}
            data-selected={selected.includes(client.id)}
            className="transition-colors hover:bg-emerald-50/60 group cursor-pointer"
            onClick={e => {
              if ((e.target as HTMLElement).closest('button, input, [role="menuitem"]')) return;
              window.location.href = `/dashboard/clients/${client.id}/edit`;
            }}
          >
            <TableCell className="py-4 px-4" onClick={e => e.stopPropagation()}>
              <Checkbox 
                checked={selected.includes(client.id)} 
                onCheckedChange={() => toggleOne(client.id)} 
                aria-label="Select row"
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
            </TableCell>
            <TableCell className="py-4 px-4 text-gray-900 text-base font-medium group-hover:text-emerald-700">
              <Link href={`/dashboard/clients/${client.id}/edit`} className="hover:underline">
                {client.name}
              </Link>
            </TableCell>
            <TableCell className="py-4 px-4 text-gray-700">{client.email}</TableCell>
            <TableCell className="py-4 px-4 text-gray-700">{client.phone}</TableCell>
            <TableCell className="py-4 px-4" onClick={e => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Actions">
                    ...
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/clients/${client.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => handleDelete(client.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        );
      } else if (resource === "invoices") {
        const invoice = row as Invoice;
        return (
          <TableRow
            key={invoice.id}
            data-selected={selected.includes(invoice.id)}
            className="transition-colors hover:bg-emerald-50/60 group cursor-pointer"
            onClick={e => {
              if ((e.target as HTMLElement).closest('button, input, [role="menuitem"]')) return;
              window.location.href = `/dashboard/invoices/${invoice.id}`;
            }}
          >
            <TableCell className="py-4 px-4" onClick={e => e.stopPropagation()}>
              <Checkbox 
                checked={selected.includes(invoice.id)} 
                onCheckedChange={() => toggleOne(invoice.id)} 
                aria-label="Select row"
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
            </TableCell>
            <TableCell className="py-4 px-4 text-gray-900 text-base font-medium group-hover:text-emerald-700">
              <Link href={`/dashboard/invoices/${invoice.id}`} className="hover:underline">
                {invoice.invoiceNumber}
              </Link>
            </TableCell>
            <TableCell className="py-4 px-4 text-gray-700">{invoice.client?.name}</TableCell>
            <TableCell className="py-4 px-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                {statusLabels[invoice.status]}
              </span>
            </TableCell>
            <TableCell className="py-4 px-4 text-gray-700 font-medium">{formatCurrency(invoice.totalAmount)}</TableCell>
            <TableCell className="py-4 px-4 text-gray-700">{formatDate(invoice.dueDate)}</TableCell>
            <TableCell className="py-4 px-4" onClick={e => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Actions">
                    ...
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => handleDelete(invoice.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePDFExport(invoice)} disabled={exportingPDF === invoice.id}>
                    <Download className="h-4 w-4 mr-2" /> 
                    {exportingPDF === invoice.id ? "Generating..." : "Export"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        );
      }
      return null;
    });
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 p-4 bg-white/90 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex gap-2 items-center">
          <Button variant={view === "table" ? "default" : "ghost"} size="icon" onClick={() => setView("table")}> <List className="h-4 w-4" /> </Button>
          <Button variant={view === "grid" ? "default" : "ghost"} size="icon" onClick={() => setView("grid")}> <LayoutGrid className="h-4 w-4" /> </Button>
          
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem className="font-medium text-gray-700">Filters</DropdownMenuItem>
              {resource === "invoices" && (
                <>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("all")}
                    className={statusFilter === "all" ? "bg-emerald-50 text-emerald-700" : ""}
                  >
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("draft")}
                    className={statusFilter === "draft" ? "bg-emerald-50 text-emerald-700" : ""}
                  >
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("sent")}
                    className={statusFilter === "sent" ? "bg-emerald-50 text-emerald-700" : ""}
                  >
                    Sent
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("paid")}
                    className={statusFilter === "paid" ? "bg-emerald-50 text-emerald-700" : ""}
                  >
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("overdue")}
                    className={statusFilter === "overdue" ? "bg-emerald-50 text-emerald-700" : ""}
                  >
                    Overdue
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-2 items-center min-w-0 flex-1">
          <Input
            placeholder={`Search ${resource}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
        </div>
        
        <div className="flex gap-2 items-center flex-shrink-0">
          {selected.length > 0 && (
            <>
              <span className="text-sm text-gray-500">{selected.length} selected</span>
              {resource === "invoices" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update Status <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBatchStatusUpdate("draft")}>
                      Mark as Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBatchStatusUpdate("sent")}>
                      Mark as Sent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBatchStatusUpdate("paid")}>
                      Mark as Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBatchStatusUpdate("overdue")}>
                      Mark as Overdue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="destructive" size="sm" onClick={handleBatchDelete}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
            </>
          )}
        </div>
      </div>
      {/* Table View */}
      {view === "table" && (
        <div className="rounded-2xl shadow-xl border border-gray-200 bg-white/90 overflow-hidden">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {renderTableHeaders()}
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Pagination Controls */}
      {view === "table" && totalPages > 1 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-3 bg-white/95 border-t border-gray-200 rounded-xl shadow-sm mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} {resource}
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-28 h-8 px-2 py-1 text-sm border border-gray-300 rounded-md bg-white focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                if (totalPages <= 5) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                      aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                      aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {/* Grid View (placeholder) */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-card-${index}`} className="bg-white/90 rounded-2xl shadow-xl border border-gray-200 p-4 flex flex-col gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))
          ) : filteredAndSortedData.length === 0 ? (
            <div className="col-span-full flex flex-col items-center py-16 text-gray-500">
              {resource === "clients" ? (
                <UserPlus className="h-8 w-8 text-emerald-400 mb-2" />
              ) : (
                <FileText className="h-8 w-8 text-emerald-400 mb-2" />
              )}
              <div className="text-lg font-semibold">No {resource} found</div>
              <div className="text-gray-500 mb-2">Get started by adding your first {resource.slice(0, -1)}.</div>
              <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium">
                <Link href={`/dashboard/${resource}/new`}>
                  <Plus className="mr-2 h-4 w-4" /> Add {resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(0, -1).slice(1)}
                </Link>
              </Button>
            </div>
          ) : (
            filteredAndSortedData.map((row) => {
              if (resource === "clients") {
                const client = row as Client;
                return (
                  <div key={client.id} className="bg-white/90 rounded-2xl shadow-xl border border-gray-200 p-4 flex flex-col gap-2 transition-colors hover:bg-emerald-50/60 cursor-pointer">
                    <div className="font-semibold text-lg text-gray-900 group-hover:text-emerald-700">{client.name}</div>
                    <div className="text-sm text-gray-700">{client.email}</div>
                    <div className="text-sm text-gray-700">{client.phone}</div>
                  </div>
                );
              } else {
                const invoice = row as Invoice;
                return (
                  <div key={invoice.id} className="bg-white/90 rounded-2xl shadow-xl border border-gray-200 p-4 flex flex-col gap-2 transition-colors hover:bg-emerald-50/60 cursor-pointer">
                    <div className="font-semibold text-lg text-gray-900 group-hover:text-emerald-700">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-700">{invoice.client?.name}</div>
                    <div className="text-sm text-gray-700">{formatCurrency(invoice.totalAmount)}</div>
                  </div>
                );
              }
            })
          )}
        </div>
      )}
      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Delete {resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(0, -1).slice(1)}{itemToDelete === "batch" ? "s" : ""}</DialogTitle>
            <DialogDescription className="text-gray-600">
              {itemToDelete === "batch"
                ? `Are you sure you want to delete the selected ${resource}? This action cannot be undone.`
                : `Are you sure you want to delete this ${resource.slice(0, -1)}? This action cannot be undone.`}
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
              onClick={itemToDelete === "batch" ? confirmBatchDelete : confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 