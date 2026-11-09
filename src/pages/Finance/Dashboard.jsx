import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import PayrollProcessDataTable from '../../components/FinanceComponents/PayrollProcessDataTable';
import { fetchFinanceDashboardSummary } from '../../states/FinanceState/Action';
import { DollarSign, Users, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

const FinanceDashboard = () => {
    const dispatch = useDispatch();

    // Redux state
    const summaryState = useSelector((state) => state.finance?.dashboardSummary || {});
    const { loading: summaryLoading, data: summaryData } = summaryState;

    // Local state
    const [selectedStatus, setSelectedStatus] = useState("pending");

    useEffect(() => {
        document.title = 'Finance Head Dashboard';
        // Fetch dashboard summary on mount
        dispatch(fetchFinanceDashboardSummary());
    }, [dispatch]);

    const breadcrumbItems = [
        { label: 'Finance', href: '/finance/dashboard' },
        { label: 'Dashboard', href: '/finance/dashboard' },
    ];

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    // Format number
    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num || 0);
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            {/* Header */}
            <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-3xl font-bold text-gray-900 mt-2">Finance Head Dashboard</h2>
                <p className="text-gray-600 mt-1">
                    Manage and approve payroll batches, monitor budget allocations
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Pending Payrolls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">Pending Payrolls</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {summaryLoading ? (
                                    <span className="animate-pulse">--</span>
                                ) : (
                                    formatNumber(summaryData?.totalPendingPayrolls || 0)
                                )}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Awaiting approval
                            </p>
                        </div>
                        <div className="p-4 bg-yellow-100 rounded-full">
                            <Clock size={28} className="text-yellow-600" />
                        </div>
                    </div>
                    {!summaryLoading && summaryData?.pendingAmount > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-600">Total Amount</p>
                            <p className="text-sm font-semibold text-yellow-700">
                                {formatCurrency(summaryData?.pendingAmount || 0)}
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Total Budget Required */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Budget Required</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {summaryLoading ? (
                                    <span className="animate-pulse">--</span>
                                ) : (
                                    formatCurrency(summaryData?.totalBudgetRequired || 0)
                                )}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                All pending batches
                            </p>
                        </div>
                        <div className="p-4 bg-blue-100 rounded-full">
                            <DollarSign size={28} className="text-blue-600" />
                        </div>
                    </div>
                    {!summaryLoading && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                                <TrendingUp size={14} />
                                <span className="font-medium">Budget allocation tracking</span>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Total Employees Processed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">Employees Processed</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {summaryLoading ? (
                                    <span className="animate-pulse">--</span>
                                ) : (
                                    formatNumber(summaryData?.totalEmployeesProcessed || 0)
                                )}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                In pending payrolls
                            </p>
                        </div>
                        <div className="p-4 bg-purple-100 rounded-full">
                            <Users size={28} className="text-purple-600" />
                        </div>
                    </div>
                    {!summaryLoading && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-600">Across all departments</p>
                        </div>
                    )}
                </motion.div>

                {/* Approved This Month */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">Approved Amount</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {summaryLoading ? (
                                    <span className="animate-pulse">--</span>
                                ) : (
                                    formatCurrency(summaryData?.approvedAmount || 0)
                                )}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                This month
                            </p>
                        </div>
                        <div className="p-4 bg-green-100 rounded-full">
                            <CheckCircle size={28} className="text-green-600" />
                        </div>
                    </div>
                    {!summaryLoading && summaryData?.approvedAmount > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-green-600">
                                <CheckCircle size={14} />
                                <span className="font-medium">Successfully processed</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Information Banner */}
            <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <strong className="font-bold">Finance Head Dashboard</strong>
                        <p className="block sm:inline ml-0 sm:ml-2">
                            Review and approve payroll batches generated by the HR department. 
                            Click "View Details" to see itemized employee payroll breakdown before approval.
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        Payroll Process Management
                    </h3>
                    <div className="inline-flex rounded-lg shadow-sm bg-gray-100 p-1" role="group">
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("pending")}
                            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer focus:outline-none
                                ${selectedStatus === "pending"
                                    ? "bg-yellow-500 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("approved")}
                            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer focus:outline-none
                                ${selectedStatus === "approved"
                                    ? "bg-green-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Approved
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("rejected")}
                            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer focus:outline-none
                                ${selectedStatus === "rejected"
                                    ? "bg-red-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Rejected
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedStatus("")}
                            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer focus:outline-none
                                ${selectedStatus === ""
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            All
                        </button>
                    </div>
                </div>

                {/* Payroll Process Table */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedStatus}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PayrollProcessDataTable statusFilter={selectedStatus} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FinanceDashboard;
