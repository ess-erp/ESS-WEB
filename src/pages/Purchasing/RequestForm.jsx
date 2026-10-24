import { useEffect, useState } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import RequestFormDataTable from "../../components/PurchasingComponents/RequestFormDataTable";

const RequestForm = () => {
    useEffect(() => {
        document.title = "Request Form | Purchasing";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/purchasing/dashboard" },
        { label: "Request Form", href: "/purchasing/requestform" },
    ];

    return (
        <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-y-auto">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Request Form</h2>
                </div>

                <section className="flex flex-col space-y-4">
                    <hr className="border-t-1 border-solid border-gray-400 my-2" />
                    
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-green-500">
                            Purchase Request Management
                        </h2>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">Request Tracking: </strong>
                        <span className="block sm:inline">
                            Create and manage purchase requests. Track approval status and process requests efficiently.
                        </span>
                    </div>

                    {/* Content */}
                    <div className="pb-6">
                        <RequestFormDataTable />
                    </div>
                </section>
        </div>
    );
};

export default RequestForm;
