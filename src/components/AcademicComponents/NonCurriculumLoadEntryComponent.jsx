import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import InputField from "../ButtonsComponents/InputField";
import SchoolYearDropdown from '../ButtonsComponents/SchoolYearDropdown';
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
    const [showSubSubjects, setShowSubSubjects] = useState({}); // Track visibility by row index
    
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            subjectType: "",
            rows: [
                { subjectName: "", subNonCurriculumSubjects: [{ subName: "" }] }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows",
    });

    const NON_CURRICULUM_TYPES = [
        { value: "MG", label: "Mega Skill (MG)" },
        { value: "ECQ", label: "ESSENTIAL CHARACTER QUALITIES (ECQ)" },
        { value: "Others", label: "Others" }
    ];

    // Toggle sub-subjects visibility for a specific row
    const toggleSubSubjects = (index) => {
        setShowSubSubjects(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };


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

        // Build the payload with NonCurriculumType at the top level
        const payload = {
            NonCurriculumType: formData.subjectType,
            NonCurriculumSubjects: formData.rows.map(r => ({
                SubjectName: r.subjectName,
                SubNonCurriculumSubjects: r.subNonCurriculumSubjects
                    .filter(sub => sub.subName && sub.subName.trim() !== '') // Only include non-empty sub subjects
                    .map(sub => ({
                        SubName: sub.subName
                    }))
            })),
            CreatedByUserId: userId
        };

        console.log("Adjusted Payload:", payload);
        console.log("Payload Structure:", JSON.stringify(payload, null, 2));

        const res = await dispatch(fetchInsertNonCurriculumSubjectData(payload));

        if (res?.ok) {
            setIsModalOpen(false);
            setIsSuccessModalOpen(true);

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
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('');

    useEffect(() => {
        dispatch(fetchNonCurriculumSubjectData(
            generalOfferedCurrentPage, 
            generalOfferedRowsPerPage, 
            generalOfferedFilterText,
            selectedSchoolYear
        ));
    }, [generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText, selectedSchoolYear, dispatch]);
    useEffect(() => {
        if (generealOfferedTable.length == 0) return;
        setInactiveGeneralOfferedSubject(generealOfferedTable);
    }, [generealOfferedTable]);

    const subjectColumns = [
        { name: 'Subject Type', selector: row => row.NonCurriculumType, sortable: true },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true },
        { name: 'School Year', selector: row => row.SchoolYear, sortable: true },
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

    // Component for each subject row with its sub-subjects
    const NonCurriculumRow = ({ field, index, register, control, errors, remove, fieldsLength, isSubSubjectsVisible, onToggleSubSubjects }) => {
        const { fields: subFields, append: appendSub, remove: removeSub } = useFieldArray({
            control,
            name: `rows.${index}.subNonCurriculumSubjects`,
        });

        return (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-[40px_1fr_auto_40px] gap-3 items-start mb-3">
                    <div className="text-center font-semibold pt-2">
                        {index + 1}:
                    </div>
                    
                    <InputField
                        name={`rows.${index}.subjectName`}
                        label="Main Subject Name"
                        register={register}
                        isEditing={true}
                        placeholder="e.g., Reading, Writing, Math..."
                        divClassName=""
                        required
                        errors={errors.rows?.[index]?.subjectName}
                        errorMessage={errors.rows?.[index]?.subjectName?.message}
                    />

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleSubSubjects(index);
                        }}
                        className="mt-7 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-1 whitespace-nowrap"
                    >
                        <Plus size={16} />
                        {isSubSubjectsVisible ? "Hide Sub Subjects" : "Add Sub Subjects"}
                    </button>

                    {fieldsLength > 1 && (
                        <div className="flex justify-center items-center pt-7">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    remove(index);
                                }}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                title="Remove Subject"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Sub Subjects - Only show when toggled */}
                {isSubSubjectsVisible && (
                    <div className="ml-12 space-y-2 mt-4 border-t pt-3">
                        <label className="text-sm font-medium text-gray-700">Sub Non-Curriculum Subjects:</label>
                        
                        {subFields.map((subField, subIndex) => (
                            <div key={subField.id} className="grid grid-cols-[1fr_40px] gap-2 items-center">
                                <InputField
                                    name={`rows.${index}.subNonCurriculumSubjects.${subIndex}.subName`}
                                    label=""
                                    register={register}
                                    isEditing={true}
                                    placeholder="e.g., Comprehension, Vocabulary..."
                                    divClassName=""
                                />
                                
                                {subFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeSub(subIndex);
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                        title="Remove Sub Subject"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                appendSub({ subName: "" });
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                            <Plus size={16} /> Add Another Sub Subject
                        </button>
                    </div>
                )}
            </div>
        );
    };
    
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

                        <SchoolYearDropdown
                            value={selectedSchoolYear}
                            onChange={(e) => {
                                setSelectedSchoolYear(e.target.value);
                                setGeneralOfferedCurrentPage(1);
                            }}
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
                            {/* Non Curriculum Type Dropdown */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Non Curriculum Subject Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register("subjectType", { required: "Subject type is required" })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Subject Type</option>
                                    {NON_CURRICULUM_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.subjectType && (
                                    <p className="text-red-500 text-sm mt-1">{errors.subjectType.message}</p>
                                )}
                            </div>

                            {/* Subject Rows */}
                            {fields.map((field, index) => (
                                <NonCurriculumRow
                                    key={field.id}
                                    field={field}
                                    index={index}
                                    register={register}
                                    control={control}
                                    errors={errors}
                                    remove={remove}
                                    fieldsLength={fields.length}
                                    isSubSubjectsVisible={showSubSubjects[index] || false}
                                    onToggleSubSubjects={toggleSubSubjects}
                                />
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    append({ subjectName: "", subNonCurriculumSubjects: [{ subName: "" }] })
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                + Add Subject Row
                            </button>
                        </form>

                    </div>
                }
                size="w-[900px]"
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