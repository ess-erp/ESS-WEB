import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import ListOfSectionComponent from "../../components/TeacherComponents/ListOfSectionComponent";
import EncodingGradeClubComponent from "../../components/TeacherComponents/EncodingGradeClubComponent";

const EncodingOfGradeClub = () => {

    useEffect(() => {
        document.title = "Encoding of Grade/Club";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/teacher/dashboard" },
        { label: "Encoding of Grade/Club", href: "/teacher/listofsection" }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const slideVariants = {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 }
    };
    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />

            <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-auto">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />

                    <h2 className="text-sm font-bold text-black mt-2">
                        Encoding of Grade/Club
                    </h2>

                    <hr className="border-t-1 border-solid border-gray-400 my-6" />
                    {/* Title */}
                    <div className="flex justify-center mb-2">
                        <h2 className="text-2xl font-bold text-green-700 mt-2">
                            Encoding of Grade/Club
                        </h2>
                    </div>

                    {/* Note */}
                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                        <strong className="font-bold">Note: </strong>
                        <span>
                            List of all your handled sections. Please click the eye icon to view the details.
                        </span>
                    </div>

                    {/* ✅ Animated Content */}
                    <div className="mt-6 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                // key={entryType}
                                variants={slideVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <EncodingGradeClubComponent />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EncodingOfGradeClub;
