import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import RowToggleComponent from '../../components/ButtonsComponents/RowToggleComponent';
import RHFListbox from '../ButtonsComponents/RHFListbox';
import InputField from '../ButtonsComponents/InputField';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import {
    fetchUpdateRowTemplateData,
} from "../../states/CfwState/Action";
import {
    fetchUserRoleData,
    fetchInsertTemplateTableData,
    fetchHrTemplateData,
    insertPayrollPeriodData,
} from '../../states/HumanResourcesState/Action';

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

    const fetchTemplates = async (selectedStatus, page = 1, pageSize = 10, search) => {
        setLoadingTable(true);

        const result = await dispatch(fetchHrTemplateData(selectedStatus, page, pageSize, search));

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
            case "CRITERIA":
                return "Criteria Template Table";
            case "DEPARTMENT":
                return "Department Template Table";
            case "POSITION":
                return "Position Template Table";
            case "GOLDENRANK":
                return "Golden Rank Template Table";
            case "PAYROLLPERIOD":
                return "Payroll Period Template";
            default:
                return "—";
        }
    };
    const columns = [
        {
            name: "Template Name",
            selector: (row) => row.TempName,
            sortable: true,
            wrap: true,
        },
        {
            name: "Template Type",
            selector: (row) => getTemplateTypeTitle(row.TempType),
            sortable: true,
        },
        {
            name: "Assign to",
            selector: (row) => row.UserRoleName,
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



    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRowModalOpen, setIsRowModalOpen] = useState(false);

    const tempList = [
        { id: 1, TempType: "Criteria Template Table" },
        { id: 2, TempType: "Department Template Table" },
        { id: 3, TempType: "Position Template Table" },
        { id: 4, TempType: "Golden Rank Template Table" },
        { id: 5, TempType: "Other Template Table" },
        { id: 6, TempType: "Payroll Period Template" }
    ];

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            TempName: "",
            UserRoleId: "",
            TemplateChildDtos: []
        }
    });
    const selectedTemplate = watch("TempType");
    const { fields: templateFields, append, remove } = useFieldArray({
        control,
        name: "TemplateChildDtos"
    });
    useEffect(() => {
        // if (selectedTemplate?.id === 1 && templateFields.length === 0) {
        //     append({ CriteriaName: "", Remarks: "" });
        // }

        switch (selectedTemplate?.id) {
            case 1:
                append({ CriteriaName: "", Remarks: "" });
                break;
            case 2:
                append({ DepartmentCode: "", DepartmentName: "", Remarks: "" });
                break;
            case 3:
                append({ PositionCode: "", PositionName: "", Remarks: "" });
                break;
            case 4:
                append({ GoldenRankCode: "", GolderRankName: "", Remarks: "" });
                break;
            case 6:
                append({ PeriodName: "", StartDate: "", EndDate: "", PaymentDate: "" });
                break;
        }
    }, [selectedTemplate]);



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

    const userRoleState = useSelector((state) => state.hr.userRoleState?.data || {});
    const [userRoleList, setUserRoleList] = useState([]);

    const addNewModal = async () => {
        console.log("test");
        setIsModalOpen(true);
        dispatch(fetchUserRoleData());

        console.log(userRoleState);
    };

    useEffect(() => {

        if (!Array.isArray(userRoleState) || userRoleState.length == 0) return;

        setUserRoleList(
            userRoleState.map(item => ({
                value: item.UserRoleId,
                label: item.UserRoleName,
                name: item.UserRoleName,
            }))
        );

    }, [userRoleState]);


    const [payload, setPayload] = useState(null);
    const [isWarningModal, setIsWarningModal] = useState(false);
    const onSubmit = (data) => {
        setPayload(data);
        setIsWarningModal(true);
    };
    const handleSubmitModal = async () => {
        const { TempType, TemplateChildDtos, ...rest } = payload;

        let formattedChildren = [];

        switch (TempType?.id) {
            case 1: // CRITERIA
                formattedChildren = TemplateChildDtos.map(item => ({
                    CriteriaName: item.CriteriaName,
                    Remarks: item.Remarks
                }));
                break;

            case 2: // DEPARTMENT
                formattedChildren = TemplateChildDtos.map(item => ({
                    DepartmentCode: item.DepartmentCode,
                    DepartmentName: item.DepartmentName,
                    Remarks: item.Remarks
                }));
                break;

            case 3: // POSITION
                formattedChildren = TemplateChildDtos.map(item => ({
                    PositionCode: item.PositionCode,
                    PositionName: item.PositionName,
                    Remarks: item.Remarks
                }));
                break;

            case 4: // GOLDEN RANK
                formattedChildren = TemplateChildDtos.map(item => ({
                    GoldenRankCode: item.GoldenRankCode,
                    GoldenRankName: item.GoldenRankName,
                    Remarks: item.Remarks
                }));
                break;

            case 6: // PAYROLL PERIOD
                formattedChildren = TemplateChildDtos.map(item => ({
                    PeriodName: item.PeriodName,
                    StartDate: item.StartDate,
                    EndDate: item.EndDate,
                    PaymentDate: item.PaymentDate
                }));
                break;
        }

        let formData = {};
        switch (TempType?.id) {
            case 1: // CRITERIA
                formData = {
                    TempName: rest.TempName,
                    TempId: TempType?.id,
                    UserRoleId: rest.UserRoleId,
                    CreatedByUserId: currentUserId,
                    CriteriaChildDtos: formattedChildren,
                };
                break;

            case 2: // DEPARTMENT
                formData = {
                    TempName: rest.TempName,
                    TempId: TempType?.id,
                    CreatedByUserId: currentUserId,
                    DepartmentChildDtos: formattedChildren,
                };
                break;

            case 3: // POSITION
                formData = {
                    TempName: rest.TempName,
                    TempId: TempType?.id,
                    CreatedByUserId: currentUserId,
                    PositionChildDtos: formattedChildren,
                };
                break;

            case 4: // GOLDEN RANK
                formData = {
                    TempName: rest.TempName,
                    TempId: TempType?.id,
                    CreatedByUserId: currentUserId,
                    GoldenRankChildDtos: formattedChildren,
                };
                break;

            case 6: // PAYROLL PERIOD
                // formData = {
                //     CreatedByUserId: currentUserId,
                //     PayrollPeriodChildDtos: formattedChildren,
                // };
                formData = formattedChildren;
                break;

            default:
                formData = {};
        }


        console.log("FINAL PAYLOAD:", formData);
        // Use separate action for Payroll Period (case 6)
        let res;
        if (TempType?.id === 6) {
            res = await dispatch(insertPayrollPeriodData(formData));
        } else {
            res = await dispatch(fetchInsertTemplateTableData(formData));
        }

        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
    };
    // const handleSubmitModal = async () => {
    //     const {
    //         TempType,
    //         ...rest
    //     } = payload;
    //     const formData = {
    //         ...rest,
    //         CreatedByUserId: currentUserId,
    //     };

    //     // const res = await dispatch(fetchInsertCriteriaTemplateData(formData));
    //     // if (res.ok) {
    //     //     setIsSuccessModalOpen(true);
    //     //     if (isSuccessModalOpen == false) {
    //     //         setTimeout(() => window.location.reload(), 3000);
    //     //     }
    //     // }
    //     console.log(formData);
    // };


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
                            onClick={addNewModal}
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
                    onClose={() => setIsModalOpen(false)}
                    title="Add New Template"
                    body={
                        <>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="max-h-[70vh] overflow-y-auto p-2 space-y-4">
                                    <div className="flex justify-center">
                                        <div className="w-full max-w-md">
                                            <RHFListbox
                                                name="TempType"
                                                control={control}
                                                list={tempList}
                                                label="Select Template Type"
                                                labelKey="TempType"
                                                isEditing={false}
                                                required
                                                error={errors.TempType}
                                            />
                                        </div>
                                    </div>

                                    {selectedTemplate?.id === 1 && (
                                        <div>
                                            <div className="flex gap-2 mb-2 justify-center">
                                                <InputField
                                                    name="TempName"
                                                    label="Name of Template"
                                                    register={register}
                                                    isEditing={true}
                                                    placeholder="Please input name of template...."
                                                    divClassName=""
                                                    required
                                                    errors={errors.TempName}
                                                    errorMessage={errors.TempName?.message}
                                                />
                                                {/* <SearchableSelect
                                                    options={userRoleList}
                                                    value={selectedUserRole}
                                                    onChange={(selected) => setSelectedUserRole(selected)}
                                                    placeholder="-- Select User Role --"
                                                    label="Select User Role"
                                                    required
                                                    errors={errors.UserRoleId}
                                                    errorMessage={errors.UserRoleId?.message}
                                                /> */}
                                                <Controller
                                                    name="UserRoleId"
                                                    control={control}
                                                    rules={{ required: "User Role is required" }}
                                                    render={({ field }) => (
                                                        <SearchableSelect
                                                            options={userRoleList}
                                                            value={userRoleList.find(
                                                                option => option.value === field.value
                                                            )}
                                                            onChange={(selected) => {
                                                                field.onChange(selected?.value);
                                                            }}
                                                            placeholder="-- Select User Role --"
                                                            label="Select User Role"
                                                            required
                                                            errors={errors.UserRoleId}
                                                            errorMessage={errors.UserRoleId?.message}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            {templateFields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="flex gap-2 mb-2 items-end"
                                                >
                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.CriteriaName`}
                                                            label="Name of Criteria"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input name of criteria...."
                                                            required
                                                            errors={errors?.TemplateChildDtos?.[index]?.CriteriaName}
                                                            errorMessage={
                                                                errors?.TemplateChildDtos?.[index]?.CriteriaName?.message
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`CriteriaChildDtos.${index}.Remarks`}
                                                            label="Remarks"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input remarks...."
                                                        />
                                                    </div>

                                                    {/* SHOW REMOVE ONLY IF MORE THAN 1 ROW */}
                                                    {templateFields.length > 1 && (
                                                        <div className="mb-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded h-fit"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex justify-end mb-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        append({
                                                            CriteriaName: "",
                                                            Remarks: ""
                                                        })
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    + Add Row
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {selectedTemplate?.id === 2 && (
                                        <div>
                                            <div className="flex gap-2 mb-2 justify-center">
                                                <InputField
                                                    name="TempName"
                                                    label="Name of Template"
                                                    register={register}
                                                    isEditing={true}
                                                    placeholder="Please input name of template...."
                                                    divClassName=""
                                                    required
                                                    errors={errors.TempName}
                                                    errorMessage={errors.TempName?.message}
                                                />
                                            </div>
                                            {templateFields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="flex gap-2 mb-2 items-end"
                                                >
                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.DepartmentCode`}
                                                            label="Department Code"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input department code...."
                                                            required
                                                            errors={errors?.TemplateChildDtos?.[index]?.DepartmentCode}
                                                            errorMessage={
                                                                errors?.TemplateChildDtos?.[index]?.DepartmentCode?.message
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.DepartmentName`}
                                                            label="Name of Department"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input name of department...."
                                                            required
                                                            errors={errors?.TemplateChildDtos?.[index]?.DepartmentName}
                                                            errorMessage={
                                                                errors?.TemplateChildDtos?.[index]?.DepartmentName?.message
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.Remarks`}
                                                            label="Remarks"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input remarks...."
                                                        />
                                                    </div>

                                                    {/* SHOW REMOVE ONLY IF MORE THAN 1 ROW */}
                                                    {templateFields.length > 1 && (
                                                        <div className="mb-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded h-fit"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex justify-end mb-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        append({
                                                            DepartmentCode: "",
                                                            DepartmentName: "",
                                                            Remarks: ""
                                                        })
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    + Add Row
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {selectedTemplate?.id === 3 && (
                                        <div>
                                            <div className="flex gap-2 mb-2 justify-center">
                                                <InputField
                                                    name="TempName"
                                                    label="Name of Template"
                                                    register={register}
                                                    isEditing={true}
                                                    placeholder="Please input name of template...."
                                                    divClassName=""
                                                    required
                                                    errors={errors.TempName}
                                                    errorMessage={errors.TempName?.message}
                                                />
                                            </div>
                                            {templateFields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="flex gap-2 mb-2 items-end"
                                                >
                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.PositionCode`}
                                                            label="Position Code"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input position code...."
                                                            required
                                                            errors={errors?.TemplateChildDtos?.[index]?.PositionCode}
                                                            errorMessage={
                                                                errors?.TemplateChildDtos?.[index]?.PositionCode?.message
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.PositionName`}
                                                            label="Name of Position"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input name of position...."
                                                            required
                                                            errors={errors?.TemplateChildDtos?.[index]?.PositionName}
                                                            errorMessage={
                                                                errors?.TemplateChildDtos?.[index]?.PositionName?.message
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.Remarks`}
                                                            label="Remarks"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input remarks...."
                                                        />
                                                    </div>

                                                    {/* SHOW REMOVE ONLY IF MORE THAN 1 ROW */}
                                                    {templateFields.length > 1 && (
                                                        <div className="mb-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded h-fit"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex justify-end mb-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        append({
                                                            PositionCode: "",
                                                            PositionName: "",
                                                            Remarks: ""
                                                        })
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    + Add Row
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {selectedTemplate?.id === 4 && (
                                        <div>
                                            <div className="flex gap-2 mb-2 justify-center">
                                                <InputField
                                                    name="TempName"
                                                    label="Name of Template"
                                                    register={register}
                                                    isEditing={true}
                                                    placeholder="Please input name of template...."
                                                    divClassName=""
                                                    required
                                                    errors={errors.TempName}
                                                    errorMessage={errors.TempName?.message}
                                                />
                                            </div>
                                            {templateFields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="flex gap-2 mb-2 items-end"
                                                >
                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.GoldenRankCode`}
                                                            label="Golden Rank Code"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input golder rank code...."
                                                            required
                                                            errors={errors?.TemplateChildDtos?.[index]?.GoldenRankCode}
                                                            errorMessage={
                                                                errors?.TemplateDetails?.[index]?.GoldenRankCode?.message
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.GoldenRankName`}
                                                            label="Name of Golden Rank"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input name of golden rank...."
                                                            required
                                                            errors={errors?.TemplateChildDtos?.[index]?.GoldenRankName}
                                                            errorMessage={
                                                                errors?.TemplateChildDtos?.[index]?.GoldenRankName?.message
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex-1">
                                                        <InputField
                                                            name={`TemplateChildDtos.${index}.Remarks`}
                                                            label="Remarks"
                                                            register={register}
                                                            isEditing={true}
                                                            placeholder="Please input remarks...."
                                                        />
                                                    </div>

                                                    {/* SHOW REMOVE ONLY IF MORE THAN 1 ROW */}
                                                    {templateFields.length > 1 && (
                                                        <div className="mb-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded h-fit"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex justify-end mb-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        append({
                                                            GoldenRankCode: "",
                                                            GoldenRankName: "",
                                                            Remarks: ""
                                                        })
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    + Add Row
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {selectedTemplate?.id === 6 && (
                                        <div>
                                            {templateFields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="flex gap-2 mb-2 items-end"
                                                >
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Period Name <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            {...register(`TemplateChildDtos.${index}.PeriodName`, { required: "Period Name is required" })}
                                                            placeholder="E.g., 'August 1-15, 2026'"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Start Date <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            {...register(`TemplateChildDtos.${index}.StartDate`, { required: "Start Date is required" })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            End Date <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            {...register(`TemplateChildDtos.${index}.EndDate`, { required: "End Date is required" })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Payment Date <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            {...register(`TemplateChildDtos.${index}.PaymentDate`, { required: "Payment Date is required" })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>

                                                    {/* SHOW REMOVE ONLY IF MORE THAN 1 ROW */}
                                                    {templateFields.length > 1 && (
                                                        <div className="mb-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded h-fit"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex justify-end mb-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        append({
                                                            PeriodName: "",
                                                            StartDate: "",
                                                            EndDate: "",
                                                            PaymentDate: ""
                                                        })
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    + Add Row
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </>
                    }
                    size="w-[800px]"
                    maxHeight="100vh"
                    buttons={[
                        { label: "Submit", type: "green", onClick: handleSubmit(onSubmit), closeOnClick: false },
                        { label: "No", type: "red", closeOnClick: true },
                    ]}
                />
                <ModalComponent
                    isOpen={isWarningModal}
                    onClose={() => setIsWarningModal(false)}
                    title={<span className="font-bold text-lg text-red-700">Warning</span>}
                    body={<p>Are you sure you want to submit?</p>}
                    buttons={[
                        { label: "Ok", type: "green", onClick: handleSubmitModal },
                        { label: "Cancel", type: "red", onClick: () => setIsWarningModal(false) }
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
                    title={<span className="font-bold text-lg text-blue-700">Test</span>}
                    body={
                        <>
                            {/* <div className="flex justify-between items-center mb-4">
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
                            <div className="flex justify-end mb-2">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring focus:ring-blue-300"
                                    value={searchRow}
                                    onChange={(e) => setSearchRow(e.target.value)}
                                />
                            </div>

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
                            /> */}
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