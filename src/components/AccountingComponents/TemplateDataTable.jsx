import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import {
    fetchTemplateTableData,
    fetchListOfUserData,
    fetchInsertTuitionFeeData,
    fetchInsertMiscellaneousData,
} from "../../states/AccountingState/Action";
import {
    fetchLevelData,
} from "../../states/AdmissionState/Action";
import useTemplateStore from "../../zustands/AccountingZustands/useTemplateStore";
import TuitionFeeTemplateForm from "./TuitionFeeTemplateForm";

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

    const usersState = useSelector((state) => state.accounting.listOfUserState || {});
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

        try {
            const result = await dispatch(
                fetchTemplateTableData(selectedStatus, page, pageSize, search)
            );

            console.log('Template fetch result:', result);

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
        } catch (err) {
            console.error("Exception in fetchTemplates:", err);
            setTable([]);
        }

        setLoadingTable(false);
    };

    useEffect(() => {
        console.log('TemplateDataTable useEffect triggered with selectedStatus:', selectedStatus);
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
            // TODO: implement fetchUpdateRowTemplateData in AccountingState/Action.js
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
        tuitionForm,
        setTuitionFormField,
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
        if (!validateForm())
            return;
        setIsSubmitModalOpen(true);
    };

    const validateForm = () => {
        let newErrors = {};
        console.log("TEMPLATE:", templateType);
        switch (templateType) {
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
        let payload = null;
        let res = null;
        setIsLoadingModalOpen(true);

        switch (templateType) {
            case "tuitionfee":
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
                res = await dispatch(fetchInsertTuitionFeeData(payload));
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
                size="w-[95vw] max-w-6xl"
                maxHeight="90vh"
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
                                <option value="tuitionfee">
                                    Tuition Fee Table
                                </option>
                                <option value="miscellaneous">
                                    Miscellaneous Fees
                                </option>
                            </select>
                        </div>

                        {/* Tuition Fee Template */}
                        {templateType === "tuitionfee" && (
                            <TuitionFeeTemplateForm levelOptions={level} />
                        )}

                        {/* Miscellaneous Template */}
                        {templateType === "miscellaneous" && (
                            <div>
                                {/* Miscellaneous form content here */}
                                <p className="text-center text-gray-600">Miscellaneous Fees Template Form</p>
                            </div>
                        )}
                    </div>
                }
                buttons={[
                    {
                        label: "Save Template",
                        type: "green",
                        onClick: openSubmitModal,
                        disabled: !templateType,
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: closeModal,
                    },
                ]}
            />

            {/* Submit Confirmation Modal */}
            <ModalComponent
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                title="Confirm Submission"
                body={
                    <div className="text-center py-4">
                        <p className="text-gray-700 mb-2">
                            Are you sure you want to save this template?
                        </p>
                        <p className="text-sm text-gray-500">
                            Template Type: <span className="font-semibold">{templateType === "tuitionfee" ? "Tuition Fee" : "Miscellaneous Fees"}</span>
                        </p>
                    </div>
                }
                buttons={[
                    {
                        label: "Confirm",
                        type: "green",
                        onClick: () => {
                            setIsSubmitModalOpen(false);
                            handleSubmit();
                        },
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => setIsSubmitModalOpen(false),
                    },
                ]}
            />

            {/* Loading Modal */}
            <ModalComponent
                isOpen={isLoadingModalOpen}
                onClose={() => {}}
                title="Processing"
                body={
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
                        <p className="text-gray-700 font-medium">Saving template...</p>
                    </div>
                }
                buttons={[]}
            />

            {/* Success Modal */}
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Success"
                body={
                    <div className="text-center py-4">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-medium">{modalBody}</p>
                    </div>
                }
                buttons={[
                    {
                        label: "Close",
                        type: "green",
                        onClick: () => {
                            setIsSuccessModalOpen(false);
                            window.location.reload();
                        },
                    },
                ]}
            />

            {/* Error Modal */}
            <ModalComponent
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title="Error"
                body={
                    <div className="text-center py-4">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-medium">Failed to save template. Please try again.</p>
                    </div>
                }
                buttons={[
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsErrorModalOpen(false),
                    },
                ]}
            />
        </div>
    );
};

export default TemplateDataTable;
