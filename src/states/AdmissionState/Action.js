import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_STUDENTBYID_REQUEST, FETCH_STUDENTBYID_SUCCESS, FETCH_STUDENTBYID_FAILURE,
    FETCH_STUDENTGPA_REQUEST, FETCH_STUDENTGPA_SUCCESS, FETCH_STUDENTGPA_FAILURE,
    FETCH_STUDENTUPDATEDGPA_REQUEST, FETCH_STUDENTUPDATEDGPA_SUCCESS, FETCH_STUDENTUPDATEDGPA_FAILURE,
} from './ActionType';
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchEnrollmentTableRequest = () => ({ type: FETCH_ENROLLMENTTABLE_REQUEST });
export const fetchEnrollmentTableSuccess = (data) => ({ type: FETCH_ENROLLMENTTABLE_SUCCESS, payload: data });
export const fetchEnrollmentTableFailure = (error) => ({ type: FETCH_ENROLLMENTTABLE_FAILURE, payload: error });

export const fetchEnrollmentTableData = (StartDate = '', EndDate = '', TableType = '', page = 1, pageSize = 10, search = '') => async (dispatch) => {
    dispatch(fetchEnrollmentTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/enrollment-table?startDate=${StartDate}&endDate=${EndDate}&TableType=${TableType}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchEnrollmentTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchEnrollmentTableFailure(error));
        return { ok: false, error };
    };
};


//get student data from enrollment with status
export const fetchStudentByIdRequest = () => ({ type: FETCH_STUDENTBYID_REQUEST });
export const fetchStudentByIdSuccess = (data) => ({ type: FETCH_STUDENTBYID_SUCCESS, payload: data });
export const fetchStudentByIdFailure = (error) => ({ type: FETCH_STUDENTBYID_FAILURE, payload: error });

export const fetchStudentByIdData = (AppId = "") => async (dispatch) => {
    dispatch(fetchStudentByIdRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-student-appid?AppId=${AppId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);
        dispatch(fetchStudentByIdSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchStudentByIdFailure(error.message));
        return { ok: false, error };
    }
};


//update GPA of applicant
export const fetchStudentGpaRequest = () => ({ type: FETCH_STUDENTGPA_REQUEST });
export const fetchStudentGpaSuccess = (data) => ({ type: FETCH_STUDENTGPA_SUCCESS, payload: data });
export const fetchStudentGpaFailure = (error) => ({ type: FETCH_STUDENTGPA_FAILURE, payload: error });

export const fetchStudentGpaData = (formData) => async (dispatch) => {
    dispatch(fetchStudentGpaRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/update-student-gpa`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchStudentGpaSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchStudentGpaFailure(error.message));
        return { ok: false, error };
    }
};

//fetch gpa of applicant
export const fetchStudentUpdatedGpaRequest = () => ({ type: FETCH_STUDENTUPDATEDGPA_REQUEST });
export const fetchStudentUpdatedGpaSuccess = (data) => ({ type: FETCH_STUDENTUPDATEDGPA_SUCCESS, payload: data });
export const fetchStudentUpdatedGpaFailure = (error) => ({ type: FETCH_STUDENTUPDATEDGPA_FAILURE, payload: error });

export const fetchStudentUpdatedGpaData = (StudentId) => async (dispatch) => {
    dispatch(fetchStudentUpdatedGpaRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-student-gpa?StudentId=${StudentId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchStudentUpdatedGpaSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchStudentUpdatedGpaFailure(error.message));
        return { ok: false, error };
    }
};