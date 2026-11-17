// ══════════════════════════════════════════════════════════════════════════════
// FINANCE STATE - ACTION CREATORS
// ══════════════════════════════════════════════════════════════════════════════
// For Finance Head Payroll Process Management
// User Role: Finance Head (userRoleId = 4)
// ══════════════════════════════════════════════════════════════════════════════

// ── Action Type Imports ────────────────────────────────────────────────────────
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

import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

// ══════════════════════════════════════════════════════════════════════════════
// FETCH PAYROLL PROCESS TABLE
// ══════════════════════════════════════════════════════════════════════════════

export const fetchPayrollProcessTableRequest = () => ({ 
    type: FETCH_PAYROLL_PROCESS_TABLE_REQUEST 
});

export const fetchPayrollProcessTableSuccess = (data) => ({ 
    type: FETCH_PAYROLL_PROCESS_TABLE_SUCCESS, 
    payload: data 
});

export const fetchPayrollProcessTableFailure = (error) => ({ 
    type: FETCH_PAYROLL_PROCESS_TABLE_FAILURE, 
    payload: error 
});

/**
 * Fetch Payroll Process Table
 * Displays generated payroll batches sent to Finance Head for approval
 * Uses query parameters: ?page=1&pageSize=10&search=&status=
 * 
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 10)
 * @param {string} search - Search term (default: '')
 * @param {string} status - Status filter: 'Pending', 'Approved', 'Rejected', '' (default: '')
 * @returns {Object} { ok: boolean, data: array, totalRecords: number }
 */
export const fetchPayrollProcessTable = (page = 1, pageSize = 10, search = '', status = '') => async (dispatch) => {
    console.log('🔥 fetchPayrollProcessTable CALLED:', { page, pageSize, search, status });
    dispatch(fetchPayrollProcessTableRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            search: search || '',
            status: status || ''
        });
        
        const url = `${baseUrl}/hr/finance-payroll-batches?${params}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        console.log(response);
        const res = await response.json();
        console.log(res);
        dispatch(fetchPayrollProcessTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    } catch (error) {
        dispatch(fetchPayrollProcessTableFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// APPROVE PAYROLL BATCH
// ══════════════════════════════════════════════════════════════════════════════

export const approvePayrollBatchRequest = () => ({ 
    type: APPROVE_PAYROLL_BATCH_REQUEST 
});

export const approvePayrollBatchSuccess = (data) => ({ 
    type: APPROVE_PAYROLL_BATCH_SUCCESS, 
    payload: data 
});

export const approvePayrollBatchFailure = (error) => ({ 
    type: APPROVE_PAYROLL_BATCH_FAILURE, 
    payload: error 
});

/**
 * Approve Payroll Batch
 * Triggers the approval process for the selected payroll batch
 * 
 * @param {Object} payload - Approval data
 * @param {number} payload.batchId - Payroll batch ID
 * @param {string} payload.remarks - Optional approval remarks
 * @returns {Object} { ok: boolean, message: string }
 */
export const approvePayrollBatch = (payrollMasterId, remarks) => async (dispatch) => {
    dispatch(approvePayrollBatchRequest());
    try {
        console.log(payrollMasterId);
        const token = getToken();
        const url = `${baseUrl}/hr/approve-payroll?payrollMasterId=${payrollMasterId}&remarks=${remarks}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = await response.json();
        dispatch(approvePayrollBatchSuccess(res));
        return { ok: true, message: res.message || 'Payroll batch approved successfully' };
    } catch (error) {
        dispatch(approvePayrollBatchFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// REJECT PAYROLL BATCH
// ══════════════════════════════════════════════════════════════════════════════

export const rejectPayrollBatchRequest = () => ({ 
    type: REJECT_PAYROLL_BATCH_REQUEST 
});

export const rejectPayrollBatchSuccess = (data) => ({ 
    type: REJECT_PAYROLL_BATCH_SUCCESS, 
    payload: data 
});

export const rejectPayrollBatchFailure = (error) => ({ 
    type: REJECT_PAYROLL_BATCH_FAILURE, 
    payload: error 
});

/**
 * Reject Payroll Batch
 * Rejects the selected payroll batch with mandatory reason
 * 
 * @param {Object} payload - Rejection data
 * @param {number} payload.batchId - Payroll batch ID
 * @param {string} payload.reason - Rejection reason (required)
 * @returns {Object} { ok: boolean, message: string }
 */
export const rejectPayrollBatch = (payload) => async (dispatch) => {
    dispatch(rejectPayrollBatchRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/reject-payroll`;

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
        dispatch(rejectPayrollBatchSuccess(res));
        return { ok: true, message: res.message || 'Payroll batch rejected successfully' };
    } catch (error) {
        dispatch(rejectPayrollBatchFailure(error.message));
        return { ok: false, error: error.message };
    }
};
