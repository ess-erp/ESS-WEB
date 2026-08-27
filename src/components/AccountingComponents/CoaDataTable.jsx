import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Lock, ChevronRight, ChevronDown } from 'lucide-react';
import ModalComponent from '../ButtonsComponents/ModalComponent';

// ─── Sample flat data ─────────────────────────────────────────────────────────
// parentCode links a row to its parent (null = root header)
const SAMPLE_ACCOUNTS = [
    { id: 1,  code: '1000', name: 'ASSETS',                      type: 'Asset',     category: 'Header', parentCode: null,   status: 'Active', systemLocked: true  },
    { id: 2,  code: '1100', name: 'Cash & Cash Equivalents',     type: 'Asset',     category: 'Group',  parentCode: '1000', status: 'Active', systemLocked: true  },
    { id: 3,  code: '1110', name: 'Main Operating Bank Account', type: 'Asset',     category: 'Detail', parentCode: '1100', status: 'Active', systemLocked: true  },
    { id: 4,  code: '1120', name: 'Cafeteria Petty Cash',        type: 'Asset',     category: 'Detail', parentCode: '1100', status: 'Active', systemLocked: false },
    { id: 5,  code: '1200', name: 'Receivables',                 type: 'Asset',     category: 'Group',  parentCode: '1000', status: 'Active', systemLocked: true  },
    { id: 6,  code: '1210', name: 'Tuition Receivable',          type: 'Asset',     category: 'Detail', parentCode: '1200', status: 'Active', systemLocked: true  },
    { id: 7,  code: '1220', name: 'Hostel Fee Receivable',       type: 'Asset',     category: 'Detail', parentCode: '1200', status: 'Active', systemLocked: false },
    { id: 8,  code: '2000', name: 'LIABILITIES',                 type: 'Liability', category: 'Header', parentCode: null,   status: 'Active', systemLocked: true  },
    { id: 9,  code: '2100', name: 'Accounts Payable',            type: 'Liability', category: 'Group',  parentCode: '2000', status: 'Active', systemLocked: true  },
    { id: 10, code: '2110', name: 'Trade Payables',              type: 'Liability', category: 'Detail', parentCode: '2100', status: 'Active', systemLocked: false },
    { id: 11, code: '3000', name: 'EQUITY',                      type: 'Equity',    category: 'Header', parentCode: null,   status: 'Active', systemLocked: true  },
    { id: 12, code: '3100', name: "Owner's Equity",              type: 'Equity',    category: 'Detail', parentCode: '3000', status: 'Active', systemLocked: true  },
    { id: 13, code: '4000', name: 'REVENUE',                     type: 'Revenue',   category: 'Header', parentCode: null,   status: 'Active', systemLocked: true  },
    { id: 14, code: '4100', name: 'Academic Fees',               type: 'Revenue',   category: 'Group',  parentCode: '4000', status: 'Active', systemLocked: true  },
    { id: 15, code: '4110', name: 'Tuition Fee Revenue',         type: 'Revenue',   category: 'Detail', parentCode: '4100', status: 'Active', systemLocked: true  },
    { id: 16, code: '4120', name: 'Library & Lab Fees',          type: 'Revenue',   category: 'Detail', parentCode: '4100', status: 'Active', systemLocked: false },
    { id: 17, code: '5000', name: 'EXPENSES',                    type: 'Expense',   category: 'Header', parentCode: null,   status: 'Active', systemLocked: true  },
    { id: 18, code: '5100', name: 'Salaries & Wages',            type: 'Expense',   category: 'Group',  parentCode: '5000', status: 'Active', systemLocked: true  },
    { id: 19, code: '5110', name: 'Teaching Staff Salaries',     type: 'Expense',   category: 'Detail', parentCode: '5100', status: 'Active', systemLocked: false },
    { id: 20, code: '5120', name: 'Administrative Salaries',     type: 'Expense',   category: 'Detail', parentCode: '5100', status: 'Active', systemLocked: false },
];

// ─── Style maps ───────────────────────────────────────────────────────────────
const TYPE_STYLES = {
    Asset:     'bg-blue-100 text-blue-700',
    Liability: 'bg-rose-100 text-rose-700',
    Equity:    'bg-purple-100 text-purple-700',
    Revenue:   'bg-emerald-100 text-emerald-700',
    Expense:   'bg-amber-100 text-amber-700',
};

const ACCOUNT_TYPES      = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
const ACCOUNT_CATEGORIES = ['Header', 'Group', 'Detail'];

