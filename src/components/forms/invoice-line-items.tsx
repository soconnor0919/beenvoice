"use client";

import { Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { NumberInput } from "~/components/ui/number-input";
import { cn } from "~/lib/utils";

interface InvoiceItem {
  id: string;
  date: Date;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

interface InvoiceLineItemsProps {
  items: InvoiceItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (
    index: number,
    field: string,
    value: string | number | Date,
  ) => void;
  className?: string;
}

interface LineItemRowProps {
  item: InvoiceItem;
  index: number;
  canRemove: boolean;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    field: string,
    value: string | number | Date,
  ) => void;
}

const LineItemCard = React.forwardRef<HTMLDivElement, LineItemRowProps>(
  ({ item, index, canRemove, onRemove, onUpdate }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group hover:bg-muted/40 hidden min-h-16 grid-cols-[140px_minmax(200px,1fr)_124px_136px_104px_32px] items-center gap-2 border-b px-3 py-2 transition-colors md:grid",
        )}
      >
        <DatePicker
          date={item.date}
          onDateChange={(date) => onUpdate(index, "date", date ?? new Date())}
          size="sm"
          className="w-full"
          inputClassName="h-9"
        />

        <Input
          value={item.description}
          onChange={(e) => onUpdate(index, "description", e.target.value)}
          placeholder="Describe the work performed..."
          className="h-9 w-full text-sm font-medium"
        />

        <NumberInput
          value={item.hours}
          onChange={(value) => onUpdate(index, "hours", value)}
          min={0}
          step={0.25}
          width="full"
          className="h-9 font-mono [&_button]:w-6 [&_input]:min-w-12"
          suffix="h"
        />

        <NumberInput
          value={item.rate}
          onChange={(value) => onUpdate(index, "rate", value)}
          min={0}
          step={1}
          prefix="$"
          width="full"
          className="h-9 font-mono [&_button]:w-6 [&_input]:min-w-14"
        />

        <div className="text-primary text-right font-mono font-semibold">
          ${(item.hours * item.rate).toFixed(2)}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
          disabled={!canRemove}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  },
);
LineItemCard.displayName = "LineItemCard";

function MobileLineItem({
  item,
  index,
  canRemove,
  onRemove,
  onUpdate,
}: LineItemRowProps) {
  return (
    <motion.div
      layout
      id={`invoice-item-${index}-mobile`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="border-border bg-card overflow-hidden rounded-lg border md:hidden"
    >
      <div className="space-y-3 p-4">
        {/* Description */}
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Description</Label>
          <Input
            value={item.description}
            onChange={(e) => onUpdate(index, "description", e.target.value)}
            placeholder="Describe the work performed..."
            className="pl-3 text-sm"
          />
        </div>

        {/* Date */}
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Date</Label>
          <DatePicker
            date={item.date}
            onDateChange={(date) => onUpdate(index, "date", date ?? new Date())}
            size="sm"
            inputClassName="h-9"
          />
        </div>

        {/* Hours and Rate in a row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Hours</Label>
            <NumberInput
              value={item.hours}
              onChange={(value) => onUpdate(index, "hours", value)}
              min={0}
              step={0.25}
              width="full"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Rate</Label>
            <NumberInput
              value={item.rate}
              onChange={(value) => onUpdate(index, "rate", value)}
              min={0}
              step={1}
              prefix="$"
              width="full"
              className="font-mono"
            />
          </div>
        </div>
      </div>

      {/* Bottom section with controls, item name, and total */}
      <div className="border-border bg-muted/50 flex items-center justify-between border-t px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
            disabled={!canRemove}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 px-3 text-center">
          <span className="text-muted-foreground block text-sm font-medium">
            <span className="hidden sm:inline">Item </span>
            <span className="sm:hidden">#</span>
            {index + 1}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-muted-foreground text-xs">Total</span>
          <span className="text-primary text-lg font-bold">
            ${(item.hours * item.rate).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function InvoiceLineItems({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  className,
}: InvoiceLineItemsProps) {
  const canRemoveItems = items.length > 1;

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence>
        <div className="space-y-2 md:space-y-0 md:overflow-hidden md:rounded-lg md:border">
          <div className="bg-muted/60 text-muted-foreground hidden grid-cols-[140px_minmax(200px,1fr)_124px_136px_104px_32px] gap-2 border-b px-3 py-2 text-xs font-medium md:grid">
            <span>Date</span>
            <span>Description</span>
            <span className="text-right">Hours</span>
            <span className="text-right">Rate</span>
            <span className="text-right">Amount</span>
            <span />
          </div>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {/* Desktop/Tablet Card */}
              <motion.div
                layout
                id={`invoice-item-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <LineItemCard
                  item={item}
                  index={index}
                  canRemove={canRemoveItems}
                  onRemove={onRemoveItem}
                  onUpdate={onUpdateItem}
                />
              </motion.div>

              {/* Mobile Card */}
              <MobileLineItem
                item={item}
                index={index}
                canRemove={canRemoveItems}
                onRemove={onRemoveItem}
                onUpdate={onUpdateItem}
              />
            </React.Fragment>
          ))}
        </div>
      </AnimatePresence>

      {/* Add Item Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onAddItem}
        className="border-border text-muted-foreground hover:text-primary hover:bg-accent/50 hover:border-primary/50 mt-3 w-full border-dashed py-6 transition-all"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Line Item
      </Button>
    </div>
  );
}
