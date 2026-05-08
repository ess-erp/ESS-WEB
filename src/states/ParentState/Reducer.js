import {
    FETCH_RETURNEE_OLD_STUDENT_REQUEST, FETCH_RETURNEE_OLD_STUDENT_SUCCESS, FETCH_RETURNEE_OLD_STUDENT_FAILURE,
    FETCH_STUDENTBYID_REQUEST, FETCH_STUDENTBYID_SUCCESS, FETCH_STUDENTBYID_FAILURE,
    FETCH_UPDATE_STUDENT_FORM_REQUEST,
    FETCH_UPDATE_STUDENT_FORM_SUCCESS,
    FETCH_UPDATE_STUDENT_FORM_FAILURE,
    FETCH_LISTOFSTUDENTTABLE_REQUEST , FETCH_LISTOFSTUDENTTABLE_SUCCESS, FETCH_LISTOFSTUDENTTABLE_FAILURE,
    FETCH_INSERT_STUDENT_ENROLLMENT_REQUEST,
    FETCH_INSERT_STUDENT_ENROLLMENT_SUCCESS,
    FETCH_INSERT_STUDENT_ENROLLMENT_FAILURE,
    FETCH_LIST_OF_TUITION_FEE_REQUEST,
    FETCH_LIST_OF_TUITION_FEE_SUCCESS,
    FETCH_LIST_OF_TUITION_FEE_FAILURE, 
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialGeneralState = {
    returneeOldStudentState: { ...initialState },
    studentDataState: { ...initialState },
    tableState: { ...initialState },
    insertEnrollmentState: { ...initialState },
    updateStudentDataState: { ...initialState },
    tuitionFeeState: { ...initialState },
};

const parentReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        case FETCH_RETURNEE_OLD_STUDENT_REQUEST:
            return { ...state, returneeOldStudentState: { loading: true, data: [], error: '' } };
        case FETCH_RETURNEE_OLD_STUDENT_SUCCESS:
            return { ...state, returneeOldStudentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_RETURNEE_OLD_STUDENT_FAILURE:
            return { ...state, returneeOldStudentState: { loading: false, data: [], error: action.payload } };

        //FETCH STUDENT DATA USING STUDENTBYID
        case FETCH_STUDENTBYID_REQUEST:
            return { ...state, studentDataState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENTBYID_SUCCESS:
            return { ...state, studentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENTBYID_FAILURE:
            return { ...state, studentDataState: { loading: false, data: '', error: action.payload } };

        //Update student data using STUDENTBYID
        case FETCH_UPDATE_STUDENT_FORM_REQUEST:
            return { ...state, updateStudentDataState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATE_STUDENT_FORM_SUCCESS:
            return { ...state, updateStudentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATE_STUDENT_FORM_FAILURE:
            return { ...state, updateStudentDataState: { loading: false, data: [], error: action.payload } };

        //Get List of student table
        case FETCH_LISTOFSTUDENTTABLE_REQUEST:
            return { ...state, tableState: { loading: true, data: [], error: '' } };
        case FETCH_LISTOFSTUDENTTABLE_SUCCESS:
            return { ...state, tableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LISTOFSTUDENTTABLE_FAILURE:
            return { ...state, tableState: { loading: false, data: [], error: action.payload } };
        
        //Insert Student Enrollment
        case FETCH_INSERT_STUDENT_ENROLLMENT_REQUEST:
            return { ...state, insertEnrollmentState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_STUDENT_ENROLLMENT_SUCCESS:
            return { ...state, insertEnrollmentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_STUDENT_ENROLLMENT_FAILURE:
            return { ...state, insertEnrollmentState: { loading: false, data: [], error: action.payload } };

        //Insert Tuition Fee
        case FETCH_LIST_OF_TUITION_FEE_REQUEST:
            return { ...state, tuitionFeeState: { loading: true, data: [], error: '' } };
        case FETCH_LIST_OF_TUITION_FEE_SUCCESS:
            return { ...state, tuitionFeeState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LIST_OF_TUITION_FEE_FAILURE:
            return { ...state, tuitionFeeState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
};

export default parentReducer;
