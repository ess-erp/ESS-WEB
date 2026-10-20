import { useEffect, useState } from 'react';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import { motion, AnimatePresence } from 'framer-motion';
import TemplateDataTable from '../../components/AccountingComponents/TemplateDataTable';

const FeeAssessment = () => {

    useEffect(() => {
        document.title = 'Fee Assessment - Accounting';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/accounting/dashboard' },
        { label: 'Fee Assessment', href: '/accounting/fee-assessment' },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("active");

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-2xl font-bold text-black mt-2">Fee Assessment & Fee Tables</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-700 mt-2">
                                Fee Assessment & Fee Tables
                            </h2>
                        </div>
                        <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This is the list of all fee templates for table of fees management.</span>
                        </div>
                        
                        <div className="flex justify-center items-center my-4">
                            <div className="inline-flex rounded-lg shadow-sm" role="group">
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus("active")}
                                    className={`px-6 py-2 text-sm font-semibold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400
                                        ${selectedStatus === "active"
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
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

                        <div className="overflow-x-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedStatus}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TemplateDataTable selectedStatus={selectedStatus} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FeeAssessment;
