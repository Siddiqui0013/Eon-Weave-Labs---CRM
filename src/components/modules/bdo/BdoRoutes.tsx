import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import Calls from "./Calls";
import Meetings from "./Meeting";
import SalesReport from "./SalesReport";

import SaleView from "./SaleView";

import AddSale from "./AddSale";



function BdoRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="sales-report" element={<SalesReport />} />
            <Route path="sales-report/view" element={<SaleView />} />
            <Route path="calls" element={<Calls />} />
            <Route path="sales-report/add" element={<AddSale />} />
        </Routes>
    );
}

export default BdoRoutes;