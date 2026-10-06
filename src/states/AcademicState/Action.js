import {
    FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_REQUEST, FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_SUCCESS, FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_FAILURE,
    FETCH_GENERAL_OFFERED_SUBJECTS_REQUEST, FETCH_GENERAL_OFFERED_SUBJECTS_SUCCESS, FETCH_GENERAL_OFFERED_SUBJECTS_FAILURE,
    FETCH_INSERT_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_INSERT_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_INSERT_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_NON_CURRICULUM_SUBJECT_FAILURE,
    // FETCH_SUBJECT_SCHEDULE_LOAD_REQUEST, FETCH_SUBJECT_SCHEDULE_LOAD_SUCCESS, FETCH_SUBJECT_SCHEDULE_LOAD_FAILURE,
    FETCH_SECTION_LIST_REQUEST, FETCH_SECTION_LIST_SUCCESS, FETCH_SECTION_LIST_FAILURE,
    FETCH_NON_CURRICULUM_REQUEST, FETCH_NON_CURRICULUM_SUCCESS, FETCH_NON_CURRICULUM_FAILURE,
    FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_INSERT_SUBJECT_SCHEDULE_REQUEST, FETCH_INSERT_SUBJECT_SCHEDULE_SUCCESS, FETCH_INSERT_SUBJECT_SCHEDULE_FAILURE,
    FETCH_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_TEACHER_LIST_REQUEST, FETCH_TEACHER_LIST_SUCCESS, FETCH_TEACHER_LIST_FAILURE,
    FETCH_TEACHER_TABLE_REQUEST, FETCH_TEACHER_TABLE_SUCCESS, FETCH_TEACHER_TABLE_FAILURE,
    FETCH_ADVISER_NON_ADVISER_REQUEST, FETCH_ADVISER_NON_ADVISER_SUCCESS, FETCH_ADVISER_NON_ADVISER_FAILURE,
    FETCH_TEACHER_ALREADY_ASSIGN_REQUEST, FETCH_TEACHER_ALREADY_ASSIGN_SUCCESS, FETCH_TEACHER_ALREADY_ASSIGN_FAILURE,
    FETCH_INSERT_FACULTY_LOAD_REQUEST, FETCH_INSERT_FACULTY_LOAD_SUCCESS, FETCH_INSERT_FACULTY_LOAD_FAILURE,
    FETCH_FACULTY_LOAD_TABLE_REQUEST, FETCH_FACULTY_LOAD_TABLE_SUCCESS, FETCH_FACULTY_LOAD_TABLE_FAILURE,
    FETCH_FACULTY_LOAD_ROW_TABLE_REQUEST, FETCH_FACULTY_LOAD_ROW_TABLE_SUCCESS, FETCH_FACULTY_LOAD_ROW_TABLE_FAILURE,
    FETCH_SECTION_PER_LEVEL_REQUEST, FETCH_SECTION_PER_LEVEL_SUCCESS, FETCH_SECTION_PER_LEVEL_FAILURE,
    FETCH_INSERT_CURRICULUM_PER_LEVEL_REQUEST, FETCH_INSERT_CURRICULUM_PER_LEVEL_SUCCESS, FETCH_INSERT_CURRICULUM_PER_LEVEL_FAILURE,
    FETCH_CURRICULUM_PER_LEVEL_REQUEST, FETCH_CURRICULUM_PER_LEVEL_SUCCESS, FETCH_CURRICULUM_PER_LEVEL_FAILURE,
    FETCH_CURRICULUM_LIST_REQUEST, FETCH_CURRICULUM_LIST_SUCCESS, FETCH_CURRICULUM_LIST_FAILURE,
    FETCH_CURRICULUM_TABLE_REQUEST, FETCH_CURRICULUM_TABLE_SUCCESS, FETCH_CURRICULUM_TABLE_FAILURE,
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
    catch (error) {
        dispatch(fetchInsertGeneralOfferedSubjectsFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchGeneralOfferedSubjectRequest = () => ({ type: FETCH_GENERAL_OFFERED_SUBJECTS_REQUEST });
export const fetchGeneralOfferedSubjectSuccess = (data) => ({ type: FETCH_GENERAL_OFFERED_SUBJECTS_SUCCESS, payload: data });
export const fetchGeneralOfferedSubjectFailure = (error) => ({ type: FETCH_GENERAL_OFFERED_SUBJECTS_FAILURE, payload: error });

export const fetchGeneralOfferedSubjectData = (page, pageSize, search, schoolYear = '') => async (dispatch) => {
    dispatch(fetchGeneralOfferedSubjectRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-general-offered-subject?page=${page}&pageSize=${pageSize}&search=${search}&schoolYear=${schoolYear}`;

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
    catch (error) {
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
    catch (error) {
        dispatch(fetchInsertNonCurriculumSubjectFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchNonCurriculumSubjectRequest = () => ({ type: FETCH_NON_CURRICULUM_SUBJECT_REQUEST });
export const fetchNonCurriculumSubjectSuccess = (data) => ({ type: FETCH_NON_CURRICULUM_SUBJECT_SUCCESS, payload: data });
export const fetchNonCurriculumSubjectFailure = (error) => ({ type: FETCH_NON_CURRICULUM_SUBJECT_FAILURE, payload: error });

export const fetchNonCurriculumSubjectData = (page, pageSize, search, schoolYear = '') => async (dispatch) => {
    dispatch(fetchNonCurriculumSubjectRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-non-curriculum-subject?page=${page}&pageSize=${pageSize}&search=${search}&schoolYear=${schoolYear}`;

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
    catch (error) {
        dispatch(fetchNonCurriculumSubjectFailure(error.message));
        return { ok: false, error };
    }
};


// export const fetchSubjectScheduleLoadRequest = () => ({ type: FETCH_SUBJECT_SCHEDULE_LOAD_REQUEST });
// export const fetchSubjectScheduleLoadSuccess = (data) => ({ type: FETCH_SUBJECT_SCHEDULE_LOAD_SUCCESS, payload: data });
// export const fetchSubjectScheduleLoadFailure = (error) => ({ type: FETCH_SUBJECT_SCHEDULE_LOAD_FAILURE, payload: error });

// export const fetchSubjectScheduleLoadData = (page, pageSize, search) => async (dispatch) => {
//     dispatch(fetchSubjectScheduleLoadRequest());
//     try {
//         const token = getToken();
//         const url = `${baseUrl}/academic/get-subject-schedule-load?page=${page}&pageSize=${pageSize}&search=${search}`;

//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//         });

//         const res = await response.json();

//         dispatch(fetchSubjectScheduleLoadSuccess(res));
//         return { ok: true, data: res.data, totalRecords: res.totalRecords };
//     }
//     catch (error) {
//         dispatch(fetchSubjectScheduleLoadFailure(error.message));
//         return { ok: false, error };
//     }
// };

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
    catch (error) {
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
    catch (error) {
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
    catch (error) {
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
    catch (error) {
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
    catch (error) {
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
    catch (error) {
        dispatch(fetchMasterSubjectScheduleTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchSectionSubjectScheduleTableRequest = () => ({ type: FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_REQUEST });
export const fetchSectionSubjectScheduleTableSuccess = (data) => ({ type: FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_SUCCESS, payload: data });
export const fetchSectionSubjectScheduleTableFailure = (error) => ({ type: FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_FAILURE, payload: error });

export const fetchSectionSubjectScheduleTableData = (sectionId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchSectionSubjectScheduleTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-section-subject-schedule-table?sectionId=${sectionId}&page=${page}&pageSize=${pageSize}&search=${search}`;

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
    catch (error) {
        dispatch(fetchSectionSubjectScheduleTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchTeacherListRequest = () => ({ type: FETCH_TEACHER_LIST_REQUEST });
export const fetchTeacherListSuccess = (data) => ({ type: FETCH_TEACHER_LIST_SUCCESS, payload: data });
export const fetchTeacherListFailure = (error) => ({ type: FETCH_TEACHER_LIST_FAILURE, payload: error });

export const fetchTeacherListData = (status) => async (dispatch) => {
    dispatch(fetchTeacherListRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-teacher-list?status=${status}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchTeacherListSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchTeacherListFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchTeacherTableRequest = () => ({ type: FETCH_TEACHER_TABLE_REQUEST });
export const fetchTeacherTableSuccess = (data) => ({ type: FETCH_TEACHER_TABLE_SUCCESS, payload: data });
export const fetchTeacherTableFailure = (error) => ({ type: FETCH_TEACHER_TABLE_FAILURE, payload: error });

export const fetchTeacherTableData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchTeacherTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-teacher-table?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchTeacherTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchTeacherTableFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchInsertAdviserNonAdviserRequest = () => ({ type: FETCH_ADVISER_NON_ADVISER_REQUEST });
export const fetchInsertAdviserNonAdviserSuccess = (data) => ({ type: FETCH_ADVISER_NON_ADVISER_SUCCESS, payload: data });
export const fetchInsertAdviserNonAdviserFailure = (error) => ({ type: FETCH_ADVISER_NON_ADVISER_FAILURE, payload: error });

export const fetchInsertAdviserNonAdviserData = (employeeId, assign) => async (dispatch) => {
    dispatch(fetchInsertAdviserNonAdviserRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/insert-adviser-non-adviser?employeeId=${employeeId}&assign=${assign}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchInsertAdviserNonAdviserSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertAdviserNonAdviserFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchTeacherAlreadyAssignRequest = () => ({ type: FETCH_TEACHER_ALREADY_ASSIGN_REQUEST });
export const fetchTeacherAlreadyAssignSuccess = (data) => ({ type: FETCH_TEACHER_ALREADY_ASSIGN_SUCCESS, payload: data });
export const fetchTeacherAlreadyAssignFailure = (error) => ({ type: FETCH_TEACHER_ALREADY_ASSIGN_FAILURE, payload: error });

export const fetchTeacherAlreadyAssignData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchTeacherAlreadyAssignRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-teacher-already-assign?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchTeacherAlreadyAssignSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchTeacherAlreadyAssignFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchInsertFacultyLoadRequest = () => ({ type: FETCH_INSERT_FACULTY_LOAD_REQUEST });
export const fetchInsertFacultyLoadSuccess = (data) => ({ type: FETCH_INSERT_FACULTY_LOAD_SUCCESS, payload: data });
export const fetchInsertFacultyLoadFailure = (error) => ({ type: FETCH_INSERT_FACULTY_LOAD_FAILURE, payload: error });

export const fetchInsertFacultyLoadData = (formData) => async (dispatch) => {
    dispatch(fetchInsertFacultyLoadRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/insert-faculty-load`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertFacultyLoadSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchInsertFacultyLoadFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchFacultyLoadTableRequest = () => ({ type: FETCH_FACULTY_LOAD_TABLE_REQUEST });
export const fetchFacultyLoadTableSuccess = (data) => ({ type: FETCH_FACULTY_LOAD_TABLE_SUCCESS, payload: data });
export const fetchFacultyLoadTableFailure = (error) => ({ type: FETCH_FACULTY_LOAD_TABLE_FAILURE, payload: error });

export const fetchFacultyLoadTableData = (page, pageSize, search, schoolYear = "") => async (dispatch) => {
    dispatch(fetchFacultyLoadTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-faculty-load-table?page=${page}&pageSize=${pageSize}&search=${search}&schoolYear=${schoolYear}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchFacultyLoadTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchFacultyLoadTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchFacultyLoadRowTableRequest = () => ({ type: FETCH_FACULTY_LOAD_ROW_TABLE_REQUEST });
export const fetchFacultyLoadRowTableSuccess = (data) => ({ type: FETCH_FACULTY_LOAD_ROW_TABLE_SUCCESS, payload: data });
export const fetchFacultyLoadRowTableFailure = (error) => ({ type: FETCH_FACULTY_LOAD_ROW_TABLE_FAILURE, payload: error });

export const fetchFacultyLoadRowTableData = (loadId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchFacultyLoadRowTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-faculty-load-row-table?loadId=${loadId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchFacultyLoadRowTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchFacultyLoadRowTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchSectionPerLevelRequest = () => ({ type: FETCH_SECTION_PER_LEVEL_REQUEST });
export const fetchSectionPerLevelSuccess = (data) => ({ type: FETCH_SECTION_PER_LEVEL_SUCCESS, payload: data });
export const fetchSectionPerLevelFailure = (error) => ({ type: FETCH_SECTION_PER_LEVEL_FAILURE, payload: error });
1
export const fetchSectionPerLevelData = (levelId) => async (dispatch) => {
    dispatch(fetchSectionPerLevelRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-section-per-level?levelId=${levelId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchSectionPerLevelSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchSectionPerLevelFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchInsertCurriculumPerLevelRequest = () => ({ type: FETCH_INSERT_CURRICULUM_PER_LEVEL_REQUEST });
export const fetchInsertCurriculumPerLevelSuccess = (data) => ({ type: FETCH_INSERT_CURRICULUM_PER_LEVEL_SUCCESS, payload: data });
export const fetchInsertCurriculumPerLevelFailure = (error) => ({ type: FETCH_INSERT_CURRICULUM_PER_LEVEL_FAILURE, payload: error });

export const fetchInsertCurriculumPerLevelData = (payload) => async (dispatch) => {
    dispatch(fetchInsertCurriculumPerLevelRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/insert-curriculum-per-level`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        const res = await response.json();

        dispatch(fetchInsertCurriculumPerLevelSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchInsertCurriculumPerLevelFailure(error.message));
        return { ok: false, error };
    }
};

export const fetctCurriculumPerLevelRequest = () => ({ type: FETCH_CURRICULUM_PER_LEVEL_REQUEST });
export const fetchCurriculumPerLevelSuccess = (data) => ({ type: FETCH_CURRICULUM_PER_LEVEL_SUCCESS, payload: data });
export const fetchCurriculumPerLevelFailure = (error) => ({ type: FETCH_CURRICULUM_PER_LEVEL_FAILURE, payload: error });

export const fetchCurriculumPerLevelData = (page, pageSize, search, schoolYear = '') => async (dispatch) => {
    dispatch(fetctCurriculumPerLevelRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-curriculum-per-level?page=${page}&pageSize=${pageSize}&search=${search}&schoolYear=${schoolYear}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchCurriculumPerLevelSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchCurriculumPerLevelFailure(error.message));
        return { ok: false, error };
    }
};

export const fetctCurriculumListRequest = () => ({ type: FETCH_CURRICULUM_LIST_REQUEST });
export const fetchCurriculumListSuccess = (data) => ({ type: FETCH_CURRICULUM_LIST_SUCCESS, payload: data });
export const fetchCurriculumListFailure = (error) => ({ type: FETCH_CURRICULUM_LIST_FAILURE, payload: error });

export const fetchCurriculumListData = (levelId) => async (dispatch) => {
    dispatch(fetctCurriculumListRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-curriculum-list?levelId=${levelId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchCurriculumListSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchCurriculumListFailure(error.message));
        return { ok: false, error };
    }
};

export const fetctCurriculumTableRequest = () => ({ type: FETCH_CURRICULUM_TABLE_REQUEST });
export const fetchCurriculumTableSuccess = (data) => ({ type: FETCH_CURRICULUM_TABLE_SUCCESS, payload: data });
export const fetchCurriculumTableFailure = (error) => ({ type: FETCH_CURRICULUM_TABLE_FAILURE, payload: error });

export const fetchCurriculumTableData = (curId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetctCurriculumTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/academic/get-curriculum-table?curId=${curId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);
        dispatch(fetchCurriculumTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchCurriculumTableFailure(error.message));
        return { ok: false, error };
    }
};
