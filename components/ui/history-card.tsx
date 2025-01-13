import { format } from "date-fns";
import type { HistoryItem } from "@/types/history";
import { HistoryTable } from "@/components/ui/history-table";
import { Card } from "@/components/ui/card";

interface HistoryCardProps {
  item: HistoryItem;
}

export function HistoryCard({ item }: HistoryCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              Search Results ({item.result_count})
            </h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              {format(new Date(item.timestamp), "PPpp")}
            </p>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <HistoryTable 
            results={item.search_results || []}
            timestamp={item.timestamp}
            maxVisible={8}
          />
        </div>
      </div>
    </Card>
  );
} 