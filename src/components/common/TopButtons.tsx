import Button from "./Button"
import EmployeeProfilePreview from "@/components/common/ProfileDrawer";
import { LogIn, LogOut } from 'lucide-react';

export default function topButtons() {

    const employeeData = {
        name: "John Smith",
        status: "New",
        email: "jane.doe@example.com",
        phone: "555-5678",
        location: "Islamabad, Pakistan",
        jobTitle: "Software Engineer",
        department: "Development",
        employmentType: "Full-time",
        joiningDate: "2020-01-15",
      };    

  return (
    <div className="flex gap-2">
    <Button title="Check In" onClick={() => console.log("CheckIn")} icon={<LogIn size={18} />} />
    <Button title="Check Out" onClick={() => console.log("CheckOut")} icon={<LogOut size={18} />} />
    <EmployeeProfilePreview employee={employeeData} side="right" />
  </div>
)
}
