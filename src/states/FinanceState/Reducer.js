// ══════════════════════════════════════════════════════════════════════════════
// FINANCE STATE - REDUCER
// ══════════════════════════════════════════════════════════════════════════════
// Manages Finance Head Dashboard and Payroll Process state
// ══════════════════════════════════════════════════════════════════════════════

import {
    FETCH_FINANCE_DASHBOARD_SUMMARY_REQUEST,
    FETCH_FINANCE_DASHBOARD_SUMMARY_SUCCESS,
    FETCH_FINANCE_DASHBOARD_SUMMARY_FAILURE,
    FETCH_PAYROLL_PROCESS_TABLE_REQUEST,
    FETCH_PAYROLL_PROCESS_TABLE_SUCCESS,
    FETCH_PAYROLL_PROCESS_TABLE_FAILURE,
    FETCH_PAYROLL_BATCH_DETAILS_REQUEST,
    FETCH_PAYROLL_BATCH_DETAILS_SUCCESS,
    FETCH_PAYROLL_BATCH_DETAILS_FAILURE,
    APPROVE_PAYROLL_BATCH_REQUEST,
    APPROVE_PAYROLL_BATCH_SUCCESS,
    APPROVE_PAYROLL_BATCH_FAILURE,
    REJECT_PAYROLL_BATCH_REQUEST,
    REJECT_PAYROLL_BATCH_SUCCESS,
    REJECT_PAYROLL_BATCH_FAILURE,
    EXPORT_PAYROLL_REPORT_REQUEST,
    EXPORT_PAYROLL_REPORT_SUCCESS,
    EXPORT_PAYROLL_REPORT_FAILURE,
} from "./ActionType";

// ── Initial State ──────────────────────────────────────────────────────────────

const initialState = {
    // Dashboard Summary
    dashboardSummary: {
        loading: false,
        data: {
            totalPendingPayrolls: 0,
            totalBudgetRequired: 0,
            totalEmployeesProcessed: 0,
            pendingAmount: 0,
            approvedAmount: 0,
        },
        error: null,
    },
    
    // Payroll Process Table
    payrollProcessTable: {
        loading: false,
        data: [],
        totalRecords: 0,
        error: null,
    },
    
    // Payroll Batch Details (Modal)
    payrollBatchDetails: {
        loading: false,
        data: null,
        error: null,
    },
    
    // Approval/Rejection Actions
    approvalAction: {
        loading: false,
        success: false,
        error: null,
    },
    
    // Export Report
    exportReport: {
        loading: false,
        success: false,
        error: null,
    },
};

// ── Reducer Function ───────────────────────────────────────────────────────────

const financeReducer = (state = initialState, action) => {
    switch (action.type) {
        // ── Dashboard Summary ──────────────────────────────────────────────────
        case FETCH_FINANCE_DASHBOARD_SUMMARY_REQUEST:
            return {
                ...state,
                dashboardSummary: {
                    ...state.dashboardSummary,
                    loading: true,
                    error: null,
                },
            };

        case FETCH_FINANCE_DASHBOARD_SUMMARY_SUCCESS:
            return {
                ...state,
                dashboardSummary: {
                    loading: false,
                    data: action.payload.data || action.payload,
                    error: null,
                },
            };

        case FETCH_FINANCE_DASHBOARD_SUMMARY_FAILURE:
            return {
                ...state,
                dashboardSummary: {
                    ...state.dashboardSummary,
                    loading: false,
                    error: action.payload,
                },
            };

        // ── Payroll Process Table ──────────────────────────────────────────────
        case FETCH_PAYROLL_PROCESS_TABLE_REQUEST:
            return {
                ...state,
                payrollProcessTable: {
                    ...state.payrollProcessTable,
                    loading: true,
                    error: null,
                },
            };

        case FETCH_PAYROLL_PROCESS_TABLE_SUCCESS:
            return {
                ...state,
                payrollProcessTable: {
                    loading: false,
                    data: action.payload.data || [],
                    totalRecords: action.payload.totalRecords || 0,
                    error: null,
                },
            };

        case FETCH_PAYROLL_PROCESS_TABLE_FAILURE:
            return {
                ...state,
                payrollProcessTable: {
                    ...state.payrollProcessTable,
                    loading: false,
                    error: action.payload,
                },
            };

        // ── Payroll Batch Details ──────────────────────────────────────────────
        case FETCH_PAYROLL_BATCH_DETAILS_REQUEST:
            return {
                ...state,
                payrollBatchDetails: {
                    loading: true,
                    data: null,
                    error: null,
                },
            };

        case FETCH_PAYROLL_BATCH_DETAILS_SUCCESS:
            return {
                ...state,
                payrollBatchDetails: {
                    loading: false,
                    data: action.payload.data || action.payload,
                    error: null,
                },
            };

        case FETCH_PAYROLL_BATCH_DETAILS_FAILURE:
            return {
                ...state,
                payrollBatchDetails: {
                    loading: false,
                    data: null,
                    error: action.payload,
                },
            };

        // ── Approve Payroll Batch ──────────────────────────────────────────────
        case APPROVE_PAYROLL_BATCH_REQUEST:
            return {
                ...state,
                approvalAction: {
                    loading: true,
                    success: false,
                    error: null,
                },
            };

        case APPROVE_PAYROLL_BATCH_SUCCESS:
            return {
                ...state,
                approvalAction: {
                    loading: false,
                    success: true,
                    error: null,
                },
            };

        case APPROVE_PAYROLL_BATCH_FAILURE:
            return {
                ...state,
                approvalAction: {
                    loading: false,
                    success: false,
                    error: action.payload,
                },
            };

        // ── Reject Payroll Batch ───────────────────────────────────────────────
        case REJECT_PAYROLL_BATCH_REQUEST:
            return {
                ...state,
                approvalAction: {
                    loading: true,
                    success: false,
                    error: null,
                },
            };

        case REJECT_PAYROLL_BATCH_SUCCESS:
            return {
                ...state,
                approvalAction: {
                    loading: false,
                    success: true,
                    error: null,
                },
            };

        case REJECT_PAYROLL_BATCH_FAILURE:
            return {
                ...state,
                approvalAction: {
                    loading: false,
                    success: false,
                    error: action.payload,
                },
            };

        // ── Export Payroll Report ──────────────────────────────────────────────
        case EXPORT_PAYROLL_REPORT_REQUEST:
            return {
                ...state,
                exportReport: {
                    loading: true,
                    success: false,
                    error: null,
                },
            };

        case EXPORT_PAYROLL_REPORT_SUCCESS:
            return {
                ...state,
                exportReport: {
                    loading: false,
                    success: true,
                    error: null,
                },
            };

        case EXPORT_PAYROLL_REPORT_FAILURE:
            return {
                ...state,
                exportReport: {
                    loading: false,
                    success: false,
                    error: action.payload,
                },
            };

        // ── Default ────────────────────────────────────────────────────────────
        default:
            return state;
    }
};

export default financeReducer;
