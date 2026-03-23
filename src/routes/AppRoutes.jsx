import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Auth/Login";
import AccessDenied from "../components/SharedComponents/AccessDenied";
import AdmissionDashboard from "../pages/Admission/Dashboard";
import OnlineApplication from "../pages/Index/OnlineApplication";
import ReturneeFormComponent from "../components/OnlineAppComponents/ReturneeFormComponent";
import CongratsComponent from "../components/OnlineAppComponents/CongratsComponent";
import AccountActivation from "../components/OnlineAppComponents/AccountActivation";
import EmployeeOnlineApplication from "../pages/EmployeeOnlineApplication/OnlineApplication";
import EmployeeCongratsLetter from "../pages/EmployeeOnlineApplication/CongratsLetter";
import StudentOnlineApplication from "../pages/Admission/StudentOnlineApplication";
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
import CashierTransactionHistory from "../pages/Cashier/TransactionHistory";
import FinanceDashboard from "../pages/Finance/Dashboard";
import FinanceTemplatesForm from "../pages/Finance/TemplatesForm";
import SruDashboard from "../pages/SRU/Dashboard";
import SruOnlineApplication from "../pages/SRU/StudentOnlineApplication";
import StudentMasterFile from "../pages/SRU/StudentMasterFile";
import SectionAndHouseEntry from "../pages/SRU/SectionAndHouseEntry";
import AcademicDashboard from "../pages/AcademicStaff/Dashboard";
import AcadFacultyLoadEntry from "../pages/AcademicStaff/FacultyLoadEntry";
import AcadSubjectLoadEntry from "../pages/AcademicStaff/SubjectLoadEntry";
import AcadSubjectScheduleLoadEntry from "../pages/AcademicStaff/SubjectScheduleLoadEntry";
import HrDashboard from "../pages/HumanResources/Dashboard";
import HrOnlineApplication from "../pages/HumanResources/EmployeeOnlineApp";
import HrEmployeeAppForm from "../pages/HumanResources/EmployeeAppForm";
import HrEmployeeHiringProcess from "../pages/HumanResources/EmployeeHiringProcess";
import HrTemplates from "../pages/HumanResources/Templates";
import HrEmployeeInitialInterview from "../pages/HumanResources/EmployeeInitialInterview";
import ParentDashboard from "../pages/ParentPortal/Dashboard";
import ParentEnrollStudent from "../pages/ParentPortal/EnrollStudent";


