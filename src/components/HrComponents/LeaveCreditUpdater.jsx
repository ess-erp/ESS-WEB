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
    setSelectedCalendarId(employee.calendarId || employee.CalendarId);
    
    // Find work leave
    const workLeave = employee.leaveDetails?.find(d => 
      (d.leaveType || d.LeaveType)?.toLowerCase().includes('work')
    );
    setEditWorkLeave({
      allocated: workLeave?.allocatedDays || workLeave?.AllocatedDays || 0,
      used: workLeave?.usedDays || workLeave?.UsedDays || 0
    });
    
    // Find medical leave
    const medicalLeave = employee.leaveDetails?.find(d => 
      (d.leaveType || d.LeaveType)?.toLowerCase().includes('medical') ||
      (d.leaveType || d.LeaveType)?.toLowerCase().includes('sick')
    );
    setEditMedicalLeave({
      allocated: medicalLeave?.allocatedDays || medicalLeave?.AllocatedDays || 0,
      used: medicalLeave?.usedDays || medicalLeave?.UsedDays || 0
    });
    
    setIsEditModalOpen(true);
  };

  // Handle Save Credits
  const handleSaveCredits = async () => {
    if (!selectedEmployee) return;

    // Validation
    if (editWorkLeave.used > editWorkLeave.allocated) {
      dispatch(showToast('error', 'Work Leave: Used days cannot exceed allocated days'));
      return;
    }
    if (editMedicalLeave.used > editMedicalLeave.allocated) {
      dispatch(showToast('error', 'Medical Leave: Used days cannot exceed allocated days'));
      return;
    }

    const workLeaveDetail = selectedEmployee.leaveDetails?.find(d => 
      (d.leaveType || d.LeaveType)?.toLowerCase().includes('work')
    );
    const medicalLeaveDetail = selectedEmployee.leaveDetails?.find(d => 
      (d.leaveType || d.LeaveType)?.toLowerCase().includes('medical') ||
      (d.leaveType || d.LeaveType)?.toLowerCase().includes('sick')
    );

    const payload = {
      calendarId: selectedCalendarId,
      employeeId: selectedEmployee.employeeId || selectedEmployee.EmployeeId,
      leaveCreditMasterId: selectedEmployee.leaveCreditMasterId || selectedEmployee.LeaveCreditMasterId,
      details: [
        {
          leaveCreditChildId: workLeaveDetail?.leaveCreditChildId || workLeaveDetail?.LeaveCreditChildId,
          leaveType: 'Work Leave',
          allocatedDays: editWorkLeave.allocated,
          usedDays: editWorkLeave.used,
          activeStatus: workLeaveDetail?.activeStatus || workLeaveDetail?.ActiveStatus || 'Y'
        },
        {
          leaveCreditChildId: medicalLeaveDetail?.leaveCreditChildId || medicalLeaveDetail?.LeaveCreditChildId,
          leaveType: 'Medical Leave',
          allocatedDays: editMedicalLeave.allocated,
          usedDays: editMedicalLeave.used,
          activeStatus: medicalLeaveDetail?.activeStatus || medicalLeaveDetail?.ActiveStatus || 'Y'
        }
      ]
    };

    try {
      await dispatch(updateEmployeeLeaveCredits(payload));
      dispatch(showToast('success', 'Leave credits updated successfully'));
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      dispatch(showToast('error', 'Failed to update leave credits'));
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
    <div className="space-y-6">
      {/* Employee Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800">
          {selectedEmployee?.employeeName || selectedEmployee?.EmployeeName}
        </h3>
        <p className="text-sm text-gray-600">
          {selectedEmployee?.employeeNo || selectedEmployee?.EmployeeNo} | {selectedEmployee?.department || selectedEmployee?.Department}
        </p>
      </div>

      {/* Work Leave Section */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-3">Work Leave</h4>
        
        {/* Allocated Days */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Allocated Days
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustLeaveValue('work', 'allocated', -1)}
              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              <FaMinus />
            </button>
            <input
              type="number"
              value={editWorkLeave.allocated}
              onChange={(e) => setEditWorkLeave(prev => ({
                ...prev,
                allocated: Math.max(0, parseInt(e.target.value) || 0)
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-center"
              min="0"
            />
            <button
              type="button"
              onClick={() => adjustLeaveValue('work', 'allocated', 1)}
              className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Used Days */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Used Days
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustLeaveValue('work', 'used', -1)}
              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              <FaMinus />
            </button>
            <input
              type="number"
              value={editWorkLeave.used}
              onChange={(e) => setEditWorkLeave(prev => ({
                ...prev,
                used: Math.max(0, parseInt(e.target.value) || 0)
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-center"
              min="0"
            />
            <button
              type="button"
              onClick={() => adjustLeaveValue('work', 'used', 1)}
              className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Remaining Display */}
        <div className="mt-3 p-2 bg-gray-50 rounded text-center">
          <span className="text-sm text-gray-600">Remaining: </span>
          <span className="font-semibold text-gray-800">
            {editWorkLeave.allocated - editWorkLeave.used} days
          </span>
        </div>
      </div>

      {/* Medical Leave Section */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-3">Medical Leave</h4>
        
        {/* Allocated Days */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Allocated Days
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustLeaveValue('medical', 'allocated', -1)}
              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              <FaMinus />
            </button>
            <input
              type="number"
              value={editMedicalLeave.allocated}
              onChange={(e) => setEditMedicalLeave(prev => ({
                ...prev,
                allocated: Math.max(0, parseInt(e.target.value) || 0)
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-center"
              min="0"
            />
            <button
              type="button"
              onClick={() => adjustLeaveValue('medical', 'allocated', 1)}
              className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Used Days */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Used Days
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustLeaveValue('medical', 'used', -1)}
              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              <FaMinus />
            </button>
            <input
              type="number"
              value={editMedicalLeave.used}
              onChange={(e) => setEditMedicalLeave(prev => ({
                ...prev,
                used: Math.max(0, parseInt(e.target.value) || 0)
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-center"
              min="0"
            />
            <button
              type="button"
              onClick={() => adjustLeaveValue('medical', 'used', 1)}
              className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Remaining Display */}
        <div className="mt-3 p-2 bg-gray-50 rounded text-center">
          <span className="text-sm text-gray-600">Remaining: </span>
          <span className="font-semibold text-gray-800">
            {editMedicalLeave.allocated - editMedicalLeave.used} days
          </span>
        </div>
      </div>

      {/* Total Summary */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Total Allocated:</span>
          <span className="font-bold text-gray-800">
            {editWorkLeave.allocated + editMedicalLeave.allocated} days
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold text-gray-700">Total Used:</span>
          <span className="font-bold text-gray-800">
            {editWorkLeave.used + editMedicalLeave.used} days
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold text-gray-700">Total Remaining:</span>
          <span className="font-bold text-green-600">
            {(editWorkLeave.allocated + editMedicalLeave.allocated) - (editWorkLeave.used + editMedicalLeave.used)} days
          </span>
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
            label: "Save", 
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
      />
    </div>
  );
};

export default LeaveCreditUpdater;
