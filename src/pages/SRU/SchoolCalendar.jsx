
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import SchoolYearDataTable from "../../components/SruComponents/SchoolYearDataTable";
import SchoolYearActivitiesModal from "../../components/SruComponents/SchoolYearActivitiesModal";


const SchoolCalendar = () => {

    useEffect(() => {
        document.title = 'School Calendar | SRU';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/sru/dashboard' },
        { label: 'School Calendar', href: '/sru/schoolcalendar' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Modal state for viewing activities
    const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
    const [selectedCalendarId, setSelectedCalendarId] = useState(null);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('');

    const handleViewActivities = (calendarId, schoolYear) => {
        setSelectedCalendarId(calendarId);
        setSelectedSchoolYear(schoolYear);
        setIsActivitiesModalOpen(true);
    };

    const handleCloseActivitiesModal = () => {
        setIsActivitiesModalOpen(false);
        setSelectedCalendarId(null);
        setSelectedSchoolYear('');
    };

    return (

        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-y-auto">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-sm font-bold text-black mt-2">School Calendar</h2>
                </div>

                <section className="flex items-center justify-center">
                    <div className="flex flex-col space-y-4 w-full pb-8">
                        <hr className="border-t-1 border-solid border-gray-400 my-6" />
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-500 mt-2">
                                School Calendar Management
                            </h2>
                        </div>
                        <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Note: </strong>
                            <span className="block sm:inline">Manage school years and their activities. Click "Add New School Year" to create a new school year, then click "View Activities" to manage activities for that school year.</span>
                        </div>
                        <div>
                            <SchoolYearDataTable onViewActivities={handleViewActivities} />
                        </div>
                    </div>
                </section>
            </div>

            {/* Activities Modal */}
            <SchoolYearActivitiesModal
                isOpen={isActivitiesModalOpen}
                onClose={handleCloseActivitiesModal}
                calendarId={selectedCalendarId}
                schoolYear={selectedSchoolYear}
            />
        </div>
    );
};

export default SchoolCalendar;