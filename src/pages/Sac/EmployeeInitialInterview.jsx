import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import EmployeeInterviewComponent from "../../components/SacComponents/EmployeeInterviewComponent";

const EmployeeInitialInterview = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const employeeAppId = query.get("employeeAppId");
    const user = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    useEffect(() => {
        document.title = 'Employee Initial Interview';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/sac/dashboard' },
        { label: 'Online Application', href: '/sac/onlineapplication' },
        { label: 'Employee Initial Interview', href: '/sac/employeeinitialinterview' },
    ];
    return (
        <div className="flex-1 bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Employee Initial Interview</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-700 mt-2">
                                Employee Initial Interview
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">Please encode and validate all information.</span>
                        </div>
                        <div>
                            <EmployeeInterviewComponent employeeAppId={employeeAppId} userId={user[0].UserId} userRoleId={user[0].RoleId} />
                        </div>
                    </div>
                </section>
        </div>
    );
};

export default EmployeeInitialInterview;
