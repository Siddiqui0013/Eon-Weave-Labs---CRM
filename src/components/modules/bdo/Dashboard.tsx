import { useSelector } from "react-redux";
import TopButtons from "@/components/common/TopButtons";
import { RootState } from "../../../redux/Store";
import { Crosshair, CircleCheck, CircleDollarSign, CircleOff, CheckCheck } from "lucide-react";
import Card from "../../common/Card";
import { BarChartCard } from "@/components/common/BarChart";
import AddDailySheet from "./AddDailySheet";
import { useGetCallsByUserQuery } from "@/services/callsApi";
import { useState, useEffect } from "react";

interface ChartData {
	createdAt: string;
	connected: number;
	leads: number;
	[key: string]: string | number;
}

interface CallDetails {
  connected: number;
  leads: number;
  day: string;
  target: number;
}

export default function Dashboard() {
	const { data: response } = useGetCallsByUserQuery({
		page: 1,
		limit: 7,
	});

	const [todayUpdate, setTodayUpdate] = useState<string | null>(null);
	const [chartData, setChartData] = useState<ChartData[]>([]);
  const [callsDetails, setCallsDetails] = useState<CallDetails>({
    connected: 0,
    leads: 0,
    target: 0,
    day: ''
  });
  

	useEffect(() => {
		if (response?.data?.calls?.length > 0) {

      const latestCall = response.data.calls[0];
			// const today = new Date().toISOString().split('T')[0];
			const latestCallDate = new Date(response.data.calls[0].createdAt)
				.toISOString()
				.split("T")[0];
			setTodayUpdate(latestCallDate);
      // setCallsDetails(response.data.calls[0]);

      setCallsDetails({
        connected: latestCall.connected,
        leads: latestCall.leads,
        target: latestCall.target,
        day: new Date(latestCall.createdAt).toLocaleDateString()
      });
  

			const transformedData = response.data.calls.map((call: ChartData) => ({
				day: new Date(call.createdAt).toLocaleDateString("en-US", {
					weekday: "short",
				}),
				connected: call.connected,
				leads: call.leads,
			}));

			const sortedData = transformedData.sort(
				(
					a: { day: string | number | Date },
					b: { day: string | number | Date }
				) => new Date(a.day).getTime() - new Date(b.day).getTime()
			);
			setChartData(sortedData);
			// console.log("Sorted Data: ", sortedData);
		}
	}, [response]);

  useEffect(() => {
    console.log("Calls Details: ", callsDetails);
  }, [callsDetails]);

	const { user } = useSelector((state: RootState) => state.user);
	const name = user ? user.name : "";

	const bars = [
		{
			key: "leads",
			label: "Leads",
			color: "hsl(var(--chart-1))",
		},
		{
			key: "connected",
			label: "Connected Calls",
			color: "hsl(var(--chart-2))",
		},
	];

	const salesData = [
		{
			name: "Sarah Martins",
			sales: 50000,
			image: "https://avatar.iran.liara.run/public",
		},
		{
			name: "Mimi Martins",
			sales: 45000,
			image: "https://avatar.iran.liara.run/public",
		},
		{
			name: "Yogi Nu",
			sales: 42000,
			image: "https://avatar.iran.liara.run/public",
		},
		{
			name: "Akin Pianola",
			sales: 38000,
			image: "https://avatar.iran.liara.run/public",
		},
	];

	interface person {
		name: string;
		sales: number;
		image: string;
	}

	const TopSalesPerson = ({ person }: { person: person }) => (
		<div className="flex flex-col items-center mb-8">
			<h2 className="text-xl mb-4">Most Sales</h2>
			<div className="relative mb-2">
				<img
					src={person.image}
					alt={person.name}
					className="w-24 h-24 rounded-full bg-yellow-300"
				/>
				<div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
					👑
				</div>
			</div>
			<p className="font-medium text-lg">{person.name}</p>
			<p className="text-xl font-bold">{person.sales.toLocaleString()}</p>
		</div>
	);

	const SalesPersonListItem = ({ person }: { person: person }) => (
		<div className="flex items-center gap-3 bg-white rounded-full p-2 mb-2 shadow-sm">
			<img
				src={person.image}
				alt={person.name}
				className="w-10 h-10 rounded-full"
			/>
			<div className="flex justify-around w-full">
				<span className="font-medium">{person.name}</span>
				<span className="font-bold">{person.sales.toLocaleString()}</span>
			</div>
		</div>
	);

	const sortedData = [...salesData].sort((a, b) => b.sales - a.sales);
	const topPerson = sortedData[0];
	const otherPeople = sortedData.slice(1);

	return (
		<div className="flex flex-col items-center m-0 p-0 justify-center">
			<div className="top flex w-[100%] md:mt-4 mt-20 my-4 p-0 justify-between">
				<h1 className="text-4xl">Hi , {name} </h1>
				<div className="flex gap-2">
					{todayUpdate !== new Date().toISOString().split("T")[0] && (
						<AddDailySheet />
					)}

					{/* <AddDailySheet /> */}

					<div className="hidden md:block">
						<TopButtons />
					</div>
				</div>
			</div>

			<div className=" my-4 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-5 grid-flow-row w-[100%]">
				<Card data={{ icon: <Crosshair />, title: "Target", val: callsDetails.target }} />
				<Card data={{ icon: <CircleCheck />, title: "Leads", val: callsDetails.leads }} />
				<Card
					data={{
						icon: <CircleDollarSign />,
						title: "Overall Payment",
						val: "30k",
					}}
				/>
				<Card
					data={{ icon: <CheckCheck />, title: "Payment Approved", val: "20k" }}
				/>
				<Card
					data={{ icon: <CircleOff />, title: "Payment Pending", val: "10k" }}
				/>
			</div>

			<div className="mt-8 flex gap-4 w-[100%] flex-col md:flex-row">
				<div className="bg-card md:w-[70%] w-full rounded-lg">
					<BarChartCard
						// data={dataChart}
						data={chartData}
						title="Weekly Calls Report"
						description="Total calls made by the You"
						xAxisKey="day"
						bars={bars}
						className="bg-card text-white border-none"
						// trendPercentage={5.2}
						// footerText="Showing total visitors for the last 6 months"
					/>
				</div>

				<div className="w-full md:w-[30%]">
					<div className=" bg-card rounded-lg flex flex-col justify-between p-2 h-full">
						<TopSalesPerson person={topPerson} />
						<div className="space-y-2 mb-12 text-black">
							{otherPeople.map((person, index) => (
								<SalesPersonListItem key={index} person={person} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
