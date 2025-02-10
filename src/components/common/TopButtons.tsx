import Button from "./Button"
import EmployeeProfilePreview from "@/components/common/ProfileDrawer";
import { LogIn, LogOut, UtensilsCrossed, Keyboard, Loader2 } from 'lucide-react';
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useCheckInMutation, useCheckOutMutation, useStartBreakMutation, useEndBreakMutation, useUserAttendenceQuery } from "@/services/userApi";
import { useToast } from "@/hooks/use-toast";

export default function TopButtons() {

  const { user } = useAuth();
  const { toast } = useToast();
  const [checkIn, {isLoading}] = useCheckInMutation();
  const [ checkedIn, setCheckedIn ] = useState(false);
  const [ breakEnded, setBreakEnded ] = useState(true);
  const [checkOut, { isLoading: isLoading2}] = useCheckOutMutation();
  const [startBreak, { isLoading: isLoading3}] = useStartBreakMutation();
  const [endBreak, { isLoading: isLoading4}] = useEndBreakMutation();
  const userAttendance = useUserAttendenceQuery({});

  const isErrorWithMessage = (error: unknown): error is { data: { message: string } } => {
    return typeof error === "object" && 
    error !== null && "data" in error && "message" in (error as { data: { message: string } }).data;
  };

  const StartBreak = async () => {
      try {
        const response = await startBreak({}).unwrap();
        console.log("StartBreak Response:", response);
        toast({
          title: "Started Break", 
          description: "You have successfully started a break.",
          duration: 2000,
        })
        setBreakEnded(false);
      } catch (error) {
        let message = "An error occurred while checking out.";
        if (isErrorWithMessage(error)) {
          message = error.data.message;
        }
        toast({
          title: "Error",
          variant: "destructive",
          description: message,
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
        setBreakEnded(true);
      } catch (error: unknown) {
        let message = "An error occurred while checking out.";
        if (isErrorWithMessage(error)) {
          message = error.data.message;
        }
        toast({
          title: "Error",
          variant: "destructive",
          description: message,
          duration: 2000,
        })
        console.log("Error ending break:", error);
      }
  }

  const CheckIn = async () => {
    // console.log("Current Time : ", new Date().toISOString() );
      try {
        const response = await checkIn({}).unwrap();
        console.log("CheckIn Response:", response);
        toast({
          title: "Checked In",
          description: "You have successfully checked in.",
          duration: 2000,
        })
        setCheckedIn(true);
      } catch (error: unknown) {
        let message = "An error occurred while checking out.";
        if (isErrorWithMessage(error)) {
          message = error.data.message;
        }
        toast({
          title: "Error",
          variant: "destructive",
          description: message,
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
        setCheckedIn(false);
      } catch (error: unknown) {
        let message = "An error occurred while checking out.";
        if (isErrorWithMessage(error)) {
          message = error.data.message;
        }
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
          duration: 2000,
        })
        console.log("Error checking out:", error);
    }
  }

  useEffect(() => {
  }, [user]);

    // useEffect(() => {
    //   if (userAttendance.data && userAttendance.data.data) {
    //     console.log(userAttendance.data);
    //     setCheckedIn(userAttendance.data.success);
    //     const breaks = userAttendance.data.data.workHours.breaks;
    //     const lastBTK = breaks.length > 0 ? breaks.at(-1) : null
    //     // let boolCheck = false
    //     // console.log("Boolean check Before : ", boolCheck);        
    //     // if(Object.keys(lastBTK).includes("endTime")) {
    //     //   setBreakEnded(true)
    //       if (lastBTK && typeof lastBTK === 'object' && Object.keys(lastBTK).includes("endTime")) {
    //         setBreakEnded(true)
    //       // boolCheck = true
    //       // console.log("Boolean check After : ", boolCheck);
    //     } else {
    //       setBreakEnded(false)
    //       // console.log("Boolean check in else block : ", boolCheck);
    //     }
    //   }
    // }, [userAttendance.data]);

    useEffect(() => {
      if (userAttendance.data && userAttendance.data.data) {
        const workHours = userAttendance.data.data.workHours;
        const breaks = workHours.breaks.length > 0 ? workHours.breaks.at(-1) : null;
        console.log(userAttendance.data);
        setCheckedIn(userAttendance.data.success);
        if (breaks) {
          if (breaks.endTime) {
            setBreakEnded(true);
          } else {  
            setBreakEnded(false);
          }
        } else {
          setBreakEnded(true);
        }

        if (workHours){
          if (workHours.checkOut){
            setCheckedIn(false);
          } else {
            setCheckedIn(true);
          }
        } else {
          setCheckedIn(false);
        }
      }
    }, [userAttendance.data]);
    

  const employeeData = {
    name: user?.name || "John Doe",
    profileImage: user?.profileImage || "https://avatar.iran.liara.run/public",
    email: user?.email || "jane.doe@example.com",
    phone: user?.phone || "555-5678",
    address: user?.address || "Islamabad, Pakistan",
    cnic : user?.cnic || "12345-12456644-0",
    jobTitle: user?.jobTitle || "Employee",
    joiningDate: user?.createdAt || "2020-01-15",
  };

  return (
    <>
        <div className="flex gap-2">
      
    <div className="flex gap-2">
      
     { breakEnded ? (
              <Button 
              title="AFK"
              onClick={StartBreak} 
              icon={ isLoading3 ? <Loader2 size={16} className="animate-spin" /> : <UtensilsCrossed size={16} /> }
              >
              </Button>                
      ) : (
        <Button
        title="BTK"
        onClick={EndBreak}
        icon={ isLoading4 ? <Loader2 size={16} className="animate-spin" /> : <Keyboard size={16} />}
        >
        </Button>
      )}
    </div>

      { checkedIn ? (
      <Button
      title="Check Out"
      onClick={CheckOut}
      icon={ isLoading2 ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
      >
      </Button>        
      ) : (
        <Button 
        title="Check In"
        onClick={CheckIn} 
        icon={ isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} /> }
        >
        </Button>  
      )}
      <EmployeeProfilePreview employee={employeeData} side="right" />
    </div>
    </>

  )
}
