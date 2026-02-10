import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import SubjectDataTable from "./SubjectDataTable";

const SubjectScheduleLoadEntryComponent = () => {

    const [entryType, setEntryType] = useState("subject");
    const slideVariants = {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 }
    };
    const [addNewModal, setAddNewModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openAddNewModal = () => {
        setAddNewModal(true);
    };
    return (
        // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>

            {/* LEFT — Inactive */}
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            Subject Schedule Master List
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <OutlineBlueBtn
                            label="Add new"
                            onClick={openAddNewModal}
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-64"
                            // value={generalOfferedFilterText}
                            // onChange={(e) => {
                            //     setGeneralOfferedFilterText(e.target.value);
                            //     setGeneralOfferedCurrentPage(1);
                            // }}
                        />
                    </div>
                </div>

            </div>
            <ModalComponent
                isOpen={addNewModal}
                onClose={() => setAddNewModal(false)}
                title="Create subject schedule template"
                body={
                    <div>
                        <div className="flex justify-center mb-6">
                            <div className="relative flex bg-gray-200 rounded-lg p-1 w-[260px]">

                                {/* Sliding highlight */}
                                <motion.div
                                    layout
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    className="absolute top-1 bottom-1 w-1/2 bg-green-600 rounded-md shadow"
                                    style={{
                                        left: entryType === "subject" ? "4px" : "50%"
                                    }}
                                />

                                <button
                                    onClick={() => setEntryType("subject")}
                                    className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-md transition
                                    ${entryType === "subject" ? "text-white" : "text-gray-700"}
                                `}
                                >
                                    Subject List
                                </button>

                                <button
                                    onClick={() => setEntryType("non-curriculum")}
                                    className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-md transition
                                    ${entryType === "non-curriculum" ? "text-white" : "text-gray-700"}
                                `}
                                >
                                    NC-Subject List
                                </button>

                            </div>
                        </div>
                        <div className="mt-6 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={entryType}
                                    variants={slideVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                >
                                    {entryType === "subject" ? (
                                        <SubjectDataTable />
                                    ) : (
                                        <>Test 2</>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    // <div>
                    //     <div className="px-4 py-3 rounded-t-lg flex justify-between">
                    //         <div>
                    //             <h3 className="text-lg font-semibold text-green-600">
                    //                 Subject Master List
                    //             </h3>
                    //         </div>
                    //         <input
                    //             type="text"
                    //             placeholder="Search..."
                    //             className="px-3 py-2 border border-gray-300 rounded w-64"
                    //             value={generalOfferedFilterText}
                    //             onChange={(e) => {
                    //                 setGeneralOfferedFilterText(e.target.value);
                    //                 setGeneralOfferedCurrentPage(1);
                    //             }}
                    //         />
                    //     </div>
                    //     <div className="w-full overflow-x-auto">
                    //         <DataTable
                    //             columns={subjectColumns}
                    //             data={generalOfferedSubject}
                    //             progressPending={generealOfferedLoading}
                    //             pagination
                    //             paginationServer
                    //             paginationTotalRows={generealOfferedTotalRows}
                    //             paginationDefaultPage={generalOfferedCurrentPage}
                    //             onChangePage={(page) => setGeneralOfferedCurrentPage(page)}
                    //             onChangeRowsPerPage={(newPerPage, page) => {
                    //                 setGeneralOfferedRowsPerPage(newPerPage);
                    //                 setGeneralOfferedCurrentPage(page);
                    //             }}
                    //             highlightOnHover
                    //             responsive
                    //         />
                    //     </div>

                    //     <hr className="my-4 border-t border-gray-300" />
                    //     <h2 className="my-4 text-xl font-bold text-green-500">
                    //         List of Added Subjects
                    //     </h2>
                    //     <div className="flex justify-center gap-6 mb-4">

                    //         <SearchableSelect
                    //             options={sectionList}
                    //             value={selectedSection}
                    //             onChange={(selected) => setSelectedSection(selected)}
                    //             placeholder="-- Select Section Type --"
                    //             label="Select Section"
                    //         />

                    //         <div>
                    //             <label className="block text-sm font-medium text-gray-700">
                    //                 Level
                    //             </label>
                    //             <input
                    //                 type="text"
                    //                 value={selectedSection?.levelName || ""}
                    //                 placeholder="Level"
                    //                 disabled
                    //                 className="shadow-xs border text-sm rounded-lg block w-full p-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                    //             />
                    //         </div>


                    //     </div>
                    //     <div className="w-full overflow-y-auto max-h-[300px]">
                    //         <DataTable
                    //             columns={addedColumns}
                    //             data={addedSubjects}
                    //             highlightOnHover
                    //             striped
                    //             responsive
                    //             dense
                    //             fixedHeader
                    //             fixedHeaderScrollHeight="260px"
                    //             noDataComponent="No subjects added yet"
                    //         />
                    //     </div>

                    // </div>
                }
                size="w-[1000px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Submit", type: "green", closeOnClick: false },
                    { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
                ]}
            />

           
        </div>
    );
};
export default SubjectScheduleLoadEntryComponent;