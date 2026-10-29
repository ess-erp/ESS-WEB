import { useState, useEffect } from 'react';
import { Shield, Heart, Home, DollarSign } from 'lucide-react';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import SssContributionTable from '../../components/HrComponents/SssContributionTable';
import PhilhealthMatrixTable from '../../components/HrComponents/PhilhealthMatrixTable';
import PagibigMatrixTable from '../../components/HrComponents/PagibigMatrixTable';
import EmployeeDeductionsDataTable from '../../components/HrComponents/EmployeeDeductionsDataTable';

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
        { id: 'sss', label: 'SSS Contribution', Icon: Shield },
        { id: 'philhealth', label: 'PhilHealth', Icon: Heart },
        { id: 'pagibig', label: 'Pag-IBIG', Icon: Home },
        { id: 'employee', label: 'Employee Deductions', Icon: DollarSign },
    ];

    // Reset any open modals when switching tabs
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-sm font-bold text-black mt-2">Deductions & Statutory Matrix</h2>
            </div>

            <div className="flex flex-col space-y-4">
                <hr className="border-t-1 border-solid border-gray-400 my-6" />
                
                <div className="flex justify-center">
                    <h2 className="text-2xl font-bold text-green-500">
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
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm whitespace-nowrap transition-all ${
                                    activeTab === tab.id
                                        ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                            >
                                <tab.Icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'sss' && (
                            <div key="sss-tab">
                                <SssContributionTable />
                            </div>
                        )}
                        
                        {activeTab === 'philhealth' && (
                            <div key="philhealth-tab">
                                <PhilhealthMatrixTable />
                            </div>
                        )}
                        
                        {activeTab === 'pagibig' && (
                            <div key="pagibig-tab">
                                <PagibigMatrixTable />
                            </div>
                        )}
                        
                        {activeTab === 'employee' && (
                            <div key="employee-tab">
                                <EmployeeDeductionsDataTable />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeductionsManagement;
