import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import BlueBtn from "../ButtonsComponents/BlueBtn";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import RedBtn from "../ButtonsComponents/RedBtn";
import ModalComponent from '../ButtonsComponents/ModalComponent';
import {
    fetchOldStudentData,
    fetchStudentByIdData,
    fetchOtpCodeData,
} from '../../states/OnlineApplicationState/Action';

const ReturneeEnrollyComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const oldStudentState = useSelector((state) => state.online.oldStudentState || {});
    const oldStudent = oldStudentState.data || [];

    const studentDataState = useSelector((state) => state.online.studentDataState || {});
    const studentData = studentDataState.data || [];

    console.log(studentData);

    useEffect(() => {
        dispatch(fetchOldStudentData())
    }, [dispatch]);

    const [step, setStep] = useState(1);
    const stepTitle = {
        1: "Returnee",
        2: "Campus Information",
    };

    // dropdown states
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        if (oldStudent.length > 0) {
            setOptions(oldStudent);
        }
    }, [oldStudent]);

    const filteredOptions = options.filter((s) =>
        `${s.StudentNumber} - ${s.Fname} ${s.Fname} ${s.Mname} ${s.Lname}`.toLowerCase().includes(value.toLowerCase())
    );

    const handleSelect = (student) => {
        setValue(`${student.StudentNumber ?? ""} - ${student.Fname ?? ""} ${student.Mname ?? ""} ${student.Lname ?? ""}`);
        setSelectedStudent(student);
        setShowDropdown(false);
        setHighlightedIndex(-1);
        if (student.StudentId) {
            dispatch(fetchStudentByIdData(student.StudentId));
        }
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || filteredOptions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0) {
                handleSelect(filteredOptions[highlightedIndex]);
            }
        }
    };

    const handleBack = () => {
        console.log("test");
    };


    const [triggerVerify, setTriggerVerify] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    useEffect(() => {
        if (triggerVerify && studentData.ContactEmail) {
            dispatch(fetchOtpCodeData(studentData.ContactEmail));
            setTriggerVerify(false);
        }
    }, [triggerVerify, studentData.ContactEmail, dispatch]);


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
        if (cooldown > 0) return;

        setTriggerVerify(true);
        setCooldown(30);
        setIsModalOpen(true);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleSubmit = () => {
        if (!selectedStudent) {
            alert("Please select a student first!");
            return;
        }
        console.log("Submitting student:", selectedStudent);

    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex w-full max-w-5xl">

                {/* Left panel */}
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

                {/* Right panel */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-green-800 mb-6">
                        {stepTitle[step]}
                    </h2>

                    <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                        {/* Search student */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search Student <span className="text-red-500">*</span>
                            </label>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search student by using student number or fullname..."
                                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                />

                                {showDropdown && value && (
                                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {filteredOptions.map((option, i) => (
                                            <li
                                                key={option.id}
                                                onClick={() => handleSelect(option)}
                                                className={`px-3 py-2 cursor-pointer ${highlightedIndex === i ? "bg-green-100" : "hover:bg-green-100"
                                                    }`}
                                            >
                                                {option.StudentNumber ?? ""} - {option.Fname ?? ""} {option.Mname ?? ""} {option.Lname ?? ""}
                                            </li>
                                        ))}

                                        {filteredOptions.length === 0 && (
                                            <li className="px-3 py-2 text-gray-500">No results found</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Emails (dummy for now) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Email</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Father's email."
                                value={studentData?.FathersEmail ?? ""}
                                readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Email</label>
                            <input type="text"
                                placeholder="Mother's email."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={studentData?.MothersEmail ?? ""}
                                readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person's Email</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={studentData?.ContactEmail ?? ""}
                                placeholder="Contact Person's email."
                                readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Verification Code <span className='text-red-500'>*</span>
                            </label>
                            <div className="flex gap-2">
                                <input type="text" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <BlueBtn
                                    label={cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Send OTP"}
                                    onClick={verifyEmail}
                                    disabled={cooldown > 0}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-6">
                        <GreenBtn label="Submit" onClick={handleSubmit} />
                    </div>
                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Note"
                        body="We sent an OTP to parent and contact person email accounts. Kindly check your email inbox or in spam folder."
                        buttons={[
                            { label: "Close", type: "red" },
                        ]}

                    />
                </div>
            </div>
        </div>
    );
};

export default ReturneeEnrollyComponent;
