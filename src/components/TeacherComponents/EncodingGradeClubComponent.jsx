import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, GraduationCap, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import {
    fetchListOfSectionUserData,
    fetchTeacherSubjectLoadData,
    fetchListOfStudentPerTermData,
    fetchInsertEncodedGradesData,
    fetchFinalizeEncodedGradesData,
    fetchSchoolCalendarStatus,
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
            name: <div className="flex items-center gap-1"><BookOpen size={14} /> Subjects</div>,
            selector: row => row.NumberOfSubject,
            sortable: true,
            center: true,
            width: '130px',
        },
        {
            name: <div className="flex items-center gap-1"><GraduationCap size={14} /> Students</div>,
            selector: row => row.NumberOfStudent,
            sortable: true,
            center: true,
            width: '130px',
        },
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
    
    console.log('Student Table Data:', studentTable);
    
    // Helper function to get active sub-subject for a term
    const getSubSubjectForTerm = useCallback((subSubjects, termField) => {
        if (!Array.isArray(subSubjects) || subSubjects.length === 0) return null;
        return subSubjects.find(sub => sub[termField] === true);
    }, []);
    
    useEffect(() => {
        if (rowLoadId == 0) return;
        dispatch(fetchListOfStudentPerTermData(rowLoadId, subjectid, subjectType, studentCurrentPage, studentRowsPerPage, studentSearch));
    }, [rowLoadId, subjectid, subjectType, studentCurrentPage, studentRowsPerPage, studentSearch, dispatch]);

    useEffect(() => {
        if (studentTable.length === 0) return;
        setStudentList(studentTable);
        setSectionName(studentTable[0]?.SectionName);
        setLevelName(studentTable[0]?.LevelName);
        setSubjectTitle(studentTable[0]?.SubjectCode + "-" + studentTable[0]?.SubjectName);
        // Log the TermActivated value to see what format it's in
        console.log('TermActivated value:', studentTable[0]?.TermActivated);
        // setNoOfSchoolDays(studentTable[0]?.NoOfSchoolDays);
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
    
    // School Calendar Status State
    const schoolCalendarStatusState = useSelector((state) => state.teacher.schoolCalendarStatusState || {});
    const calendarStatus = schoolCalendarStatusState.data?.data ?? schoolCalendarStatusState.data ?? null;
    const [isEncodingLocked, setIsEncodingLocked] = useState(true);
    
    // Derive the active term string from the calendar (e.g. "1st Term")
    const activeTerm = calendarStatus?.ActiveTerm ?? null;

    // Fetch school calendar status on component mount
    useEffect(() => {
        dispatch(fetchSchoolCalendarStatus());
    }, [dispatch]);

    // Lock/unlock encoding based on calendar IsEncodingPeriod flag
    useEffect(() => {
        if (calendarStatus) {
            // IsEncodingPeriod: true  → encoding open
            // IsEncodingPeriod: false → encoding locked
            const locked = calendarStatus.IsEncodingPeriod === false;
            setIsEncodingLocked(locked);
        } else {
            // No calendar data yet — keep locked
            setIsEncodingLocked(true);
        }
    }, [calendarStatus]);
    
    const studentColumn = useMemo(() => [
        {
            name: <span className="font-semibold text-gray-700">Student Number</span>,
            selector: row => row.StudentNumber,
            sortable: true,
            width: '140px'
        },
        {
            name: <span className="font-semibold text-gray-700">Last Name</span>,
            selector: row => row.Lname,
            sortable: true,
            width: '150px'
        },
        {
            name: <span className="font-semibold text-gray-700">First Name</span>,
            selector: row => row.Fname,
            sortable: true,
            width: '150px'
        },
        {
            name: <span className="font-semibold text-gray-700">Middle Name</span>,
            selector: row => row.Mname,
            sortable: true,
            width: '150px'
        },

        // =======================
        // 1ST GRADING
        // =======================
        {
            name: (() => {
                // Get first row to determine sub-subject (all rows share same subject structure)
                const firstRow = studentTable?.[0];
                const activeSubSubject = firstRow ? getSubSubjectForTerm(firstRow.SubSubjects, 'Term1') : null;
                
                return (
                    <div className="flex flex-col items-center">
                        <span className="font-semibold text-blue-700">1st Term</span>
                        {activeSubSubject && (
                            <span className="text-xs text-blue-600 font-medium mt-0.5">
                                ({activeSubSubject.SubjectName})
                            </span>
                        )}
                    </div>
                );
            })(),
            cell: (row) => {
                const isActive = activeTerm === "1st Term";

                return (
                    <div className="flex flex-col items-start min-w-[90px]">
                        <input
                            type="number"
                            className={`border px-2 py-1 w-20 rounded ${isActive && !isEncodingLocked
                                ? "border-blue-500"
                                : "bg-gray-100 cursor-not-allowed"
                                }`}
                            disabled={!isActive || isEncodingLocked}
                            value={row.FirstGrading || ""}
                            onChange={(e) =>
                                handleGradeChange(
                                    row.StudentId,
                                    "FirstGrading",
                                    row.SubjectType,
                                    e.target.value
                                )
                            }
                            required={isActive && !isEncodingLocked}
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
            name: (() => {
                // Get first row to determine sub-subject (all rows share same subject structure)
                const firstRow = studentTable?.[0];
                const activeSubSubject = firstRow ? getSubSubjectForTerm(firstRow.SubSubjects, 'Term2') : null;
                
                return (
                    <div className="flex flex-col items-center">
                        <span className="font-semibold text-blue-700">2nd Term</span>
                        {activeSubSubject && (
                            <span className="text-xs text-blue-600 font-medium mt-0.5">
                                ({activeSubSubject.SubjectName})
                            </span>
                        )}
                    </div>
                );
            })(),
            cell: (row) => {
                const isActive = activeTerm === "2nd Term";

                return (
                    <div className="flex flex-col items-start min-w-[90px]">
                        <input
                            type="number"
                            className={`border px-2 py-1 w-20 rounded ${isActive && !isEncodingLocked
                                ? "border-blue-500"
                                : "bg-gray-100 cursor-not-allowed"
                                }`}
                            disabled={!isActive || isEncodingLocked}
                            value={row.SecondGrading || ""}
                            onChange={(e) =>
                                handleGradeChange(
                                    row.StudentId,
                                    "SecondGrading",
                                    row.SubjectType,
                                    e.target.value
                                )
                            }
                            required={isActive && !isEncodingLocked}
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
            name: (() => {
                // Get first row to determine sub-subject (all rows share same subject structure)
                const firstRow = studentTable?.[0];
                const activeSubSubject = firstRow ? getSubSubjectForTerm(firstRow.SubSubjects, 'Term3') : null;
                
                return (
                    <div className="flex flex-col items-center">
                        <span className="font-semibold text-blue-700">3rd Term</span>
                        {activeSubSubject && (
                            <span className="text-xs text-blue-600 font-medium mt-0.5">
                                ({activeSubSubject.SubjectName})
                            </span>
                        )}
                    </div>
                );
            })(),
            cell: (row) => {
                const isActive = activeTerm === "3rd Term";

                return (
                    <div className="flex flex-col items-start min-w-[90px]">
                        <input
                            type="number"
                            className={`border px-2 py-1 w-20 rounded ${isActive && !isEncodingLocked
                                ? "border-blue-500"
                                : "bg-gray-100 cursor-not-allowed"
                                }`}
                            disabled={!isActive || isEncodingLocked}
                            value={row.ThirdGrading || ""}
                            onChange={(e) =>
                                handleGradeChange(
                                    row.StudentId,
                                    "ThirdGrading",
                                    row.SubjectType,
                                    e.target.value
                                )
                            }
                            required={isActive && !isEncodingLocked}
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
            name: <span className="font-semibold text-green-700">Days Present</span>,
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
            name: <span className="font-semibold text-orange-700">Days Absent</span>,
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
            name: <span className="font-semibold text-yellow-700">Days Tardy</span>,
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
    ], [studentTable, getSubSubjectForTerm, gradeErrors, daysErrors]);
    
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
    // const [noOfSchoolDays, setNoOfSchoolDays] = useState("");
    // const [schoolDaysError, setSchoolDaysError] = useState(false);
    // const [schoolDaysErrorMsg, setSchoolDaysErrorMsg] = useState("");
    const handleCloseEncodeGrades = () => {
        setRowModalOpen(false);
        // setStudentList([]);
        setShowEncodingTable(false);

    };

    const handleOpenWarningModal = () => {
        // console.log(noOfSchoolDays);
        // if (noOfSchoolDays == "" || noOfSchoolDays.length == 0) {
        //     setSchoolDaysError(true);
        //     setRowModalOpen(true);
        //     setTimeout(() =>
        //         setSchoolDaysErrorMsg("Number of school days is required.")
        //         , 1000);
        //     return;
        // }
        // else {

        // }
        setRowModalOpen(false);
        setShowEncodingTable(false);
        setIsModalOpen(true);
    };

    const handleBackToSubjectList = () => {
        setShowEncodingTable(false);
        setShowSectionRowTable(true);
        setStudentList([]);
        setStudentSearch("");
        setActiveTab("male");
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [errorBodyMessage, setErrorBodyMessage] = useState("");


    const handleSubmitModal = async () => {
        const missing = studentList.filter((s) => {
            if (activeTerm === "1st Term") return !s.FirstGrading;
            if (activeTerm === "2nd Term") return !s.SecondGrading;
            if (activeTerm === "3rd Term") return !s.ThirdGrading;
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
            TermActivated: activeTerm,
            CreatedByUserid: userId,
            NoOfSchoolDays: noOfSchoolDays,

            InsertEncodeGradeChildDtos: studentList.map((s) => {
                let grade = null;
                if (activeTerm === "1st Term") grade = s.FirstGrading;
                else if (activeTerm === "2nd Term") grade = s.SecondGrading;
                else if (activeTerm === "3rd Term") grade = s.ThirdGrading;

                // Get active sub-subject for the current term (for subjects like MAPEH)
                let activeSubSubjectId = null;
                if (Array.isArray(s.SubSubjects) && s.SubSubjects.length > 0) {
                    const termField = s.TermActivated; // "Term1", "Term2", or "Term3"
                    const activeSubSubject = s.SubSubjects.find(sub => sub[termField] === true);
                    if (activeSubSubject) {
                        activeSubSubjectId = activeSubSubject.SubSubjectId;
                    }
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
                    ...(activeSubSubjectId && { SubSubjectId: activeSubSubjectId }) // Include only if sub-subject exists
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
            TermActivated: activeTerm,
            CreatedByUserid: userId,
            // NoOfSchoolDays: noOfSchoolDays,
            IsValidated: "Y",

            InsertEncodeGradeChildDtos: studentList.map((s) => {
                let grade = null;
                if (activeTerm === "1st Term") grade = s.FirstGrading;
                else if (activeTerm === "2nd Term") grade = s.SecondGrading;
                else if (activeTerm === "3rd Term") grade = s.ThirdGrading;

                // Get active sub-subject for the current term (for subjects like MAPEH)
                let activeSubSubjectId = null;
                if (Array.isArray(s.SubSubjects) && s.SubSubjects.length > 0) {
                    const termField = s.TermActivated; // "Term1", "Term2", or "Term3"
                    const activeSubSubject = s.SubSubjects.find(sub => sub[termField] === true);
                    if (activeSubSubject) {
                        activeSubSubjectId = activeSubSubject.SubSubjectId;
                    }
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
                    ...(activeSubSubjectId && { SubSubjectId: activeSubSubjectId }) // Include only if sub-subject exists
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
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-green-50 to-white rounded-t-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-green-700">
                                My Sections
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                Select a section to start encoding grades
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Search sections..."
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                value={sectionTableSearchFilter}
                                onChange={(e) => {
                                    setSectionTableFilterText(e.target.value);
                                    setSectionTableCurrentPage(1);
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
                    onChangePage={(page) => setSectionTableCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setSectionTableRowsPerPage(newPerPage);
                        setSectionTableCurrentPage(page);
                    }}
                    highlightOnHover
                    responsive
                    persistTableHead
                    onRowClicked={(row) => openRowModal(row)}
                    pointerOnHover
                    noDataComponent={
                        <div className="py-12 text-center">
                            <GraduationCap size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">No sections found</p>
                        </div>
                    }
                />
            </div>
            <ModalComponent
                isOpen={rowModalOpen}
                onClose={() => setRowModalOpen(false)}
                title={
                    <div className="flex items-center gap-2">
                        <BookOpen size={24} className="text-green-600" />
                        <span className="text-xl font-bold text-green-700">Grade Encoding</span>
                    </div>
                }
                body={
                    <div className="px-2 sm:px-0">
                        <div className="space-y-4">
                            {/* Section Info Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3 sm:p-4">
                                    <label className="block text-xs font-semibold text-green-700 mb-1 sm:mb-2 uppercase tracking-wide">
                                        Section Name
                                    </label>
                                    <p className="text-sm sm:text-base font-bold text-green-900">
                                        {sectionName || "—"}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3 sm:p-4">
                                    <label className="block text-xs font-semibold text-purple-700 mb-1 sm:mb-2 uppercase tracking-wide">
                                        Level Name
                                    </label>
                                    <p className="text-sm sm:text-base font-bold text-purple-900">
                                        {levelName || "—"}
                                    </p>
                                </div>
                            </div>


                            {showSectionRowTable && (
                                <>
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                                        <p className="text-xs sm:text-sm text-blue-700">
                                            <strong className="font-semibold">Instruction:</strong> Click on any subject row to start encoding grades for that subject.
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <input
                                            type="text"
                                            placeholder="Search subjects..."
                                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        responsive
                                        persistTableHead
                                        pointerOnHover
                                        noDataComponent={
                                            <div className="py-8 text-center text-gray-500 text-sm">
                                                No subjects assigned yet
                                            </div>
                                        }
                                        onRowClicked={(row) => openEncodeGradeModal(row)}
                                    />
                                </>

                            )}
                            {showEncodingTable && (
                                <>
                                    {/* Encoding Lock Warning */}
                                    {isEncodingLocked && (
                                        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-3 rounded-r-lg mb-3">
                                            <div className="flex items-start">
                                                <AlertTriangle size={18} className="text-red-600 mt-0.5 mr-2" />
                                                <div>
                                                    <p className="text-sm text-red-800 font-semibold">
                                                        Grade Encoding is Currently Locked
                                                    </p>
                                                    <p className="text-xs text-red-700 mt-1">
                                                        {calendarStatus?.activeTerm && (
                                                            <>Current Term: {calendarStatus.activeTerm} | </>
                                                        )}
                                                        {calendarStatus?.termStartDate && calendarStatus?.termEndDate ? (
                                                            <>Encoding period: {new Date(calendarStatus.termStartDate).toLocaleDateString()} - {new Date(calendarStatus.termEndDate).toLocaleDateString()}</>
                                                        ) : (
                                                            <>Please contact the SRU office for the encoding schedule.</>
                                                        )}
                                                    </p>
                                                    {calendarStatus?.daysUntilDeadline != null && calendarStatus.daysUntilDeadline >= 0 && !isEncodingLocked && (
                                                        <p className="text-xs text-red-600 mt-1 font-medium">
                                                            ⏰ {calendarStatus.daysUntilDeadline} {calendarStatus.daysUntilDeadline === 1 ? 'day' : 'days'} remaining
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-3 rounded-r-lg">
                                        <div className="flex items-start">
                                            <AlertTriangle size={18} className="text-yellow-600 mt-0.5 mr-2" />
                                            <p className="text-sm text-yellow-800">
                                                <strong className="font-semibold">Important:</strong> Please double-check all grades before submission. You can only encode grades for the active grading period.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Back Button */}
                                    <div className="flex justify-start mb-3">
                                        <button
                                            onClick={handleBackToSubjectList}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all text-sm border border-gray-300 hover:border-gray-400 shadow-sm"
                                        >
                                            <ArrowLeft size={18} />
                                            <span>Back to Subject List</span>
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:justify-center">
                                        <button
                                            onClick={() => setActiveTab("male")}
                                            className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${activeTab === "male"
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                        >
                                            <Users size={16} />
                                            Male Students ({maleStudents.length})
                                        </button>

                                        <button
                                            onClick={() => setActiveTab("female")}
                                            className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${activeTab === "female"
                                                    ? "bg-pink-600 text-white shadow-md"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                        >
                                            <Users size={16} />
                                            Female Students ({femaleStudents.length})
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                        {subjectTitle != "" && (
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={18} className="text-green-600" />
                                                <h3 className="text-base sm:text-lg font-bold text-green-700">
                                                    {subjectTitle}
                                                </h3>
                                            </div>
                                        )}

                                        <div className="w-full sm:w-auto sm:ml-auto">
                                            <input
                                                type="text"
                                                placeholder="Search students..."
                                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                customStyles={{
                                                    table: {
                                                        style: {
                                                            overflowX: 'auto',
                                                        },
                                                    },
                                                    headRow: {
                                                        style: {
                                                            borderBottomWidth: '2px',
                                                            borderBottomColor: '#e5e7eb',
                                                        },
                                                    },
                                                    headCells: {
                                                        style: {
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            paddingLeft: '16px',
                                                            paddingRight: '16px',
                                                        },
                                                    },
                                                    cells: {
                                                        style: {
                                                            paddingLeft: '16px',
                                                            paddingRight: '16px',
                                                            fontSize: '14px',
                                                        },
                                                    },
                                                }}
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                    {/* <div className="flex justify-end pt-2">
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

                                    </div> */}
                                </>
                            )}
                        </div>
                    </div>
                }
                size="w-full sm:w-[95vw] lg:w-[1200px]"
                maxHeight="100vh"
                buttons={[
                    ...(!showEncodingTable || isEncodingLocked
                        ? []
                        : [
                            { label: "Finalize Grade", type: "blue", onClick: handleFinalizeGrade },
                            { label: "Save as draft", type: "green", onClick: handleOpenWarningModal, closeOnClick: false }
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