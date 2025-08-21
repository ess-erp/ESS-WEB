import { useEffect, useState } from 'react';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import { Pencil, Eye, Trash } from "lucide-react";
import DataTable from 'react-data-table-component';
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import { motion, AnimatePresence } from 'framer-motion';

const TemplatesForm = () => {
    useEffect(() => {
        document.title = 'Templates Form';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/admission/dashboard' },
        { label: 'Templates', href: '/admission/templatesform' },
    ];


    const documents = [
        { title: "3 pcs. 1x1 photo", date: "2025-08-20" },
        { title: "Baptismal Certificate", date: "" },
        { title: "Certificate of Good Moral/Recommendation Letter", date: "" },
        { title: "Certified True Copy of the Latest Report Card with LRN", date: "" },
        { title: "Early Childhood Development (ECD) Certificate", date: "" },
        { title: "Grade 10 Certificate of Completion", date: "" },
        { title: "Official Transcript (F137)", date: "" },
        { title: "Photocopy of Grade 9 Report Card", date: "" },
        { title: "Photocopy of Latest SSP for Foreign Applicants", date: "" },
        { title: "Photocopy of Passport for Foreign Applicants", date: "" },
        { title: "Photocopy of Report Card", date: "" },
        { title: "Photocopy of the NCAE Results", date: "" },
        { title: "Preschool Record (Report Card/Certificate)", date: "" },
        { title: "PSA/NSO Birth Certificate", date: "" },
        { title: "Qualified Voucher Applicant(QVA) Certificate", date: "" },
        { title: "Qualified Voucher Recipient (QVR) Certificate", date: "" },
    ];

    const columns = [
        {
            name: "Document Title",
            selector: (row) => row.title,
            sortable: true,
            wrap: true,
        },
        {
            name: "Date Submitted",
            selector: (row) => row.date || "—",
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => openModal(row.title)}
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        className="p-1 text-green-600 hover:text-green-800"
                        onClick={() => alert(`Editing ${row.title}`)}
                    >
                        <Pencil size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);


    const [selectedDocName, setSelectedDocName] = useState("");
    const openModal = (title) => {
        setSelectedDocName(title);
        setIsModalOpen(true);
    }

    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <>
            <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
                <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
                <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
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
                            <div className="overflow-x-auto">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <DataTable
                                            title={<span className="font-bold text-lg text-green-700">List of Templates</span>}
                                            columns={columns}
                                            data={documents}
                                            pagination
                                            highlightOnHover
                                            striped
                                            responsive
                                        />

                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </section>
                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title={<span className="font-bold text-lg text-red-700">{selectedDocName}</span>}
                        body="Are you sure you want to submit?"
                        buttons={[
                            { label: "Yes", type: "green", },
                            { label: "No", type: "red" },
                        ]}
                    />
                </div>
            </div>
        </>
    );
};

export default TemplatesForm;