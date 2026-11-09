import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Users,
  Filter
} from 'lucide-react';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import ModalComponent from '../../components/ButtonsComponents/ModalComponent';
import { fetchEmployeePayrollList, fetchPayrollPeriodsData } from '../../states/HumanResourcesState/Action';
import { showToast } from '../../states/NotificationState/Action';

const EmployeePayrollList = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    employeePayrollListState = { loading: false, data: [], totalRecords: 0, error: '' }, 
    payrollPeriodsState = { loading: false, data: [], error: '', totalRecords: 0 }
  } = useSelector(
    (state) => state.humanResourcesState || {}
  );

  useEffect(() => {
    document.title = 'Employee Payroll | HRD';
  }, []);

  const breadcrumbItems = [
    { label: 'Human Resources', href: '/hrd/dashboard' },
    { label: 'Employee Payroll', href: '/hrd/employee-payroll' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Fetch payroll periods dropdown on mount
  useEffect(() => {
    dispatch(fetchPayrollPeriodsData());
  }, [dispatch]);

  // Fetch employee payroll list when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchEmployeePayrollList(
          currentPage,
          perPage,
          searchTerm || '',
          selectedPeriodId || null,
          null, // departmentId
          null  // status
        ));
      } catch (error) {
        dispatch(showToast({
          message: error.message || 'Failed to fetch employee payroll list',
          type: 'error'
        }));
      }
    };

    fetchData();
  }, [dispatch, currentPage, perPage, selectedPeriodId]);

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Trigger search on Enter or after typing stops
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== undefined) {
        dispatch(fetchEmployeePayrollList(
          1,
          perPage,
          searchTerm || '',
          selectedPeriodId || null,
          null, // departmentId
          null  // status
        ));
        setCurrentPage(1);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle period filter change
  const handlePeriodChange = (e) => {
    setSelectedPeriodId(e.target.value);
    setCurrentPage(1);
  };

  // View payslip
  const handleViewPayslip = (employee) => {
    setSelectedEmployee(employee);
    setShowPayslipModal(true);
  };

  // Send payslip via email
  const handleSendEmail = (employee) => {
    dispatch(showToast({
      message: `Sending payslip to ${employee.employeeName}'s email...`,
      type: 'success'
    }));
    // TODO: Implement actual email sending API call
  };

  // Download payslip
  const handleDownload = (employee) => {
    dispatch(showToast({
      message: `Downloading payslip for ${employee.employeeName}...`,
      type: 'success'
    }));
    // TODO: Implement actual PDF download API call
  };

  // Get payroll data from Redux state
  const payrollData = employeePayrollListState?.data || [];
  const totalRecords = employeePayrollListState?.totalRecords || 0;
  const isLoading = employeePayrollListState?.loading || false;

  // Calculate summary statistics
  const totalEmployees = payrollData.length;
  const totalGrossPay = payrollData.reduce((sum, emp) => sum + (emp.grossPay || 0), 0);
  const totalNetPay = payrollData.reduce((sum, emp) => sum + (emp.netPay || 0), 0);
  const totalDeductions = payrollData.reduce((sum, emp) => sum + (emp.totalDeductions || 0), 0);

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  // DataTable columns
  const columns = [
    {
      name: 'Employee No',
      selector: (row) => row.employeeNumber || '',
      sortable: true,
      width: '130px',
    },
    {
      name: 'Employee Name',
      selector: (row) => row.employeeName || '',
      sortable: true,
      width: '200px',
    },
    {
      name: 'Position',
      selector: (row) => row.position || '',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Department',
      selector: (row) => row.department || '',
      sortable: true,
      width: '180px',
    },
    {
      name: 'Pay Period',
      selector: (row) => row.payrollPeriod || '',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Gross Pay',
      selector: (row) => row.grossPay || 0,
      sortable: true,
      format: (row) => `₱${(row.grossPay || 0).toLocaleString()}`,
      width: '130px',
    },
    {
      name: 'Net Pay',
      selector: (row) => row.netPay || 0,
      sortable: true,
      format: (row) => `₱${(row.netPay || 0).toLocaleString()}`,
      width: '130px',
      cell: (row) => (
        <span className="font-semibold text-green-600">
          ₱{(row.netPay || 0).toLocaleString()}
        </span>
      ),
    },
    {
      name: 'Status',
      selector: (row) => row.status || '',
      sortable: true,
      width: '110px',
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.status === 'A' || row.status === 'Paid'
              ? 'bg-green-100 text-green-700'
              : row.status === 'P' || row.status === 'Processing'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {row.status === 'A' ? 'Paid' : row.status === 'P' ? 'Processing' : row.status}
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
    <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
          <h2 className="text-sm font-bold text-black mt-2">Employee Payroll List</h2>
        </div>

        <section className="flex items-center justify-center h-[calc(100%-5rem)]">
          <div className="flex flex-col space-y-4 h-full w-full">
            <hr className="border-t-1 border-solid border-gray-400 my-6" />
            <div className="flex justify-center">
              <h2 className="text-2xl font-bold text-green-500 mt-2">
                Employee Payroll List
              </h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Note: </strong>
              <span className="block sm:inline">This is the employee payroll list table.</span>
            </div>
            <div>

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
                  <div className="md:w-64">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        value={selectedPeriodId}
                        onChange={handlePeriodChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                        disabled={payrollPeriodsState?.loading}
                      >
                        <option value="">All Pay Periods</option>
                        {payrollPeriodsState?.data?.map((period) => (
                          <option key={period.PeriodId} value={period.PeriodId}>
                            {period.PeriodName}
                          </option>
                        ))}
                      </select>
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
                  data={payrollData}
                  progressPending={isLoading}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRecords}
                  paginationDefaultPage={currentPage}
                  paginationPerPage={perPage}
                  paginationRowsPerPageOptions={[10, 20, 30, 50]}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handlePerRowsChange}
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
                      <p className="text-gray-500 text-lg">
                        {employeePayrollListState?.error 
                          ? `Error: ${employeePayrollListState.error}` 
                          : 'No employee payroll records found'}
                      </p>
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
                        <p className="font-semibold text-gray-800">{selectedEmployee.employeeNumber}</p>
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
                      <div>
                        <p className="text-sm text-gray-600">Pay Period</p>
                        <p className="font-semibold text-gray-800">{selectedEmployee.payrollPeriod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-semibold text-gray-800">{selectedEmployee.status === 'A' ? 'Paid' : selectedEmployee.status === 'P' ? 'Processing' : selectedEmployee.status}</p>
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
                            <span className="text-gray-700">Gross Pay</span>
                            <span className="font-semibold">₱{(selectedEmployee.grossPay || 0).toLocaleString()}</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between">
                            <span className="font-bold text-green-700">Total Earnings</span>
                            <span className="font-bold text-green-700">
                              ₱{(selectedEmployee.grossPay || 0).toLocaleString()}
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
                            <span className="text-gray-700">Total Deductions</span>
                            <span className="font-semibold">₱{(selectedEmployee.totalDeductions || 0).toLocaleString()}</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between">
                            <span className="font-bold text-red-700">Total Deductions</span>
                            <span className="font-bold text-red-700">₱{(selectedEmployee.totalDeductions || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Net Pay */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white text-center">
                      <p className="text-lg mb-2">Net Pay</p>
                      <p className="text-4xl font-bold">₱{(selectedEmployee.netPay || 0).toLocaleString()}</p>
                      {selectedEmployee.payDate && (
                        <p className="text-sm mt-2 opacity-90">
                          Pay Date: {new Date(selectedEmployee.payDate).toLocaleDateString()}
                        </p>
                      )}
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

            </div>
          </div>
        </section>
        </div>
    );
};

export default EmployeePayrollList;
