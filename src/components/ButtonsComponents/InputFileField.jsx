const InputFileField = ({
    name,
    register,
    label,
    type = "text",
    isEditing = false,
    onFileChange,
    file,
    altFileName = "",
}) => {
    return (
        <div className="p-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
                <strong>{label}</strong>
            </label>

            <input
                type={type}
                {...register(name, {
                    onChange: (e) => {
                        if (type === "file") {
                            onFileChange?.(e.target.files[0]);
                        }
                    },
                })}
                readOnly={!isEditing}
                className="shadow-xs border text-sm rounded-lg block w-full p-2.5"
            />

            {file && (
                <img
                    src={URL.createObjectURL(file)}
                    alt={altFileName}
                    className="w-32 h-32 object-cover mt-2"
                />
            )}
        </div>
    );
};

export default InputFileField;
