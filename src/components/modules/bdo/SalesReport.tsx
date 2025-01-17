import { useNavigate } from "react-router";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/common/Button";

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

  const columns: Column<SalesReportData>[] = [
    { key: 'projectName', label: 'Project Name' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'projectAmount', label: 'Project Amount' },
    { key: 'milestonesCount', label: 'Number of Milestones' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(row)}
          >
          </button>
          <button 
            onClick={() => handleDelete(row)}
          >
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

  const fetchData = async ({ page, search, limit }: { page: number; search: string; limit: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockData: SalesReportData[] = [
      {
        projectName: "E-commerce Platform",
        customerName: "Tech Solutions Inc",
        projectAmount: "$50,000",
        milestonesCount: 5,
        status: "In Progress"
      },
      {
        projectName: "Mobile App Development",
        customerName: "Digital Innovations",
        projectAmount: "$75,000",
        milestonesCount: 4,
        status: "Pending"
      },
      {
        projectName: "Website Redesign",
        customerName: "Creative Agency",
        projectAmount: "$30,000",
        milestonesCount: 3,
        status: "Completed"
      },
      {
        projectName: "CRM Integration",
        customerName: "Business Solutions Ltd",
        projectAmount: "$45,000",
        milestonesCount: 6,
        status: "In Progress"
      },
      {
        projectName: "Analytics Dashboard",
        customerName: "Data Corp",
        projectAmount: "$60,000",
        milestonesCount: 4,
        status: "Pending"
      },
      {
        projectName: "Cloud Migration",
        customerName: "Enterprise Systems",
        projectAmount: "$90,000",
        milestonesCount: 7,
        status: "In Progress"
      }
    ];

    const filteredData = mockData.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: filteredData.length
    };
  };

  return (
    <div className="md:mt-8 mt-20">

      <Button title="Add New Sale" onClick={() => nav('/bdo/sales-report/add')} className="mb-4 items-end" />

      <div className="w-[370px] md:w-full overflow-auto">
      <DataTable<SalesReportData> 
        columns={columns} 
        showSearch={true} 
        fetchData={fetchData} 
        searchPlaceholder="Search Projects..." 
        onDelete={handleDelete}
        onRowClick={(row) => {
          console.log('Row clicked:', row);
          // nav(`/bdo/salesReport/${row.projectName}`);
          nav(`/bdo/sales-report/view`);
        }}
        onEdit={handleEdit}
      />
      </div>

    </div>
  );
}