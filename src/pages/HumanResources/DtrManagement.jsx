import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import DtrDataTable from '../../components/HrComponents/DtrDataTable';
import ManualAttendanceModal from '../../components/HrComponents/ManualAttendanceModal';

const DtrManagement = () => {
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    useEffect(() => {
        document.title = 'DTR Management | HRD';
    }, []);

    const breadcrumbItems = [
        { label: 'Human Resources', href: '/hrd/dashboard' },
        { label: 'DTR Management',  href: '/hrd/dtr-management' },
    ];

    const handleManualSuccess = () => {
        // Refresh the DTR table
        window.location.reload();
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">DTR Management</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500">
                                Daily Time Record (DTR) Management
                            </h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">
                                Real-time biometrics attendance scanner and daily time log audit list.
                            </span>
                        </div>
                        <div>
                            <DtrDataTable 
                                onAddManualClick={() => setIsManualModalOpen(true)}
                            />
                        </div>
                    </div>
                </section>

                {/* Manual Attendance Modal */}
                <ManualAttendanceModal
                    isOpen={isManualModalOpen}
                    onClose={() => setIsManualModalOpen(false)}
                    onSuccess={handleManualSuccess}
                />
        </div>
    );
};

export default DtrManagement;
