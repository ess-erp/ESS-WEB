import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import MainLayout from "../layouts/MainLayout";
import { SidebarProvider } from "../context/SidebarContext";
import Login from "../pages/Auth/Login";
import AccessDenied from "../components/SharedComponents/AccessDenied";
import AdmissionDashboard from "../pages/Admission/Dashboard";
import Registration from "../pages/Index/Registration";
import AccountActivation from "../components/RegistrationComponents/AccountActivation";
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
import StudentHoldClearance from "../pages/CFW/StudentHoldClearance";
import AcademicStudentHoldClearance from "../pages/AcademicStaff/StudentHoldClearance";
import CashierDashboard from "../pages/Cashier/Dashboard";
//import CashierStudentOnlineApplication from "../pages/Cashier/StudentOnlineApplication";
import CashierPayment from "../pages/Cashier/CashierPayment";
import CashierTransactionHistory from "../pages/Cashier/TransactionHistory";
import SruDashboard from "../pages/SRU/Dashboard";
import SruOnlineApplication from "../pages/SRU/StudentOnlineApplication";
import StudentMasterFile from "../pages/SRU/StudentMasterFile";
import SectionAndHouseEntry from "../pages/SRU/SectionAndHouseEntry";
import SruSchoolCalendar from "../pages/SRU/SchoolCalendar";
import SruArcMasterList from "../pages/SRU/ArcMasterList";
import SruGradeReportTemplate from "../pages/SRU/GradeReportTemplate";
import SruSummarySheet from "../pages/SRU/SummarySheet";
import AcademicDashboard from "../pages/AcademicStaff/Dashboard";
import AcadFacultyLoadEntry from "../pages/AcademicStaff/FacultyLoadEntry";
import AcadSubjectLoadEntry from "../pages/AcademicStaff/SubjectLoadEntry";
import AcadSubjectScheduleLoadEntry from "../pages/AcademicStaff/SubjectScheduleLoadEntry";
import AcademicAdviserNonAdviser from "../pages/AcademicStaff/AssignAdviserNonAdviser";
import AcademicCurriculumEntry from "../pages/AcademicStaff/CurriculumEntry";
import HrDashboard from "../pages/HumanResources/Dashboard";
import HrOnlineApplication from "../pages/HumanResources/EmployeeOnlineApp";
import HrEmployeeAppForm from "../pages/HumanResources/EmployeeAppForm";
import HrEmployeeHiringProcess from "../pages/HumanResources/EmployeeHiringProcess";
import HrTemplates from "../pages/HumanResources/Templates";
import HrEmployeeInitialInterview from "../pages/HumanResources/EmployeeInitialInterview";
import HrDtrManagement from "../pages/HumanResources/DtrManagement";
import HrLeaveFiling from "../pages/HumanResources/LeaveFiling";
import HrEmployeeList from "../pages/HumanResources/EmployeeList";
import HrDeductionsManagement from "../pages/HumanResources/DeductionsManagement";
import HrFacultyLoadEntryPrototype from "../pages/HumanResources/FacultyLoadEntryPrototype";
import PayrollProcessing from "../pages/HumanResources/PayrollProcessing";
import EmployeePayrollList from "../pages/HumanResources/EmployeePayrollList";
import PayrollSummaryReport from "../pages/HumanResources/PayrollSummaryReport";
import EmployeeDataManagement from "../components/HrComponents/EmployeeDataManagementComponent";
import ParentDashboard from "../pages/ParentPortal/Dashboard";
import ParentEnrollStudent from "../pages/ParentPortal/EnrollStudent";
import SacDashboard from "../pages/Sac/Dashboard";
import SacOnlineApplication from "../pages/Sac/EmployeeOnlineApp";
import SacEmployeeinitialInterview from "../pages/Sac/EmployeeInitialInterview";
import ApDashboard from "../pages/AssistantPrincipal/Dashboard";
import ApOnlineApplication from "../pages/AssistantPrincipal/EmployeeOnlineApp";
import ApEmployeeInitialInterview from "../pages/AssistantPrincipal/EmployeeInitialInterview";
import PrincipalDashboard from "../pages/Principal/Dashboard";
import PrincipalOnlineApplication from "../pages/Principal/EmployeeOnlineApp";
import PrincipalEmployeeInitialInterview from "../pages/Principal/EmployeeInitialInterview";
import ListOfStudent from "../pages/ParentPortal/ListOfStudent";
import StudentAppComponent from "../components/ParentPortalComponents/StudentAppComponent";
import TeacherDashboard from "../pages/Teacher/Dashboard";
import TeacherListOfSection from "../pages/Teacher/ListOfSection";
import TeacherEncodingOfGradeClub from "../pages/Teacher/EncodingOfGradeClub";
import StudentDashboard from "../pages/Student/Dashboard";
import Notification from "../pages/SharedPages/Notification";
import Profile from "../pages/SharedPages/Profile";
import Ticketing from "../pages/SharedPages/Ticketing";
import TimeAndAttendance from "../pages/SharedPages/TimeAndAttendance";
import PayrollAndCompensation from "../pages/SharedPages/PayrollAndCompensation";
import GlobalToastHandler from "../GlobalFunction/GlobalToastHandler";
import CurriculumEntry from "../pages/AcademicStaff/CurriculumEntry";
import AccountingDashboard from "../pages/Accounting/Dashboard";
import AccountingChartOfAccounts from "../pages/Accounting/ChartOfAccounts";
import AccountingAddCoaTransaction from "../pages/Accounting/AddCoaTransaction";
import AccountingJournalEntry from "../pages/Accounting/JournalEntry";
import AccountingSiSeries from "../pages/Accounting/SiSeries";
import AccountingFeeAssessment from "../pages/Accounting/FeeAssessment";
import AccountingStudentLedger from "../pages/Accounting/StudentLedger";
import AccountingFinancialReports from "../pages/Accounting/FinancialReports";
import AccountingGeneralLedger from "../pages/Accounting/GeneralLedger";
import AccountingPayrollProcessApproval from "../pages/Accounting/PayrollProcessApproval";
import AccountingCashBankManagement from "../pages/Accounting/CashBankManagement";
import PurchasingDashboard from "../pages/Purchasing/Dashboard";
import PurchasingInventoryManagement from "../pages/Purchasing/InventoryManagement";
import PurchasingRequestForm from "../pages/Purchasing/RequestForm";
import PurchasingPurchaseOrder from "../pages/Purchasing/PurchaseOrder";
import PurchasingSupplier from "../pages/Purchasing/Supplier";
import PurchasingRfNumberSeries from "../pages/Purchasing/RfNumberSeries";
import FinanceDashboard from "../pages/Finance/Dashboard";
import FinancePayrollBatches from "../pages/Finance/PayrollBatches";
import SuperAdminDashboard from "../pages/SuperAdmin/Dashboard";
import SuperAdminUserMaintenance from "../pages/SuperAdmin/UserMaintenance";
import SuperAdminPasswordReset from "../pages/SuperAdmin/AdminPasswordReset";
import SuperAdminLoginLogs from "../pages/SuperAdmin/UserLoginLogs";




