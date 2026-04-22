import {
    FETCH_SIGNALR_NOTIFICATION_RECEIVED,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialGeneralState = {
    notificationState: { ...initialState },
};

const notificationReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        case FETCH_SIGNALR_NOTIFICATION_RECEIVED:
            return { ...state, notificationState: { loading: false, data: action.payload, error: '' } };

        default:
            return state;
    }
};

export default notificationReducer;