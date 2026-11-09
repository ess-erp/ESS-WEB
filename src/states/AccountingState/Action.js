import {
    // COA
    FETCH_GET_COA_REQUEST, FETCH_GET_COA_SUCCESS, FETCH_GET_COA_FAILURE,
    FETCH_INSERT_COA_REQUEST, FETCH_INSERT_COA_SUCCESS, FETCH_INSERT_COA_FAILURE,
    FETCH_UPDATE_COA_REQUEST, FETCH_UPDATE_COA_SUCCESS, FETCH_UPDATE_COA_FAILURE,
    // COA Dropdowns
    FETCH_GET_COA_HEADER_REQUEST, FETCH_GET_COA_HEADER_SUCCESS, FETCH_GET_COA_HEADER_FAILURE,
    FETCH_GET_COA_GROUP_REQUEST, FETCH_GET_COA_GROUP_SUCCESS, FETCH_GET_COA_GROUP_FAILURE,
    FETCH_GET_COA_ACCOUNT_REQUEST, FETCH_GET_COA_ACCOUNT_SUCCESS, FETCH_GET_COA_ACCOUNT_FAILURE,
    FETCH_GET_COA_FLAT_REQUEST, FETCH_GET_COA_FLAT_SUCCESS, FETCH_GET_COA_FLAT_FAILURE,
    // COA Cashier
    FETCH_GET_COA_CASHIER_REQUEST, FETCH_GET_COA_CASHIER_SUCCESS, FETCH_GET_COA_CASHIER_FAILURE,
    FETCH_INSERT_COA_CASHIER_REQUEST, FETCH_INSERT_COA_CASHIER_SUCCESS, FETCH_INSERT_COA_CASHIER_FAILURE,
    // Cashier List
    FETCH_GET_CASHIER_LIST_REQUEST, FETCH_GET_CASHIER_LIST_SUCCESS, FETCH_GET_CASHIER_LIST_FAILURE,
    // Student Ledger
    FETCH_GET_STUDENT_LEDGER_REQUEST, FETCH_GET_STUDENT_LEDGER_SUCCESS, FETCH_GET_STUDENT_LEDGER_FAILURE,
    FETCH_GET_STUDENT_LEDGER_DETAIL_REQUEST, FETCH_GET_STUDENT_LEDGER_DETAIL_SUCCESS, FETCH_GET_STUDENT_LEDGER_DETAIL_FAILURE,
    FETCH_CREATE_STUDENT_LEDGER_REQUEST, FETCH_CREATE_STUDENT_LEDGER_SUCCESS, FETCH_CREATE_STUDENT_LEDGER_FAILURE,
    // Journal Entry
    FETCH_GET_JOURNAL_REQUEST, FETCH_GET_JOURNAL_SUCCESS, FETCH_GET_JOURNAL_FAILURE,
    FETCH_GET_JOURNAL_DETAIL_REQUEST, FETCH_GET_JOURNAL_DETAIL_SUCCESS, FETCH_GET_JOURNAL_DETAIL_FAILURE,
    FETCH_INSERT_JOURNAL_REQUEST, FETCH_INSERT_JOURNAL_SUCCESS, FETCH_INSERT_JOURNAL_FAILURE,
    FETCH_UPDATE_JOURNAL_REQUEST, FETCH_UPDATE_JOURNAL_SUCCESS, FETCH_UPDATE_JOURNAL_FAILURE,
    FETCH_EDIT_JOURNAL_AMOUNTS_REQUEST, FETCH_EDIT_JOURNAL_AMOUNTS_SUCCESS, FETCH_EDIT_JOURNAL_AMOUNTS_FAILURE,
    FETCH_POST_JOURNAL_REQUEST, FETCH_POST_JOURNAL_SUCCESS, FETCH_POST_JOURNAL_FAILURE,
    FETCH_UPDATE_JOURNAL_STATUS_REQUEST, FETCH_UPDATE_JOURNAL_STATUS_SUCCESS, FETCH_UPDATE_JOURNAL_STATUS_FAILURE,
} from './ActionType';
import { getToken } from '../../services/tokenServices';

const baseUrl = import.meta.env.VITE_BASE_URL;

// ─── helper ──────────────────────────────────────────────────────────────────
const authHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
});

// ============================================================================
// Chart of Accounts
// ============================================================================

export const fetchGetCoaRequest = () => ({ type: FETCH_GET_COA_REQUEST });
export const fetchGetCoaSuccess = (data) => ({ type: FETCH_GET_COA_SUCCESS, payload: data });
export const fetchGetCoaFailure = (error) => ({ type: FETCH_GET_COA_FAILURE, payload: error });

export const fetchGetCoaData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetCoaRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page: page,
            pageSize: pageSize,
            search: search || ''
        });
        const res = await fetch(`${baseUrl}/accounting/get-coa?${params}`, {
            method: 'GET', headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchGetCoaSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetCoaFailure(err.message));
        return { ok: false, err: err.message };
    }
};

export const fetchInsertCoaRequest = () => ({ type: FETCH_INSERT_COA_REQUEST });
export const fetchInsertCoaSuccess = (data) => ({ type: FETCH_INSERT_COA_SUCCESS, payload: data });
export const fetchInsertCoaFailure = (error) => ({ type: FETCH_INSERT_COA_FAILURE, payload: error });

