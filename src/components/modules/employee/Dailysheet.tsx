import ReusableTable from "@/components/common/Table";
import { useState } from "react";
// import { useGetCallsByUserQuery } from "@/services/callsApi";

interface DailySheetData {
  createdAt: string ;
  project : string;
  kpis: string;
  completedKpis: string;
  pendingKpis: string;
  comment: string;
}

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export default function Calls() {

  const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const { data: response, isLoading } = useGetCallsByUserQuery({
//     page: currentPage,
//     limit: itemsPerPage,
//   });

  const demoData: DailySheetData[] = [
    {
      createdAt: '2023-08-01',
      project: 'Project 1',
      kpis: 'KPI 1',
      completedKpis: 'Completed KPI 1',
      pendingKpis: 'Pending KPI 1',
      comment: 'Comment 1',
    },
    {
      createdAt: '2023-08-02',
      project: 'Project 2',
      kpis: 'KPI 2',
      completedKpis: 'Completed KPI 2',
      pendingKpis: 'Pending KPI 2',
      comment: 'Comment 2',
  }]


  const columns: Column<DailySheetData>[] = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: string | number) => new Date(value).toLocaleDateString()
    },
    { key: 'project', label: 'Project' },
    { key: 'kpis', label: 'KPIs' },
    { key: 'completedKpis', label: 'Completed KPIs' },
    { key: 'pendingKpis', label: 'Pending KPIs' },
    { key: 'comment', label: 'Comments' }
  ];

  return (
    <div className="w-[370px] md:w-full md:mt-8 mt-20 overflow-auto">
        <ReusableTable
          columns={columns}
          data={demoData}
        //   data={response?.data?.calls || []}
        //   isLoading={isLoading}
        //   totalPages={response?.data?.pagination?.totalPages || 1}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
    </div>
  )
}
