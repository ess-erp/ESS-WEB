import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import EmployeeListDataTable from '../../components/HrComponents/EmployeeListDataTable';

const EmployeeList = () => {
    useEffect(() => {
        document.title = 'Employee Directory | HRD';
    }, []);

    const breadcrumbItems = [
        { label: 'Human Resources', href: '/hrd/dashboard' },
        { label: 'Employee Directory', href: '/hrd/employee-list' },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-sm font-bold text-black mt-2">Employee Directory</h2>
            </div>

            <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                <div className="flex flex-col space-y-4 h-full w-full">
                    <hr className="border-t-1 border-solid border-gray-400 my-6" />
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-green-500 mt-2">
                            Employee Directory
                        </h2>
                    </div>
                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Info: </strong>
                        <span className="block sm:inline">
                            Browse and manage all employee records. Click "Edit" to view or update employee details.
                        </span>
                    </div>
                    <div>
                        <EmployeeListDataTable />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EmployeeList;
