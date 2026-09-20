import {
    FETCH_RETURNEE_OLD_STUDENT_REQUEST, FETCH_RETURNEE_OLD_STUDENT_SUCCESS, FETCH_RETURNEE_OLD_STUDENT_FAILURE,
    FETCH_STUDENTBYID_REQUEST, FETCH_STUDENTBYID_SUCCESS, FETCH_STUDENTBYID_FAILURE,
    FETCH_UPDATE_STUDENT_FORM_REQUEST, FETCH_UPDATE_STUDENT_FORM_SUCCESS, FETCH_UPDATE_STUDENT_FORM_FAILURE,
    FETCH_LISTOFSTUDENTTABLE_REQUEST, FETCH_LISTOFSTUDENTTABLE_SUCCESS, FETCH_LISTOFSTUDENTTABLE_FAILURE,
    FETCH_INSERT_STUDENT_ENROLLMENT_REQUEST, FETCH_INSERT_STUDENT_ENROLLMENT_SUCCESS, FETCH_INSERT_STUDENT_ENROLLMENT_FAILURE,
    FETCH_LIST_OF_TUITION_FEE_REQUEST, FETCH_LIST_OF_TUITION_FEE_SUCCESS, FETCH_LIST_OF_TUITION_FEE_FAILURE,
    FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_REQUEST, FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_SUCCESS, FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_FAILURE,
    FETCH_STUDENT_STATUS_REQUEST, FETCH_STUDENT_STATUS_SUCCESS, FETCH_STUDENT_STATUS_FAILURE,
    FETCH_PAYMENT_TRANSACTION_TYPE_REQUEST, FETCH_PAYMENT_TRANSACTION_TYPE_SUCCESS, FETCH_PAYMENT_TRANSACTION_TYPE_FAILURE,
    // FETCH_STUDENT_OR_NUMBER_REQUEST, FETCH_STUDENT_OR_NUMBER_SUCCESS, FETCH_STUDENT_OR_NUMBER_FAILURE,
    FETCH_INSERT_PAYMENT_REQUEST, FETCH_INSERT_PAYMENT_SUCCESS, FETCH_INSERT_PAYMENT_FAILURE,
    FETCH_PARENT_TRANSACTION_HISTORY_REQUEST, FETCH_PARENT_TRANSACTION_HISTORY_SUCCESS,FETCH_PARENT_TRANSACTION_HISTORY_FAILURE,
    FETCH_STUDENT_PENDING_TRANSACTION_REQUEST, FETCH_STUDENT_PENDING_TRANSACTION_SUCCESS, FETCH_STUDENT_PENDING_TRANSACTION_FAILURE,
    FETCH_GET_MISC_BREAKDOWN_REQUEST, FETCH_GET_MISC_BREAKDOWN_SUCCESS, FETCH_GET_MISC_BREAKDOWN_FAILURE,
    FETCH_SI_SERIES_REQUEST, FETCH_SI_SERIES_SUCCESS, FETCH_SI_SERIES_FAILURE,
} from "./ActionType";

import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchReturneeOldStudentRequest = () => ({ type: FETCH_RETURNEE_OLD_STUDENT_REQUEST });
export const fetchReturneeOldStudentSuccess = (data) => ({ type: FETCH_RETURNEE_OLD_STUDENT_SUCCESS, payload: data });
export const fetchReturneeOldStudentFailure = (error) => ({ type: FETCH_RETURNEE_OLD_STUDENT_FAILURE, payload: error });

