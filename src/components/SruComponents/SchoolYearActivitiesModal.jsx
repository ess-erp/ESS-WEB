import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import {
    fetchSchoolCalendarChildData,
    fetchInsertSchoolCalendarChildData,
    fetchUpdateSchoolCalendarChildData,
    fetchDeleteSchoolCalendarChildData,
    fetchSchoolCalendarActivityData
} from "../../states/SruState/Action";
import {
    fetchCampusData
} from "../../states/OnlineApplicationState/Action";

const SchoolYearActivitiesModal = ({ isOpen, onClose, calendarId, schoolYear }) => {
    const dispatch = useDispatch();
    const schoolCalendarChildState = useSelector((state) => state.sru.schoolCalendarChildState || {});
    const insertSchoolCalendarChildState = useSelector((state) => state.sru.insertSchoolCalendarChildState || {});
    const updateSchoolCalendarChildState = useSelector((state) => state.sru.updateSchoolCalendarChildState || {});
    const deleteSchoolCalendarChildState = useSelector((state) => state.sru.deleteSchoolCalendarChildState || {});

    // Dropdowns from Redux
    const campusState = useSelector((state) => state.online.campusState || {});
    const campusList = (campusState.data || []).map((c) => ({ value: c.CampusId, label: c.CampusName }));

    const activityState = useSelector((state) => state.sru.schoolCalendarActivityState || {});
    const activityList = (activityState.data || []).map((a) => ({ value: a.ActId, label: a.ActivityName }));

    const childList = schoolCalendarChildState.data.data || [];
    const totalRows = schoolCalendarChildState.data.totalRecords || 0;
    const loading = schoolCalendarChildState.loading || false;

    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Add/Edit modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentActivityId, setCurrentActivityId] = useState(null);

    // Warning and Success modals
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [pendingAction, setPendingAction] = useState(null); // 'add', 'edit', or 'delete'

    // Form fields
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [term, setTerm] = useState('');
    const [activityStartDate, setActivityStartDate] = useState('');
    const [activityEndDate, setActivityEndDate] = useState('');
    const [activityRemarks, setActivityRemarks] = useState('');

    // Delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteActivityId, setDeleteActivityId] = useState(null);
    const [deleteActivityName, setDeleteActivityName] = useState('');

    const columns = [
        { 
            name: 'Activity', 
            selector: row => row.ActivityName || row.activityName || '', 
            sortable: true,
            grow: 2
        },
        { 
            name: 'Campus', 
            selector: row => row.CampusName || row.campusName || '', 
            sortable: true,
            width: '150px'
        },
        { 
            name: 'Term', 
            selector: row => row.Term || row.term || '', 
            sortable: true,
            width: '120px'
        },
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
            name: 'Remarks', 
            selector: row => row.Remarks || row.remarks || '', 
            sortable: true,
            grow: 1
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button 
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        title="Edit"
                        onClick={() => handleEdit(row)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button 
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Move to Draft"
                        onClick={() => handleDeleteConfirm(row)}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: '100px'
        }
    ];

    // Fetch activities when modal opens or dependencies change
    useEffect(() => {
        if (isOpen && calendarId) {
            dispatch(fetchSchoolCalendarChildData(calendarId, currentPage, rowsPerPage, filterText));
        }
    }, [isOpen, calendarId, currentPage, rowsPerPage, filterText, dispatch]);

    // Refresh data when insert, update or delete is successful
    useEffect(() => {
        if (insertSchoolCalendarChildState.data && insertSchoolCalendarChildState.data.isSuccess && isOpen) {
            setSuccessMessage('Activity has been added successfully!');
            setIsSuccessModalOpen(true);
            dispatch(fetchSchoolCalendarChildData(calendarId, currentPage, rowsPerPage, filterText));
        }
    }, [insertSchoolCalendarChildState.data]);

    useEffect(() => {
        if (updateSchoolCalendarChildState.data && updateSchoolCalendarChildState.data.isSuccess && isOpen) {
            setSuccessMessage('Activity has been updated successfully!');
            setIsSuccessModalOpen(true);
            dispatch(fetchSchoolCalendarChildData(calendarId, currentPage, rowsPerPage, filterText));
        }
    }, [updateSchoolCalendarChildState.data]);

    useEffect(() => {
        if (deleteSchoolCalendarChildState.data && deleteSchoolCalendarChildState.data.isSuccess && isOpen) {
            setSuccessMessage('Activity has been moved to draft successfully!');
            setIsSuccessModalOpen(true);
            dispatch(fetchSchoolCalendarChildData(calendarId, currentPage, rowsPerPage, filterText));
        }
    }, [deleteSchoolCalendarChildState.data]);

    const handleAddActivity = () => {
        // Load dropdowns
        dispatch(fetchCampusData());
        dispatch(fetchSchoolCalendarActivityData());
        
        setEditMode(false);
        setCurrentActivityId(null);
        setSelectedActivity(null);
        setSelectedCampus(null);
        setTerm('');
        setActivityStartDate('');
        setActivityEndDate('');
        setActivityRemarks('');
        setIsFormModalOpen(true);
    };

    const handleEdit = (row) => {
        // Load dropdowns
        dispatch(fetchCampusData());
        dispatch(fetchSchoolCalendarActivityData());
        
        setEditMode(true);
        setCurrentActivityId(row.CalendarChildId || row.calendarChildId);
        
        const actId = row.ActId || row.actId;
        const actName = row.ActivityName || row.activityName;
        setSelectedActivity(actId && actName ? { value: actId, label: actName } : null);
        
        const campId = row.CampusId || row.campusId;
        const campName = row.CampusName || row.campusName;
        setSelectedCampus(campId && campName ? { value: campId, label: campName } : null);
        
        setTerm(row.Term || row.term || '');
        setActivityStartDate(row.StartDate || row.startDate || '');
        setActivityEndDate(row.EndDate || row.endDate || '');
        setActivityRemarks(row.Remarks || row.remarks || '');
        setIsFormModalOpen(true);
    };

    const handleDeleteConfirm = (row) => {
        setDeleteActivityId(row.CalendarChildId || row.calendarChildId);
        setDeleteActivityName(row.ActivityName || row.activityName || '');
        setIsDeleteModalOpen(true);
    };

    const handleSubmitActivity = () => {
        // Validate required fields
        if (!selectedActivity || !selectedCampus) {
            alert('Please fill in all required fields (Activity, Campus)');
            return;
        }

        // Close form modal and open warning modal
        setIsFormModalOpen(false);
        setPendingAction(editMode ? 'edit' : 'add');
        setIsWarningModalOpen(true);
    };

    const handleConfirmDelete = () => {
        setPendingAction('delete');
        setIsDeleteModalOpen(false);
        setIsWarningModalOpen(true);
    };

    const handleConfirmAction = () => {
        if (pendingAction === 'edit') {
            // UPDATE existing activity
            const payload = {
                gradingPeriod: term || '',
                startDate: activityStartDate || '',
                endDate: activityEndDate || '',
                remarks: activityRemarks || '',
                createdByUserId: parseInt(sessionStorage.getItem('userId')) || 0
            };
            dispatch(fetchUpdateSchoolCalendarChildData(currentActivityId, payload));
        } else if (pendingAction === 'add') {
            // INSERT new activity
            const payload = {
                calendarId: calendarId,
                campusId: selectedCampus.value,
                actId: selectedActivity.value,
                term: term || '',
                startDate: activityStartDate || '',
                endDate: activityEndDate || '',
                remarks: activityRemarks || '',
                createdByUserId: parseInt(sessionStorage.getItem('userId')) || 0
            };
            dispatch(fetchInsertSchoolCalendarChildData(payload));
        } else if (pendingAction === 'delete') {
            // DELETE (move to draft) activity
            const userId = parseInt(sessionStorage.getItem('userId')) || 0;
            dispatch(fetchDeleteSchoolCalendarChildData(deleteActivityId, userId));
            setDeleteActivityId(null);
            setDeleteActivityName('');
        }
        
        setIsWarningModalOpen(false);
        setPendingAction(null);
    };

    if (!isOpen) return null;

    return (
        <>
            <ModalComponent
                isOpen={isOpen}
                onClose={onClose}
                title={`Activities - ${schoolYear}`}
                size="w-full max-w-6xl"
                maxHeight="90vh"
                body={
                    <div className="text-left">
                        <div className="mb-4 flex items-center justify-between">
                            <button
                                onClick={handleAddActivity}
                                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                Add New Activity
                            </button>
                            <input
                                type="text"
                                placeholder="Search activities..."
                                className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs"
                                value={filterText}
                                onChange={(e) => {
                                    setFilterText(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
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
                                    data={childList}
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
                }
                buttons={[
                    { label: "Close", type: "red", onClick: onClose }
                ]}
            />

            {/* Add/Edit Activity Modal */}
            <ModalComponent
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title={editMode ? "Edit Activity" : "Add New Activity"}
                size="w-[800px]"
                body={
                    <div className="space-y-4">
                        {/* First Row - 3 columns */}
                        <div className="grid grid-cols-3 gap-4">
                            <SearchableSelect
                                options={activityList}
                                value={selectedActivity}
                                onChange={(v) => setSelectedActivity(v)}
                                placeholder="-- Select Activity --"
                                label="Activity"
                                required
                                isDisabled={editMode}
                            />
                            <SearchableSelect
                                options={campusList}
                                value={selectedCampus}
                                onChange={(v) => setSelectedCampus(v)}
                                placeholder="-- Select Campus --"
                                label="Campus"
                                required
                                isDisabled={editMode}
                            />
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Term / Grading Period</span>
                                <input
                                    type="text"
                                    className="border p-2 rounded"
                                    placeholder="e.g., 1st Semester"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />
                            </label>
                        </div>

                        {/* Second Row - 3 columns */}
                        <div className="grid grid-cols-3 gap-4">
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Start Date</span>
                                <input
                                    type="date"
                                    className="border p-2 rounded"
                                    value={activityStartDate}
                                    onChange={(e) => setActivityStartDate(e.target.value)}
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">End Date</span>
                                <input
                                    type="date"
                                    className="border p-2 rounded"
                                    value={activityEndDate}
                                    onChange={(e) => setActivityEndDate(e.target.value)}
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Remarks</span>
                                <input
                                    type="text"
                                    className="border p-2 rounded"
                                    placeholder="Optional remarks"
                                    value={activityRemarks}
                                    onChange={(e) => setActivityRemarks(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                }
                buttons={[
                    { label: editMode ? "Update" : "Add", type: "green", onClick: handleSubmitActivity },
                    { label: "Cancel", type: "red", onClick: () => setIsFormModalOpen(false) },
                ]}
            />

            {/* Move to Draft Confirmation Modal */}
            <ModalComponent
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Move to Draft"
                body={
                    <div className="text-center py-4">
                        <p className="text-lg mb-2">Are you sure you want to move this activity to draft?</p>
                        <p className="font-semibold text-orange-600">{deleteActivityName}</p>
                        <p className="text-sm text-gray-600 mt-2">This activity will be moved to draft status and won't be visible in the active list.</p>
                    </div>
                }
                buttons={[
                    { label: "Move to Draft", type: "red", onClick: handleConfirmDelete },
                    { label: "Cancel", type: "blue", onClick: () => setIsDeleteModalOpen(false) },
                ]}
            />

            {/* Warning Modal */}
            <ModalComponent
                isOpen={isWarningModalOpen}
                onClose={() => setIsWarningModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Warning</span>}
                body={
                    pendingAction === 'delete' 
                        ? "Are you sure you want to move this activity to draft?"
                        : pendingAction === 'edit'
                        ? "Are you sure you want to update this activity?"
                        : "Are you sure you want to save this activity?"
                }
                buttons={[
                    { label: "Yes", type: "green", onClick: handleConfirmAction },
                    { label: "No", type: "red", onClick: () => setIsWarningModalOpen(false) },
                ]}
            />

            {/* Success Modal */}
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={successMessage}
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) },
                ]}
            />
        </>
    );
};

export default SchoolYearActivitiesModal;
