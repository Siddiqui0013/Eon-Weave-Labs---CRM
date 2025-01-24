import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import useTheme from "./hooks/useTheme";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/common/Navbar";
import LoginForm from "./components/common/Login";
import { RegisterForm } from "./components/common/Register";
import { Invite } from "./components/common/Inviteuser";
import BdoRoutes from "./components/modules/bdo/BdoRoutes";
import HrRoutes from "./components/modules/hr/HrRoutes";

import "./App.css";

const App = () => {
  const { theme } = useTheme();
  const { user, accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const DefinedRoles = ["ceo", "hr", "developer", "bdo"];
  const role = user?.role || "";

  /* HR Email : "gokidab319@downlor.com"
      HR Password : "121212" */

  /* Employee Email : "gannet93128@topvu.net"
      Employee Password : "121212" */

  /* BDO Email : "locef40983@downlor.com"
      BDO Password : "121212" */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user && accessToken) {
      if (DefinedRoles.includes(role) && !location.pathname.includes(`/${role}`)) {
        navigate(`/${role}/dashboard`);
      }
    } else if (!user) {
      if (location.pathname === "/register" || location.pathname === "/login" || location.pathname === "/invite") {
        return;
      }
      // navigate("/login");
    }
  }, [user, accessToken, role, location.pathname, navigate]);

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
        <div className="md:w-[20%]">
          <Navbar />
        </div>
      )}
      <div className={`flex-1 lg:p-5 md:p-4 p-2.5 ${!role ? "w-full" : ""}`}>
        <Routes>
          <Route path="/" element={<RedirectHome />} />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/register/:inviteId" element={<RegisterForm />} />
          <Route path="/invite" element={<Invite />} />

          <Route element={<ProtectedRoute allowedRoles={DefinedRoles} />}>
            <Route path="bdo/*" element={<BdoRoutes />} />
            <Route path="hr/*" element={<HrRoutes />} />
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






// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router";
// import { useEffect } from "react";
// import useTheme from "./hooks/useTheme";
// import useAuth from "./hooks/useAuth";
// import Navbar from "./components/common/Navbar";
// import LoginForm from "./components/common/Login";
// import { RegisterForm } from "./components/common/Register";
// import BdoRoutes from "./components/modules/bdo/BdoRoutes";
// import HrRoutes from "./components/modules/hr/HrRoutes";

// import "./App.css";

// const App = () => {
//   const { theme } = useTheme();
//   const { user, accessToken } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const DefinedRoles = ["ceo", "hr", "developer", "bdo"];
//   const role = user?.role || "";

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//   }, [theme]);

//   // useEffect(() => {
//   //   if (user && accessToken) {
//   //     if (DefinedRoles.includes(role) && !location.pathname.includes(`/${role}`)) {
//   //       navigate(`/${role}/dashboard`);
//   //     }
//   //   } else if (location.pathname == "/register") {
//   //     navigate("/register");
//   //     return
//   //   } else if (!user) {
//   //     navigate("/");
//   //   }
//   // }, []);

//   // Protected routes
//   const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
//     if (!user || !accessToken || !allowedRoles.includes(role)) {
//       return <Navigate to="/login" replace />;
//     }
//     return <Outlet />;
//   };

//   // Default redirect for "/"
//   const RedirectHome = () => {
//     if (user && accessToken) {
//       return <Navigate to={`/${role}/dashboard`} replace />;
//     }
//     return <Navigate to="/login" replace />;
//   };

//   return (
//     <div className="flex w-[100%]">
//       {DefinedRoles.includes(role) && (
//         <div className="md:w-[20%]">
//           <Navbar />
//         </div>
//       )}
//       <div className={`flex-1 lg:p-5 md:p-4 p-2.5 ${!role ? "w-full" : ""}`}>
//         <Routes>
//           <Route path="/" element={<RedirectHome />} />

//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/register" element={<RegisterForm />} />

//           <Route element={<ProtectedRoute allowedRoles={DefinedRoles} />}>
//             <Route path="bdo/*" element={<BdoRoutes />} />
//             <Route path="hr/*" element={<HrRoutes />} />
//           </Route>

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// function AppWrapper() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }

