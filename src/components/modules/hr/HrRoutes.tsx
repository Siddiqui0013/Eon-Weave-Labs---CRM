import { Route, Routes, Navigate, useLocation } from "react-router";
import Dashboard from "./Dashboard";
import Team from "./Team";
import TeamDetails from "./TeamDetails";
import ChatScreen from "@/components/common/chat/ChatScreen";

function HrRoutes() {
    const location = useLocation();
    const shouldApplyPadding = location.pathname.endsWith("/chat");
    return (
        <div className={ !shouldApplyPadding ? "lg:p-5 md:p-4 p-2.5" : ""}>
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="team" element={<Team />} />
            <Route path="chat" element={<ChatScreen />} />
            <Route path="team/:id" element={<TeamDetails />} />
        </Routes>
        </div>
    );
}

export default HrRoutes;