import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import SubjectLoadEntryComponent from "../../components/AcademicComponents/SubjectLoadEntryComponent";

const SubjectLoadEntry = () => {


    useEffect(() => {
        document.title = "Faculty Load Entry";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/academic/dashboard" },
        { label: "Faculty Load Entry", href: "/academic/facultyloadentry" }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />

            <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-auto">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />

                    <h2 className="text-sm font-bold text-black mt-2">
                        Subject Load Entry
                    </h2>

                    <hr className="border-t-1 border-solid border-gray-400 my-6" />
                    {/* Title */}
                    <div className="flex justify-center mb-2">
                        <h2 className="text-2xl font-bold text-green-700 mt-2">
                            Subject Load Entry
                        </h2>
                    </div>

                    {/* Note */}
                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                        <strong className="font-bold">Note: </strong>
                        <span>
                            For creation of subject load. Please use the tables below.
                        </span>
                    </div>

                    {/* ✅ Animated Content */}
                    <div className="mt-6 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <SubjectLoadEntryComponent />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SubjectLoadEntry;