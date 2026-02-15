import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import DataTable from "react-data-table-component";
import { motion, AnimatePresence } from "framer-motion";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import InputField from "../ButtonsComponents/InputField";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import {
    fetchCurriculumAndNonCurriculumSubjectData,
    fetchSectionListData,
    fetchNonCurriculumData,
} from "../../states/AcademicState/Action";


const SubjectScheduleLoadEntryComponent = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            secId: "",
            levelName: "",
            rows: [
                { subjectId: "", nonSubjectId: "", teacherId: "", timeIn: "", timeOut: "", firstTerm: "", secondTerm: "", thirdTerm: "" }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows",
    });

    const [addNewModal, setAddNewModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openAddNewModal = () => {
        setAddNewModal(true);
    };
    const [generalOfferedSubject, setInactiveGeneralOfferedSubject] = useState([]);
    const generalOfferedSubjectState = useSelector((state) => state.academic.generalOfferedSubjectState || {});
    const generealOfferedTable = generalOfferedSubjectState.data.data || [];
    const generealOfferedTotalRows = generalOfferedSubjectState.data.totalRecords || 0;
    const generealOfferedLoading = generalOfferedSubjectState.loading || false;
    const [generalOfferedFilterText, setGeneralOfferedFilterText] = useState('');
    const [generalOfferedCurrentPage, setGeneralOfferedCurrentPage] = useState(1);
    const [generalOfferedRowsPerPage, setGeneralOfferedRowsPerPage] = useState(10);
    const [sectionList, setSectionList] = useState([]);
    const sectionListState = useSelector((state) => state.academic.sectionListState || {});
    const sectionData = sectionListState.data || [];
    const [selectedSection, setSelectedSection] = useState(null);

    console.log(sectionData);

    useEffect(() => {
        dispatch(fetchSectionListData());
    }, [dispatch]);

    useEffect(() => {
        if (!Array.isArray(sectionData) || sectionData.length === 0) return;

        setSectionList(
            sectionData.map(item => ({
                value: item.SecId,
                label: item.SectionName,
                levelName: item.LevelName,
            }))
        );
    }, [sectionData]);
    // useEffect(() => {

    //     if (sectionData.length == 0) return;

    //     const mappedOptions = sectionData.map((item) => ({
    //         value: item.SectionId,
    //         label: item.SectionName,
    //         levelName: item.LevelName,
    //     }));

    //     setSectionList(mappedOptions);
    // }, [sectionData]);

    useEffect(() => {
        dispatch(fetchCurriculumAndNonCurriculumSubjectData(generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText));
    }, [generalOfferedCurrentPage, generalOfferedRowsPerPage, generalOfferedFilterText, dispatch]);
    useEffect(() => {
        if (generealOfferedTable.length == 0) return;
        setInactiveGeneralOfferedSubject(generealOfferedTable);
    }, [generealOfferedTable]);

    const subjectColumns = [
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true },
        { name: 'Unit', selector: row => row.SubjectUnit, sortable: true },
        {
            name: "Action",
            cell: row => (
                <button
                    onClick={() => handleAddSubject(row)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                    <Plus size={16} />
                </button>
            )
        }
    ];

    const [addedSubjects, setAddedSubjects] = useState([]);

    const handleAddSubject = (row) => {
        const exists = addedSubjects.some(
            s => s.SubjectCode === row.SubjectCode
        );
        if (exists) return;

        setAddedSubjects(prev => [
            ...prev,
            {
                SubjectCode: row.SubjectCode,
                SubjectName: row.SubjectName,
                SubjectUnit: row.SubjectUnit,
                dropdownValue: null,
                term1: false,
                term2: false,
                term3: false
            }
        ]);

        setInactiveGeneralOfferedSubject(prev =>
            prev.filter(s => s.SubjectCode !== row.SubjectCode)
        );
    };

    const handleRemoveSubject = (row, index) => {
        setAddedSubjects(prev =>
            prev.filter((_, i) => i !== index)
        );

        setInactiveGeneralOfferedSubject(prev => [
            ...prev,
            {
                SubjectCode: row.SubjectCode,
                SubjectName: row.SubjectName,
                SubjectUnit: row.SubjectUnit,
            }
        ]);
    };

    const handleCheckboxChange = (index, field) => {
        setAddedSubjects(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [field]: !item[field] }
                    : item
            )
        );
    };
    const addedColumns = [
        {
            name: "Subject Code",
            selector: row => row.SubjectCode
        },
        {
            name: "Subject Name",
            selector: row => row.SubjectName
        },
        {
            name: "Subject Type",
            selector: row => row.SubjectName
        },
        {
            name: "Room",
            cell: (row, index) => (
                <div>
                    <input
                        type="text"
                        // value={selectedSection?.levelName || ""}
                        placeholder="Room"
                        // disabled
                        className="shadow-xs border text-sm rounded-lg block w-full p-2.5 bg-white-100"
                    />
                </div>
            )
        },
        {
            name: "Start Time",
            cell: (row, index) => (
                <InputField
                    name={`row.${index}.startTime`}
                    register={register}
                    isEditing={true}
                    placeholder="Please input start time...."
                    divClassName=""
                    errors={errors.timeIn}
                    errorMessage={errors.timeIn?.message}
                    type="time"
                />
            )
        },
        {
            name: "End Time",
            cell: (row, index) => (
                <InputField
                    name={`row.${index}.endTime`}
                    register={register}
                    isEditing={true}
                    placeholder="Please input end time...."
                    divClassName=""
                    errors={errors.endTime}
                    errorMessage={errors.endTime?.message}
                    type="time"
                />
            )
        },
        {
            name: "Term Availability",
            cell: (row, index) => (
                <div className="flex gap-3">
                    {["term1", "term2", "term3"].map((t, i) => (
                        <label key={t} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={row[t]}
                                onChange={() => handleCheckboxChange(index, t)}
                            />
                            T{i + 1}
                        </label>
                    ))}
                </div>
            )
        },

        {
            name: "Action",
            cell: (row, index) => (
                <button
                    onClick={() => handleRemoveSubject(row, index)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                    <Trash2 size={16} />
                </button>
            )
        }
    ];
    return (
        // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>

            {/* LEFT — Inactive */}
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            Subject Schedule Master List
                        </h3>
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
                        // value={generalOfferedFilterText}
                        // onChange={(e) => {
                        //     setGeneralOfferedFilterText(e.target.value);
                        //     setGeneralOfferedCurrentPage(1);
                        // }}
                        />
                    </div>
                </div>

            </div>
            <ModalComponent
                isOpen={addNewModal}
                onClose={() => setAddNewModal(false)}
                title="Create subject schedule template"
                body={
                    <div>
                        <div className="mt-6 relative overflow-hidden">
                            <div className="px-4 py-3 rounded-t-lg flex justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-green-600">
                                        Subject Master List
                                    </h3>
                                </div>
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
                            <div className="w-full overflow-x-auto">
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

                            <hr className="my-4 border-t border-gray-300" />
                            <h2 className="my-4 text-xl font-bold text-green-500">
                                List of Added Subjects
                            </h2>
                            <div className="flex justify-center gap-6 mb-4">

                                <SearchableSelect
                                    options={sectionList}
                                    value={selectedSection}
                                    onChange={(selected) => setSelectedSection(selected)}
                                    placeholder="-- Select Section Type --"
                                    label="Select Section"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Level
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedSection?.levelName || ""}
                                        placeholder="Level"
                                        disabled
                                        className="shadow-xs border text-sm rounded-lg block w-full p-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div>


                            </div>
                            <div className="w-full overflow-y-auto max-h-[300px]">
                                <DataTable
                                    columns={addedColumns}
                                    data={addedSubjects}
                                    highlightOnHover
                                    striped
                                    responsive
                                    dense
                                    fixedHeader
                                    fixedHeaderScrollHeight="260px"
                                    noDataComponent="No subjects added yet"
                                />
                            </div>
                        </div>
                    </div>
                }
                size="w-[1000px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmit, closeOnClick: false },
                    { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
                ]}
            />
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Warning"
                body="Are you sure you want to continue?"
                buttons={[
                    {
                        label: "Yes", type: "green",
                        // onClick: handleSubmitModal 
                    },
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
export default SubjectScheduleLoadEntryComponent;