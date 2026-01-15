import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    fetchOtpCodeData
} from "../../states/OnlineApplicationState/Action";
import {
    fetchStudentInfoData,
    fetchUpdateStudentInfoData,
} from "../../states/SruState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";

const StudentInfoComponent = ({ isEditing, studentId, userId }) => {
    const dispatch = useDispatch();
    const formatDate = getFormatDate;
    const toDateInputValue = (dateTime) => {
        if (!dateTime) return "";
        return dateTime.split("T")[0];
    };

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            StudentId: "",
            StudentNumber: "",
            Lrn: "",
            Fname: "",
            Mname: "",
            Lname: "",
            Email: "",
            Gender: "",
            DateOfBirth: "",
            PlaceOfBirth: "",
            Campus: null,
            Division: null,
            Level: null,
            Strand: null,
            Nationality: null,
            Religion: null,
            Province: null,
            City: null,
            Barangay: null,
            HomeStreet: "",
            StudentType: "",
            FathersEmail: "",
            FathersFname: "",
            FathersMname: "",
            FathersLname: "",
            FathersMobileNo: "",
            FathersOccupation: "",
            MothersEmail: "",
            MothersFname: "",
            MothersMname: "",
            MothersLname: "",
            MothersMobileNo: "",
            MothersOccupation: "",
            ContactPerson: "",
            ContactEmail: "",
            Relationship: "",
        }
    });

    const studentData = useSelector(state => state.sru.studentDataState?.data || {});
    const campusList = useSelector(state => state.online.campusState?.data || []);
    const divisionList = useSelector(state => state.online.divisionState?.data || []);
    const levelList = useSelector(state => state.online.levelState?.data || []);
    const strandList = useSelector(state => state.online.strandState?.data || []);
    const nationalityList = useSelector(state => state.online.nationalityState?.data || []);
    const religionList = useSelector(state => state.online.religionState?.data || []);
    const provinceList = useSelector(state => state.online.provinceState?.data || []);
    const cityList = useSelector(state => state.online.cityState?.data || []);
    const brgyList = useSelector(state => state.online.barangayState?.data || []);

    useEffect(() => {
        dispatch(fetchStudentInfoData(studentId));
        dispatch(fetchCampusData());
        dispatch(fetchDivisionData());
        dispatch(fetchNationalityData());
        dispatch(fetchReligionData());
        dispatch(fetchProvinceData());
    }, [dispatch, studentId]);
    console.log(studentData);
    useEffect(() => {
        if (!studentData || !isEditing) return;

        reset({
            StudentId: studentData.StudentId ?? "",
            StudentNumber: studentData.StudentNumber ?? "",
            Lrn: studentData.Lrn ?? "",
            Fname: studentData.Fname ?? "",
            Mname: studentData.Mname ?? "",
            Lname: studentData.Lname ?? "",
            Email: studentData.Email ?? "",
            Gender: studentData.Gender ?? "",
            DateOfBirth: toDateInputValue(studentData.DateOfBirth) ?? null,
            PlaceOfBirth: studentData.PlaceOfBirth ?? "",
            HomeStreet: studentData.HomeStreet ?? "",
            StudentType: studentData.StudentType ?? "",
            FathersEmail: studentData.FathersEmail ?? "",
            FathersFname: studentData.FathersFname ?? "",
            FathersMname: studentData.FathersMname ?? "",
            FathersLname: studentData.FathersLname ?? "",
            FathersMobileNo: studentData.FathersMobileNo ?? "",
            FathersOccupation: studentData.FathersOccupation ?? "",
            MothersEmail: studentData.MothersEmail ?? "",
            MothersFname: studentData.MothersFname ?? "",
            MothersMname: studentData.MothersMname ?? "",
            MothersLname: studentData.MothersLname ?? "",
            MothersMobileNo: studentData.MothersMobileNo ?? "",
            MothersOccupation: studentData.MothersOccupation ?? "",
            ContactPerson: studentData.ContactPerson ?? "",
            ContactEmail: studentData.ContactEmail ?? "",
            Relationship: studentData.Relationship ?? "",
            Campus: null,
            Division: null,
            Level: null,
            Strand: null,
            Nationality: null,
            Religion: null,
            Province: null,
            City: null,
            Barangay: null,
        });
    }, [studentData, isEditing, reset]);

    useEffect(() => {
        if (!isEditing || !studentData?.CampusName || !campusList.length) return;

        const campus = campusList.find(
            c => c.CampusName === studentData.CampusName
        );

        if (campus) {
            reset(prev => ({ ...prev, Campus: campus }));
        }
    }, [campusList, studentData?.CampusName, isEditing]);
    useEffect(() => {
        if (!isEditing || !studentData?.DivName || !divisionList.length) return;

        const division = divisionList.find(
            d => d.DivName === studentData.DivName
        );

        if (division) {
            reset(prev => ({ ...prev, Division: division }));
        }
    }, [divisionList, studentData?.DivName, isEditing]);

    useEffect(() => {
        if (!isEditing || !studentData?.LevelName || !levelList.length) return;

        const level = levelList.find(
            l => l.LevelName === studentData.LevelName
        );

        if (level) {
            reset(prev => ({ ...prev, Level: level }));
        }
    }, [levelList, studentData?.LevelName, isEditing]);

    useEffect(() => {
        if (!isEditing || !studentData?.NationalityName || !nationalityList.length) return;

        const nationality = nationalityList.find(
            n => n.NationalityName === studentData.NationalityName
        );

        if (nationality) {
            reset(prev => ({ ...prev, Nationality: nationality }));
        }
    }, [nationalityList, studentData?.NationalityName, isEditing]);

    useEffect(() => {
        if (!isEditing || !studentData?.ReligionName || !religionList.length) return;

        const religion = religionList.find(
            r => r.ReligionName === studentData.ReligionName
        );

        if (religion) {
            reset(prev => ({ ...prev, Religion: religion }));
        }
    }, [religionList, studentData?.ReligionName, isEditing]);

    useEffect(() => {
        if (!isEditing || !studentData?.ProvinceName || !provinceList.length) return;

        const province = provinceList.find(
            r => r.province_name === studentData.ProvinceName
        );

        if (province) {
            reset(prev => ({ ...prev, Province: province }));
        }
    }, [provinceList, studentData?.ProvinceName, isEditing]);

    useEffect(() => {
        if (!isEditing || !studentData?.CityName || !cityList.length) return;

        const city = cityList.find(
            r => r.city_name === studentData.CityName
        );

        if (city) {
            reset(prev => ({ ...prev, City: city }));
        }
    }, [cityList, studentData?.CityName, isEditing]);

    useEffect(() => {
        if (!isEditing || !studentData?.BrgyName || !brgyList.length) return;

        const brgy = brgyList.find(
            r => r.brgy_name === studentData.BrgyName
        );

        if (brgy) {
            reset(prev => ({ ...prev, Barangay: brgy }));
        }
    }, [brgyList, studentData?.BrgyName, isEditing]);

    const division = watch("Division");
    const level = watch("Level");
    const province = watch("Province");
    const city = watch("City");

    useEffect(() => {
        if (!division?.DivId) return;
        dispatch(fetchLevelData(division.DivId));
    }, [division?.DivId]);

    useEffect(() => {
        if (level?.LevelId !== 15) return;
        dispatch(fetchStrandData(level.LevelId));
    }, [level?.LevelId]);

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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                    <InputField name="StudentNumber" label="Student Number" register={register} isEditing={isEditing} displayValue={studentData.StudentNumber} />
                    <InputField name="Lrn" label="LRN" register={register} isEditing={isEditing} displayValue={studentData.Lrn} />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                    <InputField name="Fname" label="First Name" register={register} isEditing={isEditing} displayValue={studentData.Fname} />
                    <InputField name="Mname" label="Middle Name" register={register} isEditing={isEditing} displayValue={studentData.Mname} />
                    <InputField name="Lname" label="Last Name" register={register} isEditing={isEditing} displayValue={studentData.Lname} />
                    <InputField name="Email" label="Student Email" register={register} isEditing={isEditing} displayValue={studentData.Email} />
                    <InputField name="Gender" label="Gender" register={register} isEditing={isEditing} displayValue={studentData.Gender} />
                    <InputField name="DateOfBirth" label="Date of birth" register={register} isEditing={isEditing} displayValue={isEditing ? toDateInputValue(studentData.DateOfBirth) : formatDate(studentData.DateOfBirth)} {...(isEditing ? { type: "date" } : {})} />
                    <InputField name="PlaceOfBirth" label="Place of birth" register={register} isEditing={isEditing} displayValue={studentData.PlaceOfBirth} />

                    <RHFListbox name="Campus" control={control} list={campusList} label="Campus" labelKey="CampusName" isEditing={!isEditing} displayValue={studentData.CampusName} />
                    <RHFListbox name="Division" control={control} list={divisionList} label="Division" labelKey="DivName" isEditing={!isEditing} displayValue={studentData.DivName} />
                    <RHFListbox name="Level" control={control} list={levelList} label="Level" labelKey="LevelName" isEditing={!isEditing} displayValue={studentData.LevelName} />

                    {level?.LevelId === 15 && (
                        <RHFListbox name="Strand" control={control} list={strandList} label="Strand" labelKey="StrandName" isEditing={!isEditing} displayValue={studentData.StrandName} />
                    )}

                    <RHFListbox name="Nationality" control={control} list={nationalityList} label="Nationality" labelKey="NationalityName" isEditing={!isEditing} displayValue={studentData.NationalityName} />
                    <RHFListbox name="Religion" control={control} list={religionList} label="Religion" labelKey="ReligionName" isEditing={!isEditing} displayValue={studentData.ReligionName} />
                    <RHFListbox name="Province" control={control} list={provinceList} label="Province" labelKey="province_name" isEditing={!isEditing} displayValue={studentData.ProvinceName} />
                    <RHFListbox name="City" control={control} list={cityList} label="City" labelKey="city_name" isEditing={!isEditing} displayValue={studentData.CityName} />
                    <RHFListbox name="Barangay" control={control} list={brgyList} label="Barangay" labelKey="brgy_name" isEditing={!isEditing} displayValue={studentData.BrgyName} />
                    <InputField name="HomeStreet" label="Home Street No." register={register} isEditing={isEditing} displayValue={studentData.HomeStreet} />
                    <InputField name="Student Type" label="Student Type" register={register} isEditing={isEditing} displayValue={studentData.StudentType} />
                </div>

            </div>
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
                <InputField name="FathersFname" label="First Name" register={register} isEditing={isEditing} displayValue={studentData.FathersFname} />
                <InputField name="FathersMname" label="Middle Name" register={register} isEditing={isEditing} displayValue={studentData.FathersMname} />
                <InputField name="FathersLname" label="Last Name" register={register} isEditing={isEditing} displayValue={studentData.FathersLname} />
                <InputField name="FathersEmail" label="Email" register={register} isEditing={isEditing} displayValue={studentData.FathersEmail} />
                <InputField name="FathersMobileNo" label="Mobile Phone No." register={register} isEditing={isEditing} displayValue={studentData.FathersMobileNo} />
                <InputField name="FathersOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={studentData.FathersOccupation} />
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
                <InputField name="MothersFname" label="First Name" register={register} isEditing={isEditing} displayValue={studentData.MothersFname} />
                <InputField name="MothersMname" label="Middle Name" register={register} isEditing={isEditing} displayValue={studentData.MothersMname} />
                <InputField name="MothersLname" label="Last Name" register={register} isEditing={isEditing} displayValue={studentData.MothersLname} />
                <InputField name="MothersEmail" label="Email" register={register} isEditing={isEditing} displayValue={studentData.MothersEmail} />
                <InputField name="MothersMobileNo" label="Mobile Phone No." register={register} isEditing={isEditing} displayValue={studentData.MothersMobileNo} />
                <InputField name="MothersOccupation" label="Occupation" register={register} isEditing={isEditing} displayValue={studentData.MothersOccupation} />
            </div>
            <div className="flex items-center pt-4">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Emergency Contact Person Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4">
                <InputField name="ContactPerson" label="Fullname" register={register} isEditing={isEditing} displayValue={studentData.ContactPerson} />
                <InputField name="ContactEmail" label="Email" register={register} isEditing={isEditing} displayValue={studentData.ContactEmail} />
                <InputField name="Relationship" label="Relationship" register={register} isEditing={isEditing} displayValue={studentData.Relationship} />
            </div>
            {isEditing && (
                <div className="flex justify-end items-end pt-2">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-800 transition"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Submit
                    </button>
                </div>
            )}
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

export default StudentInfoComponent;
