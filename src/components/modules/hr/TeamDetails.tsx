import { useState, useEffect } from "react";
import { useGetAttendenceReportQuery } from "@/services/userApi";
import ReusableTable from "@/components/common/Table";

interface AttendanceData {
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
}
  
interface Column<T> {
	key: keyof T | 'actions';
	label: string;
	render?: (value: T[keyof T], row: T) => React.ReactNode;
  }


const AttendanceCard = () => {
  
  const columns: Column<AttendanceData>[] = [
		{key : 'date', label: 'Date'},
    {key : 'checkIn', label: 'Check In'},
    {key : 'checkOut', label: 'Check Out'},
		{
		  key: 'status',
		  label: 'Status',
		  render: (value: string ) => {
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
		}
	  ];

    const [attendanceData, setAttendanceData] = useState([
      { 
        date: '',
        status: '',
        checkIn: '', 
        checkOut: '' 
      },
    ]);

  const userId = window.location.pathname.split("/")[3];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userDetails, setUserDetails] = useState({ name: "", role: "" });

  useEffect(() => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
    const formatDate = (date : Date) => date.toISOString().split("T")[0];

    setStartDate(formatDate(startOfMonth));
    setEndDate(formatDate(currentDate));
  }, []);

  const { data, isLoading } = useGetAttendenceReportQuery({ userId, startDate, endDate });

  useEffect(() => {
    if (data) {
      console.log("Attendance Report:", data);
      setUserDetails({
        name: data.data.attendance[0]?.userId.name || "N/A",
        role: data.data.attendance[0]?.userId.role || "N/A",
      });
      setAttendanceData(
        data.data.attendance.map((item: { date?: string; status?: string; workHours?: { checkIn?: string; checkOut?: string; } }) => ({
          date: item?.date?.split("T")[0] || "N/A",
          status: item?.status || "N/A",
          checkIn: item?.workHours?.checkIn?.split("T")[1]?.split(".")[0] || "N/A",
          checkOut: item?.workHours?.checkOut?.split("T")[1]?.split(".")[0] || "N/A",
        }))
      );
    }
  }, [data]);

  const stats = data?.data?.stats || {};

  return (
    <div className="bg-gray-800 p-6 md:mt-12 mt-6 rounded-lg text-white">
      <div className="flex items-start gap-6 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
          <img src="/api/placeholder/80/80" className="w-full h-full object-cover" alt="User" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <div className="flex gap-4 items-center mb-2">
                <span className="text-gray-400">Name:</span>
                <span className="font-medium">{userDetails.name}</span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-gray-400">Role:</span>
                <span className="font-medium">{userDetails.role}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <div>
                  <span className="text-gray-400">Present:</span> <span className="font-medium">{stats.presentDays || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Absent:</span> <span className="font-medium">{stats.absentDays || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Leaves:</span> <span className="font-medium">{stats.leaveDays || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Attendance</h2>
          <div>
            <span className="font-medium">{(startDate).slice(5, 10)} - {(endDate.slice(5, 10))}</span>
          </div>
        </div>

        <ReusableTable 
        data={attendanceData} 
        columns={columns} 
        isLoading={isLoading}
        />

      </div>
    </div>
  );
};

export default AttendanceCard;










// import { useState, useEffect } from "react";
// import { useGetAttendenceReportQuery } from "@/services/userApi";

// const AttendanceCard = () => {
//   const userId = window.location.pathname.split("/")[3];
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [userDetails, setUserDetails] = useState({ name: "", role: "" });

//   useEffect(() => {
//     const currentDate = new Date();
//     const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);
//     const formatDate = (date : Date) => date.toISOString().split("T")[0];

//     setStartDate(formatDate(startOfMonth));
//     setEndDate(formatDate(currentDate));
//   }, []);

//   const { data, isLoading } = useGetAttendenceReportQuery({ userId, startDate, endDate });

//   useEffect(() => {
//     if (data) {
//       console.log("Attendance Report:", data);
//       setUserDetails({
//         name: data.data.attendance[0]?.userId.name || "N/A",
//         role: data.data.attendance[0]?.userId.role || "N/A",
//       });
//     }
//   }, [data]);

//   if (isLoading) {
//     return (
//       <div className="bg-gray-800 p-6 w-full h-80 md:mt-12 mt-6 rounded-lg text-white">
//         Loading attendance report...
//       </div>
//     );
//   }

//   const attendanceData = data?.data?.attendance || [];
//   const stats = data?.data?.stats || {};

//   return (
//     <div className="bg-gray-800 p-6 md:mt-12 mt-6 rounded-lg text-white">
//       <div className="flex items-start gap-6 mb-8">
//         <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
//           <img src="/api/placeholder/80/80" className="w-full h-full object-cover" alt="User" />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between">
//             <div>
//               <div className="flex gap-4 items-center mb-2">
//                 <span className="text-gray-400">Name:</span>
//                 <span className="font-medium">{userDetails.name}</span>
//               </div>
//               <div className="flex gap-4 items-center">
//                 <span className="text-gray-400">Role:</span>
//                 <span className="font-medium">{userDetails.role}</span>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="space-y-1">
//                 <div>
//                   <span className="text-gray-400">Present:</span> <span className="font-medium">{stats.presentDays || 0}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-400">Absent:</span> <span className="font-medium">{stats.absentDays || 0}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-400">Leaves:</span> <span className="font-medium">{stats.leaveDays || 0}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Attendance</h2>
//           <div>
//             <span className="font-medium">{(startDate).slice(5, 10)} - {(endDate.slice(5, 10))}</span>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-700">
//             <thead>
//               <tr className="text-gray-400 bg-gray-700">
//                 <th className="py-3 px-4 text-left font-medium">Date</th>
//                 <th className="py-3 px-4 text-left font-medium">Status</th>
//                 <th className="py-3 px-4 text-left font-medium">Check In</th>
//                 <th className="py-3 px-4 text-left font-medium">Check Out</th>
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceData.length > 0 ? (
//                 attendanceData.map((record, index) => (
//                   <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
//                     <td className="py-3 px-4">{record.date.split("T")[0]}</td>
//                     <td className="py-3 px-4">
//                       <span className="px-2 py-1 rounded-full bg-green-900 text-green-300">{record.status}</span>
//                     </td>
//                     <td className="py-3 px-4">{record.workHours.checkIn?.slice(11, 16) || "N/A"}</td>
//                     <td className="py-3 px-4">{record.workHours.checkOut?.slice(11, 16) || "N/A"}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="py-4 text-center text-gray-400">No attendance data available.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceCard;
