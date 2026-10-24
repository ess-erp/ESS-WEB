import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import JournalEntryDataTable from "../../components/AccountingComponents/JournalEntryDataTable";

const JournalEntry = () => {
    useEffect(() => {
        document.title = "Journal Entry | Accounting";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard",       href: "/accounting/dashboard" },
        { label: "Journal Entry",   href: "/accounting/journalentry" },
    ];

    return (
        <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-y-auto">
                <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Journal Entry</h2>
                </motion.div>

                <section className="flex flex-col space-y-4">
                    <motion.hr 
                        className="border-t-1 border-solid border-gray-400 my-2"
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
                        <h2 className="text-2xl font-bold text-green-500">
                            Journal Entry Management
                        </h2>
                    </motion.div>

                    {/* Info Banner */}
                    <motion.div 
                        className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg" 
                        role="alert"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <strong className="font-bold">Automated Journal Entries: </strong>
                        <span className="block sm:inline">
                            Journal entries are automatically generated from cashier transactions based on assigned COA accounts. All transactions are balanced and ready for review.
                        </span>
                    </motion.div>

                    {/* Content */}
                    <motion.div 
                        className="pb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <JournalEntryDataTable />
                    </motion.div>
                </section>
        </div>
    );
};

export default JournalEntry;
