import { useEffect, useState } from 'react';
import { Calendar, DollarSign, Users, Calculator, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import { motion } from "framer-motion";

const PayrollProcessing = () => {
    useEffect(() => {
        document.title = 'Payroll Processing | HRD';
    }, []);

    const breadcrumbItems = [
        { label: 'Human Resources', href: '/hrd/dashboard' },
        { label: 'Payroll Processing', href: '/hrd/payroll-processing' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // Mock payroll data
    const mockPayrollData = [
        {
            id: 1,
            employeeId: 'EMP-2026-001',
            employeeName: 'Juan Dela Cruz',
            position: 'Senior Teacher',
            department: 'High School',
            basicSalary: 35000.00,
            allowances: 5000.00,
            grossPay: 40000.00,
            sss: 1350.00,
            philHealth: 900.00,
            pagIbig: 200.00,
            tax: 3500.00,
            totalDeductions: 5950.00,
            netPay: 34050.00,
            status: 'Processed'
        },
        {
            id: 2,
            employeeId: 'EMP-2026-015',
            employeeName: 'Maria Santos',
            position: 'Department Head',
            department: 'Elementary',
            basicSalary: 45000.00,
            allowances: 7000.00,
            grossPay: 52000.00,
            sss: 1350.00,
            philHealth: 1200.00,
            pagIbig: 200.00,
            tax: 6800.00,
            totalDeductions: 9550.00,
            netPay: 42450.00,
            status: 'Processed'
        },
        {
            id: 3,
            employeeId: 'EMP-2026-023',
            employeeName: 'Pedro Garcia',
            position: 'Teacher',
            department: 'Junior High School',
            basicSalary: 28000.00,
            allowances: 3500.00,
            grossPay: 31500.00,
            sss: 1125.00,
            philHealth: 750.00,
            pagIbig: 200.00,
            tax: 2100.00,
            totalDeductions: 4175.00,
            netPay: 27325.00,
            status: 'Processed'
        },
    ];

    const columns = [
        {
            name: 'Employee ID',
            selector: row => row.employeeId,
            sortable: true,
            width: '130px'
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
            cell: row => `₱${row.basicSalary.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            width: '130px'
        },
        {
            name: 'Gross Pay',
            selector: row => row.grossPay,
            sortable: true,
            cell: row => (
                <span className="font-semibold text-green-600">
                    ₱{row.grossPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '130px'
        },
        {
            name: 'Deductions',
            selector: row => row.totalDeductions,
            sortable: true,
            cell: row => (
                <span className="font-semibold text-red-600">
                    ₱{row.totalDeductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '130px'
        },
        {
            name: 'Net Pay',
            selector: row => row.netPay,
            sortable: true,
            cell: row => (
                <span className="font-bold text-blue-600">
                    ₱{row.netPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '140px'
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    {row.status}
                </span>
            ),
            width: '100px'
        },
    ];

    // Calculate totals
    const totalGrossPay = mockPayrollData.reduce((sum, emp) => sum + emp.grossPay, 0);
    const totalDeductions = mockPayrollData.reduce((sum, emp) => sum + emp.totalDeductions, 0);
    const totalNetPay = mockPayrollData.reduce((sum, emp) => sum + emp.netPay, 0);
    const totalSSS = mockPayrollData.reduce((sum, emp) => sum + emp.sss, 0);
    const totalPhilHealth = mockPayrollData.reduce((sum, emp) => sum + emp.philHealth, 0);
    const totalPagIbig = mockPayrollData.reduce((sum, emp) => sum + emp.pagIbig, 0);
    const totalTax = mockPayrollData.reduce((sum, emp) => sum + emp.tax, 0);

    const handleProcessPayroll = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            // Show success message
        }, 2000);
    };

    const handlePostToJournal = () => {
        setIsPostModalOpen(true);
    };

    const confirmPostToJournal = () => {
        // TODO: Implement posting to journal entry
        console.log('Posting payroll to journal entry...');
        setIsPostModalOpen(false);
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-2xl font-bold text-black mt-2">Payroll Processing</h2>
                </div>

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
                                onClick={handlePostToJournal}
                                disabled={!selectedPeriod}
                                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FileText size={18} />
                                Post to Journal Entry
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
                                    ₱{(totalGrossPay / 1000).toFixed(1)}K
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
                                    ₱{(totalDeductions / 1000).toFixed(1)}K
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
                                    ₱{(totalNetPay / 1000).toFixed(1)}K
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
                                ₱{totalSSS.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-sm text-green-700 font-medium">PhilHealth Contributions</p>
                            <p className="text-xl font-bold text-green-900 mt-1">
                                ₱{totalPhilHealth.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-sm text-yellow-700 font-medium">Pag-IBIG Contributions</p>
                            <p className="text-xl font-bold text-yellow-900 mt-1">
                                ₱{totalPagIbig.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <p className="text-sm text-red-700 font-medium">Withholding Tax</p>
                            <p className="text-xl font-bold text-red-900 mt-1">
                                ₱{totalTax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
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

                {/* Post to Journal Entry Modal */}
                <ModalComponent
                    isOpen={isPostModalOpen}
                    onClose={() => setIsPostModalOpen(false)}
                    title="Post Payroll to Journal Entry"
                    size="w-full max-w-2xl"
                    body={
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <FileText className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-900 mb-1">Journal Entry Mapping</h4>
                                        <p className="text-xs text-blue-800">
                                            This action will create a journal entry posting payroll expenses and liabilities to your Chart of Accounts.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Accounts to be Posted:</h4>
                                
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Account</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Debit</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Credit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-gray-900">Salaries & Wages Expense</td>
                                                <td className="px-4 py-3 text-sm text-right text-blue-600 font-semibold">
                                                    ₱{totalGrossPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-400">—</td>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">SSS Payable</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-400">—</td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                                                    ₱{totalSSS.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-gray-900">PhilHealth Payable</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-400">—</td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                                                    ₱{totalPhilHealth.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">Pag-IBIG Payable</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-400">—</td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                                                    ₱{totalPagIbig.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-gray-900">Withholding Tax Payable</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-400">—</td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                                                    ₱{totalTax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">Salaries Payable</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-400">—</td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                                                    ₱{totalNetPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr className="bg-blue-50 font-bold">
                                                <td className="px-4 py-3 text-sm text-gray-900">TOTALS:</td>
                                                <td className="px-4 py-3 text-sm text-right text-blue-600">
                                                    ₱{totalGrossPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600">
                                                    ₱{totalGrossPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-xs text-yellow-800">
                                    <strong>Note:</strong> This will create an unposted journal entry. You can review and post it from the Journal Entry module.
                                </p>
                            </div>
                        </div>
                    }
                    buttons={[
                        {
                            label: "Confirm & Post",
                            type: "green",
                            onClick: confirmPostToJournal
                        },
                        {
                            label: "Cancel",
                            type: "red",
                            onClick: () => setIsPostModalOpen(false)
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default PayrollProcessing;
