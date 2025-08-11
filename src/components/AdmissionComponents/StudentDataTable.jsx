import React, { useState } from 'react';
import { FaClock, FaSpinner, FaCheckCircle } from "react-icons/fa";
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDataTable = () => {
  const statuses = [
    {
      label: "Pending",
      count: 12,
      icon: <FaClock className="text-yellow-500 text-xl" />,
      bg: "bg-yellow-100",
      hover: "hover:bg-yellow-200",
    },
    {
      label: "On-going",
      count: 8,
      icon: <FaSpinner className="text-blue-500 text-xl animate-spin" />,
      bg: "bg-blue-100",
      hover: "hover:bg-blue-200",
    },
    {
      label: "Enrolled",
      count: 23,
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      bg: "bg-green-100",
      hover: "hover:bg-green-200",
    },
  ];

  const data = [
    { id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com', status: 'Pending' },
    { id: 2, name: 'Maria Santos', email: 'maria@example.com', status: 'Enrolled' },
    { id: 3, name: 'Pedro Reyes', email: 'pedro@example.com', status: 'On-going' },
    { id: 4, name: 'Ana Lopez', email: 'ana@example.com', status: 'Pending' },
  ];

  const columns = [
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Status', selector: row => row.status, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleButtonClick(row)}
          className="px-3 py-1 !bg-blue-500 !text-white rounded hover:!bg-blue-600"
        >
          View
        </button>
      ),
      ignoreRowClick: true, // Prevents button clicks from selecting row
      allowOverflow: true,  // Ensures button isn’t cut off
      button: true          // Marks it as a button column
    }
  ];
  const handleButtonClick = (row) => {
    console.log('Button clicked for:', row);
    // You can open modal, navigate, etc.
  };


  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [filterText, setFilterText] = useState('');

  const filteredData = data.filter(
    item =>
      (item.status.toLowerCase() === selectedStatus.toLowerCase()) &&
      (
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.email.toLowerCase().includes(filterText.toLowerCase())
      )
  );

  return (
    <div>
      {/* Status Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {statuses.map((status) => (
          <button
            key={status.label}
            onClick={() => setSelectedStatus(status.label)}
            className={`flex items-center gap-3 w-48 h-20 rounded-lg shadow-sm bg-white
              ${status.bg} ${status.hover} transition-all duration-200
              ${selectedStatus === status.label ? '' : ''}`}
          >
            {status.icon}
            <div className="text-left">
              <p className="text-sm font-medium">{status.label}</p>
              <p className="text-lg font-bold">{status.count}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto pt-2">
        <div className="p-6 bg-white rounded shadow">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-500">
              {`List of ${selectedStatus} in Enrollment`}
            </h2>
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          {/* Animated Table */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStatus} // triggers re-animation on status change
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                responsive
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudentDataTable;
