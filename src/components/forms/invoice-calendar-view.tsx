"use client";

import * as React from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subWeeks, addWeeks, subMonths, addMonths } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { NumberInput } from "~/components/ui/number-input";
import { Plus, Trash2, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";


interface InvoiceItem {
    id: string;
    date: Date;
    description: string;
    hours: number;
    rate: number;
    amount: number;
}

interface InvoiceCalendarViewProps {
    items: InvoiceItem[];
    onUpdateItem: (
        index: number,
        field: string,
        value: string | number | Date
    ) => void;
    onAddItem: (date?: Date) => void;
    onRemoveItem: (index: number) => void;
    className?: string;
    defaultHourlyRate: number | null;
}

export function InvoiceCalendarView({
    items,
    onUpdateItem,
    onAddItem,
    onRemoveItem,
    className,
    defaultHourlyRate: _defaultHourlyRate,
}: InvoiceCalendarViewProps) {
    const [date, setDate] = React.useState<Date | undefined>(undefined); // Start unselected
    const [viewDate, setViewDate] = React.useState<Date>(new Date()); // Controls the view (month/week)
    const [view, setView] = React.useState<"month" | "week">("month");
    const [sheetOpen, setSheetOpen] = React.useState(false);
    // Derived state for selected date items - solves cursor jumping
    const selectedDateItems = React.useMemo(() => {
        if (!date) return [];
        return items
            .map((item, index) => ({ item, index }))
            .filter((wrapper) => {
                const itemDate = new Date(wrapper.item.date);
                return isSameDay(itemDate, date);
            });
    }, [items, date]);

    // Helper to get items for any date (for calendar view)
    const getItemsForDate = React.useCallback((targetDate: Date) => {
        return items
            .map((item, index) => ({ item, index }))
            .filter((wrapper) => {
                const itemDate = new Date(wrapper.item.date);
                return isSameDay(itemDate, targetDate);
            });
    }, [items]);

    const handleSelectDate = (newDate: Date | undefined) => {
        if (!newDate) return;
        setDate(newDate);
        setSheetOpen(true);
    };

    const handleAddNewItem = () => {
        if (date) {
            onAddItem(date);
        }
    };

    // Week View Logic - Uses viewDate
    const currentWeekStart = startOfWeek(viewDate);
    const currentWeekEnd = endOfWeek(viewDate);
    const weekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

    const handleCloseSheet = (isOpen: boolean) => {
        setSheetOpen(isOpen);
        if (!isOpen) {
            setDate(undefined);
        }
    };

    return (
        <div className={cn("flex flex-col gap-4 h-full w-full", className)}>
            <div className="flex items-center justify-between px-4 pt-4 w-full gap-4">
                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                    {view === "week" ? (
                        <>
                            <Button variant="outline" size="icon" onClick={() => setViewDate(d => subWeeks(d, 1))} className="h-8 w-8 rounded-lg">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium w-36 text-center">
                                {`${format(currentWeekStart, "MMM d")} - ${format(currentWeekEnd, "MMM d")}`}
                            </span>
                            <Button variant="outline" size="icon" onClick={() => setViewDate(d => addWeeks(d, 1))} className="h-8 w-8 rounded-lg">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" size="icon" onClick={() => setViewDate(d => subMonths(d, 1))} className="h-8 w-8 rounded-lg">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium w-36 text-center">
                                {format(viewDate, "MMMM yyyy")}
                            </span>
                            <Button variant="outline" size="icon" onClick={() => setViewDate(d => addMonths(d, 1))} className="h-8 w-8 rounded-lg">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                    {/* View Switcher */}
                    <div className="bg-muted p-1 rounded-lg flex text-sm">
                        <button
                            type="button"
                            onClick={() => setView("month")}
                            className={cn("px-3 py-1.5 rounded-md transition-all text-center font-medium", view === "month" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Month
                        </button>
                        <button
                            type="button"
                            onClick={() => setView("week")}
                            className={cn("px-3 py-1.5 rounded-md transition-all text-center font-medium", view === "week" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Week
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full overflow-hidden">
                {view === "month" ? (
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelectDate}
                        month={viewDate}
                        onMonthChange={setViewDate}
                        className="rounded-md border-0 w-full p-0"
                        classNames={{
                            root: "w-full p-0",
                            months: "flex flex-col w-full",
                            month: "flex flex-col w-full space-y-4",

                            // Grid - Revert to Flex but Enforce 1/7th Width
                            // table: "w-full border-collapse", // No table-fixed
                            head_row: "flex w-full",
                            row: "flex w-full mt-2",

                            // Cells & Headers: Explicit width 14.28%
                            // Use calc(100%/7) via tailwind arbitrary or just flex bases.
                            // Better: w-[14.28%] flex-none (approx 1/7)
                            weekdays: "flex w-full border-b",
                            weekday: "w-[14.285%] flex-none text-muted-foreground font-normal text-[0.8rem] text-center pb-4",

                            week: "flex w-full mt-2",
                            cell: "w-[14.285%] flex-none h-32 border-b p-0 relative focus-within:relative focus-within:z-20 text-center text-sm",

                            // Hide internal navigation & caption entirely
                            nav: "hidden",
                            caption: "hidden",

                            day: cn(
                                "w-full h-full p-2 font-normal aria-selected:opacity-100 flex flex-col items-start justify-start gap-1 hover:bg-accent/50 hover:text-accent-foreground align-top transition-colors rounded-xl"
                            ),
                            day_selected: "bg-primary/5 text-primary",
                            day_today: "bg-accent/20",
                            day_outside: "text-muted-foreground opacity-30",
                        }}
                        formatters={{
                            formatMonthCaption: () => "", // Clear default caption text to prevent duplication
                        }}
                        components={{
                            DayButton: (props) => {
                                const { day, modifiers, className, ...buttonProps } = props;
                                const DayDate = day.date;
                                const dayItems = getItemsForDate(DayDate);
                                // const totalHours = dayItems.reduce((acc, curr) => acc + curr.item.hours, 0); // Unused now

                                return (
                                    <button
                                        {...buttonProps}
                                        type="button"
                                        className={cn(
                                            "relative flex h-full w-full flex-col items-start justify-between p-2 transition-all rounded-xl border border-transparent hover:border-border/50 hover:bg-secondary/30 text-left overflow-hidden",
                                            // Selected State: Filled Box, No Outline
                                            modifiers.selected && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transform scale-[0.98]",
                                            modifiers.today && !modifiers.selected && "bg-accent/40 rounded-xl",
                                            className
                                        )}
                                    >
                                        <span className="text-sm font-medium z-10">{DayDate.getDate()}</span>
                                        {dayItems.length > 0 && (
                                            <div className="flex flex-col gap-1 w-full mt-1 overflow-hidden h-full justify-end pb-1">
                                                <div className="flex flex-col gap-1 w-full mt-1">
                                                    {dayItems.slice(0, 4).map((item, idx) => (
                                                        <div key={idx} className={cn("h-1 w-full rounded-full", modifiers.selected ? "bg-primary-foreground/50" : "bg-primary/50")} />
                                                    ))}
                                                    {dayItems.length > 4 && <div className={cn("h-1 w-1/3 rounded-full", modifiers.selected ? "bg-primary-foreground/30" : "bg-muted-foreground/30")} />}
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            }
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4 h-full w-full">
                        {weekDays.map((day) => {
                            const isSelected = date && isSameDay(day, date);
                            const isToday = isSameDay(day, new Date());
                            const dayItems = getItemsForDate(day);
                            const totalHours = dayItems.reduce((acc, curr) => acc + curr.item.hours, 0);

                            return (
                                <button
                                    key={day.toString()}
                                    type="button"
                                    onClick={() => handleSelectDate(day)}
                                    className={cn(
                                        "flex flex-col h-full min-h-[400px] border rounded-3xl p-4 text-left transition-all hover:bg-accent/30 w-full",
                                        isSelected ? "ring-2 ring-primary ring-offset-2 bg-primary/5" : "bg-background/40",
                                        isToday && !isSelected ? "bg-accent/40" : ""
                                    )}
                                >
                                    <div className="flex flex-col items-center mb-4 pb-4 border-b w-full">
                                        <span className="text-xs font-bold text-muted-foreground uppercase">{format(day, "EEE")}</span>
                                        <span className="text-2xl font-light">{format(day, "d")}</span>
                                    </div>

                                    <div className="flex-1 space-y-2 w-full overflow-hidden">
                                        {dayItems.length > 0 ? (
                                            dayItems.map(({ item }, i) => (
                                                <div key={i} className="bg-background rounded-xl p-2 text-xs shadow-sm border">
                                                    <div className="font-medium line-clamp-2 text-wrap break-words">{item.description || "No description"}</div>
                                                    <div className="text-muted-foreground whitespace-nowrap">{item.hours}h</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-muted-foreground/20">
                                                <Plus className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>

                                    {dayItems.length > 0 && (
                                        <div className="pt-2 mt-auto text-center w-full">
                                            <span className="text-sm font-semibold">{totalHours}h Total</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Sheet for Day Details */}
            <Sheet
                open={sheetOpen}
                onOpenChange={handleCloseSheet}
            >
                <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col gap-0 p-0 sm:max-w-[540px]">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle className="flex items-center gap-3 text-2xl flex-wrap">
                            <div className="bg-primary/10 p-2.5 rounded-full flex-shrink-0">
                                <CalendarIcon className="w-6 h-6 text-primary" />
                            </div>
                            <span className="break-words text-left">{date ? format(date, "EEEE, MMMM do") : "Details"}</span>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {date && selectedDateItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-secondary/20 rounded-3xl border border-dashed border-border/60">
                                    <div className="bg-background p-4 rounded-full shadow-sm">
                                        <Clock className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-lg text-foreground">No hours logged</p>
                                        <p className="text-sm text-muted-foreground/80 max-w-[200px]">There are no time entries recorded for this day yet.</p>
                                    </div>
                                    <Button onClick={handleAddNewItem} className="mt-2" size="lg">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Log Time
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedDateItems.map(({ item, index }) => (
                                        <div key={item.id} className="border-border bg-card overflow-hidden rounded-lg border group hover:border-primary/50 transition-colors">
                                            <div className="space-y-3 p-4">
                                                {/* Description */}
                                                <div className="space-y-1">
                                                    <Label className="text-muted-foreground text-xs">Description</Label>
                                                    <Input
                                                        value={item.description}
                                                        onChange={(e) => onUpdateItem(index, "description", e.target.value)}
                                                        placeholder="Describe the work performed..."
                                                        className="pl-3 text-sm"
                                                    />
                                                </div>

                                                {/* Hours and Rate in a row */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <Label className="text-muted-foreground text-xs">Hours</Label>
                                                        <NumberInput
                                                            value={item.hours}
                                                            onChange={v => onUpdateItem(index, "hours", v)}
                                                            step={0.25}
                                                            min={0}
                                                            width="full"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-muted-foreground text-xs">Rate</Label>
                                                        <NumberInput
                                                            value={item.rate}
                                                            onChange={v => onUpdateItem(index, "rate", v)}
                                                            prefix="$"
                                                            min={0}
                                                            step={1}
                                                            width="full"
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
                                                        onClick={() => onRemoveItem(index)}
                                                        className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex-1 px-3 text-center">
                                                    <span className="text-muted-foreground block text-sm font-medium">
                                                        Item #{index + 1}
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
                                    ))}
                                    <Button variant="outline" onClick={handleAddNewItem} className="w-full border-dashed py-8 rounded-xl hover:bg-accent/50 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all gap-2 group">
                                        <div className="bg-muted group-hover:bg-primary/10 p-1 rounded-md transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </div>
                                        <span>Add Another Entry</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <SheetFooter className="p-6 border-t bg-muted/10 mt-auto">
                        <Button className="w-full sm:w-full rounded-xl h-12 text-base shadow-md" size="lg" onClick={() => handleCloseSheet(false)}>Done</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
