import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import PaymentComponent from "../../components/CashierComponents/PaymentComponent";

const CashierPayment = () => {
    useEffect(() => {
        document.title = 'Cashier Payment';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/cashier/dashboard' },
        { label: 'Online Application', href: '/cashier/onlineapplication' },
        { label: 'Cashier Payment', href: '/cashier/cashierpayment' }
    ];
    return (
        <div className="flex-1 h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Cashier Payment</h2>
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
                                Cashier Payment
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This is the Cashier Payment page. Please validate first before proceed. </span>
                        </div>
                        <div>
                            <PaymentComponent/>
                            {/* <StudentDataTable /> */}
                        </div>
                    </div>
                </section>
            </div>);
}
export default CashierPayment;