import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import {
    fetchTeacherTableData,
    fetchInsertAdviserNonAdviserData,
    fetchTeacherAlreadyAssignData,
} from "../../states/AcademicState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";

const TeacherListDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;
    const formatDate = getFormatDate;

    const [teacherList, setTeacherList] = useState([]);
    const teacherTableState = useSelector((state) => state.academic.teacherTableState || {});
    const teacherTable = teacherTableState.data.data || [];
    const teacherTotalRows = teacherTableState.data.totalRecords || 0;
    const teacherLoading = teacherTableState.loading || false;
    const [searchFilterText, setSearchFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRowsPerPage, setCurrentRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchTeacherTableData(currentPage, currentRowsPerPage, searchFilterText));
    }, [currentPage, currentRowsPerPage, searchFilterText, dispatch]);

    useEffect(() => {
        if (teacherTable.length === 0) return;
        setTeacherList(teacherTable);
    }, [teacherTable]);

    const column = [
        { name: 'First name', selector: row => row.Fname, sortable: true },
        { name: 'Middle name', selector: row => row.Mname, sortable: true },
        { name: 'Last name', selector: row => row.Lname, sortable: true },
        { name: 'Division', selector: row => row.Division, sortable: true },
        { name: 'Department', selector: row => row.Department, sortable: true },
        { name: 'Date Created', selector: row => formatDate(row.DateCreated), sortable: true },
        {
            name: "Action",
            cell: row => (
                <OutlineBlueBtn
                    label="Assign"
                    onClick={() => openRowModal(row)}
                />

            )
        }
    ];

    const adviserTypeOptions = [
        { value: "Yes", label: "Adviser" },
        { value: "No", label: "Non-Adviser" }
    ];

    const [assignData, setAssignData] = useState(null);
    const [assignModal, setAssignModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [employeeId, setEmployeeId] = useState(0);

    const openRowModal = (row) => {
        console.log(row);
        setEmployeeId(row.EmployeeId);
        setAssignModal(true);
    };

    const handleWarningModal = () => {
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = async () => {
        console.log(assignData?.value);
        const res = await dispatch(fetchInsertAdviserNonAdviserData(employeeId, assignData?.value));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 2000);
            }
        }
    };


    const [assignList, setAssignList] = useState([]);
    const assignTableState = useSelector((state) => state.academic.teacherAlreadyAssignState || {});
    const assignTable = assignTableState.data.data || [];
    const assignTotalRows = assignTableState.data.totalRecords || 0;
    const assignLoading = assignTableState.loading || false;
    const [assignSearchFilterText, setAssignSearchFilterText] = useState('');
    const [assignCurrentPage, setAssignCurrentPage] = useState(1);
    const [assignCurrentRowsPerPage, setAssignCurrentRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchTeacherAlreadyAssignData(assignCurrentPage, assignCurrentRowsPerPage, assignSearchFilterText));
    }, [assignCurrentPage, assignCurrentRowsPerPage, assignSearchFilterText, dispatch]);

    useEffect(() => {
        if (assignTable.length === 0) return;
        setAssignList(assignTable);
    }, [assignTable]);

    console.log(assignTable);

    const assignColumn = [
        { name: 'First name', selector: row => row.Fname, sortable: true },
        { name: 'Middle name', selector: row => row.Mname, sortable: true },
        { name: 'Last name', selector: row => row.Lname, sortable: true },
        { name: 'Division', selector: row => row.Division, sortable: true },
        { name: 'Department', selector: row => row.Department, sortable: true },
        { name: 'Status', selector: row => row.Assign, sortable: true },
        { name: 'Date Assigned', selector: row => formatDate(row.DateAssigned), sortable: true },
    ];

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">

            <div className="px-4 py-3 border-b bg-red-50 rounded-t-lg flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-red-600">
                        List of Teachers Need to Assign
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    {/* <OutlineBlueBtn
                        label="Add new"
                        onClick={openAddNewModal}
                    /> */}

                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-3 py-2 border border-gray-300 rounded w-64"
                        value={searchFilterText}
                        onChange={(e) => {
                            setSearchFilterText(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

            </div>
            <div className="w-full overflow-x-auto">
                <DataTable
                    columns={column}
                    data={teacherList}
                    progressPending={teacherLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={teacherTotalRows}
                    paginationDefaultPage={currentPage}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setCurrentRowsPerPage(newPerPage);
                        setCurrentPage(page);
                    }}
                    highlightOnHover
                    responsive
                />
            </div>
            <div className="mt-6 px-4 py-3 border-b bg-green-50 rounded-t-lg flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-green-600">
                        List of Teachers already Assigned
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    {/* <OutlineBlueBtn
                        label="Add new"
                        onClick={openAddNewModal}
                    /> */}

                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-3 py-2 border border-gray-300 rounded w-64"
                        value={searchFilterText}
                        onChange={(e) => {
                            setSearchFilterText(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

            </div>
            <div className="w-full overflow-x-auto">
                <DataTable
                    columns={assignColumn}
                    data={assignList}
                    progressPending={assignLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={assignTotalRows}
                    paginationDefaultPage={assignCurrentPage}
                    onChangePage={(page) => setAssignCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setAssignCurrentRowsPerPage(newPerPage);
                        setAssignCurrentRowsPerPage(page);
                    }}
                    highlightOnHover
                    responsive
                />
            </div>
            <ModalComponent
                isOpen={assignModal}
                onClose={() => setAssignModal(false)}
                title={<span className="font-bold text-lg text-blue-700">Assign Teacher</span>}
                body={
                    <div className="pt-4 w-full">
                        <SearchableSelect
                            options={adviserTypeOptions}
                            value={assignData}
                            onChange={(selected) => setAssignData(selected)}
                            placeholder="-- Select Adviser or Non-Adviser --"
                            label="Select Adviser or Non-Adviser"
                        />
                    </div>
                }
                buttons={[
                    { label: "Submit", type: "green", onClick: handleWarningModal, },
                    { label: "Cancel", type: "red", onClick: () => setAssignModal(false) },
                ]}
            // size="w-[800px]"
            // maxHeight="100vh"
            />
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Warning</span>}
                body="Are you sure you want to submit?"
                buttons={[
                    { label: "Yes", type: "green", onClick: handleConfirmSubmit, },
                    { label: "No", type: "red", onClick: () => setIsModalOpen(false) },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={
                    <span className="font-bold text-lg text-green-700">
                        Success
                    </span>
                }
                body="Assinging teacher successfully submitted."
                buttons={[
                    {
                        label: "OK",
                        type: "green",
                        onClick: () => setIsSuccessModalOpen(false)
                    },
                ]}
            />
        </div>
    );
};

export default TeacherListDataTable;