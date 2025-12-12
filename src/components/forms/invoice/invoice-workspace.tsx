"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { List, Calendar as CalendarIcon } from "lucide-react";
import { InvoiceLineItems } from "../invoice-line-items";
import { InvoiceCalendarView } from "../invoice-calendar-view";
import type { InvoiceFormData } from "./types";

interface InvoiceWorkspaceProps {
    formData: InvoiceFormData;
    viewMode: "list" | "calendar";
    setViewMode: (mode: "list" | "calendar") => void;
    addItem: (date?: Date) => void;
    removeItem: (index: number) => void;
    updateItem: (index: number, field: string, value: string | number | Date) => void;
    moveItemUp: (index: number) => void;
    moveItemDown: (index: number) => void;
    reorderItems: (items: InvoiceFormData['items']) => void;
    className?: string;
}

export function InvoiceWorkspace({
    formData,
    viewMode,
    setViewMode,
    addItem,
    removeItem,
    updateItem,
    moveItemUp,
    moveItemDown,
    reorderItems,
    className,
}: InvoiceWorkspaceProps) {

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Workspace Header / View Toggle */}
            <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">
                        {viewMode === 'list' ? 'Line Items' : 'Timesheet'}
                    </h2>
                    <div className="text-sm text-muted-foreground ml-2">
                        {formData.items.length} {formData.items.length === 1 ? 'entry' : 'entries'}
                    </div>
                </div>

                <div className="flex items-center bg-secondary/50 p-1 rounded-lg">
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-8 gap-2 text-xs"
                    >
                        <List className="w-3.5 h-3.5" />
                        List
                    </Button>
                    <Button
                        variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('calendar')}
                        className="h-8 gap-2 text-xs"
                    >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Calendar
                    </Button>
                </div>
            </div>

            {/* Workspace Content */}
            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto p-6 md:p-8">
                    {viewMode === 'list' ? (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="bg-background/40 backdrop-blur-md rounded-xl border border-white/10 p-1">
                                <InvoiceLineItems
                                    items={formData.items}
                                    onAddItem={() => addItem()}
                                    onRemoveItem={removeItem}
                                    onUpdateItem={updateItem}
                                    onMoveUp={moveItemUp}
                                    onMoveDown={moveItemDown}
                                    onReorderItems={reorderItems}
                                    className="p-4"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full">
                            <InvoiceCalendarView
                                items={formData.items}
                                onAddItem={addItem}
                                onRemoveItem={removeItem}
                                onUpdateItem={updateItem}
                                defaultHourlyRate={formData.defaultHourlyRate}
                                className="h-full"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
