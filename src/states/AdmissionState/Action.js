import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_STUDENTBYID_REQUEST, FETCH_STUDENTBYID_SUCCESS, FETCH_STUDENTBYID_FAILURE,
    FETCH_INSERTTEMPLATEFORM_REQUEST, FETCH_INSERTTEMPLATEFORM_SUCCESS, FETCH_INSERTTEMPLATEFORM_FAILURE,
    FETCH_LEVEL_REQUEST, FETCH_LEVEL_SUCCESS, FETCH_LEVEL_FAILURE,
    FETCH_DIVISION_REQUEST, FETCH_DIVISION_SUCCESS, FETCH_DIVISION_FAILURE,
    FETCH_TEMPLATETABLE_REQUEST, FETCH_TEMPLATETABLE_SUCCESS, FETCH_TEMPLATETABLE_FAILURE,
    FETCH_ROWTEMPLATETABLE_REQUEST, FETCH_ROWTEMPLATETABLE_SUCCESS, FETCH_ROWTEMPLATETABLE_FAILURE,
    FETCH_UPDATEROWTEMPLATE_REQUEST, FETCH_UPDATEROWTEMPLATE_SUCCESS, FETCH_UPDATEROWTEMPLATE_FAILURE,
    FETCH_DOCUMENTTABLE_REQUEST, FETCH_DOCUMENTTABLE_SUCCESS, FETCH_DOCUMENTTABLE_FAILURE,
    FETCH_INSERTDOCUMENT_REQUEST, FETCH_INSERTDOCUMENT_SUCCESS, FETCH_INSERTDOCUMENT_FAILURE,
    FETCH_GPATABLE_REQUEST, FETCH_GPATABLE_SUCCESS, FETCH_GPATABLE_FAILURE,
    FETCH_INSERTGPATABLE_REQUEST, FETCH_INSERTGPATABLE_SUCCESS, FETCH_INSERTGPATABLE_FAILURE,
    FETCH_EXAMINATIONSCHEDULER_REQUEST, FETCH_EXAMINATIONSCHEDULER_SUCCESS, FETCH_EXAMINATIONSCHEDULER_FAILURE,
    FETCH_EXAMSCHEDTEMPLATE_REQUEST, FETCH_EXAMSCHEDTEMPLATE_SUCCESS, FETCH_EXAMSCHEDTEMPLATE_FAILURE,
    FETCH_UPDATESTUDENTFORM_REQUEST, FETCH_UPDATESTUDENTFORM_SUCCESS, FETCH_UPDATESTUDENTFORM_FAILURE,
    FETCH_INSERTEXAMSCHEDULE_REQUEST, FETCH_INSERTEXAMSCHEDULE_SUCCESS, FETCH_INSERTEXAMSCHEDULE_FAILURE,
    FETCH_OTHERSTABLE_REQUEST, FETCH_OTHERSTABLE_SUCCESS, FETCH_OTHERSTABLE_FAILURE,
    FETCH_TESTPERMIT_REQUEST, FETCH_TESTPERMIT_SUCCESS, FETCH_TESTPERMIT_FAILURE,
    FETCH_RESENDEMAIL_REQUEST, FETCH_RESENDEMAIL_SUCCESS, FETCH_RESENDEMAIL_FAILURE,
    FETCH_ADMISSION_TEST_RESULT_REQUEST, FETCH_ADMISSION_TEST_RESULT_SUCCESS, FETCH_ADMISSION_TEST_RESULT_FAILURE,
    FETCH_GENERATE_LETTER_REQUEST, FETCH_GENERATE_LETTER_SUCCESS, FETCH_GENERATE_LETTER_FAILURE,
    FETCH_GENERATED_LETTER_REQUEST, FETCH_GENERATED_LETTER_SUCCESS, FETCH_GENERATED_LETTER_FAILURE,
    FETCH_INSERT_TAGGING_LETTER_REQUEST, FETCH_INSERT_TAGGING_LETTER_SUCCESS, FETCH_INSERT_TAGGING_LETTER_FAILURE,
    FETCH_RELIGION_WAVER_REQUEST, FETCH_RELIGION_WAVER_SUCCESS, FETCH_RELIGION_WAVER_FAILURE,
    FETCH_SEND_RELIGION_WAIVER_REQUEST, FETCH_SEND_RELIGION_WAIVER_SUCCESS, FETCH_SEND_RELIGION_WAIVER_FAILURE,
    FETCH_UPDATE_SEND_RELIGION_WAIVER_REQUEST, FETCH_UPDATE_SEND_RELIGION_WAIVER_SUCCESS, FETCH_UPDATE_SEND_RELIGION_WAIVER_FAILURE,
    FETCH_ACADEMIC_WAIVER_REQUEST, FETCH_ACADEMIC_WAIVER_SUCCESS, FETCH_ACADEMIC_WAIVER_FAILURE,
} from './ActionType';
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchEnrollmentTableRequest = () => ({ type: FETCH_ENROLLMENTTABLE_REQUEST });
export const fetchEnrollmentTableSuccess = (data) => ({ type: FETCH_ENROLLMENTTABLE_SUCCESS, payload: data });
export const fetchEnrollmentTableFailure = (error) => ({ type: FETCH_ENROLLMENTTABLE_FAILURE, payload: error });

