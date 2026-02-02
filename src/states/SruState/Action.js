import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_STUDENT_INFO_REQUEST, FETCH_STUDENT_INFO_SUCCESS, FETCH_STUDENT_INFO_FAILURE,
    FETCH_UPDATE_STUDENT_INFO_REQUEST, FETCH_UPDATE_STUDENT_INFO_SUCCESS, FETCH_UPDATE_STUDENT_INFO_FAILURE,
    FETCH_INSERT_SECTION_NAME_REQUEST, FETCH_INSERT_SECTION_NAME_SUCCESS, FETCH_INSERT_SECTION_NAME_FAILURE,
    FETCH_GET_SECTION_NAME_REQUEST, FETCH_GET_SECTION_NAME_SUCCESS, FETCH_GET_SECTION_NAME_FAILURE,
    FETCH_GET_ENROLLED_STUDENT_REQUEST, FETCH_GET_ENROLLED_STUDENT_SUCCESS, FETCH_GET_ENROLLED_STUDENT_FAILURE,
    FETCH_INSERT_STUDENT_SECTION_REQUEST, FETCH_INSERT_STUDENT_SECTION_SUCCESS, FETCH_INSERT_STUDENT_SECTION_FAILURE,
    FETCH_GET_STUDENT_SECTION_LIST_REQUEST, FETCH_GET_STUDENT_SECTION_LIST_SUCCESS, FETCH_GET_STUDENT_SECTION_LIST_FAILURE,
    FETCH_INSERT_HOUSE_NAME_REQUEST, FETCH_INSERT_HOUSE_NAME_SUCCESS, FETCH_INSERT_HOUSE_NAME_FAILURE,
    FETCH_GET_HOUSE_NAME_REQUEST, FETCH_GET_HOUSE_NAME_SUCCESS, FETCH_GET_HOUSE_NAME_FAILURE,
    FETCH_GET_HOUSE_STUDENT_REQUEST, FETCH_GET_HOUSE_STUDENT_SUCCESS, FETCH_GET_HOUSE_STUDENT_FAILURE,
    FETCH_INSERT_STUDENT_HOUSE_REQUEST, FETCH_INSERT_STUDENT_HOUSE_SUCCESS, FETCH_INSERT_STUDENT_HOUSE_FAILURE,
    FETCH_GET_STUDENT_HOUSE_LIST_REQUEST, FETCH_GET_STUDENT_HOUSE_LIST_SUCCESS, FETCH_GET_STUDENT_HOUSE_LIST_FAILURE,
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

export const fetchUpdateStudentInfoRequest = () => ({ type: FETCH_UPDATE_STUDENT_INFO_REQUEST });
export const fetchUpdateStudentInfoSuccess = (data) => ({ type: FETCH_UPDATE_STUDENT_INFO_SUCCESS, payload: data });
export const fetchUpdateStudentInfoFailure = (error) => ({ type: FETCH_UPDATE_STUDENT_INFO_FAILURE, payload: error });

