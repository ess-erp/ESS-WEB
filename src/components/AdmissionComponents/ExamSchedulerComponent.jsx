import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { Listbox } from "@headlessui/react";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import {
    fetchExaminationSchedulerData,
    fetchExamSchedTemplateData,
    fetchInsertExamScheduleData,
} from "../../states/AdmissionState/Action";

const ExamSchedulerComponent = ({ studentId, levelId }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const dispatch = useDispatch();

    const examSchedState = useSelector((state) => state.admission.examSchedState || {});
    const examSchedData = examSchedState.data || null;

    const examSchedTemplateState = useSelector((state) => state.admission.examSchedTemplateState || {});
    const examTemplate = examSchedTemplateState.data || [];

    const insertExamScheduleState = useSelector((state) => state.admission.insertExamScheduleState || {});

    useEffect(() => {
        if (studentId) {
            dispatch(fetchExaminationSchedulerData(studentId));
        }
        if (levelId) {
            dispatch(fetchExamSchedTemplateData(levelId));
        }
    }, [dispatch, studentId, levelId]);

    const isScheduled = examSchedData && examSchedData.ExamId > 0;

    const [selectedExam, setSelectedExam] = useState(null);
    useEffect(() => {
        if (examSchedData && examSchedData.ExamId > 0) {
            setSelectedExam(examSchedData);
        }
    }, [examSchedData]);

    // form data
    const [formData, setFormData] = useState({
        generalAverage: "",
        examDate: "",
        examResultDate: "",
    });

    useEffect(() => {
        if (examSchedData && examSchedData.ExamId > 0) {
            setFormData({
                generalAverage: examSchedData.OverAllGpa ?? "",
                examDate: examSchedData.ExamDate
                    ? new Date(examSchedData.ExamDate).toISOString().split("T")[0]
                    : "",
                examResultDate: examSchedData.ExamResultDate
                    ? new Date(examSchedData.ExamResultDate).toISOString().split("T")[0]
                    : "",
            });
        }
    }, [examSchedData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const form = {
        SchedId: selectedExam?.SchedId || 0,
        SchedTempId: selectedExam?.SchedTempId || 0,
        RoomId: selectedExam?.RoomId || 0,
        RoomTemp: selectedExam?.RoomTempId || 0,
        StudentId: studentId,
        CreatedByUserId: user.UserId,
        ExamDate: formData?.examDate || null,
        ExamResultDate: formData?.examResultDate || null,
    };
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

    const handleSubmit = () => {
        setIsLoadingModalOpen(true);
        dispatch(fetchInsertExamScheduleData(form));
    };


    const [isEditable, setIsEditable] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };



    useEffect(() => {
        if (!insertExamScheduleState.loading) {

            setIsLoadingModalOpen(false);

            if (insertExamScheduleState.data && Object.keys(insertExamScheduleState.data).length > 0) {
                setIsModalOpen(false);
                setIsSuccessModalOpen(true);
            } else if (insertExamScheduleState.error) {
                setIsModalOpen(false);
                setIsErrorModalOpen(true);
            }
        }
    }, [insertExamScheduleState]);
    
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-700">
                    Examination Scheduler
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
                        Examination Information
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                            <strong>General Point Average:</strong> {formData.generalAverage}
                        </li>
                        <li>
                            <strong>Exam Location:</strong> {selectedExam?.RoomCode || ""}-{selectedExam?.RoomName}
                        </li>
                        <li>
                            <strong>Exam Date From:</strong>{" "}
                            {selectedExam?.StartDate ? new Date(selectedExam.StartDate).toLocaleDateString() : ""}
                        </li>
                        <li>
                            <strong>Exam Date To:</strong>{" "}
                            {selectedExam?.EndDate ? new Date(selectedExam.EndDate).toLocaleDateString() : ""}
                        </li>
                        <li>
                            <strong>Exam Start Time:</strong> {selectedExam?.StartTime || ""}
                        </li>
                        <li>
                            <strong>Exam End Time:</strong> {selectedExam?.EndTime || ""}
                        </li>
                        <li>
                            <strong>Number of slot:</strong> {selectedExam?.NoOfSlot || ""}
                        </li>
                    </ul>
                </div>

                {/* Right side - Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Exam Location / Room */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Exam Location / Room
                            </label>
                            <Listbox value={selectedExam} onChange={setSelectedExam} disabled={!isEditable && isScheduled}>
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-xs disabled:bg-gray-100">
                                        {selectedExam
                                            ? `${selectedExam.Description}-${selectedExam.RoomCode}-${selectedExam.RoomName} : (${selectedExam.StartTime} - ${selectedExam.EndTime})`
                                            : "Select room for examination"}
                                    </Listbox.Button>
                                    {isEditable && (
                                        <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                            {examTemplate.length > 0 ? (
                                                examTemplate.map((exam) => (
                                                    <Listbox.Option
                                                        key={exam.SchedId}
                                                        value={exam}
                                                        className={({ active }) =>
                                                            `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                        }
                                                    >
                                                        {exam.Description}-{exam.RoomCode}-{exam.RoomName} : ({exam.StartTime} - {exam.EndTime})
                                                    </Listbox.Option>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-gray-500">No exam schedules found</div>
                                            )}
                                        </Listbox.Options>
                                    )}
                                </div>
                            </Listbox>
                        </div>

                        {/* Examination Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Examination Date
                            </label>
                            <input
                                type="date"
                                name="examDate"
                                value={formData.examDate}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                required
                                disabled={isScheduled && !isEditable}
                            />
                        </div>

                        {/* Exam Result Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Examination Result Date
                            </label>
                            <input
                                type="date"
                                name="examResultDate"
                                value={formData.examResultDate}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                required
                                disabled={isScheduled && !isEditable}
                            />
                        </div>

                        {/* Submit */}
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
                        body={insertExamScheduleState.error || "Something went wrong. Please try again."}
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
                                <span className="text-gray-600">Saving exam schedule.</span>
                                <span className="text-gray-600">Test permit sending to parents.</span>
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

export default ExamSchedulerComponent;