const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/onlineapplication" element={<OnlineApplication />} />
      <Route path="/returneeform" element={<ReturneeFormComponent />} />
      <Route path="/congratulationletter" element={<CongratsComponent />} />
      <Route path="accountactivation" element={<AccountActivation />} />
      <Route path="/accessdenied" element={<AccessDenied />} />
      <Route path="/employeeonlineapplication" element={<EmployeeOnlineApplication />} />
      <Route path="/employeecongratulationletter" element={<EmployeeCongratsLetter />} />
      {/* ✅ Admissions modules */}
      <Route
        path="/admission/dashboard"
        element={
          <ProtectedRoutes allowedRoles={[1]}>
            <AdmissionDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/onlineapplication"
        element={
          <ProtectedRoutes allowedRoles={[1]}>
            <StudentOnlineApplication />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/studentappform"
        element={
          <ProtectedRoutes allowedRoles={[1]}>
            <StudentOnlineAppForm />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admission/templatesform"
        element={
          <ProtectedRoutes allowedRoles={[1]}>
            <AdmissionTemplatesForm />
          </ProtectedRoutes>
        }
      />
      {/* End of admission modules */}

      {/* ✅ CFW modules */}
      <Route
        path="/cfw/dashboard"
        element={
          <ProtectedRoutes allowedRoles={[2]}>
            <CfwDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cfw/onlineapplication"
        element={
          <ProtectedRoutes allowedRoles={[2]}>
            <CfwStudentOnlineApplication />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cfw/studentappform"
        element={
          <ProtectedRoutes allowedRoles={[2]}>
            <CfwStudentOnlineAppForm />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cfw/examroomtemplates"
        element={
          <ProtectedRoutes allowedRoles={[2]}>
            <CfwExamRoomTemplate />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cfw/templates"
        element={
          <ProtectedRoutes allowedRoles={[2]}>
            <CfwTemplates />
          </ProtectedRoutes>
        }
      />
      {/* End of CFW Modules */}


      {/* Cashier modules */}

      <Route
        path="/cashier/dashboard"
        element={
          <ProtectedRoutes allowedRoles={[3]}>
            <CashierDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cashier/cashierpayment"
        element={
          <ProtectedRoutes allowedRoles={[3]}>
            <CashierPayment />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cashier/transactionhistory"
        element={
          <ProtectedRoutes allowedRoles={[3]}>
            <CashierTransactionHistory />
          </ProtectedRoutes>
        }
      />

      {/* End of Cashier modules */}


      {/* Start of finance module */}

      <Route
        path="/finance/dashboard"
        element={
          <ProtectedRoutes allowedRoles={[3]}>
            <FinanceDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/finance/templates"
        element={
          <ProtectedRoutes allowedRoles={[3]}>
            <FinanceTemplatesForm />
          </ProtectedRoutes>
        }
      />
      {/* End of finance module */}

      {/* SRU Modules */}
      <Route
        path="/sru/dashboard"
        element={
          <ProtectedRoutes allowedRoles={[5]}>
            <SruDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/sru/studentlist"
        element={
          <ProtectedRoutes allowedRoles={[5]}>
            <SruOnlineApplication />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/sru/StudentMasterFile"
        element={
          <ProtectedRoutes allowedRoles={[5]}>
            <StudentMasterFile />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/sru/sectionandhouseentry"
        element={
          <ProtectedRoutes allowedRoles={[5]}>
            <SectionAndHouseEntry />
          </ProtectedRoutes>
        }
      />
      {/* End of Sru modules */}

      {/* start of academics modules */}
      <Route
        path="/academic/dashboard"
        element={
          <ProtectedRoutes allowedRoles={[6]}>
            <AcademicDashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/academic/facultyloadentry"
        element={
          <ProtectedRoutes allowedRoles={[6]}>
            <AcadFacultyLoadEntry />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/academic/subjectloadentry"
        element={
          <ProtectedRoutes allowedRoles={[6]}>
            <AcadSubjectLoadEntry />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/academic/subjectscheduleloadentry"
        element={
          <ProtectedRoutes allowedRoles={[6]}>
            <AcadSubjectScheduleLoadEntry />
          </ProtectedRoutes>
        }
      />
      {/* end of academics modules */}

      {/* start of hr modules */}

      <Route
        path="/hrd/dashboard"
        element={
          <ProtectedRoutes allowedRoles={[7, 8, 9, 10]}>
            <HrDashboard />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/hrd/onlineapplication"
        element={
          <ProtectedRoutes allowedRoles={[7, 10]}>
            <HrOnlineApplication />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/hrd/employeeappform"
        element={
          <ProtectedRoutes allowedRoles={[7, 10]}>
            <HrEmployeeAppForm />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/hrd/employeehiringprocess"
        element={
          <ProtectedRoutes allowedRoles={[7, 10]}>
            <HrEmployeeHiringProcess />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/hrd/templates"
        element={
          <ProtectedRoutes allowedRoles={[7, 8, 9, 10]}>
            <HrTemplates />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/hrd/employeeinitialinterview"
        element={
          <ProtectedRoutes allowedRoles={[10]}>
            <HrEmployeeInitialInterview />
          </ProtectedRoutes>
        }
      />
      {/* end of hr modules */}

      {/* Start of Parent Portal */}
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoutes allowedRoles={[17]}>
            <ParentDashboard />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/parent/enrollstudent"
        element={
          <ProtectedRoutes allowedRoles={[17]}>
            <ParentEnrollStudent />
          </ProtectedRoutes>
        }
      />

      {/* End of Parent portal  */}

      {/* 🚨 Catch-all route → Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;