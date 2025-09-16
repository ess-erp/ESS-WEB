import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import OutlineGreenBtn from "../ButtonsComponents/OutlineGreenBtn";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox } from "@headlessui/react";
import { debounce } from "lodash";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import ListOfDocsTableComponent from "./ListOfDocsTableComponent";
import GPATableComponent from "./GPATableComponent";
import ExamSchedulerComponent from "./ExamSchedulerComponent";
import AppFormOthersComponent from "./AppFormOthersComponent";
import {
    fetchStudentByIdData
} from "../../states/AdmissionState/Action";
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
} from '../../states/OnlineApplicationState/Action';

const StudentAppFormComponent = () => {

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const dispatch = useDispatch();
    const studentDataState = useSelector((state) => state.admission.studentDataState || {});
    const studentData = studentDataState.data || [];
    const AppId = query.get("AppId");

    const campusState = useSelector((state) => state.online.campusState || {});
    const divisionState = useSelector((state) => state.online.divisionState || {});
    const levelState = useSelector((state) => state.online.levelState || {});
    const strandState = useSelector((state) => state.online.strandState || {});
    const nationalityState = useSelector((state) => state.online.nationalityState || {});
    const religionState = useSelector((state) => state.online.religionState || {});
    const provinceState = useSelector((state) => state.online.provinceState || {});
    const cityState = useSelector((state) => state.online.cityState || {});
    const barangayState = useSelector((state) => state.online.barangayState || {});
    const campuses = campusState.data || [];
    const [selectedCampus, setSelectedCampus] = useState(null);
    const divisions = divisionState.data || [];
    const [selectedDivision, setSelectedDivision] = useState(null);

    const [selectedLevel, setSelectedLevel] = useState(null);
    const levels = levelState.data || [];


    const [selectedStrand, setSelectedStrand] = useState(null);
    const strand = strandState.data || [];

    const nationality = nationalityState.data || [];
    const [selectedNationlity, setSelectedNationality] = useState(null);

    const religion = religionState.data || [];
    const [selectedReligion, setSelectedReligion] = useState(null);

    const province = provinceState.data || [];
    const [selectedProvince, setSelectedProvince] = useState(null);
    console.log(province);
    const city = cityState.data || [];
    const [selectedCity, setSelectedCity] = useState(null);

    console.log(city);

    const barangay = barangayState.data || [];
    const [selectedBarangay, setSelectedBarangay] = useState(null);

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


    const [formData, setFormData] = useState({});


    useEffect(() => {
        setFormData(studentData);
    }, [studentData]);

    // const handleChange = (e) => {
    //     const { id, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [id]: value }));
    // };
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    console.log(studentData);

    useEffect(() => {
        if (AppId) {
            dispatch(fetchStudentByIdData(AppId));
        }
    }, [dispatch, AppId]);

    console.log(studentData);
    console.log(formData);

    const [active, setActive] = useState("one");


    const btnBase =
        "w-full rounded-2xl py-2 px-4 text-sm font-medium shadow transition hover:shadow-md focus:outline-none focus:ring";


    const isActive = (key) =>
        active === key
            ? " bg-black text-white"
            : " bg-white text-black border";

    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = () => {
        setIsModalOpen(true);
        console.log(formData);
    };


    return (
        <>
            <div className="flex items-center mt-2">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Applicant Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                <div className="p-2">
                    <label
                        htmlFor="AppNumber"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Application Number</strong>
                    </label>
                    <input
                        type="text"
                        id="AppNumber"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Application Number"
                        value={formData.AppNumber || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>

                {/* LRN */}
                <div className="p-2">
                    <label
                        htmlFor="LRN"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>LRN</strong>
                    </label>
                    <input
                        type="text"
                        id="LRN"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="LRN"
                        value={formData.Lrn || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>

                {/* Toggle Button */}
                <div className="flex justify-end items-end p-2">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isEditing}
                            onChange={() => setIsEditing(!isEditing)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500
                        rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                        after:transition-all dark:border-gray-600 peer-checked:bg-green-600 relative" />
                        <span className="ml-3 text-sm font-medium text-gray-900">
                            {isEditing ? "Editing On" : "Editing Off"}
                        </span>
                    </label>
                </div>
                <div className="p-2">
                    <label
                        htmlFor="Fname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>First Name</strong>
                    </label>
                    <input
                        type="text"
                        id="Fname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="First name"
                        value={formData.Fname || ""}
                        readOnly={!isEditing}
                        // onChange={isEditing ? handleChange : undefined}
                        onInput={(e) => isEditing && handleChange(e.target.id, e.target.value)}
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="Mname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Middle Name</strong>
                    </label>
                    <input
                        type="text"
                        id="Mname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Middle name"
                        value={formData.Mname || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="Lname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Last Name</strong>
                    </label>
                    <input
                        type="text"
                        id="Lname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Last name"
                        value={formData.Lname || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>

                <div className="p-2">
                    {!isEditing && (
                        <>
                            <label
                                htmlFor="Lname"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                <strong>Campus</strong>
                            </label>
                            <input
                                type="text"
                                id="Lname"
                                className='shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-500 cursor-not-allowed'

                                placeholder="Last name"
                                value={formData.CampusName || ""}
                                readOnly
                            />
                        </>
                    )}
                    {isEditing && (
                        <>
                            <label
                                htmlFor="Lname"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                <strong>Campus</strong>
                            </label>
                            <Listbox
                                value={campuses.find(r => r.CampusId === formData.CampusId) || null}
                                onChange={(campus) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        CampusId: campus?.CampusId || 0
                                    }))
                                }
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-xs">
                                        {formData.CampusId
                                            ? campuses.find(c => c.CampusId === formData.CampusId)?.CampusName
                                            : "Select campus"}
                                    </Listbox.Button>

                                    <Listbox.Options
                                        className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50"
                                    >
                                        {campuses.length > 0 ? (
                                            campuses.map((campus, index) => (
                                                <Listbox.Option
                                                    key={index}
                                                    value={campus}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                        }`
                                                    }
                                                >
                                                    {campus.CampusName}
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No campuses found</div>
                                        )}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}
                </div>
                <div className="p-2">
                    {!isEditing && (
                        <>
                            <label
                                htmlFor="Division"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                <strong>Division</strong>
                            </label>
                            <input
                                type="text"
                                id="Division"
                                className='shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-500 cursor-not-allowed'
                                placeholder="Division"
                                value={formData.DivName || ""}
                                readOnly
                            />
                        </>
                    )}
                    {isEditing && (
                        <>
                            <label
                                htmlFor="Lname"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                <strong>Division</strong>
                            </label>
                            <Listbox
                                value={divisions.find(r => r.DivId === formData.DivId) || null}
                                onChange={(divisions) => {
                                    handleDivisionChange(divisions)
                                    setFormData(prev => ({
                                        ...prev,
                                        DivId: divisions?.DivId || 0
                                    }))
                                }}
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                        {formData.DivId
                                            ? divisions.find(c => c.DivId === formData.DivId)?.DivName
                                            : "Select division"}
                                    </Listbox.Button>

                                    <Listbox.Options
                                        className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50"
                                    >
                                        {divisions.length > 0 ? (
                                            divisions.map((division, index) => (
                                                <Listbox.Option
                                                    key={index}
                                                    value={division}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""
                                                        }`
                                                    }
                                                >
                                                    {division.DivName}
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No division found</div>
                                        )}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}
                </div>


                <div className="p-2">
                    {!isEditing && (
                        <>
                            <label
                                htmlFor="LevelName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                <strong>Level</strong>
                            </label>
                            <input
                                type="text"
                                id="LevelName"
                                className='shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-500 cursor-not-allowed'
                                placeholder="Level Name"
                                value={formData.LevelName || ""}
                                readOnly
                            />
                        </>
                    )}
                    {isEditing && (
                        <>
                            <label
                                htmlFor="Lname"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                <strong>Level</strong>
                            </label>
                            <Listbox
                                value={levels.find(r => r.LevelId === formData.LevelId) || null}
                                onChange={(level) => {
                                    handleLevelChange(level); // if you need extra logic
                                    setFormData(prev => ({
                                        ...prev,
                                        LevelId: level?.LevelId || 0,
                                        LevelName: level?.LevelName || "" // keep name in sync
                                    }));
                                }}
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                        {formData.LevelId
                                            ? formData.LevelName
                                            : "Select level"}
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                        {levels.length > 0 ? (
                                            levels.map((level) => (
                                                <Listbox.Option
                                                    key={level.LevelId}
                                                    value={level}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                    }
                                                >
                                                    {level.LevelName}
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No level found</div>
                                        )}
                                    </Listbox.Options>
                                </div>
                            </Listbox>

                        </>
                    )}
                </div>
                {formData.LevelId === 15 && (
                    <div className="p-2">
                        <label
                            htmlFor="StrandName"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            <strong>Strand</strong>
                        </label>
                        {!isEditing && (
                            <>
                                <input
                                    type="text"
                                    id="StrandName"
                                    className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                            : "bg-white border-gray-300 text-gray-900"
                                        }`}
                                    placeholder="Strand Name"
                                    value={formData.StrandName || ""}
                                    readOnly
                                />
                            </>
                        )}
                        {isEditing && (
                            <>
                                <Listbox
                                    value={strand.find(r => r.StrandId === formData.StrandId) || null}
                                    onChange={(selectedStrand) => {
                                        handleLevelChange(selectedStrand);
                                        setFormData(prev => ({
                                            ...prev,
                                            StrandId: selectedStrand?.StrandId || 0,
                                            StrandName: selectedStrand?.StrandName || ""
                                        }));
                                    }}
                                >
                                    <div className="relative">
                                        <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                            {formData.StrandId
                                                ? formData.StrandName
                                                : "Select strand"}
                                        </Listbox.Button>

                                        <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                            {strand.length > 0 ? (
                                                strand.map((s) => (
                                                    <Listbox.Option
                                                        key={s.StrandId}
                                                        value={s}
                                                        className={({ active }) =>
                                                            `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                        }
                                                    >
                                                        {s.StrandName}
                                                    </Listbox.Option>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-gray-500">No strand found</div>
                                            )}
                                        </Listbox.Options>
                                    </div>
                                </Listbox>

                            </>
                        )}

                    </div>
                )}
                <div className="p-2">
                    <label
                        htmlFor="NationalityName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Nationality</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="NationalityName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                placeholder="Nationality Name"
                                value={formData.NationalityName || ""}
                                readOnly
                            />
                        </>
                    )}
                    {isEditing && (
                        <>
                            <Listbox
                                value={nationality.find(r => r.NationalityId === formData.NationalityId) || null}
                                onChange={(selectedNationality) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        NationalityId: selectedNationality?.NationalityId || 0,
                                        NationalityName: selectedNationality?.NationalityName || ""
                                    }));
                                }}
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                        {formData.NationalityId
                                            ? formData.NationalityName
                                            : "Select nationality"}
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                        {nationality.length > 0 ? (
                                            nationality.map((n) => (
                                                <Listbox.Option
                                                    key={n.NationalityId}
                                                    value={n}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                    }
                                                >
                                                    {n.NationalityName}
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No nationality found</div>
                                        )}
                                    </Listbox.Options>
                                </div>
                            </Listbox>

                        </>
                    )}

                </div>

                <div className="p-2">
                    <label
                        htmlFor="ReligionName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Religion</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="ReligionName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                placeholder="Religion name"
                                value={formData.ReligionName || ""}
                                readOnly
                            />
                        </>
                    )}
                    {isEditing && (
                        <>
                            <Listbox
                                value={religion.find(r => r.ReligionId === formData.ReligionId) || null}
                                onChange={(selectedReligion) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        ReligionId: selectedReligion?.ReligionId || 0,
                                        ReligionName: selectedReligion?.ReligionName || ""
                                    }));
                                }}
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                        {formData.ReligionId
                                            ? formData.ReligionName
                                            : "Select nationality"}
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                        {religion.length > 0 ? (
                                            religion.map((n) => (
                                                <Listbox.Option
                                                    key={n.ReligionId}
                                                    value={n}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                    }
                                                >
                                                    {n.ReligionName}
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No religion found</div>
                                        )}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}

                </div>
                <div className="p-2">
                    <label
                        htmlFor="DateOfBirth"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Date of birth</strong>
                    </label>
                    <input
                        type="text"
                        id="DateOfBirth"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Date of birth"
                        value={formData.DateOfBirth ? formData.DateOfBirth.split("T")[0] : ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="ProvinceName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Province</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="ProvinceName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                placeholder="Province Name"
                                value={formData.ProvinceName || ""}
                                readOnly
                            />
                        </>
                    )}
                    {isEditing && (
                        <>
                            <Listbox
                                value={province.find(r => r.province_code === formData.ProvinceCode) || null}
                                onChange={(selectedProvince) => {
                                    handleProvinceChange(selectedProvince);
                                    setFormData(prev => ({
                                        ...prev,
                                        ProvinceCode: selectedProvince?.province_code || "",
                                        ProvinceName: selectedProvince?.province_name || ""
                                    }));
                                }}
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                        {formData.ProvinceCode
                                            ? province.find(c => c.province_code === formData.ProvinceCode)?.province_name
                                            : "Select province"}
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                        {province.length > 0 ? (
                                            province.map((p, index) => (
                                                <Listbox.Option
                                                    key={`${p.province_code}-${index}`}
                                                    value={p}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                    }
                                                >
                                                    {p.province_name}
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No province found</div>
                                        )}
                                    </Listbox.Options>
                                </div>
                            </Listbox>

                        </>
                    )}

                </div>
                <div className="p-2">
                    <label
                        htmlFor="CityName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>City</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="CityName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                placeholder="City Name"
                                value={formData.CityName || ""}
                                readOnly={!isEditing}
                                onChange={isEditing ? handleChange : undefined}
                            />
                        </>
                    )}
                    {isEditing && (
                        <>
                            <Listbox
                                value={city.find(r => r.city_code === formData.CityCode) || null}
                                onChange={(selectedCity) => {
                                    handleCityChange(selectedCity);
                                    setFormData(prev => ({
                                        ...prev,
                                        CityCode: selectedCity?.city_code || "",
                                        CityName: selectedCity?.city_name || ""
                                    }));
                                }}
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                        {formData.CityCode
                                            ? formData.CityName
                                            : "Select city"}
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                        {city.length > 0 ? (
                                            city.map((p, index) => (
                                                <Listbox.Option
                                                    key={`${p.city_code}-${index}`}
                                                    value={p}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                    }
                                                >
                                                    {p.city_name}
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No city found</div>
                                        )}
                                    </Listbox.Options>
                                </div>
                            </Listbox>

                        </>
                    )}
                </div>
                <div className="p-2">
                    <label
                        htmlFor="BrgyName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Barangay</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="BrgyName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                placeholder="Barangay name"
                                value={formData.BrgyName || ""}
                                readOnly
                            />
                        </>
                    )}

                    {isEditing && (
                        <>
                            <Listbox
                                value={barangay.find(r => r.brgy_code === formData.BrgyCode) || null}
                                onChange={(selectedBarangay) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        BrgyCode: selectedBarangay?.brgy_code || "",
                                        BrgyName: selectedBarangay?.brgy_name || ""
                                    }));
                                }}
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full border rounded-md px-3 py-2 text-left bg-white shadow-sm">
                                        {formData.BrgyCode
                                            ? formData.BrgyName
                                            : "Select barangay"}
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 w-full border rounded-md bg-white shadow-lg max-h-60 overflow-auto z-50">
                                        {city.length > 0 ? (
                                            city.map((p, index) => (
                                                <Listbox.Option
                                                    key={`${p.brgy_code}-${index}`}
                                                    value={p}
                                                    className={({ active }) =>
                                                        `px-3 py-2 cursor-pointer ${active ? "bg-green-100 text-green-900" : ""}`
                                                    }
                                                >
                                                    {p.brgy_name}
                                                </Listbox.Option>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No barangay found</div>
                                        )}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}

                </div>
                <div className="p-2">
                    <label
                        htmlFor="HomeStreetAddress"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Home No | Street</strong>
                    </label>
                    <input
                        type="text"
                        id="HomeStreetAddress"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Home No | Street"
                        value={formData.HomeStreetAddress || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
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
                <div className="p-2">
                    <label
                        htmlFor="Fname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>First Name</strong>
                    </label>
                    <input
                        type="text"
                        id="Fname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="First name"
                        value={formData.FathersFname || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="Mname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Middle Name</strong>
                    </label>
                    <input
                        type="text"
                        id="Mname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Middle name"
                        value={formData.FathersMname || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="Lname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Last Name</strong>
                    </label>
                    <input
                        type="text"
                        id="Lname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Last name"
                        value={formData.FathersLname || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="Email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Email</strong>
                    </label>
                    <input
                        type="text"
                        id="Email"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Email"
                        value={formData.FathersEmail || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="MobilePhoneNumber"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Mobile Phone Number</strong>
                    </label>
                    <input
                        type="text"
                        id="MobilePhoneNumber"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Mobile phone number"
                        value={formData.FathersMobileNo || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="Occupation"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Occupation</strong>
                    </label>
                    <input
                        type="text"
                        id="Occupation"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Occupation"
                        value={formData.FathersOccupation || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
            </div>
            <div className="flex items-center pt-4">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
                    i
                </div>

                <h2 className="text-l font-bold text-green-700 whitespace-nowrap">
                    Mother's Maiden Information
                </h2>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="p-2">
                    <label
                        htmlFor="Fname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>First Name</strong>
                    </label>
                    <input
                        type="text"
                        id="Fname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="First name"
                        value={formData.MothersFname || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="Mname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Middle Name</strong>
                    </label>
                    <input
                        type="text"
                        id="Mname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Middle name"
                        value={formData.MothersMname || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="Lname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Last Name</strong>
                    </label>
                    <input
                        type="text"
                        id="Lname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Last name"
                        value={formData.MothersLname || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="Email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Email</strong>
                    </label>
                    <input
                        type="text"
                        id="Email"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Email"
                        value={formData.MothersEmail || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="MobilePhoneNumber"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Mobile Phone Number</strong>
                    </label>
                    <input
                        type="text"
                        id="MobilePhoneNumber"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Mobile phone number"
                        value={formData.MothersMobileNo || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="Occupation"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Occupation</strong>
                    </label>
                    <input
                        type="text"
                        id="Occupation"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Occupation"
                        value={formData.MothersOccupation || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
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

                <div className="p-2">
                    <label
                        htmlFor="Fullname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Fullname</strong>
                    </label>
                    <input
                        type="text"
                        id="Fullname"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Fullname"
                        value={formData.ContactPerson || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="Email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Email</strong>
                    </label>
                    <input
                        type="text"
                        id="Email"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Email"
                        value={formData.ContactEmail || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="Relationship"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Relationship</strong>
                    </label>
                    <input
                        type="text"
                        id="Relationship"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                            focus:ring-blue-500 focus:border-blue-500
                            ${!isEditing
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                        placeholder="Relationship"
                        value={formData.Relationship || ""}
                        readOnly={!isEditing}
                        onChange={isEditing ? handleChange : undefined}
                    />
                </div>
            </div>
            {isEditing && (
                <div className="flex justify-end items-end pt-2">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-800 transition"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            )}
            <div className="flex items-center pt-4">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Other Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-6 pt-4">
                <OutlineGreenBtn label="List of Documents" onClick={() => setActive("one")} />
                <OutlineGreenBtn label="Grade Point Average" onClick={() => setActive("two")} />
                <OutlineGreenBtn label="Examination Scheduler" onClick={() => setActive("three")} />
                <OutlineGreenBtn label="Others" onClick={() => setActive("four")} />
            </div>

            {/* Panels with sliding animation */}
            <div className="relative min-h-[150px]"> {/* min-h ensures smooth height */}
                <AnimatePresence mode="wait">
                    {active === "one" && (
                        <motion.div
                            key="one"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-full bg-white p-6 shadow rounded-lg"
                        >
                            <ListOfDocsTableComponent studentId={formData.StudentId} />

                        </motion.div>
                    )}

                    {active === "two" && (
                        <motion.div
                            key="two"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-full bg-white p-6 shadow rounded-lg"
                        >
                            <GPATableComponent divId={formData.DivId} studentId={formData.StudentId} />
                        </motion.div>
                    )}

                    {active === "three" && (
                        <motion.div
                            key="three"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-full bg-white p-6 shadow rounded-lg"
                        >
                            <ExamSchedulerComponent studentId={formData.StudentId} levelId={formData.LevelId} />
                        </motion.div>
                    )}

                    {active === "four" && (
                        <motion.div
                            key="four"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-full bg-white p-6 shadow rounded-lg"
                        >
                            <AppFormOthersComponent studentId={formData.StudentId} />
                        </motion.div>
                    )}
                </AnimatePresence>
                <ModalComponent
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={<span className="font-bold text-lg text-red-700">Warning</span>}
                    body="Are you sure you want to submit?"
                    buttons={[
                        { label: "Yes", type: "green", onClick: handleSubmit },
                        { label: "No", type: "red" },
                    ]}
                />
            </div>
        </>
    );
};

export default StudentAppFormComponent;