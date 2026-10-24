import { useEffect } from 'react';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";

const RfNumberSeries = () => {
    useEffect(() => {
        document.title = 'RF Number Series | Purchasing';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/purchasing/dashboard' },
        { label: 'RF Number Series', href: '/purchasing/rf-number-series' }
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-sm font-bold text-black mt-2">RF Number Series</h2>
            </div>

            <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                <div className="flex flex-col space-y-4 h-full w-full">
                    <hr className="border-t-1 border-solid border-gray-400 my-6" />
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-green-500 mt-2">
                            RF Number Series Management
                        </h2>
                    </div>
                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Info: </strong>
                        <span className="block sm:inline">
                            Manage request form number series here.
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RfNumberSeries;
