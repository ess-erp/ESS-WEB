import {
    FETCH_SIGNALR_NOTIFICATION_RECEIVED,
} from "./ActionType";


export const signalRNotificationReceived = (data) => ({
    type: FETCH_SIGNALR_NOTIFICATION_RECEIVED,
    payload: data
});