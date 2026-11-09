import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, X, Eye, Edit, Filter, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from 'react-data-table-component';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import { fetchEmployeeList, fetchDepartmentTemplateData } from '../../states/HumanResourcesState/Action';

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

    const departmentList = useSelector((state) => state.hr.departmentState.data || []);
    const [depList, setDepList] = useState([]);

    // ── Pagination & filters ──────────────────────────────────────────────────
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // ── Fetch Department List ─────────────────────────────────────────────────
    useEffect(() => {
        dispatch(fetchDepartmentTemplateData());
    }, [dispatch]);

    // ── Map Department Data ───────────────────────────────────────────────────
    useEffect(() => {
        const depMappedOptions = [
            { value: null, label: 'All Departments' },
            ...departmentList.map((i) => ({
                value: i.DepChildId,
                label: `${i.DepartmentCode} - ${i.DepartmentName}`,
            }))
        ];
        setDepList(depMappedOptions);
    }, [departmentList]);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchData = useCallback(() => {
        dispatch(
            fetchEmployeeList(
                page,
                pageSize,
                search,
                department?.value || null,
                null // status filter
            )
        );
    }, [page, pageSize, search, department, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleViewEmployee = (row) => {
        const empId = row.EmployeeId;
        // Navigate to employee form with ID in URL parameter
        navigate(`/hrd/employeeappform/${empId}`);
    };

    const handleEditEmployee = (row) => {
        // Navigate to employee data management page
        navigate(`/hrd/employeedatamanagement/${row.EmployeeId}`);
    };

    const handleClearFilters = () => {
        setSearch('');
        setDepartment(null);
        setPage(1);
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Employee No.',
            selector: (r) => r.EmployeeNumber ?? '—',
            sortable: true,
            width: '145px',
            cell: (r) => (
                <span className="text-xs font-mono font-bold text-gray-900">
                    {r.EmployeeNumber ?? '—'}
                </span>
            ),
        },
        {
            name: 'Full Name',
            selector: (r) => r.Fullname ?? '—',
            sortable: true,
            grow: 2,
            cell: (r) => {
                const fullName = r.Fullname ?? '—';
                return <span className="text-sm font-semibold text-gray-900">{fullName}</span>;
            },
        },
        {
            name: 'Email Address',
            selector: (r) => r.Email ?? '—',
            sortable: true,
            minWidth: '220px',
            cell: (r) => (
                <span className="text-xs text-gray-700">
                    {r.Email ?? '—'}
                </span>
            ),
        },
        {
            name: 'Department',
            selector: (r) => r.DepartmentName ?? '—',
            sortable: true,
            minWidth: '160px',
            cell: (r) => (
                <span className="text-xs text-gray-800 font-medium">
                    {r.DepartmentName ?? '—'}
                </span>
            ),
        },
        {
            name: 'Position / Role',
            selector: (r) => r.Position ?? r.EmployeeCategory ?? '—',
            sortable: true,
            minWidth: '160px',
            cell: (r) => (
                <span className="text-xs text-gray-700">
                    {r.Position ?? r.EmployeeCategory ?? '—'}
                </span>
            ),
        },
        {
            name: 'Campus',
            selector: (r) => r.CampusName ?? '—',
            sortable: true,
            minWidth: '140px',
            cell: (r) => (
                <span className="text-xs text-gray-700">
                    {r.CampusName ?? '—'}
                </span>
            ),
        },
        {
            name: 'Date Hired',
            selector: (r) => r.DateCreated,
            sortable: true,
            width: '120px',
            cell: (r) => {
                if (!r.DateHired) return <span className="text-xs text-gray-500">—</span>;
                const date = new Date(r.DateCreated);
                const formatted = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                return <span className="text-xs text-gray-700">{formatted}</span>;
            },
        },
        {
            name: 'Actions',
            width: '110px',
            center: true,
            cell: (r) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditEmployee(r);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                    title="Edit Employee"
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
                        {(search || department) && (
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
                                <div className="grid grid-cols-1 gap-4">
                                    <SearchableSelect
                                        label="Department"
                                        options={depList}
                                        value={department}
                                        onChange={setDepartment}
                                        placeholder="All departments..."
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
                        key={`${page}-${search}-${department?.value}`}
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
