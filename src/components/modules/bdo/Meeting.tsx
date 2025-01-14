import { FaVideo, FaCalendarAlt } from "react-icons/fa";
import { MdDoNotDisturb } from "react-icons/md";

export default function Meeting() {

  const cardData = [
    {
      icon: <FaVideo />,
      title: "No. of meetings",
      val: 20
    },
    {
      icon: <FaCalendarAlt />,
      title: "Rescheduled Meetings",
      val: 10
    },
    {
      icon: <MdDoNotDisturb />,
      title: "Cancelled Meetings",
      val: 5
    }
  ]

  return (
    <div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        {cardData.map((data, index) => (
          <div key={index} className="bg-card p-4 rounded-lg flex items-center gap-4">
            <div className="text-3xl bg-white text-primary p-3 rounded-full">{data.icon}</div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-300">{data.title}</p>
              <p className="text-lg font-semibold">{data.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">

      </div>

    </div>
  )
}
