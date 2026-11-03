import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Calendar, User, ClipboardList } from 'lucide-react';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { createManualLeave, searchEmployees, fetchEmployeeLeaveBalance } from '../../states/HumanResourcesState/Action';

/**
 * ManualLeaveFilingModal Component
 * Allows HR to manually file leave applications for employees
 * 
 * WORKFLOW:
 * 1. Select employee
 * 2. Fetch their leave balance to get available leave types
 * 3. Select leave type (from their allocated credits)
 * 4. File leave application using LeaveCreditChildId
 */
const ManualLeaveFilingModal = ({ isOpen, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth?.user?.UserId || 1);
    const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
        defaultValues: {
            employeeId: '',
            leaveCreditChildId: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            numberOfDays: 1,
            reason: '',
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
    const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
    const [selectedEmployeeBalance, setSelectedEmployeeBalance] = useState(null);

    // Watch form fields
    const startDate = watch('startDate');
    const endDate = watch('endDate');
    const selectedEmployeeId = watch('employeeId');
    const selectedLeaveTypeId = watch('leaveCreditChildId');

    // Fetch employees for dropdown
    useEffect(() => {
        if (isOpen) {
            const loadEmployees = async () => {
                const result = await dispatch(searchEmployees({
                    page: 1,
                    pageSize: 100, // Get enough for dropdown
                    search: '',
                    status: 'Active', // Only active employees
                }));
                if (result.ok && result.data) {
                    const options = result.data.map(emp => ({
                        value: emp.employeeId || emp.EmployeeId,
                        label: `${emp.employeeNumber || emp.EmployeeNumber} - ${emp.fullname || emp.Fullname}`,
                    }));
                    setEmployeeOptions(options);
                }
            };
            loadEmployees();
        }
    }, [isOpen, dispatch]);

    // Fetch employee leave balance when employee is selected
    useEffect(() => {
        if (selectedEmployeeId && isOpen) {
            const loadLeaveBalance = async () => {
                setLoadingLeaveTypes(true);
                setLeaveTypeOptions([]);
                try {
                    const result = await dispatch(fetchEmployeeLeaveBalance(selectedEmployeeId, 1)); // calendarId = 1
                    if (result.ok && result.data) {
                        setSelectedEmployeeBalance(result.data);
                        // Map leave types from employee's allocated credits
                        const options = result.data.LeaveTypes
                            ?.filter(lt => lt.LeaveCreditChildId && lt.LeaveType) // Only show types with ID and name
                            ?.map(lt => ({
                                value: lt.LeaveCreditChildId,
                                label: `${lt.LeaveType} (${lt.RemainingDays || 0} days remaining)`,
                                remaining: lt.RemainingDays || 0
                            })) || [];
                        
                        setLeaveTypeOptions(options);
                        
                        // Auto-select first leave type if available
                        if (options.length > 0) {
                            setValue('leaveCreditChildId', options[0].value);
                        }
                    }
                } catch (error) {
                    console.error('Failed to load employee leave balance:', error);
                    setLeaveTypeOptions([]);
                } finally {
                    setLoadingLeaveTypes(false);
                }
            };
            loadLeaveBalance();
        } else {
            setLeaveTypeOptions([]);
            setSelectedEmployeeBalance(null);
        }
    }, [selectedEmployeeId, isOpen, dispatch, setValue]);

    // Calculate total days when dates change
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setValue('numberOfDays', diffDays);
        }
    }, [startDate, endDate, setValue]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        
        // Find selected leave type to check remaining balance
        const selectedLeaveType = leaveTypeOptions.find(lt => lt.value === data.leaveCreditChildId);
        if (selectedLeaveType && data.numberOfDays > selectedLeaveType.remaining) {
            alert(`Insufficient leave balance. Only ${selectedLeaveType.remaining} days remaining.`);
            setIsSubmitting(false);
            return;
        }

        const payload = {
            employeeId: data.employeeId,
            leaveCreditChildId: data.leaveCreditChildId,
            startDate: data.startDate,
            endDate: data.endDate,
            numberOfDays: parseFloat(data.numberOfDays),
            reason: data.reason,
        };

        try {
            const result = await dispatch(createManualLeave(payload));
            
            if (result.ok) {
                reset();
                onSuccess?.();
                onClose();
            }
        } catch (error) {
            console.error('Failed to create manual leave:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const modalBody = (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Employee Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline mr-2" size={16} />
                    Employee <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="employeeId"
                    control={control}
                    rules={{ required: 'Employee is required' }}
                    render={({ field }) => (
                        <SearchableSelect
                            options={employeeOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Search employee by number or name"
                        />
                    )}
                />
                {errors.employeeId && (
                    <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>
                )}
            </div>

            {/* Leave Type */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClipboardList className="inline mr-2" size={16} />
                        Leave Type <span className="text-red-500">*</span>
                    </label>
                    {loadingLeaveTypes ? (
                        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center">
                            Loading leave types...
                        </div>
                    ) : leaveTypeOptions.length === 0 ? (
                        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-yellow-50 text-yellow-700 text-sm">
                            {selectedEmployeeId ? 'No leave credits available for this employee' : 'Please select an employee first'}
                        </div>
                    ) : (
                        <select
                            {...register('leaveCreditChildId', { required: 'Leave type is required' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {leaveTypeOptions.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    )}
                    {errors.leaveCreditChildId && (
                        <p className="text-red-500 text-sm mt-1">{errors.leaveCreditChildId.message}</p>
                    )}
                </div>
            </div>

            {/* Start Date, End Date, and Total Days Row */}
            <div className="grid grid-cols-3 gap-4">
                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline mr-2" size={16} />
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        {...register('startDate', { required: 'Start date is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                    )}
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline mr-2" size={16} />
                        End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        {...register('endDate', { required: 'End date is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.endDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                    )}
                </div>

                {/* Total Days (Auto-calculated) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Days
                    </label>
                    <input
                        type="number"
                        {...register('numberOfDays')}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Reason */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline mr-2" size={16} />
                    Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...register('reason', { required: 'Reason is required' })}
                    rows={3}
                    placeholder="Enter the reason for leave application"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {errors.reason && (
                    <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Leave application will be filed with PENDING status. 
                    It will automatically deduct from the employee's available leave credits upon approval.
                </p>
            </div>
        </form>
    );

    const buttons = [
        {
            type: 'red',
            label: 'Cancel',
            onClick: handleClose,
        },
        {
            type: 'blue',
            label: isSubmitting ? 'Creating...' : 'Create Leave Filing',
            onClick: handleSubmit(onSubmit),
            closeOnClick: false,
        },
    ];

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Manual Leave Filing"
            body={modalBody}
            buttons={buttons}
            size="w-full max-w-2xl"
            maxHeight="90vh"
        />
    );
};

export default ManualLeaveFilingModal;
