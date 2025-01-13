"use client";

import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  date?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
  disabled?: boolean;
}

export function DateRangePicker({ date, onDateChange, disabled }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            "bg-surface-light-paper dark:bg-surface-dark-paper",
            "border-border-light dark:border-border-dark",
            "hover:bg-surface-light-paper/90 dark:hover:bg-surface-dark-paper/90"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-auto p-0",
          "bg-surface-light-elevated dark:bg-surface-dark-elevated",
          "border-border-light dark:border-border-dark",
          "shadow-elevation-1 dark:shadow-dark-elevation-1"
        )}
        align="start"
      >
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={onDateChange}
          numberOfMonths={2}
          disabled={disabled}
          className="bg-surface-light-elevated dark:bg-surface-dark-elevated rounded-lg"
          fromDate={new Date(2000, 0, 1)}
          toDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
} 