export const fetchReturneeOldStudentData = (userId, status) => async (dispatch) => {
    dispatch(fetchReturneeOldStudentRequest());

    try {
        const token = getToken();
        const url = `${baseUrl}/parent/returnee-old-student?userId=${userId}&status=${status}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();

        dispatch(fetchReturneeOldStudentSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchReturneeOldStudentFailure(error.message));
        return { ok: false, error };
    }
};


// STUDENT BY ID
export const fetchStudentByIdRequest = () => ({ type: FETCH_STUDENTBYID_REQUEST });
export const fetchStudentByIdSuccess = (data) => ({ type: FETCH_STUDENTBYID_SUCCESS, payload: data });
export const fetchStudentByIdFailure = (error) => ({ type: FETCH_STUDENTBYID_FAILURE, payload: error });

export const fetchStudentByIdData = (studentId) => async (dispatch) => {
    dispatch(fetchStudentByIdRequest());

    try {
        const token = getToken();
        const url = `${baseUrl}/parent/list-of-studentId?StudentId=${studentId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchStudentByIdSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchStudentByIdFailure(error.message));
        return { ok: false, error };
    }
};


// UPDATE STUDENT FORM
export const fetchUpdateStudentFormRequest = () => ({ type: FETCH_UPDATE_STUDENT_FORM_REQUEST });
export const fetchUpdateStudentFormSuccess = (data) => ({ type: FETCH_UPDATE_STUDENT_FORM_SUCCESS, payload: data });
export const fetchUpdateStudentFormFailure = (error) => ({ type: FETCH_UPDATE_STUDENT_FORM_FAILURE, payload: error });

export const fetchUpdateStudentFormData = (formData) => async (dispatch) => {
    dispatch(fetchUpdateStudentFormRequest());

    try {
        const token = getToken();
        const url = `${baseUrl}/parent/update-student-data-form`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();

        dispatch(fetchUpdateStudentFormSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchUpdateStudentFormFailure(error.message));
        return { ok: false, error };
    }
};


// LIST OF STUDENT TABLE
export const fetchListOfStudentTableRequest = () => ({ type: FETCH_LISTOFSTUDENTTABLE_REQUEST });
export const fetchListOfStudentTableSuccess = (data) => ({ type: FETCH_LISTOFSTUDENTTABLE_SUCCESS, payload: data });
export const fetchListOfStudentTableFailure = (error) => ({ type: FETCH_LISTOFSTUDENTTABLE_FAILURE, payload: error });

export const fetchListOfStudentTableData = (userId, type, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchListOfStudentTableRequest());

    try {
        const token = getToken();
        const url = `${baseUrl}/parent/list-of-studenttable?userId=${userId}&type=${type}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchListOfStudentTableSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchListOfStudentTableFailure(error));
        return { ok: false, error };
    }
};


// INSERT STUDENT ENROLLMENT
export const fetchInsertStudentEnrollmentRequest = () => ({ type: FETCH_INSERT_STUDENT_ENROLLMENT_REQUEST });
export const fetchInsertStudentEnrollmentSuccess = (data) => ({ type: FETCH_INSERT_STUDENT_ENROLLMENT_SUCCESS, payload: data });
export const fetchInsertStudentEnrollmentFailure = (error) => ({ type: FETCH_INSERT_STUDENT_ENROLLMENT_FAILURE, payload: error });

export const fetchInsertStudentEnrollmentData = (formData) => async (dispatch) => {
    dispatch(fetchInsertStudentEnrollmentRequest());

    try {
        const token = getToken();
        const url = `${baseUrl}/parent/insert-student-enrollment`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        console.log(response);

        const res = await response.json();

        dispatch(fetchInsertStudentEnrollmentSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchInsertStudentEnrollmentFailure(error.message));
        return { ok: false, error };
    }
};


// TUITION FEE
export const fetchListOfTuitionFeeRequest = () => ({ type: FETCH_LIST_OF_TUITION_FEE_REQUEST });
export const fetchListOfTuitionFeeSuccess = (data) => ({ type: FETCH_LIST_OF_TUITION_FEE_SUCCESS, payload: data });
export const fetchListOfTuitionFeeFailure = (error) => ({ type: FETCH_LIST_OF_TUITION_FEE_FAILURE, payload: error });

export const fetchListOfTuitionFeeData = (levelId, page, pageSize) => async (dispatch) => {
    dispatch(fetchListOfTuitionFeeRequest());

    try {
        const token = getToken();
        const url = `${baseUrl}/parent/list-of-tuition-fee?levelId=${levelId}&page=${page}&pageSize=${pageSize}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchListOfTuitionFeeSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchListOfTuitionFeeFailure(error));
        return { ok: false, error };
    }
};


