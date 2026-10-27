import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FaUser, FaClipboardCheck, FaTable, FaBriefcase, FaCheckCircle } from 'react-icons/fa';
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
} from "../../states/AssistantPrincipalState/Action";
import {
    fetchDepartmentTemplateData,
    fetchPositionTemplateData,
    fetchGoldenRankTemplateData,
    fetchInsertHiredEmployeeData,
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

const EmployeeInterviewComponent = ({ isEditing, employeeAppId, userId, userRoleId }) => {

    const currUserId = userId;
    const currUserRoleId = userRoleId;
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
            EmployeeCategory: null,
            EmployeeCategoryName: null,
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
        { EmployeeCategoryId: 1, EmployeeCategory: "Faculty" },
        { EmployeeCategoryId: 2, EmployeeCategory: "Non-Teaching Staff" },
        { EmployeeCategoryId: 3, EmployeeCategory: "Staff" },
        { EmployeeCategoryId: 4, EmployeeCategory: "Others" }
    ];
    
    console.log('positionList:', positionList);

    const recommendationList = [
        { RecommendationId: 1, RecommendationName: "Recommended for Teaching Demonstration (Faculty)" },
        { RecommendationId: 2, RecommendationName: "Recommended for Demonstration with reservations due to" },
        { RecommendationId: 3, RecommendationName: "Not Recommended" },
    ];

    const employeeData = useSelector(state => state.ap.employeeInfoState?.data || {});
    const employeScreeningData = useSelector(state => state.ap.employeeScreeningState?.data || {});
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
            DesiredPosition: employeeData.DesiredPosition ?? "",
            ApplicationThru: employeScreeningData.ApplicationThru ?? "",
            ApplicationThruOthers: employeScreeningData.ApplicationThruOthers ?? "",
            ApplicationType: employeScreeningData.ApplicationType ?? "",
            EmployeeNumber: employeScreeningData.EmployeeNumber ?? "",
            WorkExperience: employeScreeningData.WorkExperience ?? "",
            NoOfYearMonth: employeScreeningData.NoOfYearMonth ?? "",
            Remarks: "",
            Recommendation: "",
            Campus: null,
            EmployeeCategory: null,
            EmployeeCategoryName: null,
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
        if (!employeeData?.EmployeeCategory) return;

        const position = positionList.find(
            p => p.EmployeeCategory === employeeData.EmployeeCategory
        );

        if (position) {
            setValue("EmployeeCategory", position);
        }
    }, [employeeData, setValue]);

    console.log(employeeData);

    const selectedApplicationThru = watch("ApplicationThru");
    const selectedApplicationType = watch("ApplicationType");
    const selectedWorkExperience = watch("WorkExperience");

    const [criteriaList, setCriteriaList] = useState([]);
    const criteriaTableState = useSelector((state) => state.ap.criteriaTableState || {});
    const criteriaTable = criteriaTableState.data?.data || criteriaTableState.data || [];
    const criteriaTableTotalRows = criteriaTableState.data?.totalRecords || 0;
    const criteriaTableLoading = criteriaTableState.loading || false;
    const [criteriaTableCurrentPage, setCriteriaTableCurrentPage] = useState(1);
    const [criteriaTableRowsPerPage, setCriteriaTableRowsPerPage] = useState(10);
    const [isRatingExist, setIsRatingExist] = useState(false);
    
    console.log('employeeAppId:', employeeAppId);
    console.log('criteriaTableState:', criteriaTableState);
    console.log('criteriaTable:', criteriaTable);
    console.log('criteriaTable length:', criteriaTable?.length);
    
    useEffect(() => {
        if (!employeeAppId) {
            console.log('Skipping fetchCriteriaTableData: employeeAppId is not available');
            return;
        }
        console.log('Fetching criteria table data for employeeAppId:', employeeAppId);
        dispatch(fetchCriteriaTableData(employeeAppId, criteriaTableCurrentPage, criteriaTableRowsPerPage));
    }, [employeeAppId, criteriaTableCurrentPage, criteriaTableRowsPerPage, dispatch]);

    useEffect(() => {
        if (!criteriaTable.length) return;

        let nameOrderMap = null;

        if (employeeData?.EmployeeCategory == "Faculty") {
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

        const hasRatings = criteriaTable?.some(master =>
            master.CriteriaChildTableDtos?.some(child => child.Rating != null)
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
                        Rating: child.Rating // ðŸ‘ˆ important
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
                    onChange={(e) => {
                        console.log('onChange triggered!', row.CriteriaChildId, e.target.value);
                        handleRatingChange(row.CriteriaChildId, 1);
                    }}
                    onClick={() => console.log('onClick triggered!', row.CriteriaChildId)}
                    checked={ratings[row.CriteriaChildId] === 1}
                    disabled={!isEditing}
                    className="cursor-pointer w-4 h-4"
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
                    disabled={!isEditing}
                    className="cursor-pointer"
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
                    disabled={!isEditing}
                    className="cursor-pointer"
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
                    disabled={!isEditing}
                    className="cursor-pointer"
                />
            )
        }
    ];


    const handleRatingChange = (rowId, value) => {
        console.log('Rating changed:', { rowId, value });
        setRatings(prev => {
            const newRatings = {
                ...prev,
                [rowId]: value
            };
            console.log('Updated ratings state:', newRatings);
            return newRatings;
        });
    };


    const sacUserList = useSelector((state) => state.ap.sacUserState?.data || []);
    const apUserList = useSelector((state) => state.ap.apUserState?.data || []);
    const principalUserList = useSelector((state) => state.ap.principalUserState?.data || []);

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
            EmployeeCategory,
            Recommendation,
            ...rest
        } = formData;
        
        console.log('Form submission started');
        console.log('currUserRoleId:', currUserRoleId, 'type:', typeof currUserRoleId);
        console.log('ratings state:', ratings);
        console.log('criteriaTable:', criteriaTable);
        
        // Filter criteria with UserRoleId === 10 (HR/Initial Interview)
        const hrCriteria = criteriaTable.filter(criteria => criteria.UserRoleId === 10);
        console.log('HR Criteria (UserRoleId === 10):', hrCriteria);
        
        const CriteriaRatingDtos = [];

        // Process only HR criteria
        hrCriteria.forEach(criteria => {
            console.log('Processing HR criteria:', criteria.CriteriaId);
            console.log('CriteriaChildTableDtos:', criteria.CriteriaChildTableDtos);

            criteria.CriteriaChildTableDtos.forEach(child => {
                const childId = child.CriteriaChildId;
                const rating = ratings[childId];
                
                console.log(`Checking child ${childId}:`, {
                    CriteriaName: child.CriteriaName,
                    CriteriaChildId: childId,
                    RatingInState: rating,
                    HasRating: !!rating
                });
                
                if (rating) {
                    const ratingDto = {
                        CriteriaId: criteria.CriteriaId,
                        CriteriaChildId: childId,
                        Rating: rating.toString()
                    };
                    console.log('âœ… Adding rating:', ratingDto);
                    CriteriaRatingDtos.push(ratingDto);
                } else {
                    console.log('âŒ No rating found for child:', childId);
                }
            });
        });
        
        console.log('Total CriteriaRatingDtos collected:', CriteriaRatingDtos.length, CriteriaRatingDtos);

        const assignUsers = [];

        criteriaTable.forEach(criteria => {
            let userId = null;
            let recommendation = null;
            let remarks = null;

            // Map role IDs to their corresponding form fields
            // Only set recommendation/remarks for the current user's role (the one they're rating)
            if (criteria.UserRoleId === currUserRoleId) {
                // This is the criteria the current user is rating
                recommendation = formData.Recommendation?.RecommendationName;
                remarks = formData.Remarks;
            }

            switch (criteria.UserRoleId) {
                case 10: // HR/Initial Interview
                    userId = currUserId;
                    break;

                case 11: // SAC/Teaching Demonstration
                    userId = formData.SacUser?.UserId;
                    break;

                case 12: // Assistant Principal
                    userId = formData.ApUser?.UserId;
                    break;

                case 13: // Principal
                    userId = formData.PrincipalUser?.UserId;
                    break;

                // case 14: // Department Head
                //     userId = formData.DepartmentHeadUser?.UserId;
                //     break;

                default:
                    break;
            }

            if (userId) {
                const assignDto = {
                    CriteriaId: criteria.CriteriaId,
                    UserId: userId
                };

                // Add recommendation and remarks if this is the criteria being rated by current user
                if (recommendation) {
                    assignDto.Recommendation = recommendation;
                }
                if (remarks) {
                    assignDto.Remarks = remarks;
                }

                assignUsers.push(assignDto);
            }
        });

        const payload = {
            EmployeeId: formData.EmployeeId,
            EmployeeAppId: formData.EmployeeAppId,
            ApplicationThru: formData.ApplicationThru,
            ApplicationThruOthers: formData.ApplicationThruOthers,
            ApplicationType: formData.ApplicationType,
            WorkExperience: formData.WorkExperience,
            NoOfYearMonth: formData.NoOfYearMonth,
            CampusId: formData.Campus?.CampusId,
            EmployeeCategoryName: formData.EmployeeCategory?.EmployeeCategory,
            CreatedByUserId: currUserId,
            CriteriaRatingDtos: CriteriaRatingDtos,
            AssignRoleDtos: assignUsers  // Now includes Recommendation and Remarks per criteria
        };
        console.log('Ratings:', ratings);
        console.log('SUBMIT PAYLOAD:', payload);

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

    // const advList = [
    //     { value: "Yes", label: "Yes" },
    //     { value: "No", label: "No" },
    // ];

    const [hiringData, setHiringData] = useState({
        DepartmentId: null,
        DivId: null,
        PositionId: null,
        GoldenRankId: null,
        // IsAdviser: null,
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Header Section with Status Badge */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow p-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-md font-bold">Employee Interview Process</h3>
                        <p className="text-green-100 text-md mt-1">Application No: <span className="font-semibold">{employeeData?.EmployeeAppNo}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5">
                            <FaCheckCircle className="text-xs" />
                            <span>Editing On</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Applicant Information Card */}
            <div className="bg-white rounded-lg shadow pb-32">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 p-1.5 rounded">
                            <FaUser className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Applicant Information</h2>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField name="EmployeeAppNo" label="Employee Application Number" register={register} isEditing={isEditing} displayValue={employeeData?.EmployeeAppNo} />
                        <InputField name="Fullname" label="Full Name" register={register} isEditing={isEditing} displayValue={`${employeeData.Fname ?? ""} ${employeeData.Mname ?? ""} ${employeeData.Lname ?? ""}`} />
                        <InputField name="Nickname" label="Nick Name" register={register} isEditing={isEditing} displayValue={employeeData?.Nickname} />
                        <InputField name="DesiredPosition" label="Desired Position" register={register} isEditing={isEditing} displayValue={employeeData?.DesiredPosition} />
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
                            name="EmployeeCategory"
                            control={control}
                            list={positionList}
                            label="Employee Category"
                            labelKey="EmployeeCategory"
                            isEditing={!isEditing}
                            displayValue={employeeData.EmployeeCategory}
                        />
                        {employeScreeningData?.DateHired != null && (
                            <InputField name="DateHired" label="Date Hired" register={register} isEditing={false} displayValue={employeScreeningData?.DateHired} />
                        )}
                    </div>
                </div>
            </div>

            {/* Screening Section Card */}
            <div className="bg-white rounded-lg shadow">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-1.5 rounded">
                            <FaClipboardCheck className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Screening</h2>
                    </div>
                </div>
                <div className="p-4 space-y-6">
                    {/* Application Thru Section */}
                    <div className="space-y-3">
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
                            <div className="pl-4 border-l-2 border-purple-300">
                                <InputField
                                    name="ApplicationThruOthers"
                                    label="Please Specify"
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
                            </div>
                        )}
                    </div>

                    {/* ESS Application Type Section */}
                    <div className="space-y-3">
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
                            <div className="pl-4 border-l-2 border-purple-300">
                                <InputField
                                    name="EmployeeNumber"
                                    label="Employee Number"
                                    register={register}
                                    isEditing={isEditing}
                                    displayValue={employeeData?.EmployeeNumber ?? ""}
                                />
                            </div>
                        )}
                    </div>

                    {/* Work Experience Section */}
                    <div className="space-y-3">
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
                            <div className="pl-4 border-l-2 border-purple-300">
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
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Criteria Tables Section */}
            {criteriaTable.map((criteria, index) => (
                <div key={criteria.CriteriaId} className="bg-white rounded-lg shadow">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-1.5 rounded">
                                <FaTable className="text-white text-sm" />
                            </div>
                            <h2 className="text-base font-bold text-gray-800">{index + 1}. {criteria.CriteriaTempName}</h2>
                        </div>
                    </div>
                    <div className="p-4">
                        {!isRatingExist && criteria.UserRoleId != 10 && (
                            <div className="mb-4 flex justify-end">
                                <div className="w-full md:w-80">
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
                        )}
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
                        {isRatingExist && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
                                    displayValue={criteria.DateCreated}
                                />
                            </div>
                        )}
                        {!isRatingExist && (
                            <>
                                {criteria.UserRoleId == 10 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
                            </>
                        )}
                    </div>
                </div>
            ))}

            {/* Submit Button Section */}
            <div className="flex justify-end gap-2">
                {isEditing && (
                    <>
                        {isRatingExist && (
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                onClick={() => setIsHiringModalOpen(true)}
                            >
                                <FaBriefcase className="text-sm" />
                                <span>Proceed to Hiring</span>
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                        >
                            <FaBriefcase className="text-sm" />
                            <span>Submit Interview</span>
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
                        {/* <div className="w-full flex justify-center pt-4">
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
                        </div> */}
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
