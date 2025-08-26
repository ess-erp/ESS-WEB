import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil } from "lucide-react";
import DataTable from "react-data-table-component";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { fetchGpaTableData, fetchInsertGpaTableData } from "../../states/AdmissionState/Action";

const GPATableComponent = ({ studentId }) => {
    const dispatch = useDispatch();

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const currentUserId = user.UserId;
    const gpaTableState = useSelector((state) => state.admission.gpaTableState || {});
    const gpaTable = gpaTableState.data?.data || [];
    const totalRows = gpaTableState.data?.totalRecords || 0;
    const loading = gpaTableState.loading || false;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const [subjects, setSubjects] = useState([]);

    const [editingRowId, setEditingRowId] = useState(null);
    const [tempGrade, setTempGrade] = useState("");

    useEffect(() => {
        dispatch(fetchGpaTableData(studentId, page, pageSize, search));
    }, [dispatch, studentId, page, pageSize, search]);

    useEffect(() => {
        if (gpaTable.length > 0 && subjects.length === 0) {
            const initialSubjects = gpaTable.map((row) => ({
                TempId: row.GpaTempId,
                SubjGrade: row.SubjGrade || "",
                CreatedByUserId: currentUserId
            }));
            setSubjects(initialSubjects);
        }
    }, [gpaTable]);

    const handleEditClick = (row) => {
        setEditingRowId(row.TempId);
        const current = subjects.find((s) => s.TempId === row.TempId);
        setTempGrade(current?.SubjGrade || row.SubjGrade || "");
    };
    const handleSaveGrade = (tempId) => {
        setSubjects((prev) =>
            prev.map((subj) =>
                subj.TempId === tempId ? { ...subj, SubjGrade: tempGrade } : subj
            )
        );
        setEditingRowId(null);
    };
    const columns = [
        {
            name: "Subject Code",
            selector: (row) => row.SubjectCode,
            sortable: true,
            wrap: true,
        },
        {
            name: "Subject Name",
            selector: (row) => row.SubjectName,
            sortable: true,
            wrap: true,
        },
        {
            name: "Grade",
            cell: (row) => {
                // Find the edited subject data
                const subj = subjects.find((s) => s.TempId === row.TempId);

                // If the original SubjGrade exists (not null/undefined), display it
                if (row.SubjGrade !== null && row.SubjGrade !== undefined) {
                    return row.SubjGrade;
                }

                // Otherwise, show the editable input or stored grade
                return editingRowId === row.TempId ? (
                    <input
                        type="text"
                        className="border p-1 rounded w-20"
                        value={tempGrade}
                        onChange={(e) => setTempGrade(e.target.value)}
                        onBlur={() => handleSaveGrade(row.TempId)}
                        autoFocus
                    />
                ) : (
                    subj?.SubjGrade || "—"
                );
            },
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    className="p-1 text-green-600 hover:text-green-800"
                    onClick={() => handleEditClick(row)}
                >
                    <Pencil size={18} />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const Loader = () => (
        <div className="flex justify-center items-center py-10">
            <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                ></path>
            </svg>
        </div>
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openWarningModal = () => {
        setIsModalOpen(true);
    }
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleSubmit = async () => {

        const payload = {
            GpaId: gpaTable[0].GpaId,
            GpaTempId: gpaTable[0].GpaTempId,
            StudentId: studentId,
            GpaChildDtos: subjects
        };

        try {
            const result = await dispatch(fetchInsertGpaTableData(payload));
            if (result.ok) {
                setIsSuccessModalOpen(true);
            }
        } catch (error) {
            alert("Error submitting GPA:", error);
        }
    };
    return (
        <>
            <DataTable
                keyField="uniqueKey"
                title={
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-green-700">
                            Grade Point Average
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border rounded w-52 text-sm"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                }
                columns={columns}
                data={gpaTable.map((row, idx) => ({
                    ...row,
                    uniqueKey: `${row.GpaTempId}-${row.SubjId || idx}`
                }))}
                progressPending={loading}
                progressComponent={<Loader />}
                noDataComponent={
                    <div className="py-10 text-center text-gray-500 font-medium">
                        No records found. Please check the template module if the template is disabled.
                    </div>
                }
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={page}
                onChangePage={(newPage) => setPage(newPage)}
                onChangeRowsPerPage={(newPageSize, newPage) => {
                    setPageSize(newPageSize);
                    setPage(newPage);
                }}
                highlightOnHover
                striped
                responsive
            />

            {subjects.length > 0 && (
                <div className="flex justify-end mt-4">
                    <GreenBtn label="Submit" onClick={openWarningModal} />
                </div>
            )}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Warning</span>}
                body="Are you sure you want to continue?"
                buttons={[
                    { label: "Yes", type: "green", onClick: handleSubmit },
                    { label: "No", type: "red" },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body="Grades have been successfully submitted!"
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) },
                ]}
            />
        </>
    );
};

export default GPATableComponent;
