import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Printer } from "lucide-react";
import { useLocation } from "react-router-dom";
import { fetchStudentAppFormData } from "../../states/CashierState/Action";

const PaymentComponent = () => {
    const dispatch = useDispatch();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const AppId = query.get("AppId");
    const studentAppFormState = useSelector(
        (state) => state.cashier.studentAppFormState || {}
    );
    const studentData = studentAppFormState.data || {};

    const [amount, setAmount] = useState(""); // <-- state for amount

    useEffect(() => {
        dispatch(fetchStudentAppFormData(AppId));
    }, [dispatch, AppId]);

    // parse amount to number safely
    const amountValue = parseFloat(amount) || 0;
    const tax = amountValue > 0 ? 10 : 0; // example tax logic
    const total = amountValue + tax;

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
                            <form className="mt-12">
                                <div className="grid gap-4">
                                    {/* App Number */}
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
                                            className="px-4 py-3.5 bg-gray-100 text-gray-500 w-full text-sm border border-gray-300 rounded-lg outline-none"
                                            value={studentData.AppNumber ?? ""}
                                            readOnly
                                        />
                                    </div>

                                    {/* Official Receipt */}
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
                                            placeholder="Enter Official Receipt No."
                                            className="px-4 py-3.5 bg-gray-50 text-slate-900 w-full text-sm border border-gray-300 rounded-lg 
                                                focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 outline-none"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Required for payment verification
                                        </p>
                                    </div>

                                    {/* Fullname */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <label
                                            htmlFor="fullName"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Fullname
                                        </label>
                                        <input
                                            id="fullName"
                                            type="text"
                                            className="px-4 py-3.5 bg-gray-100 text-gray-500 w-full text-sm border border-gray-300 rounded-lg outline-none"
                                            value={`${studentData.Fname ?? ""} ${studentData.Mname ?? ""} ${studentData.Lname ?? ""}`.trim()}
                                            readOnly
                                        />
                                    </div>

                                    {/* Amount */}
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
                                            className="px-4 py-3.5 bg-gray-50 text-slate-900 w-full text-sm border border-gray-300 rounded-lg 
                                                focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 outline-none"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button
                                        type="button"
                                        className="w-40 py-3 flex items-center justify-center gap-2 text-[15px] font-medium bg-green-500 text-white rounded-md hover:bg-green-600 tracking-wide cursor-pointer"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        className="w-40 py-3 flex items-center justify-center gap-2 text-[15px] font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 tracking-wide cursor-pointer"
                                    >
                                        <Printer className="w-5 h-5" />
                                        Print
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-100 p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Payment Information
                        </h2>
                        <ul className="text-slate-500 font-medium mt-8 space-y-4">
                            <li className="flex flex-wrap gap-4 text-sm">
                                Test Permit{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{amountValue.toFixed(2)}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Tax{" "}
                                <span className="ml-auto font-semibold text-slate-900">
                                    ₱{tax.toFixed(2)}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-[15px] font-semibold text-slate-900 border-t border-gray-300 pt-4">
                                Total{" "}
                                <span className="ml-auto">₱{total.toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentComponent;
