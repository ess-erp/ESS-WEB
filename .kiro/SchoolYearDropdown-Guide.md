# SchoolYearDropdown Component - Reusability Guide

## Component Location
`src/components/ButtonsComponents/SchoolYearDropdown.jsx`

---

## Current Implementation

### Component Structure
```javascript
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

    // Build options
    const schoolYears = [
        ...(includeAll ? [{ value: "", label: "All School Years" }] : []),
        ...(schoolYearListState.data || []).map(sy => ({
            value: sy.CalendarId || sy.calendarId,
            label: sy.SchoolYear || sy.schoolYear
        }))
    ];

    return (
        <select className={className} value={value} onChange={onChange}>
            {schoolYears.map((sy) => (
                <option key={sy.value} value={sy.value}>{sy.label}</option>
            ))}
        </select>
    );
};
```

---

## Current Backend Integration

### Endpoint
**URL:** `/accounting/get-school-year-list`  
**Method:** POST  
**Headers:** Authorization required

### Redux Action
**File:** `src/states/AccountingState/Action.js`

```javascript
export const fetchGetSchoolYearListData = () => async (dispatch) => {
    dispatch(fetchGetSchoolYearListRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-school-year-list`, {
            method: 'POST', 
            headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetSchoolYearListSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetSchoolYearListFailure(err.message));
        return { ok: false, err };
    }
};
```

### Expected Response Format
```json
[
    {
        "CalendarId": 1,
        "SchoolYear": "2025-2026"
    },
    {
        "CalendarId": 2,
        "SchoolYear": "2026-2027"
    }
]
```

**Alternative property names supported:**
- `calendarId` (lowercase)
- `schoolYear` (lowercase)

---

## How to Use This Component

### Example 1: Basic Usage with State
```javascript
import { useState } from 'react';
import SchoolYearDropdown from '../../components/ButtonsComponents/SchoolYearDropdown';

const MyComponent = () => {
    const [selectedSchoolYear, setSelectedSchoolYear] = useState("");

    const handleSchoolYearChange = (e) => {
        setSelectedSchoolYear(e.target.value);
        console.log("Selected Calendar ID:", e.target.value);
    };

    return (
        <div>
            <label>School Year:</label>
            <SchoolYearDropdown 
                value={selectedSchoolYear}
                onChange={handleSchoolYearChange}
            />
        </div>
    );
};
```

### Example 2: Without "All School Years" Option
```javascript
<SchoolYearDropdown 
    value={selectedSchoolYear}
    onChange={handleSchoolYearChange}
    includeAll={false}  // Remove "All School Years" option
/>
```

### Example 3: Custom Styling
```javascript
<SchoolYearDropdown 
    value={selectedSchoolYear}
    onChange={handleSchoolYearChange}
    className="px-4 py-3 border-2 border-green-500 rounded-lg text-lg"
