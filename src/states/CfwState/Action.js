import {
    FETCH_INSERTEXAMROOM_REQUEST, FETCH_INSERTEXAMROOM_SUCCESS, FETCH_INSERTEXAMROOM_FAILURE,
    FETCH_TEMPLATETABLE_REQUEST,FETCH_TEMPLATETABLE_SUCCESS, FETCH_TEMPLATETABLE_FAILURE,
    FETCH_INSERTEXAMSCHEDULE_REQUEST, FETCH_INSERTEXAMSCHEDULE_SUCCESS, FETCH_INSERTEXAMSCHEDULE_FAILURE,
    FETCH_EXAMROOMTEMPLATE_REQUEST, FETCH_EXAMROOMTEMPLATE_SUCCESS, FETCH_EXAMROOMTEMPLATE_FAILURE,
    FETCH_UPDATEROWTABLE_REQUEST, FETCH_UPDATEROWTABLE_SUCCESS, FETCH_UPDATEROWTABLE_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;


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

export const fetchExamRoomTemplateData = (campusId) => async(dispatch) => {
    dispatch(fetchExamRoomTemplateRequest());
    try{
        const token = getToken();
        const url = `${baseUrl}/cfw/get-examroom-created?campusId=${campusId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchExamRoomTemplateSuccess(res));
        return ({ ok: true, data: res });
    }
    catch(error){
        dispatch(fetchExamRoomTemplateFailure(error.message));
        return({ ok: false, data: error.message });
    }
}


//insert exam schedule template
export const fetchInsertExamScheduleRequest = () => ({ type: FETCH_INSERTEXAMSCHEDULE_REQUEST });
export const fetchInsertExamScheduleSuccess = (data) => ({ type: FETCH_INSERTEXAMSCHEDULE_SUCCESS, payload: data });
export const fetchInsertExamScheduleFailure = (error) => ({ type: FETCH_INSERTEXAMSCHEDULE_FAILURE, payload: error });

export const fetchInsertExamScheduleData = (formData) => async (dispatch) => {
    dispatch(fetchInsertExamScheduleRequest())

    try {

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

export const fetchTemplateTableData = (status, page, pageSize, search) => async(dispatch) => {
    dispatch(fetchTemplateTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-template-table?status=${status}&page=${page}&pageSize=${pageSize}&search=${search}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchTemplateTableSuccess(res))
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error) {
        dispatch(fetchTemplateTableFailure(error));
        return ({ ok: false, data: error });
    }
};


//update the row in template table --for disable and enable
export const fetchUpdateRowTableRequest = () => ({ type: FETCH_UPDATEROWTABLE_REQUEST });
export const fetchUpdateRowTableSuccess = (data) => ({ type: FETCH_UPDATEROWTABLE_SUCCESS, payload: data });
export const fetchUpdateRowTableFailure = (error) => ({ type: FETCH_UPDATEROWTABLE_FAILURE, payload: error });

export const fetchUpdateRowTableData = (tempId) => async(dispatch) => {
    dispatch(fetchUpdateRowTableRequest());
    try{
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
        return({ ok: true, data: res });
    }
    catch(error){
        dispatch(fetchUpdateRowTableFailure(error.message));
        return({ ok: false, error });
    }
};

export const fetchRowTemplateTableRequest = () => ({ type: FETCH_ROWTEMPLATETABLE_REQUEST });
export const fetchRowTemplateTableSuccess = (data) => ({ type: FETCH_ROWTEMPLATETABLE_SUCCESS, payload: data });
export const fetchRowTemplateTableFailure = (error) => ({ type: FETCH_ROWTEMPLATETABLE_FAILURE, payload: error });

export const fetchRowTemplateTableData = (tempId, tempType) => async(dispatch) => {
    dispatch(fetchRowTemplateTableRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cfw/get-row-template-data?tempId=${tempId}&tempType=${tempType}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchRowTemplateTableSuccess(res));
        return ({ ok: true, data: res });
    }
    catch(error){
        dispatch(fetchRowTemplateTableFailure(error.message));
        return({ ok: false, error });
    }
};