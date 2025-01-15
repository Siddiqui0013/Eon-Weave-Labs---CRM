import { FaVideo, FaCalendarAlt } from "react-icons/fa";
import { MdDoNotDisturb } from "react-icons/md";
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

  return (
    <div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        {cardData.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </div>

      <div className="mt-5">

      </div>

    </div>
  )
}
