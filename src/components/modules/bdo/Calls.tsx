import ReusableTable from "@/components/common/Table";
import { useState } from "react";
import { useGetCallsByUserQuery } from "@/services/callsApi";

interface CallsData {
  createdAt: string ;
  target: string;
  totalCalls: string;
  connected: string;
  leads: string;
  comment: string;
}

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export default function Calls() {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: response, isLoading } = useGetCallsByUserQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const columns: Column<CallsData>[] = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: string | number) => new Date(value).toLocaleDateString()
    },
    { key: 'target', label: 'Target' },
    { key: 'totalCalls', label: 'Total Calls' },
    { key: 'connected', label: 'Connected Calls' },
    { key: 'leads', label: 'Leads' },
    { key: 'comment', label: 'Comments' }
  ];

  return (
    <div className="w-[370px] md:w-full md:mt-8 mt-20 overflow-auto">
        <ReusableTable
          columns={columns}
          data={response?.data?.calls || []}
          isLoading={isLoading}
          totalPages={response?.data?.pagination?.totalPages || 1}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
    </div>
  )
}
