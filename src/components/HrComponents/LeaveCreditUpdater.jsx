import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Plus, Minus, Calendar, Heart, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * LeaveCreditUpdater Component
 * 
 * A two-way bound component for managing employee leave credits
 * Strictly handles only TWO types: Work Leave and Medical Leave
 * 
 * @param {Object} initialCredits - { workLeave: number, medicalLeave: number }
 * @param {Function} onSave - Callback when credits are saved: (updatedCredits) => void
 * @param {string} employeeName - Name of the employee for display
 * @param {string} employeeNo - Employee number for reference
 */
const LeaveCreditUpdater = ({ 
    initialCredits = { workLeave: 0, medicalLeave: 0 },
    onSave = () => {},
    employeeName = '',
    employeeNo = '',
}) => {
    // ─── Two-way bound state ──────────────────────────────────────────────────
    const [credits, setCredits] = useState({
        workLeave: {
            allocated: initialCredits.workLeave?.allocated ?? 15,
            used: initialCredits.workLeave?.used ?? 0,
        },
        medicalLeave: {
            allocated: initialCredits.medicalLeave?.allocated ?? 10,
            used: initialCredits.medicalLeave?.used ?? 0,
        },
    });

    const [isModified, setIsModified] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // ─── Sync with props (two-way binding) ────────────────────────────────────
    useEffect(() => {
        setCredits({
            workLeave: {
                allocated: initialCredits.workLeave?.allocated ?? 15,
                used: initialCredits.workLeave?.used ?? 0,
            },
            medicalLeave: {
                allocated: initialCredits.medicalLeave?.allocated ?? 10,
                used: initialCredits.medicalLeave?.used ?? 0,
            },
        });
    }, [initialCredits]);

    // ─── Computed remaining balance ───────────────────────────────────────────
    const workRemaining = credits.workLeave.allocated - credits.workLeave.used;
    const medicalRemaining = credits.medicalLeave.allocated - credits.medicalLeave.used;

    // ─── Handlers for two-way binding ─────────────────────────────────────────
    const handleAllocatedChange = (type, value) => {
        const numValue = parseFloat(value) || 0;
        if (numValue < 0) return; // Prevent negative values
        
        setCredits(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                allocated: numValue,
            },
        }));
        setIsModified(true);
        
        // Clear validation error for this field
        setValidationErrors(prev => ({ ...prev, [`${type}_allocated`]: null }));
    };

    const handleUsedChange = (type, value) => {
        const numValue = parseFloat(value) || 0;
        if (numValue < 0) return; // Prevent negative values
        
        setCredits(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                used: numValue,
            },
        }));
        setIsModified(true);
        
        // Clear validation error for this field
        setValidationErrors(prev => ({ ...prev, [`${type}_used`]: null }));
    };

    // ─── Increment/Decrement handlers ─────────────────────────────────────────
    const incrementAllocated = (type) => {
        setCredits(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                allocated: prev[type].allocated + 1,
            },
        }));
        setIsModified(true);
    };

    const decrementAllocated = (type) => {
        setCredits(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                allocated: Math.max(0, prev[type].allocated - 1),
            },
        }));
        setIsModified(true);
    };

    const incrementUsed = (type) => {
        setCredits(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                used: prev[type].used + 1,
            },
        }));
        setIsModified(true);
    };

    const decrementUsed = (type) => {
        setCredits(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                used: Math.max(0, prev[type].used - 1),
            },
        }));
        setIsModified(true);
    };

    // ─── Validation ───────────────────────────────────────────────────────────
    const validate = () => {
        const errors = {};

        // Check if allocated is a valid number
        if (isNaN(credits.workLeave.allocated) || credits.workLeave.allocated < 0) {
            errors.workLeave_allocated = 'Work leave allocated must be a valid positive number';
        }
        if (isNaN(credits.medicalLeave.allocated) || credits.medicalLeave.allocated < 0) {
            errors.medicalLeave_allocated = 'Medical leave allocated must be a valid positive number';
        }

        // Check if used is a valid number
        if (isNaN(credits.workLeave.used) || credits.workLeave.used < 0) {
            errors.workLeave_used = 'Work leave used must be a valid positive number';
        }
        if (isNaN(credits.medicalLeave.used) || credits.medicalLeave.used < 0) {
            errors.medicalLeave_used = 'Medical leave used must be a valid positive number';
        }

        // Check if used exceeds allocated
        if (credits.workLeave.used > credits.workLeave.allocated) {
            errors.workLeave_used = 'Used days cannot exceed allocated days';
        }
        if (credits.medicalLeave.used > credits.medicalLeave.allocated) {
            errors.medicalLeave_used = 'Used days cannot exceed allocated days';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ─── Save handler ─────────────────────────────────────────────────────────
    const handleSave = () => {
        if (!validate()) return;

        // Call parent callback with updated credits
        onSave({
            workLeave: {
                allocated: credits.workLeave.allocated,
                used: credits.workLeave.used,
                remaining: workRemaining,
            },
            medicalLeave: {
                allocated: credits.medicalLeave.allocated,
                used: credits.medicalLeave.used,
                remaining: medicalRemaining,
            },
        });

        setIsModified(false);
        setShowSuccessAlert(true);
        
        // Hide success alert after 3 seconds
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    // ─── Reset handler ────────────────────────────────────────────────────────
    const handleReset = () => {
        setCredits({
            workLeave: {
                allocated: initialCredits.workLeave?.allocated ?? 15,
                used: initialCredits.workLeave?.used ?? 0,
            },
            medicalLeave: {
                allocated: initialCredits.medicalLeave?.allocated ?? 10,
                used: initialCredits.medicalLeave?.used ?? 0,
            },
        });
        setIsModified(false);
        setValidationErrors({});
    };

    // ─── Render Credit Card ───────────────────────────────────────────────────
    const renderCreditCard = (type, icon, title, color) => {
        const data = credits[type];
        const remaining = data.allocated - data.used;
        const percentage = data.allocated > 0 ? (remaining / data.allocated) * 100 : 0;
        
        const colorClasses = {
            blue: {
                gradient: 'from-blue-500 to-blue-600',
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-700',
                ring: 'ring-blue-400',
                button: 'bg-blue-600 hover:bg-blue-700',
            },
            green: {
                gradient: 'from-green-500 to-green-600',
                bg: 'bg-green-50',
                border: 'border-green-200',
                text: 'text-green-700',
                ring: 'ring-green-400',
                button: 'bg-green-600 hover:bg-green-700',
            },
        };

        const colors = colorClasses[color] || colorClasses.blue;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${colors.gradient} px-6 py-4`}>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2.5">
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{title}</h3>
                            <p className="text-white/80 text-xs mt-0.5">Balance Management</p>
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-5">
                    {/* Allocated Days Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                            Total Allocated Days <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => decrementAllocated(type)}
                                className={`${colors.button} text-white rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 ${colors.ring}`}
                                title="Decrease"
                            >
                                <Minus size={16} />
                            </button>
                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={data.allocated}
                                onChange={(e) => handleAllocatedChange(type, e.target.value)}
                                className={`flex-1 px-4 py-2.5 border rounded-lg text-center text-lg font-bold focus:outline-none focus:ring-2 ${
                                    validationErrors[`${type}_allocated`] 
                                        ? 'border-red-500 focus:ring-red-400' 
                                        : `border-gray-300 ${colors.ring}`
                                }`}
                            />
                            <button
                                onClick={() => incrementAllocated(type)}
                                className={`${colors.button} text-white rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 ${colors.ring}`}
                                title="Increase"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        {validationErrors[`${type}_allocated`] && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} /> {validationErrors[`${type}_allocated`]}
                            </p>
                        )}
                    </div>

                    {/* Used Days Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                            Days Used <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => decrementUsed(type)}
                                className={`${colors.button} text-white rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 ${colors.ring}`}
                                title="Decrease"
                            >
                                <Minus size={16} />
                            </button>
                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={data.used}
                                onChange={(e) => handleUsedChange(type, e.target.value)}
                                className={`flex-1 px-4 py-2.5 border rounded-lg text-center text-lg font-bold focus:outline-none focus:ring-2 ${
                                    validationErrors[`${type}_used`] 
                                        ? 'border-red-500 focus:ring-red-400' 
                                        : `border-gray-300 ${colors.ring}`
                                }`}
                            />
                            <button
                                onClick={() => incrementUsed(type)}
                                className={`${colors.button} text-white rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 ${colors.ring}`}
                                title="Increase"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        {validationErrors[`${type}_used`] && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} /> {validationErrors[`${type}_used`]}
                            </p>
                        )}
                    </div>

                    {/* Remaining Balance Display */}
                    <div className={`${colors.bg} border ${colors.border} rounded-xl p-4`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-gray-600">Remaining Balance</span>
                            <span className={`text-2xl font-bold ${colors.text}`}>
                                {remaining.toFixed(1)} days
                            </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-500`}
                            />
                        </div>
                        
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>{percentage.toFixed(0)}% available</span>
                            <span>{data.used.toFixed(1)} / {data.allocated.toFixed(1)} used</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Employee Info Header */}
            {(employeeName || employeeNo) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-green-600 text-white rounded-lg p-2">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">{employeeName}</h4>
                            <p className="text-xs text-gray-500">Employee No: {employeeNo}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Success Alert */}
            {showSuccessAlert && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-center gap-3"
                >
                    <CheckCircle size={20} className="text-green-600" />
                    <div>
                        <p className="text-green-800 font-semibold text-sm">Credits Updated Successfully!</p>
                        <p className="text-green-600 text-xs">Leave balances have been saved.</p>
                    </div>
                </motion.div>
            )}

            {/* Credit Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderCreditCard(
                    'workLeave',
                    <Briefcase size={20} className="text-white" />,
                    'Work Leave',
                    'blue'
                )}
                {renderCreditCard(
                    'medicalLeave',
                    <Heart size={20} className="text-white" />,
                    'Medical Leave',
                    'green'
                )}
            </div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-end gap-3 pt-4"
            >
                <button
                    onClick={handleReset}
                    disabled={!isModified}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        isModified
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                            : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                    }`}
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
                
                <button
                    onClick={handleSave}
                    disabled={!isModified || Object.keys(validationErrors).length > 0}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                        isModified && Object.keys(validationErrors).length === 0
                            ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <Save size={16} />
                    Save Credits
                </button>
            </motion.div>

            {/* Status Indicator */}
            {isModified && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-center"
                >
                    <p className="text-yellow-700 text-xs font-medium">
                        <AlertCircle size={14} className="inline mr-1" />
                        You have unsaved changes
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default LeaveCreditUpdater;
