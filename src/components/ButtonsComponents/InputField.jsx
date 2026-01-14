import { useEffect, useState } from "react";
import BlueBtn from "./BlueBtn";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const InputField = ({
    name,
    register,
    label,
    placeholder = "",
    isEditing = false,
    displayValue = "",
    type = "text",
    divClassName = "p-2",
    addButton = false,
    handleClick,
    disabled = 0,
    isOtpValid = false,
    required = false,
    errors = false,
    errorMessage = "",
}) => {

    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (errors && errorMessage) {
            setShowError(true);

            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [errors, errorMessage]);
    return (


        <div className={divClassName}>
            <label className="block mb-2 text-sm font-medium text-gray-900">
                <strong>{label} {required && (<span className='text-red-500'>*</span>)}</strong>
            </label>
            {showError && (
                <p className="text-red-500 text-sm mt-1">
                    {errorMessage}
                </p>
            )}
            <input
                type={type}
                // {...register(name)}
                {...register(name, { required: required ? `${label} is required` : false })}
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

            {addButton && (
                <>
                    {isOtpValid && (
                        <CheckCircleIcon className="absolute right-3 top-[36px] h-5 w-5 text-green-500" />
                    )}

                    {isOtpValid === false && (
                        <XCircleIcon className="absolute right-3 top-[36px] h-5 w-5 text-red-500" />
                    )}
                    <BlueBtn
                        className="pt-1"
                        label={disabled > 0 ? `Resend OTP in ${disabled}s` : "Send OTP"}
                        onClick={handleClick}
                        disabled={disabled > 0}
                    />
                </>

            )}
        </div>
    );
};

export default InputField;
