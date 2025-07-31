"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
  defaultHourlyRate: number;
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
    defaultHourlyRate: 25,
    items: [
      {
        id: crypto.randomUUID(),
        date: new Date(),
        description: "",
        hours: 1,
        rate: 25,
        amount: 25,
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  // Single initialization effect - only runs once when data is ready
  useEffect(() => {
    if (initialized) return;

    const dataReady =
      !loadingClients &&
      !loadingBusinesses &&
      (!invoiceId || invoiceId === "new" || !loadingInvoice);
    if (!dataReady) return;

    if (invoiceId && invoiceId !== "new" && existingInvoice) {
      // Initialize with existing invoice data
      const formDataToSet = {
        invoiceNumber: existingInvoice.invoiceNumber,
        businessId: existingInvoice.businessId ?? "",
        clientId: existingInvoice.clientId,
        issueDate: new Date(existingInvoice.issueDate),
        dueDate: new Date(existingInvoice.dueDate),
        status: existingInvoice.status as "draft" | "sent" | "paid",
        notes: existingInvoice.notes ?? "",
        taxRate: existingInvoice.taxRate,
        defaultHourlyRate: 25,
        items:
          existingInvoice.items?.map((item) => ({
            id: crypto.randomUUID(),
            date: new Date(item.date),
            description: item.description,
            hours: item.hours,
            rate: item.rate,
            amount: item.amount,
          })) || [],
      };
      setFormData(formDataToSet);
    } else if ((!invoiceId || invoiceId === "new") && businesses) {
      // New invoice - set default business
      const defaultBusiness = businesses.find((b) => b.isDefault);
      if (defaultBusiness) {
        setFormData((prev) => ({ ...prev, businessId: defaultBusiness.id }));
      } else if (businesses.length > 0) {
        // If no default business, use the first one
        setFormData((prev) => ({ ...prev, businessId: businesses[0]!.id }));
      }
    }

    setInitialized(true);
  }, [
    loadingClients,
    loadingBusinesses,
    loadingInvoice,
    existingInvoice,
    businesses,
    invoiceId,
    initialized,
  ]);

  // Update default hourly rate when client changes (only during initialization)
  useEffect(() => {
    if (!initialized || !formData.clientId || !clients) return;

    const selectedClient = clients.find((c) => c.id === formData.clientId);
    if (selectedClient?.defaultHourlyRate) {
      setFormData((prev) => ({
        ...prev,
        defaultHourlyRate: selectedClient.defaultHourlyRate,
      }));
    }
  }, [formData.clientId, clients, initialized]);

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
          rate: prev.defaultHourlyRate,
          amount: prev.defaultHourlyRate,
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
      <div className="space-y-6 pb-32">
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
              variant="outline"
              onClick={handleDelete}
              disabled={loading || deleteInvoice.isPending}
              className="text-destructive hover:bg-destructive/10 shadow-sm"
            >
              <Trash2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Delete Invoice</span>
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={loading} variant="default">
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
                            className="bg-muted/50"
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select your business" />
                            </SelectTrigger>
                            <SelectContent>
                              {businesses?.map((business) => (
                                <SelectItem
                                  key={business.id}
                                  value={business.id}
                                >
                                  {business.name}
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients?.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
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
                            Default Hourly Rate
                          </Label>
                          <NumberInput
                            value={formData.defaultHourlyRate}
                            onChange={(value) =>
                              updateField("defaultHourlyRate", value)
                            }
                            min={0}
                            step={1}
                            prefix="$"
                            width="full"
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
                      <span className="text-muted-foreground">Business:</span>
                      <span className="font-medium">
                        {businesses?.find((b) => b.id === formData.businessId)
                          ?.name ?? "Not selected"}
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
            <div className="bg-primary/10 p-2">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {invoiceId && invoiceId !== "new"
                  ? "Edit Invoice"
                  : "Create Invoice"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Update invoice details
              </p>
            </div>
          </div>
        }
      >
        {invoiceId && invoiceId !== "new" && (
          <Button
            variant="outline"
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
          variant="default"
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
