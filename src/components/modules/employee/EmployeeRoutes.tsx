import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import TaskAssigned from "./TaskAssigned";
import DailySheet from "./Dailysheet"
import ChatScreen from "@/components/common/ChatScreen";

const EmployeeRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks-assigned" element={<TaskAssigned />} />
            <Route path="/daily-sheet" element={<DailySheet />} />
            <Route path="/chat" element={<ChatScreen />} />
        </Routes>
    )
}

export default EmployeeRoutes