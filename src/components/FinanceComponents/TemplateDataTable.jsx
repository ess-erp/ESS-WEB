import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import RowToggleComponent from "../../components/ButtonsComponents/RowToggleComponent";
import { fetchLevelData } from "../../states/AdmissionState/Action";
import {
    fetchInsertExamRoomData,
    fetchExamRoomTemplateData,
    fetchInsertExamScheduleData,
    fetchTemplateTableData,
} from "../../states/CfwState/Action";
import {
    fetchListOfUserData,
    fetchInsertOrSeriesData,
} from "../../states/FinanceState/Action";

const TemplateDataTable = ({ selectedStatus }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const currentUserId = user?.UserId;

    const levelState = useSelector((state) => state.admission.levelState || {});
    const levelData = levelState.data || [];
    const insertExamRoomState = useSelector(
        (state) => state.cfw.insertExamRoomState || {}
    );
    const isInserted = insertExamRoomState.data || [];
    const examRoomTemplate = useSelector(
        (state) => state.cfw.examRoomTemplate || {}
    );
    const roomData = examRoomTemplate.data || [];

    const [totalRecords, setTotalRecords] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);
    const [table, setTable] = useState([]);

    // ✅ users for dropdown
    const [listOfUsers, setListOfUsers] = useState([]);

    useEffect(() => {
        dispatch(fetchLevelData());
    }, [dispatch]);

    const usersState = useSelector((state) => state.finance.listOfUserState || {});
    const usersData = usersState.data || [];

    useEffect(() => {
        dispatch(fetchListOfUserData());
    }, [dispatch]);

    // keep your dropdown controlled by Redux data
    useEffect(() => {
        setListOfUsers(usersData);
    }, [usersData]);


    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const fetchTemplates = async (
        selectedStatus,
        page = 1,
        pageSize = 10,
        search
    ) => {
        setLoadingTable(true);

        const result = await dispatch(
            fetchTemplateTableData(selectedStatus, page, pageSize, search)
        );

        if (result.ok) {
            const docsWithActive = (result.data || []).map((doc) => ({
                ...doc,
                isActive:
                    selectedStatus === "active" ? true : doc.isActive ?? false,
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
            selector: (row) =>
                row.DateCreated
                    ? new Date(row.DateCreated).toLocaleDateString()
                    : "—",
            sortable: true,
        },
        {
            name: "Date Modified",
            selector: (row) =>
                row.DateModified
                    ? new Date(row.DateModified).toLocaleDateString()
                    : "—",
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

                    <RowToggleComponent
                        row={row}
                        onToggle={handleToggleActive}
                    />
                </div>
            ),
            ignoreRowClick: true,
            width: "180px",
        },
    ];

    const handleToggleActive = async (selectedRow, newStatus) => {
        const CreatedByUserId = user.UserId;
        const activeStatus = newStatus ? "Y" : "DR";

        try {
            const result = await dispatch(
                fetchUpdateRowTemplateData(
                    selectedRow.TemplateId,
                    selectedRow.TempType,
                    CreatedByUserId,
                    activeStatus
                )
            );

            if (result.ok) {
                setTable((prev) =>
                    prev.map((row) =>
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

    // template form state
    const [templateType, setTemplateType] = useState("");
    const [gradeRows, setGradeRows] = useState([{ grade: "" }]);
    const [errors, setErrors] = useState({});

    // ✅ booklet form state (array of rows)
    const [bookletForm, setBookletForm] = useState([
        { startNo: "", endNo: "", userId: "", orType: "", remarks: "", createdByUserId: user.UserId },
    ]);

    const handleBookletFormChange = (index, field, value) => {
        const updated = [...bookletForm];
        updated[index][field] = value;
        setBookletForm(updated);
    };

    const handleAddBookletRow = () => {
        setBookletForm([
            ...bookletForm,
            { startNo: "", endNo: "", userId: "", orType: "", remarks: "", createdByUserId: user.UserId },
        ]);
    };

    const handleRemoveBookletRow = (index) => {
        setBookletForm(bookletForm.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        let newErrors = {};

        if (templateType === "booklet") {
            bookletForm.forEach((row, i) => {
                if (!row.startNo.trim())
                    newErrors[`startNo-${i}`] = "Start No is required";
                if (!row.endNo.trim())
                    newErrors[`endNo-${i}`] = "End No is required";
                if (!row.userId)
                    newErrors[`userId-${i}`] = "User is required";
                if (!row.orType.trim())
                    newErrors[`orType-${i}`] = "OR Type is required";
                if (!row.remarks.trim())
                    newErrors[`remarks-${i}`] = "Remarks is required";
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const payload = {
            orSeriesBodyDtos: bookletForm.map(row => ({
                startNo: row.startNo,
                endNo: row.endNo,
                userId: parseInt(row.userId, 10),
                orType: row.orType,
                remarks: row.remarks,
                createdByUserId: currentUserId?.toString() ?? "0"
            }))
        };

        console.log("Submitting payload:", payload);

        const result = await dispatch(fetchInsertOrSeriesData(payload));

        if (result.ok) {
            alert("OR Series inserted successfully!");
            setIsModalOpen(false);
            setBookletForm([{ startNo: "", endNo: "", userId: "", orType: "", remarks: "" }]);
        } else {
            alert("Error inserting OR Series: " + result.error);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4">
            {/* top bar with title + search + add button */}
            <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-green-700">
                    List of {selectedStatus === "active" ? "Active" : "Draft"}{" "}
                    Templates
                </span>

                <div className="flex items-center gap-2">
                    <OutlineBlueBtn
                        label="Add new"
                        onClick={() => setIsModalOpen(true)}
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

            {/* modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Template"
                body={
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
                                <option value="">
                                    -- Select Template Type --
                                </option>
                                <option value="fees">Table of fees</option>
                                <option value="booklet">
                                    Official Receipt Booklet
                                </option>
                            </select>
                        </div>

                        {/* ✅ Booklet Template */}
                        {templateType === "booklet" && (
                            <div>
                                {bookletForm.map((row, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-4 mb-2 items-end"
                                    >
                                        {/* Start No */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Start no.
                                            </label>
                                            <input
                                                type="text"
                                                value={row.startNo}
                                                onChange={(e) =>
                                                    handleBookletFormChange(
                                                        index,
                                                        "startNo",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border p-2"
                                            />
                                            {errors[`startNo-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                        `startNo-${index}`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* End No */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                End no.
                                            </label>
                                            <input
                                                type="text"
                                                value={row.endNo}
                                                onChange={(e) =>
                                                    handleBookletFormChange(
                                                        index,
                                                        "endNo",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border p-2"
                                            />
                                            {errors[`endNo-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`endNo-${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* ✅ User Dropdown */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                User
                                            </label>
                                            <select
                                                value={row.userId}
                                                onChange={(e) =>
                                                    handleBookletFormChange(
                                                        index,
                                                        "userId",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border p-2"
                                            >
                                                <option value="">
                                                    -- Select User --
                                                </option>
                                                {listOfUsers.map((u) => (
                                                    <option
                                                        key={u.UserId}
                                                        value={u.UserId}
                                                    >
                                                        {`${u.Fname || ""} ${u.Mname || ""} ${u.Lname || ""}`.replace(
                                                            /\s+/g,
                                                            " "
                                                        )}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[`userId-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`userId-${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* OR Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                OR Type
                                            </label>
                                            <select
                                                value={row.orType}
                                                onChange={(e) =>
                                                    handleBookletFormChange(index, "orType", e.target.value)
                                                }
                                                className="w-full rounded-lg border p-2"
                                            >
                                                <option value="">-- Select OR Type --</option>
                                                <option value="For Enrollment Purpose">For Enrollment Purpose</option>
                                                <option value="For Other Payment">For Other Payment</option>
                                            </select>
                                            {errors[`orType-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`orType-${index}`]}
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
                                                value={row.remarks}
                                                onChange={(e) =>
                                                    handleBookletFormChange(
                                                        index,
                                                        "remarks",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border p-2"
                                            />
                                            {errors[`remarks-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                        `remarks-${index}`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <div className="flex justify-center items-center">
                                            {bookletForm.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveBookletRow(
                                                            index
                                                        )
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
                                    onClick={handleAddBookletRow}
                                    className="mt-2 px-3 py-1 rounded-lg bg-green-700 text-white text-md"
                                >
                                    + Add Row
                                </button>
                            </div>
                        )}
                    </div>
                }
                size="w-[800px]"
                maxHeight="100vh"
                buttons={[
                    {
                        label: "Submit",
                        type: "green",
                        onClick: handleSubmit,
                        closeOnClick: false,
                    },
                    { label: "No", type: "red", closeOnClick: true },
                ]}
            />
        </div>
    );
};
export default TemplateDataTable;
