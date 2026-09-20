import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Receipt } from "lucide-react";
import BlueBtn from "../ButtonsComponents/BlueBtn";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import {
  fetchListOfStudentTableData,
  fetchStudentPendingTransactionData,
  fetchInsertPaymentData,
  fetchSISeriesData,
  fetchGetMiscBreakdownData,
} from "../../states/ParentState/Action";
import { fetchTransactionTypeData } from "../../states/CashierState/Action";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const READONLY =
  "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed select-none focus:outline-none";

const INPUT =
  "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition bg-white text-gray-800";

// ─── Receipt panel ────────────────────────────────────────────────────────────
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

// ─── Breakdown table (reused for both Tuition and Misc) ───────────────────────
const BreakdownTable = ({ title, color = "green", rows, columns, emptyMsg }) => {
  const colorMap = {
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50  border-blue-200  text-blue-700",
  };
  return (
    <div className={`border rounded-xl overflow-hidden ${colorMap[color].split(" ").slice(0, 2).join(" ")}`}>
      <div className={`px-3 py-2 text-xs font-bold uppercase tracking-wide ${colorMap[color]}`}>
        {title}
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-gray-400 italic px-3 py-3">{emptyMsg}</p>
      ) : (
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-t border-gray-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 ${col.right ? "text-right" : ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                {columns.map((col) => (
                  <td key={col.key} className={`px-3 py-2 text-gray-700 ${col.right ? "text-right font-medium" : ""}`}>
                    {col.render ? col.render(row) : row[col.key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ─── Receipt items list with expandable misc group ───────────────────────────
const MiscExpandableReceiptList = ({ transactions, onRemove }) => {
  const [miscOpen, setMiscOpen] = useState(false);

  const miscItems = transactions.map((t, i) => ({ ...t, _idx: i })).filter((t) => t.label === "Miscellaneous");
  const nonMiscItems = transactions.map((t, i) => ({ ...t, _idx: i })).filter((t) => t.label !== "Miscellaneous");
  const miscTotal = miscItems.reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">
        Receipt Items ({transactions.length})
      </h3>
      <div className="space-y-2">

        {/* Non-misc items — normal cards with delete */}
        {nonMiscItems.map((t) => (
          <div key={t._idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm shadow-sm">
            <div>
              <p className="font-semibold text-gray-800">{t.label}</p>
              {t.planName && <p className="text-xs text-gray-400">{t.planName}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">₱{fmt(t.amount)}</span>
              <button onClick={() => onRemove(t._idx)} className="text-red-400 hover:text-red-600 transition">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {/* Misc group — collapsible */}
        {miscItems.length > 0 && (
          <div className="border border-blue-200 rounded-lg overflow-hidden shadow-sm">
            {/* Header row — click to expand */}
            <button
              type="button"
              onClick={() => setMiscOpen((v) => !v)}
              className="w-full flex items-center justify-between bg-blue-50 px-4 py-2.5 text-sm hover:bg-blue-100 transition"
            >
              <div className="flex items-center gap-2">
                <span className={`transition-transform duration-200 text-blue-500 ${miscOpen ? "rotate-90" : ""}`}>▶</span>
                <span className="font-semibold text-blue-700">Miscellaneous Fees</span>
                <span className="text-xs text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">
                  {miscItems.length} items
                </span>
              </div>
              <span className="font-bold text-blue-700">₱{fmt(miscTotal)}</span>
            </button>

            {/* Expanded lines */}
            {miscOpen && (
              <div className="divide-y divide-gray-100">
                {miscItems.map((t) => (
                  <div key={t._idx} className="flex items-center justify-between bg-white px-4 py-2 text-xs">
                    <span className="text-gray-600">{t.planName || t.label}</span>
                    <span className="font-medium text-gray-800">₱{fmt(t.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Payment modal body ───────────────────────────────────────────────────────
const PaymentModalBody = ({
  studentRow, transTypeOptions, pendingTransactions, pendingLoading,
  orNumberData, transactions, onAdd, onRemove,
  miscBreakdown, miscLoading, dispatch,
}) => {


  console.log(studentRow);
  const levelId = studentRow.LevelId;
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [assessmentAmount, setAssessmentAmount] = useState("");
  const [selectedExtraType, setSelectedExtraType] = useState(null);
  const [extraAmount, setExtraAmount] = useState("");
  const [extraError, setExtraError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [installmentRows, setInstallmentRows] = useState([]);

  const pendingList = Array.isArray(pendingTransactions) ? pendingTransactions : [];
  const miscRows = Array.isArray(miscBreakdown) ? miscBreakdown : [];
  const isAssessment = pendingList.some((t) => t.TransType === "Assessment Plan");
  const isTuitionFee = pendingList.some((t) => t.TransType === "Tuition Fee");

  // Unique plan options
  const planOptions = isAssessment
    ? [...new Map(pendingList.map((t) => [t.TuitionChildId, {
      value: t.TuitionChildId,
      label: t.PlanName,
      planId: t.PlanId,
      levelId: t.LevelId,
    }])).values()]
    : [];

  // When plan is selected — load installment schedule + misc breakdown
  useEffect(() => {
    if (selectedPlan) {
      const rows = pendingList.filter((t) => t.TuitionChildId === selectedPlan.value);
      setInstallmentRows(rows);
      setAssessmentAmount(rows[0]?.Amount || "");
      dispatch(fetchGetMiscBreakdownData(levelId));
      // if (selectedPlan.levelId) {
      //   dispatch(fetchGetMiscBreakdownData(levelId));
      // }
    } else {
      setInstallmentRows([]);
      setAssessmentAmount("");
    }
  }, [selectedPlan]);

  // Extra transaction types — exclude main enrollment ones
  const extraTypeOptions = Array.isArray(transTypeOptions)
    ? transTypeOptions.filter((t) =>
      !["Assessment Plan", "Tuition Fee", "Test Permit", "Enlistment Fee"].includes(t.label)
    )
    : [];

  const handleAddExtra = () => {
    setExtraError("");
    if (!selectedExtraType) { setExtraError("Please select a transaction type."); return; }
    if (!extraAmount || Number(extraAmount) <= 0) { setExtraError("Please enter a valid amount."); return; }
    onAdd({ typeId: selectedExtraType.value, label: selectedExtraType.label, planName: "", tuitionChildId: null, planId: null, amount: Number(extraAmount) });
    setSelectedExtraType(null);
    setExtraAmount("");
    setExtraError("");
    setShowAddForm(false);
  };

  const handleAddAssessment = () => {
    if (!selectedPlan || !assessmentAmount || Number(assessmentAmount) <= 0) return;

    // Always add tuition fee 1st payment (rows[0] = 1st installment regardless of plan)
    onAdd({
      typeId: null,
      label: "Assessment Plan",
      planName: selectedPlan.label,
      tuitionChildId: selectedPlan.value,
      planId: installmentRows[0]?.PlanId || null,
      amount: Number(assessmentAmount),
    });

    // Also add each miscellaneous fee as a separate receipt line
    if (Array.isArray(miscBreakdown) && miscBreakdown.length > 0) {
      miscBreakdown.forEach((m) => {
        if (Number(m.Amount || 0) > 0) {
          onAdd({
            typeId:         null,
            label:          "Miscellaneous",
            planName:       m.FeeName     || "",
            tuitionChildId: null,
            planId:         null,
            miscId:         m.MiscId      ?? null,
            miscChildId:    m.MiscChildId ?? null,
            amount:         Number(m.Amount),
          });
        }
      });
    }

    setSelectedPlan(null);
    setAssessmentAmount("");
    setInstallmentRows([]);
  };

  // Tuition fee total (for Y status)
  const tuitionFeeItem = pendingList.find((t) => t.TransType === "Tuition Fee");

  // For assessment plan: always use 1st installment amount for the summary
  const firstInstallmentAmount = Number(installmentRows[0]?.Amount || 0);

  // Total fees summary (tuition + misc)
  const miscTotal = miscRows.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const tuitionTotal = isTuitionFee
    ? Number(tuitionFeeItem?.Amount || 0)   // Y status: next unpaid installment
    : firstInstallmentAmount;               // O-RESERVED: 1st payment of selected plan
  const grandTotal = tuitionTotal + miscTotal;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">

        {/* Student info */}
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

        {/* Current transaction */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">Current Transaction</h3>

          {pendingLoading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : pendingList.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No pending transactions found.</p>

          ) : isAssessment ? (
            // ── Assessment Plan ──
            <div className="space-y-4">
              {/* Plan picker */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Choose a Tuition Plan</label>
                <SearchableSelect
                  options={planOptions}
                  value={selectedPlan}
                  onChange={(v) => setSelectedPlan(v)}
                  placeholder="— Select a tuition plan —"
                />
              </div>

              {selectedPlan && (
                <>
                  {/* Tuition fee installment breakdown */}
                  {installmentRows.length > 0 && (
                    <BreakdownTable
                      title="Tuition Fee — Payment Schedule"
                      color="green"
                      rows={installmentRows}
                      columns={[
                        { key: "NumberOfPayment", label: "Payment" },
                        { key: "Amount", label: "Amount", right: true, render: (r) => `₱${fmt(r.Amount)}` },
                        { key: "DateOfPayment", label: "Due Date", render: (r) => r.DateOfPayment ? new Date(r.DateOfPayment).toLocaleDateString() : "—" },
                      ]}
                      emptyMsg="No installment schedule found."
                    />
                  )}

                  {/* Miscellaneous fee breakdown */}
                  <div>
                    <BreakdownTable
                      title="Miscellaneous Fees Breakdown"
                      color="blue"
                      rows={miscLoading ? [] : miscRows}
                      columns={[
                        { key: "FeeName", label: "Fee Item" },
                        { key: "Amount", label: "Amount", right: true, render: (r) => `₱${fmt(r.Amount)}` },
                      ]}
                      emptyMsg={miscLoading ? "Loading miscellaneous fees..." : "No miscellaneous fees found."}
                    />
                    {miscLoading && (
                      <div className="h-10 bg-gray-100 animate-pulse rounded-lg mt-1" />
                    )}
                  </div>

                  {/* Total summary */}
                  {(tuitionTotal > 0 || miscTotal > 0) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>
                          {selectedPlan?.label === "PLAN A"
                            ? "Tuition Fee (Full Payment)"
                            : "Tuition Fee (1st Payment)"}
                        </span>
                        <span className="font-medium">₱{fmt(tuitionTotal)}</span>
                      </div>
                      {miscTotal > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Miscellaneous Total ({miscRows.length} items)</span>
                          <span className="font-medium">₱{fmt(miscTotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-900 font-bold border-t border-gray-200 pt-1.5">
                        <span>Grand Total</span>
                        <span className="text-green-700">₱{fmt(grandTotal)}</span>
                      </div>
                    </div>
                  )}

                  {/* Down payment input */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      {selectedPlan?.label === "PLAN A" ? "Payment Amount" : "1st Payment Amount"}
                    </label>
                    <input type="number" min="0" step="0.01"
                      className={INPUT} value={assessmentAmount}
                      onChange={(e) => setAssessmentAmount(e.target.value)} />
                    <p className="text-xs text-gray-400 mt-1">
                      {miscTotal > 0
                        ? `Miscellaneous fees (₱${fmt(miscTotal)}) will be added automatically.`
                        : "No miscellaneous fees for this level."}
                    </p>
                  </div>

                  <button type="button" onClick={handleAddAssessment}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition">
                    <Plus size={15} /> Add Plan to Receipt
                  </button>
                </>
              )}
            </div>

          ) : isTuitionFee ? (
            // ── Tuition Fee (Y status) — show breakdown + misc ──
            <div className="space-y-4">
              {/* Tuition fee item */}
              {tuitionFeeItem && (
                <BreakdownTable
                  title="Tuition Fee — Next Installment"
                  color="green"
                  rows={[tuitionFeeItem]}
                  columns={[
                    { key: "PlanName", label: "Plan" },
                    { key: "NumberOfPayment", label: "Payment No." },
                    { key: "Amount", label: "Amount", right: true, render: (r) => `₱${fmt(r.Amount)}` },
                    { key: "DateOfPayment", label: "Due Date", render: (r) => r.DateOfPayment ? new Date(r.DateOfPayment).toLocaleDateString() : "—" },
                  ]}
                  emptyMsg="No tuition fee data found."
                />
              )}

              {/* Misc breakdown */}
              {miscRows.length > 0 && (
                <BreakdownTable
                  title="Miscellaneous Fees Breakdown"
                  color="blue"
                  rows={miscRows}
                  columns={[
                    { key: "FeeName", label: "Fee Item" },
                    { key: "Amount", label: "Amount", right: true, render: (r) => `₱${fmt(r.Amount)}` },
                  ]}
                  emptyMsg="No miscellaneous fees found."
                />
              )}

              {/* Grand total */}
              {(tuitionTotal > 0 || miscTotal > 0) && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tuition Fee</span>
                    <span className="font-medium">₱{fmt(tuitionTotal)}</span>
                  </div>
                  {miscTotal > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Miscellaneous Total</span>
                      <span className="font-medium">₱{fmt(miscTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1.5">
                    <span>Total Due</span>
                    <span className="text-green-700">₱{fmt(grandTotal)}</span>
                  </div>
                </div>
              )}

              {/* Quick add button */}
              <div className="space-y-2">
                {pendingList.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{item.TransType}</p>
                      {item.PlanName && <p className="text-xs text-gray-400">{item.PlanName}</p>}
                      {item.NumberOfPayment && <p className="text-xs text-gray-400">{item.NumberOfPayment}</p>}
                      {item.DateOfPayment && <p className="text-xs text-gray-400">Due: {new Date(item.DateOfPayment).toLocaleDateString()}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-700">₱{fmt(item.Amount)}</span>
                      <button type="button"
                        onClick={() => onAdd({ typeId: null, label: item.TransType, planName: item.PlanName || "", tuitionChildId: item.TuitionChildId || null, planId: item.PlanId || null, amount: Number(item.Amount || 0) })}
                        className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md transition">
                        <Plus size={12} /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          ) : (
            // ── Test Permit / Enlistment Fee ──
            <div className="space-y-2">
              {pendingList.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">{item.TransType}</p>
                    {item.PlanName && <p className="text-xs text-gray-400">{item.PlanName}</p>}
                    {item.NumberOfPayment && <p className="text-xs text-gray-400">{item.NumberOfPayment}</p>}
                    {item.DateOfPayment && <p className="text-xs text-gray-400">Due: {new Date(item.DateOfPayment).toLocaleDateString()}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-700">₱{fmt(item.Amount)}</span>
                    <button type="button"
                      onClick={() => onAdd({ typeId: null, label: item.TransType, planName: item.PlanName || "", tuitionChildId: item.TuitionChildId || null, planId: item.PlanId || null, amount: Number(item.Amount || 0) })}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md transition">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional extras */}
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
          <MiscExpandableReceiptList
            transactions={transactions}
            onRemove={onRemove}
          />
        )}
      </div>

      {/* Receipt panel */}
      <div className="lg:col-span-2">
        <ReceiptPanel studentRow={studentRow} transactions={transactions} orNumber={orNumberData?.LatestOrNumber} />
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const PendingListOfStudent = ({ type, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableState = useSelector((s) => s.parent.tableState);
  const totalRows = tableState.data?.totalRecords || 0;
  const tableLoading = tableState.loading || false;
  const orNumberData = useSelector((s) => s.parent.siSeriesState.data || {});
  const pendingTransactions = useSelector((s) => s.parent.studentPendingTransactionState.data || []);
  const pendingLoading = useSelector((s) => s.parent.studentPendingTransactionState.loading || false);
  const miscBreakdown = useSelector((s) => s.parent.miscBreakdownState?.data || []);
  const miscLoading = useSelector((s) => s.parent.miscBreakdownState?.loading || false);
  const transTypeRaw = useSelector((s) => s.cashier.transactionTypeState.data || []);
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
  const miscTransaction = transactions.find((t) => t.label === "Miscellaneous");
  console.log(miscTransaction);
  const handleConfirmSubmit = async () => {
    if (!selectedRow || transactions.length === 0) return;
    setIsSubmitting(true);
    const miscTransaction = transactions.find((t) => t.label === "Miscellaneous");
    const payload = {
      UserId:          selectedRow.StudentId,
      CreatedByUserId: userId,
      OrId:            orNumberData?.OrId    || 0,
      ReferenceId:     selectedRow.AppId     || 0,
      ReferenceNo:     selectedRow.AppNumber || "",
      MiscId:          miscTransaction?.miscId      ?? null,
      // MiscChildId:     miscTransaction?.miscChildId ?? null,
      TransType:       "Assessment Plan",
      PaymentChildDtos: transactions.map((t) => ({
        OrChildId:      orNumberData?.OrChildId      || 0,
        OrNumberUsed:   orNumberData?.LatestOrNumber || "",
        TuitionChildId: t.tuitionChildId,
        PlanId:         t.planId,
        Amount: String(t.amount),
        AmountPaid: String(t.amount),
        FromTransaction: t.label,
        ModeOfPayment: "Online",
      })),
    };
    console.log(payload);
    // const res = await dispatch(fetchInsertPaymentData(payload));
    // setIsSubmitting(false);
    // if (res.ok) {
    //   setIsConfirmOpen(false);
    //   setIsPaymentOpen(false);
    //   setTransactions([]);
    //   setSelectedRow(null);
    //   setIsSuccessOpen(true);
    //   setTimeout(() => fetchTableData(), 2000);
    // }
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

      {/* Payment Modal */}
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
            miscBreakdown={miscBreakdown}
            miscLoading={miscLoading}
            dispatch={dispatch}
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

      {/* Confirm Modal */}
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

      {/* Success Modal */}
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
