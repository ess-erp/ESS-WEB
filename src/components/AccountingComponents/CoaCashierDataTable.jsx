import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Edit2 } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchGetCoaCashierData,
    fetchInsertCoaCashierData,
    fetchGetCoaFlatData,
    fetchGetCashierListData,
} from "../../states/AccountingState/Action";

const CoaCashierDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [table, setTable] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const [isAssignModal, setIsAssignModal] = useState(false);
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [isSuccessModal, setIsSuccessModal] = useState(false);
    const [isErrorModal, setIsErrorModal] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);

    const [selectedCashier, setSelectedCashier] = useState("");
    const [selectedAccount, setSelectedAccount] = useState("");
    const [errors, setErrors] = useState({});

    const cashierList = useSelector((s) => s.accounting.cashierListState.data || []);
    const coaFlatList = useSelector((s) => s.accounting.coaFlatState.data || []);

    const columns = [
        {
            name: "Cashier",
            selector: (r) => [r.Fname, r.Mname, r.Lname].filter(Boolean).join(" ") || "—",
            sortable: true,
            wrap: true,
        },
        { name: "Email", selector: (r) => r.Email || "—", sortable: true, wrap: true },
        { name: "Account Code", selector: (r) => r.AccountCode || "—", sortable: true, width: "120px" },
        { name: "Account Name", selector: (r) => r.AccountName || "—", sortable: true, wrap: true },
        { name: "Account Group", selector: (r) => r.AccountGroup || "—", sortable: true },
        { name: "Normal Balance", selector: (r) => r.NormalBalance || "—", sortable: true, width: "130px" },
        {
            name: "Date Assigned",
            selector: (r) => r.DateCreated ? new Date(r.DateCreated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—",
            sortable: true,
            width: "120px",
        },
        {
            name: "Action",
            cell: (row) => (
                <button 
                    className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition" 
                    onClick={() => handleEdit(row)}
                    title="Edit Assignment"
                >
                    <Edit2 size={16} />
                </button>
            ),
            ignoreRowClick: true,
            width: "80px",
            center: true,
        },
    ];

    const fetchTable = async () => {
        setLoading(true);
        const res = await dispatch(fetchGetCoaCashierData(page, pageSize, search));
        console.log(res);
        if (res.ok) {
            setTable(res.data || []);
            setTotalRecords(res.totalRecords || 0);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTable();
    }, [page, pageSize, search]);

    const handleOpenAssign = () => {
        setSelectedCashier("");
        setSelectedAccount("");
        setErrors({});
        dispatch(fetchGetCashierListData());
        dispatch(fetchGetCoaFlatData());
        setIsAssignModal(true);
    };

    const handleEdit = (row) => {
        setSelectedCashier(row.UserId || "");
        setSelectedAccount(row.CoaChildId || "");
        setErrors({});
        dispatch(fetchGetCashierListData());
        dispatch(fetchGetCoaFlatData());
        setIsAssignModal(true);
    };

    const validate = () => {
        const e = {};
        if (!selectedCashier) e.cashier = "Please select a cashier.";
        if (!selectedAccount) e.account = "Please select a COA account.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmitAssign = () => {
        if (!validate()) return;
        setIsAssignModal(false);
        setIsConfirmModal(true);
    };

    const handleConfirm = async () => {
        setIsConfirmModal(false);
        setIsLoadingModal(true);
        const payload = {
            UserId: selectedCashier,
            CoaChildId: selectedAccount,  // Using CoaChildId since we're selecting from CoaChildTable
            CreatedByUserId: user?.UserId,
        };
        const res = await dispatch(fetchInsertCoaCashierData(payload));
        setIsLoadingModal(false);
        if (res.ok) { setIsSuccessModal(true); fetchTable(); }
        else { setIsErrorModal(true); }
    };

    const sel = (err) =>
        `w-full rounded-lg border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${err ? "border-red-500" : "border-gray-300"}`;

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-green-700">Assigned COA — Cashier Accounts</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleOpenAssign}
                        className="flex items-center gap-1 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition"
                    >
                        + Assign COA to Cashier
                    </button>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring focus:ring-green-300"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            <DataTable
                columns={columns} data={table} progressPending={loading}
                pagination paginationServer paginationTotalRows={totalRecords}
                onChangePage={(p) => setPage(p)}
                onChangeRowsPerPage={(s, p) => { setPageSize(s); setPage(p); }}
                highlightOnHover striped responsive
            />

            {/* Assign Modal */}
            <ModalComponent
                isOpen={isAssignModal}
                onClose={() => setIsAssignModal(false)}
                title="Assign COA to Cashier"
                size="w-[600px]"
                body={
                    <div className="space-y-4">
                        {/* Cashier dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cashier <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedCashier}
                                onChange={(e) => setSelectedCashier(e.target.value)}
                                className={sel(errors.cashier)}
                            >
                                <option value="">— Select Cashier —</option>
                                {cashierList.map((c) => (
                                    <option key={c.UserId} value={c.UserId}>
                                        {c.Fname} {c.Mname} {c.Lname}
                                    </option>
                                ))}
                            </select>
                            {errors.cashier && <p className="text-red-500 text-xs mt-1">{errors.cashier}</p>}
                        </div>

                        {/* COA Account dropdown (flat list) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chart of Account <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedAccount}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                                className={sel(errors.account)}
                            >
                                <option value="">— Select Account —</option>
                                {coaFlatList.map((coa) => (
                                    <option key={coa.CoaChildId} value={coa.CoaChildId}>
                                        {coa.AccountCode} - {coa.AccountName} ({coa.AccountGroup})
                                    </option>
                                ))}
                            </select>
                            {errors.account && <p className="text-red-500 text-xs mt-1">{errors.account}</p>}
                            <p className="text-xs text-gray-500 mt-1">
                                Select the account that will be used for this cashier's transactions.
                            </p>
                        </div>
                    </div>
                }
                buttons={[
                    { label: "Assign", type: "green", onClick: handleSubmitAssign },
                    { label: "Cancel", type: "red", onClick: () => setIsAssignModal(false) },
                ]}
            />

            {/* Confirm Modal */}
            <ModalComponent
                isOpen={isConfirmModal}
                onClose={() => setIsConfirmModal(false)}
                title={<span className="font-bold text-lg text-red-700">Confirm Assignment</span>}
                body="Are you sure you want to assign this COA to the selected cashier?"
                buttons={[
                    { label: "Yes, Assign", type: "green", closeOnClick: false, onClick: handleConfirm },
                    { label: "Cancel", type: "red", onClick: () => setIsConfirmModal(false) },
                ]}
            />

            {/* Loading Modal */}
            <ModalComponent
                isOpen={isLoadingModal}
                onClose={() => { }}
                title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                body={
                    <div className="flex flex-col items-center justify-center gap-3 py-2">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-gray-600">Saving assignment. Please wait.</span>
                    </div>
                }
                buttons={[]}
            />

            {/* Success Modal */}
            <ModalComponent
                isOpen={isSuccessModal}
                onClose={() => setIsSuccessModal(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body="COA has been successfully assigned to the cashier."
                buttons={[{ label: "OK", type: "green", onClick: () => setIsSuccessModal(false) }]}
            />

            {/* Error Modal */}
            <ModalComponent
                isOpen={isErrorModal}
                onClose={() => setIsErrorModal(false)}
                title={<span className="font-bold text-lg text-red-700">Error</span>}
                body="Something went wrong. Please try again."
                buttons={[{ label: "Close", type: "red", onClick: () => setIsErrorModal(false) }]}
            />
        </div>
    );
};

export default CoaCashierDataTable;
