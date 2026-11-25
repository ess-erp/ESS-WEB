
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
    fetchDivisionData,
    fetchLevelData,
} from "../../states/OnlineApplicationState/Action";
// import {
//     fetchSectionListData,
// } from "../../states/AcademicState/Action";

// Pure function to get current school year
const getCurrentSchoolYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 0-indexed
    
    // If current month is June (6) or later, use current year, else use previous year
    if (currentMonth >= 6) {
        return `${currentYear}-${currentYear + 1}`;
    } else {
        return `${currentYear - 1}-${currentYear}`;
    }
};

// Pure function to generate school years from a start year up to the current year
const generateSchoolYears = (startYear = 2000) => {
    const currentYear = new Date().getFullYear();
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

const FILTER_BY_GRADES_LIST = [
    { value: "grades", label: "Grades" },
    { value: "ecqms", label: "ECQ-Ms" },
    { value: "all", label: "Select All" }
];

const GRADE_FORMAT_LIST = [
    { value: "numeric", label: "Numeric Grade" },
    { value: "letter", label: "Letter Grade" }
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
    
    // Generate summary sheet state (for PDF)
    const generateSummarySheetState = useSelector((state) => state.sru?.generateSummarySheetState || {});
    const pdfData = generateSummarySheetState.data?.PdfBase64 || null;
    const pdfLoading = generateSummarySheetState.loading || false;
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
    const [pdfModal, setPdfModal] = useState(false);

    // --- Filter Toggles ---
    const [enableDivision, setEnableDivision] = useState(true); // Always enabled by default
    const [enableLevel, setEnableLevel] = useState(false);
    const [enableSection, setEnableSection] = useState(false);
    const [enableSchoolYear, setEnableSchoolYear] = useState(true); // Always enabled by default
    const [enableTerm, setEnableTerm] = useState(false);
    const [enableFilterByGrades, setEnableFilterByGrades] = useState(false);
    const [enableGradeFormat, setEnableGradeFormat] = useState(false);

    // --- Selected Values ---
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState({ 
        value: getCurrentSchoolYear(), 
        label: getCurrentSchoolYear() 
    }); // Default to current SY
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [selectedFilterByGrades, setSelectedFilterByGrades] = useState(null);
    const [selectedGradeFormat, setSelectedGradeFormat] = useState(null);

    // Dynamic school year generator (memoized)
    const schoolYearList = useMemo(() => generateSchoolYears(2000), []);

    // Selectors
    const divisionData = useSelector((state) => state.online?.divisionState?.data || []);
    const levelData = useSelector((state) => state.online?.levelState?.data || []);

    // Option Lists
    const divisionList = useMemo(() => {
        if (!divisionData.length) return [];
        return divisionData.map(item => ({ value: item.DivId, label: item.DivName }));
    }, [divisionData]);

    const levelList = useMemo(() => {
        if (!levelData.length) return [];
        // Levels are already filtered by Division from the API call
        return levelData.map(item => ({ value: item.LevelId, label: item.LevelName }));
    }, [levelData]);

    // const sectionList = useMemo(() => {
    //     if (!sectionData.length) return [];
    //     return [{ value: "ALL", label: "Select All" }, ...sectionData.map(item => ({ value: item.SectionId, label: item.SectionName }))];
    // }, [sectionData]);

    const openRowModal = async (row) => {
        setPdfModal(true);

        // Use the existing Redux action to fetch the PDF
        const payload = {
            reportId: row.ReportId
        };

        await dispatch(fetchGenerateSummarySheetData(payload));
    };

    const openGenerateModal = () => {
        setViewModal(true);
        dispatch(fetchDivisionData());
        // Don't fetch level data yet - wait for division selection
    };

    const handleGenerateTable = async () => {
        const payload = {
            divId: selectedDivision?.value ?? 0,
            levelId: selectedLevel?.value ?? 0,
            schoolYear: selectedSchoolYear?.value ?? "",
            term: selectedTerm?.value ?? "",
            sectionId: selectedSection?.value ?? 0,
            filterByGrades: selectedFilterByGrades?.value ?? "",
            gradeFormat: selectedGradeFormat?.value ?? ""
        };

        console.log(payload);
        const result = await dispatch(fetchGenerateSummarySheetData(payload));
        
        if (result.ok) {
            // Close generate modal and open PDF modal
            setViewModal(false);
            setPdfModal(true);
            
            // Refresh the table list
            dispatch(fetchSummarySheetTableData(summarySheetCurrentPage, summarySheetRowsPerPage, summarySheetSearchFilter));
        }
    };

    const handleResetFilters = () => {
        setEnableDivision(true);
        setEnableLevel(false);
        setEnableSection(false);
        setEnableSchoolYear(true);
        setEnableTerm(false);
        setEnableFilterByGrades(false);
        setEnableGradeFormat(false);

        setSelectedDivision(null);
        setSelectedLevel(null);
        setSelectedSection(null);
        setSelectedSchoolYear({ value: getCurrentSchoolYear(), label: getCurrentSchoolYear() });
        setSelectedTerm(null);
        setSelectedFilterByGrades(null);
        setSelectedGradeFormat(null);
    };

    // Helper for placeholder state UI
    const getPlaceholder = (isEnabled, selectedVal, labelName) => {
        if (!isEnabled) return "Disabled";
        if (selectedVal?.value === "ALL") return "All Selected";
        return `-- Select ${labelName} --`;
    };
    const [sectionList, setSectionList] = useState(null);
    const [sectionLoaded, setSectionLoaded] = useState(false);
    // const handleLevelChange = async (data) => {
    //     const levelId = data?.value;

    //     console.log(levelId);
    //     // if (!levelId) {
    //     //     setSectionList([]); // Clear options if level is deselected
    //     //     return;
    //     // }
    //     const res = await dispatch(fetchSectionListByLevelIdData(levelId));

    //     if (res?.ok) {
    //         setSectionList(res.data || []);
    //         setSectionLoaded(true);
    //     } else {
    //         setSectionList([]);
    //     }
    // };

    // useEffect(() => {
    //     set
    // })
    const handleDivisionChange = async (divisionValue) => {
        setSelectedDivision(divisionValue);
        setSelectedLevel(null); // Reset level when division changes
        setSectionList([]);
        setSelectedSection(null);
        
        if (divisionValue && divisionValue.value) {
            // Fetch levels for the selected division
            await dispatch(fetchLevelData(divisionValue.value));
        }
    };

    const handleLevelChange = async (data) => {
        const levelId = data?.value;

        // Reset section selection when Level changes
        setSelectedSection(null);

        if (!levelId || levelId === "ALL") {
            setSectionList([]);
            setSectionLoaded(false);
            return;
        }

        const res = await dispatch(fetchSectionListByLevelIdData(levelId));
        console.log(res);
        if (res?.ok && Array.isArray(res.data)) {
            // Map raw backend keys (e.g., SectionId, SectionName) into { value, label }
            const formattedSections = [
                { value: "ALL", label: "Select All" },
                ...res.data.map((item) => ({
                    value: item.SectionId, // adjust key name if API differs (e.g., item.id)
                    label: item.SectionName, // adjust key name if API differs (e.g., item.name)
                }))
            ];

            setSectionList(formattedSections);
            setSectionLoaded(true);

        } else {
            setSectionList([]);
            setSectionLoaded(false);
        }
    };
    useEffect(() => {
        if (!enableLevel) {
            setSectionList([]);
            setSelectedSection(null);
            setSectionLoaded(false);
        }
    }, [enableLevel]);
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
                            {/* ROW 1: School Year, Division, Level */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                
                                {/* School Year Filter - Always enabled, default to current */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        School Year <span className="text-red-500">*</span>
                                    </label>
                                    <SearchableSelect
                                        options={schoolYearList}
                                        value={selectedSchoolYear}
                                        onChange={setSelectedSchoolYear}
                                        placeholder="Select School Year"
                                        isDisabled={false}
                                    />
                                </div>

                                {/* Division Filter - Always enabled */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Division <span className="text-red-500">*</span>
                                    </label>
                                    <SearchableSelect
                                        options={divisionList}
                                        value={selectedDivision}
                                        onChange={handleDivisionChange}
                                        placeholder="Select Division"
                                        isDisabled={false}
                                    />
                                </div>

                                {/* Level Filter - Populate based on Division */}
                                <div className="flex flex-col space-y-2">
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
                                            handleLevelChange(val);
                                        }}
                                        placeholder={getPlaceholder(enableLevel, selectedLevel, "Level")}
                                        isDisabled={!enableLevel || !selectedDivision}
                                    />
                                </div>
                            </div>

                            {/* ROW 2: Section, Filter By Grades, Grade Format */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                
                                {/* Section Filter */}
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
                                        <span>Filter by Section</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableSection ? sectionList : []}
                                        value={selectedSection}
                                        onChange={setSelectedSection}
                                        placeholder={getPlaceholder(enableSection, selectedSection, "Section")}
                                        isDisabled={!enableSection || !enableLevel}
                                    />
                                </div>

                                {/* Filter By Grades or ECQ-Ms */}
                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={enableFilterByGrades}
                                            onChange={(e) => {
                                                setEnableFilterByGrades(e.target.checked);
                                                if (!e.target.checked) setSelectedFilterByGrades(null);
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span>Filter by Grades or ECQ-Ms</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableFilterByGrades ? FILTER_BY_GRADES_LIST : []}
                                        value={selectedFilterByGrades}
                                        onChange={setSelectedFilterByGrades}
                                        placeholder={getPlaceholder(enableFilterByGrades, selectedFilterByGrades, "Filter Type")}
                                        isDisabled={!enableFilterByGrades}
                                    />
                                </div>

                                {/* Grade Format - Numeric or Letter */}
                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={enableGradeFormat}
                                            onChange={(e) => {
                                                setEnableGradeFormat(e.target.checked);
                                                if (!e.target.checked) setSelectedGradeFormat(null);
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span>Filter by Grade Format</span>
                                    </label>
                                    <SearchableSelect
                                        options={enableGradeFormat ? GRADE_FORMAT_LIST : []}
                                        value={selectedGradeFormat}
                                        onChange={setSelectedGradeFormat}
                                        placeholder={getPlaceholder(enableGradeFormat, selectedGradeFormat, "Grade Format")}
                                        isDisabled={!enableGradeFormat}
                                    />
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

            {/* PDF Viewer Modal */}
            <ModalComponent
                isOpen={pdfModal}
                onClose={() => {
                    setPdfModal(false);
                }}
                title="Summary Sheet Report PDF"
                body={
                    <div className="mt-4">
                        {pdfLoading ? (
                            <div className="flex items-center justify-center h-[600px]">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading PDF...</p>
                                </div>
                            </div>
                        ) : pdfData ? (
                            <div className="border border-gray-300 rounded">
                                <iframe
                                    src={`data:application/pdf;base64,${pdfData}`}
                                    className="w-full h-[600px]"
                                    title="Summary Sheet PDF"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[600px]">
                                <p className="text-gray-500">No PDF data available</p>
                            </div>
                        )}
                    </div>
                }
                size="w-[1200px]"
                maxHeight="100vh"
                buttons={[
                    pdfData && {
                        label: "Download",
                        type: "blue",
                        onClick: () => {
                            const link = document.createElement('a');
                            link.href = `data:application/pdf;base64,${pdfData}`;
                            link.download = `Summary_Sheet_${new Date().getTime()}.pdf`;
                            link.click();
                        },
                        closeOnClick: false
                    },
                    { label: "Close", type: "red", onClick: () => setPdfModal(false) },
                ].filter(Boolean)}
            />
        </div>
    );
};

export default SummarySheetDataTable;