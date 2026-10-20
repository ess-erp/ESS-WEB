import { useEffect, useState } from 'react';
import { Search, User, DollarSign, TrendingUp, TrendingDown, Eye, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/SharedComponents/Sidebar';
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import DataTable from "react-data-table-component";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";

const StudentLedger = () => {
    useEffect(() => {
        document.title = 'Student Ledger | Accountant';
    }, []);

    const breadcrumbItems = [
        { label: 'Accounting', href: '/accounting/dashboard' },
        { label: 'Student Ledger', href: '/accounting/student-ledger' }
    ];

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock student data
    const mockStudents = [
        {
            id: 1,
            studentId: '2026-001',
            name: 'Juan Dela Cruz',
            grade: 'Grade 7',
            section: 'St. Peter',
            totalBilled: 58500.00,
            totalPaid: 43500.00,
            balance: 15000.00,
            status: 'Partial'
        },
        {
            id: 2,
            studentId: '2026-045',
            name: 'Maria Garcia',
            grade: 'Grade 8',
            section: 'St. Paul',
            totalBilled: 58500.00,
            totalPaid: 58500.00,
            balance: 0.00,
            status: 'Paid'
        },
        {
            id: 3,
            studentId: '2026-089',
            name: 'Pedro Rodriguez',
            grade: 'Grade 9',
            section: 'St. John',
            totalBilled: 61200.00,
            totalPaid: 20000.00,
            balance: 41200.00,
            status: 'Partial'
        },
        {
            id: 4,
            studentId: '2026-112',
            name: 'Ana Santos',
            grade: 'Grade 10',
            section: 'St. Luke',
            totalBilled: 61200.00,
            totalPaid: 0.00,
            balance: 61200.00,
            status: 'Unpaid'
        },
        {
            id: 5,
            studentId: '2026-156',
            name: 'Carlos Reyes',
            grade: 'Grade 11',
            section: 'STEM A',
            totalBilled: 65800.00,
            totalPaid: 65800.00,
            balance: 0.00,
            status: 'Paid'
        },
    ];

    // Mock transaction history
    const mockTransactions = [
        {
            date: '2026-08-15',
            description: 'Tuition Fee - Plan A',
            orNumber: 'OR-2026-00456',
            debit: 45000.00,
            credit: 0,
            balance: 45000.00
        },
        {
            date: '2026-08-15',
            description: 'Miscellaneous Fees',
            orNumber: 'OR-2026-00457',
            debit: 8500.00,
            credit: 0,
            balance: 53500.00
        },
        {
            date: '2026-08-20',
            description: 'Payment - Cash',
            orNumber: 'OR-2026-00501',
            debit: 0,
            credit: 20000.00,
            balance: 33500.00
        },
        {
            date: '2026-08-25',
            description: 'Books and Materials',
            orNumber: 'OR-2026-00523',
            debit: 3200.00,
            credit: 0,
            balance: 36700.00
        },
        {
            date: '2026-09-01',
            description: 'Payment - GCash',
            orNumber: 'OR-2026-00601',
            debit: 0,
            credit: 15000.00,
            balance: 21700.00
        },
    ];

    const columns = [
        {
            name: 'Student ID',
            selector: row => row.studentId,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Student Name',
            selector: row => row.name,
            sortable: true,
            wrap: true
        },
        {
            name: 'Grade & Section',
            selector: row => `${row.grade} - ${row.section}`,
            sortable: true,
            wrap: true,
            width: '180px'
        },
        {
            name: 'Total Billed',
            selector: row => row.totalBilled,
            sortable: true,
            cell: row => `₱${row.totalBilled.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            width: '140px'
        },
        {
            name: 'Total Paid',
            selector: row => row.totalPaid,
            sortable: true,
            cell: row => (
                <span className="text-green-600 font-semibold">
                    ₱{row.totalPaid.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '140px'
        },
        {
            name: 'Balance',
            selector: row => row.balance,
            sortable: true,
            cell: row => (
                <span className={`font-semibold ${row.balance > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    ₱{row.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
            width: '140px'
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => {
                const statusColors = {
                    'Paid': 'bg-green-100 text-green-700',
                    'Partial': 'bg-yellow-100 text-yellow-700',
                    'Unpaid': 'bg-red-100 text-red-700'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[row.status]}`}>
                        {row.status}
                    </span>
                );
            },
            width: '100px'
        },
        {
            name: 'Actions',
            cell: row => (
                <button
                    onClick={() => {
                        setSelectedStudent(row);
                        setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="View Details"
                >
                    <Eye size={16} />
                </button>
            ),
            width: '80px'
        },
    ];

    const filteredStudents = mockStudents.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.studentId.toLowerCase().includes(search.toLowerCase()) ||
        student.grade.toLowerCase().includes(search.toLowerCase())
    );

    // Calculate summary statistics
    const totalStudents = mockStudents.length;
    const totalBilled = mockStudents.reduce((sum, s) => sum + s.totalBilled, 0);
    const totalPaid = mockStudents.reduce((sum, s) => sum + s.totalPaid, 0);
    const totalBalance = mockStudents.reduce((sum, s) => sum + s.balance, 0);

    return (
        <div className={`flex transition-all duration-300 ${sidebarOpen ? "pl-[18.5rem]" : "pl-16"}`}>
            <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-1 min-h-screen bg-gray-50 px-6 py-4"
            >
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-2xl font-bold text-black mt-2"
                    >
                        Student Accounts / Ledger
                    </motion.h2>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-shadow hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
                            </div>
                            <motion.div 
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="bg-blue-100 p-3 rounded-lg"
                            >
                                <User size={24} className="text-blue-600" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-shadow hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Billed</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    ₱{(totalBilled / 1000).toFixed(1)}K
                                </p>
                            </div>
                            <motion.div 
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="bg-purple-100 p-3 rounded-lg"
                            >
                                <FileText size={24} className="text-purple-600" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-shadow hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Collected</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    ₱{(totalPaid / 1000).toFixed(1)}K
                                </p>
                            </div>
                            <motion.div 
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="bg-green-100 p-3 rounded-lg"
                            >
                                <TrendingUp size={24} className="text-green-600" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-shadow hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Outstanding Balance</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">
                                    ₱{(totalBalance / 1000).toFixed(1)}K
                                </p>
                            </div>
                            <motion.div 
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="bg-red-100 p-3 rounded-lg"
                            >
                                <TrendingDown size={24} className="text-red-600" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Student List */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Student Account List</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search students..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 transition-all"
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredStudents}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        customStyles={{
                            headRow: {
                                style: {
                                    backgroundColor: '#059669',
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    borderRadius: '8px 8px 0 0',
                                },
                            },
                            rows: {
                                style: {
                                    minHeight: '56px',
                                    '&:hover': {
                                        backgroundColor: '#f0fdf4',
                                        cursor: 'pointer',
                                        transform: 'scale(1.001)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    },
                                    animation: 'fadeInUp 0.5s ease-in-out',
                                },
                            },
                        }}
                        noDataComponent={
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="py-12 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                                >
                                    <User size={48} className="mx-auto text-gray-300 mb-3" />
                                </motion.div>
                                <p className="text-gray-500">No students found</p>
                            </motion.div>
                        }
                    />
                </motion.div>

                {/* Student Detail Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <ModalComponent
                            isOpen={isModalOpen}
                            onClose={() => {
                                setIsModalOpen(false);
                                setSelectedStudent(null);
                            }}
                            title="Student Account Details"
                            size="w-full max-w-4xl"
                            body={
                                selectedStudent && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {/* Student Info */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
                                        >
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Student Name</p>
                                                    <p className="text-lg font-bold text-gray-900">{selectedStudent.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Student ID</p>
                                                    <p className="text-lg font-bold text-gray-900">{selectedStudent.studentId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Grade & Section</p>
                                                    <p className="text-lg font-bold text-gray-900">{selectedStudent.grade} - {selectedStudent.section}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 font-medium">Status</p>
                                                    <motion.span 
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 200 }}
                                                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                                                            selectedStudent.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                            selectedStudent.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {selectedStudent.status}
                                                    </motion.span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Balance Summary */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <motion.div 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.2 }}
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                            >
                                                <p className="text-sm text-gray-600 font-medium">Total Billed</p>
                                                <p className="text-xl font-bold text-gray-900 mt-1">
                                                    ₱{selectedStudent.totalBilled.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </p>
                                            </motion.div>
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.3 }}
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-green-50 rounded-lg p-4 border border-green-200"
                                            >
                                                <p className="text-sm text-green-700 font-medium">Total Paid</p>
                                                <p className="text-xl font-bold text-green-700 mt-1">
                                                    ₱{selectedStudent.totalPaid.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </p>
                                            </motion.div>
                                            <motion.div 
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.4 }}
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-red-50 rounded-lg p-4 border border-red-200"
                                            >
                                                <p className="text-sm text-red-700 font-medium">Balance Due</p>
                                                <p className="text-xl font-bold text-red-700 mt-1">
                                                    ₱{selectedStudent.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                </p>
                                            </motion.div>
                                        </div>

                                        {/* Transaction History */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.5 }}
                                        >
                                            <h4 className="text-lg font-bold text-gray-900 mb-3">Transaction History</h4>
                                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-green-600">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">Date</th>
                                                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">Description</th>
                                                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">OR Number</th>
                                                            <th className="px-4 py-3 text-right text-xs font-bold text-white uppercase">Debit</th>
                                                            <th className="px-4 py-3 text-right text-xs font-bold text-white uppercase">Credit</th>
                                                            <th className="px-4 py-3 text-right text-xs font-bold text-white uppercase">Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {mockTransactions.map((tx, idx) => (
                                                            <motion.tr 
                                                                key={idx}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ duration: 0.2, delay: 0.6 + (idx * 0.05) }}
                                                                whileHover={{ backgroundColor: '#f9fafb' }}
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-3 text-sm text-gray-900">{tx.date}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">{tx.description}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-600">{tx.orNumber}</td>
                                                                <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                                                                    {tx.debit > 0 ? `₱${tx.debit.toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '—'}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                                                                    {tx.credit > 0 ? `₱${tx.credit.toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '—'}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-right text-gray-900 font-semibold">
                                                                    ₱{tx.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )
                            }
                            buttons={[
                                {
                                    label: "Close",
                                    type: "red",
                                    onClick: () => {
                                        setIsModalOpen(false);
                                        setSelectedStudent(null);
                                    }
                                }
                            ]}
                        />
                    )}
                </AnimatePresence>

                <style jsx>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </motion.div>
        </div>
    );
};

export default StudentLedger;
