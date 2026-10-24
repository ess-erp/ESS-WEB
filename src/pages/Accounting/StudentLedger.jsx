import { useEffect, useState } from 'react';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import StudentLedgerDataTable from '../../components/AccountingComponents/StudentLedgerDataTable';

const StudentLedger = () => {
    useEffect(() => {
        document.title = 'Student Ledger | Accountant';
    }, []);

    const breadcrumbItems = [
        { label: 'Accounting', href: '/accounting/dashboard' },
        { label: 'Student Ledger', href: '/accounting/student-ledger' }
    ];

    return (
        <div className="flex-1 h-screen overflow-hidden bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Student Ledger</h2>
                </div>

                <section className="h-[calc(100vh-8rem)] overflow-y-auto">
                    <div className="flex flex-col space-y-4">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Student Ledger
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This is the student ledger statement of accounts table.</span>
                        </div>
                        <div>
                            <StudentLedgerDataTable />
                        </div>
                    </div>
                </section>
        </div>
    );
};

export default StudentLedger;
