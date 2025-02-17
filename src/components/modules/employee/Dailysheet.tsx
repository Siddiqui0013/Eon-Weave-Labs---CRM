import ReusableTable from "@/components/common/Table";
import { useState } from "react";
import { useGetEmployeeWorksheetsByUserQuery } from "@/services/EmployeeWorksheetApi";

interface DailySheetData {
  createdAt: string ;
  projectNo: string;
  totalKpi: number;
  completedKpi: number;
  pendingKpi: number;
  comment: string;
}

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export default function Calls() {

  const [currentPage, setCurrentPage] = useState(1);
  const { data: response, isLoading } = useGetEmployeeWorksheetsByUserQuery({
    page: currentPage,
    limit: 10,
  });

  const columns: Column<DailySheetData>[] = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: string | number) => new Date(value).toLocaleDateString()
    },
    { key: 'projectNo', label: 'Project Number' },
    { key: 'totalKpi', label: 'KPIs' },
    { key: 'completedKpi', label: 'Completed KPIs' },
    { key: 'pendingKpi', label: 'Pending KPIs' },
    { key: 'comment', label: 'Comments' }
  ];

  return (
    <div className="w-[370px] md:w-full md:mt-8 mt-20 overflow-auto">
        <ReusableTable
          columns={columns}
          data={response?.data?.worksheet || []}
          isLoading={isLoading}
          totalPages={response?.data?.pagination?.totalPages || 1}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
    </div>
  )
}
