import { useEffect, useState } from 'react';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import TransactionHistoryDataTable from '../../components/CashierComponents/TransactionHistoryDataTable';

const TransactionHistory = () => {
    useEffect(() => {
        document.title = 'Cashier Payment';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/cashier/dashboard' },
        { label: 'Transaction History', href: '/cashier/transactionhistory' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-2xl font-bold text-black mt-2">Transaction History</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-black mt-2">
                               Transaction History
                            </h2>
                        </div>
                        <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">List of transaction. You can request to cancel the SI number by clicking the x icon in the action column.</span>
                        </div>
                        {/* <EnrollmentStatusComponent />
                            <AnnouncementComponent /> */}
                        <TransactionHistoryDataTable />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TransactionHistory;