// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from "react-router-dom";
// import {
//     fetchEmployeeApplicationInfoData,
// } from "../../states/HumanResourcesState/Action";


// const EmployeeAppForm = () => {

//     const { search } = useLocation();
//     const dispatch = useDispatch();
//     const query = new URLSearchParams(search);
//     const employeeAppId = query.get("employeeAppId");
//     const employeeInfoState = useSelector((state) => state.hr.employeeInfoState || {});
//     const employeeData = employeeInfoState.data || [];
//     console.log(employeeData)

//     useEffect(() => {
//         dispatch(fetchEmployeeApplicationInfoData(employeeAppId));
//     },[employeeAppId, dispatch]);   


//     return (
//         <div className="items-center">
//             {employeeData.Fname}
//         </div>
//     );
// };

// export default EmployeeAppForm;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
    FaUser, FaRing, FaUsers, FaGraduationCap, FaInfoCircle, 
    FaArrowRight, FaSave, FaMapMarkerAlt, FaBriefcase, FaFileAlt 
} from 'react-icons/fa';
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchNationalityData,
    fetchReligionData,
    fetchProvinceData,
    fetchCityData,
    fetchBarangayData,
} from "../../states/OnlineApplicationState/Action";
import {
    fetchUpdateStudentInfoData,
} from "../../states/AdmissionState/Action";
import {
    fetchEmployeeApplicationInfoData,
    fetchEmployeeResume,
} from "../../states/HumanResourcesState/Action";
import { getFormatDate, getDateInputValue } from "../../GlobalFunction/FormatDate";

