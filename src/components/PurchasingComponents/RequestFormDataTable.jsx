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
    XCircle
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

    // Form State
    const [formData, setFormData] = useState({
        itemName: "",
        quantity: "",
        purpose: "",
        requestedDate: new Date().toISOString().split('T')[0],
        remarks: ""
    });
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
        // Reset form
        setFormData({
            itemName: "",
            quantity: "",
            purpose: "",
            requestedDate: new Date().toISOString().split('T')[0],
            remarks: ""
        });
        setFormErrors({});
        setIsAddModal(true);
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // Clear error for this field
        if (formErrors[field]) {
            setFormErrors({ ...formErrors, [field]: null });
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.itemName.trim()) {
            errors.itemName = "Item name is required";
        }
        
        if (!formData.quantity || formData.quantity <= 0) {
            errors.quantity = "Quantity must be greater than 0";
        }
        
        if (!formData.purpose.trim()) {
            errors.purpose = "Purpose is required";
        }

        if (!formData.requestedDate) {
            errors.requestedDate = "Requested date is required";
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
            ItemName: formData.itemName,
            Quantity: formData.quantity,
            Purpose: formData.purpose,
            RequestedDate: formData.requestedDate,
            Remarks: formData.remarks || "",
            RequestedByUserId: user?.UserId,
            Status: "Pending"
        };

        try {
            const result = await dispatch(createRequestFormData(payload));
            
            if (result.ok) {
                dispatch(showToast("success", "Request submitted successfully!"));
                setIsAddModal(false);
                fetchData(); // Refresh the table
            } else {
                dispatch(showToast("error", result.data?.message || "Failed to submit request"));
            }
        } catch (error) {
            dispatch(showToast("error", "An error occurred while submitting request"));
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

    // Custom styles for DataTable
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
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 text-white">
                                <p className="text-[10px] sm:text-xs font-medium">Total Requests</p>
                                <p className="text-xl sm:text-2xl font-bold">{totalRecords}</p>
                            </div>
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
                                <div className="py-12 sm:py-16 text-center px-4">
                                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500 font-medium text-base sm:text-lg">No requests found</p>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                                        Create a new purchase request to get started.
                                    </p>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Add New Request Modal */}
            <ModalComponent
                isOpen={isAddModal}
                onClose={() => setIsAddModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white rounded-lg p-2">
                            <Plus size={20} />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-gray-900">New Purchase Request</span>
                    </div>
                }
                size="w-[95vw] max-w-2xl"
                maxHeight="90vh"
                body={
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-2 py-2 space-y-4">
                        {/* Item Name */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Item Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.itemName}
                                onChange={(e) => handleInputChange("itemName", e.target.value)}
                                placeholder="Enter item name"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                    formErrors.itemName ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.itemName && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.itemName}</p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => handleInputChange("quantity", e.target.value)}
                                placeholder="Enter quantity"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                    formErrors.quantity ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.quantity && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>
                            )}
                        </div>

                        {/* Purpose */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Purpose <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.purpose}
                                onChange={(e) => handleInputChange("purpose", e.target.value)}
                                placeholder="Enter the purpose of this request"
                                rows={3}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                    formErrors.purpose ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.purpose && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.purpose}</p>
                            )}
                        </div>

                        {/* Requested Date */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Requested Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.requestedDate}
                                onChange={(e) => handleInputChange("requestedDate", e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                    formErrors.requestedDate ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.requestedDate && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.requestedDate}</p>
                            )}
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Remarks
                            </label>
                            <textarea
                                value={formData.remarks}
                                onChange={(e) => handleInputChange("remarks", e.target.value)}
                                placeholder="Enter any additional remarks"
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: createRequestState.loading ? "Submitting..." : "Submit Request",
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
