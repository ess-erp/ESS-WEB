import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import CoaDataTable from "../../components/AccountingComponents/CoaDataTable";

const ChartOfAccounts = () => {
    useEffect(() => {
        document.title = 'Chart of Accounts';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/cashier/dashboard' },
        { label: 'Chart of Accounts', href: '/accounting/chartofaccounts' }
    ];
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 h-screen bg-gray-50 px-6 py-4">
                <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Chart of Accounts</h2>
                </motion.div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <motion.hr 
                            className="border-t-1 border-solid border-gray-400 my-6"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        />
                        <motion.div 
                            className="flex justify-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Chart of Accounts
                            </h2>
                        </motion.div>
                        <motion.div 
                            className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" 
                            role="alert"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This is the chart of accounts table.</span>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <CoaDataTable/>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
}
export default ChartOfAccounts;