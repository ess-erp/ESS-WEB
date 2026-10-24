import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import StudentDataTable from "../../components/AdmissionComponents/StudentDataTable";


const StudentOnlineApplication = () => {

    useEffect(() => {
        document.title = 'Online Application | Admission';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/admission/dashboard' },
        { label: 'Online Application', href: '/admission/onlineapplication' }
    ];

    return (

        <div className="flex-1 h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Online Application</h2>
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
                                Online Application Table
                            </h2>
                        </div>
                        <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This is the table of Online Application. Please click the button below to view the table.</span>
                        </div>
                        <div>
                            <StudentDataTable />
                        </div>
                    </div>
                </section>
        </div>
    );
};

export default StudentOnlineApplication;