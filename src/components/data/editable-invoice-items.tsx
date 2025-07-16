"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { DatePicker } from "~/components/ui/date-picker";
import { NumberInput } from "~/components/ui/number-input";
import { Textarea } from "~/components/ui/textarea";
import { Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

interface InvoiceItem {
  id: string;
  date: Date;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

interface EditableInvoiceItemsProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
  onRemoveItem: (index: number) => void;
}

function SortableItem({
  item,
  index,
  onItemChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  item: InvoiceItem;
  index: number;
  onItemChange: (
    index: number,
    field: string,
    value: string | number | Date,
  ) => void;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleItemChange = (field: string, value: string | number | Date) => {
    onItemChange(index, field, value);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card-secondary rounded-lg transition-colors ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      {/* Desktop Layout - Hidden on Mobile */}
      <div className="hidden items-center gap-3 p-4 md:grid md:grid-cols-12">
        {/* Drag Handle */}
        <div className="col-span-1 flex items-center justify-center">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:bg-muted hover:text-foreground cursor-grab rounded p-2 transition-colors active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>

        {/* Date */}
        <div className="col-span-2">
          <DatePicker
            date={item.date}
            onDateChange={(date) =>
              handleItemChange("date", date ?? new Date())
            }
            size="sm"
            className="w-full"
          />
        </div>

        {/* Description */}
        <div className="col-span-4">
          <Input
            value={item.description}
            onChange={(e) => handleItemChange("description", e.target.value)}
            placeholder="Work description"
            className="h-9"
          />
        </div>

        {/* Hours */}
        <div className="col-span-1">
          <NumberInput
            value={item.hours}
            onChange={(value) => handleItemChange("hours", value)}
            min={0}
            step={0.25}
            placeholder="0"
            width="full"
          />
        </div>

        {/* Rate */}
        <div className="col-span-2">
          <NumberInput
            value={item.rate}
            onChange={(value) => handleItemChange("rate", value)}
            min={0}
            step={0.01}
            placeholder="0.00"
            prefix="$"
            width="full"
          />
        </div>

        {/* Amount */}
        <div className="col-span-1">
          <div className="bg-muted/30 flex h-9 items-center rounded-md border px-3 font-medium text-emerald-600">
            ${item.amount.toFixed(2)}
          </div>
        </div>

        {/* Remove Button */}
        <div className="col-span-1">
          <Button
            type="button"
            onClick={() => onRemove(index)}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Layout - Visible on Mobile Only */}
      <div className="space-y-4 p-4 md:hidden">
        {/* Header with Item Number and Controls */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium">
            Item {index + 1}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={!canMoveUp}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={!canMoveDown}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              onClick={() => onRemove(index)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Description</Label>
          <Textarea
            value={item.description}
            onChange={(e) => handleItemChange("description", e.target.value)}
            placeholder="Description of work..."
            className="min-h-[48px] resize-none text-sm"
            rows={1}
          />
        </div>

        {/* Date */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Date</Label>
          <DatePicker
            date={item.date}
            onDateChange={(date) =>
              handleItemChange("date", date ?? new Date())
            }
            size="sm"
            className="w-full"
          />
        </div>

        {/* Hours and Rate */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Hours</Label>
            <NumberInput
              value={item.hours}
              onChange={(value) => handleItemChange("hours", value)}
              min={0}
              step={0.25}
              placeholder="0"
              width="full"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Rate</Label>
            <NumberInput
              value={item.rate}
              onChange={(value) => handleItemChange("rate", value)}
              min={0}
              step={0.01}
              placeholder="0.00"
              prefix="$"
              width="full"
            />
          </div>
        </div>

        {/* Amount */}
        <div className="bg-muted/20 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Total Amount:</span>
            <span className="font-mono text-lg font-bold text-emerald-600">
              ${item.amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditableInvoiceItems({
  items,
  onItemsChange,
  onRemoveItem,
}: EditableInvoiceItemsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onItemsChange(newItems);
    }
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number | Date,
  ) => {
    const newItems = [...items];
    if (field === "hours" || field === "rate") {
      if (newItems[index]) {
        const numValue =
          typeof value === "string"
            ? parseFloat(value)
            : typeof value === "number"
              ? value
              : 0;
        newItems[index][field] = numValue || 0;
        newItems[index].amount = newItems[index].hours * newItems[index].rate;
      }
    } else if (field === "date") {
      if (newItems[index]) {
        const dateValue =
          value instanceof Date ? value : new Date(String(value));
        newItems[index].date = dateValue;
      }
    } else {
      if (newItems[index]) {
        const stringValue = typeof value === "string" ? value : String(value);
        newItems[index].description = stringValue;
      }
    }
    onItemsChange(newItems);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newItems = arrayMove(items, index, index - 1);
      onItemsChange(newItems);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < items.length - 1) {
      const newItems = arrayMove(items, index, index + 1);
      onItemsChange(newItems);
    }
  };

  // Show skeleton loading on server-side
  if (!isClient) {
    return (
      <div className="space-y-3">
        {items.map((item, _index) => (
          <div
            key={item.id}
            className="card-secondary animate-pulse rounded-lg p-4"
          >
            {/* Desktop Skeleton */}
            <div className="hidden grid-cols-12 gap-3 md:grid">
              <div className="col-span-1">
                <div className="bg-muted h-4 w-4 rounded"></div>
              </div>
              <div className="col-span-2">
                <div className="bg-muted h-9 rounded"></div>
              </div>
              <div className="col-span-4">
                <div className="bg-muted h-9 rounded"></div>
              </div>
              <div className="col-span-1">
                <div className="bg-muted h-9 rounded"></div>
              </div>
              <div className="col-span-2">
                <div className="bg-muted h-9 rounded"></div>
              </div>
              <div className="col-span-1">
                <div className="bg-muted h-9 rounded"></div>
              </div>
              <div className="col-span-1">
                <div className="bg-muted h-9 w-9 rounded"></div>
              </div>
            </div>
            {/* Mobile Skeleton */}
            <div className="space-y-3 md:hidden">
              <div className="bg-muted h-4 w-20 rounded"></div>
              <div className="bg-muted h-16 rounded"></div>
              <div className="bg-muted h-9 rounded"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted h-9 rounded"></div>
                <div className="bg-muted h-9 rounded"></div>
              </div>
              <div className="bg-muted h-12 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Header Labels - Hidden on Mobile */}
      <div className="text-muted-foreground hidden items-center gap-3 px-4 pb-2 text-xs font-medium md:grid md:grid-cols-12">
        <div className="col-span-1"></div>
        <div className="col-span-2">Date</div>
        <div className="col-span-4">Description</div>
        <div className="col-span-1">Hours</div>
        <div className="col-span-2">Rate</div>
        <div className="col-span-1">Amount</div>
        <div className="col-span-1"></div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                onItemChange={handleItemChange}
                onRemove={onRemoveItem}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                canMoveUp={index > 0}
                canMoveDown={index < items.length - 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
