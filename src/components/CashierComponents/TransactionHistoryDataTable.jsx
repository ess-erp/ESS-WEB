import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, AlertTriangle } from 'lucide-react';
import OutlineBlueBtn from '../ButtonsComponents/OutlineBlueBtn';
import OutlineRedBtn from '../ButtonsComponents/OutlineRedBtn';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { fetchTransactionHistoryData, fetchCancelTransactionData } from "../../states/CashierState/Action";
import { showToast } from "../../states/NotificationState/Action";

const TransactionHistoryDataTable = () => {
    const dispatch = useDispatch();
    const tableState = useSelector((state) => state.cashier.transactionHistoryState || {});
    const table = tableState.data.data || [];
    const totalRows = tableState.data.totalRecords || 0;
    const loading = tableState.loading || false;

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tempStartDate, setTempStartDate] = useState('');
    const [tempEndDate, setTempEndDate] = useState('');
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Cancel transaction modal
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const columns = [
        { name: 'Reference Number', selector: row => row.ReferenceNo, sortable: true, wrap: true, minWidth: '150px' },
        { 
            name: 'Fullname', 
            selector: row => `${row.Lname}, ${row.Fname} ${row.Mname || ''}`, 
            sortable: true, 
            wrap: true,
            minWidth: '200px'
        },
        { name: 'SI Number', selector: row => row.OrNumberUsed, sortable: true, wrap: true, minWidth: '120px' },
        { name: 'Transaction Type', selector: row => row.TypeOfTransaction, sortable: true, wrap: true, minWidth: '150px' },
        { 
            name: 'Amount', 
            selector: row => row.Amount, 
            sortable: true, 
            wrap: true,
            minWidth: '120px',
            cell: row => `₱${Number(row.Amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        },
        { name: 'Mode of Payment', selector: row => row.ModeOfPayment, sortable: true, wrap: true, minWidth: '150px' },
        { name: 'Campus', selector: row => row.CampusName, sortable: true, wrap: true, minWidth: '150px' },
        { name: 'Level', selector: row => row.LevelName, sortable: true, wrap: true, minWidth: '100px' },
        { name: 'Student Type', selector: row => row.StudentType, sortable: true, wrap: true, minWidth: '120px' },
        { 
            name: 'Date Created', 
            selector: row => new Date(row.DateCreated).toLocaleDateString(), 
            sortable: true, 
            wrap: true,
            minWidth: '120px'
        },
        {
            name: 'Status',
            selector: row => row.ActiveStatus,
            sortable: true,
            minWidth: '100px',
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.ActiveStatus === 'Y' 
                        ? 'bg-green-100 text-green-700' 
                        : row.ActiveStatus === 'C'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {row.ActiveStatus === 'Y' ? 'Active' : row.ActiveStatus === 'C' ? 'Cancelled' : 'Pending'}
                </span>
            )
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    {row.ActiveStatus !== 'C' && (
                        <button
                            onClick={() => handleOpenCancelModal(row)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Transaction"
                        >
                            <XCircle size={18} />
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            minWidth: '100px',
            center: true,
        }
    ];

    // Fetch server data whenever dependencies change
    useEffect(() => {
        dispatch(fetchTransactionHistoryData(
            startDate,
            endDate,
            currentPage,
            rowsPerPage,
            filterText
        ));
    }, [startDate, endDate, currentPage, rowsPerPage, filterText, dispatch]);

    const handleSubmit = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        setCurrentPage(1);
        setIsModalOpen(false);
    };

    const handleOpenCancelModal = (row) => {
        setSelectedTransaction(row);
        setIsCancelModalOpen(true);
    };

    const handleCancelTransaction = async () => {
        if (!selectedTransaction) return;

        setCancelling(true);
        try {
            const result = await dispatch(fetchCancelTransactionData(selectedTransaction.TransId));
            
            if (result.ok) {
                dispatch(showToast("success", "Transaction cancelled successfully"));
                setIsCancelModalOpen(false);
                setSelectedTransaction(null);
                // Refresh the table
                dispatch(fetchTransactionHistoryData(
                    startDate,
                    endDate,
                    currentPage,
                    rowsPerPage,
                    filterText
                ));
            } else {
                dispatch(showToast("error", result.data?.message || "Failed to cancel transaction"));
            }
        } catch (error) {
            dispatch(showToast("error", "An error occurred while cancelling transaction"));
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div>
            <div className="overflow-x-auto pt-2">
                <div className="p-6 bg-white rounded shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-green-500">
                            Transaction History Table
                        </h2>

                        <div className="flex items-center gap-2">
                            <OutlineBlueBtn label="Date Range" onClick={() => setIsModalOpen(true)} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs"
                                value={filterText}
                                onChange={(e) => {
                                    setFilterText(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage + filterText}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DataTable
                                columns={columns}
                                data={table}
                                progressPending={loading}
                                pagination
                                paginationServer
                                paginationTotalRows={totalRows}
                                paginationDefaultPage={currentPage}
                                onChangePage={(page) => setCurrentPage(page)}
                                onChangeRowsPerPage={(newPerPage, page) => {
                                    setRowsPerPage(newPerPage);
                                    setCurrentPage(page);
                                }}
                                highlightOnHover
                                responsive
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Date Range Modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Please choose date range"
                body={
                    <div className="flex flex-col gap-2">
                        <label className="flex flex-col">
                            Start Date:
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={tempStartDate}
                                onChange={(e) => setTempStartDate(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col">
                            End Date:
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={tempEndDate}
                                onChange={(e) => setTempEndDate(e.target.value)}
                            />
                        </label>
                    </div>
                }
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmit },
                    { label: "Cancel", type: "red", onClick: () => setIsModalOpen(false) },
                ]}
            />

            {/* Cancel Transaction Warning Modal */}
            <ModalComponent
                isOpen={isCancelModalOpen}
                onClose={() => {
                    setIsCancelModalOpen(false);
                    setSelectedTransaction(null);
                }}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-red-100 text-red-600 rounded-lg p-2">
                            <AlertTriangle size={20} />
                        </div>
                        <span className="font-bold text-red-700">Cancel Transaction</span>
                    </div>
                }
                size="md"
                body={
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
                                <div>
                                    <p className="font-semibold text-yellow-900 mb-2">Warning: This action cannot be undone!</p>
                                    <p className="text-sm text-yellow-800">
                                        You are about to cancel this transaction. The SI/OR number will be marked as cancelled
                                        and cannot be used again.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {selectedTransaction && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-3">Transaction Details:</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Reference No:</span>
                                        <span className="font-medium">{selectedTransaction.ReferenceNo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">OR Number:</span>
                                        <span className="font-medium">{selectedTransaction.OrNumberUsed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Student:</span>
                                        <span className="font-medium">
                                            {`${selectedTransaction.Lname}, ${selectedTransaction.Fname} ${selectedTransaction.Mname || ''}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-medium text-green-600">
                                            ₱{Number(selectedTransaction.Amount || 0).toLocaleString('en-PH', { 
                                                minimumFractionDigits: 2, 
                                                maximumFractionDigits: 2 
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-gray-600">
                            Are you sure you want to proceed with cancelling this transaction?
                        </p>
                    </div>
                }
                buttons={[
                    { 
                        label: cancelling ? "Cancelling..." : "Yes, Cancel Transaction", 
                        type: "red", 
                        onClick: handleCancelTransaction,
                        disabled: cancelling
                    },
                    { 
                        label: "No, Go Back", 
                        type: "green", 
                        onClick: () => {
                            setIsCancelModalOpen(false);
                            setSelectedTransaction(null);
                        },
                        disabled: cancelling
                    },
                ]}
                
            />
        </div>
    );
};

export default TransactionHistoryDataTable;
