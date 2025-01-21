import { Video, Calendar, Ban } from 'lucide-react';
import { useState, useMemo } from 'react';
import CreateScheduleDialog from "./CreateSchedule";
import Card from "../../common/Card";
import ReusableTable from '../../common/Table';
import { useGetMeetingsByUserQuery, useMeetingAnalyticsQuery } from "@/services/meetingApi";
import { useDebounce } from '@/hooks/useDebounce';
import { Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

export default function Meeting() {

  interface Meeting { 
    projectName: string; 
    clientName: string; 
    clientEmail: string; 
    meetingLink: string; 
    status: string; 
    scheduleDate: string; 
  }
  
  const [totalMeetings, setTotalMeetings] = useState("0");
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

  const { data: response, isLoading } = useGetMeetingsByUserQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    status: filters.status === 'all' ? undefined : filters.status,
    createdAt: filters.createdAt === 'all' ? undefined : filters.createdAt
  });

  
  useEffect(() => {
    if (response) {
      setTotalMeetings(response.data.pagination.total);
      // console.log(response.data.meetings);
    }
  }, [response]);
  

  const filterOptions = {
    status: {
      placeholder: 'Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'Pending', value: 'Pending' }
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

  const columns = [
    { key: 'projectName', label: 'Project Name' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'clientEmail', label: 'Client Email' },
    { 
      key: 'meetingLink', 
      label: 'Meeting Link',
      render: (value: string) => (
        <a href={value} className="font-medium">{value}</a>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
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
      key: 'scheduleDate',
      label: 'Schedule Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: unknown, row: Meeting) => (
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <Edit
            className="w-4 h-4 cursor-pointer"
            onClick={() => handleEdit(row)}
          />
          <Trash2
            className="w-4 h-4 cursor-pointer text-red-400"
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

  const handleEdit = (row: Meeting) => {
    console.log('Edit:', row);
  };

  const handleDelete = (row: Meeting ) => {
    console.log('Delete:', row);
  };

  const rowClick = (row: Meeting) => {
    console.log('Row clicked:', row);
  }

  const [cardData, setCardData] = useState([
    {
      icon: <Video />,
      title: "No. of meetings",
      val: totalMeetings
    },
    {
      icon: <Calendar />,
      title: "Completed Meetings",
      val: "0"
    },
    {
      icon: <Ban />,
      title: "Cancelled Meetings",
      val: "0"
    }
  ]);

  const {data: analyticsRes, isLoading: analyticsLoading} = useMeetingAnalyticsQuery({});
  const analytics = analyticsRes?.data || {};

  useEffect(() => {
    if (analyticsRes) {
      setCardData([
        {
          icon: <Video />,
          title: "No. of meetings",
          val: analytics.totalMeetings || "0"
        },
        {
          icon: <Calendar />,
          title: "Completed Meetings",
          val: analytics.statusWiseCounts?.Completed || "0"
        },
        {
          icon: <Ban />,
          title: "Cancelled Meetings",
          val: analytics.statusWiseCounts?.Cancelled || "0"
        }
      ]);
    }
  }, [analyticsRes]);

  return (
    <div>
      
      {analyticsLoading ? (
        <div className="grid lg:grid-cols-3 grid-cols-2 mt-20 md:m-0 p-2 md:p-0 gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className='h-20 md:min-w-48 w-full' />
          ))}
        </div>
      ) : (
      <div className="grid lg:grid-cols-3 grid-cols-2 mt-20 md:m-0 p-2 md:p-0 gap-5">
        {cardData.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </div>
      )}

      <div className="mt-7">
        <div className="flex justify-end w-[95%] md:w-full my-4">
          <CreateScheduleDialog />
        </div>
        
        <ReusableTable
          columns={columns}
          data={response?.data?.meetings || []}
          isLoading={isLoading}
          totalPages={response?.data?.pagination?.totalPages || 1}
          currentPage={currentPage}
          searchQuery={searchQuery}
          filters={filters}
          filterOptions={filterOptions}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onRowClick={rowClick}
          onPageChange={setCurrentPage}
        />
        
      </div>
    </div>
  );
}








// import { Video, Calendar, Ban } from 'lucide-react';
// import CreateScheduleDialog from "./CreateSchedule";
// import Card from "../../common/Card";
// // import { Skeleton } from '@/components/ui/skeleton';
// import MeetingsTable from './MeetingsTable';
// import { useState } from 'react';


// export default function Meeting() {

//   const [ totalMeetings, setTotalMeetings ] = useState("0");
  
//   const handleTotalMeetingsChange = (total: string) => {
//     setTotalMeetings(total);
// };

//   const cardData = [
//     {
//       icon: <Video />,
//       title: "No. of meetings",
//       val: totalMeetings
//     },
//     {
//       icon: <Calendar />,
//       title: "Rescheduled Meetings",
//       val: "10"
//     },
//     {
//       icon: <Ban />,
//       title: "Cancelled Meetings",
//       val: "5"
//     }
//   ]


//   return (
//     <div>
//       <div className="grid lg:grid-cols-3 grid-cols-2 mt-20 md:m-0 p-2 md:p-0 gap-5">
//         {cardData.map((data, index) => (
//           <Card key={index} data={data} />
//         ))}
//       </div>

//       <div className="mt-7">
//         <div className="flex justify-end w-[95%] md:w-full my-4">
//           <CreateScheduleDialog />
//         </div>
//         <MeetingsTable onTotalChange={handleTotalMeetingsChange} />
//       </div>
//     </div>
//   )
// }
