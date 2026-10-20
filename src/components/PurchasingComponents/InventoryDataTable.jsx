import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Eye, 
    Plus,
    Package,
    Calendar,
    Search,
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    Upload,
    Image as ImageIcon
} from "lucide-react";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { fetchGetInventoryData, createInventoryStockData } from "../../states/PurchasingState/Action";
import { showToast } from "../../states/NotificationState/Action";

// ─── Main Component ───────────────────────────────────────────────────────────
const InventoryDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    // Redux State
    const inventoryState = useSelector((s) => s.purchasing.inventoryState);
    const createStockState = useSelector((s) => s.purchasing.createInventoryStockState);
    
    // Extract data
    const responseData = inventoryState.data || {};
    const inventory = Array.isArray(responseData) ? responseData : (responseData.Data || responseData.data || []);
    const totalRecords = responseData.TotalRecords || responseData.totalRecords || 0;
    const loading = inventoryState.loading || false;

    // Table State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [isAddModal, setIsAddModal] = useState(false);
    const [isViewModal, setIsViewModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        stockName: "",
        quantity: "",
        datePurchased: "",
        remarks: "",
        imageFile: null,
        imagePreview: null
    });
    const [formErrors, setFormErrors] = useState({});

    // ── Fetch Data ────────────────────────────────────────────────────────────
    const fetchData = () => {
        dispatch(fetchGetInventoryData(page, pageSize, search));
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize, search]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (stock) => {
        setSelectedStock(stock);
        setIsViewModal(true);
    };

    const handleOpenAddModal = () => {
        // Reset form
        setFormData({
            stockName: "",
            quantity: "",
            datePurchased: "",
            remarks: "",
            imageFile: null,
            imagePreview: null
        });
        setFormErrors({});
        setIsAddModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setFormErrors({ ...formErrors, imageFile: "Please select a valid image file" });
                return;
            }
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setFormErrors({ ...formErrors, imageFile: "Image size must be less than 5MB" });
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    imageFile: file,
                    imagePreview: reader.result
                });
                setFormErrors({ ...formErrors, imageFile: null });
            };
            reader.readAsDataURL(file);
        }
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
        
        if (!formData.stockName.trim()) {
            errors.stockName = "Stock name is required";
        }
        
        if (!formData.quantity || formData.quantity <= 0) {
            errors.quantity = "Quantity must be greater than 0";
        }
        
        if (!formData.datePurchased) {
            errors.datePurchased = "Date purchased is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            dispatch(showToast("error", "Please fill in all required fields"));
            return;
        }

        // Create FormData for file upload
        const payload = new FormData();
        payload.append("StockName", formData.stockName);
        payload.append("Quantity", formData.quantity);
        payload.append("DatePurchased", formData.datePurchased);
        payload.append("Remarks", formData.remarks || "");
        payload.append("CreatedByUserId", user?.UserId);
        
        if (formData.imageFile) {
            payload.append("ImageFile", formData.imageFile);
        }

        try {
            const result = await dispatch(createInventoryStockData(payload));
            
            if (result.ok) {
                dispatch(showToast("success", "Stock added successfully!"));
                setIsAddModal(false);
                fetchData(); // Refresh the table
            } else {
                dispatch(showToast("error", result.data?.message || "Failed to add stock"));
            }
        } catch (error) {
            dispatch(showToast("error", "An error occurred while adding stock"));
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setPage(1);
    };

    // ── DataTable Columns ─────────────────────────────────────────────────────
    const columns = [
        {
            name: "Stock Name",
            selector: (r) => r.StockName || "—",
            sortable: true,
            minWidth: "200px",
            grow: 2,
            cell: (r) => (
                <div className="py-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.StockName || "—"}</p>
                </div>
            ),
        },
        {
            name: "Quantity",
            selector: (r) => r.Quantity || 0,
            sortable: true,
            minWidth: "120px",
            cell: (r) => (
                <div className="flex items-center gap-2">
                    <Package size={16} className="text-green-600" />
                    <span className="text-sm font-bold text-gray-900">{r.Quantity || 0}</span>
                </div>
            ),
        },
        {
            name: "Date Purchased",
            selector: (r) => r.DatePurchased,
            sortable: true,
            minWidth: "150px",
            cell: (r) => (
                <div className="py-2">
                    <p className="text-xs font-semibold text-gray-900">
                        {r.DatePurchased ? new Date(r.DatePurchased).toLocaleDateString("en-PH") : "—"}
                    </p>
                </div>
            ),
        },
        {
            name: "Remarks",
            selector: (r) => r.Remarks || "—",
            sortable: true,
            minWidth: "200px",
            grow: 1,
            omit: window.innerWidth < 768,
            cell: (r) => (
                <span className="text-xs text-gray-700 line-clamp-2">{r.Remarks || "—"}</span>
            ),
        },
        {
            name: "Created By",
            selector: (r) => r.CreatedByFullName || "—",
            sortable: true,
            minWidth: "150px",
            omit: window.innerWidth < 1024,
            cell: (r) => (
                <span className="text-xs text-gray-600">{r.CreatedByFullName || "—"}</span>
            ),
        },
        {
            name: "Date Created",
            selector: (r) => r.DateCreated,
            sortable: true,
            minWidth: "140px",
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
                                <Package size={20} className="sm:w-6 sm:h-6" />
                                Stock Inventory
                            </h2>
                            <p className="text-green-100 text-xs sm:text-sm mt-1">
                                Manage and track all inventory stock items
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
                                placeholder="Search by stock name, remarks..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-2">
                            {/* Add New Stock Button */}
                            <button
                                onClick={handleOpenAddModal}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Add New Stock</span>
                            </button>

                            {/* Clear Filters */}
                            {search && (
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
                </div>

                {/* DataTable */}
                <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <DataTable
                            columns={columns}
                            data={inventory}
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
                                        <Package className="mx-auto text-gray-300 mb-4" size={48} />
                                    </motion.div>
                                    <p className="text-gray-500 font-medium text-base sm:text-lg">No inventory items found</p>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                                        Start adding stock items to track your inventory.
                                    </p>
                                </motion.div>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Add New Stock Modal */}
            <ModalComponent
                isOpen={isAddModal}
                onClose={() => setIsAddModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white rounded-lg p-2">
                            <Plus size={20} />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-gray-900">Add New Stock</span>
                    </div>
                }
                size="w-[95vw] max-w-2xl"
                maxHeight="90vh"
                body={
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-2 py-2 space-y-4">
                        {/* Stock Name */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Stock Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.stockName}
                                onChange={(e) => handleInputChange("stockName", e.target.value)}
                                placeholder="Enter stock name"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                    formErrors.stockName ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.stockName && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.stockName}</p>
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

                        {/* Date Purchased */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Date Purchased <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.datePurchased}
                                onChange={(e) => handleInputChange("datePurchased", e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                    formErrors.datePurchased ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.datePurchased && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.datePurchased}</p>
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
                                placeholder="Enter any additional remarks or notes"
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        {/* Upload Image */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Upload Image
                            </label>
                            <div className="flex flex-col gap-3">
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                                    >
                                        <Upload size={20} className="text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            {formData.imageFile ? formData.imageFile.name : "Click to upload image"}
                                        </span>
                                    </label>
                                </div>
                                
                                {formErrors.imageFile && (
                                    <p className="text-red-500 text-xs">{formErrors.imageFile}</p>
                                )}

                                {/* Image Preview */}
                                {formData.imagePreview && (
                                    <div className="relative">
                                        <img
                                            src={formData.imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageFile: null, imagePreview: null })}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Max file size: 5MB. Supported formats: JPG, PNG, GIF
                            </p>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: createStockState.loading ? "Saving..." : "Save Stock",
                        type: "green",
                        onClick: handleSubmit,
                        disabled: createStockState.loading,
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => setIsAddModal(false),
                    },
                ]}
            />

            {/* View Stock Modal */}
            <ModalComponent
                isOpen={isViewModal}
                onClose={() => setIsViewModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white rounded-lg p-2">
                            <Package size={20} />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-gray-900">Stock Details</span>
                    </div>
                }
                size="w-[95vw] max-w-2xl"
                body={
                    selectedStock && (
                        <div className="space-y-4 p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Stock Name</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedStock.StockName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Quantity</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedStock.Quantity}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Date Purchased</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {selectedStock.DatePurchased ? new Date(selectedStock.DatePurchased).toLocaleDateString("en-PH") : "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Created By</p>
                                    <p className="text-sm font-semibold text-gray-900">{selectedStock.CreatedByFullName}</p>
                                </div>
                            </div>
                            {selectedStock.Remarks && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Remarks</p>
                                    <p className="text-sm text-gray-700">{selectedStock.Remarks}</p>
                                </div>
                            )}
                            {selectedStock.ImageUrl && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-2">Image</p>
                                    <img
                                        src={selectedStock.ImageUrl}
                                        alt={selectedStock.StockName}
                                        className="w-full h-64 object-cover rounded-lg border border-gray-300"
                                    />
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

export default InventoryDataTable;
