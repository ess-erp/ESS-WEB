import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import DataTable from "react-data-table-component";
import {
    fetchCampusData,

} from "../../states/OnlineApplicationState/Action";
import {
    fetchEmployeeApplicationInfoData,
    fetchCriteriaTableData,
    fetchInsertSacScreeningData,    
} from "../../states/SacState/Action";
const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#027407',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '14px',
        },
    },
    headCells: {
        style: {
            color: '#ffffff',
        },
    },
};

const EmployeeScreeningComponent = ({ isEditing, employeeAppId, userId }) => {

    const currUserId = userId;
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            EmployeeId: "",
            // EmployeeNumber: "",
            EmployeeAppId: "",
            EmployeeAppNo: "",
            Fullname: "",
            Nickname: "",
            Position: "",
            SetPositionName: null,
        }
    });

    const positionList = [
        { SetPositionId: 1, SetPositionName: "Faculty" },
        { SetPositionId: 2, SetPositionName: "Non-Teaching Staff" },
        { SetPositionId: 3, SetPositionName: "Staff" },
        { SetPositionId: 4, SetPositionName: "Others" }
    ];

    const recommendationList = [
        { RecommendationId: 1, RecommendationName: "Recommended" },
        { RecommendationId: 2, RecommendationName: "Recommended for Demonstration with reservations due to" },
        { RecommendationId: 3, RecommendationName: "Not Recommended" },
    ];

    const employeeData = useSelector(state => state.sac.employeeInfoState?.data || {});
    const campusList = useSelector(state => state.online.campusState?.data || []);

    useEffect(() => {
        dispatch(fetchEmployeeApplicationInfoData(employeeAppId));
        dispatch(fetchCampusData());
    }, [dispatch, employeeAppId]);
    console.log(employeeData);
    // useEffect(() => {
    //     if (!employeeData || !isEditing) return;

    //     reset({
    //         EmployeeId: employeeData.EmployeeId ?? "",
    //         EmployeeNumber: employeeData.EmployeeNumber ?? "",
    //         EmployeeAppId: employeeData.EmployeeAppId ?? "",
    //         EmployeeAppNo: employeeData.EmployeeAppNo ?? "",
    //         Fullname: `${employeeData.Fname ?? ""} ${employeeData.Mname ?? ""} ${employeeData.Lname ?? ""}`,
    //         Nickname: employeeData.Nickname ?? "",
    //         Position: employeeData.Position ?? "",
    //         // Campus: null,
    //         // SetPosition: null,
    //         // SetPositionName: null,
    //     });
    // }, [employeeData, isEditing, reset]);

    useEffect(() => {
        if (!isEditing || !employeeData?.CampusName || !campusList.length) return;

        const campus = campusList.find(
            c => c.CampusName === employeeData.CampusName
        );

        if (campus) {
            setValue("Campus", campus);
        }
    }, [campusList, employeeData?.CampusName, isEditing, setValue]);

    useEffect(() => {
        if (!employeeData?.SetPositionName) return;

        const position = positionList.find(
            p => p.SetPositionName === employeeData.SetPositionName
        );

        if (position) {
            setValue("SetPosition", position);
        }
    }, [employeeData, setValue]);

    const [criteriaList, setCriteriaList] = useState([]);
    const criteriaTableState = useSelector((state) => state.sac.criteriaTableState || {});
    const criteriaTable = criteriaTableState.data.data || [];
    const criteriaTableTotalRows = criteriaTableState.data.totalRecords || 0;
    const criteriaTableLoading = criteriaTableState.loading || false;
    const [criteriaTableCurrentPage, setCriteriaTableCurrentPage] = useState(1);
    const [criteriaTableRowsPerPage, setCriteriaTableRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchCriteriaTableData(userId, criteriaTableCurrentPage, criteriaTableRowsPerPage));
    }, [userId, criteriaTableCurrentPage, criteriaTableRowsPerPage, dispatch]);

  
    console.log(criteriaTable);
    useEffect(() => {
        if (!criteriaTable.length) return;
        const flattened = criteriaTable.flatMap(item => item.SacCriteriaChildDtos || []);
        setCriteriaList(flattened);

        console.log(criteriaTable);

    }, [criteriaTable]);

    console.log(criteriaTable);

    const [ratings, setRatings] = useState({});

    const criteriaColumn = [
        {
            name: 'Criteria Name',
            selector: row => row.CriteriaName,
            sortable: true
        },
        {
            name: 'Poor',
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="1"
                    onChange={() => handleRatingChange(row.CriteriaChildId, 1)}
                    checked={ratings[row.CriteriaChildId] === 1}
                />
            )
        },
        {
            name: 'Marginal',
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="2"
                    onChange={() => handleRatingChange(row.CriteriaChildId, 2)}
                    checked={ratings[row.CriteriaChildId] === 2}
                />
            )
        },
        {
            name: 'Good',
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="3"
                    onChange={() => handleRatingChange(row.CriteriaChildId, 3)}
                    checked={ratings[row.CriteriaChildId] === 3}
                />
            )
        },
        {
            name: 'Excellent',
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="4"
                    onChange={() => handleRatingChange(row.CriteriaChildId, 4)}
                    checked={ratings[row.CriteriaChildId] === 4}
                />
            )
        }
    ];

    const handleRatingChange = (rowId, value) => {
        setRatings(prev => ({
            ...prev,
            [rowId]: value
        }));
    };

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
        console.log(formData);
        if (!formData) return;

        const {
            Recommendation,
            SetPosition,
            ...rest
        } = formData;
        const CriteriaRatingDtos = Object.keys(ratings).map(key => ({
            CriteriaChildId: Number(key),
            Rating: ratings[key].toString()
        }));

        const payload = {
            ...rest,
            EmployeeId: employeeData.EmployeeAppId,
            // EmployeeNumber: employeeData.EmployeeNumber,
            EmployeeAppId: employeeData.EmployeeAppId,
            // EmployeeAppNo: employeeData.EmployeeAppNo,
            CriteriaId: criteriaTable[0].CriteriaId,
            Recommendation: formData.Recommendation?.RecommendationName,
            CreatedByUserId: currUserId,
            SacCriteriaRatingDtos: CriteriaRatingDtos,

        };
        console.log(ratings);
        console.log("SUBMIT PAYLOAD:", payload);

        const res = await dispatch(fetchInsertSacScreeningData(payload));
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
                    <InputField name="EmployeeAppNo" label="Employee Application Number" register={register} isEditing={isEditing} displayValue={employeeData?.EmployeeAppNo} />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
                    <InputField name="Fullname" label="Full Name" register={register} isEditing={isEditing} displayValue={`${employeeData.Fname ?? ""} ${employeeData.Mname ?? ""} ${employeeData.Lname ?? ""}`} />
                    <InputField name="Nickname" label="Nick Name" register={register} isEditing={isEditing} displayValue={employeeData?.Nickname} />
                    <InputField name="Position" label="Desired Position" register={register} isEditing={false} displayValue={employeeData?.Position} />
                    {/* <RHFListbox name="Campus" control={control} list={campusList} label="Campus" labelKey="CampusName" isEditing={!isEditing} displayValue={employeeData.CampusName} />
                    <RHFListbox
                        name="SetPositionName"
                        control={control}
                        list={positionList}
                        label="Select Position"
                        labelKey="SetPositionName"
                        isEditing={false}
                        displayValue={employeScreeningData.SetPositionName}
                    /> */}
                    <RHFListbox
                        name="Campus"
                        control={control}
                        list={campusList}
                        label="Campus"
                        labelKey="CampusName"
                        isEditing={!isEditing}
                        displayValue={employeeData.CampusName}
                    />

                    <RHFListbox
                        name="SetPosition"
                        control={control}
                        list={positionList}
                        label="Select Position"
                        labelKey="SetPositionName"
                        isEditing={!isEditing}
                        displayValue={employeeData.SetPositionName}
                    />
                </div>

            </div>
            <div className="mb-10">

                {/* TITLE */}
                <div className="flex items-center pt-4">

                    <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                        {/* {criteria.CriteriaTempName} */}
                        {criteriaTable[0]?.CriteriaTempName ?? ""}
                    </h2>

                    <div className="flex-grow">
                        <hr className="border-t border-gray-400" />
                    </div>
                </div>
                <div className="pt-4">
                    <DataTable
                        columns={criteriaColumn}
                        data={criteriaList}
                        progressPending={criteriaTableLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={criteriaTableTotalRows}
                        paginationDefaultPage={criteriaTableCurrentPage}
                        onChangePage={(page) => setCriteriaTableCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setCriteriaTableRowsPerPage(newPerPage);
                            setCriteriaTableCurrentPage(page);
                        }}
                        highlightOnHover
                        responsive
                        customStyles={customStyles}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 items-end w-full">
                    <RHFListbox
                        name="Recommendation"
                        control={control}
                        list={recommendationList}
                        label="Recommendation"
                        labelKey="RecommendationName"
                        required
                        isEditing={false}
                        error={errors.Recommendation}
                    />
                    <InputField
                        name="Remarks"
                        label="Remarks"
                        register={register}
                        isEditing={true}
                        displayValue={employeeData.Remarks}
                    />
                </div>
            </div>
            {/* {criteriaTable.map((criteria, index) => (
                <div key={criteria.CriteriaId} className="mb-10">

                    <div className="flex items-center pt-4">

                        <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                            Teaching Demonstration
                        </h2>

                        <div className="flex-grow">
                            <hr className="border-t border-gray-400" />
                        </div>
                    </div>
                    <div className="pt-4">
                        <DataTable
                            columns={criteriaColumn}
                            data={criteriaList}
                            progressPending={criteriaTableLoading}
                            pagination
                            paginationServer
                            paginationTotalRows={criteriaTableTotalRows}
                            paginationDefaultPage={criteriaTableCurrentPage}
                            onChangePage={(page) => setCriteriaTableCurrentPage(page)}
                            onChangeRowsPerPage={(newPerPage, page) => {
                                setCriteriaTableRowsPerPage(newPerPage);
                                setCriteriaTableCurrentPage(page);
                            }}
                            highlightOnHover
                            responsive
                            customStyles={customStyles}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-4 items-end w-full">
                        <RHFListbox
                            name="Recommendation"
                            control={control}
                            list={recommendationList}
                            label="Recommendation"
                            labelKey="RecommendationName"
                            required
                            isEditing={false}
                        />
                        <InputField
                            name="Remarks"
                            label="Remarks"
                            register={register}
                            isEditing={isEditing}
                            displayValue={employeScreeningData.Remarks}
                        />
                    </div>
                </div>
            ))} */}
            <div className="flex justify-end items-end p-4 pt-4">
                <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
                >
                    Submit
                </button>
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
        </form>
    );
};

export default EmployeeScreeningComponent;