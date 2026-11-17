import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import EncodingGradeClubComponent from "../../components/TeacherComponents/EncodingGradeClubComponent";

const EncodingOfGradeClub = () => {

    useEffect(() => {
        document.title = "Grade Encoding | Teacher Portal";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "Grade Encoding", href: "/teacher/encodingofgradeclub" }
    ];

    const slideVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 overflow-auto">
            <Breadcrumb items={breadcrumbItems} />

            {/* Page Header */}
            <div className="mt-3 sm:mt-4 mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-700">
                    Grade Encoding
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Encode grades and attendance for your assigned sections
                </p>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg shadow-sm">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-2 sm:ml-3">
                        <p className="text-xs sm:text-sm text-blue-700">
                            <strong className="font-semibold">Instructions:</strong> Select a section, then click on a subject to start encoding grades. Grades can only be entered for the active grading period.
                        </p>
                    </div>
                </div>
            </div>

            {/* Animated Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <EncodingGradeClubComponent />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default EncodingOfGradeClub;
