import { useEffect, useState } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import AnnouncementComponent from "../../components/AdmissionComponents/AnnouncementComponent";

const Dashboard = () => {
    useEffect(() => {
        document.title = "Dashboard | Student Portal";
    }, []);

    const breadcrumbItems = [
        { label: 'Dasboard', href: '/student/dashboard' }
    ];

    return (<div className= "flex-1 min-h-screen bg-gray-50 px-6 py-4">
                    <div className="mb-4">
                        <Breadcrumb items={breadcrumbItems} />
                        <h2 className="text-2x1 font-bold text-black mt-2">Dashboard</h2>
                    </div>

                    <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                        <div className="flex flex-col space-y-4 h-full w-full">
                            <div className="flex justify-center">
                                <h2 className="text-2x1 font-bold text-green-700 mt-2">
                                    Welcome to Student Portal Dashboard
                                </h2>
                            </div>
                            <AnnouncementComponent />
                        </div>
                    </section></div>);
};

export default Dashboard;
