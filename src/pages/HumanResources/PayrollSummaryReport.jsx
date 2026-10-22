import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Download, 
  Printer, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  PieChart,
  BarChart3
} from 'lucide-react';
import DataTable from 'react-data-table-component';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';

// Mock payroll summary data
const mockDepartmentSummary = [
  {
    id: 1,
    department: 'Academic Department',
    employeeCount: 45,
    totalGrossPay: 1575000,
    totalDeductions: 157500,
    totalNetPay: 1417500
  },
  {
    id: 2,
    department: 'Human Resources',
    employeeCount: 8,
    totalGrossPay: 336000,
    totalDeductions: 33600,
    totalNetPay: 302400
  },
  {
    id: 3,
    department: 'Finance Department',
    employeeCount: 12,
    totalGrossPay: 504000,
    totalDeductions: 50400,
    totalNetPay: 453600
  },
  {
    id: 4,
    department: 'Information Technology',
    employeeCount: 6,
    totalGrossPay: 252000,
    totalDeductions: 25200,
    totalNetPay: 226800
  },
  {
    id: 5,
    department: 'Admission Office',
    employeeCount: 5,
    totalGrossPay: 175000,
    totalDeductions: 17500,
    totalNetPay: 157500
  },
  {
    id: 6,
    department: 'Maintenance',
    employeeCount: 10,
    totalGrossPay: 280000,
    totalDeductions: 28000,
    totalNetPay: 252000
  }
];

const mockContributionSummary = [
  { type: 'SSS', amount: 108675, percentage: 35 },
  { type: 'PhilHealth', amount: 93150, percentage: 30 },
  { type: 'Pag-IBIG', amount: 62100, percentage: 20 },
  { type: 'Withholding Tax', amount: 46575, percentage: 15 }
];

const PayrollSummaryReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-01-15');
  const [viewType, setViewType] = useState('department'); // 'department' or 'contribution'
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.title = 'Payroll Reports | HRD';
  }, []);

  const breadcrumbItems = [
    { label: 'Human Resources', href: '/hrd/dashboard' },
    { label: 'Payroll Reports', href: '/hrd/payroll-reports' }
  ];

  // Calculate totals
  const totalEmployees = mockDepartmentSummary.reduce((sum, dept) => sum + dept.employeeCount, 0);
  const totalGrossPay = mockDepartmentSummary.reduce((sum, dept) => sum + dept.totalGrossPay, 0);
  const totalDeductions = mockDepartmentSummary.reduce((sum, dept) => sum + dept.totalDeductions, 0);
  const totalNetPay = mockDepartmentSummary.reduce((sum, dept) => sum + dept.totalNetPay, 0);

  // Department columns
  const departmentColumns = [
    {
      name: 'Department',
      selector: (row) => row.department,
      sortable: true,
      width: '250px',
      cell: (row) => (
        <div className="font-semibold text-gray-800">{row.department}</div>
      ),
    },
    {
      name: 'Employees',
      selector: (row) => row.employeeCount,
      sortable: true,
      width: '120px',
      cell: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {row.employeeCount}
        </span>
      ),
    },
    {
      name: 'Gross Pay',
      selector: (row) => row.totalGrossPay,
      sortable: true,
      format: (row) => `₱${row.totalGrossPay.toLocaleString()}`,
      width: '150px',
    },
    {
      name: 'Deductions',
      selector: (row) => row.totalDeductions,
      sortable: true,
      format: (row) => `₱${row.totalDeductions.toLocaleString()}`,
      width: '150px',
      cell: (row) => (
        <span className="text-red-600 font-medium">
          ₱{row.totalDeductions.toLocaleString()}
        </span>
      ),
    },
    {
      name: 'Net Pay',
      selector: (row) => row.totalNetPay,
      sortable: true,
      format: (row) => `₱${row.totalNetPay.toLocaleString()}`,
      width: '150px',
      cell: (row) => (
        <span className="text-green-600 font-semibold">
          ₱{row.totalNetPay.toLocaleString()}
        </span>
      ),
    },
    {
      name: 'Percentage',
      selector: (row) => ((row.totalNetPay / totalNetPay) * 100).toFixed(2),
      sortable: true,
      width: '120px',
      cell: (row) => {
        const percentage = ((row.totalNetPay / totalNetPay) * 100).toFixed(2);
        return (
          <div className="flex items-center gap-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{percentage}%</span>
          </div>
        );
      },
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Downloading payroll summary report...');
  };

  return (
    <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
      <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
      <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
          <h2 className="text-sm font-bold text-black mt-2">Payroll Summary Report</h2>
        </div>

        <section className="flex items-center justify-center h-[calc(100%-5rem)]">
          <div className="flex flex-col space-y-4 h-full w-full">
            <hr className="border-t-1 border-solid border-gray-400 my-6" />
            <div className="flex justify-center">
              <h2 className="text-2xl font-bold text-green-500 mt-2">
                Payroll Summary Report
              </h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Note: </strong>
              <span className="block sm:inline">This is the payroll summary report section.</span>
            </div>
            <div>

      {/* Period Selector and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Period
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Type
              </label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="department">By Department</option>
                <option value="contribution">By Contribution</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm font-medium">Total Employees</p>
            <Users className="text-blue-200" size={24} />
          </div>
          <p className="text-3xl font-bold">{totalEmployees}</p>
          <p className="text-blue-100 text-xs mt-2">Across all departments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100 text-sm font-medium">Total Gross Pay</p>
            <TrendingUp className="text-green-200" size={24} />
          </div>
          <p className="text-3xl font-bold">₱{totalGrossPay.toLocaleString()}</p>
          <p className="text-green-100 text-xs mt-2">Before deductions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-100 text-sm font-medium">Total Deductions</p>
            <TrendingDown className="text-red-200" size={24} />
          </div>
          <p className="text-3xl font-bold">₱{totalDeductions.toLocaleString()}</p>
          <p className="text-red-100 text-xs mt-2">
            {((totalDeductions / totalGrossPay) * 100).toFixed(2)}% of gross pay
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100 text-sm font-medium">Total Net Pay</p>
            <DollarSign className="text-purple-200" size={24} />
          </div>
          <p className="text-3xl font-bold">₱{totalNetPay.toLocaleString()}</p>
          <p className="text-purple-100 text-xs mt-2">After all deductions</p>
        </motion.div>
      </div>

      {/* Main Content - Department View */}
      {viewType === 'department' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-green-600" size={24} />
              Department Breakdown
            </h2>
          </div>
          <DataTable
            columns={departmentColumns}
            data={mockDepartmentSummary}
            pagination
            paginationPerPage={10}
            highlightOnHover
            customStyles={customStyles}
            noDataComponent={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No data available</p>
              </motion.div>
            }
          />
        </motion.div>
      )}

      {/* Main Content - Contribution View */}
      {viewType === 'contribution' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <PieChart className="text-green-600" size={24} />
            Statutory Contributions Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockContributionSummary.map((contribution, index) => (
              <motion.div
                key={contribution.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{contribution.type}</h3>
                  <span className="text-2xl font-bold text-green-600">
                    {contribution.percentage}%
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                      style={{ width: `${contribution.percentage}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {contribution.percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-xl font-bold text-gray-800">
                    ₱{contribution.amount.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total Contributions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-2">
                  Total Statutory Contributions
                </p>
                <p className="text-4xl font-bold">₱{totalDeductions.toLocaleString()}</p>
              </div>
              <FileText className="text-green-200" size={48} />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Payroll Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Gross Pay</span>
              <span className="font-semibold text-gray-800">
                ₱{(totalGrossPay / totalEmployees).toLocaleString(undefined, {
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Net Pay</span>
              <span className="font-semibold text-gray-800">
                ₱{(totalNetPay / totalEmployees).toLocaleString(undefined, {
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Deduction Rate</span>
              <span className="font-semibold text-gray-800">
                {((totalDeductions / totalGrossPay) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Largest Department</span>
              <span className="font-semibold text-gray-800">Academic Dept (45)</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="text-purple-600" size={20} />
            Department Distribution
          </h3>
          <div className="space-y-3">
            {mockDepartmentSummary.map((dept) => {
              const percentage = ((dept.employeeCount / totalEmployees) * 100).toFixed(1);
              return (
                <div key={dept.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{dept.department}</span>
                    <span className="text-gray-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PayrollSummaryReport;
