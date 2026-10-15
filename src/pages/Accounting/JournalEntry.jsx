import { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
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

    const [sidebarOpen, setSidebarOpen] = useState(true);

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

                    {/* Info Banner */}
                    <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">Automated Journal Entries: </strong>
                        <span className="block sm:inline">
                            Journal entries are automatically generated from cashier transactions based on assigned COA accounts. All transactions are balanced and ready for review.
                        </span>
                    </div>

                    {/* Content */}
                    <div className="pb-6">
                        <JournalEntryDataTable />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default JournalEntry;
