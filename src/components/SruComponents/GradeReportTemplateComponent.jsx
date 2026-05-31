import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import { fetchGradeReportTemplateData } from "../../states/SruState/Action";
import { fetchCampusData } from "../../states/OnlineApplicationState/Action";
import { fetchLevelData } from "../../states/AdmissionState/Action";
import { fetchGeneralOfferedSubjectData } from "../../states/AcademicState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";

const GradeReportTemplateComponent = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;

    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;
    const [gradeReportList, setGradeReportList] = useState([]);
    const gradeReportTableState = useSelector((state) => state.sru.gradeReportTableState || {});
    const gradeReportTable = gradeReportTableState.data?.data || [];
    const gradeReportTotalRows = gradeReportTableState.data?.totalRecords || 0;
    const gradeReportLoading = gradeReportTableState.loading || false;
    const [gradeReportCurrentPage, setGradeReportCurrentPage] = useState(1);
    const [gradeReportRowsPerPage, setGradeReportRowsPerPage] = useState(10);
    const [gradeReportSearchFilter, setGradeReportFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchGradeReportTemplateData(gradeReportCurrentPage, gradeReportRowsPerPage, gradeReportSearchFilter));
    }, [gradeReportCurrentPage, gradeReportRowsPerPage, gradeReportSearchFilter, dispatch]);

    useEffect(() => {
        if (gradeReportTable.length === 0) return;
        setGradeReportList(gradeReportTable);
    }, [gradeReportTable]);

    const gradeReportColumn = [
        { name: 'Name of Template', selector: row => row.CampusName, sortable: true },
        { name: 'Campus', selector: row => row.CampusName, sortable: true },
        { name: 'Level', selector: row => row.DivName, sortable: true },
        { name: 'Term Available', selector: row => row.DivName, sortable: true },
        { name: 'Status', selector: row => row.Term, sortable: true },
        { name: 'Created By', selector: row => row.DivName, sortable: true },
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

    const [generalOfferedSubject, setInactiveGeneralOfferedSubject] = useState([]);
    const generalOfferedSubjectState = useSelector((state) => state.academic.generalOfferedSubjectState || {});
    const generealOfferedTotalRows = generalOfferedSubjectState.data?.totalRecords || 0;
    const generealOfferedLoading = generalOfferedSubjectState.loading || false;
    const [generalOfferedFilterText, setGeneralOfferedFilterText] = useState('');
    const [generalOfferedCurrentPage, setGeneralOfferedCurrentPage] = useState(1);
    const [generalOfferedRowsPerPage, setGeneralOfferedRowsPerPage] = useState(10);

    const [addNewModal, setAddNewModal] = useState(false);
    
    const openAddNewModal = async () => {
        dispatch(fetchCampusData());
        dispatch(fetchLevelData());
        setAddNewModal(true);
        const res = await dispatch(fetchGeneralOfferedSubjectData(generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText));
        if (res && res.ok) {
            // Ensure each row definitely has a fallback identifier if RowId missing from server response
            const formattedData = (res.data || []).map((item, index) => ({
                ...item,
                RowId: item.RowId || item.SubjectId || `subj-${index}`
            }));
            setInactiveGeneralOfferedSubject(formattedData);
            setAddedSubjects([]); // Reset your added basket on structural modal openings
        }
    };

    const campusState = useSelector((state) => state.online.campusState || {});
    const campus = campusState.data || [];
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [campusList, setCampusList] = useState([]);

    const levelState = useSelector((state) => state.admission.levelState || {});
    const level = levelState.data || [];
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [levelList, setLevelList] = useState([]);
    const [tempName, setTempName] = useState("");

    const termList = [
        { value: "Term1", label: "1st Trimester Period" },
        { value: "Term2", label: "2nd Trimester Period" },
        { value: "Term3", label: "3rd Trimester Period" },
    ];
    const [selectedTerm, setSelectedTerm] = useState(null);

    useEffect(() => {
        setCampusList(
            (campus || []).map(item => ({
                value: item.CampusId,
                label: item.CampusName,
            }))
        );

        setLevelList(
            (level || []).map(item => ({
                value: item.LevelId,
                label: item.LevelName,
            }))
        );
    }, [campus, level]);

    const [addedSubjects, setAddedSubjects] = useState([]);

    // --- FIXED: Identity Mappings preserved properly during additions ---
    const handleAddSubject = (row) => {
        const exists = addedSubjects.some(s => s.RowId === row.RowId);
        if (exists) return;

        setAddedSubjects(prev => [...prev, row]);
        setInactiveGeneralOfferedSubject(prev => prev.filter(s => s.RowId !== row.RowId));
    };

    // --- FIXED: Full item definition retained when popping entries back into the main view ---
    const handleRemoveSubject = (row) => {
        setAddedSubjects(prev => prev.filter(s => s.RowId !== row.RowId));
        setInactiveGeneralOfferedSubject(prev => [...prev, row]);
    };

    const subjectColumns = [
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true },
        { name: 'Subject Unit', selector: row => row.SubjectUnit, sortable: true },
        {
            name: "Action",
            cell: row => (
                <button
                    onClick={() => handleAddSubject(row)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded transition-colors"
                >
                    <Plus size={16} />
                </button>
            )
        }
    ];

    const addedColumns = [
        { name: "Subject Code", selector: row => row.SubjectCode },
        { name: "Subject Name", selector: row => row.SubjectName },
        { name: 'Subject Unit', selector: row => row.SubjectUnit, sortable: true },
        {
            name: "Action",
            cell: row => (
                <button
                    onClick={() => handleRemoveSubject(row)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            )
        }
    ];

    const [isWarningModal, setIsWarningModal] = useState(false);
    const [isSuccessModal, setIsSuccessModal] = useState(false);

    const handleOpenWarningModal = () => {
        setIsWarningModal(true);
    };

    const handleSubmitModal = async () => {
        // Implement save logic payload processing here
        setIsWarningModal(false);
        setIsSuccessModal(true);
    };

    return (
        <div>
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="px-4 py-3 border-b bg-white rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            Grade Report Sequence Templates
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <OutlineBlueBtn label="Add new" onClick={openAddNewModal} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-64"
                            value={gradeReportSearchFilter}
                            onChange={(e) => {
                                setGradeReportFilterText(e.target.value);
                                setGradeReportCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <DataTable
                        columns={gradeReportColumn}
                        data={gradeReportList}
                        progressPending={gradeReportLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={gradeReportTotalRows}
                        paginationDefaultPage={gradeReportCurrentPage}
                        onChangePage={(page) => setGradeReportCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setGradeReportRowsPerPage(newPerPage);
                            setGradeReportCurrentPage(page);
                        }}
                        highlightOnHover
                        responsive
                    />
                </div>
            </div>

            <ModalComponent
                isOpen={addNewModal}
                onClose={() => setAddNewModal(false)}
                title="Create Grade Report Sequence Template"
                body={
                    <div>
                        <div className="mt-6 relative overflow-hidden">
                            <div className="px-4 py-3 rounded-t-lg flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-green-600">
                                    Subject Master List
                                </h3>
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
                                <DataTable
                                    columns={subjectColumns}
                                    data={generalOfferedSubject}
                                    progressPending={generealOfferedLoading}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={generealOfferedTotalRows}
                                    paginationDefaultPage={generalOfferedCurrentPage}
                                    onChangePage={(page) => setGeneralOfferedCurrentPage(page)}
                                    onChangeRowsPerPage={(newPerPage, page) => {
                                        setGeneralOfferedRowsPerPage(newPerPage);
                                        setGeneralOfferedCurrentPage(page);
                                    }}
                                    highlightOnHover
                                    responsive
                                />
                            </div>

                            <hr className="my-4 border-t border-gray-300" />
                            
                            <h2 className="my-4 text-xl font-bold text-green-500">
                                List of Added Subjects
                            </h2>
                            <div className="flex justify-center gap-6 mb-4">
                                <label className="flex flex-col">
                                    <span className="text-sm font-medium mb-1">Name of Template</span>
                                    <input
                                        type="text"
                                        placeholder="Enter Template Name"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="w-full rounded-lg border p-2"
                                    />
                                </label>
                                <SearchableSelect
                                    options={campusList}
                                    value={selectedCampus}
                                    onChange={(selected) => setSelectedCampus(selected)}
                                    placeholder="-- Select Campus --"
                                    label="Select Campus"
                                />
                                <SearchableSelect
                                    options={levelList}
                                    value={selectedLevel}
                                    onChange={(selected) => setSelectedLevel(selected)}
                                    placeholder="-- Select Level --"
                                    label="Select Level"
                                />
                                <SearchableSelect
                                    options={termList}
                                    value={selectedTerm}
                                    onChange={(selected) => setSelectedTerm(selected)}
                                    placeholder="-- Select Term --"
                                    label="Select Term"
                                />
                            </div>
                            
                            <div className="w-full overflow-y-auto max-h-[300px]">
                                <DataTable
                                    columns={addedColumns}
                                    data={addedSubjects}
                                    highlightOnHover
                                    striped
                                    responsive
                                    dense
                                    fixedHeader
                                    fixedHeaderScrollHeight="260px"
                                    noDataComponent="No subjects added yet"
                                />
                            </div>
                        </div>
                    </div>
                }
                size="w-[1000px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Submit", type: "green", onClick: handleOpenWarningModal },
                    { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
                ]}
            />

            <ModalComponent
                isOpen={isWarningModal}
                onClose={() => setIsWarningModal(false)}
                title={<span className="font-bold text-lg text-red-700">Warning!</span>}
                body={<p>Are you sure you want to Submit?</p>}
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmitModal },
                    { label: "Cancel", type: "red", onClick: () => setIsWarningModal(false) },
                ]}
            />
            
            <ModalComponent
                isOpen={isSuccessModal}
                onClose={() => setIsSuccessModal(false)}
                title={<span className="font-bold text-lg text-green-700">Success!</span>}
                body={<p>Done creating new Grade Report Template!</p>}
            />
        </div>
    );
};

export default GradeReportTemplateComponent;