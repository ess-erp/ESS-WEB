import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_STUDENT_INFO_REQUEST, FETCH_STUDENT_INFO_SUCCESS, FETCH_STUDENT_INFO_FAILURE,

} from './ActionType';
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchEnrollmentTableRequest = () => ({ type: FETCH_ENROLLMENTTABLE_REQUEST });
export const fetchEnrollmentTableSuccess = (data) => ({ type: FETCH_ENROLLMENTTABLE_SUCCESS, payload: data });
export const fetchEnrollmentTableFailure = (error) => ({ type: FETCH_ENROLLMENTTABLE_FAILURE, payload: error });

export const fetchEnrollmentTableData = (StartDate, EndDate, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchEnrollmentTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/student-master-table?startDate=${StartDate}&endDate=${EndDate}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchEnrollmentTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchEnrollmentTableFailure(error));
        return { ok: false, error };
    };
};


export const fetchStudentInfoRequest = () => ({ type: FETCH_STUDENT_INFO_REQUEST });
export const fetchStudentInfoSuccess = (data) => ({ type: FETCH_STUDENT_INFO_SUCCESS, payload: data });
export const fetchStudentInfoFailure = (error) => ({ type: FETCH_STUDENT_INFO_FAILURE, payload: error });

export const fetchStudentInfoData = (studentId) => async (dispatch) => {
    dispatch(fetchStudentInfoRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/student-data?studentId=${studentId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchStudentInfoSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchStudentInfoFailure(error));
        return { ok: false, error };
    };
};
