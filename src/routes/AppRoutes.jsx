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
import CfwStudentOnlineApplication from "../pages/CFW/StudentOnlineApplication";
import CfwStudentOnlineAppForm from "../pages/CFW/StudentOnlineAppForm";
import CfwExamRoomTemplate from "../pages/CFW/ExamRoomTemplates";
import CfwTemplates from "../pages/CFW/Templates";
import CashierDashboard from "../pages/Cashier/Dashboard";
//import CashierStudentOnlineApplication from "../pages/Cashier/StudentOnlineApplication";
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
          <ProtectedRoutes allowedRoles={["1"]}>
            <AdmissionDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/onlineapplication"
        element={
          <ProtectedRoutes allowedRoles={["1"]}>
            <StudentOnlineApplication />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/studentappform"
        element={
          <ProtectedRoutes allowedRoles={["1"]}>
            <StudentOnlineAppForm />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/templatesform"
        element={
          <ProtectedRoutes allowedRoles={["1"]}>
            <AdmissionTemplatesForm />
          </ProtectedRoutes>
        }
      />
      {/* End of admission modules */}

      {/* ✅ CFW modules */}
      <Route
        path="/cfw/dashboard"
        element={
          <ProtectedRoutes allowedRoles={["2"]}>
            <CfwDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cfw/onlineapplication"
        element={
          <ProtectedRoutes allowedRoles={["2"]}>
            <CfwStudentOnlineApplication />
          </ProtectedRoutes>
        }
      />
       <Route
        path="/cfw/studentappform"
        element={
          <ProtectedRoutes allowedRoles={["2"]}>
            <CfwStudentOnlineAppForm />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cfw/examroomtemplates"
        element={
          <ProtectedRoutes allowedRoles={["2"]}>
            <CfwExamRoomTemplate />
          </ProtectedRoutes>
        }
      />
       <Route
        path="/cfw/templates"
        element={
          <ProtectedRoutes allowedRoles={["2"]}>
            <CfwTemplates />
          </ProtectedRoutes>
        }
      />
      {/* End of CFW Modules */}


      {/* Cashier modules */}

      <Route
        path="/cashier/dashboard"
        element={
          <ProtectedRoutes allowedRoles={["3"]}>
            <CashierDashboard />
          </ProtectedRoutes>
        }
      />
      {/* <Route
        path="/cashier/onlineapplication"
        element={
          <ProtectedRoutes allowedRoles={["3"]}>
            <CashierStudentOnlineApplication />
          </ProtectedRoutes>
        }
      /> */}
      <Route
        path="/cashier/cashierpayment"
        element={
          <ProtectedRoutes allowedRoles={["3"]}>
            <CashierPayment />
          </ProtectedRoutes>
        }
      />

      {/* End of Cashier modules */}


      {/* Start of finance module */}

      <Route
        path="/finance/dashboard"
        element={
          <ProtectedRoutes allowedRoles={["4"]}>
            <FinanceDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/finance/templates"
        element={
          <ProtectedRoutes allowedRoles={["4"]}>
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
