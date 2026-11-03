import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import BlueBtn from '../ButtonsComponents/BlueBtn';
import { fetchEmployeeLeaveCredits, fetchSchoolCalendarDropdown } from '../../states/HumanResourcesState/Action';

/**
 * LeaveCreditDataTable Component
 * 
 * Displays employee leave credit information in a data table with filters for School Year,
 * Department, and Search. Integrates with Redux for state management.
 * 
 * Database Schema:
 * - EmployeeLeaveCreditMasterTable: LeaveCreditMasterId, CalendarId, EmployeeId, TotalAllocatedDays, TotalUsedDays
 * - EmployeeLeaveCreditChildTable: LeaveCreditChildId, LeaveCreditMasterId, LeaveType (string: "Work Leave", "Medical Leave", "Sick Leave"), 
 *   AllocatedDays, UsedDays, PendingDays, ActiveStatus
 */
const LeaveCreditDataTable = ({ onEdit }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const leaveCreditsState = useSelector((state) => state.hr.employeeLeaveCreditsState || {});
  const schoolCalendarState = useSelector((state) => state.hr.schoolCalendarDropdownState || {});
  
  const employees = leaveCreditsState.data || [];
  const totalRows = leaveCreditsState.totalRecords || 0;
  const loading = leaveCreditsState.loading || false;
  
  const schoolCalendars = schoolCalendarState.data || [];
  const activeSchoolYear = schoolCalendars.find(sc => sc.IsActive)?.SchoolYear || 'N/A';
  const activeCalendarId = schoolCalendars.find(sc => sc.IsActive)?.CalendarId || null;

  // Local state for filters
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [department, setDepartment] = useState('');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Department options (adjust based on your system)
  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'Teaching', label: 'Teaching' },
    { value: 'Non-Teaching', label: 'Non-Teaching' },
    { value: 'Administrative', label: 'Administrative' },
  ];

  // Fetch school calendars on mount
  useEffect(() => {
    dispatch(fetchSchoolCalendarDropdown());
  }, [dispatch]);

  // Set active calendar as default when loaded
  useEffect(() => {
    if (activeCalendarId && !selectedCalendarId) {
      setSelectedCalendarId(activeCalendarId);
    }
  }, [activeCalendarId, selectedCalendarId]);

  // Fetch employee leave credits whenever filters change
  useEffect(() => {
    if (selectedCalendarId) {
      dispatch(fetchEmployeeLeaveCredits({
        calendarId: selectedCalendarId,
        department: department,
        search: filterText,
        page: currentPage,
        pageSize: rowsPerPage
      }));
    }
  }, [selectedCalendarId, department, filterText, currentPage, rowsPerPage, dispatch]);

  // Helper function to get leave details by type
  const getLeaveByType = (leaveDetails, type) => {
    if (!Array.isArray(leaveDetails)) return { allocated: 0, used: 0, remaining: 0 };
    
    const leave = leaveDetails.find(d => 
      (d.leaveType || d.LeaveType)?.toLowerCase().includes(type.toLowerCase())
    );
    
    return {
      allocated: leave?.allocatedDays || leave?.AllocatedDays || 0,
      used: leave?.usedDays || leave?.UsedDays || 0,
      remaining: (leave?.allocatedDays || leave?.AllocatedDays || 0) - (leave?.usedDays || leave?.UsedDays || 0)
    };
  };

  // DataTable columns
  const columns = [
    {
      name: 'Employee Number',
      selector: row => row.employeeNo || row.EmployeeNo,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Employee Name',
      selector: row => row.employeeName || row.EmployeeName,
      sortable: true,
      width: '200px',
      wrap: true
    },
    {
      name: 'Department',
      selector: row => row.department || row.Department,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Work Leave',
      cell: (row) => {
        const workLeave = getLeaveByType(row.leaveDetails || row.LeaveDetails, 'work');
        return (
          <div className="text-sm">
            <div><strong>A:</strong> {workLeave.allocated}</div>
            <div><strong>U:</strong> {workLeave.used}</div>
            <div><strong>R:</strong> {workLeave.remaining}</div>
          </div>
        );
      },
      width: '120px'
    },
    {
      name: 'Medical Leave',
      cell: (row) => {
        const medicalLeave = getLeaveByType(row.leaveDetails || row.LeaveDetails, 'medical');
        return (
          <div className="text-sm">
            <div><strong>A:</strong> {medicalLeave.allocated}</div>
            <div><strong>U:</strong> {medicalLeave.used}</div>
            <div><strong>R:</strong> {medicalLeave.remaining}</div>
          </div>
        );
      },
      width: '120px'
    },
    {
      name: 'Total',
      cell: (row) => {
        const total = row.totalAllocatedDays || row.TotalAllocatedDays || 0;
        const used = row.totalUsedDays || row.TotalUsedDays || 0;
        const remaining = total - used;
        return (
          <div className="text-sm">
            <div><strong>A:</strong> {total}</div>
            <div><strong>U:</strong> {used}</div>
            <div><strong>R:</strong> {remaining}</div>
          </div>
        );
      },
      width: '120px'
    },
    {
      name: 'Actions',
      cell: (row) => (
        <BlueBtn 
          label="Edit" 
          onClick={() => onEdit(row)}
        />
      ),
      ignoreRowClick: true,
      width: '100px'
    }
  ];

  return (
    <div className="overflow-x-auto pt-2">
      <div className="p-6 bg-white rounded shadow">
        {/* Header with Active School Year Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-green-500">Employee Leave Credits</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Active SY: {activeSchoolYear}
            </span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* School Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Year
            </label>
            <select
              value={selectedCalendarId || ''}
              onChange={(e) => {
                setSelectedCalendarId(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select School Year</option>
              {schoolCalendars.map((sc) => (
                <option key={sc.CalendarId} value={sc.CalendarId}>
                  {sc.SchoolYear} {sc.IsActive ? '(Active)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name or employee number..."
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* DataTable with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCalendarId}-${department}-${filterText}-${currentPage}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <DataTable
              columns={columns}
              data={employees}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationDefaultPage={currentPage}
              onChangePage={(page) => setCurrentPage(page)}
              onChangeRowsPerPage={(newPerPage, page) => {
                setRowsPerPage(newPerPage);
                setCurrentPage(page);
              }}
              highlightOnHover
              responsive
              noDataComponent={
                <div className="py-8 text-gray-500">
                  {selectedCalendarId 
                    ? 'No employee leave records found.' 
                    : 'Please select a School Year to view leave credits.'}
                </div>
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeaveCreditDataTable;
