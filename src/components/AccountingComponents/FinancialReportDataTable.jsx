import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, TrendingUp, FileText, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from 'react-data-table-component';
import { fetchFinancialReport } from '../../states/AccountingState/Action';

// ─── Helper ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Shared table styles ──────────────────────────────────────────────────────
const tableStyles = {
    headRow: {
        style: {
            backgroundColor: '#059669',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            minHeight: '48px',
        },
    },
    headCells: { style: { paddingLeft: '16px', paddingRight: '16px' } },
    rows: {
        style: {
            minHeight: '56px',
            '&:hover': { backgroundColor: '#f0fdf4', cursor: 'pointer' },
        },
    },
    cells: { style: { paddingLeft: '16px', paddingRight: '16px' } },
};

// ─── Column definitions ───────────────────────────────────────────────────────
const dailyCollectionColumns = [
    {
        name: 'Date',
        selector: (r) => r.Date,
        sortable: true,
        width: '130px',
        cell: (r) => r.Date
            ? new Date(r.Date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' })
            : '—',
    },
    {
        name: 'Cashier',
        selector: (r) => r.CashierName,
        sortable: true,
        grow: 1,
        cell: (r) => <span className="font-medium text-gray-900">{r.CashierName || '—'}</span>,
    },
    {
        name: 'SI Number',
        selector: (r) => r.OrRange,
        sortable: false,
        grow: 2,
        cell: (r) => <span className="text-xs font-mono text-gray-700">{r.OrRange || '—'}</span>,
    },
    {
        name: 'Cash',
        selector: (r) => Number(r.Cash || 0),
        sortable: true,
        grow: 1,
        cell: (r) => `₱${fmt(r.Cash)}`,
    },
    {
        name: 'Bank',
        selector: (r) => Number(r.Bank || 0),
        sortable: true,
        grow: 1,
        cell: (r) => `₱${fmt(r.Bank)}`,
    },
    {
        name: 'Total',
        selector: (r) => Number(r.Total || 0),
        sortable: true,
        grow: 1,
        cell: (r) => (
            <span className="font-bold text-green-600">₱{fmt(r.Total)}</span>
        ),
    },
];

const agingColumns = [
    { name: 'Student ID',   selector: (r) => r.StudentId   ?? r.studentId,   sortable: true, width: '120px' },
    { name: 'Student Name', selector: (r) => r.StudentName ?? r.studentName, sortable: true },
    { name: 'Grade',        selector: (r) => r.Grade       ?? r.grade,       sortable: true, width: '100px' },
    {
        name: 'Current',
        selector: (r) => Number(r.Current ?? r.current ?? 0),
        sortable: true,
        width: '120px',
        cell: (r) => `₱${fmt(r.Current ?? r.current)}`,
    },
    {
        name: '1-30 Days',
        selector: (r) => Number(r.Days30 ?? r.days30 ?? 0),
        sortable: true,
        width: '120px',
        cell: (r) => {
            const val = Number(r.Days30 ?? r.days30 ?? 0);
            return val > 0
                ? <span className="text-yellow-600 font-semibold">₱{fmt(val)}</span>
                : '—';
        },
    },
    {
        name: '31-60 Days',
        selector: (r) => Number(r.Days60 ?? r.days60 ?? 0),
        sortable: true,
        width: '120px',
        cell: (r) => {
            const val = Number(r.Days60 ?? r.days60 ?? 0);
            return val > 0
                ? <span className="text-orange-600 font-semibold">₱{fmt(val)}</span>
                : '—';
        },
    },
    {
        name: '90+ Days',
        selector: (r) => Number(r.Days90 ?? r.days90 ?? 0),
        sortable: true,
        width: '120px',
        cell: (r) => {
            const val = Number(r.Days90 ?? r.days90 ?? 0);
            return val > 0
                ? <span className="text-red-600 font-semibold">₱{fmt(val)}</span>
                : '—';
        },
    },
    {
        name: 'Total Due',
        selector: (r) => Number(r.TotalDue ?? r.totalDue ?? 0),
        sortable: true,
        width: '145px',
        cell: (r) => (
            <span className="font-bold text-gray-900">₱{fmt(r.TotalDue ?? r.totalDue)}</span>
        ),
    },
];

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4" />
        <p className="text-gray-500 text-sm">Loading report data...</p>
    </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ message = 'No data available' }) => (
    <div className="flex flex-col items-center justify-center py-16">
        <FileText size={48} className="text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">{message}</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters and clicking Apply</p>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const FinancialReportDataTable = ({ reportType, dateFrom, dateTo }) => {
    const dispatch = useDispatch();

    const {
        loading,
        data: reportData,
        error,
        totalRecords,
    } = useSelector((s) => s.accounting.financialReportState);

    // ── Map backend response: { Summary, Data, TotalRecords } ───────────────
    const summary           = reportData?.Summary           ?? {};
    const collectionDetails = reportData?.Data              ?? [];
    const agingDetails      = reportData?.agingDetails      ?? [];
    const incomeDetails     = reportData?.incomeDetails     ?? [];

    // ── Pagination state ──────────────────────────────────────────────────────
    const [page, setPage]         = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // ── Reset to page 1 when report type or date filters change ──────────────
    useEffect(() => {
        setPage(1);
    }, [reportType, dateFrom, dateTo]);

    // ── Dispatch on mount / filter / page change ──────────────────────────────
    useEffect(() => {
        if (reportType && dateFrom && dateTo) {
            dispatch(fetchFinancialReport(reportType, { dateFrom, dateTo, page, pageSize }));
        }
    }, [reportType, dateFrom, dateTo, page, pageSize, dispatch]);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-700 font-semibold">Failed to load report</p>
                <p className="text-red-500 text-sm mt-1">{error}</p>
            </div>
        );
    }

    // ── Daily Collection ──────────────────────────────────────────────────────
    if (reportType === 'daily-collection') {
        const rows = collectionDetails;

        const cards = [
            { label: 'Total Collections', value: summary.TotalCollections ?? 0, color: 'text-green-600' },
            { label: 'Cash Payments',     value: summary.CashPayments     ?? 0, color: 'text-gray-900'  },
            { label: 'Bank Transfers',    value: summary.BankTransfers    ?? 0, color: 'text-gray-900'  },
        ];

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="daily-collection"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {/* Summary Cards — 3 cards stretch to fill full width */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {cards.map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 * (i + 1) }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                                        <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                                            ₱{fmt(card.value)}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <DollarSign size={24} className="text-green-600" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <DollarSign size={20} />
                                Daily Collection Details
                            </h3>
                        </div>
                        <DataTable
                            columns={dailyCollectionColumns}
                            data={rows}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRecords}
                            paginationDefaultPage={page}
                            onChangePage={(newPage) => setPage(newPage)}
                            onChangeRowsPerPage={(newSize, newPage) => { setPageSize(newSize); setPage(newPage); }}
                            highlightOnHover
                            responsive
                            customStyles={tableStyles}
                            noDataComponent={<EmptyState message="No collection records found" />}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // ── Aging of Accounts ─────────────────────────────────────────────────────
    if (reportType === 'aging') {
        const rows       = agingDetails;
        const totalAging = rows.reduce((s, r) => s + Number(r.TotalDue  ?? r.totalDue  ?? 0), 0);
        const totalCurr  = rows.reduce((s, r) => s + Number(r.Current   ?? r.current   ?? 0), 0);
        const total160   = rows.reduce((s, r) => s + Number((r.Days30 ?? r.days30 ?? 0) + (r.Days60 ?? r.days60 ?? 0)), 0);
        const total90p   = rows.reduce((s, r) => s + Number(r.Days90   ?? r.days90   ?? 0), 0);

        const cards = [
            { label: 'Total Receivables', value: summary.TotalReceivables ?? totalAging, color: 'text-red-600'    },
            { label: 'Current',           value: summary.Current          ?? totalCurr,  color: 'text-gray-900'   },
            { label: '1-60 Days',         value: summary.Days160          ?? total160,   color: 'text-yellow-600' },
            { label: '90+ Days',          value: summary.Days90Plus       ?? total90p,   color: 'text-red-600'    },
        ];

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="aging"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {cards.map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 * (i + 1) }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                                        <p className={`text-2xl font-bold mt-1 ${card.color}`}>₱{fmt(card.value)}</p>
                                    </div>
                                    <div className="bg-red-100 p-3 rounded-lg">
                                        <BarChart3 size={24} className="text-red-600" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart3 size={20} />
                                Aging of Accounts Receivable
                            </h3>
                        </div>
                        <DataTable
                            columns={agingColumns}
                            data={rows}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRecords}
                            paginationDefaultPage={page}
                            onChangePage={(newPage) => setPage(newPage)}
                            onChangeRowsPerPage={(newSize, newPage) => { setPageSize(newSize); setPage(newPage); }}
                            highlightOnHover
                            responsive
                            customStyles={tableStyles}
                            noDataComponent={<EmptyState message="No aging records found" />}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // ── Income Statement ──────────────────────────────────────────────────────
    if (reportType === 'income') {
        const rows        = incomeDetails;
        const totalIncome = rows.reduce((s, r) => s + Number(r.Amount ?? r.amount ?? 0), 0);

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="income"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {/* Total Revenue Banner */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                                <p className="text-4xl font-bold text-green-600 mt-2">
                                    ₱{fmt(summary.TotalRevenue ?? totalIncome)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    For the period {dateFrom} to {dateTo}
                                </p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg">
                                <TrendingUp size={48} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Income by Account */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Income by Account</h3>

                        {rows.length === 0
                            ? <EmptyState message="No income records found" />
                            : (
                                <div className="space-y-4">
                                    {rows.map((item, idx) => {
                                        const pct = Number(item.Percentage ?? item.percentage ?? 0);
                                        const amt = Number(item.Amount     ?? item.amount     ?? 0);
                                        const acc = item.Account           ?? item.account    ?? '—';
                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 * idx }}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-all"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{acc}</p>
                                                    <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 1, delay: 0.3 + (idx * 0.1), ease: 'easeOut' }}
                                                            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="ml-6 text-right flex-shrink-0">
                                                    <p className="text-xl font-bold text-gray-900">₱{fmt(amt)}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{pct}%</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )
                        }
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // ── No report selected ────────────────────────────────────────────────────
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Select a report type and click Apply Filters</p>
        </div>
    );
};

export default FinancialReportDataTable;
