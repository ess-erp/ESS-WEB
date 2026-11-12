---
inclusion: always
---

# ESS-WEB Code Patterns & Conventions

This file is auto-loaded by Kiro every session. It documents the exact patterns used
across this React/Redux project so they are applied consistently every time.

---

## Project Stack

- **Frontend:** React 18 + Vite, Tailwind CSS, Framer Motion
- **State:** Redux Thunk (`react-redux`)
- **Tables:** `react-data-table-component`
- **Icons:** `lucide-react`
- **Forms:** `react-hook-form`
- **Backend:** .NET Web API (C#), EF Core
- **Auth:** JWT stored via `getToken()` helper

---

## 1. Redux Action Pattern

### 1a. GET / Fetch (paginated datatable)

Parameters are **positional** — no DTO wrapper objects.
URL built with a template literal.

```js
export const fetchXyzRequest = () => ({ type: FETCH_XYZ_REQUEST });
export const fetchXyzSuccess = (data) => ({ type: FETCH_XYZ_SUCCESS, payload: data });
export const fetchXyzFailure = (error) => ({ type: FETCH_XYZ_FAILURE, payload: error });

export const fetchXyz = (page = 1, pageSize = 10, search = '') => async (dispatch) => {
    dispatch(fetchXyzRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-xyz?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(fetchXyzSuccess(res));
        return { ok: true, data: res.data };
    } catch (error) {
        dispatch(fetchXyzFailure(error.message));
        return { ok: false, error: error.message };
    }
};
```

### 1b. POST with body (create / update / save data)

```js
export const createXyzRequest = () => ({ type: CREATE_XYZ_REQUEST });
export const createXyzSuccess = (data) => ({ type: CREATE_XYZ_SUCCESS, payload: data });
export const createXyzFailure = (error) => ({ type: CREATE_XYZ_FAILURE, payload: error });

export const createXyz = (payload) => async (dispatch) => {
    dispatch(createXyzRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/create-xyz`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(createXyzSuccess(res));
        return { ok: true, data: res.data, message: res.message };
    } catch (error) {
        dispatch(createXyzFailure(error.message));
        return { ok: false, error: error.message };
    }
};
```

### 1c. POST with query param only (trigger / calculate — NO body)

When the action only needs an ID to trigger backend logic and sends **no body**,
pass the ID as a **query parameter** directly on the URL.

```js
export const calculateXyzRequest = () => ({ type: CALCULATE_XYZ_REQUEST });
export const calculateXyzSuccess = (data) => ({ type: CALCULATE_XYZ_SUCCESS, payload: data });
export const calculateXyzFailure = (error) => ({ type: CALCULATE_XYZ_FAILURE, payload: error });

