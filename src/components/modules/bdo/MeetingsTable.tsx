import { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Search, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger,SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useGetMeetingsByUserQuery } from "@/services/meetingApi"
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';

interface Meeting {
    _id: string;
    clientName: string;
    clientEmail: string;
    projectName: string;
    meetingLink: string;
    status: string;
    scheduleDate: string;
    description: string;
}

interface FilterOptions {
    status: string;
    createdAt: string;
}

interface MeetingProps {
    onTotalChange : (total: string) => void
}

export default function MeetingsTable( { onTotalChange } : MeetingProps) {
    const [data, setData] = useState<Meeting[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<FilterOptions>({
        status: 'all',
        createdAt: 'all'
    });
    const itemsPerPage = 5;

    const debouncedSearch = useDebounce(searchQuery, 500);

    const dateFilters = useMemo(() => {
        return [
            { label: 'Today', value: new Date().toISOString() },
            { label: 'Last 7 days', value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
            { label: 'Last 30 days', value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        ];
    }, []);

    const { data: response, isLoading } = useGetMeetingsByUserQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        status: filters.status === 'all' ? undefined : filters.status,
        createdAt: filters.createdAt === 'all' ? undefined : filters.createdAt
    });

    useEffect(() => {
        if (response?.data) {
            setData(response.data.meetings);
            setTotalPages(response.data.pagination.totalPages);
            onTotalChange (response.data.pagination.total);
        }
    }, [response, onTotalChange]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (key: keyof FilterOptions, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ status: 'all', createdAt: 'all' });
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleEdit = (row: Meeting) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: Meeting) => {
        console.log('Delete:', row);
    };

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

    return (
        <div className="w-full space-y-4 dark">

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search meetings..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-8 w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-2">
                    <Select
                        value={filters.status}
                        onValueChange={(value) => handleFilterChange('status', value)}
                    >
                        <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-gray-100">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.createdAt}
                        onValueChange={(value) => handleFilterChange('createdAt', value)}
                    >
                        <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-gray-100">
                            <SelectValue placeholder="Date" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="all">All Time</SelectItem>
                            {dateFilters.map(filter => (
                                <SelectItem key={filter.label} value={filter.value}>
                                    {filter.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {(filters.status || filters.createdAt || searchQuery) && (
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="bg-gray-800 border-gray-700 text-gray-100"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-700">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 border-b border-gray-700">Project Name</th>
                            <th className="px-6 py-3 border-b border-gray-700">Client Name</th>
                            <th className="px-6 py-3 border-b border-gray-700">Client Email</th>
                            <th className="px-6 py-3 border-b border-gray-700">Meeting Link</th>
                            <th className="px-6 py-3 border-b border-gray-700">Status</th>
                            <th className="px-6 py-3 border-b border-gray-700">Schedule Date</th>
                            <th className="px-6 py-3 border-b border-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index}>
                                    <td colSpan={7} className="px-3 py-2 text-center bg-gray-900">
                                        <Skeleton className="w-full h-10" />
                                    </td>
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center bg-gray-900">
                                    No meetings found
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row._id} className="bg-gray-900 border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4">{row.projectName}</td>
                                    <td className="px-6 py-4">{row.clientName}</td>
                                    <td className="px-6 py-4">{row.clientEmail}</td>
                                    <td className="px-6 py-4">
                                        <a href={row.meetingLink} className="font-medium">{row.meetingLink}</a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active'
                                            ? 'bg-green-900 text-green-300'
                                            : row.status === 'Cancelled'
                                                ? 'bg-red-900 text-red-300'
                                                : 'bg-yellow-900 text-yellow-300'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(row.scheduleDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Edit
                                                className="w-4 h-4 cursor-pointer"
                                                onClick={() => handleEdit(row)}
                                            />
                                            <Trash2
                                                className="w-4 h-4 cursor-pointer text-red-400"
                                                onClick={() => handleDelete(row)}
                                            />
                                        </div>
                                    </td>
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