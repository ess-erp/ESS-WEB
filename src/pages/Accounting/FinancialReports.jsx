import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FileText, Download, Filter, Calendar, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import FinancialReportDataTable from '../../components/AccountingComponents/FinancialReportDataTable';
import { fetchFinancialReport } from '../../states/AccountingState/Action';

const FinancialReports = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'Financial Reports | Accountant';
    }, []);

    const breadcrumbItems = [
        { label: 'Accounting', href: '/accounting/dashboard' },
        { label: 'Financial Reports', href: '/accounting/financial-reports' }
    ];

    const [sidebarOpen, setSidebarOpen]       = useState(true);
    const [selectedReport, setSelectedReport] = useState('daily-collection');
    const [dateFrom, setDateFrom]             = useState('2026-10-01');
    const [dateTo, setDateTo]                 = useState('2026-10-25');

    // ── Report type config ────────────────────────────────────────────────────
    const reportTypes = [
        {
            key:         'daily-collection',
            label:       'Daily Collection Report',
            description: 'Cashier collections breakdown by payment method',
            icon:        DollarSign,
        },
        {
            key:         'aging',
            label:       'Aging of Accounts',
            description: 'Student receivables aged by days outstanding',
            icon:        BarChart3,
        },
        {
            key:         'income',
            label:       'Income Statement',
            description: 'Summary of revenue by account type',
            icon:        PieChart,
        },
    ];

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleApplyFilters = () => {
        dispatch(fetchFinancialReport(selectedReport, { dateFrom, dateTo }));
    };

    const handleExport = () => {
        // TODO: wire up export endpoint
        alert('Export coming soon.');
    };

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Financial Report</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Financial Report
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This is the financial report section.</span>
                        </div>

                        <div className="space-y-6">
                            {/* ── Report Type Selector ──────────────────────── */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Report Type</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {reportTypes.map(({ key, label, description, icon: Icon }) => {
                                        const active = selectedReport === key;
                                        return (
                                            <motion.button
                                                key={key}
                                                whileHover={{ scale: 1.02, y: -4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedReport(key)}
                                                className={`flex flex-col items-start p-5 rounded-xl border-2 transition-all text-left ${
                                                    active
                                                        ? 'border-green-600 bg-green-50 shadow-md'
                                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                }`}
                                            >
                                                <div className={`p-3 rounded-lg mb-3 ${active ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                    <Icon size={24} className={active ? 'text-green-600' : 'text-gray-600'} />
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-1">{label}</h4>
                                                <p className="text-sm text-gray-600">{description}</p>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* ── Filters ───────────────────────────────────── */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Filter size={20} />
                                    Report Filters
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleApplyFilters}
                                            className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Filter size={18} />
                                            Apply Filters
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleExport}
                                            className="flex-1 bg-white border-2 border-green-600 text-green-600 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2"
                                        >
                                            <Download size={18} />
                                            Export
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ── Data Table ────────────────────────────────── */}
                            <FinancialReportDataTable
                                reportType={selectedReport}
                                dateFrom={dateFrom}
                                dateTo={dateTo}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FinancialReports;
