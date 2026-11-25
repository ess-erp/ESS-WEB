import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { BookOpen, GraduationCap, Users, CheckCircle } from "lucide-react";
import {
    fetchListOfSectionUserData,
    fetchSectionStudentsWithSubjects,
    fetchInsertEncodedGradesData,
    fetchFinalizeEncodedGradesData,
} from "../../states/TeacherState/Action";

const EncodingGradeClubComponent = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;

    // Section list state
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

    // Modal and grade encoding state
    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [confirmSaveModalOpen, setConfirmSaveModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadId, setLoadId] = useState(0);
    const [levelName, setLevelName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [termActivated, setTermActivated] = useState("");
    const [activeTab, setActiveTab] = useState("male");
    
    // Students and subjects state
    const [subjects, setSubjects] = useState([]);
    const [gradeData, setGradeData] = useState({});
    const [gradeErrors, setGradeErrors] = useState({});
    const [attendanceData, setAttendanceData] = useState({}); // For Days Present, Absent, Tardy
    
    const sectionStudentsState = useSelector((state) => state.teacher.sectionStudentsWithSubjectsState || {});
    const studentsData = sectionStudentsState.data?.data || [];
    const totalRecords = sectionStudentsState.data?.totalRecords || 0;
    const studentsLoading = sectionStudentsState.loading || false;
    
    const openRowModal = (row) => {
        console.log('Opening modal for section:', row);
        setLoadId(row?.LoadId);
        setLevelName(row?.LevelName);
        setSectionName(row?.SectionName);
        setRowModalOpen(true);
        setActiveTab("male"); // Reset to male tab when opening
    };

    // Fetch students when modal opens or gender tab changes
    useEffect(() => {
        if (!rowModalOpen || !loadId || !userId || studentsLoading) return;
        
        const gender = activeTab === "male" ? "Male" : "Female";
        console.log('Fetching students:', { loadId, userId, gender });
        dispatch(fetchSectionStudentsWithSubjects(loadId, userId, gender, 0, 100, ""));
    }, [rowModalOpen, loadId, userId, activeTab]); // Removed studentsLoading and dispatch from dependencies

    // Extract subjects from first student when data changes
    useEffect(() => {
        if (!studentsData || studentsData.length === 0) {
            setSubjects([]);
            return;
        }
        
        console.log('Students data received:', studentsData);
        
        // Extract subjects and term from first student (all students have same subjects)
        const firstStudent = studentsData[0];
        if (firstStudent) {
            if (firstStudent.Subjects) {
                setSubjects(firstStudent.Subjects);
                console.log('Subjects extracted:', firstStudent.Subjects);
                
                // Determine active term from subject flags
                if (firstStudent.Subjects.length > 0) {
                    const firstSubject = firstStudent.Subjects[0];
                    if (firstSubject.Term1) setTermActivated("1st Term");
                    else if (firstSubject.Term2) setTermActivated("2nd Term");
                    else if (firstSubject.Term3) setTermActivated("3rd Term");
                }
            }
        }
    }, [studentsData]);

    // Handle grade input change
    const handleGradeChange = (studentId, loadChildId, value) => {
        const key = `${studentId}-${loadChildId}`;
        
        // Validate grade
        const numValue = parseFloat(value);
        if (value && (isNaN(numValue) || numValue < 65 || numValue > 100)) {
            setGradeErrors(prev => ({
                ...prev,
                [key]: "65-100"
            }));
        } else {
            setGradeErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }

        setGradeData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handle attendance input change (Days Present, Absent, Tardy)
    const handleAttendanceChange = (studentId, loadChildId, field, value) => {
        const key = `${studentId}-${loadChildId}`;
        
        setAttendanceData(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    // Dynamic columns based on subjects
    const studentColumns = useMemo(() => {
        const baseColumns = [
            {
                name: <span className="font-semibold text-gray-700">Student #</span>,
                selector: row => row.StudentNumber,
                sortable: true,
                width: '110px'
            },
            {
                name: <span className="font-semibold text-gray-700">Full Name</span>,
                selector: row => `${row.Lname}, ${row.Fname} ${row.Mname || ''}`,
                sortable: true,
                cell: row => (
                    <div className="py-1">
                        {row.Lname}, {row.Fname} {row.Mname && row.Mname}
                    </div>
                ),
                grow: 2,
            },
        ];

        // Add dynamic subject columns
        const subjectColumns = subjects.map(subject => ({
            name: (
                <div className="flex flex-col items-center text-center">
                    <span className="font-semibold text-blue-700 text-xs">{subject.SubjectCode}</span>
                    <span className="text-xs text-gray-600 mt-0.5">{subject.SubjectName}</span>
                    <div className="flex gap-2 mt-2 text-xs">
                        <span className="text-blue-600">Grade</span>
                        <span className="text-green-600">Present</span>
                        <span className="text-red-600">Absent</span>
                        <span className="text-yellow-600">Tardy</span>
                    </div>
                </div>
            ),
            cell: (row) => {
                const key = `${row.StudentId}-${subject.LoadChildId}`;
                const currentGrade = gradeData[key] ?? "";
                const attendance = attendanceData[key] || {};
                
                return (
                    <div className="flex gap-2 items-center justify-center py-2">
                        {/* Grade Input */}
                        <div className="flex flex-col items-center">
                            <input
                                type="number"
                                step="0.01"
                                min="65"
                                max="100"
                                className="border px-2 py-1.5 w-16 text-center rounded border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                value={currentGrade}
                                onChange={(e) => handleGradeChange(row.StudentId, subject.LoadChildId, e.target.value)}
                                placeholder="—"
                            />
                            {gradeErrors[key] && (
                                <span className="text-red-500 text-xs mt-0.5">
                                    {gradeErrors[key]}
                                </span>
                            )}
                        </div>
                        
                        {/* Days Present */}
                        <input
                            type="number"
                            min="0"
                            max="999"
                            className="border px-2 py-1.5 w-14 text-center rounded border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                            value={attendance.DaysPresent || ""}
                            onChange={(e) => handleAttendanceChange(row.StudentId, subject.LoadChildId, 'DaysPresent', e.target.value)}
                            placeholder="0"
                        />
                        
                        {/* Days Absent */}
                        <input
                            type="number"
                            min="0"
                            max="999"
                            className="border px-2 py-1.5 w-14 text-center rounded border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                            value={attendance.DaysAbsent || ""}
                            onChange={(e) => handleAttendanceChange(row.StudentId, subject.LoadChildId, 'DaysAbsent', e.target.value)}
                            placeholder="0"
                        />
                        
                        {/* Days Tardy */}
                        <input
                            type="number"
                            min="0"
                            max="999"
                            className="border px-2 py-1.5 w-14 text-center rounded border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                            value={attendance.DaysTardy || ""}
                            onChange={(e) => handleAttendanceChange(row.StudentId, subject.LoadChildId, 'DaysTardy', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                );
            },
            width: '220px',
            center: true,
        }));

        return [...baseColumns, ...subjectColumns];
    }, [subjects, gradeData, gradeErrors, attendanceData]);

    const handleSaveGrades = async () => {
        // Build the payload
        const insertEncodeGradeChildDtos = [];
        
        // Iterate through gradeData to build the array
        Object.entries(gradeData).forEach(([key, gradeValue]) => {
            // key format: "StudentId-LoadChildId"
            const [studentIdStr, loadChildIdStr] = key.split('-');
            const studentId = parseInt(studentIdStr);
            const loadChildId = parseInt(loadChildIdStr);
            
            // Find the student in studentsData
            const student = studentsData.find(s => s.StudentId === studentId);
            if (!student) return;
            
            // Find the subject
            const subject = student.Subjects.find(sub => sub.LoadChildId === loadChildId);
            if (!subject) return;
            
            // Only include grades that have been entered
            if (gradeValue && gradeValue.trim() !== '') {
                const grade = parseFloat(gradeValue);
                
                // Skip invalid grades
                if (isNaN(grade) || grade < 65 || grade > 100) {
                    return;
                }
                
                // Get attendance data for this student-subject pair
                const attendance = attendanceData[key] || {};
                const daysPresent = parseInt(attendance.DaysPresent) || 0;
                const daysAbsent = parseInt(attendance.DaysAbsent) || 0;
                const daysTardy = parseInt(attendance.DaysTardy) || 0;
                
                insertEncodeGradeChildDtos.push({
                    StudentId: studentId,
                    LoadChildId: loadChildId,
                    SubjectId: subject.SubjectId,
                    SubjectType: subject.SubjectType || '',
                    Grade: grade,
                    DaysPresent: daysPresent,
                    DaysAbsent: daysAbsent,
                    DaysTardy: daysTardy
                });
            }
        });
        
        if (insertEncodeGradeChildDtos.length === 0) {
            setErrorMessage('Please enter at least one valid grade before saving.');
            setErrorModalOpen(true);
            return;
        }
        
        // Open confirmation modal instead of directly saving
        setConfirmSaveModalOpen(true);
    };

    const confirmSaveGrades = async () => {
        // Build the payload
        const insertEncodeGradeChildDtos = [];
        
        // Iterate through gradeData to build the array
        Object.entries(gradeData).forEach(([key, gradeValue]) => {
            // key format: "StudentId-LoadChildId"
            const [studentIdStr, loadChildIdStr] = key.split('-');
            const studentId = parseInt(studentIdStr);
            const loadChildId = parseInt(loadChildIdStr);
            
            // Find the student in studentsData
            const student = studentsData.find(s => s.StudentId === studentId);
            if (!student) return;
            
            // Find the subject
            const subject = student.Subjects.find(sub => sub.LoadChildId === loadChildId);
            if (!subject) return;
            
            // Only include grades that have been entered
            if (gradeValue && gradeValue.trim() !== '') {
                const grade = parseFloat(gradeValue);
                
                // Skip invalid grades
                if (isNaN(grade) || grade < 65 || grade > 100) {
                    return;
                }
                
                // Get attendance data for this student-subject pair
                const attendance = attendanceData[key] || {};
                const daysPresent = parseInt(attendance.DaysPresent) || 0;
                const daysAbsent = parseInt(attendance.DaysAbsent) || 0;
                const daysTardy = parseInt(attendance.DaysTardy) || 0;
                
                insertEncodeGradeChildDtos.push({
                    StudentId: studentId,
                    LoadChildId: loadChildId,
                    SubjectId: subject.SubjectId,
                    SubjectType: subject.SubjectType || '',
                    Grade: grade,
                    DaysPresent: daysPresent,
                    DaysAbsent: daysAbsent,
                    DaysTardy: daysTardy
                });
            }
        });
        
        const payload = {
            LoadId: loadId,
            TermActivated: termActivated,
            CreatedByUserid: userId,
            InsertEncodeGradeChildDtos: insertEncodeGradeChildDtos
        };
        
        console.log('Save payload:', payload);
        
        const result = await dispatch(fetchInsertEncodedGradesData(payload));
        
        setConfirmSaveModalOpen(false);
        
        if (result.ok) {
            setSuccessMessage(`Successfully saved ${insertEncodeGradeChildDtos.length} grade(s) for ${sectionName}`);
            setSuccessModalOpen(true);
            // Clear grade data and attendance data after successful save
            setGradeData({});
            setGradeErrors({});
            setAttendanceData({});
        } else {
            setErrorMessage(`Error saving grades: ${result.error || 'Unknown error occurred'}`);
            setErrorModalOpen(true);
        }
    };

    const handleFinalizeGrades = async () => {
        // Build the payload (same as save, but with IsValidated: "Y")
        const insertEncodeGradeChildDtos = [];
        
        Object.entries(gradeData).forEach(([key, gradeValue]) => {
            const [studentIdStr, loadChildIdStr] = key.split('-');
            const studentId = parseInt(studentIdStr);
            const loadChildId = parseInt(loadChildIdStr);
            
            const student = studentsData.find(s => s.StudentId === studentId);
            if (!student) return;
            
            const subject = student.Subjects.find(sub => sub.LoadChildId === loadChildId);
            if (!subject) return;
            
            if (gradeValue && gradeValue.trim() !== '') {
                const grade = parseFloat(gradeValue);
                
                if (isNaN(grade) || grade < 65 || grade > 100) {
                    return;
                }
                
                // Get attendance data for this student-subject pair
                const attendance = attendanceData[key] || {};
                const daysPresent = parseInt(attendance.DaysPresent) || 0;
                const daysAbsent = parseInt(attendance.DaysAbsent) || 0;
                const daysTardy = parseInt(attendance.DaysTardy) || 0;
                
                insertEncodeGradeChildDtos.push({
                    StudentId: studentId,
                    LoadChildId: loadChildId,
                    SubjectId: subject.SubjectId,
                    SubjectType: subject.SubjectType || '',
                    Grade: grade,
                    DaysPresent: daysPresent,
                    DaysAbsent: daysAbsent,
                    DaysTardy: daysTardy
                });
            }
        });
        
        if (insertEncodeGradeChildDtos.length === 0) {
            setErrorMessage('Please enter at least one valid grade before finalizing.');
            setErrorModalOpen(true);
            return;
        }
        
        const confirmFinalize = window.confirm(
            'Are you sure you want to finalize these grades? This action may lock the grades from further editing.'
        );
        
        if (!confirmFinalize) return;
        
        const payload = {
            LoadId: loadId,
            TermActivated: termActivated,
            CreatedByUserid: userId,
            IsValidated: "Y",
            InsertEncodeGradeChildDtos: insertEncodeGradeChildDtos
        };
        
        console.log('Finalize payload:', payload);
        
        const result = await dispatch(fetchFinalizeEncodedGradesData(payload));
        
        if (result.ok) {
            setSuccessMessage(`Successfully finalized ${insertEncodeGradeChildDtos.length} grade(s) for ${sectionName}`);
            setSuccessModalOpen(true);
            // Clear grade data and attendance data after successful finalization
            setGradeData({});
            setGradeErrors({});
            setAttendanceData({});
        } else {
            setErrorMessage(`Error finalizing grades: ${result.error || 'Unknown error occurred'}`);
            setErrorModalOpen(true);
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

            {/* Grade Encoding Modal */}
            <ModalComponent
                isOpen={rowModalOpen}
                onClose={() => {
                    setRowModalOpen(false);
                    setGradeData({});
                    setGradeErrors({});
                    setAttendanceData({});
                }}
                size="max-w-7xl w-full"
                maxHeight="90vh"
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
                                        Level Name • Term: {termActivated || "—"}
                                    </label>
                                    <p className="text-sm sm:text-base font-bold text-purple-900">
                                        {levelName || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Male/Female Tabs */}
                            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                <button
                                    onClick={() => setActiveTab("male")}
                                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                                        activeTab === "male"
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    <Users size={16} />
                                    Male Students
                                </button>

                                <button
                                    onClick={() => setActiveTab("female")}
                                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                                        activeTab === "female"
                                            ? "bg-pink-600 text-white shadow-md"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    <Users size={16} />
                                    Female Students
                                </button>
                            </div>

                            {/* Student Grade Table */}
                            <div className="overflow-x-auto">
                                <DataTable
                                    columns={studentColumns}
                                    data={studentsData}
                                    progressPending={studentsLoading}
                                    highlightOnHover
                                    responsive
                                    persistTableHead
                                    dense
                                    noDataComponent={
                                        <div className="py-8 text-center text-gray-500 text-sm">
                                            No students found
                                        </div>
                                    }
                                    customStyles={{
                                        headCells: {
                                            style: {
                                                paddingLeft: '8px',
                                                paddingRight: '8px',
                                                fontSize: '12px',
                                            },
                                        },
                                        cells: {
                                            style: {
                                                paddingLeft: '8px',
                                                paddingRight: '8px',
                                            },
                                        },
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            {studentsData.length > 0 && (
                                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4 pt-4 border-t">
                                    <button
                                        onClick={handleSaveGrades}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md"
                                    >
                                        <CheckCircle size={18} />
                                        Save Grades
                                    </button>

                                    <button
                                        onClick={handleFinalizeGrades}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-md"
                                    >
                                        <CheckCircle size={18} />
                                        Finalize Grades
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                }
            />

            {/* Confirmation Modal for Save */}
            <ModalComponent
                isOpen={confirmSaveModalOpen}
                onClose={() => setConfirmSaveModalOpen(false)}
                size="w-[500px]"
                title={
                    <div className="flex items-center gap-2">
                        <CheckCircle size={24} className="text-blue-600" />
                        <span className="text-xl font-bold text-blue-700">Confirm Save Grades</span>
                    </div>
                }
                body={
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-gray-800 text-sm leading-relaxed">
                                You are about to save <span className="font-bold text-blue-600">{Object.keys(gradeData).filter(key => gradeData[key] && gradeData[key].trim() !== '').length}</span> grade(s) for:
                            </p>
                            <div className="mt-3 space-y-1">
                                <p className="text-sm"><span className="font-semibold">Section:</span> {sectionName}</p>
                                <p className="text-sm"><span className="font-semibold">Level:</span> {levelName}</p>
                                <p className="text-sm"><span className="font-semibold">Term:</span> {termActivated}</p>
                                <p className="text-sm"><span className="font-semibold">Gender:</span> {activeTab === "male" ? "Male" : "Female"}</p>
                            </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm font-medium">
                                ⚠️ Please review all grades carefully before saving. You can still edit them after saving.
                            </p>
                        </div>

                        <p className="text-gray-600 text-sm">
                            Do you want to proceed with saving these grades?
                        </p>
                    </div>
                }
                buttons={[
                    {
                        label: "Yes, Save Grades",
                        type: "blue",
                        onClick: confirmSaveGrades,
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => setConfirmSaveModalOpen(false),
                    },
                ]}
            />

            {/* Success Modal */}
            <ModalComponent
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                size="w-[500px]"
                title={
                    <div className="flex items-center gap-2">
                        <CheckCircle size={24} className="text-green-600" />
                        <span className="text-xl font-bold text-green-700">Success!</span>
                    </div>
                }
                body={
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 text-sm leading-relaxed">
                                {successMessage}
                            </p>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-blue-600 mt-0.5">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-blue-800 text-sm font-medium">What's next?</p>
                                <p className="text-blue-700 text-sm mt-1">
                                    You can continue encoding grades for other students or switch to the other gender tab.
                                </p>
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Close",
                        type: "blue",
                        onClick: () => setSuccessModalOpen(false),
                    },
                ]}
            />

            {/* Error Modal */}
            <ModalComponent
                isOpen={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                size="w-[500px]"
                title={
                    <div className="flex items-center gap-2">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xl font-bold text-red-700">Error</span>
                    </div>
                }
                body={
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm leading-relaxed">
                                {errorMessage}
                            </p>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-yellow-600 mt-0.5">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-yellow-800 text-sm font-medium">What to do?</p>
                                <p className="text-yellow-700 text-sm mt-1">
                                    Please check your internet connection and try again. If the problem persists, contact system support.
                                </p>
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setErrorModalOpen(false),
                    },
                ]}
            />
        </div>
    );
};

export default EncodingGradeClubComponent;
