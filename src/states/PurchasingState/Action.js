import {
    // Request Form
    FETCH_GET_REQUEST_FORM_REQUEST, FETCH_GET_REQUEST_FORM_SUCCESS, FETCH_GET_REQUEST_FORM_FAILURE,
    CREATE_REQUEST_FORM_REQUEST, CREATE_REQUEST_FORM_SUCCESS, CREATE_REQUEST_FORM_FAILURE,
    // Purchase Order
    FETCH_GET_PURCHASE_ORDER_REQUEST, FETCH_GET_PURCHASE_ORDER_SUCCESS, FETCH_GET_PURCHASE_ORDER_FAILURE,
    CREATE_PURCHASE_ORDER_REQUEST, CREATE_PURCHASE_ORDER_SUCCESS, CREATE_PURCHASE_ORDER_FAILURE,
    // Inventory
    FETCH_GET_INVENTORY_REQUEST, FETCH_GET_INVENTORY_SUCCESS, FETCH_GET_INVENTORY_FAILURE,
    CREATE_INVENTORY_STOCK_REQUEST, CREATE_INVENTORY_STOCK_SUCCESS, CREATE_INVENTORY_STOCK_FAILURE,
    // Supplier
    FETCH_GET_SUPPLIER_REQUEST, FETCH_GET_SUPPLIER_SUCCESS, FETCH_GET_SUPPLIER_FAILURE,
    CREATE_SUPPLIER_REQUEST, CREATE_SUPPLIER_SUCCESS, CREATE_SUPPLIER_FAILURE,
    UPDATE_SUPPLIER_REQUEST, UPDATE_SUPPLIER_SUCCESS, UPDATE_SUPPLIER_FAILURE,
    // RF Number Series
    FETCH_GET_RF_NUMBER_SERIES_REQUEST, FETCH_GET_RF_NUMBER_SERIES_SUCCESS, FETCH_GET_RF_NUMBER_SERIES_FAILURE,
    CREATE_RF_NUMBER_SERIES_REQUEST, CREATE_RF_NUMBER_SERIES_SUCCESS, CREATE_RF_NUMBER_SERIES_FAILURE,
    UPDATE_RF_NUMBER_SERIES_REQUEST, UPDATE_RF_NUMBER_SERIES_SUCCESS, UPDATE_RF_NUMBER_SERIES_FAILURE,
} from './ActionType';
import { getToken } from '../../services/tokenServices';

const baseUrl = import.meta.env.VITE_BASE_URL;

// ─── helper ──────────────────────────────────────────────────────────────────
const authHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
});

// ============================================================================
// Request Form
// ============================================================================

export const fetchGetRequestFormRequest = () => ({ type: FETCH_GET_REQUEST_FORM_REQUEST });
export const fetchGetRequestFormSuccess = (data) => ({ type: FETCH_GET_REQUEST_FORM_SUCCESS, payload: data });
export const fetchGetRequestFormFailure = (error) => ({ type: FETCH_GET_REQUEST_FORM_FAILURE, payload: error });

export const fetchGetRequestFormData = (page, pageSize, search, status) => async (dispatch) => {
    dispatch(fetchGetRequestFormRequest());
    try {
        const token = getToken();
        const res = await fetch(
            `${baseUrl}/purchasing/get-request-forms?page=${page}&pageSize=${pageSize}&search=${search || ''}&status=${status || ''}`,
            { method: 'GET', headers: authHeaders(token) }
        );
        const data = await res.json();
        dispatch(fetchGetRequestFormSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetRequestFormFailure(err.message));
        return { ok: false, err };
    }
};

export const createRequestFormRequest = () => ({ type: CREATE_REQUEST_FORM_REQUEST });
export const createRequestFormSuccess = (data) => ({ type: CREATE_REQUEST_FORM_SUCCESS, payload: data });
export const createRequestFormFailure = (error) => ({ type: CREATE_REQUEST_FORM_FAILURE, payload: error });

