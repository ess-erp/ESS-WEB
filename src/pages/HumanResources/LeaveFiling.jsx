import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CreditCard, Plus } from 'lucide-react';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import LeaveFilingDataTable from '../../components/HrComponents/LeaveFilingDataTable';
import LeaveCreditUpdater from '../../components/HrComponents/LeaveCreditUpdater';
import ManualLeaveFilingModal from '../../components/HrComponents/ManualLeaveFilingModal';

const LeaveFiling = () => {
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    useEffect(() => {
        document.title = 'Notice of Filing of Leave | HRD';
    }, []);

    const breadcrumbItems = [
        { label: 'Human Resources', href: '/hrd/dashboard' },
        { label: 'Notice of Filing of Leave', href: '/hrd/leave-filing' },
    ];

    // ─── Tab State ────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('filings'); // 'filings' | 'credits'

    // ─── Tab Configuration ────────────────────────────────────────────────────
    const tabs = [
        { id: 'filings', label: 'Leave Applications', icon: FileText },
        { id: 'credits', label: 'Credit Management', icon: CreditCard },
    ];

    const handleManualSuccess = () => {
        // Refresh the leave table
        window.location.reload();
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-sm font-bold text-black mt-2">Leave Management System</h2>
            </div>

            <section className="space-y-6">
                <hr className="border-t-1 border-solid border-gray-400" />
                
                <div className="flex justify-center">
                    <h2 className="text-2xl font-bold text-green-500">
                        Leave Management & Credit System
                    </h2>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300"
                                >
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-lg shadow-md"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className={`relative z-10 flex items-center gap-2 ${
                                        activeTab === tab.id ? 'text-white' : 'text-gray-600'
                                    }`}>
                                        <Icon size={16} />
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'filings' && (
                            <div>
                                <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6" role="alert">
                                    <strong className="font-bold">Note: </strong>
                                    <span className="block sm:inline">
                                        Manage employee leave applications, approvals, and balance records.
                                    </span>
                                </div>
                                <LeaveFilingDataTable 
                                    onAddManualClick={() => setIsManualModalOpen(true)}
                                />
                            </div>
                        )}

                        {activeTab === 'credits' && (
                            <div>
                                <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-6" role="alert">
                                    <strong className="font-bold">Credit Management: </strong>
                                    <span className="block sm:inline">
                                        Manage employee leave credit allocations. Click the <strong>Edit</strong> button to update Work Leave and Medical Leave credits. System tracks only <strong>Work Leave</strong> and <strong>Medical Leave</strong>.
                                    </span>
                                </div>
                                
                                {/* Leave Credit Updater with DataTable and Edit Modal */}
                                <LeaveCreditUpdater />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* Manual Leave Filing Modal */}
            <ManualLeaveFilingModal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                onSuccess={handleManualSuccess}
            />
        </div>
    );
};

export default LeaveFiling;
