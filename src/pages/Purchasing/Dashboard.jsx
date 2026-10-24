import { useEffect, useState } from 'react';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import EnrollmentStatusComponent from '../../components/AdmissionComponents/EnrollmentStatusComponent';
import AnnouncementComponent from '../../components/AdmissionComponents/AnnouncementComponent';

const Dashboard = () => {
    useEffect(() => {
        document.title = 'Dashboard | Purchasing';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/purchasing/dashboard' }
    ];

    return (<div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                    <div className="mb-4">
                        <Breadcrumb items={breadcrumbItems} />
                        <h2 className="text-2xl font-bold text-black mt-2">Dashboard</h2>
                    </div>

                    <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                        <div className="flex flex-col space-y-4 h-full w-full">
                            <div className="flex justify-center">
                                <h1 className="text-sm font-bold text-green-700 mt-2">
                                    Welcome to Purchasing Dashboard
                                </h1>
                            </div>
                            <hr className="border-t-1 border-solid border-gray-400 my-6" />
                            <div className="flex justify-center">
                                <h2 className="text-2xl font-bold text-black mt-2">
                                    Purchase Orders & Inventory Management
                                </h2>
                            </div>
                            <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Note: </strong>
                                <span className="block sm:inline">This is the central hub for managing purchase orders, vendor management, and inventory tracking.</span>
                            </div>
                            <EnrollmentStatusComponent />
                            <AnnouncementComponent />
                        </div>
                    </section></div>);
};

export default Dashboard;
