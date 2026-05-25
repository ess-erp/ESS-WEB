
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchEnrollmentHistoryTableData,
} from "../../states/SruState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";

const EnrollmentHistoryComponent = ({studentId}) => {
    const dispatch = useDispatch();
    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;
    const [enrollmentList, setEnrollmentList] = useState([]);
    const enrollmentTableState = useSelector((state) => state.sru.enrollmentHistoryTableState || {});
    const enrollmentTable = enrollmentTableState.data.data || [];
    const enrollmentTotalRows = enrollmentTableState.data.totalRecords || 0;
    const enrollmentLoading = enrollmentTableState.loading || false;
    const [enrollmentCurrentPage, setEnrollmentTableCurrentPage] = useState(1);
    const [enrollmentRowsPerPage, setEnrollmentTableRowsPerPage] = useState(10);
    const [enrollmentTableSearchFilter, setEnrollmentTableFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchEnrollmentHistoryTableData(studentId, enrollmentCurrentPage, enrollmentRowsPerPage, enrollmentTableSearchFilter));
    }, [studentId, enrollmentCurrentPage, enrollmentRowsPerPage, enrollmentTableSearchFilter, dispatch]);

    useEffect(() => {
        if (enrollmentTable.length === 0) return;
        setEnrollmentList(enrollmentTable);
    }, [enrollmentTable]);

    const column = [
        { name: 'Adviser Fullname', selector: row => row.AdviserFullname, sortable: true },
        { name: 'Section Name', selector: row => row.SectionName, sortable: true },
        { name: 'Level', selector: row => row.LevelName, sortable: true },
        { name: 'School Year', selector: row => row.SchoolYear, sortable: true },
        { name: 'Date Enrolled', selector: row => formatDate(row.DateEnrolled), sortable: true },
        { name: 'Campus', selector: row => row.CampusName, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-4 items-center">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => openRowModal(row)}
                    >
                        <Eye size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "180px",
        }
    ];

    const openRowModal = (data) => {
        console.log(data);
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">

            <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-green-600">
                        Enrollment History
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-3 py-2 border border-gray-300 rounded w-64"
                        value={enrollmentTableSearchFilter}
                        onChange={(e) => {
                            setEnrollmentTableFilterText(e.target.value);
                            setEnrollmentTableCurrentPage(1);
                        }}
                    />
                </div>

            </div>
            <div className="w-full">
                <DataTable
                    columns={column}
                    data={enrollmentList}
                    progressPending={enrollmentLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={enrollmentTotalRows}
                    paginationDefaultPage={enrollmentCurrentPage}
                    onChangePage={(page) => setEnrollmentTableCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setEnrollmentTableCurrentPage(page);
                        setEnrollmentTableRowsPerPage(newPerPage);
                    }}
                    highlightOnHover
                    responsive
                />
            </div>

        </div>
    );
};
export default EnrollmentHistoryComponent;