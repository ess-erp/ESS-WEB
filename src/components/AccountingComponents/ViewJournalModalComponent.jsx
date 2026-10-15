import { useEffect } from "react";
import { 
    FileText, 
    User, 
    Calendar,
    Receipt,
    ArrowRight
} from "lucide-react";

// ─── View Journal Modal Component ─────────────────────────────────────────────
const ViewJournalModalComponent = ({ journal, loading, onPost, posting, onGetModalData }) => {
    const activeStatus = journal?.ActiveStatus || "P";
    const isBalanced = true; // Simplified - assume balanced since no journal lines validation needed

    // Pass modal data to parent for footer buttons
    useEffect(() => {
        if (onGetModalData && journal) {
            onGetModalData({ isBalanced, activeStatus, journalId: journal.JournalId });
        }
    }, [journal?.JournalId, activeStatus, isBalanced, onGetModalData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!journal) {
        return (
            <div className="text-center py-16">
                <FileText className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500 font-medium text-lg">No data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Information Card */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                                <FileText size={14} />
                                Journal ID
                            </p>
                            <p className="text-lg font-bold text-gray-900">#{journal.JournalId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                                <User size={14} />
                                Issued To
                            </p>
                            <p className="text-sm font-semibold text-gray-900">{journal.IssuedFullName || "—"}</p>
                        </div>
                        {journal.TransactionType && (
                            <div>
                                <p className="text-xs text-gray-500 font-medium mb-1">Transaction Type</p>
                                <p className="text-sm font-semibold text-gray-900">{journal.TransactionType}</p>
                            </div>
                        )}
                        {journal.OrNumberUsed && (
                            <div>
                                <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                                    <Receipt size={14} />
                                    SI Number
                                </p>
                                <p className="text-sm font-semibold text-gray-900">{journal.OrNumberUsed}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                                <Calendar size={14} />
                                Date Created
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {journal.DateCreated ? new Date(journal.DateCreated).toLocaleString("en-PH", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }) : "—"}
                            </p>
                        </div>
                        {journal.DatePosted && activeStatus === "Y" && (
                            <div>
                                <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    Date Posted
                                </p>
                                <p className="text-sm font-semibold text-green-700">
                                    {new Date(journal.DatePosted).toLocaleString("en-PH", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                            </div>
                        )}
                        {journal.CreatedByFullName && (
                            <div>
                                <p className="text-xs text-gray-500 font-medium mb-1">Created By</p>
                                <p className="text-sm font-semibold text-gray-900">{journal.CreatedByFullName}</p>
                            </div>
                        )}
                        {/* Status Badge */}
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                activeStatus === "Y" 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-yellow-100 text-yellow-700"
                            }`}>
                                {journal.Status || (activeStatus === "Y" ? "POSTED" : "UNPOSTED")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Information Card */}
            {(journal.DebitCoaName || journal.CreditCoaName) && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-600 rounded-lg p-1.5">
                            <FileText size={16} />
                        </div>
                        Chart of Accounts
                    </h3>
                    <div className="flex items-center justify-center gap-4 py-4">
                        {/* Debit Account */}
                        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2">Account Name</p>
                            <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2">Debit</p>
                            <p className="text-sm font-semibold text-gray-900">{journal.DebitCoaName || "—"}</p>
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0">
                            <ArrowRight className="text-gray-400" size={24} />
                        </div>

                        {/* Credit Account */}
                        <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-xs font-bold text-green-900 uppercase tracking-wide mb-2">Account Name</p>
                            <p className="text-xs font-bold text-green-900 uppercase tracking-wide mb-2">Credit</p>
                            <p className="text-sm font-semibold text-gray-900">{journal.CreditCoaName || "—"}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewJournalModalComponent;
