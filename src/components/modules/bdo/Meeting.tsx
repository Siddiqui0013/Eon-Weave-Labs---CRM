import { Video, Calendar, Ban } from 'lucide-react';
import CreateScheduleDialog from "./CreateSchedule";
import Card from "../../common/Card";
// import { Skeleton } from '@/components/ui/skeleton';
import MeetingsTable from './MeetingsTable';
import { useState } from 'react';


export default function Meeting() {

  const [ totalMeetings, setTotalMeetings ] = useState("0");
  
  const handleTotalMeetingsChange = (total: string) => {
    setTotalMeetings(total);
};

  const cardData = [
    {
      icon: <Video />,
      title: "No. of meetings",
      val: totalMeetings
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
        <MeetingsTable onTotalChange={handleTotalMeetingsChange} />
      </div>
    </div>
  )
}