export const fetchEnrollmentTableData = (StartDate, EndDate, TableType, page, pageSize, search) => async (dispatch) => {
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

//Insert new templates form
export const fetchInsertTemplateFormRequest = () => ({ type: FETCH_INSERTTEMPLATEFORM_REQUEST });
export const fetchInsertTemplateFormSuccess = (data) => ({ type: FETCH_INSERTTEMPLATEFORM_SUCCESS, payload: data });
export const fetchInsertTemplateFormFailure = (error) => ({ type: FETCH_INSERTTEMPLATEFORM_FAILURE, payload: error });

export const fetchInsertTemplateFormData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTemplateFormRequest());
    try {
        console.log(formData);
        const token = getToken();

        let url = "";

        if (formData.TemplateType == "gpa") {
            url = `${baseUrl}/admission/insert-gpa-template`
        }
        else if (formData.TemplateType == "document") {
            url = `${baseUrl}/admission/insert-document-template`
        }
        else {
            url = `${baseUrl}/admission/insert-examroom-template`
        }


        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const res = await response.json();

        dispatch(fetchInsertTemplateFormSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertTemplateFormFailure(error.message));
        return { ok: false, error };
    }
};


//get level 
export const fetchLevelRequest = () => ({ type: FETCH_LEVEL_REQUEST });
export const fetchLevelSuccess = (data) => ({ type: FETCH_LEVEL_SUCCESS, payload: data });
export const fetchLevelFailure = (error) => ({ type: FETCH_LEVEL_FAILURE, payload: error });

export const fetchLevelData = () => async (dispatch) => {
    dispatch(fetchLevelRequest());
    try {

        const token = getToken();
        const url = `${baseUrl}/admission/get-level`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);
        dispatch(fetchLevelSuccess(res));
        return { ok: true, data: res }
    } catch (error) {
        dispatch(fetchLevelFailure(error.message));
        return { ok: false, error };
    }
};


// Division
export const fetchDivisionRequest = () => ({ type: FETCH_DIVISION_REQUEST });
export const fetchDivisionSuccess = (data) => ({ type: FETCH_DIVISION_SUCCESS, payload: data });
export const fetchDivisionFailure = (error) => ({ type: FETCH_DIVISION_FAILURE, payload: error });

export const fetchDivisionData = () => async (dispatch) => {
    dispatch(fetchDivisionRequest());
    try {

        const token = getToken();
        const url = `${baseUrl}/admission/get-division`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const res = await response.json();
        console.log(res);
        dispatch(fetchDivisionSuccess(res));
        return { ok: true, data: res }
    } catch (error) {
        dispatch(fetchDivisionFailure(error.message));
        return { ok: false, error };
    }
};


