import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Printer, Trash2, Receipt, Plus, ChevronDown, ChevronUp } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchTransactionTypeData,
    fetchStudentAppData,
    fetchOrNumberData,
    fetchGetRealtimeDailyBalanceData,
    fetchGetDailyBalanceData,
    fetchPrintReceiptData,
    fetchInsertSubmitPaymentData,
    fetchStudentAppAssessmentData,
    fetchGetCashierMiscBreakdownData,
    fetchCashierPendingTransactionData,
} from "../../states/CashierState/Action";
import SearchBoxAppNo from "../ButtonsComponents/SearchBoxAppNo";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const READONLY =
    "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed select-none focus:outline-none";

const INPUT =
    "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition bg-white text-gray-800";

// ─── Transaction card with collapsible misc ───────────────────────────────────
const TransactionCard = ({ t, onRemove }) => {
    const [showMisc, setShowMisc] = useState(false);
    const hasMisc = Array.isArray(t.miscBreakdown) && t.miscBreakdown.length > 0;
    const miscTotal = hasMisc ? t.miscBreakdown.reduce((s, r) => s + Number(r.Amount || 0), 0) : 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                        {t.transType === "Assessment Plan" ? `${t.transType} — ${t.planName}` : t.transType}
                    </p>
                    <p className="text-xs text-gray-400">{t.referenceNumber} · {t.fullName}</p>
                    <p className="text-xs text-gray-400">{t.paymentMode?.label}{t.checkNumber ? ` · ${t.checkNumber}` : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">₱{fmt(t.price)}</span>
                    <button onClick={() => onRemove(t.id)} className="text-red-400 hover:text-red-600 transition">
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* Misc breakdown toggle */}
            {hasMisc && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                    <button
                        onClick={() => setShowMisc(!showMisc)}
                        className="w-full flex items-center justify-between text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                    >
                        <span>Miscellaneous Fees</span>
                        <div className="flex items-center gap-2">
                            <span>₱{fmt(miscTotal)}</span>
                            {showMisc ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </div>
                    </button>
                    {showMisc && (
                        <div className="mt-2 space-y-1 pl-2 border-l-2 border-blue-200">
                            {t.miscBreakdown.map((item, i) => (
                                <div key={i} className="flex justify-between text-[11px] text-gray-500">
                                    <span className="truncate max-w-[70%]">{item.FeeName}</span>
                                    <span>₱{fmt(item.Amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Drawer balance card ──────────────────────────────────────────────────────
const DrawerCard = ({ label, amount, color = "gray" }) => {
    const colorMap = {
        gray:  "bg-gray-50  border-gray-200  text-gray-700",
        green: "bg-green-50 border-green-200 text-green-700",
    };
    return (
        <div className={`border rounded-xl px-4 py-3 flex flex-col gap-0.5 ${colorMap[color].split(" ").slice(0, 2).join(" ")}`}>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className={`text-base font-bold ${colorMap[color].split(" ")[2]}`}>₱{fmt(amount)}</p>
        </div>
    );
};

// ─── Receipt panel ────────────────────────────────────────────────────────────
const ReceiptPanel = ({ orNumber, transactions, dailyBalance, realtimeBalance, amountToPay, change, paymentMode, checkNumber, miscBreakdown }) => {
    const total = transactions.reduce((s, t) => s + Number(t.price || 0), 0);
    const [showMisc, setShowMisc] = useState(false);
    const miscTotal = Array.isArray(miscBreakdown) ? miscBreakdown.reduce((s, r) => s + Number(r.Amount || 0), 0) : 0;

    return (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-5 font-mono text-sm sticky top-0 space-y-4">
            {/* Header */}
            <div className="text-center">
                <Receipt className="mx-auto mb-1 text-green-600" size={28} />
                <p className="font-bold text-base text-gray-800 uppercase tracking-widest">Cashier Payment</p>
                <p className="text-xs text-gray-400">Receipt Preview</p>
            </div>

            {/* Drawer balances - moved to top */}
            <div className="border-t border-b border-dashed border-gray-200 py-3 space-y-2">
                {/* Starting Drawer Balance - Blue Box */}
                <div className="border-2 border-blue-400 rounded-lg px-3 py-2 bg-blue-50">
                    <p className="text-[10px] text-blue-600 font-medium mb-0.5">Starting Drawer Balance</p>
                    <p className="text-lg font-bold text-blue-700">₱{fmt(dailyBalance?.Amount)}</p>
                </div>
                
                {/* Current Drawer Balance - Green Box */}
                <div className="border-2 border-green-400 rounded-lg px-3 py-2 bg-green-50">
                    <p className="text-[10px] text-green-600 font-medium mb-0.5">Current Drawer Balance</p>
                    <p className="text-lg font-bold text-green-700">₱{fmt(realtimeBalance?.Amount)}</p>
                </div>
            </div>

            {/* OR number + date */}
            <div className="border-b border-dashed border-gray-200 pb-3 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                    <span className="text-gray-400">OR No.</span>
                    <span className="font-semibold">{orNumber || "—"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span className="font-semibold">{new Date().toLocaleDateString("en-PH")}</span>
                </div>
            </div>

            {/* Transaction lines */}
            {transactions.length === 0 ? (
                <p className="text-center text-xs text-gray-300 py-4 italic">No transactions added yet</p>
            ) : (
                <div className="space-y-2">
                    {transactions.map((t) => (
                        <div key={t.id} className="flex justify-between items-start text-xs">
                            <div className="max-w-[65%]">
                                <p className="font-semibold text-gray-700">
                                    {t.transType === "Assessment Plan" ? `${t.transType} — ${t.planName}` : t.transType}
                                </p>
                                <p className="text-gray-400 truncate">{t.referenceNumber} · {t.fullName}</p>
                            </div>
                            <span className="font-semibold text-gray-800">₱{fmt(t.price)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Miscellaneous breakdown (collapsible) */}
            {miscTotal > 0 && (
                <div className="border-t border-dashed border-gray-200 pt-3">
                    <button
                        onClick={() => setShowMisc(!showMisc)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                    >
                        <span>Miscellaneous Fees</span>
                        <div className="flex items-center gap-2">
                            <span>₱{fmt(miscTotal)}</span>
                            {showMisc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                    </button>
                    {showMisc && (
                        <div className="mt-2 space-y-1 pl-2 border-l-2 border-blue-200">
                            {miscBreakdown.map((item, i) => (
                                <div key={i} className="flex justify-between text-[10px] text-gray-500">
                                    <span className="truncate max-w-[60%]">{item.FeeName}</span>
                                    <span>₱{fmt(item.Amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Totals */}
            <div className="border-t border-dashed border-gray-200 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                    <span>Amount Tendered</span>
                    <span className="font-medium text-gray-800">₱{fmt(amountToPay)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>Change</span>
                    <span className={`font-medium ${Number(change) > 0 ? "text-green-600" : "text-gray-800"}`}>₱{fmt(change)}</span>
                </div>
                {paymentMode && (
                    <div className="flex justify-between text-gray-500">
                        <span>Mode</span>
                        <span className="font-medium text-gray-800">{paymentMode.label}</span>
                    </div>
                )}
                {paymentMode?.value === "Check" && checkNumber && (
                    <div className="flex justify-between text-gray-500">
                        <span>Check No.</span>
                        <span className="font-medium text-gray-800">{checkNumber}</span>
                    </div>
                )}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-3">
                <div className="flex justify-between text-sm font-bold text-gray-900">
                    <span>TOTAL</span>
                    <span className="text-green-700">₱{fmt(total)}</span>
                </div>
            </div>

            <p className="text-center text-[10px] text-gray-300 italic mt-3">
                This is a preview — not an official receipt.
            </p>
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
const PaymentComponent = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });
    const userId = user.UserId;

    // ── selectors ─────────────────────────────────────────────────────────────
    const transData      = useSelector((s) => s.cashier.transactionTypeState.data || []);
    const studentApp     = useSelector((s) => s.cashier.studentAppState.data || []);
    const assessmentData = useSelector((s) => s.cashier.studentAppAssessmentState.data || []);
    const orNumberData   = useSelector((s) => s.cashier.orNumberState.data || {});
    const dailyBalance   = useSelector((s) => s.cashier.dailyBalanceState.data || {});
    const realtimeBalance= useSelector((s) => s.cashier.realtimeBalanceState.data || {});
    const receiptData    = useSelector((s) => s.cashier.printReceiptState.data || {});
    const receiptLoading = useSelector((s) => s.cashier.printReceiptState.loading);
    const miscBreakdown  = useSelector((s) => s.cashier.cashierMiscBreakdownState?.data || []);
    const miscLoading    = useSelector((s) => s.cashier.cashierMiscBreakdownState?.loading || false);
    const pendingTxData  = useSelector((s) => s.cashier.cashierPendingTransactionState?.data || []);
    const pendingTxLoading = useSelector((s) => s.cashier.cashierPendingTransactionState?.loading || false);

    // ── transaction type dropdown ─────────────────────────────────────────────
    const transList = transData.map((item) => ({
        value: item.FeeChildId,
        label: item.TransType,
        amount: item.Value,
    }));

    // ── form state ────────────────────────────────────────────────────────────
    const [transType,       setIsTransType]   = useState("");
    const [transDropdown,   setTransDropdown] = useState(null);
    const [amountValue,     setAmountValue]   = useState(0);
    const [studentId,       setStudentId]     = useState(0);
    const [fullName,        setFullname]      = useState("");
    const [referenceNumber, setRefNumber]     = useState("");
    const [planAmount,      setPlanAmount]    = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paymentMode,     setPaymentMode]   = useState(null);
    const [tuitionChildId,  setTuitionChildId]= useState(0);
    const [planId,          setPlanId]        = useState(0);
    const [selectedPlan,    setSelectedPlan]  = useState(null);
    const [installmentRows, setInstallmentRows] = useState([]);
    const [amountToPay,     setAmountToPay]   = useState(0);
    const [change,          setChange]        = useState(0);
    const [totalAmount,     setTotalAmount]   = useState(0);
    const [checkNumber,     setCheckNumber]   = useState("");

    // validation
    const [errors,          setErrors]        = useState(false);
    const [errorMessage,    setErrorMessage]  = useState("");
    const [isAmount,        setIsAmount]      = useState(false);
    const [amountError,     setAmountError]   = useState("");
    const [isCheckError,    setIsCheckError]  = useState(false);
    const [checkError,      setCheckError]    = useState("");

    // cart
    const [transactions, setTransactions] = useState([]);

    // modals
    const [isPreviewModal,  setIsPreviewModal]  = useState(false);
    const [isConfirmModal,  setIsConfirmModal]  = useState(false);

    // ── payment options ───────────────────────────────────────────────────────
    const paymentOptions = [
        { value: "Cash",  label: "Cash"  },
        { value: "Check", label: "Check" },
    ];

    // ── computed ──────────────────────────────────────────────────────────────
    const priceToUse       = transType === "Assessment Plan"
        ? (installmentRows[0]?.Amount ? Number(installmentRows[0].Amount) : Number(planAmount || 0))
        : Number(amountValue || 0);
    const transactionsTotal= transactions.reduce((s, t) => s + Number(t.price || 0), 0);
    const grandTotal       = transactionsTotal + (totalAmount || 0);

    // ── init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        dispatch(fetchTransactionTypeData());
        dispatch(fetchGetDailyBalanceData(userId));
        dispatch(fetchGetRealtimeDailyBalanceData(userId));
        dispatch(fetchOrNumberData(userId));
    }, [dispatch, userId]);

    // ── handlers ──────────────────────────────────────────────────────────────
    const resetForm = () => {
        setStudentId(0);
        setFullname("");
        setRefNumber("");
        setPlanAmount(0);
        setAmountValue(0);
        setAmountToPay(0);
        setChange(0);
        setTotalAmount(0);
        setIsAmount(false);
        setAmountError("");
        setErrors(false);
        setErrorMessage("");
        setSelectedStudent(null);
        setCheckNumber("");
        setIsCheckError(false);
        setCheckError("");
        setSelectedPlan(null);
        setInstallmentRows([]);
    };

    const resetFormAndType = () => {
        resetForm();
        setTransDropdown(null);
        setIsTransType("");
        setPaymentMode(null);
        setTuitionChildId(0);
        setPlanId(0);
    };

    const handleSelectTransType = (data) => {
        resetForm();
        setAmountValue(data.amount);
        setIsTransType(data.label);
        setTransDropdown(data);

        const statusMap = {
            "Test Permit":    "O-EXAMINATION-CASHIER",
            "Enlistment Fee": "O-RESERVATION",
            "Assessment Plan":"O-RESERVED",
            "Tuition Fee":    "Y",
        };
        const status = statusMap[data.label];
        if (status) dispatch(fetchStudentAppData(status));
    };

    const handleStudentSelect = (student) => {
        setRefNumber(transType === "Tuition Fee" ? student.StudentNumber : student.AppNumber);
        setStudentId(student.StudentId);
        setFullname(`${student.Fname} ${student?.Mname || ""} ${student.Lname}`.replace(/\s+/g, " ").trim());
        dispatch(fetchStudentAppAssessmentData(student.AppId));
        if (transType === "Assessment Plan") {
            // Fetch full plan list with installment schedule (same as parent portal)
            dispatch(fetchCashierPendingTransactionData(student.AppId));
            // Also fetch misc breakdown for this level
            if (student.LevelId) dispatch(fetchGetCashierMiscBreakdownData(student.LevelId));
            // Reset plan selection when a new student is picked
            setSelectedPlan(null);
            setInstallmentRows([]);
            setPlanAmount(0);
            setTuitionChildId(0);
            setPlanId(0);
        }
    };

    // When cashier picks a plan from the dropdown
    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        const pendingList = Array.isArray(pendingTxData) ? pendingTxData : [];
        const rows = pendingList.filter((t) => t.TuitionChildId === plan.value);
        setInstallmentRows(rows);
        // Pre-fill with first installment amount
        const firstAmount = rows[0]?.Amount || 0;
        setPlanAmount(Number(firstAmount));
        setTuitionChildId(plan.value);
        setPlanId(rows[0]?.PlanId || 0);
        // Reset amount fields when plan changes
        setAmountToPay(0);
        setChange(0);
        setTotalAmount(0);
    };

    const handleAmountChange = (value) => {
        const cash  = Number(value || 0);
        const price = priceToUse;
        setAmountToPay(value);
        setChange(Number((cash - price).toFixed(2)));
        setTotalAmount(price);
    };

    const addTransaction = () => {
        if (!transType)        { setErrors(true); setErrorMessage("Please select a transaction type."); return; }
        if (!referenceNumber)  { setErrors(true); setErrorMessage(transType === "Tuition Fee" ? "Please enter student number." : "Please enter application number."); return; }
        if (!amountToPay || Number(amountToPay) === 0) { setIsAmount(true); setAmountError("Please enter the amount."); return; }
        if (paymentMode?.value === "Check" && !checkNumber) { setIsCheckError(true); setCheckError("Please enter the check number."); return; }

        setTransactions((prev) => [...prev, {
            id:            `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            transType, studentId, fullName, referenceNumber,
            price:         priceToUse,
            amountToPay:   Number(amountToPay),
            change, paymentMode, checkNumber,
            tuitionChildId, planId,
            orChildId:     orNumberData.OrChildId,
            orNumberUsed:  orNumberData.LatestOrAvailable,
            planName:      selectedPlan?.label ?? assessmentData[0]?.PlanName ?? "",
            miscBreakdown: transType === "Assessment Plan" ? (Array.isArray(miscBreakdown) ? miscBreakdown : []) : [],
        }]);
        resetFormAndType();
    };

    const removeTransaction = (id) =>
        setTransactions((prev) => prev.filter((t) => t.id !== id));

    const handlePrint = async () => {
        if (transactions.length === 0) {
            if (!referenceNumber) { setErrors(true); setErrorMessage(transType === "Tuition Fee" ? "Please enter student number." : "Please enter application number."); return; }
            if (!amountToPay || amountToPay === 0) { setIsAmount(true); setAmountError("Please enter the amount."); return; }
            if (paymentMode?.value === "Check" && !checkNumber) { setIsCheckError(true); setCheckError("Please enter the check number."); return; }
        }

        const all = transactions.length > 0 ? transactions : [{
            transType, price: priceToUse,
            orChildId: orNumberData.OrChildId,
            orNumberUsed: orNumberData.LatestOrAvailable,
        }];

        await dispatch(fetchPrintReceiptData({
            UserId:            studentId,
            ReferenceId:       "",
            TransType:         orNumberData.OrType,
            OrId:              orNumberData.OrId,
            CreatedByUserId:   userId,
            TuitionChildId:    0,
            TypeOfTransaction: all.map((t) => t.transType).join(", "),
            OrChildDtos:       all.map((t) => ({
                OrChildId:    t.orChildId,
                OrNumberUsed: t.orNumberUsed,
                Amount:       t.price.toString(),
            })),
        }));
        setIsPreviewModal(true);
    };

    const handleSubmitAndPrint = () => {
        const all = transactions.length > 0 ? transactions : [{
            transType, studentId, referenceNumber,
            price: priceToUse, amountToPay, paymentMode,
            tuitionChildId, planId,
            orChildId:    orNumberData.OrChildId,
            orNumberUsed: orNumberData.LatestOrAvailable,
        }];

        dispatch(fetchInsertSubmitPaymentData({
            UserId:            all[0].studentId,
            ReferenceId:       all[0].referenceNumber,
            TransType:         orNumberData.OrType,
            OrId:              orNumberData.OrId,
            CreatedByUserId:   userId,
            TuitionChildId:    all[0].tuitionChildId,
            TypeOfTransaction: all.map((t) => t.transType).join(", "),
            OrChildDtos:       all.map((t) => ({
                BalId:           dailyBalance.BalId,
                OrChildId:       t.orChildId,
                PlanId:          t.planId,
                OrNumberUsed:    t.orNumberUsed,
                Amount:          t.price.toString(),
                AmountPaid:      t.amountToPay.toString(),
                ModeOfPayment:   t.paymentMode?.value,
                FromTransaction: t.transType,
            })),
        }));

        if (receiptData?.PdfBase64) {
            const iframe = document.createElement("iframe");
            iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:none;";
            iframe.src = `data:application/pdf;base64,${receiptData.PdfBase64}`;
            document.body.appendChild(iframe);
            iframe.onload = () => {
                setTimeout(() => {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                    setTimeout(() => document.body.removeChild(iframe), 1000);
                }, 300);
            };
        }

        setIsPreviewModal(false);
        setIsConfirmModal(false);
        setTransactions([]);
        resetFormAndType();
    };

    const canPrint = transactions.length > 0 || (transType && referenceNumber);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="bg-white p-4 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* ── LEFT: Payment form ───────────────────────────────── */}
                    <div className="lg:col-span-3 space-y-5">
                        <h2 className="text-2xl font-bold text-gray-900">Payment Form</h2>

                        {/* Transaction type selector */}
                        <div>
                            <SearchableSelect
                                options={transList}
                                value={transDropdown}
                                onChange={handleSelectTransType}
                                placeholder="— Select Transaction Type —"
                                label="Transaction Type"
                            />
                        </div>

                        {/* Student search — only shown when a type is selected */}
                        {transType && (
                            <div className="space-y-4 border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
                                    {transType}
                                </h3>

                                {/* App / Student No search */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                        {transType === "Tuition Fee" ? "Student Number" : "Application Number"}
                                    </label>
                                    <SearchBoxAppNo
                                        label="Search Student"
                                        placeholder={transType === "Tuition Fee" ? "Search by student number or name..." : "Search by application number or name..."}
                                        required
                                        options={studentApp}
                                        value={selectedStudent}
                                        onSelect={(student) => { handleStudentSelect(student); setSelectedStudent(student); }}
                                    />
                                    {errors && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
                                </div>

                                {/* OR Number */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Official Receipt No.</label>
                                    <input readOnly className={READONLY} value={orNumberData.LatestOrAvailable || ""} />
                                </div>

                                {/* Full name */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name</label>
                                    <input readOnly className={READONLY} value={fullName || ""} />
                                </div>

                                {/* ── Assessment Plan breakdown ── */}
                                {transType === "Assessment Plan" && fullName && (
                                    <>
                                        {/* Plan picker */}
                                        <div>
                                            {pendingTxLoading ? (
                                                <div className="h-12 bg-gray-100 animate-pulse rounded-lg" />
                                            ) : (
                                                <SearchableSelect
                                                    options={(() => {
                                                        const pendingList = Array.isArray(pendingTxData) ? pendingTxData : [];
                                                        const uniquePlans = new Map();
                                                        pendingList.forEach((t) => {
                                                            if (!uniquePlans.has(t.TuitionChildId)) {
                                                                uniquePlans.set(t.TuitionChildId, {
                                                                    value: t.TuitionChildId,
                                                                    label: t.PlanName || "Unnamed Plan",
                                                                });
                                                            }
                                                        });
                                                        return Array.from(uniquePlans.values());
                                                    })()}
                                                    value={selectedPlan}
                                                    onChange={handlePlanSelect}
                                                    placeholder="— Select Payment Plan —"
                                                    label="Choose Assessment Plan"
                                                />
                                            )}
                                        </div>

                                        {/* Installment schedule for selected plan */}
                                        {selectedPlan && installmentRows.length > 0 && (
                                            <div className="border border-green-200 rounded-xl overflow-hidden">
                                                <div className="bg-green-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-green-700 border-b border-green-200">
                                                    {selectedPlan.label} — Payment Schedule
                                                </div>
                                                <table className="w-full text-xs">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            {["Payment", "Amount", "Due Date", "Status"].map((h) => (
                                                                <th key={h} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {installmentRows.map((row, i) => {
                                                            const isPaid = row.Status === "Paid";
                                                            return (
                                                                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                                                    <td className="px-3 py-2 text-gray-700">{row.NumberOfPayment || "—"}</td>
                                                                    <td className={`px-3 py-2 font-medium ${isPaid ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                                                        ₱{fmt(row.Amount)}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-gray-500">
                                                                        {row.DateOfPayment ? new Date(row.DateOfPayment).toLocaleDateString("en-US", {
                                                                            month: "short", day: "numeric", year: "numeric"
                                                                        }) : "—"}
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                        {isPaid ? (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                                                                Paid
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                                                                Pending
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Miscellaneous breakdown */}
                                        <div className="border border-blue-200 rounded-xl overflow-hidden">
                                            <div className="bg-blue-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-blue-700 border-b border-blue-200">
                                                Miscellaneous Fees Breakdown
                                            </div>
                                            {miscLoading ? (
                                                <div className="space-y-1 p-3">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" />
                                                    ))}
                                                </div>
                                            ) : Array.isArray(miscBreakdown) && miscBreakdown.length > 0 ? (
                                                <table className="w-full text-xs">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">Fee Item</th>
                                                            <th className="px-3 py-2 text-right font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {miscBreakdown.map((row, i) => (
                                                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                                                <td className="px-3 py-2 text-gray-700">{row.FeeName || "—"}</td>
                                                                <td className="px-3 py-2 text-right font-medium text-gray-800">₱{fmt(row.Amount)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot className="border-t border-gray-200 bg-blue-50">
                                                        <tr>
                                                            <td className="px-3 py-2 text-right font-bold text-blue-700 text-xs">Misc Total</td>
                                                            <td className="px-3 py-2 text-right font-bold text-blue-700 text-xs">
                                                                ₱{fmt(miscBreakdown.reduce((s, r) => s + Number(r.Amount || 0), 0))}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic px-3 py-3">No miscellaneous fees found for this level.</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Price */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                        {transType === "Assessment Plan" ? "Amount Due (First Installment)" : "Price"}
                                    </label>
                                    <input
                                        readOnly
                                        className={READONLY}
                                        value={transType === "Assessment Plan" ? (installmentRows[0]?.Amount || planAmount || "") : (amountValue || "")}
                                    />
                                </div>

                                {/* Amount tendered */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                        Amount Tendered <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Enter amount"
                                        className={`${INPUT} ${isAmount ? "border-red-500" : ""}`}
                                        value={amountToPay}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                    />
                                    {isAmount && <p className="text-red-500 text-xs mt-1">{amountError}</p>}
                                    {Number(amountToPay) > 0 && priceToUse > 0 && (
                                        <p className={`text-xs mt-1 font-medium ${Number(change) >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                                            {Number(change) >= 0 ? `Change: ₱${fmt(change)}` : `Short by ₱${fmt(Math.abs(change))}`}
                                        </p>
                                    )}
                                </div>

                                {/* Mode of payment */}
                                <div>
                                    <SearchableSelect
                                        options={paymentOptions}
                                        value={paymentMode}
                                        onChange={setPaymentMode}
                                        placeholder="— Mode of Payment —"
                                        label="Mode of Payment"
                                    />
                                </div>

                                {/* Check number */}
                                {paymentMode?.value === "Check" && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                                            Check Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter check number"
                                            className={`${INPUT} ${isCheckError ? "border-red-500" : ""}`}
                                            value={checkNumber}
                                            onChange={(e) => setCheckNumber(e.target.value)}
                                        />
                                        {isCheckError && <p className="text-red-500 text-xs mt-1">{checkError}</p>}
                                    </div>
                                )}

                                {/* Add Transaction button */}
                                <button
                                    type="button"
                                    onClick={addTransaction}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition w-full justify-center"
                                >
                                    <Plus size={16} /> Add Transaction
                                </button>
                            </div>
                        )}

                        {/* Added transactions list */}
                        {transactions.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">
                                    Receipt Items ({transactions.length})
                                </h3>
                                <div className="space-y-2">
                                    {transactions.map((t) => (
                                        <TransactionCard key={t.id} t={t} onRemove={removeTransaction} />
                                    ))}
                                </div>

                                {/* Running total */}
                                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-1.5 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">₱{fmt(transactionsTotal)}</span>
                                    </div>
                                    {totalAmount > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Current Entry</span>
                                            <span className="font-medium">₱{fmt(totalAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1.5">
                                        <span>Grand Total</span>
                                        <span className="text-green-700">₱{fmt(grandTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Print button */}
                        <button
                            type="button"
                            onClick={handlePrint}
                            disabled={!canPrint}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Printer size={17} /> Print Receipt
                        </button>
                    </div>

                    {/* ── RIGHT: Receipt preview panel ─────────────────────── */}
                    <div className="lg:col-span-2">
                        <ReceiptPanel
                            orNumber={orNumberData.LatestOrAvailable}
                            transactions={transactions}
                            dailyBalance={dailyBalance}
                            realtimeBalance={realtimeBalance}
                            amountToPay={amountToPay}
                            change={change}
                            paymentMode={paymentMode}
                            checkNumber={checkNumber}
                            miscBreakdown={miscBreakdown}
                        />
                    </div>
                </div>
            </div>

            {/* ── Preview Modal ─────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={isPreviewModal}
                onClose={() => setIsPreviewModal(false)}
                title="Receipt Preview"
                size="w-[900px]"
                maxHeight="100vh"
                body={
                    <div className="flex justify-center items-center p-4">
                        <div className="w-full flex flex-col gap-2">
                            <div className="border rounded-lg shadow overflow-hidden flex justify-center items-center">
                                {receiptLoading ? (
                                    <div className="flex items-center justify-center h-[60vh] text-gray-400">Loading preview...</div>
                                ) : receiptData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${receiptData.PdfBase64}`}
                                        className="w-full h-[60vh]"
                                        title="Receipt Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[60vh] text-gray-400">No preview available</div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    { label: "Submit & Print", type: "green", closeOnClick: false, onClick: () => { setIsPreviewModal(false); setIsConfirmModal(true); } },
                    { label: "Close",          type: "red",   onClick: () => setIsPreviewModal(false) },
                ]}
            />

            {/* ── Confirm Modal ──────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={isConfirmModal}
                onClose={() => setIsConfirmModal(false)}
                title={<span className="font-bold text-lg text-red-700">Confirm Payment</span>}
                body={
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>Are you sure you want to submit and print this receipt?</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Transactions</span>
                                <span className="font-semibold">{transactions.length || 1}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Amount</span>
                                <span className="font-semibold text-green-700">₱{fmt(grandTotal || priceToUse)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">OR No.</span>
                                <span className="font-semibold">{orNumberData.LatestOrAvailable || "—"}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">This action cannot be undone.</p>
                    </div>
                }
                buttons={[
                    { label: "Yes, Submit & Print", type: "green", closeOnClick: false, onClick: handleSubmitAndPrint },
                    { label: "Cancel",              type: "red",   onClick: () => setIsConfirmModal(false) },
                ]}
            />
        </div>
    );
};

export default PaymentComponent;
