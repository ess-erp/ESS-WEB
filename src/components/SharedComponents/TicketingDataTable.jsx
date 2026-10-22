import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Eye, Plus, MessageSquare, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import InputField from '../ButtonsComponents/InputField';

// ─── Constants ────────────────────────────────────────────────────────────────
const TICKET_STATUS = [
    { value: '', label: 'All Status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
];

const TICKET_PRIORITY = [
    { value: '', label: 'All Priority' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
];

const TICKET_CATEGORY = [
    { value: 'Technical Issue', label: 'Technical Issue' },
    { value: 'Account Support', label: 'Account Support' },
    { value: 'Feature Request', label: 'Feature Request' },
    { value: 'Bug Report', label: 'Bug Report' },
    { value: 'General Inquiry', label: 'General Inquiry' },
    { value: 'Other', label: 'Other' },
];

const statusConfig = {
    OPEN: { bg: 'bg-blue-100', text: 'text-blue-700', icon: AlertCircle },
    IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
    RESOLVED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    CLOSED: { bg: 'bg-gray-100', text: 'text-gray-600', icon: XCircle },
};

const priorityConfig = {
    LOW: { bg: 'bg-gray-100', text: 'text-gray-600' },
    MEDIUM: { bg: 'bg-blue-100', text: 'text-blue-700' },
    HIGH: { bg: 'bg-orange-100', text: 'text-orange-700' },
    URGENT: { bg: 'bg-red-100', text: 'text-red-700' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (raw) => {
    if (!raw) return '—';
    return new Date(raw).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: '2-digit' });
};

const fmtDateTime = (raw) => {
    if (!raw) return '—';
    return new Date(raw).toLocaleString('en-PH', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const StatusBadge = ({ status }) => {
    const s = (status ?? 'OPEN').toUpperCase().replace(' ', '_');
    const cfg = statusConfig[s] ?? statusConfig.OPEN;
    const Icon = cfg.icon;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} flex items-center gap-1 w-fit`}>
            <Icon className="w-3 h-3" />
            {status}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    const p = (priority ?? 'MEDIUM').toUpperCase();
    const cfg = priorityConfig[p] ?? priorityConfig.MEDIUM;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
            {priority}
        </span>
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
const TicketingDataTable = () => {
    const dispatch = useDispatch();

    // Mock data - replace with actual Redux state
    const [ticketList, setTicketList] = useState([
        {
            id: 1,
            ticketNo: 'TKT-2024-001',
            subject: 'Cannot access payroll module',
            category: 'Technical Issue',
            priority: 'HIGH',
            status: 'OPEN',
            createdDate: '2024-01-15T10:30:00',
            lastUpdated: '2024-01-15T10:30:00',
            assignedTo: 'IT Support Team',
        },
        {
            id: 2,
            ticketNo: 'TKT-2024-002',
            subject: 'Request password reset',
            category: 'Account Support',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdDate: '2024-01-14T14:20:00',
            lastUpdated: '2024-01-15T09:15:00',
            assignedTo: 'Admin Team',
        },
        {
            id: 3,
            ticketNo: 'TKT-2024-003',
            subject: 'Leave balance showing incorrect data',
            category: 'Bug Report',
            priority: 'URGENT',
            status: 'IN_PROGRESS',
            createdDate: '2024-01-13T16:45:00',
            lastUpdated: '2024-01-15T11:00:00',
            assignedTo: 'Development Team',
        },
        {
            id: 4,
            ticketNo: 'TKT-2024-004',
            subject: 'Request for new feature in attendance',
            category: 'Feature Request',
            priority: 'LOW',
            status: 'RESOLVED',
            createdDate: '2024-01-10T09:00:00',
            lastUpdated: '2024-01-14T17:30:00',
            assignedTo: 'Product Team',
        },
    ]);

    // ── Pagination & filters ──────────────────────────────────────────────────
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState(null);
    const [loading, setLoading] = useState(false);

    // ── Modal state ───────────────────────────────────────────────────────────
    const [viewModal, setViewModal] = useState(false);
    const [createTicketModal, setCreateTicketModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // ── Create Ticket form ────────────────────────────────────────────────────
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: null,
        priority: null,
        description: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // ── Summary KPIs (mock data) ──────────────────────────────────────────────
    const summaryKPIs = {
        openTickets: 1,
        inProgress: 2,
        resolvedTickets: 1,
        avgResponseTime: '2.5 hrs',
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Ticket #',
            selector: (row) => row.ticketNo,
            sortable: true,
            cell: (row) => <span className="font-semibold text-blue-600">{row.ticketNo}</span>,
            width: '130px',
        },
        {
            name: 'Subject',
            selector: (row) => row.subject,
            sortable: true,
            cell: (row) => (
                <div className="py-2">
                    <p className="font-medium text-sm">{row.subject}</p>
                    <p className="text-xs text-gray-500">{row.category}</p>
                </div>
            ),
            wrap: true,
            width: '300px',
        },
        {
            name: 'Priority',
            selector: (row) => row.priority,
            sortable: true,
            cell: (row) => <PriorityBadge priority={row.priority} />,
            center: true,
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => <StatusBadge status={row.status} />,
        },
        {
            name: 'Created Date',
            selector: (row) => row.createdDate,
            sortable: true,
            cell: (row) => <span className="text-sm text-gray-600">{fmtDate(row.createdDate)}</span>,
        },
        {
            name: 'Assigned To',
            selector: (row) => row.assignedTo,
            cell: (row) => <span className="text-sm">{row.assignedTo}</span>,
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
            width: '100px',
        },
    ];

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (row) => {
        setSelectedTicket(row);
        setViewModal(true);
    };

    const handleCreateTicket = () => {
        setCreateTicketModal(true);
    };

    const validateTicketForm = () => {
        const errors = {};
        if (!ticketForm.subject?.trim()) errors.subject = 'Subject is required';
        if (!ticketForm.category) errors.category = 'Category is required';
        if (!ticketForm.priority) errors.priority = 'Priority is required';
        if (!ticketForm.description?.trim()) errors.description = 'Description is required';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitTicket = async () => {
        if (!validateTicketForm()) return;

        setCreateTicketModal(false);
        // TODO: Dispatch actual Redux action
        console.log('Submitting ticket:', ticketForm);
        
        // Reset form
        setTicketForm({ subject: '', category: null, priority: null, description: '' });
        setFormErrors({});
    };

    const filteredData = ticketList.filter((row) => {
        const matchesSearch = search
            ? row.ticketNo?.toLowerCase().includes(search.toLowerCase()) ||
              row.subject?.toLowerCase().includes(search.toLowerCase()) ||
              row.category?.toLowerCase().includes(search.toLowerCase())
            : true;
        const matchesStatus = statusFilter ? row.status === statusFilter.value : true;
        const matchesPriority = priorityFilter ? row.priority === priorityFilter.value : true;
        return matchesSearch && matchesStatus && matchesPriority;
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-blue-700 mb-1">Open Tickets</p>
                            <p className="text-2xl font-bold text-blue-900">{summaryKPIs.openTickets}</p>
                            <p className="text-xs text-blue-600 mt-1">awaiting response</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-yellow-700 mb-1">In Progress</p>
                            <p className="text-2xl font-bold text-yellow-900">{summaryKPIs.inProgress}</p>
                            <p className="text-xs text-yellow-600 mt-1">being worked on</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-green-700 mb-1">Resolved</p>
                            <p className="text-2xl font-bold text-green-900">{summaryKPIs.resolvedTickets}</p>
                            <p className="text-xs text-green-600 mt-1">this month</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-purple-700 mb-1">Avg Response Time</p>
                            <p className="text-2xl font-bold text-purple-900">{summaryKPIs.avgResponseTime}</p>
                            <p className="text-xs text-purple-600 mt-1">current month</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-purple-600" />
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
                                placeholder="Search tickets..."
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
                        <div className="w-full md:w-40">
                            <SearchableSelect
                                options={TICKET_STATUS}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                placeholder="Status"
                            />
                        </div>

                        {/* Priority Filter */}
                        <div className="w-full md:w-40">
                            <SearchableSelect
                                options={TICKET_PRIORITY}
                                value={priorityFilter}
                                onChange={setPriorityFilter}
                                placeholder="Priority"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleCreateTicket}
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Ticket
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
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No tickets found</p>
                        </div>
                    }
                />
            </motion.div>

            {/* View Ticket Details Modal */}
            <ModalComponent
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title="Ticket Details"
                size="w-[700px]"
                buttons={[
                    { label: 'Close', type: 'red', onClick: () => setViewModal(false) },
                ]}
            >
                {selectedTicket && (
                    <div className="space-y-5">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-bold text-lg text-gray-900">{selectedTicket.ticketNo}</p>
                                    <p className="text-sm text-gray-600 mt-1">{selectedTicket.subject}</p>
                                </div>
                                <StatusBadge status={selectedTicket.status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Category</p>
                                <p className="font-semibold">{selectedTicket.category}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Priority</p>
                                <PriorityBadge priority={selectedTicket.priority} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Created Date</p>
                                <p className="font-semibold text-sm">{fmtDateTime(selectedTicket.createdDate)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                                <p className="font-semibold text-sm">{fmtDateTime(selectedTicket.lastUpdated)}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                            <p className="font-semibold">{selectedTicket.assignedTo}</p>
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-xs text-gray-500 mb-2">Description</p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    This is a sample ticket description. In production, this would contain the actual ticket details, issue description, and any relevant information provided by the user.
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-sm font-semibold text-gray-900 mb-3">Activity Timeline</p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Ticket Created</p>
                                        <p className="text-xs text-gray-500">{fmtDateTime(selectedTicket.createdDate)}</p>
                                    </div>
                                </div>
                                {selectedTicket.status !== 'OPEN' && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Assigned to {selectedTicket.assignedTo}</p>
                                            <p className="text-xs text-gray-500">{fmtDateTime(selectedTicket.lastUpdated)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </ModalComponent>

            {/* Create Ticket Modal */}
            <ModalComponent
                isOpen={createTicketModal}
                onClose={() => setCreateTicketModal(false)}
                title="Create New Ticket"
                size="w-[650px]"
                buttons={[
                    { label: 'Submit Ticket', type: 'green', onClick: handleSubmitTicket },
                    { label: 'Cancel', type: 'red', onClick: () => setCreateTicketModal(false) },
                ]}
            >
                <div className="space-y-4">
                    <InputField
                        label="Subject"
                        type="text"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        error={formErrors.subject}
                        placeholder="Brief description of your issue"
                        required
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <SearchableSelect
                                options={TICKET_CATEGORY}
                                value={ticketForm.category}
                                onChange={(val) => setTicketForm({ ...ticketForm, category: val })}
                                placeholder="Select category"
                                errors={formErrors.category}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                            <SearchableSelect
                                options={TICKET_PRIORITY.filter(p => p.value !== '')}
                                value={ticketForm.priority}
                                onChange={(val) => setTicketForm({ ...ticketForm, priority: val })}
                                placeholder="Select priority"
                                errors={formErrors.priority}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                            value={ticketForm.description}
                            onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            placeholder="Please provide detailed information about your issue or request..."
                        />
                        {formErrors.description && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                            <strong>Note:</strong> Our support team will review your ticket and respond within 24-48 hours during business days.
                        </p>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default TicketingDataTable;
