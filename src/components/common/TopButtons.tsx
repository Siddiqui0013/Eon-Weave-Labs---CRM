import Button from "./Button"
import EmployeeProfilePreview from "@/components/common/ProfileDrawer";
import { LogIn, LogOut } from 'lucide-react';
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

export default function TopButtons() {

  const { user } = useAuth();

  useEffect(() => {
    // console.log("User:", user);
  }, [user]);

  const employeeData = {
    name: user?.name || "John Doe",
    profileImage: user?.profileImage || "https://avatar.iran.liara.run/public",
    email: user?.email || "jane.doe@example.com",
    phone: user?.phone || "555-5678",
    address: user?.address || "Islamabad, Pakistan",
    jobTitle: user?.jobTitle || "Employee",
    joiningDate: user?.createdAt || "2020-01-15",
  };

  return (
    <div className="flex gap-2">
      <Button title="Check In" onClick={() => console.log("CheckIn")} disabled={false} icon={<LogIn size={18} />} />
      <Button title="Check Out" onClick={() => console.log("CheckOut")} disabled={false} icon={<LogOut size={18} />} />
      <EmployeeProfilePreview employee={employeeData} side="right" />
    </div>
  )
}
