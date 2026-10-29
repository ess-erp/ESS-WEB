import {
    FETCH_EMPLOYEE_ONLINE_APP_REQUEST, FETCH_EMPLOYEE_ONLINE_APP_SUCCESS, FETCH_EMPLOYEE_ONLINE_APP_FAILURE,
    FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST, FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS, FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE,
    FETCH_CRITERIA_TABLE_REQUEST, FETCH_CRITERIA_TABLE_SUCCESS, FETCH_CRITERIA_TABLE_FAILURE,
    FETCH_SUBMIT_INTERVIEW_REQUEST, FETCH_SUBMIT_INTERVIEW_SUCCESS, FETCH_SUBMIT_INTERVIEW_FAILURE,
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
    criteriaTableState: { ...initialState },
    submitInterviewState: { ...initialState },
};

const sacReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        // Employee Online Applications
        case FETCH_EMPLOYEE_ONLINE_APP_REQUEST:
            return { ...state, employeeOnlineState: { loading: true, data: [], error: '' } };
        case FETCH_EMPLOYEE_ONLINE_APP_SUCCESS:
            return { ...state, employeeOnlineState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EMPLOYEE_ONLINE_APP_FAILURE:
            return { ...state, employeeOnlineState: { loading: false, data: [], error: action.payload } };

        // Employee Application Info
        case FETCH_EMPLOYEE_APPLICATION_INFO_REQUEST:
            return { ...state, employeeInfoState: { loading: true, data: [], error: '' } };
        case FETCH_EMPLOYEE_APPLICATION_INFO_SUCCESS:
            return { ...state, employeeInfoState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EMPLOYEE_APPLICATION_INFO_FAILURE:
            return { ...state, employeeInfoState: { loading: false, data: [], error: action.payload } };

        // Criteria Table
        case FETCH_CRITERIA_TABLE_REQUEST:
            return { ...state, criteriaTableState: { loading: true, data: [], error: '' } };
        case FETCH_CRITERIA_TABLE_SUCCESS:
            return { ...state, criteriaTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_CRITERIA_TABLE_FAILURE:
            return { ...state, criteriaTableState: { loading: false, data: [], error: action.payload } };

        // Submit Interview
        case FETCH_SUBMIT_INTERVIEW_REQUEST:
            return { ...state, submitInterviewState: { loading: true, data: [], error: '' } };
        case FETCH_SUBMIT_INTERVIEW_SUCCESS:
            return { ...state, submitInterviewState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SUBMIT_INTERVIEW_FAILURE:
            return { ...state, submitInterviewState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
}
export default sacReducer;