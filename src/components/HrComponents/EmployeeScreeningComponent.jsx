import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FaUser, FaClipboardCheck, FaBriefcase, FaCheckCircle } from 'react-icons/fa';
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import RadioGroupField from "../ButtonsComponents/RadioGroupField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchCampusData,
} from "../../states/OnlineApplicationState/Action";
import {
    fetchEmployeeApplicationInfoData,
    fetchInsertHiringProcessData,
} from "../../states/HumanResourcesState/Action";
const EmployeeScreeningComponent = ({ isEditing, employeeAppId, userId }) => {

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            EmployeeId: "",
            EmployeeNumber: "",
            EmployeeAppId: "",
            EmployeeAppNo: "",
            Fullname: "",
            Nickname: "",
            DesiredPosition: "",
            ApplicationThru: "",
            ApplicationThruOthers: "",
            ApplicationType: "",
            WorkExperience: "",
            NoOfYearMonth: "",
            Campus: null,
            EmployeeCategory: null,
        }
    });

    const employeeData = useSelector(state => state.hr.employeeInfoState?.data || {});
    const campusList = useSelector(state => state.online.campusState?.data || []);

    console.log(campusList);
    useEffect(() => {
        dispatch(fetchEmployeeApplicationInfoData(employeeAppId));
        dispatch(fetchCampusData());
    }, [dispatch, employeeAppId]);

    useEffect(() => {
        if (!employeeData || !isEditing) return;

        reset({
            EmployeeId: employeeData.EmployeeId ?? "",
            EmployeeNumber: employeeData.EmployeeNumber ?? "",
            EmployeeAppId: employeeData.EmployeeAppId ?? "",
            EmployeeAppNo: employeeData.EmployeeAppNo ?? "",
            Fullname: `${employeeData.Fname ?? ""} ${employeeData.Mname ?? ""} ${employeeData.Lname ?? ""}`,
            Nickname: employeeData.Nickname ?? "",
            DesiredPosition: employeeData.DesiredPosition ?? "",
            CampusId: employeeData.CampusId ?? "",
            CampusName: employeeData.CampusName ?? "",
            EmployeeCategory: null,
        });
    }, [employeeData, isEditing, reset]);

    useEffect(() => {
        if (!isEditing || !employeeData?.CampusName || !campusList.length) return;

        const campus = campusList.find(
            c => c.CampusName === employeeData.CampusName
        );

        if (campus) {
            reset(prev => ({ ...prev, Campus: campus }));
        }
    }, [campusList, employeeData?.CampusName, isEditing]);

    const positionList = [
        { EmployeeCategoryId: 1, EmployeeCategory: "Faculty" },
        { EmployeeCategoryId: 2, EmployeeCategory: "Non-Teaching Staff" },
        { EmployeeCategoryId: 3, EmployeeCategory: "Staff" },
        { EmployeeCategoryId: 4, EmployeeCategory: "Others" }
    ];


    const selectedApplicationThru = watch("ApplicationThru");
    const selectedApplicationType = watch("ApplicationType");
    const selectedWorkExperience = watch("WorkExperience");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);

    const onSubmit = (data) => {
        setFormData(data);
        setIsModalOpen(true);
        console.log(data);
        console.log(formData);
    };

    const handleConfirmSubmit = async () => {
        if (!formData) return;

        const {
            Campus,
            EmployeeCategory,
            ...rest
        } = formData;

        const payload = {
            ...rest,
            CampusId: formData.Campus?.CampusId,
            // EmployeeCategoryId: formData.EmployeeCategory?.EmployeeCategoryId,
            EmployeeCategory: formData.EmployeeCategory?.EmployeeCategory,
            CampusName: "",
            CreatedByUserId: userId,
        };

        console.log("SUBMIT PAYLOAD:", payload);

        const res = await dispatch(fetchInsertHiringProcessData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
    };

    // console.log(employeeAppId);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Header Section with Status Badge */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow p-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-md font-bold">Employee Hiring Process</h3>
                        <p className="text-green-100 text-md mt-1">Application No: <span className="font-semibold">{employeeData.EmployeeAppNo}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5">
                            <FaCheckCircle className="text-xs" />
                            <span>Editing On</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Applicant Information Card */}
            <div className="bg-white rounded-lg shadow">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 p-1.5 rounded">
                            <FaUser className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Applicant Information</h2>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField name="EmployeeAppNo" label="Employee Application Number" register={register} isEditing={isEditing} displayValue={employeeData.EmployeeAppNo} />
                        <InputField name="Fullname" label="Full Name" register={register} isEditing={isEditing} displayValue={`${employeeData.Fname ?? ""} ${employeeData.Mname ?? ""} ${employeeData.Lname ?? ""}`} />
                        <InputField name="Nickname" label="Nick Name" register={register} isEditing={isEditing} displayValue={employeeData.Nickname} />
                        <InputField name="DesiredPosition" label="Desired Position" register={register} isEditing={isEditing} displayValue={employeeData.DesiredPosition} />
                        <RHFListbox name="Campus" control={control} list={campusList} label="Campus" labelKey="CampusName" isEditing={!isEditing} displayValue={employeeData.CampusName} required error={errors.Campus} />
                        <RHFListbox
                            name="EmployeeCategory"
                            control={control}
                            list={positionList}
                            label="Employee Category"
                            labelKey="EmployeeCategory"
                            isEditing={!isEditing}
                            required
                            error={errors.EmployeeCategory}
                        />
                    </div>
                </div>
            </div>

            {/* Screening Section Card */}
            <div className="bg-white rounded-lg shadow">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-1.5 rounded">
                            <FaClipboardCheck className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Screening</h2>
                    </div>
                </div>
                <div className="p-4 space-y-6">
                    {/* Application Thru Section */}
                    <div className="space-y-3">
                        <RadioGroupField
                            name="ApplicationThru"
                            label="Application Thru"
                            register={register}
                            isEditing={isEditing}
                            required
                            options={[
                                { label: "Active File", value: "1" },
                                { label: "Email", value: "2" },
                                { label: "Dropped-Off", value: "3" },
                                { label: "Job Fair", value: "4" },
                                { label: "Others", value: "5" },
                            ]}
                            error={errors.ApplicationThru}
                        />
                        {selectedApplicationThru === "5" && (
                            <div className="pl-4 border-l-2 border-purple-300">
                                <InputField
                                    name="ApplicationThruOthers"
                                    label="Please Specify"
                                    register={register}
                                    isEditing={isEditing}
                                    rules={{
                                        required:
                                            selectedApplicationThru === "5"
                                                ? "Please specify others"
                                                : false
                                    }}
                                    errors={errors.ApplicationThruOthers}
                                    errorMessage={errors.ApplicationThruOthers?.message}
                                />
                            </div>
                        )}
                    </div>

                    {/* ESS Application Type Section */}
                    <div className="space-y-3">
                        <RadioGroupField
                            name="ApplicationType"
                            label="ESS Application"
                            register={register}
                            isEditing={isEditing}
                            required
                            options={[
                                { label: "First Time Applicant", value: "1" },
                                { label: "Previous Applicant", value: "2" },
                                { label: "Returning Employee", value: "3" },
                            ]}
                            error={errors.ApplicationType}
                        />
                        {selectedApplicationType === "3" && (
                            <div className="pl-4 border-l-2 border-purple-300">
                                <InputField
                                    name="EmployeeNumber"
                                    label="Employee Number"
                                    register={register}
                                    isEditing={isEditing}
                                    displayValue={employeeData.EmployeeNumber}
                                />
                            </div>
                        )}
                    </div>

                    {/* Work Experience Section */}
                    <div className="space-y-3">
                        <RadioGroupField
                            name="WorkExperience"
                            label="Work Experience"
                            register={register}
                            isEditing={isEditing}
                            required
                            options={[
                                { label: "Fresh Graduate", value: "1" },
                                { label: "Experience in other industries", value: "2" },
                                { label: "With Experience", value: "3" },
                            ]}
                            error={errors.WorkExperience}
                        />
                        {selectedWorkExperience === "3" && (
                            <div className="pl-4 border-l-2 border-purple-300">
                                <InputField
                                    name="NoOfYearMonth"
                                    label="No. of Years and Months"
                                    register={register}
                                    isEditing={isEditing}
                                    rules={{
                                        required:
                                            selectedWorkExperience === "3"
                                                ? "Please specify work experience"
                                                : false
                                    }}
                                    errors={errors.NoOfYearMonth}
                                    errorMessage={errors.NoOfYearMonth?.message}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                {isEditing && (
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <FaBriefcase className="text-sm" />
                        <span>Submit Screening</span>
                    </button>
                )}
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Warning</span>}
                body="Are you sure you want to submit?"
                buttons={[
                    { label: "Yes", type: "green", onClick: handleConfirmSubmit, },
                    { label: "No", type: "red", onClick: () => setIsModalOpen(false) },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={
                    <span className="font-bold text-lg text-green-700">
                        Success
                    </span>
                }
                body="Done saving the details. The next process will be in Initial Interview"
                buttons={[
                    {
                        label: "OK",
                        type: "green",
                        onClick: () => setIsSuccessModalOpen(false)
                    },
                ]}
            />
        </form>
    );
};

export default EmployeeScreeningComponent;