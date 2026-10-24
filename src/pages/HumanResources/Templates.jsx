import { useEffect, useState } from 'react';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import { motion, AnimatePresence } from 'framer-motion';
import TemplatesModalComponent from '../../components/HrComponents/TemplatesModalComponent';

const Templates = () => {

    useEffect(() => {
        document.title = 'Templates | HRD';
    }, []);
    const breadcrumbItems = [
        { label: 'Dashboard', href: '/hrd/dashboard' },
        { label: 'Templates', href: '/hrd/templates' },
    ];
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [selectedStatus, setSelectedStatus] = useState("active");

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-2xl font-bold text-black mt-2">Templates</h2>
                </div>

                    <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                        <div className="flex flex-col space-y-4 h-full w-full">
                            <hr className="border-t-1 border-solid border-gray-400 my-6" />
                            <div className="flex justify-center">
                                <h2 className="text-2xl font-bold text-green-500 mt-2">
                                    Human Resources Templates
                                </h2>
                            </div>
                            <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Note: </strong>
                                <span className="block sm:inline">This is the list of all templates in Human Resources.</span>
                            </div>
                            <div className="flex justify-center items-center">
                                <div className="flex gap-2">


                                </div>
                            </div>
                            <div className="flex justify-center items-center my-4">
                                <div className="inline-flex rounded-lg shadow-sm" role="group">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStatus("active")}
                                        className={`px-6 py-2 text-sm font-semibold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400
                                        ${selectedStatus === "active"
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-white-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                                            } rounded-l-lg`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStatus("draft")}
                                        className={`px-6 py-2 text-sm font-semibold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400
                                        ${selectedStatus === "draft"
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                                            } rounded-r-lg`}
                                    >
                                        Draft
                                    </button>
                                </div>
                            </div>


                            <div>
                                <AnimatePresence mode="wait">

                                    <motion.div
                                        key={selectedStatus} // re-render animation on toggle
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <TemplatesModalComponent selectedStatus={selectedStatus} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                        </div>
                    </section>
        </div>
    );
};

export default Templates;