import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Admission/Dashboard";
import OnlineApplication from "../pages/Index/OnlineApplication";
import StudentOnlineApplication from "../pages/Admission/StudentOnlineApplication";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/onlineapplication" element={<OnlineApplication />}/>

      {/* ✅ Secure routes using element prop */}
      <Route
        path="/admission/dashboard"
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/onlineapplication"
        element={
          <ProtectedRoutes>
            <StudentOnlineApplication />
          </ProtectedRoutes>
        }
      />
    </Routes>
  </Router>
);

export default AppRoutes;
