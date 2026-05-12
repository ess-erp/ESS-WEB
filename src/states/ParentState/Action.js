import {
  FETCH_RETURNEE_OLD_STUDENT_REQUEST,
  FETCH_RETURNEE_OLD_STUDENT_SUCCESS,
  FETCH_RETURNEE_OLD_STUDENT_FAILURE,
  FETCH_STUDENTBYID_REQUEST,
  FETCH_STUDENTBYID_SUCCESS,
  FETCH_STUDENTBYID_FAILURE,
  FETCH_UPDATE_STUDENT_FORM_REQUEST,
  FETCH_UPDATE_STUDENT_FORM_SUCCESS,
  FETCH_UPDATE_STUDENT_FORM_FAILURE,
  FETCH_LISTOFSTUDENTTABLE_REQUEST,
  FETCH_LISTOFSTUDENTTABLE_SUCCESS,
  FETCH_LISTOFSTUDENTTABLE_FAILURE,
  FETCH_INSERT_STUDENT_ENROLLMENT_REQUEST,
  FETCH_INSERT_STUDENT_ENROLLMENT_SUCCESS,
  FETCH_INSERT_STUDENT_ENROLLMENT_FAILURE,
  FETCH_LIST_OF_TUITION_FEE_REQUEST,
  FETCH_LIST_OF_TUITION_FEE_SUCCESS,
  FETCH_LIST_OF_TUITION_FEE_FAILURE,
  FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_REQUEST,
  FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_SUCCESS,
  FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_FAILURE,
} from "./ActionType";
import { getToken } from "../../services/tokenServices";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchReturneeOldStudentRequest = () => ({
  type: FETCH_RETURNEE_OLD_STUDENT_REQUEST,
});
export const fetchReturneeOldStudentSuccess = (data) => ({
  type: FETCH_RETURNEE_OLD_STUDENT_SUCCESS,
  payload: data,
});
export const fetchReturneeOldStudentFailure = (error) => ({
  type: FETCH_RETURNEE_OLD_STUDENT_FAILURE,
  payload: error,
});

