import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, X, Eye, Edit, Filter, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from 'react-data-table-component';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import { fetchEmployeeList } from '../../states/HumanResourcesState/Action';

// ─── Constants ────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
    { value: '', label: 'All Departments' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Administration', label: 'Administration' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Maintenance', label: 'Maintenance' },
];

const STATUS_OPTS = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
];

const statusConfig = {
    Active: { bg: 'bg-green-100', text: 'text-green-700' },
    Inactive: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const s = status ?? 'Active';
    const cfg = statusConfig[s] ?? statusConfig.Active;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
            {s}
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
const EmployeeListDataTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ── Redux ─────────────────────────────────────────────────────────────────
    const { loading, data: rawData, totalRecords } = useSelector((s) => s.hr.employeeListState);
    const employeeList = Array.isArray(rawData) ? rawData : [];

    // ── Pagination & filters ──────────────────────────────────────────────────
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchData = useCallback(() => {
        dispatch(
            fetchEmployeeList({
                page,
                pageSize,
                search,
                departmentId: department?.value || null,
                status: statusFilter?.value || null,
            })
        );
    }, [page, pageSize, search, department, statusFilter, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleViewEmployee = (row) => {
        const empId = row.EmployeeId ?? row.employeeId ?? row.id;
        // Navigate to employee form with ID in URL parameter
        navigate(`/hrd/employeeappform/${empId}`);
    };

    const handleClearFilters = () => {
        setSearch('');
        setDepartment(null);
        setStatusFilter(null);
        setPage(1);
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Employee No.',
            selector: (r) => r.EmployeeNo ?? r.employeeNo ?? '—',
            sortable: true,
            width: '145px',
            cell: (r) => (
                <span className="text-xs font-mono font-bold text-gray-900">
                    {r.EmployeeNo ?? r.employeeNo ?? '—'}
                </span>
            ),
        },
        {
            name: 'Full Name',
            selector: (r) => r.FullName ?? r.fullName ?? '—',
            sortable: true,
            grow: 2,
            cell: (r) => {
                // Format: Last Name, First Name M.I.
                const fullName =
                    r.FullName ??
                    r.fullName ??
                    (r.Lname && r.Fname
                        ? `${r.Lname}, ${r.Fname} ${(r.Mname ?? '').charAt(0)}.`
                        : '—');
                return <span className="text-sm font-semibold text-gray-900">{fullName}</span>;
            },
        },
        {
            name: 'Email Address',
            selector: (r) => r.Email ?? r.email ?? '—',
            sortable: true,
            minWidth: '220px',
            cell: (r) => (
                <span className="text-xs text-gray-700">
                    {r.Email ?? r.email ?? '—'}
                </span>
            ),
        },
        {
            name: 'Department',
            selector: (r) => r.Department ?? r.department ?? '—',
            sortable: true,
            minWidth: '160px',
            cell: (r) => (
                <span className="text-xs text-gray-800 font-medium">
                    {r.Department ?? r.department ?? '—'}
                </span>
            ),
        },
        {
            name: 'Position / Role',
            selector: (r) => r.Position ?? r.position ?? '—',
            sortable: true,
            minWidth: '160px',
            cell: (r) => (
                <span className="text-xs text-gray-700">{r.Position ?? r.position ?? '—'}</span>
            ),
        },
        {
            name: 'Status',
            selector: (r) => r.Status ?? r.status ?? 'Active',
            sortable: true,
            width: '110px',
            cell: (r) => <StatusBadge status={r.Status ?? r.status} />,
        },
        {
            name: 'Actions',
            width: '110px',
            center: true,
            cell: (r) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleViewEmployee(r);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                    title="View / Edit Employee"
                >
                    <Edit size={14} />
                    Edit
                </button>
            ),
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
                        <Users size={20} className="text-white" />
                        <div>
                            <h3 className="text-lg font-bold text-white">Employee Directory</h3>
                            <p className="text-green-100 text-xs mt-0.5">
                                Manage and view all employee records
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search by name, employee number, or email..."
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            {search && (
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        setPage(1);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X size={15} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                showFilters
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Filter size={15} />
                            Filters
                            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {(search || department || statusFilter) && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100"
                            >
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
                                        label="Department"
                                        options={DEPARTMENTS}
                                        value={department}
                                        onChange={setDepartment}
                                        placeholder="All departments..."
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

                {/* DataTable */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${page}-${search}-${department?.value}-${statusFilter?.value}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                    >
                        <DataTable
                            columns={columns}
                            data={employeeList}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRecords ?? 0}
                            paginationDefaultPage={page}
                            onChangePage={(newPage) => setPage(newPage)}
                            onChangeRowsPerPage={(newSize, newPage) => {
                                setPageSize(newSize);
                                setPage(newPage);
                            }}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            customStyles={customStyles}
                            noDataComponent={
                                <div className="py-14 text-center">
                                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No employees found</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Try adjusting your filters
                                    </p>
                                </div>
                            }
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default EmployeeListDataTable;
