import {
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST, FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST, FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE,
    FETCH_INSERT_HIRING_PROCESS_REQUEST, FETCH_INSERT_HIRING_PROCESS_SUCCESS, FETCH_INSERT_HIRING_PROCESS_FAILURE,
    FETCH_USER_ROLE_REQUEST, FETCH_USER_ROLE_SUCCESS, FETCH_USER_ROLE_FAILURE,
    FETCH_INSERT_TEMPLATE_TABLE_REQUEST, FETCH_INSERT_TEMPLATE_TABLE_SUCCESS, FETCH_INSERT_TEMPLATE_TABLE_FAILURE,
    FETCH_HR_TEMPLATE_REQUEST, FETCH_HR_TEMPLATE_SUCCESS, FETCH_HR_TEMPLATE_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_SCREENING_REQUEST, FETCH_EMPLOYEE_APPLICATION_SCREENING_SUCCESS, FETCH_EMPLOYEE_APPLICATION_SCREENING_FAILURE,
    FETCH_CRITERIA_TABLE_REQUEST, FETCH_CRITERIA_TABLE_SUCCESS, FETCH_CRITERIA_TABLE_FAILURE,
    FETCH_SAC_USER_REQUEST, FETCH_SAC_USER_SUCCESS, FETCH_SAC_USER_FAILURE,
    FETCH_AP_USER_REQUEST, FETCH_AP_USER_SUCCESS, FETCH_AP_USER_FAILURE,
    FETCH_PRINCIPAL_USER_REQUEST, FETCH_PRINCIPAL_USER_SUCCESS, FETCH_PRINCIPAL_USER_FAILURE,
    FETCH_UPDATE_EMPLOYEE_SCREENING_REQUEST, FETCH_UPDATE_EMPLOYEE_SCREENING_SUCCESS, FETCH_UPDATE_EMPLOYEE_SCREENING_FAILURE,
    FETCH_DEPARTMENT_TEMPLATE_REQUEST, FETCH_DEPARTMENT_TEMPLATE_SUCCESS, FETCH_DEPARTMENT_TEMPLATE_FAILURE,
    FETCH_POSITION_TEMPLATE_REQUEST, FETCH_POSITION_TEMPLATE_SUCCESS, FETCH_POSITION_TEMPLATE_FAILURE,
    FETCH_GOLDEN_RANK_TEMPLATE_REQUEST, FETCH_GOLDEN_RANK_TEMPLATE_SUCCESS, FETCH_GOLDEN_RANK_TEMPLATE_FAILURE,
    FETCH_INSERT_HIRED_EMPLOYEE_REQUEST, FETCH_INSERT_HIRED_EMPLOYEE_SUCCESS, FETCH_INSERT_HIRED_EMPLOYEE_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchEmployeeOnlineAppRequest = () => ({ type: FETCH_EMPLOYEE_ONLINE_APP_REQUEST });
export const fetchEmployeeOnlineAppSuccess = (data) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, payload: data });
export const fetchEmployeeOnlineAppFailure = (error) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_FAILURE, payload: error });

