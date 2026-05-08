import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import DataTable from "react-data-table-component";
import RadioGroupField from "../ButtonsComponents/RadioGroupField";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import {
    fetchCampusData,
    fetchDivisionData,
} from "../../states/OnlineApplicationState/Action";
import {
    fetchEmployeeApplicationInfoData,
    fetchEmployeeApplicationScreeningData,
    fetchCriteriaTableData,
    fetchSacUserData,
    fetchApUserData,
    fetchPrincipalUserData,
    fetchUpdateEmployeeScreeningData,
    fetchDepartmentTemplateData,
    fetchPositionTemplateData,
    fetchGoldenRankTemplateData,
    fetchInsertHiredEmployeeData,
    // fetchEmployeeFullScreeningData,
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

    const currUserId = userId;
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
            Recommendation: null,
            Remarks: "",
            SacUser: null,
            // SacUserId: "",
            ApUser: null,
            // ApUserId: "",
            PrincipalUser: null,
            // PrincipalUserId: "",
        }
    });

    const positionList = [
        { SetPositionId: 1, SetPositionName: "Faculty" },
        { SetPositionId: 2, SetPositionName: "Non-Teaching Staff" },
        { SetPositionId: 3, SetPositionName: "Staff" },
        { SetPositionId: 4, SetPositionName: "Others" }
    ];

    const recommendationList = [
        { RecommendationId: 1, RecommendationName: "Recommended for Teaching Demonstration (Faculty)" },
        { RecommendationId: 2, RecommendationName: "Recommended for Demonstration with reservations due to" },
        { RecommendationId: 3, RecommendationName: "Not Recommended" },
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
            Remarks: "",
            Recommendation: "",
            Campus: null,
            SetPosition: null,
            SetPositionName: null,
            SacUser: null,
            // SacUserId: "",
            ApUser: null,
            // ApUserId: "",
            PrincipalUser: null,
            // PrincipalUserId: "",
            // SetPosition: null,
        });
    }, [employeeData, employeScreeningData, isEditing, reset]);

    useEffect(() => {
        if (!isEditing || !employeeData?.CampusName || !campusList.length) return;

        const campus = campusList.find(
            c => c.CampusName === employeeData.CampusName
        );

        if (campus) {
            setValue("Campus", campus);
        }
    }, [campusList, employeeData?.CampusName, isEditing, setValue]);

    useEffect(() => {
        if (!employeeData?.SetPositionName) return;

        const position = positionList.find(
            p => p.SetPositionName === employeeData.SetPositionName
        );

        if (position) {
            setValue("SetPosition", position);
        }
    }, [employeeData, setValue]);

    console.log(employeeData);

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
    const [isRatingExist, setIsRatingExist] = useState(false);
    useEffect(() => {
        dispatch(fetchCriteriaTableData(employeeAppId, criteriaTableCurrentPage, criteriaTableRowsPerPage));
    }, [employeeAppId, criteriaTableCurrentPage, criteriaTableRowsPerPage, dispatch]);

    useEffect(() => {
        if (!criteriaTable.length) return;

        let nameOrderMap = null;

        if (employeeData?.SetPositionName == "Faculty") {
            nameOrderMap = {
                "Initial Interview": 1,
                "Teaching Demonstration": 2,
                "Assistant Principal Interview": 3,
                "Principal Interview": 4
            };
        } else {
            nameOrderMap = {
                "Initial Interview": 1,
                "Department Head Interview": 2
            };
        }

        const hasRatings = criteriaTable.some(master =>
            master.CriteriaChildTableDtos.some(child => child.Rating != null)
        );

        console.log(hasRatings);
        let flattened = [];

        if (!hasRatings) {

            flattened = criteriaTable
                .sort((a, b) =>
                    nameOrderMap[a.CriteriaTempName] - nameOrderMap[b.CriteriaTempName]
                )
                .flatMap(master =>
                    master.CriteriaChildTableDtos.map(child => ({
                        ...child,
                        CriteriaId: master.CriteriaId,
                        CriteriaTempName: master.CriteriaTempName
                    }))
                );
            setIsRatingExist(false);
        } else {
            flattened = criteriaTable
                .sort((a, b) =>
                    nameOrderMap[a.CriteriaTempName] - nameOrderMap[b.CriteriaTempName]
                )
                .flatMap(master =>
                    master.CriteriaChildTableDtos.map(child => ({
                        ...child,
                        CriteriaId: master.CriteriaId,
                        CriteriaTempName: master.CriteriaTempName,
                        Rating: child.Rating // 👈 important
                    }))
                );
            setIsRatingExist(true);
        }

        setCriteriaList(flattened);

    }, [criteriaTable, employeeData]);
    useEffect(() => {
        if (!criteriaTable.length) return;

        const initialRatings = {};

        criteriaTable.forEach(master => {
            master.CriteriaChildTableDtos.forEach(child => {
                if (child.Rating != null) {
                    initialRatings[child.CriteriaChildId] = Number(child.Rating);
                }
            });
        });

        setRatings(initialRatings);
    }, [criteriaTable]);

    useEffect(() => {
        if (!criteriaTable.length) return;

        criteriaTable.forEach(criteria => {
            setValue(`Recommendation_${criteria.CriteriaId}`, criteria.Recommendation || "");
            setValue(`Remarks_${criteria.CriteriaId}`, criteria.Remarks || "");
            setValue(`UserFullname_${criteria.CriteriaId}`, criteria.UserFullname || "");
            setValue(`DateCreated_${criteria.CriteriaId}`, criteria.DateCreated || "");
        });

    }, [criteriaTable, setValue]);


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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);

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
            SacUser,
            ApUser,
            PrincipalUser,
            SetPosition,
            Recommendation,
            ...rest
        } = formData;
        const CriteriaRatingDtos = [];

        criteriaTable.forEach(criteria => {
            if (criteria.CriteriaTempName !== "Initial Interview") return;

            criteria.CriteriaChildTableDtos.forEach(child => {
                if (ratings[child.CriteriaChildId]) {
                    CriteriaRatingDtos.push({
                        CriteriaId: criteria.CriteriaId,
                        CriteriaChildId: child.CriteriaChildId,
                        Rating: ratings[child.CriteriaChildId].toString()
                    });
                }
            });
        });

        const assignUsers = [];

        criteriaTable.forEach(criteria => {
            let userId = null;

            switch (criteria.CriteriaTempName) {
                case "Initial Interview":
                    userId = currUserId;
                    break;

                case "Teaching Demonstration":
                    userId = formData.SacUser?.UserId;
                    break;

                case "Assistant Principal Interview":
                    userId = formData.ApUser?.UserId;
                    break;

                case "Principal Interview":
                    userId = formData.PrincipalUser?.UserId;
                    break;

                case "Deparment Head Interview":
                    userId = formData.DepartmentHeadUser?.UserId;
                    break;

                default:
                    break;
            }

            if (userId) {
                assignUsers.push({
                    CriteriaId: criteria.CriteriaId,
                    UserId: userId
                });
            }
        });

        const payload = {
            ...rest,
            CampusId: formData.Campus?.CampusId,
            SetPositionName: formData.SetPosition?.SetPositionName,
            Recommendation: formData.Recommendation?.RecommendationName,
            CreatedByUserId: currUserId,
            CriteriaRatingDtos: CriteriaRatingDtos,
            AssignRoleDtos: assignUsers

        };
        console.log(ratings);
        console.log("SUBMIT PAYLOAD:", payload);

        const res = await dispatch(fetchUpdateEmployeeScreeningData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
    };

    useEffect(() => {
        dispatch(fetchDepartmentTemplateData());
        dispatch(fetchPositionTemplateData());
        dispatch(fetchGoldenRankTemplateData());
        dispatch(fetchDivisionData());
    }, [dispatch])

    const departmentList = useSelector((state) => state.hr.departmentState.data || []);
    const positionStatusList = useSelector((state) => state.hr.positionState.data || []);
    const goldenRankList = useSelector((state) => state.hr.goldenRankState.data || []);
    const divisionList = useSelector((state) => state.online.divisionState.data || []);
    const [depList, setDepList] = useState([]);
    const [posList, setPosList] = useState([]);
    const [golList, setGolList] = useState([]);
    const [divList, setDivList] = useState([]);

    console.log(divisionList);

    useEffect(() => {

        const depMappedOptions = departmentList.map((i) => ({
            value: i.DepChildId,
            label: `${i.DepartmentCode} - ${i.DepartmentName}`,
        }));
        setDepList(depMappedOptions);

        const posMappedOptions = positionStatusList.map((i) => ({
            value: i.PosChildId,
            label: `${i.PositionCode} - ${i.PositionName}`,
        }));
        setPosList(posMappedOptions);

        const golMappedOptions = goldenRankList.map((i) => ({
            value: i.GoldenRankChildId,
            label: `${i.GoldenRankCode} - ${i.GoldenRankName}`,
        }));
        setGolList(golMappedOptions);

        const divMappedOptions = divisionList.map((i) => ({
            value: i.DivId,
            label: i.DivName,
        }));
        setDivList(divMappedOptions);

    }, [departmentList, positionStatusList, goldenRankList, divisionList]);

    const advList = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];

    const [hiringData, setHiringData] = useState({
        DepartmentId: null,
        DivId: null,
        PositionId: null,
        GoldenRankId: null,
        IsAdviser: null,
    });
    const handleSubmitHiring = async () => {

        const payload = {
            EmployeeAppId: employeeAppId,
            DepChildId: hiringData.DepartmentId,
            DivId: hiringData.DivId,
            PosChildId: hiringData.PositionId,
            GoldenRankChildId: hiringData.GoldenRankId,
        };

        console.log(payload);

        const res = await dispatch(fetchInsertHiredEmployeeData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
    };
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
                    <InputField name="EmployeeAppNo" label="Employee Application Number" register={register} isEditing={isEditing} displayValue={employeeData?.EmployeeAppNo} />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                    <InputField name="Fullname" label="Full Name" register={register} isEditing={isEditing} displayValue={`${employeeData.Fname ?? ""} ${employeeData.Mname ?? ""} ${employeeData.Lname ?? ""}`} />
                    <InputField name="Nickname" label="Nick Name" register={register} isEditing={isEditing} displayValue={employeeData?.Nickname} />
                    <InputField name="Position" label="Desired Position" register={register} isEditing={false} displayValue={employeeData?.Position} />
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
                    {employeScreeningData?.DateHired != null && (
                        <>
                            <InputField name="DateHired" label="Date Hired" register={register} isEditing={false} displayValue={employeScreeningData?.DateHired} />
                        </>
                    )}

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
                        displayValue={employeeData?.EmployeeNumber ?? ""}
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
                    {/* {criteria.UserRoleId != 10 && (
                        <div className="flex justify-end items-end">
                            <div className="w-80">
                                <RHFListbox
                                    name={getDropdownUser(criteria)}
                                    control={control}
                                    list={userLists[criteria.UserRoleId] || []}
                                    label="Assign to"
                                    labelKey={"Fullname"}
                                    isEditing={false}
                                    divClassName="w-full"
                                />
                            </div>
                        </div>
                    )} */}
                    {!isRatingExist && (
                        <>
                            {criteria.UserRoleId != 10 && (
                                <div className="flex justify-end items-end">
                                    <div className="w-80">
                                        <RHFListbox
                                            name={getDropdownUser(criteria)}
                                            control={control}
                                            list={userLists[criteria.UserRoleId] || []}
                                            label="Assign to"
                                            labelKey={"Fullname"}
                                            isEditing={false}
                                            divClassName="w-full"
                                        />
                                    </div>
                                </div>
                            )
                            }
                        </>

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
                    {isRatingExist ? (
                        <div className="grid grid-cols-4 gap-4 pt-4 items-end w-full">
                            <InputField
                                name={`Recommendation_${criteria.CriteriaId}`}
                                label="Recommendation"
                                register={register}
                                isEditing={isEditing}
                                displayValue={criteria.Recommendation}
                            />
                            <InputField
                                name={`Remarks_${criteria.CriteriaId}`}
                                label="Remarks"
                                register={register}
                                isEditing={isEditing}
                                displayValue={criteria.Remarks}
                            />
                            <InputField
                                name={`UserFullname_${criteria.CriteriaId}`}
                                label="Submitted By"
                                register={register}
                                isEditing={isEditing}
                                displayValue={criteria.UserFullname}
                            />
                            <InputField
                                name={`DateCreated_${criteria.CriteriaId}`}
                                label="Date Created"
                                register={register}
                                isEditing={isEditing}
                                displayValue={criteria.UserFullname}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3 pt-4 items-end w-full">
                            <RHFListbox
                                name="Recommendation"
                                control={control}
                                list={recommendationList}
                                label="Recommendation"
                                labelKey="RecommendationName"
                                required
                                isEditing={false}
                            />
                            <InputField
                                name="Remarks"
                                label="Remarks"
                                register={register}
                                isEditing={isEditing}
                                displayValue={employeScreeningData.Remarks}
                            />
                        </div>
                    )}
                    {/* {criteria.UserRoleId == 10 && (
                        <>
                            <div className="grid grid-cols-3 gap-3 pt-4 items-end w-full">
                                <RHFListbox
                                    name="Recommendation"
                                    control={control}
                                    list={recommendationList}
                                    label="Recommendation"
                                    labelKey="RecommendationName"
                                    required
                                    isEditing={false}
                                />
                                <InputField
                                    name="Remarks"
                                    label="Remarks"
                                    register={register}
                                    isEditing={isEditing}
                                    displayValue={employeScreeningData.Remarks}
                                />
                            </div>
                        </>
                    )} */}
                </div>
            ))}
            <div className="flex justify-end items-end p-4">
                {isEditing && (
                    <>
                        {isRatingExist && (
                            <button
                                type="button"
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition m-1"
                                onClick={() => setIsHiringModalOpen(true)}
                            >
                                Proceed to hiring
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition m-1"
                        >
                            Submit
                        </button>
                    </>

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
            <ModalComponent
                isOpen={isHiringModalOpen}
                onClose={() => setIsHiringModalOpen(false)}
                title={<span className="font-bold text-lg text-blue-700">For hiring process</span>}
                body={
                    <div>
                        <div className="w-full flex justify-center pt-4">
                            <div className="w-full max-w-[380px]">
                                <SearchableSelect
                                    options={advList}
                                    value={advList.find(x => x.value === hiringData.IsAdviser)}
                                    onChange={(selected) =>
                                        setHiringData(prev => ({
                                            ...prev,
                                            IsAdviser: selected?.value || null
                                        }))
                                    }
                                    placeholder="-- Select if Adviser or Non-Adviser --"
                                    label="Select if Adviser or Non-Adviser"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-4 w-full">
                            <SearchableSelect
                                options={depList}
                                value={depList.find(x => x.value === hiringData.DepartmentId)}
                                onChange={(selected) =>
                                    setHiringData(prev => ({
                                        ...prev,
                                        DepartmentId: selected?.value || null
                                    }))
                                }
                                placeholder="-- Select Department --"
                                label="Assign Department"
                            />

                            <SearchableSelect
                                options={divList}
                                value={divList.find(x => x.value === hiringData.DivId)}
                                onChange={(selected) =>
                                    setHiringData(prev => ({
                                        ...prev,
                                        DivId: selected?.value || null
                                    }))
                                }
                                placeholder="-- Select Division --"
                                label="Assign Division"
                            />

                            <SearchableSelect
                                options={posList}
                                value={posList.find(x => x.value === hiringData.PositionId)}
                                onChange={(selected) =>
                                    setHiringData(prev => ({
                                        ...prev,
                                        PositionId: selected?.value || null
                                    }))
                                }
                                placeholder="-- Select Position --"
                                label="Assign Position"
                            />

                            <SearchableSelect
                                options={golList}
                                value={golList.find(x => x.value === hiringData.GoldenRankId)}
                                onChange={(selected) =>
                                    setHiringData(prev => ({
                                        ...prev,
                                        GoldenRankId: selected?.value || null
                                    }))
                                }
                                placeholder="-- Select Golden Ranking --"
                                label="Assign Golden Ranking"
                            />

                        </div>
                    </div>
                }
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmitHiring, },
                    { label: "Cancel", type: "red", onClick: () => setIsHiringModalOpen(false) },
                ]}
                size="w-[800px]"
                maxHeight="100vh"
            />
        </form>
    );
};

export default EmployeeInterviewComponent;