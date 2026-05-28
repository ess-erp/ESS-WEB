import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { motion, AnimatePresence } from "framer-motion";
import BlueBtn from "../ButtonsComponents/BlueBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
  fetchListOfStudentTableData,
  fetchStudentOrNumberData,
  fetchInsertPaymentData,
  fetchStudentAppAssessmentData,
  fetchParentTransactionHistoryData,
} from "../../states/ParentState/Action";
import GreenBtn from "../ButtonsComponents/GreenBtn";


const SkeletonLine = ({ w = "w-full", h = "h-12" }) => (
  <div className={`${w} ${h} bg-gray-200 rounded-lg animate-pulse`} />
);

const SkeletonLabel = ({ w = "w-28" }) => (
  <div className={`${w} h-4 bg-gray-200 rounded animate-pulse mb-1`} />
);

const SkeletonField = () => (
  <div className="flex flex-col gap-1">
    <SkeletonLabel />
    <SkeletonLine />
  </div>
);

const SkeletonSummaryRow = () => (
  <div className="flex justify-between items-center">
    <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
    <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
  </div>
);

const PaymentStatusBadge = ({ amountToPay, priceAmount }) => {
  const paid = parseFloat(amountToPay) || 0;
  if (!paid || !priceAmount) return null;

  const isFullyPaid = paid >= priceAmount;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
        isFullyPaid
          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
          : "bg-amber-100 text-amber-700 border border-amber-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isFullyPaid ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {isFullyPaid ? "Fully Paid" : "Partial Payment"}
    </span>
  );
};


