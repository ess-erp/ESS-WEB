import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, Home, Search, X } from 'lucide-react';
import DataTable from 'react-data-table-component';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import { fetchPagibigTable, updatePagibigTable } from '../../states/HumanResourcesState/Action';
import { showToast } from '../../states/NotificationState/Action';

// ─── Table styles ─────────────────────────────────────────────────────────────
const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
        },
    },
    rows: {
        style: { minHeight: '52px', '&:hover': { backgroundColor: '#fef2f2' } },
    },
};

const PagibigMatrixTable = () => {
    const dispatch = useDispatch();
    const { loading, data: pagibigData, totalRecords } = useSelector((s) => s.hr.pagibigTableState);
    const { loading: saving } = useSelector((s) => s.hr.updatePagibigTableState);

    // Pagination & Search state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [form, setForm] = useState({
        maxSalaryCap: '',
        eeRateBelow1500: '',
        eeRateAbove1500: '',
        erRate: '',
    });

    // Fetch data with pagination
    const fetchData = useCallback(() => {
        dispatch(fetchPagibigTable(page, pageSize, search));
    }, [page, pageSize, search, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = (row) => {
        setSelectedRow(row);
        setForm({
            maxSalaryCap: row.MaxSalaryCap ?? row.maxSalaryCap ?? '',
            eeRateBelow1500: row.EeRateBelow1500 ?? row.eeRateBelow1500 ?? '',
            eeRateAbove1500: row.EeRateAbove1500 ?? row.eeRateAbove1500 ?? '',
            erRate: row.ErRate ?? row.erRate ?? '',
        });
        setEditModal(true);
    };

    const handleSaveEdit = async () => {
        const payload = {
            id: selectedRow.Id ?? selectedRow.id,
            maxSalaryCap: parseFloat(form.maxSalaryCap),
            eeRateBelow1500: parseFloat(form.eeRateBelow1500),
            eeRateAbove1500: parseFloat(form.eeRateAbove1500),
            erRate: parseFloat(form.erRate),
            status: 'ACTIVE',
        };
        
        const result = await dispatch(updatePagibigTable(payload));
        if (result.ok) {
            dispatch(showToast('success', 'Pag-IBIG configuration updated successfully'));
            setEditModal(false);
            fetchData();
        } else {
            dispatch(showToast('error', 'Failed to update Pag-IBIG configuration'));
        }
    };

    const handleAdd = () => {
        setForm({
            maxSalaryCap: '10000',
            eeRateBelow1500: '0.01',
            eeRateAbove1500: '0.02',
            erRate: '0.02',
        });
        setAddModal(true);
    };

    const handleSaveNew = async () => {
        const payload = {
            maxSalaryCap: parseFloat(form.maxSalaryCap),
            eeRateBelow1500: parseFloat(form.eeRateBelow1500),
            eeRateAbove1500: parseFloat(form.eeRateAbove1500),
            erRate: parseFloat(form.erRate),
            status: 'ACTIVE',
            isNew: true,
        };
        
        const result = await dispatch(updatePagibigTable(payload));
        if (result.ok) {
            dispatch(showToast('success', 'Pag-IBIG configuration added successfully'));
            setAddModal(false);
            fetchData();
        } else {
            dispatch(showToast('error', 'Failed to add Pag-IBIG configuration'));
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
        
        const result = await dispatch(updatePagibigTable(payload));
        if (result.ok) {
            dispatch(showToast('success', 'Pag-IBIG configuration deleted successfully'));
            setDeleteModal(false);
            fetchData();
        } else {
            dispatch(showToast('error', 'Failed to delete Pag-IBIG configuration'));
        }
    };

    // Extract data array from the response object
    const displayData = Array.isArray(pagibigData?.Data) 
        ? pagibigData.Data 
        : Array.isArray(pagibigData) 
        ? pagibigData 
        : [];

    console.log(pagibigData);

    const columns = [
        {
            name: 'Max Salary Cap',
            selector: (r) => r.MaxSalaryCap ?? r.maxSalaryCap,
            format: (r) => `₱${(r.MaxSalaryCap ?? r.maxSalaryCap).toLocaleString()}`,
            width: '180px',
        },
        {
            name: 'EE Rate (< ₱1,500)',
            selector: (r) => r.EeRateBelow1500 ?? r.eeRateBelow1500,
            format: (r) => `${((r.EeRateBelow1500 ?? r.eeRateBelow1500) * 100).toFixed(2)}%`,
            width: '180px',
        },
        {
            name: 'EE Rate (≥ ₱1,500)',
            selector: (r) => r.EeRateAbove1500 ?? r.eeRateAbove1500,
            format: (r) => `${((r.EeRateAbove1500 ?? r.eeRateAbove1500) * 100).toFixed(2)}%`,
            width: '180px',
        },
        {
            name: 'ER Rate',
            selector: (r) => r.ErRate ?? r.erRate,
            format: (r) => `${((r.ErRate ?? r.erRate) * 100).toFixed(2)}%`,
            width: '150px',
        },
        {
            name: 'Status',
            selector: (r) => r.ActiveStatus ?? r.activeStatus,
            cell: (r) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (r.ActiveStatus ?? r.activeStatus) === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {r.ActiveStatus ?? r.activeStatus}
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
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
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
                    <Home className="text-red-600" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">Pag-IBIG Configuration</h3>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                    <Plus size={16} />
                    Add Configuration
                </button>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                <p className="text-sm text-red-800">
                    <strong>Note:</strong> Pag-IBIG contributions have tiered rates based on monthly compensation.
                    Employee contributions below ₱1,500 use a lower rate (1%), while those ≥₱1,500 use 2%. Employer
                    contribution is fixed at 2% with a maximum salary cap.
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
                        placeholder="Search Pag-IBIG configurations..."
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
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
                        <div className="py-8 text-center text-gray-500">No Pag-IBIG configuration found</div>
                    }
                />
            </div>

            {/* Edit Modal */}
            <ModalComponent
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title="Edit Pag-IBIG Configuration"
                size="w-[600px]"
                body={
                    <div className="space-y-4 p-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Max Salary Cap (₱) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.maxSalaryCap}
                                onChange={(e) => setForm({ ...form, maxSalaryCap: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                placeholder="e.g. 10000.00"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Maximum monthly salary used for contribution calculation
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    EE Rate Below ₱1,500 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={form.eeRateBelow1500}
                                    onChange={(e) => setForm({ ...form, eeRateBelow1500: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g. 0.01"
                                />
                                <p className="text-xs text-gray-500 mt-1">1% = 0.01</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    EE Rate Above ₱1,500 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={form.eeRateAbove1500}
                                    onChange={(e) => setForm({ ...form, eeRateAbove1500: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g. 0.02"
                                />
                                <p className="text-xs text-gray-500 mt-1">2% = 0.02</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Employer Rate <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={form.erRate}
                                onChange={(e) => setForm({ ...form, erRate: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                placeholder="e.g. 0.02"
                            />
                            <p className="text-xs text-gray-500 mt-1">2% = 0.02</p>
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
                title="Add Pag-IBIG Configuration"
                size="w-[600px]"
                body={
                    <div className="space-y-4 p-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Max Salary Cap (₱) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.maxSalaryCap}
                                onChange={(e) => setForm({ ...form, maxSalaryCap: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                placeholder="e.g. 10000.00"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Maximum monthly salary used for contribution calculation
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    EE Rate Below ₱1,500 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={form.eeRateBelow1500}
                                    onChange={(e) => setForm({ ...form, eeRateBelow1500: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g. 0.01"
                                />
                                <p className="text-xs text-gray-500 mt-1">1% = 0.01</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    EE Rate Above ₱1,500 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={form.eeRateAbove1500}
                                    onChange={(e) => setForm({ ...form, eeRateAbove1500: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g. 0.02"
                                />
                                <p className="text-xs text-gray-500 mt-1">2% = 0.02</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Employer Rate <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={form.erRate}
                                onChange={(e) => setForm({ ...form, erRate: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                placeholder="e.g. 0.02"
                            />
                            <p className="text-xs text-gray-500 mt-1">2% = 0.02</p>
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
                        Are you sure you want to delete this Pag-IBIG configuration? This action cannot be undone.
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

export default PagibigMatrixTable;
