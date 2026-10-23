import { useState } from 'react';
import DataTable from "react-data-table-component";
import { Calculator } from 'lucide-react';

const PayrollProcessDataTable = ({ 
    data = [], 
    loading = false, 
    selectedPeriodId = null 
}) => {
    const [filterText, setFilterText] = useState('');

    // Filter data based on search text
    const filteredData = data.filter(item => {
        const searchText = filterText.toLowerCase();
        return (
            item.employeeId?.toLowerCase().includes(searchText) ||
            item.employeeName?.toLowerCase().includes(searchText) ||
            item.position?.toLowerCase().includes(searchText) ||
            item.department?.toLowerCase().includes(searchText)
        );
    });

    const columns = [
        {
            name: 'Employee ID',
            selector: row => row.employeeId,
            sortable: true,
            width: '130px'
        },
        {
            name: 'Employee Name',
            selector: row => row.employeeName,
            sortable: true,
            wrap: true
        },
        {
            name: 'Position',
            selector: row => row.position,
            sortable: true,
            wrap: true,
            width: '150px'
        },
        {
            name: 'Basic Salary',
            selector: row => row.basicSalary,
            sortable: true,
            cell: row => `₱${row.basicSalary.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            width: '130px'
        },
        {
            name: 'Gross Pay',
            selector: row => row.grossPay,
            sortable: true,
            cell: row => (
                <span className="font-semibold text-green-600">
                    ₱{row.grossPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '130px'
        },
        {
            name: 'Deductions',
            selector: row => row.totalDeductions,
            sortable: true,
            cell: row => (
                <span className="font-semibold text-red-600">
                    ₱{row.totalDeductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '130px'
        },
        {
            name: 'Net Pay',
            selector: row => row.netPay,
            sortable: true,
            cell: row => (
                <span className="font-bold text-blue-600">
                    ₱{row.netPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '140px'
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => {
                let statusClass = 'bg-gray-100 text-gray-700';
                if (row.status === 'Processed' || row.status === 'Calculated') {
                    statusClass = 'bg-green-100 text-green-700';
                } else if (row.status === 'Posted') {
                    statusClass = 'bg-blue-100 text-blue-700';
                } else if (row.status === 'Pending') {
                    statusClass = 'bg-yellow-100 text-yellow-700';
                }
                
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                        {row.status}
                    </span>
                );
            },
            width: '100px'
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Employee Payroll Details</h3>
                <input
                    type="text"
                    placeholder="Search by name, ID, position..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
            </div>
            
            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                striped
                responsive
                progressPending={loading}
                progressComponent={
                    <div className="py-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                        <p className="text-gray-500">Loading payroll data...</p>
                    </div>
                }
                noDataComponent={
                    <div className="py-12 text-center">
                        <Calculator size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No payroll data processed yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {selectedPeriodId 
                                ? 'Click "Calculate Payroll" to process employee salaries' 
                                : 'Select a period and click "Calculate Payroll"'}
                        </p>
                    </div>
                }
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
            />
        </div>
    );
};

export default PayrollProcessDataTable;
