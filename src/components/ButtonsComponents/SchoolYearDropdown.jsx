import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetSchoolYearListData } from '../../states/AccountingState/Action';

const SchoolYearDropdown = ({ 
    value, 
    onChange, 
    className = "px-3 py-2 border border-gray-300 rounded",
    includeAll = true 
}) => {
    const dispatch = useDispatch();
    const schoolYearListState = useSelector((s) => s.accounting.schoolYearListState);

    // Fetch school years on mount
    useEffect(() => {
        dispatch(fetchGetSchoolYearListData());
    }, [dispatch]);

    // Build school year options from Redux state
    const schoolYears = [
        ...(includeAll ? [{ value: "", label: "All School Years" }] : []),
        ...(schoolYearListState.data || []).map(sy => ({
            value: sy.CalendarId || sy.calendarId,
            label: sy.SchoolYear || sy.schoolYear
        }))
    ];

    // Loading state
    if (schoolYearListState.loading) {
        return (
            <select className={className} disabled>
                <option>Loading school years...</option>
            </select>
        );
    }

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
