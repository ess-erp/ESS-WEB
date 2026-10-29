import { useEffect } from 'react';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import AnnouncementComponent from '../../components/AdmissionComponents/AnnouncementComponent';

const Dashboard = () => {
    useEffect(() => {
        document.title = 'Dashboard | Accountant';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/accounting/dashboard' }
    ];

    return (
        <div className="px-6 py-4">
            <div className="mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-2xl font-bold text-black mt-2">Dashboard</h2>
            </div>

            <section className="flex items-center justify-center h-[calc(100vh-10rem)]">
                <div className="flex flex-col space-y-4 w-full">
                    <div className="flex justify-center">
                        <h1 className="text-2xl font-bold text-green-700">
                            Welcome to Accountant Dashboard
                        </h1>
                    </div>
                    <AnnouncementComponent />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
