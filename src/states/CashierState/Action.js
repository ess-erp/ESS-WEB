import {
    FETCH_TRANSACTION_TYPE_REQUEST, FETCH_TRANSACTION_TYPE_SUCCESS, FETCH_TRANSACTION_TYPE_FAILURE,
    FETCH_STUDENT_APPLICATION_REQUEST, FETCH_STUDENT_APPLICATION_SUCCESS, FETCH_STUDENT_APPLICATION_FAILURE,
    FETCH_ORNUMBER_REQUEST, FETCH_ORNUMBER_SUCCESS, FETCH_ORNUMBER_FAILURE,
    FETCH_PRINT_RECEIPT_REQUEST, FETCH_PRINT_RECEIPT_SUCCESS, FETCH_PRINT_RECEIPT_FAILURE,
    FETCH_INSERT_SUBMIT_PAYMENT_REQUEST, FETCH_INSERT_SUBMIT_PAYMENT_SUCCESS, FETCH_INSERT_SUBMIT_PAYMENT_FAILURE,
    FETCH_GET_DAILY_BALANCE_REQUEST, FETCH_GET_DAILY_BALANCE_SUCCESS, FETCH_GET_DAILY_BALANCE_FAILURE,
    FETCH_INSERT_DAILY_BALANCE_REQUEST, FETCH_INSERT_DAILY_BALANCE_SUCCESS, FETCH_INSERT_DAILY_BALANCE_FAILURE,
    FETCH_GET_REALTIME_DAILY_BALANCE_REQUEST, FETCH_GET_REALTIME_DAILY_BALANCE_SUCCESS, FETCH_GET_REALTIME_DAILY_BALANCE_FAILURE,
    FETCH_GET_TUITION_FEE_REQUEST, FETCH_GET_TUITION_FEE_SUCCESS, FETCH_GET_TUITION_FEE_FAILURE,
    FETCH_TRANSACTION_HISTORY_REQUEST, FETCH_TRANSACTION_HISTORY_SUCCESS, FETCH_TRANSACTION_HISTORY_FAILURE,
    FETCH_STUDENT_APP_ASSESSMENT_REQUEST, FETCH_STUDENT_APP_ASSESSMENT_SUCCESS, FETCH_STUDENT_APP_ASSESSMENT_FAILURE,
    FETCH_GET_CASHIER_MISC_BREAKDOWN_REQUEST, FETCH_GET_CASHIER_MISC_BREAKDOWN_SUCCESS, FETCH_GET_CASHIER_MISC_BREAKDOWN_FAILURE,
    FETCH_CASHIER_PENDING_TRANSACTION_REQUEST, FETCH_CASHIER_PENDING_TRANSACTION_SUCCESS, FETCH_CASHIER_PENDING_TRANSACTION_FAILURE,
    FETCH_CANCEL_TRANSACTION_REQUEST, FETCH_CANCEL_TRANSACTION_SUCCESS, FETCH_CANCEL_TRANSACTION_FAILURE,
} from './ActionType';
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchTransactionTypeRequest = () => ({ type: FETCH_TRANSACTION_TYPE_REQUEST });
export const fetchTransactionTypeSuccess = (data) => ({ type: FETCH_TRANSACTION_TYPE_SUCCESS, payload: data });
export const fetchTransactionTypeFailure = (error) => ({ type: FETCH_TRANSACTION_TYPE_FAILURE, payload: error });

export const fetchTransactionTypeData = () => async (dispatch) => {
    dispatch(fetchTransactionTypeRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-transaction-type`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchTransactionTypeSuccess(res));
        return { ok: true, data: res };
    }
    catch(error){
        dispatch(fetchTransactionTypeFailure(error.message));
        return { ok: false, error };
    }
};


export const fetchStudentAppRequest = () => ({ type: FETCH_STUDENT_APPLICATION_REQUEST });
export const fetchStudentAppSuccess = (data) => ({ type: FETCH_STUDENT_APPLICATION_SUCCESS, payload: data });
export const fetchStudentAppFailure = (error) => ({ type: FETCH_STUDENT_APPLICATION_FAILURE, payload: error });

export const fetchStudentAppData = (status) => async (dispatch) => {
    dispatch(fetchStudentAppRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-student-dropdown?status=${status}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchStudentAppSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchStudentAppFailure(error.message));
        return { ok: false, error };
    }
};

// New function specifically for fetching enrolled students (status "Y")
export const fetchEnrolledStudentsData = () => async (dispatch) => {
    dispatch(fetchStudentAppRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-student-dropdown?status=Y`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        
        // Additional validation: ensure only students with status "Y" are returned
        const enrolledStudents = res.data?.filter(student => student.Status === "Y") || [];
        
        const validatedResponse = {
            ...res,
            data: enrolledStudents
        };
        
        dispatch(fetchStudentAppSuccess(validatedResponse));
        return { ok: true, data: enrolledStudents };
    }
    catch(error){
        dispatch(fetchStudentAppFailure(error.message));
        return { ok: false, error };
    }
};



