import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, DollarSign, Search, X, Calendar, User } from 'lucide-react';
import DataTable from 'react-data-table-component';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import {
    fetchEmployeeDeductions,
    createEmployeeDeduction,
    updateEmployeeDeduction,
    deleteEmployeeDeduction,
} from '../../states/HumanResourcesState/Action';
import { showToast } from '../../states/NotificationState/Action';

// ─── Table styles ─────────────────────────────────────────────────────────────
const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
        },
    },
    rows: {
        style: { minHeight: '52px', '&:hover': { backgroundColor: '#faf5ff' } },
    },
};

const EmployeeDeductionsDataTable = () => {
    const dispatch = useDispatch();

    // Redux state
    const { loading, data: tableData } = useSelector((s) => s.hr.employeeDeductionsState);
    const { loading: creating } = useSelector((s) => s.hr.createDeductionState);
    const { loading: updating } = useSelector((s) => s.hr.updateDeductionState);
    const { loading: deleting } = useSelector((s) => s.hr.deleteDeductionState);

    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({
        deductionCode: '',
        deductionName: '',
        employeeId: '',
        calculationType: 'FIXED_AMOUNT',
        totalAmount: '',
        perPayrollAmount: '',
        startDate: '',
        endDate: '',
    });

    // Mock employee list for dropdown
    const employeeOptions = [
        { value: 'EMP-2026-0089', label: 'EMP-2026-0089 - Juan Dela Cruz' },
        { value: 'EMP-2026-0045', label: 'EMP-2026-0045 - Maria Santos' },
        { value: 'EMP-2026-0102', label: 'EMP-2026-0102 - Pedro Reyes' },
    ];

    const calculationTypeOptions = [
        { value: 'FIXED_AMOUNT', label: 'Fixed Amount per Payroll' },
        { value: 'PERCENTAGE', label: 'Percentage of Salary' },
    ];

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchEmployeeDeductions(1, 10, '', null, null));
    }, [dispatch]);

    const handleEdit = (row) => {
        setSelectedRow(row);
        setForm({
            deductionCode: row.DeductionCode ?? row.deductionCode ?? '',
            deductionName: row.DeductionName ?? row.deductionName ?? '',
            employeeId: row.EmployeeId ?? row.employeeId ?? '',
            calculationType: row.CalculationType ?? row.calculationType ?? 'FIXED_AMOUNT',
            totalAmount: row.TotalAmount ?? row.totalAmount ?? '',
            perPayrollAmount: row.PerPayrollAmount ?? row.perPayrollAmount ?? '',
            startDate: row.StartDate ?? row.startDate ?? '',
            endDate: row.EndDate ?? row.endDate ?? '',
        });
        setEditModal(true);
    };

    const handleSaveEdit = async () => {
        const payload = {
            id: selectedRow.Id ?? selectedRow.id,
            deduction_type: 'CUSTOM_LOAN',
            deduction_code: form.deductionCode,
            deduction_name: form.deductionName,
            employee_id: form.employeeId,
            calculation_type: form.calculationType,
            total_amount: parseFloat(form.totalAmount),
            per_payroll_amount: parseFloat(form.perPayrollAmount),
            start_date: form.startDate,
            end_date: form.endDate,
            status: 'ACTIVE',
        };
        const result = await dispatch(updateEmployeeDeduction(payload));
        if (result.ok) {
            dispatch(showToast('success', 'Employee deduction updated successfully'));
            setEditModal(false);
            dispatch(fetchEmployeeDeductions(1, 10, '', null, null));
        } else {
            dispatch(showToast('error', result.message || 'Failed to update employee deduction'));
        }
    };

    const handleAdd = () => {
        setForm({
            deductionCode: '',
            deductionName: '',
            employeeId: '',
            calculationType: 'FIXED_AMOUNT',
            totalAmount: '',
            perPayrollAmount: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
        });
        setAddModal(true);
    };

    const handleSaveNew = async () => {
        const payload = {
            deduction_type: 'CUSTOM_LOAN',
            deduction_code: form.deductionCode,
            deduction_name: form.deductionName,
            employee_id: form.employeeId,
            calculation_type: form.calculationType,
            total_amount: parseFloat(form.totalAmount),
            per_payroll_amount: parseFloat(form.perPayrollAmount),
            start_date: form.startDate,
            end_date: form.endDate,
            status: 'ACTIVE',
        };
        const result = await dispatch(createEmployeeDeduction(payload));
        if (result.ok) {
            dispatch(showToast('success', 'Employee deduction created successfully'));
            setAddModal(false);
            dispatch(fetchEmployeeDeductions(1, 10, '', null, null));
        } else {
            dispatch(showToast('error', result.message || 'Failed to create employee deduction'));
        }
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const deductionId = selectedRow.Id ?? selectedRow.id;
        const result = await dispatch(deleteEmployeeDeduction(deductionId));
        if (result.ok) {
            dispatch(showToast('success', 'Employee deduction deleted successfully'));
            setDeleteModal(false);
            dispatch(fetchEmployeeDeductions(1, 10, '', null, null));
        } else {
            dispatch(showToast('error', result.message || 'Failed to delete employee deduction'));
        }
    };

    // Filter data - handle both array and empty state
    const displayData = Array.isArray(tableData) ? tableData : [];
    const filteredData = displayData.filter(
        (row) =>
            !search ||
            (row.DeductionCode ?? row.deductionCode ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (row.DeductionName ?? row.deductionName ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (row.EmployeeId ?? row.employeeId ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (row.EmployeeName ?? row.employeeName ?? '').toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            name: 'Deduction Code',
            selector: (r) => r.DeductionCode ?? r.deductionCode,
            sortable: true,
            width: '150px',
            cell: (r) => <span className="font-mono text-xs font-semibold text-purple-700">{r.DeductionCode ?? r.deductionCode}</span>,
        },
        {
            name: 'Deduction Name',
            selector: (r) => r.DeductionName ?? r.deductionName,
            sortable: true,
            grow: 1,
        },
        {
            name: 'Employee',
            cell: (r) => (
                <div className="flex flex-col py-2">
                    <span className="text-xs font-medium text-gray-800">{r.EmployeeName ?? r.employeeName}</span>
                    <span className="text-xs text-gray-500">{r.EmployeeId ?? r.employeeId}</span>
                </div>
            ),
            sortable: true,
            width: '200px',
        },
        {
            name: 'Type',
            selector: (r) => r.CalculationType ?? r.calculationType,
            format: (r) => ((r.CalculationType ?? r.calculationType) === 'FIXED_AMOUNT' ? 'Fixed' : 'Percentage'),
            width: '120px',
        },
        {
            name: 'Total Amount',
            selector: (r) => r.TotalAmount ?? r.totalAmount,
            format: (r) => `₱${(r.TotalAmount ?? r.totalAmount ?? 0).toLocaleString()}`,
            width: '140px',
            right: true,
        },
        {
            name: 'Per Payroll',
            selector: (r) => r.PerPayrollAmount ?? r.perPayrollAmount,
            cell: (r) => (
                <span className="font-semibold text-purple-700">
                    ₱{(r.PerPayrollAmount ?? r.perPayrollAmount ?? 0).toLocaleString()}
                </span>
            ),
            width: '130px',
            right: true,
        },
        {
            name: 'Period',
            cell: (r) => {
                const startDate = r.StartDate ?? r.startDate;
                const endDate = r.EndDate ?? r.endDate;
                return (
                    <div className="text-xs text-gray-600">
                        {startDate ? new Date(startDate).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' }) : 'N/A'} -{' '}
                        {endDate ? new Date(endDate).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </div>
                );
            },
            width: '150px',
        },
        {
            name: 'Status',
            selector: (r) => r.Status ?? r.status,
            cell: (r) => {
                const status = r.Status ?? r.status;
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            status === 'ACTIVE'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {status}
                    </span>
                );
            },
            width: '110px',
        },
        {
            name: 'Actions',
            cell: (r) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(r)}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition"
                        title="Edit"
                    >
                        <Edit size={15} />
                    </button>
                    <button
                        onClick={() => handleDelete(r)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            ),
            width: '110px',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <DollarSign className="text-purple-600" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">Employee Deductions & Loans</h3>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                >
                    <Plus size={16} />
                    Add Deduction
                </button>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-lg">
                <p className="text-sm text-purple-800">
                    <strong>Note:</strong> Manage recurring employee deductions such as salary loans, cash advances, and
                    other authorized payroll deductions. These will be automatically deducted from the employee's payroll
                    based on the configured schedule.
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg border p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by deduction code, name, or employee..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 50]}
                    progressPending={loading}
                    noDataComponent={
                        <div className="py-8 text-center text-gray-500">No employee deductions configured</div>
                    }
                />
            </div>

            {/* Edit Modal */}
            <ModalComponent
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title="Edit Employee Deduction"
                size="w-[700px]"
                maxHeight="90vh"
                body={
                    <div className="space-y-4 p-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Deduction Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.deductionCode}
                                    onChange={(e) => setForm({ ...form, deductionCode: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. LOAN-SSS"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Deduction Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.deductionName}
                                    onChange={(e) => setForm({ ...form, deductionName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. SSS Salary Loan"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Target Employee <span className="text-red-500">*</span>
                            </label>
                            <SearchableSelect
                                options={employeeOptions}
                                value={employeeOptions.find((opt) => opt.value === form.employeeId)}
                                onChange={(selected) => setForm({ ...form, employeeId: selected?.value || '' })}
                                placeholder="Select employee..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Calculation Type <span className="text-red-500">*</span>
                            </label>
                            <SearchableSelect
                                options={calculationTypeOptions}
                                value={calculationTypeOptions.find((opt) => opt.value === form.calculationType)}
                                onChange={(selected) => setForm({ ...form, calculationType: selected?.value || 'FIXED_AMOUNT' })}
                                placeholder="Select calculation type..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Total Amount (₱) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.totalAmount}
                                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. 15000.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Per Payroll Amount (₱) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.perPayrollAmount}
                                    onChange={(e) => setForm({ ...form, perPayrollAmount: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. 1250.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    { label: updating ? 'Saving...' : 'Save Changes', type: 'green', onClick: handleSaveEdit, disabled: updating, closeOnClick: false },
                    { label: 'Cancel', type: 'red', onClick: () => setEditModal(false) },
                ]}
            />

            {/* Add Modal - Same structure as Edit */}
            <ModalComponent
                isOpen={addModal}
                onClose={() => setAddModal(false)}
                title="Add Employee Deduction"
                size="w-[700px]"
                maxHeight="90vh"
                body={
                    <div className="space-y-4 p-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Deduction Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.deductionCode}
                                    onChange={(e) => setForm({ ...form, deductionCode: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. LOAN-SSS"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Deduction Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.deductionName}
                                    onChange={(e) => setForm({ ...form, deductionName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. SSS Salary Loan"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Target Employee <span className="text-red-500">*</span>
                            </label>
                            <SearchableSelect
                                options={employeeOptions}
                                value={employeeOptions.find((opt) => opt.value === form.employeeId)}
                                onChange={(selected) => setForm({ ...form, employeeId: selected?.value || '' })}
                                placeholder="Select employee..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Calculation Type <span className="text-red-500">*</span>
                            </label>
                            <SearchableSelect
                                options={calculationTypeOptions}
                                value={calculationTypeOptions.find((opt) => opt.value === form.calculationType)}
                                onChange={(selected) => setForm({ ...form, calculationType: selected?.value || 'FIXED_AMOUNT' })}
                                placeholder="Select calculation type..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Total Amount (₱) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.totalAmount}
                                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. 15000.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Per Payroll Amount (₱) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.perPayrollAmount}
                                    onChange={(e) => setForm({ ...form, perPayrollAmount: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. 1250.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    { label: creating ? 'Adding...' : 'Add Deduction', type: 'green', onClick: handleSaveNew, disabled: creating, closeOnClick: false },
                    { label: 'Cancel', type: 'red', onClick: () => setAddModal(false) },
                ]}
            />

            {/* Delete Confirmation */}
            <ModalComponent
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Confirm Delete"
                body={
                    <p className="text-gray-700">
                        Are you sure you want to delete this employee deduction? This action cannot be undone and may
                        affect payroll calculations.
                    </p>
                }
                buttons={[
                    { label: deleting ? 'Deleting...' : 'Delete', type: 'red', onClick: handleConfirmDelete, disabled: deleting, closeOnClick: false },
                    { label: 'Cancel', type: 'blue', onClick: () => setDeleteModal(false) },
                ]}
            />
        </div>
    );
};

export default EmployeeDeductionsDataTable;
