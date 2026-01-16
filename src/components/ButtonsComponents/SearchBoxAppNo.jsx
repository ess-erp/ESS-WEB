import { useEffect, useState } from "react";

const SearchBoxAppNo = ({
    label = "",
    required = false,
    placeholder = "",
    options = [],
    onSelect,          
    onEnter,           
}) => {
    const [value, setValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [filteredOptions, setFilteredOptions] = useState([]);

    useEffect(() => {
        if (!value) {
            setFilteredOptions(options);
            return;
        }

        const v = value.toLowerCase();
        setFilteredOptions(
            options.filter((s) =>
                `${s.AppNumber} ${s.Fname} ${s.Mname} ${s.Lname}`
                    .toLowerCase()
                    .includes(v)
            )
        );
    }, [value, options]);

    const handleSelect = (student) => {
        setValue(
            `${student.AppNumber ?? ""} - ${student.Fname ?? ""} ${student.Mname ?? ""} ${student.Lname ?? ""}`
        );
        setShowDropdown(false);
        setHighlightedIndex(-1);
        onSelect?.(student);
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || filteredOptions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
        }

        if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0) {
                handleSelect(filteredOptions[highlightedIndex]);
            } else {
                onEnter?.(value);
            }
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative w-full">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {showDropdown && value && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredOptions.map((student, i) => (
                            <li
                                key={student.StudentId}
                                onMouseDown={() => handleSelect(student)}
                                className={`px-3 py-2 cursor-pointer ${
                                    highlightedIndex === i
                                        ? "bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                            >
                                {student.AppNumber ?? ""} -{" "}
                                {student.Fname ?? ""} {student.Mname ?? ""}{" "}
                                {student.Lname ?? ""}
                            </li>
                        ))}

                        {filteredOptions.length === 0 && (
                            <li className="px-3 py-2 text-gray-500">
                                No results found
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchBoxAppNo;
