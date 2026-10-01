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
    FETCH_SCHOOL_CALENDAR_TABLE_REQUEST, FETCH_SCHOOL_CALENDAR_TABLE_SUCCESS, FETCH_SCHOOL_CALENDAR_TABLE_FAILURE,
    FETCH_SCHOOL_CALENDAR_ACTIVITY_REQUEST, FETCH_SCHOOL_CALENDAR_ACTIVITY_SUCCESS, FETCH_SCHOOL_CALENDAR_ACTIVITY_FAILURE,
    FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_REQUEST, FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_SUCCESS, FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_FAILURE,
    FETCH_UPDATE_SCHOOL_CALENDAR_REQUEST, FETCH_UPDATE_SCHOOL_CALENDAR_SUCCESS, FETCH_UPDATE_SCHOOL_CALENDAR_FAILURE,
    FETCH_DELETE_SCHOOL_CALENDAR_REQUEST, FETCH_DELETE_SCHOOL_CALENDAR_SUCCESS, FETCH_DELETE_SCHOOL_CALENDAR_FAILURE,
    FETCH_ENROLLMENT_HISTORY_TABLE_REQUEST, FETCH_ENROLLMENT_HISTORY_TABLE_SUCCESS, FETCH_ENROLLMENT_HISTORY_TABLE_FAILURE,
    FETCH_INSERT_GRADE_REPORT_TEMPLATE_REQUEST, FETCH_INSERT_GRADE_REPORT_TEMPLATE_SUCCESS, FETCH_INSERT_GRADE_REPORT_TEMPLATE_FAILURE,
    FETCH_GRADE_REPORT_TEMPLATE_REQUEST, FETCH_GRADE_REPORT_TEMPLATE_SUCCESS, FETCH_GRADE_REPORT_TEMPLATE_FAILURE,
    FETCH_ROW_GRADE_REPORT_TEMPLATE_REQUEST, FETCH_ROW_GRADE_REPORT_TEMPLATE_SUCCESS, FETCH_ROW_GRADE_REPORT_TEMPLATE_FAILURE,
    FETCH_SUMMARY_SHEET_TABLE_REQUEST, FETCH_SUMMARY_SHEET_TABLE_SUCCESS, FETCH_SUMMARY_SHEET_TABLE_FAILURE,
    FETCH_GENERATE_SUMMARY_SHEET_REQUEST, FETCH_GENERATE_SUMMARY_SHEET_SUCCESS, FETCH_GENERATE_SUMMARY_SHEET_FAILURE,
    FETCH_SECTION_LIST_BY_LEVEL_ID_REQUEST, FETCH_SECTION_LIST_BY_LEVEL_ID_SUCCESS, FETCH_SECTION_LIST_BY_LEVEL_ID_FAILURE,
    FETCH_SCHOOL_CALENDAR_MASTER_REQUEST, FETCH_SCHOOL_CALENDAR_MASTER_SUCCESS, FETCH_SCHOOL_CALENDAR_MASTER_FAILURE,
    FETCH_INSERT_SCHOOL_CALENDAR_MASTER_REQUEST, FETCH_INSERT_SCHOOL_CALENDAR_MASTER_SUCCESS, FETCH_INSERT_SCHOOL_CALENDAR_MASTER_FAILURE,
    FETCH_SCHOOL_CALENDAR_CHILD_REQUEST, FETCH_SCHOOL_CALENDAR_CHILD_SUCCESS, FETCH_SCHOOL_CALENDAR_CHILD_FAILURE,
    FETCH_INSERT_SCHOOL_CALENDAR_CHILD_REQUEST, FETCH_INSERT_SCHOOL_CALENDAR_CHILD_SUCCESS, FETCH_INSERT_SCHOOL_CALENDAR_CHILD_FAILURE,
    FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_REQUEST, FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_SUCCESS, FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_FAILURE,
    FETCH_DELETE_SCHOOL_CALENDAR_CHILD_REQUEST, FETCH_DELETE_SCHOOL_CALENDAR_CHILD_SUCCESS, FETCH_DELETE_SCHOOL_CALENDAR_CHILD_FAILURE,
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

export const fetchSchoolCalendarTableRequest = () => ({ type: FETCH_SCHOOL_CALENDAR_TABLE_REQUEST });
export const fetchSchoolCalendarTableSuccess = (data) => ({ type: FETCH_SCHOOL_CALENDAR_TABLE_SUCCESS, payload: data });
export const fetchSchoolCalendarTableFailure = (error) => ({ type: FETCH_SCHOOL_CALENDAR_TABLE_FAILURE, payload: error });


