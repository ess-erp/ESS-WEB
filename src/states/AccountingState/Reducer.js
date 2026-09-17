import {
    FETCH_GET_COA_REQUEST, FETCH_GET_COA_SUCCESS, FETCH_GET_COA_FAILURE,
    FETCH_INSERT_COA_REQUEST, FETCH_INSERT_COA_SUCCESS, FETCH_INSERT_COA_FAILURE,
    FETCH_UPDATE_COA_REQUEST, FETCH_UPDATE_COA_SUCCESS, FETCH_UPDATE_COA_FAILURE,
    FETCH_GET_STUDENT_LEDGER_REQUEST, FETCH_GET_STUDENT_LEDGER_SUCCESS, FETCH_GET_STUDENT_LEDGER_FAILURE,
    FETCH_GET_STUDENT_LEDGER_DETAIL_REQUEST, FETCH_GET_STUDENT_LEDGER_DETAIL_SUCCESS, FETCH_GET_STUDENT_LEDGER_DETAIL_FAILURE,
    FETCH_CREATE_STUDENT_LEDGER_REQUEST, FETCH_CREATE_STUDENT_LEDGER_SUCCESS, FETCH_CREATE_STUDENT_LEDGER_FAILURE,
} from './ActionType';

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialGeneralState = {
    getCoaState:    { ...initialState },
    insertCoaState: { ...initialState },
    updateCoaState: { ...initialState },
};

const accountingReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        // ── GET COA ──────────────────────────────────────────────────────────
        case FETCH_GET_COA_REQUEST:
            return { ...state, getCoaState: { loading: true, data: [], error: '', success: false } };
        case FETCH_GET_COA_SUCCESS:
            return { ...state, getCoaState: { loading: false, data: action.payload, error: '', success: true } };
        case FETCH_GET_COA_FAILURE:
            return { ...state, getCoaState: { loading: false, data: [], error: action.payload, success: false } };

        // ── INSERT COA ───────────────────────────────────────────────────────
        case FETCH_INSERT_COA_REQUEST:
            return { ...state, insertCoaState: { loading: true, data: [], error: '', success: false } };
        case FETCH_INSERT_COA_SUCCESS:
            return { ...state, insertCoaState: { loading: false, data: action.payload, error: '', success: true } };
        case FETCH_INSERT_COA_FAILURE:
            return { ...state, insertCoaState: { loading: false, data: [], error: action.payload, success: false } };

        // ── UPDATE COA ───────────────────────────────────────────────────────
        case FETCH_UPDATE_COA_REQUEST:
            return { ...state, updateCoaState: { loading: true, data: [], error: '', success: false } };
        case FETCH_UPDATE_COA_SUCCESS:
            return { ...state, updateCoaState: { loading: false, data: action.payload, error: '', success: true } };
        case FETCH_UPDATE_COA_FAILURE:
            return { ...state, updateCoaState: { loading: false, data: [], error: action.payload, success: false } };

        default:
            return state;
    }
};

export default accountingReducer;
