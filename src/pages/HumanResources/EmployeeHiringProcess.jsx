import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import EmployeeScreeningComponent from "../../components/HrComponents/EmployeeScreeningComponent";

const EmployeeHiringProcess = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const employeeAppId = query.get("employeeAppId");
    const user = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    useEffect(() => {
        document.title = 'Employee Hiring Process';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/hrd/dashboard' },
        { label: 'Online Application', href: '/hrd/onlineapplication' },
        { label: 'Employee Application Information', href: '/hrd/employeeappform' },
        { label: 'Employee Hiring Process', href: '/hrd/employeehiringprocess' },
    ];
    const [isEditing, setIsEditing] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Employee Hiring Process</h2>
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
                            <h2 className="text-2xl font-bold text-green-700 mt-2">
                                Employee Hiring Process
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">Please encode and validate all information.</span>
                        </div>
                        <div>
                            <div className="flex justify-end items-end p-2">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isEditing}
                                        onChange={() => setIsEditing(!isEditing)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500
                        rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                        after:transition-all dark:border-gray-600 peer-checked:bg-green-600 relative" />
                                    <span className="ml-3 text-sm font-medium text-gray-900">
                                        {isEditing ? "Editing On" : "Editing Off"}
                                    </span>
                                </label>
                            </div>
                            {/* <EmployeeOnlineDataTable /> */}
                            <EmployeeScreeningComponent isEditing={isEditing} employeeAppId={employeeAppId} userId={user[0].UserId} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EmployeeHiringProcess;