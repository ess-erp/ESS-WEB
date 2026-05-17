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
    fetchListOfSectionData,
    fetchRowSectionTableData,
    fetchRowStudentTableData,
} from "../../states/TeacherState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";

const ListOfSectionComponent = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;

    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;

    const [sectionList, setSectionList] = useState([]);
    const sectionTableState = useSelector((state) => state.teacher.listOfSectionState || {});
    const sectionTable = sectionTableState.data.data || [];
    const sectionTotalRows = sectionTableState.data.totalRecords || 0;
    const sectionLoading = sectionTableState.loading || false;
    const [sectionCurrentPage, setSectionTableCurrentPage] = useState(1);
    const [sectionRowsPerPage, setSectionTableRowsPerPage] = useState(10);
    const [sectionTableSearchFilter, setSectionTableFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchListOfSectionData(userId, sectionCurrentPage, sectionRowsPerPage, sectionTableSearchFilter));
    }, [userId, sectionCurrentPage, sectionRowsPerPage, sectionTableSearchFilter, dispatch]);

    useEffect(() => {
        if (sectionTable.length === 0) return;
        setSectionList(sectionTable);
    }, [sectionTable]);

    const sectionColumn = [
        { name: 'Section Name', selector: row => row.SectionName, sortable: true },
        { name: 'Level', selector: row => row.LevelName, sortable: true },
        { name: 'Number of Teacher Assigned', selector: row => row.NumberOfTeacher, sortable: true },
        { name: 'Number of Subject', selector: row => row.NumberOfSubject, sortable: true },
        { name: 'Number of Student', selector: row => row.NumberOfStudent, sortable: true },
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
    const [loadId, setLoadId] = useState(0);
    const [adviserName, setAdviserName] = useState("");
    const [levelName, setLevelName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const openRowModal = (row) => {
        console.log(row);
        setLoadId(row?.LoadId);
        setRowModalOpen(true);
    };
    const [activeTab, setActiveTab] = useState("faculty");



    const [sectionRowList, setSectionRowList] = useState([]);
    const sectionRowTableState = useSelector((state) => state.teacher.rowSectionTableState || {});
    const sectionRowTable = sectionRowTableState.data.data || [];
    const sectionRowTotalRows = sectionRowTableState.data.totalRecords || 0;
    const sectionRowLoading = sectionRowTableState.loading || false;
    const [sectionRowCurrentPage, setSectionRowTableCurrentPage] = useState(1);
    const [sectionRowRowsPerPage, setSectionRowTableRowsPerPage] = useState(10);
    const [sectionRowTableSearchFilter, setSectionRowTableFilterText] = useState("");


    useEffect(() => {
        if (!loadId || activeTab !== "faculty") return;
        dispatch(fetchRowSectionTableData(loadId, sectionRowCurrentPage, sectionRowsPerPage, sectionTableSearchFilter));
    }, [activeTab, loadId, sectionCurrentPage, sectionRowsPerPage, sectionTableSearchFilter, dispatch]);

    useEffect(() => {
        if (sectionRowTable.length === 0) return;
        setSectionRowList(sectionRowTable);
        setAdviserName(sectionRowTable[0].AssignedTeacher);
        setSectionName(sectionRowTable[0].SectionName);
        setLevelName(sectionRowTable[0].LevelName);
    }, [sectionRowTable]);

    const sectionRowColumn = [
        { name: 'Assigned Teacher', selector: row => row.AssignedTeacher, sortable: true },
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true },
        { name: 'Type of Subject', selector: row => row.SubjectType, sortable: true },
        { name: 'Start of time', selector: row => formatToAMPM(row.StartTime), sortable: true },
        { name: 'End of time', selector: row => formatToAMPM(row.EndTime), sortable: true },
        { name: 'Date Created', selector: row => formatDate(row.DateCreated), sortable: true },
    ];
    const [studentList, setStudentList] = useState([]);
    const studentTableState = useSelector(
        (state) => state.teacher.studentTableState || {}
    );
    const studentTable =
        studentTableState.data?.data || [];
    const studentTotalRows =
        studentTableState.data?.totalRecords || 0;
    const studentLoading =
        studentTableState.loading || false;
    const [studentCurrentPage, setStudentCurrentPage] =
        useState(1);
    const [studentRowsPerPage, setStudentRowsPerPage] =
        useState(10);
    const [studentSearchFilter, setStudentSearchFilter] =
        useState("");
    useEffect(() => {
        if (!loadId || activeTab !== "students") return;
        dispatch(fetchRowStudentTableData(loadId, studentCurrentPage, studentRowsPerPage, studentSearchFilter));
    }, [activeTab, loadId, studentCurrentPage, studentRowsPerPage, studentSearchFilter, dispatch]);

    useEffect(() => {
        if (studentTable.length === 0) return;
        setStudentList(studentTable);
        setAdviserName(studentTable[0].AssignedTeacher);
        setSectionName(studentTable[0].SectionName);
        setLevelName(studentTable[0].LevelName);
    }, [studentTable]);

    const studentColumn = [
        { name: 'Student Number', selector: row => row.StudentNumber, sortable: true },
        { name: 'Fullname', selector: row => row.StudentFullname, sortable: true },
        { name: 'Gender', selector: row => row.Gender, sortable: true },
        { name: 'Date Enrolled', selector: row => formatDate(row.DateEnrolled), sortable: true },
    ];


    return (
        <div>
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-white rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            Section Master List
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">

                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-64"
                            value={sectionTableSearchFilter}
                            onChange={(e) => {
                                setSectionTableFilterText(e.target.value);
                                setSectionTableCurrentPage(1);
                            }}
                        />
                    </div>

                </div>
                <div className="w-full">
                    <DataTable
                        columns={sectionColumn}
                        data={sectionList}
                        progressPending={sectionLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={sectionTotalRows}
                        paginationDefaultPage={sectionCurrentPage}
                        onChangePage={(page) => setSectionTableCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setSectionTableRowsPerPage(newPerPage);
                            setSectionTableCurrentPage(page);
                        }}
                        highlightOnHover
                        striped
                        responsive
                        noDataComponent="No section data."
                    />
                </div>
            </div>
            <ModalComponent
                isOpen={rowModalOpen}
                onClose={() => setRowModalOpen(false)}
                title="Section Details"
                body={
                    <div>
                        <div className="mt-6 relative overflow-hidden">
                            <div className="flex justify-center gap-6 mb-4">
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Adviser Name
                                    </label>

                                    <input
                                        type="text"
                                        value={adviserName || ""}
                                        disabled
                                        className="mt-2 w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Section Name
                                    </label>

                                    <input
                                        type="text"
                                        value={sectionName || ""}
                                        disabled
                                        className="mt-2 w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Level Name
                                    </label>
                                    <input
                                        type="text"
                                        value={levelName || ""}
                                        disabled
                                        className="mt-2 w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                            </div>
                            <hr className="my-4 border-t border-gray-300" />
                            <div className="flex gap-3 mb-4 justify-center">
                                <button
                                    onClick={() => setActiveTab("faculty")}
                                    className={`px-4 py-2 rounded text-sm font-medium transition
                                        ${activeTab === "faculty"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Assigned Teachers & Subjects
                                </button>

                                <button
                                    onClick={() => setActiveTab("students")}
                                    className={`px-4 py-2 rounded text-sm font-medium transition
                                        ${activeTab === "students"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Student List
                                </button>
                            </div>
                            <AnimatePresence mode="wait">

                                {activeTab === "faculty" && (
                                    <motion.div
                                        key="faculty"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <DataTable
                                            columns={sectionRowColumn}
                                            data={sectionRowList}
                                            progressPending={sectionRowLoading}
                                            pagination
                                            paginationServer
                                            paginationTotalRows={sectionRowTotalRows}
                                            paginationDefaultPage={sectionRowCurrentPage}
                                            onChangePage={(page) =>
                                                setSectionRowTableCurrentPage(page)
                                            }
                                            onChangeRowsPerPage={(newPerPage, page) => {
                                                setSectionRowTableRowsPerPage(newPerPage);
                                                setSectionRowTableCurrentPage(page);
                                            }}
                                            highlightOnHover
                                            striped
                                            responsive
                                            noDataComponent="No faculty load data."
                                        />
                                    </motion.div>
                                )}

                                {activeTab === "students" && (
                                    <motion.div
                                        key="students"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex justify-end gap-3">

                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="px-3 py-2 border border-gray-300 rounded w-64"
                                                value={studentSearchFilter}
                                                onChange={(e) => {
                                                    setStudentSearchFilter(e.target.value);
                                                    setStudentCurrentPage(1);
                                                }}
                                            />
                                        </div>
                                        <DataTable
                                            columns={studentColumn}
                                            data={studentList}
                                            progressPending={studentLoading}
                                            pagination
                                            paginationServer
                                            paginationTotalRows={studentTotalRows}
                                            paginationDefaultPage={studentCurrentPage}
                                            onChangePage={(page) =>
                                                setStudentCurrentPage(page)
                                            }
                                            onChangeRowsPerPage={(newPerPage, page) => {
                                                setStudentRowsPerPage(newPerPage);
                                                setStudentCurrentPage(page);
                                            }}
                                            highlightOnHover
                                            striped
                                            responsive
                                            noDataComponent="No student data."
                                        />
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>
                    </div>
                }
                size="w-[1200px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Cancel", type: "red", onClick: () => setRowModalOpen(false) },
                ]}
            />
        </div>
    );
};

export default ListOfSectionComponent;