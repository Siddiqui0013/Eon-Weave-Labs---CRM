import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router";
import { useLocation } from "react-router";
import Navbar from "./components/common/Navbar";
import { useEffect } from "react";
import useTheme from "./hooks/useTheme";
import useAuth from "./hooks/useAuth";
import LoginForm from "./components/common/Login";
import BdoRoutes from "./components/modules/bdo/BdoRoutes";
import HrRoutes from "./components/modules/hr/HrRoutes";

import "./App.css"
const App = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    const { user, accessToken } = useAuth();

    if (user && accessToken) {

      const role = user.role;

      if (DefinedRoles.includes(role)) {
        if (!location.pathname.includes(`/${role}`)) {
          navigate(`/${role}/dashboard`);
        } else {
          navigate(location.pathname);
        }
      } else {
        navigate("/");
      }
    }
  }, [navigate]);


  const { user } = useAuth();
  const role = user ? user.role : "";
  // console.log("Role from App.js: ", role);

  useEffect(() => {
    if (role && DefinedRoles.includes(role)) {
      if (!location.pathname.includes(`/${role}`)) {
        navigate(`/${role}/dashboard`);
      }
    } else {
      navigate("/");
    }
  }, [role, location.pathname, navigate]);



  /*
muhammadkhushi072242@gmail.com
  */

  const DefinedRoles = ["ceo", "hr", "developer", "bdo"];
  useEffect(() => {
    // if (role == "ceo" || role == "hr" || role == "developer" || role == "bdo") {
    if (DefinedRoles.includes(role)) {
      if (!location.pathname.includes(`/${role}`)) {
        navigate(`/${role}/dashboard`);
      } else {
        navigate(location.pathname);
      }
    } else {
      navigate("/");
    }
  }, [role]);

  const renderRoutes = () => {

    switch (role) {
      case "bdo":
        return <Route path="bdo/*" element={<BdoRoutes />} />;
      case "hr":
        return <Route path="hr/*" element={<HrRoutes />} />;
      default:
        return <Route path="/" element={<LoginForm />} />;
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // const renderRoutes = () => {
  //   switch (role) {
  //     case "bdo":
  //       return <Route path="bdo/*" element={<BdoRoutes />} />;
  //     case "hr":
  //       return <Route path="hr/*" element={<HrRoutes />} />;
  //     case "developer":
  //       return <Route path="developer/*" element={<div>Developer Dashboard</div>} />;
  //     default:
  //       return (
  //         <>
  //           <Route path="/" element={<LoginForm />} />
  //           <Route path="*" element={<LoginForm />} /> {/* Catch-all route */}
  //         </>
  //       );
  //   }
  // };

  return (
    <div className="flex w-[100%]">
      {
        // role && (
        DefinedRoles.includes(role) && (
          <div className="md:w-[20%]">
            <Navbar />
          </div>
        )}
      <div className={`flex-1 lg:p-5 md:p-4 p-2.5 ${!role ? "w-full" : ""}`}>
        {/* <div className={`flex-1 ${!DefinedRoles.includes(role) ? "w-full" : ""}`}> */}
        <Routes>
          {renderRoutes()}
        </Routes>
      </div>
    </div>
  )
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;








// import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router";
// import Navbar from "./components/common/Navbar"
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { setRole } from "./redux/slices/userSlice";
// import "./App.css"

// import BdoRoutes from "./components/modules/bdo/BdoRoutes";
// import HrRoutes from "./components/modules/hr/HrRoutes";

// const App = () => {

//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(setRole("hr"));
//   }, [dispatch]);

//     return (
//         <Router>
//             <Navbar />
//               <Routes>
//               </Routes>
//         </Router>
//     );
// };

// export default App;
