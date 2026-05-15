import {
    FETCH_LIST_OF_SECTION_REQUEST, FETCH_LIST_OF_SECTION_SUCCESS, FETCH_LIST_OF_SECTION_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialDataState = {
    listOfSectionState: { ...initialState },
};

const teacherReducer = (state = initialDataState, action) => {
    switch (action.type) {
        case FETCH_LIST_OF_SECTION_REQUEST:
            return { ...state, listOfSectionState: { loading: true, data: [], error: '' } };
        case FETCH_LIST_OF_SECTION_SUCCESS:
            return { ...state, listOfSectionState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LIST_OF_SECTION_FAILURE:
            return { ...state, listOfSectionState: { loading: false, data: [], error: action.payload } };
        default:
            return state;
    }
}
export default teacherReducer;