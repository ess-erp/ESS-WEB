import {
    FETCH_SIGNALR_NOTIFICATION_RECEIVED,
    SET_TOAST_MESSAGE,
    CLEAR_TOAST_MESSAGE,
    FETCH_NOTIFICATION_LIST_REQUEST,
    FETCH_NOTIFICATION_LIST_SUCCESS,
    FETCH_NOTIFICATION_LIST_FAILURE,
    FETCH_NOTIFICATION_COUNT_REQUEST,
    FETCH_NOTIFICATION_COUNT_SUCCESS,
    FETCH_NOTIFICATION_COUNT_FAILURE,
} from "./ActionType";

const initialState = {
    notifications: [],     // unified source of truth
    unreadCount: 0,

    toastData: [],

    notificationState: {
        loading: false,
        error: '',
    },
    notificationCountState: {
        data: [],
        loading: false,
        error: '',
    }
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {

        // =========================
        // SIGNALR REAL-TIME PUSH
        // =========================
        case FETCH_SIGNALR_NOTIFICATION_RECEIVED: {
            const newNotifications = [
                action.payload,
                ...state.notifications
            ];

            return {
                ...state,
                notifications: newNotifications,
                unreadCount: newNotifications.filter(n => n.ActiveStatus === "P").length,
            };
        }

        // =========================
        // MARK ALL READ
        // =========================
        case "MARK_ALL_READ": {
            const updated = state.notifications.map(n => ({
                ...n,
                ActiveStatus: "R"
            }));

            return {
                ...state,
                notifications: updated,
                unreadCount: 0,
            };
        }

        // =========================
        // TOAST
        // =========================
        case SET_TOAST_MESSAGE:
            console.log("TOAST RECEIVED:", action.payload);
            return {
                ...state,
                toastData: action.payload,
            };

        case CLEAR_TOAST_MESSAGE:
            return {
                ...state,
                toastData: [],
            };

        // =========================
        // FETCH LIST REQUEST
        // =========================
        case FETCH_NOTIFICATION_LIST_REQUEST:
            return {
                ...state,
                notificationState: {
                    loading: true,
                    error: '',
                },
            };

        // =========================
        // FETCH LIST SUCCESS
        // =========================
        case FETCH_NOTIFICATION_LIST_SUCCESS: {
            const list = action.payload.data || [];

            return {
                ...state,
                notifications: list,
                unreadCount: list.filter(n => n.ActiveStatus === "P").length,
                notificationState: {
                    loading: false,
                    error: '',
                },
            };
        }

        // =========================
        // FETCH LIST FAILURE
        // =========================
        case FETCH_NOTIFICATION_LIST_FAILURE:
            return {
                ...state,
                notificationState: {
                    loading: false,
                    error: action.payload,
                },
            };

        case FETCH_NOTIFICATION_COUNT_REQUEST:
            return {
                ...state,
                notificationCountState: {
                    data: [],
                    loading: true,
                    error: '',
                },
            };

        case FETCH_NOTIFICATION_COUNT_SUCCESS: {
            return {
                ...state,
                notificationCountState: {
                    data: action.payload,
                    loading: false,
                    error: '',
                },
            };
        }
        case FETCH_NOTIFICATION_COUNT_FAILURE:
            return {
                ...state,
                notificationCountState: {
                    data: [],
                    loading: false,
                    error: action.payload,
                },
            };

        default:
            return state;
    }
};

export default notificationReducer;