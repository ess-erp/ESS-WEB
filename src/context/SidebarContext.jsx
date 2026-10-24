import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    // Initialize from localStorage or default to true (open)
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebarOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });
    
    const [openSubmenus, setOpenSubmenus] = useState(['Employee Portal']);
    const location = useLocation();

    // Persist sidebar state to localStorage
    useEffect(() => {
        localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

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
    }, [location.pathname, openSubmenus]);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    
    const toggleSubmenu = (menuKey) => {
        setOpenSubmenus(prev => 
            prev.includes(menuKey) 
                ? prev.filter(key => key !== menuKey) 
                : [...prev, menuKey]
        );
    };

    return (
        <SidebarContext.Provider value={{ 
            sidebarOpen, 
            setSidebarOpen, 
            openSubmenus, 
            toggleSidebar, 
            toggleSubmenu,
            // Backwards compatibility aliases
            isCollapsed: !sidebarOpen,
            setIsCollapsed: (value) => setSidebarOpen(!value)
        }}>
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
