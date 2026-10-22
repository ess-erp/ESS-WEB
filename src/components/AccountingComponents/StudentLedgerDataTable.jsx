import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, User, TrendingUp, TrendingDown, Eye, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from 'react-data-table-component';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { fetchAllStudentLedgers, fetchStudentLedgerByStudentId } from '../../states/AccountingState/Action';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// DTO field: ActiveStatus — 'Y' = Paid, 'P' = Partial, anything else = Unpaid
const statusLabel = (raw = '') => {
    if (raw === 'Y') return 'Paid';
    if (raw === 'P') return 'Partial';
    return 'Unpaid';
};

const statusColors = {
    Paid:    'bg-green-100 text-green-700',
    Partial: 'bg-yellow-100 text-yellow-700',
    Unpaid:  'bg-red-100 text-red-700',
};

// ─── Custom Table Styles ──────────────────────────────────────────────────────
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
    headCells: { style: { paddingLeft: '16px', paddingRight: '16px' } },
    rows: {
        style: {
            minHeight: '60px',
            '&:hover': { backgroundColor: '#f0fdf4', cursor: 'pointer' },
        },
    },
    cells: { style: { paddingLeft: '16px', paddingRight: '16px' } },
    table: {
        style: {
            maxHeight: '500px',
            overflowY: 'auto',
        },
    },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentLedgerDataTable = () => {
    const dispatch = useDispatch();

    // ── Redux ─────────────────────────────────────────────────────────────────
    const {
        loading: listLoading,
        data:    listData,
        totalRecords,
    } = useSelector((s) => s.accounting.studentLedgerList);

    const {
        loading: soaLoading,
        data:    soaData,
    } = useSelector((s) => s.accounting.studentLedger);

    const students     = Array.isArray(listData) ? listData : [];
    const soaMaster    = soaData?.master       ?? null;
    const transactions = soaData?.transactions ?? [];

    // ── Local state ───────────────────────────────────────────────────────────
    const [search, setSearch]                   = useState('');
    const [page, setPage]                       = useState(1);
    const [pageSize, setPageSize]               = useState(10);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen]         = useState(false);

    // ── Fetch list on mount / filter / page change ────────────────────────────
    useEffect(() => {
        dispatch(fetchAllStudentLedgers({ page, pageSize, search }));
    }, [page, pageSize, search, dispatch]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (row) => {
        setSelectedStudent(row);
        setIsModalOpen(true);
        dispatch(fetchStudentLedgerByStudentId(row.StudentId));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    // ── Summary card totals (current page) ───────────────────────────────────
    const totalBilled  = students.reduce((sum, s) => sum + Number(s.TotalCharges  || 0), 0);
    const totalPaid    = students.reduce((sum, s) => sum + Number(s.TotalPayments || 0), 0);
    const totalBalance = students.reduce((sum, s) => sum + Number(s.Balance       || 0), 0);

    // ── Columns — mapped 1-to-1 to StudentLedgerMasterWithStudentDto ─────────
    const columns = [
        {
            name: 'Student No.',
            selector: (r) => r.StudentNumber,
            sortable: true,
            width: '130px',
            cell: (r) => (
                <span className="text-xs font-mono font-bold text-gray-900">
                    {r.StudentNumber || '—'}
                </span>
            ),
        },
        {
            name: 'LRN',
            selector: (r) => r.Lrn,
            sortable: true,
            width: '140px',
            cell: (r) => (
                <span className="text-xs font-mono text-gray-700">
                    {r.Lrn || '—'}
                </span>
            ),
        },
        {
            name: 'Student Name',
            selector: (r) => r.StudentFullName,
            sortable: true,
            grow: 2,
            wrap: true,
            cell: (r) => (
                <span className="text-sm font-semibold text-gray-900">
                    {r.StudentFullName || '—'}
                </span>
            ),
        },
        {
            name: 'Level',
            selector: (r) => r.LevelName,
            sortable: true,
            width: '130px',
            cell: (r) => (
                <span className="text-sm text-gray-700">{r.LevelName || '—'}</span>
            ),
        },
        {
            name: 'School Year',
            selector: (r) => r.CalendarName,
            sortable: true,
            width: '150px',
            cell: (r) => (
                <span className="text-sm text-gray-700">{r.CalendarName || '—'}</span>
            ),
        },
        {
            name: 'Total Charges',
            selector: (r) => Number(r.TotalCharges || 0),
            sortable: true,
            width: '145px',
            cell: (r) => `₱${fmt(r.TotalCharges)}`,
        },
        {
            name: 'Total Payments',
            selector: (r) => Number(r.TotalPayments || 0),
            sortable: true,
            width: '145px',
            cell: (r) => (
                <span className="text-green-600 font-semibold">
                    ₱{fmt(r.TotalPayments)}
                </span>
            ),
        },
        {
            name: 'Balance',
            selector: (r) => Number(r.Balance || 0),
            sortable: true,
            width: '140px',
            cell: (r) => {
                const val = Number(r.Balance || 0);
                return (
                    <span className={`font-semibold ${val > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        ₱{fmt(val)}
                    </span>
                );
            },
        },
        {
            name: 'Status',
            selector: (r) => r.ActiveStatus,
            sortable: true,
            width: '110px',
            cell: (r) => {
                const label = statusLabel(r.ActiveStatus);
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[label]}`}>
                        {label}
                    </span>
                );
            },
        },
        {
            name: 'Actions',
            width: '80px',
            center: true,
            cell: (r) => (
                <button
                    onClick={(e) => { e.stopPropagation(); handleView(r); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View SOA"
                >
                    <Eye size={16} />
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* ── Summary Cards ────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label:      'Total Students',
                        value:      (totalRecords ?? students.length).toString(),
                        icon:       User,
                        iconBg:     'bg-blue-100',
                        iconColor:  'text-blue-600',
                        valueColor: 'text-gray-900',
                    },
                    {
                        label:      'Total Charges',
                        value:      `₱${(totalBilled / 1000).toFixed(1)}K`,
                        icon:       FileText,
                        iconBg:     'bg-purple-100',
                        iconColor:  'text-purple-600',
                        valueColor: 'text-gray-900',
                    },
                    {
                        label:      'Total Collected',
                        value:      `₱${(totalPaid / 1000).toFixed(1)}K`,
                        icon:       TrendingUp,
                        iconBg:     'bg-green-100',
                        iconColor:  'text-green-600',
                        valueColor: 'text-green-600',
                    },
                    {
                        label:      'Outstanding Balance',
                        value:      `₱${(totalBalance / 1000).toFixed(1)}K`,
                        icon:       TrendingDown,
                        iconBg:     'bg-red-100',
                        iconColor:  'text-red-600',
                        valueColor: 'text-red-600',
                    },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                                <p className={`text-2xl font-bold mt-1 ${card.valueColor}`}>{card.value}</p>
                            </div>
                            <div className={`${card.iconBg} p-3 rounded-lg`}>
                                <card.icon size={24} className={card.iconColor} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Table Card ───────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <User size={20} />
                                Student Account List
                            </h3>
                            <p className="text-green-100 text-xs mt-1">
                                Statement of accounts for all enrolled students
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                            <p className="text-xs font-medium">Total Records</p>
                            <p className="text-2xl font-bold">{totalRecords ?? students.length}</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name, student number, LRN, level..."
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* DataTable */}
                <DataTable
                    columns={columns}
                    data={students}
                    progressPending={listLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRecords ?? 0}
                    paginationDefaultPage={page}
                    onChangePage={(newPage) => setPage(newPage)}
                    onChangeRowsPerPage={(newSize, newPage) => { setPageSize(newSize); setPage(newPage); }}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    fixedHeader
                    fixedHeaderScrollHeight="500px"
                    customStyles={customStyles}
                    noDataComponent={
                        <div className="py-14 text-center">
                            <User size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No student ledger records found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search term</p>
                        </div>
                    }
                />
            </div>

            {/* ── SOA Modal ────────────────────────────────────────────────── */}
            <AnimatePresence>
                {isModalOpen && (
                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={
                            <div className="flex items-center gap-2">
                                <div className="bg-green-600 text-white rounded-lg p-2">
                                    <FileText size={20} />
                                </div>
                                <span className="font-bold text-base text-gray-900">
                                    Statement of Account
                                </span>
                            </div>
                        }
                        size="w-[95vw] max-w-4xl"
                        maxHeight="90vh"
                        body={
                            <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-2 py-2 space-y-6">

                                {/* Student info */}
                                {selectedStudent && (
                                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 border border-green-200">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Student No.</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {selectedStudent.StudentNumber || '—'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">LRN</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {selectedStudent.Lrn || '—'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Student Name</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {selectedStudent.StudentFullName || '—'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Level</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {selectedStudent.LevelName || '—'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">School Year</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {selectedStudent.CalendarName || '—'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Status</p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[statusLabel(selectedStudent.ActiveStatus)]}`}>
                                                    {statusLabel(selectedStudent.ActiveStatus)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Balance summary — prefer SOA master if loaded, fall back to list row */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <p className="text-xs text-gray-500 font-medium">Total Charges</p>
                                        <p className="text-xl font-bold text-gray-900 mt-1">
                                            ₱{fmt(soaMaster?.TotalCharges ?? selectedStudent?.TotalCharges)}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                        <p className="text-xs text-green-700 font-medium">Total Payments</p>
                                        <p className="text-xl font-bold text-green-700 mt-1">
                                            ₱{fmt(soaMaster?.TotalPayments ?? selectedStudent?.TotalPayments)}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                        <p className="text-xs text-red-700 font-medium">Balance Due</p>
                                        <p className="text-xl font-bold text-red-700 mt-1">
                                            ₱{fmt(soaMaster?.Balance ?? selectedStudent?.Balance)}
                                        </p>
                                    </div>
                                </div>

                                {/* Discount row if present */}
                                {Number(soaMaster?.TotalDiscount ?? selectedStudent?.TotalDiscount ?? 0) > 0 && (
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <p className="text-xs text-blue-700 font-medium">Total Discount Applied</p>
                                        <p className="text-lg font-bold text-blue-700 mt-1">
                                            ₱{fmt(soaMaster?.TotalDiscount ?? selectedStudent?.TotalDiscount)}
                                        </p>
                                    </div>
                                )}

                                {/* Transaction history — from fetchStudentLedgerByStudentId */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-3">Transaction History</h4>

                                    {soaLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
                                        </div>
                                    ) : transactions.length === 0 ? (
                                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
                                            <FileText size={40} className="mx-auto text-gray-300 mb-2" />
                                            <p className="text-gray-500 text-sm">No transactions found</p>
                                        </div>
                                    ) : (
                                        <div className="border border-gray-200 rounded-xl overflow-auto">
                                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                <thead className="bg-green-600">
                                                    <tr>
                                                        {[
                                                            'Date',
                                                            'Type',
                                                            'Description',
                                                            'OR Number',
                                                            'Ref No.',
                                                            'Debit',
                                                            'Credit',
                                                            'Running Balance',
                                                        ].map((h) => (
                                                            <th
                                                                key={h}
                                                                className="px-4 py-3 text-left text-xs font-bold text-white uppercase whitespace-nowrap"
                                                            >
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-100">
                                                    {transactions.map((tx, idx) => (
                                                        <tr
                                                            key={tx.StudentLedgerChildId ?? idx}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                                                {tx.TransactionDate
                                                                    ? new Date(tx.TransactionDate).toLocaleDateString('en-PH')
                                                                    : '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                                                {tx.TransactionType || '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-900 max-w-[200px] truncate">
                                                                {tx.Description || '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-mono text-xs">
                                                                {tx.OrNumberUsed || '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-mono text-xs">
                                                                {tx.ReferenceNo || '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-semibold text-red-600 whitespace-nowrap">
                                                                {Number(tx.Debit || 0) > 0 ? `₱${fmt(tx.Debit)}` : '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-semibold text-green-600 whitespace-nowrap">
                                                                {Number(tx.Credit || 0) > 0 ? `₱${fmt(tx.Credit)}` : '—'}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                                                                ₱{fmt(tx.RunningBalance)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                        buttons={[
                            { label: 'Close', type: 'red', onClick: handleCloseModal },
                        ]}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentLedgerDataTable;
