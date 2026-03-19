import {
    FETCH_RETURNEE_OLD_STUDENT_REQUEST, FETCH_RETURNEE_OLD_STUDENT_SUCCESS, FETCH_RETURNEE_OLD_STUDENT_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialGeneralState = {
    returneeOldStudentState: { ...initialState}
};

const parentReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        case FETCH_RETURNEE_OLD_STUDENT_REQUEST:
            return {...state, returneeOldStudentState: {loading: true, data: [], error: ''}};
        case FETCH_RETURNEE_OLD_STUDENT_SUCCESS:
            return {...state, returneeOldStudentState: {loading: false, data: action.payload, error: ''}};
        case FETCH_RETURNEE_OLD_STUDENT_FAILURE:
            return {...state, returneeOldStudentState: {loading: false, data: [], error: action.payload }};
        
        default:
            return state;
    }
};

export default parentReducer;
