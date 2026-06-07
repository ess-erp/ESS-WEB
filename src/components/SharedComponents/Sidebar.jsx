import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Bell,
  BookPlus,
  CalendarPlus,
  Calendar,
  FilePlus,
  ScrollText,
  UserRoundPlus,
  User,
  IdCard,
  FileText,
} from "lucide-react";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import AccountIcon from "../IconComponents/AccountIcon";
import DashboardIcon from "../IconComponents/DashboardIcon";
import SettingsIcon from "../IconComponents/SettingsIcon";
import TicketIcon from "../IconComponents/TicketIcon";
import UserIconSolid from "../IconComponents/UserIconSolid";
import DocumentIcon from "../IconComponents/DocumentIcon";
import NotificationBell from "./NotificationBell";
import { removeToken } from "../../services/tokenServices";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (user && user.UserId) { 
  //     console.log("User logged in, fetching notifications for user ID:", user.UserId);

  //     dispatch(fetchNotificationCountData(user.UserId));
  //   }
  // }, [user, dispatch]);

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
  const hideTicketsRoles = [7, 8, 9, 14, 15];

  const shouldHideTickets = (userRoles) => {
    const rolesArray = Array.isArray(userRoles)
      ? userRoles
      : [userRoles];

    return rolesArray.some((role) =>
      hideTicketsRoles.includes(role)
    );
  };

  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const sharedMenu = [
    { separator: true },

    {
      name: "Notification",
      icon: Bell,
      path: "/notification",
    },

    // Dynamic Ticket Visibility
    ...(!shouldHideTickets(user?.UserRoleId)
      ? [
        {
          name: "Tickets",
          icon: TicketIcon,
          path: "/ticketing",
        },
      ]
      : []),

    // {
    //   name: "Employee Portal",
    //   icon: UserIconSolid,
    //   path: "/tickets",
    // },
    {
      name: "Employee Portal",
      icon: UserIconSolid,
      children: [
        {
          name: "Time & Attendance (Leave Management)",
          path: "/sru/generate-student-id",
        },
        {
          name: "Payroll & Compensation",
          path: "/sru/generate-school-form",
        },
      ],
    },
    {
      name: "Profile",
      icon: SettingsIcon,
      path: "/profile",
    },
  ];


  const admissionMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/admission/dashboard",
    },
    {
      name: "Online Application",
      icon: UserIconSolid,
      path: "/admission/onlineapplication",
    },
    {
      name: "Templates",
      icon: DocumentIcon,
      path: "/admission/templatesform",
    },
    ...sharedMenu,
  ];

  const cfwMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/cfw/dashboard",
    },
    {
      name: "Online Application",
      icon: UserIconSolid,
      path: "/cfw/onlineapplication",
    },
    {
      name: "CFW Templates",
      icon: DocumentIcon,
      path: "/cfw/templates",
    },
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
    ...sharedMenu,
  ];

  const financeMenu = [
    {
      name: "Finance Dashboard",
      icon: DashboardIcon,
      path: "/finance/dashboard",
    },
    {
      name: "Templates",
      icon: DocumentIcon,
      path: "/finance/templates",
    },
    ...sharedMenu,
  ];
  const sruMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/sru/dashboard",
    },
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
      name: "School Calendar",
      icon: Calendar,
      path: "/sru/schoolcalendar",
    },
    {
      name: "Generate",
      icon: FilePlus,
      children: [
        {
          name: "Student ID Form",
          path: "/sru/generate-student-id",
        },
        {
          name: "School Form",
          path: "/sru/generate-school-form",
        },
        {
          name: "ARC List",
          path: "/sru/generate-school-form",
        },
        {
          name: "Summary Sheet Report",
          path: "/sru/generate-school-form",
        },
        {
          name: "Honor List Report",
          path: "/sru/generate-school-form",
        },
      ],
    },

    {
      name: "Grade Report Template",
      icon: Calendar,
      path: "/sru/gradereporttemplate",
    },

    ...sharedMenu,
  ];

  const academicMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/academic/dashboard",
    },
    {
      name: "Assign Adviser or Non-Adviser",
      icon: UserIconSolid,
      path: "/academic/assignadvisernonadviser",
    },
    {
      name: "Faculty Load Entry",
      icon: FilePlus,
      path: "/academic/facultyloadentry",
    },
    {
      name: "Subject Master List",
      icon: BookPlus,
      path: "/academic/subjectloadentry",
    },

    {
      name: "Curriculum Per Level Entry",
      icon: DocumentIcon,
      path: "/academic/curriculumentry",
    },
    {
      name: "Subject Schedule Entry",
      icon: DocumentIcon,
      path: "/academic/subjectscheduleloadentry",
    },
    ...sharedMenu,
  ];

  const hrMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/hrd/dashboard",
    },
    {
      name: "Employee Online Application",
      icon: UserIconSolid,
      path: "/hrd/onlineapplication",
    },
    {
      name: "Templates",
      icon: DocumentIcon,
      path: "/hrd/templates",
    },
    ...sharedMenu,
  ];
  const hrTimeMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/hrd/dashboard",
    },
    {
      name: "Employee Daily Time Record",
      icon: UserIconSolid,
      path: "/hrd/onlineapplication",
    },
    {
      name: "Templates",
      icon: DocumentIcon,
      path: "/hrd/templates",
    },
    ...sharedMenu,
  ];


  const hrAdminMenu = [...hrMenu];

  const sacMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/sac/dashboard",
    },
    {
      name: "Employee Online Application",
      icon: UserIconSolid,
      path: "/sac/onlineapplication",
    },
  ];

  const apMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/ap/dashboard",
    },
    {
      name: "Employee Online Application",
      icon: UserIconSolid,
      path: "/ap/onlineapplication",
    },
  ];

  const principalMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/principal/dashboard",
    },
    {
      name: "Employee Online Application",
      icon: UserIconSolid,
      path: "/principal/onlineapplication",
    },
  ];

  const parentMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/parent/dashboard",
    },
    {
      name: "Enroll Student",
      icon: UserRoundPlus,
      path: "/teacher/enrollstudent",
    },
    {
      name: "List of Student",
      icon: User,
      path: "/parent/listofstudent",
    },
  ];

  const adviserMenu = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/teacher/dashboard",
    },
    {
      name: "List of Section",
      icon: DocumentIcon,
      path: "/teacher/listofsection",
    },
    {
      name: "Encoding of Grades/Club",
      icon: User,
      path: "/teacher/encodingofgradeorclub",
    },
    ...sharedMenu,
  ];



  /* =========================================================
      ROLE MAP
  ========================================================= */

  const roleMenus = {
    1: admissionMenu,
    2: cfwMenu,
    3: cashierMenu,
    4: financeMenu,
    5: sruMenu,
    6: academicMenu,
    7: hrMenu,
    8: hrTimeMenu,
    10: hrAdminMenu,
    11: sacMenu,
    12: apMenu,
    13: principalMenu,
    14: adviserMenu,
    15: adviserMenu,
    17: parentMenu,
  };



  /* =========================================================
      MULTI ROLE MENU MERGE
  ========================================================= */

  const getMenuByRoles = (userRoles) => {

    if (!userRoles) return [];

    const rolesArray = Array.isArray(userRoles)
      ? userRoles
      : [userRoles];

    const mergedMenus = rolesArray.flatMap(
      (role) => roleMenus[role] || []
    );

    const uniqueMenus = [];
    const seen = new Set();

    for (const item of mergedMenus) {

      if (item.separator) {

        // prevent duplicate separators
        const lastItem =
          uniqueMenus[uniqueMenus.length - 1];

        if (!lastItem?.separator) {
          uniqueMenus.push(item);
        }

        continue;
      }

      const key = `${item.name}-${item.path}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueMenus.push(item);
      }
    }

    return uniqueMenus;
  };

  const menuItems = getMenuByRoles(user?.UserRoleId);



  /* =========================================================
      ACTIVE ITEM
  ========================================================= */

  const getActiveItem = () => {

    const currentPath = location.pathname.toLowerCase();

    const flatMenus = Object.values(roleMenus)
      .flat();

    const matchedMenu = flatMenus.find(
      (item) =>
        item.path &&
        currentPath.startsWith(
          item.path.toLowerCase()
        )
    );

    return matchedMenu?.name || "";
  };

  const activeItem = getActiveItem();



  /* =========================================================
      LOGOUT
  ========================================================= */
  const handleLogout = () => {
    removeToken();

    setTimeout(() => {
      // navigate("/");
      window.location.reload();
    }, 500);
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
        <Link
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
            ) : item.children ? (
              // =========================
              // DROPDOWN PARENT ITEM
              // =========================
              <div key={item.name + index}>
                <a
                  onClick={() => toggleDropdown(item.name)}
                  className={`w-full flex items-center px-4 py-2 mt-2 text-black rounded-md hover:bg-gray-100 transition-colors duration-300
          focus:outline-none focus:ring-0 focus-visible:outline-none cursor-pointer
        ${openDropdown === item.name ? "bg-gray-100 font-semibold" : ""}`}
                >
                  {item.name === "Notification" || item.name.toLowerCase() === "notification" ? (
                    <NotificationBell />
                  ) : (
                    <item.icon className="h-5 w-5 text-gray-600" />
                  )}

                  {isSidebarOpen && (
                    <>
                      <span className="mx-4 font-medium">{item.name}</span>

                      <svg
                        className={`w-4 h-4 ml-auto transition-transform ${openDropdown === item.name ? "rotate-180" : ""
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

                {openDropdown === item.name && isSidebarOpen && (
                  <div className="ml-10 mt-1 border-l border-gray-200 pl-3">
                    {item.children.map((child, i) => (
                      <Link
                        key={i}
                        to={child.path}
                        className={`block px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition
                      ${location.pathname === child.path ? "bg-gray-100 font-semibold" : ""}`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // =========================
              // NORMAL ITEM (Fixed Component Matching here!)
              // =========================
              <Link
                to={item.path}
                key={item.name + index}
                className={`flex items-center px-4 py-2 mt-2 text-black rounded-md hover:bg-gray-100 transition-colors duration-300
               ${activeItem === item.name ? "bg-gray-100 font-semibold" : ""}`}
              >
                {item.name === "Notification" || item.name.toLowerCase() === "notification" ? (
                  <NotificationBell />
                ) : (
                  <item.icon className="h-5 w-5 text-gray-600" />
                )}

                {isSidebarOpen && (
                  <span className="mx-4 font-medium">{item.name}</span>
                )}
              </Link>
            )
          )}
        </nav>
        {/* <nav className="mt-4">
          {menuItems.map((item, index) =>
            item.separator ? (
              <hr key={`sep-${index}`} className="my-6 border-gray-200" />
            ) : item.children ? (
              <div key={item.name + index}>
                <a
                  onClick={() => toggleDropdown(item.name)}
                  className={`w-full flex items-center px-4 py-2 mt-2 text-black rounded-md hover:bg-gray-100 transition-colors duration-300
                  focus:outline-none focus:ring-0 focus-visible:outline-none cursor-pointer
                ${openDropdown === item.name ? "bg-gray-100 font-semibold" : ""}`}
                >
                  {item.name === "Notification" ? (
                    <NotificationBell />
                  ) : (
                    <item.icon className="h-5 w-5 text-gray-600" />
                  )}

                  {isSidebarOpen && (
                    <>
                      <span className="mx-4 font-medium">{item.name}</span>

                      <svg
                        className={`w-4 h-4 ml-auto transition-transform ${openDropdown === item.name ? "rotate-180" : ""
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

                {openDropdown === item.name && isSidebarOpen && (
                  <div className="ml-10 mt-1 border-l border-gray-200 pl-3">
                    {item.children.map((child, i) => (
                      <Link
                        key={i}
                        to={child.path}
                        className={`block px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition
                  ${location.pathname === child.path ? "bg-gray-100 font-semibold" : ""}`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                key={item.name + index}
                className={`flex items-center px-4 py-2 mt-2 text-black rounded-md hover:bg-gray-100 transition-colors duration-300
          ${activeItem === item.name ? "bg-gray-100 font-semibold" : ""}`}
              >
                <item.icon className="h-5 w-5 text-gray-600" />

                {isSidebarOpen && (
                  <span className="mx-4 font-medium">{item.name}</span>
                )}
              </Link>
            )
          )}
        </nav> */}
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
