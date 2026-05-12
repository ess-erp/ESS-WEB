import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { motion, AnimatePresence } from "framer-motion";
import BlueBtn from "../ButtonsComponents/BlueBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
  fetchListOfStudentTableData,
  fetchListOfTuitionFeeData,
  fetchInsertOverTheCounterPaymentData,
} from "../../states/ParentState/Action";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";

const PendingListOfStudent = ({ type, userId, levelId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableState = useSelector((state) => state.parent.tableState || {});
  const totalRows = tableState.data?.totalRecords || 0;
  const loading = tableState.loading || false;

  const [table, setTable] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  const [selectedStatus] = useState("Pending");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // table columns
  const columns = [
    { name: 'Application Number', selector: row => row.AppNumber, sortable: true },
    {
      name: "Fullname",
      selector: (row) => `${row.Lname}, ${row.Fname} ${row.Mname || ""}`,
      sortable: true,
    },
    { name: "Campus", selector: (row) => row.CampusName, sortable: true },
    { name: "Level", selector: (row) => row.LevelName, sortable: true },
    { name: "Status", selector: (row) => row.ActiveStatus, sortable: true },
    {
      name: "Date Created",
      selector: (row) => new Date(row.DateCreated).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center whitespace-nowrap">
          <BlueBtn label="View" onClick={() => handleButtonClick(row)} />
          <GreenBtn label="Payment" onClick={() => handlePaymentClick(row)} />
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  // fetch data
  const fetchData = async () => {
    const res = await dispatch(
      fetchListOfStudentTableData(userId, type, page, pageSize, search),
    );
    setTable(res?.data || []);
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, type, page, pageSize, search]);

  // navigate
  const handleButtonClick = (row) => {
    navigate(`/parent/pendingliststudentform?StudentId=${row.StudentId}`);
  };

  // modal submit
  const handleSubmit = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setPage(1);
    setIsModalOpen(false);
  };

  const [tuitionTable, setTuitionTable] = useState([]);
  const [tuitionLoading, setTuitionLoading] = useState(false);
  const [pendingRow, setPendingRow] = useState({});

  const handlePaymentClick = (row) => {
    setIsPaymentOpen(true);
    fetchTuitionFee(row.LevelId);
    setPendingRow(row);
  };

  const tuitionColumns = [
    {
      name: "Plan Name",
      selector: (row) => row.PlanName,
      sortable: true,
    },
    {
      name: "Number Of Payment",
      selector: (row) => row.NumberOfPayment,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.Amount,
      sortable: true,
    },
    {
      name: "Date of Payment",
      selector: (row) =>
        row.DateOfPayment
          ? new Date(row.DateOfPayment).toLocaleDateString()
          : "-",
      sortable: true,
    },
  ];

  const fetchTuitionFee = async (levelId) => {
    setTuitionLoading(true);
    const res = await dispatch(
      fetchListOfTuitionFeeData(levelId, page, pageSize),
    );
    setTuitionTable(res?.data || []);
    setTuitionLoading(false);
  };

  const [selectedTuitionPlan, setSelectedTuitionPlan] = useState(null);

  const tuitionFeeOptions = React.useMemo(() => {
    const map = new Map();

    (tuitionTable || []).forEach((item) => {
      map.set(item.TuitionChildId, {
        value: item.TuitionChildId,
        label: item.PlanName,
      });
    });

    return Array.from(map.values());
  }, [tuitionTable]);

  const [isWarningModal, setIsWarningModal] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const handleOverTheCounterSubmit = () => {
    setIsWarningModal(true);
  };

  const handleConfirmSubmit = async () => {
    const payload = {
      PaymentType: "OverTheCounter",
      AppId: pendingRow.AppId,
      TuitionChildId: selectedTuitionPlan.value
    };
    console.log(payload);

    const res = await dispatch(fetchInsertOverTheCounterPaymentData(payload));
    if (res.ok) {
      setIsSuccessModalOpen(true);
      if (isSuccessModalOpen == false) {
        setTimeout(() => window.location.reload(), 3000);
      }
    }
  };

  const handleOnlineSubmit = () => {
    console.log(pendingRow);
  };

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto pt-2">
        <div className="p-6 bg-white rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-500">
              {`List of ${selectedStatus} in Enrollment`}
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // reset page when searching
                }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStatus + page + search}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <DataTable
                columns={columns}
                data={table}
                progressPending={loading}
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

      {/* Modal */}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Please choose date range"
        body={
          <div className="flex flex-col gap-2">
            <label className="flex flex-col">
              Start Date:
              <input
                type="date"
                className="border p-2 rounded"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
              />
            </label>
            <label className="flex flex-col">
              End Date:
              <input
                type="date"
                className="border p-2 rounded"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
              />
            </label>
          </div>
        }
        buttons={[
          { label: "Submit", type: "green", onClick: handleSubmit },
          {
            label: "Cancel",
            type: "red",
            onClick: () => setIsModalOpen(false),
          },
        ]}
      />
      <ModalComponent
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        size="w-[90vw] max-w-4xl"
        title={
          <span className="font-bold text-lg text-green-700">
            Payment Method
          </span>
        }
        body={
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium mb-1 block text-left">
                Tuition Fee Plan
              </label>
              <div className="rounded-lg bg-white pb-4 w-full overflow-hidden">
                <DataTable
                  columns={tuitionColumns}
                  data={tuitionTable}
                  progressPending={tuitionLoading}
                  highlightOnHover
                  responsive
                  dense
                  fixedHeader
                  fixedHeaderScrollHeight="180px"
                  noHeader
                  className="text-sm border-t border-gray-400 "
                />
                <hr className="mt-3 border-gray-400" />
              </div>
              <div className="flex flex-col gap-1 items-center">
                <label className="text-sm font-medium mb-1 block">
                  Select Tuition Plan
                </label>

                <div className="w-1/2">
                  <SearchableSelect
                    placeholder="-- Select Plan --"
                    options={tuitionFeeOptions}
                    value={selectedTuitionPlan}
                    onChange={setSelectedTuitionPlan}
                  />
                </div>
              </div>
            </div>
          </div>
        }
        buttons={[
          {
            label: "Over The Counter",
            type: "blue",
            onClick: handleOverTheCounterSubmit,
            closeOnClick: false,
          },
          {
            label: "Online Payment",
            type: "green",
            onClick: handleOnlineSubmit,
            closeOnClick: false,
          },
        ]}
      />
      <ModalComponent
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={
          <span className="font-bold text-lg text-green-700">
            Success
          </span>
        }
        body="Done saving the details. The next process will be in Iintial Interview"
        buttons={[
          {
            label: "OK",
            type: "green",
            onClick: () => setIsSuccessModalOpen(false)
          },
        ]}
      />
      <ModalComponent
        isOpen={isWarningModal}
        onClose={() => setIsWarningModal(false)}
        title={<span className="font-bold text-lg text-red-700">Warning</span>}
        body="Are you sure you want to submit?"
        buttons={[
          { label: "Yes", type: "green", onClick: handleConfirmSubmit, },
          { label: "No", type: "red", onClick: () => setIsWarningModal(false) },
        ]}
      />
    </div>
  );
};

export default PendingListOfStudent;