// INSERT OVER THE COUNTER PAYMENT
export const fetchInsertOverTheCounterPaymentRequest = () => ({ type: FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_REQUEST });
export const fetchInsertOverTheCounterPaymentSuccess = (data) => ({ type: FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_SUCCESS, payload: data });
export const fetchInsertOverTheCounterPaymentFailure = (error) => ({ type: FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_FAILURE, payload: error });

export const fetchInsertOverTheCounterPaymentData = (payload) => async (dispatch) => {
    dispatch(fetchInsertOverTheCounterPaymentRequest());

    try {
        const token = getToken();
        const url = `${baseUrl}/parent/insert-over-the-counter-payment`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchInsertOverTheCounterPaymentSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchInsertOverTheCounterPaymentFailure(error));
        return { ok: false, error };
    }
};


// STUDENT STATUS
export const fetchStudentStatusRequest = () => ({ type: FETCH_STUDENT_STATUS_REQUEST });
export const fetchStudentStatusSuccess = (data) => ({ type: FETCH_STUDENT_STATUS_SUCCESS, payload: data });
export const fetchStudentStatusFailure = (error) => ({ type: FETCH_STUDENT_STATUS_FAILURE, payload: error });

export const fetchStudentStatusData = (status) => async (dispatch) => {
    dispatch(fetchStudentStatusRequest());

    try {
        const token = getToken();
        const url = `${baseUrl}/parent/student-status?status=${status}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchStudentStatusSuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchStudentStatusFailure(error));
        return { ok: false, error };
    }
};


// PAYMENT TRANSACTION TYPE
export const fetchPaymentTransactionTypeRequest = () => ({ type: FETCH_PAYMENT_TRANSACTION_TYPE_REQUEST });
export const fetchPaymentTransactionTypeSuccess = (data) => ({ type: FETCH_PAYMENT_TRANSACTION_TYPE_SUCCESS, payload: data });
export const fetchPaymentTransactionTypeFailure = (error) => ({ type: FETCH_PAYMENT_TRANSACTION_TYPE_FAILURE, payload: error });

export const fetchPaymentTransactionTypeData = () => async (dispatch) => {
    dispatch(fetchPaymentTransactionTypeRequest());

    try {
        const token = getToken();
        const url = `${baseUrl}/parent/get-payment-transaction-type`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();

        dispatch(fetchPaymentTransactionTypeSuccess(res));
        return { ok: true, data: res.data };
    }
    catch (error) {
        dispatch(fetchPaymentTransactionTypeFailure(error.message));
        return { ok: false, error };
    }
};


// // STUDENT OR NUMBER
// export const fetchStudentOrNumberRequest = () => ({ type: FETCH_STUDENT_OR_NUMBER_REQUEST });
// export const fetchStudentOrNumberSuccess = (data) => ({ type: FETCH_STUDENT_OR_NUMBER_SUCCESS, payload: data });
// export const fetchStudentOrNumberFailure = (error) => ({ type: FETCH_STUDENT_OR_NUMBER_FAILURE, payload: error });
 
// export const fetchStudentOrNumberData = (userId) => async (dispatch) => {
//     dispatch(fetchStudentOrNumberRequest());
    
//     try {
//         const token = getToken();
//         const url = `${baseUrl}/parent/student-or-number?userId=${userId}`;
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         });
//         const res = await response.json();

//         dispatch(fetchStudentOrNumberSuccess(res));
//         return { ok: true, data: res };
//     } catch (error) {
//         dispatch(fetchStudentOrNumberFailure(error.message));
//         return { ok: false, error };
//     }
// };


// INSERT PAYMENT
export const fetchInsertPaymentRequest = () => ({ type: FETCH_INSERT_PAYMENT_REQUEST });
export const fetchInsertPaymentSuccess = (data) => ({ type: FETCH_INSERT_PAYMENT_SUCCESS, payload: data });
export const fetchInsertPaymentFailure = (error) => ({ type: FETCH_INSERT_PAYMENT_FAILURE, payload: error });
 
export const fetchInsertPaymentData = (formData) => async (dispatch) => {
    dispatch(fetchInsertPaymentRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/parent/parent-insert-payment`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData),
        });
        const res = await response.json();
        dispatch(fetchInsertPaymentSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchInsertPaymentFailure(error.message));
        return { ok: false, error };
    }
};

