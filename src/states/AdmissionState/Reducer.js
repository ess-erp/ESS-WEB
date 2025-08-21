import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_STUDENTBYID_REQUEST, FETCH_STUDENTBYID_SUCCESS, FETCH_STUDENTBYID_FAILURE,
    FETCH_STUDENTGPA_REQUEST, FETCH_STUDENTGPA_SUCCESS, FETCH_STUDENTGPA_FAILURE,
    FETCH_STUDENTUPDATEDGPA_REQUEST, FETCH_STUDENTUPDATEDGPA_SUCCESS, FETCH_STUDENTUPDATEDGPA_FAILURE,
} from './ActionType';

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    tableState: { ...initialState },
    studentDataState: { ...initialState },
    studentGpa: { ...initialState },
    updatedGpaState: { ...initialState },
}

const admissionReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        //Get Enrollment table
        case FETCH_ENROLLMENTTABLE_REQUEST:
            return { ...state, tableState: { loading: true, data: [], error: '' } };
        case FETCH_ENROLLMENTTABLE_SUCCESS:
            return { ...state, tableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ENROLLMENTTABLE_FAILURE:
            return { ...state, tableState: { loading: false, data: [], error: action.payload } };

        //Fetch Student Data using StudentId
        case FETCH_STUDENTBYID_REQUEST:
            return { ...state, studentDataState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENTBYID_SUCCESS:
            return { ...state, studentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENTBYID_FAILURE:
            return { ...state, studentDataState: { loading: false, data: '', error: action.payload } };

        //insert gpa of student
        case FETCH_STUDENTGPA_REQUEST:
            return { ...state, studentGpaState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENTGPA_SUCCESS:
            return { ...state, studentGpaState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENTGPA_FAILURE:
            return { ...state, studentGpaState: { loading: false, data: '', error: action.payload } };

        //get the update gpa of student
        case FETCH_STUDENTUPDATEDGPA_REQUEST:
            return { ...state, updatedGpaState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENTUPDATEDGPA_SUCCESS:
            return { ...state, updatedGpaState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENTUPDATEDGPA_FAILURE:
            return { ...state, updatedGpaState: { loading: false, data: '', error: action.payload } };


        default:
            return state;
    }
}
export default admissionReducer;