export const createRequestFormData = (payload) => async (dispatch) => {
    dispatch(createRequestFormRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/create-request-form`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(createRequestFormSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(createRequestFormFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Purchase Order
// ============================================================================

export const fetchGetPurchaseOrderRequest = () => ({ type: FETCH_GET_PURCHASE_ORDER_REQUEST });
export const fetchGetPurchaseOrderSuccess = (data) => ({ type: FETCH_GET_PURCHASE_ORDER_SUCCESS, payload: data });
export const fetchGetPurchaseOrderFailure = (error) => ({ type: FETCH_GET_PURCHASE_ORDER_FAILURE, payload: error });

export const fetchGetPurchaseOrderData = (page, pageSize, search, status) => async (dispatch) => {
    dispatch(fetchGetPurchaseOrderRequest());
    try {
        const token = getToken();
        const res = await fetch(
            `${baseUrl}/purchasing/get-purchase-orders?page=${page}&pageSize=${pageSize}&search=${search || ''}&status=${status || ''}`,
            { method: 'GET', headers: authHeaders(token) }
        );
        const data = await res.json();
        dispatch(fetchGetPurchaseOrderSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetPurchaseOrderFailure(err.message));
        return { ok: false, err };
    }
};

export const createPurchaseOrderRequest = () => ({ type: CREATE_PURCHASE_ORDER_REQUEST });
export const createPurchaseOrderSuccess = (data) => ({ type: CREATE_PURCHASE_ORDER_SUCCESS, payload: data });
export const createPurchaseOrderFailure = (error) => ({ type: CREATE_PURCHASE_ORDER_FAILURE, payload: error });

export const createPurchaseOrderData = (payload) => async (dispatch) => {
    dispatch(createPurchaseOrderRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/create-purchase-order`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(createPurchaseOrderSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(createPurchaseOrderFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Inventory
// ============================================================================

export const fetchGetInventoryRequest = () => ({ type: FETCH_GET_INVENTORY_REQUEST });
export const fetchGetInventorySuccess = (data) => ({ type: FETCH_GET_INVENTORY_SUCCESS, payload: data });
export const fetchGetInventoryFailure = (error) => ({ type: FETCH_GET_INVENTORY_FAILURE, payload: error });

export const fetchGetInventoryData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetInventoryRequest());
    try {
        const token = getToken();
        const res = await fetch(
            `${baseUrl}/purchasing/get-inventory?page=${page}&pageSize=${pageSize}&search=${search || ''}`,
            { method: 'GET', headers: authHeaders(token) }
        );
        const data = await res.json();
        dispatch(fetchGetInventorySuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetInventoryFailure(err.message));
        return { ok: false, err };
    }
};

export const createInventoryStockRequest = () => ({ type: CREATE_INVENTORY_STOCK_REQUEST });
export const createInventoryStockSuccess = (data) => ({ type: CREATE_INVENTORY_STOCK_SUCCESS, payload: data });
export const createInventoryStockFailure = (error) => ({ type: CREATE_INVENTORY_STOCK_FAILURE, payload: error });

export const createInventoryStockData = (payload) => async (dispatch) => {
    dispatch(createInventoryStockRequest());
    try {
        const token = getToken();
        // Note: payload is FormData for file upload
        const res = await fetch(`${baseUrl}/purchasing/create-inventory-stock`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Do NOT set Content-Type for FormData - browser will set it with boundary
            },
            body: payload,
        });
        const data = await res.json();
        dispatch(createInventoryStockSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(createInventoryStockFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Supplier
// ============================================================================

export const fetchGetSupplierRequest = () => ({ type: FETCH_GET_SUPPLIER_REQUEST });
export const fetchGetSupplierSuccess = (data) => ({ type: FETCH_GET_SUPPLIER_SUCCESS, payload: data });
export const fetchGetSupplierFailure = (error) => ({ type: FETCH_GET_SUPPLIER_FAILURE, payload: error });

export const fetchGetSupplierData = (page, pageSize, search, status) => async (dispatch) => {
    dispatch(fetchGetSupplierRequest());
    try {
        const token = getToken();
        const res = await fetch(
            `${baseUrl}/purchasing/get-suppliers?page=${page}&pageSize=${pageSize}&search=${search || ''}&status=${status || ''}`,
            { method: 'GET', headers: authHeaders(token) }
        );
        const data = await res.json();
        dispatch(fetchGetSupplierSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetSupplierFailure(err.message));
        return { ok: false, err };
    }
};

export const createSupplierRequest = () => ({ type: CREATE_SUPPLIER_REQUEST });
export const createSupplierSuccess = (data) => ({ type: CREATE_SUPPLIER_SUCCESS, payload: data });
export const createSupplierFailure = (error) => ({ type: CREATE_SUPPLIER_FAILURE, payload: error });

export const createSupplierData = (payload) => async (dispatch) => {
    dispatch(createSupplierRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/create-supplier`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(createSupplierSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(createSupplierFailure(err.message));
        return { ok: false, err };
    }
};

export const updateSupplierRequest = () => ({ type: UPDATE_SUPPLIER_REQUEST });
export const updateSupplierSuccess = (data) => ({ type: UPDATE_SUPPLIER_SUCCESS, payload: data });
export const updateSupplierFailure = (error) => ({ type: UPDATE_SUPPLIER_FAILURE, payload: error });

export const updateSupplierData = (payload) => async (dispatch) => {
    dispatch(updateSupplierRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/update-supplier`, {
            method: 'PUT',
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(updateSupplierSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(updateSupplierFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// RF Number Series
// ============================================================================

export const fetchGetRfNumberSeriesRequest = () => ({ type: FETCH_GET_RF_NUMBER_SERIES_REQUEST });
export const fetchGetRfNumberSeriesSuccess = (data) => ({ type: FETCH_GET_RF_NUMBER_SERIES_SUCCESS, payload: data });
export const fetchGetRfNumberSeriesFailure = (error) => ({ type: FETCH_GET_RF_NUMBER_SERIES_FAILURE, payload: error });

export const fetchGetRfNumberSeriesData = (page, pageSize, search, status) => async (dispatch) => {
    dispatch(fetchGetRfNumberSeriesRequest());
    try {
        const token = getToken();
        const res = await fetch(
            `${baseUrl}/purchasing/get-rf-number-series?page=${page}&pageSize=${pageSize}&search=${search || ''}&status=${status || ''}`,
            { method: 'GET', headers: authHeaders(token) }
        );
        const data = await res.json();
        dispatch(fetchGetRfNumberSeriesSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(fetchGetRfNumberSeriesFailure(err.message));
        return { ok: false, err };
    }
};

export const createRfNumberSeriesRequest = () => ({ type: CREATE_RF_NUMBER_SERIES_REQUEST });
export const createRfNumberSeriesSuccess = (data) => ({ type: CREATE_RF_NUMBER_SERIES_SUCCESS, payload: data });
export const createRfNumberSeriesFailure = (error) => ({ type: CREATE_RF_NUMBER_SERIES_FAILURE, payload: error });

export const createRfNumberSeriesData = (payload) => async (dispatch) => {
    dispatch(createRfNumberSeriesRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/create-rf-number-series`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(createRfNumberSeriesSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(createRfNumberSeriesFailure(err.message));
        return { ok: false, err };
    }
};

export const updateRfNumberSeriesRequest = () => ({ type: UPDATE_RF_NUMBER_SERIES_REQUEST });
export const updateRfNumberSeriesSuccess = (data) => ({ type: UPDATE_RF_NUMBER_SERIES_SUCCESS, payload: data });
export const updateRfNumberSeriesFailure = (error) => ({ type: UPDATE_RF_NUMBER_SERIES_FAILURE, payload: error });

export const updateRfNumberSeriesData = (payload) => async (dispatch) => {
    dispatch(updateRfNumberSeriesRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/update-rf-number-series`, {
            method: 'PUT',
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        dispatch(updateRfNumberSeriesSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(updateRfNumberSeriesFailure(err.message));
        return { ok: false, err };
    }
};
