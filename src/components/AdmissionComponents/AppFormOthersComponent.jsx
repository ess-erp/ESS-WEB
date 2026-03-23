import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import DataTable from "react-data-table-component";
import { Eye, Pencil } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchOthersTableData,
    fetchTestPermitData,
    fetchResendEmailData,
    fetchAdmissionTestResultData,
    fetchGenerateLetterData,
    fetchGeneratedLetterData,
    fetchInsertTaggingLetterData,
    fetchReligionWaverData,
    fetchSendReligionWaiverData,
    fetchUpdateSendReligionWaiverData,
    fetchAcademicWaiverData,
    fetchUpdateSendAcademicWaiverData,
    fetchSendAcademicWaiverData,
} from "../../states/AdmissionState/Action";
import BlueBtn from "../ButtonsComponents/BlueBtn";

const AppFormOthersComponent = ({ studentId }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const dispatch = useDispatch();
    const othersTableState = useSelector((state) => state.admission.othersTableState || {});
    const table = othersTableState.data.data || [];
    const totalRows = othersTableState.data.totalRecords || 0;
    const loading = othersTableState.loading || false;
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isOpenTestPermitModal, setIsOpenTestPermitModal] = useState(false);
    const [isOpenAdmissionTestResultModal, setIsOpenAdmissionTestResultModal] = useState(false);
    const [isOpenGeneratedLetter, setIsOpenGeneratedLetter] = useState(false);

    const testPermitState = useSelector((state) => state.admission.testPermitState);
    const { loading: permitLoading, data: permitData } = testPermitState || {};

    const resendEmailState = useSelector((state) => state.admission.resendEmailState || {});

    const admissionTestResultState = useSelector((state) => state.admission.admissionTestResultState);
    const { loading: admissionTestResultLoading, data: admissionTestResultData } = admissionTestResultState || {};

    const generatedLetterState = useSelector((state) => state.admission.generatedLetterState);
    const { loading: generatedLetterLoading, data: generatedLetterData } = generatedLetterState || {};

    const religionWaverState = useSelector((state) => state.admission.religionWaverState || {});
    const { loading: religionWaverLoading, data: religionWaverData } = religionWaverState || {};

    const academicWaiverState = useSelector((state) => state.admission.academicWaiverState || {});
    const { loading: academicWaiverLoading, data: academicWaiverData } = academicWaiverState || {};

    console.log(admissionTestResultData);
    console.log(generatedLetterData);
    console.log(religionWaverData);
    const fetchData = () => {
        dispatch(fetchOthersTableData(
            studentId,
            currentPage,
            rowsPerPage,
            filterText
        ));
    };

    useEffect(() => {
        fetchData();
    }, [studentId, currentPage, rowsPerPage, filterText, dispatch]);

    const staticRows = [
        { TempName: "Test Permit", DateCreated: null, ActiveStatus: "Pending" },
        { TempName: "Academic Waiver", DateCreated: null, ActiveStatus: "Pending" },
        { TempName: "Admission Test Result", DateCreated: null, ActiveStatus: "Pending" },
        { TempName: "Religion Waiver", DateCreated: null, ActiveStatus: "Pending" },
        { TempName: "Letter", DateCreated: null, ActiveStatus: "Pending" },
        { TempName: "Tagging for Letter", DateCreated: null, ActiveStatus: "Pending" },

    ];

    const combinedData = [
        ...staticRows.filter(staticRow =>
            !table.some(apiRow => apiRow.TempName === staticRow.TempName)
        ),
        ...table
    ];

    const columns = [
        {
            name: "Document",
            selector: (row) => row.TempName,
            sortable: true,
        },
        {
            name: "Date Created",
            selector: (row) => row.DateCreated
                ? new Date(row.DateCreated).toLocaleDateString()
                : "—",
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.ActiveStatus,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex space-x-2">
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
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    const [otherId, setOtherId] = useState(0);
    const openRowModal = (row, type) => {
        console.log(`Open ${type} modal for:`, row);


        switch (row.TempName) {
            case "Admission Test Result":
                dispatch(fetchAdmissionTestResultData(row.OthersTableId));
                setIsOpenAdmissionTestResultModal(true);
                break;
            case "Test Permit":
                dispatch(fetchTestPermitData(row.OthersTableId));
                setIsOpenTestPermitModal(true);
                break;
            case "Letter":
                dispatch(fetchGeneratedLetterData(row.OthersTableId));
                setIsOpenGeneratedLetter(true);
                break;
            case "Tagging for Letter":
                setIsTaggingLetterOpen(true);
                break;
            case "Religion Waiver":
                dispatch(fetchReligionWaverData(studentId));
                setOtherId(row.OthersTableId);
                setIsReligionWaverModal(true);
                break;
            case "Academic Waiver":
                dispatch(fetchAcademicWaiverData(studentId));
                setOtherId(row.OthersTableId ?? 0);
                setIsOpenAcademicWaiver(true);
                break;
        }

    };


    const [resendCooldown, setResendCooldown] = useState(false);

    const handleResendEmail = () => {
        if (resendCooldown) return;

        setIsLoadingModalOpen(true)
        console.log(permitData);
        console.log(permitData.EmailStatusId);
        dispatch(fetchResendEmailData(permitData.EmailStatusId, permitData.StudentId, permitData.TempName, user.UserId));

        setTimeout(() => {
            setResendCooldown(false);
        }, 5000);
    };
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
    useEffect(() => {
        if (!resendEmailState.loading) {

            setIsLoadingModalOpen(false);

            if (resendEmailState.data && Object.keys(resendEmailState.data).length > 0) {
                setIsSuccessModalOpen(true);
            } else if (resendEmailState.error) {
                setIsOpenTestPermitModal(false);
                setIsErrorModalOpen(true);
            }
        }
    }, [resendEmailState]);

    const [isLetterLoadingModal, setIsLetterLoadingModal] = useState(false);
    const [isLetterSuccessModal, setIsLetterSuccessModal] = useState(false);
    const handleGenerateLetter = async () => {
        const curUserId = user.UserId;
        setIsLetterLoadingModal(true);
        const res = await dispatch(fetchGenerateLetterData(studentId, curUserId));
        if (res.ok) {
            setIsLetterLoadingModal(false);
            setIsLetterSuccessModal(true);
            if (isLetterSuccessModal == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
        else {
            setIsLetterLoadingModal(false);
            setIsErrorModalOpen(true);
        }
    };

    const [isTaggingLetterOpen, setIsTaggingLetterOpen] = useState(false);
    const [isTaggingLetterSuccess, setIsTaggingLetterSuccess] = useState(false);
    const [isTaggingLetterLoading, setIsTaggingLetterLoading] = useState(false);
    const [dateOfEnrollment, setDateOfEnrollment] = useState("");
    const [dateOfFirstPayment, setDateOfFirstPayment] = useState("");
    const handleSubmitTaggingLetter = async () => {
        setIsTaggingLetterLoading(true);
        const payload = {
            StudentId: studentId,
            CreatedByUserId: user.UserId,
            DateOfEnrollment: dateOfEnrollment,
            DateOfFirstPayment: dateOfFirstPayment,
        };
        const res = await dispatch(fetchInsertTaggingLetterData(payload));
        console.log(res);
        if (res.ok) {
            setIsTaggingLetterLoading(false);
            setIsTaggingLetterSuccess(true)
            if (isLetterSuccessModal == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
        else {
            setIsTaggingLetterLoading(false);
            setIsErrorModalOpen(true);
        }
    };

    const [isReligionWaverModal, setIsReligionWaverModal] = useState(false);
    const [isReligionWaiverLoading, setIsReligionWaiverLoading] = useState(false);
    const [isReligionWaiverSuccess, setIsReligionWaiverSuccess] = useState(false);
    const handleSendReligionWaiver = async () => {
        const payload = {
            StudentId: studentId,
            CreatedByUserId: user.UserId,
            ParentId: religionWaverData.ParentId,
            // MotherId: religionWaverData.MotherId,
        };
        console.log(payload);
        setIsReligionWaiverLoading(true);
        let res = "";
        if (religionWaverData.length != 0) {
            res = await dispatch(fetchUpdateSendReligionWaiverData(otherId, user.UserId));
        }
        else {
            res = await dispatch(fetchSendReligionWaiverData(payload));
        }
        if (res.ok) {
            setIsReligionWaverModal(false);
            setIsReligionWaiverLoading(false);
            setIsReligionWaiverSuccess(true);
            if (isReligionWaiverSuccess == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
        else {
            setIsReligionWaverModal(false);
            setIsReligionWaiverLoading(false);
            setIsErrorModalOpen(true);
        }
    };

    const [isOpenAcademicWaiver, setIsOpenAcademicWaiver] = useState(false);
    const [isAcademicWaiverLoading, setIsAcademivWaiverLoading] = useState(false);
    const [isAcademicWaiverSuccess, setIsAcademicWaiverSuccess] = useState(false);
    const handleSendAcademicWaiver = async () => {
        const payload = {
            StudentId: studentId,
            CreatedByUserId: user.UserId,
            ParentId: academicWaiverData.ParentId,
            // FatherId: academicWaiverData.FatherId,
            // MotherId: academicWaiverData.MotherId,
        };
        setIsAcademivWaiverLoading(true);
        let res = "";
        if (academicWaiverData.length != 0) {
            res = await dispatch(fetchUpdateSendAcademicWaiverData(otherId, user.UserId));
        }
        else {
            res = await dispatch(fetchSendAcademicWaiverData(payload));
        }
        if (res.ok) {
            setIsOpenAcademicWaiver(false);
            setIsAcademivWaiverLoading(false);
            setIsAcademicWaiverSuccess(true);
            if (isAcademicWaiverSuccess == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
        else {
            setIsOpenAcademicWaiver(false);
            setIsAcademivWaiverLoading(false);
            setIsErrorModalOpen(true);
        }
    };

    const handleSendLetter = async () => {

    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-green-700">Others</h2>

            <DataTable
                columns={columns}
                data={combinedData}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows + staticRows.length}
                paginationDefaultPage={currentPage}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                    setRowsPerPage(newPerPage);
                    setCurrentPage(page);
                }}
                highlightOnHover
                responsive
            />
            <ModalComponent
                isOpen={isOpenTestPermitModal}
                onClose={() => setIsOpenTestPermitModal(false)}
                title="Test Permit"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex gap-6">
                        {/* Left side: Info */}
                        <div className="w-1/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Information</label>
                            {permitLoading ? (
                                <span className="text-gray-400 text-sm">Loading...</span>
                            ) : permitData ? (
                                <div className="flex flex-col gap-2 text-sm text-gray-500">
                                    {/* <span>
                                        Father's Email:{" "}
                                        <span className="font-semibold text-gray-700">{permitData.FatherEmail}</span>
                                    </span>
                                    <span>
                                        Mother's Email:{""}
                                        <span className="font-semibold text-gray-700">{permitData.MotherEmail}</span>
                                    </span> */}
                                    <span>
                                        Parent's Email:{""}
                                        <span className="font-semibold text-gray-700">{permitData.PrimaryEmail}</span>
                                    </span>
                                    <span>
                                        Last sent:{" "}
                                        <span className="font-semibold text-gray-700">
                                            {permitData.DateCreated
                                                ? new Date(permitData.DateCreated).toLocaleDateString()
                                                : "—"}
                                        </span>
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-sm">No data found</span>
                            )}
                        </div>

                        {/* Right side: Preview */}
                        <div className="w-2/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Preview</label>
                            <div className="border rounded-lg shadow overflow-hidden flex-1">
                                {permitLoading ? (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        Loading preview...
                                    </div>
                                ) : permitData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${permitData.PdfBase64}`}
                                        className="w-full h-[40vh]"
                                        title="Test Permit Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Download",
                        type: "green",
                        onClick: () => {
                            if (permitData?.PdfBase64) {
                                const link = document.createElement("a");
                                link.href = `data:application/pdf;base64,${permitData.PdfBase64}`;
                                link.download = `${permitData.Fname} ${permitData.Mname ?? ""} ${permitData.Lname}-Test Permit.pdf`;
                                link.click();
                            }
                        },
                    },
                    {
                        label: "Resend Email",
                        type: "blue",
                        className: `px-5 py-2.5 text-sm font-semibold rounded-lg shadow transition
                                ${resendCooldown
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"}`,
                        closeOnClick: false,
                        onClick: handleResendEmail,

                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsOpenTestPermitModal(false),
                    },
                ]}
                size="w-[1000px]"
                maxHeight="100vh"
            />
            <ModalComponent
                isOpen={isOpenAdmissionTestResultModal}
                onClose={() => setIsOpenAdmissionTestResultModal(false)}
                title="Admission Test Result"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex gap-6">
                        {/* Left side: Info */}
                        <div className="w-1/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Information</label>
                            {admissionTestResultLoading ? (
                                <span className="text-gray-400 text-sm">Loading...</span>
                            ) : admissionTestResultData ? (
                                <div className="flex flex-col gap-2 text-sm text-gray-500">
                                    <span>
                                        For Recommendation In:
                                        <span className="font-semibold text-gray-700"> {admissionTestResultData.InterviewRemarks}</span>
                                    </span>
                                    <span>
                                        Final Remarks:
                                        <span className="font-semibold text-gray-700"> {admissionTestResultData.FinalRemark == 1 && (<>Qualified</>)}</span>
                                    </span>
                                    <span>
                                        Generate Letter:
                                        <span className="font-semibold text-gray-700"> <BlueBtn label="Generate" onClick={handleGenerateLetter} /></span>
                                    </span>

                                </div>
                            ) : (
                                <span className="text-gray-400 text-sm">No data found</span>
                            )}
                        </div>

                        {/* Right side: Preview */}
                        <div className="w-2/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Preview</label>
                            <div className="border rounded-lg shadow overflow-hidden flex-1">
                                {admissionTestResultLoading ? (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        Loading preview...
                                    </div>
                                ) : admissionTestResultData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${admissionTestResultData.PdfBase64}`}
                                        className="w-full h-[40vh]"
                                        title="Admission Test Result Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Download",
                        type: "green",
                        onClick: () => {
                            if (admissionTestResultData?.PdfBase64) {
                                const link = document.createElement("a");
                                link.href = `data:application/pdf;base64,${admissionTestResultData.PdfBase64}`;
                                link.download = `${admissionTestResultData.Fname} ${admissionTestResultData.Mname ?? ""} ${admissionTestResultData.Lname}-Admission Test Result.pdf`;
                                link.click();
                            }
                        },
                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsOpenAdmissionTestResultModal(false),
                    },
                ]}
                size="w-[1000px]"
                maxHeight="100vh"
            />
            <ModalComponent
                isOpen={isOpenGeneratedLetter}
                onClose={() => setIsOpenGeneratedLetter(false)}
                title="Letter"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex gap-6">
                        <div className="w-1/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Information</label>
                            {generatedLetterLoading ? (
                                <span className="text-gray-400 text-sm">Loading...</span>
                            ) : generatedLetterData ? (
                                <div className="flex flex-col gap-2 text-sm text-gray-500">
                                    {/* <span>
                                        Father's Email:{" "}
                                        <span className="font-semibold text-gray-700"> {generatedLetterData.FathersEmail}</span>
                                    </span>
                                    <span>
                                        Mother's Email:{""}
                                        <span className="font-semibold text-gray-700"> {generatedLetterData.MothersEmail}</span>
                                    </span> */}
                                    <span>
                                        Parent's Email:{""}
                                        <span className="font-semibold text-gray-700"> {generatedLetterData.PrimaryEmail}</span>
                                    </span>
                                    <span>
                                        Last sent:{" "}
                                        <span className="font-semibold text-gray-700">
                                            {generatedLetterData.DateCreated
                                                ? new Date(generatedLetterData.DateCreated).toLocaleDateString()
                                                : "—"}
                                        </span>
                                    </span>
                                    <span>
                                        Send this letter to parent:{" "}
                                        <span className="font-semibold text-gray-700">
                                            <BlueBtn label="Send" onClick={handleSendLetter} />
                                        </span>
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-sm">No data found</span>
                            )}
                        </div>

                        <div className="w-2/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Preview</label>
                            <div className="border rounded-lg shadow overflow-hidden flex-1">
                                {generatedLetterLoading ? (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        Loading preview...
                                    </div>
                                ) : generatedLetterData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${generatedLetterData?.PdfBase64}`}
                                        className="w-full h-[40vh]"
                                        title="Letter"
                                        allow="fullscreen"
                                        type="application/pdf"
                                        sandbox=""
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Download",
                        type: "green",
                        onClick: () => {
                            if (generatedLetterData?.PdfBase64) {
                                const link = document.createElement("a");
                                link.href = `data:application/pdf;base64,${generatedLetterData.PdfBase64}`;
                                link.download = `${generatedLetterData.Fname} ${generatedLetterData.Mname ?? ""} ${generatedLetterData.Lname} - Letter.pdf`;
                                link.click();
                            }
                        },
                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsOpenGeneratedLetter(false),
                    },
                ]}
                size="w-[1000px]"
                maxHeight="100vh"
            />
            <ModalComponent
                isOpen={isTaggingLetterOpen}
                onClose={() => setIsTaggingLetterOpen(false)}
                title="Tagging for Letter"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex gap-6 justify-center">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Date of Enrollment</label>
                            <input
                                type="date"
                                name="dateOfEnrollment"
                                value={dateOfEnrollment || ""}
                                onChange={(e) => setDateOfEnrollment(e.target.value)}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Date of First Payment</label>
                            <input
                                type="date"
                                name="dateOfFirstPayment"
                                value={dateOfFirstPayment || ""}
                                onChange={(e) => setDateOfFirstPayment(e.target.value)}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Save",
                        type: "green",
                        onClick: () => handleSubmitTaggingLetter(),
                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsOpenGeneratedLetter(false),
                    },
                ]}
                size="w-[400px]"
                maxHeight="100vh"
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={
                    <span>
                        {permitData?.TempName} was successfully sent to the parent.
                    </span>
                }
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
                ]}
            />
            <ModalComponent
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Error</span>}
                body={resendEmailState.error || "Something went wrong. Please try again."}
                buttons={[
                    { label: "Close", type: "red", onClick: () => setIsErrorModalOpen(false) }
                ]}
            />
            <ModalComponent
                isOpen={isLoadingModalOpen}
                onClose={() => { }} // prevent closing while loading
                title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                body={
                    <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span className="text-gray-600">Sending the {permitData.TempName} to parent.</span>
                        <span className="text-gray-600">Please wait don't close this window.</span>
                    </div>
                }
                buttons={[]}
            />
            <ModalComponent
                isOpen={isLetterSuccessModal}
                onClose={() => setIsLetterSuccessModal(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={
                    <span>
                        Done generating letter please check the Letter in table.
                    </span>
                }
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsLetterSuccessModal(false) }
                ]}
            />
            <ModalComponent
                isOpen={isLetterLoadingModal}
                onClose={() => { }} // prevent closing while loading
                title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                body={
                    <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span className="text-gray-600">Generating Letter.</span>
                        <span className="text-gray-600">Please wait don't close this window.</span>
                    </div>
                }
                buttons={[]}
            />
            <ModalComponent
                isOpen={isTaggingLetterSuccess}
                onClose={() => setIsTaggingLetterSuccess(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={
                    <span>
                        Done generating letter please check the Letter in table.
                    </span>
                }
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsTaggingLetterSuccess(false) }
                ]}
            />
            <ModalComponent
                isOpen={isTaggingLetterLoading}
                onClose={() => { }} // prevent closing while loading
                title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                body={
                    <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span className="text-gray-600">Saving tagging letter.</span>
                        <span className="text-gray-600">Please wait don't close this window.</span>
                    </div>
                }
                buttons={[]}
            />
            <ModalComponent
                isOpen={isReligionWaverModal}
                onClose={() => setIsReligionWaverModal(false)}
                title="Religion Waver"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex gap-6">
                        {/* Left side: Info */}
                        <div className="w-1/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Information</label>
                            {religionWaverLoading ? (
                                <span className="text-gray-400 text-sm">Loading...</span>
                            ) : religionWaverData ? (
                                <div className="flex flex-col gap-2 text-sm text-gray-500">
                                    <span>
                                        Father's Email:{" "}
                                        <span className="font-semibold text-gray-700"> {religionWaverData.FathersEmail}</span>
                                    </span>
                                    <span>
                                        Mother's Email:{""}
                                        <span className="font-semibold text-gray-700"> {religionWaverData.MothersEmail}</span>
                                    </span>
                                    <span>
                                        Last sent:{" "}
                                        <span className="font-semibold text-gray-700">
                                            {permitData.DateCreated
                                                ? new Date(permitData.DateCreated).toLocaleDateString()
                                                : "—"}
                                        </span>
                                    </span>
                                    <span>
                                        Send this religion waiver to parent:{" "}
                                        <span className="font-semibold text-gray-700">
                                            <BlueBtn label="Send" onClick={handleSendReligionWaiver} />
                                        </span>
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-sm">No data found</span>
                            )}
                        </div>

                        {/* Right side: Preview */}
                        <div className="w-2/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Preview</label>
                            <div className="border rounded-lg shadow overflow-hidden flex-1">
                                {religionWaverLoading ? (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        Loading preview...
                                    </div>
                                ) : religionWaverData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${religionWaverData.PdfBase64}`}
                                        className="w-full h-[40vh]"
                                        title="Test Permit Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Download",
                        type: "green",
                        onClick: () => {
                            if (religionWaverData?.PdfBase64) {
                                const link = document.createElement("a");
                                link.href = `data:application/pdf;base64,${religionWaverData.PdfBase64}`;
                                link.download = `${religionWaverData.Fname} ${religionWaverData.Mname ?? ""} ${religionWaverData.Lname}-Religion Waiver.pdf`;
                                link.click();
                            }
                        },
                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsReligionWaverModal(false),
                    },
                ]}
                size="w-[1000px]"
                maxHeight="100vh"
            />
            <ModalComponent
                isOpen={isReligionWaiverSuccess}
                onClose={() => setIsReligionWaiverSuccess(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={
                    <span>
                        Religion Waiver was sent to parents.
                    </span>
                }
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsReligionWaiverSuccess(false) }
                ]}
            />
            <ModalComponent
                isOpen={isReligionWaiverLoading}
                onClose={() => { }} // prevent closing while loading
                title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                body={
                    <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span className="text-gray-600">Religion waiver is sending to parents email.</span>
                        <span className="text-gray-600">Please wait don't close this window.</span>
                    </div>
                }
                buttons={[]}
            />
            <ModalComponent
                isOpen={isOpenAcademicWaiver}
                onClose={() => setIsOpenAcademicWaiver(false)}
                title="Academic Waiver"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex gap-6">
                        {/* Left side: Info */}
                        <div className="w-1/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Information</label>
                            {academicWaiverLoading ? (
                                <span className="text-gray-400 text-sm">Loading...</span>
                            ) : academicWaiverData ? (
                                <div className="flex flex-col gap-2 text-sm text-gray-500">
                                    <span>
                                        Father's Email:{" "}
                                        <span className="font-semibold text-gray-700"> {academicWaiverData.FathersEmail}</span>
                                    </span>
                                    <span>
                                        Mother's Email:{""}
                                        <span className="font-semibold text-gray-700"> {academicWaiverData.MothersEmail}</span>
                                    </span>
                                    <span>
                                        Last sent:{" "}
                                        <span className="font-semibold text-gray-700">
                                            {academicWaiverData.DateCreated
                                                ? new Date(permitData.DateCreated).toLocaleDateString()
                                                : "—"}
                                        </span>
                                    </span>
                                    <span>
                                        Send this religion waiver to parent:{" "}
                                        <span className="font-semibold text-gray-700">
                                            <BlueBtn label="Send" onClick={handleSendAcademicWaiver} />
                                        </span>
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-sm">No data found</span>
                            )}
                        </div>

                        {/* Right side: Preview */}
                        <div className="w-2/3 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Preview</label>
                            <div className="border rounded-lg shadow overflow-hidden flex-1">
                                {academicWaiverLoading ? (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        Loading preview...
                                    </div>
                                ) : academicWaiverData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${academicWaiverData.PdfBase64}`}
                                        className="w-full h-[40vh]"
                                        title="Academic Waiver Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[40vh] text-gray-400">
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Download",
                        type: "green",
                        onClick: () => {
                            if (academicWaiverData?.PdfBase64) {
                                const link = document.createElement("a");
                                link.href = `data:application/pdf;base64,${academicWaiverData.PdfBase64}`;
                                link.download = `${academicWaiverData.Fname} ${academicWaiverData.Mname ?? ""} ${academicWaiverData.Lname}-Academic Waiver.pdf`;
                                link.click();
                            }
                        },
                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsOpenAcademicWaiver(false),
                    },
                ]}
                size="w-[1000px]"
                maxHeight="100vh"
            />
            <ModalComponent
                isOpen={isAcademicWaiverSuccess}
                onClose={() => setIsAcademicWaiverSuccess(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body={
                    <span>
                        Academic Waiver was sent to parents.
                    </span>
                }
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsAcademicWaiverSuccess(false) }
                ]}
            />
            <ModalComponent
                isOpen={isAcademicWaiverLoading}
                onClose={() => { }} // prevent closing while loading
                title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                body={
                    <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span className="text-gray-600">Academic waiver is sending to parents email.</span>
                        <span className="text-gray-600">Please wait don't close this window.</span>
                    </div>
                }
                buttons={[]}
            />
        </div>
    );
};

export default AppFormOthersComponent;


