import {
    FETCH_GET_INVENTORY_REQUEST,
    FETCH_GET_INVENTORY_SUCCESS,
    FETCH_GET_INVENTORY_FAILURE,
    CREATE_INVENTORY_STOCK_REQUEST,
    CREATE_INVENTORY_STOCK_SUCCESS,
    CREATE_INVENTORY_STOCK_FAILURE,
    UPDATE_INVENTORY_STOCK_REQUEST,
    UPDATE_INVENTORY_STOCK_SUCCESS,
    UPDATE_INVENTORY_STOCK_FAILURE,
    DELETE_INVENTORY_STOCK_REQUEST,
    DELETE_INVENTORY_STOCK_SUCCESS,
    DELETE_INVENTORY_STOCK_FAILURE,
    FETCH_GET_REQUEST_FORM_REQUEST,
    FETCH_GET_REQUEST_FORM_SUCCESS,
    FETCH_GET_REQUEST_FORM_FAILURE,
    CREATE_REQUEST_FORM_REQUEST,
    CREATE_REQUEST_FORM_SUCCESS,
    CREATE_REQUEST_FORM_FAILURE,
    UPDATE_REQUEST_FORM_REQUEST,
    UPDATE_REQUEST_FORM_SUCCESS,
    UPDATE_REQUEST_FORM_FAILURE,
    DELETE_REQUEST_FORM_REQUEST,
    DELETE_REQUEST_FORM_SUCCESS,
    DELETE_REQUEST_FORM_FAILURE,
} from './ActionType';
import { getToken } from '../../services/tokenServices';

const baseUrl = import.meta.env.VITE_BASE_URL;

// ─── Helper ──────────────────────────────────────────────────────────────────
const authHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
});

const authHeadersMultipart = (token) => ({
    'Authorization': `Bearer ${token}`,
    // Don't set Content-Type for multipart/form-data - browser will set it automatically
});

// ============================================================================
// Inventory Stock Management
// ============================================================================

export const fetchGetInventoryRequest = () => ({ type: FETCH_GET_INVENTORY_REQUEST });
export const fetchGetInventorySuccess = (data) => ({ type: FETCH_GET_INVENTORY_SUCCESS, payload: data });
export const fetchGetInventoryFailure = (error) => ({ type: FETCH_GET_INVENTORY_FAILURE, payload: error });

export const fetchGetInventoryData = (page, pageSize, search) => async (dispatch) => {
    dispatch(fetchGetInventoryRequest());
    try {
        const token = getToken();
        const res = await fetch(
            `${baseUrl}/purchasing/get-inventory?page=${page}&pageSize=${pageSize}&search=${search ?? ''}`,
            { method: 'POST', headers: authHeaders(token) }
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

export const createInventoryStockData = (formData) => async (dispatch) => {
    dispatch(createInventoryStockRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/create-inventory-stock`, {
            method: 'POST',
            headers: authHeadersMultipart(token),
            body: formData, // FormData object with file upload
        });
        const data = await res.json();
        dispatch(createInventoryStockSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(createInventoryStockFailure(err.message));
        return { ok: false, err };
    }
};

export const updateInventoryStockRequest = () => ({ type: UPDATE_INVENTORY_STOCK_REQUEST });
export const updateInventoryStockSuccess = (data) => ({ type: UPDATE_INVENTORY_STOCK_SUCCESS, payload: data });
export const updateInventoryStockFailure = (error) => ({ type: UPDATE_INVENTORY_STOCK_FAILURE, payload: error });

export const updateInventoryStockData = (formData) => async (dispatch) => {
    dispatch(updateInventoryStockRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/update-inventory-stock`, {
            method: 'POST',
            headers: authHeadersMultipart(token),
            body: formData,
        });
        const data = await res.json();
        dispatch(updateInventoryStockSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(updateInventoryStockFailure(err.message));
        return { ok: false, err };
    }
};

export const deleteInventoryStockRequest = () => ({ type: DELETE_INVENTORY_STOCK_REQUEST });
export const deleteInventoryStockSuccess = (data) => ({ type: DELETE_INVENTORY_STOCK_SUCCESS, payload: data });
export const deleteInventoryStockFailure = (error) => ({ type: DELETE_INVENTORY_STOCK_FAILURE, payload: error });

export const deleteInventoryStockData = (stockId) => async (dispatch) => {
    dispatch(deleteInventoryStockRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/delete-inventory-stock/${stockId}`, {
            method: 'DELETE',
            headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(deleteInventoryStockSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(deleteInventoryStockFailure(err.message));
        return { ok: false, err };
    }
};

// ============================================================================
// Request Form Management
// ============================================================================

export const fetchGetRequestFormRequest = () => ({ type: FETCH_GET_REQUEST_FORM_REQUEST });
export const fetchGetRequestFormSuccess = (data) => ({ type: FETCH_GET_REQUEST_FORM_SUCCESS, payload: data });
export const fetchGetRequestFormFailure = (error) => ({ type: FETCH_GET_REQUEST_FORM_FAILURE, payload: error });

export const fetchGetRequestFormData = (page, pageSize, search, status) => async (dispatch) => {
    dispatch(fetchGetRequestFormRequest());
    try {
        const token = getToken();
        const res = await fetch(
            `${baseUrl}/purchasing/get-request-forms?page=${page}&pageSize=${pageSize}&search=${search ?? ''}&status=${status ?? ''}`,
            { method: 'POST', headers: authHeaders(token) }
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

export const createRequestFormData = (formData) => async (dispatch) => {
    dispatch(createRequestFormRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/create-request-form`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(createRequestFormSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(createRequestFormFailure(err.message));
        return { ok: false, err };
    }
};

export const updateRequestFormRequest = () => ({ type: UPDATE_REQUEST_FORM_REQUEST });
export const updateRequestFormSuccess = (data) => ({ type: UPDATE_REQUEST_FORM_SUCCESS, payload: data });
export const updateRequestFormFailure = (error) => ({ type: UPDATE_REQUEST_FORM_FAILURE, payload: error });

export const updateRequestFormData = (formData) => async (dispatch) => {
    dispatch(updateRequestFormRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/update-request-form`, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        dispatch(updateRequestFormSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(updateRequestFormFailure(err.message));
        return { ok: false, err };
    }
};

export const deleteRequestFormRequest = () => ({ type: DELETE_REQUEST_FORM_REQUEST });
export const deleteRequestFormSuccess = (data) => ({ type: DELETE_REQUEST_FORM_SUCCESS, payload: data });
export const deleteRequestFormFailure = (error) => ({ type: DELETE_REQUEST_FORM_FAILURE, payload: error });

export const deleteRequestFormData = (requestId) => async (dispatch) => {
    dispatch(deleteRequestFormRequest());
    try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/purchasing/delete-request-form/${requestId}`, {
            method: 'DELETE',
            headers: authHeaders(token),
        });
        const data = await res.json();
        dispatch(deleteRequestFormSuccess(data));
        return { ok: true, data };
    } catch (err) {
        dispatch(deleteRequestFormFailure(err.message));
        return { ok: false, err };
    }
};
