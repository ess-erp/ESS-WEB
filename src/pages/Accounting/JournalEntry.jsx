import { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import JournalEntryDataTable from "../../components/AccountingComponents/JournalEntryDataTable";
import CashierTransactionJournalDataTable from "../../components/AccountingComponents/CashierTransactionJournalDataTable";
import { FileText, Receipt } from "lucide-react";

const JournalEntry = () => {
    useEffect(() => {
        document.title = "Journal Entry | Accounting";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard",       href: "/accounting/dashboard" },
        { label: "Journal Entry",   href: "/accounting/journalentry" },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("manual"); // "manual" or "cashier"

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-y-auto">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Journal Entry</h2>
                </div>

                <section className="flex flex-col space-y-4">
                    <hr className="border-t-1 border-solid border-gray-400 my-2" />
                    
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-green-500">
                            Journal Entry Management
                        </h2>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex justify-center">
                        <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
                            <button
                                onClick={() => setActiveTab("manual")}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${
                                    activeTab === "manual"
                                        ? "bg-white text-green-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <FileText size={18} />
                                Manual Journal Entries
                            </button>
                            <button
                                onClick={() => setActiveTab("cashier")}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${
                                    activeTab === "cashier"
                                        ? "bg-white text-green-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <Receipt size={18} />
                                Cashier Transactions (Auto-Generated)
                            </button>
                        </div>
                    </div>

                    {/* Info Banner */}
                    {activeTab === "manual" ? (
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">
                                Record double-entry transactions manually. Every journal entry must have equal total debits and credits.
                            </span>
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Auto-Generated Entries: </strong>
                            <span className="block sm:inline">
                                Journal entries are automatically generated from cashier transactions based on assigned COA accounts. Review and adjust before posting.
                            </span>
                        </div>
                    )}

                    {/* Content */}
                    <div className="pb-6">
                        {activeTab === "manual" ? (
                            <JournalEntryDataTable />
                        ) : (
                            <CashierTransactionJournalDataTable />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default JournalEntry;
