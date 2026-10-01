import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { fetchSchoolCalendarMasterData, fetchInsertSchoolCalendarMasterData } from "../../states/SruState/Action";

const SchoolYearDataTable = ({ onViewActivities }) => {
    const dispatch = useDispatch();
    const schoolCalendarMasterState = useSelector((state) => state.sru.schoolCalendarMasterState || {});
    const insertSchoolCalendarMasterState = useSelector((state) => state.sru.insertSchoolCalendarMasterState || {});
    
    const masterList = schoolCalendarMasterState.data.data || [];
    const totalRows = schoolCalendarMasterState.data.totalRecords || 0;
    const loading = schoolCalendarMasterState.loading || false;

    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    
    // Form fields for adding new school year
    const [newSchoolYear, setNewSchoolYear] = useState('');
    const [newStartDate, setNewStartDate] = useState('');
    const [newEndDate, setNewEndDate] = useState('');

    const columns = [
        { name: 'School Year', selector: row => row.SchoolYear || row.schoolYear || '', sortable: true, width: '150px' },
        { 
            name: 'Start Date', 
            selector: row => {
                const date = row.StartDate || row.startDate;
                return date ? new Date(date).toLocaleDateString() : '';
            }, 
            sortable: true,
            width: '130px'
        },
        { 
            name: 'End Date', 
            selector: row => {
                const date = row.EndDate || row.endDate;
                return date ? new Date(date).toLocaleDateString() : '';
            }, 
            sortable: true,
            width: '130px'
        },
        { 
            name: 'Created By', 
            selector: row => row.CreatedByFullname || row.createdByFullname || '', 
            sortable: true,
            grow: 1
        },
        { 
            name: 'Date Created', 
            selector: row => {
                const date = row.DateCreated || row.dateCreated;
                return date ? new Date(date).toLocaleDateString() : '';
            }, 
            sortable: true,
            width: '130px'
        },
        {
            name: 'Actions',
            cell: (row) => (
                <button 
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="View Activities"
                    onClick={() => handleViewActivities(row)}
                >
                    <Eye size={18} />
                </button>
            ),
            ignoreRowClick: true,
            width: '100px'
        }
    ];

    // Fetch data whenever dependencies change
    useEffect(() => {
        dispatch(fetchSchoolCalendarMasterData(currentPage, rowsPerPage, filterText));
    }, [currentPage, rowsPerPage, filterText, dispatch]);

    // Refresh data when insert is successful
    useEffect(() => {
        if (insertSchoolCalendarMasterState.data && insertSchoolCalendarMasterState.data.isSuccess) {
            setIsSuccessModalOpen(true);
            dispatch(fetchSchoolCalendarMasterData(currentPage, rowsPerPage, filterText));
        }
    }, [insertSchoolCalendarMasterState.data]);

    const handleViewActivities = (row) => {
        const calendarId = row.CalendarId || row.calendarId;
        const schoolYear = row.SchoolYear || row.schoolYear;
        
        if (onViewActivities) {
            onViewActivities(calendarId, schoolYear);
        }
    };

    const handleAddSchoolYear = () => {
        setIsAddModalOpen(true);
        // Reset form
        setNewSchoolYear('');
        setNewStartDate('');
        setNewEndDate('');
    };

    const handleSubmitNewSchoolYear = () => {
        // Validate required fields
        if (!newSchoolYear || !newStartDate || !newEndDate) {
            alert('Please fill in all required fields (School Year, Start Date, End Date)');
            return;
        }

        // Close add modal and open warning modal
        setIsAddModalOpen(false);
        setIsWarningModalOpen(true);
    };

    const handleConfirmSubmit = () => {
        const payload = {
            schoolYear: newSchoolYear,
            startDate: newStartDate,
            endDate: newEndDate,
            createdByUserId: parseInt(sessionStorage.getItem('userId')) || 0
        };

        dispatch(fetchInsertSchoolCalendarMasterData(payload));
        setIsWarningModalOpen(false);
    };

    return (
        <div>
            <div className="overflow-x-auto pt-2">
                <div className="p-6 bg-white rounded shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-green-500">
                            School Year Management
                        </h2>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAddSchoolYear}
                                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                Add New School Year
                            </button>
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
                                data={masterList}
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

            {/* Add New School Year Modal */}
            <ModalComponent
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New School Year"
                body={
                    <div className="flex flex-col gap-3">
                        <label className="flex flex-col">
                            <span className="font-medium mb-1">School Year <span className="text-red-500">*</span></span>
                            <input
                                type="text"
                                className="border p-2 rounded"
                                placeholder="e.g., 2024-2025"
                                value={newSchoolYear}
                                onChange={(e) => setNewSchoolYear(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="font-medium mb-1">Start Date <span className="text-red-500">*</span></span>
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={newStartDate}
                                onChange={(e) => setNewStartDate(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="font-medium mb-1">End Date <span className="text-red-500">*</span></span>
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={newEndDate}
                                onChange={(e) => setNewEndDate(e.target.value)}
                            />
                        </label>
                    </div>
                }
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmitNewSchoolYear },
                    { label: "Cancel", type: "red", onClick: () => setIsAddModalOpen(false) },
                ]}
            />

            {/* Warning Modal */}
            <ModalComponent
                isOpen={isWarningModalOpen}
                onClose={() => setIsWarningModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Warning</span>}
                body="Are you sure you want to save this School Year?"
                buttons={[
                    { label: "Yes", type: "green", onClick: handleConfirmSubmit },
                    { label: "No", type: "red", onClick: () => setIsWarningModalOpen(false) },
                ]}
            />

            {/* Success Modal */}
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body="School Year has been saved successfully!"
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) },
                ]}
            />
        </div>
    );
};

export default SchoolYearDataTable;
