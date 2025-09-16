import {
    FETCH_STUDENTAPPFORM_REQUEST, FETCH_STUDENTAPPFORM_SUCCESS, FETCH_STUDENTAPPFORM_FAILURE,
} from './ActionType';

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    studentAppFormState: { ...initialState },
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

        default:
            return state;
    }

};
export default cashierReducer;