import {
    FETCH_SIGNALR_NOTIFICATION_RECEIVED,
    SET_TOAST_MESSAGE,
    CLEAR_TOAST_MESSAGE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const receiveSignalRNotification = (data) => ({
    type: FETCH_SIGNALR_NOTIFICATION_RECEIVED,
    payload: data,
});

export const showToast = (message) => ({
    type: "SHOW_TOAST",
    payload: message,
});

export const hideToast = () => ({
    type: "HIDE_TOAST",
});