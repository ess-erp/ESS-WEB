import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import {
    fetchSchoolCalendarTableData,
    fetchSchoolCalendarActivityData,
    fetchInsertSchoolCalendarActivityData,
} from "../../states/SruState/Action";
import {
    fetchCampusData,
    fetchDivisionData,
} from "../../states/OnlineApplicationState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";

const SchoolCalendarDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;

    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;
    const [schoolCalendarList, setSchoolCalendarList] = useState([]);
    const schoolCalendarTableState = useSelector((state) => state.sru.schoolCalendarTableState || {});
    const schoolCalendarTable = schoolCalendarTableState.data.data || [];
    const schoolCalendarTotalRows = schoolCalendarTableState.data.totalRecords || 0;
    const schoolCalendarLoading = schoolCalendarTableState.loading || false;
    const [schoolCalendarCurrentPage, setSchoolCalendarCurrentPage] = useState(1);
    const [schoolCalendarRowsPerPage, setSchoolCalendarRowsPerPage] = useState(10);
    const [schoolCalendarSearchFilter, setSchoolCalendarFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchSchoolCalendarTableData(schoolCalendarCurrentPage, schoolCalendarRowsPerPage, schoolCalendarSearchFilter));
    }, [schoolCalendarCurrentPage, schoolCalendarRowsPerPage, schoolCalendarSearchFilter, dispatch]);

    useEffect(() => {
        if (schoolCalendarTable.length === 0) return;
        setSchoolCalendarList(schoolCalendarTable);
    }, [schoolCalendarTable]);

    const schoolCalendarColumn = [
        { name: 'Campus', selector: row => row.CampusName, sortable: true },
        { name: 'Division', selector: row => row.DivName, sortable: true },
        { name: 'Grading Period/Term', selector: row => row.Term, sortable: true },
        { name: 'Start Date', selector: row => formatDate(row.StartDate), sortable: true },
        { name: 'End Date', selector: row => formatDate(row.EndDate), sortable: true },
        { name: 'Remarks', selector: row => row.Remarks, sortable: true },
        { name: 'Date Created', selector: row => formatDate(row.DateCreated), sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-4 items-center">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => openRowModal(row, "view")}
                    >
                        <Eye size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "180px",
        }
    ];

    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [addNewModal, setAddNewModal] = useState(false);
    const openAddNewModal = () => {
        dispatch(fetchCampusData());
        dispatch(fetchSchoolCalendarActivityData());
        dispatch(fetchDivisionData());
        setAddNewModal(true);
    };

    const campusState = useSelector((state) => state.online.campusState || {});
    const campus = campusState.data || [];
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [campusList, setCampusList] = useState([]);

    const schoolCalendarActivityState = useSelector((state) => state.sru.schoolCalendarActivityState || {});
    const activity = schoolCalendarActivityState.data || [];
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityList, setActivityList] = useState([]);

    const divisionState = useSelector((state) => state.online.divisionState || {});
    const division = divisionState.data || [];
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [divisionList, setDivisionList] = useState([]);

    const termList = [
        {
            value: "Term1",
            label: "1st Grading Period",
        },
        {
            value: "Term2",
            label: "2nd Grading Period",
        },
        {
            value: "Term3",
            label: "3rd Grading Period",
        },
    ];
    const [selectedTerm, setSelectedTerm] = useState(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        setActivityList(
            (activity || []).map(item => ({
                value: item.ActId,
                label: item.ActivityName,
            }))
        );

        setCampusList(
            (campus || []).map(item => ({
                value: item.CampusId,
                label: item.CampusName,
            }))
        );

        setDivisionList(
            (division || []).map(item => ({
                value: item.DivId,
                label: item.DivName,
            }))
        );
    }, [activity, campus, division,]);

    const [isWarningModal, setIsWarningModal] = useState(false);
    const [isSuccessModal, setIsSuccessModal] = useState(false);

    const handleOpenWarningModal = () => {
        setIsWarningModal(true);
    };

    const handleSubmitModal = async () => {
        console.log("Test");

        const payload = {
            ActId: selectedActivity?.value,
            CampusId: selectedCampus?.value,
            DivId: selectedDivision?.value,
            GradingPeriod: selectedTerm?.value,
            StartDate: startDate,
            EndDate: endDate,
            Remarks: remarks,
            CreatedByUserId: userId,
        };

        console.log("Payload: ", payload);
        const res = await dispatch(fetchInsertSchoolCalendarActivityData(payload));

        if (res.ok) {
            setIsSuccessModal(true);
            setTimeout(() => window.location.reload(), 1000);
        }
    }
    return (
        <div>
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-white rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            School Calendar Active
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <OutlineBlueBtn
                            label="Add new"
                            onClick={openAddNewModal}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-64"
                            value={schoolCalendarSearchFilter}
                            onChange={(e) => {
                                setSchoolCalendarFilterText(e.target.value);
                                setSchoolCalendarCurrentPage(1);
                            }}
                        />
                    </div>

                </div>
                <div className="w-full">
                    <DataTable
                        columns={schoolCalendarColumn}
                        data={schoolCalendarList}
                        progressPending={schoolCalendarLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={schoolCalendarTotalRows}
                        paginationDefaultPage={schoolCalendarCurrentPage}
                        onChangePage={(page) => setSchoolCalendarCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setSchoolCalendarRowsPerPage(newPerPage);
                            setSchoolCalendarCurrentPage(page);
                        }}
                        highlightOnHover
                        responsive
                    />
                </div>
            </div>
            <ModalComponent
                isOpen={addNewModal}
                onClose={() => setAddNewModal(false)}
                title="Add School Calendar Activity"
                body={
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SearchableSelect
                            options={activityList}
                            value={selectedActivity}
                            onChange={(selected) => setSelectedActivity(selected)}
                            placeholder="-- Select School Activity --"
                            label="Select School Activity"
                        />
                        <SearchableSelect
                            options={campusList}
                            value={selectedCampus}
                            onChange={(selected) => setSelectedCampus(selected)}
                            placeholder="-- Select Campus --"
                            label="Select Campus"
                        />
                        <SearchableSelect
                            options={divisionList}
                            value={selectedDivision}
                            onChange={(selected) => setSelectedDivision(selected)}
                            placeholder="-- Select Division --"
                            label="Select Division"
                        />
                        <SearchableSelect
                            options={termList}
                            value={selectedTerm}
                            onChange={(selected) => setSelectedTerm(selected)}
                            placeholder="-- Select Grading Period/Term --"
                            label="Select Grading Period/Term"
                        />
                        <label className="flex flex-col">
                            <span className="text-sm font-medium mb-1">Start of Date</span>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded-lg border p-2"
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-medium mb-1">End of Date</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded-lg border p-2"
                            />
                        </label>
                        <div className="col-span-1 md:col-span-2 flex justify-center">
                            <label className="flex flex-col w-full max-w-md">
                                <span className="text-sm font-medium mb-1">Remarks</span>

                                <input
                                    type="text"
                                    placeholder="Enter Remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    className="w-full rounded-lg border p-2"
                                />
                            </label>
                        </div>
                    </div>
                }
                size="w-[700px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Submit", type: "green", onClick: handleOpenWarningModal },
                    { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
                ]}
            />
            <ModalComponent
                isOpen={isWarningModal}
                onClose={() => setIsWarningModal(false)}
                title={<span className="font-bold text-lg text-red-700">Warning!</span>}
                body={<p>Are you sure you want to Submit?</p>}
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmitModal },
                    { label: "Cancel", type: "red", onClick: () => setIsWarningModal(false) },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModal}
                onClose={() => setIsSuccessModal(false)}
                title={<span className="font-bold text-lg text-green-700">Success!</span>}
                body={<p>Done creating new School Calendar Activity!</p>}
            />
        </div >

    );
};

export default SchoolCalendarDataTable;