import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { motion, AnimatePresence } from "framer-motion";
import BlueBtn from "../ButtonsComponents/BlueBtn";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import PaymentFormComponent from "./PaymentFormComponent";
import {
  fetchListOfStudentTableData,
} from "../../states/ParentState/Action";

// ─── Main component ───────────────────────────────────────────────────────────
const ListOfStudentDataTable = ({ type, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableState = useSelector((s) => s.parent.tableState);
  const totalRows = tableState.data?.totalRecords || 0;
  const tableLoading = tableState.loading || false;

  const [table, setTable] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

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
          <BlueBtn label="View" onClick={() => navigate(`/parent/pendingliststudentform?AppId=${row.AppId}`)} />
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

  const fetchTableData = async () => {
    const res = await dispatch(fetchListOfStudentTableData(userId, type, page, pageSize, search));
    setTable(res?.data || []);
  };

  const handleOpenPayment = (row) => {
    setSelectedRow(row);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    fetchTableData();
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

      {/* Payment Form Component */}
      <PaymentFormComponent
        studentRow={selectedRow}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        userId={userId}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default ListOfStudentDataTable;
