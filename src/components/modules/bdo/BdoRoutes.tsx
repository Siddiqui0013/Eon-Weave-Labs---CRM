import { Route, Routes, Navigate, useLocation } from "react-router";
import Dashboard from "./Dashboard";
import Calls from "./Calls";
import Meetings from "./Meeting";
import SalesReport from "./SalesReport";
import ChatScreen from "@/components/common/chat/ChatScreen";

function BdoRoutes() {
    const location = useLocation();
    const shouldApplyPadding = location.pathname.endsWith("/chat");
    return (
        <div className={ !shouldApplyPadding ? "lg:p-5 md:p-4 p-2.5" : ""}>
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="sales-report" element={<SalesReport />} />
            <Route path="calls" element={<Calls />} />
            <Route path="chat" element={<ChatScreen />} />
        </Routes>
        </div>
    );
}

export default BdoRoutes;