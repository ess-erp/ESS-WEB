import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import { 
  Search, 
  FileText, 
  Download, 
  Mail, 
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import ModalComponent from '../../components/ButtonsComponents/ModalComponent';

// Mock employee payroll data
const mockPayrollData = [
  {
    id: 1,
    employeeNo: 'EMP-001',
    employeeName: 'Juan Dela Cruz',
    position: 'Senior Teacher',
    department: 'Academic Department',
    basicSalary: 35000,
    allowances: 5000,
    deductions: 3500,
    netPay: 36500,
    payPeriod: 'January 1-15, 2026',
    status: 'Paid'
  },
  {
    id: 2,
    employeeNo: 'EMP-002',
    employeeName: 'Maria Santos',
    position: 'Department Head',
    department: 'Academic Department',
    basicSalary: 45000,
    allowances: 7000,
    deductions: 4800,
    netPay: 47200,
    payPeriod: 'January 1-15, 2026',
    status: 'Paid'
  },
  {
    id: 3,
    employeeNo: 'EMP-003',
    employeeName: 'Pedro Garcia',
    position: 'Teacher',
    department: 'Academic Department',
    basicSalary: 28000,
    allowances: 3500,
    deductions: 2800,
    netPay: 28700,
    payPeriod: 'January 1-15, 2026',
    status: 'Paid'
  },
  {
    id: 4,
    employeeNo: 'EMP-004',
    employeeName: 'Ana Reyes',
    position: 'HR Manager',
    department: 'Human Resources',
    basicSalary: 42000,
    allowances: 6000,
    deductions: 4200,
    netPay: 43800,
    payPeriod: 'January 1-15, 2026',
    status: 'Paid'
  },
  {
    id: 5,
    employeeNo: 'EMP-005',
    employeeName: 'Carlos Mendoza',
    position: 'IT Support',
    department: 'Information Technology',
    basicSalary: 32000,
    allowances: 4000,
    deductions: 3200,
    netPay: 32800,
    payPeriod: 'January 1-15, 2026',
    status: 'Processing'
  }
];

const EmployeePayrollList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [filteredData, setFilteredData] = useState(mockPayrollData);

  const breadcrumbItems = [
    { label: 'Human Resources', href: '/hrd/dashboard' },
    { label: 'Employee Payroll', href: '/hrd/employee-payroll' }
  ];

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = mockPayrollData.filter(
      (item) =>
        item.employeeName.toLowerCase().includes(value) ||
        item.employeeNo.toLowerCase().includes(value) ||
        item.position.toLowerCase().includes(value) ||
        item.department.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // View payslip
  const handleViewPayslip = (employee) => {
    setSelectedEmployee(employee);
    setShowPayslipModal(true);
  };

  // Send payslip via email
  const handleSendEmail = (employee) => {
    alert(`Sending payslip to ${employee.employeeName}'s email...`);
  };

  // Download payslip
  const handleDownload = (employee) => {
    alert(`Downloading payslip for ${employee.employeeName}...`);
  };

  // Calculate summary statistics
  const totalEmployees = filteredData.length;
  const totalGrossPay = filteredData.reduce((sum, emp) => sum + emp.basicSalary + emp.allowances, 0);
  const totalNetPay = filteredData.reduce((sum, emp) => sum + emp.netPay, 0);
  const totalDeductions = filteredData.reduce((sum, emp) => sum + emp.deductions, 0);

  // DataTable columns
  const columns = [
    {
      name: 'Employee No',
      selector: (row) => row.employeeNo,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Employee Name',
      selector: (row) => row.employeeName,
      sortable: true,
      width: '180px',
    },
    {
      name: 'Position',
      selector: (row) => row.position,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Department',
      selector: (row) => row.department,
      sortable: true,
      width: '180px',
    },
    {
      name: 'Basic Salary',
      selector: (row) => row.basicSalary,
      sortable: true,
      format: (row) => `₱${row.basicSalary.toLocaleString()}`,
      width: '130px',
    },
    {
      name: 'Net Pay',
      selector: (row) => row.netPay,
      sortable: true,
      format: (row) => `₱${row.netPay.toLocaleString()}`,
      width: '130px',
      cell: (row) => (
        <span className="font-semibold text-green-600">
          ₱{row.netPay.toLocaleString()}
        </span>
      ),
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      width: '110px',
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.status === 'Paid'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: 'Actions',
      width: '150px',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewPayslip(row)}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="View Payslip"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDownload(row)}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => handleSendEmail(row)}
            className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
            title="Send Email"
          >
            <Mail size={18} />
          </button>
        </div>
      ),
    },
  ];

  // Custom styles for DataTable
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#059669',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '8px 8px 0 0',
      },
    },
    rows: {
      style: {
        minHeight: '56px',
        '&:hover': {
          backgroundColor: '#f0fdf4',
          cursor: 'pointer',
        },
        animation: 'fadeInUp 0.5s ease-in-out',
      },
    },
  };

  return (
    <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
      <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 min-h-screen bg-gray-50 px-6 py-4"
      >
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 mb-2 mt-2"
          >
            Employee Payroll List
          </motion.h1>
          <p className="text-gray-600">View and manage employee payroll records</p>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalEmployees}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Gross Pay</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₱{totalGrossPay.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Net Pay</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₱{totalNetPay.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Deductions</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₱{totalDeductions.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FileText className="text-red-600" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by employee name, number, position, or department..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          highlightOnHover
          customStyles={customStyles}
          noDataComponent={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              </motion.div>
              <p className="text-gray-500 text-lg">No employee payroll records found</p>
            </motion.div>
          }
        />
      </motion.div>

      {/* Payslip Preview Modal */}
      {showPayslipModal && selectedEmployee && (
        <ModalComponent
          isOpen={showPayslipModal}
          onClose={() => {
            setShowPayslipModal(false);
            setSelectedEmployee(null);
          }}
          title={`Payslip - ${selectedEmployee.employeeName}`}
          size="max-w-3xl"
        >
          <div className="p-6">
            {/* Company Header */}
            <div className="text-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Elizabeth Seton School</h2>
              <p className="text-gray-600">Payslip for {selectedEmployee.payPeriod}</p>
            </div>

            {/* Employee Information */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Employee Number</p>
                <p className="font-semibold text-gray-800">{selectedEmployee.employeeNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employee Name</p>
                <p className="font-semibold text-gray-800">{selectedEmployee.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-semibold text-gray-800">{selectedEmployee.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-semibold text-gray-800">{selectedEmployee.department}</p>
              </div>
            </div>

            {/* Earnings and Deductions */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Earnings */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Earnings
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Basic Salary</span>
                    <span className="font-semibold">₱{selectedEmployee.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Allowances</span>
                    <span className="font-semibold">₱{selectedEmployee.allowances.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-green-700">Gross Pay</span>
                    <span className="font-bold text-green-700">
                      ₱{(selectedEmployee.basicSalary + selectedEmployee.allowances).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  Deductions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">SSS</span>
                    <span className="font-semibold">₱{(selectedEmployee.deductions * 0.35).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">PhilHealth</span>
                    <span className="font-semibold">₱{(selectedEmployee.deductions * 0.30).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Pag-IBIG</span>
                    <span className="font-semibold">₱{(selectedEmployee.deductions * 0.20).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Withholding Tax</span>
                    <span className="font-semibold">₱{(selectedEmployee.deductions * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-red-700">Total Deductions</span>
                    <span className="font-bold text-red-700">₱{selectedEmployee.deductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white text-center">
              <p className="text-lg mb-2">Net Pay</p>
              <p className="text-4xl font-bold">₱{selectedEmployee.netPay.toLocaleString()}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDownload(selectedEmployee)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
              <button
                onClick={() => handleSendEmail(selectedEmployee)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Send via Email
              </button>
            </div>
          </div>
        </ModalComponent>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      </motion.div>
    </div>
  );
};

export default EmployeePayrollList;
