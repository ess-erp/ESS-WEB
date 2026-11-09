---
inclusion: auto
---

# ERP 2026 - ESS Web Application - Project Context

## Project Overview
This is an **Enterprise Resource Planning (ERP)** system for educational institutions, specifically the **Employee Self-Service (ESS)** web application built with React + Vite.

### Technology Stack
- **Frontend**: React 18, Vite
- **State Management**: Redux (traditional action/reducer pattern, NOT Redux Toolkit slices)
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **UI Framework**: Tailwind CSS, Headless UI
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons, Heroicons
- **Date Handling**: Custom formatters in `GlobalFunction/FormatDate.js`

### Project Structure
```
src/
├── components/           # Reusable components organized by module
│   ├── HrComponents/    # Human Resources components
│   ├── AdmissionComponents/
│   ├── AccountingComponents/
│   ├── ButtonsComponents/  # Reusable form inputs and buttons
│   └── SharedComponents/   # Cross-module shared components
├── pages/               # Page-level components
│   ├── HumanResources/
│   ├── Admission/
│   └── ...
├── states/              # Redux state management
│   ├── HumanResourcesState/
│   │   ├── Action.js    # Action creators and async thunks
│   │   ├── ActionType.js # Action type constants
│   │   └── Reducer.js   # Reducer functions
│   └── ...
├── routes/              # Route configurations
├── services/            # API services and utilities
└── GlobalFunction/      # Global utilities and helpers
```

### Redux Pattern (IMPORTANT)
This project uses **traditional Redux** pattern, NOT Redux Toolkit slices:
- Action types are string constants in `ActionType.js`
- Actions are plain functions returning action objects
- Async operations use custom thunk functions with `dispatch`
- Reducers use switch statements
- State shape: `{ loading, data, error }` pattern

### API Configuration
- Base URL: Configured in `.env` as `VITE_BASE_URL`
- Authentication: JWT Bearer token from `tokenServices`
- All API calls require `Authorization` header

### Common Patterns
1. **Date Formatting**: Use `getFormatDate()` and `getDateInputValue()` from `GlobalFunction/FormatDate.js`
2. **Toasts**: Use `CustomToast()` for notifications (integrated with GlobalToastHandler)
3. **Modals**: Use `ModalComponent` wrapper or custom modals with Framer Motion
4. **Forms**: Use React Hook Form with custom input components from `ButtonsComponents/`
5. **Tables**: DataTable components with pagination, search, and filtering
6. **Breadcrumbs**: Standard pattern in page components using `Breadcrumb` component

### Key Modules
- **Human Resources (HRD)**: Employee management, hiring, payroll, DTR, leave management
- **Admission**: Student applications, enrollment, exam scheduling
- **Accounting**: COA, journal entries, financial reports, fee assessment
- **SRU**: Student records, sections, grade reports
- **Cashier**: Payment processing, transaction history
- **Academic**: Faculty loads, curriculum, subject scheduling
- **Purchasing**: Request forms, purchase orders, suppliers

### User Roles
The system supports multiple role-based access:
- Role 1: Admission
- Role 2: CFW (Center for Wellness)
- Role 3: Cashier
- Role 5: SRU (Student Records Unit)
- Role 6: Academic Staff
- Role 7-10: HR Department (various levels)
- Role 11: SAC (Student Affairs Coordinator)
- Role 12: Assistant Principal
- Role 13: Principal
- Role 14-15: Teacher
- Role 16: Student
- Role 17: Parent
- Role 18: Accounting
- Role 19: Purchasing

