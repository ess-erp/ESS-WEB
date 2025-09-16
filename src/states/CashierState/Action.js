import {
    FETCH_STUDENTAPPFORM_REQUEST, FETCH_STUDENTAPPFORM_SUCCESS, FETCH_STUDENTAPPFORM_FAILURE,
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
}