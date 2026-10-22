import { FileText, Calendar, Info } from "lucide-react";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import useTemplateStore from "../../zustands/AccountingZustands/useTemplateStore";

// Custom Peso Icon Component
const PesoIcon = ({ size = 16, className = "" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <path d="M8 21V3h6a4 4 0 0 1 0 8h-6" />
        <line x1="5" y1="9" x2="13" y2="9" />
        <line x1="5" y1="13" x2="13" y2="13" />
    </svg>
);

// Simple Input Component for Template Form
const SimpleInput = ({ label, type = "text", value, onChange, error, placeholder, icon, required }) => {
    return (
        <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`shadow-sm border text-sm rounded-lg block w-full p-2.5 ${
                        icon ? "pl-10" : ""
                    } bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 ${
                        error ? "border-red-500" : ""
                    }`}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

const TuitionFeeTemplateForm = ({ levelOptions = [] }) => {
    const { tuitionForm, setTuitionFormField, errors } = useTemplateStore();

    console.log('TuitionFeeTemplateForm - levelOptions received:', levelOptions);
    console.log('TuitionFeeTemplateForm - levelOptions length:', levelOptions.length);

    // Transform level options for SearchableSelect
    const levelSelectOptions = levelOptions.map(level => ({
        value: level.LevelId || level.levelId,
        label: level.LevelName || level.levelName
    }));

    console.log('TuitionFeeTemplateForm - transformed levelSelectOptions:', levelSelectOptions);

    const handleLevelChange = (selectedOption) => {
        setTuitionFormField("levelId", selectedOption?.value || "");
    };

    const selectedLevel = levelSelectOptions.find(opt => opt.value === tuitionForm.levelId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-green-600 text-white rounded-lg p-2">
                        <FileText size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Tuition Fee Template</h3>
                </div>
                <p className="text-sm text-gray-600">
                    Create a tuition fee template with multiple payment plans (A-D)
                </p>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Payment Plans:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li><strong>Plan A:</strong> Fully Paid (1 payment)</li>
                            <li><strong>Plan B:</strong> 2 Payments</li>
                            <li><strong>Plan C:</strong> 3 Payments</li>
                            <li><strong>Plan D:</strong> 4 Payments</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Template Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h4 className="font-bold text-gray-900 mb-4">Template Information</h4>
                
                <div className="space-y-4">
                    <SimpleInput
                        label="Template Name"
                        placeholder="e.g., SY 2024-2025 Tuition Fee"
                        value={tuitionForm.tempName}
                        onChange={(e) => setTuitionFormField("tempName", e.target.value)}
                        error={errors.tempName}
                        required
                    />

                    <SearchableSelect
                        label="Target Level"
                        placeholder="Select grade level..."
                        options={levelSelectOptions}
                        value={selectedLevel}
                        onChange={handleLevelChange}
                        errors={!!errors.levelId}
                        errorMessage={errors.levelId}
                        required
                    />
                </div>
            </div>

            {/* Plan A - Fully Paid */}
            <div className="bg-white rounded-xl border-2 border-green-300 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-green-600 text-white rounded-lg px-3 py-1">
                        <span className="font-bold">PLAN A</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Fully Paid (1 Payment)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SimpleInput
                        label="Amount"
                        type="number"
                        placeholder="0.00"
                        value={tuitionForm.amountA}
                        onChange={(e) => setTuitionFormField("amountA", e.target.value)}
                        error={errors.amountA}
                        icon={<PesoIcon size={16} />}
                        required
                    />
                    <SimpleInput
                        label="Date of Payment"
                        type="date"
                        value={tuitionForm.dateOfPaymentA}
                        onChange={(e) => setTuitionFormField("dateOfPaymentA", e.target.value)}
                        error={errors.dateOfPaymentA}
                        icon={<Calendar size={16} />}
                        required
                    />
                </div>
            </div>

            {/* Plan B - 2 Payments */}
            <div className="bg-white rounded-xl border-2 border-blue-300 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-600 text-white rounded-lg px-3 py-1">
                        <span className="font-bold">PLAN B</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">2 Payments</span>
                </div>

                <div className="space-y-4">
                    {/* 1st Payment */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-blue-900 mb-3">1st Payment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SimpleInput
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                value={tuitionForm.amountB1}
                                onChange={(e) => setTuitionFormField("amountB1", e.target.value)}
                                error={errors.amountB1}
                                icon={<PesoIcon size={16} />}
                                required
                            />
                            <SimpleInput
                                label="Date of Payment"
                                type="date"
                                value={tuitionForm.dateOfPaymentB1}
                                onChange={(e) => setTuitionFormField("dateOfPaymentB1", e.target.value)}
                                error={errors.dateOfPaymentB1}
                                icon={<Calendar size={16} />}
                                required
                            />
                        </div>
                    </div>

                    {/* 2nd Payment */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-blue-900 mb-3">2nd Payment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SimpleInput
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                value={tuitionForm.amountB2}
                                onChange={(e) => setTuitionFormField("amountB2", e.target.value)}
                                error={errors.amountB2}
                                icon={<PesoIcon size={16} />}
                                required
                            />
                            <SimpleInput
                                label="Date of Payment"
                                type="date"
                                value={tuitionForm.dateOfPaymentB2}
                                onChange={(e) => setTuitionFormField("dateOfPaymentB2", e.target.value)}
                                error={errors.dateOfPaymentB2}
                                icon={<Calendar size={16} />}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan C - 3 Payments */}
            <div className="bg-white rounded-xl border-2 border-yellow-300 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-yellow-600 text-white rounded-lg px-3 py-1">
                        <span className="font-bold">PLAN C</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">3 Payments</span>
                </div>

                <div className="space-y-4">
                    {/* 1st Payment */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-yellow-900 mb-3">1st Payment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SimpleInput
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                value={tuitionForm.amountC1}
                                onChange={(e) => setTuitionFormField("amountC1", e.target.value)}
                                error={errors.amountC1}
                                icon={<PesoIcon size={16} />}
                                required
                            />
                            <SimpleInput
                                label="Date of Payment"
                                type="date"
                                value={tuitionForm.dateOfPaymentC1}
                                onChange={(e) => setTuitionFormField("dateOfPaymentC1", e.target.value)}
                                error={errors.dateOfPaymentC1}
                                icon={<Calendar size={16} />}
                                required
                            />
                        </div>
                    </div>

                    {/* 2nd Payment */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-yellow-900 mb-3">2nd Payment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SimpleInput
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                value={tuitionForm.amountC2}
                                onChange={(e) => setTuitionFormField("amountC2", e.target.value)}
                                error={errors.amountC2}
                                icon={<PesoIcon size={16} />}
                                required
                            />
                            <SimpleInput
                                label="Date of Payment"
                                type="date"
                                value={tuitionForm.dateOfPaymentC2}
                                onChange={(e) => setTuitionFormField("dateOfPaymentC2", e.target.value)}
                                error={errors.dateOfPaymentC2}
                                icon={<Calendar size={16} />}
                                required
                            />
                        </div>
                    </div>

                    {/* 3rd Payment */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-yellow-900 mb-3">3rd Payment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SimpleInput
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                value={tuitionForm.amountC3}
                                onChange={(e) => setTuitionFormField("amountC3", e.target.value)}
                                error={errors.amountC3}
                                icon={<PesoIcon size={16} />}
                                required
                            />
                            <SimpleInput
                                label="Date of Payment"
                                type="date"
                                value={tuitionForm.dateOfPaymentC3}
                                onChange={(e) => setTuitionFormField("dateOfPaymentC3", e.target.value)}
                                error={errors.dateOfPaymentC3}
                                icon={<Calendar size={16} />}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan D - 4 Payments */}
            <div className="bg-white rounded-xl border-2 border-purple-300 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-purple-600 text-white rounded-lg px-3 py-1">
                        <span className="font-bold">PLAN D</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">4 Payments</span>
                </div>

                <div className="space-y-4">
                    {/* 1st Payment */}
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-purple-900 mb-3">1st Payment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SimpleInput
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                value={tuitionForm.amountD1}
                                onChange={(e) => setTuitionFormField("amountD1", e.target.value)}
                                error={errors.amountD1}
                                icon={<PesoIcon size={16} />}
                                required
                            />
                            <SimpleInput
                                label="Date of Payment"
                                type="date"
                                value={tuitionForm.dateOfPaymentD1}
                                onChange={(e) => setTuitionFormField("dateOfPaymentD1", e.target.value)}
                                error={errors.dateOfPaymentD1}
                                icon={<Calendar size={16} />}
                                required
                            />
                        </div>
                    </div>

                    {/* 2nd Payment */}
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-purple-900 mb-3">2nd Payment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SimpleInput
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                value={tuitionForm.amountD2}
                                onChange={(e) => setTuitionFormField("amountD2", e.target.value)}
                                error={errors.amountD2}
                                icon={<PesoIcon size={16} />}
                                required
                            />
                            <SimpleInput
                                label="Date of Payment"
                                type="date"
                                value={tuitionForm.dateOfPaymentD2}
                                onChange={(e) => setTuitionFormField("dateOfPaymentD2", e.target.value)}
                                error={errors.dateOfPaymentD2}
                                icon={<Calendar size={16} />}
                                required
                            />
                        </div>
                    </div>

                    {/* 3rd Payment */}
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-purple-900 mb-3">3rd Payment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SimpleInput
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                value={tuitionForm.amountD3}
                                onChange={(e) => setTuitionFormField("amountD3", e.target.value)}
                                error={errors.amountD3}
                                icon={<PesoIcon size={16} />}
                                required
                            />
                            <SimpleInput
                                label="Date of Payment"
                                type="date"
                                value={tuitionForm.dateOfPaymentD3}
                                onChange={(e) => setTuitionFormField("dateOfPaymentD3", e.target.value)}
                                error={errors.dateOfPaymentD3}
                                icon={<Calendar size={16} />}
                                required
                            />
                        </div>
                    </div>

                    {/* 4th Payment */}
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm font-bold text-purple-900 mb-3">4th Payment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SimpleInput
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                value={tuitionForm.amountD4}
                                onChange={(e) => setTuitionFormField("amountD4", e.target.value)}
                                error={errors.amountD4}
                                icon={<PesoIcon size={16} />}
                                required
                            />
                            <SimpleInput
                                label="Date of Payment"
                                type="date"
                                value={tuitionForm.dateOfPaymentD4}
                                onChange={(e) => setTuitionFormField("dateOfPaymentD4", e.target.value)}
                                error={errors.dateOfPaymentD4}
                                icon={<Calendar size={16} />}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TuitionFeeTemplateForm;
