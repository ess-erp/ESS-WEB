import { useEffect, useState } from 'react';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import LeaveFilingDataTable from '../../components/HrComponents/LeaveFilingDataTable';

const LeaveFiling = () => {
    useEffect(() => {
        document.title = 'Notice of Filing of Leave | HRD';
    }, []);

    const breadcrumbItems = [
        { label: 'Human Resources', href: '/hrd/dashboard' },
        { label: 'Notice of Filing of Leave', href: '/hrd/leave-filing' },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? 'pl-[18.5rem]' : 'pl-16'}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Notice of Filing of Leave</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Notice of Filing of Leave
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">
                                Manage employee leave applications, approvals, and balance records.
                            </span>
                        </div>
                        <div>
                            <LeaveFilingDataTable />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LeaveFiling;
