import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import ListOfSectionComponent from "../../components/TeacherComponents/ListOfSectionComponent";

const ListOfSection = () => {

    useEffect(() => {
        document.title = "List of Section | Teacher Portal";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "List of Section", href: "/teacher/listofsection" }
    ];

    const slideVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4 overflow-auto">
            <Breadcrumb items={breadcrumbItems} />

            {/* Page Header */}
            <div className="mt-4 mb-6">
                <h2 className="text-3xl font-bold text-green-700">
                    My Sections
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    View and manage all sections assigned to you
                </p>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong className="font-semibold">Quick Tip:</strong> Click the eye icon to view section details including assigned teachers, subjects, and enrolled students.
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
                    <ListOfSectionComponent />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ListOfSection;
