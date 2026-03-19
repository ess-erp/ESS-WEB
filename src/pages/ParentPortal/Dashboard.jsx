import { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import AnnouncementComponent from "../../components/AdmissionComponents/AnnouncementComponent";

const Dashboard = () => {
    useEffect(() => {
        document.title = "Dashboard | Parent Portal";
    }, []);

    const breadcrumbItems = [
        { label: 'Dasboard', href: '/parent/dashboard' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
                <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
                <div className= "flex-1 min-h-screen bg-gray-50 px-6 py-4">
                    <div className="mb-4">
                        <Breadcrumb items={breadcrumbItems} />
                        <h2 className="text-2x1 font-bold text-black mt-2">Dashboard</h2>
                    </div>

                    <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                        <div className="flex flex-col space-y-4 h-full w-full">
                            <div className="flex justify-center">
                                <h2 className="text-2x1 font-bold text-green-700 mt-2">
                                    Welcome to Parent Portal Dashboard
                                </h2>
                            </div>
                            <AnnouncementComponent />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
