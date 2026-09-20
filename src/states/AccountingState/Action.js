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
        const res = await fetch(`${baseUrl}/accounting/get-coa?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetCoaSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetCoaFailure(err.message));
        return { ok: false, err };
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

export const fetchGetCoaAccountData = (groupId) => async (dispatch) => {
    dispatch(fetchGetCoaAccountRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-coa-account?groupId=${groupId}`, {
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
        const res = await fetch(`${baseUrl}/accounting/get-coa-cashier?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetCoaCashierSuccess(data));
        return { ok: true, data: data.data, totalRecords: data.totalRecords };
    } catch (err) {
        dispatch(fetchGetCoaCashierFailure(err.message));
        return { ok: false, err };
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
        let url = `${baseUrl}/accounting/get-student-ledger?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`;
        if (studentId) url += `&studentId=${studentId}`;
        const res = await fetch(url, { method: 'POST', headers: authHeaders(token) });
        const data = await res.json();
        dispatch(fetchGetStudentLedgerSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetStudentLedgerFailure(err.message));
        return { ok: false, err };
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

export const fetchGetJournalData = (page, pageSize, search, dateFrom, dateTo) => async (dispatch) => {
    dispatch(fetchGetJournalRequest());
    try {
        const token = getToken();
        let url = `${baseUrl}/accounting/get-journal?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`;
        if (dateFrom) url += `&dateFrom=${dateFrom}`;
        if (dateTo)   url += `&dateTo=${dateTo}`;
        const res = await fetch(url, { method: 'POST', headers: authHeaders(token) });
        const data = await res.json();
        dispatch(fetchGetJournalSuccess(data));
        return { ok: true, data: data.data, totalRecords: data.totalRecords };
    } catch (err) {
        dispatch(fetchGetJournalFailure(err.message));
        return { ok: false, err };
    }
};

export const fetchGetJournalDetailRequest = () => ({ type: FETCH_GET_JOURNAL_DETAIL_REQUEST });
export const fetchGetJournalDetailSuccess = (data) => ({ type: FETCH_GET_JOURNAL_DETAIL_SUCCESS, payload: data });
export const fetchGetJournalDetailFailure = (error) => ({ type: FETCH_GET_JOURNAL_DETAIL_FAILURE, payload: error });

export const fetchGetJournalDetailData = (journalId) => async (dispatch) => {
    dispatch(fetchGetJournalDetailRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/accounting/get-journal-detail?journalId=${journalId}`, {
            method: 'POST', headers: authHeaders(token),
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
        const res = await fetch(`${baseUrl}/accounting/update-journal`, {
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
        const res = await fetch(`${baseUrl}/accounting/get-si-series?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`, {
            method: 'POST', headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(fetchGetSiSeriesSuccess(data));
        return { ok: true, data: data.data, totalRecords: data.totalRecords };
    } catch (err) {
        dispatch(fetchGetSiSeriesFailure(err.message));
        return { ok: false, err };
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
        let url = `${baseUrl}/accounting/get-cashier-transactions?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`;
        if (dateFrom) url += `&dateFrom=${dateFrom}`;
        if (dateTo)   url += `&dateTo=${dateTo}`;
        if (status)   url += `&status=${status}`;
        const res = await fetch(url, { method: 'POST', headers: authHeaders(token) });
        const data = await res.json();
        dispatch(fetchGetCashierTransactionsSuccess(data));
        return { ok: true, data: data.data, totalRecords: data.totalRecords };
    } catch (err) {
        dispatch(fetchGetCashierTransactionsFailure(err.message));
        return { ok: false, err };
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
