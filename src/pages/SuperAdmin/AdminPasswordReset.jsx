import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Search, KeyRound, Copy, Check, RefreshCw } from "lucide-react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";

const AdminPasswordReset = () => {
    useEffect(() => {
        document.title = "Admin Password Reset | Super Admin";
    }, []);

    // ── Mock Data ────────────────────────────────────────────────────────────
    const [users] = useState([
        {
            id: 1,
            fullName: "Juan Dela Cruz",
            email: "juan.delacruz@setonedu.ph",
            username: "jdelacruz",
            department: "Human Resources",
            role: "HR Admin",
        },
        {
            id: 2,
            fullName: "Maria Santos",
            email: "maria.santos@setonedu.ph",
            username: "msantos",
            department: "Accounting",
            role: "Accountant",
        },
        {
            id: 3,
            fullName: "Pedro Garcia",
            email: "pedro.garcia@setonedu.ph",
            username: "pgarcia",
            department: "SRU",
            role: "Registrar Staff",
        },
        {
            id: 4,
            fullName: "Ana Reyes",
            email: "ana.reyes@setonedu.ph",
            username: "areyes",
            department: "Admission",
            role: "Admission Officer",
        },
        {
            id: 5,
            fullName: "Carlos Ramos",
            email: "carlos.ramos@setonedu.ph",
            username: "cramos",
            department: "Purchasing",
            role: "Purchasing Manager",
        },
        {
            id: 6,
            fullName: "Lisa Mendoza",
            email: "lisa.mendoza@setonedu.ph",
            username: "lmendoza",
            department: "Academic",
            role: "Academic Head",
        },
        {
            id: 7,
            fullName: "Robert Cruz",
            email: "robert.cruz@setonedu.ph",
            username: "rcruz",
            department: "Finance",
            role: "Finance Officer",
        },
        {
            id: 8,
            fullName: "Sofia Torres",
            email: "sofia.torres@setonedu.ph",
            username: "storres",
            department: "Cashier",
            role: "Cashier",
        },
        {
            id: 9,
            fullName: "Miguel Santos",
            email: "miguel.santos@setonedu.ph",
            username: "msantos2",
            department: "CFW",
            role: "CFW Staff",
        },
        {
            id: 10,
            fullName: "Elena Rodriguez",
            email: "elena.rodriguez@setonedu.ph",
            username: "erodriguez",
            department: "Principal",
            role: "Principal",
        },
    ]);

    // ── State ────────────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [requirePasswordChange, setRequirePasswordChange] = useState(true);
    const [copied, setCopied] = useState(false);

    // ── Filter Logic ─────────────────────────────────────────────────────────
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.department.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    // ── Handlers ─────────────────────────────────────────────────────────────
    const generateRandomPassword = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setNewPassword(generateRandomPassword());
        setRequirePasswordChange(true);
        setCopied(false);
        setIsModalOpen(true);
    };

    const handleCopyPassword = async () => {
        try {
            await navigator.clipboard.writeText(newPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert("Failed to copy password");
        }
    };

    const handleResetPassword = () => {
        if (!newPassword || newPassword.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        if (window.confirm(`Reset password for ${selectedUser.fullName}?`)) {
            // Here you would call the API to reset the password
            alert(
                `Password reset successfully for ${selectedUser.fullName}\n\n` +
                `New Password: ${newPassword}\n` +
                `Require password change: ${requirePasswordChange ? "Yes" : "No"}`
            );
            setIsModalOpen(false);
        }
    };

    // ── DataTable Columns ────────────────────────────────────────────────────
    const columns = [
        {
            name: "Full Name & Email",
            cell: (row) => (
                <div className="py-2">
                    <div className="font-semibold text-gray-900">{row.fullName}</div>
                    <div className="text-sm text-gray-500">{row.email}</div>
                </div>
            ),
            sortable: true,
            selector: (row) => row.fullName,
            grow: 2,
        },
        {
            name: "Username",
            selector: (row) => row.username,
            sortable: true,
            cell: (row) => (
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {row.username}
                </span>
            ),
            width: "150px",
        },
        {
            name: "Department",
            selector: (row) => row.department,
            sortable: true,
            width: "150px",
        },
        {
            name: "Role",
            selector: (row) => row.role,
            sortable: true,
            width: "150px",
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    onClick={() => handleOpenModal(row)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
                >
                    <KeyRound size={16} />
                    Reset Password
                </button>
            ),
            ignoreRowClick: true,
            width: "180px",
            center: true,
        },
    ];

    const breadcrumbItems = [
        { label: "Super Admin", href: "/super-admin/dashboard" },
        { label: "Password Reset", href: "/super-admin/password-reset" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-3xl font-bold text-gray-900 mt-2">Admin Password Reset</h2>
                <p className="text-gray-600 mt-1">Reset user passwords and manage account access</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header & Search */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <KeyRound size={28} className="text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">User Directory</h3>
                    </div>

                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, username, or department..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    highlightOnHover
                    responsive
                    noDataComponent={
                        <div className="py-12 text-center text-gray-500">
                            <KeyRound size={48} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">No users found</p>
                            <p className="text-sm">Try adjusting your search query</p>
                        </div>
                    }
                />
            </div>

            {/* Reset Password Modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Reset Password - ${selectedUser?.fullName}`}
                body={
                    <div className="space-y-5 mt-4">
                        {/* User Info */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Username:</span>
                                    <span className="ml-2 font-mono font-semibold">{selectedUser?.username}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Email:</span>
                                    <span className="ml-2 font-medium">{selectedUser?.email}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Department:</span>
                                    <span className="ml-2 font-medium">{selectedUser?.department}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Role:</span>
                                    <span className="ml-2 font-medium">{selectedUser?.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    onClick={handleCopyPassword}
                                    className={`px-4 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
                                        copied
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                    title="Copy password"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                                <button
                                    onClick={() => setNewPassword(generateRandomPassword())}
                                    className="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center gap-2 font-medium"
                                    title="Generate random password"
                                >
                                    <RefreshCw size={18} />
                                    Generate
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Password must be at least 6 characters long. Click "Generate" for a secure random password.
                            </p>
                        </div>

                        {/* Require Password Change */}
                        <div>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    checked={requirePasswordChange}
                                    onChange={(e) => setRequirePasswordChange(e.target.checked)}
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Require password change on next login
                                    </span>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        User will be prompted to change their password immediately after logging in
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Warning Message */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <svg
                                    className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div className="text-sm text-yellow-800">
                                    <p className="font-medium mb-1">Important Security Notice</p>
                                    <p>
                                        Make sure to securely communicate this temporary password to the user. They should
                                        change it immediately upon logging in.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                size="w-[700px]"
                buttons={[
                    {
                        label: "Reset Password",
                        type: "blue",
                        onClick: handleResetPassword,
                        closeOnClick: false,
                    },
                    {
                        label: "Cancel",
                        type: "red",
                        onClick: () => setIsModalOpen(false),
                    },
                ]}
            />
        </div>
    );
};

export default AdminPasswordReset;
