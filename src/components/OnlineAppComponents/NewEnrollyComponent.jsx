import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BlueBtn from '../../components/ButtonsComponents/BlueBtn';
import RedBtn from '../ButtonsComponents/RedBtn';
import GreenBtn from '../ButtonsComponents/GreenBtn';
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
    fetchCampusData,
    fetchDivisionData,
    fetchLevelData,
    fetchStrandData,
    fetchNationalityData,
    fetchReligionData,
    fetchOtpCodeData,
} from '../../states/OnlineApplicationState/Action';


const NewEnrollyComponent = () => {

    const dispatch = useDispatch();
    const campusState = useSelector((state) => state.online.campusState || {});
    const divisionState = useSelector((state) => state.online.divisionState || {});
    const levelState = useSelector((state) => state.online.levelState || {});
    const strandState = useSelector((state) => state.online.strandState || {});
    const nationalityState = useSelector((state) => state.online.nationalityState || {});
    const religionState = useSelector((state) => state.online.religionState || {});
    const otpcodeState = useSelector((state) => state.online.otpcodeState);

    const campuses = campusState.data || [];
    const [selectedCampus, setSelectedCampus] = useState(null);


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

    useEffect(() => {
        dispatch(fetchCampusData());
        dispatch(fetchDivisionData());
        dispatch(fetchNationalityData());
        dispatch(fetchReligionData());
    }, [dispatch]);

    const handleDivisionChange = (division) => {
        setSelectedDivision(division);
        console.log(division);

    };

    const handleLevelChange = (level) => {
        setSelectedLevel(level);
        console.log(level);

    }
    useEffect(() => {
        if (selectedDivision && selectedDivision.DivId) {
            dispatch(fetchLevelData(selectedDivision.DivId));
        }

        if (selectedLevel && selectedLevel.LevelId === 15) {
            dispatch(fetchStrandData(selectedLevel.LevelId));
        }
    }, [selectedDivision, selectedLevel, dispatch]);


    const [form, setForm] = useState({
        Fname: "",
        Mname: "",
        Lname: "",
        Email: "",
        DateOfBirth: "",
        Gender: "",
        CampusId: "",
        DivId: "",
        LevelId: "",
        StrandId: "",
        NationalityId: "",
        ReligionId: "",
        FathersFname: "",
        FathersMname: "",
        FathersLname: "",
        FathersOccupation: "",
        FathersEmail: "",
        FathersMobileNo: "",
        MothersFname: "",
        MothersMname: "",
        MothersLname: "",
        MothersOccupation: "",
        MothersMobileNo: "",
        ContactPerson: "",
        ContactEmail: "",
        VerificationEmailCode: "",
        Relationship: "",
        Street: "",
        Brgy: "",
        Municipality: "",
        Province: "",
        ZipCode: "",
    });
    const [triggerVerify, setTriggerVerify] = useState(false);
    const [otpSentMessage, setOtpSentMessage] = useState("");
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const verifyEmail = () => {
        setTriggerVerify(true);
    };
    const [step, setStep] = useState(1);
    const stepTitle = {
        1: "Personal Information",
        2: "Campus Information",
        3: "Father's Information",
        4: "Mother's Maiden Information",
        5: "Contact Person's Information",
        6: "Address Information",
        7: "File Attachment"
    };

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get first selected file
        if (file) {
            setSelectedFile(file);
            console.log("Selected file:", file.name, file.size, "bytes");
        }
    };
    const handleNext = () => {
        setStep(step + 1);
    };
    const handleBack = () => {
        setStep(step - 1);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registration Data:", form);
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
                            Join us and be part of our amazing community. Enroll your child by using this Online Application.
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
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
                                        Gender
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
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
                                                name="gender"
                                                value="female"
                                                checked={form.Gender === "female"}
                                                onChange={handleChange}
                                                className="text-blue-500 focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-gray-700">Female</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="other"
                                                checked={form.Gender === "other"}
                                                onChange={handleChange}
                                                className="text-blue-500 focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-gray-700">Other</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="DateOfBirth"
                                        value={form.DateOfBirth}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Campus</label>
                                    <Listbox value={selectedCampus} onChange={setSelectedCampus}>
                                        <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                            {selectedCampus?.CampusName || "Select campus"}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Division</label>
                                    <Listbox value={selectedDivision} onChange={handleDivisionChange}>
                                        <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                            {selectedDivision ? selectedDivision.DivName : "Select division"}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Level</label>
                                    <Listbox value={selectedLevel} onChange={handleLevelChange}>
                                        <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                            {selectedLevel ? selectedLevel.LevelName : "Select level"}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Nationality</label>
                                    <Listbox value={selectedNationlity} onChange={setSelectedNationality}>
                                        <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                            {selectedNationlity ? selectedNationlity.NationalityName : "Select nationality"}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Religion</label>
                                    <Listbox value={selectedReligion} onChange={setSelectedReligion}>
                                        <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                            {selectedReligion ? selectedReligion.ReligionName : "Select religion"}
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
                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                        {step === 3 && (
                            <>
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
                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                        {step === 4 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
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
                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                        {step === 5 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Fullname</label>
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
                                        Email Address
                                    </label>
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
                                        <BlueBtn label="Verify" onClick={verifyEmail} />
                                    </div>
                                    {otpSentMessage && (
                                        <p style={{ color: "green", marginTop: "8px" }}>
                                            {otpSentMessage}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Verification Code</label>
                                    <input
                                        type="text"
                                        name="VerificationEmailCode"
                                        value={form.VerificationEmailCode}
                                        onChange={handleChange}
                                        placeholder="Enter contact person's email verification code..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
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
                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                        {step == 6 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Province</label>
                                    <Listbox value={selectedReligion} onChange={setSelectedReligion}>
                                        <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                            {selectedReligion ? selectedReligion.ReligionName : "Select province"}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Municipality</label>
                                    <Listbox value={selectedReligion} onChange={setSelectedReligion}>
                                        <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                            {selectedReligion ? selectedReligion.ReligionName : "Select municipality"}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose Barangay</label>
                                    <Listbox value={selectedReligion} onChange={setSelectedReligion}>
                                        <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                            {selectedReligion ? selectedReligion.ReligionName : "Select barangay"}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Home No | Street</label>
                                    <input
                                        type="text"
                                        name="Relationship"
                                        value={form.Relationship}
                                        onChange={handleChange}
                                        placeholder="Enter home or street number ex: (block 1 lot 1)"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
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
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                   file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                   file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                   file:text-slate-500 rounded"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>

                                    <div>
                                        <label className="text-base text-slate-900 font-medium mb-3 block">
                                            Upload Birth Certificate
                                        </label>
                                        <input
                                            type="file"
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                   file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                   file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                   file:text-slate-500 rounded"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>

                                    <div>
                                        <label className="text-base text-slate-900 font-medium mb-3 block">
                                            Upload Baptismal
                                        </label>
                                        <input
                                            type="file"
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                   file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                   file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                   file:text-slate-500 rounded"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>

                                    <div>
                                        <label className="text-base text-slate-900 font-medium mb-3 block">
                                            Upload Good Moral Certificate
                                        </label>
                                        <input
                                            type="file"
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                   file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                   file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                   file:text-slate-500 rounded"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>

                                    <div>
                                        <label className="text-base text-slate-900 font-medium mb-3 block">
                                            Upload Current Report Card
                                        </label>
                                        <input
                                            type="file"
                                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                   file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                   file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                   file:text-slate-500 rounded"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">PNG and JPG are Allowed.</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <RedBtn label="← Back" onClick={handleBack} />
                                    <GreenBtn label="Submit" onClick={handleNext} />
                                </div>
                            </>

                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};
export default NewEnrollyComponent;