//get the template table 
export const fetchTemplateTableRequest = () => ({ type: FETCH_TEMPLATETABLE_REQUEST });
export const fetchTemplateTableSuccess = (data) => ({ type: FETCH_TEMPLATETABLE_SUCCESS, payload: data });
export const fetchTempalteTableFailure = (error) => ({ type: FETCH_TEMPLATETABLE_FAILURE, payload: error });

export const fetchTemplateTableData = (tableType, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchTemplateTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/template-table?tableType=${tableType}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchTemplateTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchTempalteTableFailure(error.message));
        return { ok: false, error };
    }

};

//get the data of row in template table
export const fetchRowTemplateTableRequest = () => ({ type: FETCH_ROWTEMPLATETABLE_REQUEST });
export const fetchRowTemplateTableSuccess = (data) => ({ type: FETCH_ROWTEMPLATETABLE_SUCCESS, payload: data });
export const fetchRowTemplateTableFailure = (error) => ({ type: FETCH_ROWTEMPLATETABLE_FAILURE, payload: error });

export const fetchRowTemplateTableData = (templateId, tempType, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchRowTemplateTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-row-template-table?templateId=${templateId}&tempType=${tempType}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchRowTemplateTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchRowTemplateTableFailure(error.message));
        return { ok: false, error };
    }

};

//de-activate row in template table
export const fetchUpdateRowTemplateRequest = () => ({ type: FETCH_UPDATEROWTEMPLATE_REQUEST });
export const fetchUpdateRowTemplateSuccess = (data) => ({ type: FETCH_UPDATEROWTEMPLATE_SUCCESS, payload: data });
export const fetchUpdateRowTemplateFailure = (error) => ({ type: FETCH_UPDATEROWTEMPLATE_FAILURE, payload: error });

export const fetchUpdateRowTemplateData = (templateId, tempType, userId, activeStatus) => async (dispatch) => {
    dispatch(fetchUpdateRowTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/update-row-template?templateId=${templateId}&tempType=${tempType}&userId=${userId}&activeStatus=${activeStatus}`;
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

//get the all list in document and pass it tot datatable
export const fetchDocumentTableRequest = () => ({ type: FETCH_DOCUMENTTABLE_REQUEST });
export const fetchDocumentTableSuccess = (data) => ({ type: FETCH_DOCUMENTTABLE_SUCCESS, payload: data });
export const fetchDocumentTableFailure = (error) => ({ type: FETCH_DOCUMENTTABLE_FAILURE, payload: error });

export const fetchDocumentTableData = (studentId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchDocumentTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-document-table?studentId=${studentId}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchDocumentTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchDocumentTableFailure(error.message));
        return { ok: false, error };
    }

};

//insert document in document table
export const fetchInsertDocumentRequest = () => ({ type: FETCH_INSERTDOCUMENT_REQUEST });
export const fetchInsertDocumentSuccess = (data) => ({ type: FETCH_INSERTDOCUMENT_SUCCESS, payload: data });
export const fetchInsertDocumentFailure = (error) => ({ type: FETCH_INSERTDOCUMENT_FAILURE, payload: error });

export const fetchInsertDocumentData = (formData) => async (dispatch) => {
    dispatch(fetchInsertDocumentRequest());
    try {
        const token = getToken();
        console.log(formData);
        const url = `${baseUrl}/admission/insert-document`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
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

        dispatch(fetchInsertDocumentSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertDocumentFailure(error.message));
        return { ok: false, error };
    }

};


//get gpa template table
export const fetchGpaTableRequest = () => ({ type: FETCH_GPATABLE_REQUEST });
export const fetchGpaTableSuccess = (data) => ({ type: FETCH_GPATABLE_SUCCESS, payload: data });
export const fetchGpaTableFailure = (error) => ({ type: FETCH_GPATABLE_FAILURE, payload: error });

export const fetchGpaTableData = (divId, studentId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGpaTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-gpa-table?divId=${divId}&studentId=${studentId}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchGpaTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchGpaTableFailure(error.message));
        return { ok: false, error };
    }

};

//insert gpa template table
export const fetchInsertGpaTableRequest = () => ({ type: FETCH_INSERTGPATABLE_REQUEST });
export const fetchInsertGpaTableSuccess = (data) => ({ type: FETCH_INSERTGPATABLE_SUCCESS, payload: data });
export const fetchInsertGpaTableFailure = (error) => ({ type: FETCH_INSERTGPATABLE_FAILURE, payload: error });

export const fetchInsertGpaTableData = (formData) => async (dispatch) => {
    dispatch(fetchInsertGpaTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/insert-gpa-table`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchInsertGpaTableSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchInsertGpaTableFailure(error.message));
        return { ok: false, error };
    }

};

