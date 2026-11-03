import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Search, X, AlertTriangle,
    Clock, LogIn, LogOut, Users, Calendar, Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from 'react-data-table-component';
import { fetchDtrRecords, postBiometricScan, dtrScanRateLimited } from '../../states/HumanResourcesState/Action';
import { showToast } from '../../states/NotificationState/Action';

// ─── Constants ────────────────────────────────────────────────────────────────
const SCAN_COOLDOWN_SECONDS = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDateTime = (raw) => {
    if (!raw) return '—';
    return new Date(raw).toLocaleString('en-PH', {
        year:   'numeric', month:  '2-digit', day:    '2-digit',
        hour:   '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true,
    });
};

const statusConfig = {
    IN:       { bg: 'bg-green-100',  text: 'text-green-700',  label: 'TIME IN'   },
    OUT:      { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'TIME OUT'  },
    LATE:     { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'LATE'      },
    OVERTIME: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'OVERTIME'  },
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status?.toUpperCase()] ?? statusConfig.IN;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
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
    headCells: { style: { paddingLeft: '16px', paddingRight: '16px' } },
    rows: {
        style: {
            minHeight: '60px',
            '&:hover': { backgroundColor: '#f0fdf4', cursor: 'default' },
        },
    },
    cells: { style: { paddingLeft: '16px', paddingRight: '16px' } },
};

