import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Admission/Dashboard";
import OnlineApplication from "../pages/Index/OnlineApplication";
import StudentOnlineApplication from "../pages/Admission/StudentOnlineApplication";
import CongratsComponent from "../components/OnlineAppComponents/CongratsComponent";
import StudentOnlineAppForm from "../pages/Admission/StudentOnlineAppForm";
import TemplatesForm from "../pages/Admission/TemplatesForm";


const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/onlineapplication" element={<OnlineApplication />}/>
      <Route path="/congratulationletter" element={<CongratsComponent />}/>

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
      <Route
        path="/admission/studentappform"
        element={
          <ProtectedRoutes>
            <StudentOnlineAppForm />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/templatesform"
        element={
          <ProtectedRoutes>
            <TemplatesForm />
          </ProtectedRoutes>
        }
      />
    </Routes>
  </Router>
);

export default AppRoutes;
