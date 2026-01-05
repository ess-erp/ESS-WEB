import {
    FETCH_TRANSACTION_TYPE_REQUEST, FETCH_TRANSACTION_TYPE_SUCCESS, FETCH_TRANSACTION_TYPE_FAILURE,
    FETCH_STUDENT_APPLICATION_REQUEST, FETCH_STUDENT_APPLICATION_SUCCESS, FETCH_STUDENT_APPLICATION_FAILURE,
    FETCH_ORNUMBER_REQUEST, FETCH_ORNUMBER_SUCCESS, FETCH_ORNUMBER_FAILURE,
    FETCH_PRINTTESTPERMIT_REQUEST, FETCH_PRINTTESTPERMIT_SUCCESS, FETCH_PRINTTESTPERMIT_FAILURE,
    // FETCH_INSERTSUBMITTEST_REQUEST, FETCH_INSERTSUBMITTEST_SUCCESS, FETCH_INSERTSUBMITTEST_FAILURE,
} from './ActionType';

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    transactionTypeState: { ...initialState },
    studentAppState: { ...initialState },
    orNumberState: { ...initialState },
    printTestPermitState: { ...initialState },
    insertSubmitTestState: { ...initialState },
}

const cashierReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        case FETCH_TRANSACTION_TYPE_REQUEST:
            return { ...state, transactionTypeState: { loading: true, data: [], error: '' } };
        case FETCH_TRANSACTION_TYPE_SUCCESS:
            return { ...state, transactionTypeState: { loading: false, data: action.payload, error: '' } };
        case FETCH_TRANSACTION_TYPE_FAILURE:
            return { ...state, transactionTypeState: { loading: false, data: [], error: action.payload } };

        case FETCH_STUDENT_APPLICATION_REQUEST:
            return { ...state, studentAppState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENT_APPLICATION_SUCCESS:
            return { ...state, studentAppState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENT_APPLICATION_FAILURE:
            return { ...state, studentAppState: { loading: false, data: [], error: action.payload } };

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
        // case FETCH_INSERTSUBMITTEST_REQUEST:
        //     return { ...state, insertSubmitTestState: { loading: true, data: [], error: '' } };
        // case FETCH_INSERTSUBMITTEST_SUCCESS:
        //     return { ...state, insertSubmitTestState: { loading: false, data: action.payload, error: '' } };
        // case FETCH_INSERTSUBMITTEST_FAILURE:
        //     return { ...state, insertSubmitTestState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }

};
export default cashierReducer;