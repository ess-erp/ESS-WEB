import { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import RfNumberSeriesDataTable from "../../components/PurchasingComponents/RfNumberSeriesDataTable";

const RfNumberSeries = () => {
    useEffect(() => {
        document.title = "RF No. Series | Purchasing";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/purchasing/dashboard" },
        { label: "RF No. Series", href: "/purchasing/rf-number-series" },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-y-auto">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">RF No. Series Management</h2>
                </div>

                <section className="flex flex-col space-y-4">
                    <hr className="border-t-1 border-solid border-gray-400 my-2" />
                    
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-green-500">
                            Requisition Form Number Series
                        </h2>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">Series Configuration: </strong>
                        <span className="block sm:inline">
                            Configure and manage requisition form number series for different campuses and units. Ensure proper sequencing and tracking.
                        </span>
                    </div>

                    {/* Content */}
                    <div className="pb-6">
                        <RfNumberSeriesDataTable />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RfNumberSeries;
