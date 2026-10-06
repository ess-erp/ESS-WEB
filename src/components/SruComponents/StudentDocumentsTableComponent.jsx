import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { fetchStudentDocumentsListData } from "../../states/SruState/Action";

const StudentDocumentsTableComponent = ({ studentId }) => {
    const dispatch = useDispatch();
    const formatDate = getFormatDate;

    // State for documents data from Redux
    const documentsState = useSelector((state) => state.sru.studentDocumentsListState || {});
    const documentsData = documentsState.data?.data || [];
    const totalRows = documentsState.data?.totalRecords || 0;
    const isLoading = documentsState.loading || false;

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchFilter, setSearchFilter] = useState("");

    useEffect(() => {
        if (!studentId) return;
        
        dispatch(fetchStudentDocumentsListData(studentId, currentPage, rowsPerPage, searchFilter));
    }, [studentId, currentPage, rowsPerPage, searchFilter, dispatch]);

    const columns = [
        {
            name: 'Document Name',
            selector: row => row.DocumentName,
            sortable: true,
            grow: 2
        },
        {
            name: 'Document Type',
            selector: row => row.DocumentType,
            sortable: true,
            grow: 1
        },
        {
            name: 'Status',
            selector: row => row.Status,
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.Status === "Submitted" || row.Status === "Verified" ? (
                        <CheckCircle size={16} className="text-green-500" />
                    ) : (
                        <XCircle size={16} className="text-yellow-500" />
                    )}
                    <span className={`
                        ${row.Status === "Submitted" ? "text-green-700" : ""}
                        ${row.Status === "Pending" ? "text-yellow-700" : ""}
                        ${row.Status === "Missing" ? "text-red-700" : ""}
                    `}>
                        {row.Status}
                    </span>
                </div>
            ),
            grow: 1
        },
        {
            name: 'Date Submitted',
            selector: row => formatDate(row.DateSubmitted),
            sortable: true,
            grow: 1
        },
        {
            name: 'Remarks',
            selector: row => row.Remarks,
            sortable: true,
            grow: 2
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2 items-center">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleView(row)}
                        title="View Document"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "100px",
        }
    ];

    const handleView = (row) => {
        console.log("View document:", row);
        // TODO: Implement view document logic
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-green-600">
                        Documents / Requirements List
                    </h3>
                    <p className="text-xs text-gray-600">
                        List of documents submitted by the student
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="px-3 py-2 border border-gray-300 rounded w-64"
                        value={searchFilter}
                        onChange={(e) => {
                            setSearchFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="p-4">
                <DataTable
                    columns={columns}
                    data={documentsData}
                    progressPending={isLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationDefaultPage={currentPage}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setRowsPerPage(newPerPage);
                        setCurrentPage(page);
                    }}
                    highlightOnHover
                    responsive
                />
            </div>
        </div>
    );
};

export default StudentDocumentsTableComponent;
