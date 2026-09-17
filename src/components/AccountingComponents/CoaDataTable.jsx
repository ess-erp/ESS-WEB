import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Lock, Pencil, ChevronRight, ChevronDown } from 'lucide-react';
import ModalComponent from '../ButtonsComponents/ModalComponent';
import {
    fetchGetCoaData,
    fetchInsertCoaData,
    fetchUpdateCoaData,
} from '../../states/AccountingState/Action';

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCOUNT_GROUPS = [
    'Asset',
    'Contra-Asset',
    'Liabilities',
    "Stockholder's Equity",
    'Revenue',
    'Contra-Revenue',
    'Direct Costs',
    'Operating Expenses',
    'Non-Operating Expense',
];

const NORMAL_BALANCES = ['Debit', 'Credit'];

const ACCOUNT_LEVELS = [
    { value: 1, label: 'Level 1 — Header' },
    { value: 2, label: 'Level 2 — Group' },
    { value: 3, label: 'Level 3 — Detail' },
];

const GROUP_BADGE = {
    'Asset':                  'bg-blue-100 text-blue-700',
    'Contra-Asset':           'bg-indigo-100 text-indigo-700',
    'Liabilities':            'bg-rose-100 text-rose-700',
    "Stockholder's Equity":   'bg-purple-100 text-purple-700',
    'Revenue':                'bg-emerald-100 text-emerald-700',
    'Contra-Revenue':         'bg-teal-100 text-teal-700',
    'Direct Costs':           'bg-amber-100 text-amber-700',
    'Operating Expenses':     'bg-orange-100 text-orange-700',
    'Non-Operating Expense':  'bg-red-100 text-red-700',
};

const ROWS_OPTIONS = [10, 20, 50, 100];

