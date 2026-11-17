import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import SchoolYearDropdown from "../ButtonsComponents/SchoolYearDropdown";
import { Pencil, Eye, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import {
    fetchCurriculumAndNonCurriculumSubjectData,
    // fetchSectionListData,
    // fetchInsertSubjectScheduleData,
    // fetchSubjectScheduleTableData,
    fetchMasterSubjectScheduleTableData,
    fetchInsertCurriculumPerLevelData,
    fetchCurriculumPerLevelData,
    // fetchSectionPerLevelData,
} from "../../states/AcademicState/Action";
import {
    fetchLevelData,
} from "../../states/AdmissionState/Action";
import "../../states/OnlineApplicationState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";
import { fetchCampusData } from "../../states/OnlineApplicationState/Action";


const CurriculumComponent = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;

    const [subjectScheduleList, setSubjectScheduleList] = useState([]);
    const subjectScheduleState = useSelector((state) => state.academic.curriculumPerLevelState || {});
    const subjectScheduleTable = subjectScheduleState.data.data || [];
    const subjectScheduleTotalRows = subjectScheduleState.data.totalRecords || 0;
    const subjectScheduleLoading = subjectScheduleState.loading || false;
    const [subjectScheduleFilterText, setSubjectSchedulelFilterText] = useState('');
    const [subjectScheduleCurrentPage, setSubjectScheduleCurrentPage] = useState(1);
    const [subjectScheduleRowsPerPage, setSubjectScheduleRowsPerPage] = useState(10);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('');

    useEffect(() => {
        dispatch(fetchCurriculumPerLevelData(
            subjectScheduleCurrentPage, 
            subjectScheduleRowsPerPage, 
            subjectScheduleFilterText,
            selectedSchoolYear
        ));
    }, [subjectScheduleCurrentPage, subjectScheduleRowsPerPage, subjectScheduleFilterText, selectedSchoolYear, dispatch]);

    useEffect(() => {
        if (subjectScheduleTable.length === 0) return;
        setSubjectScheduleList(subjectScheduleTable);
    }, [subjectScheduleTable]);

    console.log(subjectScheduleTable);


    const subjectScheduleColumn = [
        { name: 'Name of Template', selector: row => row.TempName, sortable: true },
        { name: 'Year Level', selector: row => row.LevelName, sortable: true },
        { name: 'Campus', selector: row => row.CampusName, sortable: true },
        { name: 'School Year', selector: row => row.SchoolYear, sortable: true },
        { name: 'Number of Subjects', selector: row => row.NumberOfSubjects, sortable: true },
        { name: 'Date Created', selector: row => row.DateCreated, sortable: true },
        {
            name: "Action",
            cell: row => (
                <div className="flex gap-4 items-center">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => openRowModal(row, "view")}
                    >
                        <Eye size={18} />
                    </button>

                    <button
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        onClick={() => openRowModal(row, "edit")}
                    >
                        <Pencil size={18} />
                    </button>

                    {/* <RowToggleComponent row={row} onToggle={handleToggleActive} /> */}
                </div>

            )
        }
    ];


    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const [addNewModal, setAddNewModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generalOfferedSubject, setInactiveGeneralOfferedSubject] = useState([]);
    const generalOfferedSubjectState = useSelector((state) => state.academic.curriculumAndNonCurriculumSubjectState || {});
    // const generealOfferedTable = generalOfferedSubjectState.data.data || [];
    const generealOfferedTotalRows = generalOfferedSubjectState.data.totalRecords || 0;
    const generealOfferedLoading = generalOfferedSubjectState.loading || false;
    const [generalOfferedFilterText, setGeneralOfferedFilterText] = useState('');
    const [generalOfferedCurrentPage, setGeneralOfferedCurrentPage] = useState(1);
    const [generalOfferedRowsPerPage, setGeneralOfferedRowsPerPage] = useState(10);
    // const [sectionList, setSectionList] = useState([]);
    // const sectionListState = useSelector((state) => state.academic.sectionPerLevelState || {});
    // const sectionData = sectionListState.data || [];
    // const [selectedSection, setSelectedSection] = useState(null);
    const [campusList, setCampusList] = useState([]);
    const campusState = useSelector((state) => state.online.campusState || {});
    const campusData = campusState.data || [];
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [levelList, setLevelList] = useState([]);
    const levelState = useSelector((state) => state.admission.levelState || {});
    const levelData = levelState.data || [];
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [tempName, setTempName] = useState("");

    const openAddNewModal = async () => {
        setAddNewModal(true);
        const res = await dispatch(fetchCurriculumAndNonCurriculumSubjectData(generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText));
        console.log(res);
        if (res.ok) {
            setInactiveGeneralOfferedSubject(res.data);
        }
    };

    useEffect(() => {
        // dispatch(fetchSectionListData());
        dispatch(fetchLevelData());
        dispatch(fetchCampusData());
    }, [dispatch]);

    // const handleSetSection = async (data) => {
    //     console.log(data);
    //     const res = await dispatch(fetchSectionPerLevelData(data?.value));
    //     if(res.ok){
    //         setSectionList(
    //             res.data.map(item => ({
    //                 value: item.SectionId,
    //                 label: item.SectionName,
    //             }))
    //         );
    //     }
    // };

    useEffect(() => {
        // if (!Array.isArray(sectionData) || sectionData.length === 0 || !Array.isArray(levelData) || levelData.length == 0) return;

        // setSectionList(
        //     sectionData.map(item => ({
        //         value: item.SecId,
        //         label: item.SectionName,
        //         levelName: item.LevelName,
        //     }))
        // );
        if (!Array.isArray(levelData) || levelData.length == 0 || !Array.isArray(campusData) || campusData.length == 0) return;

        setLevelList(
            levelData.map(item => ({
                value: item.LevelId,
                label: item.LevelName,
            }))
        );

        setCampusList(
            campusData.map(item => ({
                value: item.CampusId,
                label: item.CampusName,
            }))
        );
    }, [levelData, campusData]);

    const subjectColumns = [
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true, grow: 2 },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true, grow: 3 },
        { name: 'Subject Type', selector: row => row.SubjectType, sortable: true, grow: 2 },
        { name: 'Subject Unit', selector: row => row.SubjectUnit, sortable: true, grow: 1 },
        {
            name: "Action",
            cell: row => (
                <button
                    onClick={() => handleAddSubject(row)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                    <Plus size={16} />
                </button>
            ),
            grow: 1
        }
    ];

    // Expandable component for sub-subjects in Subject Master List
    const ExpandedSubjectComponent = ({ data }) => {
        if (!data.SubSubjects || data.SubSubjects.length === 0) {
            return null;
        }

        return (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Sub-Subjects:</h4>
                <div className="grid grid-cols-1 gap-2">
                    {data.SubSubjects.map((sub, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                        >
                            <div className="flex gap-4">
                                <span className="text-sm text-gray-600 font-medium min-w-[120px]">
                                    {sub.SubjectName}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Unit: {sub.SubjectUnit}
                                </span>
                            </div>
                            {/* No + button here — parent + adds all sub-subjects automatically */}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleAddSubSubject = (parentRow, subSubject) => {
        // Check if this sub-subject is already added
        const exists = addedSubjects.some(
            s => s.SubSubjectId === subSubject.SubSubjectId && s.ParentSubjectId === parentRow.SubjectId
        );
        if (exists) return;

        setAddedSubjects(prev => [
            ...prev,
            {
                RowId: parentRow.RowId,
                SubjectId: parentRow.SubjectId,
                SubSubjectId: subSubject.SubSubjectId,
                SubjectCode: parentRow.SubjectCode,
                SubjectName: `${parentRow.SubjectName} - ${subSubject.SubjectName}`,
                SubjectType: parentRow.SubjectType,
                SubjectUnit: subSubject.SubjectUnit,
                ParentSubjectId: parentRow.SubjectId,
                IsSubSubject: true,
                term1: true,
                term2: true,
                term3: true,
            }
        ]);
    };

    const [addedSubjects, setAddedSubjects] = useState([]);
    const [collapsedParents, setCollapsedParents] = useState({});
    const [masterListCollapsed, setMasterListCollapsed] = useState({});

    const toggleParent = (subjectId) => {
        setCollapsedParents(prev => ({ ...prev, [subjectId]: !prev[subjectId] }));
    };

    const toggleMasterRow = (subjectId) => {
        setMasterListCollapsed(prev => ({ ...prev, [subjectId]: !prev[subjectId] }));
    };

    const handleAddSubject = (row) => {
        const exists = addedSubjects.some(s => s.RowId === row.RowId && !s.IsSubSubject);
        if (exists) return;

        const newEntries = [
            // Parent subject
            {
                RowId: row.RowId,
                SubjectId: row.SubjectId,
                SubjectCode: row.SubjectCode,
                SubjectName: row.SubjectName,
                SubjectType: row.SubjectType,
                SubjectUnit: row.SubjectUnit,
                IsSubSubject: false,
                term1: true,
                term2: true,
                term3: true,
            },
            // All sub-subjects auto-added under the parent with radio (T1 default)
            ...((row.SubSubjects || []).map(sub => ({
                RowId: row.RowId,
                SubjectId: row.SubjectId,
                SubSubjectId: sub.SubSubjectId,
                SubjectCode: row.SubjectCode,
                SubjectName: sub.SubjectName,
                SubjectType: row.SubjectType,
                SubjectUnit: sub.SubjectUnit,
                ParentSubjectId: row.SubjectId,
                IsSubSubject: true,
                termAssigned: "term1", // radio: T1 / T2 / T3
            })))
        ];

        setAddedSubjects(prev => [...prev, ...newEntries]);

        setInactiveGeneralOfferedSubject(prev =>
            prev.filter(s => s.RowId !== row.RowId)
        );
    };

    const handleRemoveSubject = (row, index) => {
        setAddedSubjects(prev =>
            prev.filter((_, i) => i !== index)
        );

        setInactiveGeneralOfferedSubject(prev => [
            ...prev,
            {
                SubjectCode: row.SubjectCode,
                SubjectName: row.SubjectName,
                SubjectType: row.SubjectType,
                SubjectUnit: row.SubjectUnit,
            }
        ]);
    };

    const handleCheckboxChange = (index, field) => {
        setAddedSubjects(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: !item[field] }
                    : item
            )
        );
    };

    const handleSubTermChange = (index, termValue) => {
        setAddedSubjects(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, termAssigned: termValue }
                    : item
            )
        );
    };
    const handleInputChange = (index, field, value) => {
        setAddedSubjects(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };
    // Only parent rows for the main list
    const parentSubjects = addedSubjects.filter(s => !s.IsSubSubject);

    // Collapsable Added Subjects Table — COA-style design
    const AddedSubjectsTable = () => {
        if (addedSubjects.length === 0) {
            return (
                <div className="py-6 text-center text-gray-400 text-sm">No subjects added yet</div>
            );
        }

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-500 px-3 py-2"
                    style={{ gridTemplateColumns: '28px 1.5fr 2fr 1.5fr 0.7fr 2fr 0.5fr' }}>
                    <span></span>
                    <span>Subject Code</span>
                    <span>Subject Name</span>
                    <span>Subject Type</span>
                    <span>Unit</span>
                    <span>Term Availability</span>
                    <span>Action</span>
                </div>

                {parentSubjects.map((row) => {
                    const parentRealIndex = addedSubjects.indexOf(row);
                    const subSubjects = addedSubjects.filter(
                        s => s.IsSubSubject && s.ParentSubjectId === row.SubjectId
                    );
                    const hasSubSubjects = subSubjects.length > 0;
                    const isCollapsed = !!collapsedParents[row.SubjectId];

                    return (
                        <div key={`parent-${row.SubjectId}`}>
                            {/* Parent Row */}
                            <div
                                className="grid items-center px-3 py-2.5 border-b border-gray-100 hover:bg-gray-50 text-sm font-semibold text-gray-800"
                                style={{ gridTemplateColumns: '28px 1.5fr 2fr 1.5fr 0.7fr 2fr 0.5fr' }}
                            >
                                {/* Collapse toggle */}
                                <span className="flex items-center justify-center">
                                    {hasSubSubjects ? (
                                        <button
                                            onClick={() => toggleParent(row.SubjectId)}
                                            className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                                            title={isCollapsed ? "Expand" : "Collapse"}
                                        >
                                            {isCollapsed
                                                ? <ChevronRight size={14} strokeWidth={2.5} />
                                                : <ChevronDown size={14} strokeWidth={2.5} />
                                            }
                                        </button>
                                    ) : (
                                        <span className="w-5" />
                                    )}
                                </span>
                                <span>{row.SubjectCode || '-'}</span>
                                <span>{row.SubjectName}</span>
                                <span>{row.SubjectType}</span>
                                <span>{row.SubjectUnit}</span>
                                {/* Parent: checkboxes for term availability */}
                                <div className="flex gap-3">
                                    {["term1", "term2", "term3"].map((t, i) => (
                                        <label key={t} className="flex items-center gap-1 text-xs font-normal cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!row[t]}
                                                onChange={() => handleCheckboxChange(parentRealIndex, t)}
                                            />
                                            T{i + 1}
                                        </label>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleRemoveSubject(row, parentRealIndex)}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>

                            {/* Sub-Subject Rows */}
                            {hasSubSubjects && !isCollapsed && subSubjects.map((sub) => {
                                const subRealIndex = addedSubjects.indexOf(sub);
                                return (
                                    <div
                                        key={`sub-${sub.SubSubjectId}`}
                                        className="grid items-center px-3 py-2 border-b border-gray-100 text-xs text-gray-600 bg-gray-50"
                                        style={{ gridTemplateColumns: '28px 1.5fr 2fr 1.5fr 0.7fr 2fr 0.5fr' }}
                                    >
                                        {/* Child indicator — matches COA ">" style */}
                                        <span className="flex items-center justify-center text-gray-400">
                                            <ChevronRight size={12} />
                                        </span>
                                        <span className="pl-2 text-gray-500">{sub.SubjectName}</span>
                                        <span className="text-gray-400">—</span>
                                        <span>{sub.SubjectType}</span>
                                        <span>{sub.SubjectUnit}</span>
                                        {/* Sub-subject: radio — single term assignment */}
                                        <div className="flex gap-3">
                                            {["term1", "term2", "term3"].map((t, i) => (
                                                <label key={t} className="flex items-center gap-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`subterm-${sub.SubSubjectId}`}
                                                        value={t}
                                                        checked={sub.termAssigned === t}
                                                        onChange={() => handleSubTermChange(subRealIndex, t)}
                                                    />
                                                    T{i + 1}
                                                </label>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveSubject(sub, subRealIndex)}
                                            className="bg-red-400 text-white px-2 py-1 rounded text-xs"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    const [successModalBody, setSuccessModalBody] = useState("");
    const [successModalTitle, setSuccessModalTitle] = useState("");

    const handleSubmit = () => {
        setIsModalOpen(true);
    };

    const handleSubmitModal = async () => {
        const payload = {
            TempName: tempName,
            LevelId: selectedLevel?.value,
            CampusId: selectedCampus?.value,
            CreatedByUserId: userId,
            CurriculumSubjectChildDtos: addedSubjects
                .filter(s => !s.IsSubSubject)   // only parent subjects
                .map(s => ({
                    RowId: s.RowId,
                    SubjectId: s.SubjectId,
                    SubjectType: s.SubjectType,
                    Term1: s.term1 ? "true" : "false",
                    Term2: s.term2 ? "true" : "false",
                    Term3: s.term3 ? "true" : "false",
                    // Sub-subjects that belong to this parent
                    SubSubjectDtos: addedSubjects
                        .filter(sub => sub.IsSubSubject && sub.ParentSubjectId === s.SubjectId)
                        .map(sub => ({
                            SubSubjectId: sub.SubSubjectId,
                            Term1: sub.termAssigned === "term1" ? "true" : "false",
                            Term2: sub.termAssigned === "term2" ? "true" : "false",
                            Term3: sub.termAssigned === "term3" ? "true" : "false",
                        })),
                }))
        };

        console.log(payload);
        const res = await dispatch(fetchInsertCurriculumPerLevelData(payload));
        console.log(res);

        if (res.data?.Message == "Success") {
            setIsSuccessModalOpen(true);
            setSuccessModalBody("Done Creating Curriculum Entry.");
            setSuccessModalTitle(<span className="font-bold text-lg text-green-700">Success</span>);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
        else if (res.ok) {
            setIsSuccessModalOpen(true);
            setSuccessModalBody("Done Creating Curriculum Entry.");
            setSuccessModalTitle(<span className="font-bold text-lg text-green-700">Success</span>);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
        else {
            setIsSuccessModalOpen(true);
            setSuccessModalTitle(<span className="font-bold text-lg text-red-700">Error</span>);
            setSuccessModalBody("This section has been already created.");
        }
    };

    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;
    const [viewEditTitleModal, setViewEditTitleModal] = useState("");
    const [viewEditOpenModal, setViewEditOpenModal] = useState(false);
    const [mainSubjectScheduleList, setMainSubjectScheduleList] = useState([]);
    const masterSubjectScheduleState = useSelector((state) => state.academic.masterSubjectScheduleState || {});
    const mainSubjectScheduleTotalRows = masterSubjectScheduleState.data.totalRecords || 0;
    const mainSubjectScheduleLoading = masterSubjectScheduleState.loading || false;
    const [mainSubjectScheduleFilterText, setMainSubjectScheduleFilterText] = useState('');
    const [mainSubjectScheduleCurrentPage, setMainSubjectScheduleCurrentPage] = useState(1);
    const [mainSubjectScheduleRowsPerPage, setMainSubjectScheduleRowsPerPage] = useState(10);
    const openRowModal = async (status) => {
        console.log(status);

        const res = await dispatch(fetchMasterSubjectScheduleTableData(status.MainSecId, mainSubjectScheduleCurrentPage, mainSubjectScheduleRowsPerPage, mainSubjectScheduleFilterText));
        if (res.ok) {
            console.log(res.data);
            setMainSubjectScheduleList(res.data);
        }
        setViewEditOpenModal(true);
        if (status === "edit") {
            setViewEditTitleModal("Edit Section");
        }
        else {
            setViewEditTitleModal("View Section");
        }
    };
    const mainSubjectScheduleColumn = [
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true, wrap: true, grow: 3 },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true, wrap: true, grow: 3 },
        { name: 'Subject Type', selector: row => row.SubjectType, sortable: true, wrap: true, grow: 3 },
        { name: 'Subject Unit', selector: row => row.SubjectUnit, sortable: true, wrap: true, grow: 3 },
        // { name: 'Room', selector: row => row.Room, sortable: true, wrap: true, grow: 3 },
        // { name: 'Start Time', selector: row => formatToAMPM(row.StartTime), sortable: true, wrap: true, grow: 3 },
        // { name: 'End Time', selector: row => formatToAMPM(row.EndTime), sortable: true, wrap: true, grow: 3 },
        {
            name: 'Term Available',
            cell: (row) => (
                <div className="flex gap-3 m-1">
                    {["Term1", "Term2", "Term3"].map((t, i) => (
                        <label key={t} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={row[t] === "true" || row[t] === true}
                                readOnly
                            />
                            T{i + 1}
                        </label>
                    ))}
                </div>
            ),
            sortable: true,
            wrap: true,
            grow: 3,
            style: {
                whiteSpace: 'normal'
            }
        }
    ];
    return (
        // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>

            {/* LEFT — Inactive */}
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            Curriculum Per Level Table
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <OutlineBlueBtn
                            label="Add new"
                            onClick={openAddNewModal}
                        />

                        <SchoolYearDropdown
                            value={selectedSchoolYear}
                            onChange={(e) => {
                                setSelectedSchoolYear(e.target.value);
                                setSubjectScheduleCurrentPage(1);
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-64"
                            value={subjectScheduleFilterText}
                            onChange={(e) => {
                                setSubjectSchedulelFilterText(e.target.value);
                                setSubjectScheduleCurrentPage(1);
                            }}
                        />
                    </div>

                </div>
                <div className="w-full overflow-x-auto">
                    <DataTable
                        columns={subjectScheduleColumn}
                        data={subjectScheduleList}
                        progressPending={subjectScheduleLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={subjectScheduleTotalRows}
                        paginationDefaultPage={subjectScheduleCurrentPage}
                        onChangePage={(page) => setSubjectScheduleCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setSubjectScheduleRowsPerPage(newPerPage);
                            setSubjectScheduleCurrentPage(page);
                        }}
                        highlightOnHover
                        responsive
                    />
                </div>

            </div>
            <ModalComponent
                isOpen={addNewModal}
                onClose={() => setAddNewModal(false)}
                title="Create subject schedule template"
                body={
                    <div>
                        <div className="mt-6 relative overflow-hidden">
                            <div className="px-4 py-3 rounded-t-lg flex justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-green-600">
                                        Subject Master List
                                    </h3>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="px-3 py-2 border border-gray-300 rounded w-64"
                                    value={generalOfferedFilterText}
                                    onChange={(e) => {
                                        setGeneralOfferedFilterText(e.target.value);
                                        setGeneralOfferedCurrentPage(1);
                                    }}
                                />
                            </div>
                            <div className="w-full overflow-x-auto">
                                {/* Custom collapsable Subject Master List table */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Header */}
                                    <div className="grid bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-500 px-3 py-2"
                                        style={{ gridTemplateColumns: '28px 1.5fr 2fr 1.5fr 1fr 80px' }}>
                                        <span></span>
                                        <span>Subject Code</span>
                                        <span>Subject Name</span>
                                        <span>Subject Type</span>
                                        <span>Subject Unit</span>
                                        <span>Action</span>
                                    </div>

                                    {generealOfferedLoading ? (
                                        <div className="py-6 text-center text-gray-400 text-sm">Loading...</div>
                                    ) : generalOfferedSubject.length === 0 ? (
                                        <div className="py-6 text-center text-gray-400 text-sm">No subjects found</div>
                                    ) : (
                                        generalOfferedSubject.map((row) => {
                                            const hasSubSubjects = row.SubSubjects && row.SubSubjects.length > 0;
                                            const isCollapsed = !masterListCollapsed[row.SubjectId]; // default collapsed

                                            return (
                                                <div key={`master-${row.SubjectId || row.RowId}`}>
                                                    {/* Parent Row */}
                                                    <div
                                                        className="grid items-center px-3 py-2.5 border-b border-gray-100 hover:bg-gray-50 text-sm font-semibold text-gray-800"
                                                        style={{ gridTemplateColumns: '28px 1.5fr 2fr 1.5fr 1fr 80px' }}
                                                    >
                                                        <span className="flex items-center justify-center">
                                                            {hasSubSubjects ? (
                                                                <button
                                                                    onClick={() => toggleMasterRow(row.SubjectId)}
                                                                    className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                                                                    title={isCollapsed ? "Expand" : "Collapse"}
                                                                >
                                                                    {isCollapsed
                                                                        ? <ChevronRight size={14} strokeWidth={2.5} />
                                                                        : <ChevronDown size={14} strokeWidth={2.5} />
                                                                    }
                                                                </button>
                                                            ) : (
                                                                <span className="w-5" />
                                                            )}
                                                        </span>
                                                        <span className="text-green-700">{row.SubjectCode || ''}</span>
                                                        <span>{row.SubjectName}</span>
                                                        <span className="text-blue-600">{row.SubjectType}</span>
                                                        <span>{row.SubjectUnit}</span>
                                                        <button
                                                            onClick={() => handleAddSubject(row)}
                                                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm w-fit"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>

                                                    {/* Sub-Subject Rows — info only, no action button */}
                                                    {hasSubSubjects && !isCollapsed && row.SubSubjects.map((sub, idx) => (
                                                        <div
                                                            key={`mastersub-${sub.SubSubjectId || idx}`}
                                                            className="grid items-center px-3 py-2 border-b border-gray-100 bg-gray-50 text-xs text-gray-600"
                                                            style={{ gridTemplateColumns: '28px 1.5fr 2fr 1.5fr 1fr 80px' }}
                                                        >
                                                            <span></span>
                                                            <span className="pl-6 text-gray-400">—</span>
                                                            <span className="pl-2">{sub.SubjectName}</span>
                                                            <span>{row.SubjectType}</span>
                                                            <span>{sub.SubjectUnit}</span>
                                                            <span></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })
                                    )}

                                    {/* Pagination footer */}
                                    <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
                                        <span>Rows per page:</span>
                                        <select
                                            value={generalOfferedRowsPerPage}
                                            onChange={(e) => {
                                                setGeneralOfferedRowsPerPage(Number(e.target.value));
                                                setGeneralOfferedCurrentPage(1);
                                            }}
                                            className="border border-gray-300 rounded px-1 py-0.5 text-xs"
                                        >
                                            {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                        <span>
                                            {((generalOfferedCurrentPage - 1) * generalOfferedRowsPerPage) + 1}–
                                            {Math.min(generalOfferedCurrentPage * generalOfferedRowsPerPage, generealOfferedTotalRows)} of {generealOfferedTotalRows}
                                        </span>
                                        <div className="flex gap-1">
                                            <button onClick={() => setGeneralOfferedCurrentPage(1)} disabled={generalOfferedCurrentPage === 1} className="px-1.5 py-0.5 rounded border border-gray-300 disabled:opacity-40">«</button>
                                            <button onClick={() => setGeneralOfferedCurrentPage(p => p - 1)} disabled={generalOfferedCurrentPage === 1} className="px-1.5 py-0.5 rounded border border-gray-300 disabled:opacity-40">‹</button>
                                            <button onClick={() => setGeneralOfferedCurrentPage(p => p + 1)} disabled={generalOfferedCurrentPage * generalOfferedRowsPerPage >= generealOfferedTotalRows} className="px-1.5 py-0.5 rounded border border-gray-300 disabled:opacity-40">›</button>
                                            <button onClick={() => setGeneralOfferedCurrentPage(Math.ceil(generealOfferedTotalRows / generalOfferedRowsPerPage))} disabled={generalOfferedCurrentPage * generalOfferedRowsPerPage >= generealOfferedTotalRows} className="px-1.5 py-0.5 rounded border border-gray-300 disabled:opacity-40">»</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4 border-t border-gray-300" />
                            <h2 className="my-4 text-xl font-bold text-green-500">
                                List of Added Subjects
                            </h2>
                            <div className="flex justify-center gap-6 mb-4">
                                <label className="flex flex-col pt-1">
                                    <span className="text-sm font-medium mb-1">Template Name</span>
                                    <input
                                        type="text"
                                        placeholder="Enter Template Name"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="w-full rounded-lg border p-2"
                                    />
                                </label>
                                <SearchableSelect
                                    options={levelList}
                                    value={selectedLevel}
                                    onChange={(selected) => {
                                        setSelectedLevel(selected);
                                        // handleSetSection(selected);
                                    }}
                                    placeholder="-- Select Level --"
                                    label="Select Level"
                                    isClearable={true}
                                />
                                <SearchableSelect
                                    options={campusList}
                                    value={selectedCampus}
                                    onChange={(selected) => {
                                        setSelectedCampus(selected);
                                        // handleSetSection(selected);
                                    }}
                                    placeholder="-- Select Campus --"
                                    label="Select Campus"
                                    isClearable={true}
                                />
                                {/* <SearchableSelect
                                    options={sectionList}
                                    value={selectedSection}
                                    onChange={(selected) => setSelectedSection(selected)}
                                    placeholder="-- Select Section --"
                                    label="Select Section"
                                    isClearable={true}
                                /> */}

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Level
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedSection?.levelName || ""}
                                        placeholder="Level"
                                        disabled
                                        className="shadow-xs border text-sm rounded-lg block w-full p-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div> */}
                            </div>
                            <div className="w-full overflow-y-auto max-h-[300px]">
                                <AddedSubjectsTable />
                            </div>
                        </div>
                    </div>
                }
                size="w-[1000px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmit, closeOnClick: false },
                    { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
                ]}
            />
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Warning"
                body="Are you sure you want to continue?"
                buttons={[
                    {
                        label: "Yes", type: "green",
                        onClick: handleSubmitModal
                    },
                    { label: "No", type: "red", onClick: () => console.log("No clicked") },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={successModalTitle}
                body={<p>{successModalBody}</p>}
            />
            <ModalComponent
                isOpen={viewEditOpenModal}
                onClose={() => setViewEditOpenModal(false)}
                title={viewEditTitleModal}
                body={
                    <div>
                        <div>
                            <h2 className="my-4 text-xl font-bold text-green-500">
                                Subject Schedule Template
                            </h2>
                            <div className="flex justify-center gap-6 mb-4">
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Section Name
                                    </label>

                                    <input
                                        type="text"
                                        value={mainSubjectScheduleList[0]?.SectionName || ""}
                                        disabled
                                        className="w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Level Name
                                    </label>
                                    <input
                                        type="text"
                                        value={mainSubjectScheduleList[0]?.LevelName || ""}
                                        disabled
                                        className="w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Created By
                                    </label>
                                    <input
                                        type="text"
                                        value={mainSubjectScheduleList[0]?.CreatedByFullname || ""}
                                        disabled
                                        className="w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Date Created
                                    </label>
                                    <input
                                        type="text"
                                        value={formatDate(mainSubjectScheduleList[0]?.DateCreated) || ""}
                                        disabled
                                        className="w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <hr className="my-4 border-t border-gray-300" />
                        <div className="mt-6 relative overflow-hidden">
                            <div className="px-4 py-3 rounded-t-lg flex justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-green-600">
                                        Subject Schedule of Section
                                    </h3>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="px-3 py-2 border border-gray-300 rounded w-64"
                                    value={mainSubjectScheduleFilterText}
                                    onChange={(e) => {
                                        setMainSubjectScheduleFilterText(e.target.value);
                                        setMainSubjectScheduleCurrentPage(1);
                                    }}
                                />
                            </div>
                            <div className="w-full overflow-x-auto">
                                <DataTable
                                    columns={mainSubjectScheduleColumn}
                                    data={mainSubjectScheduleList}
                                    progressPending={mainSubjectScheduleLoading}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={mainSubjectScheduleTotalRows}
                                    paginationDefaultPage={mainSubjectScheduleCurrentPage}
                                    onChangePage={(page) => setMainSubjectScheduleCurrentPage(page)}
                                    onChangeRowsPerPage={(newPerPage, page) => {
                                        setMainSubjectScheduleRowsPerPage(newPerPage);
                                        setMainSubjectScheduleCurrentPage(page);
                                    }}
                                    highlightOnHover
                                    responsive
                                    overflowY={false}
                                />
                            </div>
                        </div>
                    </div>
                }
                size="w-[1000px]"
                maxHeight="100vh"
                buttons={[
                    // { label: "Submit", type: "green", onClick: handleSubmit, closeOnClick: false },
                    { label: "Close", type: "red", onClick: () => setViewEditOpenModal(false) },
                ]}
            />
        </div>
    );
};
export default CurriculumComponent;