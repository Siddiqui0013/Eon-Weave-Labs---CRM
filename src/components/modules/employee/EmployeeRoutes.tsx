import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import TaskAssigned from "./TaskAssigned";

const EmployeeRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks-assigned" element={<TaskAssigned />} />
        </Routes>
    )
}

export default EmployeeRoutes