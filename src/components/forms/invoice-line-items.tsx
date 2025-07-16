"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DatePicker } from "~/components/ui/date-picker";
import { NumberInput } from "~/components/ui/number-input";
import {
  Trash2,
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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

function LineItemRow({
  item,
  index,
  canRemove,
  onRemove,
  onUpdate,
}: LineItemRowProps) {
  return (
    <div className="card-secondary hidden rounded-lg p-4 md:block">
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="mt-1 flex items-center justify-center">
          <GripVertical className="text-muted-foreground h-4 w-4 cursor-grab" />
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
              className="h-9 w-36"
            />

            {/* Hours */}
            <NumberInput
              value={item.hours}
              onChange={(value) => onUpdate(index, "hours", value)}
              min={0}
              step={0.25}
              width="auto"
              className="h-9 w-32"
            />

            {/* Rate */}
            <NumberInput
              value={item.rate}
              onChange={(value) => onUpdate(index, "rate", value)}
              min={0}
              step={1}
              prefix="$"
              width="auto"
              className="h-9 w-32"
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
              className={cn(
                "text-muted-foreground h-8 w-8 p-0 transition-colors hover:text-red-500",
                !canRemove && "cursor-not-allowed opacity-50",
              )}
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
}

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
    <div className="card-secondary space-y-3 rounded-lg md:hidden">
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
            />
          </div>
        </div>
      </div>

      {/* Bottom section with controls, item name, and total */}
      <div className="flex items-center justify-between rounded-b-lg border-t border-slate-400/60 bg-slate-200/30 px-4 py-2 dark:border-slate-500/60 dark:bg-slate-700/30">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onMoveUp(index)}
            className={cn(
              "h-8 w-8 p-0 transition-colors",
              isFirst
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground",
            )}
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
            className={cn(
              "h-8 w-8 p-0 transition-colors",
              isLast
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground",
            )}
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
            className={cn(
              "text-muted-foreground h-8 w-8 p-0 transition-colors hover:text-red-500",
              !canRemove && "cursor-not-allowed opacity-50",
            )}
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
    </div>
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
      {/* Desktop and Mobile Cards */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {/* Desktop/Tablet Card */}
            <LineItemRow
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

      {/* Add Item Button */}
      <div className="px-3 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onAddItem}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Item
        </Button>
      </div>
    </div>
  );
}
