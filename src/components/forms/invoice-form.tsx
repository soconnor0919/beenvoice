"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
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
import { InvoiceCalendarView } from "./invoice-calendar-view";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { FileText, DollarSign, Check, Save, Clock, Trash2, Calendar as CalendarIcon, Tag, User, List } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { STATUS_OPTIONS } from "./invoice/types";
import type { InvoiceFormData, InvoiceItem } from "./invoice/types";

// ... (Imports and Interfaces identical to previous)

interface InvoiceFormProps {
  invoiceId?: string;
}

function InvoiceFormSkeleton() {
  return (
    <div className="space-y-6 pb-32">
      <PageHeader
        title="Loading..."
        description="Loading invoice form"
        variant="gradient"
      />
      <div className="bg-muted p-1 rounded-xl h-12 w-full animate-pulse" /> {/* Tabs Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="h-[200px] bg-muted animate-pulse rounded-xl" />
        <div className="h-[200px] bg-muted animate-pulse rounded-xl" />
      </div>
    </div>
  );
}

export default function InvoiceForm({ invoiceId }: InvoiceFormProps) {
  const router = useRouter();
  const utils = api.useUtils();

  // State
  const [formData, setFormData] = useState<InvoiceFormData>({
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
      { id: crypto.randomUUID(), date: new Date(), description: "", hours: 1, rate: 0, amount: 0 },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const firstItemEditedRef = useRef(false);

  // Queries (Same as before)
  const { data: clients, isLoading: loadingClients } = api.clients.getAll.useQuery();
  const { data: businesses, isLoading: loadingBusinesses } = api.businesses.getAll.useQuery();
  const { data: existingInvoice, isLoading: loadingInvoice } = api.invoices.getById.useQuery(
    { id: invoiceId! }, { enabled: !!invoiceId && invoiceId !== "new" },
  );

  const deleteInvoice = api.invoices.delete.useMutation({
    onSuccess: () => { toast.success("Invoice deleted"); router.push("/dashboard/invoices"); },
    onError: (e) => toast.error(e.message ?? "Failed to delete"),
  });

  // Init Effects (Same as before)
  useEffect(() => { setInitialized(false); }, [invoiceId]);
  useEffect(() => {
    if (invoiceId && invoiceId !== "new" && existingInvoice && !initialized) {
      // ... (Mapping logic same as before)
      const mappedItems: InvoiceItem[] = existingInvoice.items?.map((item) => ({
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
        status: existingInvoice.status as any,
        notes: existingInvoice.notes ?? "",
        taxRate: existingInvoice.taxRate,
        defaultHourlyRate: null,
        items: mappedItems.length > 0 ? mappedItems : [{ id: crypto.randomUUID(), date: new Date(), description: "", hours: 1, rate: 0, amount: 0 }],
      });
      setInitialized(true);
    } else if ((!invoiceId || invoiceId === "new") && businesses && !initialized) {
      const defaultBusiness = businesses.find((b) => b.isDefault) || businesses[0];
      if (defaultBusiness) setFormData((prev) => ({ ...prev, businessId: defaultBusiness.id }));
      setInitialized(true);
    }
  }, [invoiceId, existingInvoice, businesses, initialized]);

  const totals = React.useMemo(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.hours * item.rate, 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  }, [formData.items, formData.taxRate]);

  // Handlers (addItem, updateItem etc. - same as before)
  const addItem = (date?: Date) => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), date: date ?? new Date(), description: "", hours: 1, rate: prev.defaultHourlyRate ?? 0, amount: prev.defaultHourlyRate ?? 0 }],
    }));
  };
  const removeItem = (idx: number) => { if (formData.items.length > 1) setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) })); };
  const updateItem = (idx: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === idx) {
          const u: any = { ...item, [field]: value };
          if (field === "hours" || field === "rate") u.amount = u.hours * u.rate;
          return u;
        }
        return item;
      })
    }));
  };
  const moveItemUp = (idx: number) => {
    if (idx === 0) return;
    setFormData((prev) => {
      const newItems = [...prev.items];
      if (newItems[idx] && newItems[idx - 1]) {
        const temp = newItems[idx - 1]!;
        newItems[idx - 1] = newItems[idx];
        newItems[idx] = temp;
      }
      return { ...prev, items: newItems };
    });
  };
  const moveItemDown = (idx: number) => {
    if (idx === formData.items.length - 1) return;
    setFormData((prev) => {
      const newItems = [...prev.items];
      if (newItems[idx] && newItems[idx + 1]) {
        const temp = newItems[idx + 1]!;
        newItems[idx + 1] = newItems[idx];
        newItems[idx] = temp;
      }
      return { ...prev, items: newItems };
    });
  };
  const reorderItems = (newItems: InvoiceItem[]) => setFormData(prev => ({ ...prev, items: newItems }));

  const createInvoice = api.invoices.create.useMutation({
    onSuccess: (inv) => { toast.success("Created"); router.push(`/dashboard/invoices/${inv.id}`); },
    onError: (e) => toast.error(e.message),
  });
  const updateInvoice = api.invoices.update.useMutation({
    onSuccess: () => { toast.success("Updated"); router.push(invoiceId === "new" ? "/dashboard/invoices" : `/dashboard/invoices/${invoiceId}`); },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = async () => {
    setLoading(true);
    if (!formData.clientId) { toast.error("Select Client"); setLoading(false); return; }

    // Validate Items - Check for empty description
    let invalidItemIndex = -1;
    for (let i = 0; i < formData.items.length; i++) {
      if (!formData.items[i]?.description || formData.items[i]?.description.trim() === "") {
        invalidItemIndex = i;
        break;
      }
    }

    if (invalidItemIndex !== -1) {
      toast.error(`Item #${invalidItemIndex + 1} is missing a description`);
      setLoading(false);
      setActiveTab("items"); // Switch to items tab

      // Timeout to allow tab switch rendering
      setTimeout(() => {
        const element = document.getElementById(`invoice-item-${invalidItemIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Optional: Highlight effect
          element.classList.add("ring-2", "ring-destructive", "ring-offset-2");
          setTimeout(() => element.classList.remove("ring-2", "ring-destructive", "ring-offset-2"), 2000);
        }
      }, 100);
      return;
    }

    try {
      const payload = {
        invoiceNumber: formData.invoiceNumber,
        businessId: formData.businessId || "",
        clientId: formData.clientId,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        status: formData.status,
        notes: formData.notes,
        taxRate: formData.taxRate,
        items: formData.items.map(i => ({ date: i.date, description: i.description, hours: i.hours, rate: i.rate, amount: i.hours * i.rate })),
      };
      if (invoiceId && invoiceId !== "new" && invoiceId !== undefined) await updateInvoice.mutateAsync({ id: invoiceId, ...payload });
      else await createInvoice.mutateAsync(payload);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const updateField = (field: keyof InvoiceFormData, value: any) => setFormData(p => ({ ...p, [field]: value }));
  const handleDelete = () => setDeleteDialogOpen(true);
  const confirmDelete = () => { if (invoiceId) deleteInvoice.mutate({ id: invoiceId }); };

  if (!initialized || loadingClients || loadingBusinesses || (invoiceId && invoiceId !== "new" && loadingInvoice)) return <InvoiceFormSkeleton />;

  return (
    <>
      <div className="page-enter space-y-6 pb-32">
        <PageHeader title={invoiceId !== "new" ? "Edit Invoice" : "Create Invoice"} description="Manage your invoice" variant="gradient">
          {invoiceId !== "new" && <Button variant="secondary" onClick={handleDelete} className="text-destructive">Delete</Button>}
          <Button onClick={handleSubmit} variant="secondary"><Save className="mr-2 h-4 w-4" /> Save</Button>
        </PageHeader>

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          {/* TAB SELECTOR: w-full, p-1, visible background */}
          <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-xl h-auto">
            <TabsTrigger value="details" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Details</TabsTrigger>
            <TabsTrigger value="items" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Items</TabsTrigger>
            <TabsTrigger value="timesheet" className="rounded-lg py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Timesheet</TabsTrigger>
          </TabsList>

          {/* DETAILS TAB */}
          <TabsContent value="details" className="grid grid-cols-1 lg:grid-cols-2 gap-6 focus-visible:outline-none mt-6">
            <Card className="h-fit">
              <CardHeader><CardTitle className="flex gap-2 text-base"><User className="w-4 h-4" /> Client Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select
                    value={formData.clientId}
                    onValueChange={(v) => {
                      updateField("clientId", v);
                      // Auto-fill Hourly Rate
                      const selectedClient = clients?.find(c => c.id === v);
                      const currentBusiness = businesses?.find(b => b.id === formData.businessId);
                      // Explicitly prioritize client rate, then business rate, then 0
                      const clientRate = selectedClient && 'defaultHourlyRate' in selectedClient ? selectedClient.defaultHourlyRate : null;
                      const businessRate = currentBusiness && 'defaultHourlyRate' in currentBusiness ? currentBusiness.defaultHourlyRate : null;
                      const rateToSet = clientRate ?? businessRate ?? 0;

                      updateField("defaultHourlyRate", rateToSet);
                    }}
                  >
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select Client" /></SelectTrigger>
                    <SelectContent>{clients?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Business</Label><Select value={formData.businessId} onValueChange={(v) => updateField("businessId", v)}><SelectTrigger className="w-full"><SelectValue placeholder="Select Business" /></SelectTrigger><SelectContent>{businesses?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select></div>
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader><CardTitle className="flex gap-2 text-base"><Tag className="w-4 h-4" /> Invoice Config</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Issue Date</Label><DatePicker date={formData.issueDate} onDateChange={(d) => updateField("issueDate", d || new Date())} className="w-full" /></div>
                  <div className="space-y-2"><Label>Due Date</Label><DatePicker date={formData.dueDate} onDateChange={(d) => updateField("dueDate", d || new Date())} className="w-full" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Tax Rate</Label><NumberInput value={formData.taxRate} onChange={(v) => updateField("taxRate", v)} suffix="%" className="w-full" /></div>
                  <div className="space-y-2"><Label>Hourly Rate</Label><NumberInput value={formData.defaultHourlyRate ?? 0} onChange={(v) => updateField("defaultHourlyRate", v)} prefix="$" disabled={!formData.clientId} className="w-full" /></div>
                </div>
                <div className="space-y-2"><Label>Status</Label><Select value={formData.status} onValueChange={(v: "draft" | "sent" | "paid") => updateField("status", v)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ITEMS TAB */}
          <TabsContent value="items" className="focus-visible:outline-none mt-6">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/20"><CardContent className="p-4 flex justify-between items-center"><span className="text-muted-foreground">Total</span><span className="text-2xl font-bold">${totals.total.toFixed(2)}</span></CardContent></Card>
              <Card><CardContent className="p-4 flex justify-between items-center"><span className="text-muted-foreground">Subtotal</span><span className="text-xl font-semibold">${totals.subtotal.toFixed(2)}</span></CardContent></Card>
              <Card><CardContent className="p-4 flex justify-between items-center"><span className="text-muted-foreground">Hours</span><span className="text-xl font-semibold">{formData.items.reduce((s, i) => s + i.hours, 0)}h</span></CardContent></Card>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex gap-2"><List className="w-5 h-5" /> Invoice Items</CardTitle></CardHeader>
              <CardContent>
                <InvoiceLineItems items={formData.items} onAddItem={addItem} onRemoveItem={removeItem} onUpdateItem={updateItem} onMoveUp={moveItemUp} onMoveDown={moveItemDown} onReorderItems={reorderItems} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TIMESHEET TAB */}
          <TabsContent value="timesheet" className="focus-visible:outline-none mt-6">
            <Card className="min-h-[600px] w-full">
              <CardHeader><CardTitle className="flex gap-2"><CalendarIcon className="w-5 h-5" /> Timesheet</CardTitle></CardHeader>
              <CardContent className="p-0 sm:p-0">
                <InvoiceCalendarView items={formData.items} onAddItem={addItem} onRemoveItem={removeItem} onUpdateItem={updateItem} defaultHourlyRate={formData.defaultHourlyRate} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>Delete?</DialogTitle><DialogDescription>Cannot be undone.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={confirmDelete}>Delete</Button></DialogFooter></DialogContent>
      </Dialog>
    </>
  );
}
