import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_INSERTEXAMROOM_REQUEST, FETCH_INSERTEXAMROOM_SUCCESS, FETCH_INSERTEXAMROOM_FAILURE,
    FETCH_TEMPLATETABLE_REQUEST, FETCH_TEMPLATETABLE_SUCCESS, FETCH_TEMPLATETABLE_FAILURE,
    FETCH_INSERTEXAMSCHEDULE_REQUEST, FETCH_INSERTEXAMSCHEDULE_SUCCESS, FETCH_INSERTEXAMSCHEDULE_FAILURE,
    FETCH_EXAMROOMTEMPLATE_REQUEST, FETCH_EXAMROOMTEMPLATE_SUCCESS, FETCH_EXAMROOMTEMPLATE_FAILURE,
    FETCH_UPDATEROWTABLE_REQUEST, FETCH_UPDATEROWTABLE_SUCCESS, FETCH_UPDATEROWTABLE_FAILURE,
    FETCH_INSERTTRANSMUTATIONTABLE_REQUEST, FETCH_INSERTTRANSMUTATIONTABLE_SUCCESS, FETCH_INSERTTRANSMUTATIONTABLE_FAILURE,
    FETCH_INSERTTRANSMUTATIONBULK_REQUEST, FETCH_INSERTTRANSMUTATIONBULK_SUCCESS, FETCH_INSERTTRANSMUTATIONBULK_FAILURE,
    FETCH_INSERTGENERALSUBJECTTABLE_REQUEST, FETCH_INSERTGENERALSUBJECTTABLE_SUCCESS, FETCH_INSERTGENERALSUBJECTTABLE_FAILURE,
    FETCH_GENERALSUBJECTTABLE_REQUEST, FETCH_GENERALSUBJECTTABLE_SUCCESS, FETCH_GENERALSUBJECTTABLE_FAILURE,
    FETCH_INSERTEXAMSUBJECT_REQUEST, FETCH_INSERTEXAMSUBJECT_SUCCESS, FETCH_INSERTEXAMSUBJECT_FAILURE,
    FETCH_TEMPLATEROWMODAL_REQUEST, FETCH_TEMPLATEROWMODAL_SUCCESS, FETCH_TEMPLATEROWMODAL_FAILURE,
    FETCH_UPDATEROWTEMPLATE_REQUEST, FETCH_UPDATEROWTEMPLATE_SUCCESS, FETCH_UPDATEROWTEMPLATE_FAILURE,
    FETCH_EXAMSETTINGSCODE_REQUEST, FETCH_EXAMSETTINGSCODE_SUCCESS, FETCH_EXAMSETTINGSCODE_FAILURE,
    FETCH_EXAMSCHEDULECREATED_REQUEST, FETCH_EXAMSCHEDULECREATED_SUCCESS, FETCH_EXAMSCHEDULECREATED_FAILURE,
    FETCH_EXAMSETTINGSCODEBYSTUDENTID_REQUEST, FETCH_EXAMSETTINGSCODEBYSTUDENTID_SUCCESS, FETCH_EXAMSETTINGSCODEBYSTUDENTID_FAILURE,
    FETCH_ALLUSERBYUSERROLE_REQUEST, FETCH_ALLUSERBYUSERROLE_SUCCESS, FETCH_ALLUSERBYUSERROLE_FAILURE,
    FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_REQUEST, FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_SUCCESS, FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_FAILURE,
    FETCH_EXAM_RAW_SCORE_TABLE_REQUEST, FETCH_EXAM_RAW_SCORE_TABLE_SUCCESS, FETCH_EXAM_RAW_SCORE_TABLE_FAILURE,
    FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_REQUEST, FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_SUCCESS, FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_FAILURE,
    FETCH_CFW_ENROLLMENT_COUNTS_REQUEST, FETCH_CFW_ENROLLMENT_COUNTS_SUCCESS, FETCH_CFW_ENROLLMENT_COUNTS_FAILURE,
    UPDATE_CFW_ENROLLMENT_COUNT_REALTIME,
    // FETCH_RAW_SCORE_BY_STUDENT_REQUEST, FETCH_RAW_SCORE_BY_STUDENT_SUCCESS, FETCH_RAW_SCORE_BY_STUDENT_FAILURE,
    // FETCH_SUBJECTLIST_REQUEST, FETCH_SUBJECTLIST_SUCCESS, FETCH_SUBJECTLIST_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchEnrollmentTableRequest = () => ({ type: FETCH_ENROLLMENTTABLE_REQUEST });
