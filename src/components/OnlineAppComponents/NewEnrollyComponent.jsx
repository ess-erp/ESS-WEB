import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import BlueBtn from '../../components/ButtonsComponents/BlueBtn';
import RedBtn from '../ButtonsComponents/RedBtn';
import GreenBtn from '../ButtonsComponents/GreenBtn';
import { Listbox } from "@headlessui/react";
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
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

    const dispatch = useDispatch();
    const campusState = useSelector((state) => state.online.campusState || {});
    const divisionState = useSelector((state) => state.online.divisionState || {});
    const levelState = useSelector((state) => state.online.levelState || {});
    const strandState = useSelector((state) => state.online.strandState || {});
    const nationalityState = useSelector((state) => state.online.nationalityState || {});
    const religionState = useSelector((state) => state.online.religionState || {});
    const otpcodeState = useSelector((state) => state.online.otpcodeState || {});
    const provinceState = useSelector((state) => state.online.provinceState || {});
    const cityState = useSelector((state) => state.online.cityState || {});
    const barangayState = useSelector((state) => state.online.barangayState || {});
    const insertStudentState = useSelector((state) => state.online.insertStudentState || {});

    const campuses = campusState.data || [];
    const [selectedCampus, setSelectedCampus] = useState(null);

    const otpRes = otpcodeState.data || [];

    const divisions = divisionState.data || [];
    const [selectedDivision, setSelectedDivision] = useState(null);

    const [selectedLevel, setSelectedLevel] = useState(null);
    const level = levelState.data || [];

    const [selectedStrand, setSelectedStrand] = useState(null);
    const strand = strandState.data || [];

    const nationality = nationalityState.data || [];
    const [selectedNationlity, setSelectedNationality] = useState(null);

    const religion = religionState.data || [];
    const [selectedReligion, setSelectedReligion] = useState(null);

    const province = provinceState.data || [];
    const [selectedProvince, setSelectedProvince] = useState(null);
    console.log(otpRes);

    const city = cityState.data || [];
    const [selectedCity, setSelectedCity] = useState(null);

    const barangay = barangayState.data || [];
    const [selectedBarangay, setSelectedBarangay] = useState(null);


    const insertStudent = insertStudentState.data || [];

    const navigate = useNavigate();
    if (insertStudent.length !== 0) {
        navigate('/congratulationletter')
    }
    console.log(insertStudent);


    useEffect(() => {
        dispatch(fetchCampusData());
        dispatch(fetchDivisionData());
        dispatch(fetchNationalityData());
        dispatch(fetchReligionData());
        dispatch(fetchProvinceData());
    }, [dispatch]);

    const handleDivisionChange = (division) => {
        setSelectedDivision(division);
        console.log(division);

    };

    const handleLevelChange = (level) => {
        setSelectedLevel(level);
        console.log(level);

    };

    const handleProvinceChange = (province) => {
        setSelectedProvince(province);
    };

    const handleCityChange = (city) => {
        setSelectedCity(city);
    };

    useEffect(() => {

        if (selectedDivision && selectedDivision.DivId) {
            dispatch(fetchLevelData(selectedDivision.DivId));
        }

        if (selectedLevel && selectedLevel.LevelId === 15) {
            dispatch(fetchStrandData(selectedLevel.LevelId));
        }

        if (selectedProvince && selectedProvince.province_code) {
            dispatch(fetchCityData(selectedProvince.province_code));
        }

        if (selectedCity && selectedCity.city_code) {
            dispatch(fetchBarangayData(selectedCity.city_code));
        }
    }, [selectedDivision, selectedLevel, selectedProvince, selectedCity, dispatch]);

    console.log(selectedCampus?.CampusId);

    const [form, setForm] = useState({
        Fname: "",
        Mname: "",
        Lname: "",
        Email: "",
        DateOfBirth: "",
        Gender: "",
        CampusId: 0,
        DivId: 0,
        LevelId: 0,
        StrandId: 0,
        NationalityId: 0,
        ReligionId: 0,
        ReligionName: "",
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
        VerificationEmailCode: "",
        Relationship: "",
        ProvinceCode: "",
        ProvinceName: "",
        CityCode: "",
        CityName: "",
        BrgyCode: "",
        BrgyName: "",
        HomeStreetAddress: "",
        TwoByTwo: "",
        BirthCert: "",
        Baptismal: "",
        GoodMoral: "",
        ReportCard: "",
        StudentType: "New",
    });
    console.log(form.CampusId);
    const [errors, setErrors] = useState({});

    const [triggerVerify, setTriggerVerify] = useState(false);
    const [otpSentMessage, setOtpSentMessage] = useState("");

    console.log(form);
    const [cooldown, setCooldown] = useState(0);
    useEffect(() => {
        if (triggerVerify && form.ContactEmail) {
            dispatch(fetchOtpCodeData(form.ContactEmail));
            setOtpSentMessage(`OTP has been sent to ${form.ContactEmail}`);

            setTimeout(() => {
                setOtpSentMessage("");
            }, 5000);
            setTriggerVerify(false);
        }
    }, [triggerVerify, form.ContactEmail, dispatch]);


    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const verifyEmail = () => {
        if (cooldown > 0) return; // prevent spamming while in cooldown

        setTriggerVerify(true);
        setCooldown(30); // start 30s cooldown
    };

    const handleChange = (e) => {
        // setForm({ ...form, [e.target.name]: e.target.value });
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        const otpPattern = /^[0-9]{6}$/;
        if (value.length === 0) {
            setIsOtpValid(null);
        } else {
            setIsOtpValid(otpPattern.test(value));
        }
    };

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

    const [isOtpValid, setIsOtpValid] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            setForm(prevForm => ({
                ...prevForm,
                [fieldName]: file // dynamically set field by name
            }));
            console.log(`Selected file for ${fieldName}:`, file.name, file.size, "bytes");
        }
    };
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleNext = () => {
        let newErrors = {};
        switch (step) {
            case 1:
                if (!form.Fname.trim()) {
                    newErrors.Fname = "First name is required";
                }
                if (!form.Lname.trim()) {
                    newErrors.Lname = "Last name is required";
                }
                if (!form.Gender.trim()) {
                    newErrors.Gender = "Gender is required";
                }
                if (!form.DateOfBirth?.trim()) {
                    newErrors.DateOfBirth = "Date of birth is required";
                }

                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);

                    setTimeout(() => {
                        setErrors({});
                    }, 3000);

                    return;
                }

                setStep(step + 1);
                break;
            case 2:
                console.log(form.CampusId);
                if (form.CampusId == 0) {
                    newErrors.CampusId = "Campus is required";
                }
                if (form.DivId == 0) {
                    newErrors.DivId = "Division is required";
                }
                if (form.LevelId == 0) {
                    newErrors.LevelId = "Level is required";
                }
                if (form.NationalityId == 0) {
                    newErrors.NationalityId = "Nationality is required";
                }
                if (form.ReligionId == 0) {
                    newErrors.ReligionId = "Religion is required";
                }
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);

                    setTimeout(() => {
                        setErrors({});
                    }, 3000);

                    return;
                }
                console.log(step);
                setStep(step + 1);
                break;
            case 3:
                setStep(step + 1);
                break;
            case 4:
                if (!form.MothersFname.trim()) {
                    newErrors.MothersFname = "First name is required";
                }

                if (!form.MothersLname.trim()) {
                    newErrors.MothersLname = "Last name is required";
                }

                if (!form.MothersEmail.trim()) {
                    newErrors.MothersEmail = "Email is required";
                }
                if (!isValidEmail(form.MothersEmail)) {
                    newErrors.MothersEmail = "Email is not valid please put valid email";
                }

                if (!form.MothersMobileNo.trim()) {
                    newErrors.MothersMobileNo = "Mobile Phone Number is required"
                }
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);

                    setTimeout(() => {
                        setErrors({});
                    }, 3000);

                    return;
                }
                setStep(step + 1);
                break;
            case 5:
                if (!form.ContactPerson.trim()) {
                    newErrors.ContactPerson = "Contact person fullname is required";
                }

                if (!form.ContactEmail.trim()) {
                    newErrors.ContactEmail = "Contact email address is required";
                }
                if (!isValidEmail(form.ContactEmail)) {
                    newErrors.ContactEmail = "Contact email is not valid. Please input a valid email."
                }
                if (!form.VerificationEmailCode.trim()) {
                    newErrors.VerificationEmailCode = "Email verification code is required";
                }

                if (!form.Relationship.trim()) {
                    newErrors.Relationship = "Relationship is required"
                }
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);

                    setTimeout(() => {
                        setErrors({});
                    }, 3000);

                    return;
                }

                setStep(step + 1);
                break;
            case 6:
                if (!form.ProvinceCode.trim()) {
                    newErrors.ProvinceCode = "Province is required";
                }
                if (!form.CityCode.trim()) {
                    newErrors.CityCode = "City is required";
                }
                if (!form.BrgyCode.trim()) {
                    newErrors.BrgyCode = "Barangay is required";
                }
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);

                    setTimeout(() => {
                        setErrors({});
                    }, 3000);

                    return;
                }
                setStep(step + 1);
                break;
            default:
                console.log("test default");
                break;
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };


    const handleSubmit = () => {
        const formData = new FormData();

        for (const key in form) {
            formData.append(key, form[key]);
        }

        dispatch(fetchInsertStudentData(formData));
    };



    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalTrigger = (e) => {
        e.preventDefault();
        setIsModalOpen(true); // Show modal
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 && (
                            <>
                                <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className='text-red-500'>*</span></label>
                                        {errors.Fname && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Fname}</p>
                                        )}
                                        <input
                                            type="text"
                                            name="Fname"
                                            value={form.Fname}
                                            onChange={handleChange}
                                            placeholder="Enter the first name of the student..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                        <input
                                            type="text"
                                            name="Mname"
                                            value={form.Mname}
                                            onChange={handleChange}
                                            placeholder="Enter the middle name of the student..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className='text-red-500'>*</span></label>
                                        {errors.Lname && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Lname}</p>
                                        )}
                                        <input
                                            type="text"
                                            name="Lname"
                                            value={form.Lname}
                                            onChange={handleChange}
                                            placeholder="Enter the last name of the student..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gender <span className='text-red-500'>*</span>
                                        </label>
                                        {errors.Gender && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Gender}</p>
                                        )}
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="Gender"
                                                    value="male"
                                                    checked={form.Gender === "male"}
                                                    onChange={handleChange}
                                                    className="text-blue-500 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-gray-700">Male</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="Gender"
                                                    value="female"
                                                    checked={form.Gender === "female"}
                                                    onChange={handleChange}
                                                    className="text-blue-500 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-gray-700">Female</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className='text-red-500'>*</span></label>
                                        {errors.DateOfBirth && (
                                            <p className="text-red-500 text-sm mt-1">{errors.DateOfBirth}</p>
                                        )}
                                        <input
                                            type="date"
                                            name="DateOfBirth"
                                            value={form.DateOfBirth}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            max={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                </div>
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Campus <span className='text-red-500'>*</span></label>
                                        {errors.CampusId && (
                                            <p className="text-red-500 text-sm mt-1">{errors.CampusId}</p>
                                        )}
                                        <Listbox
                                            value={campuses.find(r => r.CampusId === form.CampusId) || null}
                                            onChange={(campuses) => setForm(prev => ({
                                                ...prev,
                                                CampusId: campuses?.CampusId || 0
                                            }))}
                                        >
                                            <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                                {form.CampusId
                                                    ? campuses.find(c => c.CampusId === form.CampusId)?.CampusName
                                                    : "Select campus"}
                                            </Listbox.Button>
                                            <Listbox.Options className="mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                                                {campuses.length > 0 ? (
                                                    campuses.map((campuses, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            value={campuses}
                                                            className={({ active }) =>
                                                                `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                                }`
                                                            }
                                                        >
                                                            {campuses.CampusName}
                                                        </Listbox.Option>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No campuses found</div>
                                                )}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Division <span className='text-red-500'>*</span></label>
                                        {errors.DivId && (
                                            <p className="text-red-500 text-sm mt-1">{errors.DivId}</p>
                                        )}
                                        <Listbox
                                            value={divisions.find(r => r.DivId === form.DivId) || null}
                                            onChange={(divisions) => {
                                                handleDivisionChange(divisions)
                                                setForm(prev => ({
                                                    ...prev,
                                                    DivId: divisions?.DivId || 0
                                                }))
                                            }}
                                        >
                                            <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                                {form.DivId
                                                    ? divisions.find(c => c.DivId === form.DivId)?.DivName
                                                    : "Select division"}
                                            </Listbox.Button>
                                            <Listbox.Options className="mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                                                {divisions.length > 0 ? (
                                                    divisions.map((divisions, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            value={divisions}
                                                            className={({ active }) =>
                                                                `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                                }`
                                                            }
                                                        >
                                                            {divisions.DivName}
                                                        </Listbox.Option>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No division found</div>
                                                )}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Level <span className='text-red-500'>*</span></label>
                                        {errors.LevelId && (
                                            <p className="text-red-500 text-sm mt-1">{errors.LevelId}</p>
                                        )}
                                        <Listbox
                                            value={level.find(r => r.LevelId === form.LevelId) || null}
                                            onChange={(level) => {
                                                handleLevelChange(level)
                                                setForm(prev => ({
                                                    ...prev,
                                                    LevelId: level?.LevelId || 0
                                                }))
                                            }}
                                        >
                                            <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                                {form.LevelId
                                                    ? level.find(c => c.LevelId === form.LevelId)?.LevelName
                                                    : "Select level"}
                                            </Listbox.Button>
                                            <Listbox.Options className="mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                                                {level.length > 0 ? (
                                                    level.map((level, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            value={level}
                                                            className={({ active }) =>
                                                                `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                                }`
                                                            }
                                                        >
                                                            {level.LevelName}
                                                        </Listbox.Option>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No level found</div>
                                                )}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    {selectedLevel?.LevelId === 15 && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Choose Strand</label>
                                                <Listbox value={selectedStrand} onChange={setSelectedStrand}>
                                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                                        {selectedStrand ? selectedStrand.StrandName : "Select strand"}
                                                    </Listbox.Button>
                                                    <Listbox.Options className="mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                                                        {strand.length > 0 ? (
                                                            strand.map((strand, index) => (
                                                                <Listbox.Option
                                                                    key={index}
                                                                    value={strand}
                                                                    className={({ active }) =>
                                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                                        }`
                                                                    }
                                                                >
                                                                    {strand.StrandName}
                                                                </Listbox.Option>
                                                            ))
                                                        ) : (
                                                            <div className="px-3 py-2 text-gray-500">No strand found</div>
                                                        )}
                                                    </Listbox.Options>
                                                </Listbox>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Nationality <span className='text-red-500'>*</span></label>
                                        {errors.NationalityId && (
                                            <p className="text-red-500 text-sm mt-1">{errors.NationalityId}</p>
                                        )}
                                        <Listbox
                                            value={nationality.find(r => r.NationalityId === form.NationalityId) || null}
                                            onChange={(nationality) => setForm(prev => ({
                                                ...prev,
                                                NationalityId: nationality?.NationalityId || 0
                                            }))}
                                        >
                                            <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                                {form.NationalityId
                                                    ? nationality.find(c => c.NationalityId === form.NationalityId)?.NationalityName
                                                    : "Select nationality"}
                                            </Listbox.Button>
                                            <Listbox.Options className="mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                                                {nationality.length > 0 ? (
                                                    nationality.map((nationality, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            value={nationality}
                                                            className={({ active }) =>
                                                                `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                                }`
                                                            }
                                                        >
                                                            {nationality.NationalityName}
                                                        </Listbox.Option>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No nationality found</div>
                                                )}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Religion <span className='text-red-500'>*</span></label>
                                        {errors.ReligionId && (
                                            <p className="text-red-500 text-sm mt-1">{errors.ReligionId}</p>
                                        )}
                                        <Listbox
                                            value={religion.find(r => r.ReligionId === form.ReligionId) || null}
                                            onChange={(religion) => setForm(prev => ({
                                                ...prev,
                                                ReligionId: religion?.ReligionId || 0
                                            }))}
                                        >
                                            <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                                {form.ReligionId
                                                    ? religion.find(c => c.ReligionId === form.ReligionId)?.ReligionName
                                                    : "Select nationality"}
                                            </Listbox.Button>
                                            <Listbox.Options className="mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                                                {religion.length > 0 ? (
                                                    religion.map((religion, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            value={religion}
                                                            className={({ active }) =>
                                                                `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                                }`
                                                            }
                                                        >
                                                            {religion.ReligionName}
                                                        </Listbox.Option>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No religion found</div>
                                                )}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                </div>
                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="FathersFname"
                                            value={form.FathersFname}
                                            onChange={handleChange}
                                            placeholder="Enter father's first name..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                        <input
                                            type="text"
                                            name="FathersMname"
                                            value={form.FathersMname}
                                            onChange={handleChange}
                                            placeholder="Enter father's middle name..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="FathersLname"
                                            value={form.FathersLname}
                                            onChange={handleChange}
                                            placeholder="Enter father's last name..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="text"
                                            name="FathersEmail"
                                            value={form.FathersEmail}
                                            onChange={handleChange}
                                            placeholder="Enter father's email address.."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                        <input
                                            type="text"
                                            name="FathersOccupation"
                                            value={form.FathersOccupation}
                                            onChange={handleChange}
                                            placeholder="Enter father's occupation..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                        <input
                                            type="text"
                                            name="FathersMobileNo"
                                            value={form.FathersMobileNo}
                                            onChange={handleChange}
                                            placeholder="Enter father's mobile number..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                        {step === 4 && (
                            <>
                                <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className='text-red-500'>*</span></label>
                                        {errors.MothersFname && (
                                            <p className="text-red-500 text-sm mt-1">{errors.MothersFname}</p>
                                        )}
                                        <input
                                            type="text"
                                            name="MothersFname"
                                            value={form.MothersFname}
                                            onChange={handleChange}
                                            placeholder="Enter mother's first name..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                        <input
                                            type="text"
                                            name="MothersMname"
                                            value={form.MothersMname}
                                            onChange={handleChange}
                                            placeholder="Enter mother's middle name..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className='text-red-500'>*</span></label>
                                        {errors.MothersLname && (
                                            <p className="text-red-500 text-sm mt-1">{errors.MothersLname}</p>
                                        )}
                                        <input
                                            type="text"
                                            name="MothersLname"
                                            value={form.MothersLname}
                                            onChange={handleChange}
                                            placeholder="Enter mother's last name..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className='text-red-500'>*</span></label>
                                        {errors.MothersEmail && (
                                            <p className="text-red-500 text-sm mt-1">{errors.MothersEmail}</p>
                                        )}
                                        <input
                                            type="text"
                                            name="MothersEmail"
                                            value={form.MothersEmail}
                                            onChange={handleChange}
                                            placeholder="Enter mother's email address..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                        <input
                                            type="text"
                                            name="MothersOccupation"
                                            value={form.MothersOccupation}
                                            onChange={handleChange}
                                            placeholder="Enter mother's occupation..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className='text-red-500'>*</span></label>
                                        {errors.MothersMobileNo && (
                                            <p className="text-red-500 text-sm mt-1">{errors.MothersMobileNo}</p>
                                        )}
                                        <input
                                            type="text"
                                            name="MothersMobileNo"
                                            value={form.MothersMobileNo}
                                            onChange={handleChange}
                                            placeholder="Enter mother's mobile number..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                        {step === 5 && (
                            <>
                                <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Fullname <span className='text-red-500'>*</span></label>
                                        {errors.ContactPerson && (
                                            <p className="text-red-500 text-sm mt-1">{errors.ContactPerson}</p>
                                        )}
                                        <input
                                            type="text"
                                            name="ContactPerson"
                                            value={form.ContactPerson}
                                            onChange={handleChange}
                                            placeholder="Enter contact person's fullname..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address <span className='text-red-500'>*</span>
                                        </label>
                                        {errors.ContactPerson && (
                                            <p className="text-red-500 text-sm mt-1">{errors.ContactPerson}</p>
                                        )}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="ContactEmail"
                                                value={form.ContactEmail}
                                                onChange={handleChange}
                                                placeholder="Enter contact person's email..."
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            <BlueBtn
                                                label={cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Send OTP"}
                                                onClick={verifyEmail}
                                                disabled={cooldown > 0}
                                            />
                                        </div>
                                        {otpSentMessage && (
                                            <p style={{ color: "green", marginTop: "8px" }}>
                                                {otpSentMessage}
                                            </p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Verification Code <span className="text-red-500">*</span>
                                        </label>

                                        {errors.VerificationEmailCode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.VerificationEmailCode}</p>
                                        )}

                                        <input
                                            type="text"
                                            name="VerificationEmailCode"
                                            value={form.VerificationEmailCode}
                                            onChange={handleChange}
                                            placeholder="Enter email verification code..."
                                            className={`w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 
                                            ${isOtpValid === null
                                                    ? "border-gray-300 focus:ring-blue-500"
                                                    : isOtpValid
                                                        ? "border-green-500 focus:ring-green-500"
                                                        : "border-red-500 focus:ring-red-500"}`}
                                            maxLength={6}
                                        />

                                        {isOtpValid && (
                                            <CheckCircleIcon className="absolute right-3 top-[36px] h-5 w-5 text-green-500" />
                                        )}

                                        {isOtpValid === false && (
                                            <XCircleIcon className="absolute right-3 top-[36px] h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship <span className='text-red-500'>*</span></label>
                                        {errors.Relationship && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Relationship}</p>
                                        )}
                                        <input
                                            type="text"
                                            name="Relationship"
                                            value={form.Relationship}
                                            onChange={handleChange}
                                            placeholder="Enter contact person's relationship..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                        {step == 6 && (
                            <>
                                <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Province <span className='text-red-500'>*</span></label>
                                        {errors.ProvinceCode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.ProvinceCode}</p>
                                        )}
                                        <Listbox
                                            value={province.find(r => r.province_code === form.ProvinceCode) || null}
                                            onChange={(province) => {
                                                handleProvinceChange(province)
                                                setForm(prev => ({
                                                    ...prev,
                                                    ProvinceCode: province?.province_code || 0,
                                                    ProvinceName: province?.province_name || ""
                                                }))
                                            }}
                                        >
                                            <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                                {form.ProvinceCode
                                                    ? province.find(c => c.province_code === form.ProvinceCode)?.province_name
                                                    : "Select province"}
                                            </Listbox.Button>
                                            <Listbox.Options className="mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                                                {province.length > 0 ? (
                                                    province.map((province, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            value={province}
                                                            className={({ active }) =>
                                                                `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                                }`
                                                            }
                                                        >
                                                            {province.province_name}
                                                        </Listbox.Option>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No province found</div>
                                                )}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Choose City <span className='text-red-500'>*</span></label>
                                        {errors.CityCode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.CityCode}</p>
                                        )}
                                        <Listbox
                                            value={city.find(r => r.city_code === form.CityCode) || null}
                                            onChange={(city) => {
                                                handleCityChange(city)
                                                setForm(prev => ({
                                                    ...prev,
                                                    CityCode: city?.city_code || 0,
                                                    CityName: city?.city_name || ""
                                                }))
                                            }}
                                        >
                                            <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                                {form.CityCode
                                                    ? city.find(c => c.city_code === form.CityCode)?.city_name
                                                    : "Select city"}
                                            </Listbox.Button>
                                            <Listbox.Options className="mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                                                {city.length > 0 ? (
                                                    city.map((city, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            value={city}
                                                            className={({ active }) =>
                                                                `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                                }`
                                                            }
                                                        >
                                                            {city.city_name}
                                                        </Listbox.Option>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No city found</div>
                                                )}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Barangay <span className='text-red-500'>*</span></label>
                                        {errors.BrgyCode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.BrgyCode}</p>
                                        )}
                                        <Listbox
                                            value={barangay.find(r => r.brgy_code === form.BrgyCode) || null}
                                            onChange={(barangay) => {
                                                handleCityChange(barangay)
                                                setForm(prev => ({
                                                    ...prev,
                                                    BrgyCode: barangay?.brgy_code || 0,
                                                    BrgyName: barangay?.brgy_name || ""
                                                }))
                                            }}
                                        >
                                            <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                                {form.BrgyCode
                                                    ? barangay.find(c => c.brgy_code === form.BrgyCode)?.brgy_name
                                                    : "Select barangay"}
                                            </Listbox.Button>
                                            <Listbox.Options className="mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                                                {barangay.length > 0 ? (
                                                    barangay.map((barangay, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            value={barangay}
                                                            className={({ active }) =>
                                                                `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                                }`
                                                            }
                                                        >
                                                            {barangay.brgy_name}
                                                        </Listbox.Option>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-gray-500">No barangay found</div>
                                                )}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Home No | Street <span className='text-red-500'>*</span></label>
                                        <input
                                            type="text"
                                            name="HomeStreetAddress"
                                            value={form.HomeStreetAddress}
                                            onChange={handleChange}
                                            placeholder="Enter home or street number ex: (block 1 lot 1)"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                        {step == 7 && (
                            <>
                                <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                                    <div>
                                        <label className="text-base text-slate-900 font-medium mb-3 block">
                                            Upload Picture 2x2
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            onChange={(e) => handleFileChange(e, "TwoByTwo")}
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                                            file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                                            file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                                            file:text-slate-500 rounded"
                                        />
                                        {form.TwoByTwo && (
                                            <img
                                                src={URL.createObjectURL(form.TwoByTwo)}
                                                alt="2x2 Preview"
                                                className="w-32 h-32 object-cover mt-2"
                                            />
                                        )}
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>

                                    <div>
                                        <label className="text-base text-slate-900 font-medium mb-3 block">
                                            Upload Birth Certificate
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, application/pdf"
                                            onChange={(e) => handleFileChange(e, "BirthCert")}
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                                            file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                                            file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                                            file:text-slate-500 rounded"
                                        />
                                        {form.BirthCert && (
                                            <img
                                                src={URL.createObjectURL(form.BirthCert)}
                                                alt="Birth Certificate Preview"
                                                className="w-32 h-32 object-cover mt-2"
                                            />
                                        )}
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>

                                    <div>
                                        <label className="text-base text-slate-900 font-medium mb-3 block">
                                            Upload Baptismal
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, application/pdf"
                                            onChange={(e) => handleFileChange(e, "Baptismal")}
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                                            file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                                            file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                                            file:text-slate-500 rounded"
                                        />
                                        {form.Baptismal && (
                                            <img
                                                src={URL.createObjectURL(form.Baptismal)}
                                                alt="Baptismal Certificate Preview"
                                                className="w-32 h-32 object-cover mt-2"
                                            />
                                        )}
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>

                                    <div>
                                        <label className="text-base text-slate-900 font-medium mb-3 block">
                                            Upload Good Moral Certificate
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, application/pdf"
                                            onChange={(e) => handleFileChange(e, "GoodMoral")}
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                                            file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                                            file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                                            file:text-slate-500 rounded"
                                        />
                                        {form.GoodMoral && (
                                            <img
                                                src={URL.createObjectURL(form.GoodMoral)}
                                                alt="GoodMoral Certificate Preview"
                                                className="w-32 h-32 object-cover mt-2"
                                            />
                                        )}
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>

                                    <div>
                                        <label className="text-base text-slate-900 font-medium mb-3 block">
                                            Upload Current Report Card
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, application/pdf"
                                            onChange={(e) => handleFileChange(e, "ReportCard")}
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                                            file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                                            file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                                            file:text-slate-500 rounded"
                                        />
                                        {form.ReportCard && (
                                            <img
                                                src={URL.createObjectURL(form.ReportCard)}
                                                alt="ReportCard Preview"
                                                className="w-32 h-32 object-cover mt-2"
                                            />
                                        )}
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <RedBtn label="← Back" onClick={handleBack} />
                                    <GreenBtn label="Submit" onClick={handleModalTrigger} />
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
                        { label: "Yes", type: "green", onClick: handleSubmit },
                        { label: "No", type: "red", onClick: () => console.log("No clicked") },
                    ]}
                    backgroundImage="/assets/img/White-Background.png"
                />
            </div>
        </div>
    );
};
export default NewEnrollyComponent;