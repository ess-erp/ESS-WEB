// ══════════════════════════════════════════════════════════════════════════════
// HUMAN RESOURCES STATE - ACTION CREATORS
// ══════════════════════════════════════════════════════════════════════════════
// REFACTORED: 2026-08-25
// - Consolidated all action type imports into a single block
// - Reordered actions: FETCH/GET actions first, then CREATE/UPDATE/DELETE mutations
// - Converted table-fetching actions to use positional parameters (no DTO wrappers)
// ══════════════════════════════════════════════════════════════════════════════

// ── Action Type Imports (Consolidated) ────────────────────────────────────────
import {
    // Employee Online Applications
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST,
    FETCH_EMPLOYEE_ONLINE_APP_SUCCESS,
    FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST,
    FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS,
    FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE,
    
    // Hiring Process
    FETCH_INSERT_HIRING_PROCESS_REQUEST,
    FETCH_INSERT_HIRING_PROCESS_SUCCESS,
    FETCH_INSERT_HIRING_PROCESS_FAILURE,
    
    // User Roles
    FETCH_USER_ROLE_REQUEST,
    FETCH_USER_ROLE_SUCCESS,
    FETCH_USER_ROLE_FAILURE,
    
    // Templates
    FETCH_INSERT_TEMPLATE_TABLE_REQUEST,
    FETCH_INSERT_TEMPLATE_TABLE_SUCCESS,
    FETCH_INSERT_TEMPLATE_TABLE_FAILURE,
    FETCH_HR_TEMPLATE_REQUEST,
    FETCH_HR_TEMPLATE_SUCCESS,
    FETCH_HR_TEMPLATE_FAILURE,
    
    // Employee Screening
    FETCH_EMPLOYEE_APPLICATION_SCREENING_REQUEST,
    FETCH_EMPLOYEE_APPLICATION_SCREENING_SUCCESS,
    FETCH_EMPLOYEE_APPLICATION_SCREENING_FAILURE,
    FETCH_UPDATE_EMPLOYEE_SCREENING_REQUEST,
    FETCH_UPDATE_EMPLOYEE_SCREENING_SUCCESS,
    FETCH_UPDATE_EMPLOYEE_SCREENING_FAILURE,
    
    // Criteria and Screening
    FETCH_CRITERIA_TABLE_REQUEST,
    FETCH_CRITERIA_TABLE_SUCCESS,
    FETCH_CRITERIA_TABLE_FAILURE,
    FETCH_SAC_USER_REQUEST,
    FETCH_SAC_USER_SUCCESS,
    FETCH_SAC_USER_FAILURE,
    FETCH_AP_USER_REQUEST,
    FETCH_AP_USER_SUCCESS,
    FETCH_AP_USER_FAILURE,
    FETCH_PRINCIPAL_USER_REQUEST,
    FETCH_PRINCIPAL_USER_SUCCESS,
    FETCH_PRINCIPAL_USER_FAILURE,
    
    // Department, Position, Golden Rank Templates
    FETCH_DEPARTMENT_TEMPLATE_REQUEST,
    FETCH_DEPARTMENT_TEMPLATE_SUCCESS,
    FETCH_DEPARTMENT_TEMPLATE_FAILURE,
    FETCH_POSITION_TEMPLATE_REQUEST,
    FETCH_POSITION_TEMPLATE_SUCCESS,
    FETCH_POSITION_TEMPLATE_FAILURE,
    FETCH_GOLDEN_RANK_TEMPLATE_REQUEST,
    FETCH_GOLDEN_RANK_TEMPLATE_SUCCESS,
    FETCH_GOLDEN_RANK_TEMPLATE_FAILURE,
    
    // Hired Employee
    FETCH_INSERT_HIRED_EMPLOYEE_REQUEST,
    FETCH_INSERT_HIRED_EMPLOYEE_SUCCESS,
    FETCH_INSERT_HIRED_EMPLOYEE_FAILURE,
    
    // Daily Time Record (DTR)
    FETCH_DTR_LOGS_REQUEST,
    FETCH_DTR_LOGS_SUCCESS,
    FETCH_DTR_LOGS_FAILURE,
    POST_DTR_SCAN_REQUEST,
    POST_DTR_SCAN_SUCCESS,
    POST_DTR_SCAN_FAILURE,
    DTR_SCAN_RATE_LIMITED,
    FETCH_DTR_RECORDS_REQUEST,
    FETCH_DTR_RECORDS_SUCCESS,
    FETCH_DTR_RECORDS_FAILURE,
    
    // Leave Filing
    FETCH_LEAVE_FILINGS_REQUEST,
    FETCH_LEAVE_FILINGS_SUCCESS,
    FETCH_LEAVE_FILINGS_FAILURE,
    CREATE_LEAVE_FILING_REQUEST,
    CREATE_LEAVE_FILING_SUCCESS,
    CREATE_LEAVE_FILING_FAILURE,
    UPDATE_LEAVE_STATUS_REQUEST,
    UPDATE_LEAVE_STATUS_SUCCESS,
    UPDATE_LEAVE_STATUS_FAILURE,
    FETCH_LEAVE_APPLICATIONS_REQUEST,
    FETCH_LEAVE_APPLICATIONS_SUCCESS,
    FETCH_LEAVE_APPLICATIONS_FAILURE,
    
    // Employee Management
    FETCH_EMPLOYEES_REQUEST,
    FETCH_EMPLOYEES_SUCCESS,
    FETCH_EMPLOYEES_FAILURE,
    FETCH_ALL_EMPLOYEES_REQUEST,
    FETCH_ALL_EMPLOYEES_SUCCESS,
    FETCH_ALL_EMPLOYEES_FAILURE,
    SEARCH_EMPLOYEES_REQUEST,
    SEARCH_EMPLOYEES_SUCCESS,
    SEARCH_EMPLOYEES_FAILURE,
    
    // Deductions Management
    FETCH_SSS_TABLE_REQUEST,
    FETCH_SSS_TABLE_SUCCESS,
    FETCH_SSS_TABLE_FAILURE,
    UPDATE_SSS_TABLE_REQUEST,
    UPDATE_SSS_TABLE_SUCCESS,
    UPDATE_SSS_TABLE_FAILURE,
    FETCH_PHILHEALTH_TABLE_REQUEST,
    FETCH_PHILHEALTH_TABLE_SUCCESS,
    FETCH_PHILHEALTH_TABLE_FAILURE,
    UPDATE_PHILHEALTH_TABLE_REQUEST,
    UPDATE_PHILHEALTH_TABLE_SUCCESS,
    UPDATE_PHILHEALTH_TABLE_FAILURE,
    FETCH_PAGIBIG_TABLE_REQUEST,
    FETCH_PAGIBIG_TABLE_SUCCESS,
    FETCH_PAGIBIG_TABLE_FAILURE,
    UPDATE_PAGIBIG_TABLE_REQUEST,
    UPDATE_PAGIBIG_TABLE_SUCCESS,
    UPDATE_PAGIBIG_TABLE_FAILURE,
    FETCH_EMPLOYEE_DEDUCTIONS_REQUEST,
    FETCH_EMPLOYEE_DEDUCTIONS_SUCCESS,
    FETCH_EMPLOYEE_DEDUCTIONS_FAILURE,
    CREATE_EMPLOYEE_DEDUCTION_REQUEST,
    CREATE_EMPLOYEE_DEDUCTION_SUCCESS,
    CREATE_EMPLOYEE_DEDUCTION_FAILURE,
    UPDATE_EMPLOYEE_DEDUCTION_REQUEST,
    UPDATE_EMPLOYEE_DEDUCTION_SUCCESS,
    UPDATE_EMPLOYEE_DEDUCTION_FAILURE,
    DELETE_EMPLOYEE_DEDUCTION_REQUEST,
    DELETE_EMPLOYEE_DEDUCTION_SUCCESS,
    DELETE_EMPLOYEE_DEDUCTION_FAILURE,
    
    // Payroll Period Templates
    FETCH_PAYROLL_PERIODS_REQUEST,
    FETCH_PAYROLL_PERIODS_SUCCESS,
    FETCH_PAYROLL_PERIODS_FAILURE,
    CREATE_PAYROLL_PERIOD_REQUEST,
    CREATE_PAYROLL_PERIOD_SUCCESS,
    CREATE_PAYROLL_PERIOD_FAILURE,
    UPDATE_PAYROLL_PERIOD_REQUEST,
    UPDATE_PAYROLL_PERIOD_SUCCESS,
    UPDATE_PAYROLL_PERIOD_FAILURE,
    DELETE_PAYROLL_PERIOD_REQUEST,
    DELETE_PAYROLL_PERIOD_SUCCESS,
    DELETE_PAYROLL_PERIOD_FAILURE,
    INSERT_PAYROLL_PERIOD_REQUEST,
    INSERT_PAYROLL_PERIOD_SUCCESS,
    INSERT_PAYROLL_PERIOD_FAILURE,
    
    // Payroll Processing
    CALCULATE_PAYROLL_REQUEST,
    CALCULATE_PAYROLL_SUCCESS,
    CALCULATE_PAYROLL_FAILURE,
    CALCULATE_PAYROLL_FOR_PERIOD_REQUEST,
    CALCULATE_PAYROLL_FOR_PERIOD_SUCCESS,
    CALCULATE_PAYROLL_FOR_PERIOD_FAILURE,
    FETCH_PAYROLL_DETAILS_REQUEST,
    FETCH_PAYROLL_DETAILS_SUCCESS,
    FETCH_PAYROLL_DETAILS_FAILURE,
    FINALIZE_PAYROLL_REQUEST,
    FINALIZE_PAYROLL_SUCCESS,
    FINALIZE_PAYROLL_FAILURE,
    SUBMIT_PAYROLL_FOR_APPROVAL_REQUEST,
    SUBMIT_PAYROLL_FOR_APPROVAL_SUCCESS,
    SUBMIT_PAYROLL_FOR_APPROVAL_FAILURE,
    FETCH_EMPLOYEE_PAYROLL_LIST_REQUEST,
    FETCH_EMPLOYEE_PAYROLL_LIST_SUCCESS,
    FETCH_EMPLOYEE_PAYROLL_LIST_FAILURE,
    
    // Leave Credit Management
    FETCH_EMPLOYEE_LEAVE_CREDITS_REQUEST,
    FETCH_EMPLOYEE_LEAVE_CREDITS_SUCCESS,
    FETCH_EMPLOYEE_LEAVE_CREDITS_FAILURE,
    UPDATE_EMPLOYEE_LEAVE_CREDITS_REQUEST,
    UPDATE_EMPLOYEE_LEAVE_CREDITS_SUCCESS,
    UPDATE_EMPLOYEE_LEAVE_CREDITS_FAILURE,
    FETCH_SCHOOL_CALENDAR_DROPDOWN_REQUEST,
    FETCH_SCHOOL_CALENDAR_DROPDOWN_SUCCESS,
    FETCH_SCHOOL_CALENDAR_DROPDOWN_FAILURE,
    FETCH_EMPLOYEE_LEAVE_BALANCE_REQUEST,
    FETCH_EMPLOYEE_LEAVE_BALANCE_SUCCESS,
    FETCH_EMPLOYEE_LEAVE_BALANCE_FAILURE,
    
    // Employee Resume
    FETCH_EMPLOYEE_RESUME_REQUEST,
    FETCH_EMPLOYEE_RESUME_SUCCESS,
    FETCH_EMPLOYEE_RESUME_FAILURE,
    
    // Manual Attendance & Leave
    CREATE_MANUAL_ATTENDANCE_REQUEST,
    CREATE_MANUAL_ATTENDANCE_SUCCESS,
    CREATE_MANUAL_ATTENDANCE_FAILURE,
    CREATE_MANUAL_LEAVE_REQUEST,
    CREATE_MANUAL_LEAVE_SUCCESS,
    CREATE_MANUAL_LEAVE_FAILURE,
} from "./ActionType";

