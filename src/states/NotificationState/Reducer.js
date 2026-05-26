import {
    FETCH_SIGNALR_NOTIFICATION_RECEIVED,
    SET_TOAST_MESSAGE,
    CLEAR_TOAST_MESSAGE,
} from "./ActionType";

const initialState = {
    notifications: [],
    unreadCount: 0,
    toastMessage: null,
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_SIGNALR_NOTIFICATION_RECEIVED":
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            };

        case "MARK_ALL_READ":
            return {
                ...state,
                unreadCount: 0,
            };

        case SET_TOAST_MESSAGE:
            return {
                ...state,
                toastMessage: action.payload,
            };

        case CLEAR_TOAST_MESSAGE:
            return {
                ...state,
                toastMessage: null,
            };

        default:
            return state;
    }
};

export default notificationReducer;