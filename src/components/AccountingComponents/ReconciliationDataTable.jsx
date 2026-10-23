import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, CheckSquare, Square, Calendar, FileText } from "lucide-react";
import DataTable from "react-data-table-component";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Main Component ───────────────────────────────────────────────────────────
const ReconciliationDataTable = ({ 
    data = [], 
    loading = false,
    onCheckboxChange = () => {},
    selectedRows = [],
    type = "bank", // "bank" or "gl"
    showSearch = true,
    showFilters = true
}) => {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // ── Filter Data ───────────────────────────────────────────────────────────
    const filteredData = data.filter((row) => {
        const matchesSearch = !search || 
            (row.Description || "").toLowerCase().includes(search.toLowerCase()) ||
            (row.Reference || "").toLowerCase().includes(search.toLowerCase()) ||
            (row.Amount || 0).toString().includes(search);

        const matchesStatus = !filterStatus || row.Status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // ── Calculate Totals ──────────────────────────────────────────────────────
    const selectedAmount = filteredData
        .filter(row => selectedRows.includes(row.Id || row.id))
        .reduce((sum, row) => sum + (Number(row.Amount) || 0), 0);

    const totalAmount = filteredData.reduce((sum, row) => sum + (Number(row.Amount) || 0), 0);

    // ── Handle Select All ─────────────────────────────────────────────────────
    const handleSelectAll = () => {
        const allIds = filteredData.map(row => row.Id || row.id);
        const allSelected = allIds.every(id => selectedRows.includes(id));
        
        if (allSelected) {
            // Deselect all
            onCheckboxChange(selectedRows.filter(id => !allIds.includes(id)));
        } else {
            // Select all
            onCheckboxChange([...new Set([...selectedRows, ...allIds])]);
        }
    };

    // ── Handle Individual Checkbox ────────────────────────────────────────────
    const handleCheckbox = (rowId) => {
        if (selectedRows.includes(rowId)) {
            onCheckboxChange(selectedRows.filter(id => id !== rowId));
        } else {
            onCheckboxChange([...selectedRows, rowId]);
        }
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: (
                <div className="flex items-center cursor-pointer" onClick={handleSelectAll}>
                    {filteredData.length > 0 && 
                     filteredData.every(row => selectedRows.includes(row.Id || row.id)) ? (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                    ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            ),
            width: "60px",
            cell: (row) => (
                <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleCheckbox(row.Id || row.id)}
                >
                    {selectedRows.includes(row.Id || row.id) ? (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                    ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            ),
        },
        {
            name: "Date",
            selector: (row) => row.Date || row.date,
            sortable: true,
            width: "120px",
            cell: (row) => (
                <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                        {new Date(row.Date || row.date).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                </div>
            ),
        },
        {
            name: "Description / Ref",
            selector: (row) => row.Description || row.description,
            sortable: true,
            grow: 2,
            cell: (row) => (
                <div className="flex flex-col py-2">
                    <span className="text-sm font-medium text-gray-800">
                        {row.Description || row.description || "—"}
                    </span>
                    {(row.Reference || row.reference) && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {row.Reference || row.reference}
                        </span>
                    )}
                </div>
            ),
        },
        {
            name: "Amount",
            selector: (row) => row.Amount || row.amount,
            sortable: true,
            width: "150px",
            right: true,
            cell: (row) => (
                <span className={`text-sm font-semibold ${
                    Number(row.Amount || row.amount) >= 0 
                        ? "text-green-600" 
                        : "text-red-600"
                }`}>
                    ₱{fmt(row.Amount || row.amount)}
                </span>
            ),
        },
        {
            name: "Status",
            selector: (row) => row.Status || row.status,
            sortable: true,
            width: "120px",
            cell: (row) => {
                const status = row.Status || row.status || "Uncleared";
                const colors = {
                    Cleared: "bg-green-100 text-green-700 border-green-300",
                    Uncleared: "bg-yellow-100 text-yellow-700 border-yellow-300",
                    Reconciled: "bg-blue-100 text-blue-700 border-blue-300",
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.Uncleared}`}>
                        {status}
                    </span>
                );
            },
        },
    ];

    // ── Custom Styles ─────────────────────────────────────────────────────────
    const customStyles = {
        headRow: {
            style: {
                background: "linear-gradient(to right, rgb(22, 163, 74), rgb(21, 128, 61))",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                minHeight: "52px",
                borderRadius: "8px 8px 0 0",
            },
        },
        headCells: {
            style: {
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        rows: {
            style: {
                minHeight: "56px",
                fontSize: "14px",
                color: "#374151",
                borderBottom: "1px solid #e5e7eb",
                transition: "background-color 0.2s ease",
                "&:hover": {
                    backgroundColor: "#f9fafb",
                    cursor: "pointer",
                },
            },
        },
        pagination: {
            style: {
                borderTop: "1px solid #e5e7eb",
                minHeight: "56px",
                fontSize: "14px",
            },
        },
    };

    // ── No Data Component ─────────────────────────────────────────────────────
    const noDataComponent = (
        <motion.div 
            className="flex flex-col items-center justify-center py-16 text-gray-400"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <FileText className="w-20 h-20 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">No transactions found</p>
            <p className="text-sm text-gray-400 mt-1">
                {search ? "Try adjusting your search criteria" : `No ${type === "bank" ? "bank statement" : "journal entry"} data available`}
            </p>
        </motion.div>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Search and Filter Section */}
            {(showSearch || showFilters) && (
                <div className="p-4 flex-none border-b bg-gray-50">
                    <div className="flex gap-3 items-center">
                        {/* Search */}
                        {showSearch && (
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search description, reference, or amount..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch("")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Status Filter */}
                        {showFilters && (
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            >
                                <option value="">All Status</option>
                                <option value="Cleared">Cleared</option>
                                <option value="Uncleared">Uncleared</option>
                                <option value="Reconciled">Reconciled</option>
                            </select>
                        )}
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="flex-1 overflow-y-auto">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    progressPending={loading}
                    customStyles={customStyles}
                    noDataComponent={noDataComponent}
                    highlightOnHover
                    pointerOnHover
                    dense
                />
            </div>

            {/* Footer Summary */}
            <div className="p-4 flex-none border-t bg-gray-50">
                <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-600">
                        <span className="font-medium">{selectedRows.length}</span> of{" "}
                        <span className="font-medium">{filteredData.length}</span> selected
                    </div>
                    <div className="flex gap-6">
                        <div className="text-gray-700">
                            <span className="text-xs text-gray-500 mr-2">Selected:</span>
                            <span className="font-semibold text-green-600">₱{fmt(selectedAmount)}</span>
                        </div>
                        <div className="text-gray-700">
                            <span className="text-xs text-gray-500 mr-2">Total:</span>
                            <span className="font-semibold text-gray-800">₱{fmt(totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReconciliationDataTable;
