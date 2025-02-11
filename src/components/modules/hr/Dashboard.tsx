import useAuth from "@/hooks/useAuth";
import TopButtons from "@/components/common/TopButtons";
import { Crosshair, CircleCheck, CircleDollarSign } from "lucide-react";
import Card from "../../common/Card";
import AttendanceTable from "./AttendanceTable";
// import AddDailySheet from "./AddDailySheet";

export default function Dashboard() {

	const { user } = useAuth();
	const name = user ? user.name : "";

	return (
		<div className="flex flex-col items-center m-0 p-0 justify-center">
			<div className="top flex w-[100%] md:mt-4 mt-20 my-4 p-0 justify-between">
				<h1 className="text-4xl">Hi , {name} </h1>
				<div className="flex gap-2">

					{/* <AddDailySheet /> */}

					<div className="hidden md:block">
						<TopButtons />
					</div>
				</div>
			</div>

			<div className=" my-4 grid  md:grid-cols-3 grid-cols-2 gap-5 grid-flow-row w-[100%]">
				<Card data={{ icon: <Crosshair />, title: "Total Employees", val: "30" }} />
				<Card data={{ icon: <CircleCheck />, title: "Present Employees", val: "22" }} />
				<Card
					data={{
						icon: <CircleDollarSign />,
						title: "Absent Employees",
						val: "3",
					}}
				/>
			</div>

			<div className="mt-3 flex gap-4 w-[100%] flex-col md:flex-row">
				<div className="w-full md:w-[30%]">
				</div>
			</div>
			<div className="w-full">
				<AttendanceTable />
			</div>
		</div>
	);
}
