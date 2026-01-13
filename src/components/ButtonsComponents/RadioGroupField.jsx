const RadioGroupField = ({
    name,
    register,
    label,
    options = [], // [{ label: "Male", value: "male" }]
    isEditing = false,
    divClassName = "p-2",
    required = false,
}) => {
    return (
        <div className={divClassName}>
            <label className="block mb-2 text-sm font-medium text-gray-900">
                <strong>
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </strong>
            </label>

            <div className="flex items-center gap-6">
                {options.map((opt) => (
                    <label
                        key={opt.value}
                        className={`flex items-center gap-2 ${
                            !isEditing
                                ? "text-gray-500 cursor-not-allowed"
                                : "text-gray-700 cursor-pointer"
                        }`}
                    >
                        <input
                            type="radio"
                            value={opt.value}
                            {...register(name)}
                            disabled={!isEditing}
                            className="text-blue-500 focus:ring-blue-500 border-gray-300"
                        />
                        {opt.label}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioGroupField;
