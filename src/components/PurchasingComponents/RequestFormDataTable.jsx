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
    Trash2
} from "lucide-react";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import { fetchGetRequestFormData, createRequestFormData } from "../../states/PurchasingState/Action";
import { showToast } from "../../states/NotificationState/Action";

// ─── Status Options ───────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
    { value: "", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const RequestFormDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    // Redux State
    const requestFormState = useSelector((s) => s.purchasing.requestFormState);
    const createRequestState = useSelector((s) => s.purchasing.createRequestFormState);
    
    // Extract data
    const responseData = requestFormState.data || {};
    const requests = Array.isArray(responseData) ? responseData : (responseData.Data || responseData.data || []);
    const totalRecords = responseData.TotalRecords || responseData.totalRecords || 0;
    const loading = requestFormState.loading || false;

    // Table State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [isAddModal, setIsAddModal] = useState(false);
    const [isViewModal, setIsViewModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Form State for Redesigned Form
    const [formNumber, setFormNumber] = useState("");
    const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
    const [requestedBy, setRequestedBy] = useState(null);
    const [campus, setCampus] = useState(null);
    const [transactionType, setTransactionType] = useState({
        jobOrder: false,
        cashAdvance: false,
        outsideTransaction: false,
        services: false,
        billing: false,
        others: false
    });
    const [items, setItems] = useState([
        { qty: "", unit: "", description: "", unitCost: "", amount: "" }
    ]);
    const [usedFor, setUsedFor] = useState("");
    const [suppliers, setSuppliers] = useState([
        { supplierName: "", address: "", contactNumber: "" },
        { supplierName: "", address: "", contactNumber: "" },
        { supplierName: "", address: "", contactNumber: "" }
    ]);

    // Dummy user options for "Requested By" dropdown
    const [userOptions, setUserOptions] = useState([
        { value: 1, label: "Victor Montero" },
        { value: 2, label: "John Doe" },
        { value: 3, label: "Jane Smith" },
        { value: 4, label: "Maria Santos" },
        { value: 5, label: "Juan dela Cruz" }
    ]);

    // Campus options
    const campusOptions = [
        { value: "Main", label: "Main Campus" },
        { value: "South", label: "South Campus" }
    ];

    const [formErrors, setFormErrors] = useState({});

    // ── Fetch Data ────────────────────────────────────────────────────────────
    const fetchData = () => {
        dispatch(fetchGetRequestFormData(
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
    const handleView = (request) => {
        setSelectedRequest(request);
        setIsViewModal(true);
    };

    const handleOpenAddModal = () => {
        // Generate form number
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        setFormNumber(randomNum.toString());
        
        // Reset form
        setRequestDate(new Date().toISOString().split('T')[0]);
        setRequestedBy(null);
        setCampus(null);
        setTransactionType({
            jobOrder: false,
            cashAdvance: false,
            outsideTransaction: false,
            services: false,
            billing: false,
            others: false
        });
        setItems([
            { qty: "", unit: "", description: "", unitCost: "", amount: "" }
        ]);
        setUsedFor("");
        setSuppliers([
            { supplierName: "", address: "", contactNumber: "" },
            { supplierName: "", address: "", contactNumber: "" },
            { supplierName: "", address: "", contactNumber: "" }
        ]);
        setFormErrors({});
        setIsAddModal(true);
    };

    // Handle add new item row
    const handleAddItem = () => {
        setItems([...items, { qty: "", unit: "", description: "", unitCost: "", amount: "" }]);
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

    // Handle supplier field change
    const handleSupplierChange = (index, field, value) => {
        const updatedSuppliers = [...suppliers];
        updatedSuppliers[index][field] = value;
        setSuppliers(updatedSuppliers);
    };

    // Handle transaction type checkbox
    const handleTransactionTypeChange = (type) => {
        setTransactionType({ ...transactionType, [type]: !transactionType[type] });
    };

    const validateForm = () => {
        const errors = {};
        
        if (!requestedBy) {
            errors.requestedBy = "Please select who is requesting";
        }

        if (!campus) {
            errors.campus = "Please select campus";
        }
        
        if (!requestDate) {
            errors.requestDate = "Request date is required";
        }

        // Check if at least one transaction type is selected
        const hasTransactionType = Object.values(transactionType).some(val => val === true);
        if (!hasTransactionType) {
            errors.transactionType = "Please select at least one transaction type";
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
            FormNumber: formNumber,
            RequestDate: requestDate,
            RequestedByUserId: requestedBy?.value,
            Campus: campus?.value,
            TransactionTypes: transactionType,
            Items: items.filter(item => item.description.trim() !== ""),
            UsedFor: usedFor,
            Suppliers: suppliers.filter(s => s.supplierName.trim() !== ""),
            Status: "Pending"
        };

        try {
            const result = await dispatch(createRequestFormData(payload));
            
            if (result.ok) {
                dispatch(showToast("success", "Requisition form submitted successfully!"));
                setIsAddModal(false);
                fetchData(); // Refresh the table
            } else {
                dispatch(showToast("error", result.data?.message || "Failed to submit requisition form"));
            }
        } catch (error) {
            dispatch(showToast("error", "An error occurred while submitting requisition form"));
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter(null);
        setPage(1);
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
            name: "Request ID",
            selector: (r) => r.RequestId || "—",
            sortable: true,
            minWidth: "120px",
            cell: (r) => (
                <span className="text-xs font-mono font-bold text-gray-900">#{r.RequestId}</span>
            ),
        },
        {
            name: "Item Name",
            selector: (r) => r.ItemName || "—",
            sortable: true,
            minWidth: "200px",
            grow: 2,
            cell: (r) => (
                <div className="py-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.ItemName || "—"}</p>
                </div>
            ),
        },
        {
            name: "Quantity",
            selector: (r) => r.Quantity || 0,
            sortable: true,
            minWidth: "100px",
            cell: (r) => (
                <span className="text-sm font-bold text-gray-900">{r.Quantity || 0}</span>
            ),
        },
        {
            name: "Purpose",
            selector: (r) => r.Purpose || "—",
            sortable: true,
            minWidth: "200px",
            grow: 1,
            omit: window.innerWidth < 768,
            cell: (r) => (
                <span className="text-xs text-gray-700 line-clamp-2">{r.Purpose || "—"}</span>
            ),
        },
        {
            name: "Requested Date",
            selector: (r) => r.RequestedDate,
            sortable: true,
            minWidth: "150px",
            cell: (r) => (
                <div className="py-2">
                    <p className="text-xs font-semibold text-gray-900">
                        {r.RequestedDate ? new Date(r.RequestedDate).toLocaleDateString("en-PH") : "—"}
                    </p>
                </div>
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
            name: "Requested By",
            selector: (r) => r.RequestedByFullName || "—",
            sortable: true,
            minWidth: "150px",
            omit: window.innerWidth < 1024,
            cell: (r) => (
                <span className="text-xs text-gray-600">{r.RequestedByFullName || "—"}</span>
            ),
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
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                                <FileText size={20} className="sm:w-6 sm:h-6" />
                                Purchase Requests
                            </h2>
                            <p className="text-green-100 text-xs sm:text-sm mt-1">
                                Create and manage purchase requests
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
                                placeholder="Search by item name, purpose..."
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

                            {/* Add New Request Button */}
                            <button
                                onClick={handleOpenAddModal}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                                <Plus size={16} />
                                <span>New Request</span>
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
                            data={requests}
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
                                        <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                                    </motion.div>
                                    <p className="text-gray-500 font-medium text-base sm:text-lg">No requests found</p>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                                        Create a new purchase request to get started.
                                    </p>
                                </motion.div>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Add New Request Modal - Redesigned Requisition Form */}
            <ModalComponent
                isOpen={isAddModal}
                onClose={() => setIsAddModal(false)}
                title={
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-600 text-white rounded-lg p-2">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-base text-gray-900">ELIZABETH SETON SCHOOL</p>
                                <p className="text-xs text-gray-600">Service Administration Unit</p>
                                <p className="text-xs text-gray-600">Purchasing Department</p>
                                <p className="text-xs font-bold text-red-600">REQUISITION FORM</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-gray-100 border-2 border-gray-400 px-3 py-1 rounded">
                                <p className="text-xs text-gray-600">№</p>
                                <p className="text-xl font-bold text-red-600">{formNumber}</p>
                            </div>
                        </div>
                    </div>
                }
                size="w-[95vw] max-w-6xl"
                maxHeight="90vh"
                body={
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-4 py-4 space-y-4">
                        {/* Date, Requested By, and Campus Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    DATE: <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={requestDate}
                                    onChange={(e) => setRequestDate(e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                        formErrors.requestDate ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {formErrors.requestDate && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.requestDate}</p>
                                )}
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    REQUESTED BY: <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    label=""
                                    options={userOptions}
                                    value={requestedBy}
                                    onChange={setRequestedBy}
                                    placeholder="Search and select user..."
                                    showSearchIcon={true}
                                />
                                {formErrors.requestedBy && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.requestedBy}</p>
                                )}
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-bold text-gray-900">
                                    CAMPUS: <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    label=""
                                    options={campusOptions}
                                    value={campus}
                                    onChange={setCampus}
                                    placeholder="Select campus..."
                                    showSearchIcon={false}
                                />
                                {formErrors.campus && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.campus}</p>
                                )}
                            </div>
                        </div>

                        {/* Transaction Type Checkboxes */}
                        <div className="border-b pb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-900">
                                TRANSACTION TYPE: <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={transactionType.jobOrder}
                                        onChange={() => handleTransactionTypeChange("jobOrder")}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">( ) JOB ORDER</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={transactionType.cashAdvance}
                                        onChange={() => handleTransactionTypeChange("cashAdvance")}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">( ) CASH ADVANCE</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={transactionType.outsideTransaction}
                                        onChange={() => handleTransactionTypeChange("outsideTransaction")}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">( ) OUTSIDE TRANSACTION</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={transactionType.services}
                                        onChange={() => handleTransactionTypeChange("services")}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">( ) SERVICES</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={transactionType.billing}
                                        onChange={() => handleTransactionTypeChange("billing")}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">( ) BILLING</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={transactionType.others}
                                        onChange={() => handleTransactionTypeChange("others")}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">( ) OTHERS</span>
                                </label>
                            </div>
                            {formErrors.transactionType && (
                                <p className="text-red-500 text-xs mt-2">{formErrors.transactionType}</p>
                            )}
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
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-16">QTY.</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-24">UNIT</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center">DESCRIPTION</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-32">UNIT COST</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-32">AMOUNT</th>
                                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 text-center w-16">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
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
                                                        placeholder="e.g., roll"
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
                                    </tbody>
                                </table>
                            </div>
                            {formErrors.items && (
                                <p className="text-red-500 text-xs mt-2">{formErrors.items}</p>
                            )}
                        </div>

                        {/* Used For */}
                        <div className="border-b pb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-900">
                                USED FOR:
                            </label>
                            <textarea
                                value={usedFor}
                                onChange={(e) => setUsedFor(e.target.value)}
                                placeholder="Enter what this requisition will be used for"
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        {/* Suggested Suppliers */}
                        {/* <div>
                            <label className="block mb-3 text-sm font-bold text-gray-900">
                                SUGGESTED SUPPLIERS:
                            </label>
                            <div className="space-y-3">
                                {suppliers.map((supplier, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-gray-700">
                                                Supplier Name {index + 1}
                                            </label>
                                            <input
                                                type="text"
                                                value={supplier.supplierName}
                                                onChange={(e) => handleSupplierChange(index, "supplierName", e.target.value)}
                                                placeholder="Enter supplier name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-gray-700">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                value={supplier.address}
                                                onChange={(e) => handleSupplierChange(index, "address", e.target.value)}
                                                placeholder="Enter address"
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs font-medium text-gray-700">
                                                Contact #
                                            </label>
                                            <input
                                                type="text"
                                                value={supplier.contactNumber}
                                                onChange={(e) => handleSupplierChange(index, "contactNumber", e.target.value)}
                                                placeholder="Enter contact number"
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>
                }
                buttons={[
                    {
                        label: createRequestState.loading ? "Submitting..." : "Submit Requisition",
                        type: "green",
                        onClick: handleSubmit,
                        disabled: createRequestState.loading,
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => setIsAddModal(false),
                    },
                ]}
            />

            {/* View Request Modal */}
            <ModalComponent
                isOpen={isViewModal}
                onClose={() => setIsViewModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white rounded-lg p-2">
                            <FileText size={20} />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-gray-900">Request Details</span>
                    </div>
                }
                size="w-[95vw] max-w-2xl"
                body={
                    selectedRequest && (
                        <div className="space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Request ID</p>
                                    <p className="text-sm font-semibold text-gray-900">#{selectedRequest.RequestId}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Status</p>
                                    {getStatusBadge(selectedRequest.Status)}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Item Name</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.ItemName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Quantity</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.Quantity}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Requested Date</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {selectedRequest.RequestedDate ? new Date(selectedRequest.RequestedDate).toLocaleDateString("en-PH") : "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Requested By</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.RequestedByFullName}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Purpose</p>
                                <p className="text-sm text-gray-700">{selectedRequest.Purpose}</p>
                            </div>
                            {selectedRequest.Remarks && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Remarks</p>
                                    <p className="text-sm text-gray-700">{selectedRequest.Remarks}</p>
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

export default RequestFormDataTable;
