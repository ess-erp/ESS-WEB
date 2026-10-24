import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import SectionEntryComponent from "../../components/SruComponents/SectionEntryComponent";
import HouseEntryComponent from "../../components/SruComponents/HouseEntryComponent";
const SectionAndHouseEntry = () => {

    useEffect(() => {
        document.title = "Section and House Entry";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/sru/dashboard" },
        { label: "Section and House Entry", href: "/sru/sectionandhouseentry" }
    ];

    const [entryType, setEntryType] = useState("section");

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
                    Section and House Entry
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
                                left: entryType === "section" ? "4px" : "50%"
                            }}
                        />

                        <button
                            onClick={() => setEntryType("section")}
                            className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-md transition
                                ${entryType === "section" ? "text-white" : "text-gray-700"}
                            `}
                        >
                            Section
                        </button>

                        <button
                            onClick={() => setEntryType("house")}
                            className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-md transition
                                ${entryType === "house" ? "text-white" : "text-gray-700"}
                            `}
                        >
                            House
                        </button>

                    </div>
                </div>
                {/* Title */}
                <div className="flex justify-center mb-2">
                    <h2 className="text-2xl font-bold text-green-700 mt-2">
                        {entryType === "section" ? "Section Entry" : "House Entry"}
                    </h2>
                </div>

                {/* Note */}
                <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                    <strong className="font-bold">Note: </strong>
                    <span>
                        {entryType === "section"
                            ? "For creation of section please use the tables below."
                            : "For creation of house please use the tables below."}
                    </span>
                </div>

                {/* Animated Content */}
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
                            {entryType === "section" ? (
                                <SectionEntryComponent />
                            ) : (
                                <div>
                                <HouseEntryComponent />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default SectionAndHouseEntry;
