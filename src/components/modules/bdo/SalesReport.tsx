import { useNavigate } from "react-router";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";
import { useGetSalesByUserQuery } from "@/services/salesApi";
import { Trash2, Edit } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SalesReportData {
  projectName: string;
  customerName: string;
  projectAmount: string;
  milestonesCount: number;
  status: string;
}

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export default function SalesReport() {
  const nav = useNavigate();
  const searchQuery = '';
  const currentPage = 1;
  const itemsPerPage = 5;

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: response } = useGetSalesByUserQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch
  });

  const columns: Column<SalesReportData>[] = [
    { key: 'projectName', label: 'Project Name' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'projectAmount', label: 'Project Amount' },
    { key: 'milestonesCount', label: 'Number of Milestones' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'In Progress' ? 'bg-blue-900 text-blue-300' :
          value === 'Completed' ? 'bg-green-900 text-green-300' :
          'bg-yellow-900 text-yellow-300'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)}>
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row)}>
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )
    }
  ];

  const handleEdit = (row: SalesReportData) => {
    console.log('Edit:', row);
  };

  const handleDelete = (row: SalesReportData) => {
    console.log('Delete:', row);
  };

  const fetchData = async () => {
    if (response?.data) {
      return {
        data: response.data.sales,
        total: response.data.pagination.total
      };
    }
    return {
      data: [],
      total: 0
    };
  };

  return (
    <div className="md:mt-8 mt-20">
      <Button 
        title="Add New Sale" 
        onClick={() => nav('/bdo/sales-report/add')} 
        className="mb-4 items-end" 
      />

      <div className="w-[370px] md:w-full overflow-auto">
        <DataTable<SalesReportData>
          columns={columns}
          showSearch={true}
          fetchData={fetchData}
          searchPlaceholder="Search Projects..."
          onDelete={handleDelete}
          onRowClick={(row) => {
            console.log('Row clicked:', row);
          }}
          onEdit={handleEdit}
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