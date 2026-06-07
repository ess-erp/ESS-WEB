// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm, useFieldArray } from "react-hook-form";
// import DataTable from "react-data-table-component";
// import ModalComponent from "../ButtonsComponents/ModalComponent";
// import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
// import SearchableSelect from "../ButtonsComponents/SearchableSelect";
// import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
// import InputField from "../ButtonsComponents/InputField";
// import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
// import {
//     fetchInsertGeneralOfferedSubjectsData,
//     fetchGeneralOfferedSubjectData,
// } from "../../states/AcademicState/Action";

// const SubjectLoadEntryComponent = () => {
//     const dispatch = useDispatch();
//     const [user] = useState(() => {
//         const savedUser = localStorage.getItem("userData");
//         return savedUser ? JSON.parse(savedUser) : null;
//     });
//     const userId = user?.UserId;
//     const [addNewModal, setAddNewModal] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
//     const {
//         register,
//         handleSubmit,
//         control,
//         formState: { errors },
//     } = useForm({
//         defaultValues: {
//             rows: [
//                 { subjectCode: "", subjectName: "", subjectUnit: "" }
//             ]
//         }
//     });

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "rows",
//     });


//     const openAddNewModal = () => {
//         setAddNewModal(true);
//     };

//     const [formData, setFormData] = useState(null);
//     const onSubmit = (data) => {
//         console.log(data);
//         setFormData(data);
//         setIsModalOpen(true);
//     };
//     const handleSubmitModal = async () => {

//         console.log(formData);

//         const payload = {
//             SubjectRowDtos: formData.rows.map(r => ({
//                 SubjectCode: r.subjectCode,
//                 SubjectName: r.subjectName,
//                 SubjectUnit: r.subjectUnit,
//                 CreatedByUserId: userId
//             }))
//         };
//         console.log(payload);
//         const res = await dispatch(fetchInsertGeneralOfferedSubjectsData(payload));

//         if (res.ok) {
//             setIsSuccessModalOpen(true);
//             if (isSuccessModalOpen == false) {
//                 setTimeout(() => window.location.reload(), 3000);
//             }
//         }
//     };

//     const [generalOfferedSubject, setInactiveGeneralOfferedSubject] = useState([]);
//     const generalOfferedSubjectState = useSelector((state) => state.academic.generalOfferedSubjectState || {});
//     const generealOfferedTable = generalOfferedSubjectState.data.data || [];
//     const generealOfferedTotalRows = generalOfferedSubjectState.data.totalRecords || 0;
//     const generealOfferedLoading = generalOfferedSubjectState.loading || false;
//     const [generalOfferedFilterText, setGeneralOfferedFilterText] = useState('');
//     const [generalOfferedCurrentPage, setGeneralOfferedCurrentPage] = useState(1);
//     const [generalOfferedRowsPerPage, setGeneralOfferedRowsPerPage] = useState(10);

//     useEffect(() => {
//         dispatch(fetchGeneralOfferedSubjectData(generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText));
//     }, [generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText, dispatch]);
//     useEffect(() => {
//         if (generealOfferedTable.length == 0) return;
//         setInactiveGeneralOfferedSubject(generealOfferedTable);
//     }, [generealOfferedTable]);

//     const subjectColumns = [
//         { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true },
//         { name: 'Subject Name', selector: row => row.SubjectName, sortable: true },
//         { name: 'Unit', selector: row => row.SubjectUnit, sortable: true },
//         { name: 'Created By', selector: row => row.Fullname, sortable: true },
//         { name: 'Date Created', selector: row => row.DateCreated, sortable: true },
//         {
//             name: "Action",
//             cell: row => (

//                 <div className="flex gap-4 items-center">
//                     <button
//                         //onClick={() => handleActivate(row)}
//                         className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
//                     >
//                         <Pencil size={18} />

//                     </button>

//                     <RowToggleComponent
//                         row={row}
//                         //onToggle={handleToggleActive}
//                     />
//                 </div>
//             )
//         }
//     ];
//     return (
//         // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>

//             {/* LEFT — Inactive */}
//             <div className="bg-white rounded-lg shadow border border-gray-200">

//                 <div className="px-4 py-3 border-b bg-blue-50 rounded-t-lg flex items-center justify-between">
//                     <div>
//                         <h3 className="text-lg font-semibold text-blue-600">
//                             Subject Master List
//                         </h3>
//                         <p className="text-xs text-gray-600">
//                             List of subject available/offered for this school year.
//                         </p>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <OutlineBlueBtn
//                             label="Add new"
//                             onClick={openAddNewModal}
//                         />

//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className="px-3 py-2 border border-gray-300 rounded w-64"
//                             value={generalOfferedFilterText}
//                             onChange={(e) => {
//                                 setGeneralOfferedFilterText(e.target.value);
//                                 setGeneralOfferedCurrentPage(1);
//                             }}
//                         />
//                     </div>
//                 </div>

