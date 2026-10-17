import { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import InventoryDataTable from "../../components/PurchasingComponents/InventoryDataTable";

const InventoryManagement = () => {
    useEffect(() => {
        document.title = "Inventory Management | Purchasing";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/purchasing/dashboard" },
        { label: "Inventory Management", href: "/purchasing/inventory" },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-y-auto">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Inventory Management</h2>
                </div>

                <section className="flex flex-col space-y-4">
                    <hr className="border-t-1 border-solid border-gray-400 my-2" />
                    
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-green-500">
                            Stock Inventory Management
                        </h2>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">Inventory Tracking: </strong>
                        <span className="block sm:inline">
                            Manage and track all stock items, quantities, purchase dates, and documentation. Add new stock with images and detailed information.
                        </span>
                    </div>

                    {/* Content */}
                    <div className="pb-6">
                        <InventoryDataTable />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default InventoryManagement;
