import {
    FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_REQUEST, FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_SUCCESS, FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_FAILURE,
    FETCH_GENERAL_OFFERED_SUBJECTS_REQUEST, FETCH_GENERAL_OFFERED_SUBJECTS_SUCCESS, FETCH_GENERAL_OFFERED_SUBJECTS_FAILURE,
    FETCH_INSERT_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_INSERT_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_INSERT_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_SUBJECT_SCHEDULE_LOAD_REQUEST, FETCH_SUBJECT_SCHEDULE_LOAD_SUCCESS, FETCH_SUBJECT_SCHEDULE_LOAD_FAILURE,
    FETCH_SECTION_LIST_REQUEST, FETCH_SECTION_LIST_SUCCESS, FETCH_SECTION_LIST_FAILURE,
    FETCH_NON_CURRICULUM_REQUEST, FETCH_NON_CURRICULUM_SUCCESS, FETCH_NON_CURRICULUM_FAILURE,
    FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_INSERT_SUBJECT_SCHEDULE_REQUEST, FETCH_INSERT_SUBJECT_SCHEDULE_SUCCESS, FETCH_INSERT_SUBJECT_SCHEDULE_FAILURE,
    FETCH_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchInsertGeneralOfferedSubjectsRequest = () => ({ type: FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_REQUEST });
export const fetchInsertGeneralOfferedSubjectsSuccess = (data) => ({ type: FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_SUCCESS, payload: data });
export const fetchInsertGeneralOfferedSubjectsFailure = (error) => ({ type: FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_FAILURE, payload: error });

export const fetchInsertGeneralOfferedSubjectsData = (formData) => async (dispatch) => {
    dispatch(fetchInsertGeneralOfferedSubjectsRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/insert-general-offered-subject`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertGeneralOfferedSubjectsSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchInsertGeneralOfferedSubjectsFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchGeneralOfferedSubjectRequest = () => ({ type: FETCH_GENERAL_OFFERED_SUBJECTS_REQUEST });
export const fetchGeneralOfferedSubjectSuccess = (data) => ({ type: FETCH_GENERAL_OFFERED_SUBJECTS_SUCCESS, payload: data });
export const fetchGeneralOfferedSubjectFailure = (error) => ({ type: FETCH_GENERAL_OFFERED_SUBJECTS_FAILURE, payload: error });

export const fetchGeneralOfferedSubjectData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGeneralOfferedSubjectRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-general-offered-subject?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchGeneralOfferedSubjectSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchGeneralOfferedSubjectFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchInsertNonCurriculumSubjectRequest = () => ({ type: FETCH_INSERT_NON_CURRICULUM_SUBJECT_REQUEST });
export const fetchInsertNonCurriculumSubjectSuccess = (data) => ({ type: FETCH_INSERT_NON_CURRICULUM_SUBJECT_SUCCESS, payload: data });
export const fetchInsertNonCurriculumSubjectFailure = (error) => ({ type: FETCH_INSERT_NON_CURRICULUM_SUBJECT_FAILURE, payload: error });

export const fetchInsertNonCurriculumSubjectData = (formData) => async (dispatch) => {
    dispatch(fetchInsertNonCurriculumSubjectRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/insert-non-curriculum-subject`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertNonCurriculumSubjectSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchInsertNonCurriculumSubjectFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchNonCurriculumSubjectRequest = () => ({ type: FETCH_NON_CURRICULUM_SUBJECT_REQUEST });
export const fetchNonCurriculumSubjectSuccess = (data) => ({ type: FETCH_NON_CURRICULUM_SUBJECT_SUCCESS, payload: data });
export const fetchNonCurriculumSubjectFailure = (error) => ({ type: FETCH_NON_CURRICULUM_SUBJECT_FAILURE, payload: error });

export const fetchNonCurriculumSubjectData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchNonCurriculumSubjectRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-non-curriculum-subject?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchNonCurriculumSubjectSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchNonCurriculumSubjectFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchSubjectScheduleLoadRequest = () => ({ type: FETCH_SUBJECT_SCHEDULE_LOAD_REQUEST });
export const fetchSubjectScheduleLoadSuccess = (data) => ({ type: FETCH_SUBJECT_SCHEDULE_LOAD_SUCCESS, payload: data });
export const fetchSubjectScheduleLoadFailure = (error) => ({ type: FETCH_SUBJECT_SCHEDULE_LOAD_FAILURE, payload: error });

export const fetchSubjectScheduleLoadData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchSubjectScheduleLoadRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-subject-schedule-load?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchSubjectScheduleLoadSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchSubjectScheduleLoadFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchSectionListRequest = () => ({ type: FETCH_SECTION_LIST_REQUEST });
export const fetchSectionListSuccess = (data) => ({ type: FETCH_SECTION_LIST_SUCCESS, payload: data });
export const fetchSectionListFailure = (error) => ({ type: FETCH_SECTION_LIST_FAILURE, payload: error });

export const fetchSectionListData = () => async (dispatch) => {
    dispatch(fetchSectionListRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-section-list`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchSectionListSuccess(res));
        return { ok: true, data: res };
    }
    catch(error){
        dispatch(fetchSectionListFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchNonCurriculumRequest = () => ({ type: FETCH_NON_CURRICULUM_REQUEST });
export const fetchNonCurriculumSuccess = (data) => ({ type: FETCH_NON_CURRICULUM_SUCCESS, payload: data });
export const fetchNonCurriculumFailure = (error) => ({ type: FETCH_NON_CURRICULUM_FAILURE, payload: error });

export const fetchNonCurriculumData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchNonCurriculumRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-non-curriculum?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchNonCurriculumSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchNonCurriculumFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchCurriculumAndNonCurriculumSubjectRequest = () => ({ type: FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_REQUEST });
export const fetchCurriculumAndNonCurriculumSubjectSuccess = (data) => ({ type: FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_SUCCESS, payload: data });
export const fetchCurriculumAndNonCurriculumSubjectFailure = (error) => ({ type: FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_FAILURE, payload: error });

export const fetchCurriculumAndNonCurriculumSubjectData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchCurriculumAndNonCurriculumSubjectRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-curriculum-and-non-curriculum?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchCurriculumAndNonCurriculumSubjectSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchCurriculumAndNonCurriculumSubjectFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchInsertSubjectScheduleRequest = () => ({ type: FETCH_INSERT_SUBJECT_SCHEDULE_REQUEST });
export const fetchInsertSubjectScheduleSuccess = (data) => ({ type: FETCH_INSERT_SUBJECT_SCHEDULE_SUCCESS, payload: data });
export const fetchInsertSubjectScheduleFailure = (error) => ({ type: FETCH_INSERT_SUBJECT_SCHEDULE_FAILURE, payload: error });

export const fetchInsertSubjectScheduleData = (payload) => async (dispatch) => {
    dispatch(fetchInsertSubjectScheduleRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/insert-subject-schedule`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        const res = await response.json();

        dispatch(fetchInsertSubjectScheduleSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchInsertSubjectScheduleFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchSubjectScheduleTableRequest = () => ({ type: FETCH_SUBJECT_SCHEDULE_TABLE_REQUEST });
export const fetchSubjectScheduleTableSuccess = (data) => ({ type: FETCH_SUBJECT_SCHEDULE_TABLE_SUCCESS, payload: data });
export const fetchSubjectScheduleTableFailure = (error) => ({ type: FETCH_SUBJECT_SCHEDULE_TABLE_FAILURE, payload: error });

export const fetchSubjectScheduleTableData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchSubjectScheduleTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-subject-schedule-table?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchSubjectScheduleTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchSubjectScheduleTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchMasterSubjectScheduleTableRequest = () => ({ type: FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_REQUEST });
export const fetchMasterSubjectScheduleTableSuccess = (data) => ({ type: FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_SUCCESS, payload: data });
export const fetchMasterSubjectScheduleTableFailure = (error) => ({ type: FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_FAILURE, payload: error });

export const fetchMasterSubjectScheduleTableData = (mainSecId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchMasterSubjectScheduleTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-master-subject-schedule-table?mainSecId=${mainSecId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchMasterSubjectScheduleTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchMasterSubjectScheduleTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchSectionSubjectScheduleTableRequest = () => ({ type: FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_REQUEST });
export const fetchSectionSubjectScheduleTableSuccess = (data) => ({ type: FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_SUCCESS, payload: data });
export const fetchSectionSubjectScheduleTableFailure = (error) => ({ type: FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_FAILURE, payload: error });

export const fetchSectionSubjectScheduleTableData = (secId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchSectionSubjectScheduleTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-section-subject-schedule-table?secId=${secId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchSectionSubjectScheduleTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchSectionSubjectScheduleTableFailure(error.message));
        return { ok: false, error };
    }
};