import { useState } from "react"
import Button from "../../common/Button"
import { TbLogout } from "react-icons/tb";
import Card from "../../common/Card";

export default function Dashboard() {

  const [name, setName] = useState("BDO")

  return (
    <div className="flex flex-col w-full items-center justify-center p-4">

      <div className="top flex w-full mb-8 justify-between">
        <h1 className="text-4xl" onClick={() => setName("Name Updated")} >Hi,{name} </h1>
        <div className="flex gap-2">
          <Button title="Check In" onClick={() => console.log("CheckIn")} icon={<TbLogout size={20} />} />
          <Button title="Check Out" onClick={() => console.log("CheckOut")} icon={<TbLogout size={20} />} />
          <div className="profileBtn h-12 w-12 rounded-full bg-secondary"></div>
        </div>
      </div>

      <div className="cards flex w-full justify-between gap-2">
        <Card data={{ icon: "👋", title: "Target", val: "35/50" }} />
        <Card data={{ icon: "👋", title: "Leads", val: "3" }} />
        <Card data={{ icon: "👋", title: "Overall Payment", val: "30k" }} />
        <Card data={{ icon: "👋", title: "Payment Approved", val: "20k" }} />
        <Card data={{ icon: "👋", title: "Payment Pending", val: "10k" }} />
      </div>

      <div className="table w-full">
      
      </div>

    </div>
  )
}
