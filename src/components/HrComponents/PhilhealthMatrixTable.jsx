import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, Hospital } from 'lucide-react';
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
    const { loading, data: philhealthData } = useSelector((s) => s.hr.philhealthTableState);
    const { loading: saving } = useSelector((s) => s.hr.updatePhilhealthTableState);

    const [tableData, setTableData] = useState({});
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

    useEffect(() => {
        dispatch(fetchPhilhealthTable());
    }, [dispatch]);

    useEffect(() => {
        if (philhealthData && typeof philhealthData === 'object') {
            setTableData(philhealthData);
        }
    }, [philhealthData]);

    const handleEdit = () => {
        if (!tableData || !tableData.Id) return;
        setSelectedRow(tableData);
        setForm({
            ratePercentage: tableData.RatePercentage ?? tableData.ratePercentage ?? '',
            minSalary: tableData.MinSalary ?? tableData.minSalary ?? '',
            maxSalary: tableData.MaxSalary ?? tableData.maxSalary ?? '',
            eeSplitRatio: tableData.EeSplitRatio ?? tableData.eeSplitRatio ?? '',
            erSplitRatio: tableData.ErSplitRatio ?? tableData.erSplitRatio ?? '',
        });
        setEditModal(true);
    };

    const handleSaveEdit = async () => {
        const payload = {
            id: tableData.Id ?? tableData.id,
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
            dispatch(fetchPhilhealthTable());
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
            dispatch(fetchPhilhealthTable());
        } else {
            dispatch(showToast('error', 'Failed to add PhilHealth configuration'));
        }
    };

    const handleDelete = () => {
        if (!tableData || !tableData.Id) return;
        setSelectedRow(tableData);
        setDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const payload = {
            id: tableData.Id ?? tableData.id,
            isDeleted: true,
        };
        
        const result = await dispatch(updatePhilhealthTable(payload));
        if (result.ok) {
            dispatch(showToast('success', 'PhilHealth configuration deleted successfully'));
            setDeleteModal(false);
            dispatch(fetchPhilhealthTable());
        } else {
            dispatch(showToast('error', 'Failed to delete PhilHealth configuration'));
        }
    };

    // Display single row if data exists
    const displayData = tableData && tableData.Id ? [tableData] : [];

    const columns = [
        {
            name: 'Premium Rate (%)',
            selector: (r) => r.RatePercentage ?? r.ratePercentage,
            format: (r) => `${r.RatePercentage ?? r.ratePercentage}%`,
            width: '150px',
        },
        {
            name: 'Min Salary Cap',
            selector: (r) => r.MinSalary ?? r.minSalary,
            format: (r) => `₱${(r.MinSalary ?? r.minSalary).toLocaleString()}`,
            width: '180px',
        },
        {
            name: 'Max Salary Cap',
            selector: (r) => r.MaxSalary ?? r.maxSalary,
            format: (r) => `₱${(r.MaxSalary ?? r.maxSalary).toLocaleString()}`,
            width: '180px',
        },
        {
            name: 'Employee Split',
            selector: (r) => r.EeSplitRatio ?? r.eeSplitRatio,
            format: (r) => `${((r.EeSplitRatio ?? r.eeSplitRatio) * 100).toFixed(0)}%`,
            width: '150px',
        },
        {
            name: 'Employer Split',
            selector: (r) => r.ErSplitRatio ?? r.erSplitRatio,
            format: (r) => `${((r.ErSplitRatio ?? r.erSplitRatio) * 100).toFixed(0)}%`,
            width: '150px',
        },
        {
            name: 'Status',
            selector: (r) => r.Status ?? r.status,
            cell: (r) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (r.Status ?? r.status) === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {r.Status ?? r.status}
                </span>
            ),
            width: '120px',
        },
        {
            name: 'Actions',
            cell: (r) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit()}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                        title="Edit"
                    >
                        <Edit size={15} />
                    </button>
                    <button
                        onClick={() => handleDelete()}
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

            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <DataTable
                    columns={columns}
                    data={displayData}
                    progressPending={loading}
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