import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1: FETCH / GET ACTIONS (Data Retrieval)
// ══════════════════════════════════════════════════════════════════════════════
// All data fetching operations are grouped here and use POSITIONAL PARAMETERS
// instead of object wrappers for query/filter operations
// ══════════════════════════════════════════════════════════════════════════════

// ── Employee Online Applications ──────────────────────────────────────────────

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

// ── User Role Data ────────────────────────────────────────────────────────────

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

// ── HR Templates ──────────────────────────────────────────────────────────────

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

// ── Employee Screening ────────────────────────────────────────────────────────

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

// ── Criteria Table ────────────────────────────────────────────────────────────

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

// ── SAC, AP, and Principal User Data ──────────────────────────────────────────

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

// ── Department, Position, Golden Rank Templates ───────────────────────────────

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

// ── DTR Logs (Daily Time Record) ──────────────────────────────────────────────

export const fetchDtrLogsRequest = () => ({ type: FETCH_DTR_LOGS_REQUEST });
export const fetchDtrLogsSuccess = (data) => ({ type: FETCH_DTR_LOGS_SUCCESS, payload: data });
export const fetchDtrLogsFailure = (error) => ({ type: FETCH_DTR_LOGS_FAILURE, payload: error });

/**
 * Fetch DTR Logs (Paginated, Searchable)
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} search - Search term
 * @param {string|null} date - Optional date filter
 */
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

