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

const ExaminationSettingsComponent = ({ studentId, levelId }) => {
    console.log(studentId);
    const dispatch = useDispatch();
    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;

    const user = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    console.log(user);

    const examSettingsCodeState = useSelector((state) => state.cfw.examSettingsCodeState || {});
    const examSettingsCodeData = examSettingsCodeState.data || [];

    const examScheduleCreatedState = useSelector((state) => state.cfw.examScheduleCreatedState || {});
    const examScheduleCreatedData = examScheduleCreatedState.data || [];

    const examSettingsCodeByStudentIdState = useSelector((state) => state.cfw.examSettingsCodeByStudentIdState || {});
    const examSettingsCodeByStudentIdData = examSettingsCodeByStudentIdState.data || [];

    const allUserByUserRoleState = useSelector((state) => state.cfw.allUserByUserRoleState || {});
    const allUserData = allUserByUserRoleState.data || [];

    const InterviewRemarksOptions = [
        "Recommended",
        "Recommended With Reservation",
        "Not recommended",
    ];
    const [selectedRemark, setSelectedRemark] = useState(null);

    console.log(examSettingsCodeByStudentIdData);

    console.log(examScheduleCreatedData);

    console.log(examSettingsCodeData);

    console.log(allUserData);

    useEffect(() => {
        dispatch(fetchExamSettingsCodeData(levelId));
        dispatch(fetchExamScheduleCreatedData(levelId));
        dispatch(fetchAllUserByUserRoleData("2"));
    }, [dispatch, levelId]);

    useEffect(() => {
        dispatch(fetchExamSettingsCodeByStudentIdData(studentId));
        
    }, [dispatch, studentId]);

    const [isEditable, setIsEditable] = useState(false);
    const [examCodeVal, setExamCodeVal] = useState(null);
    const [effectiveDate, setSelectedEffectiveDate] = useState(null);

    const [examSchedVal, setExamSchedVal] = useState(null);

    const [selectedInterviewer, setSelectInterviewer] = useState(0);

    const [generalRemarks, setGeneralRemarks] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [listOfSubjects, setListOfSubjects] = useState([]);
    // const [examDate, setExamDate] = useState(null);
    // const [startTime, setStartTime] = useState("-");
    // const [endTime, setEndTime] = useState("-");
    // const [numberOfSlot, setNumberOfSlot] = useState("-");


    useEffect(() => {
        if(examSettingsCodeByStudentIdData){
            setListOfSubjects(examSettingsCodeByStudentIdData?.ListOfSubjectDtos || []);
        }
        
        
    }, [examSettingsCodeByStudentIdData?.ListOfSubjectDtos]);

    const handleChangeListOfSubjects = (val) => {
        console.log(val);
        setListOfSubjects(val.ExamSettingsCodeChildDtos);
    };


    console.log(examCodeVal);
    console.log(examSchedVal);
    const handleOpenModal = () => {
        console.log("TEST");
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        // alert("Test");
        setIsLoadingModalOpen(true);
        const payload = {
            StudentId: studentId,
            CfwExamId: examCodeVal.CfwExamId,
            SchedId: examSchedVal.SchedId,
            DateExamTaken: effectiveDate,
            EvaluatorId: user[0].UserId,
            InterviewerId: selectedInterviewer.UserId,
            InterviewRemarks: selectedRemark,
            GeneralRemarks: generalRemarks,
            CreatedByUserId: user[0].UserId,
        }
        console.log(payload);
        const res = await dispatch(fetchInsertStudentExamCodeSettingsData(payload));
        if (res.ok) {
            setIsLoadingModalOpen(false);
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }

        }
        else {
            setIsLoadingModalOpen(false);
            setIsErrorModalOpen(true);
        }

    };

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
                <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6 shadow">
                    <h3 className="text-lg font-semibold text-green-700 mb-3">
                        Examination Settings Information
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                            <strong>Exam Code: </strong>
                            {examSettingsCodeByStudentIdData.length !== 0
                                ? examSettingsCodeByStudentIdData.ExamCode
                                : examCodeVal
                                    ? `${examCodeVal.TempName}-${examCodeVal.ExamCode}`
                                    : "—"}
                        </li>
                        <li>
                            <strong>Date Exam Taken: </strong>
                            {
                                examSettingsCodeByStudentIdData.length !== 0
                                    ? formatDate(examSettingsCodeByStudentIdData.DateExamTaken) || "-"
                                    : effectiveDate || "-"
                            }
                        </li>
                        <li>
                            <strong>Exam Settings Validation From-To: </strong>
                            {
                                examSettingsCodeByStudentIdData.length !== 0
                                    ? `${formatDate(examSettingsCodeByStudentIdData.StartDate)} - ${formatDate(examSettingsCodeByStudentIdData.EndDate)}`
                                    : `${formatDate(examSchedVal?.StartDate)} - ${formatDate(examSchedVal?.EndDate)}` || "-"
                            }

                        </li>
                        <li>
                            <strong>Exam Start Time: </strong>
                            {
                                examSettingsCodeByStudentIdData.length !== 0
                                    ? `${formatToAMPM(examSettingsCodeByStudentIdData.StartTime)}`
                                    : `${formatToAMPM(examSchedVal?.StartTime)}` || "-"
                            }
                        </li>
                        <li>
                            <strong>Exam End Time: </strong>
                            {
                                examSettingsCodeByStudentIdData.length !== 0
                                    ? `${formatToAMPM(examSettingsCodeByStudentIdData.EndTime)}`
                                    : `${formatToAMPM(examSchedVal?.EndTime)}` || "-"
                            }
                        </li>
                        <li>
                            <strong>Number of slot: </strong>
                            {
                                examSettingsCodeByStudentIdData.length !== 0
                                    ? examSettingsCodeByStudentIdData.NoOfSlot
                                    : examSchedVal?.NoOfSlot || "-"
                            }
                        </li>
                    </ul>
                    < hr className="mt-4 mb-2" />
                    <h4 className="text-md font-bold text-black-700 mb-3">
                        List of Subjects Offered
                    </h4>
                    <ul className="mt-3 space-y-2 text-gray-700 text-sm">
                        {listOfSubjects.map(child => (
                            <li key={child.GenSubChildId} className="mb-2">
                                <strong>Subject: </strong>
                                {child.SubjectCode || "-"} - {child.SubjectName || "-"} <br />
                                <strong>Number of Item: </strong>
                                {child.NumberOfItems || "-"}
                            </li>
                        ))}
                    </ul>
                    {/* {
                        examSettingsCodeByStudentIdData ? (
                           
                        ) : examCodeVal?.ExamSettingsCodeChildDtos?.length != 0 ? (
                            <ul className="mt-3 space-y-2 text-gray-700 text-sm">
                                {examCodeVal.ExamSettingsCodeChildDtos.map(child => (
                                    <li key={child.GenSubChildId} className="mb-2">
                                        <strong>Subject: </strong>
                                        {child.SubjectCode || "-"} - {child.SubjectName || "-"} <br />
                                        <strong>Number of Item: </strong>
                                        {child.NumberOfItem || "-"}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="mt-3 text-gray-500 text-sm">
                                No subjects found for this exam.
                            </div>
                        )
                    } */}
                </div>

                {/* Right side - Form */}
                <div>
                    <form className="space-y-4">
                        {/* Exam Location / Room */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Examination Code
                            </label>
                            <Listbox value={examCodeVal} onChange={(val) => { setExamCodeVal(val); handleChangeListOfSubjects(val);}} disabled={!isEditable}>
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-xs disabled:bg-gray-100">
                                        {examCodeVal
                                            ? `${examCodeVal.TempName}-${examCodeVal.ExamCode} : ${examCodeVal.DateCreated}`
                                            : "Select examination code"}
                                    </Listbox.Button>
                                    {isEditable && (
                                        <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                            {examSettingsCodeData.length > 0 ? (
                                                examSettingsCodeData.map((examCode) => (
                                                    <Listbox.Option
                                                        key={examCode.CfwExamId}
                                                        value={examCode}
                                                        className={({ active }) =>
                                                            `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                        }
                                                    >
                                                        {examCode.TempName}-{examCode.ExamCode} : {examCode.DateCreated}
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

                        {/* Examination Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Exam Taken
                            </label>
                            <input
                                type="date"
                                name="effectiveDate"
                                // value={formData.examDate}
                                // onChange={handleChange}
                                onChange={(e) => setSelectedEffectiveDate(e.target.value)}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                required
                                disabled={!isEditable}
                            />
                        </div>

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
                                                examScheduleCreatedData.map((examSched) => (
                                                    <Listbox.Option
                                                        key={examSched.SchedId}
                                                        value={examSched}
                                                        className={({ active }) =>
                                                            `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                        }
                                                    >
                                                        {examSched.Description} : {examSched.DateCreated}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Evaluator
                            </label>
                            <input
                                type="text"
                                name="evaluator"
                                value={`${user[0]?.Fname || ""} ${user[0]?.Mname || ""} ${user[0]?.Lname || ""}`.trim()}
                                // value={formData.examDate}
                                // onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                required
                                disabled={!isEditable}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview By
                            </label>
                            <Listbox value={selectedInterviewer} onChange={setSelectInterviewer} disabled={!isEditable}>
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-xs disabled:bg-gray-100">
                                        {selectedInterviewer
                                            ? `${selectedInterviewer.Fname} ${selectedInterviewer?.Mname || ""}  ${selectedInterviewer.Lname}`
                                            : "Select an interviewer"}
                                    </Listbox.Button>
                                    {isEditable && (
                                        <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                            {allUserData.length > 0 ? (
                                                allUserData.map((allUser) => (
                                                    <Listbox.Option
                                                        key={allUser.UserId}
                                                        value={allUser}
                                                        className={({ active }) =>
                                                            `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                        }
                                                    >
                                                        {allUser.Fname} {allUser?.Mname || ""} {allUser.Lname}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview Remarks
                            </label>

                            <Listbox value={selectedRemark} onChange={setSelectedRemark} disabled={!isEditable}>
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-lg p-2 text-left bg-white shadow-xs disabled:bg-gray-100">
                                        {selectedRemark ? selectedRemark : "Select interview remarks"}
                                    </Listbox.Button>

                                    {isEditable && (
                                        <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                            {InterviewRemarksOptions.map((option, idx) => (
                                                <Listbox.Option
                                                    key={idx}
                                                    value={option}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                        }`
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
                            { label: "No", type: "red" },
                        ]}
                    />
                    <ModalComponent
                        isOpen={isSuccessModalOpen}
                        onClose={() => setIsSuccessModalOpen(false)}
                        title={<span className="font-bold text-lg text-green-700">Success</span>}
                        body="Exam schedule has been successfully submit! Test permit was sent to parent emails."
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
                        onClose={() => { }} // prevent closing while loading
                        title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                        body={
                            <div className="flex flex-col items-center justify-center gap-3">
                                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                <span className="text-gray-600">Saving examination settings.</span>
                                <span className="text-gray-600">Please wait don't close this window.</span>
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