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
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchCampusData,
    fetchDivisionData,
    fetchLevelData,
    fetchStrandData,
    fetchNationalityData,
    fetchReligionData,
    fetchProvinceData,
    fetchCityData,
    fetchBarangayData,
} from "../../states/OnlineApplicationState/Action";
import {
    fetchStudentByIdData,
    fetchUpdateStudentInfoData,
} from "../../states/AdmissionState/Action";
import {
    fetchEmployeeApplicationInfoData,
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
            Position: employeeData.Position ?? "",
            Designation: employeeData.Designation ?? "",
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                    <InputField name="EmployeeAppNo" label="Employee Application Number" register={register} isEditing={isEditing} displayValue={employeeData.EmployeeAppNo} />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                    <InputField name="Fname" label="First Name" register={register} isEditing={isEditing} displayValue={employeeData.Fname} />
                    <InputField name="Mname" label="Middle Name" register={register} isEditing={isEditing} displayValue={employeeData.Mname} />
                    <InputField name="Lname" label="Last Name" register={register} isEditing={isEditing} displayValue={employeeData.Lname} />
                    <InputField name="Nickname" label="Nick Name" register={register} isEditing={isEditing} displayValue={employeeData.Nickname} />
                    <InputField name="TempEmail" label="Other Email" register={register} isEditing={isEditing} displayValue={employeeData.TempEmail} />
                    <InputField name="Position" label="Desired Position" register={register} isEditing={isEditing} displayValue={employeeData.Position} />
                    <InputField name="Gender" label="Gender" register={register} isEditing={isEditing} displayValue={employeeData.Gender} />
                    <InputField name="DateOfBirth" label="Date of birth" register={register} isEditing={isEditing} displayValue={isEditing ? toDateInputValue(employeeData.DateOfBirth) : formatDate(employeeData.DateOfBirth)} {...(isEditing ? { type: "date" } : {})} />
                    <InputField name="PlaceOfBirth" label="Place of birth" register={register} isEditing={isEditing} displayValue={employeeData.PlaceOfBirth} />
                    <InputField name="MobilePhoneNo" label="Mobile Phone No." register={register} isEditing={isEditing} displayValue={employeeData.MobilePhoneNo} />
                    <RHFListbox name="Nationality" control={control} list={nationalityList} label="Nationality" labelKey="NationalityName" isEditing={!isEditing} displayValue={employeeData.NationalityName} />
                    <RHFListbox name="Religion" control={control} list={religionList} label="Religion" labelKey="ReligionName" isEditing={!isEditing} displayValue={employeeData.ReligionName} />
                    <RHFListbox name="Province" control={control} list={provinceList} label="Province" labelKey="province_name" isEditing={!isEditing} displayValue={employeeData.ProvinceName} />
                    <RHFListbox name="City" control={control} list={cityList} label="City" labelKey="city_name" isEditing={!isEditing} displayValue={employeeData.CityName} />
                    <RHFListbox name="Barangay" control={control} list={brgyList} label="Barangay" labelKey="brgy_name" isEditing={!isEditing} displayValue={employeeData.BrgyName} />
                    <InputField name="HomeStreet" label="Home Street No." register={register} isEditing={isEditing} displayValue={employeeData.HomeStreet} />
                    {/*<RHFListbox name="Campus" control={control} list={campusList} label="Campus" labelKey="CampusName" isEditing={!isEditing} displayValue={studentData.CampusName} />
                    <RHFListbox name="Division" control={control} list={divisionList} label="Division" labelKey="DivName" isEditing={!isEditing} displayValue={studentData.DivName} />
                    <RHFListbox name="Level" control={control} list={levelList} label="Level" labelKey="LevelName" isEditing={!isEditing} displayValue={studentData.LevelName} />

                    {level?.LevelId === 15 && (
                        <RHFListbox name="Strand" control={control} list={strandList} label="Strand" labelKey="StrandName" isEditing={!isEditing} displayValue={studentData.StrandName} />
                    )}

                    
                    <RHFListbox name="Province" control={control} list={provinceList} label="Province" labelKey="province_name" isEditing={!isEditing} displayValue={studentData.ProvinceName} />
                    <RHFListbox name="City" control={control} list={cityList} label="City" labelKey="city_name" isEditing={!isEditing} displayValue={studentData.CityName} />
                    <RHFListbox name="Barangay" control={control} list={brgyList} label="Barangay" labelKey="brgy_name" isEditing={!isEditing} displayValue={studentData.BrgyName} />
                    <InputField name="HomeStreet" label="Home Street No." register={register} isEditing={isEditing} displayValue={studentData.HomeStreet} />
                    <InputField name="Student Type" label="Student Type" register={register} isEditing={isEditing} displayValue={studentData.StudentType} /> */}
                </div>

            </div>
            {employeeData?.CivilStatus != "single" && (
                <>
                    <div className="flex items-center pt-4">
                        <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                            Spouse Information
                        </h2>
                        <div className="flex-grow">
                            <hr className="border-t border-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4">
                        <InputField name="NameOfSpouse" label="Full Name" register={register} isEditing={isEditing} displayValue={employeeData.NameOfSpouse} />
                        <InputField name="SpouseOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={employeeData.SpouseOccupation} />
                        <InputField name="NoOfyearsMarried" label="No of Years Married" register={register} isEditing={isEditing} displayValue={employeeData.NoOfyearsMarried} />
                        <InputField name="NoOfChildren" label="No of Children" register={register} isEditing={isEditing} displayValue={employeeData.NoOfChildren} />
                        <InputField name="AgeEldestChild" label="Age of Eldest Child" register={register} isEditing={isEditing} displayValue={employeeData.AgeEldestChild} />
                        <InputField name="AgeYoungestChild" label="Age of Youngest Child" register={register} isEditing={isEditing} displayValue={employeeData.AgeYoungestChild} />
                        <InputField name="IsPregnant" label="Is pregnant?" register={register} isEditing={isEditing} displayValue={employeeData.IsPregnant} />
                        {/* <InputField name="FathersFname" label="First Name" register={register} isEditing={isEditing} displayValue={studentData.FathersFname} />
                <InputField name="FathersMname" label="Middle Name" register={register} isEditing={isEditing} displayValue={studentData.FathersMname} />
                <InputField name="FathersLname" label="Last Name" register={register} isEditing={isEditing} displayValue={studentData.FathersLname} />
                <InputField name="FathersEmail" label="Email" register={register} isEditing={isEditing} displayValue={studentData.FathersEmail} />
                <InputField name="FathersMobileNo" label="Mobile Phone No." register={register} isEditing={isEditing} displayValue={studentData.FathersMobileNo} />
                <InputField name="FathersOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={studentData.FathersOccupation} /> */}
                    </div>
                </>
            )}


            <div className="flex items-center pt-4">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Parents Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div className="flex items-center pt-4">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
                    i
                </div>

                <h2 className="text-l font-bold text-green-700 whitespace-nowrap">
                    Father's Information
                </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4">
                <InputField name="FathersFullname" label="Full Name" register={register} isEditing={isEditing} displayValue={employeeData.FathersFullname} />
                <InputField name="FathersAge" label="Age" register={register} isEditing={isEditing} displayValue={employeeData.FathersAge} />
                <InputField name="FathersOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={employeeData.FathersOccupation} />
                {/* <InputField name="FathersFname" label="First Name" register={register} isEditing={isEditing} displayValue={studentData.FathersFname} />
                <InputField name="FathersMname" label="Middle Name" register={register} isEditing={isEditing} displayValue={studentData.FathersMname} />
                <InputField name="FathersLname" label="Last Name" register={register} isEditing={isEditing} displayValue={studentData.FathersLname} />
                <InputField name="FathersEmail" label="Email" register={register} isEditing={isEditing} displayValue={studentData.FathersEmail} />
                <InputField name="FathersMobileNo" label="Mobile Phone No." register={register} isEditing={isEditing} displayValue={studentData.FathersMobileNo} />
                <InputField name="FathersOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={studentData.FathersOccupation} /> */}
            </div>
            <div className="flex items-center pt-4">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
                    i
                </div>

                <h2 className="text-l font-bold text-green-700 whitespace-nowrap">
                    Mother's Information
                </h2>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4">
                <InputField name="MothersFullname" label="Full Name" register={register} isEditing={isEditing} displayValue={employeeData.MothersFullname} />
                <InputField name="MothersAge" label="Age" register={register} isEditing={isEditing} displayValue={employeeData.MothersAge} />
                <InputField name="MothersOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={employeeData.MothersOccupation} />
                <InputField name="NoOfSiblings" label="No of Siblings" register={register} isEditing={isEditing} displayValue={employeeData.NoOfSiblings} />
                {/* <InputField name="MothersFname" label="First Name" register={register} isEditing={isEditing} displayValue={studentData.MothersFname} />
                <InputField name="MothersMname" label="Middle Name" register={register} isEditing={isEditing} displayValue={studentData.MothersMname} />
                <InputField name="MothersLname" label="Last Name" register={register} isEditing={isEditing} displayValue={studentData.MothersLname} />
                <InputField name="MothersEmail" label="Email" register={register} isEditing={isEditing} displayValue={studentData.MothersEmail} />
                <InputField name="MothersMobileNo" label="Mobile Phone No." register={register} isEditing={isEditing} displayValue={studentData.MothersMobileNo} />
                <InputField name="MothersOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={studentData.MothersOccupation} /> */}
            </div>
            <div className="flex items-center pt-4">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Highest Educational Attainment
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4">
                <InputField name="SchoolName" label="School Name" register={register} isEditing={isEditing} displayValue={employeeData.SchoolName} />
                <InputField name="From" label="From" register={register} isEditing={isEditing} displayValue={isEditing ? toDateInputValue(employeeData.From) : formatDate(employeeData.From)} {...(isEditing ? { type: "date" } : {})} />
                <InputField name="To" label="To" register={register} isEditing={isEditing} displayValue={isEditing ? toDateInputValue(employeeData.To) : formatDate(employeeData.To)} {...(isEditing ? { type: "date" } : {})} />
                <InputField name="Degree" label="Degree" register={register} isEditing={isEditing} displayValue={employeeData.Degree} />
            </div>
            <div className="flex items-center pt-4">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Other Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4">
                <InputField name="PrevEmployed" label="Prev Employed" register={register} isEditing={isEditing} displayValue={employeeData.PrevEmployed} />
                <InputField name="PlanToWorkAbroad" label="Plan to Work Abroad " register={register} isEditing={isEditing} displayValue={employeeData.PlanToWorkAbroad} />
                <InputField name="TargetYear" label="Target Year" register={register} isEditing={isEditing} displayValue={employeeData.TargetYear} />
                <InputField name="TeachingLicense" label="Teaching License" register={register} isEditing={isEditing} displayValue={employeeData.TeachingLicense} />
                <InputField name="DateOfExamination" label="Date of Examination" register={register} isEditing={isEditing} displayValue={isEditing ? toDateInputValue(employeeData.DateOfExamination) : formatDate(employeeData.DateOfExamination)} {...(isEditing ? { type: "date" } : {})} />
            </div>
            <div className="flex justify-end items-end pt-2">
                <button
                    type="submit"
                    className="px-6 py-2 mr-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-800 transition"
                    onClick={handleProceed}
                >
                    Proceed to hiring Process
                </button>
                {isEditing && (
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-800 transition"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save
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
                    { label: "No", type: "red" },
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
                body="Student Master File has been updated!"
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

export default EmployeeOnlineAppForm;
