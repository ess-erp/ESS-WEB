import {
    FETCH_LIST_OF_SECTION_REQUEST, FETCH_LIST_OF_SECTION_SUCCESS, FETCH_LIST_OF_SECTION_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchListOfSectionRequest = () => ({ type: FETCH_FACULTY_LOAD_TABLE_REQUEST });
export const fetchListOfSectionSuccess = (data) => ({ type: FETCH_FACULTY_LOAD_TABLE_SUCCESS, payload: data });
export const fetchListOfSectionFailure = (error) => ({ type: FETCH_FACULTY_LOAD_TABLE_FAILURE, payload: error });

export const fetchListOfSectionData = (teacherId,page, pageSize, search) => async (dispatch) => {
    dispatch(fetchListOfSectionRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/teacher/get-faculty-load-teacher-id?teacherId=${teacherId}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchListOfSectionSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchListOfSectionFailure(error.message));
        return { ok: false, error };
    }
};