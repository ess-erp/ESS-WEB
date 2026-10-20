import { useEffect, useState } from 'react';
import { FileText, Download, Filter, Calendar, DollarSign, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import DataTable from "react-data-table-component";

const FinancialReports = () => {
    useEffect(() => {
        document.title = 'Financial Reports | Accountant';
    }, []);

    const breadcrumbItems = [
        { label: 'Accounting', href: '/accounting/dashboard' },
        { label: 'Financial Reports', href: '/accounting/financial-reports' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedReport, setSelectedReport] = useState('daily-collection');
    const [dateFrom, setDateFrom] = useState('2026-08-01');
    const [dateTo, setDateTo] = useState('2026-08-25');

    // Mock data for Daily Collection Report
    const mockDailyCollection = [
        {
            date: '2026-08-25',
            cashier: 'Maria Santos',
            orStart: 'OR-2026-00120',
            orEnd: 'OR-2026-00135',
            cash: 45000.00,
            gcash: 12500.00,
            bank: 8000.00,
            total: 65500.00
        },
        {
            date: '2026-08-24',
            cashier: 'Maria Santos',
            orStart: 'OR-2026-00105',
            orEnd: 'OR-2026-00119',
            cash: 38000.00,
            gcash: 15000.00,
            bank: 12000.00,
            total: 65000.00
        },
        {
            date: '2026-08-23',
            cashier: 'John Cruz',
            orStart: 'OR-2026-00090',
            orEnd: 'OR-2026-00104',
            cash: 52000.00,
            gcash: 18500.00,
            bank: 6500.00,
            total: 77000.00
        },
    ];

    // Mock data for Aging Report
    const mockAgingReport = [
        {
            studentId: '2026-001',
            studentName: 'Juan Dela Cruz',
            grade: 'Grade 7',
            current: 5000.00,
            days30: 0,
            days60: 0,
            days90: 10000.00,
            totalDue: 15000.00
        },
        {
            studentId: '2026-089',
            studentName: 'Pedro Rodriguez',
            grade: 'Grade 9',
            current: 15000.00,
            days30: 12200.00,
            days60: 8000.00,
            days90: 6000.00,
            totalDue: 41200.00
        },
        {
            studentId: '2026-112',
            studentName: 'Ana Santos',
            grade: 'Grade 10',
            current: 0,
            days30: 0,
            days60: 25000.00,
            days90: 36200.00,
            totalDue: 61200.00
        },
    ];

    // Mock data for Income Statement
    const mockIncomeStatement = [
        { account: 'Tuition Fee Income', amount: 1250000.00, percentage: 75.5 },
        { account: 'Miscellaneous Fees', amount: 285000.00, percentage: 17.2 },
        { account: 'Laboratory Fees', amount: 85000.00, percentage: 5.1 },
        { account: 'Other Income', amount: 35000.00, percentage: 2.1 },
    ];

    const dailyCollectionColumns = [
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Cashier',
            selector: row => row.cashier,
            sortable: true,
        },
        {
            name: 'OR Range',
            selector: row => `${row.orStart} - ${row.orEnd}`,
            sortable: false,
            width: '220px'
        },
        {
            name: 'Cash',
            selector: row => row.cash,
            sortable: true,
            cell: row => `₱${row.cash.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            width: '130px'
        },
        {
            name: 'GCash',
            selector: row => row.gcash,
            sortable: true,
            cell: row => `₱${row.gcash.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            width: '130px'
        },
        {
            name: 'Bank',
            selector: row => row.bank,
            sortable: true,
            cell: row => `₱${row.bank.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            width: '130px'
        },
        {
            name: 'Total',
            selector: row => row.total,
            sortable: true,
            cell: row => (
                <span className="font-bold text-green-600">
                    ₱{row.total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '140px'
        },
    ];

    const agingColumns = [
        {
            name: 'Student ID',
            selector: row => row.studentId,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Student Name',
            selector: row => row.studentName,
            sortable: true,
        },
        {
            name: 'Grade',
            selector: row => row.grade,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Current',
            selector: row => row.current,
            sortable: true,
            cell: row => `₱${row.current.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            width: '120px'
        },
        {
            name: '1-30 Days',
            selector: row => row.days30,
            sortable: true,
            cell: row => row.days30 > 0 ? (
                <span className="text-yellow-600 font-semibold">
                    ₱{row.days30.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ) : '—',
            width: '120px'
        },
        {
            name: '31-60 Days',
            selector: row => row.days60,
            sortable: true,
            cell: row => row.days60 > 0 ? (
                <span className="text-orange-600 font-semibold">
                    ₱{row.days60.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ) : '—',
            width: '120px'
        },
        {
            name: '90+ Days',
            selector: row => row.days90,
            sortable: true,
            cell: row => row.days90 > 0 ? (
                <span className="text-red-600 font-semibold">
                    ₱{row.days90.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ) : '—',
            width: '120px'
        },
        {
            name: 'Total Due',
            selector: row => row.totalDue,
            sortable: true,
            cell: row => (
                <span className="font-bold text-gray-900">
                    ₱{row.totalDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '140px'
        },
    ];

    const totalDailyCollection = mockDailyCollection.reduce((sum, row) => sum + row.total, 0);
    const totalAging = mockAgingReport.reduce((sum, row) => sum + row.totalDue, 0);
    const totalIncome = mockIncomeStatement.reduce((sum, row) => sum + row.amount, 0);

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
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-2xl font-bold text-black mt-2"
                    >
                        Financial Reports
                    </motion.h2>
                </div>

                {/* Report Type Selector */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Select Report Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedReport('daily-collection')}
                            className={`flex flex-col items-start p-5 rounded-xl border-2 transition-all ${
                                selectedReport === 'daily-collection'
                                    ? 'border-green-600 bg-green-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                            <motion.div 
                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                                className={`p-3 rounded-lg mb-3 ${
                                    selectedReport === 'daily-collection' ? 'bg-green-100' : 'bg-gray-100'
                                }`}
                            >
                                <DollarSign size={24} className={selectedReport === 'daily-collection' ? 'text-green-600' : 'text-gray-600'} />
                            </motion.div>
                            <h4 className="font-bold text-gray-900 mb-1">Daily Collection Report</h4>
                            <p className="text-sm text-gray-600">Cashier collections breakdown by payment method</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedReport('aging')}
                            className={`flex flex-col items-start p-5 rounded-xl border-2 transition-all ${
                                selectedReport === 'aging'
                                    ? 'border-green-600 bg-green-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                            <motion.div 
                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                                className={`p-3 rounded-lg mb-3 ${
                                    selectedReport === 'aging' ? 'bg-green-100' : 'bg-gray-100'
                                }`}
                            >
                                <BarChart3 size={24} className={selectedReport === 'aging' ? 'text-green-600' : 'text-gray-600'} />
                            </motion.div>
                            <h4 className="font-bold text-gray-900 mb-1">Aging of Accounts</h4>
                            <p className="text-sm text-gray-600">Student receivables aged by days outstanding</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedReport('income')}
                            className={`flex flex-col items-start p-5 rounded-xl border-2 transition-all ${
                                selectedReport === 'income'
                                    ? 'border-green-600 bg-green-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                            <motion.div 
                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                                className={`p-3 rounded-lg mb-3 ${
                                    selectedReport === 'income' ? 'bg-green-100' : 'bg-gray-100'
                                }`}
                            >
                                <PieChart size={24} className={selectedReport === 'income' ? 'text-green-600' : 'text-gray-600'} />
                            </motion.div>
                            <h4 className="font-bold text-gray-900 mb-1">Income Statement</h4>
                            <p className="text-sm text-gray-600">Summary of revenue by account type</p>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Filter size={20} />
                        Report Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date From
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date To
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Filter size={18} />
                                Apply Filters
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 bg-white border-2 border-green-600 text-green-600 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                Export
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Daily Collection Report */}
                <AnimatePresence mode="wait">
                    {selectedReport === 'daily-collection' && (
                        <motion.div 
                            key="daily-collection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Collections', value: totalDailyCollection, color: 'green', icon: DollarSign, delay: 0.1 },
                                    { label: 'Cash Payments', value: mockDailyCollection.reduce((sum, r) => sum + r.cash, 0), color: 'blue', icon: DollarSign, delay: 0.2 },
                                    { label: 'GCash Payments', value: mockDailyCollection.reduce((sum, r) => sum + r.gcash, 0), color: 'purple', icon: DollarSign, delay: 0.3 },
                                    { label: 'Bank Transfers', value: mockDailyCollection.reduce((sum, r) => sum + r.bank, 0), color: 'yellow', icon: DollarSign, delay: 0.4 }
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: stat.delay }}
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        className="bg-white rounded-2xl shadow-md border border-gray-100 p-5"
                                    >
                                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                                        <p className={`text-2xl font-bold ${idx === 0 ? 'text-green-600' : 'text-gray-900'} mt-1`}>
                                            ₱{stat.value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Collection Details</h3>
                                <DataTable
                                    columns={dailyCollectionColumns}
                                    data={mockDailyCollection}
                                    pagination
                                    highlightOnHover
                                    striped
                                    responsive
                                    customStyles={{
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
                                            },
                                        },
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Aging Report */}
                <AnimatePresence mode="wait">
                    {selectedReport === 'aging' && (
                        <motion.div 
                            key="aging"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Receivables', value: totalAging, color: 'red', delay: 0.1 },
                                    { label: 'Current', value: mockAgingReport.reduce((sum, r) => sum + r.current, 0), color: 'gray', delay: 0.2 },
                                    { label: '1-60 Days', value: mockAgingReport.reduce((sum, r) => sum + r.days30 + r.days60, 0), color: 'yellow', delay: 0.3 },
                                    { label: '90+ Days', value: mockAgingReport.reduce((sum, r) => sum + r.days90, 0), color: 'red', delay: 0.4 }
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: stat.delay }}
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        className="bg-white rounded-2xl shadow-md border border-gray-100 p-5"
                                    >
                                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                                        <p className={`text-2xl font-bold ${
                                            idx === 0 || idx === 3 ? 'text-red-600' : 
                                            idx === 2 ? 'text-yellow-600' : 'text-gray-900'
                                        } mt-1`}>
                                            ₱{stat.value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Aging of Accounts Receivable</h3>
                                <DataTable
                                    columns={agingColumns}
                                    data={mockAgingReport}
                                    pagination
                                    highlightOnHover
                                    striped
                                    responsive
                                    customStyles={{
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
                                            },
                                        },
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Income Statement */}
                <AnimatePresence mode="wait">
                    {selectedReport === 'income' && (
                        <motion.div 
                            key="income"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Summary Card */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                whileHover={{ scale: 1.01 }}
                                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200 shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                                        <p className="text-4xl font-bold text-green-600 mt-2">
                                            ₱{totalIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">For the period {dateFrom} to {dateTo}</p>
                                    </div>
                                    <motion.div 
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                        className="bg-green-100 p-4 rounded-lg"
                                    >
                                        <TrendingUp size={48} className="text-green-600" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Income by Account</h3>
                                <div className="space-y-4">
                                    {mockIncomeStatement.map((item, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.3 + (idx * 0.1) }}
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{item.account}</p>
                                                <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.percentage}%` }}
                                                        transition={{ duration: 1, delay: 0.5 + (idx * 0.1), ease: "easeOut" }}
                                                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="ml-6 text-right">
                                                <motion.p 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.7 + (idx * 0.1) }}
                                                    className="text-xl font-bold text-gray-900"
                                                >
                                                    ₱{item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </motion.p>
                                                <p className="text-sm text-gray-600 mt-1">{item.percentage}%</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default FinancialReports;
