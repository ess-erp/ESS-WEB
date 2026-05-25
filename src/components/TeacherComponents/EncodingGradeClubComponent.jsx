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
    fetchInsertEncodedGradesData,
    fetchFinalizeEncodedGradesData,
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
        // { name: 'Date Created', selector: row => formatDate(row.DateCreated), sortable: true },
        // {
        //     name: "Actions",
        //     cell: (row) => (
        //         <div className="flex gap-4 items-center">
        //             <button
        //                 className="p-1 text-blue-600 hover:text-blue-800"
        //                 onClick={() => openRowModal(row, "view")}
        //             >
        //                 <Eye size={18} />
        //             </button>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     width: "180px",
        // }
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
        // {
        //     name: "Actions",
        //     cell: (row) => (
        //         <div className="flex gap-4 items-center">
        //             <button
        //                 className="p-1 text-blue-600 hover:text-blue-800"
        //                 onClick={() => openEncodeGradeModal(row, "view")}
        //             >
        //                 <Eye size={18} />
        //             </button>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     width: "180px",
        // }
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
        setNoOfSchoolDays(studentTable[0]?.NoOfSchoolDays);
    }, [studentTable]);

    console.log(studentTable);
    console.log(subjectTitle);
    const maleStudents = studentList.filter(
        (s) => s.Gender?.toLowerCase() === "male"
    );

    const femaleStudents = studentList.filter(
        (s) => s.Gender?.toLowerCase() === "female"
    );
    const [gradeErrors, setGradeErrors] = useState({});
    const [daysErrors, setDaysErrors] = useState({});
    const studentColumn = [
        {
            name: 'Student Number',
            selector: row => row.StudentNumber,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: row => row.Lname,
            sortable: true
        },
        {
            name: 'First Name',
            selector: row => row.Fname,
            sortable: true
        },
        {
            name: 'Middle Name',
            selector: row => row.Mname,
            sortable: true
        },

        // =======================
        // 1ST GRADING
        // =======================
        {
            name: '1st Grading',
            cell: (row) => {
                const isActive = row.TermActivated === "Term1";

                return (
                    <div className="flex flex-col items-start min-w-[90px]">
                        <input
                            type="number"
                            className={`border px-2 py-1 w-20 rounded ${isActive
                                ? "border-blue-500"
                                : "bg-gray-100 cursor-not-allowed"
                                }`}
                            disabled={!isActive}
                            value={row.FirstGrading || ""}
                            onChange={(e) =>
                                handleGradeChange(
                                    row.StudentId,
                                    "FirstGrading",
                                    row.SubjectType,
                                    e.target.value
                                )
                            }
                            required={isActive}
                        />
                        {gradeErrors[`${row.StudentId}-FirstGrading`] && (
                            <p className="text-red-500 text-xs mt-1">
                                {gradeErrors[`${row.StudentId}-FirstGrading`]}
                            </p>
                        )}
                    </div>


                );
            },
        },

        // =======================
        // 2ND GRADING
        // =======================
        {
            name: '2nd Grading',
            cell: (row) => {
                const isActive = row.TermActivated === "Term2";

                return (
                    <div className="flex flex-col items-start min-w-[90px]">
                        <input
                            type="number"
                            className={`border px-2 py-1 w-20 rounded ${isActive
                                ? "border-blue-500"
                                : "bg-gray-100 cursor-not-allowed"
                                }`}
                            disabled={!isActive}
                            value={row.SecondGrading || ""}
                            onChange={(e) =>
                                handleGradeChange(
                                    row.StudentId,
                                    "SecondGrading",
                                    row.SubjectType,
                                    e.target.value
                                )
                            }
                            required={isActive}
                        />
                        {gradeErrors[`${row.StudentId}-SecondGrading`] && (
                            <p className="text-red-500 text-xs mt-1">
                                {gradeErrors[`${row.StudentId}-SecondGrading`]}
                            </p>
                        )}
                    </div>

                );
            },
        },

        // =======================
        // 3RD GRADING
        // =======================
        {
            name: '3rd Grading',
            cell: (row) => {
                const isActive = row.TermActivated === "Term3";

                return (
                    <div className="flex flex-col items-start min-w-[90px]">
                        <input
                            type="number"
                            className={`border px-2 py-1 w-20 rounded ${isActive
                                ? "border-blue-500"
                                : "bg-gray-100 cursor-not-allowed"
                                }`}
                            disabled={!isActive}
                            value={row.ThirdGrading || ""}
                            onChange={(e) =>
                                handleGradeChange(
                                    row.StudentId,
                                    "ThirdGrading",
                                    row.SubjectType,
                                    e.target.value
                                )
                            }
                            required={isActive}
                        />
                        {gradeErrors[`${row.StudentId}-ThirdGrading`] && (
                            <p className="text-red-500 text-xs mt-1">
                                {gradeErrors[`${row.StudentId}-ThirdGrading`]}
                            </p>
                        )}
                    </div>

                );
            },
        },
        {
            name: 'Days Present',
            cell: (row) => {
                return (
                    <div className="flex flex-col items-start min-w-[90px]">
                        <input
                            type="number"
                            className={`border px-2 py-1 w-20 rounded border-blue-500`}
                            value={row.DaysPresent || ""}
                            onChange={(e) =>
                                handleDaysChange(
                                    row.StudentId,
                                    "DaysPresent",
                                    e.target.value
                                )
                            }
                            required
                        />
                        {daysErrors[`${row.StudentId}-DaysPresent`] && (
                            <p className="text-red-500 text-xs mt-1">
                                {gradeErrors[`${row.StudentId}-DaysPresent`]}
                            </p>
                        )}
                    </div>

                );
            },
        },
        {
            name: 'Days Absent',
            cell: (row) => {
                return (
                    <div className="flex flex-col items-start min-w-[90px]">
                        <input
                            type="number"
                            className={`border px-2 py-1 w-20 rounded border-blue-500`}
                            value={row.DaysAbsent || ""}
                            onChange={(e) =>
                                handleDaysChange(
                                    row.StudentId,
                                    "DaysAbsent",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                );
            },
        },
        {
            name: 'Days Tardy',
            cell: (row) => {
                return (
                    <div className="flex flex-col items-start min-w-[90px]">
                        <input
                            type="number"
                            className={`border px-2 py-1 w-20 rounded border-blue-500`}
                            value={row.DaysTardy || ""}
                            onChange={(e) =>
                                handleDaysChange(
                                    row.DaysTardy,
                                    "DaysOfPresent",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                );
            },
        }
    ];
    const handleGradeChange = (studentId, field, subjectType, value) => {
        const numericValue = Number(value);

        // update grade
        setStudentList((prev) =>
            prev.map((s) =>
                s.StudentId === studentId
                    ? { ...s, [field]: value }
                    : s
            )
        );

        if (subjectType.toLowerCase() == "curriculum") {
            let error = "";
            if (value !== "") {
                if (numericValue < 70) {
                    error = "Grade must be at least 70.";
                } else if (numericValue > 100) {
                    error = "Grade must not exceed 100.";
                }
            }
            setGradeErrors((prev) => ({
                ...prev,
                [`${studentId}-${field}`]: error,
            }));
        }

        // validate

    };
    const handleDaysChange = (studentId, field, value) => {

        setStudentList((prev) =>
            prev.map((s) =>
                s.StudentId === studentId
                    ? { ...s, [field]: value }
                    : s
            )
        );
        let error = "";
        if (value == "") {
            error = " is required.";
        }

        setDaysErrors((prev) => ({
            ...prev,
            [`${studentId}-${field}`]: error,
        }));
    }

    // };
    const [noOfSchoolDays, setNoOfSchoolDays] = useState("");
    const [schoolDaysError, setSchoolDaysError] = useState(false);
    const [schoolDaysErrorMsg, setSchoolDaysErrorMsg] = useState("");
    const handleCloseEncodeGrades = () => {
        setRowModalOpen(false);
        // setStudentList([]);
        setShowEncodingTable(false);

    };

    const handleOpenWarningModal = () => {
        console.log(noOfSchoolDays);
        if (noOfSchoolDays == "" || noOfSchoolDays.length == 0) {
            setSchoolDaysError(true);
            setRowModalOpen(true);
            setTimeout(() =>
                setSchoolDaysErrorMsg("Number of school days is required.")
                , 1000);
            return;
        }
        else {
            setRowModalOpen(false);
            setShowEncodingTable(false);
            setIsModalOpen(true);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [errorBodyMessage, setErrorBodyMessage] = useState("");


    const handleSubmitModal = async () => {
        const missing = studentList.filter((s) => {

            if (s.TermActivated === "Term1") {
                return !s.FirstGrading;
            }

            if (s.TermActivated === "Term2") {
                return !s.SecondGrading;
            }

            if (s.TermActivated === "Term3") {
                return !s.ThirdGrading;
            }

            return false;
        });

        if (missing.length > 0) {
            setIsErrorModalOpen(true);
            setErrorBodyMessage("Please complete all grades for active grading period.");
            setShowEncodingTable(false);
            return;
        }


        // BUILD CLEAN PAYLOAD
        const payload = {
            LoadId: studentList[0]?.LoadId,
            TermActivated: studentList[0]?.TermActivated,
            CreatedByUserid: userId,
            NoOfSchoolDays: noOfSchoolDays,

            InsertEncodeGradeChildDtos: studentList.map((s) => {

                let grade = null;

                if (s.TermActivated === "Term1") {
                    grade = s.FirstGrading;
                }
                else if (s.TermActivated === "Term2") {
                    grade = s.SecondGrading;
                }
                else if (s.TermActivated === "Term3") {
                    grade = s.ThirdGrading;
                }

                return {
                    StudentId: s.StudentId,
                    LoadChildId: s.LoadChildId,
                    SubjectId: s.SubjectId,
                    SubjectType: s.SubjectType,
                    Grade: grade,
                    DaysPresent: s.DaysPresent,
                    DaysAbsent: s.DaysAbsent,
                    DaysTardy: s.DaysTardy,
                };
            })
        };

        console.log("Saving grades:", payload);
        const res = await dispatch(fetchInsertEncodedGradesData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 1000);
            }
        }
    };

    const handleFinalizeGrade = async () => {
        console.log(loadId);
        setShowEncodingTable(false);
        const payload = {
            LoadId: studentList[0]?.LoadId,
            TermActivated: studentList[0]?.TermActivated,
            CreatedByUserid: userId,
            NoOfSchoolDays: noOfSchoolDays,
            IsValidated: "Y",

            InsertEncodeGradeChildDtos: studentList.map((s) => {

                let grade = null;

                if (s.TermActivated === "Term1") {
                    grade = s.FirstGrading;
                }
                else if (s.TermActivated === "Term2") {
                    grade = s.SecondGrading;
                }
                else if (s.TermActivated === "Term3") {
                    grade = s.ThirdGrading;
                }

                return {
                    StudentId: s.StudentId,
                    LoadChildId: s.LoadChildId,
                    SubjectId: s.SubjectId,
                    SubjectType: s.SubjectType,
                    Grade: grade,
                    GradeChildId: s.GradeChildId,
                    DaysPresent: s.DaysPresent,
                    DaysAbsent: s.DaysAbsent,
                    DaysTardy: s.DaysTardy,
                };
            })
        };

        console.log("Saving grades:", payload);
        const res = await dispatch(fetchFinalizeEncodedGradesData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 1000);
            }
        }
    };

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
                        onRowClicked={(row) => openRowModal(row)}
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
                                            List of all your handled sections. Please click the row to encode grades.
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
                                        onRowClicked={(row) => openEncodeGradeModal(row)}
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
                                    <div className="flex justify-end pt-2">
                                        <label className="flex flex-col">
                                            <span className="text-sm font-medium mb-1">Number of school days <span className="text-red-700">*</span></span>
                                            <input
                                                type="text"
                                                placeholder="Enter number of school days"
                                                value={noOfSchoolDays}
                                                onChange={(e) => setNoOfSchoolDays(e.target.value)}
                                                className={`mt-1 mx-auto rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 
                                                ${schoolDaysError ? "border-red-500" : "border-gray-300"}`}
                                            />
                                            {schoolDaysError && (
                                                <p className="text-red-500 text-xs mt-1">{schoolDaysErrorMsg}</p>
                                            )}
                                        </label>

                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                }
                size="w-[1200px]"
                maxHeight="100vh"
                buttons={[
                    ...(!showEncodingTable
                        ? []
                        : [
                            { label: "Finalize Grade", type: "blue", onClick: handleFinalizeGrade },
                            { label: "Submit", type: "green", onClick: handleOpenWarningModal, closeOnClick: false }
                        ]
                    ),
                    { label: "Cancel", type: "red", onClick: handleCloseEncodeGrades },
                ]}
            />
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Warning"
                body="Are you sure you want to continue?"
                buttons={[
                    { label: "Yes", type: "green", onClick: handleSubmitModal },
                    { label: "No", type: "red" },
                ]}
            />
            <ModalComponent
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Error</span>}
                body={<p>{errorBodyMessage}</p>}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={<p>Done encoding of grades.</p>}
            />
        </div >
    );
};

export default EncodingGradeClubComponent;