import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Eye, Edit2, Save, X, CheckCircle } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchGetCashierTransactionsData,
    fetchPostCashierJournalData,
    fetchGetCoaFlatData,
} from "../../states/AccountingState/Action";

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const INPUT = "w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400";

const STATUS_BADGE = {
    Unposted: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    Posted:   "bg-green-100 text-green-700 border border-green-300",
    Adjusted: "bg-blue-100 text-blue-700 border border-blue-300",
};

// ─── View Journal Entries Modal ───────────────────────────────────────────────
const ViewJournalModal = ({ transaction, entries, onClose }) => {
    if (!transaction) return null;

    const totDebit  = entries.reduce((s, e) => s + Number(e.debit || 0), 0);
    const totCredit = entries.reduce((s, e) => s + Number(e.credit || 0), 0);

    return (
        <div className="space-y-4">
            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">OR Number</p>
                    <p className="font-semibold text-gray-800">{transaction.OrNumber || "—"}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Transaction Date</p>
                    <p className="font-semibold text-gray-800">
                        {transaction.TransactionDate ? new Date(transaction.TransactionDate).toLocaleDateString() : "—"}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Cashier</p>
                    <p className="font-semibold text-gray-800">{transaction.CashierName || "—"}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Student</p>
                    <p className="font-semibold text-gray-800">{transaction.StudentName || "—"}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">Transaction Types</p>
                    <p className="font-semibold text-gray-800">{transaction.TransactionTypes || "—"}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Total Amount</p>
                    <p className="font-semibold text-green-700">₱{fmt(transaction.TotalAmount)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[transaction.Status] || STATUS_BADGE.Unposted}`}>
                        {transaction.Status || "Unposted"}
                    </span>
                </div>
            </div>

            {/* Journal Entries Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase border-b">Account</th>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase border-b">Description</th>
                            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase border-b">Debit</th>
                            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase border-b">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((e, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                <td className="px-4 py-2.5">
                                    <span className="font-medium text-gray-700">{e.accountCode}</span>
                                    <br />
                                    <span className="text-xs text-gray-500">{e.accountName}</span>
                                </td>
                                <td className="px-4 py-2.5 text-gray-600">{e.description || "—"}</td>
                                <td className="px-4 py-2.5 text-right font-medium text-gray-800">
                                    {Number(e.debit) > 0 ? `₱${fmt(e.debit)}` : "—"}
                                </td>
                                <td className="px-4 py-2.5 text-right font-medium text-gray-800">
                                    {Number(e.credit) > 0 ? `₱${fmt(e.credit)}` : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-300 bg-gray-100">
                        <tr>
                            <td colSpan={2} className="px-4 py-2.5 text-right font-bold text-gray-700">Total</td>
                            <td className="px-4 py-2.5 text-right font-bold text-gray-900">₱{fmt(totDebit)}</td>
                            <td className="px-4 py-2.5 text-right font-bold text-gray-900">₱{fmt(totCredit)}</td>
                        </tr>
                        {Math.abs(totDebit - totCredit) > 0.01 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-1.5 text-center text-xs font-semibold text-red-600 bg-red-50">
                                    ⚠ Debits and credits are not balanced. Difference: ₱{fmt(Math.abs(totDebit - totCredit))}
                                </td>
                            </tr>
                        )}
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CashierTransactionJournalDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    // table
    const [table,        setTable]        = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading,      setLoading]      = useState(false);
    const [page,         setPage]         = useState(1);
    const [pageSize,     setPageSize]     = useState(10);
    const [search,       setSearch]       = useState("");
    const [dateFrom,     setDateFrom]     = useState("");
    const [dateTo,       setDateTo]       = useState("");
    const [statusFilter, setStatusFilter] = useState("Unposted");

    // modals
    const [isViewModal,     setIsViewModal]     = useState(false);
    const [isEditModal,     setIsEditModal]     = useState(false);
    const [isConfirmModal,  setIsConfirmModal]  = useState(false);
    const [isSuccessModal,  setIsSuccessModal]  = useState(false);
    const [isErrorModal,    setIsErrorModal]    = useState(false);
    const [isLoadingModal,  setIsLoadingModal]  = useState(false);

    // selected transaction
    const [selectedTx,      setSelectedTx]      = useState(null);
    const [journalEntries,  setJournalEntries]  = useState([]);
    const [editedEntries,   setEditedEntries]   = useState([]);
    const [errors,          setErrors]          = useState({});

    // COA flat list
    const coaFlatState = useSelector((s) => s.accounting.coaFlatState);
    const coaList = Array.isArray(coaFlatState.data) ? coaFlatState.data : [];

    // ── columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: "OR Number",
            selector: (r) => r.OrNumber || "—",
            sortable: true,
            width: "130px",
        },
        {
            name: "Date",
            selector: (r) => r.TransactionDate ? new Date(r.TransactionDate).toLocaleDateString() : "—",
            sortable: true,
            width: "110px",
        },
        {
            name: "Cashier",
            selector: (r) => r.CashierName || "—",
            sortable: true,
            width: "150px",
        },
        {
            name: "Student",
            selector: (r) => r.StudentName || "—",
            sortable: true,
            wrap: true,
        },
        {
            name: "Transaction Types",
            selector: (r) => r.TransactionTypes || "—",
            sortable: true,
            wrap: true,
        },
        {
            name: "Total Amount",
            selector: (r) => `₱${fmt(r.TotalAmount)}`,
            sortable: true,
            right: true,
            width: "130px",
        },
        {
            name: "Status",
            cell: (r) => (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[r.Status] || STATUS_BADGE.Unposted}`}>
                    {r.Status || "Unposted"}
                </span>
            ),
            sortable: true,
            width: "100px",
        },
        {
            name: "Actions",
            cell: (r) => (
                <div className="flex gap-1">
                    <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleView(r)}
                        title="View"
                    >
                        <Eye size={18} />
                    </button>
                    {r.Status === "Unposted" && (
                        <button
                            className="p-1 text-green-600 hover:text-green-800"
                            onClick={() => handleEdit(r)}
                            title="Edit & Post"
                        >
                            <Edit2 size={18} />
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            width: "90px",
        },
    ];

    // ── fetch table ───────────────────────────────────────────────────────────
    const fetchTable = async () => {
        setLoading(true);
        const res = await dispatch(fetchGetCashierTransactionsData(page, pageSize, search, dateFrom, dateTo, statusFilter));
        if (res.ok) {
            setTable(res.data || []);
            setTotalRecords(res.totalRecords || 0);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTable();
    }, [page, pageSize, search, dateFrom, dateTo, statusFilter]);

    // ── view ──────────────────────────────────────────────────────────────────
    const handleView = (row) => {
        setSelectedTx(row);
        // Parse the auto-generated journal entries from the backend
        const entries = row.JournalEntries || [];
        setJournalEntries(entries);
        setIsViewModal(true);
    };

    // ── edit ──────────────────────────────────────────────────────────────────
    const handleEdit = (row) => {
        setSelectedTx(row);
        const entries = row.JournalEntries || [];
        setEditedEntries(JSON.parse(JSON.stringify(entries))); // deep copy
        setErrors({});
        dispatch(fetchGetCoaFlatData());
        setIsEditModal(true);
    };

    const updateEntry = (i, field, value) => {
        setEditedEntries((prev) => prev.map((e, idx) => {
            if (idx !== i) return e;
            const updated = { ...e, [field]: value };
            
            // If COA ID changes, update account code and name
            if (field === "coaId") {
                const acct = coaList.find((c) => String(c.CoaId) === String(value));
                updated.accountCode = acct?.AccountCode || "";
                updated.accountName = acct?.AccountName || "";
            }
            
            return updated;
        }));
    };

    // ── validate ──────────────────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        const totDr = editedEntries.reduce((s, entry) => s + Number(entry.debit  || 0), 0);
        const totCr = editedEntries.reduce((s, entry) => s + Number(entry.credit || 0), 0);
        
        if (Math.abs(totDr - totCr) > 0.01) {
            e.balance = `Journal is not balanced. Difference: ₱${fmt(Math.abs(totDr - totCr))}`;
        }

        editedEntries.forEach((entry, i) => {
            if (!entry.coaId) e[`entry-${i}-coaId`] = "Select an account";
        });

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmitEdit = () => {
        if (!validate()) return;
        setIsEditModal(false);
        setIsConfirmModal(true);
    };

    // ── confirm post ──────────────────────────────────────────────────────────
    const handleConfirm = async () => {
        setIsConfirmModal(false);
        setIsLoadingModal(true);

        const payload = {
            TransactionId:   selectedTx.TransactionId,
            CreatedByUserId: user?.UserId,
            JournalEntries:  editedEntries.map((e) => ({
                CoaId:       e.coaId,
                Description: e.description || "",
                Debit:       String(e.debit  || "0"),
                Credit:      String(e.credit || "0"),
            })),
        };

        const res = await dispatch(fetchPostCashierJournalData(payload));
        setIsLoadingModal(false);
        
        if (res.ok) {
            setIsSuccessModal(true);
            fetchTable();
        } else {
            setIsErrorModal(true);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4">
            {/* Filters */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <span className="font-bold text-lg text-green-700">Cashier Transactions — Auto-Generated Journal Entries</span>
                
                <div className="flex flex-wrap items-center gap-2">
                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-green-300"
                    >
                        <option value="">All Status</option>
                        <option value="Unposted">Unposted</option>
                        <option value="Posted">Posted</option>
                        <option value="Adjusted">Adjusted</option>
                    </select>

                    {/* Date range */}
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-green-300"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-green-300"
                    />

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search OR, cashier, student..."
                        className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring focus:ring-green-300"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={table}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={(p) => setPage(p)}
                onChangeRowsPerPage={(s, p) => { setPageSize(s); setPage(p); }}
                highlightOnHover
                striped
                responsive
            />

            {/* View Modal */}
            <ModalComponent
                isOpen={isViewModal}
                onClose={() => setIsViewModal(false)}
                title="View Journal Entries"
                size="w-[900px]"
                body={<ViewJournalModal transaction={selectedTx} entries={journalEntries} onClose={() => setIsViewModal(false)} />}
                buttons={[
                    { label: "Close", type: "red", onClick: () => setIsViewModal(false) },
                ]}
            />

            {/* Edit Modal */}
            <ModalComponent
                isOpen={isEditModal}
                onClose={() => setIsEditModal(false)}
                title="Edit & Post Journal Entry"
                size="w-[1000px]"
                maxHeight="90vh"
                body={
                    <div className="space-y-4">
                        {selectedTx && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
                                <p className="font-semibold text-blue-900">
                                    {selectedTx.OrNumber} — {selectedTx.StudentName}
                                </p>
                                <p className="text-blue-700 text-xs">{selectedTx.TransactionTypes} • ₱{fmt(selectedTx.TotalAmount)}</p>
                            </div>
                        )}

                        {errors.balance && (
                            <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm">
                                {errors.balance}
                            </div>
                        )}

                        <div className="overflow-x-auto border border-gray-200 rounded-xl max-h-96 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase border-b">Account</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase border-b">Description</th>
                                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 uppercase border-b">Debit</th>
                                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 uppercase border-b">Credit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editedEntries.map((e, i) => (
                                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                            <td className="px-3 py-2">
                                                <select
                                                    value={e.coaId || ""}
                                                    onChange={(ev) => updateEntry(i, "coaId", ev.target.value)}
                                                    className={`${INPUT} ${errors[`entry-${i}-coaId`] ? "border-red-500" : ""}`}
                                                >
                                                    <option value="">— Select Account —</option>
                                                    {coaList.map((coa) => (
                                                        <option key={coa.CoaId} value={coa.CoaId}>
                                                            {coa.AccountCode} - {coa.AccountName}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[`entry-${i}-coaId`] && (
                                                    <p className="text-red-500 text-xs mt-0.5">{errors[`entry-${i}-coaId`]}</p>
                                                )}
                                            </td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="text"
                                                    value={e.description || ""}
                                                    onChange={(ev) => updateEntry(i, "description", ev.target.value)}
                                                    className={INPUT}
                                                    placeholder="Optional"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={e.debit || ""}
                                                    onChange={(ev) => updateEntry(i, "debit", ev.target.value)}
                                                    className={`${INPUT} text-right`}
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={e.credit || ""}
                                                    onChange={(ev) => updateEntry(i, "credit", ev.target.value)}
                                                    className={`${INPUT} text-right`}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-300 bg-gray-100 sticky bottom-0">
                                    <tr>
                                        <td colSpan={2} className="px-3 py-2 text-right font-bold text-gray-700">Total</td>
                                        <td className="px-3 py-2 text-right font-bold text-gray-900">
                                            ₱{fmt(editedEntries.reduce((s, e) => s + Number(e.debit || 0), 0))}
                                        </td>
                                        <td className="px-3 py-2 text-right font-bold text-gray-900">
                                            ₱{fmt(editedEntries.reduce((s, e) => s + Number(e.credit || 0), 0))}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                }
                buttons={[
                    { label: "Post to Journal", type: "green", onClick: handleSubmitEdit },
                    { label: "Cancel", type: "red", onClick: () => setIsEditModal(false) },
                ]}
            />

            {/* Confirm Modal */}
            <ModalComponent
                isOpen={isConfirmModal}
                onClose={() => setIsConfirmModal(false)}
                title="Confirm Post to Journal"
                body={
                    <div className="space-y-2">
                        <p>Are you sure you want to post this transaction to the journal?</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                            <p><strong>OR Number:</strong> {selectedTx?.OrNumber}</p>
                            <p><strong>Amount:</strong> ₱{fmt(selectedTx?.TotalAmount)}</p>
                            <p><strong>Entries:</strong> {editedEntries.length} lines</p>
                        </div>
                        <p className="text-xs text-gray-500">This action cannot be undone.</p>
                    </div>
                }
                buttons={[
                    { label: "Yes, Post", type: "green", onClick: handleConfirm },
                    { label: "Cancel", type: "red", onClick: () => setIsConfirmModal(false) },
                ]}
            />

            {/* Loading Modal */}
            <ModalComponent
                isOpen={isLoadingModal}
                onClose={() => {}}
                title="Processing"
                body={<div className="text-center py-4">Posting journal entry...</div>}
                buttons={[]}
            />

            {/* Success Modal */}
            <ModalComponent
                isOpen={isSuccessModal}
                onClose={() => setIsSuccessModal(false)}
                title="Success"
                body={
                    <div className="text-center py-4">
                        <CheckCircle className="mx-auto text-green-600 mb-2" size={48} />
                        <p>Journal entry posted successfully!</p>
                    </div>
                }
                buttons={[{ label: "Close", type: "green", onClick: () => setIsSuccessModal(false) }]}
            />

            {/* Error Modal */}
            <ModalComponent
                isOpen={isErrorModal}
                onClose={() => setIsErrorModal(false)}
                title="Error"
                body={<div className="text-center py-4 text-red-600">Failed to post journal entry. Please try again.</div>}
                buttons={[{ label: "Close", type: "red", onClick: () => setIsErrorModal(false) }]}
            />
        </div>
    );
};

export default CashierTransactionJournalDataTable;
