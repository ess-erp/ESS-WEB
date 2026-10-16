import { useEffect, useState } from "react";
import { 
    FileText, 
    User, 
    Calendar,
    Receipt,
    ArrowRight,
    Edit2,
    Save,
    X
} from "lucide-react";

// ─── View Journal Modal Component ─────────────────────────────────────────────
const ViewJournalModalComponent = ({ journal, loading, onPost, posting, onGetModalData, onEdit }) => {
    const activeStatus = journal?.ActiveStatus || "P";
    const [isEditing, setIsEditing] = useState(false);
    const [editedDebitAmount, setEditedDebitAmount] = useState("");
    const [editedCreditAmount, setEditedCreditAmount] = useState("");
    
    // Calculate if debit and credit are balanced
    const debitAmount = isEditing ? Number(editedDebitAmount || 0) : Number(journal?.DebitAmount || 0);
    const creditAmount = isEditing ? Number(editedCreditAmount || 0) : Number(journal?.CreditAmount || 0);
    const isBalanced = debitAmount === creditAmount && debitAmount > 0;

    // Initialize edit values when journal changes
    useEffect(() => {
        if (journal) {
            setEditedDebitAmount(journal.DebitAmount?.toString() || "");
            setEditedCreditAmount(journal.CreditAmount?.toString() || "");
        }
    }, [journal?.JournalId]);

    // Pass modal data to parent for footer buttons
    useEffect(() => {
        if (onGetModalData && journal) {
            onGetModalData({ isBalanced, activeStatus, journalId: journal.JournalId });
        }
    }, [journal?.JournalId, activeStatus, isBalanced, onGetModalData]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reset values
            setEditedDebitAmount(journal.DebitAmount?.toString() || "");
            setEditedCreditAmount(journal.CreditAmount?.toString() || "");
        }
        setIsEditing(!isEditing);
    };

    const handleSaveEdit = () => {
        if (onEdit && isBalanced) {
            // Create payload for editing journal amounts
            const payload = {
                JournalId: journal.JournalId,
                DebitAmount: Number(editedDebitAmount),
                CreditAmount: Number(editedCreditAmount),
                // Include additional context for audit trail
                DebitCoaName: journal.DebitCoaName,
                CreditCoaName: journal.CreditCoaName,
                IssuedFullName: journal.IssuedFullName,
                TransactionType: journal.TransactionType,
                OrNumberUsed: journal.OrNumberUsed
            };
            
            onEdit(payload);
            setIsEditing(false);
        }
    };

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
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <div className="bg-blue-100 text-blue-600 rounded-lg p-1.5">
                                <FileText size={16} />
                            </div>
                            Chart of Accounts
                        </h3>
                        {/* Edit Button - Only show if unposted */}
                        {activeStatus !== "Y" && !isEditing && (
                            <button
                                onClick={handleEditToggle}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
                            >
                                <Edit2 size={14} />
                                Edit Amounts
                            </button>
                        )}
                        {/* Save/Cancel Buttons - Only show in edit mode */}
                        {isEditing && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={!isBalanced}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-white text-sm font-semibold rounded-lg transition ${
                                        isBalanced 
                                            ? "bg-green-600 hover:bg-green-700" 
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    <Save size={14} />
                                    Save
                                </button>
                                <button
                                    onClick={handleEditToggle}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold rounded-lg transition"
                                >
                                    <X size={14} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-center gap-4 py-4">
                        {/* Debit Account */}
                        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2">Debit</p>
                            <p className="text-sm font-semibold text-gray-900 mb-3">{journal.DebitCoaName || "—"}</p>
                            <div className="border-t border-blue-200 pt-3">
                                <p className="text-xs text-blue-700 font-medium mb-1">Amount</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editedDebitAmount}
                                        onChange={(e) => setEditedDebitAmount(e.target.value)}
                                        className="w-full text-xl font-bold text-blue-900 border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                    />
                                ) : (
                                    <p className="text-xl font-bold text-blue-900">
                                        ₱{Number(journal.DebitAmount || 0).toLocaleString("en-PH", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0">
                            <ArrowRight className="text-gray-400" size={24} />
                        </div>

                        {/* Credit Account */}
                        <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-xs font-bold text-green-900 uppercase tracking-wide mb-2">Credit</p>
                            <p className="text-sm font-semibold text-gray-900 mb-3">{journal.CreditCoaName || "—"}</p>
                            <div className="border-t border-green-200 pt-3">
                                <p className="text-xs text-green-700 font-medium mb-1">Amount</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editedCreditAmount}
                                        onChange={(e) => setEditedCreditAmount(e.target.value)}
                                        className="w-full text-xl font-bold text-green-900 border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="0.00"
                                    />
                                ) : (
                                    <p className="text-xl font-bold text-green-900">
                                        ₱{Number(journal.CreditAmount || 0).toLocaleString("en-PH", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Balance Validation Indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">Balance Status:</span>
                            {isBalanced ? (
                                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-bold text-sm">Balanced</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-bold text-sm">Unbalanced</span>
                                </div>
                            )}
                        </div>
                        {!isBalanced && (
                            <p className="text-xs text-red-600 mt-2 italic">
                                ⚠️ Warning: Debit and Credit amounts must be equal before {isEditing ? "saving" : "posting"}.
                            </p>
                        )}
                        {isEditing && (
                            <p className="text-xs text-blue-600 mt-2 italic">
                                💡 Tip: Adjust the amounts above to make the entry balanced.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewJournalModalComponent;
