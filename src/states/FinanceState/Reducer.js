import {
    FETCH_TEMPLATETABLE_REQUEST, FETCH_TEMPLATETABLE_SUCCESS, FETCH_TEMPLATETABLE_FAILURE,
    FETCH_LISTOFUSER_REQUEST, FETCH_LISTOFUSER_SUCCESS, FETCH_LISTOFUSER_FAILURE,
    FETCH_INSERTORSERIES_REQUEST, FETCH_INSERTORSERIES_SUCCESS, FETCH_INSERTORSERIES_FAILURE,
    FETCH_INSERT_TABLE_OF_FEES_REQUEST, FETCH_INSERT_TABLE_OF_FEES_SUCCESS, FETCH_INSERT_TABLE_OF_FEES_FAILURE,
    FETCH_INSERT_TUITION_FEE_REQUEST, FETCH_INSERT_TUITION_FEE_SUCCESS, FETCH_INSERT_TUITION_FEE_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    templateTableState: { ...initialState },
    listOfUserState: { ...initialState },
    insertOrSeriesState: { ...initialState },
    insertFeesState: { ...initialState },
    tuitionFeeState: { ...initialState },
}

const financeReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        // Get the template table
        case FETCH_TEMPLATETABLE_REQUEST:
            return { ...state, templateTableState: { loading: true, data: [], error: '' } };
        case FETCH_TEMPLATETABLE_SUCCESS:
            return { ...state, templateTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_TEMPLATETABLE_FAILURE:
            return { ...state, templateTableState: { loading: false, data: [], error: action.payload } };

        //get all user in cashier
        case FETCH_LISTOFUSER_REQUEST:
            return { ...state, listOfUserState: { loading: true, data: [], error: '' } };
        case FETCH_LISTOFUSER_SUCCESS:
            return { ...state, listOfUserState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LISTOFUSER_FAILURE:
            return { ...state, listOfUserState: { loading: false, data: [], error: action.payload } };

        //get all user in cashier
        case FETCH_INSERTORSERIES_REQUEST:
            return { ...state, insertOrSeriesState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTORSERIES_SUCCESS:
            return { ...state, insertOrSeriesState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTORSERIES_FAILURE:
            return { ...state, insertOrSeriesState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_TABLE_OF_FEES_REQUEST:
            return { ...state, insertFeesState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_TABLE_OF_FEES_SUCCESS:
            return { ...state, insertFeesState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_TABLE_OF_FEES_FAILURE:
            return { ...state, insertFeesState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_TUITION_FEE_REQUEST:
            return { ...state, tuitionFeeState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_TUITION_FEE_SUCCESS:
            return { ...state, tuitionFeeState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_TUITION_FEE_FAILURE:
            return { ...state, tuitionFeeState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
}
export default financeReducer;