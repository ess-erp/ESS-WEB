import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import CurriculumComponent from "../../components/AcademicComponents/CurriculumComponent";

const CurriculumEntry = () => {

    useEffect(() => {
        document.title = "Curriculum Per Level Entry";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/academic/dashboard" },
        { label: "Curriculum Per Level Entry", href: "/academic/curriculumentry" }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);
    // const [entryType, setEntryType] = useState("subject");

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
                        Curriculum Per Level Entry
                    </h2>

                    <hr className="border-t-1 border-solid border-gray-400 my-6" />
                    <div className="flex justify-center mb-2">
                        <h2 className="text-2xl font-bold text-green-700 mt-2">
                            Curriculum Per Level Entry
                        </h2>
                    </div>

                    {/* Note */}
                    <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        <strong className="font-bold">Note: </strong>
                        <span> For creation of curriculum per level. Please use the tables below.
                            {/* {entryType === "subject"
                                ? "For creation of subject please use the tables below."
                                : "For creation of non curriculum subject please use the tables below."} */}
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
                                <CurriculumComponent />
                                {/* {entryType === "subject" ? (
                                    <SubjectLoadEntryComponent />
                                ) : (
                                    <div>
                                    <NonCurriculumLoadEntryComponent />
                                    </div>
                                )} */}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CurriculumEntry;
