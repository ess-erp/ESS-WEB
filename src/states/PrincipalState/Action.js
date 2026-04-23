import {
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST, FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST, FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE,
    FETCH_CRITERIA_TABLE_REQUEST, FETCH_CRITERIA_TABLE_SUCCESS, FETCH_CRITERIA_TABLE_FAILURE,
    FETCH_INSERT_PRINCIPAL_SCREENING_REQUEST, FETCH_INSERT_PRINCIPAL_SCREENING_SUCCESS, FETCH_INSERT_PRINCIPAL_SCREENING_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchEmployeeOnlineAppRequest = () => ({ type: FETCH_EMPLOYEE_ONLINE_APP_REQUEST });
export const fetchEmployeeOnlineAppSuccess = (data) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, payload: data });
export const fetchEmployeeOnlineAppFailure = (error) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_FAILURE, payload: error });

export const fetchEmployeeOnlineAppData = (startDate, endDate, status, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchEmployeeOnlineAppRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/principal/employee-online-app?startDate=${startDate}&endDate=${endDate}&status=${status}&page=${page}&pageSize=${pageSize}&search=${search}`;

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
    catch (error) {
        dispatch(fetchEmployeeOnlineAppFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchEmployeeApplicationInfoRequest = () => ({ type: FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST });
export const fetchEmployeeApplicationInfoSuccess = (data) => ({ type: FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, payload: data });
export const fetchEmployeeApplicationInfoFailure = (error) => ({ type: FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE, payload: error });

export const fetchEmployeeApplicationInfoData = (employeeAppId) => async (dispatch) => {
    dispatch(fetchEmployeeApplicationInfoRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/principal/get-employee-application-information?employeeAppId=${employeeAppId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        dispatch(fetchEmployeeApplicationInfoSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchEmployeeApplicationInfoFailure(error.message));
        return ({ ok: false, error })
    }
};
export const fetchCriteriaTableRequest = () => ({ type: FETCH_CRITERIA_TABLE_REQUEST });
export const fetchCriteriaTableSuccess = (data) => ({ type: FETCH_CRITERIA_TABLE_SUCCESS, payload: data });
export const fetchCriteriaTableFailure = (error) => ({ type: FETCH_CRITERIA_TABLE_FAILURE, payload: error });

export const fetchCriteriaTableData = (userId, page, pageSize) => async (dispatch) => {
    dispatch(fetchCriteriaTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/principal/get-criteria-table?userId=${userId}&page=${page}&pageSize=${pageSize}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchCriteriaTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchCriteriaTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchUpdateEmployeeScreeningRequest = () => ({ type: FETCH_UPDATE_EMPLOYEE_SCREENING_REQUEST });
export const fetchUpdateEmployeeScreeningSuccess = (data) => ({ type: FETCH_UPDATE_EMPLOYEE_SCREENING_SUCCESS, payload: data });
export const fetchUpdateEmployeeScreeningFailure = (error) => ({ type: FETCH_UPDATE_EMPLOYEE_SCREENING_FAILURE, payload: error });

export const fetchUpdateEmployeeScreeningData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateEmployeeScreeningRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/principal/update-employee-screening`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchUpdateEmployeeScreeningSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchUpdateEmployeeScreeningFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchInsertPrincipalScreeningRequest = () => ({type: FETCH_INSERT_PRINCIPAL_SCREENING_REQUEST });
export const fetchInsertPrincipalScreeningSuccess = (data) => ({type: FETCH_INSERT_PRINCIPAL_SCREENING_SUCCESS, payload: data });
export const fetchInsertPrincipalScreeningFailure = (error) => ({type: FETCH_INSERT_PRINCIPAL_SCREENING_FAILURE, payload: error });

export const fetchInsertPrincipalScreeningData = (formData) => async(dispatch) => {
    dispatch(fetchInsertPrincipalScreeningRequest());
    try{
        const token = getToken();
        const url = `${baseUrl}/principal/insert-principal-screening`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertPrincipalScreeningSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchInsertPrincipalFailure(error.message));
        return ({ ok: false, error });
    }
}