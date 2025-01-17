import Button from "./Button"
import EmployeeProfilePreview from "@/components/common/ProfileDrawer";
import { LogIn, LogOut } from 'lucide-react';
import { RootState } from "@/redux/Store"
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function TopButtons() {

  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
      console.log("User:", user);
  }, [user]);

    const employeeData = {
        name: user?.name || "John Doe",
        profileImage : user?.profileImage || "https://via.placeholder.com/150",
        email: user?.email || "jane.doe@example.com",
        phone: user?.phone || "555-5678",
        address: user?.address || "Islamabad, Pakistan",
        jobTitle: user?.jobTitle || "Employee",
        joiningDate: user?.createdAt || "2020-01-15",
      };

  return (
    <div className="flex gap-2">
    <Button title="Check In" onClick={() => console.log("CheckIn")} icon={<LogIn size={18} />} />
    <Button title="Check Out" onClick={() => console.log("CheckOut")} icon={<LogOut size={18} />} />
    <EmployeeProfilePreview employee={employeeData} side="right" />
  </div>
)
}
