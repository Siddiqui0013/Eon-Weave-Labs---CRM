import Button from "./Button"
import EmployeeProfilePreview from "@/components/common/ProfileDrawer";
import { LogIn, LogOut, UtensilsCrossed, Keyboard, Loader2 } from 'lucide-react';
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useCheckInMutation, useCheckOutMutation, useStartBreakMutation, useEndBreakMutation } from "@/services/userApi";
import { useToast } from "@/hooks/use-toast";

export default function TopButtons() {

  const { user } = useAuth();
  const { toast } = useToast();
  const [checkIn, {isLoading}] = useCheckInMutation();
  const [checkOut, { isLoading: isLoading2}] = useCheckOutMutation();
  const [startBreak, { isLoading: isLoading3}] = useStartBreakMutation();
  const [endBreak, { isLoading: isLoading4}] = useEndBreakMutation();


  const StartBreak = async () => {
      try {
        const response = await startBreak({}).unwrap();
        console.log("StartBreak Response:", response);
        toast({
          title: "Started Break", 
          description: "You have successfully started a break.",
          duration: 2000,
        })
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          // description: error.data.message || "An error occurred while starting a break.",
          duration: 2000,
        })
        console.log("Error starting break:", error);
      }
  }

  const EndBreak = async () => {
      try {
        const response = await endBreak({}).unwrap();
        console.log("EndBreak Response:", response);
        toast({
          title: "Ended Break",
          description: "You have successfully ended a break.",
          duration: 2000,
        })
      } catch (error: unknown) {
        toast({
          title: "Error",
          variant: "destructive",
          // description: error.data.message || "An error occurred while ending a break.",
          duration: 2000,
        })
        console.log("Error ending break:", error);
      }
  }

  const CheckIn = async () => {
      try {
        const response = await checkIn({}).unwrap();
        console.log("CheckIn Response:", response);
        toast({
          title: "Checked In",
          description: "You have successfully checked in.",
          duration: 2000,
        })
      } catch (error: unknown) {
        toast({
          title: "Error",
          variant: "destructive",
          // description: error.data.message || "An error occurred while checking in.",
          duration: 2000,
        })
        console.log("Error checking in:", error);
    }
  }

  const CheckOut = async () => {
      try {
        const response = await checkOut({}).unwrap();
        console.log("CheckOut Response:", response);
        toast({
          title: "Checked Out",
          description: "You have successfully checked out.",
          duration: 2000,
        })
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Error",
          // description: error.data.message || "An error occurred while checking out.",
          duration: 2000,
        })
        console.log("Error checking out:", error);
    }
  }

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
    <>
        <div className="flex gap-2">
      
    <div className="flex gap-2">
      
      <Button 
      title="AFK"
      onClick={StartBreak} 
      icon={ isLoading3 ? <Loader2 size={16} className="animate-spin" /> : <UtensilsCrossed size={16} /> }
      >
      </Button>
      <Button
      title="BTK"
      onClick={EndBreak}
      icon={ isLoading4 ? <Loader2 size={16} className="animate-spin" /> : <Keyboard size={16} />}
      >
      </Button>
    </div>

      <Button 
      title="Check In"
      onClick={CheckIn} 
      icon={ isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} /> }
      >
      </Button>
      <Button
      title="Check Out"
      onClick={CheckOut}
      icon={ isLoading2 ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
      >
      </Button>

      <EmployeeProfilePreview employee={employeeData} side="right" />
    </div>
    </>

  )
}
