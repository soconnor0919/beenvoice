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
import {
  useSortable,
} from "@dnd-kit/sortable";
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
  onRemove 
}: { 
  item: InvoiceItem; 
  index: number; 
  onItemChange: (index: number, field: string, value: any) => void;
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

  const handleItemChange = (field: string, value: any) => {
    onItemChange(index, field, value);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-12 gap-2 items-center p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      {/* Drag Handle */}
      <div className="col-span-1 flex items-center justify-center h-10">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing rounded hover:bg-gray-100 transition-colors"
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
              className="w-full justify-between font-normal h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
            >
              {item.date ? format(item.date, "MMM dd") : "Date"}
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={item.date}
              captionLayout="dropdown"
              onSelect={(selectedDate: Date | undefined) => {
                handleItemChange("date", selectedDate || new Date())
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Description */}
      <div className="col-span-4">
        <Input
          value={item.description}
          onChange={e => handleItemChange("description", e.target.value)}
          placeholder="Work description"
          className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>
      
      {/* Hours */}
      <div className="col-span-1">
        <Input
          type="number"
          step="0.25"
          min="0"
          value={item.hours}
          onChange={e => handleItemChange("hours", e.target.value)}
          placeholder="0"
          className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>
      
      {/* Rate */}
      <div className="col-span-2">
        <Input
          type="number"
          step="0.01"
          min="0"
          value={item.rate}
          onChange={e => handleItemChange("rate", e.target.value)}
          placeholder="0.00"
          className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>
      
      {/* Amount */}
      <div className="col-span-1">
        <div className="h-10 flex items-center px-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium">
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
          className="h-10 w-10 p-0 border-red-200 text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function EditableInvoiceItems({ items, onItemsChange, onRemoveItem }: EditableInvoiceItemsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onItemsChange(newItems);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === "hours" || field === "rate") {
      if (newItems[index]) {
        newItems[index][field as "hours" | "rate"] = parseFloat(value) || 0;
        newItems[index].amount = newItems[index].hours * newItems[index].rate;
      }
    } else if (field === "date") {
      if (newItems[index]) {
        newItems[index][field as "date"] = value;
      }
    } else {
      if (newItems[index]) {
        newItems[index][field as "description"] = value;
      }
    }
    onItemsChange(newItems);
  };

  // Show skeleton loading on server-side
  if (!isClient) {
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-4 border border-gray-200 rounded-lg animate-pulse">
            <div className="col-span-1 flex items-center justify-center h-10">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="col-span-4">
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="col-span-1">
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="col-span-1">
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="col-span-1">
              <div className="h-10 w-10 bg-gray-300 rounded"></div>
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
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
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