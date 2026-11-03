import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
    FaUser, FaRing, FaUsers, FaGraduationCap, FaBriefcase, 
    FaSave, FaMapMarkerAlt, FaTimes, FaFileAlt, FaSitemap 
} from 'react-icons/fa';
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import Breadcrumb from "../SharedComponents/Breadcrumb";
import {
    fetchNationalityData,
    fetchReligionData,
    fetchProvinceData,
    fetchCityData,
    fetchBarangayData,
} from "../../states/OnlineApplicationState/Action";
import {
    fetchEmployeeApplicationInfoData,
    fetchEmployeeResume,
    fetchDepartmentTemplateData,
    fetchPositionTemplateData,
    fetchAllEmployees,
} from "../../states/HumanResourcesState/Action";
import { getFormatDate, getDateInputValue } from "../../GlobalFunction/FormatDate";

/**
 * EmployeeDataManagementComponent - Standalone page component for editing employee information
 * Gets employeeId from URL params
 */
const EmployeeDataManagementComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { employeeId } = useParams(); // Get from URL
    const userId = useSelector((state) => state.auth?.user?.UserId || 1); // Get from auth state
    const formatDate = getFormatDate;
    const toDateInputValue = getDateInputValue;

    // ─── Form Setup ───────────────────────────────────────────────────────────
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors, isDirty }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            EmployeeId: "",
            EmployeeNumber: "",
            EmployeeAppId: "",
            Fname: "",
            Mname: "",
            Lname: "",
            Nickname: "",
            Gender: "",
            TempEmail: "",
            DesiredPosition: "",
            EmployeeCategory: "",
            // Organizational Assignment
            DepartmentId: "",
            DepartmentName: "",
            PositionId: "",
            PositionName: "",
            DivisionId: "",
            DivisionName: "",
            SacHeadId: "",
            SacHeadName: "",
            HeadId: "",
            HeadName: "",
            // Personal Information
            DateOfBirth: "",
            PlaceOfBirth: "",
            MobilePhoneNo: "",
            ReligionId: "",
            ReligionName: "",
            NationalityId: "",
            NationalityName: "",
            CivilStatus: "",
            NameOfSpouse: "",
            SpouseOccupation: "",
            NoOfyearsMarried: "",
            NoOfChildren: "",
            AgeEldestChild: "",
            AgeYoungestChild: "",
            IsPregnant: "",
            FathersFullname: "",
            FathersAge: "",
            FathersOccupation: "",
            MothersFullname: "",
            MothersAge: "",
            MothersOccupation: "",
            NoOfSiblings: "",
            PrevEmployed: "",
            PlanToWorkAbroad: "",
            TargetYear: "",
            TeachingLicense: "",
            DateOfExamination: "",
            SchoolName: "",
            From: "",
            To: "",
            Degree: "",
            ProvinceCode: "",
            ProvinceName: "",
            CityCode: "",
            CityName: "",
            BrgyCode: "",
            BrgyName: "",
            HomeStreet: "",
            DateCreated: "",
            ActiveStatus: "",
            Nationality: null,
            Religion: null,
            Province: null,
            City: null,
            Barangay: null,
            Department: null,
            Position: null,
            SacHead: null,
            Head: null,
        }
    });

    // ─── Redux State ──────────────────────────────────────────────────────────
    const employeeData = useSelector(state => state.hr.employeeInfoState?.data || {});
    const employeeLoading = useSelector(state => state.hr.employeeInfoState?.loading || false);
    const nationalityList = useSelector(state => state.online.nationalityState?.data || []);
    const religionList = useSelector(state => state.online.religionState?.data || []);
    const provinceList = useSelector(state => state.online.provinceState?.data || []);
    const cityList = useSelector(state => state.online.cityState?.data || []);
    const brgyList = useSelector(state => state.online.barangayState?.data || []);
    const departmentList = useSelector(state => state.hr.departmentState?.data || []);
    const positionList = useSelector(state => state.hr.positionState?.data || []);
    const allEmployeesList = useSelector(state => state.hr.allEmployeesState?.data || []);

    // ─── Modal State ──────────────────────────────────────────────────────────
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);

    // ─── Fetch Initial Data ───────────────────────────────────────────────────
    useEffect(() => {
        if (employeeId) {
            dispatch(fetchEmployeeApplicationInfoData(employeeId));
            dispatch(fetchNationalityData());
            dispatch(fetchReligionData());
            dispatch(fetchProvinceData());
            dispatch(fetchDepartmentTemplateData());
            dispatch(fetchPositionTemplateData());
            dispatch(fetchAllEmployees());
        }
    }, [employeeId, dispatch]);

    // ─── Populate Form with Employee Data ────────────────────────────────────
    useEffect(() => {
        if (!employeeData || !employeeId) return;

        reset({
            EmployeeId: employeeData.EmployeeId ?? "",
            EmployeeNumber: employeeData.EmployeeNumber ?? "",
            EmployeeAppId: employeeData.EmployeeAppId ?? "",
            Fname: employeeData.Fname ?? "",
            Mname: employeeData.Mname ?? "",
            Lname: employeeData.Lname ?? "",
            Nickname: employeeData.Nickname ?? "",
            Gender: employeeData.Gender ?? "",
            TempEmail: employeeData.TempEmail ?? "",
            DesiredPosition: employeeData.DesiredPosition ?? "",
            EmployeeCategory: employeeData.EmployeeCategory ?? "",
            // Organizational Assignment
            DepartmentId: employeeData.DepartmentId ?? "",
            DepartmentName: employeeData.DepartmentName ?? "",
            PositionId: employeeData.PositionId ?? "",
            PositionName: employeeData.PositionName ?? "",
            DivisionId: employeeData.DivisionId ?? "",
            DivisionName: employeeData.DivisionName ?? "",
            SacHeadId: employeeData.SacHeadId ?? "",
            SacHeadName: employeeData.SacHeadName ?? "",
            HeadId: employeeData.HeadId ?? "",
            HeadName: employeeData.HeadName ?? "",
            // Personal Information
            DateOfBirth: employeeData.DateOfBirth ?? "",
            PlaceOfBirth: employeeData.PlaceOfBirth ?? "",
            MobilePhoneNo: employeeData.MobilePhoneNo ?? "",
            ReligionId: employeeData.ReligionId ?? "",
            ReligionName: employeeData.ReligionName ?? "",
            NationalityId: employeeData.NationalityId ?? "",
            NationalityName: employeeData.NationalityName ?? "",
            CivilStatus: employeeData.CivilStatus ?? "",
            NameOfSpouse: employeeData.NameOfSpouse ?? "",
            SpouseOccupation: employeeData.SpouseOccupation ?? "",
            NoOfyearsMarried: employeeData.NoOfyearsMarried ?? "",
            NoOfChildren: employeeData.NoOfChildren ?? "",
            AgeEldestChild: employeeData.AgeEldestChild ?? "",
            AgeYoungestChild: employeeData.AgeYoungestChild ?? "",
            IsPregnant: employeeData.IsPregnant ?? "",
            FathersFullname: employeeData.FathersFullname ?? "",
            FathersAge: employeeData.FathersAge ?? "",
            FathersOccupation: employeeData.FathersOccupation ?? "",
            MothersFullname: employeeData.MothersFullname ?? "",
            MothersAge: employeeData.MothersAge ?? "",
            MothersOccupation: employeeData.MothersOccupation ?? "",
            NoOfSiblings: employeeData.NoOfSiblings ?? "",
            PrevEmployed: employeeData.PrevEmployed ?? "",
            PlanToWorkAbroad: employeeData.PlanToWorkAbroad ?? "",
            TargetYear: employeeData.TargetYear ?? "",
            TeachingLicense: employeeData.TeachingLicense ?? "",
            DateOfExamination: employeeData.DateOfExamination ?? "",
            SchoolName: employeeData.SchoolName ?? "",
            From: employeeData.From ?? "",
            To: employeeData.To ?? "",
            Degree: employeeData.Degree ?? "",
            ProvinceCode: employeeData.ProvinceCode ?? "",
            ProvinceName: employeeData.ProvinceName ?? "",
            CityCode: employeeData.CityCode ?? "",
            CityName: employeeData.CityName ?? "",
            BrgyCode: employeeData.BrgyCode ?? "",
            BrgyName: employeeData.BrgyName ?? "",
            HomeStreet: employeeData.HomeStreet ?? "",
            DateCreated: employeeData.DateCreated ?? "",
            ActiveStatus: employeeData.ActiveStatus ?? "",
            Nationality: null,
            Religion: null,
            Province: null,
            City: null,
            Barangay: null,
            Department: null,
            Position: null,
            SacHead: null,
            Head: null,
        });
    }, [employeeData, employeeId, reset]);

    // ─── Populate Nationality Dropdown ────────────────────────────────────────
    useEffect(() => {
        if (!employeeData?.NationalityName || !nationalityList.length) return;

        const nationality = nationalityList.find(
            n => n.NationalityName === employeeData.NationalityName
        );

        if (nationality) {
            reset(prev => ({ ...prev, Nationality: nationality }));
        }
    }, [nationalityList, employeeData?.NationalityName, reset]);

    // ─── Populate Religion Dropdown ───────────────────────────────────────────
    useEffect(() => {
        if (!employeeData?.ReligionName || !religionList.length) return;

        const religion = religionList.find(
            r => r.ReligionName === employeeData.ReligionName
        );

        if (religion) {
            reset(prev => ({ ...prev, Religion: religion }));
        }
    }, [religionList, employeeData?.ReligionName, reset]);

    // ─── Populate Province Dropdown ───────────────────────────────────────────
    useEffect(() => {
        if (!employeeData?.ProvinceName || !provinceList.length) return;

        const province = provinceList.find(
            r => r.province_name === employeeData.ProvinceName
        );

        if (province) {
            reset(prev => ({ ...prev, Province: province }));
        }
    }, [provinceList, employeeData?.ProvinceName, reset]);

    // ─── Populate City Dropdown ───────────────────────────────────────────────
    useEffect(() => {
        if (!employeeData?.CityName || !cityList.length) return;

        const city = cityList.find(
            r => r.city_name === employeeData.CityName
        );

        if (city) {
            reset(prev => ({ ...prev, City: city }));
        }
    }, [cityList, employeeData?.CityName, reset]);

    // ─── Populate Barangay Dropdown ───────────────────────────────────────────
    useEffect(() => {
        if (!employeeData?.BrgyName || !brgyList.length) return;

        const brgy = brgyList.find(
            r => r.brgy_name === employeeData.BrgyName
        );

        if (brgy) {
            reset(prev => ({ ...prev, Barangay: brgy }));
        }
    }, [brgyList, employeeData?.BrgyName, reset]);

    // ─── Watch Form Fields ────────────────────────────────────────────────────
    const province = watch("Province");
    const city = watch("City");
    const civilStatus = watch("CivilStatus");
    const employeeCategory = watch("EmployeeCategory");

    // ─── Fetch Cities when Province Changes ──────────────────────────────────
    useEffect(() => {
        if (!province?.province_code) return;
        dispatch(fetchCityData(province.province_code));
    }, [province?.province_code, dispatch]);

    // ─── Fetch Barangays when City Changes ───────────────────────────────────
    useEffect(() => {
        if (!city?.city_code) return;
        dispatch(fetchBarangayData(city.city_code));
    }, [city?.city_code, dispatch]);

    // ─── Populate Department Dropdown ─────────────────────────────────────────
    useEffect(() => {
        if (!employeeData?.DepartmentName || !departmentList.length) return;

        const department = departmentList.find(
            d => d.DepChildName === employeeData.DepartmentName
        );

        if (department) {
            reset(prev => ({ ...prev, Department: department }));
        }
    }, [departmentList, employeeData?.DepartmentName, reset]);

    // ─── Populate Position Dropdown ───────────────────────────────────────────
    useEffect(() => {
        if (!employeeData?.PositionName || !positionList.length) return;

        const position = positionList.find(
            p => p.PosChildName === employeeData.PositionName
        );

        if (position) {
            reset(prev => ({ ...prev, Position: position }));
        }
    }, [positionList, employeeData?.PositionName, reset]);

    // ─── Populate SAC Head Dropdown ───────────────────────────────────────────
    useEffect(() => {
        if (!employeeData?.SacHeadName || !allEmployeesList.length) return;

        const sacHead = allEmployeesList.find(
            e => e.Fullname === employeeData.SacHeadName
        );

        if (sacHead) {
            reset(prev => ({ ...prev, SacHead: sacHead }));
        }
    }, [allEmployeesList, employeeData?.SacHeadName, reset]);

    // ─── Populate Head Dropdown ───────────────────────────────────────────────
    useEffect(() => {
        if (!employeeData?.HeadName || !allEmployeesList.length) return;

        const head = allEmployeesList.find(
            e => e.Fullname === employeeData.HeadName
        );

        if (head) {
            reset(prev => ({ ...prev, Head: head }));
        }
    }, [allEmployeesList, employeeData?.HeadName, reset]);

    // ─── Handle View Resume ───────────────────────────────────────────────────
    const handleViewResume = async () => {
        if (employeeData?.EmployeeId) {
            const result = await dispatch(fetchEmployeeResume(employeeData.EmployeeId));
            if (!result.ok) {
                alert('Failed to open resume. Please try again.');
            }
        } else {
            alert('No resume file available for this employee.');
        }
    };

    // ─── Handle Form Submit ───────────────────────────────────────────────────
    const onSubmit = (data) => {
        setFormData(data);
        setIsConfirmModalOpen(true);
    };

    // ─── Handle Confirm Submit ────────────────────────────────────────────────
    const handleConfirmSubmit = async () => {
        if (!formData) return;

        const {
            Nationality,
            Religion,
            Province,
            City,
            Barangay,
            Department,
            Position,
            SacHead,
            Head,
            ...rest
        } = formData;

        const payload = {
            ...rest,
            NationalityId: formData.Nationality?.NationalityId,
            NationalityName: "",
            ReligionId: formData.Religion?.ReligionId,
            ReligionName: "",
            ProvinceCode: formData.Province?.province_code,
            ProvinceName: formData.Province?.province_name,
            CityCode: formData.City?.city_code,
            CityName: formData.City?.city_name,
            BrgyCode: formData.Barangay?.brgy_code,
            BrgyName: formData.Barangay?.brgy_name,
            DepartmentId: formData.Department?.DepChildId,
            DepartmentName: formData.Department?.DepChildName,
            PositionId: formData.Position?.PosChildId,
            PositionName: formData.Position?.PosChildName,
            SacHeadId: formData.SacHead?.EmployeeId,
            SacHeadName: formData.SacHead?.Fullname,
            HeadId: formData.Head?.EmployeeId,
            HeadName: formData.Head?.Fullname,
            ModifiedByUserId: userId,
        };

        console.log("EMPLOYEE EDIT PAYLOAD:", payload);

        // TODO: Replace with actual update action
        // const res = await dispatch(fetchUpdateEmployeeData(payload));
        // if (res.ok) {
        //     setIsSuccessModalOpen(true);
        // }

        // For now, simulate success
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    // ─── Handle Back Navigation ───────────────────────────────────────────────
    const handleBack = () => {
        if (isDirty) {
            const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
            if (!confirmLeave) return;
        }
        navigate(-1); // Go back to previous page
    };

    // ─── Handle Success ───────────────────────────────────────────────────────
    const handleSuccessClose = () => {
        setIsSuccessModalOpen(false);
        navigate(-1); // Go back to employee list
    };

    if (!employeeId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 font-semibold">No employee ID provided</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Human Resources', href: '/hrd/dashboard' },
        { label: 'Employee Directory', href: '/hrd/employee-list' },
        { label: 'Employee Data Management', href: `/hrd/employeedatamanagement/${employeeId}` },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-4 py-2">
            {/* Breadcrumb */}
            <div className="mb-2">
                <Breadcrumb items={breadcrumbItems} />
                <div className="flex items-center justify-between mt-1">
                    <h2 className="text-sm font-bold text-black">
                        Employee Data Management - {employeeData.EmployeeNumber || 'N/A'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200"
                        >
                            <FaTimes size={14} />
                            <span>Back</span>
                        </button>
                        {employeeData?.EmployeeId && (
                            <button
                                type="button"
                                onClick={handleViewResume}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200"
                            >
                                <FaFileAlt size={14} />
                                <span>View Resume</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-full mx-auto">
                {employeeLoading ? (
                    <div className="flex items-center justify-center py-20 bg-white rounded-lg shadow">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading employee data...</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Main Content Area */}
                        <div className="flex-1">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                                {/* Personal Information Card */}
                                <div className="bg-white rounded-lg shadow border border-gray-200">
                                    <div className="bg-gradient-to-r from-blue-50 to-green-50 px-3 py-2 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-green-600 p-1 rounded">
                                                <FaUser className="text-white text-xs" />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-800">Personal Information</h3>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <InputField name="Fname" label="First Name" register={register} isEditing={true} />
                                            <InputField name="Mname" label="Middle Name" register={register} isEditing={true} />
                                            <InputField name="Lname" label="Last Name" register={register} isEditing={true} />
                                            <InputField name="Nickname" label="Nickname" register={register} isEditing={true} />
                                            <InputField name="Gender" label="Gender" register={register} isEditing={true} />
                                            <InputField name="DateOfBirth" label="Date of Birth" register={register} isEditing={true} type="date" />
                                            <InputField name="PlaceOfBirth" label="Place of Birth" register={register} isEditing={true} />
                                            <InputField name="TempEmail" label="Email Address" register={register} isEditing={true} type="email" />
                                            <InputField name="MobilePhoneNo" label="Mobile Phone No." register={register} isEditing={true} />
                                            <RHFListbox name="Nationality" control={control} list={nationalityList} label="Nationality" labelKey="NationalityName" isEditing={false} />
                                            <RHFListbox name="Religion" control={control} list={religionList} label="Religion" labelKey="ReligionName" isEditing={false} />
                                            <InputField name="DesiredPosition" label="Desired Position" register={register} isEditing={true} />
                                        </div>
                                    </div>
                                </div>

                                {/* Organizational Assignment Card */}
                                <div className="bg-white rounded-lg shadow border border-gray-200">
                                    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 px-3 py-2 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-cyan-600 p-1 rounded">
                                                <FaSitemap className="text-white text-xs" />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-800">Organizational Assignment</h3>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <RHFListbox 
                                                name="Department" 
                                                control={control} 
                                                list={departmentList} 
                                                label="Department" 
                                                labelKey="DepChildName" 
                                                isEditing={false} 
                                            />
                                            <RHFListbox 
                                                name="Position" 
                                                control={control} 
                                                list={positionList} 
                                                label="Position" 
                                                labelKey="PosChildName" 
                                                isEditing={false} 
                                            />
                                            <InputField name="DivisionName" label="Division" register={register} isEditing={true} />
                                            
                                            {/* For Faculty: Show SAC Head */}
                                            {employeeCategory && employeeCategory.toLowerCase() === "faculty" && (
                                                <RHFListbox 
                                                    name="SacHead" 
                                                    control={control} 
                                                    list={allEmployeesList} 
                                                    label="SAC Head Assigned" 
                                                    labelKey="Fullname" 
                                                    isEditing={false} 
                                                />
                                            )}
                                            
                                            {/* For NTF/Staff: Show Head */}
                                            {employeeCategory && (employeeCategory.toLowerCase() === "ntf" || employeeCategory.toLowerCase() === "staff" || employeeCategory.toLowerCase() === "non-teaching staff") && (
                                                <RHFListbox 
                                                    name="Head" 
                                                    control={control} 
                                                    list={allEmployeesList} 
                                                    label="Head Assigned" 
                                                    labelKey="Fullname" 
                                                    isEditing={false} 
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information Card */}
                                <div className="bg-white rounded-lg shadow border border-gray-200">
                                    <div className="bg-gradient-to-r from-blue-50 to-green-50 px-3 py-2 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-600 p-1 rounded">
                                                <FaMapMarkerAlt className="text-white text-xs" />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-800">Address Information</h3>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <RHFListbox name="Province" control={control} list={provinceList} label="Province" labelKey="province_name" isEditing={false} />
                                            <RHFListbox name="City" control={control} list={cityList} label="City/Municipality" labelKey="city_name" isEditing={false} />
                                            <RHFListbox name="Barangay" control={control} list={brgyList} label="Barangay" labelKey="brgy_name" isEditing={false} />
                                            <div className="md:col-span-2 lg:col-span-4">
                                                <InputField name="HomeStreet" label="House No. / Street" register={register} isEditing={true} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Civil Status Field */}
                                <div className="bg-white rounded-lg shadow border border-gray-200 p-3">
                                    <InputField name="CivilStatus" label="Civil Status" register={register} isEditing={true} />
                                </div>

                                {/* Spouse Information Card - Conditional */}
                                {civilStatus && civilStatus.toLowerCase() !== "single" && (
                                    <div className="bg-white rounded-lg shadow border border-gray-200">
                                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-3 py-2 border-b border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-pink-600 p-1 rounded">
                                                    <FaRing className="text-white text-xs" />
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-800">Spouse Information</h3>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                <InputField name="NameOfSpouse" label="Full Name" register={register} isEditing={true} />
                                                <InputField name="SpouseOccupation" label="Occupation" register={register} isEditing={true} />
                                                <InputField name="NoOfyearsMarried" label="Years Married" register={register} isEditing={true} />
                                                <InputField name="NoOfChildren" label="Number of Children" register={register} isEditing={true} />
                                                <InputField name="AgeEldestChild" label="Age of Eldest Child" register={register} isEditing={true} />
                                                <InputField name="AgeYoungestChild" label="Age of Youngest Child" register={register} isEditing={true} />
                                                <InputField name="IsPregnant" label="Is Pregnant?" register={register} isEditing={true} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Parents Information Card */}
                                <div className="bg-white rounded-lg shadow border border-gray-200">
                                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-2 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-indigo-600 p-1 rounded">
                                                <FaUsers className="text-white text-xs" />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-800">Parents Information</h3>
                                        </div>
                                    </div>
                                    <div className="p-3 space-y-3">
                                        {/* Father's Information */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                                                    F
                                                </div>
                                                <h4 className="text-xs font-semibold text-gray-700">Father's Information</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pl-7">
                                                <InputField name="FathersFullname" label="Full Name" register={register} isEditing={true} />
                                                <InputField name="FathersAge" label="Age" register={register} isEditing={true} />
                                                <InputField name="FathersOccupation" label="Occupation" register={register} isEditing={true} />
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 my-2"></div>

                                        {/* Mother's Information */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-pink-600 text-white text-xs font-bold">
                                                    M
                                                </div>
                                                <h4 className="text-xs font-semibold text-gray-700">Mother's Information</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pl-7">
                                                <InputField name="MothersFullname" label="Full Name" register={register} isEditing={true} />
                                                <InputField name="MothersAge" label="Age" register={register} isEditing={true} />
                                                <InputField name="MothersOccupation" label="Occupation" register={register} isEditing={true} />
                                                <InputField name="NoOfSiblings" label="Number of Siblings" register={register} isEditing={true} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Educational Background Card */}
                                <div className="bg-white rounded-lg shadow border border-gray-200">
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-2 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-purple-600 p-1 rounded">
                                                <FaGraduationCap className="text-white text-xs" />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-800">Highest Educational Attainment</h3>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <div className="lg:col-span-2">
                                                <InputField name="SchoolName" label="School Name" register={register} isEditing={true} />
                                            </div>
                                            <InputField name="From" label="From (Year)" register={register} isEditing={true} type="date" />
                                            <InputField name="To" label="To (Year)" register={register} isEditing={true} type="date" />
                                            <div className="lg:col-span-4">
                                                <InputField name="Degree" label="Degree/Course" register={register} isEditing={true} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Information Card */}
                                <div className="bg-white rounded-lg shadow border border-gray-200">
                                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-3 py-2 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-orange-600 p-1 rounded">
                                                <FaBriefcase className="text-white text-xs" />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-800">Employment Information</h3>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <InputField name="PrevEmployed" label="Previously Employed" register={register} isEditing={true} />
                                            <InputField name="PlanToWorkAbroad" label="Plan to Work Abroad" register={register} isEditing={true} />
                                            <InputField name="TargetYear" label="Target Year" register={register} isEditing={true} />
                                            <InputField name="TeachingLicense" label="Teaching License No." register={register} isEditing={true} />
                                            <InputField name="DateOfExamination" label="Date of Examination" register={register} isEditing={true} type="date" />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                    >
                                        <FaSave className="text-xs" />
                                        <span>Save Changes</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ModalComponent
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title={<span className="font-bold text-lg text-blue-700">Confirm Changes</span>}
                body="Are you sure you want to save these changes to the employee information?"
                buttons={[
                    { label: "Yes, Save Changes", type: "green", onClick: handleConfirmSubmit },
                    { label: "Cancel", type: "red", onClick: () => setIsConfirmModalOpen(false) },
                ]}
            />

            {/* Success Modal */}
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessClose}
                title={<span className="font-bold text-lg text-green-700">Success!</span>}
                body="Employee information has been updated successfully!"
                buttons={[
                    { label: "OK", type: "green", onClick: handleSuccessClose },
                ]}
            />
        </div>
    );
};

export default EmployeeDataManagementComponent;