// export default AppWrapper;










// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router";
// import { useEffect } from "react";
// import useTheme from "./hooks/useTheme";
// import useAuth from "./hooks/useAuth";
// import Navbar from "./components/common/Navbar";
// import LoginForm from "./components/common/Login";
// import {RegisterForm} from "./components/common/Register";
// import BdoRoutes from "./components/modules/bdo/BdoRoutes";
// import HrRoutes from "./components/modules/hr/HrRoutes";

// import "./App.css";

// const App = () => {
//   const { theme } = useTheme();
//   const { user, accessToken } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const DefinedRoles = ["ceo", "hr", "developer", "bdo"];
//   const role = user?.role || "";

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//   }, [theme]);

//   useEffect(() => {
//     if (user && accessToken) {
//       if (DefinedRoles.includes(role) && !location.pathname.includes(`/${role}`)) {
//         navigate(`/${role}/dashboard`);
//       }
//     } else if (!user) {
//       navigate("/");
//     }
//   }, []);    

//   const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
//     if (!user || !accessToken || !allowedRoles.includes(role)) {
//       return <Navigate to="/login" replace />;
//     }
//     return <Outlet />;
//   };

//   const RedirectHome = () => {
//     if (user && accessToken) {
//       return <Navigate to={`/${role}/dashboard`} replace />;
//     }
//     return <Navigate to="/login" replace />;
//   };

//   return (
//     <div className="flex w-[100%]">
//       {DefinedRoles.includes(role) && (
//         <div className="md:w-[20%]">
//           <Navbar />
//         </div>
//       )}
//       <div className={`flex-1 lg:p-5 md:p-4 p-2.5 ${!role ? "w-full" : ""}`}>
//         <Routes>
//           <Route path="/" element={<RedirectHome />} />

//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/register" element={<RegisterForm />} />

//           <Route element={<ProtectedRoute allowedRoles={DefinedRoles} />}>
//             <Route path="bdo/*" element={<BdoRoutes />} />
//             <Route path="hr/*" element={<HrRoutes />} />
//           </Route>

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// function AppWrapper() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }

// export default AppWrapper;

















// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from "react-router";
// import { useLocation } from "react-router";
// import { useEffect } from "react";
// import useTheme from "./hooks/useTheme";
// import useAuth from "./hooks/useAuth";
// import Navbar from "./components/common/Navbar";
// import LoginForm from "./components/common/Login";
// import {RegisterForm} from "./components/common/Register";
// import BdoRoutes from "./components/modules/bdo/BdoRoutes";
// import HrRoutes from "./components/modules/hr/HrRoutes";

// import "./App.css";

// const App = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { theme } = useTheme();
//   const { user, accessToken } = useAuth();

//   const DefinedRoles = ["ceo", "hr", "developer", "bdo"];
//   const role = user?.role || "";

//   useEffect(() => {
//     if (user && accessToken) {
//       if (DefinedRoles.includes(role) && !location.pathname.includes(`/${role}`)) {
//         navigate(`/${role}/dashboard`);
//       }
//     } else if (!user) {
//       navigate("/");
//     }
//   }, [user, accessToken, role, location.pathname, navigate]);

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//   }, [theme]);

//   const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
//     if (!user || !accessToken || !allowedRoles.includes(role)) {
//       return <Navigate to="/" replace />;
//     }
//     return <Outlet />;
//   };

//   return (
//     <div className="flex w-[100%]">
//       {DefinedRoles.includes(role) && (
//         <div className="md:w-[20%]">
//           <Navbar />
//         </div>
//       )}
//       <div className={`flex-1 lg:p-5 md:p-4 p-2.5 ${!role ? "w-full" : ""}`}>
//         <Routes>
//           <Route path="/" element={<LoginForm />} />
//           <Route path="/register" element={<RegisterForm />} />

//           <Route element={<ProtectedRoute allowedRoles={DefinedRoles} />}>
//             <Route path="bdo/*" element={<BdoRoutes />} />
//             <Route path="hr/*" element={<HrRoutes />} />
//           </Route>

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// function AppWrapper() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }

// export default AppWrapper;
