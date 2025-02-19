import { Route, Routes, Navigate, useLocation } from "react-router";
import Dashboard from "./Dashboard";
import AllMeetings from "./AllMeetings";
import AllEmployees from "./employee/AllEmployees";
import AllProjects from "./projects/AllProjects";
import ChatScreen from "@/components/common/chat/ChatScreen";
import Attendence from "./Attendence";

function AdminRoutes() {

    const location = useLocation();
    const shouldApplyPadding = location.pathname.endsWith("/chat");
    return (
        <div className={ !shouldApplyPadding ? "lg:p-5 md:p-4 p-2.5" : ""}>
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="meetings" element={<AllMeetings />} />
            <Route path="employees" element={<AllEmployees />} />
            <Route path="attendance" element={<Attendence />} />
            <Route path="projects" element={<AllProjects />} />
            <Route path="chat" element={<ChatScreen />} />
        </Routes>
        </div>
    );
}

export default AdminRoutes;