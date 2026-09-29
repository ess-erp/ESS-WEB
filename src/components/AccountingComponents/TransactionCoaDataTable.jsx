import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { 
    fetchGetCoaFlatData, 
    fetchGetTransactionTypes,
    fetchCreateTransactionTypes,
    fetchUpdateTransactionTypes
 } from "../../states/AccountingState/Action";
import { fetchCampusData } from "../../states/OnlineApplicationState/Action";

const TransactionCoaDataTable = () => {
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form state - multi-row transactions
    const [selectedSY, setSelectedSY] = useState("2024-2025");
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [formRows, setFormRows] = useState([
        { transactionCode: "", transactionType: "", transactionGroup: "Enrollment", coaOption: null, feeAmount: "", remarks: "" },
    ]);

    const [errors, setErrors] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [filterSY, setFilterSY] = useState("2024-2025");
    const [filterCampus, setFilterCampus] = useState(null);

    // Get COA list from Redux
    const coaFlatState = useSelector((state) => state.accounting.coaFlatState || {});
    const coaList = coaFlatState.data || [];

    // Get Campus list from Redux
    const campusState = useSelector((state) => state.online.campusState || {});
    const campusList = campusState.data || [];
    
    // Get Transaction Types from Redux
    const transactionTypesState = useSelector((state) => state.accounting.getTransactionTypesState || {});
    const transactions = transactionTypesState.data?.Data || [];
    const totalRecords = transactionTypesState.data?.TotalRecords || 0;
    const loading = transactionTypesState.loading || false;

    // Prepare COA options for SearchableSelect
    const coaOptions = useMemo(() => 
        coaList.map((coa) => ({
            value: coa.CoaChildId,
            label: `${coa.AccountCode} - ${coa.AccountName}`,
        })),
        [coaList]
    );

    // Prepare Campus options for SearchableSelect
    const campusOptions = useMemo(() =>
        campusList.map((campus) => ({
            value: campus.CampusId,
            label: campus.CampusName,
        })),
        [campusList]
    );

    useEffect(() => {
        dispatch(fetchGetCoaFlatData());
        dispatch(fetchCampusData());
    }, [dispatch]);
    
    useEffect(() => {
        // Fetch transaction types when filters change
        dispatch(fetchGetTransactionTypes(currentPage, perPage, filterSY, filterCampus?.value || null));
    }, [dispatch, currentPage, perPage, filterSY, filterCampus]);

    const columns = [
        {
            name: "Transaction Code",
            selector: (row) => row.TransactionCode,
            sortable: true,
            width: "150px",
        },
        {
            name: "Transaction Type",
            selector: (row) => row.TransactionType,
            sortable: true,
            wrap: true,
        },
        {
            name: "Transaction Group",
            selector: (row) => row.TransactionGroup,
            sortable: true,
            width: "150px",
        },
        {
            name: "Assigned COA",
            selector: (row) => row.AccountCode && row.AccountName ? `${row.AccountCode} - ${row.AccountName}` : "—",
            sortable: true,
            wrap: true,
            width: "250px",
        },
        {
            name: "Fee Amount",
            selector: (row) => `₱${(row.Amount || 0).toFixed(2)}`,
            sortable: true,
            width: "120px",
        },
        {
            name: "Remarks",
            selector: (row) => row.Remarks || "—",
            sortable: false,
            wrap: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        title="Edit"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.FeesChildId)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "120px",
        },
    ];

    const handleAddNew = () => {
        setEditingId(null);
        setSelectedSY("2024-2025");
        setSelectedCampus(null);
        setFormRows([
            { transactionCode: "", transactionType: "", transactionGroup: "Enrollment", coaOption: null, feeAmount: "", remarks: "" },
        ]);
        setErrors({});
        setShowConfirm(false);
        setIsModalOpen(true);
    };

    const handleEdit = (row) => {
        setEditingId(row.FeesChildId);
        setFormRows([
            {
                transactionCode: row.TransactionCode,
                transactionType: row.TransactionType,
                transactionGroup: row.TransactionGroup,
                coaOption: row.CoaChildId ? coaOptions.find(opt => opt.value === row.CoaChildId) || null : null,
                feeAmount: row.Amount || "",
                remarks: row.Remarks || "",
            },
        ]);
        setErrors({});
        setIsModalOpen(true);
    };

    const handleDelete = (feesChildId) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            // TODO: Implement delete API call
            console.log("Delete FeesChildId:", feesChildId);
            // dispatch(fetchDeleteTransactionTypes(feesChildId));
        }
    };

    const handleRowChange = (index, field, value) => {
        const updated = [...formRows];
        updated[index][field] = value;
        setFormRows(updated);
        // Clear error for this field
        if (errors[`${index}-${field}`]) {
            setErrors((prev) => ({
                ...prev,
                [`${index}-${field}`]: null,
            }));
        }
    };

    const handleAddRow = () => {
        setFormRows([
            ...formRows,
            { transactionCode: "", transactionType: "", transactionGroup: "Enrollment", coaOption: null, feeAmount: "", remarks: "" },
        ]);
    };

    const handleRemoveRow = (index) => {
        if (formRows.length > 1) {
            setFormRows(formRows.filter((_, i) => i !== index));
        } else {
            alert("You must have at least one transaction");
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (!selectedCampus) {
            newErrors.campus = "Campus is required";
        }

        formRows.forEach((row, i) => {
            if (!row.transactionCode.trim()) {
                newErrors[`${i}-transactionCode`] = "Code required";
            }
            if (!row.transactionType.trim()) {
                newErrors[`${i}-transactionType`] = "Type required";
            }
            if (!row.coaOption) {
                newErrors[`${i}-coaOption`] = "COA required";
            }
            if (!row.feeAmount || parseFloat(row.feeAmount) <= 0) {
                if (row.transactionType.trim().toLowerCase() !== "assessment plan") {
                    newErrors[`${i}-feeAmount`] = "Amount required";
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 1: Validate then show the confirmation prompt
    const handleRequestSave = () => {
        if (!validateForm()) return;
        setShowConfirm(true);
    };

    // Step 2: User confirmed — build payload and dispatch
    const handleSave = async () => {

        // Create payload based on FeesChildTable structure
        const payload = {
            SchoolYear: selectedSY,
            CampusId: selectedCampus.value,
            CreatedByUserId: user?.UserId || null,
            FeesChildDtos: formRows.map((row) => ({
                TransactionCode: row.transactionCode,
                TransactionType: row.transactionType,
                TransactionGroup: row.transactionGroup,
                CoaChildId: row.coaOption ? row.coaOption.value : null,
                FeeAmount: parseFloat(row.feeAmount),
                Remarks: row.remarks,
            })),
        };

        console.log("Transaction Types Payload:", payload);

        // TODO: Implement create/update API call
        if (editingId) {
            await dispatch(fetchUpdateTransactionTypes(editingId, payload));
        } else {
            await dispatch(fetchCreateTransactionTypes(payload));
        }

        // Refresh the data
        dispatch(fetchGetTransactionTypes(currentPage, perPage, filterSY, filterCampus?.value || null));

        setIsModalOpen(false);
        setShowConfirm(false);
        setFormRows([{ transactionCode: "", transactionType: "", transactionGroup: "Enrollment", coaOption: null, feeAmount: "", remarks: "" }]);
        setErrors({});
    };

    return (
        <div className="bg-white shadow rounded-lg p-4">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-green-700">
                    Transaction Types
                </span>
                <OutlineBlueBtn
                    label="Add New Transaction"
                    onClick={handleAddNew}
                >
                    <Plus size={16} className="mr-1" />
                </OutlineBlueBtn>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        School Year:
                    </label>
                    <select
                        value={filterSY}
                        onChange={(e) => {
                            setFilterSY(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2025-2026">2025-2026</option>
                        <option value="2026-2027">2026-2027</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 flex-1 max-w-xs">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Campus:
                    </label>
                    <SearchableSelect
                        options={[{ value: null, label: "All Campuses" }, ...campusOptions]}
                        value={filterCampus}
                        onChange={(option) => {
                            setFilterCampus(option.value === null ? null : option);
                            setCurrentPage(1);
                        }}
                        placeholder="All Campuses"
                        showSearchIcon={false}
                        width="100%"
                    />
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={transactions}
                progressPending={loading}
                highlightOnHover
                striped
                responsive
                pagination
                paginationServer
                paginationTotalRows={totalRecords}
                paginationDefaultPage={currentPage}
                paginationPerPage={perPage}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage) => {
                    setPerPage(newPerPage);
                    setCurrentPage(1);
                }}
            />

            {/* Modal for Transaction Form */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Transaction Type" : "Add New Transaction Type"}
                size="w-[900px]"
                maxHeight="100vh"
                buttons={[
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => { setIsModalOpen(false); setShowConfirm(false); },
                        closeOnClick: false,
                    },
                    {
                        label: "Save Transactions",
                        type: "green",
                        onClick: handleRequestSave,
                        closeOnClick: false,
                    },
                ]}
                body={
                    <div className="space-y-4">
                        {/* Header with SY and Campus - Single Row */}
                        <div className="border-b pb-4">
                            <div className="grid grid-cols-2 gap-6 items-center">
                                {/* School Year */}
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        School Year
                                    </label>
                                    <select
                                        value={selectedSY}
                                        onChange={(e) => setSelectedSY(e.target.value)}
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="2023-2024">2023-2024</option>
                                        <option value="2024-2025">2024-2025</option>
                                        <option value="2025-2026">2025-2026</option>
                                        <option value="2026-2027">2026-2027</option>
                                    </select>
                                </div>

                                {/* Campus */}
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Campus *
                                    </label>
                                    <div className="flex-1">
                                        <SearchableSelect
                                            options={campusOptions}
                                            value={selectedCampus}
                                            onChange={setSelectedCampus}
                                            placeholder="Select Campus..."
                                            showSearchIcon={true}
                                            errors={!!errors.campus}
                                            errorMessage={errors.campus || ""}
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column Headers */}
                        <div className="grid grid-cols-12 gap-2 mb-2 border-b pb-2">
                            <div className="col-span-1 text-xs font-medium text-gray-700">
                                #
                            </div>
                            <div className="col-span-2 text-xs font-medium text-gray-700">
                                Transaction Code
                            </div>
                            <div className="col-span-2 text-xs font-medium text-gray-700">
                                Transaction Name
                            </div>
                            <div className="col-span-2 text-xs font-medium text-gray-700">
                                Transaction Group
                            </div>
                            <div className="col-span-3 text-xs font-medium text-gray-700">
                                Chart Of Accounts
                            </div>
                            <div className="col-span-1 text-xs font-medium text-gray-700">
                                Amount
                            </div>
                            <div className="col-span-1 text-xs font-medium text-gray-700 text-right">
                                Action
                            </div>
                        </div>

                        {/* Transaction Rows - with separate scroll */}
                        <div className="border-b pb-3">
                            <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2">
                            {formRows.map((row, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-end border-b pb-3">
                                    {/* Row Number */}
                                    <div className="col-span-1">
                                        <div className="text-xs font-medium text-gray-700 bg-gray-100 rounded px-2 py-2 text-center">
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* Transaction Code */}
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            value={row.transactionCode}
                                            onChange={(e) =>
                                                handleRowChange(index, "transactionCode", e.target.value)
                                            }
                                            placeholder="TUI001"
                                            className={`w-full px-2 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
                                                errors[`${index}-transactionCode`]
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                            }`}
                                        />
                                        {errors[`${index}-transactionCode`] && (
                                            <p className="text-red-500 text-xs mt-0.5">
                                                {errors[`${index}-transactionCode`]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Transaction Type */}
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            value={row.transactionType}
                                            onChange={(e) =>
                                                handleRowChange(index, "transactionType", e.target.value)
                                            }
                                            placeholder="Tuition Payment"
                                            className={`w-full px-2 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
                                                errors[`${index}-transactionType`]
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                            }`}
                                        />
                                        {errors[`${index}-transactionType`] && (
                                            <p className="text-red-500 text-xs mt-0.5">
                                                {errors[`${index}-transactionType`]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Transaction Group */}
                                    <div className="col-span-2">
                                        <select
                                            value={row.transactionGroup}
                                            onChange={(e) =>
                                                handleRowChange(index, "transactionGroup", e.target.value)
                                            }
                                            className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Enrollment">Enrollment</option>
                                            <option value="Other Fees">Other Fees</option>
                                        </select>
                                    </div>

                                    {/* COA Per Row */}
                                    <div className="col-span-3">
                                        <SearchableSelect
                                            options={coaOptions}
                                            value={row.coaOption}
                                            onChange={(option) => {
                                                handleRowChange(index, "coaOption", option);
                                            }}
                                            placeholder="Search COA..."
                                            showSearchIcon={true}
                                            errors={!!errors[`${index}-coaOption`]}
                                            errorMessage={errors[`${index}-coaOption`] || ""}
                                            width="100%"
                                        />
                                    </div>

                                    {/* Fee Amount */}
                                    <div className="col-span-1">
                                        <input
                                            type="number"
                                            value={row.feeAmount}
                                            onChange={(e) =>
                                                handleRowChange(index, "feeAmount", e.target.value)
                                            }
                                            placeholder={row.transactionType.trim().toLowerCase() === "assessment plan" ? "N/A" : "0.00"}
                                            step="0.01"
                                            disabled={row.transactionType.trim().toLowerCase() === "assessment plan"}
                                            className={`w-full px-2 py-2 text-sm border rounded focus:outline-none focus:ring-2 ${
                                                row.transactionType.trim().toLowerCase() === "assessment plan"
                                                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : errors[`${index}-feeAmount`]
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                            }`}
                                        />
                                        {errors[`${index}-feeAmount`] && (
                                            <p className="text-red-500 text-xs mt-0.5">
                                                {errors[`${index}-feeAmount`]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Delete Button */}
                                    <div className="col-span-1 flex justify-end">
                                        {formRows.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveRow(index)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded"
                                                title="Delete Row"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>

                        {/* Add Row Button */}
                        <button
                            onClick={handleAddRow}
                            className="w-full px-3 py-2 text-sm border-2 border-dashed border-blue-300 text-blue-600 rounded hover:bg-blue-50"
                        >
                            + Add Row
                        </button>

                        {/* Confirmation Prompt */}
                        {showConfirm && (
                            <div className="border border-yellow-400 bg-yellow-50 rounded-lg p-4 mt-2">
                                <div className="flex items-start gap-3">
                                    <div className="text-yellow-500 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-yellow-800">
                                            Are you sure you want to save?
                                        </p>
                                        <p className="text-xs text-yellow-700 mt-1">
                                            You are about to save <strong>{formRows.length}</strong> transaction{formRows.length > 1 ? "s" : ""} for <strong>SY {selectedSY}</strong>
                                            {selectedCampus ? ` — ${selectedCampus.label}` : ""}. This action cannot be undone.
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                                            >
                                                Yes, Save
                                            </button>
                                            <button
                                                onClick={() => setShowConfirm(false)}
                                                className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
                                            >
                                                Go Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                }
            />
        </div>
    );
};

export default TransactionCoaDataTable;