export const fetchUpdateStudentInfoData = (formData) => async (dispatch) => {
    dispatch(fetchStudentInfoRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/update-student-data`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchUpdateStudentInfoSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchUpdateStudentInfoFailure(error.message));
        return { ok: false, error };
    };
};


export const fetchInsertSectionNameRequest = () => ({ type: FETCH_INSERT_SECTION_NAME_REQUEST });
export const fetchInsertSectionNameSuccess = (data) => ({ type: FETCH_INSERT_SECTION_NAME_SUCCESS, payload: data });
export const fetchInsertSectionNameFailure = (error) => ({ type: FETCH_INSERT_SECTION_NAME_FAILURE, payload: error });

export const fetchInsertSectionNameData = (formData) => async (dispatch) => {
    dispatch(fetchInsertSectionNameRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/insert-section-name`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertSectionNameSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertSectionNameFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchGetSectionNameRequest = () => ({ type: FETCH_GET_SECTION_NAME_REQUEST });
export const fetchGetSectionNameSuccess = (data) => ({ type: FETCH_GET_SECTION_NAME_SUCCESS, payload: data });
export const fetchGetSectionNameFailure = (error) => ({ type: FETCH_GET_SECTION_NAME_FAILURE, payload: error });

export const fetchGetSectionNameData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetSectionNameRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-section-list?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchGetSectionNameSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchGetSectionNameFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchGetEnrolledStudentRequest = () => ({ type: FETCH_GET_ENROLLED_STUDENT_REQUEST });
export const fetchGetEnrolledStudentSuccess = (data) => ({ type: FETCH_GET_ENROLLED_STUDENT_SUCCESS, payload: data });
export const fetchGetEnrolledStudentFailure = (error) => ({ type: FETCH_GET_ENROLLED_STUDENT_FAILURE, payload: error });

export const fetchGetEnrolledStudentData = (levelId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetEnrolledStudentRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-enrolled-student-list?levelId=${levelId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchGetEnrolledStudentSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchGetEnrolledStudentFailure(error.message));
        return { ok: false, error };
    };
};


export const fetchInsertStudentSectionRequest = () => ({ type: FETCH_INSERT_STUDENT_SECTION_REQUEST });
export const fetchInsertStudentSectionSuccess = (data) => ({ type: FETCH_INSERT_STUDENT_SECTION_SUCCESS, payload: data });
export const fetchInsertStudentSectionFailure = (error) => ({ type: FETCH_INSERT_STUDENT_SECTION_FAILURE, payload: error });

export const fetchInsertStudentSectionData = (formData) => async (dispatch) => {
    dispatch(fetchInsertStudentSectionRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/insert-student-section`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertStudentSectionSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertStudentSectionFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchGetStudentSectionListRequest = () => ({ type: FETCH_GET_STUDENT_SECTION_LIST_REQUEST });
export const fetchGetStudentSectionListSuccess = (data) => ({ type: FETCH_GET_STUDENT_SECTION_LIST_SUCCESS, payload: data });
export const fetchGetStudentSectionListFailure = (error) => ({ type: FETCH_GET_STUDENT_SECTION_LIST_FAILURE, payload: error });

export const fetchGetStudentSectionListData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetStudentSectionListRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-section-student-list?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchGetStudentSectionListSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchGetStudentSectionListFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchInsertHouseNameRequest = () => ({ type: FETCH_INSERT_HOUSE_NAME_REQUEST });
export const fetchInsertHouseNameSuccess = (data) => ({ type: FETCH_INSERT_HOUSE_NAME_SUCCESS, payload: data });
export const fetchInsertHouseNameFailure = (error) => ({ type: FETCH_INSERT_HOUSE_NAME_FAILURE, payload: error });

export const fetchInsertHouseNameData = (formData) => async (dispatch) => {
    dispatch(fetchInsertHouseNameRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/insert-house-name`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertHouseNameSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertHouseNameFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchGetHouseNameRequest = () => ({ type: FETCH_GET_HOUSE_NAME_REQUEST });
export const fetchGetHouseNameSuccess = (data) => ({ type: FETCH_GET_HOUSE_NAME_SUCCESS, payload: data });
export const fetchGetHouseNameFailure = (error) => ({ type: FETCH_GET_HOUSE_NAME_FAILURE, payload: error });

export const fetchGetHouseNameData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetHouseNameRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-house-list?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchGetHouseNameSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchGetHouseNameFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchGetHouseStudentRequest = () => ({ type: FETCH_GET_HOUSE_STUDENT_REQUEST });
export const fetchGetHouseStudentSuccess = (data) => ({ type: FETCH_GET_HOUSE_STUDENT_SUCCESS, payload: data });
export const fetchGetHouseStudentFailure = (error) => ({ type: FETCH_GET_HOUSE_STUDENT_FAILURE, payload: error });

export const fetchGetHouseStudentData = (levelId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetHouseStudentRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-house-student?levelId=${levelId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchGetHouseStudentSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchGetHouseStudentFailure(error.message));
        return { ok: false, error };
    };
};


export const fetchInsertStudentHouseRequest = () => ({ type: FETCH_INSERT_STUDENT_HOUSE_REQUEST });
export const fetchInsertStudentHouseSuccess = (data) => ({ type: FETCH_INSERT_STUDENT_HOUSE_SUCCESS, payload: data });
export const fetchInsertStudentHouseFailure = (error) => ({ type: FETCH_INSERT_STUDENT_HOUSE_FAILURE, payload: error });

export const fetchInsertStudentHouseData = (formData) => async (dispatch) => {
    dispatch(fetchInsertStudentHouseRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/insert-student-house`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertStudentHouseSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertStudentHouseFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchGetStudentHouseListRequest = () => ({ type: FETCH_GET_STUDENT_HOUSE_LIST_REQUEST });
export const fetchGetStudentHouseListSuccess = (data) => ({ type: FETCH_GET_STUDENT_HOUSE_LIST_SUCCESS, payload: data });
export const fetchGetStudentHouseListFailure = (error) => ({ type: FETCH_GET_STUDENT_HOUSE_LIST_FAILURE, payload: error });

export const fetchGetStudentHouseListData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetStudentHouseListRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-house-student-list?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchGetStudentHouseListSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchGetStudentHouseListFailure(error.message));
        return { ok: false, error };
    };
};