import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import Calls from "./Calls";
import Meetings from "./Meeting";
import SalesReport from "./SalesReport";
import ChatScreen from "@/components/common/ChatScreen";

function BdoRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="sales-report" element={<SalesReport />} />
            <Route path="calls" element={<Calls />} />
            <Route path="chat" element={<ChatScreen />} />
        </Routes>
    );
}

export default BdoRoutes;