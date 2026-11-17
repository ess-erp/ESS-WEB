// ══════════════════════════════════════════════════════════════════════════════
// SHARED STATE - ACTION CREATORS
// ══════════════════════════════════════════════════════════════════════════════
// Shared actions used across multiple modules/roles
// ══════════════════════════════════════════════════════════════════════════════

import {
    FETCH_GET_SCHOOL_YEAR_LIST_REQUEST,
    FETCH_GET_SCHOOL_YEAR_LIST_SUCCESS,
    FETCH_GET_SCHOOL_YEAR_LIST_FAILURE,
} from './ActionType';

import { getToken } from '../../services/tokenServices';

const baseUrl = import.meta.env.VITE_BASE_URL;

// ══════════════════════════════════════════════════════════════════════════════
// SCHOOL YEAR LIST
// ══════════════════════════════════════════════════════════════════════════════

export const fetchGetSchoolYearListRequest = () => ({ type: FETCH_GET_SCHOOL_YEAR_LIST_REQUEST });
export const fetchGetSchoolYearListSuccess = (data) => ({ type: FETCH_GET_SCHOOL_YEAR_LIST_SUCCESS, payload: data });
export const fetchGetSchoolYearListFailure = (error) => ({ type: FETCH_GET_SCHOOL_YEAR_LIST_FAILURE, payload: error });

export const fetchGetSchoolYearListData = () => async (dispatch) => {
    dispatch(fetchGetSchoolYearListRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/shared/get-school-year-list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await res.json();
        dispatch(fetchGetSchoolYearListSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetSchoolYearListFailure(err.message));
        return { ok: false, error: err.message };
    }
};
