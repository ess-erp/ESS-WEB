import { useEffect, useState } from "react";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import { motion } from "framer-motion";
import NewStudentForm from "../../components/ParentPortalComponents/NewStudentForm";
import ReturneeFormComponent from "../../components/ParentPortalComponents/ReturneeFormComponent";
import OldStudentFormComponent from "../../components/ParentPortalComponents/OldStudentFormComponents"

const EnrollStudent = () => {
  useEffect(() => {
    document.title = "Enroll Student";
  }, []);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/parent/dashboard" },
    { label: "Enroll Student", href: "/parent/enroll-student" },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [entryType, setEntryType] = useState("new");

  return (
    <div
      className={`flex transition-all duration-300 ${
        sidebarOpen ? "pl-[18.5rem]" : "pl-16"
      }`}
    >
      <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />

      <div className="flex-1 bg-gray-50 px-6 py-4">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
          <h2 className="text-2xl font-bold text-black mt-2">Enroll Student</h2>
        </div>

        <section className="flex flex-col items-center">
          <div className="flex flex-col items-center space-y-6 w-full">
            <h2 className="text-2xl font-bold text-green-700 text-[30px]">
              Student Enrollment Registration
            </h2>

            {/* Student type buttons */}
            <div className="flex justify-center mb-6 w-full">
              <div className="relative flex bg-gray-100 border border-gray-300 rounded-xl p-1 w-[420px]">
                {/* Sliding highlight */}
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute top-1 bottom-1 bg-green-600 rounded-lg shadow-sm"
                  style={{
                    width: "calc(33.33% - 0.5rem)", // leaves small padding on sides
                    left:
                      entryType === "new"
                        ? "0.25rem"
                        : entryType === "returnee"
                        ? "calc(33.33% + 0.25rem)"
                        : "calc(66.66% + 0.25rem)",
                  }}
                />

                <button
                  onClick={() => setEntryType("new")}
                  className={`relative z-10 w-1/3 py-2.5 text-sm font-semibold transition
                                        ${
                                          entryType === "new"
                                            ? "text-white"
                                            : "text-gray-700"
                                        }
                                    `}
                >
                  New Student
                </button>

                <button
                  onClick={() => setEntryType("returnee")}
                  className={`relative z-10 w-1/3 py-2.5 text-sm font-semibold transition
                                        ${
                                          entryType === "returnee"
                                            ? "text-white"
                                            : "text-gray-700"
                                        }
                                    `}
                >
                  Returnee
                </button>

                <button
                  onClick={() => setEntryType("old")}
                  className={`relative z-10 w-1/3 py-2 text-sm font-semibold transition
                                        ${
                                          entryType === "old"
                                            ? "text-white"
                                            : "text-gray-700"
                                        }
                                    `}
                >
                  Old Student
                </button>
              </div>
            </div>

            <div className="w-full">
              {entryType === "new" && <NewStudentForm type="new" />}
              {entryType === "returnee" && (
                <ReturneeFormComponent type="returnee" />
              )}
              {entryType === "old" && <OldStudentFormComponent type="old" />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnrollStudent;
