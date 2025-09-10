import {
    FETCH_INSERTEXAMROOM_REQUEST, FETCH_INSERTEXAMROOM_SUCCESS, FETCH_INSERTEXAMROOM_FAILURE,
    FETCH_TEMPLATETABLE_REQUEST,FETCH_TEMPLATETABLE_SUCCESS, FETCH_TEMPLATETABLE_FAILURE,
    FETCH_INSERTEXAMSCHEDULE_REQUEST, FETCH_INSERTEXAMSCHEDULE_SUCCESS, FETCH_INSERTEXAMSCHEDULE_FAILURE,
    FETCH_EXAMROOMTEMPLATE_REQUEST, FETCH_EXAMROOMTEMPLATE_SUCCESS, FETCH_EXAMROOMTEMPLATE_FAILURE,
    FETCH_UPDATEROWTABLE_REQUEST, FETCH_UPDATEROWTABLE_SUCCESS, FETCH_UPDATEROWTABLE_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    insertExamRoomState: { ...initialState },
    templateTableState: { ...initialState },
    insertExamScheduleState: { ...initialState },
    examRoomTemplate: { ...initialState },
    updateTableState: { ...initialState },
}

const cfwReducer = (state = initialGeneralState, action ) => {
    switch (action.type) {

        //insert exam room template
        case FETCH_INSERTEXAMROOM_REQUEST:
            return { ...state, insertExamRoomState: { loading: true, data: [], error: ''}};
        case FETCH_INSERTEXAMROOM_SUCCESS:
            return { ...state, insertExamRoomState: { loading: false, data: action.payload, error: ''}};
        case FETCH_INSERTEXAMROOM_FAILURE:
            return { ...state, insertExamRoomState: { loading: false, data: [], error: action.payload }};

        //get exam room template
        case FETCH_EXAMROOMTEMPLATE_REQUEST:
            return { ...state, examRoomTemplate: { loading: true, data: [], error: ''}};
        case FETCH_EXAMROOMTEMPLATE_SUCCESS:
            return { ...state, examRoomTemplate: { loading: false, data: action.payload, error: ''}};
        case FETCH_EXAMROOMTEMPLATE_FAILURE:
            return { ...state, examRoomTemplate: { loading: false, data: [], error: action.payload }};

        //insert exam schedule template
        case FETCH_INSERTEXAMSCHEDULE_REQUEST:
            return { ...state, insertExamScheduleState: { loading: true, data: [], error: ''}};
        case FETCH_INSERTEXAMSCHEDULE_SUCCESS:
            return { ...state, insertExamScheduleState: { loading: false, data: action.payload, error: ''}};
        case FETCH_INSERTEXAMSCHEDULE_FAILURE:
            return { ...state, insertExamScheduleState: { loading: false, data: [], error: action.payload }};

        //get all template
        case FETCH_TEMPLATETABLE_REQUEST:
            return { ...state, templateTableState: { loading: true, data: [], error: ''}};
        case FETCH_TEMPLATETABLE_SUCCESS:
            return { ...state, templateTableState: { loading: false, data: action.payload, error: ''}};
        case FETCH_TEMPLATETABLE_FAILURE:
            return { ...state, templateTableState: { loading: false, data: [], error: action.payload }};

        //enable and disable row in template table
        case FETCH_UPDATEROWTABLE_REQUEST:
            return { ...state, updateTableState: { loading: true, data: [], error: ''}};
        case FETCH_UPDATEROWTABLE_SUCCESS:
            return { ...state, updateTableState: { loading: false, data: action.payload, error: ''}};
        case FETCH_UPDATEROWTABLE_FAILURE:
            return { ...state, updateTableState: { loading: false, data: [], error: action.payload }};

        default:
            return state;
    }
}
export default cfwReducer;