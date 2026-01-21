import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import RowToggleComponent from "../../components/ButtonsComponents/RowToggleComponent";
import {
    fetchTemplateTableData,
    fetchListOfUserData,
    fetchInsertTableOfFeesData,
    fetchInsertOrSeriesData,
} from "../../states/FinanceState/Action";
import useTemplateStore from "../../zustands/FinanceZustands/useTemplateStore";

const TemplateDataTable = ({ selectedStatus }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const currentUserId = user?.UserId;

    const [totalRecords, setTotalRecords] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);
    const [table, setTable] = useState([]);

    // users for dropdown
    const [listOfUsers, setListOfUsers] = useState([]);

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
            name: "Template Name",
            selector: (row) => row.TempTitle,
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

    const openRowModal = () => {
        alert("test");
    };

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
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState("");

    const validateForm = () => {
        let newErrors = {};

        if (templateType === "booklet") {
            bookletForm.orNumberList.forEach((row, i) => {
                if (!row.startNo.trim())
                    newErrors[`startNo-${i}`] = "Start No is required";
                if (!row.endNo.trim())
                    newErrors[`endNo-${i}`] = "End No is required";
                if (!row.userId)
                    newErrors[`userId-${i}`] = "User is required";
                if (!row.orType.trim())
                    newErrors[`orType-${i}`] = "OR Type is required";
            });
        }
        else {
            feesForm.feesChildForm.forEach((row, i) => {
                if (!row.transCode.trim())
                    newErrors[`transCode-${i}`] = "Transaction Code is required";
                if (!row.transType.trim())
                    newErrors[`transType-${i}`] = "Transaction Type is required";
                if (!row.transGroup)
                    newErrors[`usertransGroupId-${i}`] = "Transaction Group is required";
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const {
        isModalOpen,
        openModal,
        closeModal,
        templateType,
        setTemplateType,
        bookletForm,
        feesForm,
        setBookletFormField,
        setFeesFormField,
        updateBookletFormRow,
        updateFeesFormRow,
        addBookletFormRow,
        addFeesFormRow,
        deleteBookletFormRow,
        deleteFeesFormRow,
        setFileUpload,
        errors,
        setErrors,
    } = useTemplateStore();

    const openSubmitModal = () => {
        setIsSubmitModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        let payload = null;
        let res = null;
        setIsLoadingModalOpen(true);
        if (templateType == "fees") {
            payload = {
                TempName: feesForm.tempName,
                Remarks: feesForm.remarks,
                CreatedByUserId: currentUserId,
                FeesChildDtos: feesForm.feesChildForm.map(r => ({
                    TransCode: r.transCode,
                    TransType: r.transType,
                    TransGroup: r.transGroup,
                    Value: r.value,
                }))
            };
            res = await dispatch(fetchInsertTableOfFeesData(payload));
            if (res.ok) {
                setIsLoadingModalOpen(false);
                setIsSuccessModalOpen(true);
                setModalBody("Done saving the table of fees.");
                if (isSuccessModalOpen == false) {
                    setTimeout(() => window.location.reload(), 3000);
                }
            }
            else {
                setIsLoadingModalOpen(false);
                setIsErrorModalOpen(true);
            }
        }
        else {
            payload = {
                TempName: bookletForm.tempName,
                CreatedByUserId: currentUserId,
                OrSeriesBodyDtos: bookletForm.orNumberList.map(r => ({
                    StartNo: r.startNo,
                    EndNo: r.endNo,
                    UserId: r.userId,
                    OrType: r.orType,
                    Remarks: r.remarks
                }))
            };
            res = await dispatch(fetchInsertOrSeriesData(payload));
            if (res.ok) {
                setIsLoadingModalOpen(false);
                setIsSuccessModalOpen(true);
                setModalBody("Done saving the or number series.");
                if (isSuccessModalOpen == false) {
                    setTimeout(() => window.location.reload(), 3000);
                }
            }
            else {
                setIsLoadingModalOpen(false);
                setIsErrorModalOpen(true);
            }
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

            {/* modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={closeModal}
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
                                <option value="tuitionfee">
                                    Tuition Fee Table
                                </option>
                            </select>
                        </div>

                        {/* Table of Fees Template */}
                        {templateType === "fees" && (
                            <div>
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Name of Template</label>
                                        <input
                                            type="text"
                                            value={feesForm.tempName}
                                            placeholder="Enter name of template"
                                            onChange={(e) => setFeesFormField("tempName", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.tempName ? "border-red-500" : ""
                                                }`}
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm">{errors.tempName}</p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Remarks</label>
                                        <input
                                            type="text"
                                            value={feesForm.remarks}
                                            placeholder="Enter remarks"
                                            onChange={(e) => setFeesFormField("remarks", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.remarks ? "border-red-500" : ""
                                                }`}
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm">{errors.remarks}</p>
                                        )}
                                    </div>
                                </div>


                                {feesForm.feesChildForm.map((row, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 mb-2 items-end"
                                    >
                                        {/* Start No */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Transaction Code
                                            </label>
                                            <input
                                                type="text"
                                                value={row.transCode ?? ""}
                                                placeholder="Enter transaction code"
                                                onChange={(e) => updateFeesFormRow(index, "transCode", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`transCode-${index}`] ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {errors[`transCode-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`transCode-${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* End No */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Transaction Name
                                            </label>
                                            <input
                                                type="text"
                                                value={row.transType ?? ""}
                                                placeholder="Enter transaction name"
                                                onChange={(e) => updateFeesFormRow(index, "transType", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`transType-${index}`] ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {errors[`transType-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`transType-${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* ✅ User Dropdown */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Transaction Group
                                            </label>
                                            <input
                                                type="text"
                                                value={row.transGroup ?? ""}
                                                placeholder="Enter transaction group"
                                                onChange={(e) => updateFeesFormRow(index, "transGroup", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`transGroup-${index}`] ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {errors[`transGroup-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`transGroup-${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* OR Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Price/Value
                                            </label>
                                            <input
                                                type="text"
                                                value={row.value ?? ""}
                                                placeholder="Enter value"
                                                onChange={(e) => updateFeesFormRow(index, "value", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`value-${index}`] ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {errors[`value-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`value-${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <div className="flex justify-center items-center">
                                            {feesForm.feesChildForm.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteFeesFormRow(index)}
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
                                    onClick={addFeesFormRow}
                                    className="mt-2 px-3 py-1 rounded-lg bg-green-700 text-white text-md"
                                >
                                    + Add Row
                                </button>
                            </div>
                        )}
                        {templateType === "tuitionfee" && (
                            <div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Name of Template</label>
                                    <input
                                        type="text"
                                        value={bookletForm.tempName}
                                        placeholder="Enter name of template"
                                        onChange={(e) => setBookletFormField("tempName", e.target.value)}
                                        className={`w-full rounded-lg border p-2 ${errors.tempName ? "border-red-500" : ""
                                            }`}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm">{errors.tempName}</p>
                                    )}
                                </div>

                                {bookletForm.orNumberList.map((row, index) => (
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
                                                value={row.startNo ?? ""}
                                                placeholder="Enter start number of OR"
                                                onChange={(e) => updateBookletFormRow(index, "startNo", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`startNo-${index}`] ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {errors[`startNo-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`startNo-${index}`]}
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
                                                value={row.endNo ?? ""}
                                                placeholder="Enter end number of OR"
                                                onChange={(e) => updateBookletFormRow(index, "endNo", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`endNo-${index}`] ? "border-red-500" : ""
                                                    }`}
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
                                                value={row.userId ?? ""}
                                                onChange={(e) => updateBookletFormRow(index, "userId", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`userId-${index}`] ? "border-red-500" : ""
                                                    }`}
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
                                                value={row.orType ?? ""}
                                                onChange={(e) => updateBookletFormRow(index, "orType", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`orType-${index}`] ? "border-red-500" : ""
                                                    }`}
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
                                                value={row.remarks ?? ""}
                                                placeholder="Enter remarks"
                                                onChange={(e) => updateBookletFormRow(index, "remarks", e.target.value)}
                                                className="w-full rounded-lg border p-2"
                                            />
                                        </div>

                                        {/* Delete Button */}
                                        <div className="flex justify-center items-center">
                                            {bookletForm.orNumberList.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteBookletFormRow(index)}
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
                                    onClick={addBookletFormRow}
                                    className="mt-2 px-3 py-1 rounded-lg bg-green-700 text-white text-md"
                                >
                                    + Add Row
                                </button>
                            </div>
                        )}
                         {templateType === "booklet" && (
                            <div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Name of Template</label>
                                    <input
                                        type="text"
                                        value={bookletForm.tempName}
                                        placeholder="Enter name of template"
                                        onChange={(e) => setBookletFormField("tempName", e.target.value)}
                                        className={`w-full rounded-lg border p-2 ${errors.tempName ? "border-red-500" : ""
                                            }`}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm">{errors.tempName}</p>
                                    )}
                                </div>

                                {bookletForm.orNumberList.map((row, index) => (
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
                                                value={row.startNo ?? ""}
                                                placeholder="Enter start number of OR"
                                                onChange={(e) => updateBookletFormRow(index, "startNo", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`startNo-${index}`] ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {errors[`startNo-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`startNo-${index}`]}
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
                                                value={row.endNo ?? ""}
                                                placeholder="Enter end number of OR"
                                                onChange={(e) => updateBookletFormRow(index, "endNo", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`endNo-${index}`] ? "border-red-500" : ""
                                                    }`}
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
                                                value={row.userId ?? ""}
                                                onChange={(e) => updateBookletFormRow(index, "userId", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`userId-${index}`] ? "border-red-500" : ""
                                                    }`}
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
                                                value={row.orType ?? ""}
                                                onChange={(e) => updateBookletFormRow(index, "orType", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`orType-${index}`] ? "border-red-500" : ""
                                                    }`}
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
                                                value={row.remarks ?? ""}
                                                placeholder="Enter remarks"
                                                onChange={(e) => updateBookletFormRow(index, "remarks", e.target.value)}
                                                className="w-full rounded-lg border p-2"
                                            />
                                        </div>

                                        {/* Delete Button */}
                                        <div className="flex justify-center items-center">
                                            {bookletForm.orNumberList.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteBookletFormRow(index)}
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
                                    onClick={addBookletFormRow}
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
                        onClick: openSubmitModal,
                        // closeOnClick: false,
                    },
                    { label: "No", type: "red", closeOnClick: true },
                ]}
            />
            <ModalComponent
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Warning</span>}
                body="Are you sure you want to submit?"
                buttons={[
                    { label: "Yes", type: "green", onClick: handleSubmit },
                    { label: "No", type: "red" },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={modalBody}
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
                ]}
            />
            <ModalComponent
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Error</span>}
                body={"Something went wrong. Please try again."}
                buttons={[
                    { label: "Close", type: "red", onClick: () => setIsErrorModalOpen(false) }
                ]}
            />
            <ModalComponent
                isOpen={isLoadingModalOpen}
                onClose={() => { }} // prevent closing while loading
                title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                body={
                    <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span className="text-gray-600">Saving the template.</span>
                        <span className="text-gray-600">Please wait don't close this window.</span>
                    </div>
                }
                buttons={[]}
            />
        </div>
    );
};
export default TemplateDataTable;
