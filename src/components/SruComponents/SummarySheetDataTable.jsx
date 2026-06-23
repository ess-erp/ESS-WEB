import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";
import {
    fetchSummarySheetTableData,
} from "../../states/SruState/Action";

const SummarySheetDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;

    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;
    const [summarySheetList, setSummarySheetList] = useState([]);
    const summarySheetTableState = useSelector((state) => state.sru.summarySheetTableState || {});
    const summarySheetTable = summarySheetTableState.data.data || [];
    const summarySheetTotalRows = summarySheetTableState.data.totalRecords || 0;
    const summarySheetLoading = summarySheetTableState.loading || false;
    const [summarySheetCurrentPage, setSummarySheetCurrentPage] = useState(1);
    const [summarySheetRowsPerPage, setSummarySheetRowsPerPage] = useState(10);
    const [summarySheetSearchFilter, setSummarySheetFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchSummarySheetTableData(summarySheetCurrentPage, summarySheetRowsPerPage, summarySheetSearchFilter));
    }, [summarySheetCurrentPage, summarySheetRowsPerPage, summarySheetSearchFilter, dispatch]);

    useEffect(() => {
        if (summarySheetTable.length === 0) return;
        setSummarySheetList(summarySheetTable);
    }, [summarySheetTable]);

    const summarySheetColumn = [
        { name: 'Campus', selector: row => row.CampusName, sortable: true },
        { name: 'Term Available', selector: row => row.TermActivated, sortable: true },
        { name: 'School Year', selector: row => row.Remarks, sortable: true },
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
    const [viewModal, setViewModal] = useState(false);
    const [errors, setErrors] = useState({});

    const openRowModal = (data, status) => {
        console.log(data);
        setViewModal(true);
    };

    const handleSubmitViewModal = () => {
        console.log("test");
        let tempErrors = {};

        if (!tempName.trim()) {
            tempErrors.tempName = "Template name is required.";
        }
    };

    return (
        <div>
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-white rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            Summary Sheet List
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* <OutlineBlueBtn
                            label="Add new"
                            onClick={openAddNewModal}
                        /> */}
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-64"
                            value={summarySheetSearchFilter}
                            onChange={(e) => {
                                setSummarySheetFilterText(e.target.value);
                                setSummarySheetCurrentPage(1);
                            }}
                        />
                    </div>

                </div>
                <div className="w-full">
                    <DataTable
                        columns={summarySheetColumn}
                        data={summarySheetList}
                        progressPending={summarySheetLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={summarySheetTotalRows}
                        paginationDefaultPage={summarySheetCurrentPage}
                        onChangePage={(page) => setSummarySheetCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setSummarySheetRowsPerPage(newPerPage);
                            setSummarySheetCurrentPage(page);
                        }}
                        highlightOnHover
                        responsive
                    />
                </div>
            </div>
            <ModalComponent
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title="Generate Summary Sheet Report"
                body={
                    <div className="mt-6 relative overflow-hidden max-h-[75vh] overflow-y-auto px-1">

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col">
                                    {/* <SearchableSelect
                                        options={campusList}
                                        value={selectedCampus}
                                        onChange={(selected) => {
                                            setSelectedCampus(selected);
                                            if (errors.campus) setErrors(prev => ({ ...prev, campus: null }));
                                        }}
                                        placeholder="-- Select Campus --"
                                        label="Select Campus"
                                    /> */}
                                    {errors.campus && <span className="text-xs text-red-500 mt-1 font-medium">{errors.campus}</span>}
                                </div>


                            </div>
                        </div>


                    </div>
                }
                size="w-[1000px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmitViewModal, closeOnClick: false },
                    { label: "Cancel", type: "red", onClick: () => setViewModal(false) },
                ]}
            />
        </div>
    );
};

export default SummarySheetDataTable;