const EmployeeOnlineAppForm = ({ isEditing, appId, userId }) => {
    const dispatch = useDispatch();
    const formatDate = getFormatDate;
    const toDateInputValue = getDateInputValue;
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            EmployeeId: "",
            EmployeeNumber: "",
            EmployeeAppId: "",
            EmployeeAppNo: "",
            Fname: "",
            Mname: "",
            Lname: "",
            Nickname: "",
            Gender: "",
            Designation: "",
            DateOfBirth: "",
            PlaceOfBirth: "",
            MobilePhoneNo: "",
            ReligionId: "",
            ReligionName: "",
            NationalityId: "",
            NationalityName: "",
            CampusId: "",
            CampusName: "",
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
        }
    });

    const employeeData = useSelector(state => state.hr.employeeInfoState?.data || {});
    const nationalityList = useSelector(state => state.online.nationalityState?.data || []);
    const religionList = useSelector(state => state.online.religionState?.data || []);
    const provinceList = useSelector(state => state.online.provinceState?.data || []);
    const cityList = useSelector(state => state.online.cityState?.data || []);
    const brgyList = useSelector(state => state.online.barangayState?.data || []);

    useEffect(() => {
        // dispatch(fetchStudentByIdData(appId));
        dispatch(fetchEmployeeApplicationInfoData(appId));
        dispatch(fetchNationalityData());
        dispatch(fetchReligionData());
        dispatch(fetchProvinceData());
    }, [dispatch, appId]);

    useEffect(() => {
        if (!employeeData || !isEditing) return;

        reset({
            EmployeeId: employeeData.EmployeeId ?? "",
            EmployeeNumber: employeeData.EmployeeNumber ?? "",
            EmployeeAppId: employeeData.EmployeeAppId ?? "",
            EmployeeAppNo: employeeData.EmployeeAppNo ?? "",
            Fname: employeeData.Fname ?? "",
            Mname: employeeData.Mname ?? "",
            Lname: employeeData.Lname ?? "",
            Nickname: employeeData.Nickname ?? "",
            Gender: employeeData.Gender ?? "",
            TempEmail: employeeData.TempEmail ?? "",
            DesiredPosition: employeeData.DesiredPosition ?? "",
            EmployeeCategory: employeeData.EmployeeCategory ?? "",
            DateOfBirth: employeeData.DateOfBirth ?? "",
            PlaceOfBirth: employeeData.PlaceOfBirth ?? "",
            MobilePhoneNo: employeeData.MobilePhoneNo ?? "",
            ReligionId: employeeData.ReligionId ?? "",
            ReligionName: employeeData.ReligionName ?? "",
            NationalityId: employeeData.NationalityId ?? "",
            NationalityName: employeeData.NationalityName ?? "",
            CampusId: employeeData.CampusId ?? "",
            CampusName: employeeData.CampusName ?? "",
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
        });
    }, [employeeData, isEditing, reset]);

    useEffect(() => {
        if (!isEditing || !employeeData?.NationalityName || !nationalityList.length) return;

        const nationality = nationalityList.find(
            n => n.NationalityName === employeeData.NationalityName
        );

        if (nationality) {
            reset(prev => ({ ...prev, Nationality: nationality }));
        }
    }, [nationalityList, employeeData?.NationalityName, isEditing]);

    useEffect(() => {
        if (!isEditing || !employeeData?.ReligionName || !religionList.length) return;

        const religion = religionList.find(
            r => r.ReligionName === employeeData.ReligionName
        );

        if (religion) {
            reset(prev => ({ ...prev, Religion: religion }));
        }
    }, [religionList, employeeData?.ReligionName, isEditing]);

    useEffect(() => {
        if (!isEditing || !employeeData?.ProvinceName || !provinceList.length) return;

        const province = provinceList.find(
            r => r.province_name === employeeData.ProvinceName
        );

        if (province) {
            reset(prev => ({ ...prev, Province: province }));
        }
    }, [provinceList, employeeData?.ProvinceName, isEditing]);

    useEffect(() => {
        if (!isEditing || !employeeData?.CityName || !cityList.length) return;

        const city = cityList.find(
            r => r.city_name === employeeData.CityName
        );

        if (city) {
            reset(prev => ({ ...prev, City: city }));
        }
    }, [cityList, employeeData?.CityName, isEditing]);

    useEffect(() => {
        if (!isEditing || !employeeData?.BrgyName || !brgyList.length) return;

        const brgy = brgyList.find(
            r => r.brgy_name === employeeData.BrgyName
        );

        if (brgy) {
            reset(prev => ({ ...prev, Barangay: brgy }));
        }
    }, [brgyList, employeeData?.BrgyName, isEditing]);

    const province = watch("Province");
    const city = watch("City");

    useEffect(() => {
        if (!province?.province_code) return;
        dispatch(fetchCityData(province.province_code));
    }, [province?.province_code]);

    useEffect(() => {
        if (!city?.city_code) return;
        dispatch(fetchBarangayData(city.city_code));
    }, [city?.city_code]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);

    // Function to handle viewing resume
    const handleViewResume = async () => {
        if (employeeData?.EmployeeId) {
            const result = await dispatch(fetchEmployeeResume(employeeData.EmployeeId));
            if (!result.ok) {
                alert('Failed to open resume. Please try again.');
            }
        } else {
            alert('No resume file available for this applicant.');
        }
    };

    const onSubmit = (data) => {
        setFormData(data);
        setIsModalOpen(true);
    };
    const handleConfirmSubmit = async () => {
        if (!formData) return;

        const {
            Campus,
            Division,
            Level,
            Strand,
            Nationality,
            Religion,
            Province,
            City,
            Barangay,
            ...rest
        } = formData;

        const payload = {
            ...rest,
            CampusId: formData.Campus?.CampusId,
            CampusName: "",
            DivId: formData.Division?.DivId,
            DivName: "",
            LevelId: formData.Level?.LevelId,
            LevelName: "",
            StrandId: formData.Strand?.StrandId ?? null,
            StrandName: null,
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
            ModifiedByUserId: userId,
        };

        console.log("SUBMIT PAYLOAD:", payload);

        const res = await dispatch(fetchUpdateStudentInfoData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
    };

    const handleProceed = () => {
        navigate(`/hrd/employeehiringprocess?employeeAppId=${employeeData.EmployeeAppId}`);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Header Section with Status Badge */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow p-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-md font-bold">Employee Application Information</h3>
                        <p className="text-green-100 text-md mt-1">Application No: <span className="font-semibold">{employeeData.EmployeeAppNo}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* View Resume Button */}
                        <button
                            type="button"
                            onClick={handleViewResume}
                            className="px-3 py-1.5 bg-white/90 hover:bg-white text-green-700 text-xs font-medium rounded flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow"
                        >
                            <FaFileAlt className="text-xs" />
                            <span>View Resume</span>
                        </button>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded text-xs font-medium">
                            Status: {employeeData.ActiveStatus || 'Active'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Applicant Information Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 p-1.5 rounded">
                            <FaUser className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Applicant Information</h2>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField name="Fname" label="First Name" register={register} isEditing={isEditing} displayValue={employeeData.Fname} />
                        <InputField name="Mname" label="Middle Name" register={register} isEditing={isEditing} displayValue={employeeData.Mname} />
                        <InputField name="Lname" label="Last Name" register={register} isEditing={isEditing} displayValue={employeeData.Lname} />
                        <InputField name="Nickname" label="Nickname" register={register} isEditing={isEditing} displayValue={employeeData.Nickname} />
                        <InputField name="Gender" label="Gender" register={register} isEditing={isEditing} displayValue={employeeData.Gender} />
                        <InputField name="DateOfBirth" label="Date of Birth" register={register} isEditing={isEditing} displayValue={isEditing ? toDateInputValue(employeeData.DateOfBirth) : formatDate(employeeData.DateOfBirth)} {...(isEditing ? { type: "date" } : {})} />
                        <InputField name="PlaceOfBirth" label="Place of Birth" register={register} isEditing={isEditing} displayValue={employeeData.PlaceOfBirth} />
                        <InputField name="TempEmail" label="Email Address" register={register} isEditing={isEditing} displayValue={employeeData.TempEmail} />
                        <InputField name="MobilePhoneNo" label="Mobile Phone No." register={register} isEditing={isEditing} displayValue={employeeData.MobilePhoneNo} />
                        <RHFListbox name="Nationality" control={control} list={nationalityList} label="Nationality" labelKey="NationalityName" isEditing={!isEditing} displayValue={employeeData.NationalityName} />
                        <RHFListbox name="Religion" control={control} list={religionList} label="Religion" labelKey="ReligionName" isEditing={!isEditing} displayValue={employeeData.ReligionName} />
                        <InputField name="DesiredPosition" label="Desired Position" register={register} isEditing={isEditing} displayValue={employeeData.DesiredPosition} />
                    </div>
                </div>
            </div>

            {/* Address Information Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded">
                            <FaMapMarkerAlt className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Address Information</h2>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <RHFListbox name="Province" control={control} list={provinceList} label="Province" labelKey="province_name" isEditing={!isEditing} displayValue={employeeData.ProvinceName} />
                        <RHFListbox name="City" control={control} list={cityList} label="City/Municipality" labelKey="city_name" isEditing={!isEditing} displayValue={employeeData.CityName} />
                        <RHFListbox name="Barangay" control={control} list={brgyList} label="Barangay" labelKey="brgy_name" isEditing={!isEditing} displayValue={employeeData.BrgyName} />
                        <div className="md:col-span-2 lg:col-span-3">
                            <InputField name="HomeStreet" label="House No. / Street" register={register} isEditing={isEditing} displayValue={employeeData.HomeStreet} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Spouse Information Card - Conditional */}
            {employeeData?.CivilStatus !== "single" && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="bg-pink-600 p-1.5 rounded">
                                <FaRing className="text-white text-sm" />
                            </div>
                            <h2 className="text-base font-bold text-gray-800">Spouse Information</h2>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InputField name="NameOfSpouse" label="Full Name" register={register} isEditing={isEditing} displayValue={employeeData.NameOfSpouse} />
                            <InputField name="SpouseOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={employeeData.SpouseOccupation} />
                            <InputField name="NoOfyearsMarried" label="Years Married" register={register} isEditing={isEditing} displayValue={employeeData.NoOfyearsMarried} />
                            <InputField name="NoOfChildren" label="Number of Children" register={register} isEditing={isEditing} displayValue={employeeData.NoOfChildren} />
                            <InputField name="AgeEldestChild" label="Age of Eldest Child" register={register} isEditing={isEditing} displayValue={employeeData.AgeEldestChild} />
                            <InputField name="AgeYoungestChild" label="Age of Youngest Child" register={register} isEditing={isEditing} displayValue={employeeData.AgeYoungestChild} />
                            <InputField name="IsPregnant" label="Is Pregnant?" register={register} isEditing={isEditing} displayValue={employeeData.IsPregnant} />
                        </div>
                    </div>
                </div>
            )}

            {/* Parents Information Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded">
                            <FaUsers className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Parents Information</h2>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {/* Father's Information */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                                F
                            </div>
                            <h3 className="text-sm font-semibold text-gray-700">Father's Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">
                            <InputField name="FathersFullname" label="Full Name" register={register} isEditing={isEditing} displayValue={employeeData.FathersFullname} />
                            <InputField name="FathersAge" label="Age" register={register} isEditing={isEditing} displayValue={employeeData.FathersAge} />
                            <InputField name="FathersOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={employeeData.FathersOccupation} />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 my-3"></div>

                    {/* Mother's Information */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-pink-600 text-white text-xs font-bold">
                                M
                            </div>
                            <h3 className="text-sm font-semibold text-gray-700">Mother's Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">
                            <InputField name="MothersFullname" label="Full Name" register={register} isEditing={isEditing} displayValue={employeeData.MothersFullname} />
                            <InputField name="MothersAge" label="Age" register={register} isEditing={isEditing} displayValue={employeeData.MothersAge} />
                            <InputField name="MothersOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={employeeData.MothersOccupation} />
                            <InputField name="NoOfSiblings" label="Number of Siblings" register={register} isEditing={isEditing} displayValue={employeeData.NoOfSiblings} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Educational Background Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-1.5 rounded">
                            <FaGraduationCap className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Highest Educational Attainment</h2>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2">
                            <InputField name="SchoolName" label="School Name" register={register} isEditing={isEditing} displayValue={employeeData.SchoolName} />
                        </div>
                        <InputField name="From" label="From (Year)" register={register} isEditing={isEditing} displayValue={isEditing ? toDateInputValue(employeeData.From) : formatDate(employeeData.From)} {...(isEditing ? { type: "date" } : {})} />
                        <InputField name="To" label="To (Year)" register={register} isEditing={isEditing} displayValue={isEditing ? toDateInputValue(employeeData.To) : formatDate(employeeData.To)} {...(isEditing ? { type: "date" } : {})} />
                        <div className="lg:col-span-4">
                            <InputField name="Degree" label="Degree/Course" register={register} isEditing={isEditing} displayValue={employeeData.Degree} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Other Information Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-600 p-1.5 rounded">
                            <FaBriefcase className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Employment Information</h2>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField name="PrevEmployed" label="Previously Employed" register={register} isEditing={isEditing} displayValue={employeeData.PrevEmployed} />
                        <InputField name="PlanToWorkAbroad" label="Plan to Work Abroad" register={register} isEditing={isEditing} displayValue={employeeData.PlanToWorkAbroad} />
                        <InputField name="TargetYear" label="Target Year" register={register} isEditing={isEditing} displayValue={employeeData.TargetYear} />
                        <InputField name="TeachingLicense" label="Teaching License No." register={register} isEditing={isEditing} displayValue={employeeData.TeachingLicense} />
                        <InputField name="DateOfExamination" label="Date of Examination" register={register} isEditing={isEditing} displayValue={isEditing ? toDateInputValue(employeeData.DateOfExamination) : formatDate(employeeData.DateOfExamination)} {...(isEditing ? { type: "date" } : {})} />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={handleProceed}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                    <span>Proceed to Hiring Process</span>
                    <FaArrowRight className="text-xs" />
                </button>
                {isEditing && (
                    <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <FaSave className="text-xs" />
                        <span>Save Changes</span>
                    </button>
                )}
            </div>

            {/* Modals */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Confirm Submission</span>}
                body="Are you sure you want to submit these changes?"
                buttons={[
                    { label: "Yes, Submit", type: "green", onClick: handleConfirmSubmit },
                    { label: "Cancel", type: "red", onClick: () => setIsModalOpen(false) },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success!</span>}
                body="Employee information has been updated successfully!"
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) },
                ]}
            />
        </form>
    );
};

export default EmployeeOnlineAppForm;
