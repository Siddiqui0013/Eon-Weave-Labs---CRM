  /* HR Email : "gokidab319@downlor.com"
      HR Password : "121212" */

  /* Employee Email : "gannet93128@topvu.net"
      Employee Password : "121212" */

  /* BDO Email : "locef40983@downlor.com"
      BDO Password : "121212" */

  /* Admin Email : "admin@mail.com"
      Admin Password : "121212" */

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import useTheme from "./hooks/useTheme";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/common/Navbar";
import LoginForm from "./components/common/Login";
import { RegisterForm } from "./components/common/Register";
import BdoRoutes from "./components/modules/bdo/BdoRoutes";
import HrRoutes from "./components/modules/hr/HrRoutes";
import EmployeeRoutes from "./components/modules/employee/EmployeeRoutes";
import AdminRoutes from "./components/modules/admin/AdminRoutes";
import SocketService from "@/lib/socket";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/Store';

import "./App.css";

const App = () => {

  const dispatch = useDispatch<AppDispatch>();
  const socketService = SocketService.getInstance();
  const { theme } = useTheme();
  const { user, accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const DefinedRoles = ["admin", "hr", "employee", "bdo"];
  const role = user?.role || "";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user && accessToken) {
      socketService.initializeSocket(accessToken);
      socketService.setDispatch(dispatch);
      if (DefinedRoles.includes(role) && !location.pathname.includes(`/${role}`)) {
        navigate(`/${role}/dashboard`);
      }
    } else if (!user) {
      if (location.pathname === "/register" || location.pathname === "/login" || location.pathname === "/invite") {
        return;
      }
      // navigate("/login");
    }
    return () => {
      socketService.disconnect();
    }
  }, [user, accessToken, role, dispatch, location.pathname, navigate]);

  const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    if (!user || !accessToken || !allowedRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  };

  const RedirectHome = () => {
    if (user && accessToken) {
      return <Navigate to={`/${role}/dashboard`} replace />;
    }
    return <Navigate to="/login" replace />;
  };

  return (
    <div className="flex w-[100%]">
      {DefinedRoles.includes(role) && (
        <div className="md:w-[18%]">
          <Navbar />
        </div>
      )}
      <div className={`flex-1 ${!role ? "w-full" : ""}`}>
        <Routes>
          <Route path="/" element={<RedirectHome />} />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/register/:inviteId" element={<RegisterForm />} />
          <Route element={<ProtectedRoute allowedRoles={DefinedRoles} />}>
            <Route path="bdo/*" element={<BdoRoutes />} />
            <Route path="hr/*" element={<HrRoutes />} />
            <Route path="employee/*" element={<EmployeeRoutes />} />
            <Route path="admin/*" element={<AdminRoutes />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;