/>
```

### Example 4: In a Filter Section
```javascript
const FilterSection = () => {
    const [filters, setFilters] = useState({
        schoolYear: "",
        department: "",
        status: ""
    });

    const handleFilterChange = (field) => (e) => {
        setFilters(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">School Year</label>
                <SchoolYearDropdown 
                    value={filters.schoolYear}
                    onChange={handleFilterChange('schoolYear')}
                />
            </div>
            {/* Other filters */}
        </div>
    );
};
```

---

## Component Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | string/number | - | ✅ Yes | Current selected value (CalendarId) |
| `onChange` | function | - | ✅ Yes | Handler function when selection changes |
| `className` | string | `"px-3 py-2 border border-gray-300 rounded"` | ❌ No | Custom CSS classes for styling |
| `includeAll` | boolean | `true` | ❌ No | Include "All School Years" option at the top |

---

## Backend Adjustment Options

### Option 1: Keep Current Structure (Recommended)
Your backend already returns the correct format. Just ensure it returns:
```csharp
public class SchoolYearDto
{
    public long CalendarId { get; set; }
    public string SchoolYear { get; set; }
}
```

### Option 2: Add Department/Module-Specific Endpoints
If you want different school year lists for different modules:

```javascript
// Create separate actions for HR module
export const fetchGetHrSchoolYearListData = () => async (dispatch) => {
    dispatch(fetchGetHrSchoolYearListRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/hr/get-school-year-list`, {
            method: 'POST', 
            headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetHrSchoolYearListSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetHrSchoolYearListFailure(err.message));
        return { ok: false, err };
    }
};
```

Then create a new `HrSchoolYearDropdown.jsx` that uses the HR-specific action.

### Option 3: Make Component Flexible (Most Reusable)
Create a generic version that accepts the Redux action as a prop:

```javascript
const SchoolYearDropdown = ({ 
    value, 
    onChange, 
    className = "px-3 py-2 border border-gray-300 rounded",
    includeAll = true,
    reduxStatePath = 'accounting.schoolYearListState',  // NEW
    fetchAction = null  // NEW
}) => {
    const dispatch = useDispatch();
    const schoolYearListState = useSelector((s) => {
        const paths = reduxStatePath.split('.');
        return paths.reduce((obj, path) => obj?.[path], s);
    });

    useEffect(() => {
        if (fetchAction) {
            dispatch(fetchAction());
        }
    }, [dispatch, fetchAction]);

    // Rest of the component...
};
```

Usage:
```javascript
import { fetchGetSchoolYearListData } from '../../states/AccountingState/Action';

<SchoolYearDropdown 
    value={selectedSchoolYear}
    onChange={handleSchoolYearChange}
    fetchAction={fetchGetSchoolYearListData}
    reduxStatePath="accounting.schoolYearListState"
/>
```

---

## Backend C# Example (If you need to adjust)

### Controller Endpoint
```csharp
[HttpPost("get-school-year-list")]
public async Task<IActionResult> GetSchoolYearList()
{
    try
    {
        var schoolYears = await _context.CalendarTables
            .Where(c => c.ActiveStatus == "Y")
            .OrderByDescending(c => c.DateCreated)
            .Select(c => new 
            {
                CalendarId = c.CalendarId,
                SchoolYear = c.SchoolYear
            })
            .ToListAsync();

        return Ok(schoolYears);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = $"Error: {ex.Message}" });
    }
}
```

### For HR Module (Example)
```csharp
[HttpPost("hr/get-school-year-list")]
public async Task<IActionResult> GetHrSchoolYearList()
{
    try
    {
        // You can add HR-specific filtering here
        var schoolYears = await _context.CalendarTables
            .Where(c => c.ActiveStatus == "Y" && c.ModuleType == "HR")
            .OrderByDescending(c => c.DateCreated)
            .Select(c => new 
            {
                CalendarId = c.CalendarId,
                SchoolYear = c.SchoolYear
            })
            .ToListAsync();

        return Ok(schoolYears);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = $"Error: {ex.Message}" });
    }
}
```

---

## Where It's Currently Used

The SchoolYearDropdown is already imported and can be used in various modules:
- Accounting pages (Financial Reports, General Ledger, etc.)
- Any component that needs school year filtering

---

## Best Practices

1. **Always provide both `value` and `onChange` props** - This ensures controlled component behavior
2. **Handle the onChange event properly** - Extract `e.target.value` to get the CalendarId
3. **Use `includeAll={false}` when selection is required** - Don't show "All School Years" if a specific year must be selected
4. **Store CalendarId, not SchoolYear string** - Always work with IDs for database queries
5. **The component fetches data automatically** - No need to manually dispatch the fetch action

---

## Common Use Cases

### 1. Leave Management (Your Current Screen)
```javascript
const LeaveCreditManagement = () => {
    const [selectedSchoolYear, setSelectedSchoolYear] = useState("");

    return (
        <div>
            <label>School Year:</label>
            <SchoolYearDropdown 
                value={selectedSchoolYear}
                onChange={(e) => setSelectedSchoolYear(e.target.value)}
                includeAll={false}
            />
        </div>
    );
};
```

### 2. Payroll Processing
```javascript
<SchoolYearDropdown 
    value={payrollFilters.schoolYear}
    onChange={(e) => setPayrollFilters(prev => ({
        ...prev,
        schoolYear: e.target.value
    }))}
/>
```

### 3. Reports with "All Years" Option
```javascript
<SchoolYearDropdown 
    value={reportFilters.schoolYear}
    onChange={(e) => setReportFilters(prev => ({
        ...prev,
        schoolYear: e.target.value
    }))}
    includeAll={true}  // Shows "All School Years"
/>
```

---

## Summary

✅ **What it does:**
- Fetches school year list from backend automatically
- Displays as a dropdown select element
- Handles loading state
- Flexible styling and options

✅ **What you need to do:**
- Import the component
- Provide `value` and `onChange` props
- Optionally customize `className` and `includeAll`
- Ensure your backend endpoint returns the correct format

✅ **Backend adjustment needed:**
- **If using `/accounting/get-school-year-list`**: No changes needed
- **If creating new endpoint**: Return array with `CalendarId` and `SchoolYear` properties

---

*Last Updated: August 26, 2026*
