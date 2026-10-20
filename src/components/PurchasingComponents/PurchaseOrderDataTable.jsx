import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Eye, 
    Plus,
    FileText,
    Calendar,
    Search,
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    Clock,
    XCircle,
    Trash2,
    ShoppingCart
} from "lucide-react";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import { fetchGetPurchaseOrderData, createPurchaseOrderData } from "../../states/PurchasingState/Action";
import { showToast } from "../../states/NotificationState/Action";

// ─── Status Options ───────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
    { value: "", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const PurchaseOrderDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    // Redux State
    const purchaseOrderState = useSelector((s) => s.purchasing.purchaseOrderState);
    const createPurchaseOrderState = useSelector((s) => s.purchasing.createPurchaseOrderState);
    
    // Extract data
    const responseData = purchaseOrderState.data || {};
    const orders = Array.isArray(responseData) ? responseData : (responseData.Data || responseData.data || []);
    const totalRecords = responseData.TotalRecords || responseData.totalRecords || 0;
    const loading = purchaseOrderState.loading || false;

    // Table State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [isAddModal, setIsAddModal] = useState(false);
    const [isViewModal, setIsViewModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Form State for Purchase Order
    const [poNumber, setPoNumber] = useState("");
    const [supplier, setSupplier] = useState("");
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [deliverTo, setDeliverTo] = useState("");
    const [deliverOnOrBefore, setDeliverOnOrBefore] = useState("");
    const [terms, setTerms] = useState("");
    const [items, setItems] = useState([
        { itemCode: "", description: "", qty: "", unit: "", unitCost: "", amount: "" }
    ]);
    const [approvedBy, setApprovedBy] = useState(null);
    const [conformedBy, setConformedBy] = useState(null);
    const [preparedBy, setPreparedBy] = useState(null);

    // Dropdown options
    const [userOptions] = useState([
        { value: 1, label: "Victor Montero" },
        { value: 2, label: "John Doe" },
        { value: 3, label: "Jane Smith" },
        { value: 4, label: "Administrative Services Director" },
        { value: 5, label: "Supplier Representative" }
    ]);

    const [formErrors, setFormErrors] = useState({});

    // ── Fetch Data ────────────────────────────────────────────────────────────
    const fetchData = () => {
        dispatch(fetchGetPurchaseOrderData(
            page, 
            pageSize, 
            search,
            statusFilter?.value || null
        ));
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize, search, statusFilter]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (order) => {
        setSelectedOrder(order);
        setIsViewModal(true);
    };

    const handleOpenAddModal = () => {
        // Generate PO number
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        setPoNumber(randomNum.toString());
        
        // Reset form
        setSupplier("");
        setOrderDate(new Date().toISOString().split('T')[0]);
        setDeliverTo("");
        setDeliverOnOrBefore("");
        setTerms("");
        setItems([
            { itemCode: "", description: "", qty: "", unit: "", unitCost: "", amount: "" }
        ]);
        setApprovedBy(null);
        setConformedBy(null);
        setPreparedBy(null);
        setFormErrors({});
        setIsAddModal(true);
    };

    // Handle add new item row
    const handleAddItem = () => {
        setItems([...items, { itemCode: "", description: "", qty: "", unit: "", unitCost: "", amount: "" }]);
    };

    // Handle remove item row
    const handleRemoveItem = (index) => {
        if (items.length > 1) {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);
        }
    };

    // Handle item field change
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        
        // Auto-calculate amount if qty and unitCost are provided
        if (field === "qty" || field === "unitCost") {
            const qty = parseFloat(updatedItems[index].qty) || 0;
            const unitCost = parseFloat(updatedItems[index].unitCost) || 0;
            updatedItems[index].amount = (qty * unitCost).toFixed(2);
        }
        
        setItems(updatedItems);
    };

    const validateForm = () => {
        const errors = {};
        
        if (!supplier.trim()) {
            errors.supplier = "Supplier is required";
        }

        if (!deliverTo.trim()) {
            errors.deliverTo = "Deliver to is required";
        }
        
        if (!orderDate) {
            errors.orderDate = "Order date is required";
        }

        // Check if at least one item has description
        const hasItems = items.some(item => item.description.trim() !== "");
        if (!hasItems) {
            errors.items = "Please add at least one item with description";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            dispatch(showToast("error", "Please fill in all required fields"));
            return;
        }

        const payload = {
            PONumber: poNumber,
            Supplier: supplier,
            OrderDate: orderDate,
            DeliverTo: deliverTo,
            DeliverOnOrBefore: deliverOnOrBefore,
            Terms: terms,
            Items: items.filter(item => item.description.trim() !== ""),
            ApprovedByUserId: approvedBy?.value,
            ConformedByUserId: conformedBy?.value,
            PreparedByUserId: preparedBy?.value || user?.UserId,
            Status: "Pending"
        };

        try {
            const result = await dispatch(createPurchaseOrderData(payload));
            
            if (result.ok) {
                dispatch(showToast("success", "Purchase order submitted successfully!"));
                setIsAddModal(false);
                fetchData();
            } else {
                dispatch(showToast("error", result.data?.message || "Failed to submit purchase order"));
            }
        } catch (error) {
            dispatch(showToast("error", "An error occurred while submitting purchase order"));
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter(null);
        setPage(1);
    };

    // Calculate total amount
    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2);
    };

    // ── Status Badge ──────────────────────────────────────────────────────────
    const getStatusBadge = (status) => {
        const statusConfig = {
            Pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
            Approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
            Rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
        };

        const config = statusConfig[status] || statusConfig.Pending;
        const Icon = config.icon;

        return (
            <div className={`flex items-center gap-1.5 ${config.bg} ${config.text} px-3 py-1 rounded-full w-fit`}>
                <Icon size={14} />
                <span className="text-xs font-bold">{status}</span>
            </div>
        );
    };

    // ── DataTable Columns ─────────────────────────────────────────────────────
    const columns = [
        {
            name: "PO Number",
            selector: (r) => r.PONumber || "—",
            sortable: true,
            minWidth: "120px",
            cell: (r) => (
                <span className="text-xs font-mono font-bold text-gray-900">#{r.PONumber}</span>
            ),
        },
        {
            name: "Supplier",
            selector: (r) => r.Supplier || "—",
            sortable: true,
            minWidth: "200px",
            grow: 2,
            cell: (r) => (
                <div className="py-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.Supplier || "—"}</p>
                </div>
            ),
        },
        {
            name: "Deliver To",
            selector: (r) => r.DeliverTo || "—",
            sortable: true,
            minWidth: "150px",
            grow: 1,
            omit: window.innerWidth < 768,
            cell: (r) => (
                <span className="text-xs text-gray-700">{r.DeliverTo || "—"}</span>
            ),
        },
        {
            name: "Order Date",
            selector: (r) => r.OrderDate,
            sortable: true,
            minWidth: "130px",
            cell: (r) => (
                <div className="py-2">
                    <p className="text-xs font-semibold text-gray-900">
                        {r.OrderDate ? new Date(r.OrderDate).toLocaleDateString("en-PH") : "—"}
                    </p>
                </div>
            ),
        },
        {
            name: "Total Amount",
            selector: (r) => r.TotalAmount || 0,
            sortable: true,
            minWidth: "130px",
            cell: (r) => (
                <span className="text-sm font-bold text-green-700">
                    ₱{Number(r.TotalAmount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </span>
            ),
        },
        {
            name: "Status",
            selector: (r) => r.Status,
            sortable: true,
            minWidth: "130px",
            cell: (r) => getStatusBadge(r.Status || "Pending"),
        },
        {
            name: "Date Created",
            selector: (r) => r.DateCreated,
            sortable: true,
            minWidth: "140px",
            omit: window.innerWidth < 1280,
            cell: (r) => (
                <div className="py-2">
                    <p className="text-xs font-semibold text-gray-900">
                        {r.DateCreated ? new Date(r.DateCreated).toLocaleDateString("en-PH") : "—"}
                    </p>
                </div>
            ),
        },
        {
            name: "Actions",
            minWidth: "90px",
            maxWidth: "100px",
            center: true,
            cell: (r) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleView(r);
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View Details"
                >
                    <Eye size={18} />
                </button>
            ),
        },
    ];

    // Custom styles for DataTable with animation
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "#f9fafb",
                borderBottom: "2px solid #e5e7eb",
                minHeight: "48px",
            },
        },
        headCells: {
            style: {
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#6b7280",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        rows: {
            style: {
                minHeight: "60px",
                "&:hover": {
                    backgroundColor: "#f0fdf4",
                    cursor: "pointer",
                    transform: "scale(1.01)",
                    transition: "all 0.2s ease-in-out",
                },
                animation: "fadeInUp 0.5s ease-in-out",
                "@keyframes fadeInUp": {
                    "0%": {
                        opacity: 0,
                        transform: "translateY(20px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                },
            },
        },
        cells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
    };

    return (
        <div className="w-full pt-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
                                Purchase Orders
                            </h2>
                            <p className="text-green-100 text-xs sm:text-sm mt-1">
                                Create and manage purchase orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-full sm:min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by supplier, PO number..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-2">
                            {/* Filters Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    showFilters ? "bg-green-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <Filter size={16} />
                                <span className="hidden sm:inline">Filters</span>
                                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {/* Add New Purchase Order Button */}
                            <button
                                onClick={handleOpenAddModal}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                                <Plus size={16} />
                                <span>New Purchase Order</span>
                            </button>

                            {/* Clear Filters */}
                            {(search || statusFilter) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                >
                                    <X size={16} />
                                    <span className="hidden sm:inline">Clear</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <SearchableSelect
                                            label="Status"
                                            options={STATUS_OPTIONS}
                                            value={statusFilter}
                                            onChange={setStatusFilter}
                                            placeholder="Select status..."
                                            showSearchIcon={false}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* DataTable */}
                <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <DataTable
                            columns={columns}
                            data={orders}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRecords}
                            paginationDefaultPage={page}
                            onChangePage={(newPage) => setPage(newPage)}
                            onChangeRowsPerPage={(newPageSize, newPage) => {
                                setPageSize(newPageSize);
                                setPage(newPage);
                            }}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            customStyles={customStyles}
                            noDataComponent={
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="py-12 sm:py-16 text-center px-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    >
                                        <ShoppingCart className="mx-auto text-gray-300 mb-4" size={48} />
                                    </motion.div>
                                    <p className="text-gray-500 font-medium text-base sm:text-lg">No purchase orders found</p>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                                        Create a new purchase order to get started.
                                    </p>
                                </motion.div>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Add New Purchase Order Modal - Coming in next part due to length */}
            
            {/* Add New Purchase Order Modal */}
            <ModalComponent
                isOpen={isAddModal}
                onClose={() => setIsAddModal(false)}
                title={
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/assets/img/ESS-Logo.png" 
                                alt="ESS Logo" 
                                className="w-16 h-16 object-contain"
                            />
                            <div>
                                <p className="font-bold text-lg text-gray-900">ELIZABETH SETON SCHOOL</p>
                                <p className="text-xs text-gray-600">Main Campus: BF Resort Village, Las Piñas City</p>
                                <p className="text-xs text-gray-600">Tel. Nos: (02) 875-4553 up to (02) 875-4559 • Fax No. (02) 875-3759</p>
                                <p className="text-xs text-gray-600">South Campus: Amalia II-D, Imus, Cavite</p>
                                <p className="text-xs text-gray-600">Tel No. (046) 471-0080, (046) 471-6571 • Fax No. (046) 471-5445</p>
                                <p className="text-xs text-gray-600">Website: www.ess.edu.ph</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-2xl text-gray-900">PURCHASE ORDER</p>
                            <div className="bg-gray-100 border-2 border-gray-400 px-3 py-1 mt-2 rounded">
                                <p className="text-xs text-gray-600">№</p>
                                <p className="text-xl font-bold text-red-600">{poNumber}</p>
                            </div>
                        </div>
                    </div>
                }
                size="w-[95vw] max-w-6xl"
                maxHeight="90vh"
                body={
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-4 py-4 space-y-4">
                        {/* Supplier and Date Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    SUPPLIER: <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                    placeholder="Enter supplier name"
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                        formErrors.supplier ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {formErrors.supplier && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.supplier}</p>
                                )}
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    Date: <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={orderDate}
                                    onChange={(e) => setOrderDate(e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                        formErrors.orderDate ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {formErrors.orderDate && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.orderDate}</p>
                                )}
                            </div>
                        </div>

                        {/* Deliver To and Terms Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    Deliver To: <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={deliverTo}
                                    onChange={(e) => setDeliverTo(e.target.value)}
                                    placeholder="Enter delivery location"
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                        formErrors.deliverTo ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {formErrors.deliverTo && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.deliverTo}</p>
                                )}
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    Terms:
                                </label>
                                <input
                                    type="text"
                                    value={terms}
                                    onChange={(e) => setTerms(e.target.value)}
                                    placeholder="Enter payment terms"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                        </div>

                        {/* Deliver on or before */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    Deliver on or before:
                                </label>
                                <input
                                    type="date"
                                    value={deliverOnOrBefore}
                                    onChange={(e) => setDeliverOnOrBefore(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="border-b pb-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-bold text-gray-900">
                                    ITEMS: <span className="text-red-500">*</span>
                                </label>
                                <button
                                    onClick={handleAddItem}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition"
                                >
                                    <Plus size={14} />
                                    Add Item
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border border-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-24">Item Code</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center">Description</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-16">Qty.</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-24">Unit</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-32">Unit Cost</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-32">Amount</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-16">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 p-1">
                                                    <input
                                                        type="text"
                                                        value={item.itemCode}
                                                        onChange={(e) => handleItemChange(index, "itemCode", e.target.value)}
                                                        placeholder="Code"
                                                        className="w-full px-2 py-1.5 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-1">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                                        placeholder="Enter description"
                                                        className="w-full px-2 py-1.5 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={item.qty}
                                                        onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                                                        placeholder="0"
                                                        className="w-full px-2 py-1.5 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-green-400 text-center"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-1">
                                                    <input
                                                        type="text"
                                                        value={item.unit}
                                                        onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                                                        placeholder="Unit"
                                                        className="w-full px-2 py-1.5 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.unitCost}
                                                        onChange={(e) => handleItemChange(index, "unitCost", e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full px-2 py-1.5 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-green-400 text-right"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-1">
                                                    <input
                                                        type="text"
                                                        value={item.amount}
                                                        readOnly
                                                        placeholder="0.00"
                                                        className="w-full px-2 py-1.5 text-sm border-0 bg-gray-50 text-right font-semibold"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-1 text-center">
                                                    {items.length > 1 && (
                                                        <button
                                                            onClick={() => handleRemoveItem(index)}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                                                            title="Remove row"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Total Row */}
                                        <tr className="bg-gray-100 font-bold">
                                            <td colSpan="5" className="border border-gray-300 px-3 py-2 text-right text-sm">TOTAL:</td>
                                            <td className="border border-gray-300 px-3 py-2 text-right text-sm font-bold text-green-700">
                                                ₱{Number(calculateTotal()).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="border border-gray-300"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {formErrors.items && (
                                <p className="text-red-500 text-xs mt-2">{formErrors.items}</p>
                            )}
                        </div>

                        {/* Approval Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    APPROVAL (Administrative Services Director):
                                </label>
                                <SearchableSelect
                                    label=""
                                    options={userOptions}
                                    value={approvedBy}
                                    onChange={setApprovedBy}
                                    placeholder="Select approver..."
                                    showSearchIcon={true}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    CONFORME (Supplier):
                                </label>
                                <SearchableSelect
                                    label=""
                                    options={userOptions}
                                    value={conformedBy}
                                    onChange={setConformedBy}
                                    placeholder="Select conformer..."
                                    showSearchIcon={true}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    PREPARED BY:
                                </label>
                                <SearchableSelect
                                    label=""
                                    options={userOptions}
                                    value={preparedBy}
                                    onChange={setPreparedBy}
                                    placeholder="Select preparer..."
                                    showSearchIcon={true}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs font-semibold text-gray-900 mb-2">THIS ORDER IS SUBJECT TO THE TERMS AND CONDITIONS ON THE REVERSE SIDE HEREOF</p>
                            <p className="text-xs text-gray-700">ESS MANAGEMENT</p>
                            <p className="text-xs text-gray-600 mt-2">PLEASE RETURN THE SIGNED ACKNOWLEDGMENT COPY PROMPTLY.</p>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: createPurchaseOrderState.loading ? "Submitting..." : "Submit Purchase Order",
                        type: "green",
                        onClick: handleSubmit,
                        disabled: createPurchaseOrderState.loading,
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => setIsAddModal(false),
                    },
                ]}
            />

            {/* View Purchase Order Modal */}
            <ModalComponent
                isOpen={isViewModal}
                onClose={() => setIsViewModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white rounded-lg p-2">
                            <ShoppingCart size={20} />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-gray-900">Purchase Order Details</span>
                    </div>
                }
                size="w-[95vw] max-w-4xl"
                body={
                    selectedOrder && (
                        <div className="space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">PO Number</p>
                                    <p className="text-sm font-semibold text-gray-900">#{selectedOrder.PONumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Status</p>
                                    {getStatusBadge(selectedOrder.Status)}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Supplier</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedOrder.Supplier}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Order Date</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {selectedOrder.OrderDate ? new Date(selectedOrder.OrderDate).toLocaleDateString("en-PH") : "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Deliver To</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedOrder.DeliverTo}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                                    <p className="text-sm font-bold text-green-700">
                                        ₱{Number(selectedOrder.TotalAmount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                            {selectedOrder.Terms && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Terms</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.Terms}</p>
                                </div>
                            )}
                        </div>
                    )
                }
                buttons={[
                    {
                        label: "Close",
                        type: "blue",
                        onClick: () => setIsViewModal(false),
                    },
                ]}
            />
        </div>
    );
};

export default PurchaseOrderDataTable;
