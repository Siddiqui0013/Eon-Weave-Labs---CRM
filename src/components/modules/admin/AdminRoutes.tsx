import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import AllMeetings from "./AllMeetings";
import AllEmployees from "./AllEmployees";
import AllProjects from "./AllProjects";
import ChatScreen from "@/components/common/ChatScreen";
import Attendence from "./Attendence";

function AdminRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="meetings" element={<AllMeetings />} />
            <Route path="employees" element={<AllEmployees />} />
            <Route path="attendance" element={<Attendence />} />
            <Route path="projects" element={<AllProjects />} />
            <Route path="chat" element={<ChatScreen />} />
        </Routes>
    );
}

export default AdminRoutes;