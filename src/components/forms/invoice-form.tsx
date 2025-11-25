"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DatePicker } from "~/components/ui/date-picker";
import { NumberInput } from "~/components/ui/number-input";
import { PageHeader } from "~/components/layout/page-header";
import { FloatingActionBar } from "~/components/layout/floating-action-bar";
import { InvoiceLineItems } from "./invoice-line-items";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { FileText, DollarSign, Check, Save, Clock, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
];

interface InvoiceFormProps {
  invoiceId?: string;
}

interface InvoiceItem {
  id: string;
  date: Date;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

interface FormData {
  invoiceNumber: string;
  businessId: string;
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid";
  notes: string;
  taxRate: number;
  defaultHourlyRate: number | null;
  items: InvoiceItem[];
}

function InvoiceFormSkeleton() {
  return (
    <div className="space-y-6 pb-32">
      <PageHeader
        title="Loading..."
        description="Loading invoice form"
        variant="gradient"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-muted h-96 animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="bg-muted h-64 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function InvoiceForm({ invoiceId }: InvoiceFormProps) {
  const router = useRouter();
  const utils = api.useUtils();

  // Single state object for all form data
  const [formData, setFormData] = useState<FormData>({
    invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now().toString().slice(-6)}`,
    businessId: "",
    clientId: "",
    issueDate: new Date(),
    dueDate: new Date(),
    status: "draft",
    notes: "",
    taxRate: 0,
    defaultHourlyRate: null,
    items: [
      {
        id: crypto.randomUUID(),
        date: new Date(),
        description: "",
        hours: 1,
        rate: 0,
        amount: 0,
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Track if the first item has been manually edited
  const firstItemEditedRef = useRef(false);

  // Data queries
  const { data: clients, isLoading: loadingClients } =
    api.clients.getAll.useQuery();
  const { data: businesses, isLoading: loadingBusinesses } =
    api.businesses.getAll.useQuery();
  const { data: existingInvoice, isLoading: loadingInvoice } =
    api.invoices.getById.useQuery(
      { id: invoiceId! },
      { enabled: !!invoiceId && invoiceId !== "new" },
    );

  // Delete mutation
  const deleteInvoice = api.invoices.delete.useMutation({
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      router.push("/dashboard/invoices");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete invoice");
    },
  });

  // Reset initialization when invoiceId changes
  useEffect(() => {
    setInitialized(false);
  }, [invoiceId]);

  // Initialize form data when invoice data is loaded
  useEffect(() => {
    if (invoiceId && invoiceId !== "new" && existingInvoice && !initialized) {
      // Initialize with existing invoice data
      const mappedItems =
        existingInvoice.items?.map((item) => ({
          id: crypto.randomUUID(),
          date: new Date(item.date),
          description: item.description,
          hours: item.hours,
          rate: item.rate,
          amount: item.amount,
        })) || [];

      setFormData({
        invoiceNumber: existingInvoice.invoiceNumber,
        businessId: existingInvoice.businessId ?? "",
        clientId: existingInvoice.clientId,
        issueDate: new Date(existingInvoice.issueDate),
        dueDate: new Date(existingInvoice.dueDate),
        status: existingInvoice.status as "draft" | "sent" | "paid",
        notes: existingInvoice.notes ?? "",
        taxRate: existingInvoice.taxRate,
        defaultHourlyRate: null,
        items:
          mappedItems.length > 0
            ? mappedItems
            : [
                {
                  id: crypto.randomUUID(),
                  date: new Date(),
                  description: "",
                  hours: 1,
                  rate: 0,
                  amount: 0,
                },
              ],
      });

      firstItemEditedRef.current = false;
      setInitialized(true);
    } else if (
      (!invoiceId || invoiceId === "new") &&
      businesses &&
      !initialized
    ) {
      // New invoice - set default business
      const defaultBusiness = businesses.find((b) => b.isDefault);
      if (defaultBusiness) {
        setFormData((prev) => ({ ...prev, businessId: defaultBusiness.id }));
      } else if (businesses.length > 0) {
        setFormData((prev) => ({ ...prev, businessId: businesses[0]!.id }));
      }
      setInitialized(true);
    }
  }, [invoiceId, existingInvoice, businesses, initialized]);

  // Update the first line item when defaultHourlyRate changes (if it hasn't been manually edited)
  // Only for new invoices, not existing ones being edited
  useEffect(() => {
    if (
      (!invoiceId || invoiceId === "new") &&
      !firstItemEditedRef.current &&
      formData.items.length === 1 &&
      formData.items[0]?.description === "" &&
      formData.items[0]?.hours === 1
    ) {
      const newRate = formData.defaultHourlyRate ?? 0;
      setFormData((prev) => ({
        ...prev,
        items: [
          {
            ...prev.items[0]!,
            rate: newRate,
            amount: newRate,
          },
        ],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.defaultHourlyRate]);

  // Update default hourly rate when client changes
  useEffect(() => {
    if (!formData.clientId || !clients) return;

    const selectedClient = clients.find((c) => c.id === formData.clientId);
    if (selectedClient?.defaultHourlyRate != null) {
      setFormData((prev) => ({
        ...prev,
        defaultHourlyRate: selectedClient.defaultHourlyRate,
      }));
    }
  }, [formData.clientId, clients]);

  // Calculate totals
  const totals = React.useMemo(() => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.hours * item.rate,
      0,
    );
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  }, [formData.items, formData.taxRate]);

  // Item management functions
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          date: new Date(),
          description: "",
          hours: 1,
          rate: prev.defaultHourlyRate ?? 0,
          amount: prev.defaultHourlyRate ?? 0,
        },
      ],
    }));
  };

  const removeItem = (idx: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== idx),
      }));
    }
  };

  const updateItem = (
    idx: number,
    field: string,
    value: string | number | Date,
  ) => {
    // Mark first item as manually edited if user is changing it
    if (
      idx === 0 &&
      (field === "description" || field === "hours" || field === "rate")
    ) {
      firstItemEditedRef.current = true;
    }

    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === idx) {
          const updatedItem = { ...item, [field]: value };
          if (field === "hours" || field === "rate") {
            updatedItem.amount = updatedItem.hours * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const moveItemUp = (idx: number) => {
    if (idx === 0) return;
    setFormData((prev) => {
      const newItems = [...prev.items];
      if (idx > 0 && idx < newItems.length) {
        const currentItem = newItems[idx];
        const previousItem = newItems[idx - 1];
        if (currentItem && previousItem) {
          newItems[idx - 1] = currentItem;
          newItems[idx] = previousItem;
        }
      }
      return { ...prev, items: newItems };
    });
  };

  const moveItemDown = (idx: number) => {
    if (idx === formData.items.length - 1) return;
    setFormData((prev) => {
      const newItems = [...prev.items];
      if (idx >= 0 && idx < newItems.length - 1) {
        const currentItem = newItems[idx];
        const nextItem = newItems[idx + 1];
        if (currentItem && nextItem) {
          newItems[idx] = nextItem;
          newItems[idx + 1] = currentItem;
        }
      }
      return { ...prev, items: newItems };
    });
  };

  const reorderItems = (newItems: InvoiceItem[]) => {
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // Mutations
  const createInvoice = api.invoices.create.useMutation({
    onSuccess: (invoice) => {
      toast.success("Invoice created successfully");
      void utils.invoices.getAll.invalidate();
      router.push(`/dashboard/invoices/${invoice.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create invoice");
    },
  });

  const updateInvoice = api.invoices.update.useMutation({
    onSuccess: async () => {
      toast.success("Invoice updated successfully");
      await utils.invoices.getAll.invalidate();
      // Invalidate the specific invoice cache to ensure fresh data on navigation
      if (invoiceId && invoiceId !== "new") {
        await utils.invoices.getById.invalidate({ id: invoiceId });
      }
      // The update mutation returns { success: true }, so we use the current invoiceId
      if (invoiceId && invoiceId !== "new") {
        router.push(`/dashboard/invoices/${invoiceId}`);
      } else {
        router.push("/dashboard/invoices");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update invoice");
    },
  });

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.clientId || formData.clientId.trim() === "") {
        toast.error("Please select a client");
        setLoading(false);
        return;
      }

      if (!formData.invoiceNumber.trim()) {
        toast.error("Invoice number is required");
        setLoading(false);
        return;
      }

      // Business is optional in the schema, so we don't require it
      // if (!formData.businessId || formData.businessId.trim() === "") {
      //   toast.error("Please select a business");
      //   setLoading(false);
      //   return;
      // }

      if (formData.items.length === 0) {
        toast.error("At least one invoice item is required");
        setLoading(false);
        return;
      }

      // Validate each item
      for (let i = 0; i < formData.items.length; i++) {
        const item = formData.items[i];
        if (!item) continue;

        if (!item.description.trim()) {
          toast.error(`Item ${i + 1}: Description is required`);
          setLoading(false);
          return;
        }
        if (item.hours <= 0) {
          toast.error(`Item ${i + 1}: Hours must be greater than 0`);
          setLoading(false);
          return;
        }
        if (item.rate <= 0) {
          toast.error(`Item ${i + 1}: Rate must be greater than 0`);
          setLoading(false);
          return;
        }
      }

      // Prepare invoice data
      const invoiceData = {
        invoiceNumber: formData.invoiceNumber,
        businessId: formData.businessId || "", // Ensure it's not undefined
        clientId: formData.clientId,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        status: formData.status,
        notes: formData.notes,
        taxRate: formData.taxRate,
        items: formData.items.map((item) => ({
          date: item.date,
          description: item.description,
          hours: item.hours,
          rate: item.rate,
          amount: item.hours * item.rate,
        })),
      };

      if (invoiceId && invoiceId !== "new") {
        await updateInvoice.mutateAsync({ id: invoiceId, ...invoiceData });
      } else {
        await createInvoice.mutateAsync(invoiceData);
      }
    } catch (error) {
      console.error("Invoice save error:", error);
      toast.error("Failed to save invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (invoiceId && invoiceId !== "new") {
      deleteInvoice.mutate({ id: invoiceId });
    }
  };

