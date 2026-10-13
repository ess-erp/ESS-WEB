import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import RedBtn from "../ButtonsComponents/RedBtn";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import InputPasswordField from "../ButtonsComponents/InputPasswordField";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchProvinceData,
  fetchCityData,
  fetchBarangayData,
  fetchCreateParentAccountData,
} from "../../states/OnlineApplicationState/Action";

const RegistrationFormComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  
  const stepTitle = {
    1: "Personal Information",
    2: "Account Credentials",
    3: "Address Information",
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
      MobileNo: "",
      Password: "",
      ConfirmPassword: "",
      Province: null,
      City: null,
      Barangay: null,
      HomeStreet: "",
    },
  });

  // Selectors
  const provinceList = useSelector((state) => state.online.provinceState?.data || []);
  const cityList = useSelector((state) => state.online.cityState?.data || []);
  const brgyList = useSelector((state) => state.online.barangayState?.data || []);

  // Watch form fields
  const province = watch("Province");
  const city = watch("City");
  const password = watch("Password");

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [color, setIsColor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchProvinceData());
  }, [dispatch]);

  // Fetch cities when province changes
  useEffect(() => {
    if (!province?.province_code) return;
    dispatch(fetchCityData(province.province_code));
  }, [province?.province_code, dispatch]);

  // Fetch barangays when city changes
  useEffect(() => {
    if (!city?.city_code) return;
    dispatch(fetchBarangayData(city.city_code));
  }, [city?.city_code, dispatch]);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Mobile number validation (Philippine format)
  const isValidMobileNo = (mobile) => {
    const mobileRegex = /^09\d{9}$/;
    return mobileRegex.test(mobile);
  };

  // Handle Next button
  const handleNext = async () => {
    let fieldsToValidate = [];
    
    //switch (step) {
    //   case 1:
    //     fieldsToValidate = ["Fname", "Lname", "Email", "MobileNo"];
        
    //     // Validate email format
    //     const email = getValues("Email");
    //     if (email && !isValidEmail(email)) {
    //       alert("Please enter a valid email address!");
    //       return;
    //     }

    //     // Validate mobile number format
    //     const mobile = getValues("MobileNo");
    //     if (mobile && !isValidMobileNo(mobile)) {
    //       alert("Please enter a valid mobile number (09XXXXXXXXX)!");
    //       return;
    //     }
    //     break;
    //   case 2:
    //     fieldsToValidate = ["Password", "ConfirmPassword"];
        
    //     // Check if passwords match
    //     if (password !== getValues("ConfirmPassword")) {
    //       alert("Passwords do not match!");
    //       return;
    //     }
    //     break;
    //   default:
    //     break;
    // }

    // const isValid = await trigger(fieldsToValidate);
    // if (isValid) {
    //   setStep(step + 1);
    // }
    setStep(step + 1);
  };

  // Handle Step 3 submit
  const handleFinalSubmit = async () => {
    const fieldsToValidate = ["Province", "City", "Barangay", "HomeStreet"];
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      handleSubmit(onSubmit)();
    }
  };

  // Handle Back button
  const handleBack = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const onSubmit = (data) => {
    console.log(data);
    setFormData(data);
    setIsModalOpen(true);
  };

  // Confirm submission
  const handleConfirmSubmit = async () => {
    if (!formData) return;
    
    console.log("Submitting Parent Account:", formData);

    const payload = {
      Fname: formData.Fname || "",
      Mname: formData.Mname || "",
      Lname: formData.Lname || "",
      Email: formData.Email || "",
      MobileNo: formData.MobileNo || "",
      Password: formData.Password || "",
      ProvinceCode: formData.Province?.province_code || "",
      ProvinceName: formData.Province?.province_name || "",
      CityCode: formData.City?.city_code || "",
      CityName: formData.City?.city_name || "",
      BrgyCode: formData.Barangay?.brgy_code || "",
      BrgyName: formData.Barangay?.brgy_name || "",
      HomeStreet: formData.HomeStreet || "",
    };

    console.log("SUBMIT PAYLOAD:", payload);

    // Call Redux action to create parent account
    const res = await dispatch(fetchCreateParentAccountData(payload));
    
    setIsModalOpen(false);

    if (res.ok) {
      // Success - show success modal and redirect
      setSuccessMessage("Parent account created successfully!");
      setIsColor("green");
      setIsSuccessModalOpen(true);
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      // Error - show error message
      setSuccessMessage(res.error?.message || "Failed to create parent account. Please try again.");
      setIsColor("red");
      setIsMessage(true);
      
      setTimeout(() => {
        setIsMessage(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
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
              Create your Parent Portal Account
            </p>
            <p className="text-sm lg:text-base text-gray-600">
              to manage your child's enrollment.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-green-600 text-center mb-2">
            Create Parent Portal Account
          </h2>
          <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            {stepTitle[step]}
          </p>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                    step >= s
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
                  <InputField
                    name="Fname"
                    label="First Name"
                    register={register}
                    isEditing={true}
                    placeholder="Enter your first name"
                    required
                    errors={errors.Fname}
                    errorMessage={errors.Fname?.message}
                  />
                  <InputField
                    name="Mname"
                    label="Middle Name"
                    register={register}
                    isEditing={true}
                    placeholder="Enter your middle name (optional)"
                  />
                  <InputField
                    name="Lname"
                    label="Last Name"
                    register={register}
                    isEditing={true}
                    placeholder="Enter your last name"
                    required
                    errors={errors.Lname}
                    errorMessage={errors.Lname?.message}
                  />
                  <InputField
                    name="Email"
                    label="Email Address"
                    type="email"
                    register={register}
                    isEditing={true}
                    placeholder="your.email@example.com"
                    required
                    errors={errors.Email}
                    errorMessage={errors.Email?.message}
                    isValidEmail={isValidEmail}
                    rules={{
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address"
                      }
                    }}
                  />
                  <InputField
                    name="MobileNo"
                    label="Mobile Number"
                    register={register}
                    isEditing={true}
                    placeholder="09XXXXXXXXX"
                    required
                    errors={errors.MobileNo}
                    errorMessage={errors.MobileNo?.message}
                    rules={{
                      pattern: {
                        value: /^09\d{9}$/,
                        message: "Mobile number must be in format 09XXXXXXXXX"
                      }
                    }}
                  />
                  <div className="pt-2">
                    <GreenBtn label="Next →" onClick={handleNext} />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Account Credentials */}
              {step === 2 && (
                <motion.div
                  key="two"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <InputPasswordField
                    name="Password"
                    label="Password"
                    register={register}
                    isEditing={true}
                    placeholder="Enter your password"
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    required
                    errors={errors.Password}
                    errorMessage={errors.Password?.message}
                    rules={{
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    }}
                  />
                  <InputPasswordField
                    name="ConfirmPassword"
                    label="Confirm Password"
                    register={register}
                    isEditing={true}
                    placeholder="Re-enter your password"
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    required
                    errors={errors.ConfirmPassword}
                    errorMessage={errors.ConfirmPassword?.message}
                    rules={{
                      validate: (value) => value === password || "Passwords do not match"
                    }}
                  />
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <RedBtn label="← Back" onClick={handleBack} />
                    <GreenBtn label="Next →" onClick={handleNext} />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Address Information */}
              {step === 3 && (
                <motion.div
                  key="three"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <RHFListbox
                    name="Province"
                    label="Province"
                    control={control}
                    list={provinceList}
                    labelKey="province_name"
                    required
                    error={errors.Province}
                  />
                  <RHFListbox
                    name="City"
                    label="City/Municipality"
                    control={control}
                    list={cityList}
                    labelKey="city_name"
                    required
                    error={errors.City}
                  />
                  <RHFListbox
                    name="Barangay"
                    label="Barangay"
                    control={control}
                    list={brgyList}
                    labelKey="brgy_name"
                    required
                    error={errors.Barangay}
                  />
                  <InputField
                    name="HomeStreet"
                    label="House No. / Street"
                    register={register}
                    isEditing={true}
                    placeholder="Enter house number and street"
                    required
                    errors={errors.HomeStreet}
                    errorMessage={errors.HomeStreet?.message}
                  />
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <RedBtn label="← Back" onClick={handleBack} />
                    <GreenBtn label="Create Account" onClick={handleFinalSubmit} />
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
        title="Confirm Account Creation"
        body="Are you sure you want to create this parent portal account?"
        buttons={[
          { label: "Yes, Create Account", type: "green", onClick: handleConfirmSubmit },
          { label: "Cancel", type: "red", onClick: () => setIsModalOpen(false) },
        ]}
      />

      {/* Success Modal */}
      <ModalComponent
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={<span className="font-bold text-lg text-green-700">Success!</span>}
        body={
          <div className="text-center">
            <p className="mb-2">Your parent portal account has been created successfully!</p>
            <p className="text-sm text-gray-600">Redirecting to login page...</p>
          </div>
        }
        buttons={[]}
      />
    </div>
  );
};

export default RegistrationFormComponent;
