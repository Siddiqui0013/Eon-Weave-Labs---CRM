import useAuth from "@/hooks/useAuth";
import TopButtons from "@/components/common/TopButtons";
import { Crosshair, CircleCheck, CircleDollarSign, CircleOff, CheckCheck } from "lucide-react";
import avatar from "../../../assets/avatar.svg";
import Card from "../../common/Card";
import { BarChartCard } from "@/components/common/BarChart";
import AddDailySheet from "./AddDailySheet";
import { useGetCallsByUserQuery } from "@/services/callsApi";
import { useSalesAnalyticsQuery, useGetLeaderboardQuery } from "@/services/salesApi";
import { useUserAttendenceQuery } from "@/services/userApi";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

	const [isCheckedIn, setIsCheckedIn] = useState(false);
	const { data: userAttendance } = useUserAttendenceQuery({});
    
	useEffect(() => {

		if (response?.data?.calls?.length > 0) {
			const latestCall = response.data.calls[0];
			console.log(response.data);

			/* Worksheet once logic */
			const latestCallDate = new Date(response.data.calls[0].createdAt)
				.toISOString()
				.split("T")[0];
			setTodayUpdate(latestCallDate);

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
		}

		setIsCheckedIn( userAttendance?.success && userAttendance?.data?.workHours?.checkIn &&
			!userAttendance?.data?.workHours?.checkOut )

	}, [response, userAttendance]);

	const { user } = useAuth();
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

	const { data: analyticsRes, isLoading } = useSalesAnalyticsQuery({})
	const analytics = analyticsRes?.data || {}

	const { data: leaderboardRes } = useGetLeaderboardQuery({})
	const leaderboard = leaderboardRes?.data || []

	interface person {
		userDetails: { name: string, profileImage: string };
		totalAmount: number;
	}
	const TopSalesPerson = ({ person }: { person: person }) => (
		<div className="flex flex-col items-center mb-8">
			<h2 className="text-xl mb-4">Most Sales</h2>
			<div className="relative mb-2">
				<img
					src={person.userDetails.profileImage ?? avatar}
					alt={person.userDetails.name}
					className="w-24 h-24 rounded-full bg-yellow-300"
				/>
				<div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
					👑
				</div>
			</div>
			<p className="font-medium text-lg">{person.userDetails.name}</p>
			<p className="text-xl font-bold">{`$${person.totalAmount}`}</p>
		</div>
	);

	const SalesPersonListItem = ({ person }: { person: person }) => (
		<div className="flex items-center gap-3 bg-white rounded-full p-2 mb-2 shadow-sm">
			<img
				src={person.userDetails.profileImage ?? avatar}
				alt={person.userDetails.name}
				className="w-10 h-10 rounded-full"
			/>
			<div className="flex justify-around w-full">
				<span className="font-medium">{person.userDetails.name}</span>
				<span className="font-bold">{`$${person.totalAmount}`}</span>
			</div>
		</div>
	);

	return (
		<div className="flex flex-col items-center m-0 p-0 justify-center">
			<div className="top flex w-[100%] md:mt-4 mt-20 my-4 p-0 justify-between">
				<h1 className="text-4xl">Hi , {name} </h1>
				<div className="flex gap-2">
					{ todayUpdate !== new Date().toISOString().split("T")[0] && isCheckedIn && 
						<AddDailySheet />
					}

					{/* <AddDailySheet /> */}

					<div className="hidden md:block">
						<TopButtons />
					</div>
				</div>
			</div>

			{isLoading ? (
				<div className="my-4 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-5 grid-flow-row w-full">
					{Array.from({ length: 5 }).map((_, index) => (
						<Skeleton key={index} className="h-24 w-full" />
					))}
				</div>
			) : (
				<div className="my-4 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-5 grid-flow-row w-[100%]">
					<Card data={{ icon: <Crosshair />, title: "Target", val: callsDetails.target }} />
					<Card data={{ icon: <CircleCheck />, title: "Leads", val: callsDetails.leads }} />
					<Card
						data={{
							icon: <CircleDollarSign />,
							title: "Overall Payment",
							val: `$${analytics?.totalAmount || 0}`,
						}}
					/>
					<Card
						data={{ icon: <CheckCheck />, title: "Payment Approved", val: `$${analytics?.approvedAmount || 0}` }}
					/>
					<Card
						data={{ icon: <CircleOff />, title: "Payment Pending", val: `$${analytics?.pendingAmount || 0}` }}
					/>
				</div>
			)}

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
					{leaderboard?.length > 0 ? (
						<div className=" bg-card rounded-lg flex flex-col justify-between p-2 h-full">
							<TopSalesPerson person={leaderboard[0]} />
							<div className="space-y-2 mb-12 text-black">
								{leaderboard.slice(1).map((person: person, index: number) => (
									<SalesPersonListItem key={index} person={person} />
								))}
							</div>
						</div>
					) : (
						<div className=" bg-card rounded-lg flex flex-col justify-center items-center p-2 h-full">
							<h1 className="text-2xl font-bold">No Sales Found</h1>
						</div>
					)}

				</div>
			</div>
		</div>
	);
}
