import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Clock, Calendar, User, FileText, Timer } from 'lucide-react';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { createManualAttendance, searchEmployees } from '../../states/HumanResourcesState/Action';

const ATTENDANCE_STATUS = [
    { value: 'PRESENT', label: 'Present' },
    { value: 'LATE', label: 'Late' },
    { value: 'HALF_DAY', label: 'Half Day' },
    { value: 'OVERTIME', label: 'Overtime' },
];

/**
 * ManualAttendanceModal Component
 * Allows HR to manually add attendance records for employees
 */
const ManualAttendanceModal = ({ isOpen, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            employeeId: '',
            attendanceDate: new Date().toISOString().split('T')[0],
            timeIn: '08:00',
            timeOut: '17:00',
            overtimeHours: 0,
            remarks: '',
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [employeeOptions, setEmployeeOptions] = useState([]);

    // Watch time fields to calculate hours
    const timeIn = watch('timeIn');
    const timeOut = watch('timeOut');

    // Calculate total hours worked
    const calculateHours = (timeInStr, timeOutStr) => {
        if (!timeInStr || !timeOutStr) return 0;
        const [inHour, inMin] = timeInStr.split(':').map(Number);
        const [outHour, outMin] = timeOutStr.split(':').map(Number);
        const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
        return (totalMinutes / 60).toFixed(2);
    };

    const totalHours = calculateHours(timeIn, timeOut);

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

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        
        const payload = {
            userId: data.employeeId,  // Backend uses userId, not employeeId
            attendanceDate: data.attendanceDate,
            timeIn: data.timeIn + ":00",  // Add seconds to match backend format
            timeOut: data.timeOut + ":00",  // Add seconds to match backend format
            totalHoursWorked: parseFloat(calculateHours(data.timeIn, data.timeOut)),
            totalOvertimeHours: parseFloat(data.overtimeHours) || 0.0,
            remarks: data.remarks || 'Manual entry by HR',
        };

        try {
            const result = await dispatch(createManualAttendance(payload));
            
            if (result.ok) {
                reset();
                onSuccess?.();
                onClose();
            }
        } catch (error) {
            console.error('Failed to create manual attendance:', error);
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

            {/* Date Row */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline mr-2" size={16} />
                    Attendance Date <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    {...register('attendanceDate', { required: 'Date is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.attendanceDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.attendanceDate.message}</p>
                )}
            </div>

            {/* Time In and Time Out Row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Time In */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline mr-2" size={16} />
                        Time In <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        {...register('timeIn', { required: 'Time In is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.timeIn && (
                        <p className="text-red-500 text-sm mt-1">{errors.timeIn.message}</p>
                    )}
                </div>

                {/* Time Out */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline mr-2" size={16} />
                        Time Out <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        {...register('timeOut', { required: 'Time Out is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.timeOut && (
                        <p className="text-red-500 text-sm mt-1">{errors.timeOut.message}</p>
                    )}
                </div>
            </div>

            {/* Hours Display and Overtime */}
            <div className="grid grid-cols-2 gap-4">
                {/* Total Hours (Calculated) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Timer className="inline mr-2" size={16} />
                        Total Hours
                    </label>
                    <input
                        type="text"
                        value={`${totalHours} hours`}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* Overtime Hours */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Timer className="inline mr-2" size={16} />
                        Overtime Hours
                    </label>
                    <input
                        type="number"
                        step="0.5"
                        min="0"
                        {...register('overtimeHours')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Remarks */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline mr-2" size={16} />
                    Remarks
                </label>
                <textarea
                    {...register('remarks')}
                    rows={3}
                    placeholder="Optional reason for manual entry (e.g., biometrics issue, network error)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
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
            type: 'green',
            label: isSubmitting ? 'Creating...' : 'Create Attendance',
            onClick: handleSubmit(onSubmit),
            closeOnClick: false,
        },
    ];

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Manual Attendance"
            body={modalBody}
            buttons={buttons}
            size="w-full max-w-2xl"
            maxHeight="90vh"
        />
    );
};

export default ManualAttendanceModal;
