import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Search, Shield, Calendar, Filter } from "lucide-react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import { getFormatDate } from "../../GlobalFunction/FormatDate";

const UserLoginLogs = () => {
    useEffect(() => {
        document.title = "User Login Logs | Super Admin";
    }, []);

    const formatDate = getFormatDate;

    // ── Mock Data ────────────────────────────────────────────────────────────
    const [loginLogs] = useState([
        {
            id: 1,
            timestamp: "2024-11-25 08:15:23",
            fullName: "Juan Dela Cruz",
            username: "jdelacruz",
            department: "Human Resources",
            role: "HR Admin",
            ipAddress: "192.168.1.45",
            browser: "Chrome 120.0",
            device: "Windows 11",
            status: "Success",
        },
        {
            id: 2,
            timestamp: "2024-11-25 08:12:10",
            fullName: "Maria Santos",
            username: "msantos",
            department: "Accounting",
            role: "Accountant",
            ipAddress: "192.168.1.78",
            browser: "Firefox 121.0",
            device: "Windows 10",
            status: "Success",
        },
        {
            id: 3,
            timestamp: "2024-11-25 07:58:45",
            fullName: "Pedro Garcia",
            username: "pgarcia",
            department: "SRU",
            role: "Registrar Staff",
            ipAddress: "192.168.1.92",
            browser: "Edge 120.0",
            device: "Windows 11",
            status: "Failed",
        },
        {
            id: 4,
            timestamp: "2024-11-25 07:45:12",
            fullName: "Ana Reyes",
            username: "areyes",
            department: "Admission",
            role: "Admission Officer",
            ipAddress: "192.168.1.103",
            browser: "Safari 17.0",
            device: "macOS 14",
            status: "Success",
        },
        {
            id: 5,
            timestamp: "2024-11-25 07:30:56",
            fullName: "Carlos Ramos",
            username: "cramos",
            department: "Purchasing",
            role: "Purchasing Manager",
            ipAddress: "192.168.1.65",
            browser: "Chrome 120.0",
            device: "Windows 10",
            status: "Success",
        },
        {
            id: 6,
            timestamp: "2024-11-25 07:22:33",
            fullName: "Lisa Mendoza",
            username: "lmendoza",
            department: "Academic",
            role: "Academic Head",
            ipAddress: "192.168.1.88",
            browser: "Chrome 120.0",
            device: "macOS 14",
            status: "Success",
        },
        {
            id: 7,
            timestamp: "2024-11-25 07:18:41",
            fullName: "Unknown User",
            username: "admin123",
            department: "N/A",
            role: "N/A",
            ipAddress: "203.144.78.221",
            browser: "Chrome 119.0",
            device: "Linux",
            status: "Failed",
        },
        {
            id: 8,
            timestamp: "2024-11-25 07:05:29",
            fullName: "Robert Cruz",
            username: "rcruz",
            department: "Finance",
            role: "Finance Officer",
            ipAddress: "192.168.1.112",
            browser: "Firefox 121.0",
            device: "Windows 11",
            status: "Success",
        },
        {
            id: 9,
            timestamp: "2024-11-25 06:55:17",
            fullName: "Sofia Torres",
            username: "storres",
            department: "Cashier",
            role: "Cashier",
            ipAddress: "192.168.1.54",
            browser: "Edge 120.0",
            device: "Windows 10",
            status: "Success",
        },
        {
            id: 10,
            timestamp: "2024-11-25 06:48:03",
            fullName: "Pedro Garcia",
            username: "pgarcia",
            department: "SRU",
            role: "Registrar Staff",
            ipAddress: "192.168.1.92",
            browser: "Edge 120.0",
            device: "Windows 11",
            status: "Failed",
        },
        {
            id: 11,
            timestamp: "2024-11-24 17:35:22",
            fullName: "Juan Dela Cruz",
            username: "jdelacruz",
            department: "Human Resources",
            role: "HR Admin",
            ipAddress: "192.168.1.45",
            browser: "Chrome 120.0",
            device: "Windows 11",
            status: "Success",
        },
        {
            id: 12,
            timestamp: "2024-11-24 17:12:08",
            fullName: "Maria Santos",
            username: "msantos",
            department: "Accounting",
            role: "Accountant",
            ipAddress: "192.168.1.78",
            browser: "Firefox 121.0",
            device: "Windows 10",
            status: "Success",
        },
    ]);

    // ── State ────────────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterDate, setFilterDate] = useState("All");

    // ── Filter Logic ─────────────────────────────────────────────────────────
    const filteredLogs = loginLogs.filter((log) => {
        const matchesSearch =
            log.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.department.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "All" || log.status === filterStatus;

        // Date filtering
        const logDate = new Date(log.timestamp);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let matchesDate = true;
        if (filterDate === "Today") {
            matchesDate = logDate >= today;
        } else if (filterDate === "Last 7 Days") {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            matchesDate = logDate >= sevenDaysAgo;
        } else if (filterDate === "Last 30 Days") {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            matchesDate = logDate >= thirtyDaysAgo;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    // ── DataTable Columns ────────────────────────────────────────────────────
    const columns = [
        {
            name: "Timestamp",
            selector: (row) => row.timestamp,
            sortable: true,
            cell: (row) => (
                <div className="py-2 text-sm">
                    <div className="font-medium text-gray-900">
                        {new Date(row.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-gray-500 text-xs">
                        {new Date(row.timestamp).toLocaleTimeString()}
                    </div>
                </div>
            ),
            width: "150px",
        },
        {
            name: "User",
            cell: (row) => (
                <div className="py-2">
                    <div className="font-semibold text-gray-900">{row.fullName}</div>
                    <div className="text-sm text-gray-500 font-mono">@{row.username}</div>
                </div>
            ),
            sortable: true,
            selector: (row) => row.fullName,
            grow: 2,
        },
        {
            name: "Department / Role",
            cell: (row) => (
                <div className="py-2 text-sm">
                    <div className="text-gray-900">{row.department}</div>
                    <div className="text-gray-500">{row.role}</div>
                </div>
            ),
            sortable: true,
            selector: (row) => row.department,
            width: "180px",
        },
        {
            name: "IP Address",
            selector: (row) => row.ipAddress,
            sortable: true,
            cell: (row) => (
                <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded border border-blue-200">
                    {row.ipAddress}
                </span>
            ),
            width: "160px",
        },
        {
            name: "Browser / Device",
            cell: (row) => (
                <div className="py-2 text-sm">
                    <div className="text-gray-900">{row.browser}</div>
                    <div className="text-gray-500">{row.device}</div>
                </div>
            ),
            selector: (row) => row.browser,
            width: "160px",
        },
        {
            name: "Status",
            cell: (row) => (
                <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        row.status === "Success"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                >
                    {row.status}
                </span>
            ),
            sortable: true,
            selector: (row) => row.status,
            width: "120px",
            center: true,
        },
    ];

    const breadcrumbItems = [
        { label: "Super Admin", href: "/super-admin/dashboard" },
        { label: "Login Logs", href: "/super-admin/login-logs" },
    ];

    // ── Statistics ───────────────────────────────────────────────────────────
    const totalLogins = filteredLogs.length;
    const successfulLogins = filteredLogs.filter((log) => log.status === "Success").length;
    const failedLogins = filteredLogs.filter((log) => log.status === "Failed").length;
    const successRate = totalLogins > 0 ? ((successfulLogins / totalLogins) * 100).toFixed(1) : 0;

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-3xl font-bold text-gray-900 mt-2">User Login Logs</h2>
                <p className="text-gray-600 mt-1">Monitor and audit user authentication activity</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Logins</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{totalLogins}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Shield className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Successful</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{successfulLogins}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="text-green-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Failed</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">{failedLogins}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <svg className="text-red-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Success Rate</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{successRate}%</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg className="text-purple-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header & Filters */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield size={28} className="text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Authentication Logs</h3>
                    </div>

                    {/* Search & Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search users, IP, or department..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <select
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Success">Success</option>
                            <option value="Failed">Failed</option>
                        </select>

                        <select
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        >
                            <option value="All">All Time</option>
                            <option value="Today">Today</option>
                            <option value="Last 7 Days">Last 7 Days</option>
                            <option value="Last 30 Days">Last 30 Days</option>
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredLogs}
                    pagination
                    highlightOnHover
                    responsive
                    defaultSortFieldId={1}
                    defaultSortAsc={false}
                    noDataComponent={
                        <div className="py-12 text-center text-gray-500">
                            <Shield size={48} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">No login logs found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default UserLoginLogs;
