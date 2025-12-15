"use client";

import * as React from "react";
import { parseDate } from "chrono-node";
import { CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  size?: "sm" | "md" | "lg";
  inputClassName?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Tomorrow or next week",
  className,
  inputClassName,
  disabled = false,
  id,
  size = "md",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(formatDate(date));
  const [month, setMonth] = React.useState<Date | undefined>(date);

  const sizeClasses = {
    sm: "h-9 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-sm",
  };

  const inputWidthClass = className?.includes("w-full")
    ? "w-full"
    : className?.includes("w-32") ||
      className?.includes("w-28") ||
      className?.includes("w-36")
      ? className
      : "w-full md:w-32 md:min-w-32";

  React.useEffect(() => {
    setValue(formatDate(date));
    setMonth(date);
  }, [date]);

  return (
    <div className={cn("relative flex gap-2", inputWidthClass, className)}>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("bg-background pr-10", sizeClasses[size], "w-full", inputClassName)}
        onChange={(e) => {
          setValue(e.target.value);
          const parsedDate = parseDate(e.target.value);
          if (parsedDate) {
            onDateChange(parsedDate);
            setMonth(parsedDate);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            disabled={disabled}
            className="absolute top-1/2 right-2 size-6 p-0 -translate-y-1/2 text-primary/80 hover:text-primary transition-colors z-20"
          >
            <CalendarIcon className="size-4" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 rounded-xl" align="end">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(selectedDate) => {
              onDateChange(selectedDate);
              setValue(formatDate(selectedDate));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
