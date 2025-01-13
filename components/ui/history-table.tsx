import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Result = {
  imageUrl: string;
  sourceUrl: string;
};

type HistoryTableProps = {
  results: Result[];
  timestamp: string;
  maxVisible: number;
};

const RESULTS_PER_BATCH = 8;

export function HistoryTable({ results, timestamp }: HistoryTableProps) {
  const [visibleResults, setVisibleResults] = useState(RESULTS_PER_BATCH);

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-text-light-secondary dark:text-text-dark-secondary">
        No results found
      </div>
    );
  }

  const handleLoadMore = () => {
    setVisibleResults(prev => Math.min(prev + RESULTS_PER_BATCH, results.length));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="border-b border-border-light dark:border-border-dark">
            <tr>
              <th className="py-3 px-4 text-left text-text-light-secondary dark:text-text-dark-secondary">Image</th>
              <th className="py-3 px-4 text-left text-text-light-secondary dark:text-text-dark-secondary">Image URL</th>
              <th className="py-3 px-4 text-left text-text-light-secondary dark:text-text-dark-secondary">Source URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {results.slice(0, visibleResults).map((result, resultIndex) => (
              <tr 
                key={`result-${resultIndex}`}
                className="group hover:bg-surface-light-paper dark:hover:bg-surface-dark-paper transition-colors"
              >
                <td className="py-4 px-4">
                  <a
                    href={result.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-12 w-12 rounded-lg overflow-hidden bg-surface-light-paper dark:bg-surface-dark-paper hover:ring-2 hover:ring-accent-light-primary dark:hover:ring-accent-dark-primary transition-all"
                  >
                    {result.imageUrl ? (
                      <Image
                        src={result.imageUrl}
                        alt="Search result"
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-6 h-6 text-text-light-secondary dark:text-text-dark-secondary" />
                      </div>
                    )}
                  </a>
                </td>
                <td className="py-4 px-4">
                  <a
                    href={result.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-text-light-primary dark:text-text-dark-primary",
                      "hover:text-accent-light-primary dark:hover:text-accent-dark-primary",
                      "transition-colors duration-200",
                      "underline-offset-4 hover:underline",
                      "line-clamp-1"
                    )}
                  >
                    {result.imageUrl}
                  </a>
                </td>
                <td className="py-4 px-4">
                  <a
                    href={result.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-text-light-primary dark:text-text-dark-primary",
                      "hover:text-accent-light-primary dark:hover:text-accent-dark-primary",
                      "transition-colors duration-200",
                      "underline-offset-4 hover:underline",
                      "line-clamp-1"
                    )}
                  >
                    {result.sourceUrl || 'Unknown source'}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleResults < results.length && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="rounded-full"
          >
            Load More Results ({visibleResults} of {results.length})
          </Button>
        </div>
      )}
    </div>
  );
} 