// ─── Scan Status Overlay ──────────────────────────────────────────────────────
const ScanOverlay = ({ scanStatus }) => {
    if (!scanStatus) return null;
    const isSuccess = scanStatus.type === 'success';
    return (
        <AnimatePresence>
            <motion.div
                key={scanStatus.id}
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 shadow-lg ${
                    isSuccess
                        ? 'bg-green-50 border-green-400 text-green-800'
                        : 'bg-red-50 border-red-400 text-red-800'
                }`}
            >
                {isSuccess
                    ? <CheckCircle size={28} className="text-green-600 flex-shrink-0" />
                    : <AlertTriangle size={28} className="text-red-600 flex-shrink-0" />
                }
                <div>
                    <p className="font-bold text-sm">{isSuccess ? 'Scan Accepted' : 'Scan Rejected'}</p>
                    <p className="text-sm mt-0.5">{scanStatus.message}</p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DtrDataTable = ({ onAddManualClick }) => {
    const dispatch = useDispatch();

    // ── Redux ─────────────────────────────────────────────────────────────────
    const { loading, data: logsData, totalRecords } = useSelector((s) => s.hr.dtrRecordsState);
    const { loading: scanning } = useSelector((s) => s.hr.postDtrScanState);
    const logs = Array.isArray(logsData) ? logsData : [];

    // ── Pagination & Filter state ─────────────────────────────────────────────
    const [page, setPage]         = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch]     = useState('');
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

    // ── Biometric scan state ──────────────────────────────────────────────────
    const [scanInput, setScanInput]   = useState('');     // Employee No. / ID typed or scanned
    const [scanStatus, setScanStatus] = useState(null);   // { type, message, id }
    const scanInputRef = useRef(null);

    // ── Anti-double-scan rate limiter (in-memory map) ─────────────────────────
    // { [employeeId]: timestamp }
    const lastScanMap = useRef({});

    // ── Rate-limit shake trigger ──────────────────────────────────────────────
    const [shake, setShake] = useState(false);
    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 600);
    };

    // ── Fetch logs ────────────────────────────────────────────────────────────
    const fetchData = useCallback(() => {
        dispatch(fetchDtrRecords({
            page,
            pageSize,
            search,
            startDate: dateFilter,
            endDate: dateFilter,
        }));
    }, [page, pageSize, search, dateFilter, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto-clear scan status overlay after 4 seconds
    useEffect(() => {
        if (!scanStatus) return;
        const t = setTimeout(() => setScanStatus(null), 4000);
        return () => clearTimeout(t);
    }, [scanStatus]);

    // ── Face scan handler ─────────────────────────────────────────────────────
    // In a real integration this is called by the face-api.js detection callback.
    // For manual/keyboard fallback it is also called from the text input submit.
    const handleFaceScan = useCallback(async (employeeData) => {
        const { employeeId, employeeNo, fullName } = employeeData;
        const now      = Date.now();
        const lastScan = lastScanMap.current[employeeId] ?? 0;
        const elapsed  = (now - lastScan) / 1000;

        // ── Rate limit check ──────────────────────────────────────────────────
        if (elapsed < SCAN_COOLDOWN_SECONDS) {
            const remaining = Math.ceil(SCAN_COOLDOWN_SECONDS - elapsed);
            const msg = `Duplicate scan ignored. Please wait ${remaining}s before scanning again for ${fullName}.`;

            dispatch(dtrScanRateLimited({ employeeId, fullName, remaining }));
            dispatch(showToast('error', msg));
            setScanStatus({ type: 'error', message: msg, id: now });
            triggerShake(); // ← red pulse shake on the status area
            return;
        }

        // ── Update last-scan timestamp ────────────────────────────────────────
        lastScanMap.current[employeeId] = now;

        // ── Dispatch scan to backend ──────────────────────────────────────────
        const result = await dispatch(postBiometricScan({
            employeeId,
            employeeNo,
            fullName,
            scanTime: new Date(now).toISOString(),
        }));

        if (result.ok) {
            const scanType = result.data?.ScanType ?? result.data?.scanType ?? 'IN';
            const msg = `${fullName} — ${scanType === 'OUT' ? 'Time-Out' : 'Time-In'} recorded at ${fmtDateTime(new Date(now).toISOString())}`;
            dispatch(showToast('success', msg));
            setScanStatus({ type: 'success', message: msg, id: now });
            fetchData(); // Refresh log table
        } else {
            const msg = `Scan failed for ${fullName}. Please try again.`;
            dispatch(showToast('error', msg));
            setScanStatus({ type: 'error', message: msg, id: now });
            // Roll back rate-limit so they can retry immediately
            delete lastScanMap.current[employeeId];
        }
    }, [dispatch, fetchData]);

    // Manual keyboard input submit (fallback for card reader / barcode input)
    const handleManualScan = async (e) => {
        e.preventDefault();
        const val = scanInput.trim();
        if (!val) return;
        setScanInput('');
        // Build minimal employeeData — backend determines full name from employeeNo
        await handleFaceScan({
            employeeId:  val,   // will be resolved by backend
            employeeNo:  val,
            fullName:    val,   // replaced by backend response
        });
        scanInputRef.current?.focus();
    };

    // ── DataTable columns ─────────────────────────────────────────────────────
    const columns = [
        {
            name: 'Employee No.',
            selector: (r) => r.EmployeeNo ?? r.employeeNo ?? '—',
            sortable: true,
            width: '150px',
            cell: (r) => (
                <span className="text-xs font-mono font-bold text-gray-900">
                    {r.EmployeeNo ?? r.employeeNo ?? '—'}
                </span>
            ),
        },
        {
            name: 'Employee Full Name',
            selector: (r) => r.FullName ?? r.fullName ?? '—',
            sortable: true,
            grow: 2,
            cell: (r) => (
                <span className="text-sm font-semibold text-gray-900">
                    {r.FullName ?? r.fullName ?? '—'}
                </span>
            ),
        },
        {
            name: 'Date & Time In',
            selector: (r) => r.TimeIn ?? r.timeIn,
            sortable: true,
            minWidth: '190px',
            cell: (r) => (
                <div className="flex items-center gap-2 py-1">
                    <LogIn size={14} className="text-green-600 flex-shrink-0" />
                    <span className="text-xs text-gray-800">{fmtDateTime(r.TimeIn ?? r.timeIn)}</span>
                </div>
            ),
        },
        {
            name: 'Date & Time Out',
            selector: (r) => r.TimeOut ?? r.timeOut,
            sortable: true,
            minWidth: '190px',
            cell: (r) => {
                const val = r.TimeOut ?? r.timeOut;
                return val ? (
                    <div className="flex items-center gap-2 py-1">
                        <LogOut size={14} className="text-blue-600 flex-shrink-0" />
                        <span className="text-xs text-gray-800">{fmtDateTime(val)}</span>
                    </div>
                ) : (
                    <span className="text-xs text-green-600 font-semibold italic">Active / On Duty</span>
                );
            },
        },
        {
            name: 'Status',
            selector: (r) => r.Status ?? r.status ?? 'IN',
            sortable: true,
            width: '120px',
            cell: (r) => <StatusBadge status={r.Status ?? r.status ?? 'IN'} />,
        },
    ];

    return (
        // ── Page entrance animation ───────────────────────────────────────────
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* ── DTR Log Table ─────────────────────────────────────────────── */}
            {/* Shake / red-glow on rate-limit rejection */}
            <motion.div
                animate={shake ? {
                    x: [0, -8, 8, -6, 6, -4, 4, 0],
                    boxShadow: ['0 0 0px #f87171', '0 0 16px #f87171', '0 0 0px #f87171'],
                } : {}}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Clock size={20} className="text-white" />
                            <div>
                                <h3 className="text-lg font-bold text-white">DTR Audit Log</h3>
                                <p className="text-green-100 text-xs mt-0.5">Daily time record history</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {onAddManualClick && (
                                <button
                                    onClick={onAddManualClick}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium transition-all shadow-md hover:shadow-lg"
                                >
                                    <Plus size={18} />
                                    Add Manual Attendance
                                </button>
                            )}
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                                <p className="text-xs font-medium">Total Records</p>
                                <p className="text-2xl font-bold">{totalRecords ?? logs.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search by name or employee number..."
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            {search && (
                                <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <X size={15} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                        {/* Date filter */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                                className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>
                </div>

                {/* DataTable — AnimatePresence triggers re-animation on page/filter change */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${page}-${search}-${dateFilter}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                    >
                        <DataTable
                            columns={columns}
                            data={logs}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRecords ?? 0}
                            paginationDefaultPage={page}
                            onChangePage={(newPage) => setPage(newPage)}
                            onChangeRowsPerPage={(newSize, newPage) => { setPageSize(newSize); setPage(newPage); }}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            customStyles={customStyles}
                            noDataComponent={
                                <div className="py-14 text-center">
                                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No DTR records found</p>
                                    <p className="text-gray-400 text-sm mt-1">Try adjusting the date or search filter</p>
                                </div>
                            }
                        />
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default DtrDataTable;
