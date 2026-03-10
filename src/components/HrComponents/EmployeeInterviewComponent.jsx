import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import DataTable from "react-data-table-component";
import RadioGroupField from "../ButtonsComponents/RadioGroupField";
import {
    fetchCampusData,
} from "../../states/OnlineApplicationState/Action";
import {
    fetchEmployeeApplicationInfoData,
    fetchEmployeeApplicationScreeningData,
    fetchCriteriaTableData,
    fetchSacUserData,
    fetchApUserData,
    fetchPrincipalUserData,
} from "../../states/HumanResourcesState/Action";

const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#027407',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '14px',
        },
    },
    headCells: {
        style: {
            color: '#ffffff',
        },
    },
};

const EmployeeInterviewComponent = ({ isEditing, employeeAppId, userId }) => {

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            EmployeeId: "",
            EmployeeNumber: "",
            EmployeeAppId: "",
            EmployeeAppNo: "",
            Fullname: "",
            Nickname: "",
            Position: "",
            ApplicationThru: "",
            ApplicationThruOthers: "",
            ApplicationType: "",
            WorkExperience: "",
            NoOfYearMonth: "",
            SacFullname: "",
            ApFullname: "",
            PrincipalFullname: "",
            Campus: null,
            SetPosition: null,
            SetPositionName: null,
            SacUser: null,
            SacUserId: "",
            ApUser: null,
            ApUserId: "",
            PrincipalUser: null,
            PrincipalUserId: "",
        }
    });

    const positionList = [
        { SetPositionId: 1, SetPositionName: "Faculty" },
        { SetPositionId: 2, SetPositionName: "Non-Teaching Staff" },
        { SetPositionId: 3, SetPositionName: "Staff" },
        { SetPositionId: 4, SetPositionName: "Others" }
    ];

    const employeeData = useSelector(state => state.hr.employeeInfoState?.data || {});
    const employeScreeningData = useSelector(state => state.hr.employeeScreeningState?.data || {});
    const campusList = useSelector(state => state.online.campusState?.data || []);

    console.log(employeScreeningData);

    useEffect(() => {
        dispatch(fetchEmployeeApplicationInfoData(employeeAppId));
        dispatch(fetchEmployeeApplicationScreeningData(employeeAppId));
        dispatch(fetchCampusData());
    }, [dispatch, employeeAppId]);
    console.log(employeeData);
    useEffect(() => {
        if (!employeeData || !isEditing) return;

        reset({
            EmployeeId: employeeData.EmployeeId ?? "",
            EmployeeNumber: employeeData.EmployeeNumber ?? "",
            EmployeeAppId: employeeData.EmployeeAppId ?? "",
            EmployeeAppNo: employeeData.EmployeeAppNo ?? "",
            Fullname: `${employeeData.Fname ?? ""} ${employeeData.Mname ?? ""} ${employeeData.Lname ?? ""}`,
            Nickname: employeeData.Nickname ?? "",
            Position: employeeData.Position ?? "",
            ApplicationThru: employeScreeningData.ApplicationThru ?? "",
            ApplicationThruOthers: employeScreeningData.ApplicationThruOthers ?? "",
            ApplicationType: employeScreeningData.ApplicationType ?? "",
            EmployeeNumber: employeScreeningData.EmployeeNumber ?? "",
            WorkExperience: employeScreeningData.WorkExperience ?? "",
            NoOfYearMonth: employeScreeningData.NoOfYearMonth ?? "",
            Campus: null,
            SetPosition: null,
            SetPositionName: null,
            SacUser: null,
            SacUserId: "",
            ApUser: null,
            ApUserId: "",
            PrincipalUser: null,
            PrincipalUserId: "",
            // SetPosition: null,
        });
    }, [employeeData, employeScreeningData, isEditing, reset]);
    useEffect(() => {
        if (!isEditing || !employeeData?.CampusName || !campusList.length) return;

        const campus = campusList.find(
            c => c.CampusName === employeeData.CampusName
        );

        if (campus) {
            reset(prev => ({ ...prev, Campus: campus }));
        }
    }, [campusList, employeeData?.CampusName, isEditing, setValue]);

    useEffect(() => {
        if (!employeScreeningData?.SetPositionName) return;

        const position = positionList.find(
            p => p.SetPositionName === employeeData.SetPositionName
        );

        if (position) {
            reset(prev => ({ ...prev, SetPosition: position }));
        }
    }, [employeeData]);



    const selectedApplicationThru = watch("ApplicationThru");
    const selectedApplicationType = watch("ApplicationType");
    const selectedWorkExperience = watch("WorkExperience");


    const [criteriaList, setCriteriaList] = useState([]);
    const criteriaTableState = useSelector((state) => state.hr.criteriaTableState || {});
    const criteriaTable = criteriaTableState.data.data || [];
    const criteriaTableTotalRows = criteriaTableState.data.totalRecords || 0;
    const criteriaTableLoading = criteriaTableState.loading || false;
    const [criteriaTableCurrentPage, setCriteriaTableCurrentPage] = useState(1);
    const [criteriaTableRowsPerPage, setCriteriaTableRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchCriteriaTableData(criteriaTableCurrentPage, criteriaTableRowsPerPage));
    }, [criteriaTableCurrentPage, criteriaTableRowsPerPage, dispatch]);

    // useEffect(() => {
    //     if (criteriaTable.length == 0) return;
    //     setCriteriaList(criteriaTable);
    // }, [criteriaTable]);
    useEffect(() => {
        if (!criteriaTable.length) return;

        const orderMap = {
            3: 1,
            4: 2,
            7: 3,
            6: 4
        };

        const flattened = criteriaTable
            .sort((a, b) => orderMap[a.CriteriaId] - orderMap[b.CriteriaId])
            .flatMap(master =>
                master.CriteriaChildTableDtos.map(child => ({
                    ...child,
                    CriteriaId: master.CriteriaId,
                    CriteriaTempName: master.CriteriaTempName
                }))
            );

        setCriteriaList(flattened);

    }, [criteriaTable]);

    console.log(criteriaTable);

    const [ratings, setRatings] = useState({});

    const criteriaColumn = [
        {
            name: 'Criteria Name',
            selector: row => row.CriteriaName,
            sortable: true
        },
        {
            name: 'Poor',
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="1"
                    onChange={() => handleRatingChange(row.CriteriaChildId, 1)}
                    checked={ratings[row.CriteriaChildId] === 1}
                />
            )
        },
        {
            name: 'Marginal',
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="2"
                    onChange={() => handleRatingChange(row.CriteriaChildId, 2)}
                    checked={ratings[row.CriteriaChildId] === 2}
                />
            )
        },
        {
            name: 'Good',
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="3"
                    onChange={() => handleRatingChange(row.CriteriaChildId, 3)}
                    checked={ratings[row.CriteriaChildId] === 3}
                />
            )
        },
        {
            name: 'Excellent',
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="4"
                    onChange={() => handleRatingChange(row.CriteriaChildId, 4)}
                    checked={ratings[row.CriteriaChildId] === 4}
                />
            )
        }
    ];


    const handleRatingChange = (rowId, value) => {
        setRatings(prev => ({
            ...prev,
            [rowId]: value
        }));
    };


    const sacUserList = useSelector((state) => state.hr.sacUserState?.data || []);
    const apUserList = useSelector((state) => state.hr.apUserState?.data || []);
    const principalUserList = useSelector((state) => state.hr.principalUserState?.data || []);

    useEffect(() => {
        dispatch(fetchSacUserData(11));
        dispatch(fetchApUserData(12));
        dispatch(fetchPrincipalUserData(13));
    }, [dispatch]);

    console.log(sacUserList);
    console.log(apUserList);
    console.log(principalUserList);
    const userLists = {
        11: sacUserList,
        12: apUserList,
        13: principalUserList
    };

    const getDropdownUser = (criteria) => {
        if (criteria.UserRoleId === 11) return "SacUser";
        if (criteria.UserRoleId === 12) return "ApUser";
        return "PrincipalUser";
    };
    // useEffect(() => {
    //     if (!sacUserList?.Fullname) return;

    //     const sacUser = sacUserList.find(
    //         p => p.Fullname === employeScreeningData.Fullname
    //     );

    //     if (sacUser) {
    //         setValue("SacUser", sacUser);
    //     }
    // }, [sacUserList]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);

    const onSubmit = (data) => {
        setFormData(data);
        setIsModalOpen(true);
        console.log(data);
        console.log(formData);
    };

    const handleConfirmSubmit = async () => {
        if (!formData) return;

        const {
            Campus,
            ...rest
        } = formData;

        const payload = {
            ...rest,
            CampusId: formData.Campus?.CampusId,
            CampusName: "",
            CreatedByUserId: userId,
        };

        console.log("SUBMIT PAYLOAD:", payload);

        // const res = await dispatch(fetchInsertHiringProcessData(payload));
        // if (res.ok) {
        //     setIsSuccessModalOpen(true);
        //     if (isSuccessModalOpen == false) {
        //         setTimeout(() => window.location.reload(), 3000);
        //     }
        // }
    };

    // console.log(employeeAppId);
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center pt-4">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
                    i
                </div>
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Applicant Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div>
                <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                    <InputField name="EmployeeAppNo" label="Employee Application Number" register={register} isEditing={isEditing} displayValue={employeeData.EmployeeAppNo} />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                    <InputField name="Fullname" label="Full Name" register={register} isEditing={isEditing} displayValue={`${employeeData.Fname ?? ""} ${employeeData.Mname ?? ""} ${employeeData.Lname ?? ""}`} />
                    <InputField name="Nickname" label="Nick Name" register={register} isEditing={isEditing} displayValue={employeeData.Nickname} />
                    <InputField name="Position" label="Desired Position" register={register} isEditing={false} displayValue={employeeData.Position} />
                    {/* <RHFListbox name="Campus" control={control} list={campusList} label="Campus" labelKey="CampusName" isEditing={!isEditing} displayValue={employeeData.CampusName} />
                    <RHFListbox
                        name="SetPositionName"
                        control={control}
                        list={positionList}
                        label="Select Position"
                        labelKey="SetPositionName"
                        isEditing={false}
                        displayValue={employeScreeningData.SetPositionName}
                    /> */}
                    <RHFListbox
                        name="Campus"
                        control={control}
                        list={campusList}
                        label="Campus"
                        labelKey="CampusName"
                        isEditing={!isEditing}
                        displayValue={employeeData.CampusName}
                    />

                    <RHFListbox
                        name="SetPosition"
                        control={control}
                        list={positionList}
                        label="Select Position"
                        labelKey="SetPositionName"
                        isEditing={!isEditing}
                        displayValue={employeeData.SetPositionName}
                    />
                </div>

            </div>
            <div className="flex items-center pt-4">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
                    i
                </div>
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Screening
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 px-2">
                <RadioGroupField
                    name="ApplicationThru"
                    label="Application Thru"
                    register={register}
                    isEditing={isEditing}
                    required
                    options={[
                        { label: "Active File", value: "1" },
                        { label: "Email", value: "2" },
                        { label: "Dropped-Off", value: "3" },
                        { label: "Job Fair", value: "4" },
                        { label: "Others", value: "5" },
                    ]}
                    error={errors.ApplicationThru}
                />
                {selectedApplicationThru === "5" && (
                    <InputField
                        name="ApplicationThruOthers"
                        label="Others"
                        register={register}
                        isEditing={isEditing}
                        rules={{
                            required:
                                selectedApplicationThru === "5"
                                    ? "Please specify others"
                                    : false
                        }}
                        errors={errors.ApplicationThruOthers}
                        errorMessage={errors.ApplicationThruOthers?.message}
                    />
                )}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 px-2">
                <RadioGroupField
                    name="ApplicationType"
                    label="ESS Application"
                    register={register}
                    isEditing={isEditing}
                    required
                    options={[
                        { label: "First Time Applicant", value: "1" },
                        { label: "Previous Applicant", value: "2" },
                        { label: "Returning Employee", value: "3" },
                    ]}
                    error={errors.ApplicationType}
                />
                {selectedApplicationType === "3" && (
                    <InputField
                        name="EmployeeNumber"
                        label="Employee Number"
                        register={register}
                        isEditing={isEditing}
                        displayValue={employeeData.EmployeeNumber}
                    />
                )}

            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 px-2">
                <RadioGroupField
                    name="WorkExperience"
                    label="Work Experience"
                    register={register}
                    isEditing={isEditing}
                    required
                    options={[
                        { label: "Fresh Graduate", value: "1" },
                        { label: "Experience in other industries", value: "2" },
                        { label: "With Experience", value: "3" },
                    ]}
                    error={errors.WorkExperience}
                />
                {selectedWorkExperience === "3" && (
                    <InputField
                        name="NoOfYearMonth"
                        label="No. of Years and Months"
                        register={register}
                        isEditing={isEditing}
                        rules={{
                            required:
                                selectedWorkExperience === "3"
                                    ? "Please specify work experience"
                                    : false
                        }}
                        errors={errors.NoOfYearMonth}
                        errorMessage={errors.NoOfYearMonth?.message}
                    />
                )}
            </div>
            {criteriaTable.map((criteria, index) => (
                <div key={criteria.CriteriaId} className="mb-10">

                    {/* TITLE */}
                    <div className="flex items-center pt-4">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
                            {index + 1}
                        </div>

                        <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                            {criteria.CriteriaTempName}
                        </h2>

                        <div className="flex-grow">
                            <hr className="border-t border-gray-400" />
                        </div>
                    </div>
                    {criteria.UserRoleId != 10 && (
                        <div className="flex justify-end items-end">
                            <div className="w-80">
                                <RHFListbox
                                    name={getDropdownUser(criteria)}        // form field
                                    control={control}
                                    list={userLists[criteria.UserRoleId] || []}  // array of options
                                    label="Assign to"
                                    labelKey={"Fullname"}                // property to display from list
                                    isEditing={false}
                                    divClassName="w-full"
                                />
                            </div>
                        </div>
                    )}
                    <div className="pt-4">
                        <DataTable
                            columns={criteriaColumn}
                            data={criteria.CriteriaChildTableDtos}
                            progressPending={criteriaTableLoading}
                            pagination
                            paginationServer
                            paginationTotalRows={criteriaTableTotalRows}
                            paginationDefaultPage={criteriaTableCurrentPage}
                            onChangePage={(page) => setCriteriaTableCurrentPage(page)}
                            onChangeRowsPerPage={(newPerPage, page) => {
                                setCriteriaTableRowsPerPage(newPerPage);
                                setCriteriaTableCurrentPage(page);
                            }}
                            highlightOnHover
                            responsive
                            customStyles={customStyles}
                        />
                    </div>
                    {criteria.UserRoleId == 10 && (
                        <>
                            <div className="grid grid-cols-4 gap-4 pt-4 items-end w-full">
                                <RHFListbox
                                    name="SetPositionName"
                                    control={control}
                                    list={positionList}
                                    label="Recommendation"
                                    labelKey="SetPositionName"
                                    isEditing={false}
                                />
                                <InputField
                                    name="EmployeeAppNo"
                                    label="Remarks"
                                    register={register}
                                    isEditing={isEditing}
                                    displayValue={employeeData.EmployeeAppNo}
                                />
                            </div>
                        </>
                    )}
                </div>
            ))}
            <div className="flex justify-end items-end p-4">
                {isEditing && (
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
                    >
                        Submit
                    </button>
                )}

            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Warning</span>}
                body="Are you sure you want to submit?"
                buttons={[
                    { label: "Yes", type: "green", onClick: handleConfirmSubmit, },
                    { label: "No", type: "red", onClick: () => setIsModalOpen(false) },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={
                    <span className="font-bold text-lg text-green-700">
                        Success
                    </span>
                }
                body="Done saving the details. The next process will be in Iintial Interview"
                buttons={[
                    {
                        label: "OK",
                        type: "green",
                        onClick: () => setIsSuccessModalOpen(false)
                    },
                ]}
            />
        </form>
    );
};

export default EmployeeInterviewComponent;