import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import StudentDataTable from "../../components/SruComponents/StudentDataTable";


const StudentOnlineApplication = () => {

    useEffect(() => {
        document.title = 'Student Master List | SRU';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/sru/dashboard' },
        { label: 'Student Master List', href: '/sru/studentlist' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (

        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Student Master List</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        {/* <div className="flex justify-center">
                            <h1 className="text-sm font-bold text-green-700 mt-2">
                                Welcome to Admission Dashboard
                            </h1>
                        </div> */}
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Student Master List Table
                            </h2>
                        </div>
                        <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">Please click the button below to view the table.</span>
                        </div>
                        <div className="overflow-x-auto">
                            <StudentDataTable />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentOnlineApplication;