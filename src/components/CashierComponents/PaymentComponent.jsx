import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Printer, Trash2 } from "lucide-react";
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
} from "../../states/CashierState/Action";
import SearchBoxAppNo from "../ButtonsComponents/SearchBoxAppNo";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";

const PaymentComponent = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user.UserId;

    const transactionTypeState = useSelector((state) => state.cashier.transactionTypeState || {});
    const transData = transactionTypeState.data || [];
    const studentAppState = useSelector((state) => state.cashier.studentAppState || {});
    const studentApp = studentAppState.data || [];
    const assessmentData = useSelector((state) => state.cashier.studentAppAssessmentState.data || []);
    const orNumberState = useSelector((state) => state.cashier.orNumberState || {});
    const orNumberData = orNumberState.data || [];
    const dailyBalanceState = useSelector((state) => state.cashier.dailyBalanceState || {});
    const dailyBalance = dailyBalanceState.data || [];
    const realtimeBalanceState = useSelector((state) => state.cashier.realtimeBalanceState || {});
    const realtimeBalance = realtimeBalanceState.data || [];
    const printReceiptState = useSelector((state) => state.cashier.printReceiptState || {});
    const receiptData = printReceiptState.data || [];
    const receiptLoading = printReceiptState.loading;

    const [transList, setTransList] = useState([]);
    const [transType, setIsTransType] = useState("");
    const [transDropdown, setTransDropdown] = useState(null);
    const [amountValue, setAmountValue] = useState(0);
    const [studentId, setStudentId] = useState(0);
    const [fullName, setFullname] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [planAmount, setPlanAmount] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    const [tuitionChildId, setTuitionChildId] = useState(0);
    const [planId, setPlanId] = useState(0);

    // NEW: holds the list of transactions added before final submit
    const [transactions, setTransactions] = useState([]);

    const paymentOptions = [
        { value: "Cash", label: "Cash" },
        { value: "Check", label: "Check" },
    ];

    useEffect(() => {
        dispatch(fetchTransactionTypeData());
        dispatch(fetchGetDailyBalanceData(userId));
        dispatch(fetchGetRealtimeDailyBalanceData(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        const mappedOptions = transData.map((item) => ({
            value: item.FeeChildId,
            label: item.TransType,
            amount: item.Value,
        }));
        setTransList(mappedOptions);
    }, [transData]);

    const setTransType = (data) => {
        resetForm();
        setAmountValue(data.amount);
        setIsTransType(data.label);
        setTransDropdown(data);

        let status = "";
        switch (data.label) {
            case "Test Permit":
                status = "O-EXAMINATION-CASHIER";
                dispatch(fetchStudentAppData(status));
                break;
            case "Enlistment Fee":
                status = "O-RESERVATION";
                dispatch(fetchStudentAppData(status));
                break;
            case "Assessment Plan":
                status = "O-RESERVED";
                dispatch(fetchStudentAppData(status));
                break;
            case "Tuition Fee":
                status = "Y";
                dispatch(fetchStudentAppData(status));
        }
    };

    const handleStudentSelect = (student) => {
        if (transType == "Tuition Fee") {
            setReferenceNumber(student.StudentNumber);
        } else {
            setReferenceNumber(student.AppNumber);
        }
        setStudentId(student.StudentId);
        setFullname(student.Fname + " " + student?.Mname + " " + student.Lname);
        dispatch(fetchStudentAppAssessmentData(student.AppId));
    };

    useEffect(() => {
        if (!assessmentData) return;
        setPlanAmount(assessmentData[0]?.Amount);
        setTuitionChildId(assessmentData[0]?.TuitionChildId);
        setPlanId(assessmentData[0]?.PlanId);
    }, [assessmentData]);

    useEffect(() => {
        dispatch(fetchOrNumberData(userId));
    }, [userId, dispatch]);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isWarningModal, setIsWarningModal] = useState(false);
    const [errors, setErrors] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [amountToPay, setAmountToPay] = useState(0);
    const [amountError, setAmountError] = useState("");
    const [isAmount, setIsAmount] = useState(false);
    const [change, setChange] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [checkNumber, setCheckNumber] = useState("");
    const [checkNumberError, setCheckNumberError] = useState("");
    const [isCheckNumberError, setIsCheckNumberError] = useState(false);

    const priceToUse =
        transType === "Assessment Plan"
            ? Number(planAmount || 0)
            : Number(amountValue || 0);

    // Running total = already-added transactions + whatever is currently in the form
    const transactionsTotal = transactions.reduce((sum, t) => sum + Number(t.price || 0), 0);
    const grandTotal = transactionsTotal + (totalAmount || 0);

    const handleChangeAmountToPay = (value) => {
        const cash = Number(value || 0);
        const price = priceToUse;

        setAmountToPay(value);

        const computedChange = cash - price;
        setChange(Number(computedChange.toFixed(2)));

        setTotalAmount(price);
    };

    const resetForm = () => {
        setStudentId(0);
        setFullname("");
        setReferenceNumber("");
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
        setIsCheckNumberError(false);
        setCheckNumberError("");
    };

    // Fully clears the transaction type too (used after adding to list)
    const resetFormAndType = () => {
        resetForm();
        setTransDropdown(null);
        setIsTransType("");
        setPaymentMode(null);
        setTuitionChildId(0);
        setPlanId(0);
    };

    // NEW: validate current form entry and push it into the transactions list
    const addTransaction = () => {
        if (!transType) {
            setErrors(true);
            setErrorMessage("Please select a transaction type.");
            return;
        }

        if (!referenceNumber) {
            setErrors(true);
            setErrorMessage(
                transType === "Tuition Fee"
                    ? "Please enter student number."
                    : "Please enter application number."
            );
            return;
        }

        if (!amountToPay || Number(amountToPay) === 0) {
            setIsAmount(true);
            setAmountError("Please enter amount before you proceed.");
            return;
        }

        if (paymentMode?.value === "Check" && !checkNumber) {
            setIsCheckNumberError(true);
            setCheckNumberError("Please enter the check number.");
            return;
        }

        const newTransaction = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            transType,
            studentId,
            fullName,
            referenceNumber,
            price: priceToUse,
            amountToPay: Number(amountToPay),
            change,
            paymentMode,
            checkNumber,
            tuitionChildId,
            planId,
            orChildId: orNumberData.OrChildId,
            orNumberUsed: orNumberData.LatestOrAvailable,
            planName: assessmentData[0]?.PlanName ?? "",
        };

        setTransactions((prev) => [...prev, newTransaction]);
        resetFormAndType();
    };

    // NEW: remove a transaction from the list before submitting
    const removeTransaction = (id) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const handlePrint = async () => {
        // If nothing has been added yet, validate + treat current form as the only transaction
        if (transactions.length === 0) {
            if (!referenceNumber) {
                setErrors(true);
                setErrorMessage(
                    transType === "Tuition Fee"
                        ? "Please enter student number."
                        : "Please enter application number."
                );
                return;
            }

            if (!amountToPay || amountToPay === 0) {
                setIsAmount(true);
                setAmountError("Please enter amount before you proceed.");
                return;
            }

            if (paymentMode?.value == "Check" && (!checkNumber || checkNumber === "")) {
                setIsCheckNumberError(true);
                setCheckNumberError("Please enter the check number.");
                return;
            }
        }

        const allTransactions =
            transactions.length > 0
                ? transactions
                : [
                      {
                          transType,
                          price: priceToUse,
                          orChildId: orNumberData.OrChildId,
                          orNumberUsed: orNumberData.LatestOrAvailable,
                      },
                  ];

        const payload = {
            UserId: studentId,
            ReferenceId: "",
            TransType: orNumberData.OrType,
            OrId: orNumberData.OrId,
            CreatedByUserId: userId,
            TuitionChildId: 0,
            TypeOfTransaction: allTransactions.map((t) => t.transType).join(", "),
            OrChildDtos: allTransactions.map((t) => ({
                OrChildId: t.orChildId,
                OrNumberUsed: t.orNumberUsed,
                Amount: t.price.toString(),
            })),
        };

        await dispatch(fetchPrintReceiptData(payload));
        setIsOpenModal(true);
    };

    const handleSubmitOrNumber = () => {
        // Combine any added transactions with whatever is currently in the form
        const allTransactions =
            transactions.length > 0
                ? transactions
                : [
                      {
                          transType,
                          studentId,
                          referenceNumber,
                          price: priceToUse,
                          amountToPay,
                          paymentMode,
                          tuitionChildId,
                          planId,
                          orChildId: orNumberData.OrChildId,
                          orNumberUsed: orNumberData.LatestOrAvailable,
                      },
                  ];
        console.log(allTransactions);
        const payload = {
            UserId: allTransactions[0].studentId,
            ReferenceId: allTransactions[0].referenceNumber,
            TransType: orNumberData.OrType,
            OrId: orNumberData.OrId,
            CreatedByUserId: userId,
            TuitionChildId: allTransactions[0].tuitionChildId,
            TypeOfTransaction: allTransactions.map((t) => t.transType).join(", "),
            OrChildDtos: allTransactions.map((t) => ({
                BalId: dailyBalance.BalId,
                OrChildId: t.orChildId,
                PlanId: t.planId,
                OrNumberUsed: t.orNumberUsed,
                Amount: t.price.toString(),
                AmountPaid: t.amountToPay.toString(),
                ModeOfPayment: t.paymentMode?.value,
                FromTransaction: t.transType,
            })),
        };
        console.log(payload);
        dispatch(fetchInsertSubmitPaymentData(payload));
        setIsOpenModal(true);
        setIsWarningModal(false);
        setTransactions([]);
        resetFormAndType();
    };

    const printSilently = (base64Pdf) => {
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "none";
        iframe.src = `data:application/pdf;base64,${base64Pdf}`;
        document.body.appendChild(iframe);
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(() => document.body.removeChild(iframe), 1000);
            }, 300);
        };
    };

    return (
        <div className="bg-white p-4">
            <div className="md:max-w-5xl max-w-xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Payment Section */}
                    <div className="lg:col-span-2 max-md:order-1">
                        <h2 className="text-3xl font-semibold text-slate-900">
                            Payment Form
                        </h2>

                        <div className="mt-8 max-w-lg">
                            <div className="mt-12">
                                <div className="grid gap-4">
                                    {/* Dropdown for transaction type */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <SearchableSelect
                                            options={transList}
                                            value={transDropdown}
                                            onChange={(selected) => setTransType(selected)}
                                            placeholder="-- Select Transaction Type --"
                                            label="Select Transaction Type"
                                        />
                                    </div>
                                    {transType && (
                                        <div>
                                            <hr className="mt-4" />
                                            <h2 className="mt-2 my-2 font-semibold text-slate-900">
                                                {transType}
                                            </h2>
                                            <div className="relative w-full">
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label
                                                        htmlFor="appNumber"
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        {transType === "Tuition Fee" ? (
                                                            <>Student Number</>
                                                        ) : (
                                                            <>Application Number</>
                                                        )}
                                                    </label>
                                                    <SearchBoxAppNo
                                                        label="Search Student"
                                                        placeholder={
                                                            transType === "Tuition Fee"
                                                                ? "Search by student number or fullname..."
                                                                : "Search by application number or fullname..."
                                                        }
                                                        required
                                                        options={studentApp}
                                                        value={selectedStudent}
                                                        onSelect={(student) => {
                                                            handleStudentSelect(student);
                                                            setSelectedStudent(student);
                                                        }}
                                                    />
                                                    {errors && (
                                                        <p className="text-red-500 text-sm">{errorMessage}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 w-full">
                                                <label
                                                    htmlFor="officialReceipt"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Official Receipt
                                                </label>
                                                <input
                                                    id="officialReceipt"
                                                    type="text"
                                                    className="px-4 py-3.5 bg-gray-100 text-gray-500 w-full text-sm border border-gray-300 rounded-lg outline-none"
                                                    value={orNumberData.LatestOrAvailable}
                                                    readOnly
                                                />
                                                <p className="text-xs text-gray-500">
                                                    Required for payment verification
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                <label
                                                    htmlFor="fullName"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Fullname
                                                </label>
                                                <input
                                                    id="fullName"
                                                    value={fullName || ""}
                                                    type="text"
                                                    className="px-4 py-3.5 bg-gray-100 text-gray-500 w-full text-sm border border-gray-300 rounded-lg outline-none"
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                <label
                                                    htmlFor="price"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Price
                                                </label>
                                                <input
                                                    id="price"
                                                    type="number"
                                                    placeholder="Enter Amount."
                                                    className="px-4 py-3.5 bg-gray-50 text-slate-900 w-full text-sm border rounded-lg"
                                                    value={transType === "Assessment Plan" ? planAmount : amountValue}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                <label
                                                    htmlFor="amount"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Amount
                                                </label>
                                                <input
                                                    id="amount"
                                                    type="number"
                                                    placeholder="Enter Amount."
                                                    className={`px-4 py-3.5 w-full text-sm border rounded-lg outline-none 
                                                    ${isAmount ? "border-red-500" : "border-gray-300"}`}
                                                    value={amountToPay}
                                                    onChange={(e) => handleChangeAmountToPay(e.target.value)}
                                                />
                                                {isAmount && (
                                                    <p className="text-red-500 text-sm mt-1">{amountError}</p>
                                                )}
                                                <div className="flex flex-col gap-2 w-full">
                                                    <SearchableSelect
                                                        options={paymentOptions}
                                                        value={paymentMode}
                                                        onChange={(selected) => setPaymentMode(selected)}
                                                        placeholder="-- Select Mode of Payment --"
                                                        label="Select Mode Of Payment"
                                                    />
                                                </div>
                                                {paymentMode?.value == "Check" && (
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <label
                                                            htmlFor="checkNumber"
                                                            className="text-sm font-medium text-gray-700"
                                                        >
                                                            Check Number
                                                        </label>
                                                        <input
                                                            id="checkNumber"
                                                            type="text"
                                                            placeholder="Enter Check Number."
                                                            className={`px-4 py-3.5 w-full text-sm border rounded-lg outline-none 
                                                            ${isCheckNumberError ? "border-red-500" : "border-gray-300"}`}
                                                            value={checkNumber}
                                                            onChange={(e) => setCheckNumber(e.target.value)}
                                                        />
                                                        {isCheckNumberError && (
                                                            <p className="text-red-500 text-sm mt-1">{checkNumberError}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-8 flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={addTransaction}
                                                    className="w-48 py-3 flex items-center justify-center gap-2 text-[15px] font-medium bg-emerald-500 text-white rounded-md hover:bg-emerald-600 tracking-wide cursor-pointer"
                                                >
                                                    + Add Transaction
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Always-visible Print button, enabled once there's something to print */}
                                    <div className="mt-4 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={handlePrint}
                                            disabled={transactions.length === 0 && !transType}
                                            className="w-40 py-3 flex items-center justify-center gap-2 text-[15px] font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Printer className="w-5 h-5" />
                                            Print
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-100 p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Cashier Daily Cash Balance
                        </h2>
                        <ul className="text-slate-500 font-medium mt-8 space-y-4">
                            <li className="flex flex-wrap gap-4 text-sm">
                                Daily Starting Balance
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{Number(dailyBalance.Amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                Current Balance
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{Number(realtimeBalance.Amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </li>
                            <hr />
                        </ul>

                        <h2 className="text-2xl font-semibold text-slate-900 mt-6">
                            Payment Information
                        </h2>

                        {/* NEW: list of added transactions */}
                        {transactions.length > 0 && (
                            <div className="mt-4 border rounded-md divide-y bg-white overflow-hidden">
                                {transactions.map((t) => (
                                    <div
                                        key={t.id}
                                        className="flex items-center justify-between text-sm p-3"
                                    >
                                        <div>
                                            <div className="font-semibold text-slate-900">
                                                {t.transType === "Assessment Plan"
                                                    ? `${t.transType} - ${t.planName}`
                                                    : t.transType}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {t.referenceNumber} — {t.fullName}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-slate-900">
                                                ₱{Number(t.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeTransaction(t.id)}
                                                className="text-red-500 hover:text-red-600"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <ul className="text-slate-500 font-medium mt-4 space-y-4">
                            {transactions.length === 0 && (
                                <li className="flex flex-wrap gap-4 text-sm">
                                    <strong>
                                        {transType === "Assessment Plan"
                                            ? `${transType} - ${assessmentData[0]?.PlanName ?? ""}`
                                            : transType || "No transaction added yet"}
                                    </strong>
                                </li>
                            )}

                            <li className="flex flex-wrap gap-4 text-sm">
                                Current Entry Amount{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{Number(amountToPay || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Change{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{Number(change || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Mode of payment{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    {paymentMode ? paymentMode.label : "-"}
                                </span>
                            </li>
                            {paymentMode?.value === "Check" && (
                                <li className="flex flex-wrap gap-4 text-sm">
                                    Check Number{" "}
                                    <span className="ml-auto font-semibold text-slate-900">
                                        {checkNumber}
                                    </span>
                                </li>
                            )}
                            <li className="flex flex-wrap gap-4 text-sm border-t border-gray-300 pt-4">
                                Added Transactions Subtotal{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{transactionsTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-[15px] font-semibold text-slate-900 border-t border-gray-300 pt-4">
                                Total{" "}
                                <span className="ml-auto">₱{grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <ModalComponent
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                title="Sale Invoice Preview"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex justify-center items-center">
                        <div className="w-3/4 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600 text-center">
                                Preview
                            </label>
                            <div className="border rounded-lg shadow overflow-hidden flex justify-center items-center">
                                {receiptLoading ? (
                                    <div className="flex items-center justify-center h-[60vh] text-gray-400">
                                        Loading preview...
                                    </div>
                                ) : receiptData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${receiptData.PdfBase64}`}
                                        className="w-full h-[60vh]"
                                        title="Receipt Preview"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[60vh] text-gray-400">
                                        No preview available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    {
                        label: "Print",
                        type: "green",
                        onClick: () => setIsWarningModal(true),
                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsOpenModal(false),
                    },
                ]}
                size="w-[1000px]"
                maxHeight="100vh"
            />
            <ModalComponent
                isOpen={isWarningModal}
                onClose={() => setIsWarningModal(false)}
                title="Warning"
                body={"Are you sure you want to print?"}
                buttons={[
                    {
                        label: "Submit & Print",
                        type: "green",
                        onClick: async () => {
                            if (receiptData?.PdfBase64) {
                                handleSubmitOrNumber();
                                printSilently(receiptData.PdfBase64);
                            }
                        },
                    },
                    {
                        label: "Close",
                        type: "red",
                        onClick: () => setIsOpenModal(false),
                    },
                ]}
                maxHeight="100vh"
            />
        </div>
    );
};

export default PaymentComponent;