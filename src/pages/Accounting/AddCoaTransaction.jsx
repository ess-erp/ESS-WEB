import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import TransactionCoaDataTable from "../../components/AccountingComponents/TransactionCoaDataTable";

const AddCoaTransaction = () => {
    useEffect(() => {
        document.title = "Transaction Types & COA Assignment | Accounting";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/accounting/dashboard" },
        { label: "Accounting", href: "/accounting/dashboard" },
        { label: "Transaction Types", href: "/accounting/addcoatransaction" },
    ];

    return (
        <div className="flex-1 h-screen bg-gray-50 px-6 py-4">
                <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Transaction Types & COA Assignment</h2>
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
                                Assign COA to Transaction Types
                            </h2>
                        </motion.div>
                        <motion.div 
                            className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" 
                            role="alert"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">Create transaction types and assign chart of accounts to each transaction.</span>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <TransactionCoaDataTable />
                        </motion.div>
                    </div>
                </section>
        </div>
    );
};

export default AddCoaTransaction;
