import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import InputField from "../ButtonsComponents/InputField";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import {
    fetchInsertNonCurriculumSubjectData,
    fetchNonCurriculumSubjectData,
} from "../../states/AcademicState/Action";

const NonCurriculumLoadEntryComponent = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;
    const [addNewModal, setAddNewModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            rows: [
                { subjectCode: "", subjectName: "", }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows",
    });


    const openAddNewModal = () => {
        setAddNewModal(true);
    };

    const [formData, setFormData] = useState(null);
    const onSubmit = (data) => {
        console.log(data);
        setFormData(data);
        setIsModalOpen(true);
    };
    const handleSubmitModal = async () => {
        console.log("Form Data Raw:", formData);

        // Build the payload directly as an array of items, mapping out the wrapper object shell
        const payload = formData.rows.map(r => ({
            SubjectCode: r.subjectCode,
            SubjectName: r.subjectName,
            CreatedByUserId: userId
        }));

        console.log("Clean Direct-Array Payload:", payload); // Output structure is now safely: [ { ... }, { ... } ]

        const res = await dispatch(fetchInsertNonCurriculumSubjectData(payload));

        if (res?.ok) {
            setIsModalOpen(false); // Close the confirmation modal automatically
            setIsSuccessModalOpen(true);

            // Directly trigger the reload timer smoothly 
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    };
    // const handleSubmitModal = async () => {

    //     console.log(formData);

    //     const payload = {
    //         SubjectRowDtos: formData.rows.map(r => ({
    //             SubjectCode: r.subjectCode,
    //             SubjectName: r.subjectName,
    //             CreatedByUserId: userId
    //         }))
    //     };
    //     console.log(payload);
    //     const res = await dispatch(fetchInsertNonCurriculumSubjectData(payload));

    //     if (res.ok) {
    //         setIsSuccessModalOpen(true);
    //         if (isSuccessModalOpen == false) {
    //             setTimeout(() => window.location.reload(), 3000);
    //         }
    //     }
    // };

    const [generalOfferedSubject, setInactiveGeneralOfferedSubject] = useState([]);
    const nonCurriculumSubjectState = useSelector((state) => state.academic.nonCurriculumSubjectState || {});
    const generealOfferedTable = nonCurriculumSubjectState.data.data || [];
    const generealOfferedTotalRows = nonCurriculumSubjectState.data.totalRecords || 0;
    const generealOfferedLoading = nonCurriculumSubjectState.loading || false;
    const [generalOfferedFilterText, setGeneralOfferedFilterText] = useState('');
    const [generalOfferedCurrentPage, setGeneralOfferedCurrentPage] = useState(1);
    const [generalOfferedRowsPerPage, setGeneralOfferedRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchNonCurriculumSubjectData(generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText));
    }, [generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText, dispatch]);
    useEffect(() => {
        if (generealOfferedTable.length == 0) return;
        setInactiveGeneralOfferedSubject(generealOfferedTable);
    }, [generealOfferedTable]);

    const subjectColumns = [
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true },
        { name: 'Created By', selector: row => row.Fullname, sortable: true },
        { name: 'Date Created', selector: row => row.DateCreated, sortable: true },
        {
            name: "Action",
            cell: row => (

                <div className="flex gap-4 items-center">
                    <button
                        //onClick={() => handleActivate(row)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                        <Pencil size={18} />

                    </button>

                    <RowToggleComponent
                        row={row}
                    //onToggle={handleToggleActive}
                    />
                </div>
            )
        }
    ];
    return (
        // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>

            {/* LEFT — Inactive */}
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-blue-50 rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-blue-600">
                            Non Curriculum Subject Master List
                        </h3>
                        <p className="text-xs text-gray-600">
                            List of non curriculum subject available/offered for this school year.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <OutlineBlueBtn
                            label="Add new"
                            onClick={openAddNewModal}
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-64"
                            value={generalOfferedFilterText}
                            onChange={(e) => {
                                setGeneralOfferedFilterText(e.target.value);
                                setGeneralOfferedCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="p-4">

                    <DataTable
                        columns={subjectColumns}
                        data={generalOfferedSubject}
                        progressPending={generealOfferedLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={generealOfferedTotalRows}
                        paginationDefaultPage={generalOfferedCurrentPage}
                        onChangePage={(page) => setGeneralOfferedCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setGeneralOfferedRowsPerPage(newPerPage);
                            setGeneralOfferedCurrentPage(page);
                        }}
                        highlightOnHover
                        responsive
                    />
                </div>

            </div>
            <ModalComponent
                isOpen={addNewModal}
                onClose={() => setAddNewModal(false)}
                title="Create non curriculum template"
                body={
                    <div className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-1 md:grid-cols-[40px_1fr_1fr_40px] gap-3 items-center p-3 rounded-lg"

                                >
                                    <div className="text-center font-semibold">
                                        {index + 1}:
                                    </div>
                                    <InputField
                                        name={`rows.${index}.subjectCode`}
                                        label="Subject Code"
                                        register={register}
                                        isEditing={true}
                                        placeholder="Please input subject code...."
                                        divClassName=""
                                        required
                                        errors={errors.SubjectCode}
                                        errorMessage={errors.SubjectCode?.message}
                                    />

                                    <InputField
                                        name={`rows.${index}.subjectName`}
                                        label="Subject Name"
                                        register={register}
                                        isEditing={true}
                                        placeholder="Please input subject code...."
                                        divClassName=""
                                        required
                                        errors={errors.SubjectName}
                                        errorMessage={errors.SubjectName?.message}
                                    />
                                    {fields.length > 1 && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    append({ subjectCode: "", subjectName: "", subjectUnit: "" })
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                + Add Row
                            </button>
                        </form>

                    </div>
                }
                size="w-[800px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmit(onSubmit), closeOnClick: false },
                    { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
                ]}
            />
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Warning"
                body="Are you sure you want to continue?"
                buttons={[
                    { label: "Yes", type: "green", onClick: handleSubmitModal },
                    { label: "No", type: "red", onClick: () => console.log("No clicked") },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={<p>Done creating non curriculum subjects.</p>}
            />
        </div>
    );
};
export default NonCurriculumLoadEntryComponent;