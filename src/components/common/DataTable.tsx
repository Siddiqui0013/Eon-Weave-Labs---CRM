import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from 'lucide-react';

interface Column<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface ActionProps<T> {
    row: T;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    renderActions?: (row: T) => React.ReactNode;
}

interface FetchDataParams {
    page: number;
    search: string;
    limit: number;
}

interface FetchDataResponse<T> {
    data: T[];
    total: number;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    fetchData: (params: FetchDataParams) => Promise<FetchDataResponse<T>>;
    itemsPerPage?: number;
    searchPlaceholder?: string;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    renderActions?: (row: T) => React.ReactNode;
}

function DataTable<T extends Record<string, any>>({
    columns,
    fetchData,
    itemsPerPage = 10,
    searchPlaceholder = "Search...",
    onEdit,
    onDelete,
    renderActions
}: DataTableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await fetchData({
                    page: currentPage,
                    search: searchQuery,
                    limit: itemsPerPage
                });

                setData(response.data);
                setTotalPages(Math.ceil(response.total / itemsPerPage));
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(loadData, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchData, currentPage, searchQuery, itemsPerPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const DefaultActions = ({ row }: ActionProps<T>) => (
        <div className="flex gap-2">
            {onEdit && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(row)}
                    className="border-gray-700 hover:bg-gray-800"
                >
                    Edit
                </Button>
            )}
            {onDelete && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(row)}
                    className="border-gray-700 hover:bg-red-900 text-red-400"
                >
                    Delete
                </Button>
            )}
        </div>
    );

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page
        if (startPage > 1) {
            items.push(
                <PaginationItem key="1">
                    <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
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
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Last page
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
                    <PaginationLink onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    if (error) {
        return (
            <div className="text-red-400 p-4 text-center dark">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 dark">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-8 w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                />
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-700">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className="px-6 py-3 border-b border-gray-700"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-4 text-center bg-gray-900"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-4 text-center bg-gray-900"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={index}
                                    className="bg-gray-900 border-b border-gray-700 hover:bg-gray-800 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className="px-6 py-4"
                                        >
                                            {column.key === 'actions' ? (
                                                renderActions ? renderActions(row) : <DefaultActions row={row} />
                                            ) : column.render ? (
                                                column.render(row[column.key], row)
                                            ) : (
                                                row[column.key]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export default DataTable;