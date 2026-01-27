import {
    FETCH_TEMPLATETABLE_REQUEST, FETCH_TEMPLATETABLE_SUCCESS, FETCH_TEMPLATETABLE_FAILURE,
    FETCH_LISTOFUSER_REQUEST, FETCH_LISTOFUSER_SUCCESS, FETCH_LISTOFUSER_FAILURE,
    FETCH_INSERTORSERIES_REQUEST, FETCH_INSERTORSERIES_SUCCESS, FETCH_INSERTORSERIES_FAILURE,
    FETCH_INSERT_TABLE_OF_FEES_REQUEST, FETCH_INSERT_TABLE_OF_FEES_SUCCESS, FETCH_INSERT_TABLE_OF_FEES_FAILURE,
    FETCH_INSERT_TUITION_FEE_REQUEST, FETCH_INSERT_TUITION_FEE_SUCCESS, FETCH_INSERT_TUITION_FEE_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

//get the template table 
export const fetchTemplateTableRequest = () => ({ type: FETCH_TEMPLATETABLE_REQUEST });
export const fetchTemplateTableSuccess = (data) => ({ type: FETCH_TEMPLATETABLE_SUCCESS, payload: data });
export const fetchTempalteTableFailure = (error) => ({ type: FETCH_TEMPLATETABLE_FAILURE, payload: error });

export const fetchTemplateTableData = (tableType, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchTemplateTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/finance/template-table?tableType=${tableType}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchTemplateTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchTempalteTableFailure(error.message));
        return { ok: false, error };
    }

};

//get user by user id 
export const fetchListOfUserRequest = () => ({ type: FETCH_LISTOFUSER_REQUEST });
export const fetchListOfUserSuccess = (data) => ({ type: FETCH_LISTOFUSER_SUCCESS, payload: data  });
export const fetchListOfUserFailure = (error) => ({ type: FETCH_LISTOFUSER_FAILURE, payload: error });

export const fetchListOfUserData = () => async (dispatch) => {
    dispatch(fetchListOfUserRequest());

    try{
        const token = getToken();
        const url = `${baseUrl}/finance/get-list-user`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchListOfUserSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchListOfUserFailure(error.message));
        return { ok: false, error }
    }
};

export const fetchInsertTableOfFeesRequest = () => ({ type: FETCH_INSERT_TABLE_OF_FEES_REQUEST });
export const fetchInsertTableOfFeesSuccess = (data) => ({ type: FETCH_INSERT_TABLE_OF_FEES_SUCCESS, payload: data });
export const fetchInsertTableOfFeesFailure = (error) => ({ type: FETCH_INSERT_TABLE_OF_FEES_FAILURE, payload: error });

export const fetchInsertTableOfFeesData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTableOfFeesRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/finance/insert-or-fees`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertTableOfFeesSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchInsertTableOfFeesFailure(error.message));
        return { ok: false, error};
    }
}; 

//insert OR series
export const fetchInsertOrSeriesRequest = () => ({ type: FETCH_INSERTORSERIES_REQUEST });
export const fetchInsertOrSeriesSuccess = (data) => ({ type: FETCH_INSERTORSERIES_SUCCESS, payload: data });
export const fetchInsertOrSeriesFailure = (error) => ({ type: FETCH_INSERTORSERIES_FAILURE, payload: error });

export const fetchInsertOrSeriesData = (formData) => async (dispatch) => {
    dispatch(fetchInsertOrSeriesRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/finance/insert-or-series`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertOrSeriesSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchInsertOrSeriesFailure(error.message));
        return { ok: false, error};
    }
}; 

//insert OR series
export const fetchInsertTuitioFeeRequest = () => ({ type: FETCH_INSERT_TUITION_FEE_REQUEST });
export const fetchInsertTuitioFeeSuccess = (data) => ({ type: FETCH_INSERT_TUITION_FEE_SUCCESS, payload: data });
export const fetchInsertTuitioFeeFailure = (error) => ({ type: FETCH_INSERT_TUITION_FEE_FAILURE, payload: error });

export const fetchInsertTuitioFeeData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTuitioFeeRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/finance/insert-tuition-fee`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertTuitioFeeSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchInsertTuitioFeeFailure(error.message));
        return { ok: false, error};
    }
}; 