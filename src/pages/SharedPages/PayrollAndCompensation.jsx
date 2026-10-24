import { useEffect, useState } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import PayrollCompensationDataTable from "../../components/SharedComponents/PayrollCompensationDataTable";

const PayrollAndCompensation = () => {
    useEffect(() => {
        document.title = "Payroll & Compensation | Employee Portal";
    }, []);

    const breadcrumbItems = [
        { label: 'Employee Portal', href: '/employee/dashboard' },
        { label: 'Payroll & Compensation', href: '/employee/payroll' },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Payroll & Compensation</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Payroll & Compensation
                            </h2>
                        </div>
                        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">
                                View your payslips, track earnings, download tax documents, and review your compensation history.
                            </span>
                        </div>
                        <div>
                            <PayrollCompensationDataTable />
                        </div>
                    </div>
                </section>
        </div>
    );
};

export default PayrollAndCompensation;
