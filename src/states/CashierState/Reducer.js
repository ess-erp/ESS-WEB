import {
    FETCH_STUDENTAPPFORM_REQUEST, FETCH_STUDENTAPPFORM_SUCCESS, FETCH_STUDENTAPPFORM_FAILURE,
    FETCH_ORNUMBER_REQUEST, FETCH_ORNUMBER_SUCCESS, FETCH_ORNUMBER_FAILURE,
    FETCH_PRINTTESTPERMIT_REQUEST, FETCH_PRINTTESTPERMIT_SUCCESS, FETCH_PRINTTESTPERMIT_FAILURE,
    FETCH_INSERTSUBMITTEST_REQUEST, FETCH_INSERTSUBMITTEST_SUCCESS, FETCH_INSERTSUBMITTEST_FAILURE,
} from './ActionType';

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    studentAppFormState: { ...initialState },
    orNumberState: { ...initialState },
    printTestPermitState: { ...initialState },
    insertSubmitTestState: { ...initialState },
}

const cashierReducer = (state = initialGeneralState, action) => {
    switch (action.type) {
        
        //get student app form
        case FETCH_STUDENTAPPFORM_REQUEST:
            return { ...state, studentAppFormState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENTAPPFORM_SUCCESS:
            return { ...state, studentAppFormState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENTAPPFORM_FAILURE:
            return { ...state, studentAppFormState: { loading: false, data: [], error: action.payload } };

        //get latest Or number
        case FETCH_ORNUMBER_REQUEST:
            return { ...state, orNumberState: { loading: true, data: [], error: '' } };
        case FETCH_ORNUMBER_SUCCESS:
            return { ...state, orNumberState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ORNUMBER_FAILURE:
            return { ...state, orNumberState: { loading: false, data: [], error: action.payload } };

        //print test permit
        case FETCH_PRINTTESTPERMIT_REQUEST:
            return { ...state, printTestPermitState: { loading: true, data: [], error: '' } };
        case FETCH_PRINTTESTPERMIT_SUCCESS:
            return { ...state, printTestPermitState: { loading: false, data: action.payload, error: '' } };
        case FETCH_PRINTTESTPERMIT_FAILURE:
            return { ...state, printTestPermitState: { loading: false, data: [], error: action.payload } };

        //print test permit
        case FETCH_INSERTSUBMITTEST_REQUEST:
            return { ...state, insertSubmitTestState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTSUBMITTEST_SUCCESS:
            return { ...state, insertSubmitTestState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTSUBMITTEST_FAILURE:
            return { ...state, insertSubmitTestState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }

};
export default cashierReducer;