const AuthenticatedLayout = () => {
  return (
    <>
      <GlobalToastHandler /> {/* Live toasts will only activate for children inside this group */}
      <MainLayout>
        <Outlet />             {/* This renders the actual matched page component */}
      </MainLayout>
    </>
  );
};


const AppRoutes = () => (
  <Router>
    <SidebarProvider>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="accountactivation" element={<AccountActivation />} />
      <Route path="/accessdenied" element={<AccessDenied />} />
      <Route path="/employeeonlineapplication" element={<EmployeeOnlineApplication />} />
      <Route path="/employeecongratulationletter" element={<EmployeeCongratsLetter />} />

      <Route element={<AuthenticatedLayout />}>
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
            <ProtectedRoutes allowedRoles={[1,20]}>
              <StudentOnlineApplication />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admission/studentappform"
          element={
            <ProtectedRoutes allowedRoles={[1,20]}>
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
        <Route
          path="/cfw/studentholdclearance"
          element={
            <ProtectedRoutes allowedRoles={[2]}>
              <StudentHoldClearance />
            </ProtectedRoutes>
          }
        />
        {/* End of CFW Modules */}


        {/* Cashier modules */}

        <Route
          path="/cashier/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[3, 20]}>
              <CashierDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/cashier/cashierpayment"
          element={
            <ProtectedRoutes allowedRoles={[3, 20]}>
              <CashierPayment />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/cashier/transactionhistory"
          element={
            <ProtectedRoutes allowedRoles={[3, 20]}>
              <CashierTransactionHistory />
            </ProtectedRoutes>
          }
        />

        {/* End of Cashier modules */}


        {/* SRU Modules */}
        <Route
          path="/sru/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[5, 20]}>
              <SruDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sru/studentlist"
          element={
            <ProtectedRoutes allowedRoles={[5, 20]}>
              <SruOnlineApplication />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sru/StudentMasterFile"
          element={
            <ProtectedRoutes allowedRoles={[5, 20]}>
              <StudentMasterFile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sru/sectionandhouseentry"
          element={
            <ProtectedRoutes allowedRoles={[5, 20]}>
              <SectionAndHouseEntry />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sru/schoolcalendar"
          element={
            <ProtectedRoutes allowedRoles={[5, 20]}>
              <SruSchoolCalendar />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sru/arcmasterlist"
          element={
            <ProtectedRoutes allowedRoles={[5, 20]}>
              <SruArcMasterList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sru/gradereporttemplate"
          element={
            <ProtectedRoutes allowedRoles={[5, 20]}>
              <SruGradeReportTemplate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sru/summarysheet"
          element={
            <ProtectedRoutes allowedRoles={[5, 20]}>
              <SruSummarySheet />
            </ProtectedRoutes>
          }
        />
        {/* End of Sru modules */}

        {/* start of academic modules */}
        <Route
          path="/academic/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[6, 20]}>
              <AcademicDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/academic/facultyloadentry"
          element={
            <ProtectedRoutes allowedRoles={[6, 20]}>
              <AcadFacultyLoadEntry />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/academic/subjectloadentry"
          element={
            <ProtectedRoutes allowedRoles={[6, 20]}>
              <AcadSubjectLoadEntry />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/academic/subjectscheduleloadentry"
          element={
            <ProtectedRoutes allowedRoles={[6, 20]}>
              <AcadSubjectScheduleLoadEntry />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/academic/assignadvisernonadviser"
          element={
            <ProtectedRoutes allowedRoles={[6, 20]}>
              <AcademicAdviserNonAdviser />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/academic/curriculumentry"
          element={
            <ProtectedRoutes allowedRoles={[6, 20]}>
              <AcademicCurriculumEntry />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/academic/studentholdclearance"
          element={
            <ProtectedRoutes allowedRoles={[6, 20]}>
              <AcademicStudentHoldClearance />
            </ProtectedRoutes>
          }
        />
        {/* end of academics modules */}

        {/* start of hr modules */}

        <Route
          path="/hrd/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <HrDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/hrd/onlineapplication"
          element={
            <ProtectedRoutes allowedRoles={[7, 10, 20]}>
              <HrOnlineApplication />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/employeeappform"
          element={
            <ProtectedRoutes allowedRoles={[7, 10, 20]}>
              <HrEmployeeAppForm />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/employeehiringprocess"
          element={
            <ProtectedRoutes allowedRoles={[7, 10, 20]}>
              <HrEmployeeHiringProcess />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/templates"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <HrTemplates />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/payroll-processing"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <PayrollProcessing />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/faculty-load-entry-prototype"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <HrFacultyLoadEntryPrototype />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/employee-payroll"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <EmployeePayrollList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/payroll-reports"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <PayrollSummaryReport />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/employeeinitialinterview"
          element={
            <ProtectedRoutes allowedRoles={[10, 20]}>
              <HrEmployeeInitialInterview />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/dtr-management"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <HrDtrManagement />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/leave-filing"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <HrLeaveFiling />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/employee-list"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <HrEmployeeList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/employeedatamanagement/:employeeId"
          element={
            <ProtectedRoutes allowedRoles={[7, 8, 9, 10, 20]}>
              <EmployeeDataManagement />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/employeeappform/:employeeId"
          element={
            <ProtectedRoutes allowedRoles={[7, 10, 20]}>
              <HrEmployeeAppForm />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hrd/deductions"
          element={
            <ProtectedRoutes allowedRoles={[7, 10, 20]}>
              <HrDeductionsManagement />
            </ProtectedRoutes>
          }
        />
        {/* end of hr modules */}

        {/* start of sac modules */}

        <Route
          path="/sac/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[11, 20]}>
              <SacDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sac/onlineapplication"
          element={
            <ProtectedRoutes allowedRoles={[11, 20]}>
              <SacOnlineApplication />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sac/employeeinitialinterview"
          element={
            <ProtectedRoutes allowedRoles={[11, 20]}>
              <SacEmployeeinitialInterview />
            </ProtectedRoutes>
          }
        />

        {/* end of sac modules */}

        {/* start of ap modules */}
        <Route
          path="/ap/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[12, 20]}>
              <ApDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/ap/onlineapplication"
          element={
            <ProtectedRoutes allowedRoles={[12, 20]}>
              <ApOnlineApplication />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/ap/employeeinitialinterview"
          element={
            <ProtectedRoutes allowedRoles={[12, 20]}>
              <ApEmployeeInitialInterview />
            </ProtectedRoutes>
          }
        />
        {/* end of ap modules */}

        {/* start of principal modules */}
        <Route
          path="/principal/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[13, 20]}>
              <PrincipalDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/principal/onlineapplication"
          element={
            <ProtectedRoutes allowedRoles={[13, 20]}>
              <PrincipalOnlineApplication />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/principal/employeeinitialinterview"
          element={
            <ProtectedRoutes allowedRoles={[13, 20]}>
              <PrincipalEmployeeInitialInterview />
            </ProtectedRoutes>
          }
        />
        {/* end of principal modules */}

        {/* Start of Parent Portal */}
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[17, 20]}>
              <ParentDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/parent/enrollstudent"
          element={
            <ProtectedRoutes allowedRoles={[17, 20]}>
              <ParentEnrollStudent />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/parent/listofstudent"
          element={
            <ProtectedRoutes allowedRoles={[17, 20]}>
              <ListOfStudent />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/parent/pendingliststudentform"
          element={
            <ProtectedRoutes allowedRoles={[17, 20]}>
              <StudentAppComponent />
            </ProtectedRoutes>
          }
        />

        {/* End of Parent portal  */}


        {/* start of teacher modules */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[14, 15, 20]}>
              <TeacherDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/teacher/listofsection"
          element={
            <ProtectedRoutes allowedRoles={[14, 15, 20]}>
              <TeacherListOfSection />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/teacher/encodingofgradeorclub"
          element={
            <ProtectedRoutes allowedRoles={[14]}>
              <TeacherEncodingOfGradeClub />
            </ProtectedRoutes>
          }
        />

        {/* end of teacher modules */}

        {/* student dashboard */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[16]}>
              <StudentDashboard />
            </ProtectedRoutes>
          }
        />

        {/*  */}


        {/* start of accounting module */}

         <Route
          path="/accounting/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/chartofaccounts"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingChartOfAccounts />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/addcoatransaction"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingAddCoaTransaction />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/journalentry"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingJournalEntry />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/siseries"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingSiSeries />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/fee-assessment"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingFeeAssessment />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/student-ledger"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingStudentLedger />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/financial-reports"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingFinancialReports />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/general-ledger"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingGeneralLedger />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/cash-bank"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingCashBankManagement />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/accounting/payroll-process-approval"
          element={
            <ProtectedRoutes allowedRoles={[18, 20]}>
              <AccountingPayrollProcessApproval />
            </ProtectedRoutes>
          }
        />

        {/* end of accounting module */}

        {/* start of purchasing module */}

        <Route
          path="/purchasing/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[19, 20]}>
              <PurchasingDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/purchasing/inventory"
          element={
            <ProtectedRoutes allowedRoles={[19, 20]}>
              <PurchasingInventoryManagement />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/purchasing/requestform"
          element={
            <ProtectedRoutes allowedRoles={[19, 20]}>
              <PurchasingRequestForm />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/purchasing/purchaseorder"
          element={
            <ProtectedRoutes allowedRoles={[19, 20]}>
              <PurchasingPurchaseOrder />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/purchasing/supplier"
          element={
            <ProtectedRoutes allowedRoles={[19, 20]}>
              <PurchasingSupplier />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/purchasing/rf-number-series"
          element={
            <ProtectedRoutes allowedRoles={[19, 20]}>
              <PurchasingRfNumberSeries />
            </ProtectedRoutes>
          }
        />

        {/* end of purchasing module */}

        {/* start of finance module */}
        <Route
          path="/finance/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[4, 20]}>
              <FinanceDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/finance/payroll-batches"
          element={
            <ProtectedRoutes allowedRoles={[4, 20]}>
              <FinancePayrollBatches />
            </ProtectedRoutes>
          }
        />
        {/* end of finance module */}

        {/* start of super admin module */}
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoutes allowedRoles={[20]}>
              <SuperAdminDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/super-admin/user-maintenance"
          element={
            <ProtectedRoutes allowedRoles={[20]}>
              <SuperAdminUserMaintenance />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/super-admin/password-reset"
          element={
            <ProtectedRoutes allowedRoles={[20]}>
              <SuperAdminPasswordReset />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/super-admin/login-logs"
          element={
            <ProtectedRoutes allowedRoles={[20]}>
              <SuperAdminLoginLogs />
            </ProtectedRoutes>
          }
        />
        {/* end of super admin module */}

        {/* shared components */}


        <Route
          path="/notification"
          element={
            <ProtectedRoutes allowedRoles={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}>
              <Notification />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/ticketing"
          element={
            <ProtectedRoutes allowedRoles={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}>
              <Ticketing />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes allowedRoles={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}>
              <Profile />
            </ProtectedRoutes>
          }
        />

        {/* Employee Portal Routes */}
        <Route
          path="/employee/time-attendance"
          element={
            <ProtectedRoutes allowedRoles={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20]}>
              <TimeAndAttendance />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/employee/payroll"
          element={
            <ProtectedRoutes allowedRoles={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20]}>
              <PayrollAndCompensation />
            </ProtectedRoutes>
          }
        />

      </Route>

      {/* end of shared components */}

      {/* Catch-all route → Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </SidebarProvider>
  </Router>
);

export default AppRoutes;