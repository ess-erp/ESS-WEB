import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import BlueBtn from "./BlueBtn";

const InputFieldWithBtn = ({
    label,
    disabled,
    isOtpValid,
    placeholder,
    value,
    onChange,
    onClick,
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} <span className="text-red-500">*</span>
            </label>

            <div className="relative flex gap-2 items-center">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {isOtpValid === true && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                )}

                {isOtpValid === false && (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                )}

                <BlueBtn
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ${disabled ? "bg-gray-400 hover:bg-gray-400" : ""}`}
                    label={disabled > 0 ? `Resend OTP in ${disabled}s` : "Send OTP"}
                    onClick={onClick}
                    disabled={disabled > 0}
                />
            </div>
        </div>
    );
};

export default InputFieldWithBtn;
