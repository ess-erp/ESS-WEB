import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Users, BookOpen, GraduationCap } from "lucide-react";
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

    // ── Main Section Table State ────────────────────────────────────────────
    const [sectionList, setSectionList] = useState([]);
    const sectionTableState = useSelector((state) => state.teacher.listOfSectionState || {});
    const sectionTable = sectionTableState.data?.data || [];
    const sectionTotalRows = sectionTableState.data?.totalRecords || 0;
    const sectionLoading = sectionTableState.loading || false;
    const [sectionCurrentPage, setSectionCurrentPage] = useState(1);
    const [sectionRowsPerPage, setSectionRowsPerPage] = useState(10);
    const [sectionSearchFilter, setSectionSearchFilter] = useState("");

    // ── Modal State ──────────────────────────────────────────────────────────
    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [loadId, setLoadId] = useState(0);
    const [adviserName, setAdviserName] = useState("");
    const [levelName, setLevelName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [activeTab, setActiveTab] = useState("faculty");

    // ── Faculty/Subject Table State ──────────────────────────────────────────
    const [sectionRowList, setSectionRowList] = useState([]);
    const sectionRowTableState = useSelector((state) => state.teacher.rowSectionTableState || {});
    const sectionRowTable = sectionRowTableState.data?.data || [];
    const sectionRowTotalRows = sectionRowTableState.data?.totalRecords || 0;
    const sectionRowLoading = sectionRowTableState.loading || false;
    const [sectionRowCurrentPage, setSectionRowCurrentPage] = useState(1);
    const [sectionRowRowsPerPage, setSectionRowRowsPerPage] = useState(10);
    const [sectionRowSearchFilter, setSectionRowSearchFilter] = useState("");

    // ── Student Table State ──────────────────────────────────────────────────
    const [studentList, setStudentList] = useState([]);
    const studentTableState = useSelector((state) => state.teacher.studentTableState || {});
    const studentTable = studentTableState.data?.data || [];
    const studentTotalRows = studentTableState.data?.totalRecords || 0;
    const studentLoading = studentTableState.loading || false;
    const [studentCurrentPage, setStudentCurrentPage] = useState(1);
    const [studentRowsPerPage, setStudentRowsPerPage] = useState(10);
    const [studentSearchFilter, setStudentSearchFilter] = useState("");

    // ── Fetch Main Section List ──────────────────────────────────────────────
    const fetchSectionData = useCallback(() => {
        if (!userId) return;
        dispatch(fetchListOfSectionData(userId, sectionCurrentPage, sectionRowsPerPage, sectionSearchFilter));
    }, [userId, sectionCurrentPage, sectionRowsPerPage, sectionSearchFilter, dispatch]);

    useEffect(() => {
        fetchSectionData();
    }, [fetchSectionData]);

    useEffect(() => {
        if (sectionTable.length === 0) return;
        setSectionList(sectionTable);
    }, [sectionTable]);

    // ── Fetch Faculty/Subject Data ───────────────────────────────────────────
    useEffect(() => {
        if (!loadId || activeTab !== "faculty") return;
        dispatch(fetchRowSectionTableData(loadId, sectionRowCurrentPage, sectionRowRowsPerPage, sectionRowSearchFilter));
    }, [activeTab, loadId, sectionRowCurrentPage, sectionRowRowsPerPage, sectionRowSearchFilter, dispatch]);

    useEffect(() => {
        if (sectionRowTable.length === 0) return;
        setSectionRowList(sectionRowTable);
        if (sectionRowTable[0]) {
            setAdviserName(sectionRowTable[0].AssignedTeacher);
            setSectionName(sectionRowTable[0].SectionName);
            setLevelName(sectionRowTable[0].LevelName);
        }
    }, [sectionRowTable]);

    // ── Fetch Student Data ───────────────────────────────────────────────────
    useEffect(() => {
        if (!loadId || activeTab !== "students") return;
        dispatch(fetchRowStudentTableData(loadId, studentCurrentPage, studentRowsPerPage, studentSearchFilter));
    }, [activeTab, loadId, studentCurrentPage, studentRowsPerPage, studentSearchFilter, dispatch]);

    useEffect(() => {
        if (studentTable.length === 0) return;
        setStudentList(studentTable);
        if (studentTable[0]) {
            setAdviserName(studentTable[0].AssignedTeacher);
            setSectionName(studentTable[0].SectionName);
            setLevelName(studentTable[0].LevelName);
        }
    }, [studentTable]);

    // ── Column Definitions ────────────────────────────────────────────────────
    const sectionColumns = [
        {
            name: 'Section Name',
            selector: row => row.SectionName,
            sortable: true,
            grow: 2,
            cell: row => (
                <div className="font-semibold text-gray-900">
                    {row.SectionName}
                </div>
            )
        },
        {
            name: 'Level',
            selector: row => row.LevelName,
            sortable: true,
            cell: row => (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {row.LevelName}
                </span>
            )
        },
        {
            name: <div className="flex items-center gap-1"><Users size={14} /> Teachers</div>,
            selector: row => row.NumberOfTeacher,
            sortable: true,
            center: true,
            width: '120px',
        },
        {
            name: <div className="flex items-center gap-1"><BookOpen size={14} /> Subjects</div>,
            selector: row => row.NumberOfSubject,
            sortable: true,
            center: true,
            width: '120px',
        },
        {
            name: <div className="flex items-center gap-1"><GraduationCap size={14} /> Students</div>,
            selector: row => row.NumberOfStudent,
            sortable: true,
            center: true,
            width: '120px',
        },
        {
            name: 'Date Created',
            selector: row => formatDate(row.DateCreated),
            sortable: true,
            width: '130px',
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => openRowModal(row)}
                    title="View Details"
                >
                    <Eye size={18} />
                </button>
            ),
            ignoreRowClick: true,
            width: "100px",
            center: true,
        }
    ];

    const sectionRowColumns = [
        {
            name: 'Assigned Teacher',
            selector: row => row.AssignedTeacher,
            sortable: true,
            grow: 2,
            wrap: true,
        },
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true, width: '120px' },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true, grow: 2, wrap: true },
        { name: 'Type', selector: row => row.SubjectType, sortable: true, width: '110px' },
        { name: 'Start Time', selector: row => formatToAMPM(row.StartTime), sortable: true, width: '100px' },
        { name: 'End Time', selector: row => formatToAMPM(row.EndTime), sortable: true, width: '100px' },
        { name: 'Date Created', selector: row => formatDate(row.DateCreated), sortable: true, width: '130px' },
    ];

    const studentColumns = [
        { name: 'Student Number', selector: row => row.StudentNumber, sortable: true, width: '150px' },
        { name: 'Full Name', selector: row => row.StudentFullname, sortable: true, grow: 2 },
        {
            name: 'Gender',
            selector: row => row.Gender,
            sortable: true,
            width: '100px',
            cell: row => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.Gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                    }`}>
                    {row.Gender}
                </span>
            )
        },
        { name: 'Date Enrolled', selector: row => formatDate(row.DateEnrolled), sortable: true, width: '130px' },
    ];

    // ── Handlers ──────────────────────────────────────────────────────────────
    const openRowModal = (row) => {
        setLoadId(row?.LoadId);
        setRowModalOpen(true);
        setActiveTab("faculty"); // Reset to first tab
        setSectionRowCurrentPage(1); // Reset pagination
        setStudentCurrentPage(1);
        setSectionRowSearchFilter(""); // Reset search
        setStudentSearchFilter("");
    };

    return (
        <div>
            {/* Main Section Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-green-700">
                                Section Master List
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                                All sections assigned to you this school year
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Search sections..."
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                value={sectionSearchFilter}
                                onChange={(e) => {
                                    setSectionSearchFilter(e.target.value);
                                    setSectionCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={sectionColumns}
                    data={sectionList}
                    progressPending={sectionLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={sectionTotalRows}
                    paginationDefaultPage={sectionCurrentPage}
                    onChangePage={(page) => setSectionCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setSectionRowsPerPage(newPerPage);
                        setSectionCurrentPage(page);
                    }}
                    highlightOnHover
                    responsive
                    persistTableHead
                    noDataComponent={
                        <div className="py-12 text-center">
                            <GraduationCap size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">No sections found</p>
                        </div>
                    }
                />
            </div>

            {/* Section Details Modal */}
            <ModalComponent
                isOpen={rowModalOpen}
                onClose={() => setRowModalOpen(false)}
                title={
                    <div className="flex items-center gap-2">
                        <GraduationCap size={24} className="text-green-600" />
                        <span className="text-xl font-bold text-green-700">Section Details</span>
                    </div>
                }
                body={
                    <div className="space-y-4">
                        {/* Section Info Cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                                <label className="block text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">
                                    Adviser Name
                                </label>
                                <p className="text-base font-bold text-blue-900">
                                    {adviserName || "—"}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                                <label className="block text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">
                                    Section Name
                                </label>
                                <p className="text-base font-bold text-green-900">
                                    {sectionName || "—"}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                                <label className="block text-xs font-semibold text-purple-700 mb-2 uppercase tracking-wide">
                                    Level Name
                                </label>
                                <p className="text-base font-bold text-purple-900">
                                    {levelName || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-2 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab("faculty")}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === "faculty"
                                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <BookOpen size={18} />
                                Teachers & Subjects
                            </button>

                            <button
                                onClick={() => setActiveTab("students")}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === "students"
                                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <Users size={18} />
                                Students
                            </button>
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            {activeTab === "faculty" && (
                                <motion.div
                                    key="faculty"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <DataTable
                                        columns={sectionRowColumns}
                                        data={sectionRowList}
                                        progressPending={sectionRowLoading}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={sectionRowTotalRows}
                                        paginationDefaultPage={sectionRowCurrentPage}
                                        onChangePage={(page) => setSectionRowCurrentPage(page)}
                                        onChangeRowsPerPage={(newPerPage, page) => {
                                            setSectionRowRowsPerPage(newPerPage);
                                            setSectionRowCurrentPage(page);
                                        }}
                                        highlightOnHover
                                        responsive
                                        persistTableHead
                                        noDataComponent={
                                            <div className="py-8 text-center text-gray-500 text-sm">
                                                No teachers or subjects assigned yet
                                            </div>
                                        }
                                    />
                                </motion.div>
                            )}

                            {activeTab === "students" && (
                                <motion.div
                                    key="students"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="mb-3 flex justify-end">
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={studentSearchFilter}
                                            onChange={(e) => {
                                                setStudentSearchFilter(e.target.value);
                                                setStudentCurrentPage(1);
                                            }}
                                        />
                                    </div>

                                    <DataTable
                                        columns={studentColumns}
                                        data={studentList}
                                        progressPending={studentLoading}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={studentTotalRows}
                                        paginationDefaultPage={studentCurrentPage}
                                        onChangePage={(page) => setStudentCurrentPage(page)}
                                        onChangeRowsPerPage={(newPerPage, page) => {
                                            setStudentRowsPerPage(newPerPage);
                                            setStudentCurrentPage(page);
                                        }}
                                        highlightOnHover
                                        responsive
                                        persistTableHead
                                        noDataComponent={
                                            <div className="py-8 text-center text-gray-500 text-sm">
                                                No students enrolled yet
                                            </div>
                                        }
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                }
                size="w-[1200px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Close", type: "red", onClick: () => setRowModalOpen(false) },
                ]}
            />
        </div>
    );
};

export default ListOfSectionComponent;