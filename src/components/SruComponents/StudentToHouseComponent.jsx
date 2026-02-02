import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import {
    fetchGetHouseStudentData,
    fetchInsertStudentHouseData,
} from "../../states/SruState/Action";
import { motion } from "framer-motion";

const StudentToHouseComponent = ({ level, userId }) => {
    console.log(level);
    const dispatch = useDispatch();
    const houseStudentState = useSelector((state) => state.sru.houseStudentState || {});
    const studentTable = houseStudentState.data.data || [];
    const studentTotalRows = houseStudentState.data.totalRecords || 0;
    const studentLoading = houseStudentState.loading || false;
    const [filterStudentText, setStudentFilterText] = useState('');
    const [studentCurrentPage, setStudentCurrentPage] = useState(1);
    const [studentRowsPerPage, setStudentRowsPerPage] = useState(10);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    console.log(studentTable);


    useEffect(() => {
        dispatch(fetchGetHouseStudentData(level.LevelId, studentCurrentPage, studentRowsPerPage, filterStudentText));
    }, [level.LevelId, studentCurrentPage, studentRowsPerPage, filterStudentText, dispatch]);

    useEffect(() => {
        if (studentTable.length == 0) return;
        setAvailableStudents(studentTable);
    }, [studentTable]);

    const toAddStudentColumn = [
        { name: "Student Number", selector: row => row.StudentNumber, sortable: true },
        { name: "Fullname", selector: row => `${row.Fname} ${row.Mname ?? ""} ${row.Lname}`, sortable: true },
    ];

    const [selectedAvailableStudents, setSelectedAvailableStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedAddedStudents, setSelectedAddedStudents] = useState([]);
    const [addedStudents, setAddedStudents] = useState([]);
    const [resetAvailableToggle, setResetAvailableToggle] = useState(false);
    const [resetAddedToggle, setResetAddedToggle] = useState(false);

    const [genderFilter, setGenderFilter] = useState("all");
    const filteredAvailableStudents = availableStudents.filter(s => {
        if (genderFilter === "ALL") return true;
        if (genderFilter === "MALE") return s.Gender === "male";
        if (genderFilter === "FEMALE") return s.Gender === "female";
        return true;
    });

    const addedStudentColumns = [
        {
            name: "Student Number",
            selector: row =>
                row.StudentNumber,
            sortable: true,
        },
        {
            name: "Fullname",
            selector: row =>
                `${row.Fname} ${row.Mname ?? ""} ${row.Lname}`,
            sortable: true,
        },
    ];
    const handleAddSelectedStudents = () => {
        setAddedStudents(prev => {
            const newStudents = selectedAvailableStudents.filter(
                s => !prev.some(p => p.StudentId === s.StudentId)
            );
            return [...prev, ...newStudents];
        });

        setAvailableStudents(prev =>
            prev.filter(
                s => !selectedAvailableStudents.some(a => a.StudentId === s.StudentId)
            )
        );

        setSelectedAvailableStudents([]);

        setResetAvailableToggle(prev => !prev);
    };
    const handleRemoveSelectedStudents = () => {
        setAddedStudents(prev =>
            prev.filter(
                s => !selectedAddedStudents.some(a => a.StudentId === s.StudentId)
            )
        );

        setAvailableStudents(prev => [...prev, ...selectedAddedStudents]);

        setSelectedAddedStudents([]);

        setResetAddedToggle(prev => !prev);
    };
    const [isWarningModal, setIsWarningModal] = useState(false);
     const [isModalSuccesBody, setModalSuccessBody] = useState("");
    const handleSubmitStudent = async () => {
        console.log(addedStudents);
        console.log(selectedAvailableStudents);
        const payload = {
            HouseRowDtos: addedStudents.map(r => ({
                HouseTempId: level.HouseTempId,
                CreatedByUserId: userId,
                StudentId: r.StudentId,
                StudentNumber: r.StudentNumber
            }))
        }
        console.log(payload);
        const res = await dispatch(fetchInsertStudentHouseData(payload));

        if (res.ok) {
            setModalSuccessBody(`Done saving student from this house - ${level.HouseName}`);
            setIsSuccessModalOpen(true);
            setTimeout(() => window.location.reload(), 3000);
        }
    };

    return (
        <>
            <div className="mt-8 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold text-green-600 mb-4">
                    Manage Students – {level.LevelName} for Section - {level.HouseName}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >

                            {/* Header */}
                            <motion.div
                                className="px-4 py-3 border-b bg-red-50 rounded-t-lg flex justify-between items-start"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >

                                <h3 className="text-lg font-semibold text-red-600">
                                    Available Students
                                </h3>

                                <div className="flex flex-col items-end gap-2">

                                    {/* Search */}
                                    <motion.input
                                        whileFocus={{ scale: 1.05 }}
                                        type="text"
                                        placeholder="Search..."
                                        className="px-3 py-2 border rounded w-64"
                                        value={filterStudentText}
                                        onChange={(e) => {
                                            setStudentFilterText(e.target.value);
                                            setStudentCurrentPage(1);
                                        }}
                                    />

                                    {/* Gender Buttons */}
                                    <div className="flex gap-2">
                                        {["ALL", "MALE", "FEMALE"].map((g, i) => (
                                            <motion.button
                                                key={g}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.15 + i * 0.05 }}
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setGenderFilter(g)}
                                                className={`px-3 py-1 rounded text-sm border transition-colors duration-200 ${genderFilter === g
                                                    ? "bg-green-700 text-white"
                                                    : "bg-blue-500 text-white hover:bg-gray-400"
                                                    }`}
                                            >
                                                {g}
                                            </motion.button>
                                        ))}
                                    </div>

                                </div>
                            </motion.div>

                            {/* Table */}
                            <motion.div
                                key={`${studentCurrentPage}-${studentRowsPerPage}-${filterStudentText}-${genderFilter}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DataTable
                                    columns={toAddStudentColumn}
                                    data={filteredAvailableStudents}
                                    progressPending={studentLoading}
                                    selectableRows
                                    selectableRowsHighlight
                                    clearSelectedRows={resetAvailableToggle}
                                    onSelectedRowsChange={({ selectedRows }) =>
                                        setSelectedAvailableStudents(selectedRows)
                                    }
                                    pagination
                                    paginationServer
                                    paginationTotalRows={studentTotalRows}
                                    paginationDefaultPage={studentCurrentPage}
                                    onChangePage={setStudentCurrentPage}
                                    onChangeRowsPerPage={(n, p) => {
                                        setStudentRowsPerPage(n);
                                        setStudentCurrentPage(p);
                                    }}
                                    responsive
                                />
                            </motion.div>

                            {/* Add Button */}
                            <motion.div
                                className="mt-3 flex justify-end"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddSelectedStudents}
                                    disabled={!selectedAvailableStudents.length}
                                    className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                                >
                                    Add Selected
                                </motion.button>
                            </motion.div>

                        </motion.div>

                    </div>
                    <div>

                        <div className="px-4 py-3 border-b bg-green-50 rounded-t-lg">
                            <h3 className="text-lg font-semibold text-green-600">Added Students</h3>
                        </div>

                        <DataTable
                            columns={addedStudentColumns}
                            data={addedStudents}
                            selectableRows
                            selectableRowsHighlight
                            clearSelectedRows={resetAddedToggle}
                            onSelectedRowsChange={({ selectedRows }) =>
                                setSelectedAddedStudents(selectedRows)
                            }
                            pagination
                            responsive
                        />

                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={handleRemoveSelectedStudents}
                                disabled={!selectedAddedStudents.length}
                                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Remove Selected
                            </button>
                        </div>

                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => setIsWarningModal(true)}
                        disabled={!addedStudents.length}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg text-md font-medium
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Students
                    </button>
                </div>
                <ModalComponent
                    isOpen={isWarningModal}
                    onClose={() => setIsWarningModal(false)}
                    title={<span className="font-bold text-lg text-red-700">Warning</span>}
                    body={<p>Are you sure you want to submit?</p>}
                    buttons={[
                        { label: "Yes", type: "green", onClick: handleSubmitStudent },
                        { label: "No", type: "red", onClick: () => setIsWarningModal(false) },
                    ]}
                />
                <ModalComponent
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title={<span className="font-bold text-lg text-green-700">Success</span>}
                    body={<p>{isModalSuccesBody}</p>}
                />
            </div>
        </>
    );
};

export default StudentToHouseComponent;