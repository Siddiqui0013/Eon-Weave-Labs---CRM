import { Route, Routes, Navigate, useLocation } from "react-router";
import Dashboard from "./Dashboard";
import TaskAssigned from "./TaskAssigned";
import DailySheet from "./Dailysheet"
import ChatScreen from "@/components/common/chat/ChatScreen";

const EmployeeRoutes = () => {
    const location = useLocation();
    const shouldApplyPadding = location.pathname.endsWith("/chat");
    return (
        <div className={ !shouldApplyPadding ? "lg:p-5 md:p-4 p-2.5" : ""}>
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks-assigned" element={<TaskAssigned />} />
            <Route path="/daily-sheet" element={<DailySheet />} />
            <Route path="/chat" element={<ChatScreen />} />
        </Routes>
        </div>
    )
}

export default EmployeeRoutes