import Button from "@/components/common/Button";
import ReusableTable from "@/components/common/Table";
import { useGetAllSalesQuery, useRemoveSaleMutation } from "@/services/salesApi";
import { useDebounce } from '@/hooks/useDebounce';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import UpdateSale from "./UpdateSale";
import AddSaleForm from "./AddSale";
import SaleView from "./SaleView";

interface Milestone {
  _id: string;
  name: string;
  amount: string;
  startDate: string;
  endDate: string;
  description: string;
  status: string;
}

interface Sale {
  _id: string;
  projectName: string;
  clientName: string;
  clientEmail: string,
  description: string,
  startDate: string,
  endDate: string;
  totalAmount: string;
  milestones: Milestone[];
  status: 'Completed' | 'Cancelled' | 'Pending';
  createdAt: string;
}

export default function SalesReport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    createdAt: 'all'
  });
  const { toast } = useToast();

  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(searchQuery, 500);

  const dateFilters = useMemo(() => {
    return [
      { label: 'Today', value: new Date().toISOString() },
      { label: 'Last 7 days', value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { label: 'Last 30 days', value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    ];
  }, []);

  const { data: response, isLoading } = useGetAllSalesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    status: filters.status === 'all' ? undefined : filters.status,
    createdAt: filters.createdAt === 'all' ? undefined : filters.createdAt
  });

  const filterOptions = {
    status: {
      placeholder: 'Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' }
      ]
    },
    createdAt: {
      placeholder: 'Date',
      options: [
        { label: 'All Time', value: 'all' },
        ...dateFilters
      ]
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(amount));
  };

  const columns = [
    { key: 'projectName', label: 'Project Name' },
    { key: 'clientName', label: 'Client Name' },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (value: string) => formatCurrency(value)
    },
    {
      key: 'milestones',
      label: 'Milestones',
      render: (value: Milestone[]) => {
        const count = Array.isArray(value) ? value.length : 0;
        return `${count}`;
      }
    }, {
      key: 'status',
      label: 'Status',
      render: (value: Sale['status']) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Completed'
            ? 'bg-green-900 text-green-300'
            : value === 'Cancelled'
              ? 'bg-red-900 text-red-300'
              : 'bg-yellow-900 text-yellow-300'
          }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, row: Sale) => (
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <Edit
            className="w-4 h-4 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => {
              handleEdit(row)
            }}

          />

          <AlertDialog>
            <AlertDialogTrigger>
              <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently this Sale
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='bg-transparent border border-slate-50 text-white'>Cancel</AlertDialogCancel>
                <AlertDialogAction className='bg-red-700' onClick={() => handleDelete(row)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      )
    }
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ status: 'all', createdAt: 'all' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleEdit = (row: Sale) => {
    console.log('Edit:', row);
    setSaleToEdit(row);
    setIsEditDialogOpen(true);
  };

  const [removeSale] = useRemoveSaleMutation();

  const handleDelete = async (row: Sale) => {
    if (!row) return;
    try {
      const response = await removeSale(row._id);
      console.log('Delete Sale:', response);
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Sale deleted successfully',
        duration: 1500
      })
    } catch (error) {
      console.error('Failed to delete Sale:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete Sale',
        duration: 1500
      })
    }

  };

  const rowClick = (row: Sale) => {
    // console.log('Row clicked:', row);
    setSelectedSale(row);
  }

  useEffect(() => {
    if (response?.data?.sales) {
      console.log('Sales data:', response.data.sales);
    }
  }, [response?.data?.sales]);

  return (
    <div className="md:mt-8 mt-20">
      {selectedSale ? (
        <SaleView sale={selectedSale} />
      ) : (
        <>
          {saleToEdit && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-gray-100">Update Sale</DialogTitle>
                </DialogHeader>
                <UpdateSale
                  sale={saleToEdit}
                  onClose={() => {
                    setIsEditDialogOpen(false);
                    setSaleToEdit(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}

          {isAddDialogOpen && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-gray-100">Add New Sale</DialogTitle>
                </DialogHeader>
                <AddSaleForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-200">Projects</h1>
            <Button
              title="Add New Sale"
              onClick={() => setIsAddDialogOpen(true)}
              className="items-end"
            />
          </div>

          <div className="w-[370px] p-2 md:w-full overflow-auto">
            <ReusableTable
              columns={columns}
              data={response?.data?.sales || []}
              isLoading={isLoading}
              totalPages={response?.data?.pagination?.totalPages || 1}
              currentPage={currentPage}
              searchQuery={searchQuery}
              filters={filters}
              filterOptions={filterOptions}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onPageChange={setCurrentPage}
              onRowClick={rowClick}
            />
          </div>
        </>
      )}
    </div>
  )
}