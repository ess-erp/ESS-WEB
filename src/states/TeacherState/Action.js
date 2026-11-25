import {
    FETCH_LIST_OF_SECTION_REQUEST, FETCH_LIST_OF_SECTION_SUCCESS, FETCH_LIST_OF_SECTION_FAILURE,
    FETCH_ROW_SECTION_TABLE_REQUEST, FETCH_ROW_SECTION_TABLE_SUCCESS, FETCH_ROW_SECTION_TABLE_FAILURE,
    FETCH_ROW_STUDENT_TABLE_REQUEST, FETCH_ROW_STUDENT_TABLE_SUCCESS, FETCH_ROW_STUDENT_TABLE_FAILURE,
    FETCH_LIST_OF_SECTION_USER_REQUEST, FETCH_LIST_OF_SECTION_USER_SUCCESS, FETCH_LIST_OF_SECTION_USER_FAILURE,
    FETCH_TEACHER_SUBJECT_LOAD_REQUEST, FETCH_TEACHER_SUBJECT_LOAD_SUCCESS, FETCH_TEACHER_SUBJECT_LOAD_FAILURE,
    FETCH_LIST_OF_STUDENT_PER_TERM_REQUEST, FETCH_LIST_OF_STUDENT_PER_TERM_SUCCESS, FETCH_LIST_OF_STUDENT_PER_TERM_FAILURE,
    FETCH_INSERT_ENCODED_GRADES_REQUEST, FETCH_INSERT_ENCODED_GRADES_SUCCESS, FETCH_INSERT_ENCODED_GRADES_FAILURE,
    FETCH_FINALIZE_ENCODED_GRADES_REQUEST, FETCH_FINALIZE_ENCODED_GRADES_SUCCESS, FETCH_FINALIZE_ENCODED_GRADES_FAILURE,
    FETCH_SCHOOL_CALENDAR_STATUS_REQUEST, FETCH_SCHOOL_CALENDAR_STATUS_SUCCESS, FETCH_SCHOOL_CALENDAR_STATUS_FAILURE,
    FETCH_SECTION_STUDENTS_WITH_SUBJECTS_REQUEST, FETCH_SECTION_STUDENTS_WITH_SUBJECTS_SUCCESS, FETCH_SECTION_STUDENTS_WITH_SUBJECTS_FAILURE,
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
            method: 'GET',
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
            method: 'GET',
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
            method: 'GET',
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
            method: 'GET',
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
            method: 'GET',
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
            method: 'GET',
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

export const fetchInsertEncodedGradesRequest = () => ({ type: FETCH_INSERT_ENCODED_GRADES_REQUEST });
export const fetchInsertEncodedGradesSuccess = (data) => ({ type: FETCH_INSERT_ENCODED_GRADES_SUCCESS, payload: data });
export const fetchInsertEncodedGradesFailure = (error) => ({ type: FETCH_INSERT_ENCODED_GRADES_FAILURE, payload: error });

export const fetchInsertEncodedGradesData = (formData) => async (dispatch) => {
    dispatch(fetchInsertEncodedGradesRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/insert-encoded-grades`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertEncodedGradesSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchInsertEncodedGradesFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchFinalizeEncodedGradesRequest = () => ({ type: FETCH_FINALIZE_ENCODED_GRADES_REQUEST });
export const fetchFinalizeEncodedGradesSuccess = (data) => ({ type: FETCH_FINALIZE_ENCODED_GRADES_SUCCESS, payload: data });
export const fetchFinalizeEncodedGradesFailure = (error) => ({ type: FETCH_FINALIZE_ENCODED_GRADES_FAILURE, payload: error });

export const fetchFinalizeEncodedGradesData = (formData) => async (dispatch) => {
    dispatch(fetchFinalizeEncodedGradesRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/finalize-encoded-grades`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchFinalizeEncodedGradesSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchFinalizeEncodedGradesFailure(error.message));
        return { ok: false, error };
    }
};


// School Calendar Status Check
export const fetchSchoolCalendarStatusRequest = () => ({ type: FETCH_SCHOOL_CALENDAR_STATUS_REQUEST });
export const fetchSchoolCalendarStatusSuccess = (data) => ({ type: FETCH_SCHOOL_CALENDAR_STATUS_SUCCESS, payload: data });
export const fetchSchoolCalendarStatusFailure = (error) => ({ type: FETCH_SCHOOL_CALENDAR_STATUS_FAILURE, payload: error });

export const fetchSchoolCalendarStatus = () => async (dispatch) => {
    dispatch(fetchSchoolCalendarStatusRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/get-school-calendar-status`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(fetchSchoolCalendarStatusSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchSchoolCalendarStatusFailure(error.message));
        return { ok: false, error: error.message };
    }
};

// Fetch Section Students With Subjects (for grade encoding)
export const fetchSectionStudentsWithSubjectsRequest = () => ({ type: FETCH_SECTION_STUDENTS_WITH_SUBJECTS_REQUEST });
export const fetchSectionStudentsWithSubjectsSuccess = (data) => ({ type: FETCH_SECTION_STUDENTS_WITH_SUBJECTS_SUCCESS, payload: data });
export const fetchSectionStudentsWithSubjectsFailure = (error) => ({ type: FETCH_SECTION_STUDENTS_WITH_SUBJECTS_FAILURE, payload: error });

export const fetchSectionStudentsWithSubjects = (loadId, userId, gender, page = 0, pageSize = 100, search = '') => async (dispatch) => {
    dispatch(fetchSectionStudentsWithSubjectsRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/get-section-students-with-subjects?loadId=${loadId}&userId=${userId}&gender=${encodeURIComponent(gender)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        dispatch(fetchSectionStudentsWithSubjectsSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchSectionStudentsWithSubjectsFailure(error.message));
        return { ok: false, error: error.message };
    }
};