export const calculateXyz = (periodId) => async (dispatch) => {
    dispatch(calculateXyzRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/calculate-xyz?periodId=${periodId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
            // ← NO body. ID lives in the URL.
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(calculateXyzSuccess(res));
        return { ok: true, message: res.message, data: res.data };
    } catch (error) {
        dispatch(calculateXyzFailure(error.message));
        return { ok: false, error: error.message };
    }
};
```

**Real example:** `calculatePayrollForPeriod(periodId)`
```js
const url = `${baseUrl}/hr/calculate-payroll?periodId=${periodId}`;
// method: 'POST', no body
```

### 1d. POST by route param (delete / status change)

```js
export const deleteXyz = (id) => async (dispatch) => {
    dispatch(deleteXyzRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/hr/delete-xyz/${id}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        dispatch(deleteXyzSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(deleteXyzFailure(err.message));
        return { ok: false, error: err.message };
    }
};
```

---

## 2. Action Return Convention

Every action **always** returns `{ ok: boolean, ... }` so components can branch on result:

```js
// Success path
return { ok: true, data: res.data, message: res.message };

// Failure path
return { ok: false, error: error.message };
```

---

## 3. Reducer Pattern

### 3a. State shape in initialGeneralState

```js
// List/datatable state
xyzState: { loading: false, data: [], error: '', totalRecords: 0 },

// Single-record / mutation state
createXyzState: { loading: false, data: null, error: '' },
updateXyzState: { loading: false, data: null, error: '' },
deleteXyzState: { loading: false, data: null, error: '' },
```

### 3b. Reducer cases

```js
case FETCH_XYZ_REQUEST:
    return { ...state, xyzState: { loading: true, data: [], error: '', totalRecords: 0 } };
case FETCH_XYZ_SUCCESS:
    return {
        ...state,
        xyzState: {
            loading: false,
            data: action.payload.data || [],
            error: '',
            totalRecords: action.payload.totalCount ?? action.payload.totalRecords ?? 0
        }
    };
case FETCH_XYZ_FAILURE:
    return { ...state, xyzState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };
```

### 3c. Paginated API response extraction

Backend returns:
```json
{ "data": [...], "totalCount": 10, "page": 1, "pageSize": 10, "totalPages": 1 }
```

The reducer maps `totalCount` → `totalRecords`. Components then read:
```js
const { loading, data, totalRecords } = useSelector(s => s.hr.xyzState);
const displayData = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
```

---

## 4. Component Pattern (Page)

```jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchXyz, createXyz } from '../../states/HumanResourcesState/Action';

const MyPage = () => {
    const dispatch = useDispatch();

    // ── Redux state ──────────────────────────────────────────────────────────
    const {
        xyzState       = { loading: false, data: [], error: '', totalRecords: 0 },
        createXyzState = { loading: false, data: null, error: '' },
    } = useSelector(state => state.hr || {});

    // ── Pagination / search local state ──────────────────────────────────────
    const [page, setPage]       = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch]   = useState('');

    // ── On mount ─────────────────────────────────────────────────────────────
    useEffect(() => {
        document.title = 'Page Title | Module';
    }, []);

    // ── Fetch on pagination / search change ──────────────────────────────────
    const fetchData = useCallback(() => {
        dispatch(fetchXyz(page, pageSize, search));
    }, [page, pageSize, search, dispatch]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Handler ───────────────────────────────────────────────────────────────
    const handleSave = async (payload) => {
        const result = await dispatch(createXyz(payload));
        if (result.ok) {
            // success
            fetchData();
        } else {
            // error
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <Breadcrumb items={[...]} />
            {/* content */}
        </div>
    );
};

export default MyPage;
```

---

## 5. DataTable Pattern (paginated, server-side)

```jsx
<DataTable
    columns={columns}
    data={displayData}
    progressPending={loading}
    pagination
    paginationServer
    paginationTotalRows={totalRecords ?? 0}
    paginationDefaultPage={page}
    onChangePage={(newPage) => setPage(newPage)}
    onChangeRowsPerPage={(newSize, newPage) => { setPageSize(newSize); setPage(newPage); }}
    noDataComponent={<div className="py-8 text-center text-gray-500">No records found</div>}
/>
```

---

## 6. Currency Formatting

Always use this helper, never inline `toLocaleString` directly:

```js
const currency = (val = 0) =>
    `₱${Number(val).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
```

---

## 7. Breadcrumb Pattern

```jsx
<Breadcrumb items={[
    { label: 'Human Resources', href: '/hrd/dashboard' },
    { label: 'Page Name',       href: '/hrd/page-route' }
]} />
```

---

## 8. URL Conventions

| Operation                        | Method | URL shape                                     | Body       |
|----------------------------------|--------|-----------------------------------------------|------------|
| Fetch list (paginated)           | GET    | `/hr/get-xyz?page=&pageSize=&search=`         | none       |
| Fetch single by ID               | GET    | `/hr/get-xyz/{id}` or `?id=`                  | none       |
| Create / save with data          | POST   | `/hr/create-xyz`                              | JSON body  |
| Update with data                 | POST   | `/hr/update-xyz`                              | JSON body  |
| Trigger / calculate (ID only)    | POST   | `/hr/action-xyz?periodId=` (no body)          | **none**   |
| Delete / status change (ID only) | POST   | `/hr/delete-xyz/{id}` (no body)               | none       |

**Key rule:** If a POST only needs one ID and is not saving any data, put the ID in the
**query string** and send **no body**. Example: `calculate-payroll?periodId=1`.

---

## 9. ActionType Naming Convention

```
FETCH_<ENTITY>_REQUEST / SUCCESS / FAILURE   → read operations
CREATE_<ENTITY>_REQUEST / SUCCESS / FAILURE  → insert
UPDATE_<ENTITY>_REQUEST / SUCCESS / FAILURE  → update
DELETE_<ENTITY>_REQUEST / SUCCESS / FAILURE  → delete
CALCULATE_<ENTITY>_REQUEST / SUCCESS / FAILURE → trigger/compute
```

Inline string action types (not in ActionType.js) use the same naming but as string literals,
prefixed with `'NEW_'` only when an existing constant already occupies the same name.

---

## 10. File Structure

```
src/
  pages/
    HumanResources/        ← Page components (.jsx)
  components/
    HrComponents/          ← Reusable HR components (.jsx)
    SharedComponents/      ← Sidebar, Breadcrumb, etc.
    ButtonsComponents/     ← Reusable UI atoms
  states/
    HumanResourcesState/
      Action.js            ← All thunks
      ActionType.js        ← All action type constants
      Reducer.js           ← Switch reducer + initialGeneralState
  routes/
    AppRoutes.jsx          ← All routes with role guards
```