export const fetchInsertCoaData = (formData) => async (dispatch) => {
    dispatch(fetchInsertCoaRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/insert-coa`, {
            method: 'POST', headers: authHeaders(token), body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchInsertCoaSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchInsertCoaFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchUpdateCoaRequest = () => ({ type: FETCH_UPDATE_COA_REQUEST });
export const fetchUpdateCoaSuccess = (data) => ({ type: FETCH_UPDATE_COA_SUCCESS, payload: data });
export const fetchUpdateCoaFailure = (error) => ({ type: FETCH_UPDATE_COA_FAILURE, payload: error });

export const fetchUpdateCoaData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateCoaRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/update-coa`, {
            method: 'POST', headers: authHeaders(token), body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchUpdateCoaSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchUpdateCoaFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// COA Dropdowns  (header → group → account)
// ============================================================================

export const fetchGetCoaHeaderRequest = () => ({ type: FETCH_GET_COA_HEADER_REQUEST });
export const fetchGetCoaHeaderSuccess = (data) => ({ type: FETCH_GET_COA_HEADER_SUCCESS, payload: data });
export const fetchGetCoaHeaderFailure = (error) => ({ type: FETCH_GET_COA_HEADER_FAILURE, payload: error });

export const fetchGetCoaHeaderData = () => async (dispatch) => {
    dispatch(fetchGetCoaHeaderRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-coa-header`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetCoaHeaderSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetCoaHeaderFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchGetCoaGroupRequest = () => ({ type: FETCH_GET_COA_GROUP_REQUEST });
export const fetchGetCoaGroupSuccess = (data) => ({ type: FETCH_GET_COA_GROUP_SUCCESS, payload: data });
export const fetchGetCoaGroupFailure = (error) => ({ type: FETCH_GET_COA_GROUP_FAILURE, payload: error });

export const fetchGetCoaGroupData = (headerId) => async (dispatch) => {
    dispatch(fetchGetCoaGroupRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-coa-group?headerId=${headerId}`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetCoaGroupSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetCoaGroupFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchGetCoaAccountRequest = () => ({ type: FETCH_GET_COA_ACCOUNT_REQUEST });
export const fetchGetCoaAccountSuccess = (data) => ({ type: FETCH_GET_COA_ACCOUNT_SUCCESS, payload: data });
export const fetchGetCoaAccountFailure = (error) => ({ type: FETCH_GET_COA_ACCOUNT_FAILURE, payload: error });

export const fetchGetCoaAccountData = (groupId, normalBalance = null) => async (dispatch) => {
    dispatch(fetchGetCoaAccountRequest());
    try {
        const token = getToken();
        let url = `${baseUrl}/accounting/get-coa-account?groupId=${groupId}`;
        if (normalBalance) {
            url += `&normalBalance=${normalBalance}`;
        }
        const res = await fetch(url, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetCoaAccountSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetCoaAccountFailure(err.message));
        return { ok: false, err };
    }
};

// Flat account list — used in journal entry line dropdowns
export const fetchGetCoaFlatRequest = () => ({ type: FETCH_GET_COA_FLAT_REQUEST });
export const fetchGetCoaFlatSuccess = (data) => ({ type: FETCH_GET_COA_FLAT_SUCCESS, payload: data });
export const fetchGetCoaFlatFailure = (error) => ({ type: FETCH_GET_COA_FLAT_FAILURE, payload: error });

export const fetchGetCoaFlatData = () => async (dispatch) => {
    dispatch(fetchGetCoaFlatRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-coa-flat`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetCoaFlatSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetCoaFlatFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// COA Cashier Assignment
// ============================================================================

export const fetchGetCoaCashierRequest = () => ({ type: FETCH_GET_COA_CASHIER_REQUEST });
export const fetchGetCoaCashierSuccess = (data) => ({ type: FETCH_GET_COA_CASHIER_SUCCESS, payload: data });
export const fetchGetCoaCashierFailure = (error) => ({ type: FETCH_GET_COA_CASHIER_FAILURE, payload: error });

export const fetchGetCoaCashierData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetCoaCashierRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page: page,
            pageSize: pageSize,
            search: search || ''
        });
        const res = await fetch(`${baseUrl}/accounting/get-coa-cashier-list?${params}`, {
            method: 'GET', headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const response = await res.json();
        console.log(response);
        dispatch(fetchGetCoaCashierSuccess(response));
        return { ok: true, data: response.data, totalRecords: response.totalRecords };
    } catch (err) {
        dispatch(fetchGetCoaCashierFailure(err.message));
        return { ok: false, err: err.message };
    }
};

export const fetchInsertCoaCashierRequest = () => ({ type: FETCH_INSERT_COA_CASHIER_REQUEST });
export const fetchInsertCoaCashierSuccess = (data) => ({ type: FETCH_INSERT_COA_CASHIER_SUCCESS, payload: data });
export const fetchInsertCoaCashierFailure = (error) => ({ type: FETCH_INSERT_COA_CASHIER_FAILURE, payload: error });

export const fetchInsertCoaCashierData = (formData) => async (dispatch) => {
    dispatch(fetchInsertCoaCashierRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/insert-coa-cashier`, {
            method: 'POST', headers: authHeaders(token), body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchInsertCoaCashierSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchInsertCoaCashierFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Cashier List Dropdown
// ============================================================================

export const fetchGetCashierListRequest = () => ({ type: FETCH_GET_CASHIER_LIST_REQUEST });
export const fetchGetCashierListSuccess = (data) => ({ type: FETCH_GET_CASHIER_LIST_SUCCESS, payload: data });
export const fetchGetCashierListFailure = (error) => ({ type: FETCH_GET_CASHIER_LIST_FAILURE, payload: error });

export const fetchGetCashierListData = () => async (dispatch) => {
    dispatch(fetchGetCashierListRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-cashier-list`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetCashierListSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetCashierListFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Student Ledger
// ============================================================================

export const fetchGetStudentLedgerRequest = () => ({ type: FETCH_GET_STUDENT_LEDGER_REQUEST });
export const fetchGetStudentLedgerSuccess = (data) => ({ type: FETCH_GET_STUDENT_LEDGER_SUCCESS, payload: data });
export const fetchGetStudentLedgerFailure = (error) => ({ type: FETCH_GET_STUDENT_LEDGER_FAILURE, payload: error });

export const fetchGetStudentLedger = (page, pageSize, search, studentId = null) => async (dispatch) => {
    dispatch(fetchGetStudentLedgerRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page: page,
            pageSize: pageSize,
            search: search || ''
        });
        if (studentId) params.append('studentId', studentId);
        const url = `${baseUrl}/accounting/get-student-ledger?${params}`;
        const res = await fetch(url, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchGetStudentLedgerSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetStudentLedgerFailure(err.message));
        return { ok: false, err: err.message };
    }
};

export const fetchGetStudentLedgerDetailRequest = () => ({ type: FETCH_GET_STUDENT_LEDGER_DETAIL_REQUEST });
export const fetchGetStudentLedgerDetailSuccess = (data) => ({ type: FETCH_GET_STUDENT_LEDGER_DETAIL_SUCCESS, payload: data });
export const fetchGetStudentLedgerDetailFailure = (error) => ({ type: FETCH_GET_STUDENT_LEDGER_DETAIL_FAILURE, payload: error });

export const fetchGetStudentLedgerDetail = (ledgerMasterId) => async (dispatch) => {
    dispatch(fetchGetStudentLedgerDetailRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-student-ledger-detail/${ledgerMasterId}`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetStudentLedgerDetailSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetStudentLedgerDetailFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchCreateStudentLedgerRequest = () => ({ type: FETCH_CREATE_STUDENT_LEDGER_REQUEST });
export const fetchCreateStudentLedgerSuccess = (data) => ({ type: FETCH_CREATE_STUDENT_LEDGER_SUCCESS, payload: data });
export const fetchCreateStudentLedgerFailure = (error) => ({ type: FETCH_CREATE_STUDENT_LEDGER_FAILURE, payload: error });

export const fetchCreateStudentLedger = (formData) => async (dispatch) => {
    dispatch(fetchCreateStudentLedgerRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/create-student-ledger`, {
            method: 'POST', headers: authHeaders(token), body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchCreateStudentLedgerSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchCreateStudentLedgerFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Journal Entry
// ============================================================================

export const fetchGetJournalRequest = () => ({ type: FETCH_GET_JOURNAL_REQUEST });
export const fetchGetJournalSuccess = (data) => ({ type: FETCH_GET_JOURNAL_SUCCESS, payload: data });
export const fetchGetJournalFailure = (error) => ({ type: FETCH_GET_JOURNAL_FAILURE, payload: error });

export const fetchGetJournalData = (page, pageSize, search, userId, userType, calendarId) => async (dispatch) => {
    dispatch(fetchGetJournalRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page: page,
            pageSize: pageSize
        });
        if (search) params.append('search', search);
        if (userId) params.append('userId', userId);
        if (userType) params.append('userType', userType);
        if (calendarId) params.append('calendarId', calendarId);
        
        const res = await fetch(`${baseUrl}/accounting/get-journal-entries?${params}`, { 
            method: 'GET', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchGetJournalSuccess(data));
        return { ok: true, data: data.Data || data.data, totalRecords: data.TotalRecords || data.totalRecords };
    } catch (err) {
        dispatch(fetchGetJournalFailure(err.message));
        return { ok: false, err: err.message };
    }
};

export const fetchGetJournalDetailRequest = () => ({ type: FETCH_GET_JOURNAL_DETAIL_REQUEST });
export const fetchGetJournalDetailSuccess = (data) => ({ type: FETCH_GET_JOURNAL_DETAIL_SUCCESS, payload: data });
export const fetchGetJournalDetailFailure = (error) => ({ type: FETCH_GET_JOURNAL_DETAIL_FAILURE, payload: error });

export const fetchGetJournalDetailData = (journalId) => async (dispatch) => {
    dispatch(fetchGetJournalDetailRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-journal-detail/${journalId}`, {
            method: 'GET', 
            headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetJournalDetailSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetJournalDetailFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchInsertJournalRequest = () => ({ type: FETCH_INSERT_JOURNAL_REQUEST });
export const fetchInsertJournalSuccess = (data) => ({ type: FETCH_INSERT_JOURNAL_SUCCESS, payload: data });
export const fetchInsertJournalFailure = (error) => ({ type: FETCH_INSERT_JOURNAL_FAILURE, payload: error });

export const fetchInsertJournalData = (formData) => async (dispatch) => {
    dispatch(fetchInsertJournalRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/insert-journal`, {
            method: 'POST', headers: authHeaders(token), body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchInsertJournalSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchInsertJournalFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchUpdateJournalRequest = () => ({ type: FETCH_UPDATE_JOURNAL_REQUEST });
export const fetchUpdateJournalSuccess = (data) => ({ type: FETCH_UPDATE_JOURNAL_SUCCESS, payload: data });
export const fetchUpdateJournalFailure = (error) => ({ type: FETCH_UPDATE_JOURNAL_FAILURE, payload: error });

export const fetchUpdateJournalData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateJournalRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/update-journal-entry`, {
            method: 'POST', headers: authHeaders(token), body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchUpdateJournalSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchUpdateJournalFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchEditJournalAmountsRequest = () => ({ type: FETCH_EDIT_JOURNAL_AMOUNTS_REQUEST });
export const fetchEditJournalAmountsSuccess = (data) => ({ type: FETCH_EDIT_JOURNAL_AMOUNTS_SUCCESS, payload: data });
export const fetchEditJournalAmountsFailure = (error) => ({ type: FETCH_EDIT_JOURNAL_AMOUNTS_FAILURE, payload: error });

export const fetchEditJournalAmountsData = (formData) => async (dispatch) => {
    dispatch(fetchEditJournalAmountsRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/edit-journal-amounts`, {
            method: 'POST', 
            headers: authHeaders(token), 
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchEditJournalAmountsSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchEditJournalAmountsFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchPostJournalRequest = () => ({ type: FETCH_POST_JOURNAL_REQUEST });
export const fetchPostJournalSuccess = (data) => ({ type: FETCH_POST_JOURNAL_SUCCESS, payload: data });
export const fetchPostJournalFailure = (error) => ({ type: FETCH_POST_JOURNAL_FAILURE, payload: error });

export const fetchPostJournalData = (journalId) => async (dispatch) => {
    dispatch(fetchPostJournalRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/post-journal-entry`, {
            method: 'POST', 
            headers: authHeaders(token), 
            body: JSON.stringify({ journalId }),
        });
        const data = await res.json();
        dispatch(fetchPostJournalSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchPostJournalFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Update Journal Status (Unified: Post/Approve/Decline)
// Y = Post Journal, C = Approve Cancellation, D = Decline Cancellation
// ============================================================================

export const fetchUpdateJournalStatusRequest = () => ({ type: FETCH_UPDATE_JOURNAL_STATUS_REQUEST });
export const fetchUpdateJournalStatusSuccess = (data) => ({ type: FETCH_UPDATE_JOURNAL_STATUS_SUCCESS, payload: data });
export const fetchUpdateJournalStatusFailure = (error) => ({ type: FETCH_UPDATE_JOURNAL_STATUS_FAILURE, payload: error });

export const fetchUpdateJournalStatusData = (journalId, statusAction, modifiedByUserId) => async (dispatch) => {
    dispatch(fetchUpdateJournalStatusRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/update-journal-status?modifiedByUserId=${modifiedByUserId}`, {
            method: 'POST', 
            headers: authHeaders(token), 
            body: JSON.stringify({ 
                journalId, 
                statusAction 
            }),
        });
        const data = await res.json();
        dispatch(fetchUpdateJournalStatusSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchUpdateJournalStatusFailure(err.message));
        return { ok: false, err };
    }
};

// ── Edit Journal Lines ────────────────────────────────────────────────────────
import { FETCH_EDIT_JOURNAL_LINES_REQUEST, FETCH_EDIT_JOURNAL_LINES_SUCCESS, FETCH_EDIT_JOURNAL_LINES_FAILURE } from './ActionType';

export const fetchEditJournalLinesRequest = () => ({ type: FETCH_EDIT_JOURNAL_LINES_REQUEST });
export const fetchEditJournalLinesSuccess = (data) => ({ type: FETCH_EDIT_JOURNAL_LINES_SUCCESS, payload: data });
export const fetchEditJournalLinesFailure = (error) => ({ type: FETCH_EDIT_JOURNAL_LINES_FAILURE, payload: error });

export const fetchEditJournalLinesData = (payload) => async (dispatch) => {
    dispatch(fetchEditJournalLinesRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/edit-journal-lines`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(fetchEditJournalLinesSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchEditJournalLinesFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// SI Series
// ============================================================================
import {
    FETCH_GET_SI_SERIES_REQUEST, FETCH_GET_SI_SERIES_SUCCESS, FETCH_GET_SI_SERIES_FAILURE,
    FETCH_INSERT_SI_SERIES_REQUEST, FETCH_INSERT_SI_SERIES_SUCCESS, FETCH_INSERT_SI_SERIES_FAILURE,
    FETCH_GET_ROBOT_CASHIER_REQUEST, FETCH_GET_ROBOT_CASHIER_SUCCESS, FETCH_GET_ROBOT_CASHIER_FAILURE,
    FETCH_INSERT_ROBOT_CASHIER_REQUEST, FETCH_INSERT_ROBOT_CASHIER_SUCCESS, FETCH_INSERT_ROBOT_CASHIER_FAILURE,
    // Cashier Transaction Journal
    FETCH_GET_CASHIER_TRANSACTIONS_REQUEST, FETCH_GET_CASHIER_TRANSACTIONS_SUCCESS, FETCH_GET_CASHIER_TRANSACTIONS_FAILURE,
    FETCH_POST_CASHIER_JOURNAL_REQUEST, FETCH_POST_CASHIER_JOURNAL_SUCCESS, FETCH_POST_CASHIER_JOURNAL_FAILURE,
} from './ActionType';

export const fetchGetSiSeriesRequest = () => ({ type: FETCH_GET_SI_SERIES_REQUEST });
export const fetchGetSiSeriesSuccess = (data) => ({ type: FETCH_GET_SI_SERIES_SUCCESS, payload: data });
export const fetchGetSiSeriesFailure = (error) => ({ type: FETCH_GET_SI_SERIES_FAILURE, payload: error });

export const fetchGetSiSeriesData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetSiSeriesRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page: page,
            pageSize: pageSize,
            search: search || ''
        });
        const res = await fetch(`${baseUrl}/accounting/get-si-series?${params}`, {
            method: 'GET', headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchGetSiSeriesSuccess(data));
        return { ok: true, data: data.Data, totalRecords: data.TotalRecords };
    } catch (err) {
        dispatch(fetchGetSiSeriesFailure(err.message));
        return { ok: false, err: err.message };
    }
};

export const fetchInsertSiSeriesRequest = () => ({ type: FETCH_INSERT_SI_SERIES_REQUEST });
export const fetchInsertSiSeriesSuccess = (data) => ({ type: FETCH_INSERT_SI_SERIES_SUCCESS, payload: data });
export const fetchInsertSiSeriesFailure = (error) => ({ type: FETCH_INSERT_SI_SERIES_FAILURE, payload: error });

export const fetchInsertSiSeriesData = (formData) => async (dispatch) => {
    dispatch(fetchInsertSiSeriesRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/insert-si-series`, {
            method: 'POST', headers: authHeaders(token), body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchInsertSiSeriesSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchInsertSiSeriesFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Robot Cashier Assignment
// ============================================================================

export const fetchGetRobotCashierRequest = () => ({ type: FETCH_GET_ROBOT_CASHIER_REQUEST });
export const fetchGetRobotCashierSuccess = (data) => ({ type: FETCH_GET_ROBOT_CASHIER_SUCCESS, payload: data });
export const fetchGetRobotCashierFailure = (error) => ({ type: FETCH_GET_ROBOT_CASHIER_FAILURE, payload: error });

export const fetchGetRobotCashierData = () => async (dispatch) => {
    dispatch(fetchGetRobotCashierRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-robot-cashier`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        console.log(data);
        dispatch(fetchGetRobotCashierSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetRobotCashierFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchInsertRobotCashierRequest = () => ({ type: FETCH_INSERT_ROBOT_CASHIER_REQUEST });
export const fetchInsertRobotCashierSuccess = (data) => ({ type: FETCH_INSERT_ROBOT_CASHIER_SUCCESS, payload: data });
export const fetchInsertRobotCashierFailure = (error) => ({ type: FETCH_INSERT_ROBOT_CASHIER_FAILURE, payload: error });

export const fetchInsertRobotCashierData = (formData) => async (dispatch) => {
    dispatch(fetchInsertRobotCashierRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/insert-robot-cashier`, {
            method: 'POST', headers: authHeaders(token), body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchInsertRobotCashierSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchInsertRobotCashierFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Cashier Transaction Journal (Auto-generated from cashier payments)
// ============================================================================

export const fetchGetCashierTransactionsRequest = () => ({ type: FETCH_GET_CASHIER_TRANSACTIONS_REQUEST });
export const fetchGetCashierTransactionsSuccess = (data) => ({ type: FETCH_GET_CASHIER_TRANSACTIONS_SUCCESS, payload: data });
export const fetchGetCashierTransactionsFailure = (error) => ({ type: FETCH_GET_CASHIER_TRANSACTIONS_FAILURE, payload: error });

export const fetchGetCashierTransactionsData = (page, pageSize, search, dateFrom, dateTo, status) => async (dispatch) => {
    dispatch(fetchGetCashierTransactionsRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page: page,
            pageSize: pageSize,
            search: search || ''
        });
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);
        if (status) params.append('status', status);
        const res = await fetch(`${baseUrl}/accounting/get-cashier-transactions?${params}`, { 
            method: 'GET', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchGetCashierTransactionsSuccess(data));
        return { ok: true, data: data.data, totalRecords: data.totalRecords };
    } catch (err) {
        dispatch(fetchGetCashierTransactionsFailure(err.message));
        return { ok: false, err: err.message };
    }
};

export const fetchPostCashierJournalRequest = () => ({ type: FETCH_POST_CASHIER_JOURNAL_REQUEST });
export const fetchPostCashierJournalSuccess = (data) => ({ type: FETCH_POST_CASHIER_JOURNAL_SUCCESS, payload: data });
export const fetchPostCashierJournalFailure = (error) => ({ type: FETCH_POST_CASHIER_JOURNAL_FAILURE, payload: error });

export const fetchPostCashierJournalData = (formData) => async (dispatch) => {
    dispatch(fetchPostCashierJournalRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/post-cashier-journal`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchPostCashierJournalSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchPostCashierJournalFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// School Year Dropdown
// ============================================================================
import {
    FETCH_GET_SCHOOL_YEAR_LIST_REQUEST, 
    FETCH_GET_SCHOOL_YEAR_LIST_SUCCESS, 
    FETCH_GET_SCHOOL_YEAR_LIST_FAILURE,
} from './ActionType';

export const fetchGetSchoolYearListRequest = () => ({ type: FETCH_GET_SCHOOL_YEAR_LIST_REQUEST });
export const fetchGetSchoolYearListSuccess = (data) => ({ type: FETCH_GET_SCHOOL_YEAR_LIST_SUCCESS, payload: data });
export const fetchGetSchoolYearListFailure = (error) => ({ type: FETCH_GET_SCHOOL_YEAR_LIST_FAILURE, payload: error });

export const fetchGetSchoolYearListData = () => async (dispatch) => {
    dispatch(fetchGetSchoolYearListRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-school-year-list`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetSchoolYearListSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetSchoolYearListFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Templates / Fees (migrated from Finance)
// ============================================================================
import {
    FETCH_TEMPLATE_TABLE_DATA_REQUEST, FETCH_TEMPLATE_TABLE_DATA_SUCCESS, FETCH_TEMPLATE_TABLE_DATA_FAILURE,
    FETCH_UPDATE_TEMPLATE_REQUEST, FETCH_UPDATE_TEMPLATE_SUCCESS, FETCH_UPDATE_TEMPLATE_FAILURE,
    FETCH_LIST_OF_USER_DATA_REQUEST, FETCH_LIST_OF_USER_DATA_SUCCESS, FETCH_LIST_OF_USER_DATA_FAILURE,
    FETCH_INSERT_OR_SERIES_DATA_REQUEST, FETCH_INSERT_OR_SERIES_DATA_SUCCESS, FETCH_INSERT_OR_SERIES_DATA_FAILURE,
    FETCH_INSERT_TABLE_OF_FEES_DATA_REQUEST, FETCH_INSERT_TABLE_OF_FEES_DATA_SUCCESS, FETCH_INSERT_TABLE_OF_FEES_DATA_FAILURE,
    FETCH_INSERT_TUITION_FEE_DATA_REQUEST, FETCH_INSERT_TUITION_FEE_DATA_SUCCESS, FETCH_INSERT_TUITION_FEE_DATA_FAILURE,
    FETCH_INSERT_MISCELLANEOUS_DATA_REQUEST, FETCH_INSERT_MISCELLANEOUS_DATA_SUCCESS, FETCH_INSERT_MISCELLANEOUS_DATA_FAILURE,
} from './ActionType';

// ── Template Table Data ──────────────────────────────────────────────────────

export const fetchTemplateTableDataRequest = () => ({ type: FETCH_TEMPLATE_TABLE_DATA_REQUEST });
export const fetchTemplateTableDataSuccess = (data) => ({ type: FETCH_TEMPLATE_TABLE_DATA_SUCCESS, payload: data });
export const fetchTemplateTableDataFailure = (error) => ({ type: FETCH_TEMPLATE_TABLE_DATA_FAILURE, payload: error });

export const fetchTemplateTableData = (selectedStatus, page = 1, pageSize = 10, search = '') => async (dispatch) => {
    dispatch(fetchTemplateTableDataRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            status: selectedStatus,
            page: page,
            pageSize: pageSize,
            search: search
        });
        const res = await fetch(`${baseUrl}/accounting/get-templates?${params}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchTemplateTableDataSuccess(data));
        return { ok: true, data: data.data || data, totalRecords: data.totalRecords || data.length };
    } catch (err) {
        dispatch(fetchTemplateTableDataFailure(err.message));
        return { ok: false, err: err.message };
    }
};

// ── Update Template ──────────────────────────────────────────────────────────

export const fetchUpdateTemplateRequest = () => ({ type: FETCH_UPDATE_TEMPLATE_REQUEST });
export const fetchUpdateTemplateSuccess = (data) => ({ type: FETCH_UPDATE_TEMPLATE_SUCCESS, payload: data });
export const fetchUpdateTemplateFailure = (error) => ({ type: FETCH_UPDATE_TEMPLATE_FAILURE, payload: error });

export const fetchUpdateTemplateData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateTemplateRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/update-template`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchUpdateTemplateSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchUpdateTemplateFailure(err.message));
        return { ok: false, err };
    }
};

// ── List of Users ────────────────────────────────────────────────────────────

export const fetchListOfUserDataRequest = () => ({ type: FETCH_LIST_OF_USER_DATA_REQUEST });
export const fetchListOfUserDataSuccess = (data) => ({ type: FETCH_LIST_OF_USER_DATA_SUCCESS, payload: data });
export const fetchListOfUserDataFailure = (error) => ({ type: FETCH_LIST_OF_USER_DATA_FAILURE, payload: error });

export const fetchListOfUserData = () => async (dispatch) => {
    dispatch(fetchListOfUserDataRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-users`, {
            method: 'POST',
            headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchListOfUserDataSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchListOfUserDataFailure(err.message));
        return { ok: false, err };
    }
};

// ── Insert OR Series ─────────────────────────────────────────────────────────

export const fetchInsertOrSeriesDataRequest = () => ({ type: FETCH_INSERT_OR_SERIES_DATA_REQUEST });
export const fetchInsertOrSeriesDataSuccess = (data) => ({ type: FETCH_INSERT_OR_SERIES_DATA_SUCCESS, payload: data });
export const fetchInsertOrSeriesDataFailure = (error) => ({ type: FETCH_INSERT_OR_SERIES_DATA_FAILURE, payload: error });

export const fetchInsertOrSeriesData = (formData) => async (dispatch) => {
    dispatch(fetchInsertOrSeriesDataRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/insert-or-series`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchInsertOrSeriesDataSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchInsertOrSeriesDataFailure(err.message));
        return { ok: false, err };
    }
};

// ── Insert Table of Fees ─────────────────────────────────────────────────────

export const fetchInsertTableOfFeesDataRequest = () => ({ type: FETCH_INSERT_TABLE_OF_FEES_DATA_REQUEST });
export const fetchInsertTableOfFeesDataSuccess = (data) => ({ type: FETCH_INSERT_TABLE_OF_FEES_DATA_SUCCESS, payload: data });
export const fetchInsertTableOfFeesDataFailure = (error) => ({ type: FETCH_INSERT_TABLE_OF_FEES_DATA_FAILURE, payload: error });

export const fetchInsertTableOfFeesData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTableOfFeesDataRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/insert-table-of-fees`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchInsertTableOfFeesDataSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchInsertTableOfFeesDataFailure(err.message));
        return { ok: false, err };
    }
};

// ── Insert Tuition Fee ───────────────────────────────────────────────────────

export const fetchInsertTuitionFeeDataRequest = () => ({ type: FETCH_INSERT_TUITION_FEE_DATA_REQUEST });
export const fetchInsertTuitionFeeDataSuccess = (data) => ({ type: FETCH_INSERT_TUITION_FEE_DATA_SUCCESS, payload: data });
export const fetchInsertTuitionFeeDataFailure = (error) => ({ type: FETCH_INSERT_TUITION_FEE_DATA_FAILURE, payload: error });

export const fetchInsertTuitionFeeData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTuitionFeeDataRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/insert-tuition-fee`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchInsertTuitionFeeDataSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchInsertTuitionFeeDataFailure(err.message));
        return { ok: false, err };
    }
};

// ── Insert Miscellaneous Fee ─────────────────────────────────────────────────

export const fetchInsertMiscellaneousDataRequest = () => ({ type: FETCH_INSERT_MISCELLANEOUS_DATA_REQUEST });
export const fetchInsertMiscellaneousDataSuccess = (data) => ({ type: FETCH_INSERT_MISCELLANEOUS_DATA_SUCCESS, payload: data });
export const fetchInsertMiscellaneousDataFailure = (error) => ({ type: FETCH_INSERT_MISCELLANEOUS_DATA_FAILURE, payload: error });

export const fetchInsertMiscellaneousData = (formData) => async (dispatch) => {
    dispatch(fetchInsertMiscellaneousDataRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/insert-miscellaneous`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(fetchInsertMiscellaneousDataSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchInsertMiscellaneousDataFailure(err.message));
        return { ok: false, err };
    }
};


// ============================================================================
// Transaction Types / COA Assignment (New)
// ============================================================================
import {
    FETCH_GET_TRANSACTION_TYPES_REQUEST, FETCH_GET_TRANSACTION_TYPES_SUCCESS, FETCH_GET_TRANSACTION_TYPES_FAILURE,
    FETCH_CREATE_TRANSACTION_TYPES_REQUEST, FETCH_CREATE_TRANSACTION_TYPES_SUCCESS, FETCH_CREATE_TRANSACTION_TYPES_FAILURE,
    FETCH_UPDATE_TRANSACTION_TYPES_REQUEST, FETCH_UPDATE_TRANSACTION_TYPES_SUCCESS, FETCH_UPDATE_TRANSACTION_TYPES_FAILURE,
    FETCH_DELETE_TRANSACTION_TYPES_REQUEST, FETCH_DELETE_TRANSACTION_TYPES_SUCCESS, FETCH_DELETE_TRANSACTION_TYPES_FAILURE,
} from './ActionType';

// ── Get Transaction Types ────────────────────────────────────────────────────

export const fetchGetTransactionTypesRequest = () => ({ type: FETCH_GET_TRANSACTION_TYPES_REQUEST });
export const fetchGetTransactionTypesSuccess = (data) => ({ type: FETCH_GET_TRANSACTION_TYPES_SUCCESS, payload: data });
export const fetchGetTransactionTypesFailure = (error) => ({ type: FETCH_GET_TRANSACTION_TYPES_FAILURE, payload: error });

export const fetchGetTransactionTypes = (page = 1, pageSize = 10, schoolYear = '', campusId = null) => async (dispatch) => {
    dispatch(fetchGetTransactionTypesRequest());
    try {
        const token = getToken();
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            schoolYear: schoolYear,
        });
        
        if (campusId !== null && campusId !== undefined) {
            queryParams.append('campusId', campusId.toString());
        }
        
        const res = await fetch(`${baseUrl}/accounting/get-transaction-types?${queryParams}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchGetTransactionTypesSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetTransactionTypesFailure(err.message));
        return { ok: false, err: err.message };
    }
};

// ── Create Transaction Types ─────────────────────────────────────────────────

export const fetchCreateTransactionTypesRequest = () => ({ type: FETCH_CREATE_TRANSACTION_TYPES_REQUEST });
export const fetchCreateTransactionTypesSuccess = (data) => ({ type: FETCH_CREATE_TRANSACTION_TYPES_SUCCESS, payload: data });
export const fetchCreateTransactionTypesFailure = (error) => ({ type: FETCH_CREATE_TRANSACTION_TYPES_FAILURE, payload: error });

export const fetchCreateTransactionTypes = (payload) => async (dispatch) => {
    dispatch(fetchCreateTransactionTypesRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/create-transaction-types`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(fetchCreateTransactionTypesSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchCreateTransactionTypesFailure(err.message));
        return { ok: false, err };
    }
};

// ── Update Transaction Types ─────────────────────────────────────────────────

export const fetchUpdateTransactionTypesRequest = () => ({ type: FETCH_UPDATE_TRANSACTION_TYPES_REQUEST });
export const fetchUpdateTransactionTypesSuccess = (data) => ({ type: FETCH_UPDATE_TRANSACTION_TYPES_SUCCESS, payload: data });
export const fetchUpdateTransactionTypesFailure = (error) => ({ type: FETCH_UPDATE_TRANSACTION_TYPES_FAILURE, payload: error });

export const fetchUpdateTransactionTypes = (id, payload) => async (dispatch) => {
    dispatch(fetchUpdateTransactionTypesRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/update-transaction-types/${id}`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(fetchUpdateTransactionTypesSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchUpdateTransactionTypesFailure(err.message));
        return { ok: false, err };
    }
};

// ── Delete Transaction Types ─────────────────────────────────────────────────

export const fetchDeleteTransactionTypesRequest = () => ({ type: FETCH_DELETE_TRANSACTION_TYPES_REQUEST });
export const fetchDeleteTransactionTypesSuccess = (data) => ({ type: FETCH_DELETE_TRANSACTION_TYPES_SUCCESS, payload: data });
export const fetchDeleteTransactionTypesFailure = (error) => ({ type: FETCH_DELETE_TRANSACTION_TYPES_FAILURE, payload: error });

export const fetchDeleteTransactionTypes = (id) => async (dispatch) => {
    dispatch(fetchDeleteTransactionTypesRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/delete-transaction-types/${id}`, {
            method: 'DELETE',
            headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchDeleteTransactionTypesSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchDeleteTransactionTypesFailure(err.message));
        return { ok: false, err };
    }
};



// ============================================================================
// Student Ledger — SOA / Statement of Account
// ============================================================================
import {
    FETCH_STUDENT_LEDGER_REQUEST,   FETCH_STUDENT_LEDGER_SUCCESS,   FETCH_STUDENT_LEDGER_FAILURE,
    FETCH_ALL_STUDENT_LEDGERS_REQUEST, FETCH_ALL_STUDENT_LEDGERS_SUCCESS, FETCH_ALL_STUDENT_LEDGERS_FAILURE,
    POST_LEDGER_TRANSACTION_REQUEST,  POST_LEDGER_TRANSACTION_SUCCESS,  POST_LEDGER_TRANSACTION_FAILURE,
    VOID_LEDGER_TRANSACTION_REQUEST,  VOID_LEDGER_TRANSACTION_SUCCESS,  VOID_LEDGER_TRANSACTION_FAILURE,
} from './ActionType';

// ── fetchStudentLedgerByStudentId ─────────────────────────────────────────────
// Returns the master summary (StudentLedgerMasterTable) and all child
// transactions (StudentLedgerChildTable) for a single student's SOA.
// Endpoint: POST /accounting/get-student-ledger-by-student/:studentId

export const fetchStudentLedgerRequest = () => ({ type: FETCH_STUDENT_LEDGER_REQUEST });
export const fetchStudentLedgerSuccess = (data) => ({ type: FETCH_STUDENT_LEDGER_SUCCESS, payload: data });
export const fetchStudentLedgerFailure = (error) => ({ type: FETCH_STUDENT_LEDGER_FAILURE, payload: error });

export const fetchStudentLedgerByStudentId = (studentId) => async (dispatch) => {
    dispatch(fetchStudentLedgerRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-student-ledger-by-student/${studentId}`, {
            method: 'POST',
            headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchStudentLedgerSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchStudentLedgerFailure(err.message));
        return { ok: false, err };
    }
};

// ── fetchAllStudentLedgers ────────────────────────────────────────────────────
// Returns a paginated list of all StudentLedgerMasterTable records for the
// data table view (with optional filters: calendarId, levelId, search, status).
// Endpoint: POST /accounting/get-all-student-ledgers

export const fetchAllStudentLedgersRequest = () => ({ type: FETCH_ALL_STUDENT_LEDGERS_REQUEST });
export const fetchAllStudentLedgersSuccess = (data) => ({ type: FETCH_ALL_STUDENT_LEDGERS_SUCCESS, payload: data });
export const fetchAllStudentLedgersFailure = (error) => ({ type: FETCH_ALL_STUDENT_LEDGERS_FAILURE, payload: error });

export const fetchAllStudentLedgers = (filters = {}) => async (dispatch) => {
    dispatch(fetchAllStudentLedgersRequest());
    try {
        const token = getToken();
        const {
            page      = 1,
            pageSize  = 10,
            search    = '',
            calendarId = null,
            levelId    = null,
            activeStatus = null,
        } = filters;

        const params = new URLSearchParams({
            page:     page.toString(),
            pageSize: pageSize.toString(),
            search:   search ?? '',
        });
        if (calendarId)   params.append('calendarId',   calendarId.toString());
        if (levelId)      params.append('levelId',      levelId.toString());
        if (activeStatus) params.append('activeStatus', activeStatus);

        const res = await fetch(`${baseUrl}/accounting/get-all-student-ledgers?${params}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchAllStudentLedgersSuccess(data));
        return { ok: true, data: data.Data || data.data || data, totalRecords: data.TotalRecords || data.totalRecords || 0 };
    } catch (err) {
        dispatch(fetchAllStudentLedgersFailure(err.message));
        return { ok: false, err: err.message };
    }
};

// ── postLedgerTransaction ─────────────────────────────────────────────────────
// Inserts a new debit or credit entry into StudentLedgerChildTable and
// recalculates the running balance + master totals on the backend.
// Endpoint: POST /accounting/post-ledger-transaction
//
// Payload shape (maps to StudentLedgerChildTable fields):
// {
//   StudentLedgerMasterId : number,
//   TransactionDate       : string (ISO date),
//   TransactionType       : string,   // e.g. "Tuition Fee", "Payment"
//   OrChildId             : number | null,
//   OrNumberUsed          : string,
//   ReferenceNo           : string,
//   Description           : string,
//   Debit                 : number,
//   Credit                : number,
//   CreatedByUserId       : number,
// }

export const postLedgerTransactionRequest = () => ({ type: POST_LEDGER_TRANSACTION_REQUEST });
export const postLedgerTransactionSuccess = (data) => ({ type: POST_LEDGER_TRANSACTION_SUCCESS, payload: data });
export const postLedgerTransactionFailure = (error) => ({ type: POST_LEDGER_TRANSACTION_FAILURE, payload: error });

export const postLedgerTransaction = (transactionData) => async (dispatch) => {
    dispatch(postLedgerTransactionRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/post-ledger-transaction`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(transactionData),
        });
        const data = await res.json();
        dispatch(postLedgerTransactionSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(postLedgerTransactionFailure(err.message));
        return { ok: false, err };
    }
};

// ── voidLedgerTransaction ─────────────────────────────────────────────────────
// Sets a StudentLedgerChildTable row's ActiveStatus to 'V' (voided) and
// reverses its effect on the master balance.
// Endpoint: POST /accounting/void-ledger-transaction
//
// Payload: { StudentLedgerChildId: number, VoidReason: string, VoidedByUserId: number }

export const voidLedgerTransactionRequest = () => ({ type: VOID_LEDGER_TRANSACTION_REQUEST });
export const voidLedgerTransactionSuccess = (data) => ({ type: VOID_LEDGER_TRANSACTION_SUCCESS, payload: data });
export const voidLedgerTransactionFailure = (error) => ({ type: VOID_LEDGER_TRANSACTION_FAILURE, payload: error });

export const voidLedgerTransaction = (childId, reason, voidedByUserId) => async (dispatch) => {
    dispatch(voidLedgerTransactionRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/void-ledger-transaction`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify({
                StudentLedgerChildId: childId,
                VoidReason:           reason,
                VoidedByUserId:       voidedByUserId,
            }),
        });
        const data = await res.json();
        dispatch(voidLedgerTransactionSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(voidLedgerTransactionFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Financial Report
// ============================================================================
import {
    FETCH_FINANCIAL_REPORT_REQUEST,
    FETCH_FINANCIAL_REPORT_SUCCESS,
    FETCH_FINANCIAL_REPORT_FAILURE,
} from './ActionType';

export const fetchFinancialReportRequest = () => ({ type: FETCH_FINANCIAL_REPORT_REQUEST });
export const fetchFinancialReportSuccess = (data) => ({ type: FETCH_FINANCIAL_REPORT_SUCCESS, payload: data });
export const fetchFinancialReportFailure = (error) => ({ type: FETCH_FINANCIAL_REPORT_FAILURE, payload: error });

// reportType: 'daily-collection' | 'aging' | 'income'
// filters:    { dateFrom: string, dateTo: string, page, pageSize }
// Endpoint:   GET /accounting/get-financial-report
export const fetchFinancialReport = (reportType, filters = {}) => async (dispatch) => {
    dispatch(fetchFinancialReportRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            reportType: reportType,
            page: (filters.page ?? 1).toString(),
            pageSize: (filters.pageSize ?? 10).toString()
        });
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        
        const res = await fetch(`${baseUrl}/accounting/get-financial-report?${params}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchFinancialReportSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchFinancialReportFailure(err.message));
        return { ok: false, err: err.message };
    }
};


// ============================================================================
// General Ledger Actions
// ============================================================================

export const fetchGeneralLedgerRequest = () => ({ type: 'FETCH_GENERAL_LEDGER_REQUEST' });
export const fetchGeneralLedgerSuccess = (data) => ({ type: 'FETCH_GENERAL_LEDGER_SUCCESS', payload: data });
export const fetchGeneralLedgerFailure = (error) => ({ type: 'FETCH_GENERAL_LEDGER_FAILURE', payload: error });

// fetchGeneralLedger — paginated, filterable general ledger list
// Returns all GL entries with search, date range, account, and school year filtering
// Endpoint: GET /accounting/get-general-ledger
export const fetchGeneralLedger = (filters = {}) => async (dispatch) => {
    dispatch(fetchGeneralLedgerRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            search: filters.search || '',
            page: (filters.page || 1).toString(),
            pageSize: (filters.pageSize || 10).toString()
        });
        if (filters.schoolYearId) params.append('schoolYearId', filters.schoolYearId.toString());
        if (filters.accountId) params.append('accountId', filters.accountId.toString());
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/accounting/get-general-ledger?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        dispatch(fetchGeneralLedgerSuccess(data));
        return { 
            ok: true, 
            data: data.data ?? data, 
            summary: data.summary ?? { totalDebits: 0, totalCredits: 0, netBalance: 0 },
            totalRecords: data.totalRecords ?? 0 
        };
    } catch (err) {
        dispatch(fetchGeneralLedgerFailure(err.message));
        return { ok: false, err: err.message };
    }
};
