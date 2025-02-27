import useAuth from "@/hooks/useAuth";
import TopButtons from "@/components/common/TopButtons";
import { Crosshair, CircleCheck, CircleDollarSign } from "lucide-react";
import Card from "../../common/Card";
import ReusableTable from "@/components/common/Table";
import { useAllUserAttendenceQuery } from "@/services/userApi";
import { useEffect, useState } from "react";

interface EmployeeData {
	name : string;
	role : string;
	status : string;
	checkIn : string;
	checkOut : string;
	totalMinutes : number;
}
  
interface Column<T> {
	key: keyof T | 'actions';
	label: string;
	render?: (value: T[keyof T], row: T) => React.ReactNode;
  }

export default function Dashboard() {

	const columns: Column<EmployeeData>[] = [
		{ key: 'name', label: 'Name' },
		{key : 'role', label: 'Role'},
		{
		  key: 'status',
		  label: 'Status',
		  render: (value: string | number) => {
			return (
			  <span
				className={`${
				  value === "Present"
					? "bg-green-500 text-white"
					: "bg-red-500 text-white"
				} py-1 px-2 rounded-full text-xs font-semibold`}
			  >
				{value}
			  </span>
			);
		  }
		},
		{key : "checkIn", label: 'Check In'},
		{key : "checkOut", label: 'Check Out'},
		{key : "totalMinutes", label: 'Total Minutes'}
	  ];

	const { data : response , isLoading } = useAllUserAttendenceQuery({})

	const { user } = useAuth();
	const name = user ? user.name : "";
	const [usersData, setUsersData] = useState([{
		name : "",
		role : "",
		status : "",
		checkIn : "",
		checkOut : "",
		totalMinutes : 0
	}]);
	const [ presentEmployees, setPresentEmployees ] = useState(0);
	const [ totalEmployees, setTotalEmployees ] = useState(0);
	useEffect(() => {
		if (response?.data) {
		//   console.log('Response data:', response.data);
		  setUsersData(
			response.data.attendance.map((user: { userId: { name: string; jobTitle: string }; status: string; workHours: { checkIn: string; checkOut: string; totalMinutes: number; } }) => ({
			  name: user.userId.name ?? "",
			  role: user.userId.jobTitle ?? "",
			  status: user.status ?? "",
			  checkIn: (user?.workHours?.checkIn)?.slice(11,16) || "",
			  checkOut: (user?.workHours?.checkOut)?.slice(11,16) || "",
			  totalMinutes: ((user?.workHours?.totalMinutes) / 60).toFixed(2).replace(".", ":")
			}))
		  )
		  setPresentEmployees((response.data.attendance).length)
		  setTotalEmployees(response.data.totalUsers)
		}
	  }, [response]);

	return (
		<div className="flex flex-col items-center m-0 p-0 justify-center">

			<div className="top flex w-[100%] md:mt-4 mt-20 my-4 p-0 justify-between">
				<h1 className="text-4xl">Hi , {name} </h1>
				<div className="flex gap-2">
					<div className="hidden md:block">
						<TopButtons />
					</div>
				</div>
			</div>

			<div className=" my-4 grid  md:grid-cols-3 grid-cols-2 gap-5 grid-flow-row w-[100%]">
				<Card data={{ icon: <Crosshair />, title: "Total Employees", val: totalEmployees }} />
				<Card data={{ icon: <CircleCheck />, title: "Present Employees", val: presentEmployees }} />
				<Card
					data={{
						icon: <CircleDollarSign />,
						title: "Absent Employees",
						val: totalEmployees - presentEmployees,
					}}
				/>
			</div>

			<div className="w-[370px] md:w-full md:mt-8 mt-20 overflow-auto">
					<ReusableTable
					  columns={columns}
					  data={usersData || []}
					  isLoading={isLoading}
					/>
			</div>

		</div>
	);
}
