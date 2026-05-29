import {
    FETCH_SIGNALR_NOTIFICATION_RECEIVED,
    SET_TOAST_MESSAGE,
    CLEAR_TOAST_MESSAGE,
    FETCH_NOTIFICATION_LIST_REQUEST, FETCH_NOTIFICATION_LIST_SUCCESS, FETCH_NOTIFICATION_LIST_FAILURE,
    FETCH_NOTIFICATION_COUNT_REQUEST, FETCH_NOTIFICATION_COUNT_SUCCESS, FETCH_NOTIFICATION_COUNT_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const receiveSignalRNotification = (data) => ({
    type: FETCH_SIGNALR_NOTIFICATION_RECEIVED,
    payload: data,
});

export const showToast = (data) => ({
    type: SET_TOAST_MESSAGE,
    payload: data,
});

export const hideToast = () => ({
    type: CLEAR_TOAST_MESSAGE,
});

export const fetchNotificationListRequest = () => ({ type: FETCH_NOTIFICATION_LIST_REQUEST });
export const fetchNotificationListSuccess = (data) => ({ type: FETCH_NOTIFICATION_LIST_SUCCESS, payload: data });
export const fetchNotificationListFailure = (error) => ({ type: FETCH_NOTIFICATION_LIST_FAILURE, payload: error });

export const fetchNotificationListData = (userId, page, pageSize) => async (dispatch) => {
    dispatch(fetchNotificationListRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/shared/get-notification-list?userId=${userId}&page=${page}&pageSize=${pageSize}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();

        dispatch(fetchNotificationListSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch(error){
        dispatch(fetchNotificationListFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchNotificationCountRequest = () => ({ type: FETCH_NOTIFICATION_COUNT_REQUEST });
export const fetchNotificationCountSuccess = (data) => ({ type: FETCH_NOTIFICATION_COUNT_SUCCESS, payload: data });
export const fetchNotificationCountFailure = (error) => ({ type: FETCH_NOTIFICATION_COUNT_FAILURE, payload: error });

export const fetchNotificationCountData = (userId) => async (dispatch) => {
    dispatch(fetchNotificationCountRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/shared/get-notification-count?userId=${userId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();

        dispatch(fetchNotificationCountSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchNotificationCountFailure(error.message));
        return { ok: false, error };
    }
};