//get examination data of applicant
export const fetchExaminationSchedulerRequest = () => ({ type: FETCH_EXAMINATIONSCHEDULER_REQUEST });
export const fetchExaminationSchedulerSuccess = (data) => ({ type: FETCH_EXAMINATIONSCHEDULER_SUCCESS, payload: data });
export const fetchExaminationSchedulerFailure = (error) => ({ type: FETCH_EXAMINATIONSCHEDULER_FAILURE, payload: error });

export const fetchExaminationSchedulerData = (studentId) => async (dispatch) => {
    dispatch(fetchExaminationSchedulerRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-exam-schedule?studentId=${studentId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchExaminationSchedulerSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchExaminationSchedulerFailure(error.message));
        return { ok: false, error };
    }

};

//get gpa template table
export const fetchExamSchedTemplateRequest = () => ({ type: FETCH_EXAMSCHEDTEMPLATE_REQUEST });
export const fetchExamSchedTemplateSuccess = (data) => ({ type: FETCH_EXAMSCHEDTEMPLATE_SUCCESS, payload: data });
export const fetchExamSchedTemplateFailure = (error) => ({ type: FETCH_EXAMSCHEDTEMPLATE_FAILURE, payload: error });

export const fetchExamSchedTemplateData = (levelId) => async (dispatch) => {
    dispatch(fetchExamSchedTemplateRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-exam-schedule-template?levelId=${levelId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchExamSchedTemplateSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchExamSchedTemplateFailure(error.message));
        return { ok: false, error };
    }

};


//update student app form 
export const fetchUpdateStudentFormRequest = () => ({ type: FETCH_UPDATESTUDENTFORM_REQUEST });
export const fetchUpdateStudentFormSuccess = (data) => ({ type: FETCH_UPDATESTUDENTFORM_SUCCESS, payload: data });
export const fetchUpdateStudentFormFailure = (error) => ({ type: FETCH_UPDATESTUDENTFORM_FAILURE, payload: error });

