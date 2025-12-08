import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import RowToggleComponent from '../../components/ButtonsComponents/RowToggleComponent';
import {
    fetchTemplateTableData,
    fetchInsertTransmutationTableData,
    fetchInsertTransmutationBulkData,
    fetchInsertGeneralSubjectTableData,
    fetchGeneralSubjectTableData,
    fetchInsertExamSubjectData,
    fetchInsertExamRoomData,
    fetchExamRoomTemplateData,
    fetchInsertExamScheduleData,
    fetchTemplateRowModalData,
    fetchUpdateRowTemplateData,
} from "../../states/CfwState/Action";
import {
    fetchLevelData,
} from '../../states/AdmissionState/Action';
import useTemplateStore from "../../zustands/CFWZustands/useTemplateStore";

const TemplatesModalComponent = ({ selectedStatus }) => {


    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const currentUserId = user.UserId;

    const [totalRecords, setTotalRecords] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);
    const [table, setTable] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const roomDataState = useSelector((state) => state.cfw.examRoomTemplate || {});
    const roomData = roomDataState.data || [];

    const fetchTemplates = async (selectedStatus, page = 1, pageSize = 10, search) => {
        setLoadingTable(true);

        const result = await dispatch(fetchTemplateTableData(selectedStatus, page, pageSize, search));

        if (result.ok) {
            const docsWithActive = (result.data || []).map(doc => ({
                ...doc,
                isActive: selectedStatus === "active" ? true : doc.isActive ?? false,
            }));
            setTable(docsWithActive);
            setTotalRecords(result.totalRecords || 0);
        } else {
            console.error("Failed to fetch table data:", result.error);
            setTable([]);
        }

        setLoadingTable(false);
    };

    useEffect(() => {
        fetchTemplates(selectedStatus, page, pageSize, search);
    }, [selectedStatus, page, pageSize, dispatch]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePerRowsChange = (newPerPage, newPage) => {
        setPageSize(newPerPage);
        setPage(newPage);
    };

    const getTemplateTypeTitle = (type) => {
        switch (type) {
            case "TRANSMUTATION":
                return "Transmutation Table";
            case "EXAMCODESETTINGS":
                return "Examination Code Settings Table"; 
            case "EXAMSCHEDULE":
                return "Examination Schedule Table";
            case "GENERALSUBJECT":
                return "General Offered Subject Table";
            case "EXAMROOMTEMPLATE":
                return "Examination Room Template Table";
            default:
                return "—";
        }
    };
    const columns = [
        {
            name: "Template Name",
            selector: (row) => row.Description,
            sortable: true,
            wrap: true,
        },
        {
            name: "Template Type",
            selector: (row) => getTemplateTypeTitle(row.TempType),
            sortable: true,
        },
        {
            name: "Created by",
            selector: (row) => { if (!row.CreatedByFullname) return "—"; return row.CreatedByFullname.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); },
            sortable: true,
        },
        {
            name: "Date Created",
            selector: (row) => row.DateCreated ? new Date(row.DateCreated).toLocaleDateString() : "—",
            sortable: true,
        },
        {
            name: "Date Modified",
            selector: (row) => row.DateModified ? new Date(row.DateModified).toLocaleDateString() : "—",
            sortable: true,
        },
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

    const [selectedTempType, setSelectedTempType] = useState("");
    const [setTempType, setSelectedTempTypeTitle] = useState("");
    const [isRowModalOpen, setIsRowModalOpen] = useState(false);
    const [rowTitle, setRowTitle] = useState("");
    const [rowTable, setRowTable] = useState([]);
    const [rowTotalRecords, setRowTotalRecords] = useState(0);
    const [loadingRowTable, setLoadingRowTable] = useState(false);
    const [searchRow, setSearchRow] = useState("");
    const [rowPage, setRowPage] = useState(1);
    const [rowPageSize, setRowPageSize] = useState(10);
    const [currentTempId, setCurrentTempId] = useState(null);

    useEffect(() => {
        if (isRowModalOpen && selectedTempType) {
            loadRowTable();
        }
    }, [rowPage, rowPageSize, searchRow]);

    const openRowModal = async (row, status) => {
        console.log(row);
        console.log(status);
        console.log(searchRow);
        setCurrentTempId(row.TempId);
        setSelectedTempType(row.TempType);
        setRowTitle(row.Description);
        switch (row.TempType) {
            case "TRANSMUTATION":
                setSelectedTempTypeTitle("Transmutation Table");
                break;
            case "EXAMCODESETTINGS":
                setSelectedTempTypeTitle("Examination Code Settings Table");
                break;
            case "EXAMSCHEDULE":
                setSelectedTempTypeTitle("Examination Schedule Table");
                break;
            case "GENERALSUBJECT":
                setSelectedTempTypeTitle("General Offered Subject Table");
                break;
            case "EXAMROOMTEMPLATE":
                setSelectedTempTypeTitle("Examination Room Template Table");
                break;
        }
        setIsRowModalOpen(true);
        setRowPage(1);         // reset page on open
        setRowPageSize(10);
        setLoadingRowTable(true);
        await loadRowTable(row.TempId, row.TempType, 1, 10, searchRow);
        // const result = await dispatch(fetchTemplateRowModalData(row.TempId, row.TempType, rowPage, rowPageSize, searchRow));
        // if (result.ok) {
        //     setRowTable(result.data);
        //     setRowTotalRecords(result.totalRecords || 0);
        // }
        // else {
        //     setRowTable([]);
        // }
        // setLoadingRowTable(false);
    };

    const loadRowTable = async (
        tempIdParam = currentTempId,
        tempTypeParam = selectedTempType,
        pageParam = rowPage,
        pageSizeParam = rowPageSize,
        searchParam = searchRow
    ) => {
        setLoadingRowTable(true);

        const result = await dispatch(fetchTemplateRowModalData(
            tempIdParam,
            tempTypeParam,
            pageParam,
            pageSizeParam,
            searchParam
        ));

        if (result.ok) {
            setRowTable(result.data);
            setRowTotalRecords(result.totalRecords || 0);
        } else {
            setRowTable([]);
        }

        setLoadingRowTable(false);
    };
    const rowColumns = () => {
        switch (selectedTempType) {
            case "EXAMSCHEDULE":
                return [
                    { name: "Description", selector: (row) => row.Description || "—", wrap: true },
                    { name: "Examination Room", selector: (row) => row.ExamRoom || "—", wrap: true },
                    { name: (<div style={{ whiteSpace: "normal", width: "80px", textAlign: "center" }}>Number of Slot</div>), selector: (row) => row.NoOfSlot || "—", wrap: true },
                    { name: "Date From", selector: (row) => row.StartDate || "—", wrap: true },
                    { name: "Date To", selector: (row) => row.EndDate || "—", wrap: true },
                    { name: "Level", selector: (row) => row.LevelName || "—", wrap: true },
                    { name: "Begin Time", selector: (row) => row.StartTime || "—", wrap: true },
                    { name: "Finish Time", selector: (row) => row.EndTime || "—", wrap: true },
                    { name: "Created By", selector: (row) => { if (!row.CreatedByFullName) return "—"; return row.CreatedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Created", selector: (row) => new Date(row.DateCreated).toLocaleDateString() || "—", wrap: true },
                    { name: "Modified By", selector: (row) => { if (!row.ModifiedByFullName) return "—"; return row.ModifiedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Modified", selector: (row) => new Date(row.DateModified).toLocaleDateString() || "—", wrap: true },
                    { name: "Status", selector: (row) => row.ActiveStatus || "—", wrap: true },
                    { name: "Remarks", selector: (row) => row.Remarks || "—", wrap: true }
                ];
            case "EXAMCODESETTINGS":
                return [
                    { name: "Description", selector: (row) => row.TempName || "—", wrap: true },
                    { name: "General Offered Subjet Template Name", selector: (row) => row.GeneralSubjectTempName || "—", wrap: true },
                    { name: "Exam Code", selector: (row) => row.ExamCode || "—", wrap: true },
                    { name: "Campus", selector: (row) => row.CampusName || "—", wrap: true },
                    { name: "Level", selector: (row) => row.LevelName || "—", wrap: true },
                    { name: "Subject Code", selector: (row) => row.SubjectCode || "—", wrap: true },
                    { name: "Subject Name", selector: (row) => row.SubjectName || "—", wrap: true },
                    { name: "Number of Items", selector: (row) => row.NumberOfItem || "—", wrap: true },
                    { name: "Created By", selector: (row) => { if (!row.CreatedByFullName) return "—"; return row.CreatedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Created", selector: (row) => new Date(row.DateCreated).toLocaleDateString() || "—", wrap: true },
                    { name: "Modified By", selector: (row) => { if (!row.ModifiedByFullName) return "—"; return row.ModifiedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Modified", selector: (row) => new Date(row.DateModified).toLocaleDateString() || "—", wrap: true },
                    { name: "Remarks", selector: (row) => row.Remarks || "-", wrap: true },
                    { name: "Status", selector: (row) => row.ActiveStatus || "—", wrap: true },
                ];
            case "EXAMROOMTEMPLATE":
                return [
                    { name: "Description", selector: (row) => row.Description || "—", wrap: true },
                    { name: "Room Code", selector: (row) => row.RoomCode || "—", wrap: true },
                    { name: "Room Name", selector: (row) => row.RoomName || "—", wrap: true },
                    { name: "Campus", selector: (row) => row.CampusName || "—", wrap: true },
                    { name: "Remarks", selector: (row) => row.Remarks || "—", wrap: true },
                    { name: "Created By", selector: (row) => { if (!row.CreatedByFullName) return "—"; return row.CreatedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Created", selector: (row) => new Date(row.DateCreated).toLocaleDateString() || "—", wrap: true },
                    { name: "Modified By", selector: (row) => { if (!row.ModifiedByFullName) return "—"; return row.ModifiedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Modified", selector: (row) => new Date(row.DateModified).toLocaleDateString() || "—", wrap: true },
                    { name: "Status", selector: (row) => row.ActiveStatus || "—", wrap: true },
                ];
            case "GENERALSUBJECT":
                return [
                    { name: "Template Name", selector: (row) => row.TempName || "—", wrap: true },
                    { name: "Subject Code", selector: (row) => row.SubjectCode || "—", wrap: true },
                    { name: "Subject Name", selector: (row) => row.SubjectName || "—", wrap: true },
                    { name: "Campus", selector: (row) => row.CampusName || "—", wrap: true },
                    { name: "Remarks", selector: (row) => row.Remarks || "—", wrap: true },
                    { name: "Created By", selector: (row) => { if (!row.CreatedByFullName) return "—"; return row.CreatedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Created", selector: (row) => new Date(row.DateCreated).toLocaleDateString() || "—", wrap: true },
                    { name: "Modified By", selector: (row) => { if (!row.ModifiedByFullName) return "—"; return row.ModifiedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Modified", selector: (row) => new Date(row.DateModified).toLocaleDateString() || "—", wrap: true },
                    { name: "Status", selector: (row) => row.ActiveStatus || "—", wrap: true },
                ];
            case "TRANSMUTATION":
                return [
                    { name: "Template Name", selector: (row) => row.TempName || "—", wrap: true },
                    { name: "Total Score", selector: (row) => row.TotalScore || "—", wrap: true },
                    { name: "Score From", selector: (row) => row.ScoreFrom || "—", wrap: true },
                    { name: "Score To", selector: (row) => row.ScoreTo || "—", wrap: true },
                    { name: "Equivalent Grade", selector: (row) => row.EquivalentGrade || "—", wrap: true },
                    { name: "Campus", selector: (row) => row.CampusName || "—", wrap: true },
                    { name: "Created By", selector: (row) => { if (!row.CreatedByFullName) return "—"; return row.CreatedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Created", selector: (row) => new Date(row.DateCreated).toLocaleDateString() || "—", wrap: true },
                    { name: "Modified By", selector: (row) => { if (!row.ModifiedByFullName) return "—"; return row.ModifiedByFullName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }, wrap: true },
                    { name: "Date Modified", selector: (row) => new Date(row.DateModified).toLocaleDateString() || "—", wrap: true },
                    { name: "Status", selector: (row) => row.ActiveStatus || "—", wrap: true },
                    { name: "Remarks", selector: (row) => row.Remarks || "—", wrap: true }
                ];

        }
    };

    const handleRowPageChange = (newPage) => {
        setRowPage(newPage);
    };

    const handleRowPerRowsChange = (newPerPage, newPage) => {
        setRowPageSize(newPerPage);
        setRowPage(newPage);
    };
    // const rowColumns = [
    //     {
    //         name: "Template Name",
    //         selector: (row) => row.Description,
    //         sortable: true,
    //         wrap: true,
    //     },
    //     {
    //         name: "Template Type",
    //         selector: (row) => row.TempType || "—",
    //         sortable: true,
    //     },
    //     {
    //         name: "Created by",
    //         selector: (row) => row.CreatedByFullname || "—",
    //         sortable: true,
    //     },
    //     {
    //         name: "Date Created",
    //         selector: (row) => row.DateCreated ? new Date(row.DateCreated).toLocaleDateString() : "—",
    //         sortable: true,
    //     },
    //     {
    //         name: "Date Modified",
    //         selector: (row) => row.DateModified ? new Date(row.DateModified).toLocaleDateString() : "—",
    //         sortable: true,
    //     },
    // ];

    // const getRowModalData = (tempId, tempType, status) => {

    //     useEffect(() => {
    //         fetchTemplates(selectedStatus, page, pageSize, search);
    //     }, [selectedStatus, page, pageSize, dispatch]);



    //     const fetchTemplates = async (tempId, tempType, status, page = 1, pageSize = 10, searchRow) => {
    //         setLoadingTable(true);

    //         const result = await dispatch(fetchTemplateRowModalData(selectedStatus, page, pageSize, searchRow));

    //         if (result.ok) {
    //             setRowTable(result.data);
    //             setRowTotalRecords(result.totalRecords || 0);
    //         } else {
    //             console.error("Failed to fetch table data:", result.error);
    //             setRowTable([]);
    //         }

    //         setLoadingTable(false);
    //     };
    // }


    const handleToggleActive = async (selectedRow, newStatus) => {
        const CreatedByUserId = user.UserId;
        const activeStatus = newStatus ? "Y" : "DR";
        console.log(selectedRow);
        try {
            const result = await dispatch(fetchUpdateRowTemplateData(
                selectedRow.TempId,
                selectedRow.TempType,
                CreatedByUserId,
                activeStatus
            ));

            if (result.ok) {
                setTable(prev =>
                    prev.map(row =>
                        row.TempId === selectedRow.TempId
                            ? { ...row, isActive: newStatus }
                            : row
                    )
                );

                fetchTemplates(selectedStatus, page, pageSize, search);
            }
        } catch (error) {
            console.error("Error updating template:", error);
        }
    };

    const {
        isModalOpen,
        openModal,
        closeModal,
        templateType,
        setTemplateType,
        scoreForm,
        generalSubjectForm,
        //examSubjectForm,
        roomForm,
        scheduleForm,
        setScoreField,
        setGeneralSubjectField,
        // setExamSubjectField,
        setRoomFormField,
        setScheduleFormField,
        updateScoreRow,
        updateGeneralSubjectRow,
        //updateExamSubjectRow,
        updateRoomFormRow,
        updateScheduleFormRow,
        addScoreRow,
        addGeneralSubjectRow,
        //addExamSubjectRow,
        addRoomFormRow,
        addScheduleFormRow,
        deleteScoreRow,
        deleteGeneralSubjectRow,
        // deleteExamSubjectRow,
        deleteRoomFormRow,
        deleteScheduleFormRow,
        setFileUpload,
        errors,
        setErrors,
    } = useTemplateStore();

    const [genSubtotalRecords, setGenSubTotalRecords] = useState(0);
    const [genSubLoadingTable, setGenSubLoadingTable] = useState(false);
    const [genSubTable, setGenSubTable] = useState([]);

    const [genSubPage, setGenSubPage] = useState(1);
    const [genSubPageSize, setGenSubPageSize] = useState(10);
    const [genSubSearch, setGenSubSearch] = useState("");

    const [addedSubjects, setAddedSubjects] = useState([]);

    const fetchGeneralSubjectTemplates = async (selectedStatus, page = 1, pageSize = 10, search) => {
        setGenSubLoadingTable(true);

        const result = await dispatch(fetchGeneralSubjectTableData(selectedStatus, page, pageSize, search));

        if (result.ok) {
            const docsWithActive = (result.data || []).map(doc => ({
                ...doc,
                isActive: selectedStatus === "active" ? true : doc.isActive ?? false,
            }));
            setGenSubTable(docsWithActive);
            setGenSubTotalRecords(result.totalRecords || 0);
        } else {
            console.error("Failed to fetch table data:", result.error);
            setGenSubTable([]);
        }

        setGenSubLoadingTable(false);
    };

    useEffect(() => {
        fetchGeneralSubjectTemplates(selectedStatus, genSubPage, genSubPageSize, genSubSearch);
    }, [selectedStatus, genSubPage, genSubPageSize, genSubSearch]);

    const handleGenSubPageChange = (newPage) => {
        setGenSubPage(newPage);
    };

    const handleGenSubPerRowsChange = (newPerPage, newPage) => {
        setGenSubPageSize(newPerPage);
        setGenSubPage(newPage);
    };

    const genSubColumns = [
        {
            name: "Subject Code",
            selector: (row) => row.SubjectCode,
            sortable: true,
            wrap: true,
        },
        {
            name: "Subject Name",
            selector: (row) => row.SubjectName,
            sortable: true,
            wrap: true,
        },
        {
            name: "Remarks",
            selector: (row) => row.Remarks,
            sortable: true,
            wrap: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-4 items-center">
                    <button
                        className="p-1 text-green-600 hover:text-green-800"
                        onClick={() => handleAdd(row)}
                    >
                        {/* <Eye size={18} /> */}
                        Add
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "180px",
        }
    ];

    const handleAdd = (row) => {
        setAddedSubjects((prev) => [...prev, row]);
        setGenSubTable((prev) => prev.filter((r) => r.GenSubChildId !== row.GenSubChildId));
    };

    const handleRemove = (row) => {
        setAddedSubjects((prev) => prev.filter((r) => r.GenSubChildId !== row.GenSubChildId));
        setGenSubTable((prev) => [row, ...prev]);
    };

    // const handleItemCountChange = (row, value) => {
    //     setAddedSubjects((prev) =>
    //         prev.map((r) =>
    //             r.GenSubChildId === row.GenSubChildId
    //                 ? { ...r, NumberOfItems: value }
    //                 : r
    //         )
    //     );
    // };
    const handleItemCountChange = (row, value) => {
        setAddedSubjects(prev =>
            prev.map(r =>
                r.GenSubChildId === row.GenSubChildId
                    ? { ...r, NumberOfItems: value }
                    : r
            )
        );
    };

    const levelState = useSelector((state) => state.admission.levelState || {});
    const level = levelState.data || [];

    console.log(level);

    const [examSubjectForm, setExamSubjectForm] = useState({
        tempName: "",
        examCode: "",
        campusId: "",
        levelId: "",
    });
    const setExamSubjectField = (field, value) => {
        setExamSubjectForm((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        dispatch(fetchLevelData());
    }, [dispatch]);


    const addedColumns = [
        { name: "Subject Code", selector: (row) => row.SubjectCode },
        { name: "Subject Name", selector: (row) => row.SubjectName },
        {
            name: "Number of Items",
            cell: (row) => (
                <input
                    type="number"
                    min="0"
                    className="border-0 border-b border-gray-400 focus:border-blue-600 focus:ring-0 bg-transparent w-24 text-center outline-none"
                    value={row.NumberOfItems || ""}
                    onChange={(e) => handleItemCountChange(row, e.target.value)}
                />
            ),
            ignoreRowClick: true,
            center: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    onClick={() => handleRemove(row)}
                    className="text-red-600 hover:underline"
                >
                    Remove
                </button>
            ),
            ignoreRowClick: true,
            center: true,
        },
    ];

    const handleRoomChange = (campusId) => {
        dispatch(fetchExamRoomTemplateData(campusId));
    };

    console.log(addedSubjects);

    const validateForm = () => {
        let newErrors = {};
        if (templateType === "score") {
            if (!scoreForm.tempName.trim()) newErrors.tempName = "Template Name is required";
            if (!scoreForm.campusId) newErrors.campus = "Campus is required";
            if (!scoreForm.fileUpload === null) {
                scoreForm.scores.forEach((r, i) => {
                    if (!r.totalScore.trim()) newErrors[`totalScore-${i}`] = "Total Score is required";
                    if (!r.scoreFrom.trim()) newErrors[`scoreFrom-${i}`] = "Score From is required";
                    if (!r.scoreTo.trim()) newErrors[`scoreTo-${i}`] = "Score To is required";
                    if (!r.equivalent.trim()) newErrors[`equivalent-${i}`] = "Equivalent is required";
                });
            }

        }
        else if (templateType === "generalSubject") {
            console.log(generalSubjectForm);
            if (!generalSubjectForm.tempName.trim()) newErrors.tempName = "Template Name is required";
            generalSubjectForm.subjects.forEach((r, i) => {
                if (!r.subjectCode.trim()) newErrors[`subjectCode-${i}`] = "Subject Code is required";
                if (!r.subjectName.trim()) newErrors[`subjectName-${i}`] = "Subject Name is required";
            });
        }
        else if (templateType === "examSubject") {
            console.log(examSubjectForm);
            if (!examSubjectForm.tempName.trim()) newErrors.tempName = "Template Name is required";
            if (!examSubjectForm.examCode.trim()) newErrors.examCode = "Exam Code is required";
            if (!examSubjectForm.campusId.trim()) newErrors.campusId = "Campus name is required";
            if (!examSubjectForm.levelId.trim()) newErrors.levelId = "Level name is required";
        }
        else if (templateType === "room") {
            if (!roomForm.tempName.trim()) newErrors.tempName = "Description is required";
            if (!roomForm.campusId.trim()) newErrors.campusId = "Campus is required";
            roomForm.rooms.forEach((r, i) => {
                if (!r.roomCode.trim()) newErrors[`roomCode-${i}`] = "Room Code is required";
                if (!r.roomName.trim()) newErrors[`roomName-${i}`] = "Room Name is required";
            });
        }
        else if (templateType === "schedule") {
            if (!scheduleForm.tempName.trim()) newErrors.tempName = "Description is required";
            if (!scheduleForm.campusId.trim()) newErrors.campusId = "Campus is required";
            if (!scheduleForm.roomTempId.trim()) newErrors.roomTempId = "Examination Room is required";
            if (!scheduleForm.noOfSlot.trim()) newErrors.noOfSlot = "Available Slots is required";
            if (!scheduleForm.startDate == null) newErrors.startDate = "Date From is required";
            if (!scheduleForm.endDate == null) newErrors.endDate = "Date To is required";
            scheduleForm.schedules.forEach((r, i) => {
                if (!r.levelId.trim()) newErrors[`levelId-${i}`] = "Level is required";
                if (!r.startTime.trim()) newErrors[`startTime-${i}`] = "Begin Time is required";
                if (!r.endTime.trim()) newErrors[`endTime-${i}`] = "Finish Time is required";
            })
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);


    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (templateType === "transmutation") {
            if (!scoreForm.fileUpload) {
                // Case: No file uploaded → use ScoreFormChildDto
                const payload = {
                    TempName: scoreForm.tempName,
                    CampusId: scoreForm.campusId,
                    CreatedByUserId: currentUserId,
                    ScoreFormChildDto: scoreForm.scores.map(r => ({
                        ScoreFrom: r.scoreFrom,
                        ScoreTo: r.scoreTo,
                        Equivalent: r.equivalent,
                        Remarks: r.remarks
                    }))
                };
                console.log("Submitting with ScoreFormChildDto:", payload);
                // dispatch(fetchInsertExamRoomData(payload));
                const result = await dispatch(fetchInsertTransmutationTableData(payload));
                if (result.ok) {
                    closeModal();
                    setIsSuccessModalOpen(true);
                    setTimeout(() => window.location.reload(), 3000);
                } else {
                    alert("Error: " + result.error);
                }
            } else {
                // Case: File uploaded → send FileUpload payload
                const uploadPayload = {
                    TempName: scoreForm.tempName,
                    CampusId: scoreForm.campusId, // lowercase to match your scoreForm field
                    CreatedByUserId: currentUserId,
                    FileUpload: scoreForm.fileUpload
                };
                console.log("Submitting with FileUpload:", uploadPayload);

                // If backend expects FormData for file upload:
                const formData = new FormData();
                formData.append("TempName", uploadPayload.TempName);
                formData.append("CreatedByUserId", uploadPayload.CreatedByUserId);
                formData.append("CampusId", uploadPayload.CampusId);
                formData.append("FileUpload", uploadPayload.FileUpload);
                console.log(formData);
                for (let pair of formData.entries()) {
                    console.log(pair[0] + ": ", pair[1]);
                }
                const result = await dispatch(fetchInsertTransmutationBulkData(formData));
                // dispatch(fetchInsertExamRoomData(formData));
                if (result.ok) {
                    closeModal();
                    setIsSuccessModalOpen(true);
                    setTimeout(() => window.location.reload(), 3000);
                } else {
                    alert("Error: " + result.error);
                }

            }
        }
        else if (templateType === "generalSubject") {
            console.log(currentUserId);
            const payload = {
                TempName: generalSubjectForm.tempName,
                CreatedByUserId: currentUserId,
                GeneralSubjectChildDtos: generalSubjectForm.subjects.map(r => ({
                    SubjectCode: r.subjectCode,
                    SubjectName: r.subjectName,
                    Remarks: r.remarks
                }))
            };
            console.log("Submitting with ScoreFormChildDto:", payload);
            const result = await dispatch(fetchInsertGeneralSubjectTableData(payload));
            if (result.ok) {
                closeModal();
                setIsSuccessModalOpen(true);
                setTimeout(() => window.location.reload(), 3000);
            } else {
                alert("Error: " + result.error);
            }
        }
        else if (templateType === "examSubject") {
            console.log(currentUserId);
            console.log(addedSubjects);
            console.log(addedSubjects[0].GenSubid)
            const payload = {
                GenSubId: addedSubjects[0].GenSubId,
                TempName: examSubjectForm.tempName,
                ExamCode: examSubjectForm.examCode,
                CreatedByUserId: currentUserId,
                CampusId: examSubjectForm.campusId,
                LevelId: examSubjectForm.levelId,
                ExamSubjectChildDtos: addedSubjects.map(r => ({
                    GenSubChildId: r.GenSubChildId,
                    NumberOfItem: r.NumberOfItems || 0
                }))
            };
            console.log("Submitting with ExamSubjectDto:", payload);
            const result = await dispatch(fetchInsertExamSubjectData(payload));
            if (result.ok) {
                closeModal();
                setIsSuccessModalOpen(true);
                setTimeout(() => window.location.reload(), 3000);

            } else {
                alert("Error: " + result.error);
            }
        }
        else if (templateType == "room") {
            const payload = {
                Description: roomForm.tempName,
                CampusId: roomForm.campusId,
                CreatedByUserId: currentUserId,
                ExamRoomTemplateChildDtos: roomForm.rooms.map(r => ({
                    RoomCode: r.roomCode,
                    RoomName: r.roomName,
                    Remarks: r.remarks
                }))
            };
            console.log("Submiting roomForm: " + payload);
            const result = await dispatch(fetchInsertExamRoomData(payload));
            if (result.ok) {
                closeModal();
                setIsSuccessModalOpen(true);
                setTimeout(() => window.location.reload(), 3000);
            }
        }
        else if (templateType == "schedule") {
            const payload = {
                Description: scheduleForm.tempName,
                CampusId: scheduleForm.campusId,
                RoomTempId: scheduleForm.roomTempId,
                NoOfSlot: scheduleForm.noOfSlot,
                StartDate: scheduleForm.startDate,
                EndDate: scheduleForm.endDate,
                CreatedByUserId: currentUserId,
                ScheduleTempChildDtos: scheduleForm.schedules.map(r => ({
                    LevelId: r.levelId,
                    StartTime: r.startTime,
                    EndTime: r.endTime,
                    Remarks: r.remarks
                }))
            };
            console.log('Submitting Exam Schedule Template:' + payload);
            console.log("Submiting roomForm: " + payload);
            const result = await dispatch(fetchInsertExamScheduleData(payload));
            if (result.ok) {
                closeModal();
                setIsSuccessModalOpen(true);
                setTimeout(() => window.location.reload(), 3000);
            }
        }
    };


    return (
        <>
            <div className="bg-white shadow rounded-lg p-4">
                {/* top bar with title + search + add button */}
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg text-green-700">
                        List of {selectedStatus === "active" ? "Active" : "Draft"} Templates
                    </span>

                    <div className="flex items-center gap-2">
                        <OutlineBlueBtn
                            label="Add new"
                            onClick={openModal}
                        >
                            <Plus size={16} className="mr-1" />
                        </OutlineBlueBtn>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring focus:ring-blue-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* data table */}
                <DataTable
                    columns={columns}
                    data={table}
                    progressPending={loadingTable}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRecords}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowsChange}
                    highlightOnHover
                    striped
                    responsive
                />
                <ModalComponent
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title="Add New Template"
                    body={
                        <>
                            <div className="max-h-[70vh] overflow-y-auto p-2 space-y-4">
                                <div className="text-center">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Select Template Type
                                    </label>
                                    <select
                                        value={templateType}
                                        onChange={(e) => setTemplateType(e.target.value)}
                                        className="mt-1 w-1/2 mx-auto rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Select Template Type --</option>
                                        <option value="transmutation">Transmutation Table</option>
                                        <option value="generalSubject">General List of Subjects</option>
                                        <option value="examSubject">Exam Subject Settings</option>
                                        <option value="room">Exam Room Template</option>
                                        <option value="schedule">Assign Exam Schedule Template</option>
                                    </select>
                                </div>

                                {templateType === "transmutation" && (

                                    <div>
                                        <div className="flex gap-4 mb-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Name of template</label>
                                                <input
                                                    type="text"
                                                    value={scoreForm.tempName}
                                                    placeholder="Name of template"
                                                    onChange={(e) => setScoreField("tempName", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.tempName ? "border-red-500" : ""
                                                        }`}
                                                />
                                                {errors.tempName && (
                                                    <p className="text-red-500 text-sm">{errors.tempName}</p>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Campus</label>
                                                <select
                                                    value={scoreForm.campusId}
                                                    onChange={(e) => setScoreField("campusId", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.campus ? "border-red-500" : ""
                                                        }`}
                                                >
                                                    <option value="">-- Select Campus --</option>
                                                    <option value="1">Las Pinas-Campus</option>
                                                    <option value="2">South-Campus</option>
                                                </select>
                                                {errors.campus && (
                                                    <p className="text-red-500 text-sm">{errors.campus}</p>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Upload Batch</label>
                                                <input
                                                    type="file"
                                                    accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                    onChange={(e) => setFileUpload(e.target.files?.[0] || null)}
                                                    className="w-full rounded-lg border p-2"
                                                />
                                            </div>
                                        </div>
                                        {scoreForm.scores.map((row, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 mb-2 items-end"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Total Score
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Total Score"
                                                        value={row.scoreFrom}
                                                        onChange={(e) => updateScoreRow(index, "totalScore", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`totalScore-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`totalScore-${index}`] && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors[`totalScore-${index}`]}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Score From
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Score From"
                                                        value={row.scoreFrom}
                                                        onChange={(e) => updateScoreRow(index, "scoreFrom", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`scoreFrom-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`scoreFrom-${index}`] && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors[`scoreFrom-${index}`]}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Score To
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Score To"
                                                        value={row.scoreTo}
                                                        onChange={(e) => updateScoreRow(index, "scoreTo", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`scoreTo-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`scoreTo-${index}`] && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors[`scoreTo-${index}`]}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Equivalent Grade
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Equivalent Grade"
                                                        value={row.equivalent}
                                                        onChange={(e) => updateScoreRow(index, "equivalent", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`equivalent-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`equivalent-${index}`] && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors[`equivalent-${index}`]}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Remarks
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Remarks"
                                                        value={row.remarks}
                                                        onChange={(e) => updateScoreRow(index, "remarks", e.target.value)}
                                                        className="w-full rounded-lg border p-2"
                                                    />
                                                </div>
                                                <div className="flex justify-center items-center">
                                                    {scoreForm.scores.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteScoreRow(index)}
                                                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addScoreRow}
                                            className="mt-2 px-3 py-1 rounded-lg bg-green-700 text-white text-md"
                                        >
                                            + Add Row
                                        </button>
                                    </div>
                                )}

                                {templateType === "generalSubject" && (
                                    <div>
                                        <div className="flex gap-4 mb-4">

                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Name of template</label>
                                                <input
                                                    type="text"
                                                    placeholder="Name of template"
                                                    value={generalSubjectForm.tempName}
                                                    onChange={(e) => setGeneralSubjectField("tempName", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.tempName ? "border-red-500" : ""
                                                        }`}
                                                />
                                                {errors.tempName && (
                                                    <p className="text-red-500 text-sm">{errors.tempName}</p>
                                                )}
                                            </div>
                                        </div>
                                        {generalSubjectForm.subjects.map((row, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-2 items-end"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Subject Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Subject Code"
                                                        value={row.subjectCode}
                                                        onChange={(e) => updateGeneralSubjectRow(index, "subjectCode", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`subjectCode-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`subjectCode-${index}`] && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors[`subjectCode-${index}`]}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Subject Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Subject Name"
                                                        value={row.subjectName}
                                                        onChange={(e) => updateGeneralSubjectRow(index, "subjectName", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`subjectName-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`subjectName-${index}`] && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors[`subjectName-${index}`]}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Remarks
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Remarks"
                                                        value={row.remarks}
                                                        onChange={(e) => updateGeneralSubjectRow(index, "remarks", e.target.value)}
                                                        className="w-full rounded-lg border p-2"
                                                    />
                                                </div>
                                                <div className="flex justify-center items-center">
                                                    {generalSubjectForm.subjects.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteGeneralSubjectRow(index)}
                                                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addGeneralSubjectRow}
                                            className="mt-2 px-3 py-1 rounded-lg bg-green-700 text-white text-md"
                                        >
                                            + Add Row
                                        </button>
                                    </div>
                                )}

                                {templateType === "examSubject" && (
                                    <div>
                                        <div className="w-full overflow-x-auto">
                                            <DataTable
                                                columns={genSubColumns}
                                                data={genSubTable}
                                                progressPending={genSubLoadingTable}
                                                pagination
                                                paginationServer
                                                paginationTotalRows={genSubtotalRecords}
                                                onChangePage={handleGenSubPageChange}
                                                onChangeRowsPerPage={handleGenSubPerRowsChange}
                                                highlightOnHover
                                                striped
                                                responsive
                                            />
                                        </div>

                                        <hr className="my-4 border-t border-gray-300" />

                                        <h2 className="my-4 text-xl font-bold text-green-500">
                                            List of Added Subjects
                                        </h2>
                                        <div className="flex gap-4 mb-4">

                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Name of template</label>
                                                <input
                                                    type="text"
                                                    value={examSubjectForm.tempName}
                                                    placeholder="Name of template"
                                                    onChange={(e) => setExamSubjectField("tempName", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.tempName ? "border-red-500" : ""
                                                        }`}
                                                />
                                                {errors.tempName && (
                                                    <p className="text-red-500 text-sm">{errors.tempName}</p>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Exam Code</label>
                                                <input
                                                    type="text"
                                                    value={examSubjectForm.examCode}
                                                    placeholder="Exam Code"
                                                    onChange={(e) => setExamSubjectField("examCode", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.examCode ? "border-red-500" : ""
                                                        }`}
                                                />
                                                {errors.examCode && (
                                                    <p className="text-red-500 text-sm">{errors.examCode}</p>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Campus</label>
                                                <select
                                                    value={examSubjectForm.campusId}
                                                    onChange={(e) => setExamSubjectField("campusId", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.campusId ? "border-red-500" : ""
                                                        }`}
                                                >
                                                    <option value="">-- Select Campus --</option>
                                                    <option value="1">Las Pinas-Campus</option>
                                                    <option value="2">South-Campus</option>
                                                </select>
                                                {errors.campusId && (
                                                    <p className="text-red-500 text-sm">{errors.campusId}</p>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Level</label>
                                                <select
                                                    value={examSubjectForm.LevelId || ""} // ✅ change to match your level field
                                                    onChange={(e) => setExamSubjectField("levelId", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.LevelId ? "border-red-500" : ""
                                                        }`}
                                                >
                                                    <option value="">-- Select Level --</option>
                                                    {level.map((lvl) => (
                                                        <option key={lvl.LevelId} value={lvl.LevelId}>
                                                            {lvl.LevelName}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.LevelId && (
                                                    <p className="text-red-500 text-sm">{errors.LevelId}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full overflow-x-auto mb-4">
                                            <DataTable
                                                columns={addedColumns}
                                                data={addedSubjects}
                                                highlightOnHover
                                                striped
                                                responsive
                                                dense
                                                noDataComponent="No subjects added yet"
                                            />
                                        </div>
                                    </div>

                                )}

                                {/* ========== ROOM TEMPLATE ========== */}
                                {templateType === "room" && (

                                    <div>
                                        <div className="flex gap-4 mb-4">
                                            {/* Description */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                <input
                                                    type="text"
                                                    placeholder="Name of template"
                                                    value={roomForm.tempName}
                                                    onChange={(e) => setRoomFormField("tempName", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.tempName ? "border-red-500" : ""
                                                        }`}
                                                />
                                                {errors.tempName && (
                                                    <p className="text-red-500 text-sm">{errors.tempName}</p>
                                                )}
                                            </div>

                                            {/* Campus */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Campus</label>
                                                <select
                                                    value={roomForm.campusId}
                                                    onChange={(e) => setRoomFormField("campusId", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.campusId ? "border-red-500" : ""
                                                        }`}
                                                >
                                                    <option value="">-- Select Campus --</option>
                                                    <option value="1">Las Pinas-Campus</option>
                                                    <option value="2">South-Campus</option>
                                                </select>
                                                {errors.campusId && (
                                                    <p className="text-red-500 text-sm">{errors.campusId}</p>
                                                )}
                                            </div>
                                        </div>
                                        {roomForm.rooms.map((row, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-2 items-end"
                                            >
                                                {/* Room Code */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Room Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={row.roomForm}
                                                        placeholder="Enter Room Code"
                                                        onChange={(e) => updateRoomFormRow(index, "roomCode", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`roomCode-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`roomCode-${index}`] && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors[`roomCode-${index}`]}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Room Name */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Room Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={row.roomForm}
                                                        placeholder="Enter Room Name"
                                                        onChange={(e) => updateRoomFormRow(index, "roomName", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`roomName-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`roomName-${index}`] && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors[`roomName-${index}`]}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Remarks */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Remarks
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Remarks"
                                                        value={row.roomForm}
                                                        onChange={(e) => updateRoomFormRow(index, "remarks", e.target.value)}
                                                        className="w-full rounded-lg border p-2"
                                                    />
                                                </div>

                                                {/* Delete Button */}
                                                <div className="flex justify-center items-center">
                                                    {roomForm.rooms.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteRoomFormRow(index)}
                                                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addRoomFormRow}
                                            className="mt-2 px-3 py-1 rounded-lg bg-green-700 text-white text-md"
                                        >
                                            + Add Row
                                        </button>
                                    </div>
                                )}

                                {/* ========== SCHEDULE TEMPLATE ========== */}
                                {templateType === "schedule" && (
                                    <div>
                                        <div className="flex gap-4 mb-4">
                                            {/* Description */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Description
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Description"
                                                    value={scheduleForm.tempName}
                                                    onChange={(e) => setScheduleFormField("tempName", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.tempName ? "border-red-500" : ""
                                                        }`}
                                                />
                                                {errors.tempName && (
                                                    <p className="text-red-500 text-sm">{errors.tempName}</p>
                                                )}
                                            </div>

                                            {/* Campus */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Campus
                                                </label>
                                                <select
                                                    value={scheduleForm.campusId}
                                                    // onChange={(e) => setScheduleFormField("campusId", e.target.value)}
                                                    onChange={(e) => {
                                                        const campusId = e.target.value;

                                                        // 1. Update Zustand field
                                                        setScheduleFormField("campusId", campusId);

                                                        // 2. Trigger room fetch
                                                        handleRoomChange(campusId);
                                                    }}
                                                    className={`w-full rounded-lg border p-2 ${errors.campusId ? "border-red-500" : ""
                                                        }`}
                                                >
                                                    <option value="">-- Select Campus --</option>
                                                    <option value="1">Las Pinas-Campus</option>
                                                    <option value="2">South-Campus</option>
                                                </select>
                                                {errors.campusId && (
                                                    <p className="text-red-500 text-sm">{errors.campusId}</p>
                                                )}
                                            </div>

                                            {/* Room */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Examination Room
                                                </label>
                                                <select
                                                    value={scheduleForm.roomTempId}
                                                    onChange={(e) => setScheduleFormField("roomTempId", e.target.value)}
                                                    className={`w-full rounded-lg border p-2 ${errors.roomTempId ? "border-red-500" : ""
                                                        }`}
                                                >
                                                    <option value="">-- Select Examination Room --</option>
                                                    {roomData.map((d) => (
                                                        <option key={d.RoomTempId} value={d.RoomTempId}>
                                                            {d.RoomDescription}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.roomTempId && (
                                                    <p className="text-red-500 text-sm">{errors.roomTempId}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mb-4">
                                            {/* Available Slots */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Available Slots
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter number of slots"
                                                    className={`w-full rounded-lg border p-2 ${errors.noOfSlot ? "border-red-500" : ""
                                                        }`}
                                                    value={scheduleForm.noOfSlot}
                                                    onChange={(e) => setScheduleFormField("noOfSlot", e.target.value)}
                                                />
                                                {errors.noOfSlot && (
                                                    <p className="text-red-500 text-sm">{errors.noOfSlot}</p>
                                                )}
                                            </div>

                                            {/* Date From */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Date From
                                                </label>
                                                <input
                                                    type="date"
                                                    className={`w-full rounded-lg border p-2 ${errors.startDate ? "border-red-500" : ""
                                                        }`}
                                                    value={scheduleForm.startDate}
                                                    onChange={(e) => setScheduleFormField("startDate", e.target.value)}
                                                />
                                                {errors.startDate && (
                                                    <p className="text-red-500 text-sm">{errors.startDate}</p>
                                                )}
                                            </div>

                                            {/* Date To */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Date To
                                                </label>
                                                <input
                                                    type="date"
                                                    className={`w-full rounded-lg border p-2 ${errors.endDate ? "border-red-500" : ""
                                                        }`}
                                                    value={scheduleForm.endDate}
                                                    onChange={(e) => setScheduleFormField("endDate", e.target.value)}
                                                />
                                                {errors.endDate && (
                                                    <p className="text-red-500 text-sm">{errors.endDate}</p>
                                                )}
                                            </div>
                                        </div>

                                        <hr className="border-t-1 border-solid border-gray-400 my-6" />

                                        {/* Dynamic Rows */}
                                        {scheduleForm.schedules.map((row, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 mb-2 items-end"
                                            >
                                                {/* Level */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Level
                                                    </label>
                                                    <select
                                                        value={row.levelId}
                                                        onChange={(e) => updateScheduleFormRow(index, "levelId", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`levelId-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    >
                                                        <option value="">-- Select Level --</option>
                                                        {level.map((d) => (
                                                            <option key={d.LevelId} value={d.LevelId}>
                                                                {d.LevelName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors[`levelId-${index}`] && (
                                                        <p className="text-red-500 text-sm">{errors[`levelId-${index}`]}</p>
                                                    )}
                                                </div>

                                                {/* Begin Time */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Begin Time
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={row.startTime}
                                                        onChange={(e) => updateScheduleFormRow(index, "startTime", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`startTime-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`startTime-${index}`] && (
                                                        <p className="text-red-500 text-sm">{errors[`startTime-${index}`]}</p>
                                                    )}
                                                </div>
                                                {/* Finish Time */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Finish Time
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={row.endTime}
                                                        onChange={(e) => updateScheduleFormRow(index, "endTime", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`endTime-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`endTime-${index}`] && (
                                                        <p className="text-red-500 text-sm">{errors[`endTime-${index}`]}</p>
                                                    )}
                                                </div>

                                                {/* Remarks */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Remarks
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Remarks"
                                                        value={row.remarks}
                                                        onChange={(e) => updateScheduleFormRow(index, "remarks", e.target.value)}
                                                        className={`w-full rounded-lg border p-2 ${errors[`remarks-${index}`] ? "border-red-500" : ""
                                                            }`}
                                                    />
                                                    {errors[`remarks-${index}`] && (
                                                        <p className="text-red-500 text-sm">{errors[`remarks-${index}`]}</p>
                                                    )}
                                                </div>

                                                {/* Delete Button */}
                                                <div className="flex justify-center items-center">
                                                    {scheduleForm.schedules.length > 1 && (
                                                        <button
                                                            type="button"
                                                            // onClick={() =>
                                                            //     setScheduleForm((prev) => ({
                                                            //         ...prev,
                                                            //         schedules: prev.schedules.filter((_, i) => i !== index),
                                                            //     }))
                                                            // }
                                                            onClick={() => deleteScheduleFormRow(index)}
                                                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add Row */}
                                        <button
                                            type="button"
                                            // onClick={() =>
                                            //     setScheduleForm((prev) => ({
                                            //         ...prev,
                                            //         schedules: [...prev.schedules, { levelId: "", startTime: "", endTime: "", remarks: "" }],
                                            //     }))
                                            // }
                                            onClick={addScheduleFormRow}
                                            className="mt-2 px-3 py-1 rounded-lg bg-green-700 text-white text-md"
                                        >
                                            + Add Row
                                        </button>
                                    </div>
                                )}
                            </div>

                        </>
                    }
                    size="w-[800px]"
                    maxHeight="100vh"
                    buttons={[
                        { label: "Submit", type: "green", onClick: handleSubmit, closeOnClick: false },
                        { label: "No", type: "red", closeOnClick: true },
                    ]}
                />
                <ModalComponent
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title={<span className="font-bold text-lg text-green-700">Success</span>}
                    body={<p>Your template has been inserted successfully!</p>}
                // buttons={[
                //     { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
                // ]}
                />
                <ModalComponent
                    isOpen={isRowModalOpen}
                    onClose={() => setIsRowModalOpen(false)}
                    title={<span className="font-bold text-lg text-blue-700">{setTempType}</span>}
                    body={
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-lg text-green-700">
                                    Template of {rowTitle}
                                </span>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring focus:ring-blue-300"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* <div className="flex justify-end mb-2">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring focus:ring-blue-300"
                                    value={searchRow}
                                    onChange={(e) => setSearchRow(e.target.value)}
                                />
                            </div> */}

                            <DataTable
                                columns={rowColumns()}
                                data={rowTable}
                                progressPending={loadingRowTable}
                                pagination
                                paginationServer
                                paginationTotalRows={rowTotalRecords}
                                onChangePage={handleRowPageChange}
                                onChangeRowsPerPage={handleRowPerRowsChange}
                                highlightOnHover
                                striped
                                responsive
                            />
                        </>
                    }
                    size="w-[800px]"
                    maxHeight="100vh"
                    buttons={[
                        { label: "OK", type: "green", onClick: () => setIsRowModalOpen(false) }
                    ]}
                />
            </div>
        </>
    );
};

export default TemplatesModalComponent;