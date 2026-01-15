import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import BlueBtn from '../../components/ButtonsComponents/BlueBtn';
import RedBtn from '../ButtonsComponents/RedBtn';
import GreenBtn from '../ButtonsComponents/GreenBtn';
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import InputFileField from '../ButtonsComponents/InputFileField';
import RadioGroupField from '../ButtonsComponents/RadioGroupField';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { motion, AnimatePresence } from "framer-motion";
import {
    fetchCampusData,
    fetchDivisionData,
    fetchLevelData,
    fetchStrandData,
    fetchNationalityData,
    fetchReligionData,
    fetchOtpCodeData,
    fetchProvinceData,
    fetchCityData,
    fetchBarangayData,
    fetchInsertStudentData
} from '../../states/OnlineApplicationState/Action';


const NewEnrollyComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const stepTitle = {
        1: "Personal Information",
        2: "Campus Information",
        3: "Father's Information",
        4: "Mother's Maiden Information",
        5: "Emergency Contact Person Information",
        6: "Address Information",
        7: "File Attachment"
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
            Email: "",
            DateOfBirth: "",
            Gender: "",
            Campus: null,
            Division: null,
            Level: null,
            Strand: null,
            Nationality: null,
            Religion: null,
            OtherReligion: "",
            FathersFname: "",
            FathersMname: "",
            FathersLname: "",
            FathersEmail: "",
            FathersOccupation: "",
            FathersEmail: "",
            FathersMobileNo: "",
            MothersFname: "",
            MothersMname: "",
            MothersLname: "",
            MothersEmail: "",
            MothersOccupation: "",
            MothersMobileNo: "",
            ContactPerson: "",
            ContactEmail: "",
            ContactMobileNo: "",
            Relationship: "",
            ProvinceCode: "",
            ProvinceName: "",
            CityCode: "",
            CityName: "",
            BrgyCode: "",
            BrgyName: "",
            HomeStreet: "",
            TwoByTwo: null,
            BirthCert: null,
            Baptismal: null,
            GoodMoral: null,
            ReportCard: null,
            StudentType: "New",
        }
    });
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
        dispatch(fetchCampusData());
        dispatch(fetchDivisionData());
        dispatch(fetchNationalityData());
        dispatch(fetchReligionData());
        dispatch(fetchProvinceData());
    }, [dispatch]);

    const selectedReligion = watch("Religion");
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


    const [otpValid, setOtpValid] = useState(null);
    const [otpCooldown, setOtpCooldown] = useState(0);
    const [serverOtp, setServerOtp] = useState(null);
    const [isMessage, setIsMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [color, setIsColor] = useState("");
    const handleSendVerificationCode = async () => {
        if (otpCooldown > 0) return;
        const isValid = await trigger("ContactEmail");
        const email = getValues("ContactEmail");
        setOtpCooldown(60);
        setOtpValid(null);
        setIsMessage(true);
        setIsColor("green");
        setSuccessMessage("An OTP has been sent to the email above.")
        //if contact email not valid it will throw an error
        if (!isValid) return;
        const payload = {
            FatherEmail: "",
            MotherEmail: "",
            ContactEmail: email,
        }
        const res = await dispatch(fetchOtpCodeData(payload));
        if (res.ok) {
            setServerOtp(res.data.OtpCode);
        }
    };
    useEffect(() => {
        if (otpCooldown <= 0) {
            setIsMessage(false);
            return;
        }

        const timer = setInterval(() => {
            setOtpCooldown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [otpCooldown]);
    const handleOtpChange = (value) => {
        if (!serverOtp) return;

        if (value === serverOtp) {
            setOtpValid(true);
        } else {
            setOtpValid(false);
        }
    };


    const [twoByTwoFile, setTwoByTwoFile] = useState(null);
    const [birthCertificate, setBirthCertificate] = useState(null);
    const [baptismal, setBaptismal] = useState(null);
    const [goodMoral, setGoodMoral] = useState(null);
    const [reportCard, setReportCard] = useState(null);

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
                fieldsToValidate = ["Fname", "Lname", "Gender", "DateOfBirth"];
                break;
            case 2:
                fieldsToValidate = ["Campus", "Division", "Level"];
                if (watch("Level")?.LevelId === 15) fieldsToValidate.push("Strand");
                fieldsToValidate.push("Religion", "Nationality");
                break;
            case 3:
                fieldsToValidate = [];
                break;
            case 4:
                fieldsToValidate = ["MothersFname", "MothersLname", "MothersEmail", "MothersMobilePhoneNo"];
                break;
            case 5:
                fieldsToValidate = ["ContactPerson", "ContactEmail", "OtpCode", "ContactMobilePhoneNo", "Relationship"];
                break;
            case 6:
                fieldsToValidate = ["Province", "City", "Barangay", "HomeStreet"];
                break;
            case 7:
                fieldsToValidate = [];
                break;
        }
        const valid = await trigger(fieldsToValidate);

        if (step === 5) {
            if (otpValid !== true) {
                setIsMessage(true);
                setIsColor("red");
                setSuccessMessage("OTP is invalid or not verified.");
                return; // prevent moving to next step
            }
        }

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
        payload.append("Email", formData.Email || "");
        payload.append("DateOfBirth", formData.DateOfBirth || "");
        payload.append("Gender", formData.Gender || "");

        payload.append("CampusId", formData.Campus?.CampusId ?? "");
        payload.append("CampusName", formData.Campus?.CampusName || "");
        payload.append("DivId", formData.Division?.DivId ?? "");
        payload.append("DivName", formData.Division?.DivName || "");
        payload.append("LevelId", formData.Level?.LevelId ?? "");
        payload.append("LevelName", formData.Level?.LevelName || "");
        payload.append("StrandId", formData.Strand?.StrandId ?? null);
        payload.append("StrandName", formData.Strand?.StrandName || null);

        payload.append("NationalityId", formData.Nationality?.NationalityId ?? "");
        payload.append("NationalityName", formData.Nationality?.NationalityName || "");
        payload.append("ReligionId", formData.Religion?.ReligionId ?? "");
        payload.append("ReligionName", formData.Religion?.ReligionName || null);
        payload.append("OtherReligion", formData.OtherReligion || null);

        payload.append("FathersFname", formData.FathersFname || "");
        payload.append("FathersMname", formData.FathersMname || "");
        payload.append("FathersLname", formData.FathersLname || "");
        payload.append("FathersEmail", formData.FathersEmail || "");
        payload.append("FathersOccupation", formData.FathersOccupation || "");
        payload.append("FathersMobileNo", formData.FathersMobileNo || "");

        payload.append("MothersFname", formData.MothersFname || "");
        payload.append("MothersMname", formData.MothersMname || "");
        payload.append("MothersLname", formData.MothersLname || "");
        payload.append("MothersEmail", formData.MothersEmail || "");
        payload.append("MothersOccupation", formData.MothersOccupation || "");
        payload.append("MothersMobileNo", formData.MothersMobileNo || "");

        payload.append("ContactPerson", formData.ContactPerson || "");
        payload.append("ContactEmail", formData.ContactEmail || "");
        payload.append("Relationship", formData.Relationship || "");

        payload.append("ProvinceCode", formData.Province?.province_code || "");
        payload.append("ProvinceName", formData.Province?.province_name || "");
        payload.append("CityCode", formData.City?.city_code || "");
        payload.append("CityName", formData.City?.city_name || "");
        payload.append("BrgyCode", formData.Barangay?.brgy_code || "");
        payload.append("BrgyName", formData.Barangay?.brgy_name || "");
        payload.append("HomeStreet", formData.HomeStreet || "");

        payload.append("StudentType", formData.StudentType || "New");
        payload.append("DocId", formData.DocId || 0);

        // Append files if present
        if (formData.TwoByTwo) payload.append("TwoByTwo", formData.TwoByTwo);
        if (formData.BirthCert) payload.append("BirthCert", formData.BirthCert);
        if (formData.Baptismal) payload.append("Baptismal", formData.Baptismal);
        if (formData.GoodMoral) payload.append("GoodMoral", formData.GoodMoral);
        if (formData.ReportCard) payload.append("ReportCard", formData.ReportCard);

        console.log("SUBMIT PAYLOAD:", payload);

        const res = await dispatch(fetchInsertStudentData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                navigate('/congratulationletter');
            }
        }
        else{
            return;
        }
    };


    return (

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
                        <p className="text-gray-600">
                            Enroll your child by using this Online Application.
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
                                            <InputField name="DateOfBirth" label="Date of birth" register={register} isEditing={true} divClassName="" type="date" required errors={errors.DateOfBirth} errorMessage={errors.DateOfBirth?.message} />
                                            <InputField name="PlaceOfBirth" label="Place of birth" register={register} isEditing={true} placeholder="Please input place of birth...." divClassName="" />
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
                                            <RHFListbox name="Campus" control={control} list={campusList} label="Campus" labelKey="CampusName" isEditing={false} divClassName="" required error={errors.Campus} />
                                            <RHFListbox name="Division" control={control} list={divisionList} label="Division" labelKey="DivName" isEditing={false} divClassName="" required error={errors.Division} />
                                            <RHFListbox name="Level" control={control} list={levelList} label="Level" labelKey="LevelName" isEditing={false} divClassName="" required error={errors.Level} />

                                            {level?.LevelId === 15 && (
                                                <RHFListbox name="Strand" control={control} list={strandList} label="Strand" labelKey="StrandName" isEditing={false} divClassName="" required error={errors.Strand} />
                                            )}
                                            <RHFListbox name="Religion" control={control} list={religionList} label="Religion" labelKey="ReligionName" isEditing={false} divClassName="" required error={errors.Religion} />
                                            {selectedReligion?.ReligionId === 18 && (
                                                <InputField name="OtherReligion" label="Other Religion" register={register} isEditing={true} placeholder="Please input religion...." divClassName="" required errors={errors.OtherReligion} errorMessage={errors.OtherReligion?.message} />
                                            )}
                                            <RHFListbox name="Nationality" control={control} list={nationalityList} label="Nationality" labelKey="NationalityName" isEditing={false} divClassName="" required error={errors.Nationality} />
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
                                            <InputField name="FathersFname" label="First Name" register={register} isEditing={true} placeholder="Please input first name...." divClassName="" />
                                            <InputField name="FathersMname" label="Middle Name" register={register} isEditing={true} placeholder="Please input middle name...." divClassName="" />
                                            <InputField name="FathersLname" label="Last Name" register={register} isEditing={true} placeholder="Please input last name...." divClassName="" />
                                            <InputField name="FathersEmail" label="Email" register={register} isEditing={true} placeholder="Please input email...." divClassName="" />
                                            <InputField name="FathersMobilePhoneNo" label="Mobile Phone No." register={register} isEditing={true} placeholder="Please input mobile phone...." divClassName="" />
                                            <InputField name="FathersOccupation" label="Occupation" register={register} isEditing={true} placeholder="Please input occupation...." divClassName="" />
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
                                            <InputField name="MothersFname" label="First Name" register={register} isEditing={true} placeholder="Please input first name...." divClassName="" required errors={errors.MothersFname} errorMessage={errors.MothersFname?.message} />
                                            <InputField name="MothersMname" label="Middle Name" register={register} isEditing={true} placeholder="Please input middle name...." divClassName="" />
                                            <InputField name="MothersLname" label="Last Name" register={register} isEditing={true} placeholder="Please input last name...." divClassName="" required errors={errors.MothersLname} errorMessage={errors.MothersLname?.message} />
                                            <InputField name="MothersEmail" label="Email" register={register} isEditing={true} placeholder="Please input email...." divClassName="" required errors={errors.MothersEmail} errorMessage={errors.MothersEmail?.message} type="email" isValidEmail={isValidEmail} />
                                            <InputField name="MothersMobilePhoneNo" label="Mobile Phone No." register={register} isEditing={true} placeholder="Please input mobile phone...." divClassName="" required errors={errors.MothersMobilePhoneNo} errorMessage={errors.MothersMobilePhoneNo?.message} />
                                            <InputField name="MothersOccupation" label="Occupation" register={register} isEditing={true} placeholder="Please input occupation...." divClassName="" />
                                        </div>
                                        <div className='pt-2'>
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
                                            <InputField name="ContactPerson" label="Fullname" register={register} isEditing={true} placeholder="Please input fullname...." divClassName="" required errors={errors.ContactPerson} errorMessage={errors.ContactPerson?.message} />
                                            <InputField name="ContactEmail" label="Email" register={register} isEditing={true} placeholder="Please input email...." divClassName="" required errors={errors.ContactEmail} errorMessage={errors.ContactEmail?.message} type="email" isValidEmail={isValidEmail} />
                                            <InputField
                                                name="OtpCode"
                                                label="Email Verification Code"
                                                register={register}
                                                isEditing={true}
                                                placeholder="Please input otp code...."
                                                divClassName="relative"
                                                addButton={true}
                                                handleClick={handleSendVerificationCode}
                                                required
                                                errors={errors.OtpCode}
                                                errorMessage={errors.OtpCode?.message}
                                                isOtpValid={otpValid}
                                                isOtp={true}
                                                onChange={(e) => handleOtpChange(e.target.value)}
                                                isMessage={isMessage}
                                                successMessage={successMessage}
                                                disabled={otpCooldown}
                                                color={color}
                                            />

                                        </div>
                                        <div className="pt-2">
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
                                            <GreenBtn label="Next →" onClick={handleNext} />
                                        </div>
                                    </motion.div>
                                </>
                            )}
                            {step === 7 && (
                                <>
                                    <motion.div
                                        key="seven"
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -50, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                                            <strong className="font-bold">Note: </strong>
                                            <span className="block sm:inline">PNG and JPG are Allowed..</span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto pr-2 space-y-6 pt-2">
                                            <InputFileField
                                                name="TwoByTwo"
                                                label="Upload 2x2 Picture"
                                                register={register}
                                                isEditing={true}
                                                type="file"
                                                onFileChange={setTwoByTwoFile}
                                                file={twoByTwoFile}
                                                altFileName="2x2 Preview"
                                            />
                                            <InputFileField
                                                name="BirthCert"
                                                label="Upload Birth Certificate"
                                                register={register}
                                                isEditing={true}
                                                type="file"
                                                onFileChange={setBirthCertificate}
                                                file={birthCertificate}
                                                altFileName="Birth Certificate Preview"
                                            />
                                            <InputFileField
                                                name="Baptismal"
                                                label="Upload Baptismal"
                                                register={register}
                                                isEditing={true}
                                                type="file"
                                                onFileChange={setBaptismal}
                                                file={baptismal}
                                                altFileName="Birth Certificate Preview"
                                            />
                                            <InputFileField
                                                name="GoodMoral"
                                                label="Upload Good Moral"
                                                register={register}
                                                isEditing={true}
                                                type="file"
                                                onFileChange={setGoodMoral}
                                                file={goodMoral}
                                                altFileName="Good Moral Preview"
                                            />
                                            <InputFileField
                                                name="ReportCard"
                                                label="Upload Report Card"
                                                register={register}
                                                isEditing={true}
                                                type="file"
                                                onFileChange={setReportCard}
                                                file={reportCard}
                                                altFileName="Report Card Preview"
                                            />
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
    );
};
export default NewEnrollyComponent;