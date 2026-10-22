import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Eye, CheckCircle, XCircle, Filter, ChevronDown, ChevronUp, FileText, Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from 'react-data-table-component';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import { fetchLeaveFilings, updateLeaveStatus, submitLeaveFiling } from '../../states/HumanResourcesState/Action';
import { showToast } from '../../states/NotificationState/Action';

// ─── Constants ────────────────────────────────────────────────────────────────
const LEAVE_TYPES = [
    { value: '',                    label: 'All Leave Types'      },
    { value: 'Sick Leave',          label: 'Sick Leave'           },
    { value: 'Vacation Leave',      label: 'Vacation Leave'       },
    { value: 'Emergency Leave',     label: 'Emergency Leave'      },
    { value: 'Maternity Leave',     label: 'Maternity Leave'      },
    { value: 'Paternity Leave',     label: 'Paternity Leave'      },
    { value: 'Bereavement Leave',   label: 'Bereavement Leave'    },
    { value: 'Solo Parent Leave',   label: 'Solo Parent Leave'    },
];

const STATUS_OPTS = [
    { value: '',          label: 'All Status'  },
    { value: 'PENDING',   label: 'Pending'     },
    { value: 'APPROVED',  label: 'Approved'    },
    { value: 'REJECTED',  label: 'Rejected'    },
    { value: 'CANCELLED', label: 'Cancelled'   },
];

