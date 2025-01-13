import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function CustomPagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage 
}: CustomPaginationProps) {
  const renderPaginationItems = () => {
    const items = [];
    let maxVisiblePages = 7; // Default number of visible pages
    
    // Increase maxVisiblePages based on total items
    if (totalItems > 100) maxVisiblePages = 9;
    if (totalItems > 200) maxVisiblePages = 11;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink 
            onClick={() => onPageChange(1)}
            className={cn(
              "cursor-pointer",
              currentPage === 1 && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => onPageChange(page)}
            className={cn(
              "cursor-pointer",
              currentPage === page && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            className={cn(
              "cursor-pointer",
              currentPage === totalPages && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-2">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(
                "cursor-pointer",
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>
          
          {renderPaginationItems()}

          <PaginationItem>
            <PaginationNext
              className={cn(
                "cursor-pointer",
                currentPage === totalPages && "pointer-events-none opacity-50"
              )}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
      <div className="text-sm text-center text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>
    </div>
  );
}