//                 <div className="p-4">

//                     <DataTable
//                         columns={subjectColumns}
//                         data={generalOfferedSubject}
//                         progressPending={generealOfferedLoading}
//                         pagination
//                         paginationServer
//                         paginationTotalRows={generealOfferedTotalRows}
//                         paginationDefaultPage={generalOfferedCurrentPage}
//                         onChangePage={(page) => setGeneralOfferedCurrentPage(page)}
//                         onChangeRowsPerPage={(newPerPage, page) => {
//                             setGeneralOfferedRowsPerPage(newPerPage);
//                             setGeneralOfferedCurrentPage(page);
//                         }}
//                         highlightOnHover
//                         responsive
//                     />
//                 </div>

//             </div>
//             <ModalComponent
//                 isOpen={addNewModal}
//                 onClose={() => setAddNewModal(false)}
//                 title="Create subject template"
//                 body={
//                     <div className="space-y-4">
//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//                             {fields.map((field, index) => (
//                                 <div
//                                     key={field.id}
//                                     className="grid grid-cols-1 md:grid-cols-[40px_1fr_1fr_1fr_40px] gap-3 items-center p-3 rounded-lg"

//                                 >
//                                     <div className="text-center font-semibold">
//                                         {index + 1}:
//                                     </div>
//                                     <InputField
//                                         name={`rows.${index}.subjectCode`}
//                                         label="Subject Code"
//                                         register={register}
//                                         isEditing={true}
//                                         placeholder="Please input subject code...."
//                                         divClassName=""
//                                         required
//                                         errors={errors.SubjectCode}
//                                         errorMessage={errors.SubjectCode?.message}
//                                     />

//                                     <InputField
//                                         name={`rows.${index}.subjectName`}
//                                         label="Subject Name"
//                                         register={register}
//                                         isEditing={true}
//                                         placeholder="Please input subject code...."
//                                         divClassName=""
//                                         required
//                                         errors={errors.SubjectName}
//                                         errorMessage={errors.SubjectName?.message}
//                                     />

//                                     <InputField
//                                         name={`rows.${index}.subjectUnit`}
//                                         label="Subject Unit"
//                                         register={register}
//                                         isEditing={true}
//                                         placeholder="Please input subject code...."
//                                         divClassName=""
//                                         required
//                                         errors={errors.SubjectUnit}
//                                         errorMessage={errors.SubjectUnit?.message}
//                                         type="number"
//                                     />

//                                     {/* REMOVE BUTTON — only show if more than 1 row */}
//                                     {fields.length > 1 && (
//                                         <div className="flex justify-center items-center">
//                                             <button
//                                                 type="button"
//                                                 onClick={() => remove(index)}
//                                                 className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
//                                             >
//                                                 <Trash2 size={18} />
//                                             </button>
//                                         </div>

//                                     )}
//                                 </div>
//                             ))}

//                             <button
//                                 type="button"
//                                 onClick={() =>
//                                     append({ subjectCode: "", subjectName: "", subjectUnit: "" })
//                                 }
//                                 className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                             >
//                                 + Add Row
//                             </button>
//                         </form>

//                     </div>
//                 }
//                 size="w-[800px]"
//                 maxHeight="100vh"
//                 buttons={[
//                     { label: "Submit", type: "green", onClick: handleSubmit(onSubmit), closeOnClick: false },
//                     { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
//                 ]}
//             />
//             <ModalComponent
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 title="Warning"
//                 body="Are you sure you want to continue?"
//                 buttons={[
//                     { label: "Yes", type: "green", onClick: handleSubmitModal },
//                     { label: "No", type: "red", onClick: () => console.log("No clicked") },
//                 ]}
//             />
//             <ModalComponent
//                 isOpen={isSuccessModalOpen}
//                 onClose={() => setIsSuccessModalOpen(false)}
//                 title={<span className="font-bold text-lg text-green-700">Success</span>}
//                 body={<p>Done creating general offered subjects.</p>}
//             />
//         </div>
//     );
// };
// export default SubjectLoadEntryComponent;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import InputField from "../ButtonsComponents/InputField";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import {
    fetchInsertGeneralOfferedSubjectsData,
    fetchGeneralOfferedSubjectData,
} from "../../states/AcademicState/Action";

