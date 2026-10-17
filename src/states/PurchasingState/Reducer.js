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

const s = { loading: false, data: [], error: '', success: false };

const initialState = {
    // Inventory Stock Management
    inventoryState: { ...s },
    createInventoryStockState: { ...s },
    updateInventoryStockState: { ...s },
    deleteInventoryStockState: { ...s },
    // Request Form Management
    requestFormState: { ...s },
    createRequestFormState: { ...s },
    updateRequestFormState: { ...s },
    deleteRequestFormState: { ...s },
};

const ok = (payload) => ({ loading: false, data: payload, error: '', success: true });
const err = (payload) => ({ loading: false, data: [], error: payload, success: false });
const req = () => ({ loading: true, data: [], error: '', success: false });

const purchasingReducer = (state = initialState, action) => {
    switch (action.type) {
        // ── Inventory Stock Management ────────────────────────────────────────
        case FETCH_GET_INVENTORY_REQUEST:
            return { ...state, inventoryState: req() };
        case FETCH_GET_INVENTORY_SUCCESS:
            return { ...state, inventoryState: ok(action.payload) };
        case FETCH_GET_INVENTORY_FAILURE:
            return { ...state, inventoryState: err(action.payload) };

        case CREATE_INVENTORY_STOCK_REQUEST:
            return { ...state, createInventoryStockState: req() };
        case CREATE_INVENTORY_STOCK_SUCCESS:
            return { ...state, createInventoryStockState: ok(action.payload) };
        case CREATE_INVENTORY_STOCK_FAILURE:
            return { ...state, createInventoryStockState: err(action.payload) };

        case UPDATE_INVENTORY_STOCK_REQUEST:
            return { ...state, updateInventoryStockState: req() };
        case UPDATE_INVENTORY_STOCK_SUCCESS:
            return { ...state, updateInventoryStockState: ok(action.payload) };
        case UPDATE_INVENTORY_STOCK_FAILURE:
            return { ...state, updateInventoryStockState: err(action.payload) };

        case DELETE_INVENTORY_STOCK_REQUEST:
            return { ...state, deleteInventoryStockState: req() };
        case DELETE_INVENTORY_STOCK_SUCCESS:
            return { ...state, deleteInventoryStockState: ok(action.payload) };
        case DELETE_INVENTORY_STOCK_FAILURE:
            return { ...state, deleteInventoryStockState: err(action.payload) };

        // ── Request Form Management ───────────────────────────────────────────
        case FETCH_GET_REQUEST_FORM_REQUEST:
            return { ...state, requestFormState: req() };
        case FETCH_GET_REQUEST_FORM_SUCCESS:
            return { ...state, requestFormState: ok(action.payload) };
        case FETCH_GET_REQUEST_FORM_FAILURE:
            return { ...state, requestFormState: err(action.payload) };

        case CREATE_REQUEST_FORM_REQUEST:
            return { ...state, createRequestFormState: req() };
        case CREATE_REQUEST_FORM_SUCCESS:
            return { ...state, createRequestFormState: ok(action.payload) };
        case CREATE_REQUEST_FORM_FAILURE:
            return { ...state, createRequestFormState: err(action.payload) };

        case UPDATE_REQUEST_FORM_REQUEST:
            return { ...state, updateRequestFormState: req() };
        case UPDATE_REQUEST_FORM_SUCCESS:
            return { ...state, updateRequestFormState: ok(action.payload) };
        case UPDATE_REQUEST_FORM_FAILURE:
            return { ...state, updateRequestFormState: err(action.payload) };

        case DELETE_REQUEST_FORM_REQUEST:
            return { ...state, deleteRequestFormState: req() };
        case DELETE_REQUEST_FORM_SUCCESS:
            return { ...state, deleteRequestFormState: ok(action.payload) };
        case DELETE_REQUEST_FORM_FAILURE:
            return { ...state, deleteRequestFormState: err(action.payload) };

        default:
            return state;
    }
};

export default purchasingReducer;
