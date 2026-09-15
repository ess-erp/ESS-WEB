import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Receipt, CheckCircle } from "lucide-react";
import BlueBtn from "../ButtonsComponents/BlueBtn";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import {
  fetchListOfStudentTableData,
  // fetchStudentOrNumberData,
  fetchStudentPendingTransactionData,
  fetchInsertPaymentData,
  fetchSISeriesData,
} from "../../states/ParentState/Action";
import { fetchTransactionTypeData } from "../../states/CashierState/Action";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const READONLY =
  "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed select-none focus:outline-none";

const INPUT =
  "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition bg-white text-gray-800";

// Receipt panel
const ReceiptPanel = ({ studentRow, transactions, orNumber }) => {
  const total = transactions.reduce((s, t) => s + t.amount, 0);
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-5 font-mono text-sm sticky top-0">
      <div className="text-center mb-4">
        <Receipt className="mx-auto mb-1 text-green-600" size={28} />
        <p className="font-bold text-base text-gray-800 uppercase tracking-widest">Online Payment</p>
        <p className="text-xs text-gray-400">Receipt Preview</p>
      </div>
      <div className="border-t border-b border-dashed border-gray-200 py-3 mb-3 space-y-1 text-xs text-gray-600">
        <div className="flex justify-between">
          <span className="text-gray-400">Student</span>
          <span className="font-semibold text-right max-w-[60%] break-words">
            {studentRow ? `${studentRow.Lname}, ${studentRow.Fname} ${studentRow.Mname || ""}`.trim() : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">App No.</span>
          <span className="font-semibold">{studentRow?.AppNumber || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">OR No.</span>
          <span className="font-semibold">{orNumber || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Date</span>
          <span className="font-semibold">{new Date().toLocaleDateString("en-PH")}</span>
        </div>
      </div>
      {transactions.length === 0 ? (
        <p className="text-center text-xs text-gray-300 py-6 italic">No transactions added yet</p>
      ) : (
        <div className="space-y-2 mb-3">
          {transactions.map((t, i) => (
            <div key={i} className="flex justify-between items-start text-xs">
              <div className="max-w-[65%]">
                <p className="font-semibold text-gray-700">{t.label}</p>
                {t.planName && <p className="text-gray-400">{t.planName}</p>}
              </div>
              <span className="font-semibold text-gray-800">₱{fmt(t.amount)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="border-t border-dashed border-gray-200 pt-3">
        <div className="flex justify-between text-sm font-bold text-gray-900">
          <span>TOTAL</span>
          <span className="text-green-700">₱{fmt(total)}</span>
        </div>
      </div>
      <p className="text-center text-[10px] text-gray-300 mt-4 italic">
        This is a preview — not an official receipt.
      </p>
    </div>
  );
};

// Payment modal body
const PaymentModalBody = ({
  studentRow, transTypeOptions, pendingTransactions, pendingLoading,
  orNumberData, transactions, onAdd, onRemove,
}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [assessmentAmount, setAssessmentAmount] = useState("");
  const [selectedExtraType, setSelectedExtraType] = useState(null);
  const [extraAmount, setExtraAmount] = useState("");
  const [extraError, setExtraError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [installmentSchedule, setInstallmentSchedule] = useState([]);

  const pendingList = Array.isArray(pendingTransactions) ? pendingTransactions : [];
  const isAssessmentPlan = pendingList.some((t) => t.TransType === "Assessment Plan");

  // Unique plans from pending data
  const planOptions = isAssessmentPlan
    ? [...new Map(pendingList.map((t) => [t.TuitionChildId, {
      value: t.TuitionChildId,
      label: t.PlanName,
      planId: t.PlanId,
    }])).values()]
    : [];

  // When plan selected, show its installment rows and prefill first amount
  useEffect(() => {
    if (selectedPlan) {
      const rows = pendingList.filter((t) => t.TuitionChildId === selectedPlan.value);
      setInstallmentSchedule(rows);
      setAssessmentAmount(rows[0]?.Amount || "");
    } else {
      setInstallmentSchedule([]);
      setAssessmentAmount("");
    }
  }, [selectedPlan]);

  // Extra transaction types — exclude ones that come from the API
  const extraTypeOptions = Array.isArray(transTypeOptions)
    ? transTypeOptions.filter((t) =>
      !["Assessment Plan", "Tuition Fee", "Test Permit", "Enlistment Fee"].includes(t.label)
    )
    : [];

  const handleAddExtra = () => {
    setExtraError("");
    if (!selectedExtraType) { setExtraError("Please select a transaction type."); return; }
    if (!extraAmount || Number(extraAmount) <= 0) { setExtraError("Please enter a valid amount."); return; }
    onAdd({
      typeId: selectedExtraType.value,
      label: selectedExtraType.label,
      planName: "",
      tuitionChildId: null,
      planId: null,
      amount: Number(extraAmount),
    });
    setSelectedExtraType(null);
    setExtraAmount("");
    setExtraError("");
    setShowAddForm(false);
  };

  const handleAddAssessment = () => {
    if (!selectedPlan || !assessmentAmount || Number(assessmentAmount) <= 0) return;
    onAdd({
      typeId: null,
      label: "Assessment Plan",
      planName: selectedPlan.label,
      tuitionChildId: selectedPlan.value,
      planId: installmentSchedule[0]?.PlanId || null,
      amount: Number(assessmentAmount),
    });
    setSelectedPlan(null);
    setAssessmentAmount("");
    setInstallmentSchedule([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">

        {/* Student info strip */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Student Name</label>
            <input readOnly className={READONLY}
              value={studentRow ? `${studentRow.Lname}, ${studentRow.Fname} ${studentRow.Mname || ""}`.trim() : ""} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">App Number</label>
            <input readOnly className={READONLY} value={studentRow?.AppNumber || ""} />
          </div>
        </div>

        {/* Current transaction from API */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">Current Transaction</h3>

          {pendingLoading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : pendingList.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No pending transactions found.</p>
          ) : isAssessmentPlan ? (
            // Assessment Plan — plan picker + installment table
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Choose a Plan</label>
                <SearchableSelect
                  options={planOptions}
                  value={selectedPlan}
                  onChange={(v) => setSelectedPlan(v)}
                  placeholder="— Select a tuition plan —"
                />
              </div>

              {installmentSchedule.length > 0 && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Payment", "Amount", "Due Date"].map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {installmentSchedule.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                          <td className="px-3 py-2 text-gray-700">{row.NumberOfPayment}</td>
                          <td className="px-3 py-2 font-medium text-gray-800">₱{fmt(row.Amount)}</td>
                          <td className="px-3 py-2 text-gray-500">
                            {row.DateOfPayment ? new Date(row.DateOfPayment).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedPlan && (
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Down Payment Amount</label>
                  <input type="number" min="0" step="0.01"
                    className={INPUT} value={assessmentAmount}
                    onChange={(e) => setAssessmentAmount(e.target.value)} />
                </div>
              )}

              {selectedPlan && (
                <button type="button" onClick={handleAddAssessment}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition">
                  <Plus size={15} /> Add Plan to Receipt
                </button>
              )}
            </div>
          ) : (
            // Test Permit / Enlistment Fee / Tuition Fee — quick Add button per item
            <div className="space-y-2">
              {pendingList.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">{item.TransType}</p>
                    {item.PlanName && <p className="text-xs text-gray-400">{item.PlanName}</p>}
                    {item.NumberOfPayment && <p className="text-xs text-gray-400">{item.NumberOfPayment}</p>}
                    {item.DateOfPayment && (
                      <p className="text-xs text-gray-400">Due: {new Date(item.DateOfPayment).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-700">₱{fmt(item.Amount)}</span>
                    <button type="button"
                      onClick={() => onAdd({
                        typeId: null,
                        label: item.TransType,
                        planName: item.PlanName || "",
                        tuitionChildId: item.TuitionChildId || null,
                        planId: item.PlanId || null,
                        amount: Number(item.Amount || 0),
                      })}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md transition">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional extras (books, uniform, etc.) */}
        <div>
          <button type="button" onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition">
            <Plus size={15} />
            {showAddForm ? "Hide extra transaction" : "Add other payment (books, uniform, etc.)"}
          </button>

          {showAddForm && (
            <div className="mt-3 space-y-3 border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Transaction Type</label>
                {extraTypeOptions.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    No additional transaction types available yet. Add Books, Uniforms, or ID in the Accounting module first.
                  </p>
                ) : (
                  <SearchableSelect
                    options={extraTypeOptions}
                    value={selectedExtraType}
                    onChange={(v) => { setSelectedExtraType(v); setExtraAmount(v?.amount || ""); setExtraError(""); }}
                    placeholder="— Select type (Books, Uniform, ID, etc.) —"
                  />
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Amount</label>
                <input type="number" min="0" step="0.01" placeholder="Enter amount"
                  className={INPUT} value={extraAmount} onChange={(e) => setExtraAmount(e.target.value)} />
              </div>
              {extraError && <p className="text-xs text-red-500">{extraError}</p>}
              <button type="button" onClick={handleAddExtra}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                <Plus size={15} /> Add to Receipt
              </button>
            </div>
          )}
        </div>

        {/* Added transactions list */}
        {transactions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">
              Receipt Items ({transactions.length})
            </h3>
            <div className="space-y-2">
              {transactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm shadow-sm">
                  <div>
                    <p className="font-semibold text-gray-800">{t.label}</p>
                    {t.planName && <p className="text-xs text-gray-400">{t.planName}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">₱{fmt(t.amount)}</span>
                    <button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Receipt panel */}
      <div className="lg:col-span-2">
        <ReceiptPanel studentRow={studentRow} transactions={transactions} orNumber={orNumberData?.LatestOrNumber} />
      </div>
    </div>
  );
};
// Main component
const PendingListOfStudent = ({ type, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableState = useSelector((state) => state.parent.tableState);
  const totalRows = tableState.data?.totalRecords || 0;
  const tableLoading = tableState.loading || false;
  const orNumberData = useSelector((state) => state.parent.siSeriesState.data || {});
  const pendingTransactions = useSelector((state) => state.parent.studentPendingTransactionState.data || []);
  const pendingLoading = useSelector((state) => state.parent.studentPendingTransactionState.loading || false);
  const transTypeRaw = useSelector((state) => state.cashier.transactionTypeState.data || []);
  const transTypeOptions = Array.isArray(transTypeRaw)
    ? transTypeRaw.map((t) => ({ value: t.FeeChildId, label: t.TransType, amount: t.Value }))
    : [];

  const [table, setTable] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = transactions.reduce((s, t) => s + t.amount, 0);

  const columns = [
    { name: "Application Number", selector: (r) => r.AppNumber, sortable: true },
    { name: "Fullname", selector: (r) => `${r.Lname}, ${r.Fname} ${r.Mname || ""}`, sortable: true },
    { name: "Campus", selector: (r) => r.CampusName, sortable: true },
    { name: "Level", selector: (r) => r.LevelName, sortable: true },
    { name: "Status", selector: (r) => r.ActiveStatus, sortable: true },
    { name: "Date Created", selector: (r) => new Date(r.DateCreated).toLocaleDateString(), sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1 whitespace-nowrap">
          <BlueBtn label="View" onClick={() => navigate(`/parent/pendingliststudentform?StudentId=${row.StudentId}`)} />
          {["O-EXAMINATION-CASHIER", "O-RESERVATION", "O-RESERVED", "Y"].includes(row.ActiveStatus) && (
            <GreenBtn label="Payment" onClick={() => handleOpenPayment(row)} />
          )}
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  useEffect(() => {
    if (userId) fetchTableData();
  }, [userId, type, page, pageSize, search]);

  useEffect(() => {
    if (userId) {
      // dispatch(fetchStudentOrNumberData(userId));
      dispatch(fetchSISeriesData(userId));
      dispatch(fetchTransactionTypeData());
    }
  }, [userId, dispatch]);

  const fetchTableData = async () => {
    const res = await dispatch(fetchListOfStudentTableData(userId, type, page, pageSize, search));
    setTable(res?.data || []);
  };

  const handleOpenPayment = (row) => {
    setSelectedRow(row);
    setTransactions([]);
    dispatch(fetchStudentPendingTransactionData(row.AppId));
    setIsPaymentOpen(true);
  };

  const handleAddTransaction = (t) => setTransactions((prev) => [...prev, t]);
  const handleRemoveTransaction = (i) => setTransactions((prev) => prev.filter((_, idx) => idx !== i));

  const handleConfirmSubmit = async () => {
    console.log(orNumberData);

    if (!selectedRow || transactions.length === 0) return;
    setIsSubmitting(true);
    const payload = {
      UserId: selectedRow.StudentId,
      CreatedByUserId: userId,
      OrId: orNumberData?.OrId || 0,
      ReferenceId: selectedRow.AppId || 0,
      ReferenceNo: selectedRow.AppNumber || "",
      TransType: "Online",
      PaymentChildDtos: transactions.map((t) => ({
        OrChildId: orNumberData?.OrChildId || 0,
        OrNumberUsed: orNumberData?.LatestOrNumber || "",
        TuitionChildId: t.tuitionChildId,
        PlanId: t.planId,
        Amount: String(t.amount),
        AmountPaid: String(t.amount),
        FromTransaction: t.label,
        ModeOfPayment: "Online",
      })),
    };

    console.log(payload);
    const res = await dispatch(fetchInsertPaymentData(payload));
    setIsSubmitting(false);
    if (res.ok) {
      setIsConfirmOpen(false);
      setIsPaymentOpen(false);
      setTransactions([]);
      setSelectedRow(null);
      setIsSuccessOpen(true);
      setTimeout(() => fetchTableData(), 2000);
    }
  };

  return (
    <div className="overflow-x-auto pt-2">
      <div className="p-6 bg-white rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-green-500">List of Pending in Enrollment</h2>
          <input type="text" placeholder="Search..."
            className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={"Pending" + page + search}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
            <DataTable columns={columns} data={table} progressPending={tableLoading}
              pagination paginationServer paginationTotalRows={totalRows}
              paginationDefaultPage={page}
              onChangePage={(p) => setPage(p)}
              onChangeRowsPerPage={(newPerPage, p) => { setPageSize(newPerPage); setPage(p); }}
              highlightOnHover responsive />
          </motion.div>
        </AnimatePresence>
      </div>

      <ModalComponent
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title="Online Payment"
        size="w-[95vw] max-w-5xl"
        maxHeight="90vh"
        body={
          <PaymentModalBody
            studentRow={selectedRow}
            transTypeOptions={transTypeOptions}
            pendingTransactions={pendingTransactions}
            pendingLoading={pendingLoading}
            orNumberData={orNumberData}
            transactions={transactions}
            onAdd={handleAddTransaction}
            onRemove={handleRemoveTransaction}
          />
        }
        buttons={[
          {
            label: transactions.length === 0 ? "Add transactions above" : `Submit Payment — ₱${fmt(totalAmount)}`,
            type: "green",
            closeOnClick: false,
            onClick: () => { if (transactions.length > 0) setIsConfirmOpen(true); },
          },
          { label: "Cancel", type: "red", onClick: () => setIsPaymentOpen(false) },
        ]}
      />

      <ModalComponent
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm Payment"
        body={
          <div className="space-y-2 text-sm text-gray-700">
            <p>You are about to submit <strong>{transactions.length}</strong> transaction(s) totalling <strong className="text-green-700">₱{fmt(totalAmount)}</strong>.</p>
            <p className="text-xs text-gray-400">This action cannot be undone.</p>
          </div>
        }
        buttons={[
          { label: isSubmitting ? "Submitting…" : "Yes, Submit", type: "green", closeOnClick: false, onClick: handleConfirmSubmit },
          { label: "Cancel", type: "red", onClick: () => setIsConfirmOpen(false) },
        ]}
      />

      <ModalComponent
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Payment Submitted"
        body="Your payment has been submitted successfully. The table will refresh shortly."
        buttons={[{ label: "OK", type: "green", onClick: () => setIsSuccessOpen(false) }]}
      />
    </div>
  );
};

export default PendingListOfStudent;