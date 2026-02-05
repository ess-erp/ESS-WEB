import { useEffect, useState } from 'react';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import AnnouncementComponent from '../../components/AdmissionComponents/AnnouncementComponent';

const Dashboard = () => {
    useEffect(() => {
        document.title = 'Dashboard | CFW';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/cfw/dashboard' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
                <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
                <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                    <div className="mb-4">
                        <Breadcrumb items={breadcrumbItems} />
                        <h2 className="text-2xl font-bold text-black mt-2">Dashboard</h2>
                    </div>

                    <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                        <div className="flex flex-col space-y-4 h-full w-full">
                            <div className="flex justify-center">
                                <h2 className="text-2xl font-bold text-green-700 mt-2">
                                    Welcome to Human Resources Dashboard
                                </h2>
                            </div>
                            {/* <hr className="border-t-1 border-solid border-gray-400 my-6" /> */}
                            {/* <div className="flex justify-center">
                                <h2 className="text-2xl font-bold text-black mt-2">
                                    Online Application Status
                                </h2>
                            </div>
                            <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Note: </strong>
                                <span className="block sm:inline">This is the status of on-going enrollment of student.</span>
                            </div> */}
                            <AnnouncementComponent />
                        </div>
                    </section>
                </div>
            </div>

        </>


    );
};

export default Dashboard;
