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
  updateItem: (
    index: number,
    field: string,
    value: string | number | Date,
  ) => void;
  className?: string;
}

export function InvoiceWorkspace({
  formData,
  viewMode,
  setViewMode,
  addItem,
  removeItem,
  updateItem,
  className,
}: InvoiceWorkspaceProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Workspace Header / View Toggle */}
      <div className="bg-background/50 sticky top-0 z-10 flex items-center justify-between border-b p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">
            {viewMode === "list" ? "Line Items" : "Timesheet"}
          </h2>
          <div className="text-muted-foreground ml-2 text-sm">
            {formData.items.length}{" "}
            {formData.items.length === 1 ? "entry" : "entries"}
          </div>
        </div>

        <div className="bg-secondary/50 flex items-center rounded-lg p-1">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 gap-2 text-xs"
          >
            <List className="h-3.5 w-3.5" />
            List
          </Button>
          <Button
            variant={viewMode === "calendar" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            className="h-8 gap-2 text-xs"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Workspace Content */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto p-6 md:p-8">
          {viewMode === "list" ? (
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="bg-background/40 rounded-xl border border-white/10 p-1 backdrop-blur-md">
                <InvoiceLineItems
                  items={formData.items}
                  onAddItem={() => addItem()}
                  onRemoveItem={removeItem}
                  onUpdateItem={updateItem}
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
