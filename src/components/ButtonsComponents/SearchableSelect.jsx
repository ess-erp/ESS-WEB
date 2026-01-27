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
    label = ""
}) => {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <div style={{ width }} className="relative">

                {showSearchIcon && (
                    <Search
                        size={16}
                        className="absolute left-3 top-3 z-10 text-gray-400"
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
