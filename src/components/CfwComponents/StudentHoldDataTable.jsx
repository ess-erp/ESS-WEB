import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import { Ban, Trash2 } from "lucide-react";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import {
    fetchStudentHoldTable,
    searchStudentForHold,
    createStudentHold,
    removeStudentHold,
} from "../../states/CfwState/Action";

const StudentHoldDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const formatDate = getFormatDate;

    // ── Redux State ──────────────────────────────────────────────────────────
    const studentHoldTableState = useSelector((state) => state.cfw?.studentHoldTableState || {});
    const holdList = studentHoldTableState.data || [];
    const totalRecords = studentHoldTableState.totalRecords || 0;
    const loading = studentHoldTableState.loading || false;

    const createHoldState = useSelector((state) => state.cfw?.createStudentHoldState || {});
    const createLoading = createHoldState.loading || false;

    // ── Pagination State ─────────────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchFilter, setSearchFilter] = useState("");

    // ── Modal State ──────────────────────────────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [remarks, setRemarks] = useState("");

    // ── Fetch Data on Mount & Pagination Change ──────────────────────────────
    const fetchData = useCallback(() => {
        dispatch(fetchStudentHoldTable(currentPage, rowsPerPage, searchFilter));
    }, [currentPage, rowsPerPage, searchFilter, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ── Async Search for SearchableSelect ────────────────────────────────────
    const loadStudentOptions = (inputValue, callback) => {
        if (!inputValue || inputValue.length < 2) {
            callback([]);
            return;
        }

        dispatch(searchStudentForHold(inputValue)).then((result) => {
            if (result.ok) {
                const options = (result.data || []).map((student) => ({
                    value: student.StudentId,
                    label: `${student.StudentId} - ${student.FirstName || ""} ${student.MiddleName || ""} ${student.LastName || ""}`.trim(),
                    StudentId: student.StudentId,
                    FirstName: student.FirstName,
                    MiddleName: student.MiddleName,
                    LastName: student.LastName,
                }));
                callback(options);
            } else {
                callback([]);
            }
        });
    };

    // ── Create Hold ──────────────────────────────────────────────────────────
    const handleCreateHold = async () => {
        if (!selectedStudent || !remarks.trim()) {
            alert("Please select a student and provide remarks");
            return;
        }

        const payload = {
            studentId: selectedStudent.StudentId,
            remarks: remarks,
            userId: user?.UserId,
        };

        const result = await dispatch(createStudentHold(payload));

        if (result.ok) {
            alert(result.message || "Student hold created successfully");
            setIsModalOpen(false);
            setSelectedStudent(null);
            setRemarks("");
            fetchData();
        } else {
            alert(result.error || "Failed to create student hold");
        }
    };

    // ── Remove Hold ──────────────────────────────────────────────────────────
    const handleRemoveHold = async (holdId) => {
        if (!window.confirm("Are you sure you want to remove this hold?")) return;

        const result = await dispatch(removeStudentHold(holdId));

        if (result.ok) {
            alert(result.message || "Student hold removed successfully");
            fetchData();
        } else {
            alert(result.error || "Failed to remove student hold");
        }
    };

    // ── Open Modal ───────────────────────────────────────────────────────────
    const openModal = () => {
        setIsModalOpen(true);
        setSelectedStudent(null);
        setRemarks("");
    };

    // ── DataTable Columns ────────────────────────────────────────────────────
    const columns = [
        {
            name: "Student ID",
            selector: (row) => row.StudentId || "N/A",
            sortable: true,
            width: "120px",
        },
        {
            name: "Student Name",
            selector: (row) => `${row.FirstName || ""} ${row.MiddleName || ""} ${row.LastName || ""}`.trim(),
            sortable: true,
            grow: 2,
        },
        {
            name: "Level",
            selector: (row) => row.LevelName || "N/A",
            sortable: true,
            width: "150px",
        },
        {
            name: "Remarks",
            selector: (row) => row.Remarks || "N/A",
            sortable: true,
            grow: 2,
            cell: (row) => (
                <div className="py-2 text-sm" title={row.Remarks}>
                    {row.Remarks || "N/A"}
                </div>
            ),
        },
        {
            name: "Created By",
            selector: (row) => row.CreatedBy || "N/A",
            sortable: true,
            width: "150px",
        },
        {
            name: "Date Created",
            selector: (row) => formatDate(row.DateCreated),
            sortable: true,
            width: "130px",
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                    onClick={() => handleRemoveHold(row.HoldId)}
                    title="Remove Hold"
                >
                    <Trash2 size={18} />
                </button>
            ),
            ignoreRowClick: true,
            width: "100px",
            center: true,
        },
    ];

    return (
        <div>
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="px-4 py-3 border-b bg-white rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Ban size={24} className="text-green-600" />
                        <h3 className="text-lg font-bold text-green-600">Student Hold/Clearance List</h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <OutlineBlueBtn label="Hold Student" onClick={openModal} />
                        <input
                            type="text"
                            placeholder="Search student..."
                            className="px-3 py-2 border border-gray-300 rounded w-64"
                            value={searchFilter}
                            onChange={(e) => {
                                setSearchFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="w-full">
                    <DataTable
                        columns={columns}
                        data={holdList}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRecords}
                        paginationDefaultPage={currentPage}
                        onChangePage={(page) => setCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setRowsPerPage(newPerPage);
                            setCurrentPage(page);
                        }}
                        highlightOnHover
                        responsive
                        noDataComponent={
                            <div className="py-8 text-center text-gray-500">
                                No students on hold
                            </div>
                        }
                    />
                </div>
            </div>

            {/* Hold Student Modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Hold Student"
                body={
                    <div className="mt-4 space-y-4">
                        {/* Student Selection with Async Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search & Select Student <span className="text-red-500">*</span>
                            </label>
                            <SearchableSelect
                                options={[]}
                                value={selectedStudent}
                                onChange={(option) => setSelectedStudent(option)}
                                placeholder="Type Student ID or Name (min 2 characters)..."
                                isAsync
                                loadOptions={loadStudentOptions}
                                cacheOptions
                                defaultOptions={false}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Start typing to search for students
                            </p>
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Remarks / Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                placeholder="Enter reason for holding student..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    </div>
                }
                size="w-[600px]"
                buttons={[
                    {
                        label: createLoading ? "Submitting..." : "Submit",
                        type: "green",
                        onClick: handleCreateHold,
                        closeOnClick: false,
                        disabled: createLoading || !selectedStudent || !remarks.trim(),
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => setIsModalOpen(false),
                    },
                ]}
            />
        </div>
    );
};

export default StudentHoldDataTable;
