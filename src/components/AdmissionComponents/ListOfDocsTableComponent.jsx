import { Pencil, Eye } from "lucide-react";
import DataTable from 'react-data-table-component';
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchDocumentTableData,
    fetchInsertDocumentData,
} from "../../states/AdmissionState/Action";

const ListOfDocsTableComponent = ({ appId }) => {
    const baseUrl = import.meta.env.VITE_FILE_URL;

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const currentUserId = user.UserId;

    const dispatch = useDispatch();
    const documentTableState = useSelector((state) => state.admission.documentTableState || {});
    const documents = documentTableState.data?.data || [];
    const totalRows = documentTableState.data?.totalRecords || 0;
    const loading = documentTableState.loading || false;

    console.log(documents);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchDocumentTableData(appId, page, pageSize, search));
    }, [dispatch, appId, page, pageSize, search]);

    const [fixedDocId, setFixedDocId] = useState(0);

    useEffect(() => {
        if (page === 1 && documents.length > 0 && fixedDocId === 0) {
            setFixedDocId(documents[0].DocId ?? 0);
        }
    }, [documents, page, fixedDocId]);

    // View modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState({ name: "", image: "" });

    const openModal = (doc) => {
        setSelectedDoc({
            name: doc.TempDocName,
            image: doc?.DocFilePath ? baseUrl + doc.DocFilePath : null,
        });
        setIsModalOpen(true);
    };

    // Edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editDoc, setEditDoc] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const openEditModal = (doc) => {
        setEditDoc(doc);
        setSelectedFile(null); // 🔹 reset file when opening new modal
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditDoc(null);      // 🔹 reset doc
        setSelectedFile(null); // 🔹 reset file
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        if (!editDoc) {
            alert("No document selected.");
            return;
        }

        const form = {
            DocTempId: editDoc.DocTempId,
            DocTempChildId: editDoc.DocTempChildId,
            Value: selectedFile,
            StudentId: editDoc.StudentId,
            UploaderUserId: currentUserId,
        }
        console.log(form);
        const formData = new FormData();

        for (const key in form) {
            formData.append(key, form[key]);
        }

        dispatch(fetchInsertDocumentData(formData))
        setIsEditModalOpen(false);
        setSelectedFile(null);
    };

    const columns = [
        {
            name: "Document Title",
            selector: row => row.TempDocName,
            sortable: true,
            wrap: true
        },
        {
            name: "Date Submitted",
            selector: row => row.DateCreated
                ? new Date(row.DateCreated).toLocaleDateString()
                : "—",
            sortable: true
        },
        {
            name: "Actions",
            cell: row => (
                <div className="flex gap-2 justify-end w-full">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => openModal(row)}
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        className="p-1 text-green-600 hover:text-green-800"
                        onClick={() => openEditModal(row)}
                    >
                        <Pencil size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            right: true
        }
    ];

    // Custom loader component
    const Loader = () => (
        <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
        </div>
    );

    return (
        <>
            <DataTable
                title={
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-green-700">List of Documents</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border rounded w-52 text-sm"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                }
                columns={columns}
                data={documents}
                progressPending={loading}
                progressComponent={<Loader />}
                noDataComponent={
                    <div className="py-10 text-center text-gray-500 font-medium">
                        No records found. Please check the template module if the template is disabled.
                    </div>
                }
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={page}
                onChangePage={(newPage) => setPage(newPage)}
                onChangeRowsPerPage={(newPageSize, newPage) => {
                    setPageSize(newPageSize);
                    setPage(newPage);
                }}
                highlightOnHover
                striped
                responsive
            />

            {/* View Modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">{selectedDoc.name}</span>}
                body={
                    selectedDoc.image ? (
                        <div className="flex justify-center">
                            <img
                                src={selectedDoc.image}
                                alt={selectedDoc.name}
                                className="max-h-[400px] rounded shadow"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500">No image available</p>
                    )
                }
                buttons={[
                    { label: "Close", type: "red", onClick: () => setIsModalOpen(false) }
                ]}
                size="w-[800px]"
            />

            {/* Edit Modal */}
            <ModalComponent
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                title={
                    <span className="font-bold text-lg text-blue-700">
                        Edit Document - {editDoc?.TempDocName}
                    </span>
                }
                body={
                    <div className="flex flex-col gap-4">
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            className="w-full text-slate-500 font-medium text-sm bg-white border 
                           file:cursor-pointer cursor-pointer file:border-0 file:py-3 
                           file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 
                           file:text-slate-500 rounded"
                        />

                        {/* Centered Preview */}
                        {selectedFile && (
                            <div className="flex flex-col items-center mt-2">
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="2x2 Preview"
                                    className="w-32 h-32 object-cover rounded shadow"
                                />
                                <p className="text-sm text-gray-600 mt-2">
                                    Selected File:{" "}
                                    <span className="font-medium">{selectedFile.name}</span>
                                </p>
                            </div>
                        )}
                    </div>
                }
                buttons={[
                    { label: "Cancel", type: "red", onClick: () => setIsEditModalOpen(false) },
                    { label: "Upload", type: "green", onClick: handleUpload }
                ]}
                size="w-[600px]"
            />

        </>
    );
};

export default ListOfDocsTableComponent;
