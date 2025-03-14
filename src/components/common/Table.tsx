import { Input } from "@/components/ui/input";
import { Search, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from '@/components/ui/skeleton';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface FilterOption {
  label: string;
  value: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  searchQuery?: string;
  filters?: Record<string, string>;
  filterOptions?: {
    [key: string]: {
      placeholder: string;
      options: FilterOption[];
    };
  };
  dateFilters?: FilterOption[];
  onSearch?: (value: string) => void;
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: any) => void;
}

export default function ReusableTable({
  columns,
  data,
  isLoading,
  totalPages = 1,
  currentPage = 1,
  searchQuery = "search",
  filters,
  filterOptions,
  onSearch,
  onFilterChange,
  onClearFilters,
  onRowClick,
  onPageChange
}: TableProps) {

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => onPageChange?.(1)}>1</PaginationLink>
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

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => onPageChange?.(page)}
            isActive={page === currentPage}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

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
          <PaginationLink onClick={() => onPageChange?.(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <div className="w-full space-y-4 dark border-2 rounded-xl border-primary">
      {
        filterOptions && onSearch && (
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-8 w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              {filterOptions && Object.entries(filterOptions).map(([key, filter]) => (
                <Select
                  key={filter.placeholder}
                  value={filters && filters[key]}
                  onValueChange={(value) => onFilterChange && onFilterChange(key, value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
              {(filters && Object.values(filters).some(f => f !== 'all') || searchQuery) && (
                <Button
                  variant="outline"
                  onClick={onClearFilters}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        )
      }

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-700">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-300 uppercase bg-gray-900">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 border-b border-primary">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={columns.length} className="px-3 py-2 text-center bg-gray-900">
                    <Skeleton className="w-full h-10" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center bg-gray-900">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}
                  className="bg-transparent border-b border-primary hover:bg-card/80 transition-colors"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, index) => (
                    <td key={index} className="px-6 py-4">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange?.(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {renderPaginationItems()}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange?.(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}