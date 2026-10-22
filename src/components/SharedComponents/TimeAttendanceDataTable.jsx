import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Eye, Plus, Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import InputField from '../ButtonsComponents/InputField';
import GreenBtn from '../ButtonsComponents/GreenBtn';
import OutlineRedBtn from '../ButtonsComponents/OutlineRedBtn';

// ─── Constants ────────────────────────────────────────────────────────────────
const ATTENDANCE_STATUS = [
    { value: '', label: 'All Status' },
    { value: 'PRESENT', label: 'Present' },
    { value: 'ABSENT', label: 'Absent' },
    { value: 'LATE', label: 'Late' },
    { value: 'HALFDAY', label: 'Half Day' },
    { value: 'LEAVE', label: 'On Leave' },
];

const LEAVE_TYPES = [
    { value: 'Sick Leave', label: 'Sick Leave' },
    { value: 'Vacation Leave', label: 'Vacation Leave' },
    { value: 'Emergency Leave', label: 'Emergency Leave' },
    { value: 'Maternity Leave', label: 'Maternity Leave' },
    { value: 'Paternity Leave', label: 'Paternity Leave' },
];

const statusConfig = {
    PRESENT: { bg: 'bg-green-100', text: 'text-green-700' },
    ABSENT: { bg: 'bg-red-100', text: 'text-red-700' },
    LATE: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    HALFDAY: { bg: 'bg-blue-100', text: 'text-blue-700' },
    LEAVE: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (raw) => {
    if (!raw) return '—';
    return new Date(raw).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' });
};

const fmtTime = (raw) => {
    if (!raw) return '—';
    return new Date(raw).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
};

const StatusBadge = ({ status }) => {
    const s = (status ?? 'PRESENT').toUpperCase();
    const cfg = statusConfig[s] ?? statusConfig.PRESENT;
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

// ─── Main Component ───────────────────────────────────────────────────────────
const TimeAttendanceDataTable = () => {
    const dispatch = useDispatch();

    // Mock data - replace with actual Redux state
    const [attendanceList, setAttendanceList] = useState([
        { id: 1, date: '2024-01-15', timeIn: '08:00 AM', timeOut: '05:00 PM', status: 'PRESENT', hoursWorked: '8.0' },
        { id: 2, date: '2024-01-16', timeIn: '08:15 AM', timeOut: '05:00 PM', status: 'LATE', hoursWorked: '7.75' },
        { id: 3, date: '2024-01-17', timeIn: '—', timeOut: '—', status: 'LEAVE', hoursWorked: '0' },
    ]);

    // ── Pagination & filters ──────────────────────────────────────────────────
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [loading, setLoading] = useState(false);

    // ── Modal state ───────────────────────────────────────────────────────────
    const [viewModal, setViewModal] = useState(false);
    const [fileLeaveModal, setFileLeaveModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // ── File Leave form ───────────────────────────────────────────────────────
    const [leaveForm, setLeaveForm] = useState({
        leaveType: null,
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // ── Summary KPIs (mock data) ──────────────────────────────────────────────
    const summaryKPIs = {
        leaveBalance: 15,
        pendingApprovals: 2,
        presentDays: 18,
        absentDays: 1,
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Date',
            selector: (row) => row.date,
            sortable: true,
            cell: (row) => <span className="font-medium">{fmtDate(row.date)}</span>,
        },
        {
            name: 'Time In',
            selector: (row) => row.timeIn,
            cell: (row) => <span className="text-sm">{row.timeIn}</span>,
        },
        {
            name: 'Time Out',
            selector: (row) => row.timeOut,
            cell: (row) => <span className="text-sm">{row.timeOut}</span>,
        },
        {
            name: 'Hours Worked',
            selector: (row) => row.hoursWorked,
            cell: (row) => <span className="font-semibold text-gray-700">{row.hoursWorked}h</span>,
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            cell: (row) => <StatusBadge status={row.status} />,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <button
                    onClick={() => handleView(row)}
                    className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                    title="View Details"
                >
                    <Eye className="w-4 h-4" />
                </button>
            ),
            button: true,
        },
    ];

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (row) => {
        setSelectedRecord(row);
        setViewModal(true);
    };

    const handleFileLeave = () => {
        setFileLeaveModal(true);
    };

    const validateLeaveForm = () => {
        const errors = {};
        if (!leaveForm.leaveType) errors.leaveType = 'Leave type is required';
        if (!leaveForm.startDate) errors.startDate = 'Start date is required';
        if (!leaveForm.endDate) errors.endDate = 'End date is required';
        if (!leaveForm.reason?.trim()) errors.reason = 'Reason is required';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitLeave = async () => {
        if (!validateLeaveForm()) return;

        setFileLeaveModal(false);
        // TODO: Dispatch actual Redux action
        console.log('Submitting leave:', leaveForm);
        
        // Reset form
        setLeaveForm({ leaveType: null, startDate: '', endDate: '', reason: '' });
        setFormErrors({});
    };

    const filteredData = attendanceList.filter((row) => {
        const matchesSearch = search ? 
            row.date?.toLowerCase().includes(search.toLowerCase()) ||
            row.status?.toLowerCase().includes(search.toLowerCase())
            : true;
        const matchesStatus = statusFilter ? row.status === statusFilter.value : true;
        return matchesSearch && matchesStatus;
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
                            <p className="text-xs font-medium text-green-700 mb-1">Leave Balance</p>
                            <p className="text-2xl font-bold text-green-900">{summaryKPIs.leaveBalance}</p>
                            <p className="text-xs text-green-600 mt-1">days remaining</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-yellow-700 mb-1">Pending Approvals</p>
                            <p className="text-2xl font-bold text-yellow-900">{summaryKPIs.pendingApprovals}</p>
                            <p className="text-xs text-yellow-600 mt-1">awaiting review</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-blue-700 mb-1">Present Days</p>
                            <p className="text-2xl font-bold text-blue-900">{summaryKPIs.presentDays}</p>
                            <p className="text-xs text-blue-600 mt-1">this month</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-red-700 mb-1">Absent Days</p>
                            <p className="text-2xl font-bold text-red-900">{summaryKPIs.absentDays}</p>
                            <p className="text-xs text-red-600 mt-1">this month</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-600" />
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
                                placeholder="Search date or status..."
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

                        {/* Status Filter */}
                        <div className="w-full md:w-48">
                            <SearchableSelect
                                options={ATTENDANCE_STATUS}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                placeholder="Filter by status"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleFileLeave}
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        File Leave Request
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
                            <p className="text-gray-500 font-medium">No attendance records found</p>
                        </div>
                    }
                />
            </motion.div>

            {/* View Details Modal */}
            <ModalComponent
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title="Attendance Details"
                size="w-[500px]"
                buttons={[
                    { label: 'Close', type: 'red', onClick: () => setViewModal(false) },
                ]}
            >
                {selectedRecord && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Date</p>
                                <p className="font-semibold">{fmtDate(selectedRecord.date)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <StatusBadge status={selectedRecord.status} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Time In</p>
                                <p className="font-semibold">{selectedRecord.timeIn}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Time Out</p>
                                <p className="font-semibold">{selectedRecord.timeOut}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Total Hours Worked</p>
                            <p className="font-semibold text-lg">{selectedRecord.hoursWorked} hours</p>
                        </div>
                    </div>
                )}
            </ModalComponent>

            {/* File Leave Modal */}
            <ModalComponent
                isOpen={fileLeaveModal}
                onClose={() => setFileLeaveModal(false)}
                title="File Leave Request"
                size="w-[600px]"
                buttons={[
                    { label: 'Submit Request', type: 'green', onClick: handleSubmitLeave },
                    { label: 'Cancel', type: 'red', onClick: () => setFileLeaveModal(false) },
                ]}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                        <SearchableSelect
                            options={LEAVE_TYPES}
                            value={leaveForm.leaveType}
                            onChange={(val) => setLeaveForm({ ...leaveForm, leaveType: val })}
                            placeholder="Select leave type"
                            errors={formErrors.leaveType}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Start Date"
                            type="date"
                            value={leaveForm.startDate}
                            onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                            error={formErrors.startDate}
                            required
                        />
                        <InputField
                            label="End Date"
                            type="date"
                            value={leaveForm.endDate}
                            onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                            error={formErrors.endDate}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                        <textarea
                            value={leaveForm.reason}
                            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            placeholder="Please provide a reason for your leave request..."
                        />
                        {formErrors.reason && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>
                        )}
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default TimeAttendanceDataTable;
