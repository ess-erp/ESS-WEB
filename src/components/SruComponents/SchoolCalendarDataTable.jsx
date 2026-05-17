import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import {
    fetchListOfSectionUserData,
    fetchTeacherSubjectLoadData,
    fetchListOfStudentPerTermData,
} from "../../states/TeacherState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";

const SchoolCalendarDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;

    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;
    const [sectionList, setSectionList] = useState([]);
    const sectionTableState = useSelector((state) => state.teacher.sectionTableList || {});
    const sectionTable = sectionTableState.data.data || [];
    const sectionTotalRows = sectionTableState.data.totalRecords || 0;
    const sectionLoading = sectionTableState.loading || false;
    const [sectionCurrentPage, setSectionTableCurrentPage] = useState(1);
    const [sectionRowsPerPage, setSectionTableRowsPerPage] = useState(10);
    const [sectionTableSearchFilter, setSectionTableFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchListOfSectionUserData(userId, sectionCurrentPage, sectionRowsPerPage, sectionTableSearchFilter));
    }, [userId, sectionCurrentPage, sectionRowsPerPage, sectionTableSearchFilter, dispatch]);

    useEffect(() => {
        if (sectionTable.length === 0) return;
        setSectionList(sectionTable);
    }, [sectionTable]);

    const sectionColumn = [
        { name: 'Section Name', selector: row => row.SectionName, sortable: true },
        { name: 'Number of Subject', selector: row => row.NumberOfSubject, sortable: true },
        { name: 'Number of Student', selector: row => row.NumberOfStudent, sortable: true },
        { name: 'Date Created', selector: row => formatDate(row.DateCreated), sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-4 items-center">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => openRowModal(row, "view")}
                    >
                        <Eye size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "180px",
        }
    ];

    const [rowModalOpen, setRowModalOpen] = useState(false);
    const openAddNewModal = () => {
        console.log("test");
    };

    return (
        <div>
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-white rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            Section Master List
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
                            value={sectionTableSearchFilter}
                            onChange={(e) => {
                                setSectionTableFilterText(e.target.value);
                                setSectionTableCurrentPage(1);
                            }}
                        />
                    </div>

                </div>
                <div className="w-full">
                    <DataTable
                        columns={sectionColumn}
                        data={sectionList}
                        progressPending={sectionLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={sectionTotalRows}
                        paginationDefaultPage={sectionCurrentPage}
                        onChangePage={(page) => setSectionTableCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setSectionTableRowsPerPage(newPerPage);
                            setSectionTableCurrentPage(page);
                        }}
                        highlightOnHover
                        responsive
                    />
                </div>
            </div>
        </div >
    );
};

export default SchoolCalendarDataTable;