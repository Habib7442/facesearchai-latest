import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface HistoryHeaderProps {
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export function HistoryHeader({ 
  dateRange, 
  onDateRangeChange, 
  onClearFilters,
  isLoading 
}: HistoryHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="h3-bold">Search History</h1>
      <div className="flex items-center gap-2">
        <DateRangePicker 
          date={dateRange}
          onDateChange={onDateRangeChange}
          disabled={isLoading}
        />
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          disabled={isLoading || !dateRange}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
} 