import {
    FETCH_CAMPUS_REQUEST, FETCH_CAMPUS_SUCCESS, FETCH_CAMPUS_FAILURE,
    FETCH_DIVISION_REQUEST, FETCH_DIVISION_SUCCESS, FETCH_DIVISION_FAILURE,
    FETCH_LEVEL_REQUEST, FETCH_LEVEL_SUCCESS, FETCH_LEVEL_FAILURE,
    FETCH_STRAND_REQUEST, FETCH_STRAND_SUCCESS, FETCH_STRAND_FAILURE,
    FETCH_NATIONALITY_REQUEST, FETCH_NATIONALITY_SUCCESS, FETCH_NATIONALITY_FAILURE,
    FETCH_RELIGION_REQUEST, FETCH_RELIGION_SUCCESS, FETCH_RELIGION_FAILURE,
} from './ActionType';

const baseUrl = import.meta.env.VITE_BASE_URL;

//Get Campus
export const fetchCampusRequest = () => ({ type: FETCH_CAMPUS_REQUEST });
export const fetchCampusSuccess = (data) => ({ type: FETCH_CAMPUS_SUCCESS, payload: data });
export const fetchCampusFailure = (error) => ({ type: FETCH_CAMPUS_FAILURE, payload: error });

export const fetchCampusData = () => (async (dispatch) => {
    dispatch(fetchCampusRequest());
    try {
        const url = `${baseUrl}/auth/get-campus`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await response.json();
        console.log(res);
        dispatch(fetchCampusSuccess(res));
        return { ok: true, data: res }
    }
    catch (error) {
        dispatch(fetchCampusFailure(error.message));
        return { ok: false, error };
    }

});

// Division
export const fetchDivisionRequest = () => ({ type: FETCH_DIVISION_REQUEST });
export const fetchDivisionSuccess = (data) => ({ type: FETCH_DIVISION_SUCCESS, payload: data });
export const fetchDivisionFailure = (error) => ({ type: FETCH_DIVISION_FAILURE, payload: error });

export const fetchDivisionData = () => async (dispatch) => {
    dispatch(fetchDivisionRequest());
    try {
        const url = `${baseUrl}/auth/get-division`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await response.json();
        console.log(res);
        dispatch(fetchDivisionSuccess(res));
        return { ok: true, data: res }
    } catch (error) {
        dispatch(fetchDivisionFailure(error.message));
        return { ok: false, error };
    }
};


//Level
export const fetchLevelRequest = () => ({ type: FETCH_LEVEL_REQUEST });
export const fetchLevelSuccess = (data) => ({ type: FETCH_LEVEL_SUCCESS, payload: data });
export const fetchLevelFailure = (error) => ({ type: FETCH_LEVEL_FAILURE, payload: error });

export const fetchLevelData = (DivId = '') => async (dispatch) => {
    dispatch(fetchLevelRequest());
    try {

        const url = `${baseUrl}/auth/get-level?DivId=${DivId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await response.json();
        console.log(res);
        dispatch(fetchLevelSuccess(res));
        return { ok: true, data: res }
    } catch (error) {
        dispatch(fetchLevelFailure(error.message));
        return { ok: false, error };
    }
};


//Level
export const fetchStrandRequest = () => ({ type: FETCH_STRAND_REQUEST });
export const fetchStrandSuccess = (data) => ({ type: FETCH_STRAND_SUCCESS, payload: data });
export const fetchStrandFailure = (error) => ({ type: FETCH_STRAND_FAILURE, payload: error });

export const fetchStrandData = (LevelId = '') => async (dispatch) => {
    dispatch(fetchStrandRequest());
    try {

        const url = `${baseUrl}/auth/get-strand?LevelId=${LevelId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await response.json();
        console.log(res);
        dispatch(fetchStrandSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchStrandFailure(error.message));
        return { ok: false, error };
    }
};


//Nationality
export const fetchNationalityRequest = () => ({ type: FETCH_NATIONALITY_REQUEST });
export const fetchNationalitySuccess = (data) => ({ type: FETCH_NATIONALITY_SUCCESS, payload: data });
export const fetchNationalityFailure = (error) => ({ type: FETCH_NATIONALITY_FAILURE, payload: error });

export const fetchNationalityData = () => async (dispatch) => {
    dispatch(fetchNationalityRequest());
    try {
        const url = `${baseUrl}/auth/get-nationality`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const res = await response.json();

        dispatch(fetchNationalitySuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchNationalityFailure(error.message));
        return { ok: false, error };
    }
};

//Religion
export const fetchReligionRequest = () => ({ type: FETCH_RELIGION_REQUEST });
export const fetchReligionSuccess = (data) => ({ type: FETCH_RELIGION_SUCCESS, payload: data });
export const fetchReligionFailure = (error) => ({ type: FETCH_RELIGION_FAILURE, payload: error });

export const fetchReligionData = () => async (dispatch) => {
    dispatch(fetchReligionRequest());
    try {
        const url = `${baseUrl}/auth/get-religion`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const res = await response.json();
        
        dispatch(fetchReligionSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchReligionFailure(error.message));
        return { ok: false, error };
    }
};