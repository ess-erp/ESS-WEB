import {
    // COA
    FETCH_GET_COA_REQUEST, FETCH_GET_COA_SUCCESS, FETCH_GET_COA_FAILURE,
    FETCH_INSERT_COA_REQUEST, FETCH_INSERT_COA_SUCCESS, FETCH_INSERT_COA_FAILURE,
    FETCH_UPDATE_COA_REQUEST, FETCH_UPDATE_COA_SUCCESS, FETCH_UPDATE_COA_FAILURE,
    // COA Dropdowns
    FETCH_GET_COA_HEADER_REQUEST, FETCH_GET_COA_HEADER_SUCCESS, FETCH_GET_COA_HEADER_FAILURE,
    FETCH_GET_COA_GROUP_REQUEST, FETCH_GET_COA_GROUP_SUCCESS, FETCH_GET_COA_GROUP_FAILURE,
    FETCH_GET_COA_ACCOUNT_REQUEST, FETCH_GET_COA_ACCOUNT_SUCCESS, FETCH_GET_COA_ACCOUNT_FAILURE,
    FETCH_GET_COA_FLAT_REQUEST, FETCH_GET_COA_FLAT_SUCCESS, FETCH_GET_COA_FLAT_FAILURE,
    // COA Cashier
    FETCH_GET_COA_CASHIER_REQUEST, FETCH_GET_COA_CASHIER_SUCCESS, FETCH_GET_COA_CASHIER_FAILURE,
    FETCH_INSERT_COA_CASHIER_REQUEST, FETCH_INSERT_COA_CASHIER_SUCCESS, FETCH_INSERT_COA_CASHIER_FAILURE,
    // Cashier List
    FETCH_GET_CASHIER_LIST_REQUEST, FETCH_GET_CASHIER_LIST_SUCCESS, FETCH_GET_CASHIER_LIST_FAILURE,
    // Student Ledger
    FETCH_GET_STUDENT_LEDGER_REQUEST, FETCH_GET_STUDENT_LEDGER_SUCCESS, FETCH_GET_STUDENT_LEDGER_FAILURE,
    FETCH_GET_STUDENT_LEDGER_DETAIL_REQUEST, FETCH_GET_STUDENT_LEDGER_DETAIL_SUCCESS, FETCH_GET_STUDENT_LEDGER_DETAIL_FAILURE,
    FETCH_CREATE_STUDENT_LEDGER_REQUEST, FETCH_CREATE_STUDENT_LEDGER_SUCCESS, FETCH_CREATE_STUDENT_LEDGER_FAILURE,
    // Journal Entry
    FETCH_GET_JOURNAL_REQUEST, FETCH_GET_JOURNAL_SUCCESS, FETCH_GET_JOURNAL_FAILURE,
    FETCH_GET_JOURNAL_DETAIL_REQUEST, FETCH_GET_JOURNAL_DETAIL_SUCCESS, FETCH_GET_JOURNAL_DETAIL_FAILURE,
    FETCH_INSERT_JOURNAL_REQUEST, FETCH_INSERT_JOURNAL_SUCCESS, FETCH_INSERT_JOURNAL_FAILURE,
    FETCH_UPDATE_JOURNAL_REQUEST, FETCH_UPDATE_JOURNAL_SUCCESS, FETCH_UPDATE_JOURNAL_FAILURE,
    // SI Series
    FETCH_GET_SI_SERIES_REQUEST, FETCH_GET_SI_SERIES_SUCCESS, FETCH_GET_SI_SERIES_FAILURE,
    FETCH_INSERT_SI_SERIES_REQUEST, FETCH_INSERT_SI_SERIES_SUCCESS, FETCH_INSERT_SI_SERIES_FAILURE,
    // Robot Cashier
    FETCH_GET_ROBOT_CASHIER_REQUEST, FETCH_GET_ROBOT_CASHIER_SUCCESS, FETCH_GET_ROBOT_CASHIER_FAILURE,
    FETCH_INSERT_ROBOT_CASHIER_REQUEST, FETCH_INSERT_ROBOT_CASHIER_SUCCESS, FETCH_INSERT_ROBOT_CASHIER_FAILURE,
    // Cashier Transaction Journal
    FETCH_GET_CASHIER_TRANSACTIONS_REQUEST, FETCH_GET_CASHIER_TRANSACTIONS_SUCCESS, FETCH_GET_CASHIER_TRANSACTIONS_FAILURE,
    FETCH_POST_CASHIER_JOURNAL_REQUEST, FETCH_POST_CASHIER_JOURNAL_SUCCESS, FETCH_POST_CASHIER_JOURNAL_FAILURE,
} from './ActionType';

const s = { loading: false, data: [], error: '', success: false };