const emptyForm = {
    coaMasterId:      '',
    parentCoaChildId: '',
    accountCode:      '',
    accountName:      '',
    accountGroup:     '',
    normalBalance:    '',
    accountLevel:     '',
    activeStatus:     'Y',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Read either camelCase or PascalCase from an API row
const f = (row, camel, pascal) => row[camel] ?? row[pascal];

// Build a nested tree from a flat list using parentCoaChildId / ParentCoaChildId
function buildTree(flat) {
    const map = {};
    flat.forEach(r => {
        const id = f(r, 'coaChildId', 'CoaChildId');
        map[id] = { ...r, _children: [] };
    });
    const roots = [];
    flat.forEach(r => {
        const id       = f(r, 'coaChildId',       'CoaChildId');
        const parentId = f(r, 'parentCoaChildId', 'ParentCoaChildId');
        if (parentId && map[parentId]) {
            map[parentId]._children.push(map[id]);
        } else {
            roots.push(map[id]);
        }
    });
    return roots;
}

// Flatten tree into ordered visible rows respecting expanded set
function flattenVisible(nodes, expandedSet, depth = 0) {
    const result = [];
    nodes.forEach(node => {
        result.push({ ...node, _depth: depth });
        const id = f(node, 'coaChildId', 'CoaChildId');
        if (expandedSet.has(id) && node._children?.length) {
            result.push(...flattenVisible(node._children, expandedSet, depth + 1));
        }
    });
    return result;
}

// Collect all descendant IDs so collapsing a parent also collapses children
function collectDescendants(node) {
    const ids = [];
    (node._children || []).forEach(child => {
        ids.push(f(child, 'coaChildId', 'CoaChildId'));
        ids.push(...collectDescendants(child));
    });
    return ids;
}

// ─── Component ────────────────────────────────────────────────────────────────
const CoaDataTable = () => {
    const dispatch = useDispatch();

    const getCoaState    = useSelector(s => s.accounting.getCoaState    || {});
    const insertCoaState = useSelector(s => s.accounting.insertCoaState || {});
    const updateCoaState = useSelector(s => s.accounting.updateCoaState || {});

    const rawData       = getCoaState.data?.data         || getCoaState.data?.Data         || [];
    const totalRows     = getCoaState.data?.totalRecords  || getCoaState.data?.TotalRecords  || 0;
    const loading       = getCoaState.loading  || false;
    const insertLoading = insertCoaState.loading || false;
    const updateLoading = updateCoaState.loading || false;

    // ── Pagination / search ───────────────────────────────────────────────────
    const [filterText,  setFilterText]  = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ── Tree expand state ─────────────────────────────────────────────────────
    const [expandedSet, setExpandedSet] = useState(new Set());

    // Auto-expand all Level-1 nodes when data arrives
    useEffect(() => {
        if (rawData.length === 0) return;
        const level1Ids = rawData
            .filter(r => f(r, 'accountLevel', 'AccountLevel') === 1)
            .map(r => f(r, 'coaChildId', 'CoaChildId'));
        setExpandedSet(new Set(level1Ids));
    }, [rawData]);

    // ── Build tree + visible rows ─────────────────────────────────────────────
    const treeRoots = useMemo(() => buildTree(rawData), [rawData]);

    const visibleRows = useMemo(
        () => flattenVisible(treeRoots, expandedSet),
        [treeRoots, expandedSet]
    );

    // ── Pagination over visible rows ──────────────────────────────────────────
    const totalVisible = visibleRows.length;
    const totalPages   = Math.max(1, Math.ceil(totalVisible / rowsPerPage));
    const safePage     = Math.min(currentPage, totalPages);
    const pageRows     = visibleRows.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

    // ── Toggle expand ─────────────────────────────────────────────────────────
    const toggleExpand = (node) => {
        const id = f(node, 'coaChildId', 'CoaChildId');
        setExpandedSet(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                collectDescendants(node).forEach(d => next.delete(d));
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandAll = () => {
        const allIds = rawData.map(r => f(r, 'coaChildId', 'CoaChildId'));
        setExpandedSet(new Set(allIds));
    };

    const collapseAll = () => setExpandedSet(new Set());

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const loadData = () => {
        dispatch(fetchGetCoaData(currentPage, rowsPerPage, filterText));
    };

    useEffect(() => {
        loadData();
    }, [currentPage, rowsPerPage, filterText]);

    const handleSearch = (value) => {
        setFilterText(value);
        setCurrentPage(1);
    };

    // ── Parent options for modal dropdowns ────────────────────────────────────
    const parentOptions = useMemo(() =>
        rawData.filter(a => (a.accountLevel ?? a.AccountLevel) < 3),
    [rawData]);

    // ── Modal state ───────────────────────────────────────────────────────────
    const [isAddModalOpen,    setIsAddModalOpen]    = useState(false);
    const [isConfirmOpen,     setIsConfirmOpen]     = useState(false);
    const [isEditModalOpen,   setIsEditModalOpen]   = useState(false);
    const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
    const [isSuccessOpen,     setIsSuccessOpen]     = useState(false);
    const [successMessage,    setSuccessMessage]    = useState('');

    const [addForm,    setAddForm]    = useState(emptyForm);
    const [editForm,   setEditForm]   = useState(emptyForm);
    const [addErrors,  setAddErrors]  = useState({});
    const [editErrors, setEditErrors] = useState({});

    // ── Validation ────────────────────────────────────────────────────────────
    const validate = (form, setErrors) => {
        const e = {};
        if (!form.accountCode.trim()) e.accountCode  = 'Account code is required.';
        if (!form.accountName.trim()) e.accountName  = 'Account name is required.';
        if (!form.accountGroup)       e.accountGroup = 'Please select an account group.';
        if (!form.normalBalance)      e.normalBalance = 'Please select normal balance.';
        if (!form.accountLevel)       e.accountLevel  = 'Please select an account level.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Add handlers ──────────────────────────────────────────────────────────
    const handleAddChange = (field, value) => {
        setAddForm(prev => ({ ...prev, [field]: value }));
        if (addErrors[field]) setAddErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleAddSaveClick = () => {
        if (validate(addForm, setAddErrors)) {
            setIsAddModalOpen(false);
            setIsConfirmOpen(true);
        }
    };

    const handleAddConfirm = async () => {
        const payload = {
            ParentCoaChildId: addForm.parentCoaChildId ? Number(addForm.parentCoaChildId) : null,
            AccountCode:      addForm.accountCode.trim(),
            AccountName:      addForm.accountName.trim(),
            AccountGroup:     addForm.accountGroup,
            NormalBalance:    addForm.normalBalance,
            AccountLevel:     Number(addForm.accountLevel),
            ActiveStatus:     addForm.activeStatus,
        };
        const result = await dispatch(fetchInsertCoaData(payload));
        setIsConfirmOpen(false);
        if (result.ok) {
            setAddForm(emptyForm);
            setAddErrors({});
            setSuccessMessage('Account successfully added.');
            setIsSuccessOpen(true);
            loadData();
        }
    };

    const handleCancelAdd = () => {
        setAddForm(emptyForm);
        setAddErrors({});
        setIsAddModalOpen(false);
    };

    // ── Edit handlers ─────────────────────────────────────────────────────────
    const openEditModal = (row) => {
        setEditForm({
            coaChildId:       f(row, 'coaChildId',       'CoaChildId'),
            coaMasterId:      f(row, 'coaMasterId',       'CoaMasterId')      ?? '',
            parentCoaChildId: f(row, 'parentCoaChildId', 'ParentCoaChildId') ?? '',
            accountCode:      f(row, 'accountCode',      'AccountCode'),
            accountName:      f(row, 'accountName',      'AccountName'),
            accountGroup:     f(row, 'accountGroup',     'AccountGroup'),
            normalBalance:    f(row, 'normalBalance',    'NormalBalance'),
            accountLevel:     f(row, 'accountLevel',     'AccountLevel'),
            activeStatus:     f(row, 'activeStatus',     'ActiveStatus'),
        });
        setEditErrors({});
        setIsEditModalOpen(true);
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
        if (editErrors[field]) setEditErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleEditSaveClick = () => {
        if (validate(editForm, setEditErrors)) {
            setIsEditModalOpen(false);
            setIsEditConfirmOpen(true);
        }
    };

    const handleEditConfirm = async () => {
        const payload = {
            CoaChildId:       Number(editForm.coaChildId),
            ParentCoaChildId: editForm.parentCoaChildId ? Number(editForm.parentCoaChildId) : null,
            AccountCode:      editForm.accountCode.trim(),
            AccountName:      editForm.accountName.trim(),
            AccountGroup:     editForm.accountGroup,
            NormalBalance:    editForm.normalBalance,
            AccountLevel:     Number(editForm.accountLevel),
            ActiveStatus:     editForm.activeStatus,
        };
        const result = await dispatch(fetchUpdateCoaData(payload));
        setIsEditConfirmOpen(false);
        if (result.ok) {
            setEditForm(emptyForm);
            setEditErrors({});
            setSuccessMessage('Account successfully updated.');
            setIsSuccessOpen(true);
            loadData();
        }
    };

    const handleCancelEdit = () => {
        setEditForm(emptyForm);
        setEditErrors({});
        setIsEditModalOpen(false);
    };

    // ── Shared form body ──────────────────────────────────────────────────────
    const buildFormBody = (form, handleChange, errors, parentList) => (
        <div className="flex flex-col gap-4 text-left">
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Parent Account</label>
                <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={form.parentCoaChildId}
                    onChange={e => handleChange('parentCoaChildId', e.target.value)}
                >
                    <option value="">— None (Root / Level 1) —</option>
                    {parentList.map(a => (
                        <option key={a.coaChildId ?? a.CoaChildId} value={a.coaChildId ?? a.CoaChildId}>
                            {a.accountCode ?? a.AccountCode} — {a.accountName ?? a.AccountName}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Account Code <span className="text-red-500">*</span>
                </label>
                <input type="text" placeholder="e.g. 1-1001.12"
                    className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400
                        ${errors.accountCode ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.accountCode}
                    onChange={e => handleChange('accountCode', e.target.value)} />
                {errors.accountCode && <p className="text-xs text-red-500 mt-1">{errors.accountCode}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Account Name <span className="text-red-500">*</span>
                </label>
                <input type="text" placeholder="e.g. Petty Cash - Admin"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400
                        ${errors.accountName ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.accountName}
                    onChange={e => handleChange('accountName', e.target.value)} />
                {errors.accountName && <p className="text-xs text-red-500 mt-1">{errors.accountName}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Account Group <span className="text-red-500">*</span>
                </label>
                <select
                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400
                        ${errors.accountGroup ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.accountGroup}
                    onChange={e => handleChange('accountGroup', e.target.value)}>
                    <option value="">— Select Account Group —</option>
                    {ACCOUNT_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.accountGroup && <p className="text-xs text-red-500 mt-1">{errors.accountGroup}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Normal Balance <span className="text-red-500">*</span>
                </label>
                <select
                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400
                        ${errors.normalBalance ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.normalBalance}
                    onChange={e => handleChange('normalBalance', e.target.value)}>
                    <option value="">— Select Normal Balance —</option>
                    {NORMAL_BALANCES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.normalBalance && <p className="text-xs text-red-500 mt-1">{errors.normalBalance}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Account Level <span className="text-red-500">*</span>
                </label>
                <select
                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400
                        ${errors.accountLevel ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.accountLevel}
                    onChange={e => handleChange('accountLevel', e.target.value)}>
                    <option value="">— Select Level —</option>
                    {ACCOUNT_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                {errors.accountLevel && <p className="text-xs text-red-500 mt-1">{errors.accountLevel}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={form.activeStatus}
                    onChange={e => handleChange('activeStatus', e.target.value)}>
                    <option value="Y">Active</option>
                    <option value="N">Inactive</option>
                </select>
            </div>
        </div>
    );

    const buildConfirmBody = (form) => (
        <div className="text-sm text-gray-600 space-y-2 text-left">
            {form.parentCoaChildId && (
                <p><span className="font-semibold text-gray-800">Parent ID:</span> {form.parentCoaChildId}</p>
            )}
            <p><span className="font-semibold text-gray-800">Code:</span> {form.accountCode}</p>
            <p><span className="font-semibold text-gray-800">Name:</span> {form.accountName}</p>
            <p><span className="font-semibold text-gray-800">Group:</span> {form.accountGroup}</p>
            <p><span className="font-semibold text-gray-800">Normal Balance:</span> {form.normalBalance}</p>
            <p><span className="font-semibold text-gray-800">Level:</span> {form.accountLevel}</p>
            <p><span className="font-semibold text-gray-800">Status:</span> {form.activeStatus === 'Y' ? 'Active' : 'Inactive'}</p>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="pt-2">
            <div className="p-6 bg-white rounded shadow">

                {/* ── Toolbar ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-green-600">Chart of Accounts</h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {totalRows} account{totalRows !== 1 ? 's' : ''} total
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Expand / Collapse all */}
                        <button onClick={expandAll}
                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                            Expand All
                        </button>
                        <button onClick={collapseAll}
                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                            Collapse All
                        </button>

                        {/* Search */}
                        <div className="relative">
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 10A7 7 0 1 1 3 10a7 7 0 0 1 14 0z" />
                            </svg>
                            <input type="text" placeholder="Search code or name..."
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={filterText}
                                onChange={e => handleSearch(e.target.value)} />
                        </div>

                        {/* Add Account */}
                        <button onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                            <Plus size={15} />
                            Add Account
                        </button>
                    </div>
                </div>

                {/* ── Tree Table ── */}
                <div className="rounded-lg border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="py-3 px-4">Account Name</th>
                                <th className="py-3 px-4 w-36">Account Code</th>
                                <th className="py-3 px-4 w-44">Account Group</th>
                                <th className="py-3 px-4 w-36">Normal Balance</th>
                                <th className="py-3 px-4 w-20 text-center">Level</th>
                                <th className="py-3 px-4 w-24 text-center">Status</th>
                                <th className="py-3 px-4 w-14"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                                        Loading accounts...
                                    </td>
                                </tr>
                            ) : pageRows.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                                        No accounts found.
                                    </td>
                                </tr>
                            ) : (
                                pageRows.map((row) => {
                                    const id           = f(row, 'coaChildId',   'CoaChildId');
                                    const code         = f(row, 'accountCode',  'AccountCode');
                                    const name         = f(row, 'accountName',  'AccountName');
                                    const group        = f(row, 'accountGroup', 'AccountGroup');
                                    const nb           = f(row, 'normalBalance','NormalBalance');
                                    const level        = f(row, 'accountLevel', 'AccountLevel');
                                    const status       = f(row, 'activeStatus', 'ActiveStatus');
                                    const depth        = row._depth ?? 0;
                                    const hasChildren  = row._children?.length > 0;
                                    const isExpanded   = expandedSet.has(id);

                                    // Row style by level
                                    const rowBg =
                                        level === 1 ? 'bg-gray-50 border-b border-gray-200' :
                                        level === 2 ? 'bg-white border-b border-gray-100'   :
                                                      'bg-white border-b border-gray-50 hover:bg-green-50/20';

                                    const nameStyle =
                                        level === 1 ? 'text-sm font-extrabold text-gray-900 uppercase tracking-wide' :
                                        level === 2 ? 'text-sm font-semibold text-gray-800' :
                                                      'text-sm text-gray-600';

                                    return (
                                        <motion.tr
                                            key={id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.15 }}
                                            className={`${rowBg} transition-colors`}
                                        >
                                            {/* Account Name — carries indent + toggle */}
                                            <td className="py-2.5 px-4" style={{ paddingLeft: `${depth * 20 + 16}px` }}>
                                                <div className="flex items-center gap-2">
                                                    {/* Chevron toggle — only for rows that have children */}
                                                    {hasChildren ? (
                                                        <button
                                                            onClick={() => toggleExpand(row)}
                                                            className="p-0.5 rounded hover:bg-gray-200 transition-colors shrink-0"
                                                        >
                                                            {isExpanded
                                                                ? <ChevronDown  size={14} className="text-gray-500" />
                                                                : <ChevronRight size={14} className="text-gray-500" />
                                                            }
                                                        </button>
                                                    ) : (
                                                        <span className="w-[22px] shrink-0" />
                                                    )}

                                                    {status !== 'Y' && (
                                                        <Lock size={11} className="text-amber-400 shrink-0" />
                                                    )}

                                                    <span className={nameStyle}>{name}</span>
                                                </div>
                                            </td>

                                            {/* Code */}
                                            <td className="py-2.5 px-4">
                                                <span className="font-mono text-xs text-gray-500">{code}</span>
                                            </td>

                                            {/* Group */}
                                            <td className="py-2.5 px-4">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap
                                                    ${GROUP_BADGE[group] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {group}
                                                </span>
                                            </td>

                                            {/* Normal Balance */}
                                            <td className="py-2.5 px-4">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                                    ${nb === 'Debit' ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700'}`}>
                                                    {nb}
                                                </span>
                                            </td>

                                            {/* Level */}
                                            <td className="py-2.5 px-4 text-center">
                                                <span className="text-xs font-mono text-gray-400">{level}</span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-2.5 px-4 text-center">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                                    ${status === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                    {status === 'Y' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Edit */}
                                            <td className="py-2.5 px-4 text-center">
                                                <button
                                                    onClick={() => openEditModal(row)}
                                                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="text-xs">Rows per page:</span>
                        <select
                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={rowsPerPage}
                            onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        >
                            {ROWS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <span className="text-xs text-gray-400">
                            {totalVisible === 0 ? '0' : `${(safePage - 1) * rowsPerPage + 1}–${Math.min(safePage * rowsPerPage, totalVisible)}`} of {totalVisible} visible
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(1)} disabled={safePage === 1}
                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-40 hover:bg-gray-50">«</button>
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-40 hover:bg-gray-50">‹</button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                            .reduce((acc, p, idx, arr) => {
                                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((item, idx) =>
                                item === '…'
                                    ? <span key={`e${idx}`} className="px-2 text-xs text-gray-400">…</span>
                                    : (
                                        <button key={item} onClick={() => setCurrentPage(item)}
                                            className={`px-2.5 py-1 rounded border text-xs transition-colors
                                                ${safePage === item
                                                    ? 'bg-green-600 text-white border-green-600 font-semibold'
                                                    : 'border-gray-300 hover:bg-gray-50'}`}>
                                            {item}
                                        </button>
                                    )
                            )
                        }

                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-40 hover:bg-gray-50">›</button>
                        <button onClick={() => setCurrentPage(totalPages)} disabled={safePage === totalPages}
                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-40 hover:bg-gray-50">»</button>
                    </div>
                </div>
            </div>

            {/* ── Add Modals ── */}
            <ModalComponent
                isOpen={isAddModalOpen} onClose={handleCancelAdd}
                title="Add New Account" size="w-full max-w-md" maxHeight="85vh"
                body={buildFormBody(addForm, handleAddChange, addErrors, parentOptions)}
                buttons={[
                    { label: insertLoading ? 'Saving...' : 'Save Account', type: 'green', onClick: handleAddSaveClick, closeOnClick: false },
                    { label: 'Cancel', type: 'red', onClick: handleCancelAdd, closeOnClick: false },
                ]}
            />
            <ModalComponent
                isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}
                title="Confirm New Account" size="w-full max-w-sm"
                body={buildConfirmBody(addForm)}
                buttons={[
                    { label: insertLoading ? 'Saving...' : 'Confirm', type: 'green', onClick: handleAddConfirm, closeOnClick: false },
                    { label: 'Go Back', type: 'red', onClick: () => { setIsConfirmOpen(false); setIsAddModalOpen(true); }, closeOnClick: false },
                ]}
            />

            {/* ── Edit Modals ── */}
            <ModalComponent
                isOpen={isEditModalOpen} onClose={handleCancelEdit}
                title="Edit Account" size="w-full max-w-md" maxHeight="85vh"
                body={buildFormBody(editForm, handleEditChange, editErrors, parentOptions)}
                buttons={[
                    { label: updateLoading ? 'Saving...' : 'Save Changes', type: 'green', onClick: handleEditSaveClick, closeOnClick: false },
                    { label: 'Cancel', type: 'red', onClick: handleCancelEdit, closeOnClick: false },
                ]}
            />
            <ModalComponent
                isOpen={isEditConfirmOpen} onClose={() => setIsEditConfirmOpen(false)}
                title="Confirm Changes" size="w-full max-w-sm"
                body={buildConfirmBody(editForm)}
                buttons={[
                    { label: updateLoading ? 'Saving...' : 'Confirm', type: 'green', onClick: handleEditConfirm, closeOnClick: false },
                    { label: 'Go Back', type: 'red', onClick: () => { setIsEditConfirmOpen(false); setIsEditModalOpen(true); }, closeOnClick: false },
                ]}
            />

            {/* ── Success Modal ── */}
            <ModalComponent
                isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)}
                title="Success" size="w-full max-w-sm"
                body={
                    <div className="flex flex-col items-center gap-2 py-2">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-700 text-center">{successMessage}</p>
                    </div>
                }
                buttons={[
                    { label: 'Close', type: 'green', onClick: () => setIsSuccessOpen(false), closeOnClick: false },
                ]}
            />
        </div>
    );
};

export default CoaDataTable;
