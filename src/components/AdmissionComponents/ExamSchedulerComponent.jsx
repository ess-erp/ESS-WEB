import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchExaminationSchedulerData,
    fetchExamSchedTemplateData,
} from "../../states/AdmissionState/Action";

const ExamSchedulerComponent = ({ studentId, levelId }) => {
    console.log(studentId);
    console.log(levelId);
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
        if(levelId){
            dispatch(fetchExamSchedTemplateData(levelId));
        }

    }, [dispatch, studentId, levelId]);
    const [formData, setFormData] = useState({
        generalAverage: "",
        examDate: "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
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
                        Letter Template
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                            <strong>Test Permit</strong> 85
                        </li>
                        <li>
                            <strong>Admission Result</strong> 2025-09-10
                        </li>
                        <li>
                            <strong>Letter</strong> Room 201, Main Building
                        </li>
                        <li>
                            <strong>Exam Result:</strong> Passed
                        </li>
                    </ul>
                    <p className="mt-4 text-xs text-gray-500">
                        Note: These are only sample values. Please input the actual
                        details of the student.
                    </p>
                </div>

                {/* Right side - Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* General Average */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                General Average from Prev School
                            </label>
                            <input
                                type="number"
                                name="generalAverage"
                                value={formData.generalAverage}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                                placeholder="Enter general average"
                                min="0"
                                max="100"
                                required
                                readOnly
                            />
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
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Exam Location / Room */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Exam Location / Room
                            </label>
                            <input
                                type="text"
                                name="examLocation"
                                value={formData.examLocation}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                                placeholder="Enter location or room"
                                required
                            />
                        </div>

                        {/* Exam Result */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Exam Result
                            </label>
                            <input
                                type="text"
                                name="examResult"
                                value={formData.examResult}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                                placeholder="Enter exam result"
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