export const fetchEnrollmentTableSuccess = (data) => ({ type: FETCH_ENROLLMENTTABLE_SUCCESS, payload: data });
export const fetchEnrollmentTableFailure = (error) => ({ type: FETCH_ENROLLMENTTABLE_FAILURE, payload: error });

export const fetchEnrollmentTableData = (StartDate, EndDate, TableType, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchEnrollmentTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/enrollment-table?startDate=${StartDate}&endDate=${EndDate}&TableType=${TableType}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'GET',
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


//insert exam room template
export const fetchInsertExamRoomRequest = () => ({ type: FETCH_INSERTEXAMROOM_REQUEST });
export const fetchInsertExamRoomSuccess = (data) => ({ type: FETCH_INSERTEXAMROOM_SUCCESS, payload: data });
export const fetchInsertExamRoomFailure = (error) => ({ type: FETCH_INSERTEXAMROOM_FAILURE, payload: error });

export const fetchInsertExamRoomData = (formData) => async (dispatch) => {
    dispatch(fetchInsertExamRoomRequest());

    try {

        const token = getToken();
        const url = `${baseUrl}/cfw/insert-examroom-template`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const res = await response.json();

        dispatch(fetchInsertExamRoomSuccess(res));
        return ({ ok: true, data: res });
    }
    catch (error) {
        dispatch(fetchInsertExamRoomFailure(error.message));
        return ({ ok: false, data: error });
    }
};

// fet the exam room template 
export const fetchExamRoomTemplateRequest = () => ({ type: FETCH_EXAMROOMTEMPLATE_REQUEST });
export const fetchExamRoomTemplateSuccess = (data) => ({ type: FETCH_EXAMROOMTEMPLATE_SUCCESS, payload: data });
export const fetchExamRoomTemplateFailure = (error) => ({ type: FETCH_EXAMROOMTEMPLATE_FAILURE, payload: error });

export const fetchExamRoomTemplateData = (campusId) => async (dispatch) => {
    dispatch(fetchExamRoomTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-examroom-created?campusId=${campusId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchExamRoomTemplateSuccess(res));
        return ({ ok: true, data: res });
    }
    catch (error) {
        dispatch(fetchExamRoomTemplateFailure(error.message));
        return ({ ok: false, data: error.message });
    }
}


//insert exam schedule template
export const fetchInsertExamScheduleRequest = () => ({ type: FETCH_INSERTEXAMSCHEDULE_REQUEST });
export const fetchInsertExamScheduleSuccess = (data) => ({ type: FETCH_INSERTEXAMSCHEDULE_SUCCESS, payload: data });
export const fetchInsertExamScheduleFailure = (error) => ({ type: FETCH_INSERTEXAMSCHEDULE_FAILURE, payload: error });

export const fetchInsertExamScheduleData = (formData) => async (dispatch) => {
    dispatch(fetchInsertExamScheduleRequest())

    try {
        console.log(formData);
        const token = getToken();
        const url = `${baseUrl}/cfw/insert-examschedule-template`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const res = await response.json();

        dispatch(fetchInsertExamScheduleSuccess(res));
        return ({ ok: true, data: res });
    }
    catch (error) {
        dispatch(fetchInsertExamScheduleFailure(error.message));
        return ({ ok: false, data: error });
    }
};


//get the template table for cfw
export const fetchTemplateTableRequest = () => ({ type: FETCH_TEMPLATETABLE_REQUEST });
export const fetchTemplateTableSuccess = (data) => ({ type: FETCH_TEMPLATETABLE_SUCCESS, payload: data });
export const fetchTemplateTableFailure = (error) => ({ type: FETCH_TEMPLATETABLE_FAILURE, payload: error });

export const fetchTemplateTableData = (status, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchTemplateTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-template-table?status=${status}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchTemplateTableSuccess(res))
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchTemplateTableFailure(error));
        return ({ ok: false, data: error });
    }
};


