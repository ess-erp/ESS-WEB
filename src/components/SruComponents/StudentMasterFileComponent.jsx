
import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import OutlineGreenBtn from "../ButtonsComponents/OutlineGreenBtn";
import { motion, AnimatePresence } from "framer-motion";
import StudentInfoComponent from "./StudentInfoComponent";
import EnrollmentHistoryComponent from "./EnrollmentHistoryComponent";
import StudentDocumentsTableComponent from "./StudentDocumentsTableComponent";

const StudentMasterFileComponent = () => {

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const studentId = query.get("StudentId");
    const [isEditing, setIsEditing] = useState(false);
    const [active, setActive] = useState("one");
    const user = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    return (
        <div>
            <div className="flex items-center mt-2">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Student Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            {/* Student information component start here */}
            <div className="flex justify-end items-end p-2">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isEditing}
                        onChange={() => setIsEditing(!isEditing)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500
                        rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                        after:transition-all dark:border-gray-600 peer-checked:bg-green-600 relative" />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                        {isEditing ? "Editing On" : "Editing Off"}
                    </span>
                </label>
            </div>
            <StudentInfoComponent studentId={studentId} isEditing={isEditing} userId={user[0].UserId} />
            <div className="flex items-center pt-4">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Other Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-6 pt-4">
                <OutlineGreenBtn label="Enrollment History" onClick={() => setActive("one")} />
                <OutlineGreenBtn label="List of Documents" onClick={() => setActive("two")} />
            </div>
            <div className="relative min-h-[150px]"> {/* min-h ensures smooth height */}
                <AnimatePresence mode="wait">
                    {active === "one" && (
                        <motion.div
                            key="one"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-full bg-white p-6 shadow rounded-lg"
                        >
                            {/* <ListOfDocsTableComponent studentId={formData.StudentId} /> */}
                            <EnrollmentHistoryComponent studentId={studentId} />

                        </motion.div>
                    )}

                    {active === "two" && (
                        <motion.div
                            key="two"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-full bg-white p-6 shadow rounded-lg"
                        >
                            <StudentDocumentsTableComponent studentId={studentId} />
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* <ModalComponent
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={<span className="font-bold text-lg text-red-700">Warning</span>}
                    body="Are you sure you want to submit?"
                    buttons={[
                        { label: "Yes", type: "green", onClick: handleSubmit },
                        { label: "No", type: "red" },
                    ]}
                /> */}
            </div>
        </div>
    );
};

export default StudentMasterFileComponent;