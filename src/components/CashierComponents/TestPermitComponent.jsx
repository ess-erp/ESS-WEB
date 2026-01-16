import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Printer } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchInsertSubmitPaymentData,
    fetchPrintTestPermitData,
    fetchStudentAppData,
    fetchOrNumberData,
} from "../../states/CashierState/Action";

const TestPermitComponent = ({ userId, amount, onAmountChange, onTotalChange }) => {

    const dispatch = useDispatch();
    const studentAppState = useSelector((state) => state.cashier.studentAppState || {});
    const studentApp = studentAppState.data || [];
    console.log(studentApp);

    const printTestPermitState = useSelector((state) => state.cashier.printTestPermitState || {});
    const permitData = printTestPermitState.data || [];
    const permitLoading = printTestPermitState.loading;

    console.log(permitData);

    useEffect(() => {
        dispatch(fetchStudentAppData());
    }, [dispatch]);

    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!query) {
            setFiltered([]);
            return;
        }

        const result = studentApp
            .filter(s =>
                s.AppNumber?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5);

        setFiltered(result);
    }, [query, studentApp]);
    const [studentId, setStudentId] = useState(0);
    const [fullName, setFullname] = useState("");

    const amountValue = parseFloat(amount) || 0;
    const total = amountValue;

    useEffect(() => {
        onAmountChange(amountValue);
        onTotalChange(total);
    }, [amountValue, total]);

    const orNumberState = useSelector((state) => state.cashier.orNumberState || {});
    const orNumberData = orNumberState.data || [];

    console.log(orNumberData);

    useEffect(() => {
        dispatch(fetchOrNumberData(userId));
    }, [userId, dispatch]);

    console.log(query);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isWarningModal, setIsWarningModal] = useState(false);
    const [errors, setErrors] = useState("");

    const handlePrint = async () => {
        if (!query || query.trim().length === 0) {
            setErrors("Application number is required.");
            return; // ⛔ stop execution
        }
        setErrors("");
        const payload = {
            UserId: studentId,
            ReferenceId: query,
            TransType: orNumberData.OrType,
            OrId: orNumberData.OrId,
            CreatedByUserId: userId,
            OrChildDtos: [{
                OrChildId: orNumberData.OrChildId,
                OrNumberUsed: orNumberData.LastOrNoUsed,
                Amount: amountValue.toString(),
            }]
        };

        console.log(payload);
        await dispatch(fetchPrintTestPermitData(payload));
        setIsOpenModal(true);
    };
    const [amountToPay, setAmountToPay] = useState("");
    const [amountError, setAmountError] = useState("");
    const [isAmount, setIsAmount] = useState(false);
    const handleChangeAmountToPay = (value) => {
        if (value === "") {
            setIsAmount(true);
            setAmountError("Please enter amount before you proceed.");
            setAmountToPay("");
        } else {
            setIsAmount(false);
            setAmountError("");
            setAmountToPay(value);
        }
    };
    const handleSubmitOrNumber = () => {

        const payload = {
            UserId: studentId,
            ReferenceId: query,
            TransType: orNumberData.OrType,
            OrId: orNumberData.OrId,
            CreatedByUserId: userId,
            OrChildDtos: [{
                OrChildId: orNumberData.OrChildId,
                OrNumberUsed: orNumberData.LatestOrAvailable,
                Amount: amountValue.toString(),
                FromTransaction: "Test-Permit",
            }]
        };
        console.log(payload);
        dispatch(fetchInsertSubmitPaymentData(payload));
        setIsOpenModal(true);
        setIsWarningModal(false);

    };



    return (
        <div>
            <hr className="mt-4" />
            <h2 className="mt-2 my-2 font-semibold text-slate-900">
                Test Permit
            </h2>
            <div className="relative w-full">
                <div className="flex flex-col gap-2 w-full">
                    <label
                        htmlFor="appNumber"
                        className="text-sm font-medium text-gray-700"
                    >
                        Application Number
                    </label>
                    <input
                        id="appNumber"
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setErrors("");
                            setShow(true);
                        }}
                        onFocus={() => setShow(true)}
                        onBlur={() => setTimeout(() => setShow(false), 150)}
                        placeholder="Type application number"
                        className={`px-4 py-3.5 w-full text-sm border rounded-lg outline-none 
                        ${errors ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors && (
                        <p className="text-red-500 text-sm">{errors}</p>
                    )}
                </div>

                {/* Suggestions */}
                {show && filtered.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
                        {filtered.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setQuery(item.AppNumber);
                                    setShow(false);
                                    setFullname(item.Fname + " " + (item?.Mname ?? "") + " " + item.Lname);
                                    setStudentId(item.StudentId);
                                }}
                                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                            >
                                {item.AppNumber}
                            </li>
                        ))}
                        {filtered.length === 0 && (
                            <li className="px-3 py-2 text-gray-500">No results found</li>
                        )}
                    </ul>
                )}
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
                    value={amountValue}
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
                    onBlur={() => {
                        if (!amountToPay) {
                            setIsAmount(true);
                            setAmountError("Please enter amount before you proceed.");
                        }
                    }}
                />
                {isAmount && (
                    <p className="text-red-500 text-sm mt-1">{amountError}</p>
                )}
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

export default TestPermitComponent;