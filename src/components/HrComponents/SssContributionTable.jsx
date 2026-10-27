import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Edit, Shield } from 'lucide-react';
import DataTable from 'react-data-table-component';
import { fetchSssTable, updateSssTable } from '../../states/HumanResourcesState/Action';
import { showToast } from '../../states/NotificationState/Action';
import ModalComponent from '../ButtonsComponents/ModalComponent';

// ─── Table styles ─────────────────────────────────────────────────────────────
const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#1e40af',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
        },
    },
    rows: {
        style: { minHeight: '52px', '&:hover': { backgroundColor: '#eff6ff' } },
    },
};

const SssContributionTable = () => {
    const dispatch = useDispatch();
    const { loading, data: sssData } = useSelector((s) => s.hr.sssTableState);
    const { loading: saving } = useSelector((s) => s.hr.updateSssTableState);

    const [tableData, setTableData] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [form, setForm] = useState({
        rangeFrom: '',
        rangeTo: '',
        employeeShare: '',
        employerShare: '',
        wisp: '',
        totalContribution: '',
    });

    useEffect(() => {
        dispatch(fetchSssTable());
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(sssData)) {
            setTableData(sssData);
        }
    }, [sssData]);

    const handleEdit = (row) => {
        setSelectedRow(row);
        setForm({
            rangeFrom: row.RangeFrom ?? row.rangeFrom ?? '',
            rangeTo: row.RangeTo ?? row.rangeTo ?? '',
            employeeShare: row.EmployeeShare ?? row.employeeShare ?? '',
            employerShare: row.EmployerShare ?? row.employerShare ?? '',
            wisp: row.WISP ?? row.wisp ?? '',
            totalContribution: row.TotalContribution ?? row.totalContribution ?? '',
        });
        setEditModal(true);
    };

    const handleSaveEdit = async () => {
        const payload = {
            id: selectedRow.SssId ?? selectedRow.sssId,
            rangeFrom: parseFloat(form.rangeFrom),
            rangeTo: parseFloat(form.rangeTo),
            employeeShare: parseFloat(form.employeeShare),
            employerShare: parseFloat(form.employerShare),
            wisp: parseFloat(form.wisp),
            totalContribution: parseFloat(form.totalContribution),
        };
        const result = await dispatch(updateSssTable(payload));
        if (result.ok) {
            dispatch(showToast('success', 'SSS contribution bracket updated successfully'));
            setEditModal(false);
            dispatch(fetchSssTable());
        } else {
            dispatch(showToast('error', 'Failed to update SSS bracket'));
        }
    };

    const handleAdd = () => {
        setForm({
            rangeFrom: '',
            rangeTo: '',
            employeeShare: '',
            employerShare: '',
            wisp: '',
            totalContribution: '',
        });
        setAddModal(true);
    };

    const handleSaveNew = async () => {
        const payload = {
            rangeFrom: parseFloat(form.rangeFrom),
            rangeTo: parseFloat(form.rangeTo),
            employeeShare: parseFloat(form.employeeShare),
            employerShare: parseFloat(form.employerShare),
            wisp: parseFloat(form.wisp),
            totalContribution: parseFloat(form.totalContribution),
            isNew: true,
        };
        const result = await dispatch(updateSssTable(payload));
        if (result.ok) {
            dispatch(showToast('success', 'New SSS bracket added successfully'));
            setAddModal(false);
            dispatch(fetchSssTable());
        } else {
            dispatch(showToast('error', 'Failed to add SSS bracket'));
        }
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const result = await dispatch(updateSssTable(selectedRow.SssId));
        if (result.ok) {
            dispatch(showToast('success', 'SSS bracket deleted successfully'));
            setDeleteModal(false);
            dispatch(fetchSssTable());
        } else {
            dispatch(showToast('error', 'Failed to delete SSS bracket'));
        }
    };

    const columns = [
        {
            name: 'Range Of Compensation (Monthly)',
            cell: (r) => (
                <span className="text-xs font-semibold">
                    ₱{(r.RangeFrom ?? r.rangeFrom ?? 0).toLocaleString()} - ₱
                    {(r.RangeTo ?? r.rangeTo ?? 0).toLocaleString()}
                </span>
            ),
            width: '250px',
        },
        {
            name: 'Employee Share (EE)',
            selector: (r) => r.EmployeeShare ?? r.employeeShare ?? 0,
            format: (r) => `₱${(r.EmployeeShare ?? r.employeeShare ?? 0).toLocaleString()}`,
            width: '160px',
        },
        {
            name: 'Employer Share (ER)',
            selector: (r) => r.EmployerShare ?? r.employerShare ?? 0,
            format: (r) => `₱${(r.EmployerShare ?? r.employerShare ?? 0).toLocaleString()}`,
            width: '160px',
        },
        {
            name: 'WISP (EE)',
            selector: (r) => r.WISP ?? r.wisp ?? 0,
            format: (r) => `₱${(r.WISP ?? r.wisp ?? 0).toLocaleString()}`,
            width: '140px',
        },
        {
            name: 'Total Contribution',
            selector: (r) => r.TotalContribution ?? r.totalContribution ?? 0,
            cell: (r) => (
                <span className="font-bold text-blue-700">
                    ₱{(r.TotalContribution ?? r.totalContribution ?? 0).toLocaleString()}
                </span>
            ),
            width: '160px',
        },
        {
            name: 'Actions',
            cell: (r) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(r)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
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
                    <Shield className="text-blue-600" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">SSS Contribution Table</h3>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                    <Plus size={16} />
                    Add Bracket
                </button>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> SSS contributions are computed based on monthly salary brackets. Employee
                    Share (EE), Employer Share (ER), and WISP (Workers' Investment and Savings Program) are mandatory
                    contributions.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <DataTable
                    columns={columns}
                    data={tableData}
                    progressPending={loading}
                    customStyles={customStyles}
                    noDataComponent={
                        <div className="py-8 text-center text-gray-500">No SSS brackets configured</div>
                    }
                />
            </div>

            {/* Edit Modal */}
            <ModalComponent
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title="Edit SSS Contribution Bracket"
                body={
                    <div className="space-y-4 p-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Range From</label>
                                <input
                                    type="number"
                                    value={form.rangeFrom}
                                    onChange={(e) => setForm({ ...form, rangeFrom: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Range To</label>
                                <input
                                    type="number"
                                    value={form.rangeTo}
                                    onChange={(e) => setForm({ ...form, rangeTo: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Employee Share (₱)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.employeeShare}
                                    onChange={(e) => setForm({ ...form, employeeShare: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Employer Share (₱)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.employerShare}
                                    onChange={(e) => setForm({ ...form, employerShare: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">WISP (₱)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.wisp}
                                    onChange={(e) => setForm({ ...form, wisp: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Total Contribution (₱)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.totalContribution}
                                    onChange={(e) => setForm({ ...form, totalContribution: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    { label: saving ? 'Saving...' : 'Save Changes', type: 'blue', onClick: handleSaveEdit, disabled: saving },
                    { label: 'Cancel', type: 'red', onClick: () => setEditModal(false) },
                ]}
            />

            {/* Add Modal */}
            <ModalComponent
                isOpen={addModal}
                onClose={() => setAddModal(false)}
                title="Add New SSS Bracket"
                body={
                    <div className="space-y-4 p-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Range From</label>
                                <input
                                    type="number"
                                    value={form.rangeFrom}
                                    onChange={(e) => setForm({ ...form, rangeFrom: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. 4250"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Range To</label>
                                <input
                                    type="number"
                                    value={form.rangeTo}
                                    onChange={(e) => setForm({ ...form, rangeTo: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. 4749.99"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Employee Share (₱)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.employeeShare}
                                    onChange={(e) => setForm({ ...form, employeeShare: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. 180.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Employer Share (₱)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.employerShare}
                                    onChange={(e) => setForm({ ...form, employerShare: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. 630.00"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">WISP (₱)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.wisp}
                                    onChange={(e) => setForm({ ...form, wisp: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. 10.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Total Contribution (₱)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.totalContribution}
                                    onChange={(e) => setForm({ ...form, totalContribution: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. 820.00"
                                />
                            </div>
                        </div>
                    </div>
                }
                buttons={[
                    { label: saving ? 'Saving...' : 'Add Bracket', type: 'green', onClick: handleSaveNew, disabled: saving },
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
                        Are you sure you want to delete this SSS contribution bracket? This action cannot be undone.
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

export default SssContributionTable;
