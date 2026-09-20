import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Eye } from "lucide-react";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchGetCoaCashierData,
    fetchInsertCoaCashierData,
    fetchGetCoaHeaderData,
    fetchGetCoaGroupData,
    fetchGetCoaAccountData,
    fetchGetCashierListData,
} from "../../states/AccountingState/Action";

const CoaCashierDataTable = () => {
    const dispatch = useDispatch();
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [table,        setTable]        = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading,      setLoading]      = useState(false);
    const [page,         setPage]         = useState(1);
    const [pageSize,     setPageSize]     = useState(10);
    const [search,       setSearch]       = useState("");

    const [isAssignModal,  setIsAssignModal]  = useState(false);
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [isSuccessModal, setIsSuccessModal] = useState(false);
    const [isErrorModal,   setIsErrorModal]   = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);

    const [selectedCashier, setSelectedCashier] = useState("");
    const [selectedHeader,  setSelectedHeader]  = useState("");
    const [selectedGroup,   setSelectedGroup]   = useState("");
    const [selectedAccount, setSelectedAccount] = useState("");
    const [errors,          setErrors]          = useState({});

    const cashierList = useSelector((s) => s.accounting.cashierListState.data || []);
    const coaHeaders  = useSelector((s) => s.accounting.coaHeaderState.data   || []);
    const coaGroups   = useSelector((s) => s.accounting.coaGroupState.data    || []);
    const coaAccounts = useSelector((s) => s.accounting.coaAccountState.data  || []);

    const columns = [
        { name: "Cashier",       selector: (r) => r.CashierName   || "—", sortable: true },
        { name: "Account Code",  selector: (r) => r.AccountCode   || "—", sortable: true },
        { name: "Account Name",  selector: (r) => r.AccountName   || "—", sortable: true, wrap: true },
        { name: "Account Group", selector: (r) => r.AccountGroup  || "—", sortable: true },
        { name: "Header",        selector: (r) => r.HeaderName    || "—", sortable: true },
        { name: "Normal Balance",selector: (r) => r.NormalBalance || "—", sortable: true },
        {
            name: "Date Assigned",
            selector: (r) => r.DateCreated ? new Date(r.DateCreated).toLocaleDateString() : "—",
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => console.log("view", row)}>
                    <Eye size={18} />
                </button>
            ),
            ignoreRowClick: true,
            width: "80px",
        },
    ];

    const fetchTable = async () => {
        setLoading(true);
        const res = await dispatch(fetchGetCoaCashierData(page, pageSize, search));
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
        setSelectedCashier(""); setSelectedHeader("");
        setSelectedGroup("");   setSelectedAccount("");
        setErrors({});
        dispatch(fetchGetCashierListData());
        dispatch(fetchGetCoaHeaderData());
        setIsAssignModal(true);
    };

    const handleHeaderChange = (id) => {
        setSelectedHeader(id); setSelectedGroup(""); setSelectedAccount("");
        if (id) dispatch(fetchGetCoaGroupData(id));
    };

    const handleGroupChange = (id) => {
        setSelectedGroup(id); setSelectedAccount("");
        if (id) dispatch(fetchGetCoaAccountData(id));
    };

    const validate = () => {
        const e = {};
        if (!selectedCashier) e.cashier = "Please select a cashier.";
        if (!selectedHeader)  e.header  = "Please select a COA header.";
        if (!selectedGroup)   e.group   = "Please select a COA group.";
        if (!selectedAccount) e.account = "Please select an account name.";
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
            UserId:          selectedCashier,
            CoaId:           selectedAccount,
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
                size="w-[520px]"
                maxHeight="100vh"
                body={
                    <div className="space-y-5 py-1">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cashier <span className="text-red-500">*</span>
                            </label>
                            <select value={selectedCashier} onChange={(e) => setSelectedCashier(e.target.value)} className={sel(errors.cashier)}>
                                <option value="">— Select Cashier —</option>
                                {Array.isArray(cashierList) && cashierList.map((c) => (
                                    <option key={c.UserId} value={c.UserId}>
                                        {`${c.Fname || ""} ${c.Mname || ""} ${c.Lname || ""}`.replace(/\s+/g, " ").trim()}
                                    </option>
                                ))}
                            </select>
                            {errors.cashier && <p className="text-red-500 text-xs mt-1">{errors.cashier}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                COA Header <span className="text-red-500">*</span>
                            </label>
                            <select value={selectedHeader} onChange={(e) => handleHeaderChange(e.target.value)} className={sel(errors.header)}>
                                <option value="">— Select Header —</option>
                                {Array.isArray(coaHeaders) && coaHeaders.map((h) => (
                                    <option key={h.CoaId} value={h.CoaId}>{h.AccountName}</option>
                                ))}
                            </select>
                            {errors.header && <p className="text-red-500 text-xs mt-1">{errors.header}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Group <span className="text-red-500">*</span>
                            </label>
                            <select value={selectedGroup} onChange={(e) => handleGroupChange(e.target.value)} disabled={!selectedHeader} className={sel(errors.group)}>
                                <option value="">— Select Group —</option>
                                {Array.isArray(coaGroups) && coaGroups.map((g) => (
                                    <option key={g.CoaId} value={g.CoaId}>{g.AccountName}</option>
                                ))}
                            </select>
                            {errors.group && <p className="text-red-500 text-xs mt-1">{errors.group}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Name <span className="text-red-500">*</span>
                            </label>
                            <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} disabled={!selectedGroup} className={sel(errors.account)}>
                                <option value="">— Select Account Name —</option>
                                {Array.isArray(coaAccounts) && coaAccounts.map((a) => (
                                    <option key={a.CoaId} value={a.CoaId}>{a.AccountCode} — {a.AccountName}</option>
                                ))}
                            </select>
                            {errors.account && <p className="text-red-500 text-xs mt-1">{errors.account}</p>}
                        </div>
                    </div>
                }
                buttons={[
                    { label: "Assign", type: "green", closeOnClick: false, onClick: handleSubmitAssign },
                    { label: "Cancel", type: "red",   onClick: () => setIsAssignModal(false) },
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
                    { label: "Cancel",      type: "red",   onClick: () => setIsConfirmModal(false) },
                ]}
            />

            {/* Loading Modal */}
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
