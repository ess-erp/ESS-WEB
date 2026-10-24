import { useEffect, useState } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import StudentMasterFileComponent from "../../components/SruComponents/StudentMasterFileComponent";


const StudentMasterFile = () => {

    useEffect(() => {
        document.title = "Student Master File";
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/sru/dashboard' },
        { label: 'Student Master List', href: '/sru/studentlist' },
        { label: 'Student Master File', href: '/sru/studentmasterfile' }
    ];

    return (
        <div className="flex-1 bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-2sm font-bold text-black mt-2">Student Master File</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Student Master File
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This are the information of student.</span>
                        </div>
                        <div>
                            <StudentMasterFileComponent />
                        </div>
                    </div>
                </section>
        </div>
    );
};

export default StudentMasterFile;