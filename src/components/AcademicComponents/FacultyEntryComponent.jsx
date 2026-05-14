import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import {
    fetchSectionListData,
    fetchSectionSubjectScheduleTableData,
    fetchTeacherListData,
    fetchInsertFacultyLoadData,
    fetchFacultyLoadTableData,
    fetchFacultyLoadRowTableData,
} from "../../states/AcademicState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";


const FacultyEntryComponent = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;
    const formatDate = getFormatDate;
    const formatToAMPM = getFormatToAMPM;

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const [addNewModal, setAddNewModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjectList, setSubjectList] = useState([]);
    const sectionSubjectScheduleState = useSelector((state) => state.academic.sectionSubjectScheduleState || {});
    const subjectTotalRows = sectionSubjectScheduleState.data.totalRecords || 0;
    const subjectLoading = sectionSubjectScheduleState.loading || false;
    const [subjectCurrentPage, setSubjectCurrentPage] = useState(1);
    const [subjectRowsPerPage, setSubjectRowsPerPage] = useState(10);
    const [sectionList, setSectionList] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const teacherListData = useSelector((state) => state.academic.teacherListState.data || []);
    const [adviserList, setAdviserList] = useState([]);
    const [nonAdviserList, setNonAdviserList] = useState([]);
    const [selectedAdviser, setSelectedAdviser] = useState("");
    // const [select]
    const openAddNewModal = async () => {
        const res = await dispatch(fetchSectionListData());
        console.log(res);
        if (res.ok) {
            const formatted = res.data.map(item => ({
                value: item.SecId,
                label: item.SectionName,
                levelName: item.LevelName,
            }));

            setSectionList(formatted);
            setAddNewModal(true);

            const adviserRes = await dispatch(fetchTeacherListData("Adviser"));
            const nonAdviserRes = await dispatch(fetchTeacherListData("Non-Adviser"));
            console.log(adviserRes);
            console.log(nonAdviserRes);
            if (adviserRes?.ok) {
                const adviserMapped = adviserRes.data.map(item => ({
                    value: item.EmployeeId,
                    label: `${item.Fname} ${item.Lname}`,
                }));

                setAdviserList(adviserMapped);
            }

            if (nonAdviserRes?.ok) {
                const nonAdviserMapped = nonAdviserRes.data.map(item => ({
                    value: item.EmployeeId,
                    label: `${item.Fname} ${item.Lname}`,
                }));

                setNonAdviserList(nonAdviserMapped);
            }
        }
    };

    const handleSelectedSection = async (selected) => {
        console.log(selected);
        setSelectedSection(selected);
        const res = await dispatch(fetchSectionSubjectScheduleTableData(selected?.value, subjectCurrentPage, subjectRowsPerPage));
        console.log(res);
        if (res.ok) {
            setSubjectList(res.data);
        }
    };

    const subjectColumns = [
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true, wrap: true, grow: 3 },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true, wrap: true, grow: 3 },
        { name: 'Subject Type', selector: row => row.SubjectType, sortable: true, wrap: true, grow: 3 },
        { name: 'Subject Unit', selector: row => row.SubjectUnit, sortable: true, wrap: true, grow: 3 },
        { name: 'Room', selector: row => row.Room, sortable: true, wrap: true, grow: 3 },
        { name: 'Start Time', selector: row => formatToAMPM(row.StartTime), sortable: true, wrap: true, grow: 3 },
        { name: 'End Time', selector: row => formatToAMPM(row.EndTime), sortable: true, wrap: true, grow: 3 },
        {
            name: 'Assign Teacher',
            cell: (row) => (
                <SearchableSelect
                    options={nonAdviserList}
                    value={nonAdviserList.find(
                        option =>
                            option.value ===
                            teacherAssignments.find(
                                x => x.SubjectId === row.SubjectId
                            )?.EmployeeId
                    )}
                    onChange={(selected) =>
                        handleTeacherChange(row.SubjectId, selected)
                    }
                    placeholder="-- Select Teacher --"
                />
            ),
            sortable: true,
            wrap: true,
            grow: 5,
        },
        {
            name: 'Term Available',
            cell: (row) => (
                <div className="flex gap-3 m-1">
                    {["Term1", "Term2", "Term3"].map((t, i) => (
                        <label key={t} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={row[t] === "true" || row[t] === true}
                                readOnly
                            />
                            T{i + 1}
                        </label>
                    ))}
                </div>
            ),
            sortable: true,
            wrap: true,
            grow: 3,
            style: {
                whiteSpace: 'normal'
            }
        },
    ];

    const [teacherAssignments, setTeacherAssignments] = useState([]);
    const handleTeacherChange = (subjectId, selected) => {
        setTeacherAssignments(prev => {
            const existing = prev.find(x => x.SubjectId === subjectId);

            if (existing) {
                return prev.map(item =>
                    item.SubjectId === subjectId
                        ? {
                            ...item,
                            EmployeeId: selected?.value
                        }
                        : item
                );
            }

            return [
                ...prev,
                {
                    SubjectId: subjectId,
                    EmployeeId: selected?.value
                }
            ];
        });
    };

    const [successModalBody, setSuccessModalBody] = useState("");
    const [successModalTitle, setSuccessModalTitle] = useState("");

    const handleSubmit = () => {
        setIsModalOpen(true);
    };

    const handleSubmitModal = async () => {
        console.log(selectedSection);
        console.log(selectedAdviser);
        console.log(teacherAssignments);
        console.log(subjectList)

        const payload = {
            MainSecId: selectedSection?.value,
            AdviserId: selectedAdviser?.value,
            CreatedByUserId: userId,
            NonAdviserDtos: teacherAssignments
        };

        console.log(payload);
        const res = await dispatch(fetchInsertFacultyLoadData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            setSuccessModalTitle("Success");
            setSuccessModalBody("Done creating faculty load.");
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 2000);
            }
        }
    };



    const [facultyLoadList, setFacultyLoadList] = useState([]);
    const facultyLoadTableState = useSelector((state) => state.academic.facultyLoadTableState || {});
    const facultyLoadTable = facultyLoadTableState.data.data || [];
    const facultyLoadTotalRows = facultyLoadTableState.data.totalRecords || 0;
    const facultyLoadLoading = facultyLoadTableState.loading || false;
    const [facultyLoadCurrentPage, setFacultyLoadTableCurrentPage] = useState(1);
    const [facultyLoadRowsPerPage, setFacultyLoadTableRowsPerPage] = useState(10);
    const [facultyLoadTableSearchFilter, setFacultyLoadTableFilterText] = useState("");

    useEffect(() => {
        dispatch(fetchFacultyLoadTableData(facultyLoadCurrentPage, facultyLoadRowsPerPage, facultyLoadTableSearchFilter));
    }, [facultyLoadCurrentPage, facultyLoadRowsPerPage, facultyLoadTableSearchFilter, dispatch]);

    useEffect(() => {
        if (facultyLoadTable.length === 0) return;
        setFacultyLoadList(facultyLoadTable);
    }, [facultyLoadTable]);

    const facultyLoadColumn = [
        { name: 'Adviser Fullname', selector: row => row.AdviserFullname, sortable: true },
        { name: 'Section Name', selector: row => row.SectionName, sortable: true },
        { name: 'Number of Teacher Assigned', selector: row => row.NumberOfTeacher, sortable: true },
        { name: 'Created By', selector: row => row.CreatedByFullname, sortable: true },
        { name: 'Date Created', selector: row => formatDate(row.DateCreated), sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-4 items-center">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => openRowModal(row, "view")}
                    >
                        <Eye size={18} />
                    </button>

                    <button
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        onClick={() => openRowModal(row, "edit")}
                    >
                        <Pencil size={18} />
                    </button>

                    <RowToggleComponent row={row} onToggle={handleToggleActive} />
                </div>
            ),
            ignoreRowClick: true,
            width: "180px",
        }
    ];


    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [loadId, setLoadId] = useState(0);
    const [adviserName, setAdviserName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [levelName, setLevelName] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const openRowModal = (row, mode) => {
        console.log(row);
        setLoadId(row.LoadId);
        setRowModalOpen(true);
        console.log(loadId)
    };


    const handleToggleActive = (selectedRow, newStatus) => {
        console.log(selectedRow);
        console.log(newStatus);
        console.log(loadId);
        // const CreatedByUserId = user.UserId;
        // const activeStatus = newStatus ? "Y" : "DR";
        // console.log(selectedRow);
        // try {
        //     const result = await dispatch(
        //         fetchUpdateRowTemplateData(
        //             selectedRow.TempId,
        //             selectedRow.TempType,
        //             CreatedByUserId,
        //             activeStatus
        //         )
        //     );

        //     if (result.ok) {
        //         setTable((prev) =>
        //             prev.map((row) =>
        //                 row.TempId === selectedRow.TempId
        //                     ? { ...row, isActive: newStatus }
        //                     : row
        //             )
        //         );

        //         fetchTemplates(selectedStatus, page, pageSize, search);
        //     }
        // } catch (error) {
        //     console.error("Error updating template:", error);
        // }
    };

    const [loadList, setLoadList] = useState([]);
    const loadTableState = useSelector((state) => state.academic.loadTableState || {});
    const loadTable = loadTableState.data.data || [];
    const loadTotalRows = loadTableState.data.totalRecords || 0;
    const loadLoading = loadTableState.loading || false;
    const [loadCurrentPage, setLoadTableCurrentPage] = useState(1);
    const [loadRowsPerPage, setLoadTableRowsPerPage] = useState(10);
    const [loadTableSearchFilter, setLoadTableFilterText] = useState("");


    useEffect(() => {
        dispatch(fetchFacultyLoadRowTableData(loadId, loadCurrentPage, loadRowsPerPage, loadTableSearchFilter));
    }, [loadId, facultyLoadCurrentPage, facultyLoadRowsPerPage, facultyLoadTableSearchFilter, dispatch]);

    useEffect(() => {
        if (loadTable.length === 0) return;
        setLoadList(loadTable);
        setAdviserName(loadTable[0]?.AssignedTeacher);
        setSectionName(loadTable[0].SectionName);
        setLevelName(loadTable[0]?.LevelName);
        setCreatedBy(loadTable[0]?.CreatedByFullname);
    }, [loadTable]);
    console.log(loadTable);
    const loadColumn = [
        { name: 'Assigned Teacher', selector: row => row.TeacherFullname, sortable: true, wrap: true },
        { name: 'Subject Code', selector: row => row.SubjectCode, sortable: true },
        { name: 'Subject Name', selector: row => row.SubjectName, sortable: true },
        { name: 'Subject Type', selector: row => row.SubjectType, sortable: true },
        { name: 'Subject Unit', selector: row => row.SubjectUnit, sortable: true },
        { name: 'Room', selector: row => row.Room, sortable: true },
        { name: 'Start Time', selector: row => formatToAMPM(row.StartTime), sortable: true, wrap: true, grow: 3 },
        { name: 'End Time', selector: row => formatToAMPM(row.EndTime), sortable: true, wrap: true, grow: 3 },
        {
            name: 'Term Available',
            cell: (row) => (
                <div className="flex gap-3 m-1">
                    {["Term1", "Term2", "Term3"].map((t, i) => (
                        <label key={t} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={row[t] === "true" || row[t] === true}
                                readOnly
                            />
                            T{i + 1}
                        </label>
                    ))}
                </div>
            ),
            sortable: true,
            wrap: true,
            grow: 3,
            style: {
                whiteSpace: 'normal'
            }
        },
        { name: 'Date Created', selector: row => formatDate(row.DateCreated), sortable: true , wrap: true},
    ];


    return (
        // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            Faculty Load Master List
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
                            value={facultyLoadTableSearchFilter}
                            onChange={(e) => {
                                setFacultyLoadTableFilterText(e.target.value);
                                setFacultyCurrentPage(1);
                            }}
                        />
                    </div>

                </div>
                <div className="w-full">
                    <DataTable
                        columns={facultyLoadColumn}
                        data={facultyLoadList}
                        progressPending={facultyLoadLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={facultyLoadTotalRows}
                        paginationDefaultPage={facultyLoadCurrentPage}
                        onChangePage={(page) => setFacultyLoadTableCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setFacultyLoadTableCurrentPage(newPerPage);
                            setFacultyLoadTableRowsPerPage(page);
                        }}
                        highlightOnHover
                        responsive
                    />
                </div>

            </div>
            <ModalComponent
                isOpen={addNewModal}
                onClose={() => setAddNewModal(false)}
                title="Create subject schedule template"
                body={
                    <div>
                        <div className="mt-6 relative overflow-hidden">
                            <h2 className="my-4 text-xl font-bold text-green-500">
                                List of Subject Schedule Created
                            </h2>
                            <div className="flex justify-center gap-6 mb-4">

                                <SearchableSelect
                                    options={sectionList}
                                    value={selectedSection}
                                    onChange={(selected) => handleSelectedSection(selected)}
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
                                        className="mt-2 shadow-xs border text-sm rounded-lg block w-full p-2.5 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <SearchableSelect
                                    options={adviserList}
                                    value={selectedAdviser}
                                    onChange={(selected) => setSelectedAdviser(selected)}
                                    placeholder="-- Select Adviser --"
                                    label="Assign Teacher Adviser"
                                />
                            </div>
                            <hr className="my-4 border-t border-gray-300" />
                            <div className="w-full overflow-y-auto max-h-[300px]">
                                <DataTable
                                    columns={subjectColumns}
                                    data={subjectList}
                                    progressPending={subjectLoading}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={subjectTotalRows}
                                    paginationDefaultPage={subjectCurrentPage}
                                    onChangePage={(page) => setSubjectCurrentPage(page)}
                                    onChangeRowsPerPage={(newPerPage, page) => {
                                        setSubjectRowsPerPage(newPerPage);
                                        setSubjectCurrentPage(page);
                                    }}
                                    highlightOnHover
                                    striped
                                    responsive
                                    noDataComponent="No subjects added yet"
                                />
                            </div>
                        </div>
                    </div>
                }
                size="w-[1200px]"
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
                        onClick: handleSubmitModal
                    },
                    { label: "No", type: "red", onClick: () => console.log("No clicked") },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={successModalTitle}
                body={<p>{successModalBody}</p>}
            />
            <ModalComponent
                isOpen={rowModalOpen}
                onClose={() => setRowModalOpen(false)}
                title="Faculty Load"
                body={
                    <div>
                        <div className="mt-6 relative overflow-hidden">
                            <div className="flex justify-center gap-6 mb-4">
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Adviser Name
                                    </label>

                                    <input
                                        type="text"
                                        value={adviserName || ""}
                                        disabled
                                        className="mt-2 w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Section Name
                                    </label>

                                    <input
                                        type="text"
                                        value={sectionName || ""}
                                        disabled
                                        className="mt-2 w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Level Name
                                    </label>
                                    <input
                                        type="text"
                                        value={levelName || ""}
                                        disabled
                                        className="mt-2 w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-large font-bold">
                                        Created By
                                    </label>
                                    <input
                                        type="text"
                                        value={createdBy || ""}
                                        disabled
                                        className="mt-2 w-full border-0 border-b border-gray-500 
                                        bg-transparent text-gray-900 
                                        text-center
                                        focus:outline-none"
                                    />
                                </div>
                            </div>
                            <hr className="my-4 border-t border-gray-300" />
                            <div className="w-full overflow-y-auto max-h-[300px]">
                                <DataTable
                                    columns={loadColumn}
                                    data={loadList}
                                    progressPending={loadLoading}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={loadTotalRows}
                                    paginationDefaultPage={loadCurrentPage}
                                    onChangePage={(page) => setLoadTableCurrentPage(page)}
                                    onChangeRowsPerPage={(newPerPage, page) => {
                                        setLoadTableRowsPerPage(newPerPage);
                                        setLoadTableCurrentPage(page);
                                    }}
                                    highlightOnHover
                                    striped
                                    responsive
                                    noDataComponent="No faculty load data."
                                />
                            </div>
                        </div>
                    </div>
                }
                size="w-[1200px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
                ]}
            />
        </div>
    );
};
export default FacultyEntryComponent;