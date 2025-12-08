import { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import StudentAppFormComponent from "../../components/CfwComponents/StudentAppFormComponent";


const StudentOnlineAppForm = () => {

    useEffect(() => {
        document.title = "Student Application Information";
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/admission/dashboard' },
        { label: 'Online Application', href: '/admission/onlineapplication' },
        { label: 'Student Application Information', href: '/admission/studentappform' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-2sm font-bold text-black mt-2">Student Application Information</h2>
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
                                Student Application Information
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This is the Information of Applicants.</span>
                        </div>
                        <div>
                            <StudentAppFormComponent />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentOnlineAppForm;