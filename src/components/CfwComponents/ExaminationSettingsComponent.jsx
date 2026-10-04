import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Listbox } from "@headlessui/react";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchExamSettingsCodeData,
    fetchExamScheduleCreatedData,
    fetchExamSettingsCodeByStudentIdData,
    fetchAllUserByUserRoleData,
    fetchInsertStudentExamCodeSettingsData,
} from "../../states/CfwState/Action";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";

const ExaminationSettingsComponent = ({ AppId, levelId }) => {
    const dispatch = useDispatch();
    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;

    // ============================================================================
    // USER DATA FROM LOCAL STORAGE
    // ============================================================================
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // ============================================================================
    // REDUX SELECTORS - Dropdown Options
    // ============================================================================
    const examSettingsCodeData = useSelector((state) => state.cfw.examSettingsCodeState?.data || []);
    const examScheduleCreatedData = useSelector((state) => state.cfw.examScheduleCreatedState?.data || []);
    const allUserData = useSelector((state) => state.cfw.allUserByUserRoleState?.data || []);

    // ============================================================================
    // REDUX SELECTOR - Student's Existing Exam Settings Data
    // ============================================================================
    const studentExamData = useSelector((state) => state.cfw.examSettingsCodeByStudentIdState?.data);

    // ============================================================================
    // FORM STATE
    // ============================================================================
    const [isEditable, setIsEditable] = useState(false);
    const [examCodeVal, setExamCodeVal] = useState(null);
    const [effectiveDate, setEffectiveDate] = useState('');
    const [examSchedVal, setExamSchedVal] = useState(null);
    const [selectedInterviewer, setSelectedInterviewer] = useState(null);
    const [selectedRemark, setSelectedRemark] = useState('');
    const [generalRemarks, setGeneralRemarks] = useState('');
    const [listOfSubjects, setListOfSubjects] = useState([]);

    // ============================================================================
    // MODAL STATE
    // ============================================================================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    // Interview Remarks Options
    const InterviewRemarksOptions = [
        "Recommended",
        "Recommended With Reservation",
        "Not recommended",
    ];

    // ============================================================================
    // INITIAL DATA FETCH - Runs once on mount
    // ============================================================================
    useEffect(() => {
        console.log('🔄 Initial fetch with AppId:', AppId, 'levelId:', levelId);
        
        // Fetch dropdown options
        dispatch(fetchExamSettingsCodeData(levelId));
        dispatch(fetchExamScheduleCreatedData(levelId));
        dispatch(fetchAllUserByUserRoleData(2)); // UserRoleId = 2 for interviewers
        
        // Fetch student's existing exam settings
        dispatch(fetchExamSettingsCodeByStudentIdData(AppId));
    }, [dispatch, AppId, levelId]);

    // ============================================================================
    // POPULATE FORM WHEN STUDENT DATA LOADS
    // ============================================================================
    useEffect(() => {
        console.log('📦 Student Exam Data:', studentExamData);
        
        if (studentExamData && studentExamData.AppId) {
            console.log('✅ Found existing student exam data, populating form...');
            
            // Set subjects list
            if (studentExamData.ListOfSubjectDtos && Array.isArray(studentExamData.ListOfSubjectDtos)) {
                console.log('📝 Setting subjects:', studentExamData.ListOfSubjectDtos);
                setListOfSubjects(studentExamData.ListOfSubjectDtos);
            }
            
            // Set date (remove time part)
            if (studentExamData.DateExamTaken) {
                const dateOnly = studentExamData.DateExamTaken.split('T')[0];
                setEffectiveDate(dateOnly);
            }
            
            // Set remarks
            setSelectedRemark(studentExamData.InterviewRemarks || '');
            setGeneralRemarks(studentExamData.GeneralRemarks || '');
        } else {
            console.log('❌ No existing student exam data');
        }
    }, [studentExamData]);

    // ============================================================================
    // MATCH AND SELECT DROPDOWN OPTIONS WHEN DATA IS AVAILABLE
    // ============================================================================
    useEffect(() => {
        if (!studentExamData || !studentExamData.AppId) return;
        
        // Match Exam Code from dropdown options
        if (examSettingsCodeData.length > 0 && studentExamData.CfwExamId) {
            const matchingCode = examSettingsCodeData.find(code => code.CfwExamId === studentExamData.CfwExamId);
            if (matchingCode) {
                console.log('🔍 Matched Exam Code:', matchingCode);
                setExamCodeVal(matchingCode);
            }
        }
        
        // Match Exam Schedule from dropdown options
        if (examScheduleCreatedData.length > 0 && studentExamData.SchedId) {
            const matchingSched = examScheduleCreatedData.find(sched => sched.SchedId === studentExamData.SchedId);
            if (matchingSched) {
                console.log('📆 Matched Schedule:', matchingSched);
                setExamSchedVal(matchingSched);
            }
        }
        
        // Match Interviewer from dropdown options
        if (allUserData.length > 0 && studentExamData.InterviewerId) {
            const matchingInterviewer = allUserData.find(u => u.UserId === studentExamData.InterviewerId);
            if (matchingInterviewer) {
                console.log('👤 Matched Interviewer:', matchingInterviewer);
                setSelectedInterviewer(matchingInterviewer);
            }
        }
    }, [studentExamData, examSettingsCodeData, examScheduleCreatedData, allUserData]);

    // ============================================================================
    // HANDLE EXAM CODE CHANGE - Update Subjects List
    // ============================================================================
    const handleExamCodeChange = (selectedCode) => {
        console.log('📋 Exam code selected:', selectedCode);
        setExamCodeVal(selectedCode);
        
        if (selectedCode && selectedCode.ExamSettingsCodeChildDtos) {
            console.log('📝 Updating subjects from dropdown:', selectedCode.ExamSettingsCodeChildDtos);
            setListOfSubjects(selectedCode.ExamSettingsCodeChildDtos);
        }
    };

    // ============================================================================
    // HANDLE FORM SUBMISSION
    // ============================================================================
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        setIsModalOpen(false);
        setIsLoadingModalOpen(true);

        const payload = {
            AppId: AppId,
            CfwExamId: examCodeVal?.CfwExamId,
            SchedId: examSchedVal?.SchedId,
            DateExamTaken: effectiveDate,
            EvaluatorId: user?.UserId,
            InterviewerId: selectedInterviewer?.UserId,
            InterviewRemarks: selectedRemark,
            GeneralRemarks: generalRemarks,
            CreatedByUserId: user?.UserId,
        };

        console.log('💾 Submitting payload:', payload);

        const res = await dispatch(fetchInsertStudentExamCodeSettingsData(payload));
        
        setIsLoadingModalOpen(false);
        
        if (res.ok) {
            setIsSuccessModalOpen(true);
            setTimeout(() => window.location.reload(), 3000);
        } else {
            setIsErrorModalOpen(true);
        }
    };

    // ============================================================================
    // RENDER
    // ============================================================================
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-700">
                    Examination Settings
                </h2>

                <div className="flex justify-end items-center mb-4">
                    <span className="mr-2 text-md font-bold text-gray-600">Enable Edit</span>
                    <RowToggleComponent
                        row={{ isActive: isEditable }}
                        onToggle={(row, newStatus) => setIsEditable(newStatus)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT SIDE - Information Display */}
                <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6 shadow">
                    <h3 className="text-lg font-semibold text-green-700 mb-3">
                        Examination Settings Information
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                            <strong>Exam Code: </strong>
                            {studentExamData?.ExamCode || (examCodeVal ? `${examCodeVal.TempName}-${examCodeVal.ExamCode}` : "—")}
                        </li>
                        <li>
                            <strong>Date Exam Taken: </strong>
                            {studentExamData?.DateExamTaken ? formatDate(studentExamData.DateExamTaken) : (effectiveDate || "—")}
                        </li>
                        <li>
                            <strong>Exam Settings Validation From-To: </strong>
                            {studentExamData?.StartDate && studentExamData?.EndDate
                                ? `${formatDate(studentExamData.StartDate)} - ${formatDate(studentExamData.EndDate)}`
                                : (examSchedVal?.StartDate && examSchedVal?.EndDate
                                    ? `${formatDate(examSchedVal.StartDate)} - ${formatDate(examSchedVal.EndDate)}`
                                    : "—")}
                        </li>
                        <li>
                            <strong>Exam Start Time: </strong>
                            {studentExamData?.StartTime ? formatToAMPM(studentExamData.StartTime) : (examSchedVal?.StartTime ? formatToAMPM(examSchedVal.StartTime) : "—")}
                        </li>
                        <li>
                            <strong>Exam End Time: </strong>
                            {studentExamData?.EndTime ? formatToAMPM(studentExamData.EndTime) : (examSchedVal?.EndTime ? formatToAMPM(examSchedVal.EndTime) : "—")}
                        </li>
                        <li>
                            <strong>Number of slot: </strong>
                            {studentExamData?.NoOfSlot || examSchedVal?.NoOfSlot || "—"}
                        </li>
                    </ul>
                    
                    <hr className="mt-4 mb-2" />
                    
                    <h4 className="text-md font-bold text-black-700 mb-3">
                        List of Subjects Offered
                    </h4>
                    
                    {listOfSubjects && listOfSubjects.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-gray-700 text-sm">
                            {listOfSubjects.map((subject, index) => (
                                <li key={subject.GenSubChildId || index} className="mb-2">
                                    <strong>Subject: </strong>
                                    {subject.SubjectCode || "—"} - {subject.SubjectName || "—"} <br />
                                    <strong>Number of Items: </strong>
                                    {subject.NumberOfItems || "—"}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="mt-3 text-gray-500 text-sm italic">
                            {isEditable 
                                ? "Please select an examination code to see the subjects."
                                : "No subjects found for this exam."}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE - Form */}
                <div>
                    <form className="space-y-4">
                        {/* Examination Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Examination Code
                            </label>
                            <Listbox value={examCodeVal} onChange={handleExamCodeChange} disabled={!isEditable}>
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-xs disabled:bg-gray-100">
                                        {examCodeVal
                                            ? `${examCodeVal.TempName}-${examCodeVal.ExamCode} : ${examCodeVal.DateCreated}`
                                            : "Select examination code"}
                                    </Listbox.Button>
                                    {isEditable && (
                                        <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                            {examSettingsCodeData.length > 0 ? (
                                                examSettingsCodeData.map((code) => (
                                                    <Listbox.Option
                                                        key={code.CfwExamId}
                                                        value={code}
                                                        className={({ active }) =>
                                                            `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                        }
                                                    >
                                                        {code.TempName}-{code.ExamCode} : {code.DateCreated}
                                                    </Listbox.Option>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-gray-500">No examination code found</div>
                                            )}
                                        </Listbox.Options>
                                    )}
                                </div>
                            </Listbox>
                        </div>

                        {/* Date Exam Taken */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Exam Taken
                            </label>
                            <input
                                type="date"
                                name="effectiveDate"
                                value={effectiveDate}
                                onChange={(e) => setEffectiveDate(e.target.value)}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                required
                                disabled={!isEditable}
                            />
                        </div>

                        {/* Exam Schedule */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Exam Schedule
                            </label>
                            <Listbox value={examSchedVal} onChange={setExamSchedVal} disabled={!isEditable}>
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-xs disabled:bg-gray-100">
                                        {examSchedVal
                                            ? `${examSchedVal.Description} : ${examSchedVal.DateCreated}`
                                            : "Select exam schedule"}
                                    </Listbox.Button>
                                    {isEditable && (
                                        <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                            {examScheduleCreatedData.length > 0 ? (
                                                examScheduleCreatedData.map((sched) => (
                                                    <Listbox.Option
                                                        key={sched.SchedId}
                                                        value={sched}
                                                        className={({ active }) =>
                                                            `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                        }
                                                    >
                                                        {sched.Description} : {sched.DateCreated}
                                                    </Listbox.Option>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-gray-500">No exam schedule found</div>
                                            )}
                                        </Listbox.Options>
                                    )}
                                </div>
                            </Listbox>
                        </div>

                        {/* Evaluator */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Evaluator
                            </label>
                            <input
                                type="text"
                                name="evaluator"
                                value={`${user?.Fname || ""} ${user?.Mname || ""} ${user?.Lname || ""}`.trim()}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                required
                                disabled={true}
                            />
                        </div>

                        {/* Interview By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview By
                            </label>
                            <Listbox value={selectedInterviewer} onChange={setSelectedInterviewer} disabled={!isEditable}>
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-xs disabled:bg-gray-100">
                                        {selectedInterviewer
                                            ? `${selectedInterviewer.Fname} ${selectedInterviewer.Mname || ""} ${selectedInterviewer.Lname}`
                                            : "Select an interviewer"}
                                    </Listbox.Button>
                                    {isEditable && (
                                        <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                            {allUserData.length > 0 ? (
                                                allUserData.map((interviewer) => (
                                                    <Listbox.Option
                                                        key={interviewer.UserId}
                                                        value={interviewer}
                                                        className={({ active }) =>
                                                            `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                        }
                                                    >
                                                        {interviewer.Fname} {interviewer.Mname || ""} {interviewer.Lname}
                                                    </Listbox.Option>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-gray-500">No users found</div>
                                            )}
                                        </Listbox.Options>
                                    )}
                                </div>
                            </Listbox>
                        </div>

                        {/* Interview Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview Remarks
                            </label>
                            <Listbox value={selectedRemark} onChange={setSelectedRemark} disabled={!isEditable}>
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-lg p-2 text-left bg-white shadow-xs disabled:bg-gray-100">
                                        {selectedRemark || "Select interview remarks"}
                                    </Listbox.Button>
                                    {isEditable && (
                                        <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                            {InterviewRemarksOptions.map((option, idx) => (
                                                <Listbox.Option
                                                    key={idx}
                                                    value={option}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                    }
                                                >
                                                    {option}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    )}
                                </div>
                            </Listbox>
                        </div>

                        {/* General Evaluation/Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                General Evaluation/ Remarks
                            </label>
                            <input
                                type="text"
                                name="generalremarks"
                                value={generalRemarks}
                                onChange={(e) => setGeneralRemarks(e.target.value)}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                required
                                disabled={!isEditable}
                                placeholder="Enter general evaluation or remarks"
                            />
                        </div>

                        {/* Save Button */}
                        {isEditable && (
                            <div className="flex justify-end mt-4">
                                <GreenBtn label="Save" onClick={handleOpenModal} />
                            </div>
                        )}
                    </form>

                    {/* Modals */}
                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title={<span className="font-bold text-lg text-red-700">Warning</span>}
                        body="Are you sure you want to submit?"
                        buttons={[
                            { label: "Yes", type: "green", onClick: handleSubmit },
                            { label: "No", type: "red", onClick: () => setIsModalOpen(false) },
                        ]}
                    />
                    <ModalComponent
                        isOpen={isSuccessModalOpen}
                        onClose={() => setIsSuccessModalOpen(false)}
                        title={<span className="font-bold text-lg text-green-700">Success</span>}
                        body="Exam schedule has been successfully submitted! Test permit was sent to parent emails."
                        buttons={[
                            { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
                        ]}
                    />
                    <ModalComponent
                        isOpen={isErrorModalOpen}
                        onClose={() => setIsErrorModalOpen(false)}
                        title={<span className="font-bold text-lg text-red-700">Error</span>}
                        body={"Something went wrong. Please try again."}
                        buttons={[
                            { label: "Close", type: "red", onClick: () => setIsErrorModalOpen(false) }
                        ]}
                    />
                    <ModalComponent
                        isOpen={isLoadingModalOpen}
                        onClose={() => { }}
                        title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                        body={
                            <div className="flex flex-col items-center justify-center gap-3">
                                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                <span className="text-gray-600">Saving examination settings.</span>
                                <span className="text-gray-600">Please wait, don't close this window.</span>
                            </div>
                        }
                        buttons={[]}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExaminationSettingsComponent;
