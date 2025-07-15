"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { NumberInput } from "~/components/ui/number-input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { PageHeader } from "~/components/layout/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { DatePicker } from "~/components/ui/date-picker";
import { FloatingActionBar } from "~/components/layout/floating-action-bar";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  FileText,
  Building,
  User,
  Loader2,
  Send,
  DollarSign,
  Hash,
  Edit3,
} from "lucide-react";

interface InvoiceItem {
  tempId: string;
  date: Date;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

interface InvoiceFormData {
  invoiceNumber: string;
  businessId: string | undefined;
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  notes: string;
  taxRate: number;
  items: InvoiceItem[];
}

function InvoiceItemCard({
  item,
  index,
  onUpdate,
  onDelete,
  _isLast,
}: {
  item: InvoiceItem;
  index: number;
  onUpdate: (
    index: number,
    field: keyof InvoiceItem,
    value: string | number | Date,
  ) => void;
  onDelete: (index: number) => void;
  _isLast: boolean;
}) {
  const handleFieldChange = (
    field: keyof InvoiceItem,
    value: string | number | Date,
  ) => {
    onUpdate(index, field, value);
  };

  return (
    <Card className="border-border/50 border p-3 shadow-sm">
      <div className="space-y-3">
        {/* Header with item number and delete */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium">
            Item {index + 1}
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this line item? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(index)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Description */}
        <Textarea
          value={item.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Description of work..."
          className="min-h-[48px] resize-none text-sm"
          rows={1}
        />

        {/* Date, Hours, Rate, Amount in compact grid */}
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Date</Label>
            <DatePicker
              date={item.date}
              onDateChange={(date) =>
                handleFieldChange("date", date ?? new Date())
              }
              className="[&>button]:h-8 [&>button]:text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Hours</Label>
            <NumberInput
              value={item.hours}
              onChange={(value) => handleFieldChange("hours", value)}
              min={0}
              step={0.25}
              placeholder="0"
              className="text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Rate</Label>
            <NumberInput
              value={item.rate}
              onChange={(value) => handleFieldChange("rate", value)}
              min={0}
              step={0.25}
              placeholder="0.00"
              prefix="$"
              className="text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Amount</Label>
            <div className="bg-muted/30 flex h-8 items-center rounded-md border px-2">
              <span className="font-mono text-xs font-medium text-emerald-600">
                ${(item.hours * item.rate).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data with defaults
  const today = new Date();
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  // Auto-generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const timestamp = Date.now().toString().slice(-4);
    return `INV-${year}${month}-${timestamp}`;
  };

  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: generateInvoiceNumber(),
    businessId: undefined,
    clientId: "",
    issueDate: today,
    dueDate: thirtyDaysFromNow,
    notes: "",
    taxRate: 0,
    items: [
      {
        tempId: `item-${Date.now()}`,
        date: today,
        description: "",
        hours: 0,
        rate: 0,
        amount: 0,
      },
    ],
  });

  // Floating action bar ref
  const footerRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: clients, isLoading: clientsLoading } =
    api.clients.getAll.useQuery();
  const { data: businesses, isLoading: businessesLoading } =
    api.businesses.getAll.useQuery();

  // Set default business when data loads
  useEffect(() => {
    if (businesses && !formData.businessId) {
      const defaultBusiness = businesses.find((b) => b.isDefault);
      if (defaultBusiness) {
        setFormData((prev) => ({ ...prev, businessId: defaultBusiness.id }));
      }
    }
  }, [businesses, formData.businessId]);

