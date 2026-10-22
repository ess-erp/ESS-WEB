import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, TrendingUp, TrendingDown, Scale, RefreshCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import { fetchGeneralLedger } from '../../states/AccountingState/Action';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Custom Table Styles ──────────────────────────────────────────────────────
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
            minHeight: '52px',
            '&:hover': { backgroundColor: '#f0fdf4' },
        },
    },
    cells: { style: { paddingLeft: '16px', paddingRight: '16px', fontSize: '13px' } },
};

const GeneralLedgerDataTable = () => {
    const dispatch = useDispatch();
    const { generalLedgerState, schoolYearListState, coaFlatState } = useSelector((state) => state.accounting);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetch data on mount and filter change
    useEffect(() => {
        loadData();
    }, [page, pageSize, selectedSchoolYear, selectedAccount, startDate, endDate]);

    const loadData = () => {
        const payload = {
            Page: page,
            PageSize: pageSize,
            SearchQuery: searchQuery || '',
            SchoolYearId: selectedSchoolYear?.value || null,
            AccountId: selectedAccount?.value || null,
            StartDate: startDate || null,
            EndDate: endDate || null,
        };
        dispatch(fetchGeneralLedger(payload));
    };

    const handleSearch = () => {
        setPage(1);
        loadData();
    };

    const handleReset = () => {
        setSearchQuery('');
        setSelectedSchoolYear(null);
        setSelectedAccount(null);
        setStartDate('');
        setEndDate('');
        setPage(1);
    };

    const handleExport = () => {
        // TODO: Implement export to Excel functionality
        alert('Export coming soon.');
    };

    // School Year options
    const schoolYearOptions = schoolYearListState.data.map(sy => ({
        value: sy.SY_ID || sy.sy_id,
        label: sy.SY_Name || sy.sy_name || `SY ${sy.SY_ID || sy.sy_id}`
    }));

    // COA Account options
    const accountOptions = coaFlatState.data.map(acc => ({
        value: acc.COA_ID || acc.coa_id,
        label: `${acc.COA_Code || acc.coa_code} - ${acc.COA_Title || acc.coa_title}`
    }));

    // Calculate running balance
    const calculateRunningBalance = () => {
        let balance = 0;
        return generalLedgerState.data.map(entry => {
            balance += (entry.Debit || 0) - (entry.Credit || 0);
            return { ...entry, RunningBalance: balance };
        });
    };

    const dataWithBalance = calculateRunningBalance();
    const totalRecords = generalLedgerState.totalRecords || 0;

    // Summary from Redux state
    const totalDebit = generalLedgerState.summary?.totalDebit || 0;
    const totalCredit = generalLedgerState.summary?.totalCredit || 0;
    const netChange = generalLedgerState.summary?.netChange || 0;

    // Columns
    const columns = [
        {
            name: 'Date',
            selector: (r) => r.EntryDate || r.entry_date,
            sortable: true,
            width: '120px',
            cell: (r) => {
                const date = r.EntryDate || r.entry_date;
                if (!date) return '—';
                return new Date(date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
            },
        },
        {
            name: 'Account Code',
            selector: (r) => r.AccountCode || r.account_code,
            sortable: true,
            width: '130px',
            cell: (r) => (
                <span className="font-mono text-xs font-bold">
                    {r.AccountCode || r.account_code || '—'}
                </span>
            ),
        },
        {
            name: 'Account Title',
            selector: (r) => r.AccountTitle || r.account_title,
            sortable: true,
            grow: 2,
            wrap: true,
        },
        {
            name: 'Reference',
            selector: (r) => r.Reference || r.reference,
            sortable: true,
            width: '140px',
        },
        {
            name: 'Description',
            selector: (r) => r.Description || r.description,
            sortable: true,
            grow: 2,
            wrap: true,
        },
        {
            name: 'Debit',
            selector: (r) => Number(r.Debit || r.debit || 0),
            sortable: true,
            width: '140px',
            right: true,
            cell: (r) => {
                const val = r.Debit || r.debit;
                return val ? (
                    <span className="text-blue-600 font-semibold">₱{fmt(val)}</span>
                ) : '—';
            },
        },
        {
            name: 'Credit',
            selector: (r) => Number(r.Credit || r.credit || 0),
            sortable: true,
            width: '140px',
            right: true,
            cell: (r) => {
                const val = r.Credit || r.credit;
                return val ? (
                    <span className="text-green-600 font-semibold">₱{fmt(val)}</span>
                ) : '—';
            },
        },
        {
            name: 'Running Balance',
            selector: (r) => r.RunningBalance,
            sortable: false,
            width: '160px',
            right: true,
            cell: (r) => (
                <span className="font-bold text-gray-900">₱{fmt(r.RunningBalance)}</span>
            ),
        },
    ];

    return (
        <div className="w-full space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div 
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 mb-1 uppercase font-semibold">Total Entries</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalRecords.toLocaleString()}</h3>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                            <Search size={24} className="text-blue-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 mb-1 uppercase font-semibold">Total Debit</p>
                            <h3 className="text-2xl font-bold text-blue-600">₱{fmt(totalDebit)}</h3>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                            <TrendingUp size={24} className="text-blue-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 mb-1 uppercase font-semibold">Total Credit</p>
                            <h3 className="text-2xl font-bold text-green-600">₱{fmt(totalCredit)}</h3>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                            <TrendingDown size={24} className="text-green-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 mb-1 uppercase font-semibold">Net Change</p>
                            <h3 className={`text-2xl font-bold ${netChange >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                                ₱{fmt(netChange)}
                            </h3>
                        </div>
                        <div className="bg-purple-100 rounded-full p-3">
                            <Scale size={24} className="text-purple-600" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <motion.div 
                className="bg-green-600 text-white rounded-t-2xl p-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Search size={20} />
                    General Ledger Entries
                </h3>
                <p className="text-green-100 text-sm mt-1">
                    Statement of all accounting entries with filters
                </p>
            </motion.div>

            {/* Search & Filters */}
            <motion.div 
                className="bg-white rounded-b-2xl border border-gray-200 shadow-sm p-6 space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="By reference, description..."
                                className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* School Year */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">School Year</label>
                        <SearchableSelect
                            options={schoolYearOptions}
                            value={selectedSchoolYear}
                            onChange={setSelectedSchoolYear}
                            placeholder="All School Years"
                        />
                    </div>

                    {/* Account */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Account</label>
                        <SearchableSelect
                            options={accountOptions}
                            value={selectedAccount}
                            onChange={setSelectedAccount}
                            placeholder="All Accounts"
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <motion.button
                        onClick={handleSearch}
                        disabled={generalLedgerState.loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RefreshCw size={16} className={generalLedgerState.loading ? 'animate-spin' : ''} />
                        Search
                    </motion.button>
                    <motion.button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reset Filters
                    </motion.button>
                    <motion.button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors ml-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Download size={16} />
                        Export to Excel
                    </motion.button>
                </div>
            </motion.div>

            {/* Data Table */}
            <motion.div 
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            >
                <DataTable
                    columns={columns}
                    data={dataWithBalance}
                    customStyles={customStyles}
                    progressPending={generalLedgerState.loading}
                    progressComponent={
                        <div className="py-12 flex flex-col items-center">
                            <RefreshCw className="animate-spin text-green-600 mb-2" size={32} />
                            <p className="text-gray-600">Loading general ledger entries...</p>
                        </div>
                    }
                    noDataComponent={
                        <div className="py-12 text-center text-gray-500">
                            <p>No general ledger entries found</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                        </div>
                    }
                    pagination
                    paginationServer
                    paginationTotalRows={totalRecords}
                    paginationPerPage={pageSize}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    onChangePage={(newPage) => setPage(newPage)}
                    onChangeRowsPerPage={(newPageSize) => {
                        setPageSize(newPageSize);
                        setPage(1);
                    }}
                    paginationComponentOptions={{
                        rowsPerPageText: 'Rows per page:',
                        rangeSeparatorText: 'of',
                    }}
                />
            </motion.div>
        </div>
    );
};

export default GeneralLedgerDataTable;
