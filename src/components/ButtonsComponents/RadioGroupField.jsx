import { useEffect, useState } from "react";
const RadioGroupField = ({
    name,
    register,
    label,
    options = [],
    isEditing = false,
    divClassName = "p-2",
    required = false,
    error,
}) => {
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (error) {
            setShowError(true);

            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error]);
    return (
        <div className={divClassName}>
            <label className="block mb-2 text-sm font-medium text-gray-900">
                <strong>
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </strong>
            </label>

            {showError && (
                <p className="text-red-500 text-sm mb-2">
                    {error.message}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {options.map((opt) => (
                    <label
                        key={opt.value}
                        className={`flex items-center gap-2 ${!isEditing
                                ? "text-gray-500 cursor-not-allowed"
                                : "text-gray-700 cursor-pointer"
                            }`}
                    >
                        <input
                            type="radio"
                            value={opt.value}
                            {...register(name, {
                                required: required
                                    ? `${label} is required`
                                    : false,
                            })}
                            disabled={!isEditing}
                            className="text-blue-500 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm">{opt.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioGroupField;
