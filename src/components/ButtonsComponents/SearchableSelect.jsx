import { useEffect, useState } from "react";
import Select from "react-select";
import { Search } from "lucide-react";

const SearchableSelect = ({
    options = [],
    value = null,
    onChange,
    placeholder = "Select...",
    isMulti = false,
    isDisabled = false,
    width = "100%",
    showSearchIcon = true,
    label = "",
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
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
                <strong>{label} {required && (<span className='text-red-500'>*</span>)}</strong>
            </label>
            {showError && (
                <p className="text-red-500 text-sm mt-1">
                    {errorMessage}
                </p>
            )}
            <div style={{ width }} className="relative">

                {showSearchIcon && (
                    <Search
                        size={16}
                        className="absolute left-3 top-3 z-10 text-gray-400 p-2.5"
                    />
                )}

                {/* <Select
                    options={options}
                    value={value}
                    onChange={onChange}
                    isSearchable
                    isMulti={isMulti}
                    isDisabled={isDisabled}
                    placeholder={placeholder}
                    classNamePrefix="react-select"
                    styles={{
                        control: (base) => ({
                            ...base,
                            paddingLeft: showSearchIcon ? "28px" : "8px",
                            borderRadius: "8px",
                            minHeight: "40px",
                        }),
                    }}
                /> */}
                <Select
                    options={options}
                    value={value}
                    onChange={onChange}
                    isSearchable
                    isMulti={isMulti}
                    isDisabled={isDisabled}
                    placeholder={placeholder}
                    classNamePrefix="react-select"

                    menuPortalTarget={document.body}
                    menuPosition="fixed"

                    styles={{
                        control: (base) => ({
                            ...base,
                            paddingLeft: showSearchIcon ? "28px" : "8px",
                            borderRadius: "8px",
                            minHeight: "40px",
                        }),
                        menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999, // 🔥 VERY IMPORTANT
                        }),
                    }}
                />
            </div>
        </div>

    );
};

export default SearchableSelect;
