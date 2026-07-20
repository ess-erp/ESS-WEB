import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import {
    fetchInsertGradeReportTemplateData,
    fetchGradeReportTemplateData,
    fetchRowGradeReportTemplateData,
} from "../../states/SruState/Action";
import { fetchCampusData } from "../../states/OnlineApplicationState/Action";
import { fetchLevelData } from "../../states/AdmissionState/Action";
import {
    fetchGeneralOfferedSubjectData,
    fetchCurriculumListData,
    fetchCurriculumTableData,
} from "../../states/AcademicState/Action";
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
    const [addNewModal, setAddNewModal] = useState(false);

    const [generalOfferedSubject, setInactiveGeneralOfferedSubject] = useState([]);
    const [selectedSequenceSubjects, setSelectedSequenceSubjects] = useState([]);

    const [errors, setErrors] = useState({});

    const openAddNewModal = async () => {
        dispatch(fetchCampusData());
        dispatch(fetchLevelData());
        setSelectedSequenceSubjects([]);
        setInactiveGeneralOfferedSubject([]);
        setTempName("");
        setSelectedCampus(null);
        setSelectedLevel(null);
        setSelectedCurriculum(null);
        setSelectedTerm(null);
        setErrors({});
        setAddNewModal(true);
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
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [curriculumList, setCurriculumList] = useState([]);
    const curriculumListState = useSelector((state) => state.academic.curriculumListState || {});
    const curriculumData = curriculumListState.data || [];
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);

    const termList = [
        { value: "Term1", label: "1st Trimester Period" },
        { value: "Term2", label: "2nd Trimester Period" },
        { value: "Term3", label: "3rd Trimester Period" },
    ];

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

        if (Array.isArray(curriculumData) && curriculumData.length > 0) {
            setCurriculumList(
                curriculumData.map(item => ({
                    value: item.CurId,
                    label: `${item.TempName} - ${item.LevelName}`
                }))
            );
        }
    }, [campus, curriculumData, level]);

    const handleSelectedLevel = (data) => {
        dispatch(fetchCurriculumListData(data?.value));
    };

    const generalOfferedSubjectState = useSelector((state) => state.academic.curriculumTableState || {});
    const generealOfferedTable = generalOfferedSubjectState.data.data || [];
    const generealOfferedTotalRows = generalOfferedSubjectState.data.totalRecords || 0;
    const generealOfferedLoading = generalOfferedSubjectState.loading || false;
    const [generalOfferedFilterText, setGeneralOfferedFilterText] = useState('');
    const [generalOfferedCurrentPage, setGeneralOfferedCurrentPage] = useState(1);
    const [generalOfferedRowsPerPage, setGeneralOfferedRowsPerPage] = useState(10);

    const handleShowCurriculumTable = (data) => {
        dispatch(fetchCurriculumTableData(data.value, generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText));
    };

    useEffect(() => {
        if (!generealOfferedTable || generealOfferedTable.length === 0) return;

        const filteredFromSelected = generealOfferedTable.filter(
            reduxRow => !selectedSequenceSubjects.some(seqRow => seqRow.SubjectCode === reduxRow.SubjectCode)
        );
        setInactiveGeneralOfferedSubject(filteredFromSelected);
    }, [generealOfferedTable]);

    const handleAddSubject = (row) => {
        setInactiveGeneralOfferedSubject(prev => prev.filter(item => item.SubjectCode !== row.SubjectCode));
        setSelectedSequenceSubjects(prev => [
            ...prev,
            {
                ...row,
                SequenceNo: prev.length + 1
            }
        ]);
        if (errors.sequence) {
            setErrors(prev => ({ ...prev, sequence: null }));
        }
    };

    const handleRemoveSubject = (row) => {
        setSelectedSequenceSubjects(prev =>
            prev
                .filter(item => item.SubjectCode !== row.SubjectCode)
                .map((item, index) => ({ ...item, SequenceNo: index + 1 }))
        );
        setInactiveGeneralOfferedSubject(prev => [row, ...prev]);
    };

    const subjectColumns = [
        { name: "Subject Code", selector: row => row.SubjectCode },
        { name: "Subject Name", selector: row => row.SubjectName },
        { name: "Subject Type", selector: row => row.SubjectType },
        {
            name: "Action",
            cell: row => (
                <button
                    type="button"
                    onClick={() => handleAddSubject(row)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded transition-colors"
                >
                    <Plus size={16} />
                </button>
            )
        }
    ];

    const sequenceColumns = [
        { name: "Seq No.", selector: row => row.SequenceNo, width: "90px", sortable: true },
        { name: "Subject Code", selector: row => row.SubjectCode },
        { name: "Subject Name", selector: row => row.SubjectName },
        { name: "Subject Type", selector: row => row.SubjectType },
        {
            name: "Action",
            cell: row => (
                <button
                    type="button"
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

    // FORM VALIDATION CHECK ENGINE
    const validateForm = () => {
        let tempErrors = {};

        if (!tempName.trim()) {
            tempErrors.tempName = "Template name is required.";
        }
        if (!selectedCampus) {
            tempErrors.campus = "Please select a campus.";
        }
        if (!selectedLevel) {
            tempErrors.level = "Please select an academic level.";
        }
        if (!selectedCurriculum) {
            tempErrors.curriculum = "Please select a curriculum framework.";
        }
        if (!selectedTerm) {
            tempErrors.term = "Please select a terminal period.";
        }
        if (selectedSequenceSubjects.length === 0) {
            tempErrors.sequence = "You must select at least one subject to establish a sorting sequence template.";
        }

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const handleOpenWarningModal = () => {
        if (validateForm()) {
            setIsWarningModal(true);
        }
    };

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successModalBody, setSuccessModalBody] = useState("");
    const [successModalTitle, setSuccessModalTitle] = useState("");

    const handleSubmitModal = async () => {
        const payload = {
            TempName: tempName,
            CampusId: selectedCampus?.value,
            LevelId: selectedLevel?.value,
            CurId: selectedCurriculum?.value,
            Term: selectedTerm?.value,
            CreatedByUserId: userId,
            SequenceDetailsDtos: selectedSequenceSubjects.map(sub => ({
                SubjectId: sub.SubjectId,
                SequenceNo: sub.SequenceNo.toString(),
                SubjectType: sub.SubjectType,
            }))
        };
        console.log("Submitting Sequence Template Payload:", payload);
        const res = await dispatch(fetchInsertGradeReportTemplateData(payload));
        console.log(res);
        if (res.data?.Message == "Success") {
            setIsSuccessModalOpen(true);
            setSuccessModalTitle(<span className="font-bold text-lg text-green-700">Success</span>);
            setSuccessModalBody("Done creating grade report template.");
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 2000);
            }
        }
        else {
            setIsSuccessModalOpen(true);
            setSuccessModalTitle(<span className="font-bold text-lg text-red-700">Error!</span>);
            setSuccessModalBody(`${res.data.Message}`);
        }

        setIsWarningModal(false);
        setIsSuccessModal(true);
        setAddNewModal(false);
    };

    const [gradeReportTableList, setGradeReportList] = useState([]);
    const gradeReportTableState = useSelector((state) => state.sru.gradeReportTableState || {});
    const gradeReportTableTable = gradeReportTableState.data.data || [];
    const gradeReportTableTotalRows = gradeReportTableState.data.totalRecords || 0;
    const gradeReportTableLoading = gradeReportTableState.loading || false;
    const [gradeReportTableCurrentPage, setGradeReportCurrentPage] = useState(1);
    const [gradeReportTableRowsPerPage, setGradeReportRowsPerPage] = useState(10);
    const [gradeReportTableTableSearchFilter, setGradeReportFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchGradeReportTemplateData(gradeReportTableCurrentPage, gradeReportTableRowsPerPage, gradeReportTableTableSearchFilter));
    }, [gradeReportTableCurrentPage, gradeReportTableRowsPerPage, gradeReportTableTableSearchFilter, dispatch]);

    useEffect(() => {
        if (gradeReportTableTable.length === 0) return;
        setGradeReportList(gradeReportTableTable);
    }, [gradeReportTableTable]);
    const gradeReportColumn = [
        { name: 'Name of Template', selector: row => row.TempName, sortable: true },
        { name: 'Campus', selector: row => row.CampusName, sortable: true },
        { name: 'Level', selector: row => row.LevelName, sortable: true },
        { name: 'Curriculum', selector: row => row.CurriculumTempName, sortable: true },
        { name: 'Term', selector: row => row.Term, sortable: true },
        { name: 'Created By', selector: row => row.CreatedByFullname, sortable: true },
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

                    <button
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        onClick={() => openRowModal(row, "edit")}
                    >
                        <Pencil size={18} />
                    </button>

                    <RowToggleComponent row={row} onToggle={handleToggleActive} />
                </div>
            ),
            ignoreRowClick: true,
            width: "180px",
        }
    ];

    const handleToggleActive = (row) => {
        console.log(row);
    };


    const rowGradeTemplateState = useSelector((state) => state.sru.rowGradeTemplateState || {});
    const gradeReportTemplateData = rowGradeTemplateState.data || [];
    const gradeReportTemplateLoading = rowGradeTemplateState.loading;
    const [isPreviewModal, setIsPreviewModal] = useState(false);

    const openRowModal = (data, status) => {
        console.log(data);
        dispatch(fetchRowGradeReportTemplateData(data?.ReportId));
        setIsPreviewModal(true);
    };

    console.log(rowGradeTemplateState);

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
                            value={gradeReportTableTableSearchFilter}
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
                        data={gradeReportTableList}
                        progressPending={gradeReportTableLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={gradeReportTableTotalRows}
                        paginationDefaultPage={gradeReportTableCurrentPage}
                        onChangePage={(page) => setGradeReportCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setGradeReportCurrentPage(page);
                            setGradeReportRowsPerPage(newPerPage);
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
                    <div className="mt-6 relative overflow-hidden max-h-[75vh] overflow-y-auto px-1">
                        <div className="px-4 py-3 rounded-t-lg flex justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-green-600">
                                    Create Schedule for Section
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium mb-1">Name of Template</span>
                                    <input
                                        type="text"
                                        placeholder="Enter Template Name"
                                        value={tempName}
                                        onChange={(e) => {
                                            setTempName(e.target.value);
                                            if (errors.tempName) setErrors(prev => ({ ...prev, tempName: null }));
                                        }}
                                        className={`mt-1 w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 h-[38px] ${errors.tempName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"
                                            }`}
                                    />
                                    {errors.tempName && <span className="text-xs text-red-500 mt-1 font-medium">{errors.tempName}</span>}
                                </div>

                                <div className="flex flex-col">
                                    <SearchableSelect
                                        options={campusList}
                                        value={selectedCampus}
                                        onChange={(selected) => {
                                            setSelectedCampus(selected);
                                            if (errors.campus) setErrors(prev => ({ ...prev, campus: null }));
                                        }}
                                        placeholder="-- Select Campus --"
                                        label="Select Campus"
                                    />
                                    {errors.campus && <span className="text-xs text-red-500 mt-1 font-medium">{errors.campus}</span>}
                                </div>

                                <div className="flex flex-col">
                                    <SearchableSelect
                                        options={levelList}
                                        value={selectedLevel}
                                        onChange={(selected) => {
                                            setSelectedLevel(selected);
                                            handleSelectedLevel(selected);
                                            if (errors.level) setErrors(prev => ({ ...prev, level: null }));
                                        }}
                                        placeholder="-- Select Level --"
                                        label="Select Level"
                                    />
                                    {errors.level && <span className="text-xs text-red-500 mt-1 font-medium">{errors.level}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <SearchableSelect
                                        options={curriculumList}
                                        value={selectedCurriculum}
                                        onChange={(selected) => {
                                            setSelectedCurriculum(selected);
                                            handleShowCurriculumTable(selected);
                                            if (errors.curriculum) setErrors(prev => ({ ...prev, curriculum: null }));
                                        }}
                                        placeholder="-- Select Curriculum Type --"
                                        label="Select Curriculum"
                                    />
                                    {errors.curriculum && <span className="text-xs text-red-500 mt-1 font-medium">{errors.curriculum}</span>}
                                </div>

                                <div className="flex flex-col">
                                    <SearchableSelect
                                        options={termList}
                                        value={selectedTerm}
                                        onChange={(selected) => {
                                            setSelectedTerm(selected);
                                            if (errors.term) setErrors(prev => ({ ...prev, term: null }));
                                        }}
                                        placeholder="-- Select Term --"
                                        label="Select Term"
                                    />
                                    {errors.term && <span className="text-xs text-red-500 mt-1 font-medium">{errors.term}</span>}
                                </div>
                            </div>
                        </div>

                        {/* SEQUENCE SELECTION TABLE INTEGRITY ERROR */}
                        {errors.sequence && (
                            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 font-semibold">{errors.sequence}</p>
                            </div>
                        )}

                        {selectedCurriculum && selectedCurriculum.value && (
                            <>
                                <hr className="my-4 border-t border-gray-300" />

                                {/* TABLE 1: AVAILABLE CURRICULUM SUBJECTS */}
                                <div className="px-4 py-3 rounded-t-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-700">
                                            Curriculum Master List
                                        </h3>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="px-3 py-2 border border-gray-300 rounded w-64 text-sm"
                                        value={generalOfferedFilterText}
                                        onChange={(e) => {
                                            setGeneralOfferedFilterText(e.target.value);
                                            setGeneralOfferedCurrentPage(1);
                                        }}
                                    />
                                </div>
                                <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">
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

                                {/* TABLE 2: SELECTED SEQUENCE PREVIEW */}
                                {selectedSequenceSubjects.length > 0 && (
                                    <div className="mt-8">
                                        <hr className="my-6 border-t-2 border-dashed border-gray-200" />
                                        <div className="px-4 py-2 flex justify-between items-center bg-gray-50 rounded-t-lg border border-b-0 border-gray-200">
                                            <div>
                                                <h3 className="text-md font-bold text-green-700 flex items-center gap-2">
                                                    <span>Template Sequence Preview</span>
                                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                        {selectedSequenceSubjects.length} Items Selected
                                                    </span>
                                                </h3>
                                                <p className="text-xs text-gray-500">This dictates the final sorting layout sequence in grade report generation.</p>
                                            </div>
                                        </div>
                                        <div className="w-full overflow-x-auto border border-gray-200 rounded-b-lg">
                                            <DataTable
                                                columns={sequenceColumns}
                                                data={selectedSequenceSubjects}
                                                highlightOnHover
                                                responsive
                                                pagination
                                                paginationRowsPerPageOptions={[5, 10, 15]}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                }
                size="w-[1000px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Submit", type: "green", onClick: handleOpenWarningModal, closeOnClick: false },
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
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={successModalTitle}
                body={<p>{successModalBody}</p>}
            />
            <ModalComponent
                isOpen={isPreviewModal}
                onClose={() => setIsPreviewModal(false)}
                title="Grade Report Template"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex gap-6">
                        <div className="w-full flex flex-col gap-2"> {/* Changed w-2/3 to w-full if you don't have side items */}
                            <label className="text-sm font-medium text-gray-600">Preview</label>
                            <div className="border rounded-lg shadow overflow-hidden flex-1">
                                {gradeReportTemplateLoading ? (
                                    <div className="flex items-center justify-center h-[50vh] text-gray-400">
                                        Loading template preview...
                                    </div>
                                ) : gradeReportTemplateData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${gradeReportTemplateData.PdfBase64}`}
                                        className="w-full h-[60vh]"
                                        title="Grade Report Template Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[50vh] text-gray-400">
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Download",
                        type: "green",
                        onClick: () => {
                            if (gradeReportTemplateData?.PdfBase64) {
                                const link = document.createElement("a");
                                link.href = `data:application/pdf;base64,${gradeReportTemplateData.PdfBase64}`;
                                // Changed naming to match template layout since it's not bound to a specific student
                                // link.download = `Grade_Report_Template_SY_${gradeReportTemplateData.schoolYear || "Preview"}.pdf`;
                                link.click();
                            }
                        },
                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsPreviewModal(false),
                    },
                ]}
                size="w-[1000px]"
                maxHeight="100vh"
            />
            {/* <ModalComponent
                isOpen={isPreviewModal}
                onClose={() => setIsPreviewModal(false)}
                title="Grade Report Template"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex gap-6">

                        <div className="w-2/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Preview</label>
                            <div className="border rounded-lg shadow overflow-hidden flex-1">
                                {religionWaverLoading ? (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        Loading preview...
                                    </div>
                                ) : religionWaverData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${religionWaverData.PdfBase64}`}
                                        className="w-full h-[40vh]"
                                        title="Test Permit Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Download",
                        type: "green",
                        onClick: () => {
                            if (religionWaverData?.PdfBase64) {
                                const link = document.createElement("a");
                                link.href = `data:application/pdf;base64,${religionWaverData.PdfBase64}`;
                                link.download = `${religionWaverData.Fname} ${religionWaverData.Mname ?? ""} ${religionWaverData.Lname}-Religion Waiver.pdf`;
                                link.click();
                            }
                        },
                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsReligionWaverModal(false),
                    },
                ]}
                size="w-[1000px]"
                maxHeight="100vh"
            /> */}
        </div>
    );
};

export default GradeReportTemplateComponent;