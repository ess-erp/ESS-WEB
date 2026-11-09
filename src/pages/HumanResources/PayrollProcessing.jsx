import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, DollarSign, Users, Calculator, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import { motion } from "framer-motion";
import { 
    calculatePayrollForPeriod, 
    fetchPayrollDetails,
    submitPayrollForApproval,
    fetchPayrollPeriodsData,
} from "../../states/HumanResourcesState/Action";

const PayrollProcessing = () => {
    const dispatch = useDispatch();
    
    // Redux state
    const { 
        calculatePayrollForPeriodState = { loading: false, data: null, error: '' },
        payrollDetailsState = { loading: false, data: null, error: '' },
        submitPayrollForApprovalState = { loading: false, data: null, error: '' },
        payrollPeriodsState = { loading: false, data: [], error: '', totalRecords: 0 }
    } = useSelector(state => state.hr || {});

    useEffect(() => {
        document.title = 'Payroll Processing | HRD';
        // Fetch payroll periods on mount
        dispatch(fetchPayrollPeriodsData());
    }, [dispatch]);

    const breadcrumbItems = [
        { label: 'Human Resources', href: '/hrd/dashboard' },
        { label: 'Payroll Processing', href: '/hrd/payroll-processing' }
    ];

    const [selectedPeriod, setSelectedPeriod] = useState('');

    // Get payroll data from Redux state
    const payrollData = payrollDetailsState.data;
    const payrollSummary = payrollData?.summary || {};
    const mockPayrollData = payrollData?.lineItems || [];

    // Calculate totals from real data or use summary totals
    const totalGrossPay = payrollSummary.totalGrossPay || 0;
    const totalDeductions = payrollSummary.totalDeductions || 0;
    const totalNetPay = payrollSummary.totalNetPay || 0;
    const totalSSS = payrollSummary.totalSss || 0;
    const totalPhilHealth = payrollSummary.totalPhilHealth || 0;
    const totalPagIbig = payrollSummary.totalPagIbig || 0;
    const totalTax = payrollSummary.totalWithholdingTax || 0;
    const isProcessing = calculatePayrollForPeriodState.loading;

    // Handle period change - fetch payroll details when period is selected
    useEffect(() => {
        if (selectedPeriod) {
            dispatch(fetchPayrollDetails({ periodId: parseInt(selectedPeriod) }));
        }
    }, [selectedPeriod, dispatch]);

    const handleProcessPayroll = async () => {
        if (!selectedPeriod) {
            alert('Please select a payroll period');
            return;
        }

        const result = await dispatch(calculatePayrollForPeriod({ 
            periodId: parseInt(selectedPeriod),
            calendarId: null // Add calendar selection if needed
        }));

        if (result.ok) {
            alert(result.message || 'Payroll calculated successfully');
            // Refresh payroll details
            dispatch(fetchPayrollDetails({ periodId: parseInt(selectedPeriod) }));
        } else {
            alert(result.error || 'Failed to calculate payroll');
        }
    };

    const handleSubmitForApproval = async () => {
        if (!selectedPeriod) {
            alert('Please select a payroll period');
            return;
        }

        if (!window.confirm('Are you sure you want to submit this payroll for Finance Head approval?')) {
            return;
        }

        const result = await dispatch(submitPayrollForApproval({
            periodId: parseInt(selectedPeriod),
            remarks: '' // Optional remarks
        }));

        if (result.ok) {
            alert(result.message || 'Payroll submitted for approval successfully');
            // Optionally refresh the payroll details
            dispatch(fetchPayrollDetails({ periodId: parseInt(selectedPeriod) }));
        } else {
            alert(result.error || 'Failed to submit payroll for approval');
        }
    };

    const columns = [
        {
            name: 'Employee Number',
            selector: row => row.employeeNumber,
            sortable: true,
            width: '150px'
        },
        {
            name: 'Employee Name',
            selector: row => row.employeeName,
            sortable: true,
            wrap: true
        },
        {
            name: 'Position',
            selector: row => row.position,
            sortable: true,
            wrap: true,
            width: '150px'
        },
        {
            name: 'Basic Salary',
            selector: row => row.basicSalary,
            sortable: true,
            cell: row => `?${row.basicSalary.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            width: '140px'
        },
        {
            name: 'Gross Pay',
            selector: row => row.grossPay,
            sortable: true,
            cell: row => (
                <span className="font-semibold text-green-600">
                    ?{row.grossPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '140px'
        },
        {
            name: 'Deductions',
            selector: row => row.totalDeductions,
            sortable: true,
            cell: row => (
                <span className="font-semibold text-red-600">
                    ?{row.totalDeductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '140px'
        },
        {
            name: 'Net Pay',
            selector: row => row.netPay,
            sortable: true,
            cell: row => (
                <span className="font-bold text-blue-600">
                    ?{row.netPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '140px'
        },
        {
            name: 'Status',
            selector: row => row.payrollStatus,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    row.payrollStatus === 'POSTED' ? 'bg-green-100 text-green-700' :
                    row.payrollStatus === 'FINALIZED' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                }`}>
                    {row.payrollStatus}
                </span>
            ),
            width: '120px'
        },
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Payroll Processing</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Payroll Processing
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This is the payroll processing section.</span>
                        </div>
                        <div>

                {/* Period Selection */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-blue-600" />
                        Payroll Period
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Period <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Select Payroll Period --</option>
                                <option value="2026-08-1">August 1-15, 2026</option>
                                <option value="2026-08-2">August 16-31, 2026</option>
                                <option value="2026-09-1">September 1-15, 2026</option>
                                <option value="2026-09-2">September 16-30, 2026</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleProcessPayroll}
                                disabled={!selectedPeriod || isProcessing}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Calculator size={18} />
                                        Calculate Payroll
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleSubmitForApproval}
                                disabled={!selectedPeriod || !payrollData || submitPayrollForApprovalState.loading}
                                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitPayrollForApprovalState.loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        Submit for Approval
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-700 font-medium">Total Gross Pay</p>
                                <p className="text-2xl font-bold text-green-900 mt-1">
                                    {(totalGrossPay / 1000).toFixed(1)}
                                </p>
                            </div>
                            <div className="bg-green-600 p-3 rounded-lg">
                                <DollarSign size={24} className="text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-red-700 font-medium">Total Deductions</p>
                                <p className="text-2xl font-bold text-red-900 mt-1">
                                    {(totalDeductions / 1000).toFixed(1)}
                                </p>
                            </div>
                            <div className="bg-red-600 p-3 rounded-lg">
                                <AlertCircle size={24} className="text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-700 font-medium">Total Net Pay</p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">
                                    {(totalNetPay / 1000).toFixed(1)}
                                </p>
                            </div>
                            <div className="bg-blue-600 p-3 rounded-lg">
                                <CheckCircle size={24} className="text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-700 font-medium">Total Employees</p>
                                <p className="text-2xl font-bold text-purple-900 mt-1">
                                    {mockPayrollData.length}
                                </p>
                            </div>
                            <div className="bg-purple-600 p-3 rounded-lg">
                                <Users size={24} className="text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Statutory Contributions Summary */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Statutory Contributions Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm text-blue-700 font-medium">SSS Contributions</p>
                            <p className="text-xl font-bold text-blue-900 mt-1">
                                {totalSSS.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-sm text-green-700 font-medium">PhilHealth Contributions</p>
                            <p className="text-xl font-bold text-green-900 mt-1">
                                {totalPhilHealth.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-sm text-yellow-700 font-medium">Pag-IBIG Contributions</p>
                            <p className="text-xl font-bold text-yellow-900 mt-1">
                                {totalPagIbig.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <p className="text-sm text-red-700 font-medium">Withholding Tax</p>
                            <p className="text-xl font-bold text-red-900 mt-1">
                                {totalTax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Payroll Details Table */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Employee Payroll Details</h3>
                    <DataTable
                        columns={columns}
                        data={mockPayrollData}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        noDataComponent={
                            <div className="py-12 text-center">
                                <Calculator size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">No payroll data processed yet</p>
                                <p className="text-sm text-gray-400 mt-1">Select a period and click "Calculate Payroll"</p>
                            </div>
                        }
                    />
                </motion.div>
                </div>
                    </div>
                </section>
        </div>
    );
};

export default PayrollProcessing;