const emptyForm = { code: '', name: '', type: '', category: '', parentCode: '', status: 'Active', systemLocked: false };

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a code → node map and attach children arrays */
function buildTree(flatList) {
    const map = {};
    flatList.forEach(a => { map[a.code] = { ...a, children: [] }; });
    const roots = [];
    flatList.forEach(a => {
        if (a.parentCode && map[a.parentCode]) {
            map[a.parentCode].children.push(map[a.code]);
        } else {
            roots.push(map[a.code]);
        }
    });
    return { roots, map };
}

/** Flatten tree into a visible ordered list respecting expanded state */
function flattenVisible(nodes, expandedSet, depth = 0) {
    const result = [];
    nodes.forEach(node => {
        result.push({ ...node, depth });
        const isExpanded = expandedSet.has(node.code);
        if (isExpanded && node.children?.length) {
            result.push(...flattenVisible(node.children, expandedSet, depth + 1));
        }
    });
    return result;
}

/** Collect every descendant code of a node (recursive) */
function collectDescendantCodes(node) {
    const codes = [];
    (node.children || []).forEach(child => {
        codes.push(child.code);
        codes.push(...collectDescendantCodes(child));
    });
    return codes;
}

/** Given a search term, return set of codes that should be visible
 *  (matched node + all its ancestors) */
function getSearchVisibleCodes(roots, term) {
    const visible = new Set();
    function walk(node, ancestors) {
        const matches =
            node.name.toLowerCase().includes(term) ||
            node.code.toLowerCase().includes(term) ||
            node.type.toLowerCase().includes(term);
        const path = [...ancestors, node.code];
        const childMatches = (node.children || []).some(c => walk(c, path));
        if (matches || childMatches) {
            path.forEach(code => visible.add(code));
        }
        return matches || childMatches;
    }
    roots.forEach(r => walk(r, []));
    return visible;
}

