import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { 
    CheckCircle, 
    XCircle,
    Search,
    X,
    Briefcase
} from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchPayrollProcessTable,
    approvePayrollBatch,
    rejectPayrollBatch,
} from "../../states/FinanceState/Action";
import { showToast } from "../../states/NotificationState/Action";

const PayrollProcessDataTable = ({ statusFilter = '' }) => {
    console.log(statusFilter);
    const dispatch = useDispatch();

    // Redux state
    const payrollTableState = useSelector((state) => state.finance?.payrollProcessTable || {});
    const { loading, data: tableData, totalRecords } = payrollTableState;

    // Local state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [actionLoading, setActionLoading] = useState({});
    
    // Modal states
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    // Fetch data on mount and when dependencies change
    useEffect(() => {
        dispatch(fetchPayrollProcessTable(page, pageSize, search, statusFilter));
    }, [dispatch, page, pageSize, search, statusFilter]);

    // Handlers
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePerRowsChange = (newPageSize, newPage) => {
        setPageSize(newPageSize);
        setPage(newPage);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleApproveClick = (row) => {
        setSelectedBatch(row);
        setApproveModalOpen(true);
    };

    const handleRejectClick = (row) => {
        setSelectedBatch(row);
        setRejectionReason("");
        setRejectModalOpen(true);
    };

    const handleApproveSubmit = async () => {
        if (!selectedBatch) return;

        setActionLoading(prev => ({ ...prev, [selectedBatch.PayrollMasterId]: 'approve' }));
        const remarks = "Approved by Finance Head";
        const result = await dispatch(approvePayrollBatch(selectedBatch.PayrollMasterId, remarks));

        if (result.ok) {
            dispatch(showToast("success", result.message || "Payroll batch approved successfully"));
            setApproveModalOpen(false);
            // Refresh table
            dispatch(fetchPayrollProcessTable(page, pageSize, search, statusFilter));
        } else {
            dispatch(showToast("error", result.error || "Failed to approve payroll batch"));
        }
        
        setActionLoading(prev => {
            const newState = { ...prev };
            delete newState[selectedBatch.PayrollMasterId];
            return newState;
        });
    };

    const handleRejectSubmit = async () => {
        if (!selectedBatch || !rejectionReason.trim()) {
            dispatch(showToast("error", "Please provide a rejection reason"));
            return;
        }

        setActionLoading(prev => ({ ...prev, [selectedBatch.PayrollMasterId]: 'reject' }));
        
        const result = await dispatch(
            rejectPayrollBatch({
                batchId: selectedBatch.PayrollMasterId,
                reason: rejectionReason.trim(),
            })
        );

        if (result.ok) {
            dispatch(showToast("success", result.message || "Payroll batch rejected successfully"));
            setRejectModalOpen(false);
            // Refresh table
            dispatch(fetchPayrollProcessTable(page, pageSize, search, statusFilter));
        } else {
            dispatch(showToast("error", result.error || "Failed to reject payroll batch"));
        }
        
        setActionLoading(prev => {
            const newState = { ...prev };
            delete newState[selectedBatch.PayrollMasterId];
            return newState;
        });
    };

    const handleClearFilters = () => {
        setSearch("");
        setPage(1);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount || 0);
    };

    // Table columns - matching PayrollBatchDto from backend
    const columns = [
        {
            name: "Batch ID",
            selector: (row) => row.PayrollMasterId,
            sortable: true,
            width: "100px",
            cell: (row) => (
                <span className="font-semibold text-gray-800">
                    #{row.PayrollMasterId}
                </span>
            ),
        },
        {
            name: "Period",
            selector: (row) => row.PeriodName,
            sortable: true,
            wrap: true,
            width: "180px",
            cell: (row) => (
                <div className="font-medium text-gray-900">
                    {row.PeriodName}
                </div>
            ),
        },
        {
            name: "Employee Count",
            selector: (row) => row.EmployeeCount,
            sortable: true,
            center: true,
            width: "140px",
            cell: (row) => (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                    {row.EmployeeCount}
                </span>
            ),
        },
        {
            name: "Gross Pay",
            selector: (row) => row.TotalGrossPay,
            sortable: true,
            right: true,
            width: "140px",
            cell: (row) => (
                <span className="font-semibold text-gray-700">
                    {formatCurrency(row.TotalGrossPay)}
                </span>
            ),
        },
        {
            name: "Deductions",
            selector: (row) => row.TotalDeductions,
            sortable: true,
            right: true,
            width: "140px",
            cell: (row) => (
                <span className="font-semibold text-red-600">
                    {formatCurrency(row.TotalDeductions)}
                </span>
            ),
        },
        {
            name: "Net Pay",
            selector: (row) => row.TotalNetPay,
            sortable: true,
            right: true,
            width: "150px",
            cell: (row) => (
                <span className="font-bold text-green-700">
                    {formatCurrency(row.TotalNetPay)}
                </span>
            ),
        },
        {
            name: "Status",
            selector: (row) => row.PayrollStatus,
            sortable: true,
            center: true,
            width: "120px",
            cell: (row) => {
                // PayrollStatus: P=Pending, Y=Approved, C=Cancelled/Rejected
                // ActiveStatus: true/false
                const payrollStatus = row.PayrollStatus;
                const isActive = row.ActiveStatus;
                
                let statusText = "";
                let statusClass = "";
                
                if (!isActive) {
                    statusText = "Inactive";
                    statusClass = "bg-gray-100 text-gray-800";
                } else if (isActive === "P") {
                    statusText = "Pending";
                    statusClass = "bg-yellow-100 text-yellow-800";
                } else if (isActive === "Y") {
                    statusText = "Approved";
                    statusClass = "bg-green-100 text-green-800";
                } else if (isActive === "C") {
                    statusText = "Rejected";
                    statusClass = "bg-red-100 text-red-800";
                } else {
                    statusText = "Unknown";
                    statusClass = "bg-gray-100 text-gray-800";
                }
                
                return (
                    <span className={`px-3 py-1 rounded-full font-semibold text-xs uppercase ${statusClass}`}>
                        {statusText}
                    </span>
                );
            },
        },
        {
            name: "Created By",
            selector: (row) => row.CreatedByFullName,
            sortable: true,
            width: "150px",
            wrap: true,
            cell: (row) => (
                <div className="text-sm text-gray-700">
                    {row.CreatedByFullName || '-'}
                </div>
            ),
        },
        {
            name: "Created Date",
            selector: (row) => row.DateCreated,
            sortable: true,
            width: "130px",
            cell: (row) => {
                const date = row.DateCreated;
                return date ? new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) : '-';
            },
        },
        {
            name: "Actions",
            center: true,
            width: "180px",
            cell: (row) => {
                // Check if pending: PayrollStatus === "P" and ActiveStatus === true
                const isPending = row.ActiveStatus === "P";
                const isLoadingApprove = actionLoading[row.PayrollMasterId] === 'approve';
                const isLoadingReject = actionLoading[row.PayrollMasterId] === 'reject';

                return (
                    <div className="flex gap-2 items-center justify-center">
                        {/* Approve Button - Only for Pending */}
                        {isPending && (
                            <button
                                onClick={() => handleApproveClick(row)}
                                disabled={isLoadingApprove || isLoadingReject}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                title="Approve Payroll"
                            >
                                {isLoadingApprove ? 'Approving...' : 'Approve'}
                            </button>
                        )}

                        {/* Reject Button - Only for Pending */}
                        {isPending && (
                            <button
                                onClick={() => handleRejectClick(row)}
                                disabled={isLoadingApprove || isLoadingReject}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                title="Reject Payroll"
                            >
                                {isLoadingReject ? 'Rejecting...' : 'Reject'}
                            </button>
                        )}

                        {/* Show dash if not pending */}
                        {!isPending && (
                            <span className="text-xs text-gray-400">-</span>
                        )}
                    </div>
                );
            },
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
                                <Briefcase size={20} className="sm:w-6 sm:h-6" />
                                Payroll Batch Approval Workflow
                            </h2>
                            <p className="text-green-100 text-xs sm:text-sm mt-1">
                                Review and approve payroll batches generated by the HR department
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 text-white">
                                <p className="text-[10px] sm:text-xs font-medium">Total Records</p>
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
                                placeholder="Search by batch ID, period, or department..."
                                value={search}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-2">
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
                            data={tableData || []}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRecords}
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                            paginationPerPage={pageSize}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            customStyles={customStyles}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            noDataComponent={
                                <div className="py-12 sm:py-16 text-center px-4">
                                    <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500 font-medium text-base sm:text-lg">No payroll batches found</p>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                                        Payroll batches submitted by HR will appear here for approval.
                                    </p>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Approve Confirmation Modal */}
            <ModalComponent
                isOpen={approveModalOpen}
                onClose={() => setApproveModalOpen(false)}
                title="Approve Payroll Batch"
                size="w-full max-w-md"
                body={
                    <div className="space-y-4 text-left">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                            <p className="text-sm text-yellow-700 font-medium">
                                ⚠ Warning: This action cannot be undone
                            </p>
                        </div>
                        <p className="text-gray-700 text-sm">
                            Are you sure you want to approve this payroll batch? Once approved, this action cannot be reversed.
                        </p>
                        {selectedBatch && (
                            <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm border border-blue-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Batch ID:</span>
                                    <span className="font-semibold">#{selectedBatch.PayrollMasterId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Period:</span>
                                    <span className="font-semibold">{selectedBatch.PeriodName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Employees:</span>
                                    <span className="font-semibold">{selectedBatch.EmployeeCount}</span>
                                </div>
                                <div className="flex justify-between border-t border-blue-200 pt-2">
                                    <span className="text-gray-600 font-semibold">Total Net Pay:</span>
                                    <span className="font-bold text-green-700">{formatCurrency(selectedBatch.TotalNetPay)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                }
                buttons={[
                    {
                        label: "Cancel",
                        type: "default",
                        closeOnClick: true,
                        onClick: () => setApproveModalOpen(false),
                    },
                    {
                        label: actionLoading[selectedBatch?.PayrollMasterId] === 'approve' ? "Approving..." : "Confirm Approval",
                        type: "green",
                        closeOnClick: false,
                        onClick: handleApproveSubmit,
                    },
                ]}
            />

            {/* Reject Confirmation Modal */}
            <ModalComponent
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                title="Reject Payroll Batch"
                size="w-full max-w-md"
                body={
                    <div className="space-y-4 text-left">
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                            <p className="text-sm text-red-700 font-medium">
                                ✕ Warning: This will reject the payroll batch
                            </p>
                        </div>
                        <p className="text-gray-700 text-sm">
                            Please provide a reason for rejecting this payroll batch. This will be sent back to HR for revision.
                        </p>
                        {selectedBatch && (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm border border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Batch ID:</span>
                                    <span className="font-semibold">#{selectedBatch.PayrollMasterId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Period:</span>
                                    <span className="font-semibold">{selectedBatch.PeriodName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Employees:</span>
                                    <span className="font-semibold">{selectedBatch.EmployeeCount}</span>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rejection Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={3}
                                placeholder="e.g., incorrect calculations, missing documentation..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Cancel",
                        type: "default",
                        closeOnClick: true,
                        onClick: () => setRejectModalOpen(false),
                    },
                    {
                        label: actionLoading[selectedBatch?.PayrollMasterId] === 'reject' ? "Rejecting..." : "Confirm Rejection",
                        type: "red",
                        closeOnClick: false,
                        onClick: handleRejectSubmit,
                    },
                ]}
            />
        </div>
    );
};

export default PayrollProcessDataTable;
