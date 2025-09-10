import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { Listbox } from "@headlessui/react";
import {
    fetchExaminationSchedulerData,
    fetchExamSchedTemplateData,
} from "../../states/AdmissionState/Action";

const ExamSchedulerComponent = ({ studentId, levelId }) => {
    console.log(studentId);
    console.log(levelId);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const dispatch = useDispatch();

    const examSchedState = useSelector((state) => state.admission.examSchedState || {});
    const examSchedData = examSchedState.data || [];

    const examSchedTemplateState = useSelector((state) => state.admission.examSchedTemplateState || {});
    const examTemplate = examSchedTemplateState.data || [];

    console.log(examTemplate);

    console.log(examSchedData);
    useEffect(() => {
        if (studentId) {
            dispatch(fetchExaminationSchedulerData(studentId));
        }
        if (levelId) {
            dispatch(fetchExamSchedTemplateData(levelId));
        }

    }, [dispatch, studentId, levelId]);
    const [formData, setFormData] = useState({
        generalAverage: "",
        examDate: "",
        examResultDate: "",
        examLocation: "",
        examResult: "",
    });
    useEffect(() => {
        if (examSchedData) {
            setFormData((prev) => ({
                ...prev,
                generalAverage: examSchedData.OverAllGpa ?? "", // nullable
            }));
        }
    }, [examSchedData]);

    const [selectedExam, setSelectedExam] = useState(null);
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
    const handleSubmit = () => {
        console.log("Form Submitted:", formData);
        console.log(selectedExam);
        console.log(form);
        // You can dispatch Redux or call API here
    };

    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleOpenModal = () => {
        setIsModalOpen(true);

    };

    return (
        <div>
            {/* Title */}
            <h2 className="text-2xl font-bold text-green-700 mb-6">
                Examination Scheduler
            </h2>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side - Example Information */}
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

                    <p className="mt-4 text-xs text-gray-500">
                        Note: Please encode the correct details at the right side of this component.
                    </p>
                </div>

                {/* Right side - Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Exam Location / Room */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Exam Location / Room
                            </label>
                            <Listbox value={selectedExam} onChange={setSelectedExam}>
                                <div className="relative">
                                    {/* Button */}
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-xs">
                                        {selectedExam
                                            ? `${selectedExam.Description}-${selectedExam.RoomCode}-${selectedExam.RoomName} : (${selectedExam.StartTime} - ${selectedExam.EndTime})`
                                            : "Select room for examination"}
                                    </Listbox.Button>

                                    {/* Dropdown */}
                                    <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                        {examTemplate.length > 0 ? (
                                            examTemplate.map((exam) => (
                                                <Listbox.Option
                                                    key={exam.SchedId}
                                                    value={exam}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                        }`
                                                    }
                                                >
                                                    {/* Show description + time */}
                                                    {exam.Description}-{exam.RoomCode}-{exam.RoomName} : ({exam.StartTime} - {exam.EndTime})
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No exam schedules found</div>
                                        )}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Examination Date
                            </label>
                            <input
                                type="date"
                                name="examDate"
                                value={formData.examDate}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (selectedExam?.StartDate && selectedExam?.EndDate) {
                                        const selectedDate = new Date(value);
                                        const startDate = new Date(selectedExam.StartDate);
                                        const endDate = new Date(selectedExam.EndDate);

                                        if (selectedDate < startDate || selectedDate > endDate) {
                                            alert("Selected date must be within the exam date range!");
                                            return; // prevent setting invalid date
                                        }
                                    }
                                    handleChange(e); // update formData if valid
                                }}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                                required
                                min={selectedExam?.StartDate ? new Date(selectedExam.StartDate).toISOString().split("T")[0] : undefined}
                                max={selectedExam?.EndDate ? new Date(selectedExam.EndDate).toISOString().split("T")[0] : undefined}
                                disabled={!selectedExam}
                            />
                        </div>


                        {/* Exam Result */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Examination Result Date
                            </label>
                            <input
                                type="date"
                                name="examResultDate"
                                value={formData.examResultDate}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // ✅ Extra validation: result date must equal exam date
                                    if (formData.examDate) {
                                        const examDate = new Date(formData.examDate);
                                        const resultDate = new Date(value);

                                        // if (resultDate.getTime() !== examDate.getTime()) {
                                        //     alert("Exam Result Date must be the same as the Examination Date!");
                                        //     return;
                                        // }
                                    } else {
                                        alert("Please select an Examination Date first!");
                                        return;
                                    }

                                    handleChange(e);
                                }}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                                required
                                min={
                                    formData.examDate
                                        ? new Date(formData.examDate).toISOString().split("T")[0]
                                        : undefined
                                }
                                max={
                                    selectedExam?.EndDate
                                        ? new Date(selectedExam?.EndDate).toISOString().split("T")[0]
                                        : undefined
                                }
                                disabled={!formData.examDate} // disable until examDate is chosen
                            />
                        </div>


                        {/* Submit */}
                        <div className="flex justify-end mt-4">
                            <GreenBtn label="Save" onClick={handleOpenModal} />
                        </div>
                    </form>
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
                </div>
            </div>
        </div>
    );
};

export default ExamSchedulerComponent;
