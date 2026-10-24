import { useEffect, useState } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import TicketingDataTable from "../../components/SharedComponents/TicketingDataTable";

const Ticketing = () => {
    useEffect(() => {
        document.title = "Ticketing | Support Center";
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Ticketing', href: '/ticketing' }
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Support Ticketing</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Support Ticketing System
                            </h2>
                        </div>
                        <div className="bg-purple-50 border border-purple-400 text-purple-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">
                                Submit and track your support tickets. Our team will respond to your inquiries within 24-48 hours.
                            </span>
                        </div>
                        <div>
                            <TicketingDataTable />
                        </div>
                    </div>
                </section>
        </div>
    );
};

export default Ticketing;
