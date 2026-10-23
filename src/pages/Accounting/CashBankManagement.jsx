import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
    Upload, 
    Lock, 
    Building2, 
    TrendingUp, 
    TrendingDown, 
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    Save,
    X
} from "lucide-react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import ReconciliationDataTable from "../../components/AccountingComponents/ReconciliationDataTable";
import SearchableSelect from "../../components/ButtonsComponents/SearchableSelect";
import GreenBtn from "../../components/ButtonsComponents/GreenBtn";
import OutlineGreenBtn from "../../components/ButtonsComponents/OutlineGreenBtn";
import BlueBtn from "../../components/ButtonsComponents/BlueBtn";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Mock Data (Replace with Redux/API) ──────────────────────────────────────
const MOCK_BANK_ACCOUNTS = [
    { value: 1, label: "BDO - Operating Account (****1234)" },
    { value: 2, label: "BPI - Payroll Account (****5678)" },
    { value: 3, label: "Metrobank - Savings (****9012)" },
];

const MOCK_BANK_STATEMENT = [
    { id: 1, Date: "2024-01-15", Description: "Tuition Payment - Cash Deposit", Reference: "DEP-2024-001", Amount: 50000, Status: "Uncleared" },
    { id: 2, Date: "2024-01-16", Description: "Supplier Payment - ABC Corp", Reference: "CHK-2024-045", Amount: -25000, Status: "Cleared" },
    { id: 3, Date: "2024-01-17", Description: "Enrollment Fees Collection", Reference: "DEP-2024-002", Amount: 35000, Status: "Uncleared" },
    { id: 4, Date: "2024-01-18", Description: "Utilities Payment - Meralco", Reference: "CHK-2024-046", Amount: -8500, Status: "Cleared" },
    { id: 5, Date: "2024-01-19", Description: "Miscellaneous Fees", Reference: "DEP-2024-003", Amount: 12000, Status: "Uncleared" },
];

const MOCK_GL_ENTRIES = [
    { id: 101, Date: "2024-01-15", Description: "Tuition Revenue - Student Payment", Reference: "JE-2024-150", Amount: 50000, Status: "Uncleared" },
    { id: 102, Date: "2024-01-16", Description: "Accounts Payable - ABC Corp Payment", Reference: "JE-2024-151", Amount: -25000, Status: "Cleared" },
    { id: 103, Date: "2024-01-17", Description: "Enrollment Revenue", Reference: "JE-2024-152", Amount: 35000, Status: "Uncleared" },
    { id: 104, Date: "2024-01-18", Description: "Utilities Expense", Reference: "JE-2024-153", Amount: -8500, Status: "Cleared" },
    { id: 105, Date: "2024-01-20", Description: "Laboratory Fees", Reference: "JE-2024-154", Amount: 15000, Status: "Uncleared" },
];

