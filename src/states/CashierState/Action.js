import {
    FETCH_STUDENTAPPFORM_REQUEST, FETCH_STUDENTAPPFORM_SUCCESS, FETCH_STUDENTAPPFORM_FAILURE,
    FETCH_ORNUMBER_REQUEST, FETCH_ORNUMBER_SUCCESS, FETCH_ORNUMBER_FAILURE,
    FETCH_PRINTTESTPERMIT_REQUEST, FETCH_PRINTTESTPERMIT_SUCCESS, FETCH_PRINTTESTPERMIT_FAILURE,
    FETCH_INSERTSUBMITTEST_REQUEST, FETCH_INSERTSUBMITTEST_SUCCESS, FETCH_INSERTSUBMITTEST_FAILURE,
} from './ActionType';
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;


//get the app form
export const fetchStudentAppFormRequest = () => ({ type: FETCH_STUDENTAPPFORM_REQUEST });
export const fetchStudentAppFormSuccess = (data) => ({ type: FETCH_STUDENTAPPFORM_SUCCESS, payload: data });
export const fetchStudentAppFormFailure = (error) => ({ type: FETCH_STUDENTAPPFORM_FAILURE, payload: error });

export const fetchStudentAppFormData = (appId) => async (dispatch) => {
    dispatch(fetchStudentAppFormRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-student-app?appId=${appId}`;
         const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchStudentAppFormSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error) {
        dispatch(fetchStudentAppFormFailure(error.message));
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

export const fetchInsertSubmitTestRequest = () => ({ type: FETCH_INSERTSUBMITTEST_REQUEST });
export const fetchInsertSubmitTestSuccess = (data) => ({ type: FETCH_INSERTSUBMITTEST_SUCCESS, payload: data });
export const fetchInsertSubmitTestFailure = (error) => ({ type: FETCH_INSERTSUBMITTEST_FAILURE, payload: error });

export const fetchInsertSubmitTestData = (formData) => async (dispatch) => {
    dispatch(fetchInsertSubmitTestRequest());

    try{
        const token = getToken();
        const url = `${baseUrl}/cashier/insert-test-payment`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        });

        const res = await response.json();
        dispatch(fetchInsertSubmitSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchInsertSubmitTestFailure(error.message));
        return { ok: false, error };
    }

};