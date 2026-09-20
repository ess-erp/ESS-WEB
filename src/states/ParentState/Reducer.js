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

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialGeneralState = {
    returneeOldStudentState: { ...initialState },
    studentDataState: { ...initialState },
    tableState: { ...initialState },
    insertEnrollmentState: { ...initialState },
    updateStudentDataState: { ...initialState },
    tuitionFeeState: { ...initialState },
    insertOverCounterState: { ...initialState },
    studentStatusState: { ...initialState },
    transactionTypeState: { ...initialState },
    // studentOrNumber: { ...initialState },
    insertPaymentState: { ...initialState },
    parentTransactionHistoryState: { ...initialState },
    studentPendingTransactionState: { ...initialState },
    miscBreakdownState: { ...initialState },
    siSeriesState: { ...initialState },
};

const parentReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        case FETCH_RETURNEE_OLD_STUDENT_REQUEST:
            return { ...state, returneeOldStudentState: { loading: true, data: [], error: '' } };
        case FETCH_RETURNEE_OLD_STUDENT_SUCCESS:
            return { ...state, returneeOldStudentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_RETURNEE_OLD_STUDENT_FAILURE:
            return { ...state, returneeOldStudentState: { loading: false, data: [], error: action.payload } };

        //FETCH STUDENT DATA USING STUDENTBYID
        case FETCH_STUDENTBYID_REQUEST:
            return { ...state, studentDataState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENTBYID_SUCCESS:
            return { ...state, studentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENTBYID_FAILURE:
            return { ...state, studentDataState: { loading: false, data: '', error: action.payload } };

        //Update student data using STUDENTBYID
        case FETCH_UPDATE_STUDENT_FORM_REQUEST:
            return { ...state, updateStudentDataState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATE_STUDENT_FORM_SUCCESS:
            return { ...state, updateStudentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATE_STUDENT_FORM_FAILURE:
            return { ...state, updateStudentDataState: { loading: false, data: [], error: action.payload } };

        //Get List of student table
        case FETCH_LISTOFSTUDENTTABLE_REQUEST:
            return { ...state, tableState: { loading: true, data: [], error: '' } };
        case FETCH_LISTOFSTUDENTTABLE_SUCCESS:
            return { ...state, tableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LISTOFSTUDENTTABLE_FAILURE:
            return { ...state, tableState: { loading: false, data: [], error: action.payload } };

        //Insert Student Enrollment
        case FETCH_INSERT_STUDENT_ENROLLMENT_REQUEST:
            return { ...state, insertEnrollmentState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_STUDENT_ENROLLMENT_SUCCESS:
            return { ...state, insertEnrollmentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_STUDENT_ENROLLMENT_FAILURE:
            return { ...state, insertEnrollmentState: { loading: false, data: [], error: action.payload } };

        //Insert Tuition Fee
        case FETCH_LIST_OF_TUITION_FEE_REQUEST:
            return { ...state, tuitionFeeState: { loading: true, data: [], error: '' } };
        case FETCH_LIST_OF_TUITION_FEE_SUCCESS:
            return { ...state, tuitionFeeState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LIST_OF_TUITION_FEE_FAILURE:
            return { ...state, tuitionFeeState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_REQUEST:
            return { ...state, insertOverCounterState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_SUCCESS:
            return { ...state, insertOverCounterState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_OVER_THE_COUNTER_PAYMENT_FAILURE:
            return { ...state, insertOverCounterState: { loading: false, data: [], error: action.payload } };

        //Student Status
        case FETCH_STUDENT_STATUS_REQUEST:
            return { ...state, studentStatusState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENT_STATUS_SUCCESS:
            return { ...state, studentStatusState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENT_STATUS_FAILURE:
            return { ...state, studentStatusState: { loading: false, data: [], error: action.payload } };
        
        //Transaction Type
        case FETCH_PAYMENT_TRANSACTION_TYPE_REQUEST:
            return { ...state, transactionTypeState: { loading: true, data: [], error: '' } };
        case FETCH_PAYMENT_TRANSACTION_TYPE_SUCCESS:
            return { ...state, transactionTypeState: { loading: false, data: action.payload, error: '' } };
        case FETCH_PAYMENT_TRANSACTION_TYPE_FAILURE:
            return { ...state, transactionTypeState: { loading: false, data: [], error: action.payload } };

        //Or Number
        // case FETCH_STUDENT_OR_NUMBER_REQUEST:
        //     return { ...state, studentOrNumber: { loading: true, data: [], error: '' } };
        // case FETCH_STUDENT_OR_NUMBER_SUCCESS:
        //     return { ...state, studentOrNumber: { loading: false, data: action.payload, error: '' } };
        // case FETCH_STUDENT_OR_NUMBER_FAILURE:
        //     return { ...state, studentOrNumber: { loading: false, data: [], error: action.payload } };   

        //Insert Payment 
        case FETCH_INSERT_PAYMENT_REQUEST:
            return { ...state, insertPaymentState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_PAYMENT_SUCCESS:
            return { ...state, insertPaymentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_PAYMENT_FAILURE:
            return { ...state, insertPaymentState: { loading: false, data: [], error: action.payload } }; 
        
        //Transaction History 
        case FETCH_PARENT_TRANSACTION_HISTORY_REQUEST:
            return { ...state, parentTransactionHistoryState: { loading: true, data: [], error: '' } };
        case FETCH_PARENT_TRANSACTION_HISTORY_SUCCESS:
            return { ...state, parentTransactionHistoryState: { loading: false, data: action.payload, error: '' } };
        case FETCH_PARENT_TRANSACTION_HISTORY_FAILURE:
            return { ...state, parentTransactionHistoryState: { loading: false, data: [], error: action.payload } };  

        // Student Pending Transaction
        case FETCH_STUDENT_PENDING_TRANSACTION_REQUEST:
            return { ...state, studentPendingTransactionState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENT_PENDING_TRANSACTION_SUCCESS:
            return { ...state, studentPendingTransactionState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENT_PENDING_TRANSACTION_FAILURE:
            return { ...state, studentPendingTransactionState: { loading: false, data: [], error: action.payload } };

        // Miscellaneous Breakdown
        case FETCH_GET_MISC_BREAKDOWN_REQUEST:
            return { ...state, miscBreakdownState: { loading: true, data: [], error: '' } };
        case FETCH_GET_MISC_BREAKDOWN_SUCCESS:
            return { ...state, miscBreakdownState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GET_MISC_BREAKDOWN_FAILURE:
            return { ...state, miscBreakdownState: { loading: false, data: [], error: action.payload } };

        case FETCH_SI_SERIES_REQUEST:
            return { ...state, siSeriesState: { loading: true, data: [], error: '' } };
        case FETCH_SI_SERIES_SUCCESS:
            return { ...state, siSeriesState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SI_SERIES_FAILURE:
            return { ...state, siSeriesState: { loading: false, data: [], error: action.payload } };  

        default:
            return state;
    }
};

export default parentReducer;
