import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaPlus, FaMinus } from 'react-icons/fa';
import GreenBtn from '../ButtonsComponents/GreenBtn';
import OutlineRedBtn from '../ButtonsComponents/OutlineRedBtn';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import LeaveCreditDataTable from './LeaveCreditDataTable';
import { updateEmployeeLeaveCredits } from '../../states/HumanResourcesState/Action';
import { showToast } from '../../states/NotificationState/Action';

/**
 * LeaveCreditUpdater Component
 * 
 * Manages employee leave credits with Redux integration and School Year filtering.
 * Uses LeaveCreditDataTable for displaying employee leave records.
 * 
 * Database Schema:
 * - EmployeeLeaveCreditMasterTable: LeaveCreditMasterId, CalendarId, EmployeeId, TotalAllocatedDays, TotalUsedDays
 * - EmployeeLeaveCreditChildTable: LeaveCreditChildId, LeaveCreditMasterId, LeaveType (string: "Work Leave", "Medical Leave", "Sick Leave"), 
 *   AllocatedDays, UsedDays, PendingDays, ActiveStatus
 */
const LeaveCreditUpdater = () => {
  const dispatch = useDispatch();
  
  // Local state for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [editWorkLeave, setEditWorkLeave] = useState({ allocated: 0, used: 0 });
  const [editMedicalLeave, setEditMedicalLeave] = useState({ allocated: 0, used: 0 });

  // Handle Edit Click from DataTable
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedCalendarId(employee.calendarId || employee.CalendarId || 1);
    
    // Find work leave - handle both data formats
    const workLeave = employee.leaveDetails?.find(d => {
      const leaveType = (d.leaveType || d.LeaveType || '').toLowerCase();
      return leaveType.includes('work') || leaveType.includes('vacation');
    });
    setEditWorkLeave({
      allocated: parseFloat(workLeave?.allocatedDays || workLeave?.AllocatedDays || 0),
      used: parseFloat(workLeave?.usedDays || workLeave?.UsedDays || 0)
    });
    
    // Find medical/sick leave - handle both data formats
    const medicalLeave = employee.leaveDetails?.find(d => {
      const leaveType = (d.leaveType || d.LeaveType || '').toLowerCase();
      return leaveType.includes('medical') || leaveType.includes('sick');
    });
    setEditMedicalLeave({
      allocated: parseFloat(medicalLeave?.allocatedDays || medicalLeave?.AllocatedDays || 0),
      used: parseFloat(medicalLeave?.usedDays || medicalLeave?.UsedDays || 0)
    });
    
    setIsEditModalOpen(true);
  };

  // Handle Save Credits
  const handleSaveCredits = async () => {
    if (!selectedEmployee) return;

    // Validation
    const workAllocated = parseFloat(editWorkLeave.allocated);
    const workUsed = parseFloat(editWorkLeave.used);
    const medicalAllocated = parseFloat(editMedicalLeave.allocated);
    const medicalUsed = parseFloat(editMedicalLeave.used);

    if (workUsed > workAllocated) {
      dispatch(showToast('error', 'Work Leave: Used days cannot exceed allocated days'));
      return;
    }
    if (medicalUsed > medicalAllocated) {
      dispatch(showToast('error', 'Medical Leave: Used days cannot exceed allocated days'));
      return;
    }

    // Find leave detail records - handle both formats
    const workLeaveDetail = selectedEmployee.leaveDetails?.find(d => {
      const leaveType = (d.leaveType || d.LeaveType || '').toLowerCase();
      return leaveType.includes('work') || leaveType.includes('vacation');
    });
    const medicalLeaveDetail = selectedEmployee.leaveDetails?.find(d => {
      const leaveType = (d.leaveType || d.LeaveType || '').toLowerCase();
      return leaveType.includes('medical') || leaveType.includes('sick');
    });

    const payload = {
      calendarId: selectedCalendarId,
      employeeId: selectedEmployee.employeeId || selectedEmployee.EmployeeId,
      leaveCreditMasterId: selectedEmployee.leaveCreditMasterId || selectedEmployee.LeaveCreditMasterId,
      details: [
        {
          leaveCreditChildId: workLeaveDetail?.leaveCreditChildId || workLeaveDetail?.LeaveCreditChildId,
          leaveType: 'Work Leave',
          allocatedDays: workAllocated,
          usedDays: workUsed,
          activeStatus: workLeaveDetail?.activeStatus || workLeaveDetail?.ActiveStatus || 'Y'
        },
        {
          leaveCreditChildId: medicalLeaveDetail?.leaveCreditChildId || medicalLeaveDetail?.LeaveCreditChildId,
          leaveType: 'Medical Leave',
          allocatedDays: medicalAllocated,
          usedDays: medicalUsed,
          activeStatus: medicalLeaveDetail?.activeStatus || medicalLeaveDetail?.ActiveStatus || 'Y'
        }
      ]
    };

    try {
      const result = await dispatch(updateEmployeeLeaveCredits(payload));
      if (result.ok) {
        dispatch(showToast('success', 'Leave credits updated successfully'));
        setIsEditModalOpen(false);
        setSelectedEmployee(null);
        // Refresh the data table here if you have a refresh function
      } else {
        dispatch(showToast('error', result.message || 'Failed to update leave credits'));
      }
    } catch (error) {
      dispatch(showToast('error', 'Failed to update leave credits'));
      console.error('Leave credit update error:', error);
    }
  };

  // Increment/Decrement handlers
  const adjustLeaveValue = (leaveType, field, delta) => {
    if (leaveType === 'work') {
      setEditWorkLeave(prev => ({
        ...prev,
        [field]: Math.max(0, prev[field] + delta)
      }));
    } else {
      setEditMedicalLeave(prev => ({
        ...prev,
        [field]: Math.max(0, prev[field] + delta)
      }));
    }
  };

  // Render Edit Modal Body
  const renderEditModalBody = () => (
    <div className="space-y-5">
      {/* Employee Info Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {selectedEmployee?.employeeName || selectedEmployee?.EmployeeName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{selectedEmployee?.employeeNo || selectedEmployee?.EmployeeNo}</span>
              <span className="mx-2">•</span>
              <span>{selectedEmployee?.department || selectedEmployee?.Department}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Leave Types - Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Work Leave Section */}
        <div className="border-2 border-blue-100 rounded-xl p-5 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h4 className="text-base font-bold text-gray-800">Work Leave</h4>
          </div>
          
          {/* Allocated Days */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Allocated Days
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustLeaveValue('work', 'allocated', -1)}
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaMinus size={14} />
              </button>
              <input
                type="number"
                value={editWorkLeave.allocated}
                onChange={(e) => setEditWorkLeave(prev => ({
                  ...prev,
                  allocated: Math.max(0, parseInt(e.target.value) || 0)
                }))}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg text-center font-bold text-lg focus:outline-none focus:border-blue-400 transition-colors"
                min="0"
              />
              <button
                type="button"
                onClick={() => adjustLeaveValue('work', 'allocated', 1)}
                className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaPlus size={14} />
              </button>
            </div>
          </div>

          {/* Used Days */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Used Days
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustLeaveValue('work', 'used', -1)}
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaMinus size={14} />
              </button>
              <input
                type="number"
                value={editWorkLeave.used}
                onChange={(e) => setEditWorkLeave(prev => ({
                  ...prev,
                  used: Math.max(0, parseInt(e.target.value) || 0)
                }))}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg text-center font-bold text-lg focus:outline-none focus:border-blue-400 transition-colors"
                min="0"
              />
              <button
                type="button"
                onClick={() => adjustLeaveValue('work', 'used', 1)}
                className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaPlus size={14} />
              </button>
            </div>
          </div>

          {/* Remaining Display */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Remaining:</span>
              <span className="text-xl font-bold text-blue-600">
                {editWorkLeave.allocated - editWorkLeave.used} days
              </span>
            </div>
          </div>
        </div>

        {/* Medical Leave Section */}
        <div className="border-2 border-purple-100 rounded-xl p-5 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <h4 className="text-base font-bold text-gray-800">Medical Leave</h4>
          </div>
          
          {/* Allocated Days */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Allocated Days
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustLeaveValue('medical', 'allocated', -1)}
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaMinus size={14} />
              </button>
              <input
                type="number"
                value={editMedicalLeave.allocated}
                onChange={(e) => setEditMedicalLeave(prev => ({
                  ...prev,
                  allocated: Math.max(0, parseInt(e.target.value) || 0)
                }))}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg text-center font-bold text-lg focus:outline-none focus:border-purple-400 transition-colors"
                min="0"
              />
              <button
                type="button"
                onClick={() => adjustLeaveValue('medical', 'allocated', 1)}
                className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaPlus size={14} />
              </button>
            </div>
          </div>

          {/* Used Days */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Used Days
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustLeaveValue('medical', 'used', -1)}
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaMinus size={14} />
              </button>
              <input
                type="number"
                value={editMedicalLeave.used}
                onChange={(e) => setEditMedicalLeave(prev => ({
                  ...prev,
                  used: Math.max(0, parseInt(e.target.value) || 0)
                }))}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg text-center font-bold text-lg focus:outline-none focus:border-purple-400 transition-colors"
                min="0"
              />
              <button
                type="button"
                onClick={() => adjustLeaveValue('medical', 'used', 1)}
                className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaPlus size={14} />
              </button>
            </div>
          </div>

          {/* Remaining Display */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Remaining:</span>
              <span className="text-xl font-bold text-purple-600">
                {editMedicalLeave.allocated - editMedicalLeave.used} days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
        <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Allocated</p>
            <p className="text-2xl font-bold text-gray-800">
              {editWorkLeave.allocated + editMedicalLeave.allocated}
            </p>
            <p className="text-xs text-gray-500">days</p>
          </div>
          <div className="text-center border-x border-green-200">
            <p className="text-xs text-gray-600 mb-1">Total Used</p>
            <p className="text-2xl font-bold text-gray-800">
              {editWorkLeave.used + editMedicalLeave.used}
            </p>
            <p className="text-xs text-gray-500">days</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Remaining</p>
            <p className="text-2xl font-bold text-green-600">
              {(editWorkLeave.allocated + editMedicalLeave.allocated) - (editWorkLeave.used + editMedicalLeave.used)}
            </p>
            <p className="text-xs text-gray-500">days</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* DataTable Component */}
      <LeaveCreditDataTable onEdit={handleEditClick} />

      {/* Edit Modal */}
      <ModalComponent
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        title="Edit Employee Leave Credits"
        body={renderEditModalBody()}
        buttons={[
          { 
            label: "Save Changes", 
            type: "green", 
            onClick: handleSaveCredits 
          },
          { 
            label: "Cancel", 
            type: "red", 
            onClick: () => {
              setIsEditModalOpen(false);
              setSelectedEmployee(null);
            } 
          }
        ]}
        size="max-w-4xl"
      />
    </div>
  );
};

export default LeaveCreditUpdater;
