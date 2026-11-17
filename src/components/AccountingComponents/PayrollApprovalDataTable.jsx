import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Eye, CheckCircle, XCircle, Search, X } from 'lucide-react';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import {
    fetchPayrollApprovalTable,
    approvePayrollRecord,
    rejectPayrollRecord,
} from '../../states/AccountingState/Action';
import { showToast } from '../../states/NotificationState/Action';

// ─── Currency helper ──────────────────────────────────────────────────────────
const currency = (val = 0) =>
    `₱${Number(val ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─── DataTable head styles ────────────────────────────────────────────────────
const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#f8fafc',
            borderBottomWidth: '2px',
            borderBottomColor: '#e2e8f0',
            fontSize: '13px',
            fontWeight: '700',
            color: '#1e293b',
            textTransform: 'uppercase',
        },
    },
    rows: {
        style: {
            minHeight: '60px',
            fontSize: '14px',
            '&:hover': { backgroundColor: '#f1f5f9', cursor: 'pointer' },
        },
    },
};

const PayrollApprovalDataTable = ({ statusFilter = '' }) => {
    const dispatch = useDispatch();

    // ── Redux state ───────────────────────────────────────────────────────────
    const { loading, data: tableData, totalRecords } = useSelector(
        (s) => s.finance?.payrollApprovalTableState || { loading: false, data: [], totalRecords: 0 }
    );
    const { loading: approving } = useSelector(
        (s) => s.finance?.approvePayrollState || { loading: false }
    );
    const { loading: rejecting } = useSelector(
        (s) => s.finance?.rejectPayrollState || { loading: false }
    );

    // ── Pagination / search ───────────────────────────────────────────────────
    const [page, setPage]         = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch]     = useState('');

    // ── Modal state ───────────────────────────────────────────────────────────
    const [selectedRow,     setSelectedRow]     = useState(null);
    const [viewModal,       setViewModal]       = useState(false);
    const [approveModal,    setApproveModal]    = useState(false);
    const [rejectModal,     setRejectModal]     = useState(false);
    const [approveRemarks,  setApproveRemarks]  = useState('');
    const [rejectReason,    setRejectReason]    = useState('');

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchData = useCallback(() => {
        dispatch(fetchPayrollApprovalTable(page, pageSize, search, statusFilter));
    }, [dispatch, page, pageSize, search, statusFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Reset to page 1 when status tab changes
    useEffect(() => { setPage(1); }, [statusFilter]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (row) => {
        setSelectedRow(row);
        setViewModal(true);
    };

    const handleApproveClick = (row) => {
        setSelectedRow(row);
        setApproveRemarks('');
        setApproveModal(true);
    };

    const handleRejectClick = (row) => {
        setSelectedRow(row);
        setRejectReason('');
        setRejectModal(true);
    };

    const handleApproveSubmit = async () => {
        if (!selectedRow) return;
        const result = await dispatch(
            approvePayrollRecord(selectedRow.PeriodId ?? selectedRow.periodId, approveRemarks)
        );
        if (result.ok) {
            dispatch(showToast('success', result.message || 'Payroll approved successfully'));
            setApproveModal(false);
            fetchData();
        } else {
            dispatch(showToast('error', result.error || 'Failed to approve payroll'));
        }
    };

    const handleRejectSubmit = async () => {
        if (!selectedRow) return;
        if (!rejectReason.trim()) {
            dispatch(showToast('error', 'Please provide a rejection reason'));
            return;
        }
        const result = await dispatch(
            rejectPayrollRecord(selectedRow.PeriodId ?? selectedRow.periodId, rejectReason)
        );
        if (result.ok) {
            dispatch(showToast('success', result.message || 'Payroll rejected'));
            setRejectModal(false);
            fetchData();
        } else {
            dispatch(showToast('error', result.error || 'Failed to reject payroll'));
        }
    };

    // ── Status badge helper ───────────────────────────────────────────────────
    const statusBadge = (status) => {
        const s = status?.toLowerCase();
        const map = {
            pending:  'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100  text-green-800',
            rejected: 'bg-red-100    text-red-800',
        };
        return (
            <span className={`px-3 py-1 rounded-full font-semibold text-xs uppercase ${map[s] ?? 'bg-gray-100 text-gray-800'}`}>
                {status ?? 'N/A'}
            </span>
        );
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Period ID',
            selector: (r) => r.PeriodId ?? r.periodId,
            sortable: true,
            width: '100px',
            cell: (r) => (
                <span className="font-semibold text-gray-800">#{r.PeriodId ?? r.periodId}</span>
            ),
        },
        {
            name: 'Period Name',
            selector: (r) => r.PeriodName ?? r.periodName,
            sortable: true,
            wrap: true,
            grow: 2,
            cell: (r) => (
                <div>
                    <div className="font-medium text-gray-900">{r.PeriodName ?? r.periodName}</div>
                    <div className="text-xs text-gray-500">
                        {r.PaymentDate ?? r.paymentDate
                            ? `Payment: ${new Date(r.PaymentDate ?? r.paymentDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}`
                            : ''}
                    </div>
                </div>
            ),
        },
        {
            name: 'Employees',
            selector: (r) => r.TotalEmployees ?? r.totalEmployees ?? 0,
            sortable: true,
            center: true,
            width: '110px',
            cell: (r) => (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                    {r.TotalEmployees ?? r.totalEmployees ?? 0}
                </span>
            ),
        },
        {
            name: 'Total Net Pay',
            selector: (r) => r.TotalNetPay ?? r.totalNetPay ?? 0,
            sortable: true,
            right: true,
            width: '160px',
            cell: (r) => (
                <span className="font-bold text-green-700">
                    {currency(r.TotalNetPay ?? r.totalNetPay)}
                </span>
            ),
        },
        {
            name: 'Total Deductions',
            selector: (r) => r.TotalDeductions ?? r.totalDeductions ?? 0,
            sortable: true,
            right: true,
            width: '160px',
            cell: (r) => (
                <span className="font-semibold text-red-600">
                    {currency(r.TotalDeductions ?? r.totalDeductions)}
                </span>
            ),
        },
        {
            name: 'Status',
            selector: (r) => r.Status ?? r.status,
            sortable: true,
            center: true,
            width: '120px',
            cell: (r) => statusBadge(r.Status ?? r.status),
        },
        {
            name: 'Actions',
            center: true,
            width: '240px',
            cell: (r) => {
                const isPending = (r.Status ?? r.status)?.toLowerCase() === 'pending';
                return (
                    <div className="flex gap-1.5 items-center justify-center">
                        <button
                            onClick={() => handleView(r)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            title="View Details"
                        >
                            <Eye size={14} />
                            View
                        </button>
                        {isPending && (
                            <>
                                <button
                                    onClick={() => handleApproveClick(r)}
                                    disabled={approving}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                    title="Approve"
                                >
                                    <CheckCircle size={14} />
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleRejectClick(r)}
                                    disabled={rejecting}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                    title="Reject"
                                >
                                    <XCircle size={14} />
                                    Reject
                                </button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="w-full">
            {/* Search + counter */}
            <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by period name or ID..."
                        className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {search && (
                        <button
                            onClick={() => { setSearch(''); setPage(1); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>
                <div className="text-sm text-gray-600">
                    Total Records: <span className="font-semibold">{totalRecords}</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <DataTable
                    columns={columns}
                    data={tableData || []}
                    progressPending={loading}
                    progressComponent={
                        <div className="py-10 flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                            <p className="text-sm text-gray-500">Loading payroll records…</p>
                        </div>
                    }
                    pagination
                    paginationServer
                    paginationTotalRows={totalRecords}
                    paginationDefaultPage={page}
                    paginationPerPage={pageSize}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    onChangePage={(p) => setPage(p)}
                    onChangeRowsPerPage={(size, p) => { setPageSize(size); setPage(p); }}
                    customStyles={customStyles}
                    highlightOnHover
                    responsive
                    noDataComponent={
                        <div className="py-10 text-center text-gray-500">
                            No payroll records found
                        </div>
                    }
                />
            </div>

            {/* ── View Details Modal ─────────────────────────────────────────── */}
            <ModalComponent
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title="Payroll Period Details"
                size="w-[520px]"
                body={
                    selectedRow && (
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    ['Period ID',        `#${selectedRow.PeriodId ?? selectedRow.periodId}`],
                                    ['Period Name',      selectedRow.PeriodName ?? selectedRow.periodName ?? '—'],
                                    ['Payment Date',     selectedRow.PaymentDate ?? selectedRow.paymentDate
                                        ? new Date(selectedRow.PaymentDate ?? selectedRow.paymentDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
                                        : '—'],
                                    ['Employees',        selectedRow.TotalEmployees ?? selectedRow.totalEmployees ?? 0],
                                    ['Total Net Pay',    currency(selectedRow.TotalNetPay ?? selectedRow.totalNetPay)],
                                    ['Total Deductions', currency(selectedRow.TotalDeductions ?? selectedRow.totalDeductions)],
                                    ['Status',          selectedRow.Status ?? selectedRow.status ?? '—'],
                                ].map(([label, value]) => (
                                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 font-medium">{label}</p>
                                        <p className="font-semibold text-gray-800 mt-0.5">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
                buttons={[
                    { label: 'Close', type: 'blue', onClick: () => setViewModal(false) }
                ]}
            />

            {/* ── Approve Modal ──────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={approveModal}
                onClose={() => setApproveModal(false)}
                title="Approve Payroll"
                size="w-[480px]"
                body={
                    <div className="space-y-4 text-sm">
                        {selectedRow && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Period:</span>
                                    <span className="font-semibold">{selectedRow.PeriodName ?? selectedRow.periodName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Employees:</span>
                                    <span className="font-semibold">{selectedRow.TotalEmployees ?? selectedRow.totalEmployees ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Net Pay:</span>
                                    <span className="font-bold text-green-700">{currency(selectedRow.TotalNetPay ?? selectedRow.totalNetPay)}</span>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks <span className="text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                value={approveRemarks}
                                onChange={(e) => setApproveRemarks(e.target.value)}
                                rows={3}
                                placeholder="Add any approval remarks..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: approving ? 'Approving…' : 'Approve',
                        type: 'green',
                        onClick: handleApproveSubmit,
                        closeOnClick: false,
                    },
                    { label: 'Cancel', type: 'red', onClick: () => setApproveModal(false) },
                ]}
            />

            {/* ── Reject Modal ───────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={rejectModal}
                onClose={() => setRejectModal(false)}
                title="Reject Payroll"
                size="w-[480px]"
                body={
                    <div className="space-y-4 text-sm">
                        {selectedRow && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Period:</span>
                                    <span className="font-semibold">{selectedRow.PeriodName ?? selectedRow.periodName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Employees:</span>
                                    <span className="font-semibold">{selectedRow.TotalEmployees ?? selectedRow.totalEmployees ?? 0}</span>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rejection Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={3}
                                placeholder="Provide a reason for rejection..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: rejecting ? 'Rejecting…' : 'Reject',
                        type: 'red',
                        onClick: handleRejectSubmit,
                        closeOnClick: false,
                    },
                    { label: 'Cancel', type: 'blue', onClick: () => setRejectModal(false) },
                ]}
            />
        </div>
    );
};

export default PayrollApprovalDataTable;