export const fetchUpdateStudentFormData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateStudentFormRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/update-student-app-form`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchExamSchedTemplateSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchUpdateStudentFormFailure(error.message));
        return { ok: false, error };
    }
}

//insert exam schedule date of applicant
export const fetchInsertExamScheduleRequest = () => ({ type: FETCH_INSERTEXAMSCHEDULE_REQUEST });
export const fetchInsertExamScheduleSuccess = (data) => ({ type: FETCH_INSERTEXAMSCHEDULE_SUCCESS, payload: data });
export const fetchInsertExamSchedulreFailure = (error) => ({ type: FETCH_INSERTEXAMSCHEDULE_FAILURE, payload: error });

export const fetchInsertExamScheduleData = (formData) => async (dispatch) => {
    dispatch(fetchInsertExamScheduleRequest());
    try {

        const token = getToken();
        const url = `${baseUrl}/admission/insert-exam-schedule`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        console.log(res);
        dispatch(fetchInsertExamScheduleSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchInsertExamScheduleFailure(error.message));
        return { ok: false, error };
    }
};

//get gpa template table
export const fetchOthersTableRequest = () => ({ type: FETCH_OTHERSTABLE_REQUEST });
export const fetchOthersTableSuccess = (data) => ({ type: FETCH_OTHERSTABLE_SUCCESS, payload: data });
export const fetchOthersTableFailure = (error) => ({ type: FETCH_OTHERSTABLE_FAILURE, payload: error });

export const fetchOthersTableData = (studentId, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchOthersTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-others-table?studentId=${studentId}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchOthersTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchOthersTableFailure(error.message));
        return { ok: false, error };
    }

};

//get test permit template
export const fetchTestPermitRequest = () => ({ type: FETCH_TESTPERMIT_REQUEST });
export const fetchTestPermitSuccess = (data) => ({ type: FETCH_TESTPERMIT_SUCCESS, payload: data });
export const fetchTestPermitFailure = (error) => ({ type: FETCH_TESTPERMIT_FAILURE, payload: error });

export const fetchTestPermitData = (othersTableId) => async (dispatch) => {
    dispatch(fetchTestPermitRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-test-permit?othersTableId=${othersTableId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = await response.json();
        dispatch(fetchTestPermitSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchTestPermitFailure(error.message));
        return { ok: false, error };
    }
};

//resend email of others table 
export const fetchResendEmailRequest = () => ({ type: FETCH_RESENDEMAIL_REQUEST });
export const fetchResendEmailSuccess = (data) => ({ type: FETCH_RESENDEMAIL_SUCCESS, payload: data });
export const fetchResendEmailFailure = (error) => ({ type: FETCH_RESENDEMAIL_FAILURE, payload: error });

export const fetchResendEmailData = (emailStatusId, studentId, emailType, currentUserId) => async (dispatch) => {
    dispatch(fetchResendEmailRequest());
    try {

        const token = getToken();
        const url = `${baseUrl}/admission/resend-email?emailStatusId=${emailStatusId}&studentId=${studentId}&emailType=${emailType}&currentUserId=${currentUserId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = await response.json();
        dispatch(fetchResendEmailSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchResendEmailFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchAdmissionTestResultRequest = () => ({ type: FETCH_ADMISSION_TEST_RESULT_REQUEST });
export const fetchAdmissionTestResultSuccess = (data) => ({ type: FETCH_ADMISSION_TEST_RESULT_SUCCESS, payload: data });
export const fetchAdmissionTestResultFailure = (error) => ({ type: FETCH_ADMISSION_TEST_RESULT_FAILURE, payload: error });

export const fetchAdmissionTestResultData = (othersTableId) => async (dispatch) => {
    dispatch(fetchAdmissionTestResultRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-admission-test-result?othersTableId=${othersTableId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'applicatio/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchAdmissionTestResultSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchAdmissionTestResultFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchGenerateLetterRequest = () => ({ type: FETCH_GENERATE_LETTER_REQUEST });
export const fetchGenerateLetterSuccess = (data) => ({ type: FETCH_GENERATE_LETTER_SUCCESS, payload: data });
export const fetchGenerateLetterFailure = (error) => ({ type: FETCH_GENERATE_LETTER_FAILURE, payload: error });

export const fetchGenerateLetterData = (studentId,curUserId) => async (dispatch) => {
    dispatch(fetchGenerateLetterRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/generate-letter-student-id?studentId=${studentId}&userId=${curUserId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchGenerateLetterSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error) {
        dispatch(fetchGenerateLetterFailure(error.message));
        return ({ ok: false, error });
    }
};

export const fetchGeneratedLetterRequest = () => ({ type: FETCH_GENERATED_LETTER_REQUEST });
export const fetchGeneratedLetterSuccess = (data) => ({ type: FETCH_GENERATED_LETTER_SUCCESS, payload: data });
export const fetchGeneratedLetterFailure = (error) => ({ type: FETCH_GENERATED_LETTER_FAILURE, payload: error });

export const fetchGeneratedLetterData = (othersTableId) => async (dispatch) => {
    dispatch(fetchGeneratedLetterRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-generated-letter?othersTableId=${othersTableId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchGeneratedLetterSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error) {
        dispatch(fetchGeneratedLetterFailure(error.message));
        return ({ ok: false, error });
    }
};

export const fetchInsertTaggingLetterRequest = () => ({ type: FETCH_INSERT_TAGGING_LETTER_REQUEST });
export const fetchInsertTaggingLetterSuccess = (data) => ({ type: FETCH_INSERT_TAGGING_LETTER_SUCCESS, payload: data });
export const fetchInsertTaggingLetterFailure = (error) => ({ type: FETCH_INSERT_TAGGING_LETTER_FAILURE, payload: error });

export const fetchInsertTaggingLetterData = (formData) => async (dispatch) => {
    dispatch(fetchInsertTaggingLetterRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/insert-tagging-letter`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchInsertTaggingLetterSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error) {
        dispatch(fetchInsertTaggingLetterFailure());
        return ({ ok: false, error });
    }
};

export const fetchReligionWaverRequest = () => ({ type: FETCH_RELIGION_WAVER_REQUEST });
export const fetchReligionWaverSuccess = (data) => ({ type: FETCH_RELIGION_WAVER_SUCCESS, payload: data });
export const fetchReligionWaverFailure = (error) => ({ type: FETCH_RELIGION_WAVER_FAILURE, payload: error });

export const fetchReligionWaverData = (studentId) => async (dispatch) => {
    dispatch(fetchReligionWaverRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-religion-waver-student-id?studentId=${studentId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchReligionWaverSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchReligionWaverFailure(error.message));
        return ({ ok: false, error });
    }
};

export const fetchSendReligionWaiverRequest = () => ({ type: FETCH_SEND_RELIGION_WAIVER_REQUEST });
export const fetchSendReligionWaiverSuccess = (data) => ({ type: FETCH_SEND_RELIGION_WAIVER_SUCCESS, payload: data });
export const fetchSendReligionWaiverFailure = (error) => ({ type: FETCH_SEND_RELIGION_WAIVER_FAILURE, payload: error });

export const fetchSendReligionWaiverData = (formData) => async (dispatch) => {
    dispatch(fetchSendReligionWaiverRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/send-religion-waiver`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
        
        const res = await response.json();
        
        dispatch(fetchSendReligionWaiverSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error) {
        dispatch(fetchSendReligionWaiverFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchUpdateSendReligionWaiverRequest = () => ({ type: FETCH_UPDATE_SEND_RELIGION_WAIVER_REQUEST });
export const fetchUpdateSendReligionWaiverSuccess = (data) => ({ type: FETCH_UPDATE_SEND_RELIGION_WAIVER_SUCCESS, payload: data });
export const fetchUpdateSendReligionWaiverFailure = (error) => ({ type: FETCH_UPDATE_SEND_RELIGION_WAIVER_FAILURE, payload: error });

export const fetchUpdateSendReligionWaiverData = (othersTableId,userId) => async (dispatch) => {
    dispatch(fetchUpdateSendReligionWaiverRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/update-send-religion-waiver?othersTableId=${othersTableId}&userId=${userId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        
        const res = await response.json();
        
        dispatch(fetchUpdateSendReligionWaiverSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error) {
        dispatch(fetchUpdateSendReligionWaiverFailure(error.message));
        return ({ ok: false, error })
    }
};

export const fetchAcademicWaiverRequest = () => ({ type: FETCH_ACADEMIC_WAIVER_REQUEST });
export const fetchAcademicWaiverSuccess = (data) => ({ type: FETCH_ACADEMIC_WAIVER_SUCCESS, payload: data });
export const fetchAcademicWaiverFailure = (error) => ({ type: FETCH_ACADEMIC_WAIVER_FAILURE, payload: error });

export const fetchAcademicWaiverData = (studentId) => async (dispatch) => {
    dispatch(fetchAcademicWaiverRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/admission/get-academic-waiver-student-id?studentId=${studentId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        
        const res = await response.json();
        
        dispatch(fetchAcademicWaiverSuccess(res));
        return ({ ok: true, data: res.data });
    }
    catch(error){
        dispatch(fetchAcademicWaiverFailure(error.message));
        return ({ ok: false, error })
    }
};