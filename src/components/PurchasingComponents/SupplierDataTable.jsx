import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    Plus,
    Users,
    Search,
    Filter,
    X,
    Edit,
    ChevronDown,
    Building2,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { fetchGetSupplierData, createSupplierData, updateSupplierData } from "../../states/PurchasingState/Action";
import { showToast } from "../../states/NotificationState/Action";

// ─── Main Component ───────────────────────────────────────────────────────────
const SupplierDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    // Redux State
    const supplierState = useSelector((s) => s.purchasing.supplierState);
    const createSupplierState = useSelector((s) => s.purchasing.createSupplierState);
    const updateSupplierState = useSelector((s) => s.purchasing.updateSupplierState);

    // Extract data
    const responseData = supplierState.data || {};
    const suppliers = Array.isArray(responseData) ? responseData : (responseData.Data || responseData.data || []);
    const totalRecords = responseData.TotalRecords || responseData.totalRecords || 0;
    const loading = supplierState.loading || false;

    // Table State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [isAddModal, setIsAddModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [isViewModal, setIsViewModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        supplierCode: "",
        companyName: "",
        tradeName: "",
        supplierCategory: "",
        contactPerson: "",
        contactTitle: "",
        contactPhone: "",
        contactEmail: "",
        billingAddress: "",
        shippingAddress: "",
        corporatePhone: "",
        corporateEmail: "",
        website: "",
        paymentTerms: "",
        defaultCurrency: "PHP",
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        swiftCode: "",
        creditLimit: "",
        tin: "",
        vatRegistered: false,
        taxRate: "",
        complianceNotes: "",
        status: "Active",
    });
    const [formErrors, setFormErrors] = useState({});

    // ── Fetch Data ────────────────────────────────────────────────────────────
    const fetchData = () => {
        dispatch(fetchGetSupplierData(page, pageSize, search, statusFilter));
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize, search, statusFilter]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (supplier) => {
        setSelectedSupplier(supplier);
        setIsViewModal(true);
    };

    const handleEdit = (supplier) => {
        setFormData({
            supplierId: supplier.SupplierId,
            supplierCode: supplier.SupplierCode || "",
            companyName: supplier.CompanyName || "",
            tradeName: supplier.TradeName || "",
            supplierCategory: supplier.SupplierCategory || "",
            contactPerson: supplier.ContactPerson || "",
            contactTitle: supplier.ContactTitle || "",
            contactPhone: supplier.ContactPhone || "",
            contactEmail: supplier.ContactEmail || "",
            billingAddress: supplier.BillingAddress || "",
            shippingAddress: supplier.ShippingAddress || "",
            corporatePhone: supplier.CorporatePhone || "",
            corporateEmail: supplier.CorporateEmail || "",
            website: supplier.Website || "",
            paymentTerms: supplier.PaymentTerms || "",
            defaultCurrency: supplier.DefaultCurrency || "PHP",
            bankName: supplier.BankName || "",
            accountHolder: supplier.AccountHolder || "",
            accountNumber: supplier.AccountNumber || "",
            swiftCode: supplier.SwiftCode || "",
            creditLimit: supplier.CreditLimit || "",
            tin: supplier.TIN || "",
            vatRegistered: supplier.VATRegistered || false,
            taxRate: supplier.TaxRate || "",
            complianceNotes: supplier.ComplianceNotes || "",
            status: supplier.Status || "Active",
        });
        setFormErrors({});
        setIsEditModal(true);
    };

    const handleOpenAddModal = () => {
        setFormData({
            supplierCode: "",
            companyName: "",
            tradeName: "",
            supplierCategory: "",
            contactPerson: "",
            contactTitle: "",
            contactPhone: "",
            contactEmail: "",
            billingAddress: "",
            shippingAddress: "",
            corporatePhone: "",
            corporateEmail: "",
            website: "",
            paymentTerms: "",
            defaultCurrency: "PHP",
            bankName: "",
            accountHolder: "",
            accountNumber: "",
            swiftCode: "",
            creditLimit: "",
            tin: "",
            vatRegistered: false,
            taxRate: "",
            complianceNotes: "",
            status: "Active",
        });
        setFormErrors({});
        setIsAddModal(true);
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (formErrors[field]) {
            setFormErrors({ ...formErrors, [field]: null });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.companyName.trim()) {
            errors.companyName = "Company name is required";
        }

        if (!formData.supplierCategory.trim()) {
            errors.supplierCategory = "Supplier category is required";
        }

        if (!formData.contactPerson.trim()) {
            errors.contactPerson = "Contact person is required";
        }

        if (!formData.contactEmail.trim()) {
            errors.contactEmail = "Contact email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
            errors.contactEmail = "Invalid email format";
        }

        if (!formData.billingAddress.trim()) {
            errors.billingAddress = "Billing address is required";
        }

        if (!formData.tin.trim()) {
            errors.tin = "TIN is required";
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
            SupplierCode: formData.supplierCode,
            CompanyName: formData.companyName,
            TradeName: formData.tradeName,
            SupplierCategory: formData.supplierCategory,
            ContactPerson: formData.contactPerson,
            ContactTitle: formData.contactTitle,
            ContactPhone: formData.contactPhone,
            ContactEmail: formData.contactEmail,
            BillingAddress: formData.billingAddress,
            ShippingAddress: formData.shippingAddress,
            CorporatePhone: formData.corporatePhone,
            CorporateEmail: formData.corporateEmail,
            Website: formData.website,
            PaymentTerms: formData.paymentTerms,
            DefaultCurrency: formData.defaultCurrency,
            BankName: formData.bankName,
            AccountHolder: formData.accountHolder,
            AccountNumber: formData.accountNumber,
            SwiftCode: formData.swiftCode,
            CreditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : 0,
            TIN: formData.tin,
            VATRegistered: formData.vatRegistered,
            TaxRate: formData.taxRate ? parseFloat(formData.taxRate) : 0,
            ComplianceNotes: formData.complianceNotes,
            Status: formData.status,
            CreatedByUserId: user?.UserId,
        };

        try {
            const result = await dispatch(createSupplierData(payload));

            if (result.ok) {
                dispatch(showToast("success", "Supplier created successfully!"));
                setIsAddModal(false);
                fetchData();
            } else {
                dispatch(showToast("error", result.data?.message || "Failed to create supplier"));
            }
        } catch (error) {
            dispatch(showToast("error", "An error occurred while creating supplier"));
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            dispatch(showToast("error", "Please fill in all required fields"));
            return;
        }

        const payload = {
            SupplierId: formData.supplierId,
            SupplierCode: formData.supplierCode,
            CompanyName: formData.companyName,
            TradeName: formData.tradeName,
            SupplierCategory: formData.supplierCategory,
            ContactPerson: formData.contactPerson,
            ContactTitle: formData.contactTitle,
            ContactPhone: formData.contactPhone,
            ContactEmail: formData.contactEmail,
            BillingAddress: formData.billingAddress,
            ShippingAddress: formData.shippingAddress,
            CorporatePhone: formData.corporatePhone,
            CorporateEmail: formData.corporateEmail,
            Website: formData.website,
            PaymentTerms: formData.paymentTerms,
            DefaultCurrency: formData.defaultCurrency,
            BankName: formData.bankName,
            AccountHolder: formData.accountHolder,
            AccountNumber: formData.accountNumber,
            SwiftCode: formData.swiftCode,
            CreditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : 0,
            TIN: formData.tin,
            VATRegistered: formData.vatRegistered,
            TaxRate: formData.taxRate ? parseFloat(formData.taxRate) : 0,
            ComplianceNotes: formData.complianceNotes,
            Status: formData.status,
            ModifiedByUserId: user?.UserId,
        };

        try {
            const result = await dispatch(updateSupplierData(payload));

            if (result.ok) {
                dispatch(showToast("success", "Supplier updated successfully!"));
                setIsEditModal(false);
                fetchData();
            } else {
                dispatch(showToast("error", result.data?.message || "Failed to update supplier"));
            }
        } catch (error) {
            dispatch(showToast("error", "An error occurred while updating supplier"));
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("");
        setPage(1);
    };

    // ── Status Badge ──────────────────────────────────────────────────────────
    const getStatusBadge = (status) => {
        const statusConfig = {
            Active: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
            Inactive: { bg: "bg-gray-100", text: "text-gray-700", icon: Clock },
            Blocked: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
        };

        const config = statusConfig[status] || statusConfig.Active;
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
            name: "Supplier Code",
            selector: (r) => r.SupplierCode || "—",
            sortable: true,
            minWidth: "140px",
            cell: (r) => (
                <span className="text-xs font-mono font-bold text-gray-900">#{r.SupplierCode || "—"}</span>
            ),
        },
        {
            name: "Company Name",
            selector: (r) => r.CompanyName || "—",
            sortable: true,
            minWidth: "220px",
            grow: 2,
            cell: (r) => (
                <div className="py-2">
                    <p className="text-sm font-semibold text-gray-900">{r.CompanyName || "—"}</p>
                    {r.TradeName && <p className="text-xs text-gray-500">DBA: {r.TradeName}</p>}
                </div>
            ),
        },
        {
            name: "Category",
            selector: (r) => r.SupplierCategory || "—",
            sortable: true,
            minWidth: "150px",
            cell: (r) => (
                <span className="text-xs text-gray-700">{r.SupplierCategory || "—"}</span>
            ),
        },
        {
            name: "Contact Person",
            selector: (r) => r.ContactPerson || "—",
            sortable: true,
            minWidth: "180px",
            omit: window.innerWidth < 768,
            cell: (r) => (
                <div className="py-2">
                    <p className="text-sm font-semibold text-gray-900">{r.ContactPerson || "—"}</p>
                    {r.ContactEmail && <p className="text-xs text-gray-500">{r.ContactEmail}</p>}
                </div>
            ),
        },
        {
            name: "Payment Terms",
            selector: (r) => r.PaymentTerms || "—",
            sortable: true,
            minWidth: "130px",
            omit: window.innerWidth < 1024,
            cell: (r) => (
                <span className="text-xs font-semibold text-gray-700">{r.PaymentTerms || "—"}</span>
            ),
        },
        {
            name: "Status",
            selector: (r) => r.Status,
            sortable: true,
            minWidth: "130px",
            cell: (r) => getStatusBadge(r.Status || "Active"),
        },
        {
            name: "Actions",
            minWidth: "120px",
            maxWidth: "130px",
            center: true,
            cell: (r) => (
                <div className="flex items-center gap-2">
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
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(r);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Supplier"
                    >
                        <Edit size={18} />
                    </button>
                </div>
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
                                <Users size={20} className="sm:w-6 sm:h-6" />
                                Supplier Master
                            </h2>
                            <p className="text-green-100 text-xs sm:text-sm mt-1">
                                Manage vendor and supplier directory
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
                                placeholder="Search by company name, code, category..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-2">
                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    showFilters ? "bg-green-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <Filter size={16} />
                                <span>Filters</span>
                            </button>

                            {/* Add New Supplier Button */}
                            <button
                                onClick={handleOpenAddModal}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Add Supplier</span>
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

                    {/* Expandable Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-200 mt-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                        >
                                            <option value="">All Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Blocked">Blocked</option>
                                        </select>
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
                            data={suppliers}
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
                                        <Users className="mx-auto text-gray-300 mb-4" size={48} />
                                    </motion.div>
                                    <p className="text-gray-500 font-medium text-base sm:text-lg">No suppliers found</p>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                                        Start adding suppliers to build your vendor directory.
                                    </p>
                                </motion.div>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Add/Edit Supplier Modal - Form fields will be shown in the next part */}
            <ModalComponent
                isOpen={isAddModal || isEditModal}
                onClose={() => { setIsAddModal(false); setIsEditModal(false); }}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white rounded-lg p-2">
                            {isEditModal ? <Edit size={20} /> : <Plus size={20} />}
                        </div>
                        <span className="font-bold text-base sm:text-lg text-gray-900">
                            {isEditModal ? "Edit Supplier" : "Add New Supplier"}
                        </span>
                    </div>
                }
                size="w-[95vw] max-w-4xl"
                maxHeight="90vh"
                body={
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-2 py-2 space-y-6">
                        {/* General Information */}
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Building2 size={16} className="text-green-600" />
                                General Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Company Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                        placeholder="Enter legal company name"
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            formErrors.companyName ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {formErrors.companyName && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.companyName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Trade Name (DBA)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tradeName}
                                        onChange={(e) => handleInputChange("tradeName", e.target.value)}
                                        placeholder="Doing Business As"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Supplier Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.supplierCategory}
                                        onChange={(e) => handleInputChange("supplierCategory", e.target.value)}
                                        placeholder="e.g., IT Hardware, Office Supplies"
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            formErrors.supplierCategory ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {formErrors.supplierCategory && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.supplierCategory}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleInputChange("status", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Blocked">Blocked</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Phone size={16} className="text-green-600" />
                                Contact & Communication
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Primary Contact Person <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                                        placeholder="Full name"
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            formErrors.contactPerson ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {formErrors.contactPerson && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.contactPerson}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contactTitle}
                                        onChange={(e) => handleInputChange("contactTitle", e.target.value)}
                                        placeholder="e.g., Account Manager"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                                        placeholder="+63 XXX XXX XXXX"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Contact Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                                        placeholder="email@company.com"
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            formErrors.contactEmail ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {formErrors.contactEmail && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.contactEmail}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Corporate Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.corporatePhone}
                                        onChange={(e) => handleInputChange("corporatePhone", e.target.value)}
                                        placeholder="Main office number"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Corporate Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.corporateEmail}
                                        onChange={(e) => handleInputChange("corporateEmail", e.target.value)}
                                        placeholder="info@company.com"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                        placeholder="https://www.company.com"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <MapPin size={16} className="text-green-600" />
                                Address Details
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Billing Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.billingAddress}
                                        onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                                        placeholder="Street, City, Province, ZIP"
                                        rows={2}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            formErrors.billingAddress ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {formErrors.billingAddress && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.billingAddress}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Shipping / Warehouse Address
                                    </label>
                                    <textarea
                                        value={formData.shippingAddress}
                                        onChange={(e) => handleInputChange("shippingAddress", e.target.value)}
                                        placeholder="If different from billing address"
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <CreditCard size={16} className="text-green-600" />
                                Financial & Payment Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Payment Terms
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.paymentTerms}
                                        onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                                        placeholder="e.g., Net 30, Net 60, COD"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Default Currency
                                    </label>
                                    <select
                                        value={formData.defaultCurrency}
                                        onChange={(e) => handleInputChange("defaultCurrency", e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    >
                                        <option value="PHP">PHP - Philippine Peso</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="JPY">JPY - Japanese Yen</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Credit Limit
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.creditLimit}
                                        onChange={(e) => handleInputChange("creditLimit", e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bankName}
                                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                                        placeholder="Bank institution"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Account Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.accountHolder}
                                        onChange={(e) => handleInputChange("accountHolder", e.target.value)}
                                        placeholder="Account name"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.accountNumber}
                                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                                        placeholder="Bank account number"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        SWIFT / Routing Code
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.swiftCode}
                                        onChange={(e) => handleInputChange("swiftCode", e.target.value)}
                                        placeholder="For wire transfers"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tax & Compliance */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText size={16} className="text-green-600" />
                                Tax & Compliance
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        TIN (Tax Identification Number) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tin}
                                        onChange={(e) => handleInputChange("tin", e.target.value)}
                                        placeholder="XXX-XXX-XXX-XXX"
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            formErrors.tin ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {formErrors.tin && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.tin}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.taxRate}
                                        onChange={(e) => handleInputChange("taxRate", e.target.value)}
                                        placeholder="12.00"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>

                                <div className="flex items-center gap-2 md:col-span-2">
                                    <input
                                        type="checkbox"
                                        id="vatRegistered"
                                        checked={formData.vatRegistered}
                                        onChange={(e) => handleInputChange("vatRegistered", e.target.checked)}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <label htmlFor="vatRegistered" className="text-sm font-medium text-gray-900">
                                        VAT Registered Supplier
                                    </label>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Compliance Notes
                                    </label>
                                    <textarea
                                        value={formData.complianceNotes}
                                        onChange={(e) => handleInputChange("complianceNotes", e.target.value)}
                                        placeholder="Document expiry dates, licenses, certifications..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: isEditModal
                            ? (updateSupplierState.loading ? "Updating..." : "Update Supplier")
                            : (createSupplierState.loading ? "Saving..." : "Save Supplier"),
                        type: "green",
                        onClick: isEditModal ? handleUpdate : handleSubmit,
                        disabled: isEditModal ? updateSupplierState.loading : createSupplierState.loading,
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => { setIsAddModal(false); setIsEditModal(false); },
                    },
                ]}
            />

            {/* View Supplier Modal */}
            <ModalComponent
                isOpen={isViewModal}
                onClose={() => setIsViewModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white rounded-lg p-2">
                            <Users size={20} />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-gray-900">Supplier Details</span>
                    </div>
                }
                size="w-[95vw] max-w-4xl"
                body={
                    selectedSupplier && (
                        <div className="space-y-6 p-4">
                            {/* General Information */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">General Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Supplier Code</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.SupplierCode || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Company Name</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.CompanyName || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Trade Name</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.TradeName || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Category</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.SupplierCategory || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Status</p>
                                        {getStatusBadge(selectedSupplier.Status || "Active")}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Contact Person</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.ContactPerson || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Job Title</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.ContactTitle || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Contact Phone</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.ContactPhone || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Contact Email</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.ContactEmail || "—"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Address</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Billing Address</p>
                                        <p className="text-sm text-gray-900">{selectedSupplier.BillingAddress || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Shipping Address</p>
                                        <p className="text-sm text-gray-900">{selectedSupplier.ShippingAddress || "—"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Information */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Financial Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Payment Terms</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.PaymentTerms || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Default Currency</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.DefaultCurrency || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Credit Limit</p>
                                        <p className="text-sm font-semibold text-green-700">
                                            ₱{Number(selectedSupplier.CreditLimit || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Bank Name</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.BankName || "—"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tax & Compliance */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Tax & Compliance</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">TIN</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedSupplier.TIN || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">VAT Status</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedSupplier.VATRegistered ? "VAT Registered" : "Not VAT Registered"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                buttons={[
                    {
                        label: "Close",
                        type: "green",
                        onClick: () => setIsViewModal(false),
                    },
                ]}
            />
        </div>
    );
};

export default SupplierDataTable;
