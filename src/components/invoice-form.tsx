"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { DatePicker } from "~/components/ui/date-picker";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { SearchableSelect } from "~/components/ui/select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import {
  Calendar,
  FileText,
  User,
  Plus,
  Trash2,
  DollarSign,
  Clock,
  Edit3,
  Save,
  X,
  AlertCircle,
  Building,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { FormSkeleton } from "~/components/ui/skeleton";
import { EditableInvoiceItems } from "~/components/editable-invoice-items";

const STATUS_OPTIONS = [
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "sent",
    label: "Sent",
  },
  {
    value: "paid",
    label: "Paid",
  },
  {
    value: "overdue",
    label: "Overdue",
  },
] as const;

interface InvoiceFormProps {
  invoiceId?: string;
}

export function InvoiceForm({ invoiceId }: InvoiceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now().toString().slice(-6)}`,
    businessId: "",
    clientId: "",
    issueDate: new Date(),
    dueDate: new Date(),
    status: "draft" as "draft" | "sent" | "paid" | "overdue",
    notes: "",
    taxRate: 0,
    items: [
      {
        id: crypto.randomUUID(),
        date: new Date(),
        description: "",
        hours: 0,
        rate: 0,
        amount: 0,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [defaultRate, setDefaultRate] = useState(0);

  // Fetch clients and businesses for dropdowns
  const { data: clients, isLoading: loadingClients } =
    api.clients.getAll.useQuery();
  const { data: businesses, isLoading: loadingBusinesses } =
    api.businesses.getAll.useQuery();

  // Fetch existing invoice data if editing
  const { data: existingInvoice, isLoading: loadingInvoice } =
    api.invoices.getById.useQuery({ id: invoiceId! }, { enabled: !!invoiceId });

  // Populate form with existing data when editing
  React.useEffect(() => {
    if (existingInvoice && invoiceId) {
      setFormData({
        invoiceNumber: existingInvoice.invoiceNumber,
        businessId: existingInvoice.businessId ?? "",
        clientId: existingInvoice.clientId,
        issueDate: new Date(existingInvoice.issueDate),
        dueDate: new Date(existingInvoice.dueDate),
        status: existingInvoice.status as "draft" | "sent" | "paid" | "overdue",
        notes: existingInvoice.notes ?? "",
        taxRate: existingInvoice.taxRate,
        items: existingInvoice.items?.map((item) => ({
          id: crypto.randomUUID(),
          date: new Date(item.date),
          description: item.description,
          hours: item.hours,
          rate: item.rate,
          amount: item.amount,
        })) || [
          {
            id: crypto.randomUUID(),
            date: new Date(),
            description: "",
            hours: 0,
            rate: 0,
            amount: 0,
          },
        ],
      });

      // Set default rate from first item
      if (existingInvoice.items?.[0]) {
        setDefaultRate(existingInvoice.items[0].rate);
      }
    }
  }, [existingInvoice, invoiceId]);

  // Calculate totals
  const totals = React.useMemo(() => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.hours * item.rate,
      0,
    );
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const total = subtotal + taxAmount;
    return {
      subtotal,
      taxAmount,
      total,
    };
  }, [formData.items, formData.taxRate]);

  // Add new item
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          date: new Date(),
          description: "",
          hours: 0,
          rate: defaultRate,
          amount: 0,
        },
      ],
    }));
  };

  // Remove item
  const removeItem = (idx: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== idx),
      }));
    }
  };

  // Apply default rate to all items
  const applyDefaultRate = () => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({
        ...item,
        rate: defaultRate,
        amount: item.hours * defaultRate,
      })),
    }));
  };

  // tRPC mutations
  const createInvoice = api.invoices.create.useMutation({
    onSuccess: () => {
      toast.success("Invoice created successfully");
      router.push("/dashboard/invoices");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create invoice");
    },
  });

  const updateInvoice = api.invoices.update.useMutation({
    onSuccess: () => {
      toast.success("Invoice updated successfully");
      router.push(`/dashboard/invoices/${invoiceId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update invoice");
    },
  });

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.businessId) {
      toast.error("Please select a business");
      return;
    }

    if (!formData.clientId) {
      toast.error("Please select a client");
      return;
    }

    if (formData.items.some((item) => !item.description.trim())) {
      toast.error("Please fill in all item descriptions");
      return;
    }

    if (formData.items.some((item) => item.hours <= 0)) {
      toast.error("Please enter valid hours for all items");
      return;
    }

    if (formData.items.some((item) => item.rate <= 0)) {
      toast.error("Please enter valid rates for all items");
      return;
    }

    setLoading(true);
    try {
      // In the handleSubmit, ensure items are sent in the current array order with no sorting
      const submitData = {
        ...formData,
        items: formData.items.map((item) => ({
          date: new Date(item.date),
          description: item.description,
          hours: item.hours,
          rate: item.rate,
          amount: item.amount,
          // position will be set by backend based on array order
        })),
      };

      if (invoiceId) {
        await updateInvoice.mutateAsync({
          id: invoiceId,
          ...submitData,
        });
      } else {
        await createInvoice.mutateAsync(submitData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching existing invoice data
  if (invoiceId && loadingInvoice) {
    return (
      <div className="space-y-6 pb-20">
        {/* Invoice Details Card Skeleton */}
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader>
            <div className="h-6 w-48 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-10 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items Card Skeleton */}
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-10 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items Table Header Skeleton */}
            <div className="grid grid-cols-12 gap-2 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-gray-300 dark:bg-gray-600"
                ></div>
              ))}
            </div>

            {/* Items Skeleton */}
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="grid animate-pulse grid-cols-12 items-center gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-10 rounded bg-gray-300 dark:bg-gray-600"
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Controls Bar Skeleton */}
        <div className="mt-6">
          <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/90">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-10 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedClient = clients?.find((c) => c.id === formData.clientId);
  const selectedBusiness = businesses?.find(
    (b) => b.id === formData.businessId,
  );

  // Show loading state while fetching clients
  if (loadingClients) {
    return (
      <div className="space-y-6 pb-20">
        {/* Invoice Details Card Skeleton */}
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <div className="h-6 w-48 animate-pulse rounded bg-gray-300"></div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-10 animate-pulse rounded bg-gray-300"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items Card Skeleton */}
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-300"></div>
              <div className="h-10 w-24 animate-pulse rounded bg-gray-300"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items Table Header Skeleton */}
            <div className="grid grid-cols-12 gap-2 rounded-lg bg-gray-50 px-4 py-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-gray-300"
                ></div>
              ))}
            </div>

            {/* Items Skeleton */}
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="grid animate-pulse grid-cols-12 items-center gap-2 rounded-lg border border-gray-200 p-4"
                >
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div key={j} className="h-10 rounded bg-gray-300"></div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Controls Bar Skeleton */}
        <div className="mt-6">
          <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-20 animate-pulse rounded bg-gray-300"></div>
                <div className="h-10 w-32 animate-pulse rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form id="invoice-form" onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Invoice Details Card */}
      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <FileText className="h-5 w-5" />
            Invoice Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber" className="text-sm font-medium">
                Invoice Number
              </Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                className="bg-muted"
                placeholder="Auto-generated"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessId" className="text-sm font-medium">
                Business *
              </Label>
              <SearchableSelect
                value={formData.businessId}
                onValueChange={(value) =>
                  setFormData((f) => ({ ...f, businessId: value }))
                }
                options={
                  businesses?.map((business) => ({
                    value: business.id,
                    label: business.name,
                  })) ?? []
                }
                placeholder="Select a business"
                searchPlaceholder="Search businesses..."
                disabled={loadingBusinesses}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId" className="text-sm font-medium">
                Client *
              </Label>
              <SearchableSelect
                value={formData.clientId}
                onValueChange={(value) =>
                  setFormData((f) => ({ ...f, clientId: value }))
                }
                options={
                  clients?.map((client) => ({
                    value: client.id,
                    label: client.name,
                  })) ?? []
                }
                placeholder="Select a client"
                searchPlaceholder="Search clients..."
                disabled={loadingClients}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((f) => ({
                    ...f,
                    status: value as "draft" | "sent" | "paid" | "overdue",
                  }))
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDate" className="text-sm font-medium">
                Issue Date *
              </Label>
              <DatePicker
                date={formData.issueDate}
                onDateChange={(date) =>
                  setFormData((f) => ({ ...f, issueDate: date ?? new Date() }))
                }
                placeholder="Select issue date"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due Date *
              </Label>
              <DatePicker
                date={formData.dueDate}
                onDateChange={(date) =>
                  setFormData((f) => ({ ...f, dueDate: date ?? new Date() }))
                }
                placeholder="Select due date"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultRate" className="text-sm font-medium">
                Default Rate ($/hr)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="defaultRate"
                  type="number"
                  step="0.01"
                  value={defaultRate}
                  onChange={(e) =>
                    setDefaultRate(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  className=""
                />
                <Button
                  type="button"
                  onClick={applyDefaultRate}
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Apply
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate" className="text-sm font-medium">
                Tax Rate (%)
              </Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    taxRate: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0.00"
                className=""
              />
            </div>
          </div>

          {selectedBusiness && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
              <div className="mb-2 flex items-center gap-2 text-green-600">
                <Building className="h-4 w-4" />
                <span className="font-medium">Business Information</span>
              </div>
              <div className="text-muted-foreground text-sm">
                <p className="font-medium">{selectedBusiness.name}</p>
                {selectedBusiness.email && <p>{selectedBusiness.email}</p>}
                {selectedBusiness.phone && <p>{selectedBusiness.phone}</p>}
                {selectedBusiness.addressLine1 && (
                  <p>{selectedBusiness.addressLine1}</p>
                )}
                {(selectedBusiness.city ??
                  selectedBusiness.state ??
                  selectedBusiness.postalCode) && (
                  <p>
                    {[
                      selectedBusiness.city,
                      selectedBusiness.state,
                      selectedBusiness.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {selectedClient && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
              <div className="mb-2 flex items-center gap-2 text-green-600">
                <User className="h-4 w-4" />
                <span className="font-medium">Client Information</span>
              </div>
              <div className="text-muted-foreground text-sm">
                <p className="font-medium">{selectedClient.name}</p>
                {selectedClient.email && <p>{selectedClient.email}</p>}
                {selectedClient.phone && <p>{selectedClient.phone}</p>}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((f) => ({ ...f, notes: e.target.value }))
              }
              className="min-h-[80px] w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-700 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Additional notes, terms, or special instructions..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Items Card */}
      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Clock className="h-5 w-5" />
              Invoice Items
            </CardTitle>
            <Button
              type="button"
              onClick={addItem}
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items Table Header */}
          <div className="bg-muted text-muted-foreground grid grid-cols-12 items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium">
            <div className="col-span-1 text-center">⋮⋮</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-1">Hours</div>
            <div className="col-span-2">Rate ($)</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-1"></div>
          </div>

          {/* Items */}
          <EditableInvoiceItems
            items={formData.items}
            onItemsChange={(newItems) =>
              setFormData((prev) => ({ ...prev, items: newItems }))
            }
            onRemoveItem={removeItem}
          />

          {/* Validation Messages */}
          {formData.items.some((item) => !item.description.trim()) && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Please fill in all item descriptions
            </div>
          )}

          {formData.items.some((item) => item.hours <= 0) && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Please enter valid hours for all items
            </div>
          )}

          {formData.items.some((item) => item.rate <= 0) && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Please enter valid rates for all items
            </div>
          )}

          <Separator />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="space-y-2 text-right">
              <div className="space-y-1">
                <div className="text-sm text-gray-600">
                  Subtotal: ${totals.subtotal.toFixed(2)}
                </div>
                {formData.taxRate > 0 && (
                  <div className="text-sm text-gray-600">
                    Tax ({formData.taxRate}%): ${totals.taxAmount.toFixed(2)}
                  </div>
                )}
              </div>
              <div className="text-foreground text-lg font-medium">
                Total Amount
              </div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                ${totals.total.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formData.items.length} item
                {formData.items.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Controls Bar */}
      <div className="mt-6">
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span>Ready to save</span>
              </div>
              {formData.items.length > 0 && (
                <span className="text-gray-400 dark:text-gray-500">•</span>
              )}
              {formData.items.length > 0 && (
                <span>
                  {formData.items.length} item
                  {formData.items.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/invoices")}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="border-primary-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    {invoiceId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {invoiceId ? "Update Invoice" : "Create Invoice"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