//update the row in template table --for disable and enable
export const fetchUpdateRowTableRequest = () => ({ type: FETCH_UPDATEROWTABLE_REQUEST });
export const fetchUpdateRowTableSuccess = (data) => ({ type: FETCH_UPDATEROWTABLE_SUCCESS, payload: data });
export const fetchUpdateRowTableFailure = (error) => ({ type: FETCH_UPDATEROWTABLE_FAILURE, payload: error });

export const fetchUpdateRowTableData = (tempId) => async (dispatch) => {
    dispatch(fetchUpdateRowTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/update-row-table?tempId=${tempId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchUpdateRowTableSuccess(res));
        return ({ ok: true, data: res });
    }
    catch (error) {
        dispatch(fetchUpdateRowTableFailure(error.message));
        return ({ ok: false, error });
    }
};

export const fetchRowTemplateTableRequest = () => ({ type: FETCH_ROWTEMPLATETABLE_REQUEST });
export const fetchRowTemplateTableSuccess = (data) => ({ type: FETCH_ROWTEMPLATETABLE_SUCCESS, payload: data });
export const fetchRowTemplateTableFailure = (error) => ({ type: FETCH_ROWTEMPLATETABLE_FAILURE, payload: error });

export const fetchRowTemplateTableData = (tempId, tempType) => async (dispatch) => {
    dispatch(fetchRowTemplateTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-row-template-data?tempId=${tempId}&tempType=${tempType}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchRowTemplateTableSuccess(res));
        return ({ ok: true, data: res });
    }
    catch (error) {
        dispatch(fetchRowTemplateTableFailure(error.message));
        return ({ ok: false, error });
    }
};

export const fetchInsertTransmutationTableRequest = () => ({ type: FETCH_INSERTTRANSMUTATIONTABLE_REQUEST });
export const fetchInsertTransmutationTableSuccess = (data) => ({ type: FETCH_INSERTTRANSMUTATIONTABLE_SUCCESS, payload: data });
export const fetchInsertTransmutationTableFailure = (error) => ({ type: FETCH_INSERTTRANSMUTATIONTABLE_FAILURE, payload: error });

export const fetchInsertTransmutationTableData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTransmutationTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/insert-transmutation-table`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchInsertTransmutationTableSuccess(res));
        return ({ ok: true, data: res });
    }
    catch (error) {
        dispatch(fetchInsertTransmutationTableFailure(error.message));
        return ({ ok: false, error });
    }
};

export const fetchInsertTransmutationBulkRequest = () => ({ type: FETCH_INSERTTRANSMUTATIONBULK_REQUEST });
export const fetchInsertTransmutationBulkSuccess = (data) => ({ type: FETCH_INSERTTRANSMUTATIONBULK_SUCCESS, payload: data });
export const fetchInsertTransmutationBulkFailure = (error) => ({ type: FETCH_INSERTTRANSMUTATIONBULK_FAILURE, payload: error });

export const fetchInsertTransmutationBulkData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTransmutationBulkRequest());
    try {

        console.log(formData);
        const token = getToken();
        const url = `${baseUrl}/cfw/insert-bulk-transmutation`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        const text = await response.text();
        let res;
        try {
            res = text ? JSON.parse(text) : {};
        } catch {
            res = { success: false, message: text || "Invalid JSON response" };
        }
        if (res.success === false) {
            throw new Error(res.message || "Unknown error");
        }
        dispatch(fetchInsertTransmutationBulkSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchInsertTransmutationBulkFailure(error.message));
        return ({ ok: false, error });
    }
};


export const fetchInsertGeneralSubjectTableRequest = () => ({ type: FETCH_INSERTGENERALSUBJECTTABLE_REQUEST });
export const fetchInsertGeneralSubjectTableSuccess = (data) => ({ type: FETCH_INSERTGENERALSUBJECTTABLE_SUCCESS, payload: data });
export const fetchInsertGeneralSubjectTableFailure = (error) => ({ type: FETCH_INSERTGENERALSUBJECTTABLE_FAILURE, payload: error });

export const fetchInsertGeneralSubjectTableData = (formData) => async (dispatch) => {
    dispatch(fetchInsertGeneralSubjectTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/insert-general-subject-table`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertGeneralSubjectTableSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchInsertGeneralSubjectTableFailure(error.message));
        return ({ ok: false, error });
    }
};