export const fetchSchoolCalendarTableData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchSchoolCalendarTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-school-calendar-table?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchSchoolCalendarTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchSchoolCalendarTableFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchSchoolCalendarActivityRequest = () => ({ type: FETCH_SCHOOL_CALENDAR_ACTIVITY_REQUEST });
export const fetchSchoolCalendarActivitySuccess = (data) => ({ type: FETCH_SCHOOL_CALENDAR_ACTIVITY_SUCCESS, payload: data });
export const fetchSchoolCalendarActivityFailure = (error) => ({ type: FETCH_SCHOOL_CALENDAR_ACTIVITY_FAILURE, payload: error });


export const fetchSchoolCalendarActivityData = () => async (dispatch) => {
    dispatch(fetchSchoolCalendarActivityRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-school-calendary-activity`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchSchoolCalendarActivitySuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchSchoolCalendarActivityFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchInsertSchoolCalendarActivityRequest = () => ({ type: FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_REQUEST });
export const fetchInsertSchoolCalendarActivitySuccess = (data) => ({ type: FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_SUCCESS, payload: data });
export const fetchInsertSchoolCalendarActivityFailure = (error) => ({ type: FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_FAILURE, payload: error });


export const fetchInsertSchoolCalendarActivityData = (formData) => async (dispatch) => {
    dispatch(fetchInsertSchoolCalendarActivityRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/insert-school-calendary-activity`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertSchoolCalendarActivitySuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchInsertSchoolCalendarActivityFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchEnrollmentHistoryTableRequest = () => ({ type: FETCH_ENROLLMENT_HISTORY_TABLE_REQUEST });
export const fetchEnrollmentHistoryTableSuccess = (data) => ({ type: FETCH_ENROLLMENT_HISTORY_TABLE_SUCCESS, payload: data });
export const fetchEnrollmentHistoryTableFailure = (error) => ({ type: FETCH_ENROLLMENT_HISTORY_TABLE_FAILURE, payload: error });


export const fetchEnrollmentHistoryTableData = (studentId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchEnrollmentHistoryTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-enrollment-history-table?studentId=${studentId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchEnrollmentHistoryTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchEnrollmentHistoryTableFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchInsertGradeReportTemplateRequest = () => ({ type: FETCH_INSERT_GRADE_REPORT_TEMPLATE_REQUEST });
export const fetchInsertGradeReportTemplateSuccess = (data) => ({ type: FETCH_INSERT_GRADE_REPORT_TEMPLATE_SUCCESS, payload: data });
export const fetchInsertGradeReportTemplateFailure = (error) => ({ type: FETCH_INSERT_GRADE_REPORT_TEMPLATE_FAILURE, payload: error });


export const fetchInsertGradeReportTemplateData = (formData) => async (dispatch) => {
    dispatch(fetchInsertGradeReportTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/insert-grade-report-template`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertGradeReportTemplateSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertGradeReportTemplateFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchGradeReportTemplateRequest = () => ({ type: FETCH_GRADE_REPORT_TEMPLATE_REQUEST });
export const fetchGradeReportTemplateSuccess = (data) => ({ type: FETCH_GRADE_REPORT_TEMPLATE_SUCCESS, payload: data });
export const fetchGradeReportTemplateFailure = (error) => ({ type: FETCH_GRADE_REPORT_TEMPLATE_FAILURE, payload: error });


export const fetchGradeReportTemplateData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGradeReportTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-grade-report-template?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchGradeReportTemplateSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchGradeReportTemplateFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchRowGradeReportTemplateRequest = () => ({ type: FETCH_ROW_GRADE_REPORT_TEMPLATE_REQUEST });
export const fetchRowGradeReportTemplateSuccess = (data) => ({ type: FETCH_ROW_GRADE_REPORT_TEMPLATE_SUCCESS, payload: data });
export const fetchRowGradeReportTemplateFailure = (error) => ({ type: FETCH_ROW_GRADE_REPORT_TEMPLATE_FAILURE, payload: error });


export const fetchRowGradeReportTemplateData = (reportId) => async (dispatch) => {
    dispatch(fetchRowGradeReportTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-row-grade-report-template?reportId=${reportId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchRowGradeReportTemplateSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchRowGradeReportTemplateFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchSummarySheetTableRequest = () => ({ type: FETCH_SUMMARY_SHEET_TABLE_REQUEST });
export const fetchSummarySheetTableSuccess = (data) => ({ type: FETCH_SUMMARY_SHEET_TABLE_SUCCESS, payload: data });
export const fetchSummarySheetTableFailure = (error) => ({ type: FETCH_SUMMARY_SHEET_TABLE_FAILURE, payload: error });


export const fetchSummarySheetTableData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchSummarySheetTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-summary-sheet-table?page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchSummarySheetTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchSummarySheetTableFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchGenerateSummarySheetRequest = () => ({ type: FETCH_GENERATE_SUMMARY_SHEET_REQUEST });
export const fetchGenerateSummarySheetSuccess = (data) => ({ type: FETCH_GENERATE_SUMMARY_SHEET_SUCCESS, payload: data });
export const fetchGenerateSummarySheetFailure = (error) => ({ type: FETCH_GENERATE_SUMMARY_SHEET_FAILURE, payload: error });


export const fetchGenerateSummarySheetData = (payload) => async (dispatch) => {
    dispatch(fetchGenerateSummarySheetRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/generate-summary-sheet`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        const res = await response.json();

        dispatch(fetchGenerateSummarySheetSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchGenerateSummarySheetFailure(error.message));
        return { ok: false, error };
    };
};

export const fetchSectionListByLevelIdRequest = () => ({ type: FETCH_SECTION_LIST_BY_LEVEL_ID_REQUEST });
export const fetchSectionListByLevelIdSuccess = (data) => ({ type: FETCH_SECTION_LIST_BY_LEVEL_ID_SUCCESS, payload: data });
export const fetchSectionListByLevelIdFailure = (error) => ({ type: FETCH_SECTION_LIST_BY_LEVEL_ID_FAILURE, payload: error });

export const fetchSectionListByLevelIdData = (levelId) => async (dispatch) => {
    dispatch(fetchSectionListByLevelIdRequest());
    try{
        const token = getToken();
        const url = `${baseUrl}/sru/get-section-list-by-level-id?levelId=${levelId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();

        dispatch(fetchSectionListByLevelIdSuccess(res));
        return { ok: true, data: res };
    }
    catch(error){
        dispatch(fetchSectionListByLevelIdFailure(error.message));
        return { ok: false, error };
    }
};

// ── Update School Calendar Activity ──────────────────────────────────────────
export const fetchUpdateSchoolCalendarRequest = () => ({ type: FETCH_UPDATE_SCHOOL_CALENDAR_REQUEST });
export const fetchUpdateSchoolCalendarSuccess = (data) => ({ type: FETCH_UPDATE_SCHOOL_CALENDAR_SUCCESS, payload: data });
export const fetchUpdateSchoolCalendarFailure = (error) => ({ type: FETCH_UPDATE_SCHOOL_CALENDAR_FAILURE, payload: error });

export const fetchUpdateSchoolCalendarData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateSchoolCalendarRequest());
    try {
        const token = getToken();
        const response = await fetch(`${baseUrl}/sru/update-school-calendar-activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData),
        });
        const res = await response.json();
        dispatch(fetchUpdateSchoolCalendarSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchUpdateSchoolCalendarFailure(error.message));
        return { ok: false, error };
    }
};

// ── Delete School Calendar Activity ──────────────────────────────────────────
export const fetchDeleteSchoolCalendarRequest = () => ({ type: FETCH_DELETE_SCHOOL_CALENDAR_REQUEST });
export const fetchDeleteSchoolCalendarSuccess = (data) => ({ type: FETCH_DELETE_SCHOOL_CALENDAR_SUCCESS, payload: data });
export const fetchDeleteSchoolCalendarFailure = (error) => ({ type: FETCH_DELETE_SCHOOL_CALENDAR_FAILURE, payload: error });

export const fetchDeleteSchoolCalendarData = (calendarId) => async (dispatch) => {
    dispatch(fetchDeleteSchoolCalendarRequest());
    try {
        const token = getToken();
        const response = await fetch(`${baseUrl}/sru/delete-school-calendar-activity?calendarId=${calendarId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const res = await response.json();
        dispatch(fetchDeleteSchoolCalendarSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchDeleteSchoolCalendarFailure(error.message));
        return { ok: false, error };
    }
};




// ══════════════════════════════════════════════════════════════════════════════
// SCHOOL CALENDAR MASTER (School Year Management)
// ══════════════════════════════════════════════════════════════════════════════

// ── GET SCHOOL CALENDAR MASTER (School Year List) ────────────────────────────
export const fetchSchoolCalendarMasterRequest = () => ({ type: FETCH_SCHOOL_CALENDAR_MASTER_REQUEST });
export const fetchSchoolCalendarMasterSuccess = (data) => ({ type: FETCH_SCHOOL_CALENDAR_MASTER_SUCCESS, payload: data });
export const fetchSchoolCalendarMasterFailure = (error) => ({ type: FETCH_SCHOOL_CALENDAR_MASTER_FAILURE, payload: error });

export const fetchSchoolCalendarMasterData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchSchoolCalendarMasterRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-school-calendar-table?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchSchoolCalendarMasterSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchSchoolCalendarMasterFailure(error.message));
        return { ok: false, error };
    }
};

// ── INSERT SCHOOL CALENDAR MASTER (Create School Year Only) ──────────────────
export const fetchInsertSchoolCalendarMasterRequest = () => ({ type: FETCH_INSERT_SCHOOL_CALENDAR_MASTER_REQUEST });
export const fetchInsertSchoolCalendarMasterSuccess = (data) => ({ type: FETCH_INSERT_SCHOOL_CALENDAR_MASTER_SUCCESS, payload: data });
export const fetchInsertSchoolCalendarMasterFailure = (error) => ({ type: FETCH_INSERT_SCHOOL_CALENDAR_MASTER_FAILURE, payload: error });

export const fetchInsertSchoolCalendarMasterData = (formData) => async (dispatch) => {
    dispatch(fetchInsertSchoolCalendarMasterRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/insert-school-calendar-school-year`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertSchoolCalendarMasterSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertSchoolCalendarMasterFailure(error.message));
        return { ok: false, error };
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// SCHOOL CALENDAR CHILD (Activities per School Year)
// ══════════════════════════════════════════════════════════════════════════════

// ── GET SCHOOL CALENDAR CHILD (Activities for specific SY) ───────────────────
export const fetchSchoolCalendarChildRequest = () => ({ type: FETCH_SCHOOL_CALENDAR_CHILD_REQUEST });
export const fetchSchoolCalendarChildSuccess = (data) => ({ type: FETCH_SCHOOL_CALENDAR_CHILD_SUCCESS, payload: data });
export const fetchSchoolCalendarChildFailure = (error) => ({ type: FETCH_SCHOOL_CALENDAR_CHILD_FAILURE, payload: error });

export const fetchSchoolCalendarChildData = (calendarId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchSchoolCalendarChildRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/get-row-school-calendar-table?calendarId=${calendarId}&page=${page}&pageSize=${pageSize}&search=${search ?? ''}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchSchoolCalendarChildSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchSchoolCalendarChildFailure(error.message));
        return { ok: false, error };
    }
};

// ── INSERT SCHOOL CALENDAR CHILD (Create Activity) ───────────────────────────
export const fetchInsertSchoolCalendarChildRequest = () => ({ type: FETCH_INSERT_SCHOOL_CALENDAR_CHILD_REQUEST });
export const fetchInsertSchoolCalendarChildSuccess = (data) => ({ type: FETCH_INSERT_SCHOOL_CALENDAR_CHILD_SUCCESS, payload: data });
export const fetchInsertSchoolCalendarChildFailure = (error) => ({ type: FETCH_INSERT_SCHOOL_CALENDAR_CHILD_FAILURE, payload: error });

export const fetchInsertSchoolCalendarChildData = (formData) => async (dispatch) => {
    dispatch(fetchInsertSchoolCalendarChildRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/insert-school-calendary-activity`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertSchoolCalendarChildSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertSchoolCalendarChildFailure(error.message));
        return { ok: false, error };
    }
};

// ── UPDATE SCHOOL CALENDAR CHILD (Update Activity) ───────────────────────────
export const fetchUpdateSchoolCalendarChildRequest = () => ({ type: FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_REQUEST });
export const fetchUpdateSchoolCalendarChildSuccess = (data) => ({ type: FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_SUCCESS, payload: data });
export const fetchUpdateSchoolCalendarChildFailure = (error) => ({ type: FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_FAILURE, payload: error });

export const fetchUpdateSchoolCalendarChildData = (calendarChildId, formData) => async (dispatch) => {
    dispatch(fetchUpdateSchoolCalendarChildRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/update-school-calendar-activity/${calendarChildId}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchUpdateSchoolCalendarChildSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchUpdateSchoolCalendarChildFailure(error.message));
        return { ok: false, error };
    }
};

// ── DELETE SCHOOL CALENDAR CHILD (Delete Activity) ───────────────────────────
export const fetchDeleteSchoolCalendarChildRequest = () => ({ type: FETCH_DELETE_SCHOOL_CALENDAR_CHILD_REQUEST });
export const fetchDeleteSchoolCalendarChildSuccess = (data) => ({ type: FETCH_DELETE_SCHOOL_CALENDAR_CHILD_SUCCESS, payload: data });
export const fetchDeleteSchoolCalendarChildFailure = (error) => ({ type: FETCH_DELETE_SCHOOL_CALENDAR_CHILD_FAILURE, payload: error });

export const fetchDeleteSchoolCalendarChildData = (calendarChildId, userId) => async (dispatch) => {
    dispatch(fetchDeleteSchoolCalendarChildRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/sru/delete-school-calendar-activity?calendarChildId=${calendarChildId}&userId=${userId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchDeleteSchoolCalendarChildSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchDeleteSchoolCalendarChildFailure(error.message));
        return { ok: false, error };
    }
};
