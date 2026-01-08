const InputField = ({
    name,
    register,
    label,
    placeholder = "",
    isEditing = false,
    displayValue = "",
    type = "text"
}) => {
    return (
        <div className="p-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
                <strong>{label}</strong>
            </label>

            <input
                type={type}
                {...register(name)}
                placeholder={placeholder}
                value={!isEditing ? displayValue : undefined}
                readOnly={!isEditing}
                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                    focus:ring-blue-500 focus:border-blue-500
                    ${!isEditing
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
            />
        </div>
    );
};

export default InputField;
