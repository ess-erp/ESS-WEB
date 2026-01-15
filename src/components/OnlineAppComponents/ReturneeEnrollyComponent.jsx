import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BlueBtn from "../ButtonsComponents/BlueBtn";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import SearchBox from "../ButtonsComponents/SearchBox";
import {
    fetchOldStudentData,
    fetchStudentByIdData,
    fetchOtpCodeData,
} from "../../states/OnlineApplicationState/Action";
import InputFieldWithBtn from "../ButtonsComponents/InputFieldWithBtn";

const ReturneeEnrollyComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const oldStudent =
        useSelector((state) => state.online.oldStudentState?.data) || [];

    const studentData =
        useSelector((state) => state.online.studentDataState?.data) || {};

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchOldStudentData());
    }, [dispatch]);

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    /* ===================== HANDLERS ===================== */
    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        if (student?.StudentId) {
            dispatch(fetchStudentByIdData(student.StudentId));
        }
    };

    console.log(studentData);
    const [otpCode, setOtpCode] = useState("");
    const [validOtpCode, setValidOtpCode] = useState("");
    const [isOtpValid, setIsOtpValid] = useState(false);
    const verifyEmail = async () => {
        if (!studentData || cooldown > 0) return;
        const payload = {
            FathersEmail: studentData?.FathersEmail ?? "",
            MothersEmail: studentData.MothersEmail,
            ContactEmail: studentData.ContactEmail,
        };
        setCooldown(30);
        setIsModalOpen(true);
        const res = await dispatch(fetchOtpCodeData(payload));
        if (res.ok) {
            console.log(res.data);
            setValidOtpCode(res.data.OtpCode);
            setIsOtpValid(true);
        }
        else{
            setIsOtpValid(false);
        }
    };

    const handleOtpChange = (value) => {
        setOtpCode(value);

        // if (!serverOtp) return;

        // setValidOtpCode(value === serverOtp);
    };

    const handleSubmit = () => {
        if (!selectedStudent) {
            alert("Please select a student first!");
            return;
        }

        if (otpCode == validOtpCode) {
            navigate(`/returneeform?studentId=${studentData.StudentId}`);
        }
        console.log("Submitting student:", selectedStudent);
    };

    /* ===================== UI ===================== */
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex w-full max-w-5xl">
                {/* LEFT PANEL */}
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
                            Enroll your child using our Online Application.
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-green-800 mb-6">
                        Returnee Enrollment
                    </h2>

                    <div className="space-y-6">
                        {/* STUDENT SEARCH */}
                        <SearchBox
                            label="Search Student"
                            placeholder="Search by student number or fullname..."
                            required
                            options={oldStudent}
                            onSelect={handleStudentSelect}
                        />

                        {/* EMAILS */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Father's Email
                            </label>
                            <input
                                className="w-full border rounded-lg px-3 py-2"
                                value={studentData?.FathersEmail ?? ""}
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mother's Email
                            </label>
                            <input
                                className="w-full border rounded-lg px-3 py-2"
                                value={studentData?.MothersEmail ?? ""}
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Person's Email
                            </label>
                            <input
                                className="w-full border rounded-lg px-3 py-2"
                                value={studentData?.ContactEmail ?? ""}
                                readOnly
                            />
                        </div>

                        {/* OTP */}
                        <InputFieldWithBtn
                            label="Email Verification Code"
                            placeholder="Enter OTP code"
                            value={otpCode}
                            disabled={cooldown}
                            isOtpValid={isOtpValid}
                            onChange={handleOtpChange}
                            onClick={verifyEmail}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end mt-6">
                        <GreenBtn label="Submit" onClick={handleSubmit} />
                    </div>

                    {/* MODAL */}
                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Note"
                        body="We sent an OTP to the parent and contact person email. Please check inbox or spam."
                        buttons={[{ label: "Close", type: "red" }]}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReturneeEnrollyComponent;