const SubjectLoadEntryComponent = () => {
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
                { subjectCode: "", subjectName: "", subjectUnit: "", parentId: null }
            ]
        }
    });

    // Destructured 'insert' to handle placing rows right below their specific parent indexes
    const { fields, append, remove, insert } = useFieldArray({
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

    const handleAddSubSubject = (parentIndex, parentFieldId) => {
        insert(parentIndex + 1, {
            subjectCode: "",
            subjectName: "",
            subjectUnit: "",
            parentId: parentFieldId // Track relational hierarchy
        });
    };

    const handleSubmitModal = async () => {
        console.log(formData);

        const payload = {
            SubjectRowDtos: formData.rows.map(r => ({
                SubjectCode: r.subjectCode,
                SubjectName: r.subjectName,
                SubjectUnit: r.subjectUnit,
                ParentId: r.parentId || null, // Included if your backend API consumes parent relations
                CreatedByUserId: userId
            }))
        };
        console.log(payload);
        const res = await dispatch(fetchInsertGeneralOfferedSubjectsData(payload));

        if (res.ok) {
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
    };

    const [generalOfferedSubject, setInactiveGeneralOfferedSubject] = useState([]);
    const generalOfferedSubjectState = useSelector((state) => state.academic.generalOfferedSubjectState || {});
    const generealOfferedTable = generalOfferedSubjectState.data.data || [];
    const generealOfferedTotalRows = generalOfferedSubjectState.data.totalRecords || 0;
    const generealOfferedLoading = generalOfferedSubjectState.loading || false;
    const [generalOfferedFilterText, setGeneralOfferedFilterText] = useState('');
    const [generalOfferedCurrentPage, setGeneralOfferedCurrentPage] = useState(1);
    const [generalOfferedRowsPerPage, setGeneralOfferedRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchGeneralOfferedSubjectData(generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText));
    }, [generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText, dispatch]);
    
    useEffect(() => {
        if (generealOfferedTable.length == 0) return;
        setInactiveGeneralOfferedSubject(generealOfferedTable);
    }, [generealOfferedTable]);

    const subjectColumns = [
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true },
        { name: 'Unit', selector: row => row.SubjectUnit, sortable: true },
        { name: 'Created By', selector: row => row.Fullname, sortable: true },
        { name: 'Date Created', selector: row => row.DateCreated, sortable: true },
        {
            name: "Action",
            cell: row => (
                <div className="flex gap-4 items-center">
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                        <Pencil size={18} />
                    </button>
                    <RowToggleComponent row={row} />
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="px-4 py-3 border-b bg-blue-50 rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-blue-600">Subject Master List</h3>
                        <p className="text-xs text-gray-600">List of subject available/offered for this school year.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <OutlineBlueBtn label="Add new" onClick={openAddNewModal} />
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
                title="Create subject template"
                body={
                    <div className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {fields.map((field, index) => {
                                const isSubSubject = !!field.parentId;

                                return (
                                    <div
                                        key={field.id}
                                        className={`grid grid-cols-1 gap-3 items-center p-3 rounded-lg border transition-all ${
                                            isSubSubject
                                                ? "grid-cols-[40px_1fr_1fr_1fr_80px] ml-10 bg-gray-50 border-l-4 border-l-blue-400 border-gray-200"
                                                : "grid-cols-[40px_1fr_1fr_1fr_120px] bg-white border-gray-100"
                                        }`}
                                    >
                                        <div className="text-center font-semibold text-gray-500">
                                            {isSubSubject ? "└─" : `${index + 1}:`}
                                        </div>
                                        
                                        <InputField
                                            name={`rows.${index}.subjectCode`}
                                            label="Subject Code"
                                            register={register}
                                            isEditing={true}
                                            placeholder="Please input subject code...."
                                            divClassName=""
                                            required
                                            errors={errors.rows?.[index]?.subjectCode}
                                            errorMessage={errors.rows?.[index]?.subjectCode?.message}
                                        />

                                        <InputField
                                            name={`rows.${index}.subjectName`}
                                            label="Subject Name"
                                            register={register}
                                            isEditing={true}
                                            placeholder="Please input subject name...."
                                            divClassName=""
                                            required
                                            errors={errors.rows?.[index]?.subjectName}
                                            errorMessage={errors.rows?.[index]?.subjectName?.message}
                                        />

                                        <InputField
                                            name={`rows.${index}.subjectUnit`}
                                            label="Subject Unit"
                                            register={register}
                                            isEditing={true}
                                            placeholder="Please input subject unit...."
                                            divClassName=""
                                            required
                                            errors={errors.rows?.[index]?.subjectUnit}
                                            errorMessage={errors.rows?.[index]?.subjectUnit?.message}
                                            type="number"
                                        />

                                        <div className="flex justify-end items-center gap-1">
                                            {/* Sub subject action toggle */}
                                            {!isSubSubject && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddSubSubject(index, field.id)}
                                                    className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                                                >
                                                    + Sub
                                                </button>
                                            )}

                                            {fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => append({ subjectCode: "", subjectName: "", subjectUnit: "", parentId: null })}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                + Add Row
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
                body={<p>Done creating general offered subjects.</p>}
            />
        </div>
    );
};

export default SubjectLoadEntryComponent;