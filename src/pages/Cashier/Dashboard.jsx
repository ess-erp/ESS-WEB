import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import AnnouncementComponent from '../../components/AdmissionComponents/AnnouncementComponent';
import ModalComponent from '../../components/ButtonsComponents/ModalComponent';
import {
    fetchGetDailyBalanceData,
    fetchInsertDailyBalanceData,
} from "../../states/CashierState/Action";


const Dashboard = () => {
    const dispatch = useDispatch();
    const user = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user[0].UserId;

    const dailyBalanceState = useSelector((state) => state.cashier.dailyBalanceState || {});
    const dailyBalance = dailyBalanceState.data || [];

    console.log(dailyBalance);

    useEffect(() => {
        dispatch(fetchGetDailyBalanceData(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        if (dailyBalance.success == false) {
            setIsModalOpen(true);
        }
        else{
            setIsModalOpen(false);
        }
    }, [dailyBalance]);


    useEffect(() => {
        document.title = 'Dashboard | Cashier';
    }, []);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/cashier/dashboard' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleSubmit = async () => {

        if(amount == 0 || amount == "") {
            setErrors(true);
            setErrorMsg("Please enter your starting amount balance.");
            return;
        }
        const res = await dispatch(fetchInsertDailyBalanceData(userId, amount));

        if(res.ok){
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }
        else {
            setErrors(true);
            setErrorMsg(res.error);
        }
    };

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <h2 className="text-2xl font-bold text-black mt-2">Dashboard</h2>
                </div>

                <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                    <div className="flex flex-col space-y-4 h-full w-full">
                        <div className="flex justify-center">
                            <h2 className="text-2xl font-bold text-green-700 mt-2">
                                Welcome to Cashier Dashboard
                            </h2>
                        </div>
                        <AnnouncementComponent />
                    </div>
                    <ModalComponent
                        isOpen={isModalOpen}

                        title={<span className="font-bold text-lg text-red-700">Warning</span>}
                        body={
                            <>
                                <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Note: </strong>
                                    <span className="block sm:inline">Enter your starting balance. </span>
                                </div>
                                <div className="pt-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        <strong>Enter Amount <span className='text-red-500'>*</span></strong>
                                    </label>
                                    <input
                                        type="number"
                                        name="generalremarks"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        required
                                        placeholder="Enter start daily balance"
                                    />
                                    {errors && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errorMsg}
                                        </p>
                                    )}
                                </div>

                            </>
                        }
                        buttons={[
                            { label: "Submit", type: "green", onClick: handleSubmit, closeOnClick: false, },
                        ]}
                        showCloseButton={false}
                    />
                    <ModalComponent
                        isOpen={isSuccessModalOpen}
                        onClose={() => setIsSuccessModalOpen(false)}
                        title={<span className="font-bold text-lg text-green-700">Success</span>}
                        body="Daily balance amount is successfuly insert."
                        buttons={[
                            { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
                        ]}
                    />
                </section>
            </div>
        </div>
    );
};

export default Dashboard;