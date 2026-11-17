import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetSchoolYearListData } from '../../states/SharedState/Action';

const SchoolYearDropdown = ({ 
    value, 
    onChange, 
    className = "px-3 py-2 border border-gray-300 rounded",
    includeAll = true 
}) => {
    const dispatch = useDispatch();
    const schoolYearListState = useSelector((s) => s.shared.schoolYearListState);

    // Fetch school years on mount
    useEffect(() => {
        dispatch(fetchGetSchoolYearListData());
    }, [dispatch]);

    // Debug: Log the state to see what's coming back
    useEffect(() => {
        console.log('SchoolYearDropdown State:', schoolYearListState);
    }, [schoolYearListState]);

    // Extract data from different possible response formats
    const rawData = schoolYearListState.data;
    let schoolYearData = [];
    
    if (Array.isArray(rawData)) {
        schoolYearData = rawData;
    } else if (rawData?.data && Array.isArray(rawData.data)) {
        schoolYearData = rawData.data;
    } else if (rawData?.Data && Array.isArray(rawData.Data)) {
        schoolYearData = rawData.Data;
    }

    // Build school year options from Redux state
    const schoolYears = [
        ...(includeAll ? [{ value: "", label: "All School Years" }] : [{ value: "", label: "Select School Year" }]),
        ...schoolYearData.map(sy => ({
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

    // Error state
    if (schoolYearListState.error) {
        return (
            <select className={className} disabled>
                <option>Error loading school years</option>
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
