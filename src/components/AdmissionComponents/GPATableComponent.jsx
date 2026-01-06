import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil } from "lucide-react";
import DataTable from "react-data-table-component";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchGpaTableData,
    fetchInsertGpaTableData
} from "../../states/AdmissionState/Action";

const GPATableComponent = ({divId, studentId }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const currentUserId = user.UserId;
    const [totalRecords, setTotalRecords] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);
    const [table, setTable] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
    const [editedGrades, setEditedGrades] = useState({});
    const [editingRowId, setEditingRowId] = useState(null);
    // const [isKeyField, setIsKeyField] = useState(0);

    // if(table.length != 0 ){
    //     setIsKeyField(table.TempId);
    // }

    const fetchTemplates = async (divId, studentId, page = 1, pageSize = 10, search = "") => {
        setLoadingTable(true);
        const result = await dispatch(fetchGpaTableData(divId, studentId, page, pageSize, search));
        if (result.ok) {
            setTable(result.data); setTotalRecords(result.totalRecords || 0);
        }
        else {
            console.error("Failed to fetch table data:", result.error);
            setTable([]);
        }
        setLoadingTable(false);
    };

    useEffect(() => {
        fetchTemplates(divId, studentId, page, pageSize, search);
    }, [divId, studentId, page, pageSize, search, dispatch]);


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePerRowsChange = (newPerPage, newPage) => {
        setPageSize(newPerPage); setPage(newPage);
    };

    const columns = [
        {
            name: "Subject Code", selector: (row) => row.SubjectCode, sortable: true, wrap: true,
        },
        {
            name: "Subject Name", selector: (row) => row.SubjectName, sortable: true, wrap: true,
        },
        {
            name: "Grade",
            cell: (row) => {
                const isEditing = editingRowId === row.TempId;

                const value =
                    editedGrades[row.TempId]?.SubjGrade ??
                    row.SubjGrade ??
                    "";

                if (isEditing) {
                    return (
                        <input
                            type="text"
                            className="border p-1 rounded w-20 text-center"
                            value={value}
                            onChange={(e) => {
                                const val = e.target.value;
                                setEditedGrades(prev => ({
                                    ...prev,
                                    [row.TempId]: {
                                        TempId: row.TempId,
                                        SubjId: row.SubjId,
                                        SubjGrade: val,
                                    },
                                }));
                            }}
                            autoFocus
                        />
                    );
                }

                return value || "—";
            },
        },
        {
            name: "Actions",
            cell: (row) => {
                const isEditing = editingRowId === row.TempId;

                return isEditing ? (
                    <button
                        className="text-blue-600 text-sm"
                        onClick={() => setEditingRowId(null)}
                    >
                        Done
                    </button>
                ) : (
                    <button
                        className="p-1 text-green-600 hover:text-green-800"
                        onClick={() => setEditingRowId(row.TempId)}
                    >
                        <Pencil size={18} />
                    </button>
                );
            },
            ignoreRowClick: true,
            button: true,
        }
    ];


    const buildPayload = () => {
        return Object.values(editedGrades).map(item => ({
            TempId: item.TempId,
            SubjId: item.SubjId,     // may be null for insert
            SubjGrade: item.SubjGrade,
            CreatedByUserId: currentUserId,
        }));
    };
    const Loader = () => (
        <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" >
                </circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" >
                </path>
            </svg>
        </div>
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openWarningModal = () => {
        setIsModalOpen(true);
    };

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleSubmit = async () => {
        const gpaPayload = buildPayload();
        if (gpaPayload.length === 0) {
            alert("No grades were edited.");
            return;
        };
        let status = "";
        console.log(table);
        if(table[0].SubjId != null){
            status = "edit";
        }
        else{
            status = "new";
        }

        let payload = {
            GpaTempId: table[0].GpaTempId,
            StudentId: studentId,
            Status: status,
            GpaChildDtos: gpaPayload,
        };
        console.log("FINAL PAYLOAD:", payload);
        const result = await dispatch(fetchInsertGpaTableData(payload));
        if (result.ok) {
            setIsModalOpen(false);
            setIsSuccessModalOpen(true);
            if(isSuccessModalOpen == false){
                 setTimeout(() => window.location.reload(), 3000);
            }
            // setEditingRowId(null);
            // setEditedGrades({});
        }
        else{
            alert("There is an error occured. Please contact the administrator.");
        }
    };

    return (
        <>
            <DataTable
                keyField="TempId"
                title={<div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-green-700">
                        Grade Point Average
                    </span>
                    <input type="text"
                        placeholder="Search..."
                        className="px-3 py-2 border rounded w-52 text-sm"
                        value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
                }
                columns={columns}
                // data={gpaTable.map((row, idx) => ({ // 
                //     ...row, //
                //     uniqueKey: ${ row.GpaTempId } - ${ row.SubjId || idx } // 
                //              }))}
                data={table}
                progressPending={loadingTable}
                progressComponent={<Loader />}
                noDataComponent={
                    <div className="py-10 text-center text-gray-500 font-medium">
                        No records found. Please check the template module if the template is disabled.
                    </div>}
                pagination
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                highlightOnHover
                striped
                responsive
            />
            <div className="flex justify-end mt-4">
                <GreenBtn label="Submit" onClick={openWarningModal} />
            </div> {/* {subjects.length > 0 && ( <div className="flex justify-end mt-4"> <GreenBtn label="Submit" onClick={openWarningModal} /> </div> )} */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    <span className="font-bold text-lg text-red-700">
                        Warning
                    </span>
                }
                body="Are you sure you want to continue?"
                buttons={[
                    {
                        label: "Yes",
                        type: "green",
                        onClick: handleSubmit
                    },
                    {
                        label: "No",
                        type: "red"
                    },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={
                    <span className="font-bold text-lg text-green-700">
                        Success
                    </span>
                }
                body="Grades have been successfully submitted!"
                buttons={[
                    {
                        label: "OK",
                        type: "green",
                        onClick: () => setIsSuccessModalOpen(false)
                    },
                ]}
            />
        </>
    );
};
export default GPATableComponent;
