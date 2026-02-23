import {
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST, FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST, FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE,
    FETCH_INSERT_HIRING_PROCESS_REQUEST, FETCH_INSERT_HIRING_PROCESS_SUCCESS, FETCH_INSERT_HIRING_PROCESS_FAILURE,
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

export const fetchEmployeeApplicationInfoRequest = () => ({ type: FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST });
export const fetchEmployeeApplicationInfoSuccess = (data) => ({ type: FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, payload: data });
export const fetchEmployeeApplicationInfoFailure = (error) => ({ type: FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE, payload: error });

export const fetchEmployeeApplicationInfoData = (employeeAppId) => async (dispatch) => {
    dispatch(fetchEmployeeApplicationInfoRequest());
    try{
        const token = getToken();
        const url = `${baseUrl}/hr/get-employee-application-information?employeeAppId=${employeeAppId}`;

        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        dispatch(fetchEmployeeApplicationInfoSuccess(res));
        return({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchEmployeeApplicationInfoFailure(error.message));
        return({ ok: false, error })
    }
};


export const fetchInsertHiringProcessRequest = () => ({ type: FETCH_INSERT_HIRING_PROCESS_REQUEST });
export const fetchInsertHiringProcessSuccess = (data) => ({ type: FETCH_INSERT_HIRING_PROCESS_SUCCESS, payload: data });
export const fetchInsertHiringProcessFailure = (error) => ({ type: FETCH_INSERT_HIRING_PROCESS_FAILURE, payload: error });

export const fetchInsertHiringProcessData = (formData) => async (dispatch) => {
    dispatch(fetchInsertHiringProcessRequest());
    try{
        const token = getToken();
        const url = `${baseUrl}/hr/insert-hiring-process`;

        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertHiringProcessSuccess(res));
        return({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchInsertHiringProcessFailure(error.message));
        return({ ok: false, error })
    }
};