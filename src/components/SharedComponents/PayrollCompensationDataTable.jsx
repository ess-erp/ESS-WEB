import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Eye, Download, FileText, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';

// ─── Constants ────────────────────────────────────────────────────────────────
const YEAR_OPTIONS = [
    { value: '', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
];

const MONTH_OPTIONS = [
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (raw) => {
    if (!raw) return '—';
    return new Date(raw).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' });
};

const fmtCurrency = (amount) => {
    if (!amount && amount !== 0) return '—';
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(amount);
};

// ─── Table styles ─────────────────────────────────────────────────────────────
const customStyles = {
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
    headCells: { style: { paddingLeft: '14px', paddingRight: '14px' } },
    rows: {
        style: {
            minHeight: '60px',
            '&:hover': { backgroundColor: '#f0fdf4', cursor: 'pointer' },
        },
    },
    cells: { style: { paddingLeft: '14px', paddingRight: '14px' } },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PayrollCompensationDataTable = () => {
    const dispatch = useDispatch();

    // Mock data - replace with actual Redux state
    const [payslipList, setPayslipList] = useState([
        {
            id: 1,
            payPeriod: 'January 1-15, 2024',
            payDate: '2024-01-16',
            grossPay: 25000,
            deductions: 3500,
            netPay: 21500,
            status: 'PAID',
        },
        {
            id: 2,
            payPeriod: 'January 16-31, 2024',
            payDate: '2024-02-01',
            grossPay: 25000,
            deductions: 3500,
            netPay: 21500,
            status: 'PAID',
        },
        {
            id: 3,
            payPeriod: 'February 1-15, 2024',
            payDate: '2024-02-16',
            grossPay: 27000,
            deductions: 3800,
            netPay: 23200,
            status: 'PAID',
        },
    ]);

    // ── Pagination & filters ──────────────────────────────────────────────────
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [yearFilter, setYearFilter] = useState(null);
    const [monthFilter, setMonthFilter] = useState(null);
    const [loading, setLoading] = useState(false);

    // ── Modal state ───────────────────────────────────────────────────────────
    const [viewModal, setViewModal] = useState(false);
    const [taxBreakdownModal, setTaxBreakdownModal] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState(null);

    // ── Summary KPIs (mock data) ──────────────────────────────────────────────
    const summaryKPIs = {
        netPayLastPeriod: 21500,
        ytdEarnings: 245000,
        availablePayslips: 12,
        avgMonthlyPay: 22800,
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Pay Period',
            selector: (row) => row.payPeriod,
            sortable: true,
            cell: (row) => <span className="font-medium text-sm">{row.payPeriod}</span>,
            width: '200px',
        },
        {
            name: 'Pay Date',
            selector: (row) => row.payDate,
            sortable: true,
            cell: (row) => <span className="text-sm text-gray-600">{fmtDate(row.payDate)}</span>,
        },
        {
            name: 'Gross Pay',
            selector: (row) => row.grossPay,
            sortable: true,
            cell: (row) => <span className="font-semibold text-gray-900">{fmtCurrency(row.grossPay)}</span>,
            right: true,
        },
        {
            name: 'Deductions',
            selector: (row) => row.deductions,
            sortable: true,
            cell: (row) => <span className="text-sm text-red-600">-{fmtCurrency(row.deductions)}</span>,
            right: true,
        },
        {
            name: 'Net Pay',
            selector: (row) => row.netPay,
            sortable: true,
            cell: (row) => (
                <span className="font-bold text-green-700 text-base">{fmtCurrency(row.netPay)}</span>
            ),
            right: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDownload(row)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="Download Payslip"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            ),
            button: true,
            width: '120px',
        },
    ];

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (row) => {
        setSelectedPayslip(row);
        setViewModal(true);
    };

    const handleDownload = (row) => {
        // TODO: Implement actual download logic
        console.log('Downloading payslip:', row);
        alert(`Downloading payslip for ${row.payPeriod}`);
    };

    const handleViewTaxBreakdown = () => {
        setTaxBreakdownModal(true);
    };

    const filteredData = payslipList.filter((row) => {
        const matchesSearch = search
            ? row.payPeriod?.toLowerCase().includes(search.toLowerCase()) ||
              row.netPay?.toString().includes(search)
            : true;
        const matchesYear = yearFilter ? row.payDate?.includes(yearFilter.value) : true;
        const matchesMonth = monthFilter ? row.payDate?.includes(`-${monthFilter.value}-`) : true;
        return matchesSearch && matchesYear && matchesMonth;
    });

    return (
        <div className="space-y-6">
            {/* Summary KPI Cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-green-700 mb-1">Net Pay Last Period</p>
                            <p className="text-2xl font-bold text-green-900">
                                {fmtCurrency(summaryKPIs.netPayLastPeriod)}
                            </p>
                            <p className="text-xs text-green-600 mt-1">most recent</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-blue-700 mb-1">YTD Earnings</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {fmtCurrency(summaryKPIs.ytdEarnings)}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">year to date</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-purple-700 mb-1">Available Payslips</p>
                            <p className="text-2xl font-bold text-purple-900">{summaryKPIs.availablePayslips}</p>
                            <p className="text-xs text-purple-600 mt-1">documents</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-orange-700 mb-1">Avg Monthly Pay</p>
                            <p className="text-2xl font-bold text-orange-900">
                                {fmtCurrency(summaryKPIs.avgMonthlyPay)}
                            </p>
                            <p className="text-xs text-orange-600 mt-1">average</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filters and Action Buttons */}
            <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search pay period..."
                                className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Year Filter */}
                        <div className="w-full md:w-36">
                            <SearchableSelect
                                options={YEAR_OPTIONS}
                                value={yearFilter}
                                onChange={setYearFilter}
                                placeholder="Year"
                            />
                        </div>

                        {/* Month Filter */}
                        <div className="w-full md:w-40">
                            <SearchableSelect
                                options={MONTH_OPTIONS}
                                value={monthFilter}
                                onChange={setMonthFilter}
                                placeholder="Month"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleViewTaxBreakdown}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        View Tax Breakdown
                    </button>
                </div>
            </motion.div>

            {/* DataTable */}
            <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationPerPage={pageSize}
                    paginationRowsPerPageOptions={[10, 20, 30, 50]}
                    onChangePage={(newPage) => setPage(newPage)}
                    onChangeRowsPerPage={(newPageSize) => setPageSize(newPageSize)}
                    customStyles={customStyles}
                    progressPending={loading}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    noDataComponent={
                        <div className="py-12 text-center">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No payslip records found</p>
                        </div>
                    }
                />
            </motion.div>

            {/* View Payslip Details Modal */}
            <ModalComponent
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title="Payslip Details"
                size="w-[600px]"
                buttons={[
                    {
                        label: 'Download PDF',
                        type: 'green',
                        onClick: () => selectedPayslip && handleDownload(selectedPayslip),
                    },
                    { label: 'Close', type: 'red', onClick: () => setViewModal(false) },
                ]}
            >
                {selectedPayslip && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-lg mb-2">{selectedPayslip.payPeriod}</h4>
                            <p className="text-sm text-gray-600">Pay Date: {fmtDate(selectedPayslip.payDate)}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="font-medium text-gray-700">Gross Pay</span>
                                <span className="font-semibold text-lg">
                                    {fmtCurrency(selectedPayslip.grossPay)}
                                </span>
                            </div>

                            <div className="space-y-2 pl-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">SSS Contribution</span>
                                    <span className="text-red-600">-₱ 1,200.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">PhilHealth</span>
                                    <span className="text-red-600">-₱ 800.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Pag-IBIG</span>
                                    <span className="text-red-600">-₱ 500.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Withholding Tax</span>
                                    <span className="text-red-600">-₱ 1,000.00</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-medium text-gray-700">Total Deductions</span>
                                <span className="font-semibold text-red-600">
                                    -{fmtCurrency(selectedPayslip.deductions)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                                <span className="font-bold text-gray-900 text-lg">Net Pay</span>
                                <span className="font-bold text-green-700 text-2xl">
                                    {fmtCurrency(selectedPayslip.netPay)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </ModalComponent>

            {/* Tax Breakdown Modal */}
            <ModalComponent
                isOpen={taxBreakdownModal}
                onClose={() => setTaxBreakdownModal(false)}
                title="Year-to-Date Tax Breakdown"
                size="w-[600px]"
                buttons={[{ label: 'Close', type: 'red', onClick: () => setTaxBreakdownModal(false) }]}
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Tax Year 2024</h4>
                        <p className="text-sm text-gray-600">
                            Total taxable income and deductions summary
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Total Gross Income (YTD)</span>
                            <span className="font-semibold">{fmtCurrency(300000)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Total SSS Contributions</span>
                            <span className="font-semibold text-red-600">-{fmtCurrency(14400)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Total PhilHealth</span>
                            <span className="font-semibold text-red-600">-{fmtCurrency(9600)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Total Pag-IBIG</span>
                            <span className="font-semibold text-red-600">-{fmtCurrency(6000)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-700">Total Withholding Tax (YTD)</span>
                            <span className="font-semibold text-red-600">-{fmtCurrency(12000)}</span>
                        </div>
                        <div className="flex justify-between border-t-2 border-gray-300 pt-3">
                            <span className="font-bold text-lg">Net Taxable Income</span>
                            <span className="font-bold text-green-700 text-xl">
                                {fmtCurrency(258000)}
                            </span>
                        </div>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default PayrollCompensationDataTable;
