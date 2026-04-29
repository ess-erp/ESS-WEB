import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import BlueBtn from '../ButtonsComponents/BlueBtn';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { fetchListOfStudentTableData } from "../../states/ParentState/Action";
import GreenBtn from '../ButtonsComponents/GreenBtn';

const PendingListOfStudent = ({ type, userId }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableState = useSelector((state) => state.parent.tableState || {});
  const totalRows = tableState.data?.totalRecords || 0;
  const loading = tableState.loading || false;

  const [table, setTable] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  const [selectedStatus] = useState('Pending');

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // table columns
  const columns = [
    // { name: 'Application Number', selector: row => row.AppNumber, sortable: true },
    { name: 'Fullname', selector: row => `${row.Lname}, ${row.Fname} ${row.Mname || ''}`, sortable: true },
    { name: 'Campus', selector: row => row.CampusName, sortable: true },
    { name: 'Level', selector: row => row.LevelName, sortable: true },
    { name: 'Status', selector: row => row.ActiveStatus, sortable: true },
    { name: 'Date Created', selector: row => new Date(row.DateCreated).toLocaleDateString(), sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex items-center whitespace-nowrap">
          <BlueBtn
            label="View"
            onClick={() => handleButtonClick(row)}
          />
          <GreenBtn
            label="Payment"
            onClick={() => handleButtonClick(row)}
          />
        </div>
      ),
      ignoreRowClick: true,
    }
  ];

  // fetch data
  const fetchData = async () => {
    const res = await dispatch(
      fetchListOfStudentTableData(userId, type, page, pageSize, search)
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
          { label: "Cancel", type: "red", onClick: () => setIsModalOpen(false) },
        ]}
      />
    </div>
  );
};

export default PendingListOfStudent;