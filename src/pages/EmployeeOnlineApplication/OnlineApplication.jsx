import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import RedBtn from '../../components/ButtonsComponents/RedBtn';
import GreenBtn from '../../components/ButtonsComponents/GreenBtn';
import RHFListbox from "../../components/ButtonsComponents/RHFListbox";
import InputField from "../../components/ButtonsComponents/InputField";
import RadioGroupField from '../../components/ButtonsComponents/RadioGroupField';
import ModalComponent from '../../components/ButtonsComponents/ModalComponent';
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from 'react-icons/fa';
import {
    fetchNationalityData,
    fetchReligionData,
    fetchProvinceData,
    fetchCityData,
    fetchBarangayData,
    fetchInsertEmployeeData,
} from '../../states/OnlineApplicationState/Action';


const OnlineApplication = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const stepTitle = {
        1: "Personal Information",
        2: "Other Personal Information",
        3: "Family Information",
        4: "Educational Background",
        5: "Highest Educational Attainment",
        6: "Address Information"
    };
    const {
        getValues,
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        trigger,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            Fname: "",
            Mname: "",
            Lname: "",
            Nickname: "",
            Email: "",
            Position: "",
            Gender: "",
            Religion: null,
            OtherReligion: "",
            Nationality: null,
            DateOfBirth: "",
            PlaceOfBirth: "",
            Resume: null,
            CivilStatus: "",
            NameOfSpouse: "",
            SpouseOccupation: "",
            NoOfYearsMarried: "",
            NoOfChildren: "",
            AgeOfEldestChild: "",
            AgeOfYoungestChild: "",
            IsPregnant: "",
            FathersFullname: "",
            FathersAge: "",
            FathersOccupation: "",
            MothersFullname: "",
            MothersAge: "",
            MotherOccupation: "",
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
        }
    });

    const nationalityList = useSelector(state => state.online.nationalityState?.data || []);
    const religionList = useSelector(state => state.online.religionState?.data || []);
    const provinceList = useSelector(state => state.online.provinceState?.data || []);
    const cityList = useSelector(state => state.online.cityState?.data || []);
    const brgyList = useSelector(state => state.online.barangayState?.data || []);

    const civilStatusList = [
        { id: "single", civilName: "Single" },
        { id: "married", civilName: "Married" },
        { id: "single with child", civilName: "Single with child" },
        { id: "widow", civilName: "Widow" },
        { id: "seperated", civilName: "Separated" },
        { id: "legally seperated", civilName: "Legally Separated" },
    ];

    const pregnantList = [
        { id: "yes", value: "Yes" },
        { id: "no", value: "No" },
        { id: "unsure", value: "Unsure" },
    ];
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    useEffect(() => {
        dispatch(fetchNationalityData());
        dispatch(fetchReligionData());
        dispatch(fetchProvinceData());
    }, [dispatch]);

    const selectedReligion = watch("Religion");
    const selectedCivilStatus = watch("CivilStatus");
    const province = watch("Province");
    const city = watch("City");

    useEffect(() => {
        if (!province?.province_code) return;
        dispatch(fetchCityData(province.province_code));
    }, [province?.province_code, dispatch]);

    useEffect(() => {
        if (!city?.city_code) return;
        dispatch(fetchBarangayData(city.city_code));
    }, [city?.city_code, dispatch]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);

    const handleNext = async () => {
        let fieldsToValidate = [];
        switch (step) {
            case 1:
                fieldsToValidate = ["Fname", "Lname", "Gender", "Nickname", "Email", "Position", "Religion", "Nationality", "DateOfBirth", "Resume"];
                break;
            case 2:
                fieldsToValidate = ["CivilStatus"];
                if (watch("CivilStatus")?.id === "married" || watch("CivilStatus")?.id === "legally seperated") {
                    fieldsToValidate.push("NameOfSpouse", "SpouseOccupation", "NoOfYearsMarried", "NoOfChildren", "AgeOfEldestChild", "AgeOfYoungestChild");
                }
                break;
            case 3:
                fieldsToValidate = ["MothersFullname", "MothersAge", "MothersOccupation", "NoOfSiblings"];
                break;
            case 4:
                fieldsToValidate = ["PrevEmployed", "PlanToWorkAbroad", "TargetYear", "TeachingLicense", "DateOfExamination"];
                break;
            case 5:
                fieldsToValidate = ["SchoolName", "From", "To"];
                break;
            case 6:
                fieldsToValidate = ["Province", "City", "Barangay", "HomeStreet"];
                break;
        }
        const valid = await trigger(fieldsToValidate);

        if (valid) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const onSubmit = (data) => {
        console.log(data);
        setFormData(data);
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = async () => {
        if (!formData) return;
        console.log(formData);
        const payload = new FormData();

        // Map all scalar fields
        payload.append("Fname", formData.Fname || "");
        payload.append("Mname", formData.Mname || "");
        payload.append("Lname", formData.Lname || "");
        payload.append("Nickname", formData.Nickname || "");
        payload.append("Email", formData.Email || "");
        payload.append("Position", formData.Position || "");
        payload.append("Gender", formData.Gender || "");
        payload.append("ReligionId", formData.Religion?.ReligionId ?? "");
        payload.append("OtherReligion", formData.OtherReligion || "");
        payload.append("NationalityId", formData.Nationality?.NationalityId ?? "");
        payload.append("DateOfBirth", formData.DateOfBirth ?? "");
        payload.append("PlaceOfBirth", formData.PlaceOfBirth || "");

        // Handle file upload properly
        if (resumeFile) {
            payload.append("Resume", resumeFile);
        } else if (formData.Resume && formData.Resume[0]) {
            payload.append("Resume", formData.Resume[0]);
        }

        payload.append("CivilStatus", formData.CivilStatus?.civilName || formData.CivilStatus || "");

        if (formData.CivilStatus?.id === "married" || formData.CivilStatus?.id === "legally seperated") {
            payload.append("NameOfSpouse", formData.NameOfSpouse || "");
            payload.append("SpouseOccupation", formData.SpouseOccupation || "");
            payload.append("NoOfYearsMarried", formData.NoOfYearsMarried || "");
            payload.append("NoOfChildren", formData.NoOfChildren || "");
            payload.append("AgeOfEldestChild", formData.AgeOfEldestChild || "");
            payload.append("AgeOfYoungestChild", formData.AgeOfYoungestChild || "");
        }

        payload.append("IsPregnant", formData.IsPregnant?.value || "");
        payload.append("FathersFullname", formData.FathersFullname || "");
        payload.append("FathersAge", formData.FathersAge || "");
        payload.append("FathersOccupation", formData.FathersOccupation || "");
        payload.append("MothersFullname", formData.MothersFullname || "");
        payload.append("MothersAge", formData.MothersAge || "");
        payload.append("MotherOccupation", formData.MothersOccupation || "");
        payload.append("NoOfSiblings", formData.NoOfSiblings || "");
        payload.append("PrevEmployed", formData.PrevEmployed || "");
        payload.append("PlanToWorkAbroad", formData.PlanToWorkAbroad || "");
        payload.append("TargetYear", formData.TargetYear || "");
        payload.append("TeachingLicense", formData.TeachingLicense || "");
        payload.append("DateOfExamination", formData.DateOfExamination || "");
        payload.append("SchoolName", formData.SchoolName || "");
        payload.append("From", formData.From || "");
        payload.append("To", formData.To || "");
        payload.append("Degree", formData.Degree || "");
        payload.append("ProvinceCode", formData.Province?.province_code || "");
        payload.append("ProvinceName", formData.Province?.province_name || "");
        payload.append("CityCode", formData.City?.city_code || "");
        payload.append("CityName", formData.City?.city_name || "");
        payload.append("BrgyCode", formData.Barangay?.brgy_code || "");
        payload.append("BrgyName", formData.Barangay?.brgy_name || "");
        payload.append("HomeStreet", formData.HomeStreet || "");

        console.log("SUBMIT PAYLOAD:", payload);

        setIsModalOpen(false);

        const res = await dispatch(fetchInsertEmployeeData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            setTimeout(() => {
                navigate('/employeecongratulationletter');
            }, 3000);
        } else {
            alert("Failed to submit application. Please try again.");
        }
    };


    return (
        <div className="bg-[url('/assets/img/White-Background.png')] bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-5xl mx-4">
                {/* Left Side - Welcome Image */}
                <div className="hidden md:flex md:w-1/2 bg-blue-50 items-center justify-center p-6 lg:p-8">
                    <div className="text-center">
                        <img
                            src="/assets/img/seton-logo.png"
                            alt="Welcome"
                            className="mx-auto mb-4 lg:mb-6 rounded-lg max-w-xs w-48 lg:w-64"
                        />
                        <h2 className="text-xl lg:text-2xl font-bold text-green-800 mb-2">
                            Welcome to Elizabeth Seton School
                        </h2>
                        <p className="text-sm lg:text-base text-gray-600">
                            Join us and be part of our amazing
                        </p>
                        <p className="text-sm lg:text-base text-gray-600">
                            educational community.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-green-600 text-center mb-2">
                        Employment Application Form
                    </h2>
                    <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                        {stepTitle[step]}
                    </p>

                    {/* Progress Steps */}
                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                        {[1, 2, 3, 4, 5, 6].map((s) => (
                            <div key={s} className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${step >= s
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {s}
                                </div>
                                <p className="text-xs mt-1 text-gray-600 hidden sm:block">
                                    {stepTitle[s]?.split(" ")[0]}
                                </p>
                            </div>
                        ))}
                    </div>

                    <form className="space-y-4">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Personal Information */}
                            {step === 1 && (
                                <motion.div
                                    key="one"
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                                        <InputField name="Fname" label="First Name" register={register} isEditing={true} placeholder="Enter your first name" required errors={errors.Fname} errorMessage={errors.Fname?.message} />
                                        <InputField name="Mname" label="Middle Name" register={register} isEditing={true} placeholder="Enter your middle name (optional)" />
                                        <InputField name="Lname" label="Last Name" register={register} isEditing={true} placeholder="Enter your last name" required errors={errors.Lname} errorMessage={errors.Lname?.message} />
                                        <InputField name="Nickname" label="Nickname" register={register} isEditing={true} placeholder="Enter your nickname" required errors={errors.Nickname} errorMessage={errors.Nickname?.message} />
                                        <InputField name="Email" label="Email Address" register={register} isEditing={true} placeholder="your.email@example.com" required errors={errors.Email} errorMessage={errors.Email?.message} type="email" isValidEmail={isValidEmail} />
                                        <InputField name="Position" label="Desired Position" register={register} isEditing={true} placeholder="e.g., Teacher, Staff, Administrator" required errors={errors.Position} errorMessage={errors.Position?.message} />
                                        <RadioGroupField
                                            name="Gender"
                                            label="Gender"
                                            register={register}
                                            isEditing={true}
                                            required
                                            options={[
                                                { label: "Male", value: "male" },
                                                { label: "Female", value: "female" },
                                            ]}
                                            error={errors.Gender}
                                        />
                                        <RHFListbox name="Religion" control={control} list={religionList} label="Religion" labelKey="ReligionName" required error={errors.Religion} />
                                        {selectedReligion?.ReligionId === 18 && (
                                            <InputField name="OtherReligion" label="Please Specify Religion" register={register} isEditing={true} placeholder="Enter your religion" required errors={errors.OtherReligion} errorMessage={errors.OtherReligion?.message} />
                                        )}
                                        <RHFListbox name="Nationality" control={control} list={nationalityList} label="Nationality" labelKey="NationalityName" required error={errors.Nationality} />
                                        <InputField name="DateOfBirth" label="Date of Birth" register={register} isEditing={true} type="date" required errors={errors.DateOfBirth} errorMessage={errors.DateOfBirth?.message} />
                                        <InputField name="PlaceOfBirth" label="Place of Birth" register={register} isEditing={true} placeholder="Enter place of birth" />

                                        {/* Resume Upload Field */}
                                        <div className="p-2">
                                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                                <strong>Upload Resume <span className="text-red-500">*</span></strong>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    {...register("Resume", {
                                                        required: "Resume is required",
                                                        onChange: (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                if (file.size > 5 * 1024 * 1024) {
                                                                    alert("File size must be less than 5MB");
                                                                    e.target.value = null;
                                                                    setResumeFile(null);
                                                                    return;
                                                                }
                                                                setResumeFile(file);
                                                            }
                                                        }
                                                    })}
                                                    className="shadow-xs border text-sm rounded-lg block w-full p-2.5"
                                                />
                                                {resumeFile && (
                                                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                                        <FaCheckCircle className="text-green-600" />
                                                        <span className="text-sm text-green-700 font-medium">
                                                            {resumeFile.name} ({(resumeFile.size / 1024).toFixed(2)} KB)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.Resume && (
                                                <p className="text-red-500 text-xs mt-1">{errors.Resume.message}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                                        </div>
                                    </div>
                                    <div className='pt-2'>
                                        <GreenBtn label="Next →" onClick={handleNext} />
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Other Personal Information */}
                            {step === 2 && (
                                <motion.div
                                    key="two"
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                                        <RHFListbox name="CivilStatus" control={control} list={civilStatusList} label="Civil Status" labelKey="civilName" required error={errors.CivilStatus} />
                                        {(selectedCivilStatus?.id === "married" || selectedCivilStatus?.id === "legally seperated") && (
                                            <>
                                                <InputField name="NameOfSpouse" label="Name of Spouse" register={register} isEditing={true} placeholder="Enter spouse's full name" required errors={errors.NameOfSpouse} errorMessage={errors.NameOfSpouse?.message} />
                                                <InputField name="SpouseOccupation" label="Spouse's Occupation" register={register} isEditing={true} placeholder="Enter spouse's occupation" required errors={errors.SpouseOccupation} errorMessage={errors.SpouseOccupation?.message} />
                                                <InputField name="NoOfYearsMarried" label="No. of Years Married" register={register} isEditing={true} placeholder="e.g., 5" required errors={errors.NoOfYearsMarried} errorMessage={errors.NoOfYearsMarried?.message} />
                                                <InputField name="NoOfChildren" label="No. of Children" register={register} isEditing={true} placeholder="e.g., 2" required errors={errors.NoOfChildren} errorMessage={errors.NoOfChildren?.message} />
                                                <InputField name="AgeOfEldestChild" label="Age of Eldest Child" register={register} isEditing={true} placeholder="e.g., 10" required errors={errors.AgeOfEldestChild} errorMessage={errors.AgeOfEldestChild?.message} />
                                                <InputField name="AgeOfYoungestChild" label="Age of Youngest Child" register={register} isEditing={true} placeholder="e.g., 5" required errors={errors.AgeOfYoungestChild} errorMessage={errors.AgeOfYoungestChild?.message} />
                                            </>
                                        )}
                                        <hr />
                                        <h2 className="text-xl font-bold text-green-800 mb-6">
                                            For Female Applicant Only
                                        </h2>
                                        <RHFListbox name="IsPregnant" control={control} list={pregnantList} label="Pregnant" labelKey="value" />
                                    </div>
                                    <div className='pt-2'>
                                        <RedBtn label="← Back" onClick={handleBack} />
                                        <GreenBtn label="Next →" onClick={handleNext} />
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Family Information */}
                            {step === 3 && (
                                <motion.div
                                    key="three"
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                                        <hr />
                                        <h2 className="text-xl font-bold text-green-800 mb-6">
                                            Father Information
                                        </h2>
                                        <InputField name="FathersFullname" label="Fullname" register={register} isEditing={true} placeholder="Enter father's full name" />
                                        <InputField name="FathersAge" label="Age" register={register} isEditing={true} placeholder="Enter father's age" />
                                        <InputField name="FathersOccupation" label="Occupation" register={register} isEditing={true} placeholder="Enter father's occupation" />
                                        <hr />
                                        <h2 className="text-xl font-bold text-green-800 mb-6">
                                            Mother Information
                                        </h2>
                                        <InputField name="MothersFullname" label="Fullname" register={register} isEditing={true} placeholder="Enter mother's full name" required errors={errors.MothersFullname} errorMessage={errors.MothersFullname?.message} />
                                        <InputField name="MothersAge" label="Age" register={register} isEditing={true} placeholder="Enter mother's age" required errors={errors.MothersAge} errorMessage={errors.MothersAge?.message} />
                                        <InputField name="MothersOccupation" label="Occupation" register={register} isEditing={true} placeholder="Enter mother's occupation" required errors={errors.MothersOccupation} errorMessage={errors.MothersOccupation?.message} />
                                        <InputField name="NoOfSiblings" label="No. of siblings" register={register} isEditing={true} placeholder="Enter number of siblings" required errors={errors.NoOfSiblings} errorMessage={errors.NoOfSiblings?.message} />
                                    </div>
                                    <div className='pt-2'>
                                        <RedBtn label="← Back" onClick={handleBack} />
                                        <GreenBtn label="Next →" onClick={handleNext} />
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Educational Background */}
                            {step === 4 && (
                                <motion.div
                                    key="four"
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                                        <RadioGroupField
                                            name="PrevEmployed"
                                            label="Have you been previously employed by Elizabeth Seton School?"
                                            register={register}
                                            isEditing={true}
                                            required
                                            options={[
                                                { label: "Yes", value: "Y" },
                                                { label: "No", value: "N" },
                                            ]}
                                            error={errors.PrevEmployed}
                                        />
                                        <RadioGroupField
                                            name="PlanToWorkAbroad"
                                            label="Do you have plans to work abroad?"
                                            register={register}
                                            isEditing={true}
                                            required
                                            options={[
                                                { label: "Yes", value: "Y" },
                                                { label: "No", value: "N" },
                                            ]}
                                            error={errors.PlanToWorkAbroad}
                                        />
                                        <InputField name="TargetYear" label="Target Year (if yes, please specify)" register={register} isEditing={true} placeholder="e.g., 2025" required errors={errors.TargetYear} errorMessage={errors.TargetYear?.message} />
                                        <InputField name="TeachingLicense" label="Teaching License No." register={register} isEditing={true} placeholder="Enter license number" required errors={errors.TeachingLicense} errorMessage={errors.TeachingLicense?.message} />
                                        <InputField name="DateOfExamination" label="Date of Examination" register={register} isEditing={true} type="date" required errors={errors.DateOfExamination} errorMessage={errors.DateOfExamination?.message} />
                                    </div>
                                    <div className="pt-2">
                                        <RedBtn label="← Back" onClick={handleBack} />
                                        <GreenBtn label="Next →" onClick={handleNext} />
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 5: Highest Educational Attainment */}
                            {step === 5 && (
                                <motion.div
                                    key="five"
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                                        <InputField name="SchoolName" label="Name of School" register={register} isEditing={true} placeholder="Enter school name" required errors={errors.SchoolName} errorMessage={errors.SchoolName?.message} />
                                        <InputField name="From" label="From (Year)" register={register} isEditing={true} type="date" required errors={errors.From} errorMessage={errors.From?.message} />
                                        <InputField name="To" label="To (Year)" register={register} isEditing={true} type="date" required errors={errors.To} errorMessage={errors.To?.message} />
                                        <InputField name="Degree" label="Degree/Course" register={register} isEditing={true} placeholder="e.g., Bachelor of Elementary Education" />
                                    </div>
                                    <div className='pt-2'>
                                        <RedBtn label="← Back" onClick={handleBack} />
                                        <GreenBtn label="Next →" onClick={handleNext} />
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 6: Address Information */}
                            {step === 6 && (
                                <motion.div
                                    key="six"
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                                        <RHFListbox name="Province" control={control} list={provinceList} label="Province" labelKey="province_name" required error={errors.Province} />
                                        <RHFListbox name="City" control={control} list={cityList} label="City/Municipality" labelKey="city_name" required error={errors.City} />
                                        <RHFListbox name="Barangay" control={control} list={brgyList} label="Barangay" labelKey="brgy_name" required error={errors.Barangay} />
                                        <InputField name="HomeStreet" label="House No. / Street" register={register} isEditing={true} placeholder="e.g., Block 1 Lot 5, Main Street" required errors={errors.HomeStreet} errorMessage={errors.HomeStreet?.message} />
                                    </div>
                                    <div className='pt-2 flex flex-col sm:flex-row gap-2'>
                                        <RedBtn label="← Back" onClick={handleBack} />
                                        <GreenBtn label="Submit Application" onClick={handleSubmit(onSubmit)} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Application Submission"
                body="Are you sure you want to submit your employment application? Please review all information carefully before submitting."
                buttons={[
                    { label: "Yes, Submit Application", type: "green", onClick: handleConfirmSubmit },
                    { label: "Cancel", type: "red", onClick: () => setIsModalOpen(false) },
                ]}
            />

            {/* Success Modal */}
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Application Submitted!</span>}
                body={
                    <div className="text-center">
                        <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
                        <p className="mb-2">Your employment application has been submitted successfully!</p>
                        <p className="text-sm text-gray-600">We will review your application and contact you soon.</p>
                    </div>
                }
                buttons={[]}
            />
        </div>
    );
};

export default OnlineApplication;
