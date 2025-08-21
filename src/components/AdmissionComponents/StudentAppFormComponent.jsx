import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import OutlineGreenBtn from "../ButtonsComponents/OutlineGreenBtn";
import { motion, AnimatePresence } from "framer-motion";
import ListOfDocsTableComponent from "./ListOfDocsTableComponent";
import GPATableComponent from "./GPATableComponent";
import ExamSchedulerComponent from "./ExamSchedulerComponent";
import {
    fetchStudentByIdData
} from "../../states/AdmissionState/Action";

const StudentAppFormComponent = () => {

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const dispatch = useDispatch();
    const studentDataState = useSelector((state) => state.admission.studentDataState || {});
    const studentData = studentDataState.data || [];
    const AppId = query.get("AppId");

    console.log(studentData);

    useEffect(() => {
        if (AppId) {
            dispatch(fetchStudentByIdData(AppId));
        }
    }, [dispatch, AppId]);

    console.log(studentData);

    const [active, setActive] = useState("one");


    const btnBase =
        "w-full rounded-2xl py-2 px-4 text-sm font-medium shadow transition hover:shadow-md focus:outline-none focus:ring";


    const isActive = (key) =>
        active === key
            ? " bg-black text-white"
            : " bg-white text-black border";

    
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
            <div className="grid grid-cols-3 gap-2 pt-4">

                <div className="col-span-3 p-2 max-w-[330px]">
                    <label
                        htmlFor="AppNumber"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Application Number</strong>
                    </label>
                    <input
                        type="text"
                        id="AppNumber"
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                        dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Application Number"
                        value={studentData.AppNumber || ""}
                        readOnly
                    />
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="First name"
                        value={studentData.Fname || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Middle name"
                        value={studentData.Mname || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Last name"
                        value={studentData.Lname || ""}
                        readOnly
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="Lname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Campus</strong>
                    </label>
                    <input
                        type="text"
                        id="Lname"
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Last name"
                        value={studentData.CampusName || ""}
                        readOnly
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="DivName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Division </strong>
                    </label>
                    <input
                        type="text"
                        id="DivName"
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Division Name"
                        value={studentData.DivName || ""}
                        readOnly
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="LevelName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Level</strong>
                    </label>
                    <input
                        type="text"
                        id="LevelName"
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Level Name"
                        value={studentData.LevelName || ""}
                        readOnly
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="NationalityName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Nationality</strong>
                    </label>
                    <input
                        type="text"
                        id="NationalityName"
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Nationality Name"
                        value={studentData.NationalityName || ""}
                        readOnly
                    />
                </div>

                <div className="p-2">
                    <label
                        htmlFor="ReligionName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Religion</strong>
                    </label>
                    <input
                        type="text"
                        id="ReligionName"
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Religion name"
                        value={studentData.ReligionName || ""}
                        readOnly
                    />
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Date of birth"
                        value={studentData.DateOfBirth ? studentData.DateOfBirth.split("T")[0] : ""}
                        readOnly
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="ProvinceName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Province</strong>
                    </label>
                    <input
                        type="text"
                        id="ProvinceName"
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Province Name"
                        value={studentData.ProvinceName || ""}
                        readOnly
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="CityName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>City</strong>
                    </label>
                    <input
                        type="text"
                        id="CityName"
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="City Name"
                        value={studentData.CityName || ""}
                        readOnly
                    />
                </div>
                <div className="p-2">
                    <label
                        htmlFor="BrgyName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        <strong>Barangay</strong>
                    </label>
                    <input
                        type="text"
                        id="BrgyName"
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Barangay name"
                        value={studentData.BrgyName || ""}
                        readOnly
                    />
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Home No | Street"
                        value={studentData.HomeStreetAddress || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="First name"
                        value={studentData.FathersFname || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Middle name"
                        value={studentData.FathersMname || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Last name"
                        value={studentData.FathersLname || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Email"
                        value={studentData.FathersEmail || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Mobile phone number"
                        value={studentData.FathersMobileNo || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Occupation"
                        value={studentData.FathersOccupation || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="First name"
                        value={studentData.MothersFname || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Middle name"
                        value={studentData.MothersMname || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Last name"
                        value={studentData.MothersLname || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Email"
                        value={studentData.MothersEmail || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Mobile phone number"
                        value={studentData.MothersMobileNo || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Occupation"
                        value={studentData.MothersOccupation || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Fullname"
                        value={studentData.ContactPerson || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Email"
                        value={studentData.ContactEmail || ""}
                        readOnly
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
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                        placeholder="Relationship"
                        value={studentData.Relationship || ""}
                        readOnly
                    />
                </div>
            </div>
            <div className="flex items-center pt-4">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Other Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6 pt-4">
                <OutlineGreenBtn label="List of Documents" onClick={() => setActive("one")} />
                <OutlineGreenBtn label="Grade Point Average" onClick={() => setActive("two")} />
                <OutlineGreenBtn label="Examination Scheduler" onClick={() => setActive("three")} />
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
                           <ListOfDocsTableComponent studentId={studentData.StudentId} />
                           
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
                            <GPATableComponent studentId={studentData.StudentId} levelId={studentData.LevelId}/>
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
                            <ExamSchedulerComponent />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default StudentAppFormComponent;