export const fetchReturneeOldStudentData =
  (userId, status) => async (dispatch) => {
    dispatch(fetchReturneeOldStudentRequest());
    try {
      const token = getToken();
      const url = `${baseUrl}/parent/returnee-old-student?userId=${userId}&status=${status}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      dispatch(fetchReturneeOldStudentSuccess(res));
      return { ok: true, data: res.data };
    } catch (error) {
      dispatch(fetchReturneeOldStudentFailure(error.message));
      return { ok: false, error };
    }
  };

//List of student Form (STUDENTBYID)
export const fetchStudentByIdRequest = () => ({
  type: FETCH_STUDENTBYID_REQUEST,
});
export const fetchStudentByIdSuccess = (data) => ({
  type: FETCH_STUDENTBYID_SUCCESS,
  payload: data,
});
export const fetchStudentByIdFailure = (error) => ({
  type: FETCH_STUDENTBYID_FAILURE,
  payload: error,
});

export const fetchStudentByIdData = (studentId) => async (dispatch) => {
  dispatch(fetchStudentByIdRequest());
  try {
    const token = getToken();
    const url = `${baseUrl}/parent/list-of-studentId?StudentId=${studentId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await response.json();
    console.log(res);

    dispatch(fetchStudentByIdSuccess(res));
    return { ok: true, data: res };
  } catch (error) {
    dispatch(fetchStudentByIdFailure(error.message));
    return { ok: false, error };
  }
};

//Update List of student Form (STUDENTBYID)
export const fetchUpdateStudentFormRequest = () => ({
  type: FETCH_UPDATE_STUDENT_FORM_REQUEST,
});
export const fetchUpdateStudentFormSuccess = (data) => ({
  type: FETCH_UPDATE_STUDENT_FORM_SUCCESS,
  payload: data,
});
export const fetchUpdateStudentFormFailure = (error) => ({
  type: FETCH_UPDATE_STUDENT_FORM_FAILURE,
  payload: error,
});

export const fetchUpdateStudentFormData = (formData) => async (dispatch) => {
  dispatch(fetchUpdateStudentFormRequest());
  try {
    const token = getToken();
    const url = `${baseUrl}/parent/update-student-data-form`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const res = await response.json();

    dispatch(fetchUpdateStudentFormSuccess(res));
    return { ok: true, data: res };
  } catch (error) {
    dispatch(fetchUpdateStudentFormFailure(error.message));
    return { ok: false, error };
  }
};

//List of Student Table
export const fetchListOfStudentTableRequest = () => ({
  type: FETCH_LISTOFSTUDENTTABLE_REQUEST,
});
export const fetchListOfStudentTableSuccess = (data) => ({
  type: FETCH_LISTOFSTUDENTTABLE_SUCCESS,
  payload: data,
});
export const fetchListOfStudentTableFailure = (error) => ({
  type: FETCH_LISTOFSTUDENTTABLE_FAILURE,
  payload: error,
});

export const fetchListOfStudentTableData =
  (userId, type, page, pageSize, search) => async (dispatch) => {
    dispatch(fetchListOfStudentTableRequest());
    try {
      const token = getToken();
      const url = `${baseUrl}/parent/list-of-studenttable?userId=${userId}&type=${type}&page=${page}&pageSize=${pageSize}&search=${search}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();
      console.log(res);

      dispatch(fetchListOfStudentTableSuccess(res));
      return { ok: true, data: res.data, totalRecords: res.totalRecords };
    } catch (error) {
      dispatch(fetchListOfStudentTableFailure(error));
      return { ok: false, error };
    }
  };

//fETCH INSERT STUDENT ENROLLMENT
export const fetchInsertStudentEnrollmentRequest = () => ({
  type: FETCH_INSERT_STUDENT_ENROLLMENT_REQUEST,
});
export const fetchInsertStudentEnrollmentSuccess = (data) => ({
  type: FETCH_INSERT_STUDENT_ENROLLMENT_SUCCESS,
  payload: data,
});
export const fetchInsertStudentEnrollmentFailure = (error) => ({
  type: FETCH_INSERT_STUDENT_ENROLLMENT_FAILURE,
  payload: error,
});

export const fetchInsertStudentEnrollmentData =
  (formData) => async (dispatch) => {
    dispatch(fetchInsertStudentEnrollmentRequest());
    try {
      const token = getToken();
      const url = `${baseUrl}/parent/insert-student-enrollment`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      const res = await response.json();

      dispatch(fetchInsertStudentEnrollmentSuccess(res));
      return { ok: true, data: res.data };
    } catch (error) {
      dispatch(fetchInsertStudentEnrollmentFailure(error.message));
      return { ok: false, error };
    }
  };

//fETCH TUITION FEE
export const fetchListOfTuitionFeeRequest = () => ({
  type: FETCH_LIST_OF_TUITION_FEE_REQUEST,
});
export const fetchListOfTuitionFeeSuccess = (data) => ({
  type: FETCH_LIST_OF_TUITION_FEE_SUCCESS,
  payload: data,
});
export const fetchListOfTuitionFeeFailure = (error) => ({
  type: FETCH_LIST_OF_TUITION_FEE_FAILURE,
  payload: error,
});

export const fetchListOfTuitionFeeData = (levelId, page, pageSize) => async (dispatch) => {
  dispatch(fetchListOfTuitionFeeRequest());
  try {
    const token = getToken();
    const url = `${baseUrl}/parent/list-of-tuition-fee?levelId=${levelId}&page=${page}&pageSize=${pageSize}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await response.json();
    console.log(res);

    dispatch(fetchListOfTuitionFeeSuccess(res));
    return { ok: true, data: res.data, totalRecords: res.totalRecords };
  } catch (error) {
    dispatch(fetchListOfTuitionFeeFailure(error));
    return { ok: false, error };
  }
};


//INSERT OVER THE COUNTER FROM PENDING LIST OF STUDENT
export const fetchInsertOverTheCounterPaymentRequest = () => ({
  type: FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_REQUEST,
});
export const fetchInsertOverTheCounterPaymentSuccess = (data) => ({
  type: FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_SUCCESS,
  payload: data,
});
export const fetchInsertOverTheCounterPaymentFailure = (error) => ({
  type: FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_FAILURE,
  payload: error,
});

export const fetchInsertOverTheCounterPaymentData = (payload) => async (dispatch) => {
  dispatch(fetchInsertOverTheCounterPaymentRequest());
  try {
    const token = getToken();
    const url = `${baseUrl}/parent/insert-over-the-counter-payment`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
    console.log(res);

    dispatch(fetchInsertOverTheCounterPaymentSuccess(res));
    return { ok: true, data: res.data, totalRecords: res.totalRecords };
  } catch (error) {
    dispatch(fetchInsertOverTheCounterPaymentFailure(error));
    return { ok: false, error };
  }
};