export const fetchEmployeeOnlineAppData = (startDate, endDate, userRoleId, status, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchEmployeeOnlineAppRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/employee-online-app?startDate=${startDate}&endDate=${endDate}&userRoleId=${userRoleId}&status=${status}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchEmployeeOnlineAppSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchEmployeeOnlineAppFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchEmployeeApplicationInfoRequest = () => ({ type: FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST });
export const fetchEmployeeApplicationInfoSuccess = (data) => ({ type: FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, payload: data });
export const fetchEmployeeApplicationInfoFailure = (error) => ({ type: FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE, payload: error });

export const fetchEmployeeApplicationInfoData = (employeeAppId) => async (dispatch) => {
    dispatch(fetchEmployeeApplicationInfoRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-employee-application-information?employeeAppId=${employeeAppId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        dispatch(fetchEmployeeApplicationInfoSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchEmployeeApplicationInfoFailure(error.message));
        return ({ ok: false, error })
    }
};


export const fetchInsertHiringProcessRequest = () => ({ type: FETCH_INSERT_HIRING_PROCESS_REQUEST });
export const fetchInsertHiringProcessSuccess = (data) => ({ type: FETCH_INSERT_HIRING_PROCESS_SUCCESS, payload: data });
export const fetchInsertHiringProcessFailure = (error) => ({ type: FETCH_INSERT_HIRING_PROCESS_FAILURE, payload: error });

export const fetchInsertHiringProcessData = (formData) => async (dispatch) => {
    dispatch(fetchInsertHiringProcessRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/insert-hiring-process`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertHiringProcessSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchInsertHiringProcessFailure(error.message));
        return ({ ok: false, error })
    }
};


export const fetchUserRoleRequest = () => ({ type: FETCH_USER_ROLE_REQUEST });
export const fetchUserRoleSuccess = (data) => ({ type: FETCH_USER_ROLE_SUCCESS, payload: data });
export const fetchUserRoleFailure = (error) => ({ type: FETCH_USER_ROLE_FAILURE, payload: error });

export const fetchUserRoleData = () => async (dispatch) => {
    dispatch(fetchUserRoleRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-user-role`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchUserRoleSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchUserRoleFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchInsertTemplateTableRequest = () => ({ type: FETCH_INSERT_TEMPLATE_TABLE_REQUEST });
export const fetchInsertTemplateTableSuccess = (data) => ({ type: FETCH_INSERT_TEMPLATE_TABLE_SUCCESS, payload: data });
export const fetchInsertTemplateTableFailure = (error) => ({ type: FETCH_INSERT_TEMPLATE_TABLE_FAILURE, payload: error });

export const fetchInsertTemplateTableData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTemplateTableRequest());
    try {
        const token = getToken();
        let url = "";
        switch (formData.TempId) {
            case 1:
                url = `${baseUrl}/hr/insert-criteria-table`;
                break;
            case 2:
                url = `${baseUrl}/hr/insert-department-table`;
                break;
            case 3:
                url = `${baseUrl}/hr/insert-position-table`;
                break;
            case 4:
                url = `${baseUrl}/hr/insert-golden-rank-table`;
                break;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertTemplateTableSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchInsertTemplateTableFailure(error.message));
        return ({ ok: false, error })
    }
};


export const fetchHrTemplateRequest = () => ({ type: FETCH_HR_TEMPLATE_REQUEST });
export const fetchHrTemplateSuccess = (data) => ({ type: FETCH_HR_TEMPLATE_SUCCESS, payload: data });
export const fetchHrTemplateFailure = (error) => ({ type: FETCH_HR_TEMPLATE_FAILURE, payload: error });

export const fetchHrTemplateData = (status, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchHrTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-hr-template?status=${status}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchHrTemplateSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchHrTemplateFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchEmployeeApplicationScreeningRequest = () => ({ type: FETCH_EMPLOYEE_APPLICATION_SCREENING_REQUEST });
export const fetchEmployeeApplicationScreeningSuccess = (data) => ({ type: FETCH_EMPLOYEE_APPLICATION_SCREENING_SUCCESS, payload: data });
export const fetchEmployeeApplicationScreeningFailure = (error) => ({ type: FETCH_EMPLOYEE_APPLICATION_SCREENING_FAILURE, payload: error });

export const fetchEmployeeApplicationScreeningData = (employeeAppId) => async (dispatch) => {
    dispatch(fetchEmployeeApplicationScreeningRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-employee-application-screening?employeeAppId=${employeeAppId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        dispatch(fetchEmployeeApplicationScreeningSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchEmployeeApplicationScreeningFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchCriteriaTableRequest = () => ({ type: FETCH_CRITERIA_TABLE_REQUEST });
export const fetchCriteriaTableSuccess = (data) => ({ type: FETCH_CRITERIA_TABLE_SUCCESS, payload: data });
export const fetchCriteriaTableFailure = (error) => ({ type: FETCH_CRITERIA_TABLE_FAILURE, payload: error });

export const fetchCriteriaTableData = (employeeAppId, page, pageSize) => async (dispatch) => {
    dispatch(fetchCriteriaTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-criteria-table?employeeAppId=${employeeAppId}&page=${page}&pageSize=${pageSize}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchCriteriaTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchCriteriaTableFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchSacUserRequest = () => ({ type: FETCH_SAC_USER_REQUEST });
export const fetchSacUserSuccess = (data) => ({ type: FETCH_SAC_USER_SUCCESS, payload: data });
export const fetchSacUserFailure = (error) => ({ type: FETCH_SAC_USER_FAILURE, payload: error });

export const fetchSacUserData = (userRoleId) => async (dispatch) => {
    dispatch(fetchSacUserRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-criteria-user?userRoleId=${userRoleId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchSacUserSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchSacUserFailure(error.message));
        return ({ ok: false, error })
    }
};


export const fetchApUserRequest = () => ({ type: FETCH_AP_USER_REQUEST });
export const fetchApUserSuccess = (data) => ({ type: FETCH_AP_USER_SUCCESS, payload: data });
export const fetchApUserFailure = (error) => ({ type: FETCH_AP_USER_FAILURE, payload: error });

export const fetchApUserData = (userRoleId) => async (dispatch) => {
    dispatch(fetchApUserRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-criteria-user?userRoleId=${userRoleId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchApUserSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchApUserFailure(error.message));
        return ({ ok: false, error })
    }
};


export const fetchPrincipalUserRequest = () => ({ type: FETCH_PRINCIPAL_USER_REQUEST });
export const fetchPrincipalUserSuccess = (data) => ({ type: FETCH_PRINCIPAL_USER_SUCCESS, payload: data });
export const fetchPrincipalUserFailure = (error) => ({ type: FETCH_PRINCIPAL_USER_FAILURE, payload: error });

export const fetchPrincipalUserData = (userRoleId) => async (dispatch) => {
    dispatch(fetchPrincipalUserRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-criteria-user?userRoleId=${userRoleId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchPrincipalUserSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchPrincipalUserFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchUpdateEmployeeScreeningRequest = () => ({ type: FETCH_UPDATE_EMPLOYEE_SCREENING_REQUEST });
export const fetchUpdateEmployeeScreeningSuccess = (data) => ({ type: FETCH_UPDATE_EMPLOYEE_SCREENING_SUCCESS, payload: data });
export const fetchUpdateEmployeeScreeningFailure = (error) => ({ type: FETCH_UPDATE_EMPLOYEE_SCREENING_FAILURE, payload: error });

export const fetchUpdateEmployeeScreeningData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateEmployeeScreeningRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/update-employee-screening`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchUpdateEmployeeScreeningSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchUpdateEmployeeScreeningFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchDepartmentTemplateRequest = () => ({ type: FETCH_DEPARTMENT_TEMPLATE_REQUEST });
export const fetchDepartmentTemplateSuccess = (data) => ({ type: FETCH_DEPARTMENT_TEMPLATE_SUCCESS, payload: data });
export const fetchDepartmentTemplateFailure = (error) => ({ type: FETCH_DEPARTMENT_TEMPLATE_FAILURE, payload: error });

export const fetchDepartmentTemplateData = () => async (dispatch) => {
    dispatch(fetchDepartmentTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-department-template`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchDepartmentTemplateSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchDepartmentTemplateFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchPositionTemplateRequest = () => ({ type: FETCH_POSITION_TEMPLATE_REQUEST });
export const fetchPositionTemplateSuccess = (data) => ({ type: FETCH_POSITION_TEMPLATE_SUCCESS, payload: data });
export const fetchPositionTemplateFailure = (error) => ({ type: FETCH_POSITION_TEMPLATE_FAILURE, payload: error });

export const fetchPositionTemplateData = () => async (dispatch) => {
    dispatch(fetchPositionTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-position-template`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchPositionTemplateSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchPositionTemplateFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchGoldenRankTemplateRequest = () => ({ type: FETCH_GOLDEN_RANK_TEMPLATE_REQUEST });
export const fetchGoldenRankTemplateSuccess = (data) => ({ type: FETCH_GOLDEN_RANK_TEMPLATE_SUCCESS, payload: data });
export const fetchGoldenRankTemplateFailure = (error) => ({ type: FETCH_GOLDEN_RANK_TEMPLATE_FAILURE, payload: error });

export const fetchGoldenRankTemplateData = () => async (dispatch) => {
    dispatch(fetchGoldenRankTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-golden-rank-template`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchGoldenRankTemplateSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchGoldenRankTemplateFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchInsertHiredEmployeeRequest = () => ({ type: FETCH_INSERT_HIRED_EMPLOYEE_REQUEST });
export const fetchInsertHiredEmployeeSuccess = (data) => ({ type: FETCH_INSERT_HIRED_EMPLOYEE_SUCCESS, payload: data });
export const fetchInsertHiredEmployeeFailure = (error) => ({ type: FETCH_INSERT_HIRED_EMPLOYEE_FAILURE, payload: error });

export const fetchInsertHiredEmployeeData = (formData) => async (dispatch) => {
    dispatch(fetchInsertHiredEmployeeRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/insert-hired-employee`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertHiredEmployeeSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchInsertHiredEmployeeFailure(error.message));
        return ({ ok: false, error })
    }
};

// export const fetchEmployeeFullScreeningRequest = () => ({ type: FETCH_EMPLOYEE_FULL_SCREENING_REQUEST });
// export const fetchEmployeeFullScreeningSuccess = (data) => ({ type: FETCH_EMPLOYEE_FULL_SCREENING_SUCCESS, payload: data });
// export const fetchEmployeeFullScreeningFailure = (error) => ({ type: FETCH_EMPLOYEE_FULL_SCREENING_FAILURE, payload: error });

// export const fetchEmployeeFullScreeningData = (employeeId,page, pageSize) => async (dispatch) => {
//     dispatch(fetchEmployeeFullScreeningRequest());
//     try {
//         const token = getToken();
//         const url = `${baseUrl}/hr/employee-full-screening?employeeId=${employeeId}&page=${page}&pageSize=${pageSize}`;

//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//         });

//         const res = await response.json();
//         dispatch(fetchEmployeeFullScreeningSuccess(res));
//         return ({ ok: true, data: res.data, totalRecords: res.totalRecords });
//     }
//     catch (error) {
//         dispatch(fetchEmployeeFullScreeningFailure(error.message));
//         return ({ ok: false, error })
//     }
// };

// ── Daily Time Record (DTR) ───────────────────────────────────────────────────
import {
    FETCH_DTR_LOGS_REQUEST, FETCH_DTR_LOGS_SUCCESS, FETCH_DTR_LOGS_FAILURE,
    POST_DTR_SCAN_REQUEST,  POST_DTR_SCAN_SUCCESS,  POST_DTR_SCAN_FAILURE,
    DTR_SCAN_RATE_LIMITED,
} from './ActionType';

export const fetchDtrLogsRequest = () => ({ type: FETCH_DTR_LOGS_REQUEST });
export const fetchDtrLogsSuccess = (data) => ({ type: FETCH_DTR_LOGS_SUCCESS, payload: data });
export const fetchDtrLogsFailure = (error) => ({ type: FETCH_DTR_LOGS_FAILURE, payload: error });

// fetchDtrLogs — paginated list of all DTR entries for the audit table
// Endpoint: POST /hr/get-dtr-logs
export const fetchDtrLogs = (page = 1, pageSize = 10, search = '', date = null) => async (dispatch) => {
    dispatch(fetchDtrLogsRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page:     page.toString(),
            pageSize: pageSize.toString(),
            search:   search ?? '',
        });
        if (date) params.append('date', date);

        const res = await fetch(`${baseUrl}/hr/get-dtr-logs?${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await res.json();
        dispatch(fetchDtrLogsSuccess(data));
        return { ok: true, data: data.data ?? data, totalRecords: data.totalRecords ?? 0 };
    } catch (err) {
        dispatch(fetchDtrLogsFailure(err.message));
        return { ok: false, err };
    }
};

export const postDtrScanRequest = () => ({ type: POST_DTR_SCAN_REQUEST });
export const postDtrScanSuccess = (data) => ({ type: POST_DTR_SCAN_SUCCESS, payload: data });
export const postDtrScanFailure = (error) => ({ type: POST_DTR_SCAN_FAILURE, payload: error });
export const dtrScanRateLimited = (payload) => ({ type: DTR_SCAN_RATE_LIMITED, payload });

// postBiometricScan — submit a face-scan event (TIME-IN or TIME-OUT)
// Endpoint: POST /hr/post-biometric-scan
// Body: { EmployeeId, ScanTime, ScanType }  — ScanType determined by backend open-shift logic
export const postBiometricScan = ({ employeeId, employeeNo, fullName, scanTime }) => async (dispatch) => {
    dispatch(postDtrScanRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/hr/post-biometric-scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                EmployeeId: employeeId,
                EmployeeNo: employeeNo,
                FullName:   fullName,
                ScanTime:   scanTime,
            }),
        });
        const data = await res.json();
        dispatch(postDtrScanSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(postDtrScanFailure(err.message));
        return { ok: false, err };
    }
};

// ── Notice of Filing of Leave ─────────────────────────────────────────────────
import {
    FETCH_LEAVE_FILINGS_REQUEST, FETCH_LEAVE_FILINGS_SUCCESS, FETCH_LEAVE_FILINGS_FAILURE,
    CREATE_LEAVE_FILING_REQUEST, CREATE_LEAVE_FILING_SUCCESS, CREATE_LEAVE_FILING_FAILURE,
    UPDATE_LEAVE_STATUS_REQUEST, UPDATE_LEAVE_STATUS_SUCCESS, UPDATE_LEAVE_STATUS_FAILURE,
} from './ActionType';

export const fetchLeaveFilingsRequest = () => ({ type: FETCH_LEAVE_FILINGS_REQUEST });
export const fetchLeaveFilingsSuccess = (data) => ({ type: FETCH_LEAVE_FILINGS_SUCCESS, payload: data });
export const fetchLeaveFilingsFailure = (error) => ({ type: FETCH_LEAVE_FILINGS_FAILURE, payload: error });

// fetchLeaveFilings — paginated, filterable leave filing list
// Endpoint: POST /hr/get-leave-filings
export const fetchLeaveFilings = (filters = {}) => async (dispatch) => {
    dispatch(fetchLeaveFilingsRequest());
    try {
        const token = getToken();
        const { page = 1, pageSize = 10, search = '', status = null, leaveType = null } = filters;
        const params = new URLSearchParams({ page, pageSize, search: search ?? '' });
        if (status)    params.append('status',    status);
        if (leaveType) params.append('leaveType', leaveType);

        const res = await fetch(`${baseUrl}/hr/get-leave-filings?${params}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        });
        const data = await res.json();
        dispatch(fetchLeaveFilingsSuccess(data));
        return { ok: true, data: data.data ?? data, totalRecords: data.totalRecords ?? 0 };
    } catch (err) {
        dispatch(fetchLeaveFilingsFailure(err.message));
        return { ok: false, err };
    }
};

export const createLeaveFilingRequest = () => ({ type: CREATE_LEAVE_FILING_REQUEST });
export const createLeaveFilingSuccess = (data) => ({ type: CREATE_LEAVE_FILING_SUCCESS, payload: data });
export const createLeaveFilingFailure = (error) => ({ type: CREATE_LEAVE_FILING_FAILURE, payload: error });

// submitLeaveFiling — create a new leave application
// Endpoint: POST /hr/submit-leave-filing
// Payload: { EmployeeId, LeaveType, StartDate, EndDate, TotalDays, Reason }
export const submitLeaveFiling = (payload) => async (dispatch) => {
    dispatch(createLeaveFilingRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/hr/submit-leave-filing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(createLeaveFilingSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(createLeaveFilingFailure(err.message));
        return { ok: false, err };
    }
};

export const updateLeaveStatusRequest = () => ({ type: UPDATE_LEAVE_STATUS_REQUEST });
export const updateLeaveStatusSuccess = (data) => ({ type: UPDATE_LEAVE_STATUS_SUCCESS, payload: data });
export const updateLeaveStatusFailure = (error) => ({ type: UPDATE_LEAVE_STATUS_FAILURE, payload: error });

// updateLeaveStatus — approve, reject, or cancel a leave application
// Endpoint: POST /hr/update-leave-status
// Payload: { LeaveId, Status, Remarks }
export const updateLeaveStatus = (leaveId, status, remarks = '') => async (dispatch) => {
    dispatch(updateLeaveStatusRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/hr/update-leave-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ LeaveId: leaveId, Status: status, Remarks: remarks }),
        });
        const data = await res.json();
        dispatch(updateLeaveStatusSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(updateLeaveStatusFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Employee Management Actions
// ============================================================================

export const fetchEmployeesRequest = () => ({ type: 'FETCH_EMPLOYEES_REQUEST' });
export const fetchEmployeesSuccess = (data) => ({ type: 'FETCH_EMPLOYEES_SUCCESS', payload: data });
export const fetchEmployeesFailure = (error) => ({ type: 'FETCH_EMPLOYEES_FAILURE', payload: error });

// fetchEmployeeList — paginated, filterable employee list
// Returns all employees with search, department filtering, and status filtering
// Endpoint: POST /hr/get-all-employees
export const fetchEmployeeList = (filters = {}) => async (dispatch) => {
    dispatch(fetchEmployeesRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/get-all-employees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                page: filters.page || 1,
                pageSize: filters.pageSize || 10,
                search: filters.search || '',
                departmentId: filters.departmentId || null,
                status: filters.status || null,
            }),
        });
        const data = await res.json();
        dispatch(fetchEmployeesSuccess(data));
        return { ok: true, data: data.data ?? data, totalRecords: data.totalRecords ?? 0 };
    } catch (err) {
        dispatch(fetchEmployeesFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Deductions Management Actions
// ============================================================================

// ── SSS Contribution Table ────────────────────────────────────────────────────
export const fetchSssTableRequest = () => ({ type: 'FETCH_SSS_TABLE_REQUEST' });
export const fetchSssTableSuccess = (data) => ({ type: 'FETCH_SSS_TABLE_SUCCESS', payload: data });
export const fetchSssTableFailure = (error) => ({ type: 'FETCH_SSS_TABLE_FAILURE', payload: error });

export const fetchSssTable = () => async (dispatch) => {
    dispatch(fetchSssTableRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/get-sss-table`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        dispatch(fetchSssTableSuccess(data));
        return { ok: true, data: data.data ?? data };
    } catch (err) {
        dispatch(fetchSssTableFailure(err.message));
        return { ok: false, err };
    }
};

export const updateSssTableRequest = () => ({ type: 'UPDATE_SSS_TABLE_REQUEST' });
export const updateSssTableSuccess = (data) => ({ type: 'UPDATE_SSS_TABLE_SUCCESS', payload: data });
export const updateSssTableFailure = (error) => ({ type: 'UPDATE_SSS_TABLE_FAILURE', payload: error });

export const updateSssTable = (payload) => async (dispatch) => {
    dispatch(updateSssTableRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/update-sss-table`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(updateSssTableSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(updateSssTableFailure(err.message));
        return { ok: false, err };
    }
};

// ── PhilHealth Premium Matrix ─────────────────────────────────────────────────
export const fetchPhilhealthTableRequest = () => ({ type: 'FETCH_PHILHEALTH_TABLE_REQUEST' });
export const fetchPhilhealthTableSuccess = (data) => ({ type: 'FETCH_PHILHEALTH_TABLE_SUCCESS', payload: data });
export const fetchPhilhealthTableFailure = (error) => ({ type: 'FETCH_PHILHEALTH_TABLE_FAILURE', payload: error });

export const fetchPhilhealthTable = () => async (dispatch) => {
    dispatch(fetchPhilhealthTableRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/get-philhealth-table`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        dispatch(fetchPhilhealthTableSuccess(data));
        return { ok: true, data: data.data ?? data };
    } catch (err) {
        dispatch(fetchPhilhealthTableFailure(err.message));
        return { ok: false, err };
    }
};

export const updatePhilhealthTableRequest = () => ({ type: 'UPDATE_PHILHEALTH_TABLE_REQUEST' });
export const updatePhilhealthTableSuccess = (data) => ({ type: 'UPDATE_PHILHEALTH_TABLE_SUCCESS', payload: data });
export const updatePhilhealthTableFailure = (error) => ({ type: 'UPDATE_PHILHEALTH_TABLE_FAILURE', payload: error });

export const updatePhilhealthTable = (payload) => async (dispatch) => {
    dispatch(updatePhilhealthTableRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/update-philhealth-table`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(updatePhilhealthTableSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(updatePhilhealthTableFailure(err.message));
        return { ok: false, err };
    }
};

// ── Pag-IBIG Contribution Table ───────────────────────────────────────────────
export const fetchPagibigTableRequest = () => ({ type: 'FETCH_PAGIBIG_TABLE_REQUEST' });
export const fetchPagibigTableSuccess = (data) => ({ type: 'FETCH_PAGIBIG_TABLE_SUCCESS', payload: data });
export const fetchPagibigTableFailure = (error) => ({ type: 'FETCH_PAGIBIG_TABLE_FAILURE', payload: error });

export const fetchPagibigTable = () => async (dispatch) => {
    dispatch(fetchPagibigTableRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/get-pagibig-table`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        dispatch(fetchPagibigTableSuccess(data));
        return { ok: true, data: data.data ?? data };
    } catch (err) {
        dispatch(fetchPagibigTableFailure(err.message));
        return { ok: false, err };
    }
};

export const updatePagibigTableRequest = () => ({ type: 'UPDATE_PAGIBIG_TABLE_REQUEST' });
export const updatePagibigTableSuccess = (data) => ({ type: 'UPDATE_PAGIBIG_TABLE_SUCCESS', payload: data });
export const updatePagibigTableFailure = (error) => ({ type: 'UPDATE_PAGIBIG_TABLE_FAILURE', payload: error });

export const updatePagibigTable = (payload) => async (dispatch) => {
    dispatch(updatePagibigTableRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/update-pagibig-table`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(updatePagibigTableSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(updatePagibigTableFailure(err.message));
        return { ok: false, err };
    }
};

// ── Employee Custom Deductions ────────────────────────────────────────────────
export const fetchEmployeeDeductionsRequest = () => ({ type: 'FETCH_EMPLOYEE_DEDUCTIONS_REQUEST' });
export const fetchEmployeeDeductionsSuccess = (data) => ({ type: 'FETCH_EMPLOYEE_DEDUCTIONS_SUCCESS', payload: data });
export const fetchEmployeeDeductionsFailure = (error) => ({ type: 'FETCH_EMPLOYEE_DEDUCTIONS_FAILURE', payload: error });

export const fetchEmployeeDeductions = (filters = {}) => async (dispatch) => {
    dispatch(fetchEmployeeDeductionsRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/get-employee-deductions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                page: filters.page || 1,
                pageSize: filters.pageSize || 10,
                search: filters.search || '',
                deductionType: filters.deductionType || null,
                status: filters.status || null,
            }),
        });
        const data = await res.json();
        dispatch(fetchEmployeeDeductionsSuccess(data));
        return { ok: true, data: data.data ?? data, totalRecords: data.totalRecords ?? 0 };
    } catch (err) {
        dispatch(fetchEmployeeDeductionsFailure(err.message));
        return { ok: false, err };
    }
};

export const createEmployeeDeductionRequest = () => ({ type: 'CREATE_EMPLOYEE_DEDUCTION_REQUEST' });
export const createEmployeeDeductionSuccess = (data) => ({ type: 'CREATE_EMPLOYEE_DEDUCTION_SUCCESS', payload: data });
export const createEmployeeDeductionFailure = (error) => ({ type: 'CREATE_EMPLOYEE_DEDUCTION_FAILURE', payload: error });

export const createEmployeeDeduction = (payload) => async (dispatch) => {
    dispatch(createEmployeeDeductionRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/create-employee-deduction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(createEmployeeDeductionSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(createEmployeeDeductionFailure(err.message));
        return { ok: false, err };
    }
};

export const updateEmployeeDeductionRequest = () => ({ type: 'UPDATE_EMPLOYEE_DEDUCTION_REQUEST' });
export const updateEmployeeDeductionSuccess = (data) => ({ type: 'UPDATE_EMPLOYEE_DEDUCTION_SUCCESS', payload: data });
export const updateEmployeeDeductionFailure = (error) => ({ type: 'UPDATE_EMPLOYEE_DEDUCTION_FAILURE', payload: error });

export const updateEmployeeDeduction = (payload) => async (dispatch) => {
    dispatch(updateEmployeeDeductionRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/update-employee-deduction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(updateEmployeeDeductionSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(updateEmployeeDeductionFailure(err.message));
        return { ok: false, err };
    }
};

export const deleteEmployeeDeductionRequest = () => ({ type: 'DELETE_EMPLOYEE_DEDUCTION_REQUEST' });
export const deleteEmployeeDeductionSuccess = (data) => ({ type: 'DELETE_EMPLOYEE_DEDUCTION_SUCCESS', payload: data });
export const deleteEmployeeDeductionFailure = (error) => ({ type: 'DELETE_EMPLOYEE_DEDUCTION_FAILURE', payload: error });

export const deleteEmployeeDeduction = (deductionId) => async (dispatch) => {
    dispatch(deleteEmployeeDeductionRequest());
    try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/hr/delete-employee-deduction/${deductionId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        dispatch(deleteEmployeeDeductionSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(deleteEmployeeDeductionFailure(err.message));
        return { ok: false, err };
    }
};
