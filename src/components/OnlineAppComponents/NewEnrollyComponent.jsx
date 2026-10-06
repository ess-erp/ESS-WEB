import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import BlueBtn from "../../components/ButtonsComponents/BlueBtn";
import RedBtn from "../ButtonsComponents/RedBtn";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import InputFileField from "../ButtonsComponents/InputFileField";
import RadioGroupField from "../ButtonsComponents/RadioGroupField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import InputPasswordField from "../ButtonsComponents/InputPasswordField";
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
  fetchInsertStudentData,
  fetchInitialDocumentsData,
} from "../../states/OnlineApplicationState/Action";
import { WalletCards } from "lucide-react";

const NewEnrollyComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const stepTitle = {
    1: "Personal Information",
    2: "Campus Information",
    3: "Father's Information",
    4: "Mother's Maiden Information",
    5: "Primary Portal Account",
    6: "Emergency Contact Person Information",
    7: "Address Information",
    8: "File Attachment",
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
      FathersOccupation: "",
      FathersMobileNo: "",
      MothersFname: "",
      MothersMname: "",
      MothersLname: "",
      MothersOccupation: "",
      MothersMobileNo: "",
      PrimaryFname: "",
      PrimaryMname: "",
      PrimaryLname: "",
      PrimaryEmail: "",
      PrimaryPassword: "",
      PrimaryConfirmPassword: "",
      OtpCode: "",
      ContactPerson: "",
      ContactEmail: "",
      Relationship: "",
      ContactMobileNo: "",
      ProvinceCode: "",
      ProvinceName: "",
      CityCode: "",
      CityName: "",
      BrgyCode: "",
      BrgyName: "",
      HomeStreet: "",
      StudentType: "New",
    },
  });
  const campusList = useSelector(
    (state) => state.online.campusState?.data || []
  );
  const divisionList = useSelector(
    (state) => state.online.divisionState?.data || []
  );
  const levelList = useSelector((state) => state.online.levelState?.data || []);
  const strandList = useSelector(
    (state) => state.online.strandState?.data || []
  );
  const nationalityList = useSelector(
    (state) => state.online.nationalityState?.data || []
  );
  const religionList = useSelector(
    (state) => state.online.religionState?.data || []
  );
  const provinceList = useSelector(
    (state) => state.online.provinceState?.data || []
  );
  const cityList = useSelector((state) => state.online.cityState?.data || []);
  const brgyList = useSelector(
    (state) => state.online.barangayState?.data || []
  );
  const initialDocumentsData = useSelector(
    (state) => state.online.initialDocumentsState?.data || []
  );

  const [initialDocuments, setInitialDocuments] = useState([]);

  useEffect(() => {
    dispatch(fetchCampusData());
    dispatch(fetchDivisionData());
    dispatch(fetchNationalityData());
    dispatch(fetchReligionData());
    dispatch(fetchProvinceData());
    dispatch(fetchInitialDocumentsData());
  }, [dispatch]);

  // Set initial documents when data is fetched
  useEffect(() => {
    if (initialDocumentsData && initialDocumentsData.length > 0) {
      setInitialDocuments(initialDocumentsData);
    }
  }, [initialDocumentsData]);

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

  const [showPassword, setShowPassword] = useState(false);
  const [otpValid, setOtpValid] = useState(null);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [serverOtp, setServerOtp] = useState(null);
  const [isMessage, setIsMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [color, setIsColor] = useState("");

  const [passwordMatchValid, setPasswordMatchValid] = useState(null);
  const [isPasswordMatchMessage, setIsPasswordMatchMessage] = useState(false);
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [passwordMatchColor, setPasswordMatchColor] = useState("");
  const password = watch("PrimaryPassword");
  const confirmPassword = watch("PrimaryConfirmPassword");

  const validatePasswordMatch = () => {
    if (!confirmPassword) {
      setIsPasswordMatchMessage(false);
      setPasswordMatchValid(null);
      return;
    }
    setIsPasswordMatchMessage(true);
    if (password === confirmPassword) {
      setPasswordMatchValid(true);
      setPasswordMatchColor("green");
      setPasswordMatchMessage("password matched!");
    } else {
      setPasswordMatchValid(false);
      setPasswordMatchColor("red");
      setPasswordMatchMessage("password unmatched!");
    }
  };
  useEffect(() => {
    validatePasswordMatch(password, confirmPassword);
  }, [password, confirmPassword]);

  const handleSendVerificationCode = async () => {
    if (otpCooldown > 0) return;
    const isValid = await trigger("PrimaryEmail");
    const email = getValues("PrimaryEmail");

    //if contact email not valid it will throw an error
    if (!isValid) return;
    setOtpCooldown(60);
    setOtpValid(null);
    setIsMessage(true);
    setIsColor("green");
    setSuccessMessage("An OTP has been sent to the email above.");
    // const payload = {
    //     FatherEmail: "",
    //     MotherEmail: "",
    //     ContactEmail: email,
    // }
    const res = await dispatch(fetchOtpCodeData(email));
    if (res.ok) {
      setServerOtp(res.data.OtpCode);
    }
  };

  // console.log(serverOtp);
  useEffect(() => {
    if (otpCooldown <= 0) {
      setIsMessage(false);
      return;
    }

    const timer = setInterval(() => {
      setOtpCooldown((prev) => prev - 1);
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

  // Dynamic document files storage - keyed by DocTempChildId
  const [documentFiles, setDocumentFiles] = useState({});

  // Handler for dynamic document file changes
  const handleDocumentFileChange = (docTempChildId, file) => {
    setDocumentFiles(prev => ({
      ...prev,
      [docTempChildId]: file
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    // let fieldsToValidate = [];
    // switch (step) {
    //   case 1:
    //     fieldsToValidate = ["Fname", "Lname", "Gender", "DateOfBirth"];
    //     break;
    //   case 2:
    //     fieldsToValidate = ["Campus", "Division", "Level"];
    //     if (watch("Level")?.LevelId === 15) fieldsToValidate.push("Strand");
    //     fieldsToValidate.push("Religion", "Nationality");
    //     break;
    //   case 3:
    //     fieldsToValidate = [];
    //     break;
    //   case 4:
    //     fieldsToValidate = [
    //       "MothersFname",
    //       "MothersLname",
    //       "MothersMobilePhoneNo",
    //     ];
    //     break;
    //   case 5:
    //     fieldsToValidate = [
    //       "PrimaryFname",
    //       "PrimaryLname",
    //       "PrimaryEmail",
    //       "PrimaryPassword",
    //       "PrimaryConfirmPassword",
    //       "OtpCode",
    //     ];
    //     break;
    //   case 6:
    //     fieldsToValidate = [
    //       "ContactPerson",
    //       "ContactEmail",
    //       "ContactMobileNo",
    //       "Relationship",
    //     ];
    //     break;
    //   case 7:
    //     fieldsToValidate = ["Province", "City", "Barangay", "HomeStreet"];
    //     break;
    //   case 8:
    //     fieldsToValidate = [];
    //     break;
    // }
    // const valid = await trigger(fieldsToValidate);

    // if (step === 5) {
    //   if (otpValid !== true) {
    //     setIsMessage(true);
    //     setIsColor("red");
    //     setSuccessMessage("OTP is invalid or not verified.");
    //     return; // prevent moving to next step
    //   }
    // }
    // if (valid) {
    //   setStep(step + 1);
    // }
    setStep(step + 1);
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
    if (formData.Strand?.StrandId) {
      payload.append("StrandId", formData.Strand.StrandId);
      payload.append("StrandName", formData.Strand.StrandName ?? "");
    }

    payload.append("NationalityId", formData.Nationality?.NationalityId ?? "");
    payload.append(
      "NationalityName",
      formData.Nationality?.NationalityName || ""
    );
    payload.append("ReligionId", formData.Religion?.ReligionId ?? "");
    payload.append("ReligionName", formData.Religion?.ReligionName || null);
    payload.append("OtherReligion", formData.OtherReligion || null);

    payload.append("FathersFname", formData.FathersFname || "");
    payload.append("FathersMname", formData.FathersMname || "");
    payload.append("FathersLname", formData.FathersLname || "");
    payload.append("FathersOccupation", formData.FathersOccupation || "");
    payload.append("FathersMobileNo", formData.FathersMobileNo || "");
    payload.append("MothersFname", formData.MothersFname || "");
    payload.append("MothersMname", formData.MothersMname || "");
    payload.append("MothersLname", formData.MothersLname || "");
    payload.append("MothersOccupation", formData.MothersOccupation || "");
    payload.append("MothersMobileNo", formData.MothersMobileNo || "");

    payload.append("PrimaryFname", formData.PrimaryFname || "");
    payload.append("PrimaryMname", formData.PrimaryMname || "");
    payload.append("PrimaryLname", formData.PrimaryLname || "");
    payload.append("PrimaryEmail", formData.PrimaryEmail || "");
    payload.append("PrimaryPassword", formData.PrimaryPassword || "");

    payload.append("ContactPerson", formData.ContactPerson || "");
    payload.append("ContactEmail", formData.ContactEmail || "");
    payload.append("Relationship", formData.Relationship || "");
    payload.append("ContactMobileNo", formData.ContactMobileNo || "");

    payload.append("ProvinceCode", formData.Province?.province_code || "");
    payload.append("ProvinceName", formData.Province?.province_name || "");
    payload.append("CityCode", formData.City?.city_code || "");
    payload.append("CityName", formData.City?.city_name || "");
    payload.append("BrgyCode", formData.Barangay?.brgy_code || "");
    payload.append("BrgyName", formData.Barangay?.brgy_name || "");
    payload.append("HomeStreet", formData.HomeStreet || "");

    payload.append("StudentType", formData.StudentType || "New");

    // Get DocTempId from fetched initial documents (all should have same DocTempId)
    const docTempId = initialDocuments.length > 0 ? initialDocuments[0].DocTempId : null;
    if (docTempId) {
      payload.append("DocTempId", docTempId);
    }

    // Append documents with their DocTempChildId and uploaded file
    let docIndex = 0;
    initialDocuments.forEach((doc) => {
      const uploadedFile = documentFiles[doc.DocTempChildId];
      if (uploadedFile) {
        payload.append(`Documents[${docIndex}].DocTempChildId`, doc.DocTempChildId);
        payload.append(`Documents[${docIndex}].Value`, uploadedFile);
        docIndex++;
      }
    });

    console.log("SUBMIT PAYLOAD:", payload);

    const res = await dispatch(fetchInsertStudentData(payload));
    if (res.ok) {
      setIsSuccessModalOpen(true);
      if (isSuccessModalOpen == false) {
        navigate("/congratulationletter");
      }
    } else {
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
                      <InputField
                        name="Fname"
                        label="First Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input first name...."
                        divClassName=""
                        required
                        errors={errors.Fname}
                        errorMessage={errors.Fname?.message}
                      />
                      <InputField
                        name="Mname"
                        label="Middle Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input middle name...."
                        divClassName=""
                      />
                      <InputField
                        name="Lname"
                        label="Last Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input last name...."
                        divClassName=""
                        required
                        errors={errors.Lname}
                        errorMessage={errors.Lname?.message}
                      />
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
                      <InputField
                        name="DateOfBirth"
                        label="Date of birth"
                        register={register}
                        isEditing={true}
                        divClassName=""
                        type="date"
                        required
                        errors={errors.DateOfBirth}
                        errorMessage={errors.DateOfBirth?.message}
                      />
                      <InputField
                        name="PlaceOfBirth"
                        label="Place of birth"
                        register={register}
                        isEditing={true}
                        placeholder="Please input place of birth...."
                        divClassName=""
                      />
                    </div>
                    <div className="pt-2">
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
                      <RHFListbox
                        name="Campus"
                        control={control}
                        list={campusList}
                        label="Campus"
                        labelKey="CampusName"
                        isEditing={false}
                        divClassName=""
                        required
                        error={errors.Campus}
                      />
                      <RHFListbox
                        name="Division"
                        control={control}
                        list={divisionList}
                        label="Division"
                        labelKey="DivName"
                        isEditing={false}
                        divClassName=""
                        required
                        error={errors.Division}
                      />
                      <RHFListbox
                        name="Level"
                        control={control}
                        list={levelList}
                        label="Level"
                        labelKey="LevelName"
                        isEditing={false}
                        divClassName=""
                        required
                        error={errors.Level}
                      />

                      {level?.LevelId === 15 && (
                        <RHFListbox
                          name="Strand"
                          control={control}
                          list={strandList}
                          label="Strand"
                          labelKey="StrandName"
                          isEditing={false}
                          divClassName=""
                          required
                          error={errors.Strand}
                        />
                      )}
                      <RHFListbox
                        name="Religion"
                        control={control}
                        list={religionList}
                        label="Religion"
                        labelKey="ReligionName"
                        isEditing={false}
                        divClassName=""
                        required
                        error={errors.Religion}
                      />
                      {selectedReligion?.ReligionId === 18 && (
                        <InputField
                          name="OtherReligion"
                          label="Other Religion"
                          register={register}
                          isEditing={true}
                          placeholder="Please input religion...."
                          divClassName=""
                          required
                          errors={errors.OtherReligion}
                          errorMessage={errors.OtherReligion?.message}
                        />
                      )}
                      <RHFListbox
                        name="Nationality"
                        control={control}
                        list={nationalityList}
                        label="Nationality"
                        labelKey="NationalityName"
                        isEditing={false}
                        divClassName=""
                        required
                        error={errors.Nationality}
                      />
                    </div>
                    <div className="pt-2">
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
                      <InputField
                        name="FathersFname"
                        label="First Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input first name...."
                        divClassName=""
                      />
                      <InputField
                        name="FathersMname"
                        label="Middle Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input middle name...."
                        divClassName=""
                      />
                      <InputField
                        name="FathersLname"
                        label="Last Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input last name...."
                        divClassName=""
                      />
                      <InputField
                        name="FathersMobilePhoneNo"
                        label="Mobile Phone No."
                        register={register}
                        isEditing={true}
                        placeholder="Please input mobile phone...."
                        divClassName=""
                      />
                      <InputField
                        name="FathersOccupation"
                        label="Occupation"
                        register={register}
                        isEditing={true}
                        placeholder="Please input occupation...."
                        divClassName=""
                      />
                    </div>
                    <div className="pt-2">
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
                      <InputField
                        name="MothersFname"
                        label="First Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input first name...."
                        divClassName=""
                        required
                        errors={errors.MothersFname}
                        errorMessage={errors.MothersFname?.message}
                      />
                      <InputField
                        name="MothersMname"
                        label="Middle Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input middle name...."
                        divClassName=""
                      />
                      <InputField
                        name="MothersLname"
                        label="Last Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input last name...."
                        divClassName=""
                        required
                        errors={errors.MothersLname}
                        errorMessage={errors.MothersLname?.message}
                      />
                      <InputField
                        name="MothersMobilePhoneNo"
                        label="Mobile Phone No."
                        register={register}
                        isEditing={true}
                        placeholder="Please input mobile phone...."
                        divClassName=""
                        required
                        errors={errors.MothersMobilePhoneNo}
                        errorMessage={errors.MothersMobilePhoneNo?.message}
                      />
                      <InputField
                        name="MothersOccupation"
                        label="Occupation"
                        register={register}
                        isEditing={true}
                        placeholder="Please input occupation...."
                        divClassName=""
                      />
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
                      <InputField
                        name="PrimaryFname"
                        label="First Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input first name...."
                        divClassName=""
                        required
                        errors={errors.PrimaryFname}
                        errorMessage={errors.PrimaryFname?.message}
                      />
                      <InputField
                        name="PrimaryMname"
                        label="Middle Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input middle name...."
                        divClassName=""
                      />
                      <InputField
                        name="PrimaryLname"
                        label="Last Name"
                        register={register}
                        isEditing={true}
                        placeholder="Please input last name...."
                        divClassName=""
                        required
                        errors={errors.PrimaryLname}
                        errorMessage={errors.PrimaryLname?.message}
                      />
                      <InputField
                        name="PrimaryEmail"
                        label="Email"
                        register={register}
                        isEditing={true}
                        placeholder="Please input email...."
                        divClassName=""
                        required
                        errors={errors.PrimaryEmail}
                        errorMessage={errors.PrimaryEmail?.message}
                        type="email"
                        isValidEmail={isValidEmail}
                      />
                      <InputPasswordField
                        name="PrimaryPassword"
                        label="Password"
                        register={register} // pass function
                        isEditing={true}
                        placeholder="Please input password...."
                        divClassName=""
                        required
                        errors={errors.PrimaryPassword}
                        errorMessage={errors.PrimaryPassword?.message}
                        type="password"
                        showEyeButton={true}
                      />
                      <InputPasswordField
                        name="PrimaryConfirmPassword"
                        label="Confirm Password"
                        register={register} // pass function
                        isEditing={true}
                        placeholder="Confirm your password...."
                        divClassName=""
                        required
                        errors={errors.PrimaryConfirmPassword}
                        errorMessage={errors.PrimaryConfirmPassword?.message}
                        type="password"
                        showEyeButton={true}
                        isMessage={isPasswordMatchMessage}
                        successMessage={passwordMatchMessage}
                        color={passwordMatchColor}
                      />

                      {/* // validation={{required: "Confirm Password is required",validate: (value) =>value === watch("PrimaryPassword") || "Passwords do not match"}} */}
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
                      <InputField
                        name="ContactPerson"
                        label="Fullname"
                        register={register}
                        isEditing={true}
                        placeholder="Please input fullname...."
                        divClassName=""
                        required
                        errors={errors.ContactPerson}
                        errorMessage={errors.ContactPerson?.message}
                      />
                      <InputField
                        name="ContactEmail"
                        label="Email"
                        register={register}
                        isEditing={true}
                        placeholder="Please input email...."
                        divClassName=""
                        required
                        errors={errors.ContactEmail}
                        errorMessage={errors.ContactEmail?.message}
                        type="email"
                        isValidEmail={isValidEmail}
                      />
                      <InputField
                        name="Relationship"
                        label="Relationship"
                        register={register}
                        isEditing={true}
                        placeholder="Please input relationship...."
                        divClassName=""
                        required
                        errors={errors.Relationship}
                        errorMessage={errors.ContactPerson?.message}
                      />
                      <InputField
                        name="ContactMobileNo"
                        label="Mobile Phone Number"
                        register={register}
                        isEditing={true}
                        placeholder="Please input mobile number...."
                        divClassName=""
                        required
                        errors={errors.ContactMobileNo}
                        errorMessage={errors.ContactMobileNo?.message}
                      />
                      {/* <InputField
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
                                            /> */}
                    </div>
                    <div className="pt-2">
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
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                      <RHFListbox
                        name="Province"
                        control={control}
                        list={provinceList}
                        label="Province"
                        labelKey="province_name"
                        isEditing={false}
                        divClassName=""
                        required
                        error={errors.Province}
                      />
                      <RHFListbox
                        name="City"
                        control={control}
                        list={cityList}
                        label="City"
                        labelKey="city_name"
                        isEditing={false}
                        divClassName=""
                        required
                        error={errors.City}
                      />
                      <RHFListbox
                        name="Barangay"
                        control={control}
                        list={brgyList}
                        label="Barangay"
                        labelKey="brgy_name"
                        isEditing={false}
                        divClassName=""
                        required
                        error={errors.Barangay}
                      />
                      <InputField
                        name="HomeStreet"
                        label="Home Steet Number"
                        register={register}
                        isEditing={true}
                        placeholder="Please input street no(Block 1 Lot 1)."
                        divClassName=""
                        required
                        errors={errors.HomeStreet}
                        errorMessage={errors.HomeStreet?.message}
                      />
                    </div>
                    <div className="pt-2">
                      <RedBtn label="← Back" onClick={handleBack} />
                      <GreenBtn label="Next →" onClick={handleNext} />
                    </div>
                  </motion.div>
                </>
              )}
              {step === 8 && (
                <>
                  <motion.div
                    key="eight"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <strong className="font-bold">Note: </strong>
                      <span className="block sm:inline">
                        PNG and JPG are Allowed..
                      </span>
                    </div>
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-6 pt-2">
                      {initialDocuments.length > 0 ? (
                        initialDocuments.map((doc) => (
                          <InputFileField
                            key={doc.DocTempChildId}
                            name={`Document_${doc.DocTempChildId}`}
                            label={`Upload ${doc.DocName}`}
                            register={register}
                            isEditing={true}
                            type="file"
                            onFileChange={(file) => handleDocumentFileChange(doc.DocTempChildId, file)}
                            file={documentFiles[doc.DocTempChildId] || null}
                            altFileName={`${doc.DocName} Preview`}
                          />
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Loading documents...
                        </div>
                      )}
                    </div>
                    <div className="pt-2">
                      <RedBtn label="← Back" onClick={handleBack} />
                      <GreenBtn
                        label="Submit"
                        onClick={handleSubmit(onSubmit)}
                      />
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
            {
              label: "No",
              type: "red",
              onClick: () => console.log("No clicked"),
            },
          ]}
          backgroundImage="/assets/img/White-Background.png"
        />
      </div>
    </div>
  );
};
export default NewEnrollyComponent;
