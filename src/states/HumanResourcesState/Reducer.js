import {
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST, FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    employeeOnlineState: { ...initialState },
}

const hrReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        // Get the template table
        case FETCH_EMPLOYEE_ONLINE_APP_REQUEST:
            return { ...state, employeeOnlineState: { loading: true, data: [], error: '' } };
        case FETCH_EMPLOYEE_ONLINE_APP_SUCCESS:
            return { ...state, employeeOnlineState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EMPLOYEE_ONLINE_APP_FAILURE:
            return { ...state, employeeOnlineState: { loading: false, data: [], error: action.payload } };

     

        default:
            return state;
    }
}
export default hrReducer;