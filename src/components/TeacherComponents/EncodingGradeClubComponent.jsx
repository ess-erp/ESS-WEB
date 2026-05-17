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
    fetchListOfSectionUserData,
    fetchTeacherSubjectLoadData,
    fetchListOfStudentPerTermData,
} from "../../states/TeacherState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";

const EncodingGradeClubComponent = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;

    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;
    const [sectionList, setSectionList] = useState([]);
    const sectionTableState = useSelector((state) => state.teacher.sectionTableList || {});
    const sectionTable = sectionTableState.data.data || [];
    const sectionTotalRows = sectionTableState.data.totalRecords || 0;
    const sectionLoading = sectionTableState.loading || false;
    const [sectionCurrentPage, setSectionTableCurrentPage] = useState(1);
    const [sectionRowsPerPage, setSectionTableRowsPerPage] = useState(10);
    const [sectionTableSearchFilter, setSectionTableFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchListOfSectionUserData(userId, sectionCurrentPage, sectionRowsPerPage, sectionTableSearchFilter));
    }, [userId, sectionCurrentPage, sectionRowsPerPage, sectionTableSearchFilter, dispatch]);

    useEffect(() => {
        if (sectionTable.length === 0) return;
        setSectionList(sectionTable);
    }, [sectionTable]);

    const sectionColumn = [
        { name: 'Section Name', selector: row => row.SectionName, sortable: true },
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
    const [levelName, setLevelName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [loadRowTable, setLoadRowTable] = useState(false);
    const [showSectionRowTable, setShowSectionRowTable] = useState(false);
    const openRowModal = (row) => {
        console.log(row);
        setLoadId(row?.LoadId);
        setRowModalOpen(true);
        setLoadRowTable(true);
        setShowSectionRowTable(true);
    };
    const [sectionRowList, setSectionRowList] = useState([]);
    const teacherSubjectLoadState = useSelector((state) => state.teacher.teacherSubjectLoadState || {});
    const sectionRowTable = teacherSubjectLoadState.data.data || [];
    const sectionRowTotalRows = teacherSubjectLoadState.data.totalRecords || 0;
    const sectionRowLoading = teacherSubjectLoadState.loading || false;
    const [sectionRowCurrentPage, setSectionRowTableCurrentPage] = useState(1);
    const [sectionRowRowsPerPage, setSectionRowTableRowsPerPage] = useState(10);
    const [sectionRowTableSearchFilter, setSectionRowTableFilterText] = useState("");


    useEffect(() => {
        if (!loadId || !userId) return;
        dispatch(fetchTeacherSubjectLoadData(loadId, userId, sectionRowCurrentPage, sectionRowRowsPerPage, sectionRowTableSearchFilter));
    }, [loadId, userId, sectionRowCurrentPage, sectionRowRowsPerPage, sectionRowTableSearchFilter, dispatch]);

    useEffect(() => {
        if (sectionRowTable.length === 0) return;
        setSectionRowList(sectionRowTable);
        setSectionName(sectionRowTable[0]?.SectionName);
        setLevelName(sectionRowTable[0]?.LevelName);
    }, [sectionRowTable]);

    const sectionRowColumn = [
        { name: 'Assigned Teacher', selector: row => row.TeacherFullname, sortable: true },
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true },
        { name: 'Start of time', selector: row => formatToAMPM(row.StartTime), sortable: true },
        { name: 'End of time', selector: row => formatToAMPM(row.EndTime), sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-4 items-center">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => openEncodeGradeModal(row, "view")}
                    >
                        <Eye size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "180px",
        }
    ];
    const [showEncodingTable, setShowEncodingTable] = useState(false);
    const [rowLoadId, setRowLoadId] = useState(0);
    const [subjectType, setSubjectType] = useState("");
    const [subjectid, setSubjectId] = useState(0);
    const openEncodeGradeModal = (data) => {
        console.log(data);
        setShowSectionRowTable(false);
        setShowEncodingTable(true);
        setRowLoadId(data?.LoadId);
        setSubjectId(data?.SubjectId);
        setSubjectType(data?.SubjectType);
    };

    const [activeTab, setActiveTab] = useState("male");
    const [studentList, setStudentList] = useState([]);
    const linkOfStudentPerTermState = useSelector((state) => state.teacher.linkOfStudentPerTermState || {});
    const studentTable = linkOfStudentPerTermState.data.data || [];
    const studentTotalRows = linkOfStudentPerTermState.data.totalRecords || 0;
    const studentLoading = linkOfStudentPerTermState.loading || false;
    const [studentCurrentPage, setStudentCurrentPage] = useState(1);
    const [studentRowsPerPage, setStudentRowsPerPage] = useState(10);
    const [studentSearch, setStudentSearch] = useState("");
    const [activeGradingPeriod, setActiveGradingPeriod] = useState(1);
    const [subjectTitle, setSubjectTitle] = useState("");


    useEffect(() => {
        if (!rowLoadId) return;
        dispatch(fetchListOfStudentPerTermData(rowLoadId, subjectid, subjectType, studentCurrentPage, studentRowsPerPage, studentSearch));
    }, [rowLoadId, subjectid, subjectType, studentCurrentPage, studentRowsPerPage, studentSearch, dispatch]);

    useEffect(() => {
        if (studentTable.length === 0) return;
        setStudentList(studentTable);
        setSectionName(studentTable[0]?.SectionName);
        setLevelName(studentTable[0]?.LevelName);
        setSubjectTitle(studentTable[0]?.SubjectCode + "-" + studentTable[0]?.SubjectName);
    }, [studentTable]);

    console.log(studentTable);
    console.log(subjectTitle);
    const maleStudents = studentList.filter(
        (s) => s.Gender?.toLowerCase() === "male"
    );

    const femaleStudents = studentList.filter(
        (s) => s.Gender?.toLowerCase() === "female"
    );

    const studentColumn = [
        { name: 'Student Number', selector: row => row.StudentNumber, sortable: true },
        { name: 'Last Name', selector: row => row.Lname, sortable: true },
        { name: 'First Name', selector: row => row.Fname, sortable: true },
        { name: 'Middle Name', selector: row => row.Mname, sortable: true },

        // =======================
        // 1ST GRADING
        // =======================
        {
            name: '1st Grading',
            cell: (row) => (
                <input
                    type="number"
                    className={`border px-2 py-1 w-20 rounded ${activeGradingPeriod === 1 ? "border-blue-500" : "bg-gray-100"
                        }`}
                    disabled={activeGradingPeriod !== 1}
                    value={row.FirstGrading || ""}
                    onChange={(e) => handleGradeChange(row.StudentId, "FirstGrading", e.target.value)}
                    required={activeGradingPeriod === 1}
                />
            ),
        },

        // =======================
        // 2ND GRADING
        // =======================
        {
            name: '2nd Grading',
            cell: (row) => (
                <input
                    type="number"
                    className={`border px-2 py-1 w-20 rounded ${activeGradingPeriod === 2 ? "border-blue-500" : "bg-gray-100"
                        }`}
                    disabled={activeGradingPeriod !== 2}
                    value={row.SecondGrading || ""}
                    onChange={(e) => handleGradeChange(row.StudentId, "SecondGrading", e.target.value)}
                    required={activeGradingPeriod === 2}
                />
            ),
        },

        // =======================
        // 3RD GRADING
        // =======================
        {
            name: '3rd Grading',
            cell: (row) => (
                <input
                    type="number"
                    className={`border px-2 py-1 w-20 rounded ${activeGradingPeriod === 3 ? "border-blue-500" : "bg-gray-100"
                        }`}
                    disabled={activeGradingPeriod !== 3}
                    value={row.ThirdGrading || ""}
                    onChange={(e) => handleGradeChange(row.StudentId, "ThirdGrading", e.target.value)}
                    required={activeGradingPeriod === 3}
                />
            ),
        },
    ];
    const handleGradeChange = (studentId, field, value) => {
        setStudentList((prev) =>
            prev.map((student) =>
                student.StudentId === studentId
                    ? { ...student, [field]: value }
                    : student
            )
        );
    };
    const handleSaveGrades = () => {
        const missing = studentList.filter((s) => {
            if (activeGradingPeriod === 1) return !s.FirstGrading;
            if (activeGradingPeriod === 2) return !s.SecondGrading;
            if (activeGradingPeriod === 3) return !s.ThirdGrading;
            return false;
        });

        if (missing.length > 0) {
            alert("Please complete all grades for active grading period.");
            return;
        }

        // proceed to save API
        console.log("Saving grades:", studentList);
    };
    const handleCloseEncodeGrades = () => {
        setRowModalOpen(false);
        // setStudentList([]);
        setShowEncodingTable(false);
    }
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
                        responsive
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


                            {showSectionRowTable && (
                                <>
                                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                                        <strong className="font-bold">Note: </strong>
                                        <span>
                                            List of all your handled sections. Please click the eye icon to encode grades.
                                        </span>
                                    </div>
                                    <hr className="my-4 border-t border-gray-300" />
                                    <div className="flex justify-end gap-3">

                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="px-3 py-2 border border-gray-300 rounded w-64"
                                            value={sectionRowTableSearchFilter}
                                            onChange={(e) => {
                                                setSectionRowTableFilterText(e.target.value);
                                                setSectionRowTableCurrentPage(1);
                                            }}
                                        />
                                    </div>
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
                                </>

                            )}
                            {showEncodingTable && (
                                <>

                                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                                        <strong className="font-bold">Note: </strong>
                                        <span>
                                            List of all your assigned students. Please double-check your data before you proceed.
                                        </span>
                                    </div>
                                    <hr className="my-4 border-t border-gray-300" />
                                    <div className="flex gap-2 mb-4 justify-center">
                                        <button
                                            onClick={() => setActiveTab("male")}
                                            className={`px-4 py-2 rounded ${activeTab === "male"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            Male Students ({maleStudents.length})
                                        </button>

                                        <button
                                            onClick={() => setActiveTab("female")}
                                            className={`px-4 py-2 rounded ${activeTab === "female"
                                                ? "bg-pink-600 text-white"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            Female Students ({femaleStudents.length})
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">

                                        {subjectTitle != "" && (
                                            <div>
                                                <h3 className="text-lg font-bold text-green-600">
                                                    {subjectTitle}
                                                </h3>
                                            </div>
                                        )}

                                        <div className="ml-auto">
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="px-3 py-2 border border-gray-300 rounded w-64"
                                                value={studentSearch}
                                                onChange={(e) => {
                                                    setStudentSearch(e.target.value);
                                                    setStudentCurrentPage(1);
                                                }}
                                            />
                                        </div>

                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.25 }}
                                        >

                                            <DataTable
                                                columns={studentColumn}
                                                data={
                                                    activeTab === "male"
                                                        ? maleStudents
                                                        : femaleStudents
                                                }
                                                progressPending={sectionRowLoading}
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
                                                striped
                                                responsive
                                                noDataComponent={`No ${activeTab} students found.`}
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </>
                            )}
                        </div>
                    </div>
                }
                size="w-[1200px]"
                maxHeight="100vh"
                buttons={
                    [
                        { label: "Submit", type: "green", onClick: handleSaveGrades },
                        { label: "Cancel", type: "red", onClick: handleCloseEncodeGrades },
                    ]}
            />
        </div >
    );
};

export default EncodingGradeClubComponent;