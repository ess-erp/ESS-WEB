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
    FETCH_DTR_LOGS_REQUEST,  FETCH_DTR_LOGS_SUCCESS,  FETCH_DTR_LOGS_FAILURE,
    POST_DTR_SCAN_REQUEST,   POST_DTR_SCAN_SUCCESS,   POST_DTR_SCAN_FAILURE,
    DTR_SCAN_RATE_LIMITED,
    FETCH_LEAVE_FILINGS_REQUEST, FETCH_LEAVE_FILINGS_SUCCESS, FETCH_LEAVE_FILINGS_FAILURE,
    CREATE_LEAVE_FILING_REQUEST, CREATE_LEAVE_FILING_SUCCESS, CREATE_LEAVE_FILING_FAILURE,
    UPDATE_LEAVE_STATUS_REQUEST, UPDATE_LEAVE_STATUS_SUCCESS, UPDATE_LEAVE_STATUS_FAILURE,
    FETCH_EMPLOYEES_REQUEST, FETCH_EMPLOYEES_SUCCESS, FETCH_EMPLOYEES_FAILURE,
    FETCH_SSS_TABLE_REQUEST, FETCH_SSS_TABLE_SUCCESS, FETCH_SSS_TABLE_FAILURE,
    UPDATE_SSS_TABLE_REQUEST, UPDATE_SSS_TABLE_SUCCESS, UPDATE_SSS_TABLE_FAILURE,
    FETCH_PHILHEALTH_TABLE_REQUEST, FETCH_PHILHEALTH_TABLE_SUCCESS, FETCH_PHILHEALTH_TABLE_FAILURE,
    UPDATE_PHILHEALTH_TABLE_REQUEST, UPDATE_PHILHEALTH_TABLE_SUCCESS, UPDATE_PHILHEALTH_TABLE_FAILURE,
    FETCH_PAGIBIG_TABLE_REQUEST, FETCH_PAGIBIG_TABLE_SUCCESS, FETCH_PAGIBIG_TABLE_FAILURE,
    UPDATE_PAGIBIG_TABLE_REQUEST, UPDATE_PAGIBIG_TABLE_SUCCESS, UPDATE_PAGIBIG_TABLE_FAILURE,
    FETCH_EMPLOYEE_DEDUCTIONS_REQUEST, FETCH_EMPLOYEE_DEDUCTIONS_SUCCESS, FETCH_EMPLOYEE_DEDUCTIONS_FAILURE,
    CREATE_EMPLOYEE_DEDUCTION_REQUEST, CREATE_EMPLOYEE_DEDUCTION_SUCCESS, CREATE_EMPLOYEE_DEDUCTION_FAILURE,
    UPDATE_EMPLOYEE_DEDUCTION_REQUEST, UPDATE_EMPLOYEE_DEDUCTION_SUCCESS, UPDATE_EMPLOYEE_DEDUCTION_FAILURE,
    DELETE_EMPLOYEE_DEDUCTION_REQUEST, DELETE_EMPLOYEE_DEDUCTION_SUCCESS, DELETE_EMPLOYEE_DEDUCTION_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialGeneralState = {
    employeeOnlineState: { ...initialState },
    employeeInfoState: { ...initialState },
    insertHiringProcessState: { ...initialState },
    userRoleState: { ...initialState },
    insertTemplateState: { ...initialState },
    hrTemplateState: { ...initialState },
    employeeScreeningState: { ...initialState },
    criteriaTableState: { ...initialState },
    sacUserState: { ...initialState, },
    apUserState: { ...initialState },
    principalUserState: { ...initialState },
    updateEmployeeScreeningState: { ...initialState },
    departmentState: { ...initialState },
    positionState: { ...initialState },
    goldenRankState: { ...initialState },
    insertHiredEmployeeState: { ...initialState },
    // DTR
    dtrLogsState:     { loading: false, data: [], error: '', totalRecords: 0 },
    postDtrScanState: { loading: false, data: null, error: '' },
    dtrRateLimitState:{ blocked: false, payload: null },
    // Leave Filing
    leaveFilingsState:      { loading: false, data: [], error: '', totalRecords: 0 },
    createLeaveFilingState: { loading: false, data: null, error: '' },
    updateLeaveStatusState: { loading: false, data: null, error: '' },
    // Employee Management
    employeeListState:      { loading: false, data: [], error: '', totalRecords: 0 },
    // Deductions Management
    sssTableState:          { loading: false, data: [], error: '' },
    updateSssTableState:    { loading: false, data: null, error: '' },
    philhealthTableState:   { loading: false, data: {}, error: '' },
    updatePhilhealthTableState: { loading: false, data: null, error: '' },
    pagibigTableState:      { loading: false, data: {}, error: '' },
    updatePagibigTableState: { loading: false, data: null, error: '' },
    employeeDeductionsState: { loading: false, data: [], error: '', totalRecords: 0 },
    createDeductionState:   { loading: false, data: null, error: '' },
    updateDeductionState:   { loading: false, data: null, error: '' },
    deleteDeductionState:   { loading: false, data: null, error: '' },
};

const hrReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        // Get the template table
        case FETCH_EMPLOYEE_ONLINE_APP_REQUEST:
            return { ...state, employeeOnlineState: { loading: true, data: [], error: '' } };
        case FETCH_EMPLOYEE_ONLINE_APP_SUCCESS:
            return { ...state, employeeOnlineState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EMPLOYEE_ONLINE_APP_FAILURE:
            return { ...state, employeeOnlineState: { loading: false, data: [], error: action.payload } };

        case FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST:
            return { ...state, employeeInfoState: { loading: true, data: [], error: '' } };
        case FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS:
            return { ...state, employeeInfoState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE:
            return { ...state, employeeInfoState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_HIRING_PROCESS_REQUEST:
            return { ...state, employeeInfoState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_HIRING_PROCESS_SUCCESS:
            return { ...state, employeeInfoState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_HIRING_PROCESS_FAILURE:
            return { ...state, employeeInfoState: { loading: false, data: [], error: action.payload } };

        case FETCH_USER_ROLE_REQUEST:
            return { ...state, userRoleState: { loading: true, data: [], error: '' } };
        case FETCH_USER_ROLE_SUCCESS:
            return { ...state, userRoleState: { loading: false, data: action.payload, error: '' } };
        case FETCH_USER_ROLE_FAILURE:
            return { ...state, userRoleState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_TEMPLATE_TABLE_REQUEST:
            return { ...state, insertTemplateState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_TEMPLATE_TABLE_SUCCESS:
            return { ...state, insertTemplateState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_TEMPLATE_TABLE_FAILURE:
            return { ...state, insertTemplateState: { loading: false, data: [], error: action.payload } };

        case FETCH_HR_TEMPLATE_REQUEST:
            return { ...state, hrTemplateState: { loading: true, data: [], error: '' } };
        case FETCH_HR_TEMPLATE_SUCCESS:
            return { ...state, hrTemplateState: { loading: false, data: action.payload, error: '' } };
        case FETCH_HR_TEMPLATE_FAILURE:
            return { ...state, hrTemplateState: { loading: false, data: [], error: action.payload } };

        case FETCH_EMPLOYEE_APPLICATION_SCREENING_REQUEST:
            return { ...state, employeeScreeningState: { loading: true, data: [], error: '' } };
        case FETCH_EMPLOYEE_APPLICATION_SCREENING_SUCCESS:
            return { ...state, employeeScreeningState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EMPLOYEE_APPLICATION_SCREENING_FAILURE:
            return { ...state, employeeScreeningState: { loading: false, data: [], error: action.payload } };

        case FETCH_CRITERIA_TABLE_REQUEST:
            return { ...state, criteriaTableState: { loading: true, data: [], error: '' } };
        case FETCH_CRITERIA_TABLE_SUCCESS:
            return { ...state, criteriaTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_CRITERIA_TABLE_FAILURE:
            return { ...state, criteriaTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_SAC_USER_REQUEST:
            return { ...state, sacUserState: { loading: true, data: [], error: '' } };
        case FETCH_SAC_USER_SUCCESS:
            return { ...state, sacUserState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SAC_USER_FAILURE:
            return { ...state, sacUserState: { loading: false, data: [], error: action.payload } };

        case FETCH_AP_USER_REQUEST:
            return { ...state, apUserState: { loading: true, data: [], error: '' } };
        case FETCH_AP_USER_SUCCESS:
            return { ...state, apUserState: { loading: false, data: action.payload, error: '' } };
        case FETCH_AP_USER_FAILURE:
            return { ...state, apUserState: { loading: false, data: [], error: action.payload } };

        case FETCH_PRINCIPAL_USER_REQUEST:
            return { ...state, principalUserState: { loading: true, data: [], error: '' } };
        case FETCH_PRINCIPAL_USER_SUCCESS:
            return { ...state, principalUserState: { loading: false, data: action.payload, error: '' } };
        case FETCH_PRINCIPAL_USER_FAILURE:
            return { ...state, principalUserState: { loading: false, data: [], error: action.payload } };

        case FETCH_UPDATE_EMPLOYEE_SCREENING_REQUEST:
            return { ...state, updateEmployeeScreeningState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATE_EMPLOYEE_SCREENING_SUCCESS:
            return { ...state, updateEmployeeScreeningState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATE_EMPLOYEE_SCREENING_FAILURE:
            return { ...state, updateEmployeeScreeningState: { loading: false, data: [], error: action.payload } };

        case FETCH_DEPARTMENT_TEMPLATE_REQUEST:
            return { ...state, departmentState: { loading: true, data: [], error: '' } };
        case FETCH_DEPARTMENT_TEMPLATE_SUCCESS:
            return { ...state, departmentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_DEPARTMENT_TEMPLATE_FAILURE:
            return { ...state, departmentState: { loading: false, data: [], error: action.payload } };

        case FETCH_POSITION_TEMPLATE_REQUEST:
            return { ...state, positionState: { loading: true, data: [], error: '' } };
        case FETCH_POSITION_TEMPLATE_SUCCESS:
            return { ...state, positionState: { loading: false, data: action.payload, error: '' } };
        case FETCH_POSITION_TEMPLATE_FAILURE:
            return { ...state, positionState: { loading: false, data: [], error: action.payload } };

        case FETCH_GOLDEN_RANK_TEMPLATE_REQUEST:
            return { ...state, goldenRankState: { loading: true, data: [], error: '' } };
        case FETCH_GOLDEN_RANK_TEMPLATE_SUCCESS:
            return { ...state, goldenRankState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GOLDEN_RANK_TEMPLATE_FAILURE:
            return { ...state, goldenRankState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_HIRED_EMPLOYEE_REQUEST:
            return { ...state, insertHiredEmployeeState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_HIRED_EMPLOYEE_SUCCESS:
            return { ...state, insertHiredEmployeeState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_HIRED_EMPLOYEE_FAILURE:
            return { ...state, insertHiredEmployeeState: { loading: false, data: [], error: action.payload } };

        // ── DTR ───────────────────────────────────────────────────────────────
        case FETCH_DTR_LOGS_REQUEST:
            return { ...state, dtrLogsState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case FETCH_DTR_LOGS_SUCCESS:
            return {
                ...state,
                dtrLogsState: {
                    loading: false,
                    data:         action.payload?.data         ?? action.payload ?? [],
                    totalRecords: action.payload?.totalRecords ?? 0,
                    error: '',
                },
            };
        case FETCH_DTR_LOGS_FAILURE:
            return { ...state, dtrLogsState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };

        case POST_DTR_SCAN_REQUEST:
            return { ...state, postDtrScanState: { loading: true, data: null, error: '' } };
        case POST_DTR_SCAN_SUCCESS:
            return { ...state, postDtrScanState: { loading: false, data: action.payload, error: '' } };
        case POST_DTR_SCAN_FAILURE:
            return { ...state, postDtrScanState: { loading: false, data: null, error: action.payload } };

        case DTR_SCAN_RATE_LIMITED:
            return { ...state, dtrRateLimitState: { blocked: true, payload: action.payload } };

        // ── Leave Filing ──────────────────────────────────────────────────────
        case FETCH_LEAVE_FILINGS_REQUEST:
            return { ...state, leaveFilingsState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case FETCH_LEAVE_FILINGS_SUCCESS:
            return {
                ...state,
                leaveFilingsState: {
                    loading: false,
                    data:         action.payload?.data         ?? action.payload ?? [],
                    totalRecords: action.payload?.totalRecords ?? 0,
                    error: '',
                },
            };
        case FETCH_LEAVE_FILINGS_FAILURE:
            return { ...state, leaveFilingsState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };

        case CREATE_LEAVE_FILING_REQUEST:
            return { ...state, createLeaveFilingState: { loading: true, data: null, error: '' } };
        case CREATE_LEAVE_FILING_SUCCESS:
            return { ...state, createLeaveFilingState: { loading: false, data: action.payload, error: '' } };
        case CREATE_LEAVE_FILING_FAILURE:
            return { ...state, createLeaveFilingState: { loading: false, data: null, error: action.payload } };

        case UPDATE_LEAVE_STATUS_REQUEST:
            return { ...state, updateLeaveStatusState: { loading: true, data: null, error: '' } };
        case UPDATE_LEAVE_STATUS_SUCCESS:
            return { ...state, updateLeaveStatusState: { loading: false, data: action.payload, error: '' } };
        case UPDATE_LEAVE_STATUS_FAILURE:
            return { ...state, updateLeaveStatusState: { loading: false, data: null, error: action.payload } };

        // ── Employee Management ───────────────────────────────────────────────
        case FETCH_EMPLOYEES_REQUEST:
            return { ...state, employeeListState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case FETCH_EMPLOYEES_SUCCESS:
            return {
                ...state,
                employeeListState: {
                    loading: false,
                    data:         action.payload?.data         ?? action.payload ?? [],
                    totalRecords: action.payload?.totalRecords ?? 0,
                    error: '',
                },
            };
        case FETCH_EMPLOYEES_FAILURE:
            return { ...state, employeeListState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };

        // ── SSS Contribution Table ────────────────────────────────────────────
        case FETCH_SSS_TABLE_REQUEST:
            return { ...state, sssTableState: { loading: true, data: [], error: '' } };
        case FETCH_SSS_TABLE_SUCCESS:
            return { ...state, sssTableState: { loading: false, data: action.payload?.data ?? action.payload ?? [], error: '' } };
        case FETCH_SSS_TABLE_FAILURE:
            return { ...state, sssTableState: { loading: false, data: [], error: action.payload } };
        case UPDATE_SSS_TABLE_REQUEST:
            return { ...state, updateSssTableState: { loading: true, data: null, error: '' } };
        case UPDATE_SSS_TABLE_SUCCESS:
            return { ...state, updateSssTableState: { loading: false, data: action.payload, error: '' } };
        case UPDATE_SSS_TABLE_FAILURE:
            return { ...state, updateSssTableState: { loading: false, data: null, error: action.payload } };

        // ── PhilHealth Premium Matrix ─────────────────────────────────────────
        case FETCH_PHILHEALTH_TABLE_REQUEST:
            return { ...state, philhealthTableState: { loading: true, data: {}, error: '' } };
        case FETCH_PHILHEALTH_TABLE_SUCCESS:
            return { ...state, philhealthTableState: { loading: false, data: action.payload?.data ?? action.payload ?? {}, error: '' } };
        case FETCH_PHILHEALTH_TABLE_FAILURE:
            return { ...state, philhealthTableState: { loading: false, data: {}, error: action.payload } };
        case UPDATE_PHILHEALTH_TABLE_REQUEST:
            return { ...state, updatePhilhealthTableState: { loading: true, data: null, error: '' } };
        case UPDATE_PHILHEALTH_TABLE_SUCCESS:
            return { ...state, updatePhilhealthTableState: { loading: false, data: action.payload, error: '' } };
        case UPDATE_PHILHEALTH_TABLE_FAILURE:
            return { ...state, updatePhilhealthTableState: { loading: false, data: null, error: action.payload } };

        // ── Pag-IBIG Contribution Table ───────────────────────────────────────
        case FETCH_PAGIBIG_TABLE_REQUEST:
            return { ...state, pagibigTableState: { loading: true, data: {}, error: '' } };
        case FETCH_PAGIBIG_TABLE_SUCCESS:
            return { ...state, pagibigTableState: { loading: false, data: action.payload?.data ?? action.payload ?? {}, error: '' } };
        case FETCH_PAGIBIG_TABLE_FAILURE:
            return { ...state, pagibigTableState: { loading: false, data: {}, error: action.payload } };
        case UPDATE_PAGIBIG_TABLE_REQUEST:
            return { ...state, updatePagibigTableState: { loading: true, data: null, error: '' } };
        case UPDATE_PAGIBIG_TABLE_SUCCESS:
            return { ...state, updatePagibigTableState: { loading: false, data: action.payload, error: '' } };
        case UPDATE_PAGIBIG_TABLE_FAILURE:
            return { ...state, updatePagibigTableState: { loading: false, data: null, error: action.payload } };

        // ── Employee Custom Deductions ────────────────────────────────────────
        case FETCH_EMPLOYEE_DEDUCTIONS_REQUEST:
            return { ...state, employeeDeductionsState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case FETCH_EMPLOYEE_DEDUCTIONS_SUCCESS:
            return {
                ...state,
                employeeDeductionsState: {
                    loading: false,
                    data: action.payload?.data ?? action.payload ?? [],
                    totalRecords: action.payload?.totalRecords ?? 0,
                    error: '',
                },
            };
        case FETCH_EMPLOYEE_DEDUCTIONS_FAILURE:
            return { ...state, employeeDeductionsState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };
        
        case CREATE_EMPLOYEE_DEDUCTION_REQUEST:
            return { ...state, createDeductionState: { loading: true, data: null, error: '' } };
        case CREATE_EMPLOYEE_DEDUCTION_SUCCESS:
            return { ...state, createDeductionState: { loading: false, data: action.payload, error: '' } };
        case CREATE_EMPLOYEE_DEDUCTION_FAILURE:
            return { ...state, createDeductionState: { loading: false, data: null, error: action.payload } };

        case UPDATE_EMPLOYEE_DEDUCTION_REQUEST:
            return { ...state, updateDeductionState: { loading: true, data: null, error: '' } };
        case UPDATE_EMPLOYEE_DEDUCTION_SUCCESS:
            return { ...state, updateDeductionState: { loading: false, data: action.payload, error: '' } };
        case UPDATE_EMPLOYEE_DEDUCTION_FAILURE:
            return { ...state, updateDeductionState: { loading: false, data: null, error: action.payload } };

        case DELETE_EMPLOYEE_DEDUCTION_REQUEST:
            return { ...state, deleteDeductionState: { loading: true, data: null, error: '' } };
        case DELETE_EMPLOYEE_DEDUCTION_SUCCESS:
            return { ...state, deleteDeductionState: { loading: false, data: action.payload, error: '' } };
        case DELETE_EMPLOYEE_DEDUCTION_FAILURE:
            return { ...state, deleteDeductionState: { loading: false, data: null, error: action.payload } };

        default:
            return state;
    }
}
export default hrReducer;