  // Mutations
  const createInvoice = api.invoices.create.useMutation({
    onSuccess: (invoice) => {
      toast.success("Invoice created successfully");
      router.push(`/dashboard/invoices/${invoice.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create invoice");
    },
  });

  const handleItemUpdate = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number | Date,
  ) => {
    const updatedItems = [...formData.items];
    const currentItem = updatedItems[index];
    if (currentItem) {
      updatedItems[index] = { ...currentItem, [field]: value };

      // Recalculate amount for hours or rate changes
      if (field === "hours" || field === "rate") {
        const updatedItem = updatedItems[index];
        if (!updatedItem) return;
        updatedItem.amount = updatedItem.hours * updatedItem.rate;
      }
    }

    setFormData({ ...formData, items: updatedItems });
  };

  const handleItemDelete = (index: number) => {
    if (formData.items.length === 1) {
      toast.error("At least one line item is required");
      return;
    }

    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      tempId: `item-${Date.now()}`,
      date: new Date(),
      description: "",
      hours: 0,
      rate: 0,
      amount: 0,
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const handleSaveDraft = async () => {
    await handleSave("draft");
  };

  const handleCreateInvoice = async () => {
    await handleSave("sent");
  };

  const handleSave = async (status: "draft" | "sent") => {
    // Validation
    if (!formData.clientId) {
      toast.error("Please select a client");
      return;
    }

    if (formData.items.length === 0) {
      toast.error("At least one line item is required");
      return;
    }

    // Check if all items have required fields
    const invalidItems = formData.items.some(
      (item) => !item.description.trim() || item.hours <= 0 || item.rate <= 0,
    );

    if (invalidItems) {
      toast.error("All line items must have description, hours, and rate");
      return;
    }

    setIsLoading(true);
    try {
      await createInvoice.mutateAsync({
        ...formData,
        businessId: formData.businessId ?? undefined,
        status,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * formData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const isFormValid = () => {
    return (
      formData.clientId &&
      formData.items.length > 0 &&
      formData.items.every(
        (item) => item.description.trim() && item.hours > 0 && item.rate > 0,
      )
    );
  };

  if (clientsLoading || businessesLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Create Invoice"
          description="Loading form data..."
          variant="gradient"
        />
        <Card className="shadow-xl">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Invoice"
        description="Fill out the details below to create a new invoice"
        variant="gradient"
      >
        <Link href="/dashboard/invoices">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Invoices</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </PageHeader>

      <div className="space-y-6">
        {/* Invoice Header */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Invoice Number</Label>
                <div className="bg-muted/30 flex h-10 items-center rounded-md border px-3">
                  <Hash className="text-muted-foreground mr-2 h-4 w-4" />
                  <span className="font-mono text-sm font-medium">
                    {formData.invoiceNumber}
                  </span>
                </div>
              </div>

              <DatePicker
                date={formData.issueDate}
                onDateChange={(date) =>
                  setFormData({
                    ...formData,
                    issueDate: date ?? new Date(),
                  })
                }
                label="Issue Date"
                required
              />

              <DatePicker
                date={formData.dueDate}
                onDateChange={(date) =>
                  setFormData({
                    ...formData,
                    dueDate: date ?? new Date(),
                  })
                }
                label="Due Date"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Business & Client */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-emerald-600" />
              Business & Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">From Business</Label>
                <div className="relative">
                  <Building className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Select
                    value={formData.businessId ?? ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        businessId: value || undefined,
                      })
                    }
                  >
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Select business..." />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses?.map((business) => (
                        <SelectItem key={business.id} value={business.id}>
                          <div className="flex items-center gap-2">
                            <span>{business.name}</span>
                            {business.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(!businesses || businesses.length === 0) && (
                  <p className="text-sm text-red-600">
                    No businesses found.{" "}
                    <Link
                      href="/dashboard/businesses/new"
                      className="underline hover:text-red-700"
                    >
                      Create one first
                    </Link>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Client *</Label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, clientId: value })
                    }
                  >
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Select client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-muted-foreground text-sm">
                              {client.email}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(!clients || clients.length === 0) && (
                  <p className="text-sm text-red-600">
                    No clients found.{" "}
                    <Link
                      href="/dashboard/clients/new"
                      className="underline hover:text-red-700"
                    >
                      Create one first
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-emerald-600" />
                Line Items ({formData.items.length})
              </CardTitle>
              <Button
                onClick={handleAddItem}
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Item</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.items.map((item, index) => (
              <InvoiceItemCard
                key={item.tempId}
                item={item}
                index={index}
                onUpdate={handleItemUpdate}
                onDelete={handleItemDelete}
                _isLast={index === formData.items.length - 1}
              />
            ))}
          </CardContent>
        </Card>

        {/* Tax & Totals */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Tax & Totals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tax Rate (%)</Label>
                  <NumberInput
                    value={formData.taxRate}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        taxRate: value,
                      })
                    }
                    min={0}
                    max={100}
                    step={0.01}
                    placeholder="0.00"
                    suffix="%"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Payment terms, additional notes..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/20 rounded-lg border p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-mono font-medium">
                        ${calculateSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tax ({formData.taxRate}%):
                      </span>
                      <span className="font-mono font-medium">
                        ${calculateTax().toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="font-mono text-emerald-600">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              ref={footerRef}
              className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between"
            >
              <Link href="/dashboard/invoices">
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </Link>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  onClick={handleSaveDraft}
                  disabled={isLoading || !isFormValid()}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Draft
                </Button>
                <Button
                  onClick={handleCreateInvoice}
                  disabled={isLoading || !isFormValid()}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 sm:w-auto"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Create Invoice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <FloatingActionBar triggerRef={footerRef} title="Creating a new invoice">
        <Link href="/dashboard/invoices">
          <Button
            variant="outline"
            disabled={isLoading}
            className="border-border/40 hover:bg-accent/50"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
        </Link>
        <Button
          onClick={handleSaveDraft}
          disabled={isLoading || !isFormValid()}
          variant="outline"
          className="border-border/40 hover:bg-accent/50"
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
          ) : (
            <Save className="h-4 w-4 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Save Draft</span>
        </Button>
        <Button
          onClick={handleCreateInvoice}
          disabled={isLoading || !isFormValid()}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
          ) : (
            <Send className="h-4 w-4 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Create Invoice</span>
        </Button>
      </FloatingActionBar>
    </div>
  );
}
