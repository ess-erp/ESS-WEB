import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { Pencil, Plus, Trash2, DollarSign, FileText } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import RedBtn from "../ButtonsComponents/RedBtn";
import OutlineRedBtn from "../ButtonsComponents/OutlineRedBtn";
import { fetchUpdateJournalData, fetchGetJournalData } from "../../states/AccountingState/Action";
import { showToast } from "../../states/NotificationState/Action";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EditJournalEntryModal = ({ isOpen, onClose, journal, page, pageSize, search, userType, schoolYear }) => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    const { control, register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            lines: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lines"
    });

    const watchLines = watch("lines");

    // Calculate totals
    const totalDebit = watchLines.reduce((sum, line) => {
        return sum + (line.EntryType === "Debit" ? Number(line.Amount || 0) : 0);
    }, 0);

    const totalCredit = watchLines.reduce((sum, line) => {
        return sum + (line.EntryType === "Credit" ? Number(line.Amount || 0) : 0);
    }, 0);

    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    // Load journal data when modal opens
    useEffect(() => {
        if (isOpen && journal) {
            const lines = (journal.JournalLines || []).map(line => ({
                FeesChildId: line.FeesChildId,
                EntryType: line.EntryType,
                Amount: line.Amount,
                Remarks: line.Remarks || "",
                AccountCode: line.AccountCode,
                AccountName: line.AccountName
            }));
            reset({ lines });
        }
    }, [isOpen, journal, reset]);

    // Handle form submission
    const onSubmit = async (data) => {
        if (!isBalanced) {
            dispatch(showToast({ message: "Journal entry must be balanced! Debits must equal Credits.", type: "error" }));
            return;
        }

        if (data.lines.length === 0) {
            dispatch(showToast({ message: "Please add at least one journal line.", type: "error" }));
            return;
        }

        const formData = {
            JournalId: journal.JournalId,
            ModifiedByUserId: user?.userId,
            Lines: data.lines.map(line => ({
                FeesChildId: line.FeesChildId,
                EntryType: line.EntryType,
                Amount: Number(line.Amount),
                Remarks: line.Remarks || null
            }))
        };

        const res = await dispatch(fetchUpdateJournalData(formData));
        
        if (res.ok) {
            dispatch(showToast({ message: "Journal entry updated successfully!", type: "success" }));
            // Refresh the journal list
            dispatch(fetchGetJournalData(page, pageSize, search, null, userType?.value || null, schoolYear?.value || null));
            handleClose();
        } else {
            dispatch(showToast({ message: res.data?.Message || "Failed to update journal entry.", type: "error" }));
        }
    };

    const handleClose = () => {
        reset({ lines: [] });
        onClose();
    };

    const handleAddLine = () => {
        append({
            FeesChildId: 0,
            EntryType: "Debit",
            Amount: 0,
            Remarks: "",
            AccountCode: "",
            AccountName: ""
        });
    };

    if (!journal) return null;

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={handleClose}
            title={
                <div className="flex items-center gap-2">
                    <div className="bg-amber-600 text-white rounded-lg p-2">
                        <Pencil size={20} />
                    </div>
                    <div>
                        <span className="font-bold text-base sm:text-lg text-gray-900">Edit Journal Entry</span>
                        <p className="text-xs text-gray-500 font-normal mt-0.5">Journal ID: #{journal.JournalId}</p>
                    </div>
                </div>
            }
            size="w-[95vw] max-w-5xl"
            maxHeight="90vh"
            body={
                <div className="overflow-y-auto max-h-[calc(90vh-220px)] px-2 py-2">
                    {/* Journal Info */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-gray-500 font-medium mb-1">User</p>
                                <p className="font-semibold text-gray-900">
                                    {journal.UserFullName || "—"}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {journal.StudentNumber 
                                        ? `${journal.StudentNumber} · Student`
                                        : journal.EmployeeNumber
                                            ? `${journal.EmployeeNumber} · Employee`
                                            : journal.UserType || "—"
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium mb-1">School Year</p>
                                <p className="font-semibold text-gray-900">{journal.SchoolYear || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium mb-1">Date Created</p>
                                <p className="font-semibold text-gray-900">
                                    {journal.DateCreated ? new Date(journal.DateCreated).toLocaleDateString("en-PH") : "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg mb-4 text-sm">
                        <strong className="font-bold">⚠ Warning:</strong> Editing journal entries will update the accounting records. Ensure all changes are accurate.
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Journal Lines */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <FileText size={18} />
                                    Journal Lines
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleAddLine}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                                >
                                    <Plus size={14} />
                                    Add Line
                                </button>
                            </div>

                            {fields.length === 0 && (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <FileText className="mx-auto text-gray-300 mb-2" size={40} />
                                    <p className="text-gray-500 text-sm">No journal lines. Click "Add Line" to start.</p>
                                </div>
                            )}

                            {fields.map((field, index) => (
                                <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-xs font-bold text-gray-500">Line {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Account Info (Read-only) */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Account</label>
                                            <input
                                                type="text"
                                                value={`${watchLines[index]?.AccountCode || ""} - ${watchLines[index]?.AccountName || ""}`}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                                                readOnly
                                                disabled
                                            />
                                        </div>

                                        {/* Entry Type */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Entry Type *</label>
                                            <select
                                                {...register(`lines.${index}.EntryType`, { required: "Entry type is required" })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                            >
                                                <option value="Debit">Debit</option>
                                                <option value="Credit">Credit</option>
                                            </select>
                                            {errors.lines?.[index]?.EntryType && (
                                                <p className="text-red-500 text-xs mt-1">{errors.lines[index].EntryType.message}</p>
                                            )}
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Amount *</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register(`lines.${index}.Amount`, { 
                                                        required: "Amount is required",
                                                        min: { value: 0.01, message: "Amount must be greater than 0" }
                                                    })}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            {errors.lines?.[index]?.Amount && (
                                                <p className="text-red-500 text-xs mt-1">{errors.lines[index].Amount.message}</p>
                                            )}
                                        </div>

                                        {/* Remarks */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                                            <input
                                                type="text"
                                                {...register(`lines.${index}.Remarks`)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                                placeholder="Optional remarks..."
                                            />
                                        </div>

                                        {/* Hidden fields to preserve data */}
                                        <input type="hidden" {...register(`lines.${index}.FeesChildId`)} />
                                        <input type="hidden" {...register(`lines.${index}.AccountCode`)} />
                                        <input type="hidden" {...register(`lines.${index}.AccountName`)} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Balance Summary */}
                        {fields.length > 0 && (
                            <div className="bg-gray-900 rounded-xl px-5 py-4 text-white mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">Total Debits</span>
                                    <span className="text-lg font-bold">₱{fmt(totalDebit)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
                                    <span className="text-sm font-medium">Total Credits</span>
                                    <span className="text-lg font-bold">₱{fmt(totalCredit)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold">Difference</span>
                                    <span className={`text-xl font-bold ${isBalanced ? "text-green-400" : "text-red-400"}`}>
                                        ₱{fmt(Math.abs(totalDebit - totalCredit))}
                                    </span>
                                </div>
                                <div className="mt-3">
                                    {isBalanced ? (
                                        <div className="bg-green-500/20 border border-green-400 rounded-lg px-3 py-2 text-center">
                                            <p className="text-xs font-semibold text-green-300">✓ Journal entry is balanced</p>
                                        </div>
                                    ) : (
                                        <div className="bg-red-500/20 border border-red-400 rounded-lg px-3 py-2 text-center">
                                            <p className="text-xs font-semibold text-red-300">⚠ Journal entry is not balanced</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            }
            buttons={[
                <OutlineRedBtn key="cancel" label="Cancel" onClick={handleClose} />,
                <GreenBtn 
                    key="save" 
                    label="Save Changes" 
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isBalanced || fields.length === 0}
                />
            ]}
        />
    );
};

export default EditJournalEntryModal;
