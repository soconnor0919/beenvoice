"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  size?: "sm" | "md" | "lg";
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Select date",
  className,
  disabled = false,
  id,
  size = "md",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const sizeClasses = {
    sm: "h-9 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-sm",
  };

  const formatDate = (date: Date) => {
    if (size === "sm") {
      return format(date, "MMM dd");
    }
    return format(date, "PPP");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            sizeClasses[size],
            !date && "text-muted-foreground",
            className,
          )}
        >
          {date ? formatDate(date) : placeholder}
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(selectedDate: Date | undefined) => {
            onDateChange(selectedDate);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
