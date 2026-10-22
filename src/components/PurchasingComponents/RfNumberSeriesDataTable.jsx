import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Eye, Pencil, Plus, Hash, CheckCircle, XCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import InputField from '../ButtonsComponents/InputField';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';

// ─── Constants ────────────────────────────────────────────────────────────────
const CAMPUS_OPTIONS = [
    { value: 'Main Campus', label: 'Main Campus' },
    { value: 'Dasmariñas Campus', label: 'Dasmariñas Campus' },
    { value: 'Imus Campus', label: 'Imus Campus' },
    { value: 'Bacoor Campus', label: 'Bacoor Campus' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const isActive = status === 'Active';
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
            {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {status}
        </span>
    );
};

// ─── Table styles ─────────────────────────────────────────────────────────────
const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#059669',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            minHeight: '48px',
        },
    },
    headCells: { style: { paddingLeft: '14px', paddingRight: '14px' } },
    rows: {
        style: {
            minHeight: '60px',
            '&:hover': { backgroundColor: '#f0fdf4', cursor: 'pointer' },
        },
    },
    cells: { style: { paddingLeft: '14px', paddingRight: '14px' } },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const RfNumberSeriesDataTable = () => {
    const dispatch = useDispatch();

    // Mock data - replace with actual Redux state
    const [seriesList, setSeriesList] = useState([
        {
            id: 1,
            seriesPrefix: 'RF-2026-',
            startNumber: 100001,
            currentNumber: 286272,
            endNumber: 999999,
            campus: 'Main Campus',
            status: 'Active',
            createdDate: '2024-01-15',
        },
        {
            id: 2,
            seriesPrefix: 'RF-DAS-2026-',
            startNumber: 100001,
            currentNumber: 152341,
            endNumber: 999999,
            campus: 'Dasmariñas Campus',
            status: 'Active',
            createdDate: '2024-01-15',
        },
        {
            id: 3,
            seriesPrefix: 'RF-2025-',
            startNumber: 100001,
            currentNumber: 998523,
            endNumber: 999999,
            campus: 'Main Campus',
            status: 'Inactive',
            createdDate: '2023-01-15',
        },
    ]);

    // ── Pagination & filters ──────────────────────────────────────────────────
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [loading, setLoading] = useState(false);

    // ── Modal state ───────────────────────────────────────────────────────────
    const [viewModal, setViewModal] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedSeries, setSelectedSeries] = useState(null);

    // ── Form state ────────────────────────────────────────────────────────────
    const [form, setForm] = useState({
        seriesPrefix: '',
        startNumber: '',
        currentNumber: '',
        endNumber: '',
        campus: null,
        status: 'Active',
    });
    const [formErrors, setFormErrors] = useState({});

    // ── Loading/Success/Error modals ──────────────────────────────────────────
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Start Series Number',
            selector: (row) => row.startNumber,
            sortable: true,
            cell: (row) => <span className="font-mono text-sm font-semibold">{row.startNumber.toLocaleString()}</span>,
            grow: 1,
        },
        {
            name: 'End Series Number',
            selector: (row) => row.endNumber,
            sortable: true,
            cell: (row) => <span className="font-mono text-sm font-semibold">{row.endNumber.toLocaleString()}</span>,
            grow: 1,
        },
        {
            name: 'Date Created',
            selector: (row) => row.createdDate,
            sortable: true,
            cell: (row) => <span className="text-sm">{new Date(row.createdDate).toLocaleDateString('en-PH')}</span>,
            grow: 1,
        },
        {
            name: 'Campus',
            selector: (row) => row.campus,
            sortable: true,
            cell: (row) => <span className="text-sm font-medium">{row.campus}</span>,
            grow: 2,
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => <StatusBadge status={row.status} />,
            center: true,
            grow: 1,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="Edit Series"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>
            ),
            button: true,
            grow: 1,
        },
    ];

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleView = (row) => {
        setSelectedSeries(row);
        setViewModal(true);
    };

    const handleEdit = (row) => {
        setSelectedSeries(row);
        setForm({
            seriesPrefix: row.seriesPrefix,
            startNumber: row.startNumber.toString(),
            currentNumber: row.currentNumber.toString(),
            endNumber: row.endNumber.toString(),
            campus: CAMPUS_OPTIONS.find(c => c.value === row.campus),
            status: row.status,
        });
        setFormErrors({});
        setEditModal(true);
    };

    const handleCreate = () => {
        setForm({
            seriesPrefix: '',
            startNumber: '',
            currentNumber: '',
            endNumber: '',
            campus: null,
            status: 'Active',
        });
        setFormErrors({});
        setCreateModal(true);
    };

    const validateForm = () => {
        const errors = {};
        
        if (!form.seriesPrefix?.trim()) {
            errors.seriesPrefix = 'Series prefix is required';
        }
        if (!form.startNumber?.trim()) {
            errors.startNumber = 'Start number is required';
        } else if (isNaN(form.startNumber) || Number(form.startNumber) < 0) {
            errors.startNumber = 'Must be a valid positive number';
        }
        if (!form.currentNumber?.trim()) {
            errors.currentNumber = 'Current number is required';
        } else if (isNaN(form.currentNumber) || Number(form.currentNumber) < 0) {
            errors.currentNumber = 'Must be a valid positive number';
        }
        if (!form.endNumber?.trim()) {
            errors.endNumber = 'End number is required';
        } else if (isNaN(form.endNumber) || Number(form.endNumber) < 0) {
            errors.endNumber = 'Must be a valid positive number';
        }
        if (!form.campus) {
            errors.campus = 'Campus selection is required';
        }

        // Logical validation
        if (form.startNumber && form.endNumber && 
            Number(form.startNumber) >= Number(form.endNumber)) {
            errors.endNumber = 'End number must be greater than start number';
        }
        if (form.startNumber && form.currentNumber && 
            Number(form.currentNumber) < Number(form.startNumber)) {
            errors.currentNumber = 'Current number cannot be less than start number';
        }
        if (form.currentNumber && form.endNumber && 
            Number(form.currentNumber) > Number(form.endNumber)) {
            errors.currentNumber = 'Current number cannot exceed end number';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitCreate = async () => {
        if (!validateForm()) return;

        setCreateModal(false);
        setIsLoadingModalOpen(true);

        try {
            // TODO: Dispatch actual Redux action
            console.log('Creating RF Series:', form);
            
            // Simulate API call
            setTimeout(() => {
                const newSeries = {
                    id: seriesList.length + 1,
                    seriesPrefix: form.seriesPrefix,
                    startNumber: Number(form.startNumber),
                    currentNumber: Number(form.currentNumber),
                    endNumber: Number(form.endNumber),
                    campus: form.campus.value,
                    status: form.status,
                    createdDate: new Date().toISOString().split('T')[0],
                };
                
                setSeriesList([...seriesList, newSeries]);
                setIsLoadingModalOpen(false);
                setModalMessage('RF Number Series created successfully!');
                setIsSuccessModalOpen(true);
            }, 1000);
        } catch (error) {
            console.error('Error creating series:', error);
            setIsLoadingModalOpen(false);
            setModalMessage('Failed to create RF Number Series. Please try again.');
            setIsErrorModalOpen(true);
        }
    };

    const handleSubmitEdit = async () => {
        if (!validateForm()) return;

        setEditModal(false);
        setIsLoadingModalOpen(true);

        try {
            // TODO: Dispatch actual Redux action
            console.log('Updating RF Series:', selectedSeries.id, form);
            
            // Simulate API call
            setTimeout(() => {
                setSeriesList(seriesList.map(series => 
                    series.id === selectedSeries.id
                        ? {
                            ...series,
                            seriesPrefix: form.seriesPrefix,
                            startNumber: Number(form.startNumber),
                            currentNumber: Number(form.currentNumber),
                            endNumber: Number(form.endNumber),
                            campus: form.campus.value,
                            status: form.status,
                        }
                        : series
                ));
                
                setIsLoadingModalOpen(false);
                setModalMessage('RF Number Series updated successfully!');
                setIsSuccessModalOpen(true);
                setSelectedSeries(null);
            }, 1000);
        } catch (error) {
            console.error('Error updating series:', error);
            setIsLoadingModalOpen(false);
            setModalMessage('Failed to update RF Number Series. Please try again.');
            setIsErrorModalOpen(true);
        }
    };

    const filteredData = seriesList.filter((row) => {
        const matchesSearch = search
            ? row.seriesPrefix?.toLowerCase().includes(search.toLowerCase()) ||
              row.campus?.toLowerCase().includes(search.toLowerCase())
            : true;
        const matchesStatus = statusFilter ? row.status === statusFilter.value : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="w-full pt-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Green Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 sm:py-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Hash size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
                                Requisition Form Number Series
                            </h2>
                            <p className="text-green-100 text-xs sm:text-sm mt-1">
                                Configure and manage requisition form number series for different campuses and units. Ensure proper sequencing and tracking.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search prefix or campus..."
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div className="w-full sm:w-48">
                            <SearchableSelect
                                options={STATUS_OPTIONS}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                placeholder="Status"
                            />
                        </div>

                        {/* Create Button */}
                        <button
                            onClick={handleCreate}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Create RF Series</span>
                        </button>
                    </div>
                </div>

                {/* DataTable */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        paginationPerPage={pageSize}
                        paginationRowsPerPageOptions={[10, 20, 30, 50]}
                        onChangePage={(newPage) => setPage(newPage)}
                        onChangeRowsPerPage={(newPageSize) => setPageSize(newPageSize)}
                        customStyles={customStyles}
                        progressPending={loading}
                        highlightOnHover
                        pointerOnHover
                        responsive
                        noDataComponent={
                            <div className="py-16 text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500 font-medium text-base">No RF number series found</p>
                                    <p className="text-gray-400 text-sm mt-1">Create a new RF series to get started</p>
                                </motion.div>
                            </div>
                        }
                    />
                </div>
            </div>

            {/* View Modal */}
            <ModalComponent
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title="RF Number Series Details"
                size="w-[600px]"
                buttons={[
                    { label: 'Close', type: 'red', onClick: () => setViewModal(false) },
                ]}
            >
                {selectedSeries && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                            <h4 className="font-bold text-lg text-gray-900 mb-1">{selectedSeries.seriesPrefix}</h4>
                            <StatusBadge status={selectedSeries.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Start Number</p>
                                <p className="font-semibold text-lg font-mono">{selectedSeries.startNumber.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">End Number</p>
                                <p className="font-semibold text-lg font-mono">{selectedSeries.endNumber.toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1">Current Number</p>
                            <p className="font-bold text-2xl text-green-600 font-mono">{selectedSeries.currentNumber.toLocaleString()}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Campus / Unit</p>
                                <p className="font-semibold">{selectedSeries.campus}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Numbers Used</p>
                                <p className="font-semibold text-blue-600">
                                    {(selectedSeries.currentNumber - selectedSeries.startNumber).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Numbers Remaining</p>
                                <p className="font-semibold text-purple-600">
                                    {(selectedSeries.endNumber - selectedSeries.currentNumber).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Created Date</p>
                                <p className="font-semibold">{new Date(selectedSeries.createdDate).toLocaleDateString('en-PH')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </ModalComponent>

            {/* Create Modal */}
            <ModalComponent
                isOpen={createModal}
                onClose={() => setCreateModal(false)}
                title="Create RF Number Series"
                size="w-[650px]"
                buttons={[
                    { label: 'Create Series', type: 'green', onClick: handleSubmitCreate },
                    { label: 'Cancel', type: 'red', onClick: () => setCreateModal(false) },
                ]}
            >
                <div className="space-y-4">
                    <InputField
                        label="Series Prefix"
                        type="text"
                        value={form.seriesPrefix}
                        onChange={(e) => setForm({ ...form, seriesPrefix: e.target.value })}
                        error={formErrors.seriesPrefix}
                        placeholder="e.g., RF-2026-"
                        required
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <InputField
                            label="Start Number"
                            type="number"
                            value={form.startNumber}
                            onChange={(e) => setForm({ ...form, startNumber: e.target.value })}
                            error={formErrors.startNumber}
                            placeholder="100001"
                            required
                        />
                        <InputField
                            label="Current Number"
                            type="number"
                            value={form.currentNumber}
                            onChange={(e) => setForm({ ...form, currentNumber: e.target.value })}
                            error={formErrors.currentNumber}
                            placeholder="100001"
                            required
                        />
                        <InputField
                            label="End Number"
                            type="number"
                            value={form.endNumber}
                            onChange={(e) => setForm({ ...form, endNumber: e.target.value })}
                            error={formErrors.endNumber}
                            placeholder="999999"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campus / Unit *</label>
                        <SearchableSelect
                            options={CAMPUS_OPTIONS}
                            value={form.campus}
                            onChange={(val) => setForm({ ...form, campus: val })}
                            placeholder="Select campus"
                            errors={formErrors.campus}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Active"
                                    checked={form.status === 'Active'}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Inactive"
                                    checked={form.status === 'Inactive'}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Inactive</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                            <strong>Note:</strong> The series prefix should be unique. Current number must be between start and end numbers.
                        </p>
                    </div>
                </div>
            </ModalComponent>

            {/* Edit Modal */}
            <ModalComponent
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title="Edit RF Number Series"
                size="w-[650px]"
                buttons={[
                    { label: 'Save Changes', type: 'green', onClick: handleSubmitEdit },
                    { label: 'Cancel', type: 'red', onClick: () => setEditModal(false) },
                ]}
            >
                <div className="space-y-4">
                    <InputField
                        label="Series Prefix"
                        type="text"
                        value={form.seriesPrefix}
                        onChange={(e) => setForm({ ...form, seriesPrefix: e.target.value })}
                        error={formErrors.seriesPrefix}
                        placeholder="e.g., RF-2026-"
                        required
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <InputField
                            label="Start Number"
                            type="number"
                            value={form.startNumber}
                            onChange={(e) => setForm({ ...form, startNumber: e.target.value })}
                            error={formErrors.startNumber}
                            placeholder="100001"
                            required
                        />
                        <InputField
                            label="Current Number"
                            type="number"
                            value={form.currentNumber}
                            onChange={(e) => setForm({ ...form, currentNumber: e.target.value })}
                            error={formErrors.currentNumber}
                            placeholder="100001"
                            required
                        />
                        <InputField
                            label="End Number"
                            type="number"
                            value={form.endNumber}
                            onChange={(e) => setForm({ ...form, endNumber: e.target.value })}
                            error={formErrors.endNumber}
                            placeholder="999999"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campus / Unit *</label>
                        <SearchableSelect
                            options={CAMPUS_OPTIONS}
                            value={form.campus}
                            onChange={(val) => setForm({ ...form, campus: val })}
                            placeholder="Select campus"
                            errors={formErrors.campus}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Active"
                                    checked={form.status === 'Active'}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Inactive"
                                    checked={form.status === 'Inactive'}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Inactive</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-700">
                            <strong>Warning:</strong> Changing the current number may affect existing requisition forms. Proceed with caution.
                        </p>
                    </div>
                </div>
            </ModalComponent>

            {/* Loading Modal */}
            <ModalComponent
                isOpen={isLoadingModalOpen}
                onClose={() => {}}
                title="Processing"
                size="w-[400px]"
                buttons={[]}
            >
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-4"></div>
                    <p className="text-gray-600">Please wait...</p>
                </div>
            </ModalComponent>

            {/* Success Modal */}
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Success"
                size="w-[400px]"
                buttons={[
                    { label: 'OK', type: 'green', onClick: () => setIsSuccessModalOpen(false) },
                ]}
            >
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <p className="text-gray-900 font-medium text-center">{modalMessage}</p>
                </div>
            </ModalComponent>

            {/* Error Modal */}
            <ModalComponent
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title="Error"
                size="w-[400px]"
                buttons={[
                    { label: 'OK', type: 'red', onClick: () => setIsErrorModalOpen(false) },
                ]}
            >
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <p className="text-gray-900 font-medium text-center">{modalMessage}</p>
                </div>
            </ModalComponent>
        </div>
    );
};

export default RfNumberSeriesDataTable;
