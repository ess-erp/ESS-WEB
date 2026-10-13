import { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import NewStudentForm from "../../components/ParentPortalComponents/NewStudentForm";
import ReturneeFormComponent from "../../components/ParentPortalComponents/ReturneeFormComponent";

const EnrollStudent = () => {
  useEffect(() => {
    document.title = "Enroll Student";
  }, []);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/parent/dashboard" },
    { label: "Enroll Student", href: "/parent/enroll-student" },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState !== null ? JSON.parse(savedState) : true;
  });
  const [entryType, setEntryType] = useState("new");

  return (
    <div
      className={`flex transition-all duration-300 ${
        sidebarOpen ? "pl-[18.5rem]" : "pl-16"
      }`}
    >
      <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />

      <div className="flex-1 bg-gray-50 px-4 sm:px-6 py-4 min-h-screen">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
          <h2 className="text-xl sm:text-2xl font-bold text-black mt-2">Enroll Student</h2>
        </div>

        <section className="flex flex-col items-center pb-8">
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 w-full max-w-6xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 text-center px-4">
              Student Enrollment Registration
            </h2>

            {/* Student type buttons - No Animation */}
            <div className="flex justify-center mb-4 sm:mb-6 w-full px-4">
              <div className="relative flex bg-gray-100 border border-gray-300 rounded-xl p-1 w-full max-w-[420px]">
                {/* Static highlight - No animation */}
                <div
                  className="absolute top-1 bottom-1 bg-green-600 rounded-lg shadow-sm transition-all duration-0"
                  style={{
                    width: "calc(50% - 0.5rem)",
                    left: entryType === "new" ? "0.25rem" : "calc(50% + 0.25rem)",
                  }}
                />

                <button
                  onClick={() => setEntryType("new")}
                  className={`relative z-10 w-1/2 py-2.5 text-sm sm:text-base font-semibold
                    ${entryType === "new" ? "text-white" : "text-gray-700"}
                  `}
                >
                  New Student
                </button>

                <button
                  onClick={() => setEntryType("returnee")}
                  className={`relative z-10 w-1/2 py-2.5 text-sm sm:text-base font-semibold
                    ${entryType === "returnee" ? "text-white" : "text-gray-700"}
                  `}
                >
                  Returnee
                </button>
              </div>
            </div>

            {/* Form Container with Smooth Slide Animation */}
            <div className="w-full px-2 sm:px-4 overflow-hidden">
              <div 
                key={entryType}
                className="animate-slideIn"
                style={{
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                {entryType === "new" ? (
                  <NewStudentForm type="new" />
                ) : (
                  <ReturneeFormComponent type="returnee" />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnrollStudent;
