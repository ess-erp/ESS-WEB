import {
    FETCH_GET_NOTIFICATION_REQUEST, FETCH_GET_NOTIFICATION_SUCCESS, FETCH_GET_NOTIFICATION_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchGetNotificationRequest = () => ({ type: FETCH_GET_NOTIFICATION_REQUEST });
export const fetchGetNotificationSuccess = (data) => ({ type: FETCH_GET_NOTIFICATION_SUCCESS, payload: data });
export const fetchGetNotificationFailure = (error) => ({ type: FETCH_GET_NOTIFICATION_FAILURE, payload: error });

// export const fetchGetNotificationData = ()