import {
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST, FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST, FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE,
    FETCH_INSERT_HIRING_PROCESS_REQUEST, FETCH_INSERT_HIRING_PROCESS_SUCCESS, FETCH_INSERT_HIRING_PROCESS_FAILURE,
    FETCH_USER_ROLE_REQUEST, FETCH_USER_ROLE_SUCCESS, FETCH_USER_ROLE_FAILURE,
    FETCH_INSERT_CRITERIA_TEMPLATE_REQUEST, FETCH_INSERT_CRITERIA_TEMPLATE_SUCCESS, FETCH_INSERT_CRITERIA_TEMPLATE_FAILURE,
    FETCH_HR_TEMPLATE_REQUEST, FETCH_HR_TEMPLATE_SUCCESS, FETCH_HR_TEMPLATE_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_SCREENING_REQUEST, FETCH_EMPLOYEE_APPLICATION_SCREENING_SUCCESS, FETCH_EMPLOYEE_APPLICATION_SCREENING_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchEmployeeOnlineAppRequest = () => ({ type: FETCH_EMPLOYEE_ONLINE_APP_REQUEST });
export const fetchEmployeeOnlineAppSuccess = (data) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, payload: data });
export const fetchEmployeeOnlineAppFailure = (error) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_FAILURE, payload: error });

export const fetchEmployeeOnlineAppData = (startDate,endDate,userRoleId,status,page, pageSize, search) => async (dispatch) => {
    dispatch(fetchEmployeeOnlineAppRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/employee-online-app?startDate=${startDate}&endDate=${endDate}&userRoleId=${userRoleId}&status=${status}&page=${page}&pageSize=${pageSize}&search=${search}`;

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


export const fetchUserRoleRequest = () => ({ type: FETCH_USER_ROLE_REQUEST });
export const fetchUserRoleSuccess = (data) => ({ type: FETCH_USER_ROLE_SUCCESS, payload: data });
export const fetchUserRoleFailure = (error) => ({ type: FETCH_USER_ROLE_FAILURE, payload: error });

export const fetchUserRoleData = () => async (dispatch) => {
    dispatch(fetchUserRoleRequest());
    try{
        const token = getToken();
        const url = `${baseUrl}/hr/get-user-role`;

        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchUserRoleSuccess(res));
        return({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchUserRoleFailure(error.message));
        return({ ok: false, error })
    }
};

export const fetchInsertCriteriaTemplateRequest = () => ({ type: FETCH_INSERT_CRITERIA_TEMPLATE_REQUEST });
export const fetchInsertCriteriaTemplateSuccess = (data) => ({ type: FETCH_INSERT_CRITERIA_TEMPLATE_SUCCESS, payload: data });
export const fetchInsertCriteriaTemplateFailure = (error) => ({ type: FETCH_INSERT_CRITERIA_TEMPLATE_FAILURE, payload: error });

export const fetchInsertCriteriaTemplateData = (formData) => async (dispatch) => {
    dispatch(fetchInsertCriteriaTemplateRequest());
    try{
        const token = getToken();
        const url = `${baseUrl}/hr/insert-criteria-template`;

        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertCriteriaTemplateSuccess(res));
        return({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchInsertCriteriaTemplateFailure(error.message));
        return({ ok: false, error })
    }
};


export const fetchHrTemplateRequest = () => ({ type: FETCH_HR_TEMPLATE_REQUEST });
export const fetchHrTemplateSuccess = (data) => ({ type: FETCH_HR_TEMPLATE_SUCCESS, payload: data });
export const fetchHrTemplateFailure = (error) => ({ type: FETCH_HR_TEMPLATE_FAILURE, payload: error });

export const fetchHrTemplateData = (status,page, pageSize, search) => async (dispatch) => {
    dispatch(fetchHrTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-hr-template?status=${status}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchHrTemplateSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchHrTemplateFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchEmployeeApplicationScreeningRequest = () => ({ type: FETCH_EMPLOYEE_APPLICATION_SCREENING_REQUEST });
export const fetchEmployeeApplicationScreeningSuccess = (data) => ({ type: FETCH_EMPLOYEE_APPLICATION_SCREENING_SUCCESS, payload: data });
export const fetchEmployeeApplicationScreeningFailure = (error) => ({ type: FETCH_EMPLOYEE_APPLICATION_SCREENING_FAILURE, payload: error });

export const fetchEmployeeApplicationScreeningData = (employeeAppId) => async (dispatch) => {
    dispatch(fetchEmployeeApplicationScreeningRequest());
    try{
        const token = getToken();
        const url = `${baseUrl}/hr/get-employee-application-screening?employeeAppId=${employeeAppId}`;

        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        dispatch(fetchEmployeeApplicationScreeningSuccess(res));
        return({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchEmployeeApplicationScreeningFailure(error.message));
        return({ ok: false, error })
    }
};
