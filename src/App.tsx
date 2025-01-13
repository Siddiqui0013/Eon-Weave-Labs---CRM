import { BrowserRouter as Router, Routes, Route } from "react-router";
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

  useEffect(() => {
    dispatch(setRole("hr"));
  }, [dispatch]);

  const role = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    console.log("Current Role:", role);
    <Navigate to={`/${role}/dashboard`} replace />
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
<div className="w-[20%]">
<Navbar />
</div>
<div className="flex-1">
<Routes>
{/* <Route path="/" element={<Navigate to={`/${role}/dashboard`} replace />} /> */}
{renderRoutes()}
</Routes>
</div>
</div>

//   <div className="grid grid-cols-[auto,1fr] h-screen">
//   <Navbar />
//   <div className="flex-1">
//       <Routes>
//           {renderRoutes()}
//       </Routes>
//   </div>
// </div>

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
