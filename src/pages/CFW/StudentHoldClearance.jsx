import { useEffect } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import StudentHoldDataTable from "../../components/CfwComponents/StudentHoldDataTable";

const StudentHoldClearance = () => {
    useEffect(() => {
        document.title = "Student Hold/Clearance | CFW";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/cfw/dashboard" },
        { label: "Student Hold/Clearance", href: "/cfw/studentholdclearance" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-sm font-bold text-black mt-2">Student Hold/Clearance</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-green-500">Student Hold/Clearance Management</h2>
                    </div>
                    <p className="text-center text-gray-600 mt-2">
                        Hold students from enrollment or clearance processing
                    </p>
                </div>

                <div>
                    <StudentHoldDataTable />
                </div>
            </div>
        </div>
    );
};

export default StudentHoldClearance;
