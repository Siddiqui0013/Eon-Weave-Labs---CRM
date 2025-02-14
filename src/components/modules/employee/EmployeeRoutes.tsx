import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./Dashboard";

const EmployeeRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    )
}

export default EmployeeRoutes