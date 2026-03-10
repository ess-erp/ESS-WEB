import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
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
            Position: "",
            // CampusId: "",
            // CampusName: "",
            SetPosition: "",
            ApplicationThru: "",
            ApplicationThruOthers: "",
            ApplicationType: "",
            WorkExperience: "",
            NoOfYearMonth: "",
            Campus: null,
            SetPosition: null,
        }
    });

    const employeeData = useSelector(state => state.hr.employeeInfoState?.data || {});
    const campusList = useSelector(state => state.online.campusState?.data || []);

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
            Position: employeeData.Position ?? "",
            CampusId: employeeData.CampusId ?? "",
            CampusName: employeeData.CampusName ?? "",
            SetPosition: null,
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
        { SetPositionId: 1, SetPosition: "Faculty" },
        { SetPositionId: 2, SetPosition: "Non-Teaching Staff" },
        { SetPositionId: 3, SetPosition: "Staff" },
        { SetPositionId: 4, SetPosition: "Others" }
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
            SetPosition,
            ...rest
        } = formData;

        const payload = {
            ...rest,
            CampusId: formData.Campus?.CampusId,
            // SetPositionId: formData.SetPosition?.SetPositionId,
            SetPositionName: formData.SetPosition?.SetPosition,
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="m-4">
                <div className="flex items-center pt-4">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
                        i
                    </div>
                    <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                        Applicant Information
                    </h2>
                    <div className="flex-grow">
                        <hr className="border-t border-gray-400" />
                    </div>
                </div>
                <div>
                    <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                        <InputField name="EmployeeAppNo" label="Employee Application Number" register={register} isEditing={isEditing} displayValue={employeeData.EmployeeAppNo} />

                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                        <InputField name="Fullname" label="Full Name" register={register} isEditing={isEditing} displayValue={`${employeeData.Fname ?? ""} ${employeeData.Mname ?? ""} ${employeeData.Lname ?? ""}`} />
                        <InputField name="Nickname" label="Nick Name" register={register} isEditing={isEditing} displayValue={employeeData.Nickname} />
                        <InputField name="Position" label="Desired Position" register={register} isEditing={false} displayValue={employeeData.Position} />
                        <RHFListbox name="Campus" control={control} list={campusList} label="Campus" labelKey="CampusName" isEditing={!isEditing} displayValue={employeeData.CampusName} required error={errors.Campus} />
                        <RHFListbox
                            name="SetPosition"
                            control={control}
                            list={positionList}
                            label="Select Position"
                            labelKey="SetPosition"
                            isEditing={false}
                            required
                            error={errors.SetPosition}
                        />
                    </div>

                </div>
                <div className="flex items-center pt-4">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
                        i
                    </div>
                    <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                        Screening
                    </h2>
                    <div className="flex-grow">
                        <hr className="border-t border-gray-400" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 px-2">
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
                        <InputField
                            name="ApplicationThruOthers"
                            label="Others"
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
                    )}
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 px-2">
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
                    {/* <InputField name="EmployeeNumber" label="Employee Number" register={register} isEditing={isEditing} /> */}
                    {selectedApplicationType === "3" && (
                        <InputField
                            name="EmployeeNumber"
                            label="Employee Number"
                            register={register}
                            isEditing={isEditing}
                            displayValue={employeeData.EmployeeNumber}
                        />
                    )}

                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 px-2">
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
                    {/* <InputField name="NoOfYearMonth" label="Years and Months" register={register} isEditing={isEditing} /> */}
                    {selectedWorkExperience === "3" && (
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
                    )}
                </div>
                <div className="flex justify-end items-end p-4">
                    {isEditing && (
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-800 transition"
                        >
                            Submit
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
                    body="Done saving the details. The next process will be in Iintial Interview"
                    buttons={[
                        {
                            label: "OK",
                            type: "green",
                            onClick: () => setIsSuccessModalOpen(false)
                        },
                    ]}
                />
            </div>
        </form>
    );
};

export default EmployeeScreeningComponent;