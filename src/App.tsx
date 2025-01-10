import { BrowserRouter as Router, Routes } from "react-router";
import Navbar from "./components/common/Navbar"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setRole } from "./redux/slices/userSlice";
import "./App.css"

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRole("hr")); 
  }, [dispatch]);

    // const userRole = "CEO"; 

    return (
        <Router>
            {/* <Navbar userRole={userRole} /> */}
            <Navbar />
            <Routes>
                {/* Add more role-specific routes */}
            </Routes>
        </Router>
    );
};

export default App;
