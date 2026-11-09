import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Eye, CheckCircle, XCircle, FileDown } from "lucide-react";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import RedBtn from "../ButtonsComponents/RedBtn";
import YellowBtn from "../ButtonsComponents/YellowBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import PayrollDetailsModal from "./PayrollDetailsModal";
import {
    fetchPayrollProcessTable,
    approvePayrollBatch,
    rejectPayrollBatch,
    exportPayrollReport,
} from "../../states/FinanceState/Action";
import { showToast } from "../../states/NotificationState/Action";

const PayrollProcessDataTable = ({ statusFilter = '' }) => {
    const dispatch = useDispatch();

    // Redux state
    const payrollTableState = useSelector((state) => state.finance?.payrollProcessTable || {});
    const { loading, data: tableData, totalRecords } = payrollTableState;

    // Local state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    // Modal states
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    
    // Form states
    const [approvalRemarks, setApprovalRemarks] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch data
    const fetchData = useCallback(() => {
        dispatch(fetchPayrollProcessTable(page, pageSize, search, statusFilter));
    }, [dispatch, page, pageSize, search, statusFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    const handleViewDetails = (row) => {
        setSelectedBatch(row);
        setDetailsModalOpen(true);
    };

    const handleApproveClick = (row) => {
        setSelectedBatch(row);
        setApprovalRemarks("");
        setApproveModalOpen(true);
    };

    const handleRejectClick = (row) => {
        setSelectedBatch(row);
        setRejectionReason("");
        setRejectModalOpen(true);
    };

    const handleApproveSubmit = async () => {
        if (!selectedBatch) return;

        setActionLoading(true);
        const result = await dispatch(
            approvePayrollBatch({
                batchId: selectedBatch.BatchId || selectedBatch.batchId,
                remarks: approvalRemarks,
            })
        );

        if (result.ok) {
            dispatch(showToast("success", result.message || "Payroll batch approved successfully"));
            setApproveModalOpen(false);
            fetchData(); // Refresh table
        } else {
            dispatch(showToast("error", result.error || "Failed to approve payroll batch"));
        }
        setActionLoading(false);
    };

    const handleRejectSubmit = async () => {
        if (!selectedBatch || !rejectionReason.trim()) {
            dispatch(showToast("error", "Please provide a rejection reason"));
            return;
        }

        setActionLoading(true);
        const result = await dispatch(
            rejectPayrollBatch({
                batchId: selectedBatch.BatchId || selectedBatch.batchId,
                reason: rejectionReason,
            })
        );

        if (result.ok) {
            dispatch(showToast("success", result.message || "Payroll batch rejected successfully"));
            setRejectModalOpen(false);
            fetchData(); // Refresh table
        } else {
            dispatch(showToast("error", result.error || "Failed to reject payroll batch"));
        }
        setActionLoading(false);
    };

    const handleExportReport = async (row, format = 'excel') => {
        const result = await dispatch(
            exportPayrollReport({
                batchId: row.BatchId || row.batchId,
                format: format,
            })
        );

        if (result.ok) {
            dispatch(showToast("success", result.message || "Report exported successfully"));
        } else {
            dispatch(showToast("error", result.error || "Failed to export report"));
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount || 0);
    };

    // Table columns
    const columns = [
        {
            name: "Batch ID",
            selector: (row) => row.BatchId || row.batchId,
            sortable: true,
            width: "100px",
            cell: (row) => (
                <span className="font-semibold text-gray-800">
                    #{row.BatchId || row.batchId}
                </span>
            ),
        },
        {
            name: "Period / Description",
            selector: (row) => row.PeriodDescription || row.periodDescription,
            sortable: true,
            wrap: true,
            width: "200px",
            cell: (row) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {row.PeriodDescription || row.periodDescription}
                    </div>
                    <div className="text-xs text-gray-500">
                        {row.SchoolYear || row.schoolYear}
                    </div>
                </div>
            ),
        },
        {
            name: "Department",
            selector: (row) => row.Department || row.department || "All",
            sortable: true,
            width: "150px",
        },
        {
            name: "Employees",
            selector: (row) => row.TotalEmployees || row.totalEmployees,
            sortable: true,
            center: true,
            width: "100px",
            cell: (row) => (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                    {row.TotalEmployees || row.totalEmployees}
                </span>
            ),
        },
        {
            name: "Total Amount",
            selector: (row) => row.TotalAmount || row.totalAmount,
            sortable: true,
            right: true,
            width: "150px",
            cell: (row) => (
                <span className="font-bold text-green-700">
                    {formatCurrency(row.TotalAmount || row.totalAmount)}
                </span>
            ),
        },
        {
            name: "Status",
            selector: (row) => row.Status || row.status,
            sortable: true,
            center: true,
            width: "120px",
            cell: (row) => {
                const status = row.Status || row.status;
                let statusClass = "";
                switch (status?.toLowerCase()) {
                    case "pending":
                        statusClass = "bg-yellow-100 text-yellow-800";
                        break;
                    case "approved":
                        statusClass = "bg-green-100 text-green-800";
                        break;
                    case "rejected":
                        statusClass = "bg-red-100 text-red-800";
                        break;
                    default:
                        statusClass = "bg-gray-100 text-gray-800";
                }
                return (
                    <span className={`px-3 py-1 rounded-full font-semibold text-xs uppercase ${statusClass}`}>
                        {status}
                    </span>
                );
            },
        },
        {
            name: "Created Date",
            selector: (row) => row.CreatedDate || row.createdDate,
            sortable: true,
            width: "130px",
            cell: (row) => {
                const date = row.CreatedDate || row.createdDate;
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
            width: "280px",
            cell: (row) => {
                const status = (row.Status || row.status)?.toLowerCase();
                const isPending = status === "pending";

                return (
                    <div className="flex gap-2 items-center justify-center">
                        {/* View Details Button */}
                        <button
                            onClick={() => handleViewDetails(row)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            title="View Details"
                        >
                            <Eye size={16} />
                            <span>View</span>
                        </button>

                        {/* Approve Button - Only for Pending */}
                        {isPending && (
                            <button
                                onClick={() => handleApproveClick(row)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                title="Approve Payroll"
                            >
                                <CheckCircle size={16} />
                                <span>Approve</span>
                            </button>
                        )}

                        {/* Reject Button - Only for Pending */}
                        {isPending && (
                            <button
                                onClick={() => handleRejectClick(row)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                title="Reject Payroll"
                            >
                                <XCircle size={16} />
                                <span>Reject</span>
                            </button>
                        )}

                        {/* Export Button */}
                        <button
                            onClick={() => handleExportReport(row, 'excel')}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Export Report"
                        >
                            <FileDown size={16} />
                        </button>
                    </div>
                );
            },
        },
    ];

    // Custom styles for DataTable
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "#f8fafc",
                borderBottomWidth: "2px",
                borderBottomColor: "#e2e8f0",
                fontSize: "14px",
                fontWeight: "700",
                color: "#1e293b",
            },
        },
        rows: {
            style: {
                minHeight: "60px",
                fontSize: "14px",
                "&:hover": {
                    backgroundColor: "#f1f5f9",
                    cursor: "pointer",
                },
            },
        },
    };

    return (
        <div className="w-full">
            {/* Search Bar */}
            <div className="mb-4 flex items-center gap-4">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search by batch ID, period, or department..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="text-sm text-gray-600">
                    Total Records: <span className="font-semibold">{totalRecords}</span>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                        <div className="py-8 text-center text-gray-500">
                            No payroll batches found
                        </div>
                    }
                />
            </div>

            {/* Payroll Details Modal */}
            {detailsModalOpen && selectedBatch && (
                <PayrollDetailsModal
                    isOpen={detailsModalOpen}
                    onClose={() => setDetailsModalOpen(false)}
                    batchId={selectedBatch.BatchId || selectedBatch.batchId}
                    batchDetails={selectedBatch}
                />
            )}

            {/* Approve Confirmation Modal */}
            <ModalComponent
                isOpen={approveModalOpen}
                onClose={() => setApproveModalOpen(false)}
                title="Approve Payroll Batch"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Are you sure you want to approve this payroll batch?
                    </p>
                    {selectedBatch && (
                        <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Batch ID:</span>
                                <span className="font-semibold">#{selectedBatch.BatchId || selectedBatch.batchId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Period:</span>
                                <span className="font-semibold">{selectedBatch.PeriodDescription || selectedBatch.periodDescription}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-semibold text-green-700">
                                    {formatCurrency(selectedBatch.TotalAmount || selectedBatch.totalAmount)}
                                </span>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Remarks (Optional)
                        </label>
                        <textarea
                            value={approvalRemarks}
                            onChange={(e) => setApprovalRemarks(e.target.value)}
                            rows={3}
                            placeholder="Add any approval remarks..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <OutlineBlueBtn
                            onClick={() => setApproveModalOpen(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </OutlineBlueBtn>
                        <GreenBtn
                            onClick={handleApproveSubmit}
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Approving..." : "Approve Payroll"}
                        </GreenBtn>
                    </div>
                </div>
            </ModalComponent>

            {/* Reject Confirmation Modal */}
            <ModalComponent
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                title="Reject Payroll Batch"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Please provide a reason for rejecting this payroll batch.
                    </p>
                    {selectedBatch && (
                        <div className="bg-red-50 p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Batch ID:</span>
                                <span className="font-semibold">#{selectedBatch.BatchId || selectedBatch.batchId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Period:</span>
                                <span className="font-semibold">{selectedBatch.PeriodDescription || selectedBatch.periodDescription}</span>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                            placeholder="Explain why this payroll batch is being rejected..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <OutlineBlueBtn
                            onClick={() => setRejectModalOpen(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </OutlineBlueBtn>
                        <RedBtn
                            onClick={handleRejectSubmit}
                            disabled={actionLoading || !rejectionReason.trim()}
                        >
                            {actionLoading ? "Rejecting..." : "Reject Payroll"}
                        </RedBtn>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default PayrollProcessDataTable;
