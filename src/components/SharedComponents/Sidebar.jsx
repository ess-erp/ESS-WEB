import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  BookPlus,
  CalendarPlus,
  Calendar,
  FilePlus,
  ScrollText,
  UserRoundPlus,
} from "lucide-react";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import AccountIcon from "../IconComponents/AccountIcon";
import DashboardIcon from "../IconComponents/DashboardIcon";
import SettingsIcon from "../IconComponents/SettingsIcon";
import TicketIcon from "../IconComponents/TicketIcon";
import UserIconSolid from "../IconComponents/UserIconSolid";
import DocumentIcon from "../IconComponents/DocumentIcon";
import { removeToken } from "../../services/tokenServices";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

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

  // const sharedMenu = [
  //     { separator: true },
  //     { name: "Notification", icon: Bell, path: "/tickets" },
  //     { name: "Tickets", icon: TicketIcon, path: "/tickets" },
  //     { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
  //     { name: "Profile", icon: SettingsIcon, path: "/settings" },
  // ];

  // const roleMenus = {
  //     1: [
  //         { name: "Dashboard", icon: DashboardIcon, path: "/admission/dashboard" },
  //         { name: "Online Application", icon: UserIconSolid, path: "/admission/onlineapplication" },
  //         { name: "Templates", icon: DocumentIcon, path: "/admission/templatesform" },
  //         { separator: true },
  //         { name: "Notification", icon: Bell, path: "/tickets" },
  //         { name: "Tickets", icon: TicketIcon, path: "/tickets" },
  //         { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
  //         { name: "Profile", icon: SettingsIcon, path: "/settings" },
  //     ],
  //     2: [
  //         { name: "Dashboard", icon: DashboardIcon, path: "/cfw/dashboard" },
  //         { name: "Online Application", icon: UserIconSolid, path: "/cfw/onlineapplication" },
  //         { name: "CFW Templates", icon: DocumentIcon, path: "/cfw/templates" },
  //         { separator: true },
  //         { name: "Notification", icon: Bell, path: "/tickets" },
  //         { name: "Tickets", icon: TicketIcon, path: "/tickets" },
  //         { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
  //         { name: "Profile", icon: SettingsIcon, path: "/settings" },
  //     ],
  //     3: [
  //         { name: "Cashier Dashboard", icon: DashboardIcon, path: "/cashier/dashboard" },
  //         // { name: "Online Application", icon: AccountIcon, path: "/cashier/onlineapplication" },
  //         { name: "Cashier Payment Form", icon: CreditCardIcon, path: "/cashier/cashierpayment" },
  //         { name: "Transaction History", icon: ScrollText, path: "/cashier/transactionhistory" },
  //         { separator: true },
  //         { name: "Notification", icon: Bell, path: "/tickets" },
  //         { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
  //         { name: "Profile", icon: SettingsIcon, path: "/settings" },
  //     ],
  //     4: [
  //         { name: "Finance Dashboard", icon: DashboardIcon, path: "/finance/dashboard" },
  //         //{ name: "Online Application", icon: AccountIcon, path: "/finance/onlineapplication" },
  //         { name: "Templates", icon: DocumentIcon, path: "/finance/templates" },
  //         { separator: true },
  //         { name: "Notification", icon: Bell, path: "/tickets" },
  //         { name: "Tickets", icon: TicketIcon, path: "/tickets" },
  //         { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
  //         { name: "Profile", icon: SettingsIcon, path: "/settings" },
  //     ],
  //     5: [
  //         { name: "Dashboard", icon: DashboardIcon, path: "/sru/dashboard" },
  //         { name: "Student Master List", icon: UserIconSolid, path: "/sru/studentlist" },
  //         { name: "Section and House Entry", icon: FilePlus, path: "/sru/sectionandhouseentry" },
  //         { name: "No. Of School Days Entry", icon: CalendarPlus, path: "/sru/addhouse" },
  //         { name: "School Calendar", icon: Calendar, path: "/sru/addhouse" },
  //         { separator: true },
  //         { name: "Notification", icon: Bell, path: "/tickets" },
  //         { name: "Tickets", icon: TicketIcon, path: "/tickets" },
  //         { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
  //         { name: "Profile", icon: SettingsIcon, path: "/settings" },
  //     ],
  //     6: [
  //         { name: "Dashboard", icon: DashboardIcon, path: "/academic/dashboard" },
  //         { name: "Faculty Load Entry", icon: FilePlus, path: "/academic/facultyloadentry" },
  //         { name: "Subject Load Entry", icon: BookPlus, path: "/academic/subjectloadentry" },
  //         { name: "Subject Schedule Entry", icon: DocumentIcon, path: "/academic/subjectscheduleloadentry" },
  //         { separator: true },
  //         { name: "Notification", icon: Bell, path: "/tickets" },
  //         { name: "Tickets", icon: TicketIcon, path: "/tickets" },
  //         { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
  //         { name: "Profile", icon: SettingsIcon, path: "/settings" },
  //     ],
  //     7: [
  //         { name: "Dashboard", icon: DashboardIcon, path: "/hrd/dashboard" },
  //         { name: "Employee Online Application", icon: UserIconSolid, path: "/hrd/onlineapplication" },
  //         { name: "Templates", icon: DocumentIcon, path: "/hrd/templates" },
  //         // { name: "Subject Load Entry", icon: BookPlus, path: "/academic/subjectloadentry" },
  //         // { name: "Subject Schedule Entry", icon: DocumentIcon, path: "/academic/templatesform" },
  //         { separator: true },
  //         { name: "Notification", icon: Bell, path: "/tickets" },
  //         { name: "Tickets", icon: TicketIcon, path: "/tickets" },
  //         { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
  //         { name: "Profile", icon: SettingsIcon, path: "/settings" },
  //     ],
  // };
  // 🔹 Shared bottom menu (used by most roles)
  const sharedMenu = [
    { separator: true },
    { name: "Notification", icon: Bell, path: "/tickets" },
    { name: "Tickets", icon: TicketIcon, path: "/tickets" },
    { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
    { name: "Profile", icon: SettingsIcon, path: "/settings" },
  ];

  // 🔹 Role-specific menus
  const admissionMenu = [
    { name: "Dashboard", icon: DashboardIcon, path: "/admission/dashboard" },
    {
      name: "Online Application",
      icon: UserIconSolid,
      path: "/admission/onlineapplication",
    },
    { name: "Templates", icon: DocumentIcon, path: "/admission/templatesform" },
    ...sharedMenu,
  ];

  const cfwMenu = [
    { name: "Dashboard", icon: DashboardIcon, path: "/cfw/dashboard" },
    {
      name: "Online Application",
      icon: UserIconSolid,
      path: "/cfw/onlineapplication",
    },
    { name: "CFW Templates", icon: DocumentIcon, path: "/cfw/templates" },
    ...sharedMenu,
  ];

  const cashierMenu = [
    {
      name: "Cashier Dashboard",
      icon: DashboardIcon,
      path: "/cashier/dashboard",
    },
    {
      name: "Cashier Payment Form",
      icon: CreditCardIcon,
      path: "/cashier/cashierpayment",
    },
    {
      name: "Transaction History",
      icon: ScrollText,
      path: "/cashier/transactionhistory",
    },
    { separator: true },
    { name: "Notification", icon: Bell, path: "/tickets" },
    { name: "Employee Portal", icon: UserIconSolid, path: "/tickets" },
    { name: "Profile", icon: SettingsIcon, path: "/settings" },
  ];

  const financeMenu = [
    {
      name: "Finance Dashboard",
      icon: DashboardIcon,
      path: "/finance/dashboard",
    },
    { name: "Templates", icon: DocumentIcon, path: "/finance/templates" },
    ...sharedMenu,
  ];

  const sruMenu = [
    { name: "Dashboard", icon: DashboardIcon, path: "/sru/dashboard" },
    {
      name: "Student Master List",
      icon: UserIconSolid,
      path: "/sru/studentlist",
    },
    {
      name: "Section and House Entry",
      icon: FilePlus,
      path: "/sru/sectionandhouseentry",
    },
    {
      name: "No. Of School Days Entry",
      icon: CalendarPlus,
      path: "/sru/addhouse",
    },
    { name: "School Calendar", icon: Calendar, path: "/sru/addhouse" },
    ...sharedMenu,
  ];

  const academicMenu = [
    { name: "Dashboard", icon: DashboardIcon, path: "/academic/dashboard" },
    {
      name: "Faculty Load Entry",
      icon: FilePlus,
      path: "/academic/facultyloadentry",
    },
    {
      name: "Subject Load Entry",
      icon: BookPlus,
      path: "/academic/subjectloadentry",
    },
    {
      name: "Subject Schedule Entry",
      icon: DocumentIcon,
      path: "/academic/subjectscheduleloadentry",
    },
    ...sharedMenu,
  ];

  const hrMenu = [
    { name: "Dashboard", icon: DashboardIcon, path: "/hrd/dashboard" },
    {
      name: "Employee Online Application",
      icon: UserIconSolid,
      path: "/hrd/onlineapplication",
    },
    { name: "Templates", icon: DocumentIcon, path: "/hrd/templates" },
    ...sharedMenu,
  ];
  const hrAdminMenu = [
    { name: "Dashboard", icon: DashboardIcon, path: "/hrd/dashboard" },
    {
      name: "Employee Online Application",
      icon: UserIconSolid,
      path: "/hrd/onlineapplication",
    },
    { name: "Templates", icon: DocumentIcon, path: "/hrd/templates" },
    ...sharedMenu,
  ];
  const sacMenu = [
    { name: "Dashboard", icon: DashboardIcon, path: "/sac/dashboard" },
    {
      name: "Employee Online Application",
      icon: UserIconSolid,
      path: "/sac/onlineapplication",
    },
    // { name: "Templates", icon: DocumentIcon, path: "/hrd/templates" },
    // ...sharedMenu,
  ];
  const parentMenu = [
    { name: "Dashboard", icon: DashboardIcon, path: "/parent/dashboard" },
    {
      name: "Enroll Student",
      icon: UserRoundPlus,
      path: "/parent/enrollstudent",
    },
  ];

  // 🔥 MULTIPLE ROLE SUPPORT HERE
  const roleMenus = {
    1: admissionMenu,
    2: cfwMenu,
    3: cashierMenu,
    4: financeMenu,
    5: sruMenu,
    6: academicMenu,
    7: hrMenu,
    10: hrAdminMenu,
    11: sacMenu,
    17: parentMenu,
  };

  // Pick menu by role
  // const menuItems = roleMenus[user?.UserRoleId] || [];

  const getMenuByRoles = (userRoles) => {
    if (!userRoles) return [];

    // Ensure roles is always an array
    const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

    // Merge menus from all roles
    const mergedMenus = rolesArray.flatMap((role) => roleMenus[role] || []);

    // Remove duplicates (by name)
    const uniqueMenus = [];
    const seen = new Set();

    for (let item of mergedMenus) {
      if (item.separator) {
        uniqueMenus.push(item);
        continue;
      }

      if (!seen.has(item.name)) {
        seen.add(item.name);
        uniqueMenus.push(item);
      }
    }

    return uniqueMenus;
  };

  const menuItems = getMenuByRoles(user?.UserRoleId);

  const getActiveItem = () => {
    if (location.pathname.includes("/dashboard")) return "Dashboard";
    if (location.pathname.includes("/onlineapplication"))
      return "Online Application";
    if (location.pathname.includes("/accounts")) return "Accounts";
    if (location.pathname.includes("/tickets")) return "Tickets";
    if (location.pathname.includes("/settings")) return "Settings";
    return "";
  };
  const activeItem = getActiveItem();

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };
  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen bg-white shadow transition-all duration-300 
                flex flex-col 
                ${isSidebarOpen ? "w-[18.5rem]" : "w-16"}`}
    >
      <div
        className={`flex items-center ${isSidebarOpen ? "p-4" : "p-2"
          } overflow-hidden`}
      >
        {isSidebarOpen && (
          <div className="flex items-center flex-1 space-x-3">
            <img
              className="w-auto h-6 shrink-0"
              src="/assets/img/seton-logo.png"
              alt="Logo"
            />
            <span className="text-sm font-semibold truncate text-green-800">
              Elizabeth Seton School
            </span>
          </div>
        )}

        {/* Toggle button */}
        {/* {menuItems.map((item, index) =>
                    item.separator ? (
                        <hr key={`sep-${index}`} className="my-6 border-gray-200" />
                    ) : (
                        <Link
                            to={item.path}
                            key={item.name + index}
                            className={`flex items-center px-4 py-2 mt-2 text-black rounded-md hover:bg-gray-100 transition-colors duration-300
                            ${activeItem === item.name ? "bg-gray-100 font-semibold" : ""}`}
                        >
                            <item.icon />
                            {isSidebarOpen && (
                                <span className="mx-4 font-medium">{item.name}</span>
                            )}
                        </Link>
                    )
                )} */}
        <Link
          // href="#"
          className="p-1 rounded-sm transition-all duration-300 hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            setIsSidebarOpen(!isSidebarOpen);
          }}
        >
          <svg
            className="w-5 h-5 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isSidebarOpen && (
          <div className="relative mt-2 px-4">
            <span className="absolute inset-y-0 left-6 flex items-center pl-1">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
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
        )}

        <nav className="mt-4">
          {menuItems.map((item, index) =>
            item.separator ? (
              <hr key={`sep-${index}`} className="my-6 border-gray-200" />
            ) : (
              <Link
                to={item.path}
                key={item.name + index}
                className={`flex items-center px-4 py-2 mt-2 text-black rounded-md hover:bg-gray-100 transition-colors duration-300
                                ${activeItem === item.name
                    ? "bg-gray-100 font-semibold"
                    : ""
                  }`}
              >
                <item.icon className="h-5 w-5 text-gray-600" />
                {isSidebarOpen && (
                  <span className="mx-4 font-medium">{item.name}</span>
                )}
              </Link>
            )
          )}
          {/* {menuItems.map((item, index) =>
                        item.separator ? (
                            <hr key={`sep-${index}`} className="my-6 border-gray-200" />
                        ) : (
                            <a
                                href='#'
                                key={item.name + index}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleClick(item.name)}
                                className={`flex items-center px-4 py-2 mt-2 text-black rounded-md hover:bg-gray-100 transition-colors duration-300
                                ${activeItem === item.name ? "bg-gray-100 font-semibold" : ""}`}
                            >
                                <item.icon />
                                {isSidebarOpen && (
                                    <span className="mx-4 font-medium">{item.name}</span>
                                )}
                            </a>
                        )
                    )} */}
        </nav>
      </div>

      <div className="mt-auto relative" ref={dropdownRef}>
        <a
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center px-4 py-3 hover:bg-gray-100 rounded-md transition cursor-pointer"
        >
          <img
            className="object-cover rounded-full h-9 w-9"
            src={user?.avatar || "/assets/img/default_image.png"}
            alt="avatar"
          />
          {isSidebarOpen && (
            <>
              <span className="mx-2 font-medium text-black truncate">
                {user?.Fname} {user?.Mname} {user?.Lname}
              </span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${isDropdownOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          )}
        </a>

        {isDropdownOpen && isSidebarOpen && (
          <ul className="absolute bottom-full left-4 right-4 mb-2 bg-white border rounded-md shadow-md text-sm text-gray-700 z-50">
            <li>
              <a
                href="#"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