  // Field update functions
  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Show loading state
  if (
    !initialized ||
    loadingClients ||
    loadingBusinesses ||
    (invoiceId && invoiceId !== "new" && loadingInvoice)
  ) {
    return <InvoiceFormSkeleton />;
  }

  return (
    <>
      <div className="page-enter space-y-6 pb-32">
        <PageHeader
          title={
            invoiceId && invoiceId !== "new" ? "Edit Invoice" : "Create Invoice"
          }
          description={
            invoiceId && invoiceId !== "new"
              ? "Update invoice details and line items"
              : "Create a new invoice for your client"
          }
          variant="gradient"
        >
          {invoiceId && invoiceId !== "new" && (
            <Button
              variant="secondary"
              onClick={handleDelete}
              disabled={loading || deleteInvoice.isPending}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Delete Invoice</span>
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={loading} variant="secondary">
            {loading ? (
              <>
                <Clock className="h-4 w-4 animate-spin sm:mr-2" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Save Invoice</span>
              </>
            )}
          </Button>
        </PageHeader>

        <form id="invoice-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Tabs defaultValue="invoice-details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="invoice-details">
                    Invoice Details
                  </TabsTrigger>
                  <TabsTrigger value="invoice-items">Invoice Items</TabsTrigger>
                </TabsList>

                <TabsContent value="invoice-details">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Invoice Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="invoiceNumber">Invoice Number</Label>
                          <Input
                            id="invoiceNumber"
                            value={formData.invoiceNumber}
                            placeholder="INV-2024-001"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value: "draft" | "sent" | "paid") =>
                              updateField("status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Issue Date</Label>
                          <DatePicker
                            date={formData.issueDate}
                            onDateChange={(date) =>
                              updateField("issueDate", date ?? new Date())
                            }
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Due Date</Label>
                          <DatePicker
                            date={formData.dueDate}
                            onDateChange={(date) =>
                              updateField("dueDate", date ?? new Date())
                            }
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="business">From (Business)</Label>
                          <Select
                            value={formData.businessId}
                            onValueChange={(value) =>
                              updateField("businessId", value)
                            }
                          >
                            <SelectTrigger
                              aria-label="From Business"
                              className="w-full"
                            >
                              <span className="min-w-0 flex-1 truncate text-left">
                                <SelectValue placeholder="Select your business (nickname shown)" />
                              </span>
                            </SelectTrigger>
                            <SelectContent className="w-[--radix-select-trigger-width] min-w-[--radix-select-trigger-width]">
                              {businesses?.map((business) => (
                                <SelectItem
                                  key={business.id}
                                  value={business.id}
                                  className="truncate"
                                >
                                  <span className="block truncate">{`${business.name}${business.nickname ? ` (${business.nickname})` : ""}`}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client">Bill To (Client)</Label>
                          <Select
                            value={formData.clientId}
                            onValueChange={(value) =>
                              updateField("clientId", value)
                            }
                          >
                            <SelectTrigger
                              aria-label="Bill To Client"
                              className="w-full"
                            >
                              <span className="min-w-0 flex-1 truncate text-left">
                                <SelectValue placeholder="Select a client" />
                              </span>
                            </SelectTrigger>
                            <SelectContent className="w-[--radix-select-trigger-width] min-w-[--radix-select-trigger-width]">
                              {clients?.map((client) => (
                                <SelectItem
                                  key={client.id}
                                  value={client.id}
                                  className="truncate"
                                >
                                  <span className="block truncate">
                                    {client.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="taxRate">Tax Rate (%)</Label>
                          <NumberInput
                            value={formData.taxRate}
                            onChange={(value) => updateField("taxRate", value)}
                            min={0}
                            max={100}
                            step={1}
                            suffix="%"
                            width="full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="defaultHourlyRate">
                            Default Hourly Rate for New Items
                          </Label>
                          <NumberInput
                            value={formData.defaultHourlyRate ?? 0}
                            onChange={(value) =>
                              updateField("defaultHourlyRate", value)
                            }
                            min={0}
                            step={1}
                            prefix="$"
                            width="full"
                            disabled={!formData.clientId}
                            className={cn(
                              !formData.clientId &&
                                "cursor-not-allowed opacity-50",
                            )}
                            placeholder={
                              !formData.clientId
                                ? "Select client first"
                                : "Enter hourly rate"
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => updateField("notes", e.target.value)}
                          placeholder="Additional notes for the client..."
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="invoice-items">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Invoice Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pb-4">
                      <InvoiceLineItems
                        items={formData.items}
                        onAddItem={addItem}
                        onRemoveItem={removeItem}
                        onUpdateItem={updateItem}
                        onMoveUp={moveItemUp}
                        onMoveDown={moveItemDown}
                        onReorderItems={reorderItems}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">
                        ${totals.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tax ({formData.taxRate}%):
                      </span>
                      <span className="font-medium">
                        ${totals.taxAmount.toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">
                        ${totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-medium">
                        {formData.items.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client:</span>
                      <span className="font-medium">
                        {clients?.find((c) => c.id === formData.clientId)
                          ?.name ?? "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Business (nickname shown):
                      </span>
                      <span className="font-medium">
                        {(() => {
                          const b = businesses?.find(
                            (b) => b.id === formData.businessId,
                          );
                          return b
                            ? `${b.name}${b.nickname ? ` (${b.nickname})` : ""}`
                            : "Not selected";
                        })()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <FloatingActionBar
        leftContent={
          <div className="flex items-center space-x-3">
            <div className="p-2">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">
                {invoiceId && invoiceId !== "new"
                  ? "Edit Invoice"
                  : "Create Invoice"}
              </p>
              <p className="text-muted-foreground text-sm">
                Update invoice details
              </p>
            </div>
          </div>
        }
      >
        {invoiceId && invoiceId !== "new" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDelete}
            disabled={loading || deleteInvoice.isPending}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="secondary"
          size="sm"
        >
          {loading ? (
            <>
              <Clock className="h-4 w-4 animate-spin sm:mr-2" />
              <span className="hidden sm:inline">Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Save Invoice</span>
            </>
          )}
        </Button>
      </FloatingActionBar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete invoice{" "}
              <strong>{formData.invoiceNumber}</strong>? This action cannot be
              undone and will permanently remove the invoice and all its data.
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
