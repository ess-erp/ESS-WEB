import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import SubjectLoadEntryComponent from "../../components/AcademicComponents/SubjectLoadEntryComponent";
import NonCurriculumLoadEntryComponent from "../../components/AcademicComponents/NonCurriculumLoadEntryComponent";

const SubjectLoadEntry = () => {

    useEffect(() => {
        document.title = "Section and House Entry";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/academic/dashboard" },
        { label: "Subject load Entry", href: "/academic/subjectloadentry" }
    ];

    const [entryType, setEntryType] = useState("subject");

    const slideVariants = {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 }
    };

    return (
        <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-auto">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />

                    <h2 className="text-sm font-bold text-black mt-2">
                        Subject and Non Curriculum Load Entry
                    </h2>

                    <hr className="border-t-1 border-solid border-gray-400 my-6" />

                    {/* Toggle Buttons */}
                    <div className="flex justify-center mb-6">
                        <div className="relative flex bg-gray-200 rounded-lg p-1 w-[260px]">

                            {/* Sliding highlight */}
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="absolute top-1 bottom-1 w-1/2 bg-green-600 rounded-md shadow"
                                style={{
                                    left: entryType === "subject" ? "4px" : "50%"
                                }}
                            />

                            <button
                                onClick={() => setEntryType("subject")}
                                className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-md transition
                                    ${entryType === "subject" ? "text-white" : "text-gray-700"}
                                `}
                            >
                                Subject Load
                            </button>

                            <button
                                onClick={() => setEntryType("house")}
                                className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-md transition
                                    ${entryType === "house" ? "text-white" : "text-gray-700"}
                                `}
                            >
                                Non-Curriculum Subject
                            </button>

                        </div>
                    </div>
                    {/* Title */}
                    <div className="flex justify-center mb-2">
                        <h2 className="text-2xl font-bold text-green-700 mt-2">
                            {entryType === "subject" ? "Subject Load Entry" : "Non Curriculum Subject Load Entry"}
                        </h2>
                    </div>

                    {/* Note */}
                    <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        <strong className="font-bold">Note: </strong>
                        <span>
                            {entryType === "subject"
                                ? "For creation of subject please use the tables below."
                                : "For creation of non curriculum subject please use the tables below."}
                        </span>
                    </div>

                    {/* ✅ Animated Content */}
                    <div className="mt-6 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={entryType}
                                variants={slideVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                {entryType === "subject" ? (
                                    <SubjectLoadEntryComponent />
                                ) : (
                                    <div>
                                    <NonCurriculumLoadEntryComponent />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
        </div>
    );
};

export default SubjectLoadEntry;
