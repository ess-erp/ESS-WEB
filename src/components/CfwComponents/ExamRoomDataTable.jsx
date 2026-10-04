import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SchoolYearDropdown from '../ButtonsComponents/SchoolYearDropdown';
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import RowToggleComponent from '../../components/ButtonsComponents/RowToggleComponent';
import {
    fetchLevelData,
} from "../../states/AdmissionState/Action";
import {
    fetchInsertExamRoomData,
    fetchExamRoomTemplateData,
    fetchInsertExamScheduleData,
    fetchTemplateTableData,
} from "../../states/CfwState/Action";

const ExamRoomDataTable = ({ selectedStatus }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const currentUserId = user.UserId;

    const levelState = useSelector((state) => state.admission.levelState || {});
    const levelData = levelState.data || [];
    const insertExamRoomState = useSelector((state) => state.cfw.insertExamRoomState || {});
    const isInserted = insertExamRoomState.data || [];
    const examRoomTemplate = useSelector((state) => state.cfw.examRoomTemplate || {});
    const roomData = examRoomTemplate.data || [];
    // const templateTableState = useSelector((state) => state.cfw.templateTableState || {});
    // const templateTable = templateTableState.data.data || [];
    const [totalRecords, setTotalRecords] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);
    const [table, setTable] = useState([]);
    console.log(isInserted);

    console.log(levelData);
    console.log(roomData);
    useEffect(() => {
        dispatch(fetchLevelData());
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [selectedSchoolYear, setSelectedSchoolYear] = useState("");

    const fetchTemplates = async (selectedStatus, page = 1, pageSize = 10, search, schoolYear = "") => {
        setLoadingTable(true);

        const result = await dispatch(fetchTemplateTableData(selectedStatus, page, pageSize, search, schoolYear));

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
        fetchTemplates(selectedStatus, page, pageSize, search, selectedSchoolYear);
    }, [selectedStatus, page, pageSize, search, selectedSchoolYear, dispatch]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePerRowsChange = (newPerPage, newPage) => {
        setPageSize(newPerPage);
        setPage(newPage);
    };

    const columns = [
        {
            name: "Description",
            selector: (row) => row.Description,
            sortable: true,
            wrap: true,
        },
        {
            name: "Template Type",
            selector: (row) => row.TempType || "—",
            sortable: true,
        },
        {
            name: "Created by",
            selector: (row) => row.CreatedByFullname || "—",
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


    const handleToggleActive = async (selectedRow, newStatus) => {
        const CreatedByUserId = user.UserId;
        const activeStatus = newStatus ? "Y" : "DR";

        try {
            const result = await dispatch(fetchUpdateRowTemplateData(
                selectedRow.TemplateId,
                selectedRow.TempType,
                CreatedByUserId,
                activeStatus
            ));

            if (result.ok) {
                setTable(prev =>
                    prev.map(row =>
                        row.TemplateId === selectedRow.TemplateId
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


    const [isModalOpen, setIsModalOpen] = useState(false);

    // for template form 
    const [templateType, setTemplateType] = useState("");
    const [gradeRows, setGradeRows] = useState([{ grade: "" }]);
    const [errors, setErrors] = useState({});
    // end of template form

    const [roomForm, setRoomForm] = useState({
        description: "",
        campusId: "",
        rooms: [{ roomCode: "", roomName: "", remarks: "" }]
    });

    const [scheduleForm, setScheduleForm] = useState({
        description: "",
        roomTempId: "",
        noOfSlot: "",
        startDate: "",
        endDate: "",
        schedules: [{ levelId: "", startTime: "", endTime: "", remarks: "" }]
    });

    const handleRoomChange = (campusId) => {
        if (campusId) {
            dispatch(fetchExamRoomTemplateData(campusId));
        }
    };

    const handleScheduleRowChange = (index, field, value) => {
        const updated = [...scheduleForm.schedules];
        updated[index][field] = value;
        setScheduleForm((prev) => ({ ...prev, schedules: updated }));
    };
    const validateForm = () => {
        let newErrors = {};

        if (templateType === "room") {
            if (!roomForm.description.trim()) newErrors.description = "Description is required";
            if (!roomForm.campusId) newErrors.campus = "Campus is required";
            roomForm.rooms.forEach((r, i) => {
                if (!r.roomCode.trim()) newErrors[`roomCode-${i}`] = "Room Code is required";
                if (!r.roomName.trim()) newErrors[`roomName-${i}`] = "Room Name is required";
            });
        }

        if (templateType === "schedule") {
            if (!scheduleForm.description.trim()) newErrors.description = "Description is required";
            if (!scheduleForm.campusId) newErrors.campus = "Campus is required";
            if (!scheduleForm.roomTempId) newErrors.roomId = "Room is required";
            if (!scheduleForm.noOfSlot || isNaN(scheduleForm.noOfSlot)) {
                newErrors.noOfSlot = "Available slots must be a number";
            }
            if (!scheduleForm.startDate) newErrors.startDate = "Date From is required";
            if (!scheduleForm.endDate) newErrors.endDate = "Date To is required";
            if (scheduleForm.startDate && scheduleForm.endDate && scheduleForm.startDate > scheduleForm.endDate) {
                newErrors.endDate = "Date To must be after Date From";
            }
            scheduleForm.schedules.forEach((s, i) => {
                if (!s.levelId) newErrors[`level-${i}`] = "Level is required";
                if (!s.startTime) newErrors[`startTime-${i}`] = "Begin Time is required";
                if (!s.endTime) newErrors[`endTime-${i}`] = "Finish Time is required";
                if (!s.remarks || !s.remarks.trim()) newErrors[`remarks-${i}`] = "Remarks is required";
            });
        }

        if (templateType === "grade") {
            gradeRows.forEach((g, i) => {
                if (!g.grade.trim()) newErrors[`grade-${i}`] = "Grade is required";
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        if (templateType === "room") {
            console.log("Room Template Submitted:", roomForm);
            const payload = {
                Description: roomForm.description,
                CampusId: roomForm.campusId,
                CreatedByUserId: currentUserId,
                ExamRoomTemplateChildDtos: roomForm.rooms.map(r => ({
                    RoomCode: r.roomCode,
                    RoomName: r.roomName,
                    Remarks: r.remarks
                }))
            };
            dispatch(fetchInsertExamRoomData(payload));
        }
        if (templateType === "schedule") {
            console.log("Schedule Template Submitted:", scheduleForm);
            const payload = {
                Description: scheduleForm.description,
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
            console.log(payload);
            dispatch(fetchInsertExamScheduleData(payload));
        }
        if (templateType === "grade") {
            console.log("Grade Template Submitted:", gradeRows);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="bg-white shadow rounded-lg p-4">
            {/* top bar with title + search + add button */}
            <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-green-700">
                    List of {selectedStatus === "active" ? "Active" : "Draft"} Templates
                </span>

                <div className="flex items-center gap-2">
                    <OutlineBlueBtn
                        label="Add new"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus size={16} className="mr-1" />
                    </OutlineBlueBtn>
                    <SchoolYearDropdown
                        value={selectedSchoolYear}
                        onChange={(e) => {
                            setSelectedSchoolYear(e.target.value);
                            setPage(1);
                        }}
                    />
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
            {/* <ModalComponent
                isOpen={isOpenRowModal}
                onClose={() => setIsOpenRowModal(false)}
                title={rowModalTitle}
                body={
                    <div className="max-h-[80vh] overflow-auto">
                        <DataTable
                            columns={rowColumns}
                            data={rowTemplateTable}
                            progressPending={rowTemplateTableState.loading}
                            pagination
                            paginationServer
                            paginationTotalRows={rowTemplateTableState.data.totalRecords || 0}
                            onChangePage={handleRowPageChange}
                            onChangeRowsPerPage={handleRowPerRowsChange}
                            highlightOnHover
                            striped
                            responsive
                        />
                    </div>
                }
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
                ]}
                size="w-[800px]"
                maxHeight="100vh"
            /> */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
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
                                    <option value="room">Exam Room Template</option>
                                    <option value="schedule">Assign Exam Schedule Template</option>
                                </select>
                            </div>

                            {/* ========== ROOM TEMPLATE ========== */}
                            {templateType === "room" && (

                                <div>
                                    <div className="flex gap-4 mb-4">
                                        {/* Description */}
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <input
                                                type="text"
                                                value={roomForm.description}
                                                onChange={(e) =>
                                                    setRoomForm((prev) => ({ ...prev, description: e.target.value }))
                                                }
                                                className={`w-full rounded-lg border p-2 ${errors.description ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {errors.description && (
                                                <p className="text-red-500 text-sm">{errors.description}</p>
                                            )}
                                        </div>

                                        {/* Campus */}
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">Campus</label>
                                            <select
                                                value={roomForm.campusId}
                                                onChange={(e) =>
                                                    setRoomForm((prev) => ({ ...prev, campusId: e.target.value }))
                                                }
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
                                                    value={row.roomCode}
                                                    onChange={(e) => {
                                                        const updated = [...roomForm.rooms];
                                                        updated[index].roomCode = e.target.value;
                                                        setRoomForm((prev) => ({ ...prev, rooms: updated }));
                                                    }}
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
                                                    value={row.roomName}
                                                    onChange={(e) => {
                                                        const updated = [...roomForm.rooms];
                                                        updated[index].roomName = e.target.value;
                                                        setRoomForm((prev) => ({ ...prev, rooms: updated }));
                                                    }}
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
                                                    placeholder="Remarks"
                                                    value={row.remarks}
                                                    onChange={(e) => {
                                                        const updated = [...roomForm.rooms];
                                                        updated[index].remarks = e.target.value;
                                                        setRoomForm((prev) => ({ ...prev, rooms: updated }));
                                                    }}
                                                    className="w-full rounded-lg border p-2"
                                                />
                                            </div>

                                            {/* Delete Button */}
                                            <div className="flex justify-center items-center">
                                                {roomForm.rooms.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setRoomForm((prev) => ({
                                                                ...prev,
                                                                rooms: prev.rooms.filter((_, i) => i !== index),
                                                            }))
                                                        }
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
                                        onClick={() =>
                                            setRoomForm((prev) => ({
                                                ...prev,
                                                rooms: [...prev.rooms, { roomCode: "", roomName: "", remarks: "" }],
                                            }))
                                        }
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
                                                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                                value={scheduleForm.description}
                                                onChange={(e) =>
                                                    setScheduleForm({ ...scheduleForm, description: e.target.value })
                                                }
                                            />
                                            {errors.description && (
                                                <p className="text-red-500 text-sm">{errors.description}</p>
                                            )}
                                        </div>

                                        {/* Campus */}
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Campus
                                            </label>
                                            <select
                                                value={scheduleForm.campusId}
                                                onChange={(e) => {
                                                    setScheduleForm({ ...scheduleForm, campusId: e.target.value });
                                                    handleRoomChange(e.target.value); // pass campusId if needed
                                                }}
                                                className="w-full rounded-lg border p-2"
                                            >
                                                <option value="">-- Select Campus --</option>
                                                <option value="1">Las Pinas-Campus</option>
                                                <option value="2">South-Campus</option>
                                            </select>
                                            {errors.campus && (
                                                <p className="text-red-500 text-sm">{errors.campus}</p>
                                            )}
                                        </div>

                                        {/* Room */}
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Room
                                            </label>
                                            <select
                                                value={scheduleForm.roomTempId}
                                                onChange={(e) =>
                                                    setScheduleForm({ ...scheduleForm, roomTempId: e.target.value })
                                                }
                                                className="w-full rounded-lg border p-2"
                                            >
                                                <option value="">-- Select Room --</option>
                                                {roomData.map((d) => (
                                                    <option key={d.RoomTempId} value={d.RoomTempId}>
                                                        {d.RoomDescription}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.roomId && (
                                                <p className="text-red-500 text-sm">{errors.roomId}</p>
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
                                                className="w-full rounded-lg border p-2"
                                                value={scheduleForm.noOfSlot}
                                                onChange={(e) =>
                                                    setScheduleForm({ ...scheduleForm, noOfSlot: e.target.value })
                                                }
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
                                                className="w-full rounded-lg border p-2"
                                                value={scheduleForm.startDate}
                                                onChange={(e) =>
                                                    setScheduleForm({ ...scheduleForm, startDate: e.target.value })
                                                }
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
                                                className="w-full rounded-lg border p-2"
                                                value={scheduleForm.endDate}
                                                onChange={(e) =>
                                                    setScheduleForm({ ...scheduleForm, endDate: e.target.value })
                                                }
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
                                                    value={row.levelId || ""}
                                                    onChange={(e) =>
                                                        handleScheduleRowChange(index, "levelId", e.target.value)
                                                    }
                                                    className="w-full rounded-lg border p-2"
                                                >
                                                    <option value="">-- Select Level --</option>
                                                    {levelData.map((d) => (
                                                        <option key={d.LevelId} value={d.LevelId}>
                                                            {d.LevelName}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[`level-${index}`] && (
                                                    <p className="text-red-500 text-sm">{errors[`level-${index}`]}</p>
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
                                                    onChange={(e) =>
                                                        handleScheduleRowChange(index, "startTime", e.target.value)
                                                    }
                                                    className="w-full rounded-lg border p-2"
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
                                                    onChange={(e) =>
                                                        handleScheduleRowChange(index, "endTime", e.target.value)
                                                    }
                                                    className="w-full rounded-lg border p-2"
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
                                                    onChange={(e) =>
                                                        handleScheduleRowChange(index, "remarks", e.target.value)
                                                    }
                                                    className="w-full rounded-lg border p-2"
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
                                                        onClick={() =>
                                                            setScheduleForm((prev) => ({
                                                                ...prev,
                                                                schedules: prev.schedules.filter((_, i) => i !== index),
                                                            }))
                                                        }
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
                                        onClick={() =>
                                            setScheduleForm((prev) => ({
                                                ...prev,
                                                schedules: [...prev.schedules, { levelId: "", startTime: "", endTime: "", remarks: "" }],
                                            }))
                                        }
                                        className="mt-2 px-3 py-1 rounded-lg bg-green-700 text-white text-md"
                                    >
                                        + Add Row
                                    </button>
                                </div>
                            )}

                            {/* ========== GRADE TEMPLATE ========== */}
                            {templateType === "grade" && (
                                <div>
                                    {gradeRows.map((row, index) => (
                                        <div key={index} className="flex gap-2 mb-2 items-center">
                                            <input
                                                type="text"
                                                placeholder="Grade"
                                                value={row.grade}
                                                onChange={(e) => {
                                                    const updated = [...gradeRows];
                                                    updated[index].grade = e.target.value;
                                                    setGradeRows(updated);
                                                }}
                                                className="w-full rounded-lg border p-2"
                                            />
                                            {gradeRows.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setGradeRows(gradeRows.filter((_, i) => i !== index))
                                                    }
                                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setGradeRows([...gradeRows, { grade: "" }])}
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


        </div>
    );
};

export default ExamRoomDataTable;
