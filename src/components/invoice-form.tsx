"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { DatePicker } from "~/components/ui/date-picker";
import { toast } from "sonner";
import { Calendar, FileText, User, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const STATUS_OPTIONS = ["draft", "sent", "paid", "overdue"];

interface InvoiceFormProps {
  invoiceId?: string;
}

export function InvoiceForm({ invoiceId }: InvoiceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-6)}`,
    clientId: "",
    issueDate: new Date(),
    dueDate: new Date(),
    status: "draft" as "draft" | "sent" | "paid" | "overdue",
    notes: "",
    items: [
      { date: new Date(), description: "", hours: 0, rate: 0, amount: 0 },
    ],
  });
  const [loading, setLoading] = useState(false);

  // Fetch clients for dropdown
  const { data: clients, isLoading: loadingClients } = api.clients.getAll.useQuery();

  // Fetch existing invoice data if editing
  const { data: existingInvoice, isLoading: loadingInvoice } = api.invoices.getById.useQuery(
    { id: invoiceId! },
    { enabled: !!invoiceId }
  );

  // Populate form with existing data when editing
  React.useEffect(() => {
    if (existingInvoice && invoiceId) {
      setFormData({
        invoiceNumber: existingInvoice.invoiceNumber,
        clientId: existingInvoice.clientId,
        issueDate: new Date(existingInvoice.issueDate),
        dueDate: new Date(existingInvoice.dueDate),
        status: existingInvoice.status as "draft" | "sent" | "paid" | "overdue",
        notes: existingInvoice.notes || "",
        items: existingInvoice.items?.map(item => ({
          date: new Date(item.date),
          description: item.description,
          hours: item.hours,
          rate: item.rate,
          amount: item.amount,
        })) || [{ date: new Date(), description: "", hours: 0, rate: 0, amount: 0 }],
      });
    }
  }, [existingInvoice, invoiceId]);

  // Calculate total amount
  const totalAmount = formData.items.reduce(
    (sum, item) => sum + (item.hours * item.rate),
    0
  );

  // Update item amount on change
  const handleItemChange = (idx: number, field: string, value: any) => {
    setFormData((prev) => {
      const items = [...prev.items];
      if (field === "hours" || field === "rate") {
        if (items[idx]) {
          items[idx][field as "hours" | "rate"] = parseFloat(value) || 0;
          items[idx].amount = items[idx].hours * items[idx].rate;
        }
      } else if (field === "date") {
        if (items[idx]) {
          items[idx][field as "date"] = value;
        }
      } else {
        if (items[idx]) {
          items[idx][field as "description"] = value;
        }
      }
      return { ...prev, items };
    });
  };

  // Add new item
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { date: new Date(), description: "", hours: 0, rate: 0, amount: 0 },
      ],
    }));
  };

  // Remove item
  const removeItem = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
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
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          date: new Date(item.date),
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
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm w-full my-8 px-0">
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-emerald-700">
                <FileText className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Invoice Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse md:col-span-2"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm w-full my-8 px-0">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Invoice Details */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-700">
              <FileText className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Invoice Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber" className="text-sm font-medium text-gray-700">
                  Invoice Number
                </Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  className="h-12 border-gray-200 bg-gray-50"
                  placeholder="Auto-generated"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId" className="text-sm font-medium text-gray-700">
                  Client
                </Label>
                <select
                  id="clientId"
                  value={formData.clientId}
                  onChange={e => setFormData(f => ({ ...f, clientId: e.target.value }))}
                  className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  disabled={loadingClients}
                >
                  <option value="">Select a client</option>
                  {clients?.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate" className="text-sm font-medium text-gray-700">
                  Issue Date
                </Label>
                <DatePicker
                  date={formData.issueDate}
                  onDateChange={date => setFormData(f => ({ ...f, issueDate: date || new Date() }))}
                  placeholder="Select issue date"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                  Due Date
                </Label>
                <DatePicker
                  date={formData.dueDate}
                  onDateChange={date => setFormData(f => ({ ...f, dueDate: date || new Date() }))}
                  placeholder="Select due date"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={e => setFormData(f => ({ ...f, status: e.target.value as "draft" | "sent" | "paid" | "overdue" }))}
                  className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Notes
                </Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Additional notes (optional)"
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-700">
              <User className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Invoice Items</h3>
            </div>
            <div className="space-y-4">
              {formData.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-emerald-50/30 rounded-lg p-4">
                  <div className="space-y-1">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={format(item.date, "yyyy-MM-dd")}
                      onChange={e => handleItemChange(idx, "date", new Date(e.target.value))}
                      className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={e => handleItemChange(idx, "description", e.target.value)}
                      placeholder="Description"
                      className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Hours</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      value={item.hours}
                      onChange={e => handleItemChange(idx, "hours", e.target.value)}
                      className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Rate</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.rate}
                      onChange={e => handleItemChange(idx, "rate", e.target.value)}
                      className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Amount</Label>
                    <Input
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="h-10 border-gray-200 bg-gray-100 text-gray-700"
                    />
                  </div>
                  <div className="flex items-center justify-center md:col-span-5">
                    {formData.items.length > 1 && (
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(idx)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addItem} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex justify-end items-center text-lg font-semibold text-emerald-700">
            Total: ${totalAmount.toFixed(2)}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <Button 
              type="submit" 
              disabled={loading || (!!invoiceId && loadingInvoice)}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? "Saving..." : invoiceId ? "Update Invoice" : "Create Invoice"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="flex-1 w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => router.push(invoiceId ? `/dashboard/invoices/${invoiceId}` : "/dashboard/invoices")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 