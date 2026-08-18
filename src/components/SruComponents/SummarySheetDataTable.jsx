
import { useEffect, useState, useMemo } from "react";
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
    fetchSectionListByLevelIdData,
} from "../../states/SruState/Action";
import {
    // fetchDivisionData,
    fetchLevelData,
} from "../../states/AdmissionState/Action";
// import {
//     fetchSectionListData,
// } from "../../states/AcademicState/Action";

// Pure function to generate school years from a start year up to the current year
const generateSchoolYears = (startYear = 2000) => {
    const currentYear = new Date().getFullYear();
    // const options = [{ value: "ALL", label: "All School Years" }];
    const options = [];

    for (let year = currentYear; year >= startYear; year--) {
        const nextYear = year + 1;
        options.push({
            value: `${year}-${nextYear}`,
            label: `${year} - ${nextYear}`
        });
    }

    return options;
};

// Static options outside component to avoid redundant object re-creations
const TERM_LIST = [
    { value: "ALL", label: "Select All" },
    { value: "Term1", label: "1st Term" },
    { value: "Term2", label: "2nd Term" },
    { value: "Term3", label: "3rd Term" },
    { value: "Final", label: "Final Term" }
];

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

    const [viewModal, setViewModal] = useState(false);
    // const [reportId, setReportId] = useState(0);

    // --- Filter Toggles ---
    const [enableDivision, setEnableDivision] = useState(false);
    const [enableLevel, setEnableLevel] = useState(false);
    const [enableSection, setEnableSection] = useState(false);
    const [enableSchoolYear, setEnableSchoolYear] = useState(false);
    const [enableTerm, setEnableTerm] = useState(false);

    // --- Selected Values ---
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);

    // Dynamic school year generator (memoized)
    const schoolYearList = useMemo(() => generateSchoolYears(2000), []);

    // Selectors
    // const divisionData = useSelector((state) => state.admission?.divisionState?.data || []);
    const levelData = useSelector((state) => state.admission?.levelState?.data || []);
    // const sectionData = useSelector((state) => state.academic?.sectionListState?.data || []);

    // Option Lists
    // const divisionList = useMemo(() => {
    //     if (!divisionData.length) return [];
    //     return [{ value: "ALL", label: "Select All" }, ...divisionData.map(item => ({ value: item.DivId, label: item.DivName }))];
    // }, [divisionData]);

    const levelList = useMemo(() => {
        if (!levelData.length) return [];
        return [{ value: "ALL", label: "Select All" }, ...levelData.map(item => ({ value: item.LevelId, label: item.LevelName }))];
    }, [levelData]);

    // const sectionList = useMemo(() => {
    //     if (!sectionData.length) return [];
    //     return [{ value: "ALL", label: "Select All" }, ...sectionData.map(item => ({ value: item.SectionId, label: item.SectionName }))];
    // }, [sectionData]);

    const openRowModal = (data) => {
        setViewModal(true);
        dispatch(fetchDivisionData());
        dispatch(fetchLevelData());
        dispatch(fetchSectionListData());
        setReportId(data?.ReportId);
    };

    const openGenerateModal = () => {
        setViewModal(true);
        // dispatch(fetchDivisionData());
        dispatch(fetchLevelData());
        // dispatch(fetchSectionListData());
    };

    const handleGenerateTable = async () => {

        const payload = {
            divId: selectedDivision?.value ?? 0,
            levelId: selectedLevel?.value ?? 0,
            schoolYear: selectedSchoolYear?.value ?? "",
            term: selectedTerm?.value ?? "",
            sectionId: selectedSection?.value ?? 0
        };

        console.log(payload);
        await dispatch(fetchGenerateSummarySheetData(payload));
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

    // Helper for placeholder state UI
    const getPlaceholder = (isEnabled, selectedVal, labelName) => {
        if (!isEnabled) return "Disabled";
        if (selectedVal?.value === "ALL") return "All Selected";
        return `-- Select ${labelName} --`;
    };
    const [sectionList, setSectionList] = useState(null);
    const handleLevelChange = async (data) => {
        const levelId = data?.value;

        // if (!levelId) {
        //     setSectionList([]); // Clear options if level is deselected
        //     return;
        // }
        const res = await dispatch(fetchSectionListByLevelIdData(data?.value));

        if (res?.ok) {
            setSectionList(res.data || []);
        } else {
            setSectionList([]);
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

                                {/* School Year Filter */}
                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={enableSchoolYear}
                                            onChange={(e) => {
                                                setEnableSchoolYear(e.target.checked);
                                                if (!e.target.checked) setSelectedSchoolYear(null);
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span>Filter by School Year</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableSchoolYear ? schoolYearList : []}
                                        value={selectedSchoolYear}
                                        onChange={setSelectedSchoolYear}
                                        placeholder={getPlaceholder(enableSchoolYear, selectedSchoolYear, "School Year")}
                                        isDisabled={!enableSchoolYear}
                                    />
                                </div>

                                {/* Term Filter */}
                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={enableTerm}
                                            onChange={(e) => {
                                                setEnableTerm(e.target.checked);
                                                if (!e.target.checked) setSelectedTerm(null);
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span>Filter by Term</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableTerm ? TERM_LIST : []}
                                        value={selectedTerm}
                                        onChange={setSelectedTerm}
                                        placeholder={getPlaceholder(enableTerm, selectedTerm, "Term")}
                                        isDisabled={!enableTerm}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={enableSection}
                                            onChange={(e) => {
                                                setEnableSection(e.target.checked);
                                                if (!e.target.checked) setSelectedSection(null);
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span>Filter by Grades or ECQ-MS</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableSection ? sectionList : []}
                                        value={selectedSection}
                                        onChange={setSelectedSection}
                                        placeholder={getPlaceholder(enableSection, selectedSection, "Section")}
                                        isDisabled={!enableSection}
                                    />
                                </div>
                                {/* Division Filter */}
                                {/* <div className="flex flex-col space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={enableDivision}
                                            onChange={(e) => {
                                                setEnableDivision(e.target.checked);
                                                if (!e.target.checked) setSelectedDivision(null);
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span>Filter by Division</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableDivision ? divisionList : []}
                                        value={selectedDivision}
                                        onChange={setSelectedDivision}
                                        placeholder={getPlaceholder(enableDivision, selectedDivision, "Division")}
                                        isDisabled={!enableDivision}
                                    />
                                </div> */}

                                <div className="md:col-span-3 flex flex-col md:flex-row justify-center gap-6">

                                    {/* Level Filter */}
                                    <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={enableLevel}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    setEnableLevel(isChecked);
                                                    if (!isChecked) {
                                                        setSelectedLevel(null);
                                                    }
                                                    handleChangeSection();
                                                }}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span>Filter by Level</span>
                                        </label>

                                        <SearchableSelect
                                            options={enableLevel ? levelList : []}
                                            value={selectedLevel}
                                            onChange={(val) => {
                                                setSelectedLevel(val);
                                                handleLevelChange(val); // Pass the selected Level ID to your function
                                            }}
                                            placeholder={getPlaceholder(enableLevel, selectedLevel, "Level")}
                                            isDisabled={!enableLevel}
                                        />
                                    </div>
                                    {/* Section Filter */}
                                    <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={enableSection}
                                                onChange={(e) => {
                                                    setEnableSection(e.target.checked);
                                                    if (!e.target.checked) setSelectedSection(null);
                                                }}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span>Filter by Section</span>
                                        </label>
                                        <SearchableSelect
                                            options={enableSection ? sectionList : []}
                                            value={selectedSection}
                                            onChange={setSelectedSection}
                                            placeholder={getPlaceholder(enableSection, selectedSection, "Section")}
                                            isDisabled={!enableSection}
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