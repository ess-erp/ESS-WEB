import {
    FETCH_LIST_OF_SECTION_REQUEST, FETCH_LIST_OF_SECTION_SUCCESS, FETCH_LIST_OF_SECTION_FAILURE,
    FETCH_ROW_SECTION_TABLE_REQUEST, FETCH_ROW_SECTION_TABLE_SUCCESS, FETCH_ROW_SECTION_TABLE_FAILURE,
    FETCH_ROW_STUDENT_TABLE_REQUEST, FETCH_ROW_STUDENT_TABLE_SUCCESS, FETCH_ROW_STUDENT_TABLE_FAILURE,
    FETCH_LIST_OF_SECTION_USER_REQUEST, FETCH_LIST_OF_SECTION_USER_SUCCESS, FETCH_LIST_OF_SECTION_USER_FAILURE,
    FETCH_TEACHER_SUBJECT_LOAD_REQUEST, FETCH_TEACHER_SUBJECT_LOAD_SUCCESS, FETCH_TEACHER_SUBJECT_LOAD_FAILURE,
    FETCH_LIST_OF_STUDENT_PER_TERM_REQUEST, FETCH_LIST_OF_STUDENT_PER_TERM_SUCCESS, FETCH_LIST_OF_STUDENT_PER_TERM_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchListOfSectionRequest = () => ({ type: FETCH_LIST_OF_SECTION_REQUEST });
export const fetchListOfSectionSuccess = (data) => ({ type: FETCH_LIST_OF_SECTION_SUCCESS, payload: data });
export const fetchListOfSectionFailure = (error) => ({ type: FETCH_LIST_OF_SECTION_FAILURE, payload: error });

export const fetchListOfSectionData = (teacherId,page, pageSize, search) => async (dispatch) => {
    dispatch(fetchListOfSectionRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/get-faculty-load-teacher-id?teacherId=${teacherId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchListOfSectionSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchListOfSectionFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchRowSectionTableRequest = () => ({ type: FETCH_ROW_SECTION_TABLE_REQUEST });
export const fetchRowSectionTableSuccess = (data) => ({ type: FETCH_ROW_SECTION_TABLE_SUCCESS, payload: data });
export const fetchRowSectionTableFailure = (error) => ({ type: FETCH_ROW_SECTION_TABLE_FAILURE, payload: error });

export const fetchRowSectionTableData = (loadId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchRowSectionTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/get-row-section-table?loadId=${loadId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchRowSectionTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchRowSectionTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchRowStudentTableRequest = () => ({ type: FETCH_ROW_STUDENT_TABLE_REQUEST });
export const fetchRowStudentTableSuccess = (data) => ({ type: FETCH_ROW_STUDENT_TABLE_SUCCESS, payload: data });
export const fetchRowStudentTableFailure = (error) => ({ type: FETCH_ROW_STUDENT_TABLE_FAILURE, payload: error });

export const fetchRowStudentTableData = (loadId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchRowStudentTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/get-row-student-table?loadId=${loadId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchRowStudentTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchRowStudentTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchListOfSectionUserRequest = () => ({ type: FETCH_LIST_OF_SECTION_USER_REQUEST });
export const fetchListOfSectionUserSuccess = (data) => ({ type: FETCH_LIST_OF_SECTION_USER_SUCCESS, payload: data });
export const fetchListOfSectionUserFailure = (error) => ({ type: FETCH_LIST_OF_SECTION_USER_FAILURE, payload: error });

export const fetchListOfSectionUserData = (userId,page, pageSize, search) => async (dispatch) => {
    dispatch(fetchListOfSectionUserRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/get-list-of-section-user?userId=${userId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchListOfSectionUserSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchListOfSectionUserFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchTeacherSubjectLoadRequest = () => ({ type: FETCH_TEACHER_SUBJECT_LOAD_REQUEST });
export const fetchTeacherSubjectLoadSuccess = (data) => ({ type: FETCH_TEACHER_SUBJECT_LOAD_SUCCESS, payload: data });
export const fetchTeacherSubjectLoadFailure = (error) => ({ type: FETCH_TEACHER_SUBJECT_LOAD_FAILURE, payload: error });

export const fetchTeacherSubjectLoadData = (loadId,userId,page, pageSize, search) => async (dispatch) => {
    dispatch(fetchTeacherSubjectLoadRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/get-teacher-subject-load?loadId=${loadId}&userId=${userId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchTeacherSubjectLoadSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchTeacherSubjectLoadFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchListOfStudentPerTermRequest = () => ({ type: FETCH_LIST_OF_STUDENT_PER_TERM_REQUEST });
export const fetchListOfStudentPerTermSuccess = (data) => ({ type: FETCH_LIST_OF_STUDENT_PER_TERM_SUCCESS, payload: data });
export const fetchListOfStudentPerTermFailure = (error) => ({ type: FETCH_LIST_OF_STUDENT_PER_TERM_FAILURE, payload: error });

export const fetchListOfStudentPerTermData = (loadId, subjectId, subjectType, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchListOfStudentPerTermRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/get-list-of-student-per-term?loadId=${loadId}&subjectId=${subjectId}&subjectType=${subjectType}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchListOfStudentPerTermSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchListOfStudentPerTermFailure(error.message));
        return { ok: false, error };
    }
};
