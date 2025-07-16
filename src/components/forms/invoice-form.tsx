"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { DatePicker } from "~/components/ui/date-picker";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { NumberInput } from "~/components/ui/number-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { FileText, DollarSign, Clock, Save, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { FloatingActionBar } from "~/components/layout/floating-action-bar";
import { InvoiceLineItems } from "~/components/forms/invoice-line-items";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
] as const;

interface InvoiceFormProps {
  invoiceId?: string;
}

// Custom skeleton for invoice form
function InvoiceFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="bg-muted/30 h-9 w-64 animate-pulse rounded"></div>
          <div className="bg-muted/30 mt-1 h-4 w-48 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Content with Tabs */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tabs */}
          <div className="bg-muted grid w-full grid-cols-2 rounded-lg p-1">
            <div className="bg-background h-10 rounded-md shadow-sm"></div>
            <div className="bg-muted/30 h-10 rounded-md"></div>
          </div>

          {/* Invoice Details Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-muted/30 h-5 w-5 animate-pulse rounded"></div>
                <div className="bg-muted/30 h-6 w-32 animate-pulse rounded"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="bg-muted/30 h-4 w-24 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted/30 h-4 w-16 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="bg-muted/30 h-4 w-20 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted/30 h-4 w-20 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="bg-muted/30 h-4 w-28 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted/30 h-4 w-20 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-muted/30 h-4 w-20 animate-pulse rounded"></div>
                <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="bg-muted/30 h-4 w-32 animate-pulse rounded"></div>
                <div className="bg-muted/30 h-20 w-full animate-pulse rounded"></div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-muted/30 h-5 w-5 animate-pulse rounded"></div>
                <div className="bg-muted/30 h-6 w-28 animate-pulse rounded"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="bg-muted/30 h-5 w-16 animate-pulse rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted/30 h-4 w-24 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-15 w-full animate-pulse rounded"></div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <div className="bg-muted/30 h-4 w-12 animate-pulse rounded"></div>
                    <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted/30 h-4 w-12 animate-pulse rounded"></div>
                    <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted/30 h-4 w-16 animate-pulse rounded"></div>
                    <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-muted/50 h-4 w-16 animate-pulse rounded"></div>
                    <div className="bg-muted/50 h-6 w-20 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 h-10 w-full animate-pulse rounded"></div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-muted/30 h-5 w-5 animate-pulse rounded"></div>
                <div className="bg-muted/30 h-6 w-16 animate-pulse rounded"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="bg-muted/30 h-4 w-16 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-4 w-20 animate-pulse rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="bg-muted/30 h-4 w-20 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-4 w-16 animate-pulse rounded"></div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <div className="bg-muted/30 h-5 w-12 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-5 w-24 animate-pulse rounded"></div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="bg-muted/30 h-3 w-12 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-3 w-8 animate-pulse rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="bg-muted/30 h-3 w-12 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-3 w-20 animate-pulse rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="bg-muted/30 h-3 w-16 animate-pulse rounded"></div>
                  <div className="bg-muted/30 h-3 w-24 animate-pulse rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function InvoiceForm({ invoiceId }: InvoiceFormProps) {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now().toString().slice(-6)}`,
    businessId: "",
    clientId: "",
    issueDate: new Date(),
    dueDate: new Date(),
    status: "draft" as "draft" | "sent" | "paid" | "overdue",
    notes: "",
    taxRate: 0,
    defaultHourlyRate: 100,
    items: [
      {
        id: crypto.randomUUID(),
        date: new Date(),
        description: "",
        hours: 1,
        rate: 100,
        amount: 100,
      },
    ],
  });
  const [loading, setLoading] = useState(false);

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
        defaultHourlyRate: 100,

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
            hours: 1,
            rate: formData.defaultHourlyRate,
            amount: formData.defaultHourlyRate,
          },
        ],
      });
    }
  }, [existingInvoice, invoiceId]);

  // Auto-fill default business for new invoices
  React.useEffect(() => {
    if (!invoiceId && businesses && !formData.businessId) {
      const defaultBusiness = businesses.find((b) => b.isDefault);
      if (defaultBusiness) {
        setFormData((prev) => ({ ...prev, businessId: defaultBusiness.id }));
      }
    }
  }, [businesses, formData.businessId, invoiceId]);

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
          hours: 1,
          rate: formData.defaultHourlyRate,
          amount: formData.defaultHourlyRate,
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

  // Update item
  const updateItem = (
    idx: number,
    field: string,
    value: string | number | Date,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item,
      ),
    }));
  };

  // Move item up
  const moveItemUp = (idx: number) => {
    if (idx === 0) return; // Already at top
    setFormData((prev) => {
      const newItems = [...prev.items];
      [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
      return { ...prev, items: newItems };
    });
  };

  // Move item down
  const moveItemDown = (idx: number) => {
    if (idx === formData.items.length - 1) return; // Already at bottom
    setFormData((prev) => {
      const newItems = [...prev.items];
      [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
      return { ...prev, items: newItems };
    });
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
      router.push("/dashboard/invoices");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update invoice");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceData = {
        invoiceNumber: formData.invoiceNumber,
        businessId: formData.businessId || undefined,
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

      if (invoiceId) {
        await updateInvoice.mutateAsync({ id: invoiceId, ...invoiceData });
      } else {
        await createInvoice.mutateAsync(invoiceData);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loadingClients || loadingBusinesses || (invoiceId && loadingInvoice)) {
    return <InvoiceFormSkeleton />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div ref={headerRef} className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
              {invoiceId ? "Edit Invoice" : "Create Invoice"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {invoiceId ? "Update invoice details" : "Create a new invoice"}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <form id="invoice-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Content with Tabs */}
            <div className="space-y-6 lg:col-span-2">
              <Tabs defaultValue="invoice-details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="invoice-details">
                    Invoice Details
                  </TabsTrigger>
                  <TabsTrigger value="invoice-items">Invoice Items</TabsTrigger>
                </TabsList>
                <TabsContent value="invoice-details">
                  {/* Invoice Details */}
                  <Card className="shadow-sm">
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
                            key={`status-${formData.status}`}
                            value={formData.status}
                            onValueChange={(
                              value: "draft" | "sent" | "paid" | "overdue",
                            ) =>
                              setFormData((prev) => ({
                                ...prev,
                                status: value,
                              }))
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
                              setFormData((prev) => ({
                                ...prev,
                                issueDate: date ?? new Date(),
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Due Date</Label>
                          <DatePicker
                            date={formData.dueDate}
                            onDateChange={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                dueDate: date ?? new Date(),
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="business">From (Business)</Label>
                          <Select
                            key={`business-${formData.businessId}-${businesses?.length}`}
                            value={formData.businessId}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                businessId: value,
                              }))
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
                            key={`client-${formData.clientId}-${clients?.length}`}
                            value={formData.clientId}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                clientId: value,
                              }))
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
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                taxRate: value,
                              }))
                            }
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
                              setFormData((prev) => ({
                                ...prev,
                                defaultHourlyRate: value,
                              }))
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
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          placeholder="Additional notes for the client..."
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="invoice-items">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Invoice Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 py-0">
                      <InvoiceLineItems
                        items={formData.items}
                        onAddItem={addItem}
                        onRemoveItem={removeItem}
                        onUpdateItem={updateItem}
                        onMoveUp={moveItemUp}
                        onMoveDown={moveItemDown}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Summary (Always Visible) */}
            <div className="space-y-6">
              <Card className="sticky top-6 shadow-sm">
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

        {/* Footer for floating bar trigger */}
        <div
          ref={footerRef}
          className="border-border/40 bg-background/60 flex items-center justify-between rounded-2xl border p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150"
        >
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-medium">
                {invoiceId ? "Edit Invoice" : "Create Invoice"}
              </p>
              <p className="text-muted-foreground text-sm">
                {invoiceId ? "Update invoice details" : "Create a new invoice"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="submit"
              form="invoice-form"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
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
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar
        triggerRef={footerRef}
        leftContent={
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-medium">
                {invoiceId ? "Edit Invoice" : "Create Invoice"}
              </p>
              <p className="text-muted-foreground text-sm">
                {invoiceId ? "Update invoice details" : "Create a new invoice"}
              </p>
            </div>
          </div>
        }
      >
        <Button
          type="submit"
          form="invoice-form"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
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
    </>
  );
}
