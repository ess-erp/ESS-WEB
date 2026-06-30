import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Eye, Trash2, Plus, RotateCcw } from "lucide-react";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";
import {
    fetchSummarySheetTableData,
    fetchGenerateSummarySheetData,
} from "../../states/SruState/Action";
import {
    fetchDivisionData,
    fetchLevelData,
} from "../../states/AdmissionState/Action";

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
        dispatch(fetchDivisionData());
        dispatch(fetchLevelData());
    };

    // const handleSubmitViewModal = () => {
    //     console.log("test");
    //     let tempErrors = {};

    //     if (!tempName.trim()) {
    //         tempErrors.tempName = "Template name is required.";
    //     }
    // };

    const [divisionList, setDivisionList] = useState(null);
    const divisionState = useSelector((state) => state.admission.divisionState || {});
    const divisionData = divisionState.data || [];
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [levelList, setLevelList] = useState(null);
    const levelState = useSelector((state) => state.admission.levelState || {});
    const levelData = levelState.data || [];
    const [selectedLevel, setSelectedLevel] = useState(null);

    console.log(divisionData);

    useEffect(() => {
        if (divisionData && divisionData.length > 0) {
            const divisions = divisionData.map(item => ({
                value: item.DivId,
                label: item.DivName,
            }));

            setDivisionList([{ value: "ALL", label: "Select All" }, ...divisions]);
        } else {
            setDivisionList([]); 
        }

        if (levelData && levelData.length > 0) {
            const levels = levelData.map(item => ({
                value: item.LevelId,
                label: item.LevelName,
            }));

            setLevelList([{ value: "ALL", label: "Select All" }, ...levels]);
        } else {
            setLevelList([]); 
        }
    }, [divisionData, levelData]);

    const handleResetFilters = () => {
        setSelectedDivision(null);
        setSelectedLevel(null);
    };

    const handleGenerateTable = () => {
        console.log("test");

        console.log(selectedLevel);
        console.log(selectedDivision);


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
                            {/* Adjusted to a 5-column grid layout for finer alignment control */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

                                {/* Column 1 & 2: Division Select (Takes up 2/5 columns) */}
                                <div className="flex flex-col md:col-span-2">
                                    <SearchableSelect
                                        // If a Level is picked, we override options to an empty array so nothing can be picked
                                        options={selectedLevel ? [] : divisionList}
                                        value={selectedDivision}
                                        onChange={(selected) => {
                                            if (!selectedLevel) setSelectedDivision(selected);
                                        }}
                                        placeholder={selectedLevel ? "Locked (Level Selected)" : "-- Select Division --"}
                                        label="Select Division"
                                        isDisabled={!!selectedLevel} // Standard prop variation names just in case
                                        disabled={!!selectedLevel}
                                    />
                                </div>

                                {/* Column 3 & 4: Level Select (Takes up 2/5 columns) */}
                                <div className="flex flex-col md:col-span-2">
                                    <SearchableSelect
                                        // If a Division is picked, we override options to an empty array so nothing can be picked
                                        options={selectedDivision ? [] : levelList}
                                        value={selectedLevel}
                                        onChange={(selected) => {
                                            if (!selectedDivision) setSelectedLevel(selected);
                                        }}
                                        placeholder={selectedDivision ? "Locked (Division Selected)" : "-- Select Level --"}
                                        label="Select Level"
                                        isDisabled={!!selectedDivision} // Standard prop variation names just in case
                                        disabled={!!selectedDivision}
                                    />
                                </div>

                                {/* Column 5: Action Row containing smaller Generate and Reset buttons */}
                                <div className="flex gap-2 items-center justify-end md:col-span-1">
                                    <button
                                        type="button"
                                        onClick={handleGenerateTable}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 text-sm rounded h-[38px] transition-colors duration-200"
                                    >
                                        Generate
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-2.5 text-sm rounded h-[38px] transition-colors duration-200 border border-gray-300"
                                        title="Reset Filters"
                                    >
                                        <RotateCcw size={14} />
                                        <span>Reset</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                }
                size="w-[1000px]"
                maxHeight="100vh"
                buttons={[
                    // { label: "Submit", type: "green", onClick: handleSubmitViewModal, closeOnClick: false },
                    { label: "Cancel", type: "red", onClick: () => setViewModal(false) },
                ]}
            />
        </div>
    );
};

export default SummarySheetDataTable;