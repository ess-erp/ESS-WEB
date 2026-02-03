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
            OtherPosition: "",
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
    const position = [
        { id: "faculty", value: "Faculty" },
        { id: "ntf", value: "Non-Teaching Faculty" },
        { id: "staff", value: "Staff" },
        { id: "others", value: "Others" },
    ];
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
    useEffect(() => {
        dispatch(fetchNationalityData());
        dispatch(fetchReligionData());
        dispatch(fetchProvinceData());
    }, [dispatch]);
    const selectedPosition = watch("Position");
    const selectedReligion = watch("Religion");
    const selectedCivilStatus = watch("CivilStatus");
    const province = watch("Province");
    const city = watch("City");
    console.log(selectedPosition);
    console.log(selectedCivilStatus);
   


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


    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleNext = async () => {

        let fieldsToValidate = [];
        switch (step) {
            case 1:
                fieldsToValidate = ["Fname", "Lname", "Gender", "Nickname", "Email", "Position", "Religion", "Nationality", "DateOfBirth", "Resume"];
                break;
            case 2:
                fieldsToValidate = ["CivilStatus"];
                if (watch("CivilStatus")?.id === 2 || watch("CivilStatus")?.id === 6) {
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
        payload.append("Nickname", formData.Email || "");
        payload.append("Email", formData.Email || "");
        payload.append("Postion", formData.DateOfBirth || "");
        payload.append("OthersPosition", formData.Email || "");
        payload.append("Gender", formData.Gender || "");
        payload.append("ReligionId", formData.Religion?.ReligionId ?? "");
        payload.append("ReligionName", formData.Religion?.ReligionName || null);
        payload.append("OtherReligion", formData.OtherReligion || null);
        payload.append("ReligionName", formData.Religion?.ReligionName || null);
        payload.append("OtherReligion", formData.OtherReligion || null);
        payload.append("NationalityId", formData.Nationality?.NationalityId ?? "");
        payload.append("NationalityName", formData.Nationality?.NationalityName || "")
        payload.append("DateOfBirth", formData.DateOfBirth ?? "");
        payload.append("PlaceOfBirth", formData.PlaceOfBirth || "")
        if (formData.Resume) payload.append("Resume", formData.Resume);
        payload.append("CivilStatus", formData.CivilStatus || "");
        if (formData.CivilStatus?.id) {
            payload.append("NameOfSpouse", formData.NameOfSpouse || "");
            payload.append("SpouseOccupation", formData.SpouseOccupation || "");
            payload.append("NoOfYearsMarried", formData.NoOfYearsMarried || "");
            payload.append("NoOfChildren", formData.NoOfChildren || "");
            payload.append("AgeOfEldestChild", formData.AgeOfEldestChild || "");
            payload.append("AgeOfYoungestChild", formData.AgeOfYoungestChild || "");

        }
        payload.append("IsPregnant", formData.AgeOfYoungestChild || "");
        payload.append("FathersFullname", formData.FathersFullname || "");
        payload.append("FathersAge", formData.FathersAge || "");
        payload.append("FathersOccupation", formData.FathersOccupation || "");
        payload.append("MothersFullname", formData.MothersFullname || "");
        payload.append("MothersAge", formData.MothersAge || "");
        payload.append("MotherOccupation", formData.MotherOccupation || "");
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

        const res = await dispatch(fetchInsertEmployeeData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                navigate('/employeecongratulationletter');
            }
        }
        else {
            return;
        }
    };


    return (
        <section className="bg-[url('/assets/img/White-Background.png')] bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center">

            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden flex w-full max-w-5xl">

                    <div className="hidden md:flex md:w-1/2 bg-blue-50 items-center justify-center p-8">
                        <div className="text-center">
                            <img
                                src="/assets/img/seton-logo.png"
                                alt="Welcome"
                                className="mx-auto mb-6 rounded-lg"
                            />
                            <h2 className="text-2xl font-bold text-green-800 mb-2">
                                Welcome to Elizabeth Seton School
                            </h2>
                            <p className="text-gray-600">
                                Join us and be part of our amazing community.
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 p-8">
                        <h2 className="text-2xl font-bold text-green-800 mb-6">
                            {stepTitle[step]}
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <>
                                        <motion.div
                                            key="one"
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -50, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                                <InputField name="Fname" label="First Name" register={register} isEditing={true} placeholder="Please input first name...." divClassName="" required errors={errors.Fname} errorMessage={errors.Fname?.message} />
                                                <InputField name="Mname" label="Middle Name" register={register} isEditing={true} placeholder="Please input middle name...." divClassName="" />
                                                <InputField name="Lname" label="Last Name" register={register} isEditing={true} placeholder="Please input last name...." divClassName="" required errors={errors.Lname} errorMessage={errors.Lname?.message} />
                                                <InputField name="Nickname" label="Nickname" register={register} isEditing={true} placeholder="Please input nickname...." divClassName="" required errors={errors.Nickname} errorMessage={errors.Nickname?.message} />
                                                <InputField name="Email" label="Email" register={register} isEditing={true} placeholder="Please input email...." divClassName="" required errors={errors.Email} errorMessage={errors.Email?.message} type="email" isValidEmail={isValidEmail} />
                                                <RHFListbox name="Position" control={control} list={position} label="Desired Position" labelKey="value" isEditing={false} divClassName="" required error={errors.Position} />
                                                {selectedPosition?.id === "others" && (
                                                    <InputField name="OtherPosition" label="Other Position" register={register} isEditing={true} placeholder="Please input other position...." divClassName="" required errors={errors.OtherPosition} errorMessage={errors.OtherPosition?.message} />
                                                )}
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
                                                    divClassName=""
                                                    error={errors.Gender}
                                                />
                                                <RHFListbox name="Religion" control={control} list={religionList} label="Religion" labelKey="ReligionName" isEditing={false} divClassName="" required error={errors.Religion} />
                                                {selectedReligion?.ReligionId === 18 && (
                                                    <InputField name="OtherReligion" label="Other Religion" register={register} isEditing={true} placeholder="Please input religion...." divClassName="" required errors={errors.OtherReligion} errorMessage={errors.OtherReligion?.message} />
                                                )}
                                                <RHFListbox name="Nationality" control={control} list={nationalityList} label="Nationality" labelKey="NationalityName" isEditing={false} divClassName="" required error={errors.Nationality} />
                                                <InputField name="DateOfBirth" label="Date of birth" register={register} isEditing={true} divClassName="" type="date" required errors={errors.DateOfBirth} errorMessage={errors.DateOfBirth?.message} />
                                                <InputField name="PlaceOfBirth" label="Place of birth" register={register} isEditing={true} placeholder="Please input place of birth...." divClassName="" />
                                                <InputField name="Resume" label="Upload Resume" register={register} isEditing={true} divClassName="" type="file" required errors={errors.Resume} errorMessage={errors.Resume?.message} />
                                            </div>
                                            <div className='pt-2'>
                                                <GreenBtn label="Next →" onClick={handleNext} />
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                                {step === 2 && (
                                    <>
                                        <motion.div
                                            key="two"
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -50, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                                <RHFListbox name="CivilStatus" control={control} list={civilStatusList} label="Civil Status" labelKey="civilName" isEditing={false} divClassName="" required error={errors.Religion} />
                                                {(selectedCivilStatus?.id === "married" || selectedCivilStatus?.id === "legally seperated") && (
                                                    <>
                                                        <InputField name="NameOfSpouse" label="Name of Spouse" register={register} isEditing={true} placeholder="Please input name of spouse...." divClassName="" required errors={errors.NameOfSpouse} errorMessage={errors.NameOfSpouse?.message} />
                                                        <InputField name="SpouseOccupation" label="Occupation" register={register} isEditing={true} placeholder="Please input spouse occupation...." divClassName="" required errors={errors.SpouseOccupation} errorMessage={errors.SpouseOccupation?.message} />
                                                        <InputField name="NoOfYearsMarried" label="No. of years married" register={register} isEditing={true} placeholder="Please input no. of years married...." divClassName="" required errors={errors.NoOfYearsMarried} errorMessage={errors.NoOfYearsMarried?.message} />
                                                        <InputField name="NoOfChildren" label="No. of children" register={register} isEditing={true} placeholder="Please input no. of years married...." divClassName="" required errors={errors.NoOfChildren} errorMessage={errors.NoOfChildren?.message} />
                                                        <InputField name="AgeOfEldestChild" label="Age of Eldest Child" register={register} isEditing={true} placeholder="Please input occupation...." divClassName="" required errors={errors.AgeOfEldestChild} errorMessage={errors.AgeOfEldestChild?.message} />
                                                        <InputField name="AgeOfYoungestChild" label="Age of Youngest Child" register={register} isEditing={true} placeholder="Please input occupation...." divClassName="" required errors={errors.AgeOfYoungestChild} errorMessage={errors.AgeOfYoungestChild?.message} />
                                                    </>
                                                )}
                                                <hr />
                                                <h2 className="text-xl font-bold text-green-800 mb-6">
                                                    For Female Applicant Only
                                                </h2>
                                                <RHFListbox name="IsPregnant" control={control} list={pregnantList} label="Pregnant" labelKey="value" isEditing={false} divClassName="" />
                                            </div>
                                            <div className='pt-2'>
                                                <RedBtn label="← Back" onClick={handleBack} />
                                                <GreenBtn label="Next →" onClick={handleNext} />
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                                {step === 3 && (
                                    <>
                                        <motion.div
                                            key="three"
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -50, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                                <hr />
                                                <h2 className="text-xl font-bold text-green-800 mb-6">
                                                    Father Information
                                                </h2>
                                                <InputField name="FathersFullname" label="Fullname" register={register} isEditing={true} placeholder="Please input father's fullname...." />
                                                <InputField name="FathersAge" label="Age" register={register} isEditing={true} placeholder="Please input father's age...." divClassName="" />
                                                <InputField name="FathersOccupation" label="Occupation" register={register} isEditing={true} placeholder="Please input father's occupation...." divClassName="" />
                                                <hr />
                                                <h2 className="text-xl font-bold text-green-800 mb-6">
                                                    Mother Information
                                                </h2>
                                                <InputField name="MothersFullname" label="Fullname" register={register} isEditing={true} placeholder="Please input mother's fullname...." divClassName="" />
                                                <InputField name="MothersAge" label="Age" register={register} isEditing={true} placeholder="Please input mother's age...." divClassName="" required errors={errors.MothersFullname} errorMessage={errors.MothersFullname?.message} />
                                                <InputField name="MothersOccupation" label="Occupation" register={register} isEditing={true} placeholder="Please input mother's age...." divClassName="" required errors={errors.MothersAge} errorMessage={errors.MothersAge?.message} />
                                                <InputField name="NoOfSiblings" label="No. of siblings" register={register} isEditing={true} placeholder="Please input no. of siblings...." divClassName="" required errors={errors.MothersOccupation} errorMessage={errors.MothersOccupation?.message} />
                                            </div>
                                            <div className='pt-2'>
                                                <RedBtn label="← Back" onClick={handleBack} />
                                                <GreenBtn label="Next →" onClick={handleNext} />
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                                {step === 4 && (
                                    <>
                                        <motion.div
                                            key="four"
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -50, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
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
                                                    divClassName=""
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
                                                    divClassName=""
                                                    error={errors.PlanToWorkAbroad}
                                                />
                                                <InputField name="TargetYear" label="Target year (If yes, please specify your target year of application/travel.)" register={register} isEditing={true} placeholder="Please input target year...." divClassName="" required errors={errors.TargetYear} errorMessage={errors.TargetYear?.message} />
                                                <InputField name="TeachingLicense" label="Teaching License No" register={register} isEditing={true} placeholder="Please input teaching license no...." divClassName="" required errors={errors.TeachingLicense} errorMessage={errors.TeachingLicense?.message} />
                                                <InputField name="DateOfExamination" label="Date of Examination" register={register} isEditing={true} type="date" placeholder="Please input last name...." divClassName="" required errors={errors.DateOfExamination} errorMessage={errors.DateOfExamination?.message} />
                                            </div>
                                            <div className="pt-2">
                                                <RedBtn label="← Back" onClick={handleBack} />
                                                <GreenBtn label="Next →" onClick={handleNext} />
                                            </div>

                                        </motion.div>
                                    </>
                                )}
                                {step === 5 && (
                                    <>
                                        <motion.div
                                            key="five"
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -50, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                                <InputField name="SchoolName" label="Name of school" register={register} isEditing={true} placeholder="Please input school name...." divClassName="" required errors={errors.SchoolName} errorMessage={errors.SchoolName?.message} />
                                                <InputField name="From" label="From" register={register} isEditing={true} type="date" divClassName="" required errors={errors.From} errorMessage={errors.From?.message} />
                                                <InputField name="To" label="Two" register={register} isEditing={true} type="date" divClassName="" required errors={errors.To} errorMessage={errors.To?.message} />
                                                <InputField name="Degree" label="Degree" register={register} isEditing={true} placeholder="Please input degree...." divClassName="" />
                                            </div>
                                            <div className='pt-2'>
                                                <RedBtn label="← Back" onClick={handleBack} />
                                                <GreenBtn label="Next →" onClick={handleNext} />
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                                {step === 6 && (
                                    <>
                                        <motion.div
                                            key="six"
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -50, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                                <RHFListbox name="Province" control={control} list={provinceList} label="Province" labelKey="province_name" isEditing={false} divClassName="" required error={errors.Province} />
                                                <RHFListbox name="City" control={control} list={cityList} label="City" labelKey="city_name" isEditing={false} divClassName="" required error={errors.City} />
                                                <RHFListbox name="Barangay" control={control} list={brgyList} label="Barangay" labelKey="brgy_name" isEditing={false} divClassName="" required error={errors.Barangay} />
                                                <InputField name="HomeStreet" label="Home Steet Number" register={register} isEditing={true} placeholder="Please input street no(Block 1 Lot 1)." divClassName="" required errors={errors.HomeStreet} errorMessage={errors.HomeStreet?.message} />
                                            </div>
                                            <div className='pt-2'>
                                                <RedBtn label="← Back" onClick={handleBack} />
                                                <GreenBtn label="Submit" onClick={handleSubmit(onSubmit)} />
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Warning"
                        body="Are you sure you want to continue?"
                        buttons={[
                            { label: "Yes", type: "green", onClick: handleConfirmSubmit },
                            { label: "No", type: "red", onClick: () => console.log("No clicked") },
                        ]}
                        backgroundImage="/assets/img/White-Background.png"
                    />
                </div>
            </div>
        </section>
    );
};
export default OnlineApplication;