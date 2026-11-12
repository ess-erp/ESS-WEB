import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, Hospital, Search, X } from 'lucide-react';
import DataTable from 'react-data-table-component';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { fetchPhilhealthTable, updatePhilhealthTable } from '../../states/HumanResourcesState/Action';
import { showToast } from '../../states/NotificationState/Action';

// ─── Table styles ─────────────────────────────────────────────────────────────
const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#059669',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
        },
    },
    rows: {
        style: { minHeight: '52px', '&:hover': { backgroundColor: '#f0fdf4' } },
    },
};

const PhilhealthMatrixTable = () => {
    const dispatch = useDispatch();
    const { loading, data: philhealthData, totalRecords } = useSelector((s) => s.hr.philhealthTableState);
    const { loading: saving } = useSelector((s) => s.hr.updatePhilhealthTableState);

    console.log(philhealthData);

    // Pagination & Search state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [form, setForm] = useState({
        ratePercentage: '',
        minSalary: '',
        maxSalary: '',
        eeSplitRatio: '',
        erSplitRatio: '',
    });

    // Fetch data with pagination
    const fetchData = useCallback(() => {
        dispatch(fetchPhilhealthTable(page, pageSize, search));
    }, [page, pageSize, search, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = (row) => {
        setSelectedRow(row);
        setForm({
            ratePercentage: row.RatePercentage ?? row.ratePercentage ?? '',
            minSalary: row.MinSalary ?? row.minSalary ?? '',
            maxSalary: row.MaxSalary ?? row.maxSalary ?? '',
            eeSplitRatio: row.EeSplitRatio ?? row.eeSplitRatio ?? '',
            erSplitRatio: row.ErSplitRatio ?? row.erSplitRatio ?? '',
        });
        setEditModal(true);
    };

    const handleSaveEdit = async () => {
        const payload = {
            id: selectedRow.Id ?? selectedRow.id,
            ratePercentage: parseFloat(form.ratePercentage),
            minSalary: parseFloat(form.minSalary),
            maxSalary: parseFloat(form.maxSalary),
            eeSplitRatio: parseFloat(form.eeSplitRatio),
            erSplitRatio: parseFloat(form.erSplitRatio),
            status: 'ACTIVE',
        };
        
        const result = await dispatch(updatePhilhealthTable(payload));
        if (result.ok) {
            dispatch(showToast('success', 'PhilHealth configuration updated successfully'));
            setEditModal(false);
            fetchData();
        } else {
            dispatch(showToast('error', 'Failed to update PhilHealth configuration'));
        }
    };

    const handleAdd = () => {
        setForm({
            ratePercentage: '5.0',
            minSalary: '10000',
            maxSalary: '100000',
            eeSplitRatio: '0.50',
            erSplitRatio: '0.50',
        });
        setAddModal(true);
    };

    const handleSaveNew = async () => {
        const payload = {
            ratePercentage: parseFloat(form.ratePercentage),
            minSalary: parseFloat(form.minSalary),
            maxSalary: parseFloat(form.maxSalary),
            eeSplitRatio: parseFloat(form.eeSplitRatio),
            erSplitRatio: parseFloat(form.erSplitRatio),
            status: 'ACTIVE',
            isNew: true,
        };
        
        const result = await dispatch(updatePhilhealthTable(payload));
        if (result.ok) {
            dispatch(showToast('success', 'PhilHealth configuration added successfully'));
            setAddModal(false);
            fetchData();
        } else {
            dispatch(showToast('error', 'Failed to add PhilHealth configuration'));
        }
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const payload = {
            id: selectedRow.Id ?? selectedRow.id,
            isDeleted: true,
        };
        
        const result = await dispatch(updatePhilhealthTable(payload));
        if (result.ok) {
            dispatch(showToast('success', 'PhilHealth configuration deleted successfully'));
            setDeleteModal(false);
            fetchData();
        } else {
            dispatch(showToast('error', 'Failed to delete PhilHealth configuration'));
        }
    };

    // Extract data array from the response object
    const displayData = Array.isArray(philhealthData?.Data) 
        ? philhealthData.Data 
        : Array.isArray(philhealthData) 
        ? philhealthData 
        : [];
    
    console.log('PhilHealth Debug:', { 
        philhealthData, 
        displayData, 
        isArray: Array.isArray(displayData),
        totalRecords,
        length: displayData.length 
    });

    const columns = [
        {
            name: 'Premium Rate (%)',
            selector: (r) => r.PremiumRate ?? r.PremiumRate ?? 0,
            format: (r) => `${r.PremiumRate ?? r.PremiumRate ?? 0}%`,
            width: '150px',
            sortable: true,
        },
        {
            name: 'Min Salary Cap',
            selector: (r) => r.MinSalaryCap ?? r.minSalaryCap ?? 0,
            format: (r) => `₱${(r.MinSalaryCap ?? r.minSalaryCap ?? 0).toLocaleString()}`,
            width: '180px',
            sortable: true,
        },
        {
            name: 'Max Salary Cap',
            selector: (r) => r.MaxSalaryCap ?? r.maxSalaryCap ?? 0,
            format: (r) => `₱${(r.MaxSalaryCap ?? r.maxSalaryCap ?? 0).toLocaleString()}`,
            width: '180px',
            sortable: true,
        },
        {
            name: 'Employee Split',
            selector: (r) => r.EmployeeSplitRatio ?? r.employeeSplitRatio ?? 0,
            format: (r) => `${((r.EmployeeSplitRatio ?? r.employeeSplitRatio ?? 0) * 100).toFixed(0)}%`,
            width: '150px',
            sortable: true,
        },
        {
            name: 'Employer Split',
            selector: (r) => r.EmployerSplitRatio ?? r.employerSplitRatio ?? 0,
            format: (r) => `${((r.EmployerSplitRatio ?? r.employerSplitRatio ?? 0) * 100).toFixed(0)}%`,
            width: '150px',
            sortable: true,
        },
        {
            name: 'Status',
            selector: (r) => r.ActiveStatus ?? r.activeStatus ?? 'N/A',
            cell: (r) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (r.ActiveStatus ?? r.activeStatus) === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {r.ActiveStatus ?? r.activeStatus ?? 'N/A'}
                </span>
            ),
            width: '120px',
        },
        {
            name: 'Actions',
            cell: (r) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(r)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
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
            ignoreRowClick: true,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Hospital className="text-green-600" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">PhilHealth Configuration</h3>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                    <Plus size={16} />
                    Add Configuration
                </button>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                    <strong>Note:</strong> PhilHealth contributions are calculated as a percentage of monthly basic
                    salary, subject to minimum and maximum salary caps. The premium is split between employee and
                    employer as configured.
                </p>
            </div>

            {/* Search Box */}
            <div className="bg-white rounded-lg p-4 border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search PhilHealth configurations..."
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    {search && (
                        <button
                            onClick={() => { setSearch(''); setPage(1); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <X size={15} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <DataTable
                    columns={columns}
                    data={displayData}
                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRecords ?? 0}
                    paginationDefaultPage={page}
                    onChangePage={(newPage) => setPage(newPage)}
                    onChangeRowsPerPage={(newSize, newPage) => { setPageSize(newSize); setPage(newPage); }}
                    customStyles={customStyles}
                    noDataComponent={
                        <div className="py-8 text-center text-gray-500">No PhilHealth configuration found</div>
                    }
                />
            </div>

            {/* Edit Modal */}
            <ModalComponent
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title="Edit PhilHealth Configuration"
                size="w-[600px]"
                body={
                    <div className="space-y-4 p-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Premium Rate (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={form.ratePercentage}
                                onChange={(e) => setForm({ ...form, ratePercentage: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="e.g. 5.0"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Min Salary Cap (₱) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.minSalary}
                                    onChange={(e) => setForm({ ...form, minSalary: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. 10000.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Max Salary Cap (₱) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.maxSalary}
                                    onChange={(e) => setForm({ ...form, maxSalary: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. 100000.00"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Employee Split Ratio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={form.eeSplitRatio}
                                    onChange={(e) => setForm({ ...form, eeSplitRatio: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. 0.50"
                                />
                                <p className="text-xs text-gray-500 mt-1">50% = 0.50</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Employer Split Ratio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={form.erSplitRatio}
                                    onChange={(e) => setForm({ ...form, erSplitRatio: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. 0.50"
                                />
                                <p className="text-xs text-gray-500 mt-1">50% = 0.50</p>
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    { label: saving ? 'Saving...' : 'Save Changes', type: 'green', onClick: handleSaveEdit, closeOnClick: false },
                    { label: 'Cancel', type: 'red', onClick: () => setEditModal(false) },
                ]}
            />

            {/* Add Modal */}
            <ModalComponent
                isOpen={addModal}
                onClose={() => setAddModal(false)}
                title="Add PhilHealth Configuration"
                size="w-[600px]"
                body={
                    <div className="space-y-4 p-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Premium Rate (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={form.ratePercentage}
                                onChange={(e) => setForm({ ...form, ratePercentage: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="e.g. 5.0"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Min Salary Cap (₱) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.minSalary}
                                    onChange={(e) => setForm({ ...form, minSalary: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. 10000.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Max Salary Cap (₱) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.maxSalary}
                                    onChange={(e) => setForm({ ...form, maxSalary: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. 100000.00"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Employee Split Ratio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={form.eeSplitRatio}
                                    onChange={(e) => setForm({ ...form, eeSplitRatio: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. 0.50"
                                />
                                <p className="text-xs text-gray-500 mt-1">50% = 0.50</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Employer Split Ratio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={form.erSplitRatio}
                                    onChange={(e) => setForm({ ...form, erSplitRatio: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. 0.50"
                                />
                                <p className="text-xs text-gray-500 mt-1">50% = 0.50</p>
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    { label: saving ? 'Saving...' : 'Add Configuration', type: 'green', onClick: handleSaveNew, closeOnClick: false },
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
                        Are you sure you want to delete this PhilHealth configuration? This action cannot be undone.
                    </p>
                }
                buttons={[
                    { label: 'Delete', type: 'red', onClick: handleConfirmDelete },
                    { label: 'Cancel', type: 'blue', onClick: () => setDeleteModal(false) },
                ]}
            />
        </div>
    );
};

export default PhilhealthMatrixTable;
