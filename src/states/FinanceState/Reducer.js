import {
    FETCH_LISTOFUSER_REQUEST, FETCH_LISTOFUSER_SUCCESS, FETCH_LISTOFUSER_FAILURE,
    FETCH_INSERTORSERIES_REQUEST, FETCH_INSERTORSERIES_SUCCESS, FETCH_INSERTORSERIES_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    listOfUserState: { ...initialState },
    insertOrSeriesState: { ...initialState },
}

const financeReducer = (state = initialGeneralState, action) => {
    switch(action.type){
        //get all user in cashier
        case FETCH_LISTOFUSER_REQUEST:
            return { ...state, listOfUserState: { loading: true, data: [], error: ''}};
        case FETCH_LISTOFUSER_SUCCESS:
            return { ...state, listOfUserState: { loading: false, data: action.payload, error: ''}};
        case FETCH_LISTOFUSER_FAILURE:
            return { ...state, listOfUserState: { loading: false, data: [], error: action.payload }};

        //get all user in cashier
        case FETCH_INSERTORSERIES_REQUEST:
            return { ...state, insertOrSeriesState: { loading: true, data: [], error: ''}};
        case FETCH_INSERTORSERIES_SUCCESS:
            return { ...state, insertOrSeriesState: { loading: false, data: action.payload, error: ''}};
        case FETCH_INSERTORSERIES_FAILURE:
            return { ...state, insertOrSeriesState: { loading: false, data: [], error: action.payload }};


        default:
            return state;
    }
}
export default financeReducer;