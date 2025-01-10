import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import Team from "./Team";

function HrRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="team" element={<Team />} />
        </Routes>
    );
}

export default HrRoutes;