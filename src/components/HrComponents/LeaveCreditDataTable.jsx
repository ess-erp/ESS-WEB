import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Edit, Save, Plus, Minus, Users, Calendar, Briefcase, MapPin, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from 'react-data-table-component';
import { showToast } from '../../states/NotificationState/Action';

/**
 * LeaveCreditDataTable Component
 * 
 * Comprehensive DataTable for managing employee leave credits
 * Features: Search, filter, inline editing, bulk actions
 * Strictly manages Work Leave and Medical Leave only
 */
const LeaveCreditDataTable = () => {
    const dispatch = useDispatch();

    // ─── State ────────────────────────────────────────────────────────────────
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // ─── Mock Employee Data (Replace with actual API call) ────────────────────
    const mockEmployees = [
        {
            id: 1,
            employeeNo: 'EMP-2026-0001',
            name: 'Juan Dela Cruz',
            department: 'Human Resources',
            position: 'HR Manager',
            workLeave: { allocated: 15, used: 3, remaining: 12 },
            medicalLeave: { allocated: 10, used: 1, remaining: 9 }
        },
        {
            id: 2,
            employeeNo: 'EMP-2026-0002',
            name: 'Maria Santos',
            department: 'Finance',
            position: 'Accountant',
            workLeave: { allocated: 15, used: 8, remaining: 7 },
            medicalLeave: { allocated: 10, used: 2, remaining: 8 }
        },
        {
            id: 3,
            employeeNo: 'EMP-2026-0003',
            name: 'Pedro Garcia',
            department: 'Academic',
            position: 'Teacher',
            workLeave: { allocated: 20, used: 5, remaining: 15 },
            medicalLeave: { allocated: 15, used: 0, remaining: 15 }
        },
        {
            id: 4,
            employeeNo: 'EMP-2026-0004',
            name: 'Ana Reyes',
            department: 'Academic',
            position: 'Department Head',
            workLeave: { allocated: 20, used: 12, remaining: 8 },
            medicalLeave: { allocated: 15, used: 5, remaining: 10 }
        },
        {
            id: 5,
            employeeNo: 'EMP-2026-0005',
            name: 'Carlos Ramos',
            department: 'IT',
            position: 'System Administrator',
            workLeave: { allocated: 15, used: 0, remaining: 15 },
            medicalLeave: { allocated: 10, used: 0, remaining: 10 }
        },
        {
            id: 6,
            employeeNo: 'EMP-2026-0006',
            name: 'Sofia Mendoza',
            department: 'Human Resources',
            position: 'HR Assistant',
            workLeave: { allocated: 15, used: 7, remaining: 8 },
            medicalLeave: { allocated: 10, used: 3, remaining: 7 }
        },
        {
            id: 7,
            employeeNo: 'EMP-2026-0007',
            name: 'Miguel Torres',
            department: 'Finance',
            position: 'Finance Officer',
            workLeave: { allocated: 15, used: 4, remaining: 11 },
            medicalLeave: { allocated: 10, used: 1, remaining: 9 }
        },
        {
            id: 8,
            employeeNo: 'EMP-2026-0008',
            name: 'Elena Cruz',
            department: 'Academic',
            position: 'Teacher',
            workLeave: { allocated: 20, used: 10, remaining: 10 },
            medicalLeave: { allocated: 15, used: 8, remaining: 7 }
        },
        {
            id: 9,
            employeeNo: 'EMP-2026-0009',
            name: 'Roberto Lim',
            department: 'IT',
            position: 'IT Support',
            workLeave: { allocated: 15, used: 2, remaining: 13 },
            medicalLeave: { allocated: 10, used: 0, remaining: 10 }
        },
        {
            id: 10,
            employeeNo: 'EMP-2026-0010',
            name: 'Carmen Flores',
            department: 'Finance',
            position: 'Budget Officer',
            workLeave: { allocated: 15, used: 6, remaining: 9 },
            medicalLeave: { allocated: 10, used: 4, remaining: 6 }
        },
    ];

    // ─── Fetch Employees ──────────────────────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            // TODO: Replace with actual API call
            // const result = await dispatch(fetchEmployeeLeaveCredits());
            // setEmployees(result.data);
            
            setTimeout(() => {
                setEmployees(mockEmployees);
                setLoading(false);
            }, 500);
        };

        fetchData();
    }, []);

    // ─── Filter Employees ─────────────────────────────────────────────────────
    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = search === '' || 
            emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.employeeNo.toLowerCase().includes(search.toLowerCase()) ||
            emp.department.toLowerCase().includes(search.toLowerCase());
        
        const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter;

        return matchesSearch && matchesDepartment;
    });

    // ─── Get Unique Departments ───────────────────────────────────────────────
    const departments = [...new Set(employees.map(emp => emp.department))];

    // ─── Edit Handlers ────────────────────────────────────────────────────────
    const handleEdit = (employee) => {
        setEditingId(employee.id);
        setEditData({
            workAllocated: employee.workLeave.allocated,
            workUsed: employee.workLeave.used,
            medicalAllocated: employee.medicalLeave.allocated,
            medicalUsed: employee.medicalLeave.used,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleSave = async (employee) => {
        // Validation
        if (editData.workUsed > editData.workAllocated) {
            dispatch(showToast('error', 'Work leave used cannot exceed allocated'));
            return;
        }
        if (editData.medicalUsed > editData.medicalAllocated) {
            dispatch(showToast('error', 'Medical leave used cannot exceed allocated'));
            return;
        }

        // TODO: Replace with actual API call
        // const result = await dispatch(updateEmployeeLeaveCredits(employee.id, {
        //     workLeave: { allocated: editData.workAllocated, used: editData.workUsed },
        //     medicalLeave: { allocated: editData.medicalAllocated, used: editData.medicalUsed }
        // }));

        // Update local state
        setEmployees(prev => prev.map(emp => 
            emp.id === employee.id 
                ? {
                    ...emp,
                    workLeave: {
                        allocated: editData.workAllocated,
                        used: editData.workUsed,
                        remaining: editData.workAllocated - editData.workUsed
                    },
                    medicalLeave: {
                        allocated: editData.medicalAllocated,
                        used: editData.medicalUsed,
                        remaining: editData.medicalAllocated - editData.medicalUsed
                    }
                }
                : emp
        ));

        dispatch(showToast('success', `Leave credits updated for ${employee.name}`));
        setEditingId(null);
        setEditData({});
    };

    const handleIncrement = (field, value = 1) => {
        setEditData(prev => ({ ...prev, [field]: (prev[field] || 0) + value }));
    };

    const handleDecrement = (field, value = 1) => {
        setEditData(prev => ({ ...prev, [field]: Math.max(0, (prev[field] || 0) - value) }));
    };

    // ─── Render Edit Controls ─────────────────────────────────────────────────
    const renderEditControls = (value, field, color = 'blue') => {
        const colorClasses = {
            blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400',
            green: 'bg-green-600 hover:bg-green-700 focus:ring-green-400'
        };

        return (
            <div className="flex items-center gap-1">
                <button
                    onClick={() => handleDecrement(field)}
                    className={`${colorClasses[color]} text-white rounded p-1 transition-colors`}
                    title="Decrease"
                >
                    <Minus size={12} />
                </button>
                <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={value}
                    onChange={(e) => setEditData(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={() => handleIncrement(field)}
                    className={`${colorClasses[color]} text-white rounded p-1 transition-colors`}
                    title="Increase"
                >
                    <Plus size={12} />
                </button>
            </div>
        );
    };

    // ─── Table Columns ────────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Employee No.',
            selector: row => row.employeeNo,
            sortable: true,
            width: '135px',
            cell: row => (
                <span className="text-xs font-mono font-bold text-gray-900">{row.employeeNo}</span>
            )
        },
        {
            name: 'Employee Name',
            selector: row => row.name,
            sortable: true,
            grow: 2,
            cell: row => (
                <div>
                    <div className="text-sm font-bold text-gray-900">{row.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Briefcase size={10} />
                        {row.position}
                    </div>
                </div>
            )
        },
        {
            name: 'Department',
            selector: row => row.department,
            sortable: true,
            width: '150px',
            cell: row => (
                <span className="text-xs text-gray-700 flex items-center gap-1">
                    <MapPin size={12} className="text-gray-400" />
                    {row.department}
                </span>
            )
        },
        {
            name: 'Work Leave',
            width: '280px',
            cell: row => {
                const isEditing = editingId === row.id;
                const allocated = isEditing ? editData.workAllocated : row.workLeave.allocated;
                const used = isEditing ? editData.workUsed : row.workLeave.used;
                const remaining = allocated - used;
                const percentage = allocated > 0 ? (remaining / allocated) * 100 : 0;

                return (
                    <div className="w-full py-1">
                        {isEditing ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-600 w-16">Allocated:</span>
                                    {renderEditControls(editData.workAllocated, 'workAllocated', 'blue')}
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-600 w-16">Used:</span>
                                    {renderEditControls(editData.workUsed, 'workUsed', 'blue')}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600">Remaining: <span className="font-bold text-blue-700">{remaining}</span></span>
                                    <span className="text-xs text-gray-500">{used} / {allocated}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                                        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            name: 'Medical Leave',
            width: '280px',
            cell: row => {
                const isEditing = editingId === row.id;
                const allocated = isEditing ? editData.medicalAllocated : row.medicalLeave.allocated;
                const used = isEditing ? editData.medicalUsed : row.medicalLeave.used;
                const remaining = allocated - used;
                const percentage = allocated > 0 ? (remaining / allocated) * 100 : 0;

                return (
                    <div className="w-full py-1">
                        {isEditing ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-600 w-16">Allocated:</span>
                                    {renderEditControls(editData.medicalAllocated, 'medicalAllocated', 'green')}
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-600 w-16">Used:</span>
                                    {renderEditControls(editData.medicalUsed, 'medicalUsed', 'green')}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600">Remaining: <span className="font-bold text-green-700">{remaining}</span></span>
                                    <span className="text-xs text-gray-500">{used} / {allocated}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                                        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            name: 'Actions',
            width: '100px',
            center: true,
            cell: row => {
                const isEditing = editingId === row.id;
                
                return (
                    <div className="flex items-center gap-1">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => handleSave(row)}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Save"
                                >
                                    <Save size={16} />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Cancel"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => handleEdit(row)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Credits"
                            >
                                <Edit size={16} />
                            </button>
                        )}
                    </div>
                );
            }
        }
    ];

    // ─── Table Styles ─────────────────────────────────────────────────────────
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
        headCells: {
            style: {
                paddingLeft: '14px',
                paddingRight: '14px',
            },
        },
        rows: {
            style: {
                minHeight: '80px',
                '&:hover': {
                    backgroundColor: '#f0fdf4',
                    cursor: 'pointer',
                },
            },
        },
        cells: {
            style: {
                paddingLeft: '14px',
                paddingRight: '14px',
            },
        },
    };

    // ─── Conditional Row Styles ───────────────────────────────────────────────
    const conditionalRowStyles = [
        {
            when: row => editingId === row.id,
            style: {
                backgroundColor: '#fef3c7',
                borderLeft: '4px solid #f59e0b',
            },
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-white" />
                        <div>
                            <h3 className="text-lg font-bold text-white">Employee Leave Credits Management</h3>
                            <p className="text-green-100 text-xs mt-0.5">Click Edit to update work leave and medical leave credits</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, employee number, or department..."
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X size={15} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        {/* Filter Toggle */}
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

                        {/* Clear Filters */}
                        {(search || departmentFilter) && (
                            <button
                                onClick={() => { setSearch(''); setDepartmentFilter(''); }}
                                className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100"
                            >
                                <X size={14} /> Clear
                            </button>
                        )}
                    </div>

                    {/* Department Filter */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 overflow-hidden"
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setDepartmentFilter('')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            departmentFilter === '' 
                                                ? 'bg-green-600 text-white shadow-md' 
                                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        All Departments
                                    </button>
                                    {departments.map(dept => (
                                        <button
                                            key={dept}
                                            onClick={() => setDepartmentFilter(dept)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                departmentFilter === dept 
                                                    ? 'bg-green-600 text-white shadow-md' 
                                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* DataTable */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${search}-${departmentFilter}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                    >
                        <DataTable
                            columns={columns}
                            data={filteredEmployees}
                            progressPending={loading}
                            pagination
                            paginationPerPage={pageSize}
                            paginationRowsPerPageOptions={[10, 20, 30, 50]}
                            onChangeRowsPerPage={(newPageSize) => setPageSize(newPageSize)}
                            conditionalRowStyles={conditionalRowStyles}
                            highlightOnHover
                            responsive
                            customStyles={customStyles}
                            noDataComponent={
                                <div className="py-14 text-center">
                                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No employees found</p>
                                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                                </div>
                            }
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 rounded-lg p-3">
                            <Users size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Total Employees</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredEmployees.length}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 rounded-lg p-3">
                            <Calendar size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Avg Work Leave Remaining</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {filteredEmployees.length > 0
                                    ? (filteredEmployees.reduce((sum, emp) => sum + emp.workLeave.remaining, 0) / filteredEmployees.length).toFixed(1)
                                    : '0'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 rounded-lg p-3">
                            <Calendar size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Avg Medical Leave Remaining</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {filteredEmployees.length > 0
                                    ? (filteredEmployees.reduce((sum, emp) => sum + emp.medicalLeave.remaining, 0) / filteredEmployees.length).toFixed(1)
                                    : '0'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LeaveCreditDataTable;