const SummaryCard = ({
  transactionLabel,
  pendingRow,
  priceAmount,
  amountToPay,
  planName,
}) => {
  const paid       = parseFloat(amountToPay) || 0;
  const remaining  = Math.max(0, priceAmount - paid);
  const change     = Math.max(0, paid - priceAmount);
  const refId =
    transactionLabel === "Tuition Fee"
      ? pendingRow.StudentNumber || "—"
      : pendingRow.AppNumber || "—";

  const fmt = (n) =>
    n != null && n !== ""
      ? `₱${Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
      : "—";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden lg:sticky lg:top-0 self-start">
      <div className="px-5 py-4">
        <h2 className="text-2xl font-semibold text-slate-900"> Payment Information </h2>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-white font-bold text-lg leading-tight">
            {transactionLabel || "—"}
          </h3>
          <PaymentStatusBadge amountToPay={paid} priceAmount={priceAmount} />
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex justify-between items-start text-sm gap-2">
          <span className="text-gray-500 shrink-0">
            {transactionLabel === "Tuition Fee"
              ? "Student No."
              : "App No."}
          </span>
          <span className="font-semibold text-gray-800 text-right break-all">
            {refId}
          </span>
        </div>

        {planName && (
          <div className="flex justify-between items-start text-sm gap-2">
            <span className="text-gray-500 shrink-0">Plan</span>
            <span className="font-semibold text-gray-800 text-right">{planName}</span>
          </div>
        )}

        <div className="border-t border-dashed border-gray-200 pt-3 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-semibold text-gray-800">{fmt(priceAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Amount Entered</span>
            <span className="font-semibold text-gray-800">{paid ? fmt(paid) : "—"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Remaining Balance</span>
            <span
              className={`font-semibold ${
                remaining > 0 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {paid ? fmt(remaining) : "—"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Change</span>
            <span className="font-semibold text-emerald-600">
              {paid && change > 0 ? fmt(change) : "—"}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">Total Due</span>
            <span className="text-base font-extrabold text-green-700">
              {fmt(priceAmount)}
            </span>
          </div>
        </div>
      </div>

      {paid > priceAmount && (
        <div className="mx-5 mb-4 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
          ✓ Excess amount of {fmt(change)} will be returned as change.
        </div>
      )}
    </div>
  );
};


const PaymentModalBody = ({
  assessmentLoading,
  assessmentData,
  transactionLabel,
  pendingRow,
  fullName,
  priceAmount,
  planName,
  amountToPay,
  setAmountToPay,
}) => {
  const paid = parseFloat(amountToPay) || 0;

  const inputBase =
    "h-12 w-full px-4 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition";
  const readonlyInput =
    `${inputBase} bg-gray-50 text-gray-600 cursor-not-allowed select-none`;

  if (assessmentLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">
        <div className="lg:col-span-2 space-y-5">
          {[...Array(5)].map((_, i) => (
            <SkeletonField key={i} />
          ))}
          <div className="flex flex-col gap-1">
            <SkeletonLabel w="w-36" />
            <div className="space-y-2 border rounded-lg p-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <SkeletonField />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-gray-200 animate-pulse h-20" />
          <div className="px-5 py-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonSummaryRow key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">

      <div className="lg:col-span-2 space-y-5">

        {/* Transaction Type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Transaction Type
          </label>
          <input
            type="text"
            value={transactionLabel}
            readOnly
            disabled
            aria-label="Transaction type (read-only)"
            className={readonlyInput}
          />
          <p className="text-xs text-gray-400 mt-0.5">
            Payment Transaction.
          </p>
        </div>

        {/* App / Student Number */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            {transactionLabel === "Tuition Fee"
              ? "Student Number"
              : "Application Number"}
          </label>
          <input
            type="text"
            value={
              transactionLabel === "Tuition Fee"
                ? pendingRow.StudentNumber || ""
                : pendingRow.AppNumber || ""
            }
            readOnly
            disabled
            aria-label="Reference number (read-only)"
            className={readonlyInput}
          />
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            readOnly
            disabled
            aria-label="Student full name (read-only)"
            className={readonlyInput}
          />
        </div>

        {/* Tuition Plan */}
        {planName && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Tuition Plan
            </label>
            <input
              type="text"
              value={planName}
              readOnly
              disabled
              aria-label="Tuition plan (read-only)"
              className={readonlyInput}
            />
          </div>
        )}

        {/* Payment Schedule */}
        {assessmentData.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Payment Schedule
            </label>
            <div className="max-h-52 overflow-y-auto border border-gray-200 rounded-xl">
              <table className="w-full text-sm min-w-[320px]">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr>
                    <th className="border-b border-gray-200 px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Payment
                    </th>
                    <th className="border-b border-gray-200 px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="border-b border-gray-200 px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentData.map((item, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                    >
                      <td className="px-4 py-2.5 text-gray-700">
                        {item.NumberOfPayment}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-gray-800">
                        ₱{Number(item.Amount).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-gray-500">
                        {item.DateOfPayment
                          ? new Date(item.DateOfPayment).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Total Price
          </label>
          <input
            type="number"
            value={priceAmount}
            readOnly
            disabled
            aria-label="Total price (read-only)"
            className={readonlyInput}
          />
        </div>

        {/* Amount to Pay */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Amount to Pay
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter amount"
            aria-label="Amount to pay"
            className={`${inputBase} text-gray-900 bg-white ${
              paid > priceAmount && priceAmount > 0
                ? "border-emerald-400 focus:ring-emerald-400"
                : paid > 0 && paid < priceAmount
                ? "border-amber-400 focus:ring-amber-400"
                : ""
            }`}
            value={amountToPay}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || parseFloat(v) >= 0) setAmountToPay(v);
            }}
          />
          {paid > priceAmount && priceAmount > 0 && (
            <p className="text-xs text-emerald-600 font-medium mt-0.5">
              ✓ Excess amount will be returned as change.
            </p>
          )}
          {paid > 0 && paid < priceAmount && (
            <p className="text-xs text-amber-600 font-medium mt-0.5">
              Partial payment — remaining balance will be recorded.
            </p>
          )}
        </div>
      </div>

      <div>
        <SummaryCard
          transactionLabel={transactionLabel}
          pendingRow={pendingRow}
          priceAmount={priceAmount}
          amountToPay={amountToPay}
          planName={planName}
        />
      </div>
    </div>
  );
};


const PendingListOfStudent = ({ type, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableState   = useSelector((state) => state.parent.tableState);
  const totalRows    = tableState.data?.totalRecords || 0;
  const tableLoading = tableState.loading || false;

  const orNumberData = useSelector(
    (state) => state.parent.studentOrNumber.data || {}
  );

  const assessmentData = useSelector(
    (state) => state.parent.studentAssementState.data || []
  );
  const assessmentLoading = useSelector(
    (state) => state.parent.studentAssementState.loading || false
  );

  const [table,    setTable]    = useState([]);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isPaymentOpen,     setIsPaymentOpen]     = useState(false);
  const [pendingRow,        setPendingRow]         = useState({});
  const [fullName,          setFullName]           = useState("");
  const [amountToPay,       setAmountToPay]        = useState(0);
  const [isWarningModal,    setIsWarningModal]     = useState(false);
  const [isSuccessModalOpen,setIsSuccessModalOpen] = useState(false);

  const transactionLabel = assessmentData[0]?.TransactionLabel ?? "";
  const priceAmount      = parseFloat(assessmentData[0]?.Amount ?? 0);
  const tuitionChildId   = assessmentData[0]?.TuitionChildId   ?? null;
  const planName         = assessmentData[0]?.PlanName          ?? "";

  const columns = [
    {
      name: "Application Number",
      selector: (row) => row.AppNumber,
      sortable: true,
    },
    {
      name: "Fullname",
      selector: (row) => `${row.Lname}, ${row.Fname} ${row.Mname || ""}`,
      sortable: true,
    },
    { name: "Campus",  selector: (row) => row.CampusName,   sortable: true },
    { name: "Level",   selector: (row) => row.LevelName,    sortable: true },
    { name: "Status",  selector: (row) => row.ActiveStatus, sortable: true },
    {
      name: "Date Created",
      selector: (row) => new Date(row.DateCreated).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center whitespace-nowrap">
          <BlueBtn  label="View"    onClick={() => handleButtonClick(row)} />
          <GreenBtn label="Payment" onClick={() => handlePaymentClick(row)} />
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const fetchTableData = async () => {
    const res = await dispatch(
      fetchListOfStudentTableData(userId, type, page, pageSize, search)
    );
    setTable(res?.data || []);
  };

  useEffect(() => {
    if (userId) fetchTableData();
  }, [userId, type, page, pageSize, search]);

  useEffect(() => {
    if (userId) dispatch(fetchStudentOrNumberData(userId));
  }, [userId, dispatch]);

  useEffect(() => {
    if (assessmentData.length > 0) {
      setAmountToPay(parseFloat(assessmentData[0]?.Amount ?? 0));
    }
  }, [assessmentData]);

  const handleButtonClick = (row) => {
    navigate(`/parent/pendingliststudentform?StudentId=${row.StudentId}`);
  };

  const handlePaymentClick = (row) => {
    setAmountToPay(0);
    setPendingRow(row);
    setFullName(`${row.Lname}, ${row.Fname} ${row.Mname || ""}`);
    setIsPaymentOpen(true);
    dispatch(fetchStudentAppAssessmentData(row.AppId));
  };

  const handleOverTheCounterSubmit = () => setIsWarningModal(true);

  const handleConfirmSubmit = async () => {
    const payload = {
      UserId:          pendingRow.StudentId,
      CreatedByUserId: userId,
      OrId:            orNumberData?.OrId  || 0,
      ReferenceId:     transactionLabel === "Tuition Fee"
                         ? pendingRow.StudentNumber || ""
                         : pendingRow.AppNumber     || "",
      TransType: transactionLabel,

      OrChildDtos: [
        {
          OrChildId:       orNumberData?.OrChildId         || 0,
          OrNumberUsed:    orNumberData?.LatestOrAvailable || "",
          BalId:           null,
          TuitionChildId:  tuitionChildId,
          Amount:          String(priceAmount),
          AmountPaid:      String(amountToPay),
          FromTransaction: transactionLabel,
          ModeOfPayment:   "Over The Counter",
        },
      ],
    };

    const res = await dispatch(fetchInsertPaymentData(payload));
    if (res.ok) {
      setIsWarningModal(false);
      setIsPaymentOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => window.location.reload(), 3000);
    }
  };

  const handleOnlineSubmit = () => console.log("Online payment for:", pendingRow);

  return (
    <div>
      <div className="overflow-x-auto pt-2">
        <div className="p-6 bg-white rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-500">
              List of Pending in Enrollment
            </h2>
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={"Pending" + page + search}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <DataTable
                columns={columns}
                data={table}
                progressPending={tableLoading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={page}
                onChangePage={(p) => setPage(p)}
                onChangeRowsPerPage={(newPerPage, p) => {
                  setPageSize(newPerPage);
                  setPage(p);
                }}
                highlightOnHover
                responsive
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Payment Modal ── */}
      <ModalComponent
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        size="w-[95vw] max-w-6xl"
        title={
          <div className="flex items-center justify-center gap-2">
            <div>
              <h2 className="font-bold text-base text-gray-800 leading-none block">
                Payment Form
              </h2>            
            </div>
          </div>
        }
        body={
          <div className="max-h-[calc(90vh-180px)] overflow-y-auto px-1 py-2">
            <PaymentModalBody
              assessmentLoading={assessmentLoading}
              assessmentData={assessmentData}
              transactionLabel={transactionLabel}
              pendingRow={pendingRow}
              fullName={fullName}
              priceAmount={priceAmount}
              planName={planName}
              amountToPay={amountToPay}
              setAmountToPay={setAmountToPay}
            />
          </div>
        }
        footerClassName="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4"
        buttonsClassName="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full"
        buttons={[
          {
            label: (
              <span className="flex items-center gap-2 justify-center">            
                Over The Counter
              </span>
            ),
            type: "blue",
            onClick: handleOverTheCounterSubmit,
            closeOnClick: false,
            className:
              "w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400",
            "aria-label": "Pay over the counter",
          },
          {
            label: (
              <span className="flex items-center gap-2 justify-center">
                Online Payment
              </span>
            ),
            type: "green",
            onClick: handleOnlineSubmit,
            closeOnClick: false,
            className:
              "w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-400",
            "aria-label": "Pay online",
          },
        ]}
      />

      {/* ── Warning Modal ── */}
      <ModalComponent
        isOpen={isWarningModal}
        onClose={() => setIsWarningModal(false)}
        title={<span className="font-bold text-lg text-red-700">Confirm Payment</span>}
        body={
          <div className="py-2 space-y-1">
            <p className="text-gray-700">
              Are you sure you want to submit this payment?
            </p>
            {parseFloat(amountToPay) < priceAmount && (
              <p className="text-xs text-amber-600 font-medium">
                Note: This is a partial payment. A balance will remain.
              </p>
            )}
          </div>
        }
        buttons={[
          { label: "Yes, Submit", type: "green", onClick: handleConfirmSubmit },
          { label: "Cancel",      type: "red",   onClick: () => setIsWarningModal(false) },
        ]}
      />

      {/* ── Success Modal ── */}
      <ModalComponent
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={
          <span className="font-bold text-lg text-green-700">
            Payment Successful
          </span>
        }
        body="Payment submitted successfully. The page will refresh shortly."
        buttons={[
          {
            label: "OK",
            type: "green",
            onClick: () => setIsSuccessModalOpen(false),
          },
        ]}
      />
    </div>
  );
};

export default PendingListOfStudent;