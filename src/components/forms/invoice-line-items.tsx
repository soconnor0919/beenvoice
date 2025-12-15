"use client";

import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
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
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onReorderItems: (items: InvoiceItem[]) => void;
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
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

const LineItemCard = React.forwardRef<HTMLDivElement, LineItemRowProps>(
  (
    {
      item,
      index,
      canRemove,
      onRemove,
      onUpdate,
      onMoveUp,
      onMoveDown,
      isFirst,
      isLast,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card border hidden rounded-xl p-4 md:block transition-all shadow-sm group hover:border-primary/20",
        )}
      >
        <div className="flex items-center gap-3">
          {/* Arrow Controls */}
          <div className="flex flex-col gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onMoveUp(index)}
              className="h-6 w-6 p-0"
              disabled={isFirst}
              aria-label="Move up"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onMoveDown(index)}
              className="h-6 w-6 p-0"
              disabled={isLast}
              aria-label="Move down"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-3">
            {/* Description */}
            <div>
              <Input
                value={item.description}
                onChange={(e) => onUpdate(index, "description", e.target.value)}
                placeholder="Describe the work performed..."
                className="w-full text-sm font-medium"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Date */}
              <DatePicker
                date={item.date}
                onDateChange={(date) =>
                  onUpdate(index, "date", date ?? new Date())
                }
                size="sm"
                className="w-full sm:w-[180px]"
                inputClassName="h-9"
              />

              {/* Hours */}
              <NumberInput
                value={item.hours}
                onChange={(value) => onUpdate(index, "hours", value)}
                min={0}
                step={0.25}
                width="auto"
                className="h-9 flex-1 min-w-[100px] font-mono"
                suffix="h"
              />

              {/* Rate */}
              <NumberInput
                value={item.rate}
                onChange={(value) => onUpdate(index, "rate", value)}
                min={0}
                step={1}
                prefix="$"
                width="auto"
                className="h-9 flex-1 min-w-[100px] font-mono"
              />

              {/* Amount */}
              <div className="ml-auto">
                <span className="text-primary font-semibold">
                  ${(item.hours * item.rate).toFixed(2)}
                </span>
              </div>

              {/* Actions */}
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
          </div>
        </div>
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
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
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
            onClick={() => onMoveUp(index)}
            className="h-8 w-8 p-0"
            disabled={isFirst}
            aria-label="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onMoveDown(index)}
            className="h-8 w-8 p-0"
            disabled={isLast}
            aria-label="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
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
  onMoveUp,
  onMoveDown,
  className,
}: InvoiceLineItemsProps) {
  const canRemoveItems = items.length > 1;

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence>
        <div className="space-y-2">
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
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                />
              </motion.div>

              {/* Mobile Card */}
              <MobileLineItem
                item={item}
                index={index}
                canRemove={canRemoveItems}
                onRemove={onRemoveItem}
                onUpdate={onUpdateItem}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                isFirst={index === 0}
                isLast={index === items.length - 1}
              />
            </React.Fragment>
          ))}
        </div>
      </AnimatePresence>

      {/* Add Item Button */}
      <div className="px-3 pt-3">
        <div className="border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onAddItem}
            className="w-full border-dashed border-border py-8 text-muted-foreground hover:text-primary hover:bg-accent/50 hover:border-primary/50 transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Line Item
          </Button>
        </div>
      </div>
    </div>
  );
}
