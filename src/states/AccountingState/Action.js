import {
    FETCH_GET_COA_REQUEST, FETCH_GET_COA_SUCCESS, FETCH_GET_COA_FAILURE,
    FETCH_INSERT_COA_REQUEST, FETCH_INSERT_COA_SUCCESS, FETCH_INSERT_COA_FAILURE,
    FETCH_UPDATE_COA_REQUEST, FETCH_UPDATE_COA_SUCCESS, FETCH_UPDATE_COA_FAILURE,
} from './ActionType';
import { getToken } from '../../services/tokenServices';

const baseUrl = import.meta.env.VITE_BASE_URL;

// ── GET COA (paginated + search) ─────────────────────────────────────────────
export const fetchGetCoaRequest = () => ({ type: FETCH_GET_COA_REQUEST });
export const fetchGetCoaSuccess = (data) => ({ type: FETCH_GET_COA_SUCCESS, payload: data });
export const fetchGetCoaFailure = (error) => ({ type: FETCH_GET_COA_FAILURE, payload: error });

export const fetchGetCoaData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetCoaRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/accounting/get-coa?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchGetCoaSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchGetCoaFailure(error.message));
        return { ok: false, error };
    }
};

// ── INSERT COA ───────────────────────────────────────────────────────────────
export const fetchInsertCoaRequest = () => ({ type: FETCH_INSERT_COA_REQUEST });
export const fetchInsertCoaSuccess = (data) => ({ type: FETCH_INSERT_COA_SUCCESS, payload: data });
export const fetchInsertCoaFailure = (error) => ({ type: FETCH_INSERT_COA_FAILURE, payload: error });

export const fetchInsertCoaData = (formData) => async (dispatch) => {
    dispatch(fetchInsertCoaRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/accounting/insert-coa`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertCoaSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchInsertCoaFailure(error.message));
        return { ok: false, error };
    }
};

// ── UPDATE COA ───────────────────────────────────────────────────────────────
export const fetchUpdateCoaRequest = () => ({ type: FETCH_UPDATE_COA_REQUEST });
export const fetchUpdateCoaSuccess = (data) => ({ type: FETCH_UPDATE_COA_SUCCESS, payload: data });
export const fetchUpdateCoaFailure = (error) => ({ type: FETCH_UPDATE_COA_FAILURE, payload: error });

export const fetchUpdateCoaData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateCoaRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/accounting/update-coa`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchUpdateCoaSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchUpdateCoaFailure(error.message));
        return { ok: false, error };
    }
};

// ============================================================================
// Student Ledger Actions
// ============================================================================

// ── GET STUDENT LEDGER ──────────────────────────────────────────────────────
import {
    FETCH_GET_STUDENT_LEDGER_REQUEST, FETCH_GET_STUDENT_LEDGER_SUCCESS, FETCH_GET_STUDENT_LEDGER_FAILURE,
    FETCH_GET_STUDENT_LEDGER_DETAIL_REQUEST, FETCH_GET_STUDENT_LEDGER_DETAIL_SUCCESS, FETCH_GET_STUDENT_LEDGER_DETAIL_FAILURE,
    FETCH_CREATE_STUDENT_LEDGER_REQUEST, FETCH_CREATE_STUDENT_LEDGER_SUCCESS, FETCH_CREATE_STUDENT_LEDGER_FAILURE,
} from './ActionType';

export const fetchGetStudentLedgerRequest = () => ({ type: FETCH_GET_STUDENT_LEDGER_REQUEST });
export const fetchGetStudentLedgerSuccess = (data) => ({ type: FETCH_GET_STUDENT_LEDGER_SUCCESS, payload: data });
export const fetchGetStudentLedgerFailure = (error) => ({ type: FETCH_GET_STUDENT_LEDGER_FAILURE, payload: error });

export const fetchGetStudentLedger = (page, pageSize, search, studentId = null) => async (dispatch) => {
    dispatch(fetchGetStudentLedgerRequest());
    try {
        const token = getToken();
        let url = `${baseUrl}/accounting/get-student-ledger?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`;
        if (studentId) url += `&studentId=${studentId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchGetStudentLedgerSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchGetStudentLedgerFailure(error.message));
        return { ok: false, error };
    }
};

// ── GET STUDENT LEDGER DETAIL ───────────────────────────────────────────────
export const fetchGetStudentLedgerDetailRequest = () => ({ type: FETCH_GET_STUDENT_LEDGER_DETAIL_REQUEST });
export const fetchGetStudentLedgerDetailSuccess = (data) => ({ type: FETCH_GET_STUDENT_LEDGER_DETAIL_SUCCESS, payload: data });
export const fetchGetStudentLedgerDetailFailure = (error) => ({ type: FETCH_GET_STUDENT_LEDGER_DETAIL_FAILURE, payload: error });

export const fetchGetStudentLedgerDetail = (ledgerMasterId) => async (dispatch) => {
    dispatch(fetchGetStudentLedgerDetailRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/accounting/get-student-ledger-detail/${ledgerMasterId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchGetStudentLedgerDetailSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchGetStudentLedgerDetailFailure(error.message));
        return { ok: false, error };
    }
};

// ── CREATE STUDENT LEDGER ───────────────────────────────────────────────────
export const fetchCreateStudentLedgerRequest = () => ({ type: FETCH_CREATE_STUDENT_LEDGER_REQUEST });
export const fetchCreateStudentLedgerSuccess = (data) => ({ type: FETCH_CREATE_STUDENT_LEDGER_SUCCESS, payload: data });
export const fetchCreateStudentLedgerFailure = (error) => ({ type: FETCH_CREATE_STUDENT_LEDGER_FAILURE, payload: error });

export const fetchCreateStudentLedger = (formData) => async (dispatch) => {
    dispatch(fetchCreateStudentLedgerRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/accounting/create-student-ledger`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchCreateStudentLedgerSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchCreateStudentLedgerFailure(error.message));
        return { ok: false, error };
    }
};
