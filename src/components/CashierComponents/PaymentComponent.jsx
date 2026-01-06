import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TestPermitComponent from "./TestPermitComponent";
import {
    fetchTransactionTypeData,
} from "../../states/CashierState/Action";
import EnrollmentComponent from "./EnrollmentComponent";

const PaymentComponent = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user.UserId;

    const [transList, setTransList] = useState([]);

    const transactionTypeState = useSelector((state) => state.cashier.transactionTypeState || {});
    const transData = transactionTypeState.data || [];
    const [amountValue, setAmountValue] = useState(0);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        setTransList(transData);
    }, [transData]);

    const [transDropdown, setTransDrpopdown] = useState(0);
    const setTransType = (transId) => {
        console.log(transId);
        console.log(transData);
        switch (transId) {
            case transId:
                setAmountValue(transData[transId - 1].Value);
                break;
        }
        setTransDrpopdown(transId);
    };

    const studentAppState = useSelector((state) => state.cashier.studentAppState || {});
    const studentApp = studentAppState.data || [];

    console.log(studentApp);

    useEffect(() => {
        dispatch(fetchTransactionTypeData());
    }, [dispatch]);




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
                                        <label
                                            htmlFor="transType"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Select Transaction Type
                                        </label>
                                        <select
                                            onChange={(e) => setTransType(e.target.value)}
                                            className={`w-full rounded-lg border p-2`}
                                        >
                                            <option value="">
                                                -- Select Transaction Type --
                                            </option>
                                            {transList.map((u) => (
                                                <option
                                                    key={u.FeeChildId}
                                                    value={u.FeeChildId}
                                                >
                                                    {u.TransType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* App Number */}
                                    {transDropdown == 1 && (

                                        <>
                                            <TestPermitComponent userId={userId} amount={amountValue} onAmountChange={setAmountValue} onTotalChange={setTotal} />
                                        </>
                                    )}
                                    {transDropdown == 2 && (
                                        <>
                                            <EnrollmentComponent userId={userId} amount={amountValue} onAmountChange={setAmountValue} onTotalChange={setTotal}/>
                                        </>
                                    )}

                                </div>


                            </div>
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
                                    ₱{Number(amountValue).toFixed(2)}
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-[15px] font-semibold text-slate-900 border-t border-gray-300 pt-4">
                                Total{" "}
                                <span className="ml-auto">₱{Number(total).toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default PaymentComponent;
