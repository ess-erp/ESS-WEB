import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Auth/Login";
import AccessDenied from "../components/SharedComponents/AccessDenied";
import AdmissionDashboard from "../pages/Admission/Dashboard";
import OnlineApplication from "../pages/Index/OnlineApplication";
import StudentOnlineApplication from "../pages/Admission/StudentOnlineApplication";
import CongratsComponent from "../components/OnlineAppComponents/CongratsComponent";
import StudentOnlineAppForm from "../pages/Admission/StudentOnlineAppForm";
import AdmissionTemplatesForm from "../pages/Admission/TemplatesForm";
import CfwDashboard from "../pages/CFW/Dashboard";
import CfwExamRoomTemplate from "../pages/CFW/ExamRoomTemplates";
import CashierDashboard from "../pages/Cashier/Dashboard";
import CashierStudentOnlineApplication from "../pages/Cashier/StudentOnlineApplication";
import CashierPayment from "../pages/Cashier/CashierPayment";
import FinanceDashboard from "../pages/Finance/Dashboard";
import FinanceTemplatesForm from "../pages/Finance/TemplatesForm";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/onlineapplication" element={<OnlineApplication />} />
      <Route path="/congratulationletter" element={<CongratsComponent />} />
      <Route path="/accessdenied" element={<AccessDenied />} />

      {/* ✅ Admissions modules */}
      <Route
        path="/admission/dashboard"
        element={
          <ProtectedRoutes allowedRoles={["admission"]}>
            <AdmissionDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/onlineapplication"
        element={
          <ProtectedRoutes allowedRoles={["admission"]}>
            <StudentOnlineApplication />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/studentappform"
        element={
          <ProtectedRoutes allowedRoles={["admission"]}>
            <StudentOnlineAppForm />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/templatesform"
        element={
          <ProtectedRoutes allowedRoles={["admission"]}>
            <AdmissionTemplatesForm />
          </ProtectedRoutes>
        }
      />
      {/* End of admission modules */}

      {/* ✅ CFW modules */}
      <Route
        path="/cfw/dashboard"
        element={
          <ProtectedRoutes allowedRoles={["cfw"]}>
            <CfwDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cfw/examroomtemplates"
        element={
          <ProtectedRoutes allowedRoles={["cfw"]}>
            <CfwExamRoomTemplate />
          </ProtectedRoutes>
        }
      />
      {/* End of CFW Modules */}


      {/* Cashier modules */}

      <Route
        path="/cashier/dashboard"
        element={
          <ProtectedRoutes allowedRoles={["cashier"]}>
            <CashierDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cashier/onlineapplication"
        element={
          <ProtectedRoutes allowedRoles={["cashier"]}>
            <CashierStudentOnlineApplication />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cashier/cashierpayment"
        element={
          <ProtectedRoutes allowedRoles={["cashier"]}>
            <CashierPayment />
          </ProtectedRoutes>
        }
      />

      {/* End of Cashier modules */}


      {/* Start of finance module */}

      <Route
        path="/finance/dashboard"
        element={
          <ProtectedRoutes allowedRoles={["finance"]}>
            <FinanceDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/finance/templates"
        element={
          <ProtectedRoutes allowedRoles={["finance"]}>
            <FinanceTemplatesForm />
          </ProtectedRoutes>
        }
      />
      {/* End of finance module */}

      {/* 🚨 Catch-all route → Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;
