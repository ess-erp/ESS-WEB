import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Eye, CheckCircle, XCircle, Download, FileText, Pencil, Upload } from "lucide-react";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { fetchStudentDocumentsListData, fetchStudentDocumentDetailsData, uploadStudentDocumentData } from "../../states/SruState/Action";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import InputFileField from "../ButtonsComponents/InputFileField";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import OutlineRedBtn from "../ButtonsComponents/OutlineRedBtn";

const StudentDocumentsTableComponent = ({ studentId }) => {
    const dispatch = useDispatch();
    const formatDate = getFormatDate;

    // Get user data from localStorage
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;

    // State for documents data from Redux
    const documentsState = useSelector((state) => state.sru.studentDocumentsListState || {});
    const documentsData = documentsState.data?.data || [];
    const totalRows = documentsState.data?.totalRecords || 0;
    const isLoading = documentsState.loading || false;

    // State for document details from Redux
    const documentDetailsState = useSelector((state) => state.sru.studentDocumentDetailsState || {});
    const documentDetails = documentDetailsState.data || {};
    const isLoadingDetails = documentDetailsState.loading || false;

    // State for upload from Redux
    const uploadState = useSelector((state) => state.sru.uploadStudentDocumentState || {});
    const isUploading = uploadState.loading || false;
    const uploadSuccess = uploadState.success || false;

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchFilter, setSearchFilter] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (!studentId) return;
        
        dispatch(fetchStudentDocumentsListData(studentId, currentPage, rowsPerPage, searchFilter));
    }, [studentId, currentPage, rowsPerPage, searchFilter, dispatch]);

    console.log(documentsData);

    const columns = [
        {
            name: 'Document Name',
            selector: row => row.DocName,
            sortable: true,
            grow: 2
        },
        // {
        //     name: 'Document Type',
        //     selector: row => row.DocumentType,
        //     sortable: true,
        //     grow: 1
        // },
        
        {
            name: 'Date Submitted',
            selector: row => formatDate(row.DateSubmitted),
            sortable: true,
            grow: 1
        },
        {
            name: 'Remarks',
            selector: row => row.Remarks,
            sortable: true,
            grow: 2
        },
        {
            name: 'Status',
            selector: row => row.ActiveStatus,
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.ActiveStatus === "Y" ? (
                        <CheckCircle size={16} className="text-green-500" />
                    ) : (
                        <XCircle size={16} className="text-red-500" />
                    )}
                    <span className={`
                        ${row.ActiveStatus === null ? "text-red-700" : ""}
                    `}>
                        {row.ActiveStatus}
                    </span>
                </div>
            ),
            grow: 1
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2 items-center">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleView(row)}
                        title="View Document"
                    >
                        <Eye size={18} />
                    </button>
                       <button
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        onClick={() => handleEdit(row)}
                        title="Edit Document"
                    >
                        <Pencil size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "100px",
        }
    ];

    const handleView = (row) => {
        console.log("View document:", row);
        setSelectedDocument(row);
        setIsViewModalOpen(true);
        
        // Fetch document details if rowDocChildId exists
        if (row.DocChildId) {
            dispatch(fetchStudentDocumentDetailsData(row.DocChildId));
        }
    };

    const handleEdit = (row) => {
        console.log("Edit document:", row);
        setSelectedDocument(row);
        setSelectedFile(null);
        setIsUploadModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUploadSubmit = async () => {
        if (!selectedFile || !selectedDocument) {
            alert("Please select a file to upload");
            return;
        }

        if (!userId) {
            alert("User ID not found");
            return;
        }

        const result = await dispatch(
            uploadStudentDocumentData(
                selectedDocument.DocTempChildId,
                studentId,
                userId,
                selectedFile
            )
        );

        if (result.ok) {
            alert("Document uploaded successfully!");
            setIsUploadModalOpen(false);
            setSelectedFile(null);
            setSelectedDocument(null);
            // Refresh the documents list
            dispatch(fetchStudentDocumentsListData(studentId, currentPage, rowsPerPage, searchFilter));
        } else {
            alert("Failed to upload document");
        }
    };

    const handleDownload = () => {
        if (documentDetails?.fileUrl) {
            const link = document.createElement('a');
            link.href = documentDetails.fileUrl;
            link.download = selectedDocument?.DocName || 'document';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const isImageFile = (fileType) => {
        if (!fileType) return false;
        const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        return imageTypes.includes(fileType.toLowerCase());
    };

    const renderDocumentPreview = () => {
        // Check if no document is selected or DocChildId is null/undefined
        if (!selectedDocument || !selectedDocument.DocChildId || selectedDocument.DocChildId === null) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <FileText size={48} className="mb-3" />
                    <p className="text-lg">No preview available</p>
                </div>
            );
        }

        if (isLoadingDetails) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (documentDetails?.fileType && isImageFile(documentDetails.fileType)) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <img
                        src={documentDetails.fileUrl}
                        alt={selectedDocument?.DocName}
                        className="max-w-full max-h-96 object-contain rounded border"
                    />
                </div>
            );
        }

        // For non-image files (PDF, DOC, etc.)
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <FileText size={64} className="text-blue-600 mb-4" />
                <p className="text-lg font-medium mb-2">{selectedDocument?.DocName}</p>
                <p className="text-sm text-gray-600 mb-4">
                    {documentDetails?.fileType || 'Document'}
                </p>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    <Download size={18} />
                    Download File
                </button>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-green-600">
                        Documents / Requirements List
                    </h3>
                    <p className="text-xs text-gray-600">
                        List of documents submitted by the student
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="px-3 py-2 border border-gray-300 rounded w-64"
                        value={searchFilter}
                        onChange={(e) => {
                            setSearchFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="p-4">
                <DataTable
                    columns={columns}
                    data={documentsData}
                    progressPending={isLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationDefaultPage={currentPage}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setRowsPerPage(newPerPage);
                        setCurrentPage(page);
                    }}
                    highlightOnHover
                    responsive
                />
            </div>

            {/* View Document Modal */}
            <ModalComponent
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedDocument(null);
                }}
                title="Document Preview"
            >
                <div className="min-h-[300px]">
                    {renderDocumentPreview()}
                </div>
            </ModalComponent>

            {/* Upload Document Modal */}
            <ModalComponent
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    setSelectedDocument(null);
                    setSelectedFile(null);
                }}
                title="Upload Document"
            >
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Document Name: <span className="font-semibold text-green-600">{selectedDocument?.DocName}</span>
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select File
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer"
                        />
                        {selectedFile && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <OutlineRedBtn
                            onClick={() => {
                                setIsUploadModalOpen(false);
                                setSelectedDocument(null);
                                setSelectedFile(null);
                            }}
                            disabled={isUploading}
                        >
                            Cancel
                        </OutlineRedBtn>
                        <GreenBtn
                            onClick={handleUploadSubmit}
                            disabled={isUploading || !selectedFile}
                        >
                            {isUploading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Uploading...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Upload size={16} />
                                    Upload
                                </div>
                            )}
                        </GreenBtn>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default StudentDocumentsTableComponent;
