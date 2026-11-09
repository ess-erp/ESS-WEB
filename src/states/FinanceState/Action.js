// ══════════════════════════════════════════════════════════════════════════════
// FINANCE STATE - ACTION CREATORS
// ══════════════════════════════════════════════════════════════════════════════
// For Finance Head Dashboard and Payroll Process Management
// User Role: Finance Head (userRoleId = 20)
// ══════════════════════════════════════════════════════════════════════════════

// ── Action Type Imports (Consolidated) ────────────────────────────────────────
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

import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1: FETCH / GET ACTIONS (Data Retrieval)
// ══════════════════════════════════════════════════════════════════════════════
// All data fetching operations use POSITIONAL PARAMETERS
// ══════════════════════════════════════════════════════════════════════════════

// ── Fetch Dashboard Summary Metrics ────────────────────────────────────────────

export const fetchFinanceDashboardSummaryRequest = () => ({ 
    type: FETCH_FINANCE_DASHBOARD_SUMMARY_REQUEST 
});

export const fetchFinanceDashboardSummarySuccess = (data) => ({ 
    type: FETCH_FINANCE_DASHBOARD_SUMMARY_SUCCESS, 
    payload: data 
});

export const fetchFinanceDashboardSummaryFailure = (error) => ({ 
    type: FETCH_FINANCE_DASHBOARD_SUMMARY_FAILURE, 
    payload: error 
});

/**
 * Fetch Finance Dashboard Summary Metrics
 * Returns: Total Pending Payrolls, Total Budget Required, Total Employees Processed
 * 
 * @returns {Object} { ok: boolean, data: object }
 */
export const fetchFinanceDashboardSummary = () => async (dispatch) => {
    dispatch(fetchFinanceDashboardSummaryRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/dashboard-summary`;

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

        const res = await response.json();
        dispatch(fetchFinanceDashboardSummarySuccess(res));
        return { ok: true, data: res.data };
    } catch (error) {
        dispatch(fetchFinanceDashboardSummaryFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Fetch Payroll Process Table ────────────────────────────────────────────────

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
 * Fetch Payroll Process Table (Using Positional Parameters - No DTO Wrapper)
 * Displays generated payroll batches sent to Finance Head for approval
 * 
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 10)
 * @param {string} search - Search term (default: '')
 * @param {string} status - Status filter: 'Pending', 'Approved', 'Rejected', '' (default: '')
 * @returns {Object} { ok: boolean, data: array, totalRecords: number }
 */
export const fetchPayrollProcessTable = (page = 1, pageSize = 10, search = '', status = '') => async (dispatch) => {
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

        const res = await response.json();
        dispatch(fetchPayrollProcessTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    } catch (error) {
        dispatch(fetchPayrollProcessTableFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Fetch Payroll Batch Details ────────────────────────────────────────────────

export const fetchPayrollBatchDetailsRequest = () => ({ 
    type: FETCH_PAYROLL_BATCH_DETAILS_REQUEST 
});

export const fetchPayrollBatchDetailsSuccess = (data) => ({ 
    type: FETCH_PAYROLL_BATCH_DETAILS_SUCCESS, 
    payload: data 
});

export const fetchPayrollBatchDetailsFailure = (error) => ({ 
    type: FETCH_PAYROLL_BATCH_DETAILS_FAILURE, 
    payload: error 
});

/**
 * Fetch Payroll Batch Details (For Modal View)
 * Returns itemized breakdown of employee payroll entries, deductions, allowances, and net pay
 * 
 * @param {number} batchId - Payroll batch ID
 * @param {number} page - Page number for pagination within modal (default: 1)
 * @param {number} pageSize - Items per page (default: 50)
 * @returns {Object} { ok: boolean, data: object }
 */
export const fetchPayrollBatchDetails = (batchId, page = 1, pageSize = 50) => async (dispatch) => {
    dispatch(fetchPayrollBatchDetailsRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });
        
        const url = `${baseUrl}/hr/payroll-batch-details/${batchId}?${params}`;

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

        const res = await response.json();
        dispatch(fetchPayrollBatchDetailsSuccess(res));
        return { ok: true, data: res.data };
    } catch (error) {
        dispatch(fetchPayrollBatchDetailsFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2: MUTATION ACTIONS (CREATE / UPDATE / DELETE)
// ══════════════════════════════════════════════════════════════════════════════
// All data modification operations use PAYLOAD/OBJECT parameters
// ══════════════════════════════════════════════════════════════════════════════

// ── Approve Payroll Batch ──────────────────────────────────────────────────────

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
export const approvePayrollBatch = (payload) => async (dispatch) => {
    dispatch(approvePayrollBatchRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/approve-payroll`;

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
        dispatch(approvePayrollBatchSuccess(res));
        return { ok: true, message: res.message || 'Payroll batch approved successfully' };
    } catch (error) {
        dispatch(approvePayrollBatchFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// ── Reject Payroll Batch ───────────────────────────────────────────────────────

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

// ── Export Payroll Report ──────────────────────────────────────────────────────

export const exportPayrollReportRequest = () => ({ 
    type: EXPORT_PAYROLL_REPORT_REQUEST 
});

export const exportPayrollReportSuccess = (data) => ({ 
    type: EXPORT_PAYROLL_REPORT_SUCCESS, 
    payload: data 
});

export const exportPayrollReportFailure = (error) => ({ 
    type: EXPORT_PAYROLL_REPORT_FAILURE, 
    payload: error 
});

/**
 * Export Payroll Report
 * Generates and downloads Excel/PDF report for the selected payroll batch
 * 
 * @param {Object} payload - Export data
 * @param {number} payload.batchId - Payroll batch ID
 * @param {string} payload.format - Export format: 'excel' or 'pdf'
 * @returns {Object} { ok: boolean, message: string, fileUrl: string }
 */
export const exportPayrollReport = (payload) => async (dispatch) => {
    dispatch(exportPayrollReportRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/export-payroll-report`;

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

        // Check if response is a file blob or JSON
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const res = await response.json();
            dispatch(exportPayrollReportSuccess(res));
            return { ok: true, message: res.message, fileUrl: res.fileUrl };
        } else {
            // Handle blob response (direct file download)
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `Payroll_Report_${payload.batchId}.${payload.format === 'pdf' ? 'pdf' : 'xlsx'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            dispatch(exportPayrollReportSuccess({ message: 'Report downloaded successfully' }));
            return { ok: true, message: 'Report downloaded successfully' };
        }
    } catch (error) {
        dispatch(exportPayrollReportFailure(error.message));
        return { ok: false, error: error.message };
    }
};
