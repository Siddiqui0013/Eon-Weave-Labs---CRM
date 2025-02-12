
const AttendanceCard = () => {
  const attendanceData = [
    { date: '1-1-2025', status: 'Present', checkIn: '3:30PM', checkOut: '12:00AM', late: '-', overtime: '-' },
    { date: '1-1-2025', status: 'Present', checkIn: '3:30PM', checkOut: '12:00AM', late: '-', overtime: '-' },
    { date: '1-1-2025', status: 'Present', checkIn: '1:30PM', checkOut: '12:00AM', late: '1 Hour', overtime: '-' },
    { date: '1-1-2025', status: 'Present', checkIn: '3:30PM', checkOut: '2:00AM', late: '-', overtime: '2 Hour' }
  ];

  const userInfo = {
    name: 'Jason Price',
    role: 'Admin',
    email: 'Janice.parisian@yahoo.com',
    leaves: '4',
    nbrOfLate: '2',
    halfDay: '4'
  };

  return (
    <div className="bg-gray-800 p-6 md:mt-12 mt-6 rounded-lg text-white">
      <div className="flex items-start gap-6 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
          <img src="/api/placeholder/80/80" alt="Profile" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-y-2">
            <div>
              <div className="flex gap-4 items-center">
                <span className="text-gray-400">Name</span>
                <span className="font-medium">{userInfo.name}</span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-gray-400">Roll</span>
                <span className="font-medium">{userInfo.role}</span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-gray-400">Email</span>
                <span className="font-medium">{userInfo.email}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1">
                <span className="text-gray-400 mr-2">Leaves :</span>
                <span className="font-medium">{userInfo.leaves}</span>
              </div>
              <div className="mb-1">
                <span className="text-gray-400 mr-2">Nbr of late :</span>
                <span className="font-medium">{userInfo.nbrOfLate}</span>
              </div>
              <div>
                <span className="text-gray-400 mr-2">Half day :</span>
                <span className="font-medium">{userInfo.halfDay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Attendance</h2>
          <div>
            <span className="text-gray-400 mr-2">Month:</span>
            <span className="font-medium">March</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-y border-gray-700">
                <th className="py-3 px-4 text-left font-medium">Date</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Check In</th>
                <th className="py-3 px-4 text-left font-medium">Check Out</th>
                <th className="py-3 px-4 text-left font-medium">Late</th>
                <th className="py-3 px-4 text-left font-medium">Over time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-3 px-4">{record.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-green-900 text-green-300">
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{record.checkIn}</td>
                  <td className="py-3 px-4">{record.checkOut}</td>
                  <td className="py-3 px-4">{record.late}</td>
                  <td className="py-3 px-4">{record.overtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;