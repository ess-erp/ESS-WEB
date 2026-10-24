import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Users, Briefcase, MapPin, ChevronDown, CheckCircle } from 'lucide-react';

/**
 * EmployeeSearchSelector Component
 * 
 * Searchable dropdown for selecting employees to manage leave credits
 * Features: Real-time search, department filter, keyboard navigation
 * 
 * @param {Function} onEmployeeSelect - Callback when employee is selected: (employee) => void
 * @param {Object} selectedEmployee - Currently selected employee object
 */
const EmployeeSearchSelector = ({ 
    onEmployeeSelect = () => {},
    selectedEmployee = null,
}) => {
    // ─── State ────────────────────────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // ─── Mock Employee Data (Replace with actual API call) ────────────────────
    const mockEmployees = [
        {
            id: 1,
            employeeNo: 'EMP-2026-0001',
            name: 'Juan Dela Cruz',
            department: 'Human Resources',
            position: 'HR Manager',
            credits: {
                workLeave: { allocated: 15, used: 3 },
                medicalLeave: { allocated: 10, used: 1 }
            }
        },
        {
            id: 2,
            employeeNo: 'EMP-2026-0002',
            name: 'Maria Santos',
            department: 'Finance',
            position: 'Accountant',
            credits: {
                workLeave: { allocated: 15, used: 8 },
                medicalLeave: { allocated: 10, used: 2 }
            }
        },
        {
            id: 3,
            employeeNo: 'EMP-2026-0003',
            name: 'Pedro Garcia',
            department: 'Academic',
            position: 'Teacher',
            credits: {
                workLeave: { allocated: 20, used: 5 },
                medicalLeave: { allocated: 15, used: 0 }
            }
        },
        {
            id: 4,
            employeeNo: 'EMP-2026-0004',
            name: 'Ana Reyes',
            department: 'Academic',
            position: 'Department Head',
            credits: {
                workLeave: { allocated: 20, used: 12 },
                medicalLeave: { allocated: 15, used: 5 }
            }
        },
        {
            id: 5,
            employeeNo: 'EMP-2026-0005',
            name: 'Carlos Ramos',
            department: 'IT',
            position: 'System Administrator',
            credits: {
                workLeave: { allocated: 15, used: 0 },
                medicalLeave: { allocated: 10, used: 0 }
            }
        },
        {
            id: 6,
            employeeNo: 'EMP-2026-0006',
            name: 'Sofia Mendoza',
            department: 'Human Resources',
            position: 'HR Assistant',
            credits: {
                workLeave: { allocated: 15, used: 7 },
                medicalLeave: { allocated: 10, used: 3 }
            }
        },
        {
            id: 7,
            employeeNo: 'EMP-2026-0007',
            name: 'Miguel Torres',
            department: 'Finance',
            position: 'Finance Officer',
            credits: {
                workLeave: { allocated: 15, used: 4 },
                medicalLeave: { allocated: 10, used: 1 }
            }
        },
        {
            id: 8,
            employeeNo: 'EMP-2026-0008',
            name: 'Elena Cruz',
            department: 'Academic',
            position: 'Teacher',
            credits: {
                workLeave: { allocated: 20, used: 10 },
                medicalLeave: { allocated: 15, used: 8 }
            }
        },
    ];

    // ─── Fetch Employees (Replace with actual API call) ──────────────────────
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            
            // TODO: Replace with actual API call
            // const response = await dispatch(fetchAllEmployees());
            // setEmployees(response.data);
            
            // Simulate API delay
            setTimeout(() => {
                setEmployees(mockEmployees);
                setFilteredEmployees(mockEmployees);
                setLoading(false);
            }, 500);
        };

        fetchEmployees();
    }, []);

    // ─── Filter Employees ─────────────────────────────────────────────────────
    useEffect(() => {
        let filtered = employees;

        // Filter by department
        if (departmentFilter !== 'all') {
            filtered = filtered.filter(emp => emp.department === departmentFilter);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(emp => 
                emp.name.toLowerCase().includes(term) ||
                emp.employeeNo.toLowerCase().includes(term) ||
                emp.department.toLowerCase().includes(term) ||
                emp.position.toLowerCase().includes(term)
            );
        }

        setFilteredEmployees(filtered);
        setHighlightedIndex(-1);
    }, [searchTerm, departmentFilter, employees]);

    // ─── Get Unique Departments ───────────────────────────────────────────────
    const departments = ['all', ...new Set(employees.map(emp => emp.department))];

    // ─── Click Outside Handler ────────────────────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ─── Keyboard Navigation ──────────────────────────────────────────────────
    const handleKeyDown = (e) => {
        if (!isDropdownOpen) {
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
                setIsDropdownOpen(true);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev < filteredEmployees.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredEmployees[highlightedIndex]) {
                    handleEmployeeSelect(filteredEmployees[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsDropdownOpen(false);
                setHighlightedIndex(-1);
                break;
            default:
                break;
        }
    };

    // ─── Handle Employee Selection ────────────────────────────────────────────
    const handleEmployeeSelect = (employee) => {
        onEmployeeSelect(employee);
        setIsDropdownOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
    };

    // ─── Clear Selection ──────────────────────────────────────────────────────
    const handleClearSelection = (e) => {
        e.stopPropagation();
        onEmployeeSelect(null);
        setSearchTerm('');
    };

    return (
        <div className="space-y-4">
            {/* Search Box */}
            <div className="relative" ref={dropdownRef}>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {selectedEmployee ? (
                            <User size={20} className="text-green-600" />
                        ) : (
                            <Search size={20} />
                        )}
                    </div>
                    
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.employeeNo})` : searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (!isDropdownOpen) setIsDropdownOpen(true);
                        }}
                        onFocus={() => {
                            if (!selectedEmployee) setIsDropdownOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search employee by name, number, or department..."
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-base font-medium transition-all ${
                            selectedEmployee 
                                ? 'border-green-400 bg-green-50 text-green-900'
                                : 'border-gray-300 hover:border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                        } outline-none`}
                        readOnly={!!selectedEmployee}
                    />
                    
                    {selectedEmployee ? (
                        <button
                            onClick={handleClearSelection}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 hover:text-red-600 transition-colors"
                            title="Clear selection"
                        >
                            <X size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ChevronDown 
                                size={20} 
                                className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                    )}
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                    {isDropdownOpen && !selectedEmployee && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                        >
                            {/* Department Filter */}
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2 overflow-x-auto">
                                    {departments.map(dept => (
                                        <button
                                            key={dept}
                                            onClick={() => setDepartmentFilter(dept)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                                departmentFilter === dept
                                                    ? 'bg-green-600 text-white shadow-md'
                                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                        >
                                            {dept === 'all' ? 'All Departments' : dept}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Employee List */}
                            <div className="max-h-80 overflow-y-auto">
                                {loading ? (
                                    <div className="py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"></div>
                                        <p className="text-gray-500 text-sm mt-3">Loading employees...</p>
                                    </div>
                                ) : filteredEmployees.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Users size={48} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 font-medium">No employees found</p>
                                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {filteredEmployees.map((employee, index) => (
                                            <motion.button
                                                key={employee.id}
                                                onClick={() => handleEmployeeSelect(employee)}
                                                onMouseEnter={() => setHighlightedIndex(index)}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                                className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors ${
                                                    highlightedIndex === index ? 'bg-green-50' : ''
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-sm font-bold text-gray-900 truncate">
                                                                {employee.name}
                                                            </h4>
                                                            {highlightedIndex === index && (
                                                                <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 font-mono mb-1">
                                                            {employee.employeeNo}
                                                        </p>
                                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase size={12} />
                                                                {employee.position}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={12} />
                                                                {employee.department}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Mini Credit Preview */}
                                                    <div className="flex-shrink-0 text-right">
                                                        <div className="text-xs text-gray-500 mb-1">Credits</div>
                                                        <div className="flex gap-2">
                                                            <div className="bg-blue-50 px-2 py-1 rounded">
                                                                <div className="text-xs font-bold text-blue-700">
                                                                    {employee.credits.workLeave.allocated - employee.credits.workLeave.used}
                                                                </div>
                                                                <div className="text-[10px] text-blue-600">Work</div>
                                                            </div>
                                                            <div className="bg-green-50 px-2 py-1 rounded">
                                                                <div className="text-xs font-bold text-green-700">
                                                                    {employee.credits.medicalLeave.allocated - employee.credits.medicalLeave.used}
                                                                </div>
                                                                <div className="text-[10px] text-green-600">Med</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {filteredEmployees.length > 0 && (
                                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 text-center">
                                        Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                                        {departmentFilter !== 'all' && ` in ${departmentFilter}`}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Selected Employee Card */}
            {selectedEmployee && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 border-2 border-green-200"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="bg-green-600 text-white rounded-xl p-3">
                                <User size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {selectedEmployee.name}
                                </h3>
                                <p className="text-sm text-gray-600 font-mono mb-2">
                                    {selectedEmployee.employeeNo}
                                </p>
                                <div className="flex flex-wrap gap-2 text-sm">
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                                        <Briefcase size={14} className="text-gray-500" />
                                        <span className="text-gray-700 font-medium">{selectedEmployee.position}</span>
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                                        <MapPin size={14} className="text-gray-500" />
                                        <span className="text-gray-700 font-medium">{selectedEmployee.department}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Current Credits Summary */}
                        <div className="flex gap-3">
                            <div className="bg-white rounded-lg p-3 border border-blue-200 text-center min-w-[80px]">
                                <div className="text-xs text-gray-500 mb-1">Work Leave</div>
                                <div className="text-xl font-bold text-blue-700">
                                    {selectedEmployee.credits.workLeave.allocated - selectedEmployee.credits.workLeave.used}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                    of {selectedEmployee.credits.workLeave.allocated}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-green-200 text-center min-w-[80px]">
                                <div className="text-xs text-gray-500 mb-1">Medical Leave</div>
                                <div className="text-xl font-bold text-green-700">
                                    {selectedEmployee.credits.medicalLeave.allocated - selectedEmployee.credits.medicalLeave.used}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                    of {selectedEmployee.credits.medicalLeave.allocated}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default EmployeeSearchSelector;
