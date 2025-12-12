"use client";

import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { DatePicker } from "~/components/ui/date-picker";
import { NumberInput } from "~/components/ui/number-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    STATUS_OPTIONS,
} from "./types";
import type {
    InvoiceFormData,
    ClientType,
    BusinessType,
} from "./types";

interface InvoiceMetaSidebarProps {
    formData: InvoiceFormData;
    updateField: <K extends keyof InvoiceFormData>(
        field: K,
        value: InvoiceFormData[K]
    ) => void;
    clients: ClientType[] | undefined;
    businesses: BusinessType[] | undefined;
    className?: string;
}

export function InvoiceMetaSidebar({
    formData,
    updateField,
    clients,
    businesses,
    className,
}: InvoiceMetaSidebarProps) {
    return (
        <div className={cn("flex flex-col gap-6 p-4 h-full", className)}>
            <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Invoice Details
                </h3>

                {/* Status */}
                <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs">Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value: "draft" | "sent" | "paid") =>
                            updateField("status", value)
                        }
                    >
                        <SelectTrigger className="bg-background/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Invoice Number */}
                <div className="space-y-1.5">
                    <Label htmlFor="invoiceNumber" className="text-xs">Invoice Number</Label>
                    <Input
                        id="invoiceNumber"
                        value={formData.invoiceNumber}
                        placeholder="INV-..."
                        disabled
                        className="bg-muted/50 font-mono text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Involved Parties
                </h3>

                {/* From (Business) */}
                <div className="space-y-1.5">
                    <Label htmlFor="business" className="text-xs">From (Business)</Label>
                    <Select
                        value={formData.businessId}
                        onValueChange={(value) => updateField("businessId", value)}
                    >
                        <SelectTrigger aria-label="From Business" className="bg-background/50 text-sm">
                            <span className="truncate">
                                <SelectValue placeholder="Select business" />
                            </span>
                        </SelectTrigger>
                        <SelectContent>
                            {businesses?.map((business) => (
                                <SelectItem key={business.id} value={business.id}>
                                    {business.name}{business.nickname ? ` (${business.nickname})` : ""}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Bill To (Client) */}
                <div className="space-y-1.5">
                    <Label htmlFor="client" className="text-xs">Bill To (Client)</Label>
                    <Select
                        value={formData.clientId}
                        onValueChange={(value) => updateField("clientId", value)}
                    >
                        <SelectTrigger aria-label="Bill To Client" className="bg-background/50 text-sm">
                            <span className="truncate">
                                <SelectValue placeholder="Select client" />
                            </span>
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

            <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Dates
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Issued</Label>
                        <DatePicker
                            date={formData.issueDate}
                            onDateChange={(date) => updateField("issueDate", date ?? new Date())}
                            className="w-full bg-background/50"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Due</Label>
                        <DatePicker
                            date={formData.dueDate}
                            onDateChange={(date) => updateField("dueDate", date ?? new Date())}
                            className="w-full bg-background/50"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Config
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Tax Rate</Label>
                        <NumberInput
                            value={formData.taxRate}
                            onChange={(v) => updateField("taxRate", v)}
                            min={0}
                            max={100}
                            step={1}
                            suffix="%"
                            className="bg-background/50"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Hourly Rate</Label>
                        <NumberInput
                            value={formData.defaultHourlyRate ?? 0}
                            onChange={(v) => updateField("defaultHourlyRate", v)}
                            min={0}
                            prefix="$"
                            placeholder={!formData.clientId ? "Select client" : "Rate"}
                            disabled={!formData.clientId}
                            className={cn("bg-background/50", !formData.clientId && "opacity-50")}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5 flex-1">
                <Label className="text-xs">Notes</Label>
                <Textarea
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Notes for client..."
                    className="bg-background/50 resize-none h-24"
                />
            </div>
        </div>
    );
}
