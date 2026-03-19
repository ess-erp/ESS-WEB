import { useEffect, useState } from "react";
import BlueBtn from "./BlueBtn";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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
  required = false,
  errors = false,
  errorMessage = "",
  isValidEmail,
  isOtpValid = false,
  isOtp = false,
  onChange,
  isMessage = false,
  successMessage = "",
  disabled = 0,
  color = "",
  rules = {},
  showEyeButton = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

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
    // <div className={divClassName}>
    <div className={`${divClassName} relative`}>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        <strong>
          {label} {required && <span className="text-red-500">*</span>}
        </strong>
      </label>
      {showError && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
      <input
        type={inputType}
        // type={type} 12-3-26

        // {...register(name)}
        // {...register(name, { required: required ? `${label} is required` : false })}
        {...register(name, {
          required: required ? `${label} is required` : false,
          ...rules,
          validate: (value) => {
            if (
              value &&
              (type === "email" || name.toLowerCase().includes("email"))
            ) {
              return isValidEmail(value) || "Invalid email format";
            }
            return true;
          },
        })}
        onChange={(e) => {
          register(name).onChange(e);

          if (isOtp && onChange) {
            onChange(e);
          }
        }}
        placeholder={placeholder}
        value={!isEditing ? displayValue : undefined}
        readOnly={!isEditing}
        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                    focus:ring-blue-500 focus:border-blue-500
                    ${
                      !isEditing
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
      />

      {/* {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5
             w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      )} */}
      {/* 
      {showEyeButton && (
        <button
          type="button"
          onClick={() => setShowPassword(!showEyeButton)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showEyeButton ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      )} */}

      {isMessage && (
        <p className={`text-${color}-500 text-sm mt-1`}>{successMessage}</p>
      )}
      {addButton && (
        <>
          {isOtpValid && (
            <CheckCircleIcon className="absolute right-3 top-[36px] h-5 w-5 text-green-500" />
          )}

          {isOtpValid === false && (
            <XCircleIcon className="absolute right-3 top-[36px] h-5 w-5 text-red-500" />
          )}
          <div className="pt-2">
            <BlueBtn
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ${
                disabled ? "bg-gray-400 hover:bg-gray-400" : ""
              }`}
              label={disabled > 0 ? `Resend OTP in ${disabled}s` : "Send OTP"}
              onClick={handleClick}
              disabled={disabled > 0}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InputField;
