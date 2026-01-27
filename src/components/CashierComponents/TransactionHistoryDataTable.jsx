import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import OutlineBlueBtn from '../ButtonsComponents/OutlineBlueBtn';
import BlueBtn from '../ButtonsComponents/BlueBtn';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { fetchTransactionHistoryData } from "../../states/CashierState/Action";

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

    const columns = [
        { name: 'Reference Number', selector: row => row.ReferenceId, sortable: true, wrap: true, },
        { name: 'Fullname', selector: row => `${row.Lname}, ${row.Fname} ${row.Mname || ''}`, sortable: true, wrap: true, },
        { name: 'OR number used', selector: row => row.OrNumberUsed, sortable: true, wrap: true, },
        { name: 'Transaction Type', selector: row => row.FromTransaction, sortable: true, wrap: true, },
        { name: 'Amount', selector: row => row.Amount, sortable: true, wrap: true, },
        { name: 'Customer Amount Paid', selector: row => row.AmountPaid, sortable: true, wrap: true, },
        { name: 'Campus', selector: row => row.CampusName, sortable: true, wrap: true, },
        { name: 'Level', selector: row => row.LevelName, sortable: true, wrap: true, },
        { name: 'Student Type', selector: row => row.StudentType, sortable: true, wrap: true, },
        { name: 'Date Created', selector: row => new Date(row.DateCreated).toLocaleDateString(), sortable: true, wrap: true, },
        // {
        //     name: 'Actions',
        //     cell: (row) => <BlueBtn label="View" onClick={() => openRow(row)} />,
        //     ignoreRowClick: true,
        // }
    ];

    // const openRow = (data) => {
    //     console.log(data);
    // };

    // Fetch server data whenever dependencies change
    const fetchData = () => {
        dispatch(fetchTransactionHistoryData(
            startDate,
            endDate,
            currentPage,
            rowsPerPage,
            filterText
        ));
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate, currentPage, rowsPerPage, filterText, dispatch]);

    // const handleButtonClick = (row) => {
    //     const url = `/sru/StudentMasterFile?StudentId=${row.StudentId}`;
    //     window.open(url, '_blank');
    // };

    const handleSubmit = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        setCurrentPage(1);
        setIsModalOpen(false);
    }
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
        </div>
    );
};

export default TransactionHistoryDataTable;