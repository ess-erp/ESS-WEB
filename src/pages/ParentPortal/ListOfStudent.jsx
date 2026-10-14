import { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import ListOfStudentDataTable from "../../components/ParentPortalComponents/ListOfStudentDataTable";
import { FaClock, FaCheckCircle } from "react-icons/fa";

const ListOfStudent = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    document.title = "List of Pending Student";
  }, []);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/parent/dashboard" },
    { label: "List of Student", href: "/parent/List-of-student" },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [entryType, setEntryType] = useState("pending");

  const statuses = [
    {
      label: "Pending",
      action: "pending",
      icon: <FaClock className="text-yellow-500 text-xl" />,
      bg: "bg-yellow-100",
      hover: "hover:bg-yellow-200",
    },
    {
      label: "Enrolled",
      action: "enrolled",
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      bg: "bg-green-100",
      hover: "hover:bg-green-200",
    },
  ];

  return (
    <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
      <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />

      <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-auto">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
          <h2 className="text-sm font-bold text-black mt-2">
            List of Student
          </h2>
        </div>
        <hr className="border-t-1 border-solid border-gray-400 my-6" />
        <section className="flex items-center justify-center h-[calc(100%-5rem)]">
          <div className="flex flex-col space-y-4 h-full w-full">

            <div className="flex justify-center">
              <h2 className="text-2xl font-bold text-green-500 mt-2">
                List of Student
              </h2>
            </div>
            <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              <strong className="font-bold">Note: </strong>
              <span className="block sm:inline">This is the table of Online Application. Please click the button below to view the table.</span>
            </div>
            {/* Status Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {statuses.map((status) => (
                <button
                  key={status.label}
                  onClick={() => setEntryType(status.action)}
                  className={`flex items-center justify-center gap-3 w-48 h-20 rounded-lg shadow-sm ${status.bg} ${status.hover}`}
                >
                  <div>{status.icon}</div>

                  <div className="text-left">
                    <p className="text-sm font-medium">{status.label}</p>
                    <p className="text-lg font-bold">--</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="w-full">
              {entryType === "pending" && user && (
                <ListOfStudentDataTable
                  type="pending"
                  userId={user.UserId}
                />
              )}
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default ListOfStudent;