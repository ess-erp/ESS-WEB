import {
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST, FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST, FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE,
    FETCH_INSERT_HIRING_PROCESS_REQUEST, FETCH_INSERT_HIRING_PROCESS_SUCCESS, FETCH_INSERT_HIRING_PROCESS_FAILURE,
    FETCH_USER_ROLE_REQUEST, FETCH_USER_ROLE_SUCCESS, FETCH_USER_ROLE_FAILURE,
    FETCH_INSERT_CRITERIA_TEMPLATE_REQUEST, FETCH_INSERT_CRITERIA_TEMPLATE_SUCCESS, FETCH_INSERT_CRITERIA_TEMPLATE_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialGeneralState = {
    employeeOnlineState: { ...initialState },
    employeeInfoState: { ...initialState },
    insertHiringProcessState: { ...initialState },
    userRoleState: { ...initialState },
    insertCriteriaTemplateState: { ...initialState },
};

const hrReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        // Get the template table
        case FETCH_EMPLOYEE_ONLINE_APP_REQUEST:
            return { ...state, employeeOnlineState: { loading: true, data: [], error: '' } };
        case FETCH_EMPLOYEE_ONLINE_APP_SUCCESS:
            return { ...state, employeeOnlineState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EMPLOYEE_ONLINE_APP_FAILURE:
            return { ...state, employeeOnlineState: { loading: false, data: [], error: action.payload } };

        case FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST:
            return { ...state, employeeInfoState: { loading: true, data: [], error: '' } };
        case FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS:
            return { ...state, employeeInfoState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE:
            return { ...state, employeeInfoState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_HIRING_PROCESS_REQUEST:
            return { ...state, employeeInfoState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_HIRING_PROCESS_SUCCESS:
            return { ...state, employeeInfoState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_HIRING_PROCESS_FAILURE:
            return { ...state, employeeInfoState: { loading: false, data: [], error: action.payload } };

        case FETCH_USER_ROLE_REQUEST:
            return { ...state, userRoleState: { loading: true, data: [], error: '' } };
        case FETCH_USER_ROLE_SUCCESS:
            return { ...state, userRoleState: { loading: false, data: action.payload, error: '' } };
        case FETCH_USER_ROLE_FAILURE:
            return { ...state, userRoleState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_CRITERIA_TEMPLATE_REQUEST:
            return { ...state, insertCriteriaTemplateState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_CRITERIA_TEMPLATE_SUCCESS:
            return { ...state, insertCriteriaTemplateState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_CRITERIA_TEMPLATE_FAILURE:
            return { ...state, insertCriteriaTemplateState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
}
export default hrReducer;