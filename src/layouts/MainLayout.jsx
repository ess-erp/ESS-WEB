import React from 'react';
import { useSidebar } from '../context/SidebarContext';
import Sidebar from '../components/SharedComponents/Sidebar';

const MainLayout = ({ children }) => {
    const { sidebarOpen, setSidebarOpen } = useSidebar();

    return (
        <>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div 
                className={`transition-all duration-300 ${
                    sidebarOpen ? "ml-[18.5rem]" : "ml-16"
                } min-h-screen bg-gray-50`}
            >
                {children}
            </div>
        </>
    );
};

export default MainLayout;
