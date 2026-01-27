import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/SharedComponents/Sidebar";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../../components/ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../../components/ButtonsComponents/SearchableSelect";
import {
    fetchLevelData,
} from "../../states/AdmissionState/Action";
import {
    fetchCampusData,
} from "../../states/OnlineApplicationState/Action";
import {
    fetchGetSectionNameData,
    fetchInsertSectionNameData,
    fetchGetEnrolledStudentData,
    fetchInsertStudentSectionData,
    fetchGetStudentSectionListData,
} from "../../states/SruState/Action";

const CreateSection = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        document.title = "Create Section";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/sru/dashboard" },
        { label: "Create Section", href: "/sru/CreateSection" }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;
    const levelState = useSelector((state) => state.admission.levelState || {});
    const level = levelState.data || [];
    const [levelList, setLevelList] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);

    const campusState = useSelector((state) => state.online.campusState || {});
    const campus = campusState.data || [];
    const [campusList, setCampusList] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState(null);

    const [sectionName, setSectionName] = useState("");
    const [remarks, setRemarks] = useState("");

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [modalSuccessBody, setModalSuccessBody] = useState("");
    useEffect(() => {
        setLevelList(
            (level || []).map(item => ({
                value: item.LevelId,
                label: item.LevelName,
            }))
        );

        setCampusList(
            (campus || []).map(item => ({
                value: item.CampusId,
                label: item.CampusName,
            }))
        );
    }, [level, campus]);

    const [addNewModal, setAddNewModal] = useState(false);
    const openAddNewModal = () => {
        setAddNewModal(true);
        dispatch(fetchLevelData());
        dispatch(fetchCampusData());
    };

    const handleSubmitModal = async () => {

        console.log(selectedLevel);
        const payload = {
            SectionName: sectionName,
            LevelId: selectedLevel.value,
            CampusId: selectedCampus.value,
            Remarks: remarks,
            CreatedByUserId: userId,
        };

        const res = await dispatch(fetchInsertSectionNameData(payload));

        if (res.ok) {
            setModalSuccessBody("Done creating a section!");
            setIsSuccessModalOpen(true);
            setTimeout(() => window.location.reload(), 3000);
        }
    };

    const [inactiveSections, setInactiveSections] = useState([]);
    const sectionTableState = useSelector((state) => state.sru.sectionTableState || {});
    const sectionTable = sectionTableState.data.data || [];
    const sectionTotalRows = sectionTableState.data.totalRecords || 0;
    const sectionLoading = sectionTableState.loading || false;
    const [filterSectionText, setSectionFilterText] = useState('');
    const [sectionCurrentPage, setSectionCurrentPage] = useState(1);
    const [sectionRowsPerPage, setSectionRowsPerPage] = useState(10);

    useEffect(() => {
       dispatch(fetchGetSectionNameData(sectionCurrentPage,sectionRowsPerPage,filterSectionText));
    }, [sectionCurrentPage, sectionRowsPerPage, filterSectionText, dispatch]);
    useEffect(() => {
        if (sectionTable.length == 0) return;
        setInactiveSections(sectionTable);
    }, [sectionTable]);

    console.log(inactiveSections);
    const inactiveColumns = [
        { name: 'Section', selector: row => row.SectionName, sortable: true },
        { name: 'Level', selector: row => row.LevelName, sortable: true },
        { name: 'Campus', selector: row => row.CampusName, sortable: true },
        {
            name: "Action",
            cell: row => (
                <button
                    onClick={() => handleActivate(row)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                    Activate
                </button>
            )
        }
    ];
    const [activeSections, setActiveSections] = useState([]);
    const handleActivate = (row) => {
        setActiveSections(prev => [...prev, row]);

        setInactiveSections(prev =>
            prev.filter(s => s.SectionId !== row.SectionId)
        );
    };
    const handleDeactivate = (row) => {
        setActiveSections(prev =>
            prev.filter(s => s.SectionId !== row.SectionId)
        );

        setInactiveSections(prev => [...prev, row]);

        setSelectedSection(null);
        setAddedStudents([]);
    };
    const activeColumns = [
        { name: "Section", selector: row => row.SectionName, sortable: true },
        { name: "Level", selector: row => row.LevelName, sortable: true },
        {
            name: "Actions",
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSelectSection(row)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                        Add Student
                    </button>
                    <button
                        onClick={() => handleDeactivate(row)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                        Deactivate
                    </button>
                </div>
            )
        }

    ];

    const enrolledStudentState = useSelector((state) => state.sru.enrolledStudentState || {});
    const studentTable = enrolledStudentState.data.data || [];
    const studentTotalRows = enrolledStudentState.data.totalRecords || 0;
    const studentLoading = enrolledStudentState.loading || false;
    const [filterStudentText, setStudentFilterText] = useState('');
    const [studentCurrentPage, setStudentCurrentPage] = useState(1);
    const [studentRowsPerPage, setStudentRowsPerPage] = useState(10);
    console.log(studentTable);
    const [selectedSection, setSelectedSection] = useState(null);


    const handleSelectSection = async (section) => {
        setSelectedSection(section);
        dispatch(fetchGetEnrolledStudentData(
            section.LevelId,
            studentCurrentPage,
            studentRowsPerPage,
            filterStudentText
        ));
    };
    useEffect(() => {
        if (!selectedSection) return;
        setAvailableStudents(studentTable);
    }, [studentTable]);

    const toAddStudentColumn = [
        { name: "Fullname", selector: row => `${row.Fname} ${row.Mname ?? ""} ${row.Lname}`, sortable: true },
    ];

    const [selectedAvailableStudents, setSelectedAvailableStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedAddedStudents, setSelectedAddedStudents] = useState([]);
    const [addedStudents, setAddedStudents] = useState([]);
    const [resetAvailableToggle, setResetAvailableToggle] = useState(false);
    const [resetAddedToggle, setResetAddedToggle] = useState(false);

    const addedStudentColumns = [
        {
            name: "Fullname",
            selector: row =>
                `${row.Fname} ${row.Mname ?? ""} ${row.Lname}`,
            sortable: true,
        },
    ];
    const handleAddSelectedStudents = () => {
        setAddedStudents(prev => {
            const newStudents = selectedAvailableStudents.filter(
                s => !prev.some(p => p.StudentId === s.StudentId)
            );
            return [...prev, ...newStudents];
        });

        setAvailableStudents(prev =>
            prev.filter(
                s => !selectedAvailableStudents.some(a => a.StudentId === s.StudentId)
            )
        );

        setSelectedAvailableStudents([]);

        setResetAvailableToggle(prev => !prev);
    };
    const handleRemoveSelectedStudents = () => {
        setAddedStudents(prev =>
            prev.filter(
                s => !selectedAddedStudents.some(a => a.StudentId === s.StudentId)
            )
        );

        setAvailableStudents(prev => [...prev, ...selectedAddedStudents]);

        setSelectedAddedStudents([]);

        setResetAddedToggle(prev => !prev);
    };
    const [isWarningModal, setIsWarningModal] = useState(false);
    const handleSubmitStudent = async () => {
        console.log(addedStudents);
        console.log(selectedSection);
        const payload = {
            SectionId: selectedSection.SectionId,
            CreatedByUserId: userId,
            SectionListChildDtos: addedStudents.map(r => ({
                StudentId: r.StudentId,
                StudentNumber: r.StudentNumber
            }))
        }
        console.log(payload);
        const res = await dispatch(fetchInsertStudentSectionData(payload));

        if (res.ok) {
            setModalSuccessBody(`Done saving student from this section - ${selectedSection.SectionName}`);
            setIsSuccessModalOpen(true);
            setTimeout(() => window.location.reload(), 3000);
        }
    };


    const studentSectionListState = useSelector((state) => state.sru.studentSectionListState || {});
    const studentList = studentSectionListState.data.data || [];
    const studentTableTotalRows = studentSectionListState.data.totalRecords || 0;
    const studentTableLoading = studentSectionListState.loading || false;
    const [filterStudentTableText, setStudentTableFilterText] = useState('');
    const [studentTableCurrentPage, setStudentTableCurrentPage] = useState(1);
    const [studentTableRowsPerPage, setStudentTableRowsPerPage] = useState(10);
    console.log(studentList);
    useEffect(() => {
        dispatch(fetchGetStudentSectionListData(sectionCurrentPage,sectionRowsPerPage,filterSectionText ));
    }, [studentTableCurrentPage, studentTableRowsPerPage, filterStudentTableText, dispatch]);
    useEffect(() => {
        if (studentList.length == 0) return;
        setInactiveSections(studentList);
    }, [studentList]);

    const studentColumn = [
        { name: 'Student Number', selector: row => row.StudentNumber, sortable: true },
        { name: 'Fullname', selector: row => `${row.Fname} ${row.Mname ?? ""} ${row.Lname}`, sortable: true },
        { name: 'Section', selector: row => row.SectionName, sortable: true },
        { name: 'Level', selector: row => row.LevelName, sortable: true },
        { name: 'Date Added', selector: row => new Date(row.DateCreated).toLocaleDateString(), sortable: true },
    ];
    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />

            <div className="flex-1 h-screen bg-gray-50 px-6 py-4 overflow-auto">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />

                    <h2 className="text-sm font-bold text-black mt-2">Create Section</h2>
                    <hr className="border-t-1 border-solid border-gray-400 my-6" />
                    <div className="flex justify-center mb-2">
                        <h2 className="text-2xl font-bold text-green-700 mt-2">
                            Section Entry
                        </h2>
                    </div>
                    <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 pt-3 rounded relative" role="alert">
                        <strong className="font-bold">Note: </strong>
                        <span className="block sm:inline">For creation of section please use the tables below.</span>
                    </div>
                </div>
                {/* SECTION TABLES */}
                <div className="flex flex-col md:flex-row gap-6 mt-6">

                    {/* LEFT – Inactive Sections */}
                    <div className="md:w-1/2 bg-white rounded-lg shadow border border-gray-200">
                        <div className="px-4 py-3 border-b bg-red-50 rounded-t-lg flex items-center justify-between">
                            {/* Left: Title */}
                            <div>
                                <h3 className="text-lg font-semibold text-red-600">
                                    Inactive Sections
                                </h3>
                                <p className="text-xs text-gray-600">
                                    Sections not yet available for students
                                </p>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-3">
                                <OutlineBlueBtn
                                    label="Add new"
                                    onClick={openAddNewModal}
                                />

                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="px-3 py-2 border border-gray-300 rounded w-64"
                                    value={filterSectionText}
                                    onChange={(e) => {
                                        setSectionFilterText(e.target.value);
                                        setSectionCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-4">
                            <DataTable
                                columns={inactiveColumns}
                                data={inactiveSections}
                                progressPending={sectionLoading}
                                pagination
                                paginationServer
                                paginationTotalRows={sectionTotalRows}
                                paginationDefaultPage={sectionCurrentPage}
                                onChangePage={(page) => setSectionCurrentPage(page)}
                                onChangeRowsPerPage={(newPerPage, page) => {
                                    setSectionRowsPerPage(newPerPage);
                                    setSectionCurrentPage(page);
                                }}
                                highlightOnHover
                                responsive
                            />
                        </div>
                    </div>

                    {/* RIGHT – Active Sections */}
                    <div className="md:w-1/2 bg-white rounded-lg shadow border border-gray-200">
                        <div className="px-4 py-3 border-b bg-green-50 rounded-t-lg">
                            <h3 className="text-lg font-semibold text-green-600">
                                Active Sections
                            </h3>
                            <p className="text-xs text-gray-600">
                                Sections currently open for enrollment
                            </p>
                        </div>

                        <div className="p-4">
                            <DataTable
                                columns={activeColumns}
                                data={activeSections}
                                pagination
                                highlightOnHover
                                dense
                            />
                        </div>
                    </div>

                </div>

                {selectedSection && (
                    <div className="mt-8 bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold text-green-600 mb-4">
                            Manage Students – {selectedSection.LevelName} for Section - {selectedSection.SectionName}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* AVAILABLE STUDENTS */}
                            <div>
                                <div className="px-4 py-3 border-b bg-red-50 rounded-t-lg flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">Available Students</h3>

                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleAddSelectedStudents}
                                            disabled={!selectedAvailableStudents.length}
                                            className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                                        >
                                            Add Student
                                        </button>

                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="px-3 py-2 border border-gray-300 rounded w-64"
                                            value={filterStudentText}
                                            onChange={(e) => {
                                                setStudentFilterText(e.target.value);
                                                setStudentCurrentPage(1);
                                            }}
                                        />
                                    </div>
                                </div>
                                <DataTable
                                    columns={toAddStudentColumn}
                                    data={availableStudents}
                                    progressPending={studentLoading}
                                    selectableRows
                                    selectableRowsHighlight
                                    selectableRowsVisibleOnly
                                    clearSelectedRows={resetAvailableToggle}
                                    onSelectedRowsChange={({ selectedRows }) =>
                                        setSelectedAvailableStudents(selectedRows)
                                    }
                                    pagination
                                    paginationServer
                                    paginationTotalRows={studentTotalRows}
                                    paginationDefaultPage={studentCurrentPage}
                                    onChangePage={(page) => setStudentCurrentPage(page)}
                                    onChangeRowsPerPage={(newPerPage, page) => {
                                        setStudentRowsPerPage(newPerPage);
                                        setStudentCurrentPage(page);
                                    }}
                                    highlightOnHover
                                    responsive
                                />
                            </div>

                            {/* ADDED STUDENTS */}
                            <div>
                                <div className="px-4 py-3 border-b bg-green-50 rounded-t-lg flex justify-between mb-2">
                                    <h3 className="font-semibold">Added Students</h3>
                                    <button
                                        onClick={handleRemoveSelectedStudents}
                                        disabled={!selectedAddedStudents.length}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                                    >
                                        Remove Student
                                    </button>
                                </div>

                                <DataTable
                                    columns={addedStudentColumns}
                                    data={addedStudents}
                                    selectableRows
                                    selectableRowsHighlight
                                    clearSelectedRows={resetAddedToggle}
                                    onSelectedRowsChange={({ selectedRows }) =>
                                        setSelectedAddedStudents(selectedRows)
                                    }
                                    pagination
                                />
                            </div>

                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsWarningModal(true)}
                                disabled={!addedStudents.length}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg text-md font-medium
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Students
                            </button>
                        </div>
                    </div>
                )}
                <div className="p-6 mt-8 bg-white rounded shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-green-700">
                            List of Section Created
                        </h2>

                        <div className="flex items-center gap-2">

                            <input
                                type="text"
                                placeholder="Search..."
                                className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs"
                                value={filterStudentTableText}
                                onChange={(e) => {
                                    setStudentTableFilterText(e.target.value);
                                    setStudentTableCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                    <DataTable
                        columns={studentColumn}
                        data={studentList}
                        progressPending={studentTableLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={studentTableTotalRows}
                        paginationDefaultPage={studentTableCurrentPage}
                        onChangePage={(page) => setStudentTableCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setStudentTableRowsPerPage(newPerPage);
                            setStudentTableCurrentPage(page);
                        }}
                        highlightOnHover
                        responsive
                    />
                </div>
            </div>
            <ModalComponent
                isOpen={addNewModal}
                onClose={() => setAddNewModal(false)}
                title="Create a new section"
                body={
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <label className="flex flex-col">
                            <span className="text-sm font-medium mb-1">Section Name</span>
                            <input
                                type="text"
                                placeholder="Enter Section Name"
                                value={sectionName}
                                onChange={(e) => setSectionName(e.target.value)}
                                className="w-full rounded-lg border p-2"
                            />
                        </label>
                        <SearchableSelect
                            options={levelList}
                            value={selectedLevel}
                            onChange={(selected) => setSelectedLevel(selected)}
                            placeholder="-- Select Level --"
                            label="Select Level"
                        />

                        <SearchableSelect
                            options={campusList}
                            value={selectedCampus}
                            onChange={(selected) => setSelectedCampus(selected)}
                            placeholder="-- Select Campus --"
                            label="Select Campus"
                        />

                        <label className="flex flex-col">
                            <span className="text-sm font-medium mb-1">Remarks</span>
                            <input
                                type="text"
                                placeholder="Enter Remarks"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full rounded-lg border p-2"
                            />
                        </label>

                    </div>
                }
                size="w-[600px]"
                maxHeight="100vh"
                buttons={[
                    { label: "Submit", type: "green", onClick: handleSubmitModal },
                    { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={<p>{modalSuccessBody}</p>}
            // buttons={[
            //     { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
            // ]}
            />
            <ModalComponent
                isOpen={isWarningModal}
                onClose={() => setIsWarningModal(false)}
                title={<span className="font-bold text-lg text-red-700">Warning</span>}
                body={<p>Are you sure you want to submit?</p>}
                buttons={[
                    { label: "Yes", type: "green", onClick: handleSubmitStudent },
                    { label: "No", type: "red", onClick: () => setIsWarningModal(false) },
                ]}
            />
        </div>
    );
};

export default CreateSection;

