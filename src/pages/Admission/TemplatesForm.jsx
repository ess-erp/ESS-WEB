import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import { Pencil, Eye, Trash } from "lucide-react";
import DataTable from 'react-data-table-component';
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import { motion, AnimatePresence } from 'framer-motion';
import OutlineBlueBtn from "../../components/ButtonsComponents/OutlineBlueBtn";
import AddNewTemplateComponent from '../../components/AdmissionComponents/AddNewTemplateComponent';
import RowToggleComponent from '../../components/ButtonsComponents/RowToggleComponent';
import {
    fetchInsertTemplateFormData,
    fetchTemplateTableData,
    fetchRowTemplateTableData,
    fetchUpdateRowTemplateData,
} from '../../states/AdmissionState/Action';

const TemplatesForm = () => {
    const formRef = useRef();


    useEffect(() => {
        document.title = 'Templates Form';
    }, []);
    const dispatch = useDispatch();
    const breadcrumbItems = [
        { label: 'Dashboard', href: '/admission/dashboard' },
        { label: 'Templates', href: '/admission/templatesform' },
    ];
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const { loading, data, error } = useSelector((state) => state.admission.insertTemplateState);

    const [selectedStatus, setSelectedStatus] = useState("active");
    const [documents, setDocuments] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);

    const [templateType, setTemplateType] = useState("");
    const [templateTitle, setTemplateTitle] = useState("");
    const [divId, setDivId] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const fetchTemplates = async (status, page = 1, pageSize = 10, search) => {
        setLoadingTable(true);
        const tableType = status === "active" ? "active" : "draft";

        const result = await dispatch(fetchTemplateTableData(tableType, page, pageSize, search));

        if (result.ok) {
            const docsWithActive = (result.data || []).map(doc => ({
                ...doc,
                isActive: tableType === "active" ? true : doc.isActive ?? false,
            }));
            setDocuments(docsWithActive);
            setTotalRecords(result.totalRecords || 0);
        } else {
            console.error("Failed to fetch table data:", result.error);
            setDocuments([]);
        }

        setLoadingTable(false);
    };

    useEffect(() => {
        fetchTemplates(selectedStatus, page, pageSize, search);
    }, [selectedStatus, page, pageSize, dispatch]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePerRowsChange = (newPerPage, newPage) => {
        setPageSize(newPerPage);
        setPage(newPage);
    };


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedSize, setSeletedSize] = useState("");
    const openModal = (title, size) => {
        setSelectedTitle(title);
        setSeletedSize(size);
        setIsModalOpen(true);
    }

    const [rows, setRows] = useState([]);

    const CreatedByUserId = user.UserId;

    const [isFormValid, setIsFormValid] = useState(false);


    const handleSubmitForm = () => {

        if (formRef.current) {
            formRef.current.triggerValidation();
        }

        if (isFormValid) {

            let payload = {
                Title: templateTitle,
                TemplateType: templateType,
            };

            switch (templateType) {
                case "gpa":
                    payload = {
                        ...payload,
                        DivId: divId,
                        CreatedByUserId,
                        GpaTemplateChildDtos: rows,
                    };
                    break;

                case "document":
                    // CHANGED: DocumentTemplateChildDtos now only contains DocumentName and Remarks
                    // Removed DocumentTemplate field from the child rows
                    payload = {
                        ...payload,
                        CreatedByUserId,
                        DocumentTemplateChildDtos: rows, // rows = [{ DocumentName, Remarks }]
                    };
                    break;

                case "examroom":
                    payload = {
                        ...payload,
                        CreatedByUserId,
                        ExamRoomTemplateChildDtos: rows,
                    };
                    break;

                default:
                    throw new Error("Unknown template type");
            }

            console.log(payload);
            dispatch(fetchInsertTemplateFormData(payload));
            setIsModalOpen(false);
            return;
        }
        else {
            setIsModalOpen(true);
        }

    };


    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        if (!loading && data && data.length !== 0) {
            setIsSuccessModalOpen(true);
        }

        if (!loading && error) {
            alert("Error inserting template: " + error);
        }
    }, [loading, data, error]);

    const columns = [
        {
            name: "Template Title",
            selector: (row) => row.TempTitle,
            sortable: true,
            wrap: true,
        },
        {
            name: "Template Type",
            selector: (row) => row.TempType || "—",
            sortable: true,
            wrap: true,
        },
        {
            name: "Created by",
            selector: (row) => row.CreatedByFullname || "—",
            sortable: true,
            wrap: true,
        },
        {
            name: "Date Created",
            selector: (row) => row.DateCreated ? new Date(row.DateCreated).toLocaleDateString() : "—",
            sortable: true,
        },
        {
            name: "Date Modified",
            selector: (row) => row.DateModified ? new Date(row.DateModified).toLocaleDateString() : "—",
            sortable: true,
        },
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


    const handleToggleActive = async (selectedRow, newStatus) => {
        const CreatedByUserId = user.UserId;
        const activeStatus = newStatus ? "Y" : "DR";

        try {
            const result = await dispatch(fetchUpdateRowTemplateData(
                selectedRow.TemplateId,
                selectedRow.TempType,
                CreatedByUserId,
                activeStatus
            ));

            if (result.ok) {
                setDocuments(prev =>
                    prev.map(row =>
                        row.TemplateId === selectedRow.TemplateId
                            ? { ...row, isActive: newStatus } 
                            : row
                    )
                );

                fetchTemplates(selectedStatus, page, pageSize, search);
            }
        } catch (error) {
            console.error("Error updating template:", error);
        }
    };


    const [isOpenRowModal, setIsOpenRowModal] = useState(false);
    const [rowModalTitle, setRowModalTitle] = useState("");

    const rowTemplateTableState = useSelector((state) => state.admission.rowTemplateTableState || {});
    const rowTemplateTable = rowTemplateTableState.data.data || [];
    console.log(rowTemplateTable);
    const [rowColumns, setRowColumns] = useState([]);
    const generateColumns = (rowType, sampleRow) => {
        if (!sampleRow) return [];

        switch (rowType) {
            case "gpa":
                return [
                    { name: "Subject Code", selector: row => row.SubjectCode, sortable: true },
                    { name: "Subject Name", selector: row => row.SubjectName, sortable: true },
                    {
                        name: "Created By",
                        selector: row => row.CreatedByFullname,
                        sortable: true,
                        wrap: true, // allow text to wrap to multiple lines
                        cell: row => <span title={row.CreatedByFullname}>{row.CreatedByFullname}</span> // tooltip
                    },
                    { name: "Date Created", selector: row => row.DateCreated ? new Date(row.DateCreated).toLocaleDateString() : "—", sortable: true },
                    { name: "Date Modified", selector: row => row.DateModified ? new Date(row.DateModified).toLocaleDateString() : "—", sortable: true },
                    { name: "Remarks", selector: row => row.Remarks || "—" },
                ];

            case "document":
                return [
                    { name: "Document Name", selector: row => row.DocName, sortable: true, wrap: true },
                    {
                        name: "Created By",
                        selector: row => row.CreatedByFullname,
                        sortable: true,
                        wrap: true, // allow text to wrap to multiple lines
                        cell: row => <span title={row.CreatedByFullname}>{row.CreatedByFullname}</span> // tooltip
                    },
                    { name: "Date Created", selector: row => row.DateCreated ? new Date(row.DateCreated).toLocaleDateString() : "—", sortable: true },
                    { name: "Date Modified", selector: row => row.DateModified ? new Date(row.DateModified).toLocaleDateString() : "—", sortable: true },
                    { name: "Remarks", selector: row => row.Remarks || "—" },
                ];

            case "examroom":
                return [
                    { name: "Room Number", selector: row => row.RoomNumber, sortable: true },
                    { name: "Room Name", selector: row => row.RoomName, sortable: true },
                    { name: "Level", selector: row => row.LevelName, sortable: true },
                    { name: "Date Available", selector: row => row.DateAvailable ? new Date(row.DateAvailable).toLocaleDateString() : "—", sortable: true },
                    {
                        name: "Created By",
                        selector: row => row.CreatedByFullname,
                        sortable: true,
                        wrap: true, // allow text to wrap to multiple lines
                        cell: row => <span title={row.CreatedByFullname}>{row.CreatedByFullname}</span> // tooltip
                    },
                    { name: "Date Created", selector: row => row.DateCreated ? new Date(row.DateCreated).toLocaleDateString() : "—", sortable: true },
                    { name: "Date Modified", selector: row => row.DateModified ? new Date(row.DateModified).toLocaleDateString() : "—", sortable: true },
                    { name: "Remarks", selector: row => row.Remarks || "—" },
                ];

            default:
                //generate columns from keys automatically
                return Object.keys(sampleRow).map(key => ({
                    name: key,
                    selector: row => row[key],
                    sortable: true
                }));
        }
    };
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowPage, setRowPage] = useState(1);
    const [rowPageSize, setRowPageSize] = useState(10);
    const openRowModal = (row, status) => {
        setSelectedRow(row);

        setRowModalTitle(
            status === "view"
                ? <span className="font-bold text-lg text-green-700">{row.TempTitle}</span>
                : <span className="font-bold text-lg text-yellow-700">{row.TempTitle}</span>
        );

        setRowPage(1);
        setRowPageSize(10);
        setIsOpenRowModal(true);

        // Generate columns based on template type
        const sampleRow = rowTemplateTable[0] || {};
        setRowColumns(generateColumns(row.TempType.toLowerCase(), sampleRow));
    };
    useEffect(() => {
        if (!selectedRow || !isOpenRowModal) return;

        dispatch(fetchRowTemplateTableData(
            selectedRow.TemplateId,
            selectedRow.TempType,
            rowPage,
            rowPageSize,
            ''  // search if needed
        ));
    }, [selectedRow, rowPage, rowPageSize, isOpenRowModal, dispatch]);
    const handleRowPageChange = (page) => {
        setRowPage(page);
    };

    const handleRowPerRowsChange = (newPerPage, page) => {
        setRowPageSize(newPerPage);
        setRowPage(page);
    };


    return (<div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                    <div className="mb-4">
                        <Breadcrumb items={breadcrumbItems} />
                        <h2 className="text-sm font-bold text-black mt-2">Templates</h2>
                    </div>

                    <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                        <div className="flex flex-col space-y-4 h-full w-full">
                            <hr className="border-t-1 border-solid border-gray-400 my-6" />
                            <div className="flex justify-center">
                                <h2 className="text-2xl font-bold text-green-500 mt-2">
                                    Templates Form
                                </h2>
                            </div>
                            <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Note: </strong>
                                <span className="block sm:inline">This are the templates form of admission.</span>
                            </div>
                            <div className="flex justify-center items-center">
                                <div className="flex gap-2">


                                </div>
                            </div>
                            <div className="flex justify-center items-center my-4">
                                <div className="inline-flex rounded-lg shadow-sm" role="group">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStatus("active")}
                                        className={`px-6 py-2 text-sm font-semibold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400
                                        ${selectedStatus === "active"
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                                            } rounded-l-lg`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStatus("draft")}
                                        className={`px-6 py-2 text-sm font-semibold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400
                                        ${selectedStatus === "draft"
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                                            } rounded-r-lg`}
                                    >
                                        Draft
                                    </button>
                                </div>
                            </div>


                            <div>
                                <AnimatePresence mode="wait">

                                    <motion.div
                                        key={selectedStatus} // re-render animation on toggle
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <DataTable
                                            title={
                                                <span className="font-bold text-lg text-green-700">
                                                    List of {selectedStatus === "active" ? "Active" : "Draft"} Templates
                                                </span>
                                            }
                                            columns={columns}
                                            data={documents}
                                            progressPending={loadingTable}
                                            pagination
                                            paginationServer
                                            paginationTotalRows={totalRecords}
                                            onChangePage={handlePageChange}
                                            onChangeRowsPerPage={handlePerRowsChange}
                                            highlightOnHover
                                            striped
                                            responsive
                                            actions={
                                                selectedStatus === "active" && (
                                                    <OutlineBlueBtn
                                                        label="Add new"
                                                        onClick={() => openModal("Add new template", "w-[680px]")}
                                                    />
                                                )
                                            }
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                        </div>
                    </section>
                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title={<span className="font-bold text-lg text-red-700">{selectedTitle}</span>}
                        body={
                            <AddNewTemplateComponent
                                ref={formRef}
                                rows={rows}
                                setRows={setRows}
                                templateType={templateType}
                                setTemplateType={setTemplateType}
                                templateTitle={templateTitle}
                                setTemplateTitle={setTemplateTitle}
                                divId={divId}
                                setDivId={setDivId}
                                onValidate={setIsFormValid}
                            />
                        }
                        buttons={[
                            { label: "Submit", type: "green", onClick: handleSubmitForm, closeOnClick: false },
                            { label: "No", type: "red", closeOnClick: true },
                        ]}
                        size={selectedSize}
                    />
                    <ModalComponent
                        isOpen={isSuccessModalOpen}
                        onClose={() => setIsSuccessModalOpen(false)}
                        title={<span className="font-bold text-lg text-green-700">Success</span>}
                        body={<p>Your template has been inserted successfully!</p>}
                        buttons={[
                            { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
                        ]}
                    />
                    <ModalComponent
                        isOpen={isOpenRowModal}
                        onClose={() => setIsOpenRowModal(false)}
                        title={rowModalTitle}
                        body={
                            <div className="max-h-[80vh] overflow-auto">
                                <DataTable
                                    columns={rowColumns}
                                    data={rowTemplateTable}
                                    progressPending={rowTemplateTableState.loading}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={rowTemplateTableState.data.totalRecords || 0}
                                    onChangePage={handleRowPageChange}
                                    onChangeRowsPerPage={handleRowPerRowsChange}
                                    highlightOnHover
                                    striped
                                    responsive
                                />
                            </div>
                        }
                        buttons={[
                            { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
                        ]}
                        size="w-[800px]"
                        maxHeight="100vh"
                    /></div>);
};

export default TemplatesForm;