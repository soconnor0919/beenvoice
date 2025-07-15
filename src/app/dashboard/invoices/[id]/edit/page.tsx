"use client";

import {
    ArrowLeft,
    Building,
    DollarSign,
    Edit3,
    Eye,
    FileText,
    Hash,
    Loader2,
    Plus,
    Save,
    Send,
    Trash2,
    User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FloatingActionBar } from "~/components/layout/floating-action-bar";
import { PageHeader } from "~/components/layout/page-header";
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
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DatePicker } from "~/components/ui/date-picker";
import { Label } from "~/components/ui/label";
import { NumberInput } from "~/components/ui/number-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

interface InvoiceItem {
  id?: string;
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
  status: "draft" | "sent" | "paid" | "overdue";
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

function InvoiceEditor({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData | null>(null);

  // Floating action bar ref
  const footerRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: invoice, isLoading: invoiceLoading } =
    api.invoices.getById.useQuery({
      id: invoiceId,
    });
  const { data: clients, isLoading: clientsLoading } =
    api.clients.getAll.useQuery();
  const { data: businesses, isLoading: businessesLoading } =
    api.businesses.getAll.useQuery();

  // Mutations
  const updateInvoice = api.invoices.update.useMutation({
    onSuccess: () => {
      toast.success("Invoice updated successfully");
      router.push(`/dashboard/invoices/${invoiceId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update invoice");
    },
  });

  // Initialize form data when invoice loads
  useEffect(() => {
    if (invoice) {
      const transformedItems: InvoiceItem[] =
        invoice.items?.map((item, index) => ({
          id: item.id,
          tempId: item.id || `temp-${index}`,
          date: item.date || new Date(),
          description: item.description,
          hours: item.hours,
          rate: item.rate,
          amount: item.amount,
        })) || [];

      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        businessId: invoice.businessId ?? undefined,
        clientId: invoice.clientId,
        issueDate: new Date(invoice.issueDate),
        dueDate: new Date(invoice.dueDate),
        notes: invoice.notes ?? "",
        taxRate: invoice.taxRate,
        items: transformedItems ?? [],
        status: invoice.status as "draft" | "sent" | "paid" | "overdue",
      });
    }
  }, [invoice]);

  const handleItemUpdate = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number | Date,
  ) => {
    if (!formData) return;

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
    if (!formData) return;

    if (formData.items.length === 1) {
      toast.error("At least one line item is required");
      return;
    }

    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleAddItem = () => {
    if (!formData) return;

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

  const handleUpdateInvoice = async () => {
    await handleSave(formData?.status ?? "draft");
  };

  const handleSave = async (status: "draft" | "sent" | "paid" | "overdue") => {
    if (!formData) return;

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
      await updateInvoice.mutateAsync({
        id: invoiceId,
        ...formData,
        businessId: formData.businessId ?? undefined,
        status,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSubtotal = () => {
    if (!formData) return 0;
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    if (!formData) return 0;
    return (calculateSubtotal() * formData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const isFormValid = () => {
    if (!formData) return false;
    return (
      formData.clientId &&
      formData.items.length > 0 &&
      formData.items.every(
        (item) => item.description.trim() && item.hours > 0 && item.rate > 0,
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "sent":
        return <Badge variant="default">Sent</Badge>;
      case "paid":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            Paid
          </Badge>
        );
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (invoiceLoading || clientsLoading || businessesLoading || !formData) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Invoice"
          description="Loading invoice data..."
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
        title={`Edit Invoice`}
        description="Update invoice details and line items"
        variant="gradient"
      >
        <div className="flex items-center gap-2">
          {getStatusBadge(formData.status)}
          <Link href={`/dashboard/invoices/${invoiceId}`}>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">View Invoice</span>
              <span className="sm:hidden">View</span>
            </Button>
          </Link>
        </div>
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
                          <div className="flex w-full items-center justify-between">
                            <span className="font-medium">{client.name}</span>
                            <span className="text-muted-foreground ml-2 text-sm">
                              {client.email}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

        {/* Notes & Totals */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Notes */}
          <Card className="shadow-lg lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Payment terms, additional notes..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Tax & Totals */}
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Tax & Totals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  className="h-9"
                />
              </div>

              <div className="bg-muted/20 rounded-lg border p-3">
                <div className="space-y-2">
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
                  <div className="flex justify-between text-base font-bold">
                    <span>Total:</span>
                    <span className="font-mono text-emerald-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Actions - original position */}
        <div
          ref={footerRef}
          className="border-border/40 bg-background/60 flex items-center justify-between rounded-2xl border p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150"
        >
          <p className="text-muted-foreground text-sm">
            Editing invoice {formData.invoiceNumber}
          </p>
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/invoices/${invoiceId}`}>
              <Button
                variant="outline"
                disabled={isLoading}
                className="border-border/40 hover:bg-accent/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSaveDraft}
              disabled={isLoading || !isFormValid()}
              variant="outline"
              className="border-border/40 hover:bg-accent/50"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={handleUpdateInvoice}
              disabled={isLoading || !isFormValid()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Update Invoice
            </Button>
          </div>
        </div>
      </div>

      <FloatingActionBar
        triggerRef={footerRef}
        title={`Editing invoice ${formData.invoiceNumber}`}
      >
        <Link href={`/dashboard/invoices/${invoiceId}`}>
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
          onClick={handleUpdateInvoice}
          disabled={isLoading || !isFormValid()}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
          ) : (
            <Send className="h-4 w-4 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Update Invoice</span>
        </Button>
      </FloatingActionBar>
    </div>
  );
}

export default function EditInvoicePage() {
  const params = useParams();
  const invoiceId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!invoiceId) return null;

  return <InvoiceEditor invoiceId={invoiceId} />;
}