const CashBankManagement = () => {
    const { isCollapsed } = useSidebar();
    useEffect(() => {
        document.title = "Cash & Bank Management | Accounting";
    }, []);

    const breadcrumbItems = [
        { label: "Dashboard", href: "/accounting/dashboard" },
        { label: "Cash & Bank Management", href: "/accounting/cash-bank" },
    ];

        
    // State
    const [selectedBankAccount, setSelectedBankAccount] = useState(null);
    const [statementPeriod, setStatementPeriod] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });
    const [selectedBankRows, setSelectedBankRows] = useState([]);
    const [selectedGlRows, setSelectedGlRows] = useState([]);
    const [bankStatementData, setBankStatementData] = useState(MOCK_BANK_STATEMENT);
    const [glEntriesData, setGlEntriesData] = useState(MOCK_GL_ENTRIES);

    // ── Calculate KPIs ────────────────────────────────────────────────────────
    const glBookBalance = glEntriesData.reduce((sum, row) => sum + (Number(row.Amount) || 0), 0);
    const bankStatementBalance = bankStatementData.reduce((sum, row) => sum + (Number(row.Amount) || 0), 0);
    const unclearedCount = [...bankStatementData, ...glEntriesData].filter(
        (row) => row.Status === "Uncleared"
    ).length;
    const reconciliationDifference = glBookBalance - bankStatementBalance;
    const isBalanced = Math.abs(reconciliationDifference) < 0.01;

    // ── Calculate Selected Amounts ────────────────────────────────────────────
    const selectedBankAmount = bankStatementData
        .filter(row => selectedBankRows.includes(row.id))
        .reduce((sum, row) => sum + (Number(row.Amount) || 0), 0);

    const selectedGlAmount = glEntriesData
        .filter(row => selectedGlRows.includes(row.id))
        .reduce((sum, row) => sum + (Number(row.Amount) || 0), 0);

    const matchDifference = selectedBankAmount - selectedGlAmount;
    const canMatch = Math.abs(matchDifference) < 0.01 && selectedBankRows.length > 0 && selectedGlRows.length > 0;

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleImportStatement = () => {
        console.log("Import bank statement");
        // TODO: Implement file upload modal
    };

    const handleLockPeriod = () => {
        console.log("Lock reconciliation period");
        // TODO: Implement lock period confirmation modal
    };

    const handleMatchTransactions = () => {
        if (!canMatch) return;

        // Mark selected rows as cleared
        setBankStatementData(prev => 
            prev.map(row => 
                selectedBankRows.includes(row.id) 
                    ? { ...row, Status: "Cleared" } 
                    : row
            )
        );

        setGlEntriesData(prev => 
            prev.map(row => 
                selectedGlRows.includes(row.id) 
                    ? { ...row, Status: "Cleared" } 
                    : row
            )
        );

        // Clear selections
        setSelectedBankRows([]);
        setSelectedGlRows([]);

        console.log("Transactions matched successfully");
    };

    const handleClearSelection = () => {
        setSelectedBankRows([]);
        setSelectedGlRows([]);
    };

    const handleRefresh = () => {
        console.log("Refresh data");
        // TODO: Implement data refresh from API
    };

    return (
        <div className={`min-h-screen bg-gray-50 px-6 py-4 transition-all duration-300 ${
            isCollapsed ? 'ml-16' : 'ml-[18.5rem]'
        }`}>
            
            
            {/* Main Content - Fixed Height Container */}
            <div className="flex-1 h-screen bg-gray-50 overflow-hidden">
                <div className="h-full flex flex-col p-6">
                    {/* Header Section - Fixed */}
                    <div className="flex-none mb-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Breadcrumb items={breadcrumbItems} />
                            <h2 className="text-sm font-bold text-black mt-2">Cash & Bank Management</h2>
                        </motion.div>

                        {/* Title and Controls */}
                        <motion.div
                            className="mt-6 mb-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-green-500">
                                    Bank Reconciliation
                                </h2>
                                <div className="flex gap-2">
                                    <OutlineGreenBtn
                                        btnName="Import Statement"
                                        btnIcon={<Upload className="w-4 h-4" />}
                                        onClick={handleImportStatement}
                                    />
                                    <BlueBtn
                                        btnName="Lock Period"
                                        btnIcon={<Lock className="w-4 h-4" />}
                                        onClick={handleLockPeriod}
                                    />
                                    <button
                                        onClick={handleRefresh}
                                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Refresh"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bank Account
                                    </label>
                                    <SearchableSelect
                                        options={MOCK_BANK_ACCOUNTS}
                                        value={selectedBankAccount}
                                        onChange={setSelectedBankAccount}
                                        placeholder="Select bank account..."
                                    />
                                </div>
                                <div className="w-48">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={statementPeriod.startDate}
                                        onChange={(e) => setStatementPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div className="w-48">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={statementPeriod.endDate}
                                        onChange={(e) => setStatementPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* KPI Cards */}
                        <motion.div
                            className="grid grid-cols-4 gap-4 mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* GL Book Balance */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">GL Book Balance</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">
                                            ₱{fmt(glBookBalance)}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Building2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Bank Statement Balance */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Bank Statement</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">
                                            ₱{fmt(bankStatementBalance)}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Uncleared Items */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Uncleared Items</p>
                                        <p className="text-2xl font-bold text-yellow-600 mt-1">
                                            {unclearedCount}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Reconciliation Difference */}
                            <div className={`bg-white rounded-lg shadow-sm border-2 p-4 ${
                                isBalanced ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
                            }`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-600 uppercase">Difference</p>
                                        <p className={`text-2xl font-bold mt-1 ${
                                            isBalanced ? "text-green-600" : "text-red-600"
                                        }`}>
                                            ₱{fmt(Math.abs(reconciliationDifference))}
                                        </p>
                                    </div>
                                    <div className={`p-2 rounded-lg ${
                                        isBalanced ? "bg-green-200" : "bg-red-200"
                                    }`}>
                                        {isBalanced ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-700" />
                                        ) : (
                                            <TrendingDown className="w-6 h-6 text-red-700" />
                                        )}
                                    </div>
                                </div>
                                {isBalanced && (
                                    <p className="text-xs text-green-600 font-medium mt-1">✓ Balanced</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Matching Control Bar */}
                        {(selectedBankRows.length > 0 || selectedGlRows.length > 0) && (
                            <motion.div
                                className="bg-green-50 border-2 border-green-400 rounded-lg p-4 mb-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Bank Selected</p>
                                            <p className="text-lg font-bold text-green-700">₱{fmt(selectedBankAmount)}</p>
                                        </div>
                                        <div className="text-gray-400 text-2xl">↔</div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">GL Selected</p>
                                            <p className="text-lg font-bold text-blue-700">₱{fmt(selectedGlAmount)}</p>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-xs text-gray-600 font-medium">Difference</p>
                                            <p className={`text-lg font-bold ${
                                                canMatch ? "text-green-600" : "text-red-600"
                                            }`}>
                                                ₱{fmt(Math.abs(matchDifference))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleClearSelection}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Clear
                                        </button>
                                        <GreenBtn
                                            btnName="Match & Clear"
                                            btnIcon={<Save className="w-4 h-4" />}
                                            onClick={handleMatchTransactions}
                                            disabled={!canMatch}
                                        />
                                    </div>
                                </div>
                                {!canMatch && (selectedBankRows.length > 0 || selectedGlRows.length > 0) && (
                                    <p className="text-xs text-red-600 mt-2">
                                        ⚠ Selected amounts must match to reconcile transactions
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Workspace Grid - Takes Remaining Height */}
                    <motion.div
                        className="flex-1 grid grid-cols-2 gap-4 min-h-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {/* Left Panel - Bank Statement Lines */}
                        <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm h-full overflow-hidden">
                            <div className="p-4 flex-none border-b bg-gradient-to-r from-green-600 to-green-700">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Bank Statement Lines
                                </h3>
                                <p className="text-xs text-green-100 mt-1">External bank transactions</p>
                            </div>

                            <ReconciliationDataTable
                                data={bankStatementData}
                                loading={false}
                                onCheckboxChange={setSelectedBankRows}
                                selectedRows={selectedBankRows}
                                type="bank"
                                showSearch={true}
                                showFilters={true}
                            />
                        </div>

                        {/* Right Panel - GL Journal Entries */}
                        <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm h-full overflow-hidden">
                            <div className="p-4 flex-none border-b bg-gradient-to-r from-blue-600 to-blue-700">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    GL Journal Entries
                                </h3>
                                <p className="text-xs text-blue-100 mt-1">Internal cash/bank account transactions</p>
                            </div>

                            <ReconciliationDataTable
                                data={glEntriesData}
                                loading={false}
                                onCheckboxChange={setSelectedGlRows}
                                selectedRows={selectedGlRows}
                                type="gl"
                                showSearch={true}
                                showFilters={true}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CashBankManagement;
