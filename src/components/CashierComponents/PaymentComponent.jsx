import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import TestPermitComponent from "./TestPermitComponent";
import { Printer } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchTransactionTypeData,
    fetchStudentAppData,
    fetchOrNumberData,
    fetchGetRealtimeDailyBalanceData,
    fetchGetDailyBalanceData,
    fetchPrintTestPermitData,
    fetchInsertSubmitPaymentData,
    fetchGetTuitionFeeData,
} from "../../states/CashierState/Action";
import SearchBoxAppNo from "../ButtonsComponents/SearchBoxAppNo";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
// import EnrollmentComponent from "./EnrollmentComponent";

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
    const orNumberState = useSelector((state) => state.cashier.orNumberState || {});
    const orNumberData = orNumberState.data || [];
    const dailyBalanceState = useSelector((state) => state.cashier.dailyBalanceState || {});
    const dailyBalance = dailyBalanceState.data || [];
    const realtimeBalanceState = useSelector((state) => state.cashier.realtimeBalanceState || {});
    const realtimeBalance = realtimeBalanceState.data || [];
    const tuitionFeeState = useSelector((state) => state.cashier.tuitionFeeState || {});
    const tuitionFee = tuitionFeeState.data || [];
    const printTestPermitState = useSelector((state) => state.cashier.printTestPermitState || {});
    const permitData = printTestPermitState.data || [];
    const permitLoading = printTestPermitState.loading;
    const [transList, setTransList] = useState([]);
    const [transType, setIsTransType] = useState("");
    const [transDropdown, setTransDropdown] = useState(null);
    const [amountValue, setAmountValue] = useState(0);
    const [studentId, setStudentId] = useState(0);
    const [fullName, setFullname] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [planList, setPlanList] = useState([]);
    const [planDropdown, setPlanDropdown] = useState(null);
    const [planAmount, setPlanAmount] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    const [tuitionId, setTuitionId] = useState(0);
    const [tuitionChildId, setTuitionChildId] = useState(0);
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
        console.log(data);

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
            case "Enrollment Fee":
                status = "O-RESERVED";
                dispatch(fetchStudentAppData(status));

                break
            case "Tuition Fee":
                status = "Y";
                dispatch(fetchStudentAppData(status));
        }

    };

    const handleStudentSelect = (student) => {
        console.log(student);
        console.log(transType);
        if (transType == "Tuition Fee") {
            setReferenceNumber(student.StudentNumber);
        }
        else {
            setReferenceNumber(student.AppNumber);
        }
        setStudentId(student.StudentId);
        setFullname(student.Fname + " " + student?.Mname + " " + student.Lname);
        console.log(student.LevelId);
        dispatch(fetchGetTuitionFeeData(student.StudentId, student.LevelId));
    };
    const getPlanGroup = (planName) => {
        return planName.replace(/[0-9]/g, "");
    };

    useEffect(() => {
        if (!tuitionFee || tuitionFee.length === 0) {
            setPlanList([]);
            return;
        }

        const grouped = {};

        tuitionFee.forEach(item => {
            const groupKey = getPlanGroup(item.PlanName);

            if (!grouped[groupKey]) {
                grouped[groupKey] = {
                    id: item.TuitionId,
                    tuitionChildId: item.TuitionChildId,
                    value: item.Amount,      // ✅ AMOUNT AS VALUE
                    label: groupKey,         // Plan A / B / C / D
                    planKey: groupKey
                };
            }
        });

        setPlanList(Object.values(grouped));
    }, [tuitionFee]);


    const [selectedPlanGroup, setSelectedPlanGroup] = useState(null);

    const setEnrollmentPlan = (data) => {
        console.log(data);
        setPlanDropdown(data);            // REQUIRED
        setSelectedPlanGroup(data?.planKey);
        setPlanAmount(data?.value);
        setTuitionId(data?.id);
        setTuitionChildId(data?.tuitionChildId);
    };

    const filteredPlans = tuitionFee.filter(item =>
        getPlanGroup(item.PlanName) === selectedPlanGroup
    );

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
    const priceToUse =
        transType === "Enrollment Fee"
            ? Number(planAmount || 0)
            : Number(amountValue || 0);

    const handleChangeAmountToPay = (value) => {
        const cash = Number(value || 0);   // entered cash
        const price = priceToUse;          // always use priceToUse

        setAmountToPay(value);             // store cash input

        const computedChange = cash - price;    // calculate change
        setChange(Number(computedChange.toFixed(2)));

        setTotalAmount(price);             // total always = price
    };
    // const handleChangeAmountToPay = (value) => {
    //     console.log(value);
    //     const cash = Number(value);
    //     const price = Number(amountValue);

    //     setAmountToPay(value);

    //     const computedChange = cash - price;

    //     setChange(Number(computedChange.toFixed(2)));
    //     setTotalAmount(price);
    // };

    // const handlePrint = async () => {
    //     if (referenceNumber === "" || referenceNumber === null) {
    //         setErrors(true);
    //         if (transType == "Tuition Fee") {
    //             setErrorMessage("Please enter student number.");
    //         }

    //         else {
    //             setErrorMessage("Please enter application number.");
    //         }
    //         return;
    //     }

    //     if (amountToPay === 0 || amountToPay === "") {
    //         setIsAmount(true);
    //         setAmountError("Please enter amount before you proceed.");
    //         return;
    //     }
    //     const payload = {
    //         UserId: studentId,
    //         ReferenceId: "",
    //         TransType: orNumberData.OrType,
    //         OrId: orNumberData.OrId,
    //         CreatedByUserId: userId,
    //         OrChildDtos: [{
    //             OrChildId: orNumberData.OrChildId,
    //             OrNumberUsed: orNumberData.LastOrNoUsed,
    //             Amount: amountValue.toString(),
    //         }]
    //     };

    //     console.log(payload);
    //     await dispatch(fetchPrintTestPermitData(payload));
    //     setIsOpenModal(true);
    // };

    const resetForm = () => {
        setStudentId(0);
        setFullname("");
        setReferenceNumber("");
        setPlanDropdown(null);
        setSelectedPlanGroup(null);
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
    };

    const handlePrint = async () => {
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

        const payload = {
            UserId: studentId,
            ReferenceId: "",
            TransType: orNumberData.OrType,
            OrId: orNumberData.OrId,
            CreatedByUserId: userId,
            OrChildDtos: [
                {
                    OrChildId: orNumberData.OrChildId,
                    OrNumberUsed: orNumberData.LastOrNoUsed,
                    Amount: priceToUse.toString(), 
                },
            ],
        };

        console.log(payload);
        await dispatch(fetchPrintTestPermitData(payload));
        setIsOpenModal(true);
    };

    const handleSubmitOrNumber = () => {

        const payload = {
            UserId: studentId,
            ReferenceId: referenceNumber,
            TransType: orNumberData.OrType,
            OrId: orNumberData.OrId,
            CreatedByUserId: userId,
            TuitionId: tuitionId,
            OrChildDtos: [{
                BalId: dailyBalance.BalId,
                OrChildId: orNumberData.OrChildId,
                TuitionChildId: tuitionChildId,
                OrNumberUsed: orNumberData.LatestOrAvailable,
                Amount: priceToUse.toString(),
                AmountPaid: amountToPay.toString(),
                ModeOfPayment: paymentMode?.value,
                FromTransaction: transType,
                
            }]
        };
        console.log(payload);
        dispatch(fetchInsertSubmitPaymentData(payload));
        setIsOpenModal(true);
        setIsWarningModal(false);
        resetForm();

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
                                    {/* Dropdown for payment method */}
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
                                                        {transType === "Tuition Fee"
                                                            ? <>Student Number</>
                                                            : <>Application Number</>
                                                        }
                                                    </label>
                                                    <SearchBoxAppNo
                                                        label="Search Student"
                                                        placeholder={transType === "Tuition Fee"
                                                            ? "Search by student number or fullname..."
                                                            : "Search by application number or fullname..."
                                                        }
                                                        required
                                                        options={studentApp}
                                                        value={selectedStudent}          // ✅ bind the value
                                                        onSelect={(student) => {
                                                            handleStudentSelect(student);
                                                            setSelectedStudent(student); // ✅ update selectedStudent state
                                                        }}
                                                    />
                                                    {errors && (
                                                        <p className="text-red-500 text-sm">{errorMessage}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {transType == "Enrollment Fee" && (
                                                <>
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <SearchableSelect
                                                            options={planList}
                                                            value={planDropdown}
                                                            onChange={setEnrollmentPlan}
                                                            placeholder="-- Select Plan Type --"
                                                            label="Select Plan Type"
                                                        />
                                                    </div>
                                                    {selectedPlanGroup && (
                                                        <table className="w-full border mt-4">
                                                            <thead>
                                                                <tr className="bg-gray-100">
                                                                    <th className="border p-2">Plan</th>
                                                                    <th className="border p-2">Amount</th>
                                                                    <th className="border p-2">Date of Payment</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredPlans.map(item => (
                                                                    <tr key={item.TuitionChildId}>
                                                                        <td className="border p-2">{item.PlanName}</td>
                                                                        <td className="border p-2">{item.Amount}</td>
                                                                        <td className="border p-2">
                                                                            {item.DateOfPayment
                                                                                ? new Date(item.DateOfPayment).toLocaleDateString()
                                                                                : "-"}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </>
                                            )}

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
                                                    htmlFor="amount"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Price
                                                </label>
                                                <input
                                                    id="amount"
                                                    type="number"
                                                    placeholder="Enter Amount."
                                                    className={`px-4 py-3.5 bg-gray-50 text-slate-900 w-full text-sm border rounded-lg`}
                                                    value={transType === "Enrollment Fee" ? planAmount : amountValue}
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
                                                    {isAmount && (
                                                        <p className="text-red-500 text-sm mt-1">{amountError}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-8 flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={handlePrint}
                                                    className="w-40 py-3 flex items-center justify-center gap-2 text-[15px] font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 tracking-wide cursor-pointer"
                                                >
                                                    <Printer className="w-5 h-5" />
                                                    Print
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
                                    ₱{Number(dailyBalance.Amount).toFixed(2)}
                                </span>
                                Current Balance
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{Number(realtimeBalance.Amount).toFixed(2)}
                                </span>
                            </li>
                            < hr />
                        </ul>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Payment Information
                        </h2>
                        <ul className="text-slate-500 font-medium mt-8 space-y-4">
                            <li className="flex flex-wrap gap-4 text-sm">
                                {transType}{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{priceToUse.toFixed(2)}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Amount{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{Number(amountToPay || 0).toFixed(2)}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Change{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{Number(change || 0).toFixed(2)}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Mode of payment{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    {paymentMode ? paymentMode.label : "-"} 
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-[15px] font-semibold text-slate-900 border-t border-gray-300 pt-4">

                                Total{" "}
                                <span className="ml-auto">₱{Number(totalAmount).toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <ModalComponent
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                title="Official Receipt Preview"
                body={
                    <div className="max-h-[80vh] w-full p-6 flex justify-center items-center">
                        <div className="w-3/4 flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600 text-center">
                                Preview
                            </label>
                            <div className="border rounded-lg shadow overflow-hidden flex justify-center items-center">
                                {permitLoading ? (
                                    <div className="flex items-center justify-center h-[60vh] text-gray-400">
                                        Loading preview...
                                    </div>
                                ) : permitData?.PdfBase64 ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${permitData.PdfBase64}`}
                                        className="w-full h-[60vh]"
                                        title="Test Permit Preview"
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
                        label: "Yes",
                        type: "green",
                        onClick: async () => {

                            if (permitData?.PdfBase64) {
                                handleSubmitOrNumber();
                                const pdfWindow = window.open("", "_blank");
                                if (pdfWindow) {
                                    pdfWindow.document.write(
                                        `<iframe width='100%' height='100%' src='data:application/pdf;base64,${permitData.PdfBase64}'></iframe>`
                                    );

                                    // Wait a bit before calling print (ensure iframe is loaded)
                                    setTimeout(() => {
                                        pdfWindow.focus();
                                        pdfWindow.print();
                                    }, 500);
                                }

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
