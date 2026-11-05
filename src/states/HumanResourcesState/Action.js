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
    FETCH_PAYROLL_PERIODS_REQUEST, FETCH_PAYROLL_PERIODS_SUCCESS, FETCH_PAYROLL_PERIODS_FAILURE,
    FETCH_PAYROLL_PERIOD_DROPDOWN_REQUEST, FETCH_PAYROLL_PERIOD_DROPDOWN_SUCCESS, FETCH_PAYROLL_PERIOD_DROPDOWN_FAILURE,
    CREATE_PAYROLL_PERIOD_REQUEST, CREATE_PAYROLL_PERIOD_SUCCESS, CREATE_PAYROLL_PERIOD_FAILURE,
    UPDATE_PAYROLL_PERIOD_REQUEST, UPDATE_PAYROLL_PERIOD_SUCCESS, UPDATE_PAYROLL_PERIOD_FAILURE,
    DELETE_PAYROLL_PERIOD_REQUEST, DELETE_PAYROLL_PERIOD_SUCCESS, DELETE_PAYROLL_PERIOD_FAILURE,
    INSERT_PAYROLL_PERIOD_REQUEST, INSERT_PAYROLL_PERIOD_SUCCESS, INSERT_PAYROLL_PERIOD_FAILURE,
    CALCULATE_PAYROLL_REQUEST, CALCULATE_PAYROLL_SUCCESS, CALCULATE_PAYROLL_FAILURE,
    POST_JOURNAL_ENTRY_REQUEST, POST_JOURNAL_ENTRY_SUCCESS, POST_JOURNAL_ENTRY_FAILURE,
    FETCH_EMPLOYEE_RESUME_REQUEST, FETCH_EMPLOYEE_RESUME_SUCCESS, FETCH_EMPLOYEE_RESUME_FAILURE,
    CREATE_MANUAL_ATTENDANCE_REQUEST, CREATE_MANUAL_ATTENDANCE_SUCCESS, CREATE_MANUAL_ATTENDANCE_FAILURE,
    CREATE_MANUAL_LEAVE_REQUEST, CREATE_MANUAL_LEAVE_SUCCESS, CREATE_MANUAL_LEAVE_FAILURE,
    FETCH_ALL_EMPLOYEES_REQUEST, FETCH_ALL_EMPLOYEES_SUCCESS, FETCH_ALL_EMPLOYEES_FAILURE,
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
        const res = await fetch(`${baseUrl}/hr/get-all-employees`, {
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
        const res = await fetch(`${baseUrl}/hr/get-sss-table`, {
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
        const res = await fetch(`${baseUrl}/hr/update-sss-table`, {
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
        const res = await fetch(`${baseUrl}/hr/get-philhealth-table`, {
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
        const res = await fetch(`${baseUrl}/hr/update-philhealth-table`, {
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
        const res = await fetch(`${baseUrl}/hr/get-pagibig-table`, {
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
        const res = await fetch(`${baseUrl}/hr/update-pagibig-table`, {
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
        const res = await fetch(`${baseUrl}/hr/get-employee-deductions`, {
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
        const res = await fetch(`${baseUrl}/hr/create-employee-deduction`, {
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
        const res = await fetch(`${baseUrl}/hr/update-employee-deduction`, {
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
        const res = await fetch(`${baseUrl}/hr/delete-employee-deduction/${deductionId}`, {
            method: 'POST',
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

// ── Payroll Period Templates ──────────────────────────────────────────────────

// Fetch Payroll Periods (for Templates module table)
export const fetchPayrollPeriodsRequest = () => ({ type: 'FETCH_PAYROLL_PERIODS_REQUEST' });
export const fetchPayrollPeriodsSuccess = (data) => ({ type: 'FETCH_PAYROLL_PERIODS_SUCCESS', payload: data });
export const fetchPayrollPeriodsFailure = (error) => ({ type: 'FETCH_PAYROLL_PERIODS_FAILURE', payload: error });

export const fetchPayrollPeriodTemplates = (filters = {}) => async (dispatch) => {
    dispatch(fetchPayrollPeriodsRequest());
    try {
        const token = getToken();
        const { page = 1, pageSize = 10, search = '', activeStatus = '' } = filters;
        
        const url = `${baseUrl}/hr/get-payroll-periods`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ page, pageSize, search, activeStatus })
        });

        const res = await response.json();
        dispatch(fetchPayrollPeriodsSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    } catch (error) {
        dispatch(fetchPayrollPeriodsFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// Fetch Payroll Period Dropdown (for Payroll Processing dropdown - Active/Open only)
export const fetchPayrollPeriodDropdownRequest = () => ({ type: 'FETCH_PAYROLL_PERIOD_DROPDOWN_REQUEST' });
export const fetchPayrollPeriodDropdownSuccess = (data) => ({ type: 'FETCH_PAYROLL_PERIOD_DROPDOWN_SUCCESS', payload: data });
export const fetchPayrollPeriodDropdownFailure = (error) => ({ type: 'FETCH_PAYROLL_PERIOD_DROPDOWN_FAILURE', payload: error });

export const fetchPayrollPeriodDropdown = () => async (dispatch) => {
    dispatch(fetchPayrollPeriodDropdownRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-payroll-periods`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                pageSize: 100 
            })
        });

        const res = await response.json();
        dispatch(fetchPayrollPeriodDropdownSuccess(res));
        return { ok: true, data: res.data };
    } catch (error) {
        dispatch(fetchPayrollPeriodDropdownFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// Create Payroll Period
export const createPayrollPeriodRequest = () => ({ type: 'CREATE_PAYROLL_PERIOD_REQUEST' });
export const createPayrollPeriodSuccess = (data) => ({ type: 'CREATE_PAYROLL_PERIOD_SUCCESS', payload: data });
export const createPayrollPeriodFailure = (error) => ({ type: 'CREATE_PAYROLL_PERIOD_FAILURE', payload: error });

export const createPayrollPeriodTemplate = (payload) => async (dispatch) => {
    dispatch(createPayrollPeriodRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/create-payroll-period`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();
        dispatch(createPayrollPeriodSuccess(res));
        return { ok: true, data: res.data, message: res.message };
    } catch (error) {
        dispatch(createPayrollPeriodFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// Update Payroll Period
export const updatePayrollPeriodRequest = () => ({ type: 'UPDATE_PAYROLL_PERIOD_REQUEST' });
export const updatePayrollPeriodSuccess = (data) => ({ type: 'UPDATE_PAYROLL_PERIOD_SUCCESS', payload: data });
export const updatePayrollPeriodFailure = (error) => ({ type: 'UPDATE_PAYROLL_PERIOD_FAILURE', payload: error });

export const updatePayrollPeriodTemplate = (payload) => async (dispatch) => {
    dispatch(updatePayrollPeriodRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/update-payroll-period`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();
        dispatch(updatePayrollPeriodSuccess(res));
        return { ok: true, data: res.data, message: res.message };
    } catch (error) {
        dispatch(updatePayrollPeriodFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// Delete Payroll Period
export const deletePayrollPeriodRequest = () => ({ type: 'DELETE_PAYROLL_PERIOD_REQUEST' });
export const deletePayrollPeriodSuccess = (data) => ({ type: 'DELETE_PAYROLL_PERIOD_SUCCESS', payload: data });
export const deletePayrollPeriodFailure = (error) => ({ type: 'DELETE_PAYROLL_PERIOD_FAILURE', payload: error });

export const deletePayrollPeriodTemplate = (periodId) => async (dispatch) => {
    dispatch(deletePayrollPeriodRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/delete-payroll-period/${periodId}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();
        dispatch(deletePayrollPeriodSuccess(res));
        return { ok: true, data: res.data, message: res.message };
    } catch (error) {
        dispatch(deletePayrollPeriodFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// Insert Payroll Period (for Templates Module)
export const insertPayrollPeriodRequest = () => ({ type: 'INSERT_PAYROLL_PERIOD_REQUEST' });
export const insertPayrollPeriodSuccess = (data) => ({ type: 'INSERT_PAYROLL_PERIOD_SUCCESS', payload: data });
export const insertPayrollPeriodFailure = (error) => ({ type: 'INSERT_PAYROLL_PERIOD_FAILURE', payload: error });

export const insertPayrollPeriodData = (payload) => async (dispatch) => {
    dispatch(insertPayrollPeriodRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/insert-payroll-period-table`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();
        dispatch(insertPayrollPeriodSuccess(res));
        return { ok: true, data: res.data, message: res.message };
    } catch (error) {
        dispatch(insertPayrollPeriodFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ============================================================================
// Payroll Processing Actions
// ============================================================================

// Calculate Payroll
export const calculatePayrollRequest = () => ({ type: CALCULATE_PAYROLL_REQUEST });
export const calculatePayrollSuccess = (data) => ({ type: CALCULATE_PAYROLL_SUCCESS, payload: data });
export const calculatePayrollFailure = (error) => ({ type: CALCULATE_PAYROLL_FAILURE, payload: error });

export const calculatePayrollData = (payrollPeriodId) => async (dispatch) => {
    dispatch(calculatePayrollRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/calculate-payroll`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ payrollPeriodId })
        });

        const res = await response.json();
        dispatch(calculatePayrollSuccess(res));
        return { ok: true, data: res.data, message: res.message };
    } catch (error) {
        dispatch(calculatePayrollFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// Post to Journal Entry
export const postJournalEntryRequest = () => ({ type: POST_JOURNAL_ENTRY_REQUEST });
export const postJournalEntrySuccess = (data) => ({ type: POST_JOURNAL_ENTRY_SUCCESS, payload: data });
export const postJournalEntryFailure = (error) => ({ type: POST_JOURNAL_ENTRY_FAILURE, payload: error });

export const postJournalEntryData = (payrollPeriodId) => async (dispatch) => {
    dispatch(postJournalEntryRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/post-payroll-journal-entry`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ payrollPeriodId })
        });

        const res = await response.json();
        dispatch(postJournalEntrySuccess(res));
        return { ok: true, data: res.data, message: res.message };
    } catch (error) {
        dispatch(postJournalEntryFailure(error.message));
        return { ok: false, error: error.message };
    }
};


// ==================== Leave Credit Management Actions ====================

// Fetch Employee Leave Credits
export const fetchEmployeeLeaveCreditsRequest = () => ({ type: 'FETCH_EMPLOYEE_LEAVE_CREDITS_REQUEST' });
export const fetchEmployeeLeaveCreditsSuccess = (data) => ({ type: 'FETCH_EMPLOYEE_LEAVE_CREDITS_SUCCESS', payload: data });
export const fetchEmployeeLeaveCreditsFailure = (error) => ({ type: 'FETCH_EMPLOYEE_LEAVE_CREDITS_FAILURE', payload: error });

export const fetchEmployeeLeaveCredits = (filters = {}) => async (dispatch) => {
    dispatch(fetchEmployeeLeaveCreditsRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-employee-leave-credits`;
        
        const payload = {
            calendarId: filters.calendarId || null,
            department: filters.department || "",
            search: filters.search || "",
            page: filters.page || 1,
            pageSize: filters.pageSize || 10
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();
        
        dispatch(fetchEmployeeLeaveCreditsSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    } catch (error) {
        dispatch(fetchEmployeeLeaveCreditsFailure(error.message));
        return { ok: false, error };
    }
};

// Update Employee Leave Credits
export const updateEmployeeLeaveCreditsRequest = () => ({ type: 'UPDATE_EMPLOYEE_LEAVE_CREDITS_REQUEST' });
export const updateEmployeeLeaveCreditsSuccess = (data) => ({ type: 'UPDATE_EMPLOYEE_LEAVE_CREDITS_SUCCESS', payload: data });
export const updateEmployeeLeaveCreditsFailure = (error) => ({ type: 'UPDATE_EMPLOYEE_LEAVE_CREDITS_FAILURE', payload: error });

/**
 * Update employee leave credits
 * @param {Object} payload - Update payload
 * @param {number} payload.calendarId - School calendar ID
 * @param {number} payload.employeeId - Employee ID
 * @param {number} payload.leaveCreditMasterId - Master record ID
 * @param {Array} payload.details - Array of leave credit details
 * @param {number} payload.details[].leaveCreditChildId - Child record ID (optional for new)
 * @param {string} payload.details[].leaveType - Leave type (e.g., "Work Leave", "Medical Leave")
 * @param {number} payload.details[].allocatedDays - Total allocated days
 * @param {number} payload.details[].usedDays - Days already used
 * @param {string} payload.details[].activeStatus - Record status (e.g., "Active")
 */
export const updateEmployeeLeaveCredits = (payload) => async (dispatch) => {
    dispatch(updateEmployeeLeaveCreditsRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/update-employee-leave-credits`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();
        
        dispatch(updateEmployeeLeaveCreditsSuccess(res));
        return { ok: true, data: res.data, message: res.message };
    } catch (error) {
        dispatch(updateEmployeeLeaveCreditsFailure(error.message));
        return { ok: false, error };
    }
};

// Fetch School Calendar Dropdown
export const fetchSchoolCalendarDropdownRequest = () => ({ type: 'FETCH_SCHOOL_CALENDAR_DROPDOWN_REQUEST' });
export const fetchSchoolCalendarDropdownSuccess = (data) => ({ type: 'FETCH_SCHOOL_CALENDAR_DROPDOWN_SUCCESS', payload: data });
export const fetchSchoolCalendarDropdownFailure = (error) => ({ type: 'FETCH_SCHOOL_CALENDAR_DROPDOWN_FAILURE', payload: error });

export const fetchSchoolCalendarDropdown = () => async (dispatch) => {
    dispatch(fetchSchoolCalendarDropdownRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-school-calendars-dropdown`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();
        
        dispatch(fetchSchoolCalendarDropdownSuccess(res));
        return { ok: true, data: res.data };
    } catch (error) {
        dispatch(fetchSchoolCalendarDropdownFailure(error.message));
        return { ok: false, error };
    }
};

// Fetch Employee Resume
export const fetchEmployeeResumeRequest = () => ({ type: FETCH_EMPLOYEE_RESUME_REQUEST });
export const fetchEmployeeResumeSuccess = (data) => ({ type: FETCH_EMPLOYEE_RESUME_SUCCESS, payload: data });
export const fetchEmployeeResumeFailure = (error) => ({ type: FETCH_EMPLOYEE_RESUME_FAILURE, payload: error });

export const fetchEmployeeResume = (employeeId) => async (dispatch) => {
    dispatch(fetchEmployeeResumeRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/view-employee-resume/${employeeId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch resume');
        }

        // Get the blob from the response
        const blob = await response.blob();
        
        // Get content type from response headers
        const contentType = response.headers.get('content-type');
        
        // Create a blob URL and open it in a new tab
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        
        // Clean up the blob URL after a delay to ensure the window has opened
        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
        }, 100);

        dispatch(fetchEmployeeResumeSuccess({ employeeId, contentType }));
        return { ok: true, message: 'Resume opened successfully' };
    } catch (error) {
        dispatch(fetchEmployeeResumeFailure(error.message));
        return { ok: false, error: error.message };
    }
};


// ═══════════════════════════════════════════════════════════════════════════════
// MANUAL ATTENDANCE ENTRY
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// MANUAL ATTENDANCE ENTRY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create Manual Attendance Entry
 * Allows HR to manually add attendance records
 * 
 * @param {Object} payload - Manual attendance data
 * @param {string} payload.employeeId - Employee ID
 * @param {string} payload.attendanceDate - Date in YYYY-MM-DD format
 * @param {string} payload.timeIn - Time in HH:MM format
 * @param {string} payload.timeOut - Time in HH:MM format
 * @param {string} payload.remarks - Optional remarks
 * @param {string} payload.status - PRESENT, LATE, HALF_DAY, or OVERTIME
 */
export const createManualAttendanceRequest = () => ({ type: CREATE_MANUAL_ATTENDANCE_REQUEST });
export const createManualAttendanceSuccess = (data) => ({ type: CREATE_MANUAL_ATTENDANCE_SUCCESS, payload: data });
export const createManualAttendanceFailure = (error) => ({ type: CREATE_MANUAL_ATTENDANCE_FAILURE, payload: error });

export const createManualAttendance = (payload) => async (dispatch) => {
    dispatch(createManualAttendanceRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/create-manual-attendance`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.success) {
            dispatch(createManualAttendanceSuccess(res));
            return { ok: true, data: res.data };
        } else {
            dispatch(createManualAttendanceFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(createManualAttendanceFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MANUAL LEAVE FILING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create Manual Leave Filing
 * Allows HR to manually file leave applications for employees
 * 
 * @param {Object} payload - Manual leave data
 * @param {string} payload.employeeId - Employee ID
 * @param {string} payload.leaveTypeId - Leave type identifier
 * @param {string} payload.startDate - Start date in YYYY-MM-DD format
 * @param {string} payload.endDate - End date in YYYY-MM-DD format
 * @param {number} payload.totalDays - Total number of leave days
 * @param {string} payload.reason - Reason for leave
 * @param {string} payload.status - PENDING, APPROVED, or REJECTED
 */
export const createManualLeaveRequest = () => ({ type: CREATE_MANUAL_LEAVE_REQUEST });
export const createManualLeaveSuccess = (data) => ({ type: CREATE_MANUAL_LEAVE_SUCCESS, payload: data });
export const createManualLeaveFailure = (error) => ({ type: CREATE_MANUAL_LEAVE_FAILURE, payload: error });

export const createManualLeave = (payload) => async (dispatch) => {
    dispatch(createManualLeaveRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/file-leave-application`;  // Updated to match backend endpoint

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.success || res.ok) {
            dispatch(createManualLeaveSuccess(res));
            return { ok: true, data: res.data };
        } else {
            dispatch(createManualLeaveFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(createManualLeaveFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FETCH ALL EMPLOYEES (for dropdown selections)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all employees for dropdown/search selections
 * Returns simplified list with EmployeeId, EmployeeNumber, and Fullname
 */
export const fetchAllEmployeesRequest = () => ({ type: FETCH_ALL_EMPLOYEES_REQUEST });
export const fetchAllEmployeesSuccess = (data) => ({ type: FETCH_ALL_EMPLOYEES_SUCCESS, payload: data });
export const fetchAllEmployeesFailure = (error) => ({ type: FETCH_ALL_EMPLOYEES_FAILURE, payload: error });

export const fetchAllEmployees = () => async (dispatch) => {
    dispatch(fetchAllEmployeesRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-all-employees-simple`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        dispatch(fetchAllEmployeesSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchAllEmployeesFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FETCH EMPLOYEE LEAVE BALANCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch Employee Leave Balance
 * Gets employee's leave credits with available types and remaining days
 * 
 * @param {number} employeeId - Employee ID
 * @param {number} calendarId - Calendar/School Year ID
 */
export const fetchEmployeeLeaveBalance = (employeeId, calendarId) => async (dispatch) => {
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-employee-leave-balance?employeeId=${employeeId}&calendarId=${calendarId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();
        return { ok: res.ok || true, data: res.data };
    }
    catch (error) {
        console.error('Failed to fetch employee leave balance:', error);
        return { ok: false, error: error.message };
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED EMPLOYEE SEARCH (for datatables and dropdowns)
// ═══════════════════════════════════════════════════════════════════════════════

import {
    SEARCH_EMPLOYEES_REQUEST,
    SEARCH_EMPLOYEES_SUCCESS,
    SEARCH_EMPLOYEES_FAILURE,
    FETCH_LEAVE_APPLICATIONS_REQUEST,
    FETCH_LEAVE_APPLICATIONS_SUCCESS,
    FETCH_LEAVE_APPLICATIONS_FAILURE,
    FETCH_DTR_RECORDS_REQUEST,
    FETCH_DTR_RECORDS_SUCCESS,
    FETCH_DTR_RECORDS_FAILURE,
    FETCH_EMPLOYEE_LEAVE_BALANCE_REQUEST,
    FETCH_EMPLOYEE_LEAVE_BALANCE_SUCCESS,
    FETCH_EMPLOYEE_LEAVE_BALANCE_FAILURE,
} from "./ActionType";

/**
 * Unified Employee Search
 * Used by both datatables and dropdowns for consistent employee searching
 * 
 * Backend: POST /api/hr/get-all-employees
 * DTO: GetAllEmployeesRequestDto { page, pageSize, search, departmentId, status }
 * Response: { ok, data: EmployeeListDto[], totalRecords, message }
 */
export const searchEmployeesRequest = () => ({ type: SEARCH_EMPLOYEES_REQUEST });
export const searchEmployeesSuccess = (data) => ({ type: SEARCH_EMPLOYEES_SUCCESS, payload: data });
export const searchEmployeesFailure = (error) => ({ type: SEARCH_EMPLOYEES_FAILURE, payload: error });

export const searchEmployees = (filters = {}) => async (dispatch) => {
    dispatch(searchEmployeesRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-all-employees`;

        const payload = {
            page: filters.page || 1,
            pageSize: filters.pageSize || 10,
            search: filters.search || "",
            departmentId: filters.departmentId || null,
            status: filters.status || null,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.ok) {
            dispatch(searchEmployeesSuccess(res));
            return { ok: true, data: res.data, totalRecords: res.totalRecords };
        } else {
            dispatch(searchEmployeesFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(searchEmployeesFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEAVE APPLICATIONS DATATABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch Leave Applications for Datatable
 * Supports filtering by employee, status, date range, and search
 * 
 * Backend: POST /api/hr/get-leave-applications
 * DTO: GetLeaveApplicationsRequestDto { employeeId?, applicationStatus?, startDate?, endDate?, page, pageSize, search? }
 * Response: Paginated leave applications with employee details
 */
export const fetchLeaveApplicationsRequest = () => ({ type: FETCH_LEAVE_APPLICATIONS_REQUEST });
export const fetchLeaveApplicationsSuccess = (data) => ({ type: FETCH_LEAVE_APPLICATIONS_SUCCESS, payload: data });
export const fetchLeaveApplicationsFailure = (error) => ({ type: FETCH_LEAVE_APPLICATIONS_FAILURE, payload: error });

export const fetchLeaveApplications = (filters = {}) => async (dispatch) => {
    dispatch(fetchLeaveApplicationsRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-leave-applications`;

        const payload = {
            employeeId: filters.employeeId || null,
            applicationStatus: filters.applicationStatus || null,
            startDate: filters.startDate || null,
            endDate: filters.endDate || null,
            page: filters.page || 1,
            pageSize: filters.pageSize || 20,
            search: filters.search || "",
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.ok) {
            dispatch(fetchLeaveApplicationsSuccess(res));
            return { ok: true, data: res.data, totalRecords: res.totalRecords };
        } else {
            dispatch(fetchLeaveApplicationsFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(fetchLeaveApplicationsFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DTR RECORDS DATATABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch DTR Records for Datatable
 * Supports filtering by employee and date range
 * 
 * Backend: GET /api/hr/get-employee-dtr
 * Query Params: { employeeId?, startDate?, endDate?, page, pageSize }
 * Response: Paginated DTR records with employee details
 */
export const fetchDtrRecordsRequest = () => ({ type: FETCH_DTR_RECORDS_REQUEST });
export const fetchDtrRecordsSuccess = (data) => ({ type: FETCH_DTR_RECORDS_SUCCESS, payload: data });
export const fetchDtrRecordsFailure = (error) => ({ type: FETCH_DTR_RECORDS_FAILURE, payload: error });

export const fetchDtrRecords = (filters = {}) => async (dispatch) => {
    dispatch(fetchDtrRecordsRequest());
    try {
        const token = getToken();
        
        // Build query params for GET request
        const params = new URLSearchParams();
        if (filters.employeeId) params.append('employeeId', filters.employeeId);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        params.append('page', filters.page || 1);
        params.append('pageSize', filters.pageSize || 50);

        const url = `${baseUrl}/hr/get-employee-dtr?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        if (res.ok) {
            dispatch(fetchDtrRecordsSuccess(res));
            return { ok: true, data: res.data, totalRecords: res.totalRecords };
        } else {
            dispatch(fetchDtrRecordsFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(fetchDtrRecordsFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEE LEAVE BALANCE (enhanced version with action types)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch Employee Leave Balance with Redux Actions
 * Gets employee's leave credits with available types and remaining days
 * 
 * Backend: GET /api/hr/employee-leave-balance/{employeeId}/{calendarId}
 * Response: EmployeeLeaveBalanceDetailDto with leave type breakdown
 */
export const fetchEmployeeLeaveBalanceRequest = () => ({ type: FETCH_EMPLOYEE_LEAVE_BALANCE_REQUEST });
export const fetchEmployeeLeaveBalanceSuccess = (data) => ({ type: FETCH_EMPLOYEE_LEAVE_BALANCE_SUCCESS, payload: data });
export const fetchEmployeeLeaveBalanceFailure = (error) => ({ type: FETCH_EMPLOYEE_LEAVE_BALANCE_FAILURE, payload: error });

export const fetchEmployeeLeaveBalanceWithActions = (employeeId, calendarId) => async (dispatch) => {
    dispatch(fetchEmployeeLeaveBalanceRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/employee-leave-balance/${employeeId}/${calendarId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        if (res.ok) {
            dispatch(fetchEmployeeLeaveBalanceSuccess(res));
            return { ok: true, data: res.data };
        } else {
            dispatch(fetchEmployeeLeaveBalanceFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(fetchEmployeeLeaveBalanceFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// PAYROLL PROCESSING MODULE
// ══════════════════════════════════════════════════════════════════════════════

import {
    CALCULATE_PAYROLL_FOR_PERIOD_REQUEST,
    CALCULATE_PAYROLL_FOR_PERIOD_SUCCESS,
    CALCULATE_PAYROLL_FOR_PERIOD_FAILURE,
    FETCH_PAYROLL_DETAILS_REQUEST,
    FETCH_PAYROLL_DETAILS_SUCCESS,
    FETCH_PAYROLL_DETAILS_FAILURE,
    FINALIZE_PAYROLL_REQUEST,
    FINALIZE_PAYROLL_SUCCESS,
    FINALIZE_PAYROLL_FAILURE,
    POST_PAYROLL_TO_JOURNAL_REQUEST,
    POST_PAYROLL_TO_JOURNAL_SUCCESS,
    POST_PAYROLL_TO_JOURNAL_FAILURE,
    FETCH_PAYROLL_JOURNAL_ENTRY_REQUEST,
    FETCH_PAYROLL_JOURNAL_ENTRY_SUCCESS,
    FETCH_PAYROLL_JOURNAL_ENTRY_FAILURE,
} from "./ActionType";

/**
 * Calculate Payroll for a Specific Period
 * Processes payroll calculations for all or selected employees
 * 
 * Backend: POST /api/hr/calculate-payroll
 * DTO: PayrollCalculationRequestDto { periodId, calendarId?, employeeIds? }
 * Response: { ok, message, data: { payrollMasterId } }
 */
export const calculatePayrollForPeriodRequest = () => ({ type: CALCULATE_PAYROLL_FOR_PERIOD_REQUEST });
export const calculatePayrollForPeriodSuccess = (data) => ({ type: CALCULATE_PAYROLL_FOR_PERIOD_SUCCESS, payload: data });
export const calculatePayrollForPeriodFailure = (error) => ({ type: CALCULATE_PAYROLL_FOR_PERIOD_FAILURE, payload: error });

export const calculatePayrollForPeriod = (payrollData) => async (dispatch) => {
    dispatch(calculatePayrollForPeriodRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/calculate-payroll`;

        const payload = {
            periodId: payrollData.periodId,
            calendarId: payrollData.calendarId || null,
            employeeIds: payrollData.employeeIds || null
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.ok) {
            dispatch(calculatePayrollForPeriodSuccess(res));
            return { ok: true, message: res.message, data: res.data };
        } else {
            dispatch(calculatePayrollForPeriodFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(calculatePayrollForPeriodFailure(error.message));
        return { ok: false, error: error.message };
    }
};

/**
 * Fetch Payroll Details for a Specific Period
 * Gets payroll summary and line items with pagination
 * 
 * Backend: GET /api/hr/get-payroll-details
 * Query Params: { periodId, page?, pageSize?, search? }
 * Response: PayrollResponseDto { summary, lineItems[] }
 */
export const fetchPayrollDetailsRequest = () => ({ type: FETCH_PAYROLL_DETAILS_REQUEST });
export const fetchPayrollDetailsSuccess = (data) => ({ type: FETCH_PAYROLL_DETAILS_SUCCESS, payload: data });
export const fetchPayrollDetailsFailure = (error) => ({ type: FETCH_PAYROLL_DETAILS_FAILURE, payload: error });

export const fetchPayrollDetails = (filters = {}) => async (dispatch) => {
    dispatch(fetchPayrollDetailsRequest());
    try {
        const token = getToken();

        const params = new URLSearchParams();
        params.append('periodId', filters.periodId);
        params.append('page', filters.page || 1);
        params.append('pageSize', filters.pageSize || 50);
        if (filters.search) params.append('search', filters.search);

        const url = `${baseUrl}/hr/get-payroll-details?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        if (res.ok) {
            dispatch(fetchPayrollDetailsSuccess(res));
            return { ok: true, data: res.data };
        } else {
            dispatch(fetchPayrollDetailsFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(fetchPayrollDetailsFailure(error.message));
        return { ok: false, error: error.message };
    }
};

/**
 * Finalize Payroll
 * Locks the payroll from further edits
 * 
 * Backend: POST /api/hr/finalize-payroll
 * DTO: FinalizePayrollRequestDto { periodId }
 * Response: { ok, message }
 */
export const finalizePayrollRequest = () => ({ type: FINALIZE_PAYROLL_REQUEST });
export const finalizePayrollSuccess = (data) => ({ type: FINALIZE_PAYROLL_SUCCESS, payload: data });
export const finalizePayrollFailure = (error) => ({ type: FINALIZE_PAYROLL_FAILURE, payload: error });

export const finalizePayroll = (periodId) => async (dispatch) => {
    dispatch(finalizePayrollRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/finalize-payroll`;

        const payload = { periodId };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.ok) {
            dispatch(finalizePayrollSuccess(res));
            return { ok: true, message: res.message };
        } else {
            dispatch(finalizePayrollFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(finalizePayrollFailure(error.message));
        return { ok: false, error: error.message };
    }
};

/**
 * Post Payroll to Journal Entry
 * Creates double-entry bookkeeping records in the accounting system
 * 
 * Backend: POST /api/hr/post-payroll-to-journal
 * DTO: PostPayrollToJournalRequestDto { periodId, calendarId, description?, accountMapping }
 * Response: { ok, message, data: { journalId } }
 */
export const postPayrollToJournalRequest = () => ({ type: POST_PAYROLL_TO_JOURNAL_REQUEST });
export const postPayrollToJournalSuccess = (data) => ({ type: POST_PAYROLL_TO_JOURNAL_SUCCESS, payload: data });
export const postPayrollToJournalFailure = (error) => ({ type: POST_PAYROLL_TO_JOURNAL_FAILURE, payload: error });

export const postPayrollToJournal = (journalData) => async (dispatch) => {
    dispatch(postPayrollToJournalRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/post-payroll-to-journal`;

        const payload = {
            periodId: journalData.periodId,
            calendarId: journalData.calendarId,
            description: journalData.description || null,
            accountMapping: journalData.accountMapping || {}
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.ok) {
            dispatch(postPayrollToJournalSuccess(res));
            return { ok: true, message: res.message, data: res.data };
        } else {
            dispatch(postPayrollToJournalFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(postPayrollToJournalFailure(error.message));
        return { ok: false, error: error.message };
    }
};

/**
 * Fetch Payroll Journal Entry
 * Gets the journal entry details for a posted payroll
 * 
 * Backend: GET /api/hr/get-payroll-journal-entry
 * Query Params: { periodId }
 * Response: PayrollJournalResponseDto { journalId, periodId, journalLines[], totalDebit, totalCredit }
 */
export const fetchPayrollJournalEntryRequest = () => ({ type: FETCH_PAYROLL_JOURNAL_ENTRY_REQUEST });
export const fetchPayrollJournalEntrySuccess = (data) => ({ type: FETCH_PAYROLL_JOURNAL_ENTRY_SUCCESS, payload: data });
export const fetchPayrollJournalEntryFailure = (error) => ({ type: FETCH_PAYROLL_JOURNAL_ENTRY_FAILURE, payload: error });

export const fetchPayrollJournalEntry = (periodId) => async (dispatch) => {
    dispatch(fetchPayrollJournalEntryRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-payroll-journal-entry?periodId=${periodId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        if (res.ok) {
            dispatch(fetchPayrollJournalEntrySuccess(res));
            return { ok: true, data: res.data };
        } else {
            dispatch(fetchPayrollJournalEntryFailure(res.message));
            return { ok: false, error: res.message };
        }
    }
    catch (error) {
        dispatch(fetchPayrollJournalEntryFailure(error.message));
        return { ok: false, error: error.message };
    }
};
