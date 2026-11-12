import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Users, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import PayrollApprovalDataTable from '../../components/AccountingComponents/PayrollApprovalDataTable';

// ─── Currency helper ──────────────────────────────────────────────────────────
const currency = (val = 0) =>
    `₱${Number(val ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const PayrollProcessApproval = () => {
    const dispatch = useDispatch();

    // ── Redux state — aggregate summary derived from table data ───────────────
    const { data: tableData } = useSelector(
        (s) => s.finance?.payrollApprovalTableState || { data: [] }
    );

    // ── Local state ───────────────────────────────────────────────────────────
    const [selectedStatus, setSelectedStatus] = useState('pending');

    useEffect(() => {
        document.title = 'Payroll Process Approval | Accounting';
    }, []);

    const breadcrumbItems = [
        { label: 'Accounting', href: '/accounting/dashboard' },
        { label: 'Payroll Process Approval', href: '/accounting/payroll-process-approval' },
    ];

    // ── Derive KPI numbers from whatever the table currently holds ────────────
    const pendingRows  = (tableData || []).filter((r) => (r.Status ?? r.status)?.toLowerCase() === 'pending');
    const approvedRows = (tableData || []).filter((r) => (r.Status ?? r.status)?.toLowerCase() === 'approved');

    const pendingCount      = pendingRows.length;
    const totalBudget       = pendingRows.reduce((s, r) => s + (r.TotalNetPay ?? r.totalNetPay ?? 0), 0);
    const totalEmployees    = pendingRows.reduce((s, r) => s + (r.TotalEmployees ?? r.totalEmployees ?? 0), 0);
    const approvedAmount    = approvedRows.reduce((s, r) => s + (r.TotalNetPay ?? r.totalNetPay ?? 0), 0);

    const cardVariants = {
        hidden:  { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // ── Status tab config ─────────────────────────────────────────────────────
    const tabs = [
        { label: 'Pending',  value: 'pending',  activeClass: 'bg-yellow-500 text-white shadow-md' },
        { label: 'Approved', value: 'approved', activeClass: 'bg-green-600  text-white shadow-md' },
        { label: 'Rejected', value: 'rejected', activeClass: 'bg-red-600    text-white shadow-md' },
        { label: 'All',      value: '',         activeClass: 'bg-blue-600   text-white shadow-md' },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            {/* Header */}
            <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-3xl font-bold text-gray-900 mt-2">Payroll Process Approval</h2>
                <p className="text-gray-600 mt-1">
                    Manage and approve payroll batches, monitor budget allocations
                </p>
            </div>

            {/* ── KPI Cards ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Pending Payrolls */}
                <motion.div
                    initial="hidden" animate="visible" variants={cardVariants}
                    transition={{ duration: 0.3, delay: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">Pending Payrolls</p>
                            <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
                            <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
                        </div>
                        <div className="p-4 bg-yellow-100 rounded-full">
                            <Clock size={28} className="text-yellow-600" />
                        </div>
                    </div>
                </motion.div>

                {/* Total Budget Required */}
                <motion.div
                    initial="hidden" animate="visible" variants={cardVariants}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Budget Required</p>
                            <p className="text-2xl font-bold text-gray-900">{currency(totalBudget)}</p>
                            <p className="text-xs text-gray-500 mt-2">All pending batches</p>
                        </div>
                        <div className="p-4 bg-blue-100 rounded-full">
                            <DollarSign size={28} className="text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                            <TrendingUp size={14} />
                            <span className="font-medium">Budget allocation tracking</span>
                        </div>
                    </div>
                </motion.div>

                {/* Employees Processed */}
                <motion.div
                    initial="hidden" animate="visible" variants={cardVariants}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">Employees Processed</p>
                            <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
                            <p className="text-xs text-gray-500 mt-2">In pending payrolls</p>
                        </div>
                        <div className="p-4 bg-purple-100 rounded-full">
                            <Users size={28} className="text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-600">Across all departments</p>
                    </div>
                </motion.div>

                {/* Approved Amount */}
                <motion.div
                    initial="hidden" animate="visible" variants={cardVariants}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">Approved Amount</p>
                            <p className="text-2xl font-bold text-gray-900">{currency(approvedAmount)}</p>
                            <p className="text-xs text-gray-500 mt-2">This month</p>
                        </div>
                        <div className="p-4 bg-green-100 rounded-full">
                            <CheckCircle size={28} className="text-green-600" />
                        </div>
                    </div>
                    {approvedAmount > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-green-600">
                                <CheckCircle size={14} />
                                <span className="font-medium">Successfully processed</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ── Info Banner ─────────────────────────────────────────────────── */}
            <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <strong className="font-bold">Payroll Approval</strong>
                        <p className="block sm:inline ml-0 sm:ml-2">
                            Review and approve payroll records submitted by the HR department.
                            Click <em>View</em> to inspect individual period details before approving or rejecting.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Status Tabs + Table ─────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Payroll Process Management</h3>

                    {/* Tab filter */}
                    <div className="inline-flex rounded-lg shadow-sm bg-gray-100 p-1" role="group">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setSelectedStatus(tab.value)}
                                className={`px-5 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer focus:outline-none ${
                                    selectedStatus === tab.value
                                        ? tab.activeClass
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Animated table swap on tab change */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedStatus}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                    >
                        <PayrollApprovalDataTable statusFilter={selectedStatus} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PayrollProcessApproval;
