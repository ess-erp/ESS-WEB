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
    FETCH_PAYROLL_PERIODS_REQUEST, FETCH_PAYROLL_PERIODS_SUCCESS, FETCH_PAYROLL_PERIODS_FAILURE,
    FETCH_PAYROLL_PERIOD_DROPDOWN_REQUEST, FETCH_PAYROLL_PERIOD_DROPDOWN_SUCCESS, FETCH_PAYROLL_PERIOD_DROPDOWN_FAILURE,
    CREATE_PAYROLL_PERIOD_REQUEST, CREATE_PAYROLL_PERIOD_SUCCESS, CREATE_PAYROLL_PERIOD_FAILURE,
    UPDATE_PAYROLL_PERIOD_REQUEST, UPDATE_PAYROLL_PERIOD_SUCCESS, UPDATE_PAYROLL_PERIOD_FAILURE,
    DELETE_PAYROLL_PERIOD_REQUEST, DELETE_PAYROLL_PERIOD_SUCCESS, DELETE_PAYROLL_PERIOD_FAILURE,
    INSERT_PAYROLL_PERIOD_REQUEST, INSERT_PAYROLL_PERIOD_SUCCESS, INSERT_PAYROLL_PERIOD_FAILURE,
    CALCULATE_PAYROLL_REQUEST, CALCULATE_PAYROLL_SUCCESS, CALCULATE_PAYROLL_FAILURE,
    POST_JOURNAL_ENTRY_REQUEST, POST_JOURNAL_ENTRY_SUCCESS, POST_JOURNAL_ENTRY_FAILURE,
    CREATE_MANUAL_ATTENDANCE_REQUEST, CREATE_MANUAL_ATTENDANCE_SUCCESS, CREATE_MANUAL_ATTENDANCE_FAILURE,
    CREATE_MANUAL_LEAVE_REQUEST, CREATE_MANUAL_LEAVE_SUCCESS, CREATE_MANUAL_LEAVE_FAILURE,
    FETCH_ALL_EMPLOYEES_REQUEST, FETCH_ALL_EMPLOYEES_SUCCESS, FETCH_ALL_EMPLOYEES_FAILURE,
    CALCULATE_PAYROLL_FOR_PERIOD_REQUEST, CALCULATE_PAYROLL_FOR_PERIOD_SUCCESS, CALCULATE_PAYROLL_FOR_PERIOD_FAILURE,
    FETCH_PAYROLL_DETAILS_REQUEST, FETCH_PAYROLL_DETAILS_SUCCESS, FETCH_PAYROLL_DETAILS_FAILURE,
    FINALIZE_PAYROLL_REQUEST, FINALIZE_PAYROLL_SUCCESS, FINALIZE_PAYROLL_FAILURE,
    POST_PAYROLL_TO_JOURNAL_REQUEST, POST_PAYROLL_TO_JOURNAL_SUCCESS, POST_PAYROLL_TO_JOURNAL_FAILURE,
    FETCH_PAYROLL_JOURNAL_ENTRY_REQUEST, FETCH_PAYROLL_JOURNAL_ENTRY_SUCCESS, FETCH_PAYROLL_JOURNAL_ENTRY_FAILURE,
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
    
    // Payroll Period Templates
    payrollPeriodsState:    { loading: false, data: [], error: '', totalRecords: 0 },
    payrollPeriodDropdownState: { loading: false, data: [], error: '' },
    createPayrollPeriodState: { loading: false, data: null, error: '' },
    updatePayrollPeriodState: { loading: false, data: null, error: '' },
    deletePayrollPeriodState: { loading: false, data: null, error: '' },
    insertPayrollPeriodState: { loading: false, data: null, error: '' },
    
    // Payroll Processing Module
    calculatePayrollForPeriodState: { loading: false, data: null, error: '' },
    payrollDetailsState: { loading: false, data: null, error: '' },
    finalizePayrollState: { loading: false, data: null, error: '' },
    postPayrollToJournalState: { loading: false, data: null, error: '' },
    payrollJournalEntryState: { loading: false, data: null, error: '' },
    
    // Payroll Processing
    calculatePayrollState: { loading: false, data: null, error: '' },
    postJournalEntryState: { loading: false, data: null, error: '' },
    
    // Leave Credit Management
    employeeLeaveCreditsState: { loading: false, data: [], error: '', totalRecords: 0 },
    updateLeaveCreditsState: { loading: false, data: null, error: '', success: false },
    schoolCalendarDropdownState: { loading: false, data: [], error: '' },
    
    // Employee Resume
    employeeResumeState: { loading: false, data: null, error: '' },
    
    // Manual Attendance Entry
    createManualAttendanceState: { loading: false, data: null, error: '' },
    
    // Manual Leave Filing
    createManualLeaveState: { loading: false, data: null, error: '' },
    
    // All Employees (for dropdowns)
    allEmployeesState: { loading: false, data: [], error: '' },
    
    // Unified Employee Search (for datatables and dropdowns)
    searchEmployeesState: { loading: false, data: [], error: '', totalRecords: 0 },
    
    // Leave Applications Datatable
    leaveApplicationsState: { loading: false, data: [], error: '', totalRecords: 0 },
    
    // DTR Records Datatable
    dtrRecordsState: { loading: false, data: [], error: '', totalRecords: 0 },
    
    // Employee Leave Balance (for leave filing workflow)
    employeeLeaveBalanceState: { loading: false, data: null, error: '' },
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

        // ── Payroll Period Templates ──────────────────────────────────────────
        case FETCH_PAYROLL_PERIODS_REQUEST:
            return { ...state, payrollPeriodsState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case FETCH_PAYROLL_PERIODS_SUCCESS:
            return {
                ...state,
                payrollPeriodsState: {
                    loading: false,
                    data: action.payload?.data ?? action.payload ?? [],
                    error: '',
                    totalRecords: action.payload?.totalRecords ?? 0
                }
            };
        case FETCH_PAYROLL_PERIODS_FAILURE:
            return { ...state, payrollPeriodsState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };

        case FETCH_PAYROLL_PERIOD_DROPDOWN_REQUEST:
            return { ...state, payrollPeriodDropdownState: { loading: true, data: [], error: '' } };
        case FETCH_PAYROLL_PERIOD_DROPDOWN_SUCCESS:
            return {
                ...state,
                payrollPeriodDropdownState: {
                    loading: false,
                    data: action.payload?.data ?? action.payload ?? [],
                    error: ''
                }
            };
        case FETCH_PAYROLL_PERIOD_DROPDOWN_FAILURE:
            return { ...state, payrollPeriodDropdownState: { loading: false, data: [], error: action.payload } };

        case CREATE_PAYROLL_PERIOD_REQUEST:
            return { ...state, createPayrollPeriodState: { loading: true, data: null, error: '' } };
        case CREATE_PAYROLL_PERIOD_SUCCESS:
            return { ...state, createPayrollPeriodState: { loading: false, data: action.payload, error: '' } };
        case CREATE_PAYROLL_PERIOD_FAILURE:
            return { ...state, createPayrollPeriodState: { loading: false, data: null, error: action.payload } };

        case UPDATE_PAYROLL_PERIOD_REQUEST:
            return { ...state, updatePayrollPeriodState: { loading: true, data: null, error: '' } };
        case UPDATE_PAYROLL_PERIOD_SUCCESS:
            return { ...state, updatePayrollPeriodState: { loading: false, data: action.payload, error: '' } };
        case UPDATE_PAYROLL_PERIOD_FAILURE:
            return { ...state, updatePayrollPeriodState: { loading: false, data: null, error: action.payload } };

        case DELETE_PAYROLL_PERIOD_REQUEST:
            return { ...state, deletePayrollPeriodState: { loading: true, data: null, error: '' } };
        case DELETE_PAYROLL_PERIOD_SUCCESS:
            return { ...state, deletePayrollPeriodState: { loading: false, data: action.payload, error: '' } };
        case DELETE_PAYROLL_PERIOD_FAILURE:
            return { ...state, deletePayrollPeriodState: { loading: false, data: null, error: action.payload } };

        case INSERT_PAYROLL_PERIOD_REQUEST:
            return { ...state, insertPayrollPeriodState: { loading: true, data: null, error: '' } };
        case INSERT_PAYROLL_PERIOD_SUCCESS:
            return { ...state, insertPayrollPeriodState: { loading: false, data: action.payload, error: '' } };
        case INSERT_PAYROLL_PERIOD_FAILURE:
            return { ...state, insertPayrollPeriodState: { loading: false, data: null, error: action.payload } };

        // ── Payroll Processing ────────────────────────────────────────────────
        case CALCULATE_PAYROLL_REQUEST:
            return { ...state, calculatePayrollState: { loading: true, data: null, error: '' } };
        case CALCULATE_PAYROLL_SUCCESS:
            return { ...state, calculatePayrollState: { loading: false, data: action.payload, error: '' } };
        case CALCULATE_PAYROLL_FAILURE:
            return { ...state, calculatePayrollState: { loading: false, data: null, error: action.payload } };

        case POST_JOURNAL_ENTRY_REQUEST:
            return { ...state, postJournalEntryState: { loading: true, data: null, error: '' } };
        case POST_JOURNAL_ENTRY_SUCCESS:
            return { ...state, postJournalEntryState: { loading: false, data: action.payload, error: '' } };
        case POST_JOURNAL_ENTRY_FAILURE:
            return { ...state, postJournalEntryState: { loading: false, data: null, error: action.payload } };

        // ── Leave Credit Management ────────────────────────────────────────────
        case 'FETCH_EMPLOYEE_LEAVE_CREDITS_REQUEST':
            return { ...state, employeeLeaveCreditsState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case 'FETCH_EMPLOYEE_LEAVE_CREDITS_SUCCESS':
            return {
                ...state,
                employeeLeaveCreditsState: {
                    loading: false,
                    data: action.payload.data || [],
                    error: '',
                    totalRecords: action.payload.totalRecords || 0
                }
            };
        case 'FETCH_EMPLOYEE_LEAVE_CREDITS_FAILURE':
            return { ...state, employeeLeaveCreditsState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };

        case 'UPDATE_EMPLOYEE_LEAVE_CREDITS_REQUEST':
            return { ...state, updateLeaveCreditsState: { loading: true, data: null, error: '', success: false } };
        case 'UPDATE_EMPLOYEE_LEAVE_CREDITS_SUCCESS':
            return { ...state, updateLeaveCreditsState: { loading: false, data: action.payload, error: '', success: true } };
        case 'UPDATE_EMPLOYEE_LEAVE_CREDITS_FAILURE':
            return { ...state, updateLeaveCreditsState: { loading: false, data: null, error: action.payload, success: false } };

        case 'FETCH_SCHOOL_CALENDAR_DROPDOWN_REQUEST':
            return { ...state, schoolCalendarDropdownState: { loading: true, data: [], error: '' } };
        case 'FETCH_SCHOOL_CALENDAR_DROPDOWN_SUCCESS':
            return {
                ...state,
                schoolCalendarDropdownState: {
                    loading: false,
                    data: action.payload.data || [],
                    error: ''
                }
            };
        case 'FETCH_SCHOOL_CALENDAR_DROPDOWN_FAILURE':
            return { ...state, schoolCalendarDropdownState: { loading: false, data: [], error: action.payload } };

        // ── Employee Resume ────────────────────────────────────────────────────
        case 'FETCH_EMPLOYEE_RESUME_REQUEST':
            return { ...state, employeeResumeState: { loading: true, data: null, error: '' } };
        case 'FETCH_EMPLOYEE_RESUME_SUCCESS':
            return { ...state, employeeResumeState: { loading: false, data: action.payload, error: '' } };
        case 'FETCH_EMPLOYEE_RESUME_FAILURE':
            return { ...state, employeeResumeState: { loading: false, data: null, error: action.payload } };

        // ─── Manual Attendance Entry ──────────────────────────────────────────────
        case CREATE_MANUAL_ATTENDANCE_REQUEST:
            return { ...state, createManualAttendanceState: { loading: true, data: null, error: '' } };
        case CREATE_MANUAL_ATTENDANCE_SUCCESS:
            return { ...state, createManualAttendanceState: { loading: false, data: action.payload, error: '' } };
        case CREATE_MANUAL_ATTENDANCE_FAILURE:
            return { ...state, createManualAttendanceState: { loading: false, data: null, error: action.payload } };

        // ─── Manual Leave Filing ──────────────────────────────────────────────────
        case CREATE_MANUAL_LEAVE_REQUEST:
            return { ...state, createManualLeaveState: { loading: true, data: null, error: '' } };
        case CREATE_MANUAL_LEAVE_SUCCESS:
            return { ...state, createManualLeaveState: { loading: false, data: action.payload, error: '' } };
        case CREATE_MANUAL_LEAVE_FAILURE:
            return { ...state, createManualLeaveState: { loading: false, data: null, error: action.payload } };

        // ─── Fetch All Employees ──────────────────────────────────────────────────
        case FETCH_ALL_EMPLOYEES_REQUEST:
            return { ...state, allEmployeesState: { loading: true, data: [], error: '' } };
        case FETCH_ALL_EMPLOYEES_SUCCESS:
            return { ...state, allEmployeesState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ALL_EMPLOYEES_FAILURE:
            return { ...state, allEmployeesState: { loading: false, data: [], error: action.payload } };

        // ─── Search Employees (Unified) ──────────────────────────────────────────
        case 'SEARCH_EMPLOYEES_REQUEST':
            return { ...state, searchEmployeesState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case 'SEARCH_EMPLOYEES_SUCCESS':
            return {
                ...state,
                searchEmployeesState: {
                    loading: false,
                    data: action.payload.data || [],
                    error: '',
                    totalRecords: action.payload.totalRecords || 0
                }
            };
        case 'SEARCH_EMPLOYEES_FAILURE':
            return { ...state, searchEmployeesState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };

        // ─── Leave Applications Datatable ────────────────────────────────────────
        case 'FETCH_LEAVE_APPLICATIONS_REQUEST':
            return { ...state, leaveApplicationsState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case 'FETCH_LEAVE_APPLICATIONS_SUCCESS':
            return {
                ...state,
                leaveApplicationsState: {
                    loading: false,
                    data: action.payload.data || [],
                    error: '',
                    totalRecords: action.payload.totalRecords || 0
                }
            };
        case 'FETCH_LEAVE_APPLICATIONS_FAILURE':
            return { ...state, leaveApplicationsState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };

        // ─── DTR Records Datatable ───────────────────────────────────────────────
        case 'FETCH_DTR_RECORDS_REQUEST':
            return { ...state, dtrRecordsState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case 'FETCH_DTR_RECORDS_SUCCESS':
            return {
                ...state,
                dtrRecordsState: {
                    loading: false,
                    data: action.payload.data || [],
                    error: '',
                    totalRecords: action.payload.totalRecords || 0
                }
            };
        case 'FETCH_DTR_RECORDS_FAILURE':
            return { ...state, dtrRecordsState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };

        // ─── Employee Leave Balance ──────────────────────────────────────────────
        case 'FETCH_EMPLOYEE_LEAVE_BALANCE_REQUEST':
            return { ...state, employeeLeaveBalanceState: { loading: true, data: null, error: '' } };
        case 'FETCH_EMPLOYEE_LEAVE_BALANCE_SUCCESS':
            return { ...state, employeeLeaveBalanceState: { loading: false, data: action.payload.data, error: '' } };
        case 'FETCH_EMPLOYEE_LEAVE_BALANCE_FAILURE':
            return { ...state, employeeLeaveBalanceState: { loading: false, data: null, error: action.payload } };

        // ══════════════════════════════════════════════════════════════════════════
        // PAYROLL PROCESSING MODULE REDUCERS
        // ══════════════════════════════════════════════════════════════════════════

        // Calculate Payroll for Period
        case CALCULATE_PAYROLL_FOR_PERIOD_REQUEST:
            return { ...state, calculatePayrollForPeriodState: { loading: true, data: null, error: '' } };
        case CALCULATE_PAYROLL_FOR_PERIOD_SUCCESS:
            return { ...state, calculatePayrollForPeriodState: { loading: false, data: action.payload, error: '' } };
        case CALCULATE_PAYROLL_FOR_PERIOD_FAILURE:
            return { ...state, calculatePayrollForPeriodState: { loading: false, data: null, error: action.payload } };

        // Fetch Payroll Details
        case FETCH_PAYROLL_DETAILS_REQUEST:
            return { ...state, payrollDetailsState: { loading: true, data: null, error: '' } };
        case FETCH_PAYROLL_DETAILS_SUCCESS:
            return { ...state, payrollDetailsState: { loading: false, data: action.payload.data, error: '' } };
        case FETCH_PAYROLL_DETAILS_FAILURE:
            return { ...state, payrollDetailsState: { loading: false, data: null, error: action.payload } };

        // Finalize Payroll
        case FINALIZE_PAYROLL_REQUEST:
            return { ...state, finalizePayrollState: { loading: true, data: null, error: '' } };
        case FINALIZE_PAYROLL_SUCCESS:
            return { ...state, finalizePayrollState: { loading: false, data: action.payload, error: '' } };
        case FINALIZE_PAYROLL_FAILURE:
            return { ...state, finalizePayrollState: { loading: false, data: null, error: action.payload } };

        // Post Payroll to Journal
        case POST_PAYROLL_TO_JOURNAL_REQUEST:
            return { ...state, postPayrollToJournalState: { loading: true, data: null, error: '' } };
        case POST_PAYROLL_TO_JOURNAL_SUCCESS:
            return { ...state, postPayrollToJournalState: { loading: false, data: action.payload, error: '' } };
        case POST_PAYROLL_TO_JOURNAL_FAILURE:
            return { ...state, postPayrollToJournalState: { loading: false, data: null, error: action.payload } };

        // Fetch Payroll Journal Entry
        case FETCH_PAYROLL_JOURNAL_ENTRY_REQUEST:
            return { ...state, payrollJournalEntryState: { loading: true, data: null, error: '' } };
        case FETCH_PAYROLL_JOURNAL_ENTRY_SUCCESS:
            return { ...state, payrollJournalEntryState: { loading: false, data: action.payload.data, error: '' } };
        case FETCH_PAYROLL_JOURNAL_ENTRY_FAILURE:
            return { ...state, payrollJournalEntryState: { loading: false, data: null, error: action.payload } };

        default:
            return state;
    }
}
export default hrReducer;

