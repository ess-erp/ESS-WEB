import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Eye, 
    ChevronDown, 
    ChevronUp, 
    FileText, 
    User, 
    Calendar, 
    Search,
    Filter,
    X,
    Receipt,
    CheckCircle,
    XCircle,
    AlertTriangle
} from "lucide-react";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import ViewJournalModalComponent from "./ViewJournalModalComponent";
import { 
    fetchGetJournalData, 
    fetchGetJournalDetailData, 
    fetchPostJournalData, 
    fetchEditJournalAmountsData, 
    fetchUpdateJournalStatusData
 } from "../../states/AccountingState/Action";
import { fetchGetSchoolYearListData } from "../../states/SharedState/Action";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const USER_TYPE_OPTIONS = [
    { value: "", label: "All User Types" },
    { value: "Student", label: "Student" },
    { value: "Employee", label: "Employee" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const JournalEntryDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    // State
    const journalState = useSelector((s) => s.accounting.journalState);
    const schoolYearListState = useSelector((s) => s.shared.schoolYearListState);
    const journalDetailState = useSelector((s) => s.accounting.journalDetailState);
    
    // Extract data properly from the response
    const responseData = journalState.data || {};
    const journals = Array.isArray(responseData) ? responseData : (responseData.Data || responseData.data || []);
    const totalRecords = responseData.TotalRecords || responseData.totalRecords || 0;
    const loading = journalState.loading || false;

    // School Year Options
    const schoolYearOptions = [
        { value: "", label: "All School Years" },
        ...(schoolYearListState.data || []).map(sy => ({
            value: sy.CalendarId || sy.calendarId,
            label: sy.SchoolYear || sy.schoolYear
        }))
    ];

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [userType, setUserType] = useState(null);
    const [schoolYear, setSchoolYear] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Modals
    const [isViewModal, setIsViewModal] = useState(false);
    const [selectedJournalId, setSelectedJournalId] = useState(null);
    const [posting, setPosting] = useState(false);
    const [modalData, setModalData] = useState({ 
        isBalanced: false, 
        activeStatus: "P", 
        journalId: null,
        isCancellationRequested: false
    });

    // Confirmation and Result Modals
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // { type: 'Y'|'C'|'D', journalId }
    const [isResultModal, setIsResultModal] = useState(false);
    const [resultData, setResultData] = useState({ success: false, message: '' });

    // ── Fetch Data ────────────────────────────────────────────────────────────
    const fetchData = () => {
        dispatch(fetchGetJournalData(
            page,
            pageSize,
            search,
            null,           // userId
            userType?.value || null,
            schoolYear?.value || null  // calendarId
        ));
    };

    // Fetch school years on mount
    useEffect(() => {
        dispatch(fetchGetSchoolYearListData());
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, pageSize, search, userType, schoolYear]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = async (journalId) => {
        setSelectedJournalId(journalId);
        setIsViewModal(true);
        // Fetch journal details by ID
        await dispatch(fetchGetJournalDetailData(journalId));
    };

    // const handlePostJournal = async (journalId) => {
    //     setPosting(true);
    //     try {
    //         const result = await dispatch(fetchPostJournalData(journalId));
    //         if (result.ok) {
    //             showToast("success", "Journal entry posted successfully!");
    //             // Refresh the journal detail
    //             await dispatch(fetchGetJournalDetailData(journalId));
    //             // Refresh the list
    //             fetchData();
    //         } else {
    //             showToast("error", result.data?.message || "Failed to post journal entry");
    //         }
    //     } catch (error) {
    //         showToast("error", "An error occurred while posting journal entry");
    //     } finally {
    //         setPosting(false);
    //     }
    // };

    const handleEditJournal = async (payload) => {
        try {
            const result = await dispatch(fetchEditJournalAmountsData(payload));
            if (result.ok) {
                dispatch(showToast("success", "Journal amounts updated successfully!"));
                // Refresh the journal detail with the journalId from payload
                await dispatch(fetchGetJournalDetailData(payload.JournalId));
                // Refresh the list
                fetchData();
            } else {
                dispatch(showToast("error", result.data?.message || "Failed to update journal amounts"));
            }
        } catch (error) {
            dispatch(showToast("error", "An error occurred while updating journal amounts"));
        }
    };

    const handleUpdateJournalStatus = async (journalId, statusAction) => {
        setPosting(true);
        try {
            // Get modifiedByUserId from logged-in user
            const modifiedByUserId = user?.userId || user?.UserId;
            
            if (!modifiedByUserId) {
                dispatch(showToast({
                    title: "Error",
                    message: "User ID not found. Please log in again.",
                    type: "error"
                }));
                setPosting(false);
                return;
            }

            const result = await dispatch(fetchUpdateJournalStatusData(journalId, statusAction, modifiedByUserId));
            console.log(result);
            if (result.ok) {
                // Different messages based on status action
                let successMessage = '';
                if (statusAction === 'Y') {
                    successMessage = 'Journal entry posted successfully!';
                } else if (statusAction === 'C') {
                    successMessage = 'SI/OR cancellation approved successfully!';
                } else if (statusAction === 'D') {
                    successMessage = 'SI/OR cancellation declined successfully!';
                }
                
                dispatch(showToast({
                    title: "Success",
                    message: successMessage,
                    type: "success"
                }));
                
                // Refresh the journal detail
                await dispatch(fetchGetJournalDetailData(journalId));
                // Refresh the list
                fetchData();
                // Close modal if cancelled (approved)
                if (statusAction === 'C') {
                    setIsViewModal(false);
                }
            } else {
                dispatch(showToast({
                    title: "Error",
                    message: result.data?.message || result.data?.Message || "Failed to update journal status",
                    type: "error"
                }));
            }
        } catch (error) {
            dispatch(showToast({
                title: "Error",
                message: error.message,
                type: "error"
            }));
        } finally {
            setPosting(false);
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setUserType(null);
        setSchoolYear(null);
        setPage(1);
    };

    // ── DataTable Columns ─────────────────────────────────────────────────────
    const columns = [
        {
            name: "Issued To",
            selector: (r) => r.IssuedFullName || "—",
            sortable: true,
            minWidth: "180px",
            grow: 2,
            cell: (r) => (
                <div className="py-2">
                    <p className="text-xs font-semibold text-gray-900 truncate">{r.IssuedFullName || "—"}</p>
                </div>
            ),
        },
         {
            name: "User Type",
            selector: (r) => r.UserType || "—",
            sortable: true,
            minWidth: "180px",
            grow: 2,
            cell: (r) => (
                <div className="py-2">
                    <p className="text-xs font-semibold text-gray-900 truncate">{r.UserType || "—"}</p>
                </div>
            ),
        },
        {
            name: "Transaction Type",
            selector: (r) => r.TransactionType || "—",
            sortable: true,
            minWidth: "150px",
            grow: 1,
            omit: window.innerWidth < 768,
            cell: (r) => (
                <span className="text-xs font-medium text-gray-700">{r.TransactionType || "—"}</span>
            ),
        },
        {
            name: "SI Number",
            selector: (r) => r.OrNumberUsed || "—",
            sortable: true,
            minWidth: "130px",
            maxWidth: "150px",
            omit: window.innerWidth < 1024,
            cell: (r) => (
                <span className="text-xs font-mono font-medium text-blue-700">{r.OrNumberUsed || "—"}</span>
            ),
        },
        {
            name: "Accounts",
            minWidth: "200px",
            grow: 1,
            omit: window.innerWidth < 640,
            cell: (r) => (
                <div className="py-1">
                    <p className="text-[10px] text-blue-600 font-medium">Dr: {r.DebitCoaName || "—"}</p>
                    <p className="text-[10px] text-green-600 font-medium">Cr: {r.CreditCoaName || "—"}</p>
                </div>
            ),
        },
        {
            name: "Created By",
            selector: (r) => r.CreatedByFullName || "—",
            sortable: true,
            minWidth: "150px",
            omit: window.innerWidth < 1280,
            cell: (r) => (
                <span className="text-xs text-gray-600">{r.CreatedByFullName || "—"}</span>
            ),
        },
        {
            name: "Date Created",
            selector: (r) => r.DateCreated,
            sortable: true,
            minWidth: "140px",
            maxWidth: "180px",
            cell: (r) => (
                <div className="py-2">
                    <p className="text-xs font-semibold text-gray-900">
                        {r.DateCreated ? new Date(r.DateCreated).toLocaleDateString("en-PH") : "—"}
                    </p>
                    <p className="text-[10px] text-gray-500">
                        {r.DateCreated ? new Date(r.DateCreated).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                </div>
            ),
        },
        {
            name: "Date Posted",
            selector: (r) => r.DateModified,
            sortable: true,
            minWidth: "140px",
            maxWidth: "180px",
            cell: (r) => (
                <div className="py-2">
                    <p className="text-xs font-semibold text-gray-900 truncate">—</p>
                </div>
            ),
        },
        {
            name: "Status",
            selector: (r) => r.Status,
            sortable: true,
            minWidth: "140px",
            maxWidth: "180px",
            cell: (r) => {
                // Backend returns: "POSTED" (Y), "CANCELLED" (C), or "UNPOSTED" (P)
                const status = r.Status || "UNPOSTED";
                const activeStatus = r.ActiveStatus || "P";
                
                // Determine color based on ActiveStatus
                // Y = Green (Posted), C = Red (Cancelled), P = Red (Unposted)
                let colorClass = '';
                if (activeStatus === "Y") {
                    colorClass = 'text-green-700 bg-green-50 border-green-200';
                } else if (activeStatus === "C") {
                    colorClass = 'text-red-700 bg-red-50 border-red-200';
                } else {
                    colorClass = 'text-orange-700 bg-orange-50 border-orange-200';
                }
                
                return (
                    <div className="py-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorClass}`}>
                            {status}
                        </span>
                    </div>
                );
            },
        },
        {
            name: "Actions",
            minWidth: "90px",
            maxWidth: "100px",
            center: true,
            cell: (r) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleView(r.JournalId);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                >
                    <Eye size={18} />
                </button>
            ),
        },
    ];

    // Custom styles for DataTable
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "#f9fafb",
                borderBottom: "2px solid #e5e7eb",
                minHeight: "48px",
            },
        },
        headCells: {
            style: {
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "#6b7280",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        rows: {
            style: {
                minHeight: "60px",
                "&:hover": {
                    backgroundColor: "#f0fdf4",
                    cursor: "pointer",
                },
            },
        },
        cells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
    };

    return (
        <div className="w-full pt-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                <FileText size={20} className="sm:w-6 sm:h-6" />
                                Automated Journal Entries
                            </h2>
                            <p className="text-green-100 text-xs sm:text-sm mt-1">
                                System-generated journal entries from cashier transactions
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 text-white">
                                <p className="text-[10px] sm:text-xs font-medium">Total Entries</p>
                                <p className="text-xl sm:text-2xl font-bold">{totalRecords}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-full sm:min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, transaction type, OR number..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-2">
                            {/* Filters Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${showFilters ? "bg-green-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                            >
                                <Filter size={16} />
                                <span className="hidden sm:inline">Filters</span>
                                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {/* Clear Filters */}
                            {(search || userType || schoolYear) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                >
                                    <X size={16} />
                                    <span className="hidden sm:inline">Clear</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 overflow-hidden"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <SearchableSelect
                                            label="User Type"
                                            options={USER_TYPE_OPTIONS}
                                            value={userType}
                                            onChange={setUserType}
                                            placeholder="Select user type..."
                                            showSearchIcon={false}
                                        />
                                    </div>
                                    <div>
                                        <SearchableSelect
                                            label="School Year"
                                            options={schoolYearOptions}
                                            value={schoolYear}
                                            onChange={setSchoolYear}
                                            placeholder="Select school year..."
                                            showSearchIcon={false}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* DataTable */}
                <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <DataTable
                            columns={columns}
                            data={journals}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRecords}
                            paginationDefaultPage={page}
                            onChangePage={(newPage) => setPage(newPage)}
                            onChangeRowsPerPage={(newPageSize, newPage) => {
                                setPageSize(newPageSize);
                                setPage(newPage);
                            }}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            customStyles={customStyles}
                            noDataComponent={
                                <div className="py-12 sm:py-16 text-center px-4">
                                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500 font-medium text-base sm:text-lg">No journal entries found</p>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                                        Journal entries are automatically created when transactions are processed by the cashier.
                                    </p>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* View Journal Modal */}
            <ModalComponent
                isOpen={isViewModal}
                onClose={() => setIsViewModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white rounded-lg p-2">
                            <FileText size={20} />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-gray-900">Journal Entry Details</span>
                    </div>
                }
                size="w-[95vw] max-w-4xl"
                maxHeight="90vh"
                body={
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-2 py-2">
                        <ViewJournalModalComponent 
                            journal={journalDetailState.data} 
                            loading={journalDetailState.loading}
                            onPost={handleUpdateJournalStatus}
                            posting={posting}
                            onGetModalData={setModalData}
                            onEdit={handleEditJournal}
                        />
                    </div>
                }
                buttons={[
                    // If status is "C" (Cancelled), only show Close button
                    ...(modalData.activeStatus === "C" ? [] :
                    // Show Approve and Decline buttons if there's a cancellation request AND not cancelled
                    modalData.isCancellationRequested && modalData.activeStatus !== "C" ? [
                        {
                            label: posting ? "Processing..." : "Approve Cancellation",
                            type: "green",
                            onClick: () => handleUpdateJournalStatus(modalData.journalId, 'C'),
                            disabled: posting,
                            icon: posting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : <CheckCircle size={16} />
                        },
                        {
                            label: posting ? "Processing..." : "Decline Cancellation",
                            type: "red",
                            onClick: () => handleUpdateJournalStatus(modalData.journalId, 'D'),
                            disabled: posting,
                            icon: posting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : <XCircle size={16} />
                        }
                    ] : 
                    // Show Post button only if status is Pending (P) and no cancellation request
                    modalData.activeStatus === "P" ? [{
                        label: posting ? "Posting..." : "Post Journal Entry",
                        type: "green",
                        onClick: () => handleUpdateJournalStatus(modalData.journalId, 'Y'),
                        disabled: posting || !modalData.isBalanced,
                        icon: posting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : <Receipt size={16} />
                    }] : []),
                    // Close button - always shown with different color if cancelled
                    { 
                        label: "Close", 
                        type: modalData.activeStatus === "C" ? "red" : "blue", 
                        onClick: () => setIsViewModal(false) 
                    },
                ]}
            />
        </div>
    );
};

export default JournalEntryDataTable;
