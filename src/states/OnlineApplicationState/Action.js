import {
    FETCH_CAMPUS_REQUEST, FETCH_CAMPUS_SUCCESS, FETCH_CAMPUS_FAILURE,
    FETCH_DIVISION_REQUEST, FETCH_DIVISION_SUCCESS, FETCH_DIVISION_FAILURE,
    FETCH_LEVEL_REQUEST, FETCH_LEVEL_SUCCESS, FETCH_LEVEL_FAILURE,
    FETCH_STRAND_REQUEST, FETCH_STRAND_SUCCESS, FETCH_STRAND_FAILURE,
    FETCH_NATIONALITY_REQUEST, FETCH_NATIONALITY_SUCCESS, FETCH_NATIONALITY_FAILURE,
    FETCH_RELIGION_REQUEST, FETCH_RELIGION_SUCCESS, FETCH_RELIGION_FAILURE,
    FETCH_OTPCODE_REQUEST, FETCH_OTPCODE_SUCCESS, FETCH_OTPCODE_FAILURE,
    FETCH_PROVINCE_REQUEST, FETCH_PROVINCE_SUCCESS, FETCH_PROVINCE_FAILURE,
    FETCH_CITY_REQUEST, FETCH_CITY_SUCCESS, FETCH_CITY_FAILURE,
    FETCH_BARANGAY_REQUEST, FETCH_BARANGAY_SUCCESS, FETCH_BARANGAY_FAILURE,
    FETCH_INSERTSTUDENT_REQUEST, FETCH_INSERTSTUDENT_SUCCESS, FETCH_INSERTSTUDENT_FAILURE,
    FETCH_OLDSTUDENT_REQUEST, FETCH_OLDSTUDENT_SUCCESS, FETCH_OLDSTUDENT_FAILURE,
    FETCH_STUDENTBYID_REQUEST, FETCH_STUDENTBYID_SUCCESS, FETCH_STUDENTBYID_FAILURE,
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

//Get OtpCode
export const fetchOtpCodeRequest = () => ({ type: FETCH_OTPCODE_REQUEST });
export const fetchOtpCodeSuccess = (data) => ({ type: FETCH_OTPCODE_SUCCESS, payload: data });
export const fetchOtpCodeFailure = (error) => ({ type: FETCH_OTPCODE_FAILURE, payload: error });

export const fetchOtpCodeData = (Email = "") => async (dispatch) => {
    dispatch(fetchOtpCodeRequest());
    try {
        const url = `${baseUrl}/auth/email-verification?Email=${Email}`
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const res = await response.json();

        dispatch(fetchOtpCodeSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchOtpCodeFailure(error.message));
        return { ok: false, error };
    }
};


//Get Province
export const fetchProvinceRequest = () => ({ type: FETCH_PROVINCE_REQUEST });
export const fetchProvinceSuccess = (data) => ({ type: FETCH_PROVINCE_SUCCESS, payload: data });
export const fetchProvinceFailure = (error) => ({ type: FETCH_PROVINCE_FAILURE, payload: error });

export const fetchProvinceData = () => async (dispatch) => {
    dispatch(fetchProvinceRequest());
    try {
        const response = await fetch('/assets/PhAddress/province.json');

        const res = await response.json();

        const sorted = res.sort((a, b) =>
            a.province_name.localeCompare(b.province_name)
        );
        dispatch(fetchProvinceSuccess(sorted));
        return { ok: true, data: sorted };
    } catch (error) {
        dispatch(fetchProvinceFailure(error.message));
        return { ok: false, error };
    }
};


//Get City
export const fetchCityRequest = () => ({ type: FETCH_CITY_REQUEST });
export const fetchCitySuccess = (data) => ({ type: FETCH_CITY_SUCCESS, payload: data });
export const fetchCityFailure = (error) => ({ type: FETCH_CITY_FAILURE, payload: error });

export const fetchCityData = (ProvinceCode = '') => async (dispatch) => {
    dispatch(fetchCityRequest());
    try {

        const response = await fetch('/assets/PhAddress/city.json');

        const res = await response.json();

        const filtered = ProvinceCode
            ? res.filter(city => city.province_code === ProvinceCode)
            : res;

        const sorted = filtered.sort((a, b) =>
            a.city_name.localeCompare(b.city_name)
        );

        dispatch(fetchCitySuccess(sorted));
        return { ok: true, data: sorted };
    } catch (error) {
        dispatch(fetchCityFailure(error.message));
        return { ok: false, error };
    }
};


//Get Barangay
export const fetchBarangayRequest = () => ({ type: FETCH_BARANGAY_REQUEST });
export const fetchBarangaySuccess = (data) => ({ type: FETCH_BARANGAY_SUCCESS, payload: data });
export const fetchBarangayFailure = (error) => ({ type: FETCH_BARANGAY_FAILURE, payload: error });

export const fetchBarangayData = (CityCode = '') => async (dispatch) => {
    dispatch(fetchBarangayRequest());
    try {

        const response = await fetch('/assets/PhAddress/barangay.json');

        const res = await response.json();

        const filtered = CityCode
            ? res.filter(city => city.city_code === CityCode)
            : res;

        const sorted = filtered.sort((a, b) =>
            a.brgy_name.localeCompare(b.brgy_name)
        );

        dispatch(fetchBarangaySuccess(sorted));
        return { ok: true, data: sorted };
    } catch (error) {
        dispatch(fetchBarangayFailure(error.message));
        return { ok: false, error };
    }
};


//Insert Student
export const fetchInsertStudentRequest = () => ({ type: FETCH_INSERTSTUDENT_REQUEST });
export const fetchInsertStudentSuccess = (data) => ({ type: FETCH_INSERTSTUDENT_SUCCESS, payload: data });
export const fetchInsertStudentFailure = (error) => ({ type: FETCH_INSERTSTUDENT_FAILURE, payload: error });

export const fetchInsertStudentData = (formData) => async (dispatch) => {
    dispatch(fetchInsertStudentRequest());
    try {
        const url = `${baseUrl}/auth/student-online-application`; // also removed the stray " at the end

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const text = await response.text();
        let res;
        try {
            res = text ? JSON.parse(text) : {};
        } catch {
            res = { success: false, message: text || "Invalid JSON response" };
        }

        if (res.success === false) {
            throw new Error(res.message || "Unknown error");
        }

        dispatch(fetchInsertStudentSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchInsertStudentFailure(error.message));
        return { ok: false, error };
    }
};


//Get old student
export const fetchOldStudentRequest = () => ({ type: FETCH_OLDSTUDENT_REQUEST });
export const fetchOldStudentSuccess = (data) => ({ type: FETCH_OLDSTUDENT_SUCCESS, payload: data });
export const fetchOldStudentFailure = (error) => ({ type: FETCH_OLDSTUDENT_FAILURE, payload: error });

export const fetchOldStudentData = () => async (dispatch) => {
    dispatch(fetchOldStudentRequest());
    try {
        const url = `${baseUrl}/auth/get-old-student`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await response.json();

        dispatch(fetchOldStudentSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchOldStudentFailure(error.message));
        return { ok: false, error };
    }
};

//Get student data
export const fetchStudentByIdRequest = () => ({ type: FETCH_STUDENTBYID_REQUEST });
export const fetchStudentByIdSuccess = (data) => ({ type: FETCH_STUDENTBYID_SUCCESS, payload: data });
export const fetchStudentByIdFailure = (error) => ({ type: FETCH_STUDENTBYID_FAILURE, payload: error });

export const fetchStudentByIdData = (StudentId = "") => async (dispatch) => {
    dispatch(fetchStudentByIdRequest());
    try {
        const url = `${baseUrl}/auth/get-student-id?StudentId=${StudentId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await response.json();

        dispatch(fetchStudentByIdSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchStudentByIdFailure(error.message));
        return { ok: false, error };
    }
};
