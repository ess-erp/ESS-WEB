// ══════════════════════════════════════════════════════════════════════════════
// FINANCE STATE - REDUCER
// ══════════════════════════════════════════════════════════════════════════════
// Manages Finance Head Payroll Process state
// User Role: Finance Head (userRoleId = 4)
// ══════════════════════════════════════════════════════════════════════════════

import {
    FETCH_PAYROLL_PROCESS_TABLE_REQUEST,
    FETCH_PAYROLL_PROCESS_TABLE_SUCCESS,
    FETCH_PAYROLL_PROCESS_TABLE_FAILURE,
    APPROVE_PAYROLL_BATCH_REQUEST,
    APPROVE_PAYROLL_BATCH_SUCCESS,
    APPROVE_PAYROLL_BATCH_FAILURE,
    REJECT_PAYROLL_BATCH_REQUEST,
    REJECT_PAYROLL_BATCH_SUCCESS,
    REJECT_PAYROLL_BATCH_FAILURE,
} from "./ActionType";

// ── Initial State ──────────────────────────────────────────────────────────────

const initialState = {
    // Payroll Process Table
    payrollProcessTable: {
        loading: false,
        data: [],
        totalRecords: 0,
        error: null,
    },
    
    // Approval/Rejection Actions
    approvalAction: {
        loading: false,
        success: false,
        error: null,
    },
};

// ── Reducer Function ───────────────────────────────────────────────────────────

const financeReducer = (state = initialState, action) => {
    switch (action.type) {
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

        // ── Default ────────────────────────────────────────────────────────────
        default:
            return state;
    }
};

export default financeReducer;
