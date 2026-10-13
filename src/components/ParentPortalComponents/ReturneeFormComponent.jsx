import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import BlueBtn from "../../components/ButtonsComponents/BlueBtn";
import RedBtn from "../ButtonsComponents/RedBtn";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import RadioGroupField from "../ButtonsComponents/RadioGroupField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
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
  fetchInitialDocumentsData,
  // fetchInsertStudentData,
} from "../../states/OnlineApplicationState/Action";
import { fetchParentAddressData } from "../../states/ParentState/Action";

const ReturneeFormComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [transList, setTransList] = useState([]);
  const [transDropdown, setTransDropdown] = useState(null);
  
  // Get logged-in parent user data
  const [parentUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Parent address data
  const [parentAddress, setParentAddress] = useState(null);
  const stepTitle = {
    1: "Student/Learner Information",
    2: "Father's & Mother's Information",
    3: "Address Information",
    4: "Emergency Contact Person Information",
  };
  const {
    getValues,
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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
      DualNationality: null,
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

    //if contact email not valid it will throw an error
    if (!isValid) return;
    setOtpCooldown(60);
    setOtpValid(null);
    setIsMessage(true);
    setIsColor("green");
    setSuccessMessage("An OTP has been sent to the email above.");
    const payload = {
      FatherEmail: "",
      MotherEmail: "",
      ContactEmail: email,
    };
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [sameAsParentAddress, setSameAsParentAddress] = useState(false);
  const [hasDualCitizenship, setHasDualCitizenship] = useState(false);

  // Function to populate parent's address to form fields
  const populateParentAddress = async () => {
    if (!parentAddress && parentUser?.UserId) {
      // Fetch parent address from backend API
      try {
        const result = await dispatch(fetchParentAddressData(parentUser.UserId));
        
        if (result.ok && result.data) {
          const addressData = result.data;
          
          // Populate form fields with parent address
          setValue("Province", {
            province_code: addressData.ProvinceCode || "",
            province_name: addressData.ProvinceName || ""
          });
          setValue("City", {
            city_code: addressData.CityCode || "",
            city_name: addressData.CityName || ""
          });
          setValue("Barangay", {
            brgy_code: addressData.BrgyCode || "",
            brgy_name: addressData.BrgyName || ""
          });
          setValue("HomeStreet", addressData.HomeStreet || "");
          
          setParentAddress(addressData);
        } else {
          console.error("Failed to fetch parent address");
        }
      } catch (error) {
        console.error("Error fetching parent address:", error);
      }
    } else if (parentAddress) {
      // Parent address already fetched, just populate
      setValue("Province", {
        province_code: parentAddress.ProvinceCode || "",
        province_name: parentAddress.ProvinceName || ""
      });
      setValue("City", {
        city_code: parentAddress.CityCode || "",
        city_name: parentAddress.CityName || ""
      });
      setValue("Barangay", {
        brgy_code: parentAddress.BrgyCode || "",
        brgy_name: parentAddress.BrgyName || ""
      });
      setValue("HomeStreet", parentAddress.HomeStreet || "");
    }
  };

  // Watch for sameAsParentAddress checkbox changes
  useEffect(() => {
    if (sameAsParentAddress) {
      populateParentAddress();
    }
  }, [sameAsParentAddress]);

  // Handler for student selection - populates all form fields
  const handleStudentSelection = (selected) => {
    setTransDropdown(selected);

    if (!selected) return;

    // Populate personal details
    setValue("Fname", selected.Fname || "");
    setValue("Mname", selected.Mname || "");
    setValue("Lname", selected.Lname || "");
    setValue("Email", selected.Email || "");
    setValue("DateOfBirth", selected.DateOfBirth || "");
    setValue("Gender", selected.Gender || "");
    setValue("PlaceOfBirth", selected.PlaceOfBirth || "");

    // Populate campus information
    setValue("Campus", selected.Campus || null);
    setValue("Division", selected.Division || null);
    setValue("Level", selected.Level || null);
    setValue("Strand", selected.Strand || null);
    setValue("Nationality", selected.Nationality || null);
    
    // Handle dual citizenship
    if (selected.HasDualCitizenship === "1" || selected.DualNationality) {
      setHasDualCitizenship(true);
      setValue("DualNationality", selected.DualNationality || null);
    } else {
      setHasDualCitizenship(false);
      setValue("DualNationality", null);
    }
    
    setValue("Religion", selected.Religion || null);
    setValue("OtherReligion", selected.OtherReligion || "");

    // Populate father's information
    setValue("FathersFname", selected.FathersFname || "");
    setValue("FathersMname", selected.FathersMname || "");
    setValue("FathersLname", selected.FathersLname || "");
    setValue("FathersEmail", selected.FathersEmail || "");
    setValue("FathersOccupation", selected.FathersOccupation || "");
    setValue("FathersMobileNo", selected.FathersMobileNo || "");

    // Populate mother's information
    setValue("MothersFname", selected.MothersFname || "");
    setValue("MothersMname", selected.MothersMname || "");
    setValue("MothersLname", selected.MothersLname || "");
    setValue("MothersEmail", selected.MothersEmail || "");
    setValue("MothersOccupation", selected.MothersOccupation || "");
    setValue("MothersMobileNo", selected.MothersMobileNo || "");

    // Populate address information
    setValue("ProvinceCode", selected.ProvinceCode || "");
    setValue("ProvinceName", selected.ProvinceName || "");
    setValue("CityCode", selected.CityCode || "");
    setValue("CityName", selected.CityName || "");
    setValue("BrgyCode", selected.BrgyCode || "");
    setValue("BrgyName", selected.BrgyName || "");
    setValue("HomeStreet", selected.HomeStreet || "");

    // Populate emergency contact
    setValue("ContactPerson", selected.ContactPerson || "");
    setValue("ContactEmail", selected.ContactEmail || "");
    setValue("ContactMobileNo", selected.ContactMobileNo || "");
    setValue("Relationship", selected.Relationship || "");
  };

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
    //     fieldsToValidate = [];
    //     break;
    //   case 3:
    //     fieldsToValidate = [];
    //     break;
    //   case 4:
    //     fieldsToValidate = [
    //       "ContactPerson",
    //       "ContactEmail",
    //       "ContactMobilePhoneNo",
    //       "Relationship",
    //     ];
    //     break;
    // }
    // const valid = await trigger(fieldsToValidate);

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
    
    // Dual Citizenship
    payload.append("HasDualCitizenship", hasDualCitizenship ? "1" : "0");
    payload.append("DualNationalityId", formData.DualNationality?.NationalityId ?? "");
    payload.append("DualNationalityName", formData.DualNationality?.NationalityName || "");
    
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

    // Student Address Information
    payload.append("ProvinceCode", formData.Province?.province_code || "");
    payload.append("ProvinceName", formData.Province?.province_name || "");
    payload.append("CityCode", formData.City?.city_code || "");
    payload.append("CityName", formData.City?.city_name || "");
    payload.append("BrgyCode", formData.Barangay?.brgy_code || "");
    payload.append("BrgyName", formData.Barangay?.brgy_name || "");
    payload.append("HomeStreet", formData.HomeStreet || "");
    payload.append("SameAsParentAddress", sameAsParentAddress ? "1" : "0");

    // Parent ID - backend will use this to fetch parent's address if needed
    payload.append("ParentId", parentUser?.UserId || "");

    payload.append("StudentType", formData.StudentType || "New");
    payload.append("DocId", formData.DocId || 0);

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
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pb-4">
      {/* Modern Progress Indicator */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex-1 flex items-center">
              <div className="flex flex-col items-center w-full">
                {/* Circle */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${step >= stepNum
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {step > stepNum ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                {/* Label - Hidden on mobile */}
                <span className="hidden md:block text-xs mt-2 text-gray-600 text-center">
                  {stepTitle[stepNum]?.split(" ")[0]}
                </span>
              </div>
              {/* Connector Line */}
              {stepNum < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${step > stepNum ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
        {/* Current Step Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
          {stepTitle[step]}
        </h2>
      </div>

      {/* Form Card with Modern Design */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <div
                  className="animate-slideIn"
                  style={{
                    animation: 'slideIn 0.25s ease-out'
                  }}
                >
                  {/* Student/Learner Information Section */}
                  <div className="space-y-6">
                    {/* Search Student Bar - At the top */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <SearchableSelect
                        options={transList}
                        value={transDropdown}
                        onChange={handleStudentSelection}
                        placeholder="Search student number or fullname..."
                        label="Search Returning Student"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        💡 Search and select a returning student to auto-fill all form fields
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-l-4 border-green-500">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                        required
                        errors={errors.PlaceOfBirth}
                        errorMessage={errors.PlaceOfBirth?.message}
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
                    </div>
                  </div>

                  {/* Campus Information Section */}
                  <div className="space-y-6 pt-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Campus Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      
                      {/* Dual Citizenship Checkbox */}
                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="dualCitizenshipReturnee"
                          checked={hasDualCitizenship}
                          onChange={(e) => {
                            setHasDualCitizenship(e.target.checked);
                            if (!e.target.checked) {
                              setValue("DualNationality", null);
                            }
                          }}
                          className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                        <label
                          htmlFor="dualCitizenshipReturnee"
                          className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                        >
                          I have dual citizenship
                        </label>
                      </div>
                      
                      {/* Dual Nationality Dropdown - Shows when checkbox is checked */}
                      {hasDualCitizenship && (
                        <div className="animate-slideIn mt-4">
                          <RHFListbox
                            name="DualNationality"
                            control={control}
                            list={nationalityList}
                            label="Second Nationality"
                            labelKey="NationalityName"
                            isEditing={false}
                            divClassName=""
                            required={hasDualCitizenship}
                            error={errors.DualNationality}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 flex justify-end border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                      Next
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div
                  className="animate-slideIn"
                  style={{
                    animation: 'slideIn 0.25s ease-out'
                  }}
                >
                  {/* Father's Information Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Father's Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                  </div>

                  {/* Mother's Information Section */}
                  <div className="space-y-6 pt-6">
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border-l-4 border-pink-500">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mother's Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 flex justify-between items-center border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 sm:px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl shadow hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                      Next
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div
                  className="animate-slideIn"
                  style={{
                    animation: 'slideIn 0.25s ease-out'
                  }}
                >
                  {/* Same as Parent Address Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                    <input
                      type="checkbox"
                      id="sameAsParentReturnee"
                      checked={sameAsParentAddress}
                      onChange={(e) => setSameAsParentAddress(e.target.checked)}
                      className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                    <label htmlFor="sameAsParentReturnee" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                      Same address as parent/guardian
                    </label>
                  </div>

                  <div className="max-h-96 overflow-y-auto pr-2 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RHFListbox
                      name="Province"
                      control={control}
                      list={provinceList}
                      label="Province"
                      labelKey="province_name"
                      isEditing={sameAsParentAddress}
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
                      isEditing={sameAsParentAddress}
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
                      isEditing={sameAsParentAddress}
                      divClassName=""
                      required
                      error={errors.Barangay}
                    />
                    <InputField
                      name="HomeStreet"
                      label="Home Street Number"
                      register={register}
                      isEditing={!sameAsParentAddress}
                      placeholder="Please input street no(Block 1 Lot 1)."
                      divClassName=""
                      required
                      errors={errors.HomeStreet}
                      errorMessage={errors.HomeStreet?.message}
                    />
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <RedBtn label="← Back" onClick={handleBack} />
                    <GreenBtn label="Next →" onClick={handleNext} />
                  </div>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <div
                  className="animate-slideIn"
                  style={{
                    animation: 'slideIn 0.25s ease-out'
                  }}
                >
                  <div className="space-y-6">
                    {/* Emergency Contact Section Header */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border-l-4 border-red-500">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Emergency Contact Person
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <InputField
                        name="ContactPerson"
                        label="Full Name"
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
                        label="Email Address"
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
                        name="ContactMobileNo"
                        label="Mobile Number"
                        register={register}
                        isEditing={true}
                        placeholder="Please input mobile number...."
                        divClassName=""
                        required
                        errors={errors.ContactMobileNo}
                        errorMessage={errors.ContactMobileNo?.message}
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
                        errorMessage={errors.Relationship?.message}
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between items-center border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 sm:px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl shadow hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                      Submit Application
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
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
export default ReturneeFormComponent;
