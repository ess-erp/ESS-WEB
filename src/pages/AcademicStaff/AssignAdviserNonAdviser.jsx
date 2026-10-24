import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import TeacherListDataTable from "../../components/AcademicComponents/TeacherListDataTable";

const AssignAdviserNonAdviser = () => {

    useEffect(() => {
        document.title = "Assign Adviser and Non-Adviser";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/academic/dashboard" },
        { label: "Assign Adviser and Non-Adviser", href: "/academic/assignadvisernonadviser" }
    ];

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
                        Assign Adviser and Non-Adviser
                    </h2>

                    <hr className="border-t-1 border-solid border-gray-400 my-6" />
                    {/* Title */}
                    <div className="flex justify-center mb-2">
                        <h2 className="text-2xl font-bold text-green-700 mt-2">
                            Assign Adviser and Non-Adviser
                        </h2>
                    </div>

                    {/* Note */}
                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                        <strong className="font-bold">Note: </strong>
                        <span>
                            Please assign adviser and non-adviser teachers before you proceed to faculty load.
                        </span>
                    </div>

                    {/* âœ… Animated Content */}
                    <div className="mt-6 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                variants={slideVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <TeacherListDataTable />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
        </div>
    );
};

export default AssignAdviserNonAdviser;
