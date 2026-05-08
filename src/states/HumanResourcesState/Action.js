import {
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST, FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST, FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE,
    FETCH_INSERT_HIRING_PROCESS_REQUEST, FETCH_INSERT_HIRING_PROCESS_SUCCESS, FETCH_INSERT_HIRING_PROCESS_FAILURE,
    FETCH_USER_ROLE_REQUEST, FETCH_USER_ROLE_SUCCESS, FETCH_USER_ROLE_FAILURE,
    FETCH_INSERT_TEMPLATE_TABLE_REQUEST, FETCH_INSERT_TEMPLATE_TABLE_SUCCESS, FETCH_INSERT_TEMPLATE_TABLE_FAILURE,
    FETCH_HR_TEMPLATE_REQUEST, FETCH_HR_TEMPLATE_SUCCESS, FETCH_HR_TEMPLATE_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_SCREENING_REQUEST, FETCH_EMPLOYEE_APPLICATION_SCREENING_SUCCESS, FETCH_EMPLOYEE_APPLICATION_SCREENING_FAILURE,
    FETCH_CRITERIA_TABLE_REQUEST, FETCH_CRITERIA_TABLE_SUCCESS, FETCH_CRITERIA_TABLE_FAILURE,
    FETCH_SAC_USER_REQUEST, FETCH_SAC_USER_SUCCESS, FETCH_SAC_USER_FAILURE,
    FETCH_AP_USER_REQUEST, FETCH_AP_USER_SUCCESS, FETCH_AP_USER_FAILURE,
    FETCH_PRINCIPAL_USER_REQUEST, FETCH_PRINCIPAL_USER_SUCCESS, FETCH_PRINCIPAL_USER_FAILURE,
    FETCH_UPDATE_EMPLOYEE_SCREENING_REQUEST, FETCH_UPDATE_EMPLOYEE_SCREENING_SUCCESS, FETCH_UPDATE_EMPLOYEE_SCREENING_FAILURE,
    FETCH_DEPARTMENT_TEMPLATE_REQUEST, FETCH_DEPARTMENT_TEMPLATE_SUCCESS, FETCH_DEPARTMENT_TEMPLATE_FAILURE,
    FETCH_POSITION_TEMPLATE_REQUEST, FETCH_POSITION_TEMPLATE_SUCCESS, FETCH_POSITION_TEMPLATE_FAILURE,
    FETCH_GOLDEN_RANK_TEMPLATE_REQUEST, FETCH_GOLDEN_RANK_TEMPLATE_SUCCESS, FETCH_GOLDEN_RANK_TEMPLATE_FAILURE,
    FETCH_INSERT_HIRED_EMPLOYEE_REQUEST, FETCH_INSERT_HIRED_EMPLOYEE_SUCCESS, FETCH_INSERT_HIRED_EMPLOYEE_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchEmployeeOnlineAppRequest = () => ({ type: FETCH_EMPLOYEE_ONLINE_APP_REQUEST });
export const fetchEmployeeOnlineAppSuccess = (data) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, payload: data });
export const fetchEmployeeOnlineAppFailure = (error) => ({ type: FETCH_EMPLOYEE_ONLINE_APP_FAILURE, payload: error });

