import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import { Eye } from "lucide-react";
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
import {
    fetchSectionListData,
} from "../../states/AcademicState/Action";

const SummarySheetDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;

    // --- Table Data & State ---
    const [summarySheetList, setSummarySheetList] = useState([]);
    const summarySheetTableState = useSelector((state) => state.sru?.summarySheetTableState || {});
    const summarySheetTable = summarySheetTableState.data?.data || [];
    const summarySheetTotalRows = summarySheetTableState.data?.totalRecords || 0;
    const summarySheetLoading = summarySheetTableState.loading || false;
    const [summarySheetCurrentPage, setSummarySheetCurrentPage] = useState(1);
    const [summarySheetRowsPerPage, setSummarySheetRowsPerPage] = useState(10);
    const [summarySheetSearchFilter, setSummarySheetFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchSummarySheetTableData(summarySheetCurrentPage, summarySheetRowsPerPage, summarySheetSearchFilter));
    }, [summarySheetCurrentPage, summarySheetRowsPerPage, summarySheetSearchFilter, dispatch]);

    useEffect(() => {
        if (summarySheetTable.length > 0) {
            setSummarySheetList(summarySheetTable);
        }
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
    const [reportId, setReportId] = useState(0);

    const [enableDivision, setEnableDivision] = useState(false);
    const [enableLevel, setEnableLevel] = useState(false);
    const [enableSection, setEnableSection] = useState(false);
    const [enableSchoolYear, setEnableSchoolYear] = useState(false);
    const [enableTerm, setEnableTerm] = useState(false);

    const [divisionList, setDivisionList] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState(null);

    const [levelList, setLevelList] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);

    const [sectionList, setSectionList] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);

    const [schoolYearList, setSchoolYearList] = useState([]);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);

    const [termList, setTermList] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState(null);

    const isAllSelected =
        selectedSchoolYear?.value === "ALL" ||
        selectedTerm?.value === "ALL" ||
        selectedDivision?.value === "ALL" ||
        selectedLevel?.value === "ALL" ||
        selectedSection?.value === "ALL";

    const divisionData = useSelector((state) => state.admission?.divisionState?.data || []);
    const levelData = useSelector((state) => state.admission?.levelState?.data || []);
    const sectionData = useSelector((state) => state.academic?.sectionListState?.data || []);

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

        if (sectionData && sectionData.length > 0) {
            const sections = sectionData.map(item => ({
                value: item.SectionId,
                label: item.SectionName,
            }));
            setSectionList([{ value: "ALL", label: "Select All" }, ...sections]);
        } else {
            setSectionList([]);
        }
    }, [divisionData, levelData, sectionData]);

    const openRowModal = (data) => {
        setViewModal(true);
        dispatch(fetchDivisionData());
        dispatch(fetchLevelData());
        dispatch(fetchSectionListData());
        setReportId(data?.ReportId);
    };

    const openGenerateModal = () => {
        setViewModal(true);
        dispatch(fetchDivisionData());
        dispatch(fetchLevelData());
        dispatch(fetchSectionListData());
    };

    const handleGenerateTable = async () => {
        const divId = selectedDivision?.value ?? 0;
        const levelId = selectedLevel?.value ?? 0;
        // await dispatch(fetchGenerateSummarySheetData(divId, levelId));
    };

    const handleResetFilters = () => {
        setEnableDivision(false);
        setEnableLevel(false);
        setEnableSection(false);
        setEnableSchoolYear(false);
        setEnableTerm(false);

        setSelectedDivision(null);
        setSelectedLevel(null);
        setSelectedSection(null);
        setSelectedSchoolYear(null);
        setSelectedTerm(null);
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
                        <OutlineBlueBtn
                            label="Generate Summary Sheet"
                            onClick={openGenerateModal}
                        />
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
                        <div className="space-y-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={enableSchoolYear}
                                            onChange={(e) => {
                                                setEnableSchoolYear(e.target.checked);
                                                if (!e.target.checked) setSelectedSchoolYear(null);
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span>Filter by School Year</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableSchoolYear ? schoolYearList : []}
                                        value={selectedSchoolYear}
                                        onChange={setSelectedSchoolYear}
                                        placeholder={
                                            !enableSchoolYear
                                                ? "Disabled"
                                                : isAllSelected && selectedSchoolYear?.value !== "ALL"
                                                    ? "Locked (Select All active)"
                                                    : "-- Select School Year --"
                                        }
                                        isDisabled={!enableSchoolYear || (isAllSelected && selectedSchoolYear?.value !== "ALL")}
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={enableTerm}
                                            onChange={(e) => {
                                                setEnableTerm(e.target.checked);
                                                if (!e.target.checked) setSelectedTerm(null);
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span>Filter by Term</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableTerm ? termList : []}
                                        value={selectedTerm}
                                        onChange={setSelectedTerm}
                                        placeholder={
                                            !enableTerm
                                                ? "Disabled"
                                                : isAllSelected && selectedTerm?.value !== "ALL"
                                                    ? "Locked (Select All active)"
                                                    : "-- Select Term --"
                                        }
                                        isDisabled={!enableTerm || (isAllSelected && selectedTerm?.value !== "ALL")}
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={enableDivision}
                                            onChange={(e) => {
                                                setEnableDivision(e.target.checked);
                                                if (!e.target.checked) setSelectedDivision(null);
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span>Filter by Division</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableDivision ? divisionList : []}
                                        value={selectedDivision}
                                        onChange={setSelectedDivision}
                                        placeholder={
                                            !enableDivision
                                                ? "Disabled"
                                                : isAllSelected && selectedDivision?.value !== "ALL"
                                                    ? "Locked (Select All active)"
                                                    : "-- Select Division --"
                                        }
                                        isDisabled={!enableDivision || (isAllSelected && selectedDivision?.value !== "ALL")}
                                    />
                                </div>

                                <div className="md:col-span-3 flex flex-col md:flex-row justify-center gap-6">

                                    <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={enableLevel}
                                                onChange={(e) => {
                                                    setEnableLevel(e.target.checked);
                                                    if (!e.target.checked) setSelectedLevel(null);
                                                }}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span>Filter by Level</span>
                                        </label>
                                        <SearchableSelect
                                            options={enableLevel ? levelList : []}
                                            value={selectedLevel}
                                            onChange={setSelectedLevel}
                                            placeholder={
                                                !enableLevel
                                                    ? "Disabled"
                                                    : isAllSelected && selectedLevel?.value !== "ALL"
                                                        ? "Locked (Select All active)"
                                                        : "-- Select Level --"
                                            }
                                            isDisabled={!enableLevel || (isAllSelected && selectedLevel?.value !== "ALL")}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={enableSection}
                                                onChange={(e) => {
                                                    setEnableSection(e.target.checked);
                                                    if (!e.target.checked) setSelectedSection(null);
                                                }}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span>Filter by Section</span>
                                        </label>
                                        <SearchableSelect
                                            options={enableSection ? sectionList : []}
                                            value={selectedSection}
                                            onChange={setSelectedSection}
                                            placeholder={
                                                !enableSection
                                                    ? "Disabled"
                                                    : isAllSelected && selectedSection?.value !== "ALL"
                                                        ? "Locked (Select All active)"
                                                        : "-- Select Section --"
                                            }
                                            isDisabled={!enableSection || (isAllSelected && selectedSection?.value !== "ALL")}
                                        />
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                }
                size="w-[1000px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Generate", type: "green", onClick: handleGenerateTable, closeOnClick: false },
                    { label: "Reset", type: "blue", onClick: handleResetFilters, closeOnClick: false },
                    { label: "Cancel", type: "red", onClick: () => setViewModal(false) },
                ]}
            />
        </div>
    );
};

export default SummarySheetDataTable;