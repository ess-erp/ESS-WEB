import { useEffect } from 'react';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import CoaDataTable from "../../components/AccountingComponents/CoaDataTable";

const ChartOfAccounts = () => {
    useEffect(() => {
        document.title = 'Chart of Accounts | Accounting';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/accounting/dashboard' },
        { label: 'Chart of Accounts', href: '/accounting/chart-of-accounts' }
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-sm font-bold text-black mt-2">Chart of Accounts</h2>
            </div>

            <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                <div className="flex flex-col space-y-4 h-full w-full">
                    <hr className="border-t-1 border-solid border-gray-400 my-6" />
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-green-500 mt-2">
                            Chart of Accounts
                        </h2>
                    </div>
                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Info: </strong>
                        <span className="block sm:inline">
                            Manage your chart of accounts. View, add, edit, or delete account entries.
                        </span>
                    </div>
                    <div>
                        <CoaDataTable />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ChartOfAccounts;
