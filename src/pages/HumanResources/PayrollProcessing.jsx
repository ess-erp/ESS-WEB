import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, DollarSign, Users, Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import { motion } from "framer-motion";
import {
    calculatePayrollForPeriod,
    submitPayrollForApproval,
    fetchPayrollPeriodsData,
    savePayrollRecords,
} from "../../states/HumanResourcesState/Action";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const currency = (val = 0) =>
    `₱${Number(val ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const PayrollProcessing = () => {
    const dispatch = useDispatch();

    // ── Redux state ──────────────────────────────────────────────────────────
    const {
        calculatePayrollForPeriodState = { loading: false, data: null, error: '' },
        submitPayrollForApprovalState  = { loading: false, data: null, error: '' },
        savePayrollRecordsState        = { loading: false, data: null, error: '' },
        payrollPeriodsState            = { loading: false, data: [], error: '' },
    } = useSelector(state => state.hr || {});

    // ── Local state ──────────────────────────────────────────────────────────
    const [selectedPeriod, setSelectedPeriod]   = useState('');
    const [payrollRecords, setPayrollRecords]   = useState([]);

    // ── Modal state ───────────────────────────────────────────────────────────
    const [errorModal,   setErrorModal]   = useState({ open: false, message: '' });
    const [confirmModal, setConfirmModal] = useState({ open: false });
    const [successModal, setSuccessModal] = useState({ open: false, message: '' });

    // ── On mount ─────────────────────────────────────────────────────────────
    useEffect(() => {
        document.title = 'Payroll Processing | HRD';
        dispatch(fetchPayrollPeriodsData());
    }, [dispatch]);

    // ── Clear table when period changes ──────────────────────────────────────
    useEffect(() => {
        setPayrollRecords([]);
    }, [selectedPeriod]);

    // ── Periods dropdown data ─────────────────────────────────────────────────
    const periods = Array.isArray(payrollPeriodsState.data) ? payrollPeriodsState.data : [];

    // ── Aggregate summary from payrollRecords ─────────────────────────────────
    const totalGrossPay   = payrollRecords.reduce((s, r) => s + (r.GrossPay          ?? 0), 0);
    const totalDeductions = payrollRecords.reduce((s, r) => s + (r.TotalDeductions   ?? 0), 0);
    const totalNetPay     = payrollRecords.reduce((s, r) => s + (r.NetPay            ?? 0), 0);
    const totalSSS        = payrollRecords.reduce((s, r) => s + (r.SssEmployeeShare  ?? 0), 0);
    const totalPhilHealth = payrollRecords.reduce((s, r) => s + (r.PhilHealthEmpShare ?? 0), 0);
    const totalPagIbig    = payrollRecords.reduce((s, r) => s + (r.PagIbigEmpShare   ?? 0), 0);
    const totalTax        = payrollRecords.reduce((s, r) => s + (r.WithholdingTax    ?? 0), 0);
    const employeeCount   = payrollRecords.length;

    const isProcessing = calculatePayrollForPeriodState.loading;
    const isSaving     = savePayrollRecordsState.loading;

    // ── Action handlers ───────────────────────────────────────────────────────
    const handleProcessPayroll = async () => {
        if (!selectedPeriod) {
            setErrorModal({ open: true, message: 'Please select a payroll period.' });
            return;
        }

        const result = await dispatch(calculatePayrollForPeriod(parseInt(selectedPeriod)));

        if (result.ok) {
            const records = Array.isArray(result.data) ? result.data : [];
            setPayrollRecords(records);
        } else {
            setErrorModal({ open: true, message: result.error || 'Failed to calculate payroll.' });
        }
    };

    const handleSubmitForApproval = () => {
        if (!selectedPeriod) {
            setErrorModal({ open: true, message: 'Please select a payroll period.' });
            return;
        }
        if (payrollRecords.length === 0) {
            setErrorModal({ open: true, message: 'No payroll data found. Please calculate first.' });
            return;
        }
        // Open confirmation modal; actual save happens on confirm
        setConfirmModal({ open: true });
    };

    const handleConfirmSave = async () => {
        setConfirmModal({ open: false });

        const result = await dispatch(savePayrollRecords(parseInt(selectedPeriod), payrollRecords));

        if (result.ok) {
            setSuccessModal({ open: true, message: result.message || 'Payroll records saved successfully.' });
        } else {
            setErrorModal({ open: true, message: result.error || 'Failed to save payroll records.' });
        }
    };

    // ── DataTable columns (field names match backend PascalCase response) ─────
    const columns = [
        {
            name: 'Employee No.',
            selector: row => row.EmployeeNumber,
            sortable: true,
            width: '130px'
        },
        {
            name: 'Employee Name',
            selector: row => row.EmployeeName,
            sortable: true,
            wrap: true,
            grow: 2
        },
        {
            name: 'Position',
            selector: row => row.Position,
            sortable: true,
            wrap: true,
            width: '120px'
        },
        {
            name: 'Basic Salary',
            selector: row => row.BasicSalary ?? 0,
            sortable: true,
            cell: row => currency(row.BasicSalary),
            right: true,
            width: '130px'
        },
        {
            name: 'Daily Rate',
            selector: row => row.DailyRate ?? 0,
            sortable: true,
            cell: row => currency(row.DailyRate),
            right: true,
            width: '110px'
        },
        {
            name: 'Gross Pay',
            selector: row => row.GrossPay ?? 0,
            sortable: true,
            cell: row => <span className="font-semibold text-green-700">{currency(row.GrossPay)}</span>,
            right: true,
            width: '130px'
        },
        {
            name: 'SSS',
            selector: row => row.SssEmployeeShare ?? 0,
            sortable: true,
            cell: row => currency(row.SssEmployeeShare),
            right: true,
            width: '100px'
        },
        {
            name: 'SSS WISP',
            selector: row => row.SssWisp ?? 0,
            sortable: true,
            cell: row => currency(row.SssWisp),
            right: true,
            width: '100px'
        },
        {
            name: 'PhilHealth',
            selector: row => row.PhilHealthEmpShare ?? 0,
            sortable: true,
            cell: row => currency(row.PhilHealthEmpShare),
            right: true,
            width: '110px'
        },
        {
            name: 'Pag-IBIG',
            selector: row => row.PagIbigEmpShare ?? 0,
            sortable: true,
            cell: row => currency(row.PagIbigEmpShare),
            right: true,
            width: '100px'
        },
        {
            name: 'W/H Tax',
            selector: row => row.WithholdingTax ?? 0,
            sortable: true,
            cell: row => currency(row.WithholdingTax),
            right: true,
            width: '110px'
        },
        {
            name: 'Other Deductions',
            selector: row => row.OtherDeductions ?? 0,
            sortable: true,
            cell: row => currency(row.OtherDeductions),
            right: true,
            width: '140px'
        },
        {
            name: 'Total Deductions',
            selector: row => row.TotalDeductions ?? 0,
            sortable: true,
            cell: row => <span className="font-semibold text-red-600">{currency(row.TotalDeductions)}</span>,
            right: true,
            width: '140px'
        },
        {
            name: 'Net Pay',
            selector: row => row.NetPay ?? 0,
            sortable: true,
            cell: row => <span className="font-bold text-blue-700">{currency(row.NetPay)}</span>,
            right: true,
            width: '130px'
        },
    ];

    const cardVariants = {
        hidden:  { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-4">
                <Breadcrumb items={[
                    { label: 'Human Resources', href: '/hrd/dashboard' },
                    { label: 'Payroll Processing', href: '/hrd/payroll-processing' }
                ]} />
                <h2 className="text-sm font-bold text-black mt-2">Payroll Processing</h2>
            </div>

            <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                <div className="flex flex-col space-y-4 h-full w-full">
                    <hr className="border-t border-gray-400 my-6" />
                    <div className="flex justify-center">
                        <h2 className="text-2xl font-bold text-green-500 mt-2">Payroll Processing</h2>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded" role="alert">
                        <strong className="font-bold">Note: </strong>
                        <span>Select a payroll period, then click <em>Calculate Payroll</em> to run the computation.</span>
                    </div>

                    {/* ── Period Selection ─────────────────────────────────── */}
                    <motion.div
                        initial="hidden" animate="visible" variants={cardVariants} transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-blue-600" />
                            Payroll Period
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Period dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Period <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedPeriod}
                                    onChange={e => setSelectedPeriod(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={payrollPeriodsState.loading}
                                >
                                    <option value="">-- Select Payroll Period --</option>
                                    {periods.map(p => (
                                        <option key={p.PeriodId} value={p.PeriodId}>
                                            {p.PeriodName ?? `Period ${p.PeriodId}`}
                                            {p.StartDate && p.EndDate
                                                ? ` (${new Date(p.StartDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} – ${new Date(p.EndDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })})`
                                                : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Calculate button */}
                            <div className="flex items-end">
                                <button
                                    onClick={handleProcessPayroll}
                                    disabled={!selectedPeriod || isProcessing}
                                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                            Processing…
                                        </>
                                    ) : (
                                        <>
                                            <Calculator size={18} />
                                            Calculate Payroll
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Submit / Save button */}
                            <div className="flex items-end">
                                <button
                                    onClick={handleSubmitForApproval}
                                    disabled={!selectedPeriod || payrollRecords.length === 0 || isSaving}
                                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={18} />
                                            Save Payroll Records
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Summary Cards ────────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Gross Pay',  value: totalGrossPay,   color: 'green',  icon: <DollarSign size={24} className="text-white" /> },
                            { label: 'Total Deductions', value: totalDeductions,  color: 'red',    icon: <AlertCircle size={24} className="text-white" /> },
                            { label: 'Total Net Pay',    value: totalNetPay,      color: 'blue',   icon: <CheckCircle size={24} className="text-white" /> },
                            { label: 'Total Employees',  value: null,             color: 'purple', icon: <Users size={24} className="text-white" />, count: employeeCount },
                        ].map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial="hidden" animate="visible" variants={cardVariants}
                                transition={{ duration: 0.3, delay: 0.1 * (i + 1) }}
                                className={`bg-gradient-to-br from-${card.color}-50 to-${card.color}-100 rounded-xl shadow-sm border border-${card.color}-200 p-5`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm text-${card.color}-700 font-medium`}>{card.label}</p>
                                        <p className={`text-2xl font-bold text-${card.color}-900 mt-1`}>
                                            {card.count !== undefined ? card.count : currency(card.value)}
                                        </p>
                                    </div>
                                    <div className={`bg-${card.color}-600 p-3 rounded-lg`}>{card.icon}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── Statutory Contributions ──────────────────────────── */}
                    <motion.div
                        initial="hidden" animate="visible" variants={cardVariants} transition={{ duration: 0.3, delay: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Statutory Contributions Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'SSS Contributions',      value: totalSSS,        color: 'blue' },
                                { label: 'PhilHealth Contributions', value: totalPhilHealth, color: 'green' },
                                { label: 'Pag-IBIG Contributions',  value: totalPagIbig,    color: 'yellow' },
                                { label: 'Withholding Tax',         value: totalTax,        color: 'red' },
                            ].map(c => (
                                <div key={c.label} className={`bg-${c.color}-50 rounded-lg p-4 border border-${c.color}-200`}>
                                    <p className={`text-sm text-${c.color}-700 font-medium`}>{c.label}</p>
                                    <p className={`text-xl font-bold text-${c.color}-900 mt-1`}>{currency(c.value)}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Employee Payroll Details Table ────────────────────── */}
                    <motion.div
                        initial="hidden" animate="visible" variants={cardVariants} transition={{ duration: 0.3, delay: 0.6 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Employee Payroll Details</h3>
                            {payrollRecords.length > 0 && (
                                <span className="text-sm text-gray-500">
                                    {payrollRecords.length} employee{payrollRecords.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <DataTable
                            columns={columns}
                            data={payrollRecords}
                            pagination
                            highlightOnHover
                            striped
                            responsive
                            progressPending={isProcessing}
                            progressComponent={
                                <div className="py-10 flex flex-col items-center gap-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                                    <p className="text-sm text-gray-500">Calculating payroll…</p>
                                </div>
                            }
                            noDataComponent={
                                <div className="py-12 text-center">
                                    <Calculator size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No payroll data yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Select a period and click "Calculate Payroll"</p>
                                </div>
                            }
                        />
                    </motion.div>

                </div>
            </section>

            {/* ── Error Modal ───────────────────────────────────────────── */}
            <ModalComponent
                isOpen={errorModal.open}
                onClose={() => setErrorModal({ open: false, message: '' })}
                title="Error"
                body={errorModal.message}
                buttons={[
                    { label: 'Close', type: 'red', onClick: () => setErrorModal({ open: false, message: '' }) }
                ]}
            />

            {/* ── Confirm Save Modal ────────────────────────────────────── */}
            <ModalComponent
                isOpen={confirmModal.open}
                onClose={() => setConfirmModal({ open: false })}
                title="Save Payroll Records"
                body={`Save payroll for ${payrollRecords.length} employee(s)? This will persist all computed records.`}
                buttons={[
                    { label: 'Save',   type: 'green', onClick: handleConfirmSave,                               closeOnClick: false },
                    { label: 'Cancel', type: 'red',   onClick: () => setConfirmModal({ open: false }) }
                ]}
            />

            {/* ── Success Modal ─────────────────────────────────────────── */}
            <ModalComponent
                isOpen={successModal.open}
                onClose={() => setSuccessModal({ open: false, message: '' })}
                title="Success"
                body={successModal.message}
                buttons={[
                    { label: 'OK', type: 'green', onClick: () => setSuccessModal({ open: false, message: '' }) }
                ]}
            />
        </div>
    );
};

export default PayrollProcessing;
