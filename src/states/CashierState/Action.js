import {
    FETCH_TRANSACTION_TYPE_REQUEST, FETCH_TRANSACTION_TYPE_SUCCESS, FETCH_TRANSACTION_TYPE_FAILURE,
    FETCH_STUDENT_APPLICATION_REQUEST, FETCH_STUDENT_APPLICATION_SUCCESS, FETCH_STUDENT_APPLICATION_FAILURE,
    FETCH_ORNUMBER_REQUEST, FETCH_ORNUMBER_SUCCESS, FETCH_ORNUMBER_FAILURE,
    FETCH_PRINTTESTPERMIT_REQUEST, FETCH_PRINTTESTPERMIT_SUCCESS, FETCH_PRINTTESTPERMIT_FAILURE,
    // FETCH_INSERTSUBMITTEST_REQUEST, FETCH_INSERTSUBMITTEST_SUCCESS, FETCH_INSERTSUBMITTEST_FAILURE,
} from './ActionType';
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchTransactionTypeRequest = () => ({ type: FETCH_TRANSACTION_TYPE_REQUEST });
export const fetchTransactionTypeSuccess = (data) => ({ type: FETCH_TRANSACTION_TYPE_SUCCESS, payload: data });
export const fetchTransactionTypeFailure = (error) => ({ type: FETCH_TRANSACTION_TYPE_FAILURE, payload: error });

export const fetchTransactionTypeData = () => async (dispatch) => {
    dispatch(fetchTransactionTypeRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-transaction-type`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchTransactionTypeSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchTransactionTypeFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchStudentAppRequest = () => ({ type: FETCH_STUDENT_APPLICATION_REQUEST });
export const fetchStudentAppSuccess = (data) => ({ type: FETCH_STUDENT_APPLICATION_SUCCESS, payload: data });
export const fetchStudentAppFailure = (error) => ({ type: FETCH_STUDENT_APPLICATION_FAILURE, payload: error });

export const fetchStudentAppData = () => async (dispatch) => {
    dispatch(fetchStudentAppRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-student-application`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchStudentAppSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchStudentAppFailure(error.message));
        return { ok: false, error };
    }
};



export const fetchOrNumberRequest = () => ({ type: FETCH_ORNUMBER_REQUEST });
export const fetchOrNumberSuccess = (data) => ({ type: FETCH_ORNUMBER_SUCCESS, payload: data });
export const fetchOrNumberFailure = (error) => ({ type: FETCH_ORNUMBER_FAILURE, payload: error });

export const fetchOrNumberData = (userId) => async (dispatch) => {
    dispatch(fetchOrNumberRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-or-number?userId=${userId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchOrNumberSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchOrNumberFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchPrintTestPermitRequest = () => ({ type: FETCH_PRINTTESTPERMIT_REQUEST });
export const fetchPrintTestPermitSuccess = (data) => ({ type: FETCH_PRINTTESTPERMIT_SUCCESS, payload: data });
export const fetchPrintTestPermitFailure = (error) => ({ type: FETCH_PRINTTESTPERMIT_FAILURE, payload: error });

export const fetchPrintTestPermitData = (formData) => async (dispatch) => {
    dispatch(fetchPrintTestPermitRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/print-test-permit`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchPrintTestPermitSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchPrintTestPermitFailure(error.message));
        return { ok: false, error };
    }
};

// export const fetchInsertSubmitTestRequest = () => ({ type: FETCH_INSERTSUBMITTEST_REQUEST });
// export const fetchInsertSubmitTestSuccess = (data) => ({ type: FETCH_INSERTSUBMITTEST_SUCCESS, payload: data });
// export const fetchInsertSubmitTestFailure = (error) => ({ type: FETCH_INSERTSUBMITTEST_FAILURE, payload: error });

// export const fetchInsertSubmitTestData = (formData) => async (dispatch) => {
//     dispatch(fetchInsertSubmitTestRequest());

//     try{
//         const token = getToken();
//         const url = `${baseUrl}/cashier/insert-test-payment`;

//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify(formData)
//         });

//         const res = await response.json();
//         dispatch(fetchInsertSubmitSuccess(res));
//         return { ok: true, data: res.data };
//     }
//     catch(error){
//         dispatch(fetchInsertSubmitTestFailure(error.message));
//         return { ok: false, error };
//     }

// };