import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { X, Download, User, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { fetchPayrollBatchDetails, exportPayrollReport } from "../../states/FinanceState/Action";
import { showToast } from "../../states/NotificationState/Action";

const PayrollDetailsModal = ({ isOpen, onClose, batchId, batchDetails }) => {
    const dispatch = useDispatch();

    // Redux state
    const detailsState = useSelector((state) => state.finance?.payrollBatchDetails || {});
    const { loading, data: payrollDetails } = detailsState;

    // Local state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);

    // Fetch payroll batch details
    useEffect(() => {
        if (isOpen && batchId) {
            dispatch(fetchPayrollBatchDetails(batchId, page, pageSize));
        }
    }, [dispatch, isOpen, batchId, page, pageSize]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount || 0);
    };

    // Handle export
    const handleExport = async (format) => {
        const result = await dispatch(
            exportPayrollReport({
                batchId: batchId,
                format: format,
            })
        );

        if (result.ok) {
            dispatch(showToast("success", `Report exported successfully as ${format.toUpperCase()}`));
        } else {
            dispatch(showToast("error", result.error || "Failed to export report"));
        }
    };

    // Table columns for employee payroll items
    const columns = [
        {
            name: "Employee",
            selector: (row) => row.EmployeeName || row.employeeName,
            sortable: true,
            wrap: true,
            width: "200px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            {row.EmployeeName || row.employeeName}
                        </div>
                        <div className="text-xs text-gray-500">
                            {row.EmployeeNumber || row.employeeNumber}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            name: "Department",
            selector: (row) => row.Department || row.department,
            sortable: true,
            width: "150px",
        },
        {
            name: "Position",
            selector: (row) => row.Position || row.position,
            sortable: true,
            width: "150px",
            wrap: true,
        },
        {
            name: "Basic Salary",
            selector: (row) => row.BasicSalary || row.basicSalary,
            sortable: true,
            right: true,
            width: "130px",
            cell: (row) => (
                <span className="font-semibold text-gray-700">
                    {formatCurrency(row.BasicSalary || row.basicSalary)}
                </span>
            ),
        },
        {
            name: "Allowances",
            selector: (row) => row.TotalAllowances || row.totalAllowances,
            sortable: true,
            right: true,
            width: "120px",
            cell: (row) => (
                <div className="flex items-center gap-1 justify-end">
                    <TrendingUp size={14} className="text-green-600" />
                    <span className="text-green-600 font-medium">
                        {formatCurrency(row.TotalAllowances || row.totalAllowances)}
                    </span>
                </div>
            ),
        },
        {
            name: "Deductions",
            selector: (row) => row.TotalDeductions || row.totalDeductions,
            sortable: true,
            right: true,
            width: "120px",
            cell: (row) => (
                <div className="flex items-center gap-1 justify-end">
                    <TrendingDown size={14} className="text-red-600" />
                    <span className="text-red-600 font-medium">
                        {formatCurrency(row.TotalDeductions || row.totalDeductions)}
                    </span>
                </div>
            ),
        },
        {
            name: "Net Pay",
            selector: (row) => row.NetPay || row.netPay,
            sortable: true,
            right: true,
            width: "140px",
            cell: (row) => (
                <span className="font-bold text-green-700 text-base">
                    {formatCurrency(row.NetPay || row.netPay)}
                </span>
            ),
        },
    ];

    // Custom styles for DataTable
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "#f1f5f9",
                borderBottomWidth: "2px",
                borderBottomColor: "#cbd5e1",
                fontSize: "13px",
                fontWeight: "700",
                color: "#1e293b",
            },
        },
        rows: {
            style: {
                minHeight: "56px",
                fontSize: "13px",
                "&:hover": {
                    backgroundColor: "#f8fafc",
                },
            },
        },
    };

    // Calculate summary totals
    const summaryData = payrollDetails?.summary || {};
    const employeeList = payrollDetails?.employees || [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Payroll Batch Details
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {batchDetails?.PeriodDescription || batchDetails?.periodDescription} - 
                            Batch #{batchId}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Export Buttons */}
                        <button
                            onClick={() => handleExport('excel')}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <Download size={16} />
                            Export Excel
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <Download size={16} />
                            Export PDF
                        </button>
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                {/* Total Employees */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-600 rounded-lg">
                                            <User size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-700 font-medium">Total Employees</p>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {summaryData.totalEmployees || employeeList.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Basic Salary */}
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-600 rounded-lg">
                                            <DollarSign size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-purple-700 font-medium">Basic Salary</p>
                                            <p className="text-xl font-bold text-purple-900">
                                                {formatCurrency(summaryData.totalBasicSalary || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Allowances */}
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-green-600 rounded-lg">
                                            <TrendingUp size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-700 font-medium">Allowances</p>
                                            <p className="text-xl font-bold text-green-900">
                                                {formatCurrency(summaryData.totalAllowances || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Deductions */}
                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-red-600 rounded-lg">
                                            <TrendingDown size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-red-700 font-medium">Deductions</p>
                                            <p className="text-xl font-bold text-red-900">
                                                {formatCurrency(summaryData.totalDeductions || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Net Pay Summary */}
                            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl mb-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium mb-1">Total Net Pay</p>
                                        <p className="text-4xl font-bold">
                                            {formatCurrency(summaryData.totalNetPay || 
                                                (batchDetails?.TotalAmount || batchDetails?.totalAmount))}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-100 text-sm font-medium mb-1">Status</p>
                                        <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-semibold uppercase">
                                            {batchDetails?.Status || batchDetails?.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Employee Details Table */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Employee Payroll Breakdown
                                    </h3>
                                </div>
                                <DataTable
                                    columns={columns}
                                    data={employeeList}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={employeeList.length}
                                    onChangeRowsPerPage={(newPageSize) => setPageSize(newPageSize)}
                                    onChangePage={(newPage) => setPage(newPage)}
                                    paginationPerPage={pageSize}
                                    paginationRowsPerPageOptions={[25, 50, 100]}
                                    customStyles={customStyles}
                                    highlightOnHover
                                    responsive
                                    noDataComponent={
                                        <div className="py-8 text-center text-gray-500">
                                            No employee records found
                                        </div>
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrollDetailsModal;