export const fetchEmployeeOnlineAppData = (startDate, endDate, userRoleId, status, page, pageSize, search) => async (dispatch) => {
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
        const url = `${baseUrl}/hr/get-employee-application-information?employeeAppId=${employeeAppId}`;

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


export const fetchInsertHiringProcessRequest = () => ({ type: FETCH_INSERT_HIRING_PROCESS_REQUEST });
export const fetchInsertHiringProcessSuccess = (data) => ({ type: FETCH_INSERT_HIRING_PROCESS_SUCCESS, payload: data });
export const fetchInsertHiringProcessFailure = (error) => ({ type: FETCH_INSERT_HIRING_PROCESS_FAILURE, payload: error });

export const fetchInsertHiringProcessData = (formData) => async (dispatch) => {
    dispatch(fetchInsertHiringProcessRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/insert-hiring-process`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertHiringProcessSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchInsertHiringProcessFailure(error.message));
        return ({ ok: false, error })
    }
};


export const fetchUserRoleRequest = () => ({ type: FETCH_USER_ROLE_REQUEST });
export const fetchUserRoleSuccess = (data) => ({ type: FETCH_USER_ROLE_SUCCESS, payload: data });
export const fetchUserRoleFailure = (error) => ({ type: FETCH_USER_ROLE_FAILURE, payload: error });

export const fetchUserRoleData = () => async (dispatch) => {
    dispatch(fetchUserRoleRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-user-role`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchUserRoleSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchUserRoleFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchInsertTemplateTableRequest = () => ({ type: FETCH_INSERT_TEMPLATE_TABLE_REQUEST });
export const fetchInsertTemplateTableSuccess = (data) => ({ type: FETCH_INSERT_TEMPLATE_TABLE_SUCCESS, payload: data });
export const fetchInsertTemplateTableFailure = (error) => ({ type: FETCH_INSERT_TEMPLATE_TABLE_FAILURE, payload: error });

export const fetchInsertTemplateTableData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTemplateTableRequest());
    try {
        const token = getToken();
        let url = "";
        switch (formData.TempId) {
            case 1:
                url = `${baseUrl}/hr/insert-criteria-table`;
                break;
            case 2:
                url = `${baseUrl}/hr/insert-department-table`;
                break;
            case 3:
                url = `${baseUrl}/hr/insert-position-table`;
                break;
            case 4:
                url = `${baseUrl}/hr/insert-golden-rank-table`;
                break;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertTemplateTableSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchInsertTemplateTableFailure(error.message));
        return ({ ok: false, error })
    }
};


export const fetchHrTemplateRequest = () => ({ type: FETCH_HR_TEMPLATE_REQUEST });
export const fetchHrTemplateSuccess = (data) => ({ type: FETCH_HR_TEMPLATE_SUCCESS, payload: data });
export const fetchHrTemplateFailure = (error) => ({ type: FETCH_HR_TEMPLATE_FAILURE, payload: error });

export const fetchHrTemplateData = (status, page, pageSize, search) => async (dispatch) => {
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
    catch (error) {
        dispatch(fetchHrTemplateFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchEmployeeApplicationScreeningRequest = () => ({ type: FETCH_EMPLOYEE_APPLICATION_SCREENING_REQUEST });
export const fetchEmployeeApplicationScreeningSuccess = (data) => ({ type: FETCH_EMPLOYEE_APPLICATION_SCREENING_SUCCESS, payload: data });
export const fetchEmployeeApplicationScreeningFailure = (error) => ({ type: FETCH_EMPLOYEE_APPLICATION_SCREENING_FAILURE, payload: error });

export const fetchEmployeeApplicationScreeningData = (employeeAppId) => async (dispatch) => {
    dispatch(fetchEmployeeApplicationScreeningRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-employee-application-screening?employeeAppId=${employeeAppId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();

        dispatch(fetchEmployeeApplicationScreeningSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchEmployeeApplicationScreeningFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchCriteriaTableRequest = () => ({ type: FETCH_CRITERIA_TABLE_REQUEST });
export const fetchCriteriaTableSuccess = (data) => ({ type: FETCH_CRITERIA_TABLE_SUCCESS, payload: data });
export const fetchCriteriaTableFailure = (error) => ({ type: FETCH_CRITERIA_TABLE_FAILURE, payload: error });

export const fetchCriteriaTableData = (employeeAppId, page, pageSize) => async (dispatch) => {
    dispatch(fetchCriteriaTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-criteria-table?employeeAppId=${employeeAppId}&page=${page}&pageSize=${pageSize}`;

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


export const fetchSacUserRequest = () => ({ type: FETCH_SAC_USER_REQUEST });
export const fetchSacUserSuccess = (data) => ({ type: FETCH_SAC_USER_SUCCESS, payload: data });
export const fetchSacUserFailure = (error) => ({ type: FETCH_SAC_USER_FAILURE, payload: error });

export const fetchSacUserData = (userRoleId) => async (dispatch) => {
    dispatch(fetchSacUserRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-criteria-user?userRoleId=${userRoleId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchSacUserSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchSacUserFailure(error.message));
        return ({ ok: false, error })
    }
};


export const fetchApUserRequest = () => ({ type: FETCH_AP_USER_REQUEST });
export const fetchApUserSuccess = (data) => ({ type: FETCH_AP_USER_SUCCESS, payload: data });
export const fetchApUserFailure = (error) => ({ type: FETCH_AP_USER_FAILURE, payload: error });

export const fetchApUserData = (userRoleId) => async (dispatch) => {
    dispatch(fetchApUserRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-criteria-user?userRoleId=${userRoleId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchApUserSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchApUserFailure(error.message));
        return ({ ok: false, error })
    }
};


export const fetchPrincipalUserRequest = () => ({ type: FETCH_PRINCIPAL_USER_REQUEST });
export const fetchPrincipalUserSuccess = (data) => ({ type: FETCH_PRINCIPAL_USER_SUCCESS, payload: data });
export const fetchPrincipalUserFailure = (error) => ({ type: FETCH_PRINCIPAL_USER_FAILURE, payload: error });

export const fetchPrincipalUserData = (userRoleId) => async (dispatch) => {
    dispatch(fetchPrincipalUserRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-criteria-user?userRoleId=${userRoleId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchPrincipalUserSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchPrincipalUserFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchUpdateEmployeeScreeningRequest = () => ({ type: FETCH_UPDATE_EMPLOYEE_SCREENING_REQUEST });
export const fetchUpdateEmployeeScreeningSuccess = (data) => ({ type: FETCH_UPDATE_EMPLOYEE_SCREENING_SUCCESS, payload: data });
export const fetchUpdateEmployeeScreeningFailure = (error) => ({ type: FETCH_UPDATE_EMPLOYEE_SCREENING_FAILURE, payload: error });

export const fetchUpdateEmployeeScreeningData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateEmployeeScreeningRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/update-employee-screening`;

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

export const fetchDepartmentTemplateRequest = () => ({ type: FETCH_DEPARTMENT_TEMPLATE_REQUEST });
export const fetchDepartmentTemplateSuccess = (data) => ({ type: FETCH_DEPARTMENT_TEMPLATE_SUCCESS, payload: data });
export const fetchDepartmentTemplateFailure = (error) => ({ type: FETCH_DEPARTMENT_TEMPLATE_FAILURE, payload: error });

export const fetchDepartmentTemplateData = () => async (dispatch) => {
    dispatch(fetchDepartmentTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-department-template`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchDepartmentTemplateSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchDepartmentTemplateFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchPositionTemplateRequest = () => ({ type: FETCH_POSITION_TEMPLATE_REQUEST });
export const fetchPositionTemplateSuccess = (data) => ({ type: FETCH_POSITION_TEMPLATE_SUCCESS, payload: data });
export const fetchPositionTemplateFailure = (error) => ({ type: FETCH_POSITION_TEMPLATE_FAILURE, payload: error });

export const fetchPositionTemplateData = () => async (dispatch) => {
    dispatch(fetchPositionTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-position-template`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchPositionTemplateSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchPositionTemplateFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchGoldenRankTemplateRequest = () => ({ type: FETCH_GOLDEN_RANK_TEMPLATE_REQUEST });
export const fetchGoldenRankTemplateSuccess = (data) => ({ type: FETCH_GOLDEN_RANK_TEMPLATE_SUCCESS, payload: data });
export const fetchGoldenRankTemplateFailure = (error) => ({ type: FETCH_GOLDEN_RANK_TEMPLATE_FAILURE, payload: error });

export const fetchGoldenRankTemplateData = () => async (dispatch) => {
    dispatch(fetchGoldenRankTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/get-golden-rank-template`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchGoldenRankTemplateSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchGoldenRankTemplateFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchInsertHiredEmployeeRequest = () => ({ type: FETCH_INSERT_HIRED_EMPLOYEE_REQUEST });
export const fetchInsertHiredEmployeeSuccess = (data) => ({ type: FETCH_INSERT_HIRED_EMPLOYEE_SUCCESS, payload: data });
export const fetchInsertHiredEmployeeFailure = (error) => ({ type: FETCH_INSERT_HIRED_EMPLOYEE_FAILURE, payload: error });

export const fetchInsertHiredEmployeeData = (formData) => async (dispatch) => {
    dispatch(fetchInsertHiredEmployeeRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/hr/insert-hired-employee`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertHiredEmployeeSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchInsertHiredEmployeeFailure(error.message));
        return ({ ok: false, error })
    }
};

// export const fetchEmployeeFullScreeningRequest = () => ({ type: FETCH_EMPLOYEE_FULL_SCREENING_REQUEST });
// export const fetchEmployeeFullScreeningSuccess = (data) => ({ type: FETCH_EMPLOYEE_FULL_SCREENING_SUCCESS, payload: data });
// export const fetchEmployeeFullScreeningFailure = (error) => ({ type: FETCH_EMPLOYEE_FULL_SCREENING_FAILURE, payload: error });

// export const fetchEmployeeFullScreeningData = (employeeId,page, pageSize) => async (dispatch) => {
//     dispatch(fetchEmployeeFullScreeningRequest());
//     try {
//         const token = getToken();
//         const url = `${baseUrl}/hr/employee-full-screening?employeeId=${employeeId}&page=${page}&pageSize=${pageSize}`;

//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//         });

//         const res = await response.json();
//         dispatch(fetchEmployeeFullScreeningSuccess(res));
//         return ({ ok: true, data: res.data, totalRecords: res.totalRecords });
//     }
//     catch (error) {
//         dispatch(fetchEmployeeFullScreeningFailure(error.message));
//         return ({ ok: false, error })
//     }
// };