### Design System
- **Primary Color**: Green (#00c853, #00b0ff gradient)
- **Secondary Color**: Blue
- **Alert Colors**: Yellow (warnings), Red (errors), Green (success)
- **Typography**: Font bold for headers, regular for content
- **Spacing**: Consistent use of Tailwind spacing utilities
- **Shadows**: Use shadow-md, shadow-lg for elevation
- **Borders**: Rounded corners (rounded-lg, rounded-xl)

### Development Notes
- Build command: `npm run build`
- Dev server: `npm run dev`
- Always run build to verify changes before committing
- The project uses PowerShell on Windows


---

## 🏗️ Architecture & Code Structure Rules

### Backend Controller Standards (C# .NET)

**CRITICAL RULES:**

✅ **Do NOT create new DTOs for simple query parameters**  
✅ **Paginated table endpoints MUST accept raw query parameter signatures** instead of wrapping them in a request DTO  
✅ **Use GET method with query parameters** for data retrieval endpoints

**Correct Controller Signature Pattern:**

```csharp
[Authorize]
[HttpGet]
[Route("endpoint-name")]
public async Task<IActionResult> GetEndpointName(
    int page = 1, 
    int pageSize = 10, 
    string search = "", 
    string schoolYear = "",
    string status = ""
)
{
    try
    {
        var result = await _service.GetEndpointName(page, pageSize, search, schoolYear, status);
        return Ok(new
        {
            data = result.Data,
            totalRecords = result.TotalRecords
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"An error occurred: {ex.Message}");
    }
}
```

**Standard Response Format:**
```csharp
return Ok(new
{
    data = res.Data,           // Array of items
    totalRecords = res.TotalRecords  // Total count for pagination
});
```

### Frontend Redux/API Standards

**CRITICAL RULES:**

❌ **Do NOT use POST with JSON body for query parameters**  
✅ **Use GET with query string parameters** for paginated data fetching  
✅ **Match the backend controller signature exactly**

**Correct Frontend Redux Action Pattern:**

```javascript
export const fetchDataList = (page = 1, pageSize = 10, search = '', schoolYear = '', status = '') => async (dispatch) => {
    dispatch(fetchDataListRequest());
    try {
        const token = getToken();
        
        // ✅ Build query string parameters
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            search: search || '',
            schoolYear: schoolYear || '',
            status: status || ''
        });
        
        const url = `${baseUrl}/controller/endpoint-name?${params.toString()}`;
        
        const response = await fetch(url, {
            method: 'GET',  // ✅ Use GET, not POST
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // ✅ Check HTTP response status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        
        dispatch(fetchDataListSuccess(res));
        return { 
            ok: true, 
            data: res.data,                    // ✅ Access res.data
            totalRecords: res.totalRecords     // ✅ Access res.totalRecords
        };
    }
    catch (error) {
        dispatch(fetchDataListFailure(error.message));
        return { ok: false, error: error.message };
    }
};
```

**Incorrect Pattern to AVOID:**

```javascript
// ❌ WRONG: POST with JSON body for query params
export const fetchDataList = (filters) => async (dispatch) => {
    const response = await fetch(`${baseUrl}/endpoint`, {
        method: 'POST',                    // ❌ Should be GET
        body: JSON.stringify(filters)       // ❌ Should be query params
    });
};
```

### Response Handling Pattern

**Backend Response Structure:**
```json
{
    "data": [...],      // Array of items or single object
    "totalRecords": 123  // Total count for pagination
}
```

**Frontend Success Check:**
```javascript
// ✅ Check HTTP response status first (not res.ok from JSON)
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}

const res = await response.json();

// ✅ Access data and totalRecords directly
return { 
    ok: true,                      // Our own success flag
    data: res.data,                // Backend's data array
    totalRecords: res.totalRecords // Backend's total count
};
```

### DataTable Component Integration

**Standard Pattern for DataTables:**

```javascript
// Component state
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [search, setSearch] = useState('');
const [filters, setFilters] = useState({});

// Redux selector
const { loading, data, totalRecords } = useSelector((state) => state.module.dataListState);
const items = Array.isArray(data) ? data : [];

// Fetch on mount and filter changes
useEffect(() => {
    dispatch(fetchDataList(page, pageSize, search, filters.schoolYear, filters.status));
}, [page, pageSize, search, filters, dispatch]);

// DataTable props
<DataTable
    columns={columns}
    data={items}
    progressPending={loading}
    pagination
    paginationServer
    paginationTotalRows={totalRecords}
    paginationDefaultPage={page}
    onChangePage={(newPage) => setPage(newPage)}
    onChangeRowsPerPage={(newSize, page) => {
        setPageSize(newSize);
        setPage(page);
    }}
/>
```

### When to Use DTOs vs Query Params

**Use Query Parameters (GET):**
- ✅ Paginated list endpoints
- ✅ Search/filter operations
- ✅ Simple data retrieval
- ✅ Read operations with < 5 parameters

**Use Request DTOs (POST):**
- ✅ Create/Update operations
- ✅ Complex nested data structures
- ✅ File uploads
- ✅ Operations with > 5 parameters
- ✅ Operations with complex validation rules

---

## Important Reminders

1. **Always follow the GET + query params pattern** for datatable/list endpoints
2. **Never create DTOs for simple pagination queries**
3. **Always check `response.ok` (HTTP status) before parsing JSON**
4. **Backend always returns `{ data, totalRecords }` structure**
5. **Frontend should handle both camelCase and PascalCase** in responses
6. **All endpoints must include try-catch with 500 error handling**
7. **All API calls must include Authorization header with JWT token**

---
