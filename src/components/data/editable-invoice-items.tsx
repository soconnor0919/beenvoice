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
import { Trash2, GripVertical, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

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
}: {
  item: InvoiceItem;
  index: number;
  onItemChange: (
    index: number,
    field: string,
    value: string | number | Date,
  ) => void;
  onRemove: (index: number) => void;
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
      className={`grid grid-cols-12 items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:border-emerald-300 dark:border-gray-700 dark:hover:border-emerald-500 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      {/* Drag Handle */}
      <div className="col-span-1 flex h-10 items-center justify-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-400"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Date */}
      <div className="col-span-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-full justify-between border-gray-200 text-sm font-normal focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              {item.date ? format(item.date, "MMM dd") : "Date"}
              <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={item.date}
              captionLayout="dropdown"
              onSelect={(selectedDate: Date | undefined) => {
                handleItemChange("date", selectedDate ?? new Date());
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Description */}
      <div className="col-span-4">
        <Input
          value={item.description}
          onChange={(e) => handleItemChange("description", e.target.value)}
          placeholder="Work description"
          className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Hours */}
      <div className="col-span-1">
        <Input
          type="number"
          step="0.25"
          min="0"
          value={item.hours}
          onChange={(e) => handleItemChange("hours", e.target.value)}
          placeholder="0"
          className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Rate */}
      <div className="col-span-2">
        <Input
          type="number"
          step="0.01"
          min="0"
          value={item.rate}
          onChange={(e) => handleItemChange("rate", e.target.value)}
          placeholder="0.00"
          className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Amount */}
      <div className="col-span-1">
        <div className="flex h-10 items-center rounded-md border border-gray-200 bg-gray-50 px-3 font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
          ${item.amount.toFixed(2)}
        </div>
      </div>

      {/* Remove Button */}
      <div className="col-span-1">
        <Button
          type="button"
          onClick={() => onRemove(index)}
          variant="outline"
          size="sm"
          className="h-10 w-10 border-red-200 p-0 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
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

  // Show skeleton loading on server-side
  if (!isClient) {
    return (
      <div className="space-y-3">
        {items.map((item, _index) => (
          <div
            key={item.id}
            className="grid animate-pulse grid-cols-12 items-center gap-2 rounded-lg border border-gray-200 p-4"
          >
            <div className="col-span-1 flex h-10 items-center justify-center">
              <div className="h-4 w-4 rounded bg-gray-300"></div>
            </div>
            <div className="col-span-2">
              <div className="h-10 rounded bg-gray-300"></div>
            </div>
            <div className="col-span-4">
              <div className="h-10 rounded bg-gray-300"></div>
            </div>
            <div className="col-span-1">
              <div className="h-10 rounded bg-gray-300"></div>
            </div>
            <div className="col-span-2">
              <div className="h-10 rounded bg-gray-300"></div>
            </div>
            <div className="col-span-1">
              <div className="h-10 rounded bg-gray-300"></div>
            </div>
            <div className="col-span-1">
              <div className="h-10 w-10 rounded bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
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
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
