import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { color } from "framer-motion";

const InputPasswordField = ({
  name,
  register,
  label,
  placeholder = "",
  isEditing = false,
  displayValue = "",
  divClassName = "p-2",
  required = false,
  errors = false,
  errorMessage = "",
  isValidEmail,
  isOtpValid = false,
  isOtp = false,
  showEyeButton = false,
  isMessage = false,
  color = "",
  successMessage = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const inputType = showPassword ? "text" : "password";

  useEffect(() => {
    if (errors && errorMessage) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [errors, errorMessage]);

  return (
    <div className={`${divClassName} relative`}>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        <strong>
          {label} {required && <span className="text-red-500">*</span>}
        </strong>
      </label>

      {showError && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}

      <input
        type={inputType}
        {...register(name)}
        placeholder={placeholder}
        value={!isEditing ? displayValue : undefined}
        readOnly={!isEditing}
        className={`shadow-xs border text-sm rounded-lg block w-full pl-3 pr-10 py-2
          focus:ring-blue-500 focus:border-blue-500
          ${
            !isEditing
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white border-gray-300 text-gray-900"
          }`}
      />

      {showEyeButton && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-0 pr-3 pt-1 flex items-center text-gray-500 bg-transparent border-none outline-none"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      )}

      {isMessage && (
        <p className={`text-${color}-500 text-sm mt-1`}>{successMessage}</p>
      )}
    </div>
  );
};

export default InputPasswordField;
