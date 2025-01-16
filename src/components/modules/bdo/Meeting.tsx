import { FaVideo, FaCalendarAlt } from "react-icons/fa";
import { MdDoNotDisturb } from "react-icons/md";
import DataTable from "@/components/common/DataTable";
// import { Skeleton } from "@/components/ui/skeleton";
import CreateScheduleDialog from "./CreateSchedule";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: string;
}
import Card from "../../common/Card";

export default function Meeting() {

  const cardData = [
    {
      icon: <FaVideo />,
      title: "No. of meetings",
      val: "20"
    },
    {
      icon: <FaCalendarAlt />,
      title: "Rescheduled Meetings",
      val: "10"
    },
    {
      icon: <MdDoNotDisturb />,
      title: "Cancelled Meetings",
      val: "5"
    }
  ]
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'active'
          ? 'bg-green-900 text-green-300'
          : 'bg-red-900 text-red-300'
          }`}>
          {value}
        </span>
      )
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const fetchData = async ({ page, search, limit }: { page: number; search: string; limit: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUsers: User[] = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Administrator",
        status: "active",
        lastActive: "2024-01-15T10:30:00"
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Editor",
        status: "active",
        lastActive: "2024-01-14T15:45:00"
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike.j@example.com",
        role: "User",
        status: "inactive",
        lastActive: "2024-01-10T09:20:00"
      },
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah.w@example.com",
        role: "Editor",
        status: "active",
        lastActive: "2024-01-15T08:15:00"
      },
      {
        id: 5,
        name: "Tom Brown",
        email: "tom.b@example.com",
        role: "User",
        status: "inactive",
        lastActive: "2024-01-13T16:30:00"
      },
      {
        id: 6,
        name: "Emily Davis",
        email: "emily.d@example.com",
        role: "Administrator",
        status: "active",
        lastActive: "2024-01-15T11:45:00"
      },
      {
        id: 7,
        name: "Chris Anderson",
        email: "chris.a@example.com",
        role: "User",
        status: "active",
        lastActive: "2024-01-14T14:20:00"
      },
      {
        id: 8,
        name: "Lisa Moore",
        email: "lisa.m@example.com",
        role: "Editor",
        status: "active",
        lastActive: "2024-01-15T09:10:00"
      }
    ];

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
  };

  return (
    <div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        {cardData.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </div>

      {/* <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
        {cardData.map((_, index) => (
          <Skeleton key={index} className="min-w-60 min-h-24" />
        ))}
      </div> */}

      <div className="mt-7">
        <div className="flex justify-end w-full my-4">
          <CreateScheduleDialog />
        </div>
        <DataTable<User> columns={columns} fetchData={fetchData} itemsPerPage={5} searchPlaceholder="Search..." />
      </div>

    </div>
  )
}
