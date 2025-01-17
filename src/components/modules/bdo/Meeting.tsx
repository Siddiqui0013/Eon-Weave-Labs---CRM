import { Video, Calendar, Ban } from 'lucide-react';
import DataTable from "@/components/common/DataTable";
import CreateScheduleDialog from "./CreateSchedule";
import { useGetMeetingsByUserQuery } from '@/services/salesApi';
import Card from "../../common/Card";
import { useState } from "react";

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

interface FetchDataResponse<T> {
  data: T[];
  total: number;
}

export default function Meeting() {

  const cardData = [
    {
      icon: <Video />,
      title: "No. of meetings",
      val: "20"
    },
    {
      icon: <Calendar />,
      title: "Rescheduled Meetings",
      val: "10"
    },
    {
      icon: <Ban />,
      title: "Cancelled Meetings",
      val: "5"
    }
  ]

  interface Column<T> {
    key: any;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
  }

  const columns: Column<Meeting>[] = [
    { key: 'projectName', label: 'Project Name' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'clientEmail', label: 'Client Email' },
    {
      key: 'meetingLink',
      label: 'Meeting Link',
      render: (value: string) => <a href={value} className="font-medium">{value}</a>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Active'
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
      key: 'scheduleDate',
      label: 'Schedule Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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

  const handleEdit = (row: Meeting) => {
    console.log('Edit:', row);
  };

  const handleDelete = (row: Meeting) => {
    console.log('Delete:', row);
  };

  const [page, setPage] = useState(1);
  const { data: response, isLoading } = useGetMeetingsByUserQuery({
    page,
    limit: 5
  });

  const fetchTableData = async (): Promise<FetchDataResponse<Meeting>> => {
    return {
      data: response?.data?.meetings || [],
      total: response?.data?.pagination?.total || 0
    };
  };

  return (
    <div>
      <div className="grid lg:grid-cols-3 grid-cols-2 mt-20 md:m-0 p-2 md:p-0 gap-5">
        {cardData.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </div>

      <div className="mt-7">
        <div className="flex justify-end w-[95%] md:w-full my-4">
          <CreateScheduleDialog />
        </div>
        <DataTable<Meeting>
          columns={columns}
          fetchData={fetchTableData}
          itemsPerPage={5}
          searchPlaceholder="Search..."
          onDelete={handleDelete}
          onRowClick={(row) => {
            console.log('Row clicked:', row);
            // nav(`/bdo/sales-report/view`);
          }}
          onEdit={handleEdit}
        />

      </div>
    </div>
  )
}
