// ══════════════════════════════════════════════════════════════════════════════
// SHARED STATE - REDUCER
// ══════════════════════════════════════════════════════════════════════════════
// Shared state used across multiple modules/roles
// ══════════════════════════════════════════════════════════════════════════════

import {
    FETCH_GET_SCHOOL_YEAR_LIST_REQUEST,
    FETCH_GET_SCHOOL_YEAR_LIST_SUCCESS,
    FETCH_GET_SCHOOL_YEAR_LIST_FAILURE,
} from './ActionType';

// ── Initial State ──────────────────────────────────────────────────────────────

const initialState = {
    schoolYearListState: { loading: false, data: [], error: '' },
};

// ── Reducer ────────────────────────────────────────────────────────────────────

const sharedReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_GET_SCHOOL_YEAR_LIST_REQUEST:
            return { ...state, schoolYearListState: { loading: true, data: [], error: '' } };
        case FETCH_GET_SCHOOL_YEAR_LIST_SUCCESS:
            return { ...state, schoolYearListState: { loading: false, data: action.payload.data || action.payload || [], error: '' } };
        case FETCH_GET_SCHOOL_YEAR_LIST_FAILURE:
            return { ...state, schoolYearListState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
};

export default sharedReducer;