export const fetchOrNumberRequest = () => ({ type: FETCH_ORNUMBER_REQUEST });
export const fetchOrNumberSuccess = (data) => ({ type: FETCH_ORNUMBER_SUCCESS, payload: data });
export const fetchOrNumberFailure = (error) => ({ type: FETCH_ORNUMBER_FAILURE, payload: error });

export const fetchOrNumberData = (userId) => async (dispatch) => {
    dispatch(fetchOrNumberRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-or-number?userId=${userId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchOrNumberSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchOrNumberFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchPrintReceiptRequest = () => ({ type: FETCH_PRINT_RECEIPT_REQUEST });
export const fetchPrintReceiptSuccess = (data) => ({ type: FETCH_PRINT_RECEIPT_SUCCESS, payload: data });
export const fetchPrintReceiptFailure = (error) => ({ type: FETCH_PRINT_RECEIPT_FAILURE, payload: error });

export const fetchPrintReceiptData = (formData) => async (dispatch) => {
    dispatch(fetchPrintReceiptRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/print-receipt`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const res = await response.json();
        dispatch(fetchPrintReceiptSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchPrintReceiptFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchInsertSubmitPaymentRequest = () => ({ type: FETCH_INSERT_SUBMIT_PAYMENT_REQUEST });
export const fetchInsertSubmitPaymentSuccess = (data) => ({ type: FETCH_INSERT_SUBMIT_PAYMENT_SUCCESS, payload: data });
export const fetchInsertSubmitPaymentFailure = (error) => ({ type: FETCH_INSERT_SUBMIT_PAYMENT_FAILURE, payload: error });

export const fetchInsertSubmitPaymentData = (formData) => async (dispatch) => {
    dispatch(fetchInsertSubmitPaymentRequest());

    try{
        const token = getToken();
        const url = `${baseUrl}/cashier/insert-payment`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        });

        const res = await response.json();
        dispatch(fetchInsertSubmitPaymentSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchInsertSubmitPaymentFailure(error.message));
        return { ok: false, error };
    }

};

export const fetchGetDailyBalanceRequest = () => ({ type: FETCH_GET_DAILY_BALANCE_REQUEST });
export const fetchGetDailyBalanceSuccess = (data) => ({ type: FETCH_GET_DAILY_BALANCE_SUCCESS, payload: data });
export const fetchGetDailyBalanceFailure = (error) => ({ type: FETCH_GET_DAILY_BALANCE_FAILURE, payload: error });

export const fetchGetDailyBalanceData = (userId) => async (dispatch) => {
    dispatch(fetchGetDailyBalanceRequest());

    try{
        const token = getToken();
        const url = `${baseUrl}/cashier/current-balance?userId=${userId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchGetDailyBalanceSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchGetDailyBalanceFailure(error.message));
        return { ok: false, error };
    }

};

export const fetchInsertDailyBalanceRequest = () => ({ type: FETCH_INSERT_DAILY_BALANCE_REQUEST });
export const fetchInsertDailyBalanceSuccess = (data) => ({ type: FETCH_INSERT_DAILY_BALANCE_SUCCESS, payload: data });
export const fetchInsertDailyBalanceFailure = (error) => ({ type: FETCH_INSERT_DAILY_BALANCE_FAILURE, payload: error });

export const fetchInsertDailyBalanceData = (userId, amount) => async (dispatch) => {
    dispatch(fetchInsertDailyBalanceRequest());

    try{
        const token = getToken();
        const url = `${baseUrl}/cashier/insert-current-balance?userId=${userId}&amount=${amount}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchInsertDailyBalanceSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchInsertDailyBalanceFailure(error.message));
        return { ok: false, error };
    }

};

export const fetchGetRealtimeDailyBalanceRequest = () => ({ type: FETCH_GET_REALTIME_DAILY_BALANCE_REQUEST });
export const fetchGetRealtimeDailyBalanceSuccess = (data) => ({ type: FETCH_GET_REALTIME_DAILY_BALANCE_SUCCESS, payload: data });
export const fetchGetRealtimeDailyBalanceFailure = (error) => ({ type: FETCH_GET_REALTIME_DAILY_BALANCE_FAILURE, payload: error });

export const fetchGetRealtimeDailyBalanceData = (userId) => async (dispatch) => {
    dispatch(fetchGetRealtimeDailyBalanceRequest());

    try{
        const token = getToken();
        const url = `${baseUrl}/cashier/get-realtime-balance?userId=${userId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchGetRealtimeDailyBalanceSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchGetRealtimeDailyBalanceFailure(error.message));
        return { ok: false, error };
    }

};


export const fetchGetTuitionFeeRequest = () => ({ type: FETCH_GET_TUITION_FEE_REQUEST });
export const fetchGetTuitionFeeSuccess = (data) => ({ type: FETCH_GET_TUITION_FEE_SUCCESS, payload: data });
export const fetchGetTuitionFeeFailure = (error) => ({ type: FETCH_GET_TUITION_FEE_FAILURE, payload: error });

export const fetchGetTuitionFeeData = (studentId,levelId) => async (dispatch) => {
    dispatch(fetchGetTuitionFeeRequest());

    try{
        const token = getToken();
        const url = `${baseUrl}/cashier/get-tuition-fee?studentId=${studentId}&levelId=${levelId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const res = await response.json();
        dispatch(fetchGetTuitionFeeSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchGetTuitionFeeFailure(error.message));
        return { ok: false, error };
    }

};

export const fetchTransactionHistoryRequest = () => ({ type: FETCH_TRANSACTION_HISTORY_REQUEST });
export const fetchTransactionHistorySuccess = (data) => ({ type: FETCH_TRANSACTION_HISTORY_SUCCESS, payload: data });
export const fetchTransactionHistoryFailure = (error) => ({ type: FETCH_TRANSACTION_HISTORY_FAILURE, payload: error });

export const fetchTransactionHistoryData = (StartDate, EndDate, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchTransactionHistoryRequest());
    try {
        const token = getToken();
        const params = new URLSearchParams({
            startDate: StartDate || '',
            endDate: EndDate || '',
            page: page,
            pageSize: pageSize,
            search: search || ''
        });
        const url = `${baseUrl}/cashier/transaction-history-table?${params}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        console.log(res);

        dispatch(fetchTransactionHistorySuccess(res));
        return { ok: true, data: res.data, totalRecords: res.totalRecords };
    }
    catch (error) {
        dispatch(fetchTransactionHistoryFailure(error.message));
        return { ok: false, error: error.message };
    };
};

export const fetchStudentAppAssessmentRequest = () => ({ type: FETCH_STUDENT_APP_ASSESSMENT_REQUEST });
export const fetchStudentAppAssessmentSuccess = (data) => ({ type: FETCH_STUDENT_APP_ASSESSMENT_SUCCESS, payload: data });
export const fetchStudentAppAssessmentFailure = (error) => ({ type: FETCH_STUDENT_APP_ASSESSMENT_FAILURE, payload: error });

export const fetchStudentAppAssessmentData = (appId) => async (dispatch) => {
    dispatch(fetchStudentAppAssessmentRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-assessment-plan?appId=${appId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        dispatch(fetchStudentAppAssessmentSuccess(res));
        return { ok: true, data: res.data };
    }
    catch(error){
        dispatch(fetchStudentAppAssessmentFailure(error.message));
        return { ok: false, error };
    }
};
export const fetchGetCashierMiscBreakdownRequest = () => ({ type: FETCH_GET_CASHIER_MISC_BREAKDOWN_REQUEST });
export const fetchGetCashierMiscBreakdownSuccess = (data) => ({ type: FETCH_GET_CASHIER_MISC_BREAKDOWN_SUCCESS, payload: data });
export const fetchGetCashierMiscBreakdownFailure = (error) => ({ type: FETCH_GET_CASHIER_MISC_BREAKDOWN_FAILURE, payload: error });

export const fetchGetCashierMiscBreakdownData = (levelId) => async (dispatch) => {
    dispatch(fetchGetCashierMiscBreakdownRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/get-misc-breakdown?levelId=${levelId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const res = await response.json();
        dispatch(fetchGetCashierMiscBreakdownSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchGetCashierMiscBreakdownFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchCashierPendingTransactionRequest = () => ({ type: FETCH_CASHIER_PENDING_TRANSACTION_REQUEST });
export const fetchCashierPendingTransactionSuccess = (data) => ({ type: FETCH_CASHIER_PENDING_TRANSACTION_SUCCESS, payload: data });
export const fetchCashierPendingTransactionFailure = (error) => ({ type: FETCH_CASHIER_PENDING_TRANSACTION_FAILURE, payload: error });

export const fetchCashierPendingTransactionData = (appId) => async (dispatch) => {
    dispatch(fetchCashierPendingTransactionRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/student-pending-transaction?appId=${appId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        const res = await response.json();
        dispatch(fetchCashierPendingTransactionSuccess(res));
        return { ok: true, data: res };
    } catch (error) {
        dispatch(fetchCashierPendingTransactionFailure(error.message));
        return { ok: false, error };
    }
};

export const fetchCancelTransactionRequest = () => ({ type: FETCH_CANCEL_TRANSACTION_REQUEST });
export const fetchCancelTransactionSuccess = (data) => ({ type: FETCH_CANCEL_TRANSACTION_SUCCESS, payload: data });
export const fetchCancelTransactionFailure = (error) => ({ type: FETCH_CANCEL_TRANSACTION_FAILURE, payload: error });

export const fetchCancelTransactionData = (transId) => async (dispatch) => {
    dispatch(fetchCancelTransactionRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/cashier/cancel-transaction`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ transId })
        });

        const res = await response.json();
        dispatch(fetchCancelTransactionSuccess(res));
        return { ok: true, data: res };
    }
    catch (error) {
        dispatch(fetchCancelTransactionFailure(error.message));
        return { ok: false, error };
    }
};