const statusConfig = {
    PENDING:   { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    APPROVED:  { bg: 'bg-green-100',  text: 'text-green-700'  },
    REJECTED:  { bg: 'bg-red-100',    text: 'text-red-700'    },
    CANCELLED: { bg: 'bg-gray-100',   text: 'text-gray-600'   },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (raw) => {
    if (!raw) return '—';
    return new Date(raw).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' });
};

const StatusBadge = ({ status }) => {
    const s = (status ?? 'PENDING').toUpperCase();
    const cfg = statusConfig[s] ?? statusConfig.PENDING;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>{s}</span>
    );
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

// ─── Row entrance animation wrapper (used via conditionalRowStyles + custom cell wrapping)
const AnimatedRow = ({ children, isNew }) => (
    <motion.div
        initial={isNew ? { opacity: 0, scale: 0.98, backgroundColor: '#dcfce7' } : false}
        animate={{ opacity: 1, scale: 1, backgroundColor: '#ffffff' }}
        transition={{ duration: 0.4 }}
    >
        {children}
    </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const LeaveFilingDataTable = () => {
    const dispatch = useDispatch();

    // ── Redux ─────────────────────────────────────────────────────────────────
    const { loading, data: rawData, totalRecords } = useSelector((s) => s.hr.leaveFilingsState);
    const { loading: submitting } = useSelector((s) => s.hr.createLeaveFilingState);
    const { loading: updating }   = useSelector((s) => s.hr.updateLeaveStatusState);
    const leaveList = Array.isArray(rawData) ? rawData : [];

    // ── Pagination & filters ──────────────────────────────────────────────────
    const [page, setPage]         = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch]     = useState('');
    const [leaveType, setLeaveType] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [showFilters, setShowFilters]   = useState(false);

    // ── Modal state ───────────────────────────────────────────────────────────
    const [viewModal, setViewModal]         = useState(false);
    const [addModal, setAddModal]           = useState(false);
    const [confirmModal, setConfirmModal]   = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // { leaveId, status, name }

    // ── New leave form ────────────────────────────────────────────────────────
    const [form, setForm] = useState({
        employeeId: '', leaveType: '', startDate: '', endDate: '', totalDays: '', reason: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // ── Track newest LeaveRefNo for row flash animation ───────────────────────
    const [newestRef, setNewestRef] = useState(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchData = useCallback(() => {
        dispatch(fetchLeaveFilings({
            page, pageSize, search,
            status:    statusFilter?.value || null,
            leaveType: leaveType?.value    || null,
        }));
    }, [page, pageSize, search, statusFilter, leaveType, dispatch]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (row) => { setSelectedLeave(row); setViewModal(true); };

    const handleStatusAction = (row, status) => {
        setConfirmAction({
            leaveId: row.LeaveId ?? row.leaveId,
            status,
            name: row.FullName ?? row.fullName ?? row.EmployeeFullName ?? '—',
            refNo: row.LeaveRefNo ?? row.leaveRefNo ?? '—',
        });
        setConfirmModal(true);
    };

    const handleConfirmStatus = async () => {
        if (!confirmAction) return;
        setConfirmModal(false);
        const result = await dispatch(updateLeaveStatus(confirmAction.leaveId, confirmAction.status));
        if (result.ok) {
            dispatch(showToast('success', `Leave ${confirmAction.status.toLowerCase()} for ${confirmAction.name}`));
            fetchData();
        } else {
            dispatch(showToast('error', 'Failed to update leave status'));
        }
        setConfirmAction(null);
    };

    const validateForm = () => {
        const errors = {};
        if (!form.employeeId.trim()) errors.employeeId = 'Employee is required';
        if (!form.leaveType)         errors.leaveType  = 'Leave type is required';
        if (!form.startDate)         errors.startDate  = 'Start date is required';
        if (!form.endDate)           errors.endDate    = 'End date is required';
        if (!form.totalDays || Number(form.totalDays) < 1) errors.totalDays = 'Total days must be at least 1';
        if (!form.reason.trim())     errors.reason     = 'Reason is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitLeave = async () => {
        if (!validateForm()) return;
        const result = await dispatch(submitLeaveFiling({
            EmployeeId: form.employeeId,
            LeaveType:  form.leaveType,
            StartDate:  form.startDate,
            EndDate:    form.endDate,
            TotalDays:  Number(form.totalDays),
            Reason:     form.reason,
        }));
        if (result.ok) {
            const newRef = result.data?.LeaveRefNo ?? result.data?.leaveRefNo;
            setNewestRef(newRef);
            dispatch(showToast('success', 'Leave application submitted successfully'));
            setAddModal(false);
            setForm({ employeeId: '', leaveType: '', startDate: '', endDate: '', totalDays: '', reason: '' });
            fetchData();
        } else {
            dispatch(showToast('error', result.data?.message || 'Failed to submit leave'));
        }
    };

    const handleClearFilters = () => {
        setSearch(''); setLeaveType(null); setStatusFilter(null); setPage(1);
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Leave Ref No.',
            selector: (r) => r.LeaveRefNo ?? r.leaveRefNo ?? '—',
            sortable: true,
            width: '145px',
            cell: (r) => (
                <span className="text-xs font-mono font-bold text-gray-900">
                    {r.LeaveRefNo ?? r.leaveRefNo ?? '—'}
                </span>
            ),
        },
        {
            name: 'Employee No.',
            selector: (r) => r.EmployeeNo ?? r.employeeNo ?? '—',
            sortable: true,
            width: '135px',
            cell: (r) => (
                <span className="text-xs font-mono text-gray-700">
                    {r.EmployeeNo ?? r.employeeNo ?? '—'}
                </span>
            ),
        },
        {
            name: 'Employee Name',
            selector: (r) => r.FullName ?? r.EmployeeFullName ?? '—',
            sortable: true,
            grow: 2,
            cell: (r) => (
                <span className="text-sm font-semibold text-gray-900">
                    {r.FullName ?? r.EmployeeFullName ?? '—'}
                </span>
            ),
        },
        {
            name: 'Leave Type',
            selector: (r) => r.LeaveType ?? r.leaveType ?? '—',
            sortable: true,
            minWidth: '150px',
            cell: (r) => (
                <span className="text-xs text-gray-800 font-medium">{r.LeaveType ?? r.leaveType ?? '—'}</span>
            ),
        },
        {
            name: 'Start Date',
            selector: (r) => r.StartDate ?? r.startDate,
            sortable: true,
            width: '120px',
            cell: (r) => <span className="text-xs text-gray-700">{fmtDate(r.StartDate ?? r.startDate)}</span>,
        },
        {
            name: 'End Date',
            selector: (r) => r.EndDate ?? r.endDate,
            sortable: true,
            width: '120px',
            cell: (r) => <span className="text-xs text-gray-700">{fmtDate(r.EndDate ?? r.endDate)}</span>,
        },
        {
            name: 'Days',
            selector: (r) => r.TotalDays ?? r.totalDays ?? 0,
            sortable: true,
            width: '75px',
            cell: (r) => (
                <span className="text-sm font-bold text-gray-900 text-center w-full">
                    {r.TotalDays ?? r.totalDays ?? 0}
                </span>
            ),
        },
        {
            name: 'Status',
            selector: (r) => r.Status ?? r.status ?? 'PENDING',
            sortable: true,
            width: '115px',
            cell: (r) => <StatusBadge status={r.Status ?? r.status} />,
        },
        {
            name: 'Actions',
            width: '145px',
            center: true,
            cell: (r) => {
                const st = (r.Status ?? r.status ?? 'PENDING').toUpperCase();
                return (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleView(r); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                        >
                            <Eye size={15} />
                        </button>
                        {st === 'PENDING' && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleStatusAction(r, 'APPROVED'); }}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Approve"
                                >
                                    <CheckCircle size={15} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleStatusAction(r, 'REJECTED'); }}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Reject"
                                >
                                    <XCircle size={15} />
                                </button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    // Highlight new row via conditionalRowStyles
    const conditionalRowStyles = [
        {
            when: (r) => (r.LeaveRefNo ?? r.leaveRefNo) === newestRef,
            style: { backgroundColor: '#dcfce7', transition: 'background-color 1.5s ease' },
        },
    ];

    return (
        // ── Page entrance animation ────────────────────────────────────────────
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-0"
        >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <FileText size={20} className="text-white" />
                        <div>
                            <h3 className="text-lg font-bold text-white">Leave Applications</h3>
                            <p className="text-green-100 text-xs mt-0.5">Employee leave filing records</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search by name or employee number..."
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            {search && (
                                <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <X size={15} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                showFilters ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Filter size={15} />
                            Filters
                            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {(search || leaveType || statusFilter) && (
                            <button onClick={handleClearFilters} className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100">
                                <X size={14} /> Clear
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <SearchableSelect
                                        label="Leave Type"
                                        options={LEAVE_TYPES}
                                        value={leaveType}
                                        onChange={setLeaveType}
                                        placeholder="All leave types..."
                                        showSearchIcon={false}
                                    />
                                    <SearchableSelect
                                        label="Status"
                                        options={STATUS_OPTS}
                                        value={statusFilter}
                                        onChange={setStatusFilter}
                                        placeholder="All statuses..."
                                        showSearchIcon={false}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* DataTable wrapped in AnimatePresence for row insertion flash */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${page}-${search}-${statusFilter?.value}-${leaveType?.value}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                    >
                        <DataTable
                            columns={columns}
                            data={leaveList}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRecords ?? 0}
                            paginationDefaultPage={page}
                            onChangePage={(newPage) => setPage(newPage)}
                            onChangeRowsPerPage={(newSize, newPage) => { setPageSize(newSize); setPage(newPage); }}
                            conditionalRowStyles={conditionalRowStyles}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            customStyles={customStyles}
                            noDataComponent={
                                <div className="py-14 text-center">
                                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No leave filings found</p>
                                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                                </div>
                            }
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── View Details Modal ───────────────────────────────────────── */}
            <ModalComponent
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white rounded-lg p-2"><FileText size={18} /></div>
                        <span className="font-bold text-base text-gray-900">Leave Application Details</span>
                    </div>
                }
                size="w-[95vw] max-w-2xl"
                body={
                    selectedLeave && (
                        <div className="space-y-4 p-2">
                            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 border border-green-200">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        ['Leave Ref No.', selectedLeave.LeaveRefNo ?? selectedLeave.leaveRefNo ?? '—'],
                                        ['Employee No.',  selectedLeave.EmployeeNo  ?? selectedLeave.employeeNo  ?? '—'],
                                        ['Employee Name', selectedLeave.FullName ?? selectedLeave.EmployeeFullName ?? '—'],
                                        ['Leave Type',    selectedLeave.LeaveType   ?? selectedLeave.leaveType    ?? '—'],
                                        ['Start Date',    fmtDate(selectedLeave.StartDate ?? selectedLeave.startDate)],
                                        ['End Date',      fmtDate(selectedLeave.EndDate   ?? selectedLeave.endDate)],
                                        ['Total Days',    selectedLeave.TotalDays   ?? selectedLeave.totalDays    ?? '—'],
                                    ].map(([label, value]) => (
                                        <div key={label}>
                                            <p className="text-xs text-gray-500 font-medium">{label}</p>
                                            <p className="text-sm font-bold text-gray-900">{value}</p>
                                        </div>
                                    ))}
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Status</p>
                                        <StatusBadge status={selectedLeave.Status ?? selectedLeave.status} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium mb-1">Reason</p>
                                <p className="text-sm text-gray-800 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                                    {selectedLeave.Reason ?? selectedLeave.reason ?? '—'}
                                </p>
                            </div>
                        </div>
                    )
                }
                buttons={[{ label: 'Close', type: 'red', onClick: () => setViewModal(false) }]}
            />

            {/* ── File Leave Modal ─────────────────────────────────────────── */}
            <ModalComponent
                isOpen={addModal}
                onClose={() => setAddModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white rounded-lg p-2"><Plus size={18} /></div>
                        <span className="font-bold text-base text-gray-900">File Leave Application</span>
                    </div>
                }
                size="w-[95vw] max-w-2xl"
                maxHeight="90vh"
                body={
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-2 py-2 space-y-4">
                        {[
                            { label: 'Employee ID / Number', field: 'employeeId', type: 'text', placeholder: 'e.g. EMP-2026-0042' },
                            { label: 'Start Date',           field: 'startDate',  type: 'date', placeholder: '' },
                            { label: 'End Date',             field: 'endDate',    type: 'date', placeholder: '' },
                            { label: 'Total Days',           field: 'totalDays',  type: 'number', placeholder: 'e.g. 3' },
                        ].map(({ label, field, type, placeholder }) => (
                            <div key={field}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    {label} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={type}
                                    value={form[field]}
                                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                                    placeholder={placeholder}
                                    min={type === 'number' ? 1 : undefined}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${formErrors[field] ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {formErrors[field] && <p className="text-red-500 text-xs mt-1">{formErrors[field]}</p>}
                            </div>
                        ))}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Leave Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.leaveType}
                                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${formErrors.leaveType ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">-- Select Leave Type --</option>
                                {LEAVE_TYPES.slice(1).map((lt) => (
                                    <option key={lt.value} value={lt.value}>{lt.label}</option>
                                ))}
                            </select>
                            {formErrors.leaveType && <p className="text-red-500 text-xs mt-1">{formErrors.leaveType}</p>}
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                rows={3}
                                placeholder="State the reason for leave..."
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${formErrors.reason ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {formErrors.reason && <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>}
                        </div>
                    </div>
                }
                buttons={[
                    { label: submitting ? 'Submitting...' : 'Submit Application', type: 'green', onClick: handleSubmitLeave, disabled: submitting },
                    { label: 'Cancel', type: 'red', onClick: () => setAddModal(false) },
                ]}
            />

            {/* ── Confirm Status Change Modal ──────────────────────────────── */}
            <ModalComponent
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                title="Confirm Action"
                body={
                    confirmAction && (
                        <div className="text-center py-4">
                            <p className="text-gray-700 mb-1">
                                Are you sure you want to <strong className={confirmAction.status === 'APPROVED' ? 'text-green-700' : 'text-red-700'}>{confirmAction.status.toLowerCase()}</strong> this leave?
                            </p>
                            <p className="text-sm text-gray-500">{confirmAction.refNo} — {confirmAction.name}</p>
                        </div>
                    )
                }
                buttons={[
                    {
                        label: confirmAction?.status === 'APPROVED' ? 'Approve' : 'Reject',
                        type:  confirmAction?.status === 'APPROVED' ? 'green' : 'red',
                        onClick: handleConfirmStatus,
                        disabled: updating,
                    },
                    { label: 'Cancel', type: 'blue', onClick: () => setConfirmModal(false) },
                ]}
            />
        </motion.div>
    );
};

export default LeaveFilingDataTable;
