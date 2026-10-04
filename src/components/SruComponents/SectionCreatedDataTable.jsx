import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import SchoolYearDropdown from '../ButtonsComponents/SchoolYearDropdown';
import {
    fetchGetStudentSectionListData,
} from "../../states/SruState/Action";

const SectionCreatedDataTable = () => {
    const dispatch = useDispatch();
    const studentSectionListState = useSelector((state) => state.sru.studentSectionListState || {});
    const studentList = studentSectionListState.data.data || [];
    const studentTableTotalRows = studentSectionListState.data.totalRecords || 0;
    const studentTableLoading = studentSectionListState.loading || false;
    
    const [filterStudentTableText, setStudentTableFilterText] = useState('');
    const [studentTableCurrentPage, setStudentTableCurrentPage] = useState(1);
    const [studentTableRowsPerPage, setStudentTableRowsPerPage] = useState(10);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('');

    // Modal States
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [studentsInSection, setStudentsInSection] = useState([]);

    useEffect(() => {
        dispatch(fetchGetStudentSectionListData(
            studentTableCurrentPage, 
            studentTableRowsPerPage, 
            filterStudentTableText,
            selectedSchoolYear
        ));
    }, [studentTableCurrentPage, studentTableRowsPerPage, filterStudentTableText, selectedSchoolYear, dispatch]);

    // ============================================================================
    // HANDLE VIEW - Show all students in the section
    // ============================================================================
    const handleView = (row) => {
        console.log('View section:', row);
        setSelectedSection(row);
        // TODO: Fetch students in this section from backend
        // For now, using mock data
        setStudentsInSection([
            // This should come from API call
        ]);
        setIsViewModalOpen(true);
    };

    // ============================================================================
    // HANDLE EDIT - Add/Remove students
    // ============================================================================
    const handleEdit = (row) => {
        console.log('Edit section:', row);
        setSelectedSection(row);
        // TODO: Fetch students in this section from backend
        setStudentsInSection([
            // This should come from API call
        ]);
        setIsEditModalOpen(true);
    };

    // ============================================================================
    // HANDLE DELETE - Change status to DR (Deleted Record)
    // ============================================================================
    const handleDelete = (row) => {
        console.log('Delete section:', row);
        setSelectedSection(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        console.log('Confirm delete section:', selectedSection);
        // TODO: Call API to change ActiveStatus to 'DR'
        // await dispatch(deleteSectionData(selectedSection.SectionId));
        setIsDeleteModalOpen(false);
        // Refresh table after delete
        dispatch(fetchGetStudentSectionListData(
            studentTableCurrentPage, 
            studentTableRowsPerPage, 
            filterStudentTableText,
            selectedSchoolYear
        ));
    };

    // ============================================================================
    // TABLE COLUMNS
    // ============================================================================
    const studentColumn = [
        { name: 'Section', selector: row => row.SectionName, sortable: true },
        { name: 'Level', selector: row => row.LevelName, sortable: true },
        { name: 'Campus', selector: row => row.CampusName, sortable: true },
        { name: 'School Year', selector: row => row.SchoolYear, sortable: true },
        { name: 'No. of Students', selector: row => row.StudentCount, sortable: true },
        { name: 'Date Created', selector: row => new Date(row.DateCreated).toLocaleDateString(), sortable: true },
        { name: 'Date Modified', selector: row => new Date(row.DateModified).toLocaleDateString(), sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Students"
                    >
                        <FaEye size={18} />
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Edit Section"
                    >
                        <FaEdit size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Section"
                    >
                        <FaTrash size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: '120px',
        },
    ];
    
    return (
        <>
            <div className="p-6 mt-8 bg-white rounded shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-green-700">
                        List of Sections with Assigned Students
                    </h2>

                    <div className="flex items-center gap-2">
                        <SchoolYearDropdown
                            value={selectedSchoolYear}
                            onChange={(e) => {
                                setSelectedSchoolYear(e.target.value);
                                setStudentTableCurrentPage(1);
                            }}
                        />

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

            {/* ============================================================================ */}
            {/* VIEW MODAL - Show all students in section */}
            {/* ============================================================================ */}
            <ModalComponent
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title={
                    <span className="font-bold text-lg text-blue-700">
                        View Students in {selectedSection?.SectionName}
                    </span>
                }
                body={
                    <div className="max-h-96 overflow-y-auto">
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                <strong>Level:</strong> {selectedSection?.LevelName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Campus:</strong> {selectedSection?.CampusName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>School Year:</strong> {selectedSection?.SchoolYear}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Total Students:</strong> {selectedSection?.StudentCount}
                            </p>
                        </div>
                        
                        <hr className="my-4" />
                        
                        <h4 className="font-semibold mb-2">Students List:</h4>
                        {studentsInSection.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Student Number</th>
                                        <th className="p-2 text-left">Full Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsInSection.map((student, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">{student.StudentNumber}</td>
                                            <td className="p-2">{student.FullName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 italic">
                                Loading students... (TODO: Implement API call)
                            </p>
                        )}
                    </div>
                }
                size="w-[600px]"
                buttons={[
                    { label: "Close", type: "blue", onClick: () => setIsViewModalOpen(false) }
                ]}
            />

            {/* ============================================================================ */}
            {/* EDIT MODAL - Add/Remove students */}
            {/* ============================================================================ */}
            <ModalComponent
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={
                    <span className="font-bold text-lg text-green-700">
                        Edit Section: {selectedSection?.SectionName}
                    </span>
                }
                body={
                    <div className="max-h-96 overflow-y-auto">
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                <strong>Level:</strong> {selectedSection?.LevelName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Campus:</strong> {selectedSection?.CampusName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>School Year:</strong> {selectedSection?.SchoolYear}
                            </p>
                        </div>
                        
                        <hr className="my-4" />
                        
                        <p className="text-gray-700 mb-4">
                            TODO: Implement student add/remove functionality
                        </p>
                        
                        {/* TODO: Add search/select for adding students */}
                        {/* TODO: Show current students with remove buttons */}
                    </div>
                }
                size="w-[700px]"
                buttons={[
                    { label: "Save Changes", type: "green", onClick: () => {
                        // TODO: Save changes
                        setIsEditModalOpen(false);
                    }},
                    { label: "Cancel", type: "red", onClick: () => setIsEditModalOpen(false) }
                ]}
            />

            {/* ============================================================================ */}
            {/* DELETE MODAL - Confirm deletion */}
            {/* ============================================================================ */}
            <ModalComponent
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={
                    <span className="font-bold text-lg text-red-700">
                        Delete Section
                    </span>
                }
                body={
                    <div>
                        <p className="mb-4">
                            Are you sure you want to delete the section <strong>{selectedSection?.SectionName}</strong>?
                        </p>
                        <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
                            <p className="text-sm text-gray-700">
                                <strong>Note:</strong> This will change the section status to "DR" (Deleted Record). 
                                All students will be removed from this section.
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Section: {selectedSection?.SectionName}<br />
                                Level: {selectedSection?.LevelName}<br />
                                Campus: {selectedSection?.CampusName}<br />
                                Students: {selectedSection?.StudentCount}
                            </p>
                        </div>
                    </div>
                }
                buttons={[
                    { label: "Yes, Delete", type: "red", onClick: confirmDelete },
                    { label: "Cancel", type: "blue", onClick: () => setIsDeleteModalOpen(false) }
                ]}
            />
        </>
    );
};

export default SectionCreatedDataTable;