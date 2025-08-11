import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AccountIcon from "../IconComponents/AccountIcon";
import DashboardIcon from "../IconComponents/DashboardIcon";
import SettingsIcon from "../IconComponents/SettingsIcon";
import TicketIcon from "../IconComponents/TicketIcon";
import UserIconSolid from "../IconComponents/UserIconSolid";

const Sidebar = () => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const location = useLocation();


    // Close dropdown when clicking outside
    useEffect(() => {

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);


    }, []);


    const getActiveItem = () => {
        if (location.pathname.includes("/admission/dashboard")) return "Dashboard";
        if (location.pathname.includes("/admission/onlineapplication")) return "Online Application";
        if (location.pathname.includes("/accounts")) return "Accounts";
        if (location.pathname.includes("/tickets")) return "Tickets";
        if (location.pathname.includes("/settings")) return "Settings";
        return "";
    };

    const activeItem = getActiveItem();

    const menuItems = [
        { name: "Dashboard", icon: DashboardIcon },
        { name: "Online Application", icon: UserIconSolid },
        { name: "Accounts", icon: AccountIcon },
        { separator: true },
        { name: "Tickets", icon: TicketIcon },
        { name: "Settings", icon: SettingsIcon },
    ];
    const navigate = useNavigate();

    const handleClick = (name) => {
        switch (name) {
            case "Dashboard":
                navigate("/admission/dashboard");
                break;
            case "Online Application":
                navigate("/admission/onlineapplication");
                break;
            case "Accounts":
                navigate("/accounts");
                break;
            case "Tickets":
                navigate("/tickets");
                break;
            case "Settings":
                navigate("/settings");
                break;
            default:
                break;
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded-md shadow"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isSidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "block" : "hidden"
                    } md:flex z-40 flex-col h-screen w-[18.5rem] overflow-hidden px-4 py-8 bg-white shadow`}
            >
                {/* Logo */}
                <a href="#" className="flex items-center w-full space-x-3 overflow-hidden">
                    <img
                        className="w-auto h-6 sm:h-7 shrink-0"
                        src="/assets/img/seton-logo.png"
                        alt="Logo"
                    />
                    <span className="text-sm sm:text-base font-semibold truncate text-green-800">
                        Elizabeth Seton School
                    </span>
                </a>

                {/* Search */}
                <div className="relative mt-6">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <input
                        type="text"
                        className="w-full py-2 pl-10 pr-4 text-black bg-white border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Search"
                    />
                </div>

                {/* Navigation */}
                <div className="flex flex-col justify-between flex-1 mt-6">
                    <nav>
                        {menuItems.map((item, index) =>
                            item.separator ? (
                                <hr key={`sep-${index}`} className="my-6 border-gray-200" />
                            ) : (
                                <a
                                    key={item.name + index}
                                    onClick={() => handleClick(item.name)}
                                    className={`flex items-center px-4 py-2 mt-5 !text-black hover:text-black transition-colors duration-300 transform rounded-md hover:bg-gray-100
                                    ${activeItem === item.name ? "bg-gray-100 font-semibold" : ""}`}
                                >
                                    <item.icon />
                                    <span className="mx-4 font-medium">{item.name}</span>
                                </a>
                            )
                        )}
                    </nav>

                    {/* Footer User Profile + Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <a
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center px-4 -mx-2 mt-6 w-full hover:bg-gray-100 rounded-md py-2 transition"
                        >
                            <img
                                className="object-cover mx-2 rounded-full h-9 w-9"
                                src={
                                    user?.avatar ||
                                    "/assets/img/default_image.png"
                                }
                                alt="avatar"
                            />
                            <span className="mx-2 font-medium text-black">{user.Fname} {user.Mname} {user.Lname}</span>
                            <svg
                                className={`w-4 h-4 ml-auto transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </a>

                        {isDropdownOpen && (
                            <ul className="absolute bottom-full left-4 right-4 mb-2 bg-white border rounded-md shadow-md text-sm text-gray-700 z-50">
                                <li>
                                    <a
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            // 🔐 Replace this with your logout logic
                                            console.log("Logging out...");
                                        }}
                                    >
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
