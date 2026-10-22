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

// ─── Initial State ────────────────────────────────────────────────────────────
const s = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialState = {
    // Request Form
    requestFormState: { ...s },
    createRequestFormState: { ...s },
    // Purchase Order
    purchaseOrderState: { ...s },
    createPurchaseOrderState: { ...s },
    // Inventory
    inventoryState: { ...s },
    createInventoryStockState: { ...s },
    // Supplier
    supplierState: { ...s },
    createSupplierState: { ...s },
    updateSupplierState: { ...s },
    // RF Number Series
    rfNumberSeriesState: { ...s },
    createRfNumberSeriesState: { ...s },
    updateRfNumberSeriesState: { ...s },
};

const ok = (payload) => ({ loading: false, data: payload, error: '', success: true });
const err = (payload) => ({ loading: false, data: [], error: payload, success: false });
const req = () => ({ loading: true, data: [], error: '', success: false });

const purchasingReducer = (state = initialState, action) => {
    switch (action.type) {
        // ── Request Form ──────────────────────────────────────────────────────
        case FETCH_GET_REQUEST_FORM_REQUEST: return { ...state, requestFormState: req() };
        case FETCH_GET_REQUEST_FORM_SUCCESS: return { ...state, requestFormState: ok(action.payload) };
        case FETCH_GET_REQUEST_FORM_FAILURE: return { ...state, requestFormState: err(action.payload) };

        case CREATE_REQUEST_FORM_REQUEST: return { ...state, createRequestFormState: req() };
        case CREATE_REQUEST_FORM_SUCCESS: return { ...state, createRequestFormState: ok(action.payload) };
        case CREATE_REQUEST_FORM_FAILURE: return { ...state, createRequestFormState: err(action.payload) };

        // ── Purchase Order ────────────────────────────────────────────────────
        case FETCH_GET_PURCHASE_ORDER_REQUEST: return { ...state, purchaseOrderState: req() };
        case FETCH_GET_PURCHASE_ORDER_SUCCESS: return { ...state, purchaseOrderState: ok(action.payload) };
        case FETCH_GET_PURCHASE_ORDER_FAILURE: return { ...state, purchaseOrderState: err(action.payload) };

        case CREATE_PURCHASE_ORDER_REQUEST: return { ...state, createPurchaseOrderState: req() };
        case CREATE_PURCHASE_ORDER_SUCCESS: return { ...state, createPurchaseOrderState: ok(action.payload) };
        case CREATE_PURCHASE_ORDER_FAILURE: return { ...state, createPurchaseOrderState: err(action.payload) };

        // ── Inventory ─────────────────────────────────────────────────────────
        case FETCH_GET_INVENTORY_REQUEST: return { ...state, inventoryState: req() };
        case FETCH_GET_INVENTORY_SUCCESS: return { ...state, inventoryState: ok(action.payload) };
        case FETCH_GET_INVENTORY_FAILURE: return { ...state, inventoryState: err(action.payload) };

        case CREATE_INVENTORY_STOCK_REQUEST: return { ...state, createInventoryStockState: req() };
        case CREATE_INVENTORY_STOCK_SUCCESS: return { ...state, createInventoryStockState: ok(action.payload) };
        case CREATE_INVENTORY_STOCK_FAILURE: return { ...state, createInventoryStockState: err(action.payload) };

        // ── Supplier ──────────────────────────────────────────────────────────
        case FETCH_GET_SUPPLIER_REQUEST: return { ...state, supplierState: req() };
        case FETCH_GET_SUPPLIER_SUCCESS: return { ...state, supplierState: ok(action.payload) };
        case FETCH_GET_SUPPLIER_FAILURE: return { ...state, supplierState: err(action.payload) };

        case CREATE_SUPPLIER_REQUEST: return { ...state, createSupplierState: req() };
        case CREATE_SUPPLIER_SUCCESS: return { ...state, createSupplierState: ok(action.payload) };
        case CREATE_SUPPLIER_FAILURE: return { ...state, createSupplierState: err(action.payload) };

        case UPDATE_SUPPLIER_REQUEST: return { ...state, updateSupplierState: req() };
        case UPDATE_SUPPLIER_SUCCESS: return { ...state, updateSupplierState: ok(action.payload) };
        case UPDATE_SUPPLIER_FAILURE: return { ...state, updateSupplierState: err(action.payload) };

        // ── RF Number Series ──────────────────────────────────────────────────
        case FETCH_GET_RF_NUMBER_SERIES_REQUEST: return { ...state, rfNumberSeriesState: req() };
        case FETCH_GET_RF_NUMBER_SERIES_SUCCESS: return { ...state, rfNumberSeriesState: ok(action.payload) };
        case FETCH_GET_RF_NUMBER_SERIES_FAILURE: return { ...state, rfNumberSeriesState: err(action.payload) };

        case CREATE_RF_NUMBER_SERIES_REQUEST: return { ...state, createRfNumberSeriesState: req() };
        case CREATE_RF_NUMBER_SERIES_SUCCESS: return { ...state, createRfNumberSeriesState: ok(action.payload) };
        case CREATE_RF_NUMBER_SERIES_FAILURE: return { ...state, createRfNumberSeriesState: err(action.payload) };

        case UPDATE_RF_NUMBER_SERIES_REQUEST: return { ...state, updateRfNumberSeriesState: req() };
        case UPDATE_RF_NUMBER_SERIES_SUCCESS: return { ...state, updateRfNumberSeriesState: ok(action.payload) };
        case UPDATE_RF_NUMBER_SERIES_FAILURE: return { ...state, updateRfNumberSeriesState: err(action.payload) };

        default:
            return state;
    }
};

export default purchasingReducer;
