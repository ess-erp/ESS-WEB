import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import GeneralLedgerDataTable from '../../components/AccountingComponents/GeneralLedgerDataTable';
import { fetchGetSchoolYearListData, fetchGetCoaFlatData } from '../../states/AccountingState/Action';

const GeneralLedger = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        document.title = 'General Ledger | Accountant';
        // Load dropdown dependencies
        dispatch(fetchGetSchoolYearListData());
        dispatch(fetchGetCoaFlatData());
    }, [dispatch]);

    const breadcrumbItems = [
        { label: 'Accounting', href: '/accounting/dashboard' },
        { label: 'General Ledger', href: '/accounting/general-ledger' }
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">General Ledger</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        
                        {/* Header */}
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                General Ledger
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">This is the general ledger statement of all accounting entries.</span>
                        </div>

                        {/* Data Table */}
                        <GeneralLedgerDataTable />
                    </div>
                </section>
        </div>
    );
};

export default GeneralLedger;
