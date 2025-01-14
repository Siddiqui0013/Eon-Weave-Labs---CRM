import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router";
import Navbar from "./components/common/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState } from "./redux/Store"
import { setRole } from "./redux/slices/userSlice";

import LoginForm from "./components/common/Login";
import BdoRoutes from "./components/modules/bdo/BdoRoutes";
import HrRoutes from "./components/modules/hr/HrRoutes";

import "./App.css"
const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setRole("hr"));
  }, [dispatch]);

  const role = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    if (role) {
      navigate(`/${role}/dashboard`, { replace: true });
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
  };

return (
  <div className="flex w-[100%]">
    {role && (
      <div className="w-[20%]">
        <Navbar />
      </div>
    )}
    <div className={`flex-1 ${!role ? "w-full" : ""}`}>
      <Routes>{renderRoutes()}</Routes>
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