//Payment Transaction History
export const fetchParentTransactionHistoryRequest = () => ({ type: FETCH_PARENT_TRANSACTION_HISTORY_REQUEST });
export const fetchParentTransactionHistorySuccess = (data) => ({ type: FETCH_PARENT_TRANSACTION_HISTORY_SUCCESS, payload: data });
export const fetchParentTransactionHistoryFailure = (error) => ({ type: FETCH_PARENT_TRANSACTION_HISTORY_FAILURE, payload: error });

export const fetchParentTransactionHistoryData = (StartDate, EndDate, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchParentTransactionHistoryRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/parent/parent-transaction-history-table?startDate=${StartDate}&endDate=${EndDate}&page=${page}&pageSize=${pageSize}&search=${search}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        console.log(res);

        dispatch(fetchParentTransactionHistorySuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchParentTransactionHistoryFailure(error));
        return { ok: false, error };
    };
};

// Student Pending Transaction
export const fetchStudentPendingTransactionRequest = () => ({ type: FETCH_STUDENT_PENDING_TRANSACTION_REQUEST });
export const fetchStudentPendingTransactionSuccess = (data) => ({ type: FETCH_STUDENT_PENDING_TRANSACTION_SUCCESS, payload: data });
export const fetchStudentPendingTransactionFailure = (error) => ({ type: FETCH_STUDENT_PENDING_TRANSACTION_FAILURE, payload: error });

export const fetchStudentPendingTransactionData = (appId) => async (dispatch) => {
    dispatch(fetchStudentPendingTransactionRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/parent/student-pending-transaction?appId=${appId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const res = await response.json();
        dispatch(fetchStudentPendingTransactionSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchStudentPendingTransactionFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchSISeriesRequest = () => ({ type: FETCH_SI_SERIES_REQUEST });
export const fetchSISeriesSuccess = (data) => ({ type: FETCH_SI_SERIES_SUCCESS, payload: data });
export const fetchSISeriesFailure = (error) => ({ type: FETCH_SI_SERIES_FAILURE, payload: error });

export const fetchSISeriesData = (userId) => async (dispatch) => {
    dispatch(fetchSISeriesRequest());
     try {
        const token = getToken();
        const url = `${baseUrl}/parent/get-si-series?userId=${userId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const res = await response.json();
        dispatch(fetchSISeriesSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchSISeriesFailure(error.message));
        return { ok: false, error };
    }
};
// Miscellaneous Breakdown
export const fetchGetMiscBreakdownRequest = () => ({ type: FETCH_GET_MISC_BREAKDOWN_REQUEST });
export const fetchGetMiscBreakdownSuccess = (data) => ({ type: FETCH_GET_MISC_BREAKDOWN_SUCCESS, payload: data });
export const fetchGetMiscBreakdownFailure = (error) => ({ type: FETCH_GET_MISC_BREAKDOWN_FAILURE, payload: error });

export const fetchGetMiscBreakdownData = (levelId) => async (dispatch) => {
    dispatch(fetchGetMiscBreakdownRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/parent/get-misc-breakdown?levelId=${levelId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const res = await response.json();
        dispatch(fetchGetMiscBreakdownSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchGetMiscBreakdownFailure(error.message));
        return { ok: false, error };
    }
};
