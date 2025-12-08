import {
    FETCH_LISTOFUSER_REQUEST, FETCH_LISTOFUSER_SUCCESS, FETCH_LISTOFUSER_FAILURE,
    FETCH_INSERTORSERIES_REQUEST, FETCH_INSERTORSERIES_SUCCESS, FETCH_INSERTORSERIES_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

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