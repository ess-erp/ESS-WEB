import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Eye, Bot } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchGetSiSeriesData,
    fetchInsertSiSeriesData,
    fetchGetRobotCashierData,
    fetchInsertRobotCashierData,
    fetchGetCashierListData,
} from "../../states/AccountingState/Action";

// ─── helpers ─────────────────────────────────────────────────────────────────
const INPUT  = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400";
const RINPUT = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed";

const STATUS_BADGE = {
    Y:  "bg-green-100 text-green-700 border border-green-300",
    DR: "bg-gray-100 text-gray-500 border border-gray-300",
};

// ─── Main component ───────────────────────────────────────────────────────────
const SiSeriesDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });

    // ── table ─────────────────────────────────────────────────────────────────
    const [table,        setTable]        = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading,      setLoading]      = useState(false);
    const [page,         setPage]         = useState(1);
    const [pageSize,     setPageSize]     = useState(10);
    const [search,       setSearch]       = useState("");

    // ── SI Series modals ──────────────────────────────────────────────────────
    const [isNewModal,     setIsNewModal]     = useState(false);
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [isSuccessModal, setIsSuccessModal] = useState(false);
    const [isErrorModal,   setIsErrorModal]   = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);

    // ── SI Series form ────────────────────────────────────────────────────────
    const defaultForm = { startNo: "", endNo: "", cashierId: "", remarks: "" };
    const [form,   setForm]   = useState(defaultForm);
    const [errors, setErrors] = useState({});

    // ── Robot Cashier modals ──────────────────────────────────────────────────
    const [isRobotModal,        setIsRobotModal]        = useState(false);
    const [isRobotConfirmModal, setIsRobotConfirmModal] = useState(false);
    const [isRobotSuccessModal, setIsRobotSuccessModal] = useState(false);
    const [isRobotErrorModal,   setIsRobotErrorModal]   = useState(false);
    const [isRobotLoadingModal, setIsRobotLoadingModal] = useState(false);

    // ── Robot Cashier form ────────────────────────────────────────────────────
    const defaultRobotForm = { cashierId: "", startNo: "", endNo: "", remarks: "" };
    const [robotForm,   setRobotForm]   = useState(defaultRobotForm);
    const [robotErrors, setRobotErrors] = useState({});

    // ── Robot current assignment ──────────────────────────────────────────────
    const robotCashierState = useSelector((s) => s.accounting.robotCashierState);
    const robotData = robotCashierState.data;
    const robotLoading = robotCashierState.loading;

    // ── Cashier list ──────────────────────────────────────────────────────────
    const cashierList = useSelector((s) => s.accounting.cashierListState.data || []);

    const cashierName = (id) => {
        const c = Array.isArray(cashierList)
            ? cashierList.find((x) => String(x.UserId) === String(id))
            : null;
        return c ? `${c.Fname || ""} ${c.Mname || ""} ${c.Lname || ""}`.replace(/\s+/g, " ").trim() : "—";
    };

    // ── columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: "Cashier",
            selector: (r) => r.CashierName || "—",
            sortable: true,
        },
        {
            name: "Start No.",
            selector: (r) => r.StartNo || "—",
            sortable: true,
            width: "120px",
        },
        {
            name: "End No.",
            selector: (r) => r.EndNo || "—",
            sortable: true,
            width: "120px",
        },
        {
            name: "Latest Used",
            selector: (r) => r.LatestOrAvailable || "—",
            sortable: true,
            width: "130px",
        },
        {
            name: "Remarks",
            selector: (r) => r.Remarks || "—",
            sortable: true,
            wrap: true,
        },
        {
            name: "Status",
            cell: (r) => (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[r.ActiveStatus] || STATUS_BADGE.DR}`}>
                    {r.ActiveStatus === "Y" ? "Active" : "Draft"}
                </span>
            ),
            width: "90px",
        },
        {
            name: "Date Created",
            selector: (r) => r.DateCreated ? new Date(r.DateCreated).toLocaleDateString() : "—",
            sortable: true,
            width: "130px",
        },
        {
            name: "Actions",
            cell: (r) => (
                <button className="p-1 text-blue-600 hover:text-blue-800" title="View" onClick={() => console.log("view", r)}>
                    <Eye size={17} />
                </button>
            ),
            ignoreRowClick: true,
            width: "70px",
        },
    ];

    // ── fetch ─────────────────────────────────────────────────────────────────
    const fetchTable = async () => {
        setLoading(true);
        const res = await dispatch(fetchGetSiSeriesData(page, pageSize, search));
        if (res.ok) {
            setTable(res.data || []);
            setTotalRecords(res.totalRecords || 0);
        }
        setLoading(false);
    };

    useEffect(() => { fetchTable(); }, [page, pageSize, search]);

    const handleOpenNew = () => {
        setForm(defaultForm);
        setErrors({});
        dispatch(fetchGetCashierListData());
        setIsNewModal(true);
    };

    const handleOpenRobot = () => {
        setRobotForm(defaultRobotForm);
        setRobotErrors({});
        dispatch(fetchGetCashierListData());
        dispatch(fetchGetRobotCashierData());
        setIsRobotModal(true);
    };

    // ── validate SI Series ────────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!form.startNo?.trim())  e.startNo  = "Start No. is required.";
        if (!form.endNo?.trim())    e.endNo    = "End No. is required.";
        if (!form.cashierId)        e.cashierId = "Please select a cashier.";
        if (form.startNo && form.endNo && Number(form.endNo) <= Number(form.startNo))
            e.endNo = "End No. must be greater than Start No.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmitNew = () => {
        if (!validate()) return;
        setIsNewModal(false);
        setIsConfirmModal(true);
    };

    const handleConfirm = async () => {
        setIsConfirmModal(false);
        setIsLoadingModal(true);
        const payload = {
            StartNo:         form.startNo,
            EndNo:           form.endNo,
            UserId:          form.cashierId,
            Remarks:         form.remarks,
            CreatedByUserId: user?.UserId,
        };
        const res = await dispatch(fetchInsertSiSeriesData(payload));
        setIsLoadingModal(false);
        if (res.ok) { setIsSuccessModal(true); fetchTable(); }
        else { setIsErrorModal(true); }
    };

    // ── validate Robot Cashier ────────────────────────────────────────────────
    const validateRobot = () => {
        const e = {};
        if (!robotForm.cashierId)         e.cashierId = "Please select a cashier account.";
        if (!robotForm.startNo?.trim())   e.startNo   = "Start No. is required.";
        if (!robotForm.endNo?.trim())     e.endNo     = "End No. is required.";
        if (robotForm.startNo && robotForm.endNo && Number(robotForm.endNo) <= Number(robotForm.startNo))
            e.endNo = "End No. must be greater than Start No.";
        setRobotErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmitRobot = () => {
        if (!validateRobot()) return;
        setIsRobotModal(false);
        setIsRobotConfirmModal(true);
    };

    const handleConfirmRobot = async () => {
        setIsRobotConfirmModal(false);
        setIsRobotLoadingModal(true);
        const payload = {
            UserId:          robotForm.cashierId,
            StartNo:         robotForm.startNo,
            EndNo:           robotForm.endNo,
            Remarks:         robotForm.remarks,
            CreatedByUserId: user?.UserId,
        };
        const res = await dispatch(fetchInsertRobotCashierData(payload));
        setIsRobotLoadingModal(false);
        if (res.ok) { setIsRobotSuccessModal(true); dispatch(fetchGetRobotCashierData()); }
        else { setIsRobotErrorModal(true); }
    };

    const sel = (err) =>
        `w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${err ? "border-red-500" : "border-gray-300"}`;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* ── Robot Cashier status card ─────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <Bot className="text-blue-600" size={22} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Robot Cashier — Online Payment</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                The robot cashier account processes all online payments from the parent portal.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleOpenRobot}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
                    >
                        <Bot size={15} /> Assign Robot Cashier
                    </button>
                </div>

                {/* Current assignment */}
                <div className="mt-4 border-t border-gray-100 pt-4">
                    {robotLoading ? (
                        <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
                    ) : robotData && (Array.isArray(robotData) ? robotData.length > 0 : robotData.UserId) ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Assigned Account</p>
                                <p className="font-semibold text-gray-800">
                                    {Array.isArray(robotData) ? robotData[0]?.CashierName : robotData?.CashierName || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Start No.</p>
                                <p className="font-semibold text-gray-800">
                                    {Array.isArray(robotData) ? robotData[0]?.StartNo : robotData?.StartNo || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">End No.</p>
                                <p className="font-semibold text-gray-800">
                                    {Array.isArray(robotData) ? robotData[0]?.EndNo : robotData?.EndNo || "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Latest Used</p>
                                <p className="font-semibold text-gray-800">
                                    {Array.isArray(robotData) ? robotData[0]?.LatestOrAvailable : robotData?.LatestOrAvailable || "—"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No robot cashier assigned yet.</p>
                    )}
                </div>
            </div>

            {/* ── SI Series table ───────────────────────────────────────────── */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg text-green-700">SI / OR Series</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleOpenNew}
                            className="flex items-center gap-1 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition"
                        >
                            + Assign New Series
                        </button>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border rounded-lg text-sm w-56 focus:outline-none focus:ring focus:ring-green-300"
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
            </div>

            {/* ── New SI Series Modal ───────────────────────────────────────── */}
            <ModalComponent
                isOpen={isNewModal}
                onClose={() => setIsNewModal(false)}
                title="Assign New SI Series"
                size="w-[480px]"
                maxHeight="100vh"
                body={
                    <div className="space-y-4 py-1">
                        {/* Cashier */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cashier Account <span className="text-red-500">*</span>
                            </label>
                            <select value={form.cashierId} onChange={(e) => setForm((f) => ({ ...f, cashierId: e.target.value }))} className={sel(errors.cashierId)}>
                                <option value="">— Select Cashier —</option>
                                {Array.isArray(cashierList) && cashierList.map((c) => (
                                    <option key={c.UserId} value={c.UserId}>
                                        {`${c.Fname || ""} ${c.Mname || ""} ${c.Lname || ""}`.replace(/\s+/g, " ").trim()}
                                    </option>
                                ))}
                            </select>
                            {errors.cashierId && <p className="text-red-500 text-xs mt-1">{errors.cashierId}</p>}
                        </div>

                        {/* Start / End No */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start No. <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number" min="1" placeholder="e.g. 1001"
                                    value={form.startNo}
                                    onChange={(e) => setForm((f) => ({ ...f, startNo: e.target.value }))}
                                    className={`${INPUT} ${errors.startNo ? "border-red-500" : ""}`}
                                />
                                {errors.startNo && <p className="text-red-500 text-xs mt-1">{errors.startNo}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End No. <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number" min="1" placeholder="e.g. 2000"
                                    value={form.endNo}
                                    onChange={(e) => setForm((f) => ({ ...f, endNo: e.target.value }))}
                                    className={`${INPUT} ${errors.endNo ? "border-red-500" : ""}`}
                                />
                                {errors.endNo && <p className="text-red-500 text-xs mt-1">{errors.endNo}</p>}
                            </div>
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                            <input
                                type="text" placeholder="Optional"
                                value={form.remarks}
                                onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                                className={INPUT}
                            />
                        </div>

                        {/* Preview */}
                        {form.startNo && form.endNo && Number(form.endNo) > Number(form.startNo) && (
                            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-xs text-green-700">
                                Series range: <strong>{form.startNo}</strong> – <strong>{form.endNo}</strong>
                                &nbsp;({(Number(form.endNo) - Number(form.startNo) + 1).toLocaleString()} numbers)
                            </div>
                        )}
                    </div>
                }
                buttons={[
                    { label: "Assign", type: "green", closeOnClick: false, onClick: handleSubmitNew },
                    { label: "Cancel", type: "red",   onClick: () => setIsNewModal(false) },
                ]}
            />

            {/* ── Confirm SI Series ─────────────────────────────────────────── */}
            <ModalComponent
                isOpen={isConfirmModal}
                onClose={() => setIsConfirmModal(false)}
                title={<span className="font-bold text-lg text-red-700">Confirm Assignment</span>}
                body={
                    <div className="space-y-1 text-sm text-gray-700">
                        <p>Assign SI series <strong>{form.startNo} – {form.endNo}</strong> to <strong>{cashierName(form.cashierId)}</strong>?</p>
                        <p className="text-xs text-gray-400">This action cannot be undone.</p>
                    </div>
                }
                buttons={[
                    { label: "Yes, Assign", type: "green", closeOnClick: false, onClick: handleConfirm },
                    { label: "Cancel",      type: "red",   onClick: () => setIsConfirmModal(false) },
                ]}
            />

            {/* ── Robot Cashier Modal ───────────────────────────────────────── */}
            <ModalComponent
                isOpen={isRobotModal}
                onClose={() => setIsRobotModal(false)}
                title={
                    <span className="flex items-center justify-center gap-2">
                        <Bot size={18} className="text-blue-600" /> Assign Robot Cashier
                    </span>
                }
                size="w-[480px]"
                maxHeight="100vh"
                body={
                    <div className="space-y-4 py-1">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700">
                            The robot cashier is a system account that automatically processes all online payments
                            submitted by parents. Assign a dedicated SI series range for it.
                        </div>

                        {/* Cashier account */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cashier Account <span className="text-red-500">*</span>
                            </label>
                            <select value={robotForm.cashierId} onChange={(e) => setRobotForm((f) => ({ ...f, cashierId: e.target.value }))} className={sel(robotErrors.cashierId)}>
                                <option value="">— Select Account —</option>
                                {Array.isArray(cashierList) && cashierList.map((c) => (
                                    <option key={c.UserId} value={c.UserId}>
                                        {`${c.Fname || ""} ${c.Mname || ""} ${c.Lname || ""}`.replace(/\s+/g, " ").trim()}
                                    </option>
                                ))}
                            </select>
                            {robotErrors.cashierId && <p className="text-red-500 text-xs mt-1">{robotErrors.cashierId}</p>}
                        </div>

                        {/* Start / End No */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start No. <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number" min="1" placeholder="e.g. 5001"
                                    value={robotForm.startNo}
                                    onChange={(e) => setRobotForm((f) => ({ ...f, startNo: e.target.value }))}
                                    className={`${INPUT} ${robotErrors.startNo ? "border-red-500" : ""}`}
                                />
                                {robotErrors.startNo && <p className="text-red-500 text-xs mt-1">{robotErrors.startNo}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End No. <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number" min="1" placeholder="e.g. 9999"
                                    value={robotForm.endNo}
                                    onChange={(e) => setRobotForm((f) => ({ ...f, endNo: e.target.value }))}
                                    className={`${INPUT} ${robotErrors.endNo ? "border-red-500" : ""}`}
                                />
                                {robotErrors.endNo && <p className="text-red-500 text-xs mt-1">{robotErrors.endNo}</p>}
                            </div>
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                            <input
                                type="text" placeholder="Optional"
                                value={robotForm.remarks}
                                onChange={(e) => setRobotForm((f) => ({ ...f, remarks: e.target.value }))}
                                className={INPUT}
                            />
                        </div>

                        {robotForm.startNo && robotForm.endNo && Number(robotForm.endNo) > Number(robotForm.startNo) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700">
                                Series range: <strong>{robotForm.startNo}</strong> – <strong>{robotForm.endNo}</strong>
                                &nbsp;({(Number(robotForm.endNo) - Number(robotForm.startNo) + 1).toLocaleString()} numbers)
                            </div>
                        )}
                    </div>
                }
                buttons={[
                    { label: "Assign", type: "blue",  closeOnClick: false, onClick: handleSubmitRobot },
                    { label: "Cancel", type: "red",   onClick: () => setIsRobotModal(false) },
                ]}
            />

            {/* ── Confirm Robot Cashier ─────────────────────────────────────── */}
            <ModalComponent
                isOpen={isRobotConfirmModal}
                onClose={() => setIsRobotConfirmModal(false)}
                title={<span className="font-bold text-lg text-red-700">Confirm Robot Cashier</span>}
                body={
                    <div className="space-y-1 text-sm text-gray-700">
                        <p>Assign <strong>{cashierName(robotForm.cashierId)}</strong> as the robot cashier for online payments?</p>
                        <p>SI series: <strong>{robotForm.startNo} – {robotForm.endNo}</strong></p>
                        <p className="text-xs text-gray-400 mt-1">All online payments will use this account and series.</p>
                    </div>
                }
                buttons={[
                    { label: "Yes, Assign", type: "green", closeOnClick: false, onClick: handleConfirmRobot },
                    { label: "Cancel",      type: "red",   onClick: () => setIsRobotConfirmModal(false) },
                ]}
            />

            {/* ── Shared Loading / Success / Error modals ───────────────────── */}
            {[
                { isOpen: isLoadingModal,      title: "Processing",           body: "Saving SI series. Please wait.",              isLoading: true  },
                { isOpen: isRobotLoadingModal, title: "Processing",           body: "Saving robot cashier. Please wait.",          isLoading: true  },
                { isOpen: isSuccessModal,      title: "Assigned",             body: "SI series assigned successfully.",            close: () => setIsSuccessModal(false)      },
                { isOpen: isRobotSuccessModal, title: "Robot Cashier Assigned",body: "Robot cashier assigned successfully.",      close: () => setIsRobotSuccessModal(false) },
                { isOpen: isErrorModal,        title: "Error",                body: "Something went wrong. Please try again.",    close: () => setIsErrorModal(false)        },
                { isOpen: isRobotErrorModal,   title: "Error",                body: "Something went wrong. Please try again.",    close: () => setIsRobotErrorModal(false)   },
            ].map((m, i) => (
                <ModalComponent
                    key={i}
                    isOpen={m.isOpen}
                    onClose={m.close || (() => {})}
                    title={
                        <span className={`font-bold text-lg ${m.isLoading ? "text-blue-700" : m.title.toLowerCase().includes("error") ? "text-red-700" : "text-green-700"}`}>
                            {m.title}
                        </span>
                    }
                    body={
                        m.isLoading ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-2">
                                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                <span className="text-gray-600">{m.body}</span>
                            </div>
                        ) : m.body
                    }
                    buttons={m.isLoading ? [] : [
                        {
                            label: m.title.toLowerCase().includes("error") ? "Close" : "OK",
                            type: m.title.toLowerCase().includes("error") ? "red" : "green",
                            onClick: m.close,
                        }
                    ]}
                />
            ))}
        </div>
    );
};

export default SiSeriesDataTable;