// ─── Component ────────────────────────────────────────────────────────────────
const CoaDataTable = () => {
    const [accounts, setAccounts]       = useState(SAMPLE_ACCOUNTS);
    const [filterText, setFilterText]   = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // All expandable codes open by default
    const defaultExpanded = useMemo(
        () => new Set(SAMPLE_ACCOUNTS.filter(a => a.category !== 'Detail').map(a => a.code)),
        []
    );
    const [expandedSet, setExpandedSet] = useState(defaultExpanded);

    // Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConfirmOpen,  setIsConfirmOpen]  = useState(false);
    const [form,   setForm]   = useState(emptyForm);
    const [errors, setErrors] = useState({});

    // ── Tree derivation ───────────────────────────────────────────────────────
    const { roots, map: nodeMap } = useMemo(() => buildTree(accounts), [accounts]);

    // When searching: auto-expand ancestors of matches
    const activeExpandedSet = useMemo(() => {
        if (!filterText.trim()) return expandedSet;
        const term = filterText.toLowerCase();
        const visibleCodes = getSearchVisibleCodes(roots, term);
        // expand everything that has a visible descendant
        return visibleCodes;
    }, [filterText, roots, expandedSet]);

    // Filter roots to only matching subtrees when searching
    const visibleRows = useMemo(() => {
        if (!filterText.trim()) {
            return flattenVisible(roots, expandedSet);
        }
        const term = filterText.toLowerCase();
        const visibleCodes = getSearchVisibleCodes(roots, term);
        // Only include rows whose code is in the visible set
        const all = flattenVisible(roots, activeExpandedSet);
        return all.filter(r => visibleCodes.has(r.code));
    }, [roots, expandedSet, activeExpandedSet, filterText]);

    // ── Pagination ────────────────────────────────────────────────────────────
    const totalRows  = visibleRows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    const safePage   = Math.min(currentPage, totalPages);
    const pageRows   = visibleRows.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

    // ── Toggle expand ─────────────────────────────────────────────────────────
    const toggle = (code) => {
        setExpandedSet(prev => {
            const next = new Set(prev);
            if (next.has(code)) {
                // collapse: also collapse all descendants
                const node = nodeMap[code];
                if (node) collectDescendantCodes(node).forEach(c => next.delete(c));
                next.delete(code);
            } else {
                next.add(code);
            }
            return next;
        });
    };

    const expandAll  = () => setExpandedSet(new Set(accounts.filter(a => a.category !== 'Detail').map(a => a.code)));
    const collapseAll = () => setExpandedSet(new Set());

    // ── Form handlers ─────────────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!form.code.trim()) e.code = 'Account code is required.';
        if (!form.name.trim()) e.name = 'Account name is required.';
        if (!form.type)        e.type = 'Please select a type.';
        if (!form.category)    e.category = 'Please select a category.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleAddClick = () => { if (validate()) { setIsAddModalOpen(false); setIsConfirmOpen(true); } };

    const handleConfirm = () => {
        const newAcc = { ...form, id: accounts.length + 1, systemLocked: !!form.systemLocked, children: [] };
        setAccounts(prev => [...prev, newAcc]);
        setForm(emptyForm);
        setErrors({});
        setIsConfirmOpen(false);
    };

    const handleCancelAdd = () => { setForm(emptyForm); setErrors({}); setIsAddModalOpen(false); };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    // ── Row renderer ──────────────────────────────────────────────────────────
    const renderRow = (row) => {
        const isHeader  = row.category === 'Header';
        const isGroup   = row.category === 'Group';
        const isDetail  = row.category === 'Detail';
        const isExpandable = !isDetail && row.children?.length > 0;
        const isExpanded   = isExpandable && (filterText ? activeExpandedSet.has(row.code) : expandedSet.has(row.code));

        const indent = row.depth * 20; // px

        // Row background
        const rowBg = isHeader
            ? 'bg-gray-50 border-b border-gray-200'
            : isGroup
            ? 'bg-white border-b border-gray-100'
            : 'bg-white border-b border-gray-50 hover:bg-green-50/30';

        return (
            <motion.tr
                key={row.code}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={`${rowBg} transition-colors`}
            >
                {/* Account Name cell — carries the toggle */}
                <td className="py-2.5 px-4" style={{ paddingLeft: `${indent + 16}px` }}>
                    <div className="flex items-center gap-2">
                        {/* Chevron toggle */}
                        {isExpandable ? (
                            <button
                                onClick={() => toggle(row.code)}
                                className="p-0.5 rounded hover:bg-gray-200 transition-colors shrink-0"
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                                {isExpanded
                                    ? <ChevronDown  size={14} className="text-gray-500" />
                                    : <ChevronRight size={14} className="text-gray-500" />
                                }
                            </button>
                        ) : (
                            <span className="w-[22px] shrink-0" /> /* spacer for detail rows */
                        )}

                        {/* Lock icon */}
                        {row.systemLocked && (
                            <Lock size={11} className="text-amber-400 shrink-0" />
                        )}

                        {/* Name */}
                        <span className={
                            isHeader ? 'text-sm font-extrabold text-gray-900 tracking-wide uppercase' :
                            isGroup  ? 'text-sm font-semibold text-gray-800' :
                                       'text-sm text-gray-700'
                        }>
                            {row.name}
                        </span>
                    </div>
                </td>

                {/* Code */}
                <td className="py-2.5 px-4 font-mono text-sm text-gray-500 whitespace-nowrap">
                    {row.code}
                </td>

                {/* Type */}
                <td className="py-2.5 px-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_STYLES[row.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {row.type}
                    </span>
                </td>

                {/* Category */}
                <td className="py-2.5 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        isHeader ? 'bg-gray-200 text-gray-700' :
                        isGroup  ? 'bg-sky-100 text-sky-700' :
                                   'bg-teal-100 text-teal-700'
                    }`}>
                        {row.category}
                    </span>
                </td>

                {/* Status */}
                <td className="py-2.5 px-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                        {row.status}
                    </span>
                </td>
            </motion.tr>
        );
    };

    // ── Add modal body ────────────────────────────────────────────────────────
    const addModalBody = (
        <div className="flex flex-col gap-4 text-left">
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Account Code <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. 1130"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.code ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.code} onChange={e => handleChange('code', e.target.value)} />
                {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Account Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. School Savings Account"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.name} onChange={e => handleChange('name', e.target.value)} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Account Type <span className="text-red-500">*</span></label>
                <select className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.type ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.type} onChange={e => handleChange('type', e.target.value)}>
                    <option value="">— Select Type —</option>
                    {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category <span className="text-red-500">*</span></label>
                <select className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.category ? 'border-red-400' : 'border-gray-300'}`}
                    value={form.category} onChange={e => handleChange('category', e.target.value)}>
                    <option value="">— Select Category —</option>
                    {ACCOUNT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Parent Account</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={form.parentCode} onChange={e => handleChange('parentCode', e.target.value)}>
                    <option value="">— None (Root Header) —</option>
                    {accounts.filter(a => a.category !== 'Detail').map(a => (
                        <option key={a.code} value={a.code}>{a.code} — {a.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={form.status} onChange={e => handleChange('status', e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <input id="systemLocked" type="checkbox" className="w-4 h-4 accent-amber-500"
                    checked={form.systemLocked} onChange={e => handleChange('systemLocked', e.target.checked)} />
                <label htmlFor="systemLocked" className="text-xs font-semibold text-gray-600 select-none cursor-pointer">
                    Mark as System Locked
                </label>
            </div>
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
                        <p className="text-xs text-gray-400 mt-0.5">{totalRows} account{totalRows !== 1 ? 's' : ''} visible</p>
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
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 10A7 7 0 1 1 3 10a7 7 0 0 1 14 0z" />
                            </svg>
                            <input type="text" placeholder="Search accounts..."
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={filterText}
                                onChange={e => { setFilterText(e.target.value); setCurrentPage(1); }} />
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
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="py-3 px-4">Account Name</th>
                                <th className="py-3 px-4 w-32">Code</th>
                                <th className="py-3 px-4 w-32">Type</th>
                                <th className="py-3 px-4 w-28">Category</th>
                                <th className="py-3 px-4 w-28">Status</th>
                            </tr>
                        </thead>
                        <AnimatePresence initial={false}>
                            <tbody>
                                {pageRows.length > 0
                                    ? pageRows.map(row => renderRow(row))
                                    : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                                                No accounts match your search.
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </AnimatePresence>
                    </table>
                </div>

                {/* ── Pagination ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-sm text-gray-600">
                    {/* Rows per page */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs">Rows per page:</span>
                        <select
                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={rowsPerPage}
                            onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        >
                            {ROWS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <span className="text-xs text-gray-400">
                            {totalRows === 0 ? '0' : `${(safePage - 1) * rowsPerPage + 1}–${Math.min(safePage * rowsPerPage, totalRows)}`} of {totalRows}
                        </span>
                    </div>

                    {/* Page controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={safePage === 1}
                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >«</button>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >‹</button>

                        {/* Page number pills */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                            .reduce((acc, p, idx, arr) => {
                                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((item, idx) =>
                                item === '…'
                                    ? <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">…</span>
                                    : (
                                        <button key={item}
                                            onClick={() => setCurrentPage(item)}
                                            className={`px-2.5 py-1 rounded border text-xs transition-colors ${
                                                safePage === item
                                                    ? 'bg-green-600 text-white border-green-600 font-semibold'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >{item}</button>
                                    )
                            )
                        }

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >›</button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={safePage === totalPages}
                            className="px-2 py-1 rounded border border-gray-300 text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >»</button>
                    </div>
                </div>
            </div>

            {/* ── Add Account Modal ── */}
            <ModalComponent
                isOpen={isAddModalOpen}
                onClose={handleCancelAdd}
                title="Add New Account"
                size="w-full max-w-md"
                maxHeight="85vh"
                body={addModalBody}
                buttons={[
                    { label: 'Save Account', type: 'green',  onClick: handleAddClick,      closeOnClick: false },
                    { label: 'Cancel',       type: 'red',    onClick: handleCancelAdd,      closeOnClick: false },
                ]}
            />

            {/* ── Confirm Modal ── */}
            <ModalComponent
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirm New Account"
                size="w-full max-w-sm"
                body={
                    <div className="text-sm text-gray-600 space-y-1 text-left">
                        <p><span className="font-semibold text-gray-800">Code:</span> {form.code}</p>
                        <p><span className="font-semibold text-gray-800">Name:</span> {form.name}</p>
                        <p><span className="font-semibold text-gray-800">Type:</span> {form.type}</p>
                        <p><span className="font-semibold text-gray-800">Category:</span> {form.category}</p>
                        <p><span className="font-semibold text-gray-800">Parent:</span> {form.parentCode || 'None (Root)'}</p>
                        <p><span className="font-semibold text-gray-800">Status:</span> {form.status}</p>
                        <p><span className="font-semibold text-gray-800">System Locked:</span> {form.systemLocked ? 'Yes' : 'No'}</p>
                    </div>
                }
                buttons={[
                    { label: 'Confirm', type: 'green', onClick: handleConfirm, closeOnClick: false },
                    {
                        label: 'Go Back', type: 'red',
                        onClick: () => { setIsConfirmOpen(false); setIsAddModalOpen(true); },
                        closeOnClick: false,
                    },
                ]}
            />
        </div>
    );
};

export default CoaDataTable;
