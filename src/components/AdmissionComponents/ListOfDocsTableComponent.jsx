import { Pencil, Eye, Trash } from "lucide-react";
import DataTable from 'react-data-table-component';
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { useState } from "react";


const ListOfDocsTableComponent = ({studentId}) => {

    console.log(studentId);

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

    return (
        <>
            <DataTable
                title={<span className="font-bold text-lg text-green-700">List of Documents</span>}
                columns={columns}
                data={documents}
                pagination
                highlightOnHover
                striped
                responsive
            />
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
        </>
    );
};

export default ListOfDocsTableComponent;