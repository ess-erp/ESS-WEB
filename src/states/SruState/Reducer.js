import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_STUDENT_INFO_REQUEST, FETCH_STUDENT_INFO_SUCCESS, FETCH_STUDENT_INFO_FAILURE,
    FETCH_UPDATE_STUDENT_INFO_REQUEST, FETCH_UPDATE_STUDENT_INFO_SUCCESS, FETCH_UPDATE_STUDENT_INFO_FAILURE,
} from './ActionType';

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialGeneralState = {
    tableState: { ...initialState },
    studentDataState: { ...initialState },
    updateStudentDataState: { ...initialState },
};
const sruReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        //Get Enrollment table
        case FETCH_ENROLLMENTTABLE_REQUEST:
            return { ...state, tableState: { loading: true, data: [], error: '' } };
        case FETCH_ENROLLMENTTABLE_SUCCESS:
            return { ...state, tableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ENROLLMENTTABLE_FAILURE:
            return { ...state, tableState: { loading: false, data: [], error: action.payload } };

        case FETCH_STUDENT_INFO_REQUEST:
            return { ...state, studentDataState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENT_INFO_SUCCESS:
            return { ...state, studentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENT_INFO_FAILURE:
            return { ...state, studentDataState: { loading: false, data: [], error: action.payload } };

        case FETCH_UPDATE_STUDENT_INFO_REQUEST:
            return { ...state, updateStudentDataState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATE_STUDENT_INFO_SUCCESS:
            return { ...state, updateStudentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATE_STUDENT_INFO_FAILURE:
            return { ...state, updateStudentDataState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
}
export default sruReducer;