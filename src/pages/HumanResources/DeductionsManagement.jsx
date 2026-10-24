import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import SssContributionTable from '../../components/HrComponents/SssContributionTable';
// Import other tables when created
// import PhilhealthMatrixTable from '../../components/HrComponents/PhilhealthMatrixTable';
// import PagibigMatrixTable from '../../components/HrComponents/PagibigMatrixTable';
// import EmployeeDeductionsDataTable from '../../components/HrComponents/EmployeeDeductionsDataTable';

const DeductionsManagement = () => {
    useEffect(() => {
        document.title = 'Deductions Management | HRD';
    }, []);

    const breadcrumbItems = [
        { label: 'Human Resources', href: '/hrd/dashboard' },
        { label: 'Deductions Management', href: '/hrd/deductions' },
    ];

    const [activeTab, setActiveTab] = useState('sss');

    const tabs = [
        { id: 'sss', label: 'SSS Contribution', icon: 'ðŸ›¡ï¸' },
        { id: 'philhealth', label: 'PhilHealth', icon: 'ðŸ¥' },
        { id: 'pagibig', label: 'Pag-IBIG', icon: 'ðŸ ' },
        { id: 'employee', label: 'Employee Deductions', icon: 'ðŸ’°' },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">Deductions & Statutory Matrix</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                Government & Payroll Deductions Configuration
                            </h2>
                        </div>
                        <div
                            className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">
                                Configure statutory contribution tables (SSS, PhilHealth, Pag-IBIG) and custom employee
                                recurring loans for automated payroll calculation.
                            </span>
                        </div>

                        {/* Tab Navigation */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="flex border-b overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition ${
                                            activeTab === tab.id
                                                ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'sss' && <SssContributionTable />}
                                {activeTab === 'philhealth' && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">PhilHealth configuration coming soon...</p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            This will configure premium rates, salary floor/ceiling
                                        </p>
                                    </div>
                                )}
                                {activeTab === 'pagibig' && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">Pag-IBIG configuration coming soon...</p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            This will configure contribution rates and monthly caps
                                        </p>
                                    </div>
                                )}
                                {activeTab === 'employee' && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">Employee Deductions management coming soon...</p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            This will manage employee loans, advances, and recurring deductions
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
        </div>
    );
};

export default DeductionsManagement;
