import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState(['Employee Portal']);
    const location = useLocation();

    // Auto-expand parent menu based on current route
    useEffect(() => {
        const currentPath = location.pathname.toLowerCase();
        
        // Define route-to-submenu mapping
        const routeSubmenuMap = {
            '/employee/time-attendance': 'Employee Portal',
            '/employee/payroll': 'Employee Portal',
        };

        // Check if current route should expand a submenu
        const submenuToExpand = routeSubmenuMap[currentPath];
        
        if (submenuToExpand && !openSubmenus.includes(submenuToExpand)) {
            setOpenSubmenus(prev => [...prev, submenuToExpand]);
        }
    }, [location.pathname]);

    const toggleSidebar = () => setIsCollapsed(prev => !prev);
    
    const toggleSubmenu = (menuKey) => {
        setOpenSubmenus(prev => 
            prev.includes(menuKey) 
                ? prev.filter(key => key !== menuKey) 
                : [...prev, menuKey]
        );
    };

    return (
        <SidebarContext.Provider value={{ isCollapsed, openSubmenus, toggleSidebar, toggleSubmenu }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