const initialState = {
    // COA
    getCoaState:           { ...s },
    insertCoaState:        { ...s },
    updateCoaState:        { ...s },
    // COA Dropdowns
    coaHeaderState:        { ...s },
    coaGroupState:         { ...s },
    coaAccountState:       { ...s },
    coaFlatState:          { ...s },
    // COA Cashier
    getCoaCashierState:    { ...s },
    insertCoaCashierState: { ...s },
    // Cashier List
    cashierListState:      { ...s },
    // Student Ledger
    studentLedgerState:       { ...s },
    studentLedgerDetailState: { ...s },
    createStudentLedgerState: { ...s },
    // Journal Entry
    journalState:         { ...s },
    journalDetailState:   { ...s },
    insertJournalState:   { ...s },
    updateJournalState:   { ...s },
    // SI Series
    siSeriesListState:       { ...s },
    insertSiSeriesState:     { ...s },
    // Robot Cashier
    robotCashierState:       { ...s },
    insertRobotCashierState: { ...s },
    
    // Cashier Transaction Journal
    cashierTransactionsState: { ...s },
    postCashierJournalState:  { ...s },
};

const ok  = (payload) => ({ loading: false, data: payload, error: '',           success: true  });
const err = (payload) => ({ loading: false, data: [],       error: payload,     success: false });
const req =             () => ({ loading: true,  data: [],       error: '',      success: false });