export const fetchGeneralSubjectTableRequest = () => ({ type: FETCH_GENERALSUBJECTTABLE_REQUEST });
export const fetchGeneralSubjectTableSuccess = (data) => ({ type: FETCH_GENERALSUBJECTTABLE_SUCCESS, payload: data });
export const fetchGeneralSubjectTableFailure = (error) => ({ type: FETCH_GENERALSUBJECTTABLE_FAILURE, payload: error });

export const fetchGeneralSubjectTableData = (status, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGeneralSubjectTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-general-subject-table?status=${status}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'applcation/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchGeneralSubjectTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchGeneralSubjectTableFailure(error.message));
        return ({ ok: false, error });
    }
};

export const fetchInsertExamSubjectRequest = () => ({ type: FETCH_INSERTEXAMSUBJECT_REQUEST });
export const fetchInsertExamSubjectSuccess = (data) => ({ type: FETCH_INSERTEXAMSUBJECT_SUCCESS, payload: data });
export const fetchInsertExamSubjectFailure = (error) => ({ type: FETCH_INSERTEXAMSUBJECT_FAILURE, payload: error });

export const fetchInsertExamSubjectData = (formData) => async (dispatch) => {
    dispatch(fetchInsertExamSubjectRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/insert-exam-subject-list`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertExamSubjectSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchInsertExamSubjectFailure(error.message));
        return ({ ok: false, error });
    }
};

export const fetchTemplateRowModalRequest = () => ({ type: FETCH_TEMPLATEROWMODAL_REQUEST });
export const fetchTemplateRowModalSuccess = (data) => ({ type: FETCH_TEMPLATEROWMODAL_SUCCESS, payload: data });
export const fetchTemplateRowModalFailure = (error) => ({ type: FETCH_TEMPLATEROWMODAL_FAILURE, payload: error });

export const fetchTemplateRowModalData = (tempId, tempType, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchTemplateRowModalRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-template-row-modal?tempId=${tempId}&tempType=${tempType}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchTemplateRowModalSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchTemplateRowModalFailure(error.message));
        return ({ ok: false, error });
    }
};

//de-activate row in template table
export const fetchUpdateRowTemplateRequest = () => ({ type: FETCH_UPDATEROWTEMPLATE_REQUEST });
export const fetchUpdateRowTemplateSuccess = (data) => ({ type: FETCH_UPDATEROWTEMPLATE_SUCCESS, payload: data });
export const fetchUpdateRowTemplateFailure = (error) => ({ type: FETCH_UPDATEROWTEMPLATE_FAILURE, payload: error });

export const fetchUpdateRowTemplateData = (tempId, tempType, userId, activeStatus) => async (dispatch) => {
    dispatch(fetchUpdateRowTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/update-row-template?tempId=${tempId}&tempType=${tempType}&userId=${userId}&activeStatus=${activeStatus}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchUpdateRowTemplateSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchUpdateRowTemplateFailure(error.message));
        return { ok: false, error };
    }

};

export const fetchExamSettingsCodeRequest = () => ({ type: FETCH_EXAMSETTINGSCODE_REQUEST });
export const fetchExamSettingsCodeSuccess = (data) => ({ type: FETCH_EXAMSETTINGSCODE_SUCCESS, payload: data });
export const fetchExamSettingsCodeFailure = (error) => ({ type: FETCH_EXAMSETTINGSCODE_FAILURE, payload: error });

export const fetchExamSettingsCodeData = (levelId) => async (dispatch) => {
    dispatch(fetchExamSettingsCodeRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-exam-settings-code?levelId=${levelId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();

        dispatch(fetchExamSettingsCodeSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchExamSettingsCodeFailure(error.message));
        return ({ ok: false, error: error.message });
    }
};

export const fetchExamScheduleCreatedRequest = () => ({ type: FETCH_EXAMSCHEDULECREATED_REQUEST });
export const fetchExamScheduleCreatedSuccess = (data) => ({ type: FETCH_EXAMSCHEDULECREATED_SUCCESS, payload: data });
export const fetchExamScheduleCreatedFailure = (error) => ({ type: FETCH_EXAMSCHEDULECREATED_FAILURE, payload: error });

export const fetchExamScheduleCreatedData = (levelId) => async (dispatch) => {
    dispatch(fetchExamScheduleCreatedRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-exam-room-schedule?levelId=${levelId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchExamScheduleCreatedSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        console.error('Error fetching exam schedule:', error);
        dispatch(fetchExamScheduleCreatedFailure(error.message));
        return ({ ok: false, error: error.message });
    }
};


export const fetcExamSettingsCodeByStudentIdRequest = () => ({ type: FETCH_EXAMSETTINGSCODEBYSTUDENTID_REQUEST });
export const fetcExamSettingsCodeByStudentIdSuccess = (data) => ({ type: FETCH_EXAMSETTINGSCODEBYSTUDENTID_SUCCESS, payload: data });
export const fetcExamSettingsCodeByStudentIdFailure = (error) => ({ type: FETCH_EXAMSETTINGSCODEBYSTUDENTID_FAILURE, payload: error });

export const fetchExamSettingsCodeByStudentIdData = (AppId) => async (dispatch) => {
    dispatch(fetcExamSettingsCodeByStudentIdRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-exam-setting-code-by-studentid?AppId=${AppId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetcExamSettingsCodeByStudentIdSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        console.error('Error fetching exam settings by student ID:', error);
        dispatch(fetcExamSettingsCodeByStudentIdFailure(error.message));
        return ({ ok: false, error: error.message });
    }
};


export const fetchAllUserByUserRoleRequest = () => ({ type: FETCH_ALLUSERBYUSERROLE_REQUEST });
export const fetchAllUserByUserRoleSuccess = (data) => ({ type: FETCH_ALLUSERBYUSERROLE_SUCCESS, payload: data });
export const fetchAllUserByUserRoleFailure = (error) => ({ type: FETCH_ALLUSERBYUSERROLE_FAILURE, payload: error });

export const fetchAllUserByUserRoleData = (userRoleId) => async (dispatch) => {
    dispatch(fetchAllUserByUserRoleRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-all-user-by-user-role?userRoleId=${userRoleId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = await response.json();
        dispatch(fetchAllUserByUserRoleSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch (error) {
        dispatch(fetchAllUserByUserRoleFailure(error.message));
        return ({ ok: false, error });
    }
};


export const fetchInsertStudentExamCodeSettingsRequest = () => ({ type: FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_REQUEST });
export const fetchInsertStudentExamCodeSettingsSuccess = (data) => ({ type: FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_SUCCESS, payload: data });
export const fetchInsertStudentExamCodeSettingsFailure = (error) => ({ type: FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_FAILURE, payload: error });

export const fetchInsertStudentExamCodeSettingsData = (formData) => async (dispatch) => {
    dispatch(fetchInsertStudentExamCodeSettingsRequest());
    try {
        const token = getToken();
        const url =`${baseUrl}/cfw/insert-student-exam-code-settings`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertStudentExamCodeSettingsSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error) {
        dispatch(fetchInsertStudentExamCodeSettingsFailure(error.message));
        return ({ ok: false, error });
    }
};


export const fetchExamRawScoreTableRequest = () => ({ type: FETCH_EXAM_RAW_SCORE_TABLE_REQUEST });
export const fetchExamRawScoreTableSuccess = (data) => ({ type: FETCH_EXAM_RAW_SCORE_TABLE_SUCCESS, payload: data });
export const fetchExamRawScoreTableFailure = (error) => ({ type: FETCH_EXAM_RAW_SCORE_TABLE_FAILURE, payload: error });

export const fetchExamRawScoreTableData = (AppId, page, pageSize) => async (dispatch) => {
    dispatch(fetchExamRawScoreTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-exam-raw-score-table?AppId=${AppId}&page=${page}&pageSize=${pageSize}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        
        const res = await response.json();

        dispatch(fetchExamRawScoreTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error) {
        dispatch(fetchExamRawScoreTableFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchInsertRawScoreByStudentIdRequest = () => ({ type: FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_REQUEST });
export const fetchInsertRawScoreByStudentIdSuccess = (data) => ({ type: FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_SUCCESS, payload: data });
export const fetchInsertRawScoreByStudentIdFailure = (error) => ({ type: FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_FAILURE, payload: error });

export const fetchInsertRawScoreByStudentIdData = (formData) => async(dispatch) => {
    dispatch(fetchInsertRawScoreByStudentIdRequest());
    try{
        const token = getToken();
        const url = `${baseUrl}/cfw/insert-raw-score-studentid`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertRawScoreByStudentIdSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error) {
        dispatch(fetchInsertRawScoreByStudentIdFailure(error.message));
        return ({ ok: false, error });
    }
};


export const fetchRawScoreByStudentRequest = () => ({ type: FETCH_RAW_SCORE_BY_STUDENT_REQUEST });
export const fetchRawScoreByStudentSuccess = (data) => ({ type: FETCH_RAW_SCORE_BY_STUDENT_SUCCESS, payload: data });
export const fetchRawScoreByStudentFailure = (error) => ({ type: FETCH_RAW_SCORE_BY_STUDENT_FAILURE, payload: error });

export const fetchRawScoreByStudentData = (studentId) => async(dispatch) => {
    dispatch(fetchRawScoreByStudentRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-raw-score-student?studentId=${studentId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        
        const res = await response.json();

        dispatch(fetchRawScoreByStudentSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchRawScoreByStudentFailure(error.message));
        return ({ ok: false, error });
    }

};

export const fetchSubjectListRequest = () => ({ type: FETCH_SUBJECTLIST_REQUEST });
export const fetchSubjectListSuccess = (data) => ({ type: FETCH_SUBJECTLIST_SUCCESS, payload: data });
export const fetchSubjectListFailure = (error) => ({ type: FETCH_SUBJECTLIST_FAILURE, payload: error });

export const fetchSubjectListData = (activeStatus) => async (dispatch) => {
    dispatch(fetchSubjectListRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-subject-table?activeStatus=${activeStatus}`;
        const response = await fetch(url, {
            method: 'POST',
            hearders: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchSubjectListSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchSubjectListFailure(error.message));
        return({ ok: false, error });
    }
};




// ====================================
// REAL-TIME CFW ENROLLMENT STATUS COUNTS
// ====================================
// ============================================================================
// CFW ENROLLMENT COUNTS (Real-time counting)
// ============================================================================

export const fetchCfwEnrollmentCountsRequest = () => ({ type: FETCH_CFW_ENROLLMENT_COUNTS_REQUEST });
export const fetchCfwEnrollmentCountsSuccess = (data) => ({ type: FETCH_CFW_ENROLLMENT_COUNTS_SUCCESS, payload: data });
export const fetchCfwEnrollmentCountsFailure = (error) => ({ type: FETCH_CFW_ENROLLMENT_COUNTS_FAILURE, payload: error });
export const updateCfwEnrollmentCountRealtime = (data) => ({ type: UPDATE_CFW_ENROLLMENT_COUNT_REALTIME, payload: data });

// Fetch initial counts for CFW
export const fetchCfwEnrollmentCounts = (schoolYear = '', userRoleId = '') => async (dispatch) => {
    console.log('📡 CFW API Call: fetchCfwEnrollmentCounts started with:', { schoolYear, userRoleId });
    dispatch(fetchCfwEnrollmentCountsRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/shared/enrollment-counts?schoolYear=${schoolYear}&userRoleId=${userRoleId}`;
        
        console.log('📡 Calling:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('📡 CFW Response:', { ok: response.ok, status: response.status, data });

        if (response.ok) {
            dispatch(fetchCfwEnrollmentCountsSuccess(data));
        } else {
            dispatch(fetchCfwEnrollmentCountsFailure(data.message || 'Failed to fetch CFW counts'));
        }
    } catch (error) {
        console.error('❌ Error fetching CFW enrollment counts:', error);
        dispatch(fetchCfwEnrollmentCountsFailure(error.message));
    }
};
