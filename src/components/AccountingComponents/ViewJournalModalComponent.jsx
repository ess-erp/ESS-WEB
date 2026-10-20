import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    FileText, 
    User, 
    Calendar,
    Receipt,
    ArrowRight,
    Edit2,
    Save,
    X,
    AlertTriangle
} from "lucide-react";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import { fetchGetCoaFlatData } from "../../states/AccountingState/Action";

// ─── View Journal Modal Component ─────────────────────────────────────────────
const ViewJournalModalComponent = ({ journal, loading, onPost, posting, onGetModalData, onEdit }) => {
    const dispatch = useDispatch();
    const activeStatus = journal?.ActiveStatus || "P";
    const [isEditing, setIsEditing] = useState(false);
    const [editedDebitAmount, setEditedDebitAmount] = useState("");
    const [editedCreditAmount, setEditedCreditAmount] = useState("");
    const [editedDebitCoa, setEditedDebitCoa] = useState(null);
    const [editedCreditCoa, setEditedCreditCoa] = useState(null);
    
    // Journal Lines editing state
    const [isEditingLines, setIsEditingLines] = useState(false);
    const [editedJournalLines, setEditedJournalLines] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSavingLines, setIsSavingLines] = useState(false);
    
    // Get COA flat list from Redux
    const coaFlatState = useSelector((s) => s.accounting.coaFlatState);
    const coaList = coaFlatState.data || [];
    
    // Transform COA list for SearchableSelect
    const coaOptions = coaList.map(coa => ({
        value: coa.CoaChildId || coa.coaChildId,
        label: `${coa.AccountCode || coa.accountCode || ''} - ${coa.AccountName || coa.accountName || ''}`,
        accountName: coa.AccountName || coa.accountName,
        accountCode: coa.AccountCode || coa.accountCode
    }));
    
    // Calculate if debit and credit are balanced
    const debitAmount = isEditing ? Number(editedDebitAmount || 0) : Number(journal?.DebitAmount || 0);
    const creditAmount = isEditing ? Number(editedCreditAmount || 0) : Number(journal?.CreditAmount || 0);
    const isBalanced = debitAmount === creditAmount && debitAmount > 0;

    // Fetch COA list on mount
    useEffect(() => {
        dispatch(fetchGetCoaFlatData());
    }, [dispatch]);

    // Initialize edit values when journal changes
    useEffect(() => {
        if (journal) {
            setEditedDebitAmount(journal.DebitAmount?.toString() || "");
            setEditedCreditAmount(journal.CreditAmount?.toString() || "");
            
            // Find and set the current COA selections
            if (journal.DebitCoaName && coaOptions.length > 0) {
                const debitOption = coaOptions.find(opt => 
                    opt.accountName === journal.DebitCoaName
                );
                setEditedDebitCoa(debitOption || null);
            }
            
            if (journal.CreditCoaName && coaOptions.length > 0) {
                const creditOption = coaOptions.find(opt => 
                    opt.accountName === journal.CreditCoaName
                );
                setEditedCreditCoa(creditOption || null);
            }
        }
    }, [journal?.JournalId, coaOptions.length]);

    // Pass modal data to parent for footer buttons
    useEffect(() => {
        if (onGetModalData && journal) {
            onGetModalData({ 
                isBalanced, 
                activeStatus, 
                journalId: journal.JournalId,
                isCancellationRequested: journal.IsCancellationRequested || false
            });
        }
    }, [journal?.JournalId, activeStatus, isBalanced, journal?.IsCancellationRequested, onGetModalData]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reset values
            setEditedDebitAmount(journal.DebitAmount?.toString() || "");
            setEditedCreditAmount(journal.CreditAmount?.toString() || "");
            
            // Reset COA selections
            if (journal.DebitCoaName && coaOptions.length > 0) {
                const debitOption = coaOptions.find(opt => 
                    opt.accountName === journal.DebitCoaName
                );
                setEditedDebitCoa(debitOption || null);
            }
            
            if (journal.CreditCoaName && coaOptions.length > 0) {
                const creditOption = coaOptions.find(opt => 
                    opt.accountName === journal.CreditCoaName
                );
                setEditedCreditCoa(creditOption || null);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleSaveEdit = () => {
        if (onEdit && isBalanced && editedDebitCoa && editedCreditCoa) {
            // Create payload for editing journal amounts and accounts
            const payload = {
                JournalId: journal.JournalId,
                DebitAmount: Number(editedDebitAmount),
                CreditAmount: Number(editedCreditAmount),
                DebitCoaChildId: editedDebitCoa.value,
                CreditCoaChildId: editedCreditCoa.value,
                // Include additional context for audit trail
                DebitCoaName: editedDebitCoa.accountName,
                CreditCoaName: editedCreditCoa.accountName,
                IssuedFullName: journal.IssuedFullName,
                TransactionType: journal.TransactionType,
                OrNumberUsed: journal.OrNumberUsed
            };
            
            onEdit(payload);
            setIsEditing(false);
        }
    };

    // ── Journal Lines Editing Handlers ────────────────────────────────────────
    // Initialize journal lines when component loads
    useEffect(() => {
        if (journal?.JournalLines && journal.JournalLines.length > 0 && coaOptions.length > 0) {
            const lines = journal.JournalLines.map(line => {
                const selectedCoa = coaOptions.find(opt => 
                    opt.accountName === line.AccountName
                ) || null;
                
                return {
                    JournalChildId: line.JournalChildId,
                    selectedCoa: selectedCoa,
                    amount: line.Amount?.toString() || "0",
                    entryType: line.EntryType,
                    originalData: line
                };
            });
            setEditedJournalLines(lines);
        }
    }, [journal?.JournalId, journal?.JournalLines, coaOptions.length]);

    const handleEditLinesToggle = () => {
        if (isEditingLines) {
            // Cancel - reset to original
            if (journal?.JournalLines && journal.JournalLines.length > 0) {
                const lines = journal.JournalLines.map(line => {
                    const selectedCoa = coaOptions.find(opt => 
                        opt.accountName === line.AccountName
                    ) || null;
                    
                    return {
                        JournalChildId: line.JournalChildId,
                        selectedCoa: selectedCoa,
                        amount: line.Amount?.toString() || "0",
                        entryType: line.EntryType,
                        originalData: line
                    };
                });
                setEditedJournalLines(lines);
            }
        }
        setIsEditingLines(!isEditingLines);
    };

    const handleLineCoaChange = (index, newCoa) => {
        const updatedLines = [...editedJournalLines];
        updatedLines[index].selectedCoa = newCoa;
        setEditedJournalLines(updatedLines);
    };

    const handleLineAmountChange = (index, newAmount) => {
        const updatedLines = [...editedJournalLines];
        updatedLines[index].amount = newAmount;
        setEditedJournalLines(updatedLines);
    };

    const handleSaveLines = () => {
        // Show confirmation modal
        setShowConfirmModal(true);
    };

    const handleConfirmSaveLines = async () => {
        setShowConfirmModal(false);
        setIsSavingLines(true);
        
        try {
            // Build payload
            const payload = {
                journalId: journal.JournalId,
                journalLines: editedJournalLines.map(line => ({
                    journalChildId: line.JournalChildId,
                    coaChildId: line.selectedCoa?.value,
                    amount: Number(line.amount),
                    entryType: line.entryType
                }))
            };

            // Import the action
            const { fetchEditJournalLinesData } = await import("../../states/AccountingState/Action");
            const result = await dispatch(fetchEditJournalLinesData(payload));
            
            if (result.ok) {
                // Success - refresh journal detail
                const { fetchGetJournalDetailData } = await import("../../states/AccountingState/Action");
                await dispatch(fetchGetJournalDetailData(journal.JournalId));
                setIsEditingLines(false);
                
                // Show success message if you have a toast function
                // showToast("success", "Journal lines updated successfully!");
            } else {
                // Show error
                alert(result.data?.message || "Failed to update journal lines");
            }
        } catch (error) {
            alert("An error occurred while updating journal lines");
        } finally {
            setIsSavingLines(false);
        }
    };

    // Check if journal lines are balanced
    const areLinesBalanced = () => {
        if (editedJournalLines.length === 0) return false;
        
        const debitTotal = editedJournalLines
            .filter(line => line.entryType === "D" || line.entryType === "Debit")
            .reduce((sum, line) => sum + Number(line.amount || 0), 0);
            
        const creditTotal = editedJournalLines
            .filter(line => line.entryType === "C" || line.entryType === "Credit")
            .reduce((sum, line) => sum + Number(line.amount || 0), 0);
            
        return debitTotal === creditTotal && debitTotal > 0;
    };

    // Check if all lines have COA selected
    const areAllCoasSelected = () => {
        return editedJournalLines.every(line => line.selectedCoa !== null);
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

    // Separate journal lines into original and cancellation entries
    const journalLines = journal?.JournalLines || [];
    const hasJournalLines = journalLines.length > 0;

    return (
        <div className="space-y-6">
            {/* Cancellation Warning Alert - Show if cancellation was requested AND not already cancelled */}
            {journal.IsCancellationRequested && activeStatus !== "C" && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            <div className="bg-red-100 text-red-600 rounded-lg p-2">
                                <AlertTriangle size={24} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-red-900 font-bold text-sm mb-2 flex items-center gap-2">
                                ⚠️ SI/OR Cancellation Request
                            </h4>
                            <p className="text-red-800 text-sm mb-3">
                                A cancellation request has been submitted for this transaction. 
                                Please review and take appropriate action.
                            </p>
                            <div className="bg-white rounded-lg p-3 space-y-2 text-xs">
                                {journal.CancellationRequestedBy && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Requested By:</span>
                                        <span className="text-gray-900 font-semibold">{journal.CancellationRequestedBy}</span>
                                    </div>
                                )}
                                {journal.CancellationRequestDate && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Request Date:</span>
                                        <span className="text-gray-900 font-semibold">
                                            {new Date(journal.CancellationRequestDate).toLocaleString("en-PH", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Information Card */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
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

            {/* Journal Lines Section - Show when journal lines exist */}
            {hasJournalLines && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <div className="bg-purple-100 text-purple-600 rounded-lg p-1.5">
                                <FileText size={16} />
                            </div>
                            Journal Lines
                            {activeStatus === "C" && (
                                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                    CANCELLED - Reversal Entries Applied
                                </span>
                            )}
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 font-medium">
                                {journalLines.length} {journalLines.length === 1 ? 'Entry' : 'Entries'}
                            </span>
                            {/* Edit/Save Buttons - Only show if UNPOSTED and no cancellation request */}
                            {activeStatus === "P" && !journal.IsCancellationRequested && !isEditingLines && (
                                <button
                                    onClick={handleEditLinesToggle}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition"
                                >
                                    <Edit2 size={14} />
                                    Edit Lines
                                </button>
                            )}
                            {isEditingLines && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleSaveLines}
                                        disabled={!areLinesBalanced() || !areAllCoasSelected() || isSavingLines}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition ${
                                            (areLinesBalanced() && areAllCoasSelected() && !isSavingLines)
                                                ? "bg-green-600 hover:bg-green-700" 
                                                : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        {isSavingLines ? (
                                            <>
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={14} />
                                                Save
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleEditLinesToggle}
                                        disabled={isSavingLines}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold rounded-lg transition"
                                    >
                                        <X size={14} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table of Journal Lines */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Account
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Account Group
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Debit
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Credit
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {(isEditingLines ? editedJournalLines : journalLines).map((line, index) => {
                                    const isReversal = activeStatus === "C" && index >= journalLines.length / 2;
                                    const isDebit = isEditingLines 
                                        ? (line.entryType === "D" || line.entryType === "Debit")
                                        : (line.EntryType === "D" || line.EntryType === "Debit");
                                    const isCredit = isEditingLines
                                        ? (line.entryType === "C" || line.entryType === "Credit")
                                        : (line.EntryType === "C" || line.EntryType === "Credit");
                                    
                                    return (
                                        <tr 
                                            key={index} 
                                            className={`hover:bg-gray-50 ${isReversal ? 'bg-red-50' : ''}`}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {isReversal ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                                        <X size={12} />
                                                        Reversal
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                                        <Receipt size={12} />
                                                        Original
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {isEditingLines ? (
                                                    <div className="min-w-[250px]">
                                                        <SearchableSelect
                                                            label=""
                                                            options={coaOptions}
                                                            value={line.selectedCoa}
                                                            onChange={(newCoa) => handleLineCoaChange(index, newCoa)}
                                                            placeholder="Select Account..."
                                                            showSearchIcon={false}
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {line.AccountName || "—"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {line.AccountCode || ""}
                                                        </p>
                                                    </>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-700">
                                                    {(isEditingLines ? line.originalData?.AccountGroup : line.AccountGroup) || "—"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                {isEditingLines && isDebit ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={line.amount}
                                                        onChange={(e) => handleLineAmountChange(index, e.target.value)}
                                                        className="w-32 text-sm font-bold text-blue-900 border border-blue-300 rounded px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="0.00"
                                                    />
                                                ) : (
                                                    <span className={`text-sm font-bold ${isDebit ? 'text-blue-900' : 'text-gray-400'}`}>
                                                        ₱{isDebit ? Number((isEditingLines ? line.amount : line.Amount) || 0).toLocaleString("en-PH", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }) : '0.00'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                {isEditingLines && isCredit ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={line.amount}
                                                        onChange={(e) => handleLineAmountChange(index, e.target.value)}
                                                        className="w-32 text-sm font-bold text-green-900 border border-green-300 rounded px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        placeholder="0.00"
                                                    />
                                                ) : (
                                                    <span className={`text-sm font-bold ${isCredit ? 'text-green-900' : 'text-gray-400'}`}>
                                                        ₱{isCredit ? Number((isEditingLines ? line.amount : line.Amount) || 0).toLocaleString("en-PH", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }) : '0.00'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <p className="text-xs font-medium text-gray-900">
                                                    {(isEditingLines ? line.originalData.DateCreated : line.DateCreated) 
                                                        ? new Date(isEditingLines ? line.originalData.DateCreated : line.DateCreated).toLocaleDateString("en-PH") 
                                                        : "—"}
                                                </p>
                                                <p className="text-[10px] text-gray-500">
                                                    {(isEditingLines ? line.originalData.DateCreated : line.DateCreated) 
                                                        ? new Date(isEditingLines ? line.originalData.DateCreated : line.DateCreated).toLocaleTimeString("en-PH", { 
                                                            hour: "2-digit", 
                                                            minute: "2-digit" 
                                                        }) 
                                                        : ""}
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {/* Totals Row */}
                            <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                                <tr>
                                    <td colSpan="3" className="px-4 py-3 text-right">
                                        <span className="text-sm font-bold text-gray-900">TOTALS:</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="text-sm font-bold text-blue-900">
                                            ₱{(isEditingLines ? editedJournalLines : journalLines)
                                                .filter(line => (isEditingLines ? line.entryType : line.EntryType) === "D" || (isEditingLines ? line.entryType : line.EntryType) === "Debit")
                                                .reduce((sum, line) => sum + Number((isEditingLines ? line.amount : line.Amount) || 0), 0)
                                                .toLocaleString("en-PH", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="text-sm font-bold text-green-900">
                                            ₱{(isEditingLines ? editedJournalLines : journalLines)
                                                .filter(line => (isEditingLines ? line.entryType : line.EntryType) === "C" || (isEditingLines ? line.entryType : line.EntryType) === "Credit")
                                                .reduce((sum, line) => sum + Number((isEditingLines ? line.amount : line.Amount) || 0), 0)
                                                .toLocaleString("en-PH", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Validation Messages for Editing */}
                    {isEditingLines && (
                        <div className="mt-4 space-y-2">
                            {!areLinesBalanced() && (
                                <p className="text-xs text-red-600 italic">
                                    ⚠️ Warning: Debit and Credit totals must be equal before saving.
                                </p>
                            )}
                            {!areAllCoasSelected() && (
                                <p className="text-xs text-orange-600 italic">
                                    💡 Please select an account for all journal lines.
                                </p>
                            )}
                            {areLinesBalanced() && areAllCoasSelected() && (
                                <p className="text-xs text-green-600 italic">
                                    ✓ All journal lines are valid and balanced.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Cancellation Explanation */}
                    {activeStatus === "C" && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-red-900 mb-1">Cancellation Process</h4>
                                    <p className="text-xs text-red-800 leading-relaxed">
                                        This journal entry has been cancelled. The system automatically created <strong>reversal entries</strong> to 
                                        nullify the original transaction. The first half shows the original entries, and the second half 
                                        shows the reversing entries that balance out the transaction to zero.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Account Information Card - Only show if no journal lines (for backwards compatibility) */}
            {!hasJournalLines && (journal.DebitCoaName || journal.CreditCoaName) && (
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
                                Edit Entry
                            </button>
                        )}
                        {/* Save/Cancel Buttons - Only show in edit mode */}
                        {isEditing && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={!isBalanced || !editedDebitCoa || !editedCreditCoa}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-white text-sm font-semibold rounded-lg transition ${
                                        (isBalanced && editedDebitCoa && editedCreditCoa)
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
                            {isEditing ? (
                                <div className="mb-3">
                                    <SearchableSelect
                                        label=""
                                        options={coaOptions}
                                        value={editedDebitCoa}
                                        onChange={setEditedDebitCoa}
                                        placeholder="Select Debit Account..."
                                        showSearchIcon={true}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm font-semibold text-gray-900 mb-3">{journal.DebitCoaName || "—"}</p>
                            )}
                            {!isEditing && journal.AccountGroup && (
                                <div className="mb-2">
                                    <p className="text-xs text-blue-700 font-medium">Account Group</p>
                                    <p className="text-sm font-semibold text-gray-700">{journal.AccountGroup}</p>
                                </div>
                            )}
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
                            {isEditing ? (
                                <div className="mb-3">
                                    <SearchableSelect
                                        label=""
                                        options={coaOptions}
                                        value={editedCreditCoa}
                                        onChange={setEditedCreditCoa}
                                        placeholder="Select Credit Account..."
                                        showSearchIcon={true}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm font-semibold text-gray-900 mb-3">{journal.CreditCoaName || "—"}</p>
                            )}
                            {!isEditing && journal.AccountGroup && (
                                <div className="mb-2">
                                    <p className="text-xs text-green-700 font-medium">Account Group</p>
                                    <p className="text-sm font-semibold text-gray-700">{journal.AccountGroup}</p>
                                </div>
                            )}
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
                        {isEditing && !editedDebitCoa && (
                            <p className="text-xs text-blue-600 mt-2 italic">
                                💡 Please select a Debit account.
                            </p>
                        )}
                        {isEditing && !editedCreditCoa && (
                            <p className="text-xs text-blue-600 mt-2 italic">
                                💡 Please select a Credit account.
                            </p>
                        )}
                        {isEditing && editedDebitCoa && editedCreditCoa && isBalanced && (
                            <p className="text-xs text-green-600 mt-2 italic">
                                ✓ Entry is ready to save.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation Modal for Saving Journal Lines */}
            <ModalComponent
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title={
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-600 text-white rounded-lg p-2">
                            <AlertTriangle size={20} />
                        </div>
                        <span className="font-bold text-base text-gray-900">Confirm Save Changes</span>
                    </div>
                }
                size="w-full max-w-md"
                body={
                    <div className="py-4">
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to save the changes to the journal lines?
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-900 font-semibold mb-2">Changes will include:</p>
                            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                                <li>Updated account selections</li>
                                <li>Modified amounts</li>
                                <li>All {editedJournalLines.length} journal line(s)</li>
                            </ul>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 italic">
                            This action will update the journal entry. You can still post it later.
                        </p>
                    </div>
                }
                buttons={[
                    {
                        label: "Yes, Save Changes",
                        type: "green",
                        onClick: handleConfirmSaveLines
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => setShowConfirmModal(false)
                    }
                ]}
            />
        </div>
    );
};

export default ViewJournalModalComponent;
