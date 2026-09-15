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
    fetchInsertTuitioFeeData,
    fetchInsertMiscellaneousData,
} from "../../states/FinanceState/Action";
import {
    fetchLevelData,
} from "../../states/AdmissionState/Action";
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
    const levelState = useSelector((state) => state.admission.levelState || {});
    const level = levelState.data || [];


    useEffect(() => {
        dispatch(fetchListOfUserData());
        dispatch(fetchLevelData());
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
            // TODO: implement fetchUpdateRowTemplateData in FinanceState/Action.js
            console.warn("fetchUpdateRowTemplateData not yet implemented");
            return;

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


    const {
        isModalOpen,
        openModal,
        closeModal,
        templateType,
        setTemplateType,
        bookletForm,
        feesForm,
        tuitionForm,
        setBookletFormField,
        setFeesFormField,
        setTuitionFormField,
        updateBookletFormRow,
        updateFeesFormRow,
        addBookletFormRow,
        addFeesFormRow,
        deleteBookletFormRow,
        deleteFeesFormRow,
        errors,
        setErrors,
        miscForm,
        setMiscFormField,
        addMiscRow,
        deleteMiscRow,
        updateMiscRow,
        updateMiscAmount,
    } = useTemplateStore();

    const openSubmitModal = () => {
        // const isValid = validateForm();
        // if (!isValid) return;
        if (!validateForm())
            return;
        setIsSubmitModalOpen(true);
    };

    // 
    const validateForm = () => {
        let newErrors = {};
        console.log("TEMPLATE:", templateType);
        switch (templateType) {
            case "booklet":
                bookletForm.orNumberList.forEach((row, i) => {
                    if (!row.startNo?.trim())
                        newErrors[`startNo-${i}`] = "Start No is required";
                    if (!row.endNo?.trim())
                        newErrors[`endNo-${i}`] = "End No is required";
                    if (!row.userId)
                        newErrors[`userId-${i}`] = "User is required";
                    if (!row.orType?.trim())
                        newErrors[`orType-${i}`] = "OR Type is required";
                });
                break;

            case "fees":
                feesForm.feesChildForm.forEach((row, i) => {
                    if (!row.transCode?.trim())
                        newErrors[`transCode-${i}`] = "Transaction Code is required";
                    if (!row.transType?.trim())
                        newErrors[`transType-${i}`] = "Transaction Type is required";
                    if (!row.transGroup)
                        newErrors[`transGroup-${i}`] = "Transaction Group is required";
                });
                break;

            case "miscellaneous":
                if (!miscForm.tempName?.trim())
                    newErrors["miscTempName"] = "Template name is required";
                if (!miscForm.schoolYear?.trim())
                    newErrors["miscSchoolYear"] = "School year is required";
                if (miscForm.rows.length === 0)
                    newErrors["miscRows"] = "Add at least one fee item";
                miscForm.rows.forEach((row, i) => {
                    if (!row.feeName?.trim())
                        newErrors[`miscFeeName-${i}`] = "Fee name is required";
                });
                break;
            case "tuitionfee":
                if (!tuitionForm.tempName?.trim())
                    newErrors["tempName"] = "Name of template is required";
                if (!tuitionForm.levelId)
                    newErrors["levelId"] = "Please select target level";
                //plan a
                if (!tuitionForm.amountA)
                    newErrors["amountA"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentA)
                    newErrors["dateOfPaymentA"] = "Please enter date of payment";

                //plan b
                if (!tuitionForm.amountB1)
                    newErrors["amountB1"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentB1)
                    newErrors["dateOfPaymentB1"] = "Please enter date of payment";
                if (!tuitionForm.amountB2)
                    newErrors["amountB2"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentB2)
                    newErrors["dateOfPaymentB2"] = "Please enter date of payment";

                //plan c
                if (!tuitionForm.amountC1)
                    newErrors["amountC1"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentC1)
                    newErrors["dateOfPaymentC1"] = "Please enter date of payment";
                if (!tuitionForm.amountC2)
                    newErrors["amountC2"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentC2)
                    newErrors["dateOfPaymentC2"] = "Please enter date of payment";
                if (!tuitionForm.amountC3)
                    newErrors["amountC3"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentC3)
                    newErrors["dateOfPaymentC3"] = "Please enter date of payment";

                //plan d
                if (!tuitionForm.amountD1)
                    newErrors["amountD1"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentD1)
                    newErrors["dateOfPaymentD1"] = "Please enter date of payment";
                if (!tuitionForm.amountD2)
                    newErrors["amountD2"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentD2)
                    newErrors["dateOfPaymentD2"] = "Please enter date of payment";
                if (!tuitionForm.amountD3)
                    newErrors["amountD3"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentD3)
                    newErrors["dateOfPaymentD3"] = "Please enter date of payment";
                if (!tuitionForm.amountD4)
                    newErrors["amountD4"] = "Please enter amount";
                if (!tuitionForm.dateOfPaymentD4)
                    newErrors["dateOfPaymentD4"] = "Please enter date of payment";
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        // if (!validateForm()) return;
        let payload = null;
        let res = null;
        setIsLoadingModalOpen(true);

        switch (templateType) {
            case "fees":
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
                break;
            case "booklet":
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
                break;
            case "tuitionfee":
                // const plans = [
                //     { NumberOfPayment: "PLAN A", Amount: tuitionForm.amountA, DateOfPayment: tuitionForm.dateOfPaymentA },
                //     { NumberOfPayment: "PLAN B - FIRST PAYMENT", Amount: tuitionForm.amountB1, DateOfPayment: tuitionForm.dateOfPaymentB1 },
                //     { NumberOfPayment: "PLAN B - SECOND PAYMENT", Amount: tuitionForm.amountB2, DateOfPayment: tuitionForm.dateOfPaymentB2 },
                //     { NumberOfPayment: "PLAN C1", Amount: tuitionForm.amountC1, DateOfPayment: tuitionForm.dateOfPaymentC1 },
                //     { NumberOfPayment: "PLAN C2", Amount: tuitionForm.amountC2, DateOfPayment: tuitionForm.dateOfPaymentC2 },
                //     { NumberOfPayment: "PLAN C3", Amount: tuitionForm.amountC3, DateOfPayment: tuitionForm.dateOfPaymentC3 },
                //     { NumberOfPayment: "PLAN D1", Amount: tuitionForm.amountD1, DateOfPayment: tuitionForm.dateOfPaymentD1 },
                //     { NumberOfPayment: "PLAN D2", Amount: tuitionForm.amountD2, DateOfPayment: tuitionForm.dateOfPaymentD2 },
                //     { NumberOfPayment: "PLAN D3", Amount: tuitionForm.amountD3, DateOfPayment: tuitionForm.dateOfPaymentD3 },
                //     { NumberOfPayment: "PLAN D4", Amount: tuitionForm.amountD4, DateOfPayment: tuitionForm.dateOfPaymentD4 },
                // ];
                // const planHeader = {
                //     PlanName: 
                // }

                // payload = {
                //     TempName: tuitionForm.tempName,
                //     LevelId: tuitionForm.levelId,
                //     CreatedByUserId: currentUserId,
                //     TuitionFeeDtoChildDto: plans,
                //     TuitionFeeHeaderDto: plans
                // };
                const planHeaders = [
                    {
                        PlanName: "PLAN A",
                        PaymentDtos: [
                            {
                                NumberOfPayment: "1st Payment",
                                Amount: tuitionForm.amountA,
                                DateOfPayment: tuitionForm.dateOfPaymentA
                            }
                        ]
                    },
                    {
                        PlanName: "PLAN B",
                        PaymentDtos: [
                            {
                                NumberOfPayment: "1st Payment",
                                Amount: tuitionForm.amountB1,
                                DateOfPayment: tuitionForm.dateOfPaymentB1
                            },
                            {
                                NumberOfPayment: "2nd Payment",
                                Amount: tuitionForm.amountB2,
                                DateOfPayment: tuitionForm.dateOfPaymentB2
                            }
                        ]
                    },
                    {
                        PlanName: "PLAN C",
                        PaymentDtos: [
                            {
                                NumberOfPayment: "1st Payment",
                                Amount: tuitionForm.amountC1,
                                DateOfPayment: tuitionForm.dateOfPaymentC1
                            },
                            {
                                NumberOfPayment: "2nd Payment",
                                Amount: tuitionForm.amountC2,
                                DateOfPayment: tuitionForm.dateOfPaymentC2
                            },
                            {
                                NumberOfPayment: "3rd Payment",
                                Amount: tuitionForm.amountC3,
                                DateOfPayment: tuitionForm.dateOfPaymentC3
                            }
                        ]
                    },
                    {
                        PlanName: "PLAN D",
                        PaymentDtos: [
                            {
                                NumberOfPayment: "1st Payment",
                                Amount: tuitionForm.amountD1,
                                DateOfPayment: tuitionForm.dateOfPaymentD1
                            },
                            {
                                NumberOfPayment: "2nd Payment",
                                Amount: tuitionForm.amountD2,
                                DateOfPayment: tuitionForm.dateOfPaymentD2
                            },
                            {
                                NumberOfPayment: "3rd Payment",
                                Amount: tuitionForm.amountD3,
                                DateOfPayment: tuitionForm.dateOfPaymentD3
                            },
                            {
                                NumberOfPayment: "4th Payment",
                                Amount: tuitionForm.amountD4,
                                DateOfPayment: tuitionForm.dateOfPaymentD4
                            }
                        ]
                    }
                ];

                payload = {
                    TempName: tuitionForm.tempName,
                    LevelId: tuitionForm.levelId,
                    CreatedByUserId: currentUserId,
                    TuitionFeeDtoChildDto: planHeaders
                };
                console.log(payload);
                res = await dispatch(fetchInsertTuitioFeeData(payload));
                if (res.ok) {
                    setIsLoadingModalOpen(false);
                    setIsSuccessModalOpen(true);
                    setModalBody("Done saving the tuition fee.");
                    if (isSuccessModalOpen == false) {
                        setTimeout(() => window.location.reload(), 3000);
                    }
                }
                else {
                    setIsLoadingModalOpen(false);
                    setIsErrorModalOpen(true);
                }
                break;
            case "miscellaneous":
                payload = {
                    TempName: miscForm.tempName,
                    SchoolYear: miscForm.schoolYear,
                    CreatedByUserId: currentUserId,
                    MiscellaneousChildDtos: miscForm.rows.map((row) => ({
                        FeeName: row.feeName,
                        ToddlerAmount: String(row.amounts?.["Toddler"] || ""),
                        NurseryAmount: String(row.amounts?.["Nursery"] || ""),
                        KinderAmount: String(row.amounts?.["Kinder"] || ""),
                        Grade1Amount: String(row.amounts?.["Grade 1"] || ""),
                        Grade2Amount: String(row.amounts?.["Grade 2"] || ""),
                        Grade3Amount: String(row.amounts?.["Grade 3"] || ""),
                        Grade4Amount: String(row.amounts?.["Grade 4"] || ""),
                        Grade5Amount: String(row.amounts?.["Grade 5"] || ""),
                        Grade6Amount: String(row.amounts?.["Grade 6"] || ""),
                        Grade7Amount: String(row.amounts?.["Grade 7"] || ""),
                        Grade8Amount: String(row.amounts?.["Grade 8"] || ""),
                        Grade9Amount: String(row.amounts?.["Grade 9"] || ""),
                        Grade10Amount: String(row.amounts?.["Grade 10"] || ""),
                        Grade11Amount: String(row.amounts?.["Grade 11"] || ""),
                        Grade12Amount: String(row.amounts?.["Grade 12"] || ""),
                    })),
                };
                res = await dispatch(fetchInsertMiscellaneousData(payload));
                if (res.ok) {
                    setIsLoadingModalOpen(false);
                    setIsSuccessModalOpen(true);
                    setModalBody("Done saving the miscellaneous fees template.");
                    if (isSuccessModalOpen === false) {
                        setTimeout(() => window.location.reload(), 3000);
                    }
                } else {
                    setIsLoadingModalOpen(false);
                    setIsErrorModalOpen(true);
                }
                break;
        }
        console.log(payload);
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
                                <option value="miscellaneous">
                                    Miscellaneous Fees
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
                        {templateType === "tuitionfee" && (
                            <div>
                                <div className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-2 items-end">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name of Template</label>
                                        <input
                                            type="text"
                                            value={tuitionForm.tempName}
                                            placeholder="Enter name of template"
                                            onChange={(e) => setTuitionFormField("tempName", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.tempName ? "border-red-500" : ""
                                                }`}
                                        />
                                        {errors.tempName && (
                                            <p className="text-red-500 text-sm">{errors.tempName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Level</label>
                                        <select
                                            value={tuitionForm.levelId ?? ""}
                                            onChange={(e) => setTuitionFormField("levelId", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.levelId ? "border-red-500" : ""
                                                }`}
                                        >
                                            <option value="">-- Select Level --</option>
                                            {level.map((lvl) => (
                                                <option key={lvl.LevelId} value={lvl.LevelId}>
                                                    {lvl.LevelName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.levelId && (
                                            <p className="text-red-500 text-sm">{errors.levelId}</p>
                                        )}
                                    </div>
                                </div>
                                {/* Plan A */}
                                <div className="flex items-center gap-4 my-4">
                                    <h3 className="font-semibold whitespace-nowrap">Plan A</h3>
                                    <hr className="flex-grow border-gray-300" />
                                </div>
                                <div className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-2 items-end">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountA && (
                                            <p className="text-red-500 text-sm">{errors.amountA}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountA ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountA", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountA ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Payment
                                        </label>
                                        {errors.dateOfPaymentA && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentA}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentA ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentA", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentA ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                </div>
                                {/* Plan B */}
                                <div className="flex items-center gap-4 my-4">
                                    <h3 className="font-semibold whitespace-nowrap">Plan B</h3>
                                    <hr className="flex-grow border-gray-300" />
                                </div>
                                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-2 items-end">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountB1 && (
                                            <p className="text-red-500 text-sm">{errors.amountB1}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountB1 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountB1", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountB1 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of First Payment
                                        </label>
                                        {errors.dateOfPaymentB1 && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentB1}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentB1 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentB1", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentB1 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountB2 && (
                                            <p className="text-red-500 text-sm">{errors.amountB2}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountB2 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountB2", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountB2 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Second Payment
                                        </label>
                                        {errors.dateOfPaymentB2 && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentB2}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentB2 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentB2", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentB2 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                </div>
                                {/* Plan C */}
                                <div className="flex items-center gap-4 my-4">
                                    <h3 className="font-semibold whitespace-nowrap">Plan C</h3>
                                    <hr className="flex-grow border-gray-300" />
                                </div>
                                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-2 items-end">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountC1 && (
                                            <p className="text-red-500 text-sm">{errors.amountC1}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountC1 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountC1", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountC1 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of First Payment
                                        </label>
                                        {errors.dateOfPaymentC1 && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentC1}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentC1 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentC1", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentC1 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountC2 && (
                                            <p className="text-red-500 text-sm">{errors.amountC2}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountC2 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountC2", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountC2 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Second Payment
                                        </label>
                                        {errors.dateOfPaymentC2 && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentC2}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentC2 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentC2", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentC2 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountC3 && (
                                            <p className="text-red-500 text-sm">{errors.amountC3}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountC3 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountC3", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountC3 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Third Payment
                                        </label>
                                        {errors.dateOfPaymentC3 && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentC3}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentC3 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentC3", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentC3 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>

                                </div>
                                {/* Plan D */}
                                <div className="flex items-center gap-4 my-4">
                                    <h3 className="font-semibold whitespace-nowrap">Plan D</h3>
                                    <hr className="flex-grow border-gray-300" />
                                </div>

                                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-2 items-end">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountD1 && (
                                            <p className="text-red-500 text-sm">{errors.amountD1}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountD1 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountD1", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountD1 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of First Payment
                                        </label>
                                        {errors.dateOfPaymentD1 && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentD1}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentD1 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentD1", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentD1 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountD2 && (
                                            <p className="text-red-500 text-sm">{errors.amountD2}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountD2 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountD2", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountD2 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Second Payment
                                        </label>
                                        {errors.dateOfPaymentD2 && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentD2}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentD2 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentD2", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentD2 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountD3 && (
                                            <p className="text-red-500 text-sm">{errors.amountD3}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountD3 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountD3", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountD3 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Third Payment
                                        </label>
                                        {errors.dateOfPaymentD3 && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentD3}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentD3 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentD3", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentD3 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Amount
                                        </label>
                                        {errors.amountD4 && (
                                            <p className="text-red-500 text-sm">{errors.amountD4}</p>
                                        )}
                                        <input
                                            type="number"
                                            value={tuitionForm.amountD4 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("amountD4", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.amountD4 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Fourth Payment
                                        </label>
                                        {errors.dateOfPaymentD4 && (
                                            <p className="text-red-500 text-sm">{errors.dateOfPaymentD4}</p>
                                        )}
                                        <input
                                            type="date"
                                            value={tuitionForm.dateOfPaymentD4 ?? ""}
                                            placeholder="Enter Amount of Plan"
                                            onChange={(e) => setTuitionFormField("dateOfPaymentD4", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.dateOfPaymentD4 ? "border-red-500" : ""
                                                }`}
                                        />

                                    </div>
                                </div>
                                {/* {tuitionForm.tuitionChildForm.map((row, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-2 items-end"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Amount
                                            </label>
                                            <input
                                                type="number"
                                                value={row.amount ?? ""}
                                                placeholder="Enter Amount of Plan"
                                                onChange={(e) => updateTuitionFormRow(index, "amount", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`amount-${index}`] ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {errors[`amount-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`amount-${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Date Of Payment
                                            </label>
                                            <input
                                                type="date"
                                                value={row.dateOfPayment ?? ""}
                                                placeholder="Enter remarks"
                                                onChange={(e) => updateTuitionFormRow(index, "dateOfPayment", e.target.value)}
                                                className={`w-full rounded-lg border p-2 ${errors[`dateOfPayment-${index}`] ? "border-red-500" : ""
                                                    }`}
                                            />
                                            {errors[`dateOfPayment-${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {errors[`dateOfPayment-${index}`]}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-center items-center">
                                            {tuitionForm.tuitionChildForm.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteTuitionFormRow(index)}
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
                                    onClick={addTuitionFormRow}
                                    className="mt-2 px-3 py-1 rounded-lg bg-green-700 text-white text-md"
                                >
                                    + Add Row
                                </button> */}
                            </div>
                        )}

                        {templateType === "miscellaneous" && (
                            <div>
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Template Name</label>
                                        <input
                                            type="text"
                                            value={miscForm.tempName}
                                            placeholder="e.g. Tuition and Miscellaneous Fees"
                                            onChange={(e) => setMiscFormField("tempName", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.miscTempName ? "border-red-500" : ""}`}
                                        />
                                        {errors.miscTempName && <p className="text-red-500 text-sm">{errors.miscTempName}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">School Year</label>
                                        <input
                                            type="text"
                                            value={miscForm.schoolYear}
                                            placeholder="e.g. SY 2026 - 2027"
                                            onChange={(e) => setMiscFormField("schoolYear", e.target.value)}
                                            className={`w-full rounded-lg border p-2 ${errors.miscSchoolYear ? "border-red-500" : ""}`}
                                        />
                                        {errors.miscSchoolYear && <p className="text-red-500 text-sm">{errors.miscSchoolYear}</p>}
                                    </div>
                                </div>

                                <div className="overflow-x-auto border rounded-lg" style={{ position: "relative" }}>
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-3 py-2 text-left font-semibold text-gray-700 min-w-[180px] bg-gray-100 z-20" style={{ position: "sticky", left: 0, boxShadow: "2px 0 4px rgba(0,0,0,0.08)" }}>
                                                    Miscellaneous Fees
                                                </th>
                                                <th key="Toddler" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Toddler
                                                </th>
                                                <th key="Nursery" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Nursery
                                                </th>
                                                <th key="Kinder" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Kinder
                                                </th>
                                                <th key="Grade 1" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 1
                                                </th>
                                                <th key="Grade 2" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 2
                                                </th>
                                                <th key="Grade 3" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 3
                                                </th>
                                                <th key="Grade 4" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 4
                                                </th>
                                                <th key="Grade 5" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 5
                                                </th>
                                                <th key="Grade 6" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 6
                                                </th>
                                                <th key="Grade 7" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 7
                                                </th>
                                                <th key="Grade 8" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 8
                                                </th>
                                                <th key="Grade 9" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 9
                                                </th>
                                                <th key="Grade 10" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 10
                                                </th>
                                                <th key="Grade 11" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 11
                                                </th>
                                                <th key="Grade 12" className="border px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                                                    Grade 12
                                                </th>
                                                <th className="border px-2 py-2 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {miscForm.rows.map((row, index) => (
                                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                    <td className="border px-2 py-1 min-w-[180px] z-10" style={{ position: "sticky", left: 0, background: index % 2 === 0 ? "#ffffff" : "#f9fafb", boxShadow: "2px 0 4px rgba(0,0,0,0.08)" }}>
                                                        <input
                                                            type="text"
                                                            value={row.feeName ?? ""}
                                                            placeholder="Fee name"
                                                            onChange={(e) => updateMiscRow(index, "feeName", e.target.value)}
                                                            className={`w-full rounded border-0 bg-transparent px-1 py-1 focus:ring-1 focus:ring-blue-400 outline-none ${errors[`miscFeeName-${index}`] ? "ring-1 ring-red-500" : ""}`}
                                                        />
                                                    </td>
                                                    <td key="Toddler" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Toddler"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Toddler", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Nursery" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Nursery"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Nursery", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Kinder" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Kinder"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Kinder", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 1" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 1"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 1", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 2" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 2"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 2", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 3" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 3"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 3", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 4" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 4"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 4", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 5" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 5"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 5", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 6" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 6"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 6", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 7" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 7"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 7", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 8" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 8"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 8", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 9" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 9"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 9", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 10" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 10"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 10", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 11" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 11"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 11", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td key="Grade 12" className="border px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={row.amounts?.["Grade 12"] ?? ""}
                                                            placeholder="-"
                                                            onChange={(e) => updateMiscAmount(index, "Grade 12", e.target.value)}
                                                            className="w-20 rounded border-0 bg-transparent px-1 py-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                                                        />
                                                    </td>
                                                    <td className="border px-1 py-1 text-center">
                                                        {miscForm.rows.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteMiscRow(index)}
                                                                className="p-1 text-red-500 hover:bg-red-100 rounded"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {errors.miscRows && <p className="text-red-500 text-sm mt-1">{errors.miscRows}</p>}

                                <button
                                    type="button"
                                    onClick={addMiscRow}
                                    className="mt-3 px-3 py-1 rounded-lg bg-green-700 text-white text-sm flex items-center gap-1"
                                >
                                    <Plus size={15} /> Add Row
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
                        closeOnClick: false,
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
