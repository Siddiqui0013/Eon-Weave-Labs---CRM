import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import Team from "./Team";
import TeamDetails from "./TeamDetails";
import ChatScreen from "@/components/common/ChatScreen";

function HrRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="team" element={<Team />} />
            <Route path="chat" element={<ChatScreen />} />
            <Route path="team/:id" element={<TeamDetails />} />
        </Routes>
    );
}

export default HrRoutes;