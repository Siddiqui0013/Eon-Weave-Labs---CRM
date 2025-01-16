import DataTable from "@/components/common/DataTable";

interface CallsData {
  date: string | number;
  target: string;
  totalCalls: string;
  connectedCalls: string;
  leads: string;
  comments: string;
}

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}
export default function Calls() {

  const columns: Column<CallsData>[] = [
    {
      key: 'date',
      label: 'Date',
      render: (value: string | number) => new Date(value).toLocaleDateString()
    },
    { key: 'target', label: 'Target' },
    { key: 'totalCalls', label: 'Total Calls' },
    { key: 'connectedCalls', label: 'Connected Calls' },
    { key: 'leads', label: 'Leads' },
    { key: 'comments', label: 'Comments' }
  ];

  const fetchData = async ({ page, search, limit }: { page: number; search: string; limit: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUsers: CallsData[] = [
      {
        date: "2024-01-15T10:30:00",
        target : "100",
        totalCalls: "20",
        connectedCalls: "10",
        leads: "5",
        comments: "this is a comment, with a very good day. "
      },
      {
        date: "2024-01-15T10:30:00",
        target : "100",
        totalCalls: "20",
        connectedCalls: "10",
        leads: "5",
        comments: "Good"
      },
      {
        date: "2024-01-15T10:30:00",
        target : "100",
        totalCalls: "20",
        connectedCalls: "10",
        leads: "5",
        comments: "Good"
      },
      {
        date: "2024-01-15T10:30:00",
        target : "100",
        totalCalls: "20",
        connectedCalls: "10",
        leads: "5",
        comments: "Good"
      },
      {
        date: "2024-01-15T10:30:00",
        target : "100",
        totalCalls: "20",
        connectedCalls: "10",
        leads: "5",
        comments: "Good"
      },
      {
        date: "2024-01-15T10:30:00",
        target : "100",
        totalCalls: "20",
        connectedCalls: "10",
        leads: "5",
        comments: "Good"
      },
    ]

    const filteredUsers = mockUsers.filter(user =>
      Object.values(user).some(value =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      total: filteredUsers.length
    };
  }

  return (
    <div className="mt-8">
     <DataTable<CallsData> columns={columns} showSearch ={false} fetchData={fetchData} itemsPerPage={15} searchPlaceholder="Search..." />
    </div>
  )
}