// ── Leave Filings ─────────────────────────────────────────────────────────────

export const fetchLeaveFilingsRequest = () => ({ type: FETCH_LEAVE_FILINGS_REQUEST });
export const fetchLeaveFilingsSuccess = (data) => ({ type: FETCH_LEAVE_FILINGS_SUCCESS, payload: data });
export const fetchLeaveFilingsFailure = (error) => ({ type: FETCH_LEAVE_FILINGS_FAILURE, payload: error });

/**
 * Fetch Leave Filings (Refactored to positional parameters)
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} search - Search term
 * @param {string|null} status - Leave status filter
 * @param {string|null} leaveType - Leave type filter
 */
export const fetchLeaveFilings = (page = 1, pageSize = 10, search = '', status = null, leaveType = null) => async (dispatch) => {
    dispatch(fetchLeaveFilingsRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({ page, pageSize, search: search ?? '' });
        if (status)    params.append('status',    status);
        if (leaveType) params.append('leaveType', leaveType);

        const res = await fetch(`${baseUrl}/hr/get-leave-filings?${params}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        dispatch(fetchLeaveFilingsSuccess(data));
        return { ok: true, data: data.data ?? data, totalRecords: data.totalRecords ?? 0 };
    } catch (err) {
        dispatch(fetchLeaveFilingsFailure(err.message));
        return { ok: false, err };
    }
};

// ── Employee List ─────────────────────────────────────────────────────────────

export const fetchEmployeesRequest = () => ({ type: FETCH_EMPLOYEES_REQUEST });
export const fetchEmployeesSuccess = (data) => ({ type: FETCH_EMPLOYEES_SUCCESS, payload: data });
export const fetchEmployeesFailure = (error) => ({ type: FETCH_EMPLOYEES_FAILURE, payload: error });

/**
 * Fetch Employee List (Refactored to positional parameters)
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} search - Search term
 * @param {number|null} departmentId - Department ID filter
 * @param {string|null} status - Employee status filter
 */
export const fetchEmployeeList = (page = 1, pageSize = 10, search = '', departmentId = null, status = null) => async (dispatch) => {
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
                page,
                pageSize,
                search,
                departmentId,
                status,
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

// ── SSS Table ─────────────────────────────────────────────────────────────────

export const fetchSssTableRequest = () => ({ type: FETCH_SSS_TABLE_REQUEST });
export const fetchSssTableSuccess = (data) => ({ type: FETCH_SSS_TABLE_SUCCESS, payload: data });
export const fetchSssTableFailure = (error) => ({ type: FETCH_SSS_TABLE_FAILURE, payload: error });

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

// ── PhilHealth Table ──────────────────────────────────────────────────────────

export const fetchPhilhealthTableRequest = () => ({ type: FETCH_PHILHEALTH_TABLE_REQUEST });
export const fetchPhilhealthTableSuccess = (data) => ({ type: FETCH_PHILHEALTH_TABLE_SUCCESS, payload: data });
export const fetchPhilhealthTableFailure = (error) => ({ type: FETCH_PHILHEALTH_TABLE_FAILURE, payload: error });

/**
 * Fetch PhilHealth Table with Pagination
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} search - Search query
 */
export const fetchPhilhealthTable = (page = 1, pageSize = 10, search = '') => async (dispatch) => {
    dispatch(fetchPhilhealthTableRequest());
    try {
        const token = getToken();
        
        let url = `${baseUrl}/hr/get-philhealth-table?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;
        
        const res = await fetch(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await res.json();
        dispatch(fetchPhilhealthTableSuccess(data));
        return { ok: true, data: data.data ?? data, totalRecords: data.totalRecords ?? 0 };
    } catch (err) {
        dispatch(fetchPhilhealthTableFailure(err.message));
        return { ok: false, err };
    }
};

// ── Pag-IBIG Table ────────────────────────────────────────────────────────────

export const fetchPagibigTableRequest = () => ({ type: FETCH_PAGIBIG_TABLE_REQUEST });
export const fetchPagibigTableSuccess = (data) => ({ type: FETCH_PAGIBIG_TABLE_SUCCESS, payload: data });
export const fetchPagibigTableFailure = (error) => ({ type: FETCH_PAGIBIG_TABLE_FAILURE, payload: error });

/**
 * Fetch Pag-IBIG Table with Pagination
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} search - Search query
 */
export const fetchPagibigTable = (page = 1, pageSize = 10, search = '') => async (dispatch) => {
    dispatch(fetchPagibigTableRequest());
    try {
        const token = getToken();
        
        let url = `${baseUrl}/hr/get-pagibig-table?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;
        
        const res = await fetch(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await res.json();
        dispatch(fetchPagibigTableSuccess(data));
        return { ok: true, data: data.data ?? data, totalRecords: data.totalRecords ?? 0 };
    } catch (err) {
        dispatch(fetchPagibigTableFailure(err.message));
        return { ok: false, err };
    }
};

// ── Employee Deductions ───────────────────────────────────────────────────────

export const fetchEmployeeDeductionsRequest = () => ({ type: FETCH_EMPLOYEE_DEDUCTIONS_REQUEST });
export const fetchEmployeeDeductionsSuccess = (data) => ({ type: FETCH_EMPLOYEE_DEDUCTIONS_SUCCESS, payload: data });
export const fetchEmployeeDeductionsFailure = (error) => ({ type: FETCH_EMPLOYEE_DEDUCTIONS_FAILURE, payload: error });

/**
 * Fetch Employee Deductions (Refactored to positional parameters)
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} search - Search term
 * @param {string|null} deductionType - Deduction type filter
 * @param {string|null} status - Status filter
 */
export const fetchEmployeeDeductions = (page = 1, pageSize = 10, search = '', deductionType = null, status = null) => async (dispatch) => {
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
                page,
                pageSize,
                search,
                deductionType,
                status,
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

// ── Payroll Periods ───────────────────────────────────────────────────────────

export const fetchPayrollPeriodsRequest = () => ({ type: FETCH_PAYROLL_PERIODS_REQUEST });
export const fetchPayrollPeriodsSuccess = (data) => ({ type: FETCH_PAYROLL_PERIODS_SUCCESS, payload: data });
export const fetchPayrollPeriodsFailure = (error) => ({ type: FETCH_PAYROLL_PERIODS_FAILURE, payload: error });

export const fetchPayrollPeriodsData = () => async (dispatch) => {
    dispatch(fetchPayrollPeriodsRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-payroll-periods`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchPayrollPeriodsSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    } catch (error) {
        dispatch(fetchPayrollPeriodsFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Employee Payroll List ─────────────────────────────────────────────────────

export const fetchEmployeePayrollListRequest = () => ({ type: FETCH_EMPLOYEE_PAYROLL_LIST_REQUEST });
export const fetchEmployeePayrollListSuccess = (data) => ({ type: FETCH_EMPLOYEE_PAYROLL_LIST_SUCCESS, payload: data });
export const fetchEmployeePayrollListFailure = (error) => ({ type: FETCH_EMPLOYEE_PAYROLL_LIST_FAILURE, payload: error });

/**
 * Fetch Employee Payroll List (Refactored to positional parameters)
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} searchTerm - Search term
 * @param {number|null} payrollPeriodId - Payroll period ID filter
 * @param {number|null} departmentId - Department ID filter
 * @param {string|null} status - Status filter
 */
export const fetchEmployeePayrollList = (page = 1, pageSize = 10, searchTerm = '', payrollPeriodId = null, departmentId = null, status = null) => async (dispatch) => {
    dispatch(fetchEmployeePayrollListRequest());
    try {
        const token = getToken();
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            ...(searchTerm && { searchTerm }),
            ...(payrollPeriodId && { payrollPeriodId: payrollPeriodId.toString() }),
            ...(departmentId && { departmentId: departmentId.toString() }),
            ...(status && { status }),
        }).toString();

        const url = `${baseUrl}/hr/get-employee-payroll-list?${queryParams}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(fetchEmployeePayrollListSuccess(res));
        return { ok: true, data: res.data };
    } catch (error) {
        dispatch(fetchEmployeePayrollListFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Employee Leave Credits ────────────────────────────────────────────────────

export const fetchEmployeeLeaveCreditsRequest = () => ({ type: FETCH_EMPLOYEE_LEAVE_CREDITS_REQUEST });
export const fetchEmployeeLeaveCreditsSuccess = (data) => ({ type: FETCH_EMPLOYEE_LEAVE_CREDITS_SUCCESS, payload: data });
export const fetchEmployeeLeaveCreditsFailure = (error) => ({ type: FETCH_EMPLOYEE_LEAVE_CREDITS_FAILURE, payload: error });

/**
 * Fetch Employee Leave Credits (Refactored to positional parameters)
 * @param {number|null} calendarId - Calendar ID
 * @param {string} department - Department filter
 * @param {string} search - Search term
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 */
export const fetchEmployeeLeaveCredits = (calendarId = null, department = '', search = '', page = 1, pageSize = 10) => async (dispatch) => {
    dispatch(fetchEmployeeLeaveCreditsRequest());
    try {
        const token = getToken();
        
        const params = new URLSearchParams();
        if (calendarId) params.append('calendarId', calendarId.toString());
        params.append('department', department);
        params.append('search', search);
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());
        
        const url = `${baseUrl}/hr/get-employee-leave-credits?${params.toString()}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        
        dispatch(fetchEmployeeLeaveCreditsSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    } catch (error) {
        dispatch(fetchEmployeeLeaveCreditsFailure(error.message));
        return { ok: false, error };
    }
};

// ── School Calendar Dropdown ──────────────────────────────────────────────────

export const fetchSchoolCalendarDropdownRequest = () => ({ type: FETCH_SCHOOL_CALENDAR_DROPDOWN_REQUEST });
export const fetchSchoolCalendarDropdownSuccess = (data) => ({ type: FETCH_SCHOOL_CALENDAR_DROPDOWN_SUCCESS, payload: data });
export const fetchSchoolCalendarDropdownFailure = (error) => ({ type: FETCH_SCHOOL_CALENDAR_DROPDOWN_FAILURE, payload: error });

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

// ── Employee Resume ───────────────────────────────────────────────────────────

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

        const blob = await response.blob();
        const contentType = response.headers.get('content-type');
        
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        
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

// ── Fetch All Employees (Simple) ──────────────────────────────────────────────

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

// ── Employee Leave Balance ────────────────────────────────────────────────────

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

// ── Search Employees ──────────────────────────────────────────────────────────

export const searchEmployeesRequest = () => ({ type: SEARCH_EMPLOYEES_REQUEST });
export const searchEmployeesSuccess = (data) => ({ type: SEARCH_EMPLOYEES_SUCCESS, payload: data });
export const searchEmployeesFailure = (error) => ({ type: SEARCH_EMPLOYEES_FAILURE, payload: error });

/**
 * Search Employees (Refactored to positional parameters)
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} search - Search term
 * @param {number|null} departmentId - Department ID filter
 * @param {string|null} status - Status filter
 */
export const searchEmployees = (page = 1, pageSize = 10, search = '', departmentId = null, status = null) => async (dispatch) => {
    dispatch(searchEmployeesRequest());
    try {
        const token = getToken();
        
        // Build query string manually following project pattern
        let url = `${baseUrl}/hr/get-all-employees?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;
        
        if (departmentId !== null && departmentId !== undefined) {
            url += `&departmentId=${departmentId}`;
        }
        
        if (status !== null && status !== undefined && status !== '') {
            url += `&status=${encodeURIComponent(status)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        console.log('searchEmployees API Response:', res);
        console.log('Response data array:', res.data);
        console.log('Total records:', res.totalRecords);
        
        // Extract data and totalRecords from the response
        const employeesData = res.data || [];
        const totalRecords = res.totalRecords || 0;
        
        dispatch(searchEmployeesSuccess({ data: employeesData, totalRecords: totalRecords }));
        return { ok: true, data: employeesData, totalRecords: totalRecords };
    }
    catch (error) {
        dispatch(searchEmployeesFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Leave Applications ────────────────────────────────────────────────────────

export const fetchLeaveApplicationsRequest = () => ({ type: FETCH_LEAVE_APPLICATIONS_REQUEST });
export const fetchLeaveApplicationsSuccess = (data) => ({ type: FETCH_LEAVE_APPLICATIONS_SUCCESS, payload: data });
export const fetchLeaveApplicationsFailure = (error) => ({ type: FETCH_LEAVE_APPLICATIONS_FAILURE, payload: error });

/**
 * Fetch Leave Applications (Refactored to positional parameters)
 * @param {number|null} employeeId - Employee ID filter
 * @param {string|null} applicationStatus - Status filter
 * @param {string|null} startDate - Start date filter
 * @param {string|null} endDate - End date filter
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} search - Search term
 */
export const fetchLeaveApplications = (employeeId = null, applicationStatus = null, startDate = null, endDate = null, page = 1, pageSize = 20, search = '') => async (dispatch) => {
    dispatch(fetchLeaveApplicationsRequest());
    try {
        const token = getToken();
        
        const params = new URLSearchParams();
        if (employeeId) params.append('employeeId', employeeId.toString());
        if (applicationStatus) params.append('applicationStatus', applicationStatus);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());
        params.append('search', search);
        
        const url = `${baseUrl}/hr/get-leave-applications?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        
        dispatch(fetchLeaveApplicationsSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchLeaveApplicationsFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── DTR Records ───────────────────────────────────────────────────────────────

export const fetchDtrRecordsRequest = () => ({ type: FETCH_DTR_RECORDS_REQUEST });
export const fetchDtrRecordsSuccess = (data) => ({ type: FETCH_DTR_RECORDS_SUCCESS, payload: data });
export const fetchDtrRecordsFailure = (error) => ({ type: FETCH_DTR_RECORDS_FAILURE, payload: error });

/**
 * Fetch DTR Records
 * @param {string|null} search - Search query for employee name or number
 * @param {string|null} startDate - Start date filter
 * @param {string|null} endDate - End date filter
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 */
export const fetchDtrRecords = (search = '', startDate = null, endDate = null, page = 1, pageSize = 50) => async (dispatch) => {
    dispatch(fetchDtrRecordsRequest());
    try {
        const token = getToken();
        
        // Build URL with query parameters
        let url = `${baseUrl}/hr/get-employee-dtr?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;
        
        if (startDate) {
            url += `&startDate=${encodeURIComponent(startDate)}`;
        }
        if (endDate) {
            url += `&endDate=${encodeURIComponent(endDate)}`;
        }

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

// ── Employee Leave Balance (with Redux Actions) ───────────────────────────────

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

// ── Payroll Details ───────────────────────────────────────────────────────────

export const fetchPayrollDetailsRequest = () => ({ type: FETCH_PAYROLL_DETAILS_REQUEST });
export const fetchPayrollDetailsSuccess = (data) => ({ type: FETCH_PAYROLL_DETAILS_SUCCESS, payload: data });
export const fetchPayrollDetailsFailure = (error) => ({ type: FETCH_PAYROLL_DETAILS_FAILURE, payload: error });

/**
 * Fetch Payroll Details (Refactored to positional parameters)
 * @param {number} periodId - Period ID
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} search - Search term
 */
export const fetchPayrollDetails = (periodId, page = 1, pageSize = 50, search = '') => async (dispatch) => {
    dispatch(fetchPayrollDetailsRequest());
    try {
        const token = getToken();

        // Support being called with an object { periodId } OR positional args
        const pid = (typeof periodId === 'object' && periodId !== null)
            ? periodId.periodId
            : periodId;

        const params = new URLSearchParams({
            periodId: pid.toString(),
            page:     page.toString(),
            pageSize: pageSize.toString()
        });
        if (search) params.append('search', search);

        const url = `${baseUrl}/hr/get-payroll-details?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        
        dispatch(fetchPayrollDetailsSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchPayrollDetailsFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2: MUTATION ACTIONS (CREATE / UPDATE / DELETE)
// ══════════════════════════════════════════════════════════════════════════════
// All data modification operations are grouped here
// These actions use PAYLOAD/OBJECT parameters (acceptable per project standards)
// ══════════════════════════════════════════════════════════════════════════════

// ── Insert Hiring Process ─────────────────────────────────────────────────────

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

// ── Insert Template Table ─────────────────────────────────────────────────────

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

// ── Update Employee Screening ─────────────────────────────────────────────────

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

// ── Insert Hired Employee ─────────────────────────────────────────────────────

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

// ── Post Biometric Scan ───────────────────────────────────────────────────────

export const postDtrScanRequest = () => ({ type: POST_DTR_SCAN_REQUEST });
export const postDtrScanSuccess = (data) => ({ type: POST_DTR_SCAN_SUCCESS, payload: data });
export const postDtrScanFailure = (error) => ({ type: POST_DTR_SCAN_FAILURE, payload: error });
export const dtrScanRateLimited = (payload) => ({ type: DTR_SCAN_RATE_LIMITED, payload });

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

// ── Submit Leave Filing ───────────────────────────────────────────────────────

export const createLeaveFilingRequest = () => ({ type: CREATE_LEAVE_FILING_REQUEST });
export const createLeaveFilingSuccess = (data) => ({ type: CREATE_LEAVE_FILING_SUCCESS, payload: data });
export const createLeaveFilingFailure = (error) => ({ type: CREATE_LEAVE_FILING_FAILURE, payload: error });

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

// ── Update Leave Status ───────────────────────────────────────────────────────

export const updateLeaveStatusRequest = () => ({ type: UPDATE_LEAVE_STATUS_REQUEST });
export const updateLeaveStatusSuccess = (data) => ({ type: UPDATE_LEAVE_STATUS_SUCCESS, payload: data });
export const updateLeaveStatusFailure = (error) => ({ type: UPDATE_LEAVE_STATUS_FAILURE, payload: error });

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

// ── Update SSS Table ──────────────────────────────────────────────────────────

export const updateSssTableRequest = () => ({ type: UPDATE_SSS_TABLE_REQUEST });
export const updateSssTableSuccess = (data) => ({ type: UPDATE_SSS_TABLE_SUCCESS, payload: data });
export const updateSssTableFailure = (error) => ({ type: UPDATE_SSS_TABLE_FAILURE, payload: error });

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

// ── Update PhilHealth Table ───────────────────────────────────────────────────

export const updatePhilhealthTableRequest = () => ({ type: UPDATE_PHILHEALTH_TABLE_REQUEST });
export const updatePhilhealthTableSuccess = (data) => ({ type: UPDATE_PHILHEALTH_TABLE_SUCCESS, payload: data });
export const updatePhilhealthTableFailure = (error) => ({ type: UPDATE_PHILHEALTH_TABLE_FAILURE, payload: error });

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

// ── Update Pag-IBIG Table ─────────────────────────────────────────────────────

export const updatePagibigTableRequest = () => ({ type: UPDATE_PAGIBIG_TABLE_REQUEST });
export const updatePagibigTableSuccess = (data) => ({ type: UPDATE_PAGIBIG_TABLE_SUCCESS, payload: data });
export const updatePagibigTableFailure = (error) => ({ type: UPDATE_PAGIBIG_TABLE_FAILURE, payload: error });

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

// ── Create Employee Deduction ─────────────────────────────────────────────────

export const createEmployeeDeductionRequest = () => ({ type: CREATE_EMPLOYEE_DEDUCTION_REQUEST });
export const createEmployeeDeductionSuccess = (data) => ({ type: CREATE_EMPLOYEE_DEDUCTION_SUCCESS, payload: data });
export const createEmployeeDeductionFailure = (error) => ({ type: CREATE_EMPLOYEE_DEDUCTION_FAILURE, payload: error });

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

// ── Update Employee Deduction ─────────────────────────────────────────────────

export const updateEmployeeDeductionRequest = () => ({ type: UPDATE_EMPLOYEE_DEDUCTION_REQUEST });
export const updateEmployeeDeductionSuccess = (data) => ({ type: UPDATE_EMPLOYEE_DEDUCTION_SUCCESS, payload: data });
export const updateEmployeeDeductionFailure = (error) => ({ type: UPDATE_EMPLOYEE_DEDUCTION_FAILURE, payload: error });

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

// ── Delete Employee Deduction ─────────────────────────────────────────────────

export const deleteEmployeeDeductionRequest = () => ({ type: DELETE_EMPLOYEE_DEDUCTION_REQUEST });
export const deleteEmployeeDeductionSuccess = (data) => ({ type: DELETE_EMPLOYEE_DEDUCTION_SUCCESS, payload: data });
export const deleteEmployeeDeductionFailure = (error) => ({ type: DELETE_EMPLOYEE_DEDUCTION_FAILURE, payload: error });

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

// ── Create Payroll Period ─────────────────────────────────────────────────────

export const createPayrollPeriodRequest = () => ({ type: CREATE_PAYROLL_PERIOD_REQUEST });
export const createPayrollPeriodSuccess = (data) => ({ type: CREATE_PAYROLL_PERIOD_SUCCESS, payload: data });
export const createPayrollPeriodFailure = (error) => ({ type: CREATE_PAYROLL_PERIOD_FAILURE, payload: error });

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

// ── Update Payroll Period ─────────────────────────────────────────────────────

export const updatePayrollPeriodRequest = () => ({ type: UPDATE_PAYROLL_PERIOD_REQUEST });
export const updatePayrollPeriodSuccess = (data) => ({ type: UPDATE_PAYROLL_PERIOD_SUCCESS, payload: data });
export const updatePayrollPeriodFailure = (error) => ({ type: UPDATE_PAYROLL_PERIOD_FAILURE, payload: error });

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

// ── Delete Payroll Period ─────────────────────────────────────────────────────

export const deletePayrollPeriodRequest = () => ({ type: DELETE_PAYROLL_PERIOD_REQUEST });
export const deletePayrollPeriodSuccess = (data) => ({ type: DELETE_PAYROLL_PERIOD_SUCCESS, payload: data });
export const deletePayrollPeriodFailure = (error) => ({ type: DELETE_PAYROLL_PERIOD_FAILURE, payload: error });

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

// ── Insert Payroll Period ─────────────────────────────────────────────────────

export const insertPayrollPeriodRequest = () => ({ type: INSERT_PAYROLL_PERIOD_REQUEST });
export const insertPayrollPeriodSuccess = (data) => ({ type: INSERT_PAYROLL_PERIOD_SUCCESS, payload: data });
export const insertPayrollPeriodFailure = (error) => ({ type: INSERT_PAYROLL_PERIOD_FAILURE, payload: error });

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

// ── Calculate Payroll ─────────────────────────────────────────────────────────

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

// ── Update Employee Leave Credits ─────────────────────────────────────────────

export const updateEmployeeLeaveCreditsRequest = () => ({ type: UPDATE_EMPLOYEE_LEAVE_CREDITS_REQUEST });
export const updateEmployeeLeaveCreditsSuccess = (data) => ({ type: UPDATE_EMPLOYEE_LEAVE_CREDITS_SUCCESS, payload: data });
export const updateEmployeeLeaveCreditsFailure = (error) => ({ type: UPDATE_EMPLOYEE_LEAVE_CREDITS_FAILURE, payload: error });

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

// ── Create Manual Attendance ──────────────────────────────────────────────────

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

// ── Create Manual Leave ───────────────────────────────────────────────────────

export const createManualLeaveRequest = () => ({ type: CREATE_MANUAL_LEAVE_REQUEST });
export const createManualLeaveSuccess = (data) => ({ type: CREATE_MANUAL_LEAVE_SUCCESS, payload: data });
export const createManualLeaveFailure = (error) => ({ type: CREATE_MANUAL_LEAVE_FAILURE, payload: error });

export const createManualLeave = (payload) => async (dispatch) => {
    dispatch(createManualLeaveRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/file-leave-application`;

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

// ── Calculate Payroll For Period ──────────────────────────────────────────────

export const calculatePayrollForPeriodRequest = () => ({ type: CALCULATE_PAYROLL_FOR_PERIOD_REQUEST });
export const calculatePayrollForPeriodSuccess = (data) => ({ type: CALCULATE_PAYROLL_FOR_PERIOD_SUCCESS, payload: data });
export const calculatePayrollForPeriodFailure = (error) => ({ type: CALCULATE_PAYROLL_FOR_PERIOD_FAILURE, payload: error });

export const calculatePayrollForPeriod = (periodId) => async (dispatch) => {
    dispatch(calculatePayrollForPeriodRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/calculate-payroll?periodId=${periodId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(calculatePayrollForPeriodSuccess(res));
        return { ok: true, message: res.message, data: res.data };
    }
    catch (error) {
        dispatch(calculatePayrollForPeriodFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Finalize Payroll ──────────────────────────────────────────────────────────

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

// ── Submit Payroll for Approval ───────────────────────────────────────────────

export const submitPayrollForApprovalRequest = () => ({ type: SUBMIT_PAYROLL_FOR_APPROVAL_REQUEST });
export const submitPayrollForApprovalSuccess = (data) => ({ type: SUBMIT_PAYROLL_FOR_APPROVAL_SUCCESS, payload: data });
export const submitPayrollForApprovalFailure = (error) => ({ type: SUBMIT_PAYROLL_FOR_APPROVAL_FAILURE, payload: error });

/**
 * Submit Payroll for Approval to Finance Head
 * After calculating payroll, HR submits it for Finance Head approval
 * 
 * @param {Object} payload - Submission data
 * @param {number} payload.periodId - Payroll period ID
 * @param {string} payload.remarks - Optional submission remarks
 * @returns {Object} { ok: boolean, message: string }
 */
export const submitPayrollForApproval = (payload) => async (dispatch) => {
    dispatch(submitPayrollForApprovalRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/submit-payroll-for-approval`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(submitPayrollForApprovalSuccess(res));
        return { ok: true, message: res.message || 'Payroll submitted for approval successfully' };
    }
    catch (error) {
        dispatch(submitPayrollForApprovalFailure(error.message));
        return { ok: false, error: error.message };
    }
};


// ══════════════════════════════════════════════════════════════════════════════
// NEW PAYROLL PROCESSING FUNCTIONS (2026-08-26)
// ══════════════════════════════════════════════════════════════════════════════

// ── Calculate Payroll (New Version) ───────────────────────────────────────────
export const newCalculatePayrollRequest = () => ({ type: 'NEW_CALCULATE_PAYROLL_REQUEST' });
export const newCalculatePayrollSuccess = (data) => ({ type: 'NEW_CALCULATE_PAYROLL_SUCCESS', payload: data });
export const newCalculatePayrollFailure = (error) => ({ type: 'NEW_CALCULATE_PAYROLL_FAILURE', payload: error });

/**
 * Calculate Payroll for a specific period (NEW VERSION)
 * Triggers backend calculation of all employee payroll for the period
 * 
 * @param {number} periodId - Payroll Period ID
 * @returns {Object} { ok: boolean, message: string, data: object }
 */
export const calculatePayroll = (periodId) => async (dispatch) => {
    dispatch(newCalculatePayrollRequest());
    
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/calculate-payroll`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ periodId })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(newCalculatePayrollSuccess(res));
        
        return { ok: true, message: res.message || 'Payroll calculated successfully', data: res.data };
    } catch (error) {
        dispatch(newCalculatePayrollFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Fetch Payroll Summary (New) ───────────────────────────────────────────────
export const newFetchPayrollSummaryRequest = () => ({ type: 'NEW_FETCH_PAYROLL_SUMMARY_REQUEST' });
export const newFetchPayrollSummarySuccess = (data) => ({ type: 'NEW_FETCH_PAYROLL_SUMMARY_SUCCESS', payload: data });
export const newFetchPayrollSummaryFailure = (error) => ({ type: 'NEW_FETCH_PAYROLL_SUMMARY_FAILURE', payload: error });

/**
 * Fetch Payroll Summary Totals (NEW VERSION)
 * Gets aggregated totals for gross pay, deductions, net pay, and statutory contributions
 * 
 * @param {number} periodId - Payroll Period ID
 * @returns {Object} { ok: boolean, data: object }
 */
export const fetchPayrollSummary = (periodId) => async (dispatch) => {
    dispatch(newFetchPayrollSummaryRequest());
    
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-payroll-summary?periodId=${periodId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(newFetchPayrollSummarySuccess(res.data));
        
        return { ok: true, data: res.data };
    } catch (error) {
        dispatch(newFetchPayrollSummaryFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Fetch Employee Payroll Details (New) ──────────────────────────────────────
export const newFetchEmployeePayrollDetailsRequest = () => ({ type: 'NEW_FETCH_EMPLOYEE_PAYROLL_DETAILS_REQUEST' });
export const newFetchEmployeePayrollDetailsSuccess = (data) => ({ type: 'NEW_FETCH_EMPLOYEE_PAYROLL_DETAILS_SUCCESS', payload: data });
export const newFetchEmployeePayrollDetailsFailure = (error) => ({ type: 'NEW_FETCH_EMPLOYEE_PAYROLL_DETAILS_FAILURE', payload: error });

/**
 * Fetch Employee Payroll Details List (NEW VERSION)
 * Gets detailed payroll information for each employee in the period
 * 
 * @param {number} periodId - Payroll Period ID
 * @returns {Object} { ok: boolean, data: array }
 */
export const fetchEmployeePayrollDetails = (periodId) => async (dispatch) => {
    dispatch(newFetchEmployeePayrollDetailsRequest());
    
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-employee-payroll-list?periodId=${periodId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(newFetchEmployeePayrollDetailsSuccess(res.data));
        
        return { ok: true, data: res.data };
    } catch (error) {
        dispatch(newFetchEmployeePayrollDetailsFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Save Payroll Records ──────────────────────────────────────────────────────
export const savePayrollRecordsRequest = () => ({ type: 'SAVE_PAYROLL_RECORDS_REQUEST' });
export const savePayrollRecordsSuccess = (data) => ({ type: 'SAVE_PAYROLL_RECORDS_SUCCESS', payload: data });
export const savePayrollRecordsFailure = (error) => ({ type: 'SAVE_PAYROLL_RECORDS_FAILURE', payload: error });

/**
 * Save the generated payroll records list for a period
 * @param {number} periodId  - Payroll Period ID
 * @param {Array}  records   - Array of payroll record objects from calculatePayrollForPeriod
 */
export const savePayrollRecords = (periodId, records) => async (dispatch) => {
    dispatch(savePayrollRecordsRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/save-payroll-records`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ periodId, records })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(savePayrollRecordsSuccess(res));
        return { ok: true, message: res.message, data: res.data };
    } catch (error) {
        dispatch(savePayrollRecordsFailure(error.message));
        return { ok: false, error: error.message };
    }
};
