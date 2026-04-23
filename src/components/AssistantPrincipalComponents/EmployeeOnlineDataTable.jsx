import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import OutlineBlueBtn from '../ButtonsComponents/OutlineBlueBtn';
import BlueBtn from '../ButtonsComponents/BlueBtn';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { 
    fetchEmployeeOnlineAppData, 
} from "../../states/AssistantPrincipalState/Action";

const EmployeeOnlineDataTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const tableState = useSelector((state) => state.ap.employeeOnlineState || {});
  const table = tableState.data.data || [];
  const totalRows = tableState.data.totalRecords || 0;
  const loading = tableState.loading || false;

  const statuses = [
    { label: "Pending", action: "P", icon: <FaClock className="text-red-500 text-xl" />, bg: "bg-yellow-100", hover: "hover:bg-yellow-200" },
    { label: "Hired", action: "Y", icon: <FaCheckCircle className="text-green-500 text-xl" />, bg: "bg-green-100", hover: "hover:bg-green-200" },
  ];

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('P');
  const [statusName, setStatusName] = useState("Pending");
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { name: 'Application Number', selector: row => row.EmployeeAppNo, sortable: true },
    { name: 'Fullname', selector: row => `${row.Lname}, ${row.Fname} ${row.Mname || ''}`, sortable: true },
    { name: 'Desired Position', selector: row => row.Position, sortable: true },
    { name: 'Status', selector: row => row.ActiveStatus, sortable: true },
    { name: 'Date Created', selector: row => new Date(row.DateCreated).toLocaleDateString(), sortable: true },
    {
      name: 'Actions',
      cell: (row) => <BlueBtn label="View" onClick={() => handleButtonClick(row)} />,
      ignoreRowClick: true,
    }
  ];

  // Fetch server data whenever dependencies change
  const fetchData = () => {
    dispatch(fetchEmployeeOnlineAppData(
      startDate,
      endDate,
      selectedStatus,
      currentPage,
      rowsPerPage,
      filterText
    ));
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate,selectedStatus, currentPage, rowsPerPage, filterText, dispatch]);
  console.log(selectedStatus);
  const handleButtonClick = (row) => {
    console.log(row);
    navigate(`/ap/employeeinitialinterview?employeeAppId=${row.EmployeeAppId}`);
  };

  const handleSubmit = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setCurrentPage(1);
    setIsModalOpen(false);
  }

  return (
    <div>
      {/* Status buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {statuses.map((status) => (
          <button
            key={status.label}
            onClick={() => {
              setSelectedStatus(status.action);
              setStatusName(status.label);
              setCurrentPage(1);
              setStartDate('');
              setEndDate('');
              setTempStartDate('');
              setTempEndDate('');
            }}
            className={`flex items-center justify-center gap-3 w-48 h-20 rounded-lg shadow-sm ${status.bg} ${status.hover} transition-all duration-200`}
          >
            {/* icon on the left */}
            <div className="flex-shrink-0">
              {status.icon}
            </div>

            {/* text on the right */}
            <div className="text-left">
              <p className="text-sm font-medium">{status.label}</p>
              <p className="text-lg font-bold">--</p>
            </div>
          </button>
        ))}
      </div>



      {/* Table */}
      <div className="overflow-x-auto pt-2">
        <div className="p-6 bg-white rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-500">
              {`List of ${statusName} in Employee Applicant`}
            </h2>

            <div className="flex items-center gap-2">
              <OutlineBlueBtn label="Date Range" onClick={() => setIsModalOpen(true)} />
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs"
                value={filterText}
                onChange={(e) => {
                  setFilterText(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStatus + currentPage + filterText}
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
                paginationDefaultPage={currentPage}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                  setRowsPerPage(newPerPage);
                  setCurrentPage(page);
                }}
                highlightOnHover
                responsive
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Date Range Modal */}
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
          { label: "Cancel", type: "red", onClick: () => setIsModalOpen(false) },
        ]}
      />
    </div>
  );
};

export default EmployeeOnlineDataTable;
