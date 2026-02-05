import {
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST, FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchEmployeeOnlineAppRequest = () => ({ type: FETCH_EMPLOYEE_ONLINE_APP_REQUEST });
export const fetchEmployeeOnlineAppSuccess = (data) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, payload: data });
export const fetchEmployeeOnlineAppFailure = (error) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_FAILURE, payload: error });

export const fetchEmployeeOnlineAppData = (startDate,endDate,status,page, pageSize, search) => async (dispatch) => {
    dispatch(fetchEmployeeOnlineAppRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/employee-online-app?startDate=${startDate}&endDate=${endDate}&status=${status}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchEmployeeOnlineAppSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchEmployeeOnlineAppFailure(error.message));
        return { ok: false, error };
    }
};