const accountingReducer = (state = initialState, action) => {
    switch (action.type) {

        // ── COA ───────────────────────────────────────────────────────────────
        case FETCH_GET_COA_REQUEST:    return { ...state, getCoaState:    req() };
        case FETCH_GET_COA_SUCCESS:    return { ...state, getCoaState:    ok(action.payload) };
        case FETCH_GET_COA_FAILURE:    return { ...state, getCoaState:    err(action.payload) };

        case FETCH_INSERT_COA_REQUEST: return { ...state, insertCoaState: req() };
        case FETCH_INSERT_COA_SUCCESS: return { ...state, insertCoaState: ok(action.payload) };
        case FETCH_INSERT_COA_FAILURE: return { ...state, insertCoaState: err(action.payload) };

        case FETCH_UPDATE_COA_REQUEST: return { ...state, updateCoaState: req() };
        case FETCH_UPDATE_COA_SUCCESS: return { ...state, updateCoaState: ok(action.payload) };
        case FETCH_UPDATE_COA_FAILURE: return { ...state, updateCoaState: err(action.payload) };

        // ── COA Dropdowns ─────────────────────────────────────────────────────
        case FETCH_GET_COA_HEADER_REQUEST:  return { ...state, coaHeaderState:  req() };
        case FETCH_GET_COA_HEADER_SUCCESS:  return { ...state, coaHeaderState:  ok(action.payload) };
        case FETCH_GET_COA_HEADER_FAILURE:  return { ...state, coaHeaderState:  err(action.payload) };

        case FETCH_GET_COA_GROUP_REQUEST:   return { ...state, coaGroupState:   req() };
        case FETCH_GET_COA_GROUP_SUCCESS:   return { ...state, coaGroupState:   ok(action.payload) };
        case FETCH_GET_COA_GROUP_FAILURE:   return { ...state, coaGroupState:   err(action.payload) };

        case FETCH_GET_COA_ACCOUNT_REQUEST: return { ...state, coaAccountState: req() };
        case FETCH_GET_COA_ACCOUNT_SUCCESS: return { ...state, coaAccountState: ok(action.payload) };
        case FETCH_GET_COA_ACCOUNT_FAILURE: return { ...state, coaAccountState: err(action.payload) };

        case FETCH_GET_COA_FLAT_REQUEST:    return { ...state, coaFlatState:    req() };
        case FETCH_GET_COA_FLAT_SUCCESS:    return { ...state, coaFlatState:    ok(action.payload) };
        case FETCH_GET_COA_FLAT_FAILURE:    return { ...state, coaFlatState:    err(action.payload) };

        // ── COA Cashier ───────────────────────────────────────────────────────
        case FETCH_GET_COA_CASHIER_REQUEST:    return { ...state, getCoaCashierState:    req() };
        case FETCH_GET_COA_CASHIER_SUCCESS:    return { ...state, getCoaCashierState:    ok(action.payload) };
        case FETCH_GET_COA_CASHIER_FAILURE:    return { ...state, getCoaCashierState:    err(action.payload) };

        case FETCH_INSERT_COA_CASHIER_REQUEST: return { ...state, insertCoaCashierState: req() };
        case FETCH_INSERT_COA_CASHIER_SUCCESS: return { ...state, insertCoaCashierState: ok(action.payload) };
        case FETCH_INSERT_COA_CASHIER_FAILURE: return { ...state, insertCoaCashierState: err(action.payload) };

        // ── Cashier List ──────────────────────────────────────────────────────
        case FETCH_GET_CASHIER_LIST_REQUEST: return { ...state, cashierListState: req() };
        case FETCH_GET_CASHIER_LIST_SUCCESS: return { ...state, cashierListState: ok(action.payload) };
        case FETCH_GET_CASHIER_LIST_FAILURE: return { ...state, cashierListState: err(action.payload) };

        // ── Student Ledger ────────────────────────────────────────────────────
        case FETCH_GET_STUDENT_LEDGER_REQUEST:        return { ...state, studentLedgerState:       req() };
        case FETCH_GET_STUDENT_LEDGER_SUCCESS:        return { ...state, studentLedgerState:       ok(action.payload) };
        case FETCH_GET_STUDENT_LEDGER_FAILURE:        return { ...state, studentLedgerState:       err(action.payload) };

        case FETCH_GET_STUDENT_LEDGER_DETAIL_REQUEST: return { ...state, studentLedgerDetailState: req() };
        case FETCH_GET_STUDENT_LEDGER_DETAIL_SUCCESS: return { ...state, studentLedgerDetailState: ok(action.payload) };
        case FETCH_GET_STUDENT_LEDGER_DETAIL_FAILURE: return { ...state, studentLedgerDetailState: err(action.payload) };

        case FETCH_CREATE_STUDENT_LEDGER_REQUEST:     return { ...state, createStudentLedgerState: req() };
        case FETCH_CREATE_STUDENT_LEDGER_SUCCESS:     return { ...state, createStudentLedgerState: ok(action.payload) };
        case FETCH_CREATE_STUDENT_LEDGER_FAILURE:     return { ...state, createStudentLedgerState: err(action.payload) };

        // ── Journal Entry ─────────────────────────────────────────────────────
        case FETCH_GET_JOURNAL_REQUEST:        return { ...state, journalState:       req() };
        case FETCH_GET_JOURNAL_SUCCESS:        return { ...state, journalState:       ok(action.payload) };
        case FETCH_GET_JOURNAL_FAILURE:        return { ...state, journalState:       err(action.payload) };

        case FETCH_GET_JOURNAL_DETAIL_REQUEST: return { ...state, journalDetailState: req() };
        case FETCH_GET_JOURNAL_DETAIL_SUCCESS: return { ...state, journalDetailState: ok(action.payload) };
        case FETCH_GET_JOURNAL_DETAIL_FAILURE: return { ...state, journalDetailState: err(action.payload) };

        case FETCH_INSERT_JOURNAL_REQUEST:     return { ...state, insertJournalState: req() };
        case FETCH_INSERT_JOURNAL_SUCCESS:     return { ...state, insertJournalState: ok(action.payload) };
        case FETCH_INSERT_JOURNAL_FAILURE:     return { ...state, insertJournalState: err(action.payload) };

        case FETCH_UPDATE_JOURNAL_REQUEST:     return { ...state, updateJournalState: req() };
        case FETCH_UPDATE_JOURNAL_SUCCESS:     return { ...state, updateJournalState: ok(action.payload) };
        case FETCH_UPDATE_JOURNAL_FAILURE:     return { ...state, updateJournalState: err(action.payload) };

        // ── SI Series ──────────────────────────────────────────────────────────
        case FETCH_GET_SI_SERIES_REQUEST:    return { ...state, siSeriesListState:   req() };
        case FETCH_GET_SI_SERIES_SUCCESS:    return { ...state, siSeriesListState:   ok(action.payload) };
        case FETCH_GET_SI_SERIES_FAILURE:    return { ...state, siSeriesListState:   err(action.payload) };

        case FETCH_INSERT_SI_SERIES_REQUEST: return { ...state, insertSiSeriesState: req() };
        case FETCH_INSERT_SI_SERIES_SUCCESS: return { ...state, insertSiSeriesState: ok(action.payload) };
        case FETCH_INSERT_SI_SERIES_FAILURE: return { ...state, insertSiSeriesState: err(action.payload) };

        // ── Robot Cashier ───────────────────────────────────────────────────────
        case FETCH_GET_ROBOT_CASHIER_REQUEST:    return { ...state, robotCashierState:       req() };
        case FETCH_GET_ROBOT_CASHIER_SUCCESS:    return { ...state, robotCashierState:       ok(action.payload) };
        case FETCH_GET_ROBOT_CASHIER_FAILURE:    return { ...state, robotCashierState:       err(action.payload) };

        case FETCH_INSERT_ROBOT_CASHIER_REQUEST: return { ...state, insertRobotCashierState: req() };
        case FETCH_INSERT_ROBOT_CASHIER_SUCCESS: return { ...state, insertRobotCashierState: ok(action.payload) };
        case FETCH_INSERT_ROBOT_CASHIER_FAILURE: return { ...state, insertRobotCashierState: err(action.payload) };
        // Cashier Transaction Journal
        case FETCH_GET_CASHIER_TRANSACTIONS_REQUEST:
            return { ...state, cashierTransactionsState: { loading: true, data: [], error: '' } };
        case FETCH_GET_CASHIER_TRANSACTIONS_SUCCESS:
            return { ...state, cashierTransactionsState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GET_CASHIER_TRANSACTIONS_FAILURE:
            return { ...state, cashierTransactionsState: { loading: false, data: [], error: action.payload } };

        case FETCH_POST_CASHIER_JOURNAL_REQUEST:
            return { ...state, postCashierJournalState: { loading: true, data: null, error: '' } };
        case FETCH_POST_CASHIER_JOURNAL_SUCCESS:
            return { ...state, postCashierJournalState: { loading: false, data: action.payload, error: '' } };
        case FETCH_POST_CASHIER_JOURNAL_FAILURE:
            return { ...state, postCashierJournalState: { loading: false, data: null, error: action.payload } };

        default:
            return state;
    }
};

export default accountingReducer;

