import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Eye, Trash2, Plus } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchGetJournalData,
    fetchGetJournalDetailData,
    fetchInsertJournalData,
    fetchGetCoaFlatData,
} from "../../states/AccountingState/Action";

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const INPUT  = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400";
const RINPUT = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed";

const STATUS_BADGE = {
    Draft:  "bg-gray-100 text-gray-600 border border-gray-300",
    Posted: "bg-green-100 text-green-700 border border-green-300",
    Void:   "bg-red-100 text-red-600 border border-red-300",
};

const emptyLine = () => ({ coaId: "", accountCode: "", accountName: "", debit: "", credit: "" });

// ─── View modal body ──────────────────────────────────────────────────────────
const ViewJournalBody = ({ detail, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-10 text-gray-400">
                Loading journal entry...
            </div>
        );
    }
    if (!detail) return <p className="text-center text-gray-400 py-6">No data found.</p>;

    const lines  = Array.isArray(detail.Lines) ? detail.Lines : [];
    const totDr  = lines.reduce((s, l) => s + Number(l.Debit  || 0), 0);
    const totCr  = lines.reduce((s, l) => s + Number(l.Credit || 0), 0);

    return (
        <div className="space-y-5 text-sm">
            {/* Header info */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Journal No.</p>
                    <p className="font-semibold text-gray-800">{detail.JournalNo || "—"}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Date</p>
                    <p className="font-semibold text-gray-800">
                        {detail.JournalDate ? new Date(detail.JournalDate).toLocaleDateString() : "—"}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Reference No.</p>
                    <p className="font-semibold text-gray-800">{detail.ReferenceNo || "—"}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[detail.Status] || STATUS_BADGE.Draft}`}>
                        {detail.Status || "Draft"}
                    </span>
                </div>
                <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">Description</p>
                    <p className="font-semibold text-gray-800">{detail.Description || "—"}</p>
                </div>
            </div>

            {/* Lines */}
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
                        {lines.map((l, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                <td className="px-4 py-2.5 text-gray-700">
                                    <span className="font-medium">{l.AccountCode}</span>
                                    <span className="ml-2 text-gray-500">{l.AccountName}</span>
                                </td>
                                <td className="px-4 py-2.5 text-gray-500">{l.LineDescription || "—"}</td>
                                <td className="px-4 py-2.5 text-right font-medium text-gray-800">
                                    {Number(l.Debit) > 0 ? `₱${fmt(l.Debit)}` : "—"}
                                </td>
                                <td className="px-4 py-2.5 text-right font-medium text-gray-800">
                                    {Number(l.Credit) > 0 ? `₱${fmt(l.Credit)}` : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-300 bg-gray-100">
                        <tr>
                            <td colSpan={2} className="px-4 py-2.5 text-right font-bold text-gray-700 text-sm">Total</td>
                            <td className="px-4 py-2.5 text-right font-bold text-gray-900">₱{fmt(totDr)}</td>
                            <td className="px-4 py-2.5 text-right font-bold text-gray-900">₱{fmt(totCr)}</td>
                        </tr>
                        {totDr !== totCr && (
                            <tr>
                                <td colSpan={4} className="px-4 py-1.5 text-center text-xs font-semibold text-red-600 bg-red-50">
                                    ⚠ Debits and credits are not balanced.
                                </td>
                            </tr>
                        )}
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

// ─── New journal entry form body ──────────────────────────────────────────────
const NewJournalBody = ({ form, setForm, lines, setLines, coaList, errors }) => {
    const totDebit  = lines.reduce((s, l) => s + Number(l.debit  || 0), 0);
    const totCredit = lines.reduce((s, l) => s + Number(l.credit || 0), 0);
    const balanced  = totDebit > 0 && totDebit === totCredit;

    const updateLine = (i, field, value) => {
        setLines((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
    };

    const handleAccountSelect = (i, coaId) => {
        const acct = coaList.find((c) => String(c.CoaId) === String(coaId));
        setLines((prev) =>
            prev.map((l, idx) => idx === i
                ? { ...l, coaId, accountCode: acct?.AccountCode || "", accountName: acct?.AccountName || "" }
                : l
            )
        );
    };

    const addLine    = () => setLines((prev) => [...prev, emptyLine()]);
    const removeLine = (i) => setLines((prev) => prev.filter((_, idx) => idx !== i));

    return (
        <div className="space-y-5">
            {/* Header fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={form.journalDate}
                        onChange={(e) => setForm((f) => ({ ...f, journalDate: e.target.value }))}
                        className={`${INPUT} ${errors.journalDate ? "border-red-500" : ""}`}
                    />
                    {errors.journalDate && <p className="text-red-500 text-xs mt-1">{errors.journalDate}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference No.</label>
                    <input
                        type="text"
                        placeholder="e.g. OR-2026-001"
                        value={form.referenceNo}
                        onChange={(e) => setForm((f) => ({ ...f, referenceNo: e.target.value }))}
                        className={INPUT}
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Collection of tuition fee from students"
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        className={`${INPUT} ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
            </div>

            {/* Journal lines */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">Journal Lines</h3>
                    <button
                        type="button"
                        onClick={addLine}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg transition"
                    >
                        <Plus size={13} /> Add Line
                    </button>
                </div>

                {errors.lines && <p className="text-red-500 text-xs mb-2">{errors.lines}</p>}

                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-sm min-w-[680px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase border-b w-64">Account</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase border-b">Line Description</th>
                                <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase border-b w-36">Debit (Dr)</th>
                                <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase border-b w-36">Credit (Cr)</th>
                                <th className="px-3 py-2.5 border-b w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lines.map((line, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                    {/* Account selector */}
                                    <td className="px-2 py-1.5 border-b border-gray-100">
                                        <select
                                            value={line.coaId}
                                            onChange={(e) => handleAccountSelect(i, e.target.value)}
                                            className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${errors[`line-${i}-coaId`] ? "border-red-500" : "border-gray-300"}`}
                                        >
                                            <option value="">— Select Account —</option>
                                            {coaList.map((c) => (
                                                <option key={c.CoaId} value={c.CoaId}>
                                                    {c.AccountCode} — {c.AccountName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors[`line-${i}-coaId`] && (
                                            <p className="text-red-500 text-xs mt-0.5">{errors[`line-${i}-coaId`]}</p>
                                        )}
                                    </td>
                                    {/* Line description */}
                                    <td className="px-2 py-1.5 border-b border-gray-100">
                                        <input
                                            type="text"
                                            placeholder="Optional"
                                            value={line.lineDescription || ""}
                                            onChange={(e) => updateLine(i, "lineDescription", e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                    </td>
                                    {/* Debit */}
                                    <td className="px-2 py-1.5 border-b border-gray-100">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={line.debit}
                                            onChange={(e) => {
                                                updateLine(i, "debit",  e.target.value);
                                                updateLine(i, "credit", ""); // clear credit when debit entered
                                            }}
                                            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                    </td>
                                    {/* Credit */}
                                    <td className="px-2 py-1.5 border-b border-gray-100">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={line.credit}
                                            onChange={(e) => {
                                                updateLine(i, "credit", e.target.value);
                                                updateLine(i, "debit",  ""); // clear debit when credit entered
                                            }}
                                            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                    </td>
                                    {/* Remove */}
                                    <td className="px-2 py-1.5 border-b border-gray-100 text-center">
                                        {lines.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLine(i)}
                                                className="text-red-400 hover:text-red-600 transition"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* Totals footer */}
                        <tfoot className="border-t-2 border-gray-300 bg-gray-100">
                            <tr>
                                <td colSpan={2} className="px-3 py-2.5 text-right text-sm font-bold text-gray-700">Total</td>
                                <td className="px-2 py-2.5 text-right font-bold text-gray-900">₱{fmt(totDebit)}</td>
                                <td className="px-2 py-2.5 text-right font-bold text-gray-900">₱{fmt(totCredit)}</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colSpan={5} className={`px-3 py-1.5 text-center text-xs font-semibold ${balanced ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                                    {balanced
                                        ? "✓ Balanced — Debits equal Credits"
                                        : totDebit === 0 && totCredit === 0
                                            ? "Enter debit and credit amounts above"
                                            : `⚠ Out of balance by ₱${fmt(Math.abs(totDebit - totCredit))}`
                                    }
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
const JournalEntryDataTable = () => {
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

    // modals
    const [isNewModal,     setIsNewModal]     = useState(false);
    const [isViewModal,    setIsViewModal]    = useState(false);
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [isSuccessModal, setIsSuccessModal] = useState(false);
    const [isErrorModal,   setIsErrorModal]   = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);

    // new journal form
    const defaultForm = { journalDate: "", referenceNo: "", description: "" };
    const [form,   setForm]   = useState(defaultForm);
    const [lines,  setLines]  = useState([emptyLine(), emptyLine()]);
    const [errors, setErrors] = useState({});

    // view
    const journalDetailState = useSelector((s) => s.accounting.journalDetailState);
    const detail   = journalDetailState.data;
    const detailLoading = journalDetailState.loading;

    // COA flat list for line dropdowns
    const coaFlatState = useSelector((s) => s.accounting.coaFlatState);
    const coaList = Array.isArray(coaFlatState.data) ? coaFlatState.data : [];

    // ── columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: "Journal No.",
            selector: (r) => r.JournalNo || "—",
            sortable: true,
            width: "140px",
        },
        {
            name: "Date",
            selector: (r) => r.JournalDate ? new Date(r.JournalDate).toLocaleDateString() : "—",
            sortable: true,
            width: "120px",
        },
        {
            name: "Reference No.",
            selector: (r) => r.ReferenceNo || "—",
            sortable: true,
            width: "150px",
        },
        {
            name: "Description",
            selector: (r) => r.Description || "—",
            sortable: true,
            wrap: true,
        },
        {
            name: "Total Debit",
            selector: (r) => `₱${fmt(r.TotalDebit)}`,
            sortable: true,
            right: true,
            width: "140px",
        },
        {
            name: "Total Credit",
            selector: (r) => `₱${fmt(r.TotalCredit)}`,
            sortable: true,
            right: true,
            width: "140px",
        },
        {
            name: "Status",
            cell: (r) => (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[r.Status] || STATUS_BADGE.Draft}`}>
                    {r.Status || "Draft"}
                </span>
            ),
            sortable: true,
            width: "100px",
        },
        {
            name: "Created By",
            selector: (r) => r.CreatedByName || "—",
            sortable: true,
            width: "150px",
        },
        {
            name: "Actions",
            cell: (r) => (
                <button
                    className="p-1 text-blue-600 hover:text-blue-800"
                    onClick={() => handleView(r)}
                    title="View"
                >
                    <Eye size={18} />
                </button>
            ),
            ignoreRowClick: true,
            width: "80px",
        },
    ];

    // ── fetch table ───────────────────────────────────────────────────────────
    const fetchTable = async () => {
        setLoading(true);
        const res = await dispatch(fetchGetJournalData(page, pageSize, search, dateFrom, dateTo));
        if (res.ok) {
            setTable(res.data || []);
            setTotalRecords(res.totalRecords || 0);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTable();
    }, [page, pageSize, search, dateFrom, dateTo]);

    // ── open new modal ────────────────────────────────────────────────────────
    const handleOpenNew = () => {
        setForm(defaultForm);
        setLines([emptyLine(), emptyLine()]);
        setErrors({});
        dispatch(fetchGetCoaFlatData());
        setIsNewModal(true);
    };

    // ── view ──────────────────────────────────────────────────────────────────
    const handleView = (row) => {
        dispatch(fetchGetJournalDetailData(row.JournalId));
        setIsViewModal(true);
    };

    // ── validate ──────────────────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!form.journalDate)  e.journalDate  = "Date is required.";
        if (!form.description?.trim()) e.description = "Description is required.";

        const validLines = lines.filter((l) => l.coaId);
        if (validLines.length < 2) e.lines = "At least 2 account lines are required.";

        lines.forEach((l, i) => {
            if (!l.coaId) e[`line-${i}-coaId`] = "Select an account.";
        });

        const totDr = lines.reduce((s, l) => s + Number(l.debit  || 0), 0);
        const totCr = lines.reduce((s, l) => s + Number(l.credit || 0), 0);
        if (totDr === 0 && totCr === 0) e.lines = "Enter at least one debit and one credit amount.";
        if (totDr !== totCr)            e.lines = `Journal is not balanced. Difference: ₱${fmt(Math.abs(totDr - totCr))}`;

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmitNew = () => {
        if (!validate()) return;
        setIsNewModal(false);
        setIsConfirmModal(true);
    };

    // ── confirm post ──────────────────────────────────────────────────────────
    const handleConfirm = async () => {
        setIsConfirmModal(false);
        setIsLoadingModal(true);

        const payload = {
            JournalDate:     form.journalDate,
            ReferenceNo:     form.referenceNo,
            Description:     form.description,
            CreatedByUserId: user?.UserId,
            JournalLineDtos: lines
                .filter((l) => l.coaId)
                .map((l) => ({
                    CoaId:           l.coaId,
                    LineDescription: l.lineDescription || "",
                    Debit:           String(l.debit  || "0"),
                    Credit:          String(l.credit || "0"),
                })),
        };

        const res = await dispatch(fetchInsertJournalData(payload));
        setIsLoadingModal(false);
        if (res.ok) {
            setIsSuccessModal(true);
            fetchTable();
        } else {
            setIsErrorModal(true);
        }
    };

    // ── totals for confirm preview ────────────────────────────────────────────
    const confirmTotDr = lines.reduce((s, l) => s + Number(l.debit  || 0), 0);
    const confirmTotCr = lines.reduce((s, l) => s + Number(l.credit || 0), 0);

    return (
        <div className="bg-white shadow rounded-lg p-4">

            {/* top bar */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <span className="font-bold text-lg text-green-700">Journal Entries</span>

                <div className="flex flex-wrap items-center gap-2">
                    {/* date filters */}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>From</span>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                            className="border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring focus:ring-green-300"
                        />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>To</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                            className="border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring focus:ring-green-300"
                        />
                    </div>
                    <button
                        onClick={handleOpenNew}
                        className="flex items-center gap-1 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition"
                    >
                        <Plus size={15} /> New Journal Entry
                    </button>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-3 py-2 border rounded-lg text-sm w-52 focus:outline-none focus:ring focus:ring-green-300"
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

            {/* ── New Journal Modal ─────────────────────────────────────────── */}
            <ModalComponent
                isOpen={isNewModal}
                onClose={() => setIsNewModal(false)}
                title="New Journal Entry"
                size="w-[95vw] max-w-4xl"
                maxHeight="90vh"
                body={
                    <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-1 py-2">
                        <NewJournalBody
                            form={form}
                            setForm={setForm}
                            lines={lines}
                            setLines={setLines}
                            coaList={coaList}
                            errors={errors}
                        />
                    </div>
                }
                buttons={[
                    { label: "Post Entry", type: "green", closeOnClick: false, onClick: handleSubmitNew },
                    { label: "Cancel",     type: "red",   onClick: () => setIsNewModal(false) },
                ]}
            />

            {/* ── View Modal ────────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={isViewModal}
                onClose={() => setIsViewModal(false)}
                title="Journal Entry Detail"
                size="w-[95vw] max-w-3xl"
                maxHeight="90vh"
                body={
                    <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-1 py-2">
                        <ViewJournalBody detail={detail} loading={detailLoading} />
                    </div>
                }
                buttons={[
                    { label: "Close", type: "red", onClick: () => setIsViewModal(false) },
                ]}
            />

            {/* ── Confirm Modal ─────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={isConfirmModal}
                onClose={() => setIsConfirmModal(false)}
                title={<span className="font-bold text-lg text-red-700">Post Journal Entry</span>}
                body={
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>You are about to post this journal entry.</p>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1 border border-gray-200">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Date</span>
                                <span className="font-semibold">{form.journalDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Description</span>
                                <span className="font-semibold">{form.description}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Debit</span>
                                <span className="font-semibold text-green-700">₱{fmt(confirmTotDr)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Credit</span>
                                <span className="font-semibold text-green-700">₱{fmt(confirmTotCr)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Lines</span>
                                <span className="font-semibold">{lines.filter((l) => l.coaId).length} accounts</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">This action cannot be undone once posted.</p>
                    </div>
                }
                buttons={[
                    { label: "Yes, Post", type: "green", closeOnClick: false, onClick: handleConfirm },
                    { label: "Cancel",    type: "red",   onClick: () => setIsConfirmModal(false) },
                ]}
            />

            {/* ── Loading Modal ─────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={isLoadingModal}
                onClose={() => {}}
                title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                body={
                    <div className="flex flex-col items-center justify-center gap-3 py-2">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-gray-600">Posting journal entry. Please wait.</span>
                    </div>
                }
                buttons={[]}
            />

            {/* ── Success Modal ─────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={isSuccessModal}
                onClose={() => setIsSuccessModal(false)}
                title={<span className="font-bold text-lg text-green-700">Posted Successfully</span>}
                body="Journal entry has been posted successfully."
                buttons={[{ label: "OK", type: "green", onClick: () => setIsSuccessModal(false) }]}
            />

            {/* ── Error Modal ───────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={isErrorModal}
                onClose={() => setIsErrorModal(false)}
                title={<span className="font-bold text-lg text-red-700">Error</span>}
                body="Something went wrong while posting the journal entry. Please try again."
                buttons={[{ label: "Close", type: "red", onClick: () => setIsErrorModal(false) }]}
            />
        </div>
    );
};

export default JournalEntryDataTable;
