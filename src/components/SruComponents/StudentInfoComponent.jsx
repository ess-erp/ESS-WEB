import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
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
import {
    fetchStudentInfoData,
} from "../../states/SruState/Action";
import { div } from "framer-motion/client";

const StudentInfoComponent = ({ isEditing, studentId }) => {

    const dispatch = useDispatch();
    //Start of get the student data
    useEffect(() => {
        dispatch(fetchStudentInfoData(studentId));
    }, [studentId]);

    const studentDataState = useSelector((state) => state.sru.studentDataState || {});
    const studentData = studentDataState.data || [];

    //end of student data

    //for form
    const [studentNumber, setStudentNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [campusId, setCampusId] = useState("");
    const [divId, setDivId] = useState("");
    const [levelId, setLevelId] = useState("");
    const [strandId, setStrandId] = useState("");
    const [nationalityId, setNationalityId] = useState("");
    const [religionId, setReligionId] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [provinceCode, setProvinceCode] = useState("");
    const [cityCode, setCityCode] = useState("");
    const [brgyCode, setBrgyCode] = useState("");
    const [homeStreet, setHomeStreet] = useState("");

    useEffect(() => {
        if (isEditing) {
            setStudentNumber(studentData.StudentNumber || "");
            setFirstName(studentData.Fname || "");
            setMiddleName(studentData.Mname || "");
            setLastName(studentData.Lname || "");
            const campusObj = campusList.find(c => c.CampusName === studentData.CampusName);
            setCampusId(campusObj);
            const divObj = divisionList.find(c => c.DivName === studentData.DivName);
            setDivId(divObj);
            const levelObj = levelList.find(c => c.LevelName === studentData.LevelName);
            setLevelId(levelObj);
            const strandObj = strandList.find(c => c.StrandName === studentData.StrandName);
            setStrandId(strandObj);
            const nationalityObj = nationalityList.find(c => c.NationalityName === studentData.NationalityName);
            setNationalityId(nationalityObj);
            const religionObj = religionList.find(c => c.ReligionName === studentData.ReligionName);
            setReligionId(religionObj);
            setDateOfBirth(studentData.DateOfBirth || "");
            const provObj = provinceList.find(c => c.province_name === studentData.ProvinceName);
            setProvinceCode(provObj);
            const cityObj = cityList.find(c => c.city_name === studentData.CityName);
            setCityCode(cityObj);
            const brgyObj = brgyList.find(c => c.brgy_name === studentData.BrgyName);
            setBrgyCode(brgyObj);
            setHomeStreet(studentData.HomeStreet || "");
        }
    }, [isEditing,
        studentData.StudentNumber,
        studentData.Fname,
        studentData.Mname,
        studentData.Lname,
        studentData.CampusName,
        studentData.DivName,
        studentData.LevelName,
        studentData.StrandName,
        studentData.NationalityName,
        studentData.ReligionName,
        studentData.DateOfBirth,
        studentData.ProvinceName,
        studentData.CityName,
        studentData.BrgyName,
        studentData.HomeStreet,
    ]);

    //dropdown data
    useEffect(() => {
        dispatch(fetchCampusData());
        dispatch(fetchDivisionData());
        dispatch(fetchNationalityData());
        dispatch(fetchReligionData());
        dispatch(fetchProvinceData());
    }, [dispatch]);


    const handleLevel = (divId) => {
        dispatch(fetchLevelData(divId.DivId));
    };

    const handleStrand = (levelId) => {
        dispatch(fetchStrandData(levelId.LevelId));
    };

    const handleCity = (provinceCode) => {
        dispatch(fetchCityData(provinceCode.ProvinceCode));
    };

    const handleBrgy = (cityCode) => {
        dispatch(fetchBarangayData(cityCode.CityCode));
    };

    //selector and state from reducer
    const campusState = useSelector((state) => state.online.campusState || {});
    const campusList = campusState.data || [];
    const divisionState = useSelector((state) => state.online.divisionState || {});
    const divisionList = divisionState.data || [];
    const levelState = useSelector((state) => state.online.levelState || {});
    const levelList = levelState.data || [];
    const strandState = useSelector((state) => state.online.strandState || {});
    const strandList = strandState.data || [];
    const nationalityState = useSelector((state) => state.online.nationalityState || {});
    const nationalityList = nationalityState.data || [];
    const religionState = useSelector((state) => state.online.religionState || {});
    const religionList = religionState.data || [];
    const provinceState = useSelector((state) => state.online.provinceState || {});
    const provinceList = provinceState.data || [];
    const cityState = useSelector((state) => state.online.cityState || {});
    const cityList = cityState.data || [];
    const brgyState = useSelector((state) => state.online.brgyState || {});
    const brgyList = brgyState.data || [];


    console.log(provinceList);
    console.log(cityList);
    console.log(brgyList);

    //use effect to show the default
    // useEffect(() => {
    //     if (campusList.length > 0 && !campusId) {
    //         setCampusId(studentData.CampusName); // first item as default
    //     }
    // }, [campusList, campusId]);
    console.log(levelId);

    console.log(studentData);
    console.log(studentNumber);

    return (
        <div>
            <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                <div className="p-2">
                    <label htmlFor="StudentNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Student Number</strong>
                    </label>
                    <input
                        type="text"
                        id="StudentNumber"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                        focus:ring-blue-500 focus:border-blue-500
                        ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                        placeholder="Student Number"
                        value={isEditing ? studentNumber : studentData.StudentNumber || studentNumber}
                        readOnly={!isEditing}
                        onChange={isEditing ? (e) => setStudentNumber(e.target.value) : undefined}
                    />
                </div>

                <div className="p-2">
                    <label htmlFor="LRN" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>LRN</strong>
                    </label>
                    <input
                        type="text"
                        id="LRN"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                        focus:ring-blue-500 focus:border-blue-500
                        ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                        placeholder="LRN"
                        value={isEditing ? studentNumber : studentData.StudentNumber || studentNumber}
                        readOnly={!isEditing}
                        onChange={isEditing ? (e) => setLrn(e.target.value) : undefined}
                    />
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                <div className="p-2">
                    <label htmlFor="FirstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>First Name</strong>
                    </label>
                    <input
                        type="text"
                        id="FirstName"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                        focus:ring-blue-500 focus:border-blue-500
                        ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                        placeholder="First Name"
                        value={isEditing ? firstName : studentData.Fname || firstName}
                        readOnly={!isEditing}
                        onChange={isEditing ? (e) => setFirstName(e.target.value) : undefined}
                    />
                </div>

                <div className="p-2">
                    <label htmlFor="MiddleName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Middle Name</strong>
                    </label>
                    <input
                        type="text"
                        id="MiddleName"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                        focus:ring-blue-500 focus:border-blue-500
                        ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                        placeholder="Middle Name"
                        value={isEditing ? middleName : studentData.Mname || middleName}
                        readOnly={!isEditing}
                        onChange={isEditing ? (e) => setMiddleName(e.target.value) : undefined}
                    />
                </div>
                <div className="p-2">
                    <label htmlFor="LastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Last Name</strong>
                    </label>
                    <input
                        type="text"
                        id="LastName"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                        focus:ring-blue-500 focus:border-blue-500
                        ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                        placeholder="Last Name"
                        value={isEditing ? lastName : studentData.Lname || lastName}
                        readOnly={!isEditing}
                        onChange={isEditing ? (e) => setLastName(e.target.value) : undefined}
                    />
                </div>
                <div className="p-2">
                    <label htmlFor="CampusName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Campus</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="CampusName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500
                                ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                                placeholder="Campus"
                                value={studentData.CampusName || ""}
                                readOnly={!isEditing}
                            // onChange={isEditing ? (e) => setCampusName(e.target.value) : undefined}
                            />
                        </>
                    )}

                    {isEditing && (
                        <>
                            <Listbox value={campusId} onChange={setCampusId}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <span className="block truncate">
                                            {campusId ? campusId.CampusName : "Select campus"}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {campusList.map((campus) => (
                                            <Listbox.Option
                                                key={campus.CampusId}
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                    }`
                                                }
                                                value={campus}
                                            >
                                                {({ selected1 }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected1 ? "font-medium" : "font-normal"
                                                                }`}
                                                        >
                                                            {campus.CampusName}
                                                        </span>
                                                        {selected1 && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                <CheckIcon className="h-5 w-5" />
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}
                </div>
                <div className="p-2">
                    <label htmlFor="DivName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Division</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="DivName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500
                                ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                                placeholder="Division"
                                value={studentData.DivName || ""}
                                readOnly={!isEditing}
                            // onChange={isEditing ? (e) => setCampusName(e.target.value) : undefined}
                            />
                        </>
                    )}

                    {isEditing && (
                        <>
                            <Listbox value={divId} onChange={(divId) => { setDivId(divId); handleLevel(divId); }}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <span className="block truncate">
                                            {divId ? divId.DivName : "Select division"}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {divisionList.map((division) => (
                                            <Listbox.Option
                                                key={division.DivId}
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                    }`
                                                }
                                                value={division}
                                            >
                                                {({ selected2 }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected2 ? "font-medium" : "font-normal"
                                                                }`}
                                                        >
                                                            {division.DivName}
                                                        </span>
                                                        {selected2 && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                <CheckIcon className="h-5 w-5" />
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}
                </div>
                <div className="p-2">
                    <label htmlFor="LevelName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Level</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="LevelName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500
                                ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                                placeholder="Division"
                                value={studentData.LevelName || ""}
                                readOnly={!isEditing}
                            // onChange={isEditing ? (e) => setCampusName(e.target.value) : undefined}
                            />
                        </>
                    )}

                    {isEditing && (
                        <>
                            <Listbox value={levelId} onChange={(levelId) => { setLevelId(levelId); handleStrand(levelId); }}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <span className="block truncate">
                                            {levelId ? levelId.LevelName : "Select Level"}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {levelList.length > 0 ? (
                                            levelList.map((level) => (
                                                <Listbox.Option
                                                    key={level.LevelId}
                                                    className={({ active }) =>
                                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                        }`
                                                    }
                                                    value={level}
                                                >
                                                    {({ selected3 }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected3 ? "font-medium" : "font-normal"
                                                                    }`}
                                                            >
                                                                {level.LevelName}
                                                            </span>
                                                            {selected3 && (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                    <CheckIcon className="h-5 w-5" />
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
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
                {strandList.length > 0 && (
                    levelId.LevelId === 15 && (
                        <div className="p-2">
                            <label htmlFor="StrandName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                <strong>Level</strong>
                            </label>
                            {!isEditing && (
                                <>
                                    <input
                                        type="text"
                                        id="StrandName"
                                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                                    focus:ring-blue-500 focus:border-blue-500
                                    ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                                        placeholder="Strand"
                                        value={studentData.StrandName || ""}
                                        readOnly={!isEditing}
                                    // onChange={isEditing ? (e) => setCampusName(e.target.value) : undefined}
                                    />
                                </>
                            )}

                            {isEditing && (
                                <>
                                    <Listbox value={strandId} onChange={setStrandId}>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                                <span className="block truncate">
                                                    {strandId ? strandId.StrandName : "Select strand"}
                                                </span>
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                                </span>
                                            </Listbox.Button>

                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {strandList.length > 0 ? (
                                                    strandList.map((strand) => (
                                                        <Listbox.Option
                                                            key={strand.StrandId}
                                                            className={({ active }) =>
                                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                                }`
                                                            }
                                                            value={strand}
                                                        >
                                                            {({ selected4 }) => (
                                                                <>
                                                                    <span
                                                                        className={`block truncate ${selected4 ? "font-medium" : "font-normal"
                                                                            }`}
                                                                    >
                                                                        {strand.StrandName}
                                                                    </span>
                                                                    {selected4 && (
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                            <CheckIcon className="h-5 w-5" />
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
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
                    )
                )}
                <div className="p-2">
                    <label htmlFor="NationalityName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Nationality</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="NationalityName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500
                                ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                                placeholder="Nationality"
                                value={studentData.NationalityName || ""}
                                readOnly={!isEditing}
                            // onChange={isEditing ? (e) => setCampusName(e.target.value) : undefined}
                            />
                        </>
                    )}

                    {isEditing && (
                        <>
                            <Listbox value={nationalityId} onChange={setNationalityId}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <span className="block truncate">
                                            {nationalityId ? nationalityId.NationalityName : "Select nationality"}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {nationalityList.map((nationality) => (
                                            <Listbox.Option
                                                key={nationality.NationalityId}
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                    }`
                                                }
                                                value={nationality}
                                            >
                                                {({ selected1 }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected1 ? "font-medium" : "font-normal"
                                                                }`}
                                                        >
                                                            {nationality.NationalityName}
                                                        </span>
                                                        {selected1 && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                <CheckIcon className="h-5 w-5" />
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}
                </div>
                <div className="p-2">
                    <label htmlFor="ReligionName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Religion</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="ReligionName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500
                                ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                                placeholder="Religion"
                                value={studentData.ReligionName || ""}
                                readOnly={!isEditing}
                            // onChange={isEditing ? (e) => setCampusName(e.target.value) : undefined}
                            />
                        </>
                    )}

                    {isEditing && (
                        <>
                            <Listbox value={religionId} onChange={setReligionId}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <span className="block truncate">
                                            {religionId ? religionId.ReligionName : "Select religion"}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {religionList.map((religion) => (
                                            <Listbox.Option
                                                key={religion.ReligionId}
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                    }`
                                                }
                                                value={religion}
                                            >
                                                {({ selected1 }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected1 ? "font-medium" : "font-normal"
                                                                }`}
                                                        >
                                                            {religion.ReligionName}
                                                        </span>
                                                        {selected1 && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                <CheckIcon className="h-5 w-5" />
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}
                </div>
                <div className="p-2">
                    <label htmlFor="DateOfBirth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Date of Birth</strong>
                    </label>
                    <input
                        type="text"
                        id="DateOfBirth"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                        focus:ring-blue-500 focus:border-blue-500
                        ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                        placeholder="Date of Birth"
                        value={isEditing ? dateOfBirth : studentData.DateOfBirth || dateOfBirth}
                        readOnly={!isEditing}
                        onChange={isEditing ? (e) => setDateOfBirth(e.target.value) : undefined}
                    />
                </div>
                <div className="p-2">
                    <label htmlFor="ProvinceName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Province</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="ProvinceName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500
                                ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                                placeholder="Province"
                                value={studentData.ProvinceName || ""}
                                readOnly={!isEditing}
                            // onChange={isEditing ? (e) => setCampusName(e.target.value) : undefined}
                            />
                        </>
                    )}

                    {isEditing && (
                        <>
                            <Listbox value={provinceCode} onChange={(provinceCode) => { setProvinceCode(provinceCode); handleCity(provinceCode); }}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <span className="block truncate">
                                            {provinceCode ? provinceCode.province_name : "Select province"}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {provinceList.map((province) => (
                                            <Listbox.Option
                                                key={province.province_code}
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                    }`
                                                }
                                                value={province}
                                            >
                                                {({ selected1 }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected1 ? "font-medium" : "font-normal"
                                                                }`}
                                                        >
                                                            {province.province_name}
                                                        </span>
                                                        {selected1 && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                <CheckIcon className="h-5 w-5" />
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}
                </div>
                <div className="p-2">
                    <label htmlFor="CityName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>City</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="CityName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500
                                ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                                placeholder="Province"
                                value={studentData.CityName || ""}
                                readOnly={!isEditing}
                            // onChange={isEditing ? (e) => setCampusName(e.target.value) : undefined}
                            />
                        </>
                    )}

                    {isEditing && (
                        <>
                            <Listbox value={cityCode} onChange={(cityCode) => { setCityCode(cityCode); handleBrgy(cityCode); }}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <span className="block truncate">
                                            {cityCode ? cityCode.city_name : "Select city"}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {cityList.map((city) => (
                                            <Listbox.Option
                                                key={city.city_code}
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                    }`
                                                }
                                                value={city}
                                            >
                                                {({ selected1 }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected1 ? "font-medium" : "font-normal"
                                                                }`}
                                                        >
                                                            {city.city_name}
                                                        </span>
                                                        {selected1 && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                <CheckIcon className="h-5 w-5" />
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}
                </div>
                <div className="p-2">
                    <label htmlFor="BrgyName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Barangay</strong>
                    </label>
                    {!isEditing && (
                        <>
                            <input
                                type="text"
                                id="CityName"
                                className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                                focus:ring-blue-500 focus:border-blue-500
                                ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                                placeholder="Province"
                                value={studentData.BrgyName || ""}
                                readOnly={!isEditing}
                            // onChange={isEditing ? (e) => setCampusName(e.target.value) : undefined}
                            />
                        </>
                    )}

                    {isEditing && (
                        <>
                            <Listbox value={brgyCode} onChange={(brgyCode) => { setBrgyCode(brgyCode) }}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <span className="block truncate">
                                            {brgyCode ? brgyCode.brgy_name : "Select brgy"}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {brgyList.map((brgy) => (
                                            <Listbox.Option
                                                key={brgy.brgy_code}
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                    }`
                                                }
                                                value={brgy}
                                            >
                                                {({ selected1 }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected1 ? "font-medium" : "font-normal"
                                                                }`}
                                                        >
                                                            {brgy.brgy_name}
                                                        </span>
                                                        {selected1 && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                <CheckIcon className="h-5 w-5" />
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </>
                    )}
                </div>
                <div className="p-2">
                    <label htmlFor="HomeStreet" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <strong>Home Street No.</strong>
                    </label>
                    <input
                        type="text"
                        id="HomeStreet"
                        className={`shadow-xs border text-sm rounded-lg block w-full p-2.5
                        focus:ring-blue-500 focus:border-blue-500
                        ${!isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 text-gray-900"}`}
                        placeholder="Date of Birth"
                        value={isEditing ? homeStreet : studentData.HomeStreet || homeStreet}
                        readOnly={!isEditing}
                        onChange={isEditing ? (e) => setHomeStreet(e.target.value) : undefined}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentInfoComponent;