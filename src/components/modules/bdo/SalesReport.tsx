import { useNavigate } from "react-router";
import Button from "@/components/common/Button";
import ReusableTable from '../../common/Table';
import { useGetSalesByUserQuery } from "@/services/salesApi";
import { useDebounce } from '@/hooks/useDebounce';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Milestone {
  _id: string;
  name: string;
  amount: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Sale {
  _id: string;
  projectName: string;
  clientName: string;
  totalAmount: string;
  milestones: Milestone[];
  status: 'Active' | 'Cancelled' | 'Pending';
  createdAt: string;
}

export default function SalesReport() {
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    createdAt: 'all'
  });

  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(searchQuery, 500);

  const dateFilters = useMemo(() => {
    return [
      { label: 'Today', value: new Date().toISOString() },
      { label: 'Last 7 days', value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { label: 'Last 30 days', value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    ];
  }, []);

  const { data: response, isLoading } = useGetSalesByUserQuery({
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
        { label: 'Completed', value: 'Completed' }
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
    // return `${count} ${count === 1 ? 'milestone' : 'milestones'}`;
  }
},    {
      key: 'status',
      label: 'Status',
      render: (value: Sale['status']) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active'
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
            onClick={() => handleEdit(row)}
          />
          <Trash2
            className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-300 transition-colors"
            onClick={() => handleDelete(row)}
          />
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
    // nav(`/bdo/sales-report/edit/${row._id}`);
  };

  const handleDelete = (row: Sale) => {
    console.log('Delete:', row);
  };

  const rowClick = (row: Sale) => {
    console.log('Row clicked:', row);
  }

  useEffect(() => {
    if (response?.data?.sales) {
      console.log('Sales data:', response.data.sales);
    }
  }, [response]);

  return (
    <div className="md:mt-8 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-200">Sales Report</h1>
        <Button 
          title="Add New Sale" 
          onClick={() => nav('/bdo/sales-report/add')} 
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
    </div>
  );
}









// import { useNavigate } from "react-router";
// import DataTable from "@/components/common/DataTable";
// import Button from "@/components/common/Button";
// // import { useGetSalesByUserQuery } from "@/services/salesApi";

// interface SalesReportData {
//   projectName: string;
//   customerName: string;
//   projectAmount: string;
//   milestonesCount: number;
//   status: string;
// }

// interface Column<T> {
//   key: keyof T | 'actions';
//   label: string;
//   render?: (value: T[keyof T], row: T) => React.ReactNode;
// }

// export default function SalesReport() {

//    const nav = useNavigate();

//   const columns: Column<SalesReportData>[] = [
//     { key: 'projectName', label: 'Project Name' },
//     { key: 'customerName', label: 'Customer Name' },
//     { key: 'projectAmount', label: 'Project Amount' },
//     { key: 'milestonesCount', label: 'Number of Milestones' },
//     { key: 'status', label: 'Status' },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (_, row) => (
//         <div className="flex gap-2">
//           <button 
//             onClick={() => handleEdit(row)}
//           >
//           </button>
//           <button 
//             onClick={() => handleDelete(row)}
//           >
//           </button>
//         </div>
//       )
//     }
//   ];

//   const handleEdit = (row: SalesReportData) => {
//     console.log('Edit:', row);
//   };

//   const handleDelete = (row: SalesReportData) => {
//     console.log('Delete:', row);
//   };

//   const fetchData = async ({ page, search, limit }: { page: number; search: string; limit: number }) => {
//     await new Promise(resolve => setTimeout(resolve, 500));

//     const mockData: SalesReportData[] = [
//       {
//         projectName: "E-commerce Platform",
//         customerName: "Tech Solutions Inc",
//         projectAmount: "$50,000",
//         milestonesCount: 5,
//         status: "In Progress"
//       },
//       {
//         projectName: "Mobile App Development",
//         customerName: "Digital Innovations",
//         projectAmount: "$75,000",
//         milestonesCount: 4,
//         status: "Pending"
//       }
//     ];

//     const filteredData = mockData.filter(item =>
//       Object.values(item).some(value =>
//         value.toString().toLowerCase().includes(search.toLowerCase())
//       )
//     );

//     const startIndex = (page - 1) * limit;
//     const endIndex = startIndex + limit;
//     const paginatedData = filteredData.slice(startIndex, endIndex);

//     return {
//       data: paginatedData,
//       total: filteredData.length
//     };
//   };

//   return (
//     <div className="md:mt-8 mt-20">

//       <Button title="Add New Sale" onClick={() => nav('/bdo/sales-report/add')} className="mb-4 items-end" />

//       <div className="w-[370px] md:w-full overflow-auto">
//       <DataTable<SalesReportData> 
//         columns={columns} 
//         showSearch={true} 
//         fetchData={fetchData} 
//         searchPlaceholder="Search Projects..." 
//         onDelete={handleDelete}
//         onRowClick={(row) => {
//           console.log('Row clicked:', row);
//           // nav(`/bdo/salesReport/${row.projectName}`);
//           nav(`/bdo/sales-report/view`);
//         }}
//         onEdit={handleEdit}
//       />
//       </div>

//     </div>
//   );
// }