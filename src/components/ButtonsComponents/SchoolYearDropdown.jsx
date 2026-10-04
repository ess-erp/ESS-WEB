import React from 'react';

const SchoolYearDropdown = ({ 
    value, 
    onChange, 
    className = "px-3 py-2 border border-gray-300 rounded",
    includeAll = true 
}) => {
    // Centralized school year options - update this array to add new school years
    const schoolYears = [
        ...(includeAll ? [{ value: "", label: "All School Years" }] : []),
        { value: "2023-2024", label: "SY 2023-2024" },
        { value: "2024-2025", label: "SY 2024-2025" },
        { value: "2025-2026", label: "SY 2025-2026" },
        { value: "2026-2027", label: "SY 2026-2027" },
        // Add new school years here in the future
    ];

    return (
        <select
            className={className}
            value={value}
            onChange={onChange}
        >
            {schoolYears.map((sy) => (
                <option key={sy.value} value={sy.value}>
                    {sy.label}
                </option>
            ))}
        </select>
    );
};

export default SchoolYearDropdown;
