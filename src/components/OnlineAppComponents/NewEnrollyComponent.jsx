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
} from '../../states/OnlineApplicationState/Action';


const NewEnrollyComponent = () => {

    const dispatch = useDispatch();
    const campusState = useSelector((state) => state.online.campusState || {});
    const divisionState = useSelector((state) => state.online.divisionState || {});
    const levelState = useSelector((state) => state.online.levelState || {});
    const strandState = useSelector((state) => state.online.strandState || {});
    const nationalityState = useSelector((state) => state.online.nationalityState || {});
    const religionState = useSelector((state) => state.online.religionState || {});

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
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        birthDate: "",
        gender: "",
    });
    const [step, setStep] = useState(1);
    const stepTitle = {
        1: "Personal Information",
        2: "Campus Information",
        3: "Father's Information",
        4: "Mother's Information",
    };


    const handleNext = () => {
        setStep(step + 1);
    };
    const handleBack = () => {
        setStep(step - 1);
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
                                        name="firstName"
                                        value={form.firstName}
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
                                        name="middleName"
                                        value={form.middleName}
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
                                        name="lastName"
                                        value={form.lastName}
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
                                                checked={form.gender === "male"}
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
                                                checked={form.gender === "female"}
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
                                                checked={form.gender === "other"}
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
                                        name="birthDate"
                                        value={form.birthDate}
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

                                </div>
                                <RedBtn label="← Back" onClick={handleBack} />
                                <GreenBtn label="Next →" onClick={handleNext} />
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};
export default NewEnrollyComponent;