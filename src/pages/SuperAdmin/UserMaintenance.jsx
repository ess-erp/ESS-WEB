import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import { Search, Plus, Edit, Power, UserCog, X } from "lucide-react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../../components/ButtonsComponents/OutlineBlueBtn";
import { ROLE_NAMES } from "../../utils/roleUtils";

const UserMaintenance = () => {
    useEffect(() => {
        document.title = "User Maintenance | Super Admin";
    }, []);

    // ── Mock Data ────────────────────────────────────────────────────────────
    const [users, setUsers] = useState([
        {
            id: 1,
            fullName: "Juan Dela Cruz",
            email: "juan.delacruz@setonedu.ph",
            username: "jdelacruz",
            department: "Human Resources",
            roles: ["HR Admin", "HR Staff"],
            status: "Active",
        },
        {
            id: 2,
            fullName: "Maria Santos",
            email: "maria.santos@setonedu.ph",
            username: "msantos",
            department: "Accounting",
            roles: ["Accountant"],
            status: "Active",
        },
        {
            id: 3,
            fullName: "Pedro Garcia",
            email: "pedro.garcia@setonedu.ph",
            username: "pgarcia",
            department: "SRU",
            roles: ["Registrar Staff"],
            status: "Suspended",
        },
        {
            id: 4,
            fullName: "Ana Reyes",
            email: "ana.reyes@setonedu.ph",
            username: "areyes",
            department: "Admission",
            roles: ["Admission Officer"],
            status: "Active",
        },
        {
            id: 5,
            fullName: "Carlos Ramos",
            email: "carlos.ramos@setonedu.ph",
            username: "cramos",
            department: "Purchasing",
            roles: ["Purchasing Manager", "Finance Officer"],
            status: "Inactive",
        },
        {
            id: 6,
            fullName: "Lisa Mendoza",
            email: "lisa.mendoza@setonedu.ph",
            username: "lmendoza",
            department: "Academic",
            roles: ["Academic Head"],
            status: "Active",
        },
        {
            id: 7,
            fullName: "Robert Cruz",
            email: "robert.cruz@setonedu.ph",
            username: "rcruz",
            department: "Finance",
            roles: ["Finance Officer", "Accountant"],
            status: "Active",
        },
        {
            id: 8,
            fullName: "Sofia Torres",
            email: "sofia.torres@setonedu.ph",
            username: "storres",
            department: "Cashier",
            roles: ["Cashier"],
            status: "Active",
        },
        {
            id: 9,
            fullName: "Miguel Santos",
            email: "miguel.santos@setonedu.ph",
            username: "msantos2",
            department: "CFW",
            roles: ["CFW Staff"],
            status: "Active",
        },
        {
            id: 10,
            fullName: "Elena Rodriguez",
            email: "elena.rodriguez@setonedu.ph",
            username: "erodriguez",
            department: "Principal",
            roles: ["Principal", "Super Admin"],
            status: "Active",
        },
    ]);

    const departments = ["All", "Academic", "CFW", "SRU", "Admission", "Sac", "Principal", "Parent Portal", "Finance", "Human Resources", "Student", "Cashier", "Assistant Principal", "Accounting", "Purchasing"];
    const roles = ["HR Admin", "HR Staff", "Accountant", "Registrar Staff", "Admission Officer", "Purchasing Manager", "Academic Head", "Finance Officer", "Cashier", "Super Admin", "CFW Staff", "Principal", "Assistant Principal"];
    const statuses = ["All", "Active", "Suspended", "Inactive"];

    // ── State ────────────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("All");
    const [filterRole, setFilterRole] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        department: "Human Resources",
        roles: [],
        status: "Active",
    });

    // ── Filter Logic ─────────────────────────────────────────────────────────
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDepartment = filterDepartment === "All" || user.department === filterDepartment;
        const matchesRole = filterRole === "All" || (user.roles && user.roles.includes(filterRole));
        const matchesStatus = filterStatus === "All" || user.status === filterStatus;

        return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                department: user.department,
                roles: user.roles || [],
                status: user.status,
            });
        } else {
            setEditingUser(null);
            setFormData({
                fullName: "",
                email: "",
                username: "",
                department: "Human Resources",
                roles: [],
                status: "Active",
            });
        }
        setIsModalOpen(true);
    };

    const handleToggleRole = (role) => {
        setFormData((prev) => {
            const roles = prev.roles || [];
            if (roles.includes(role)) {
                return { ...prev, roles: roles.filter(r => r !== role) };
            } else {
                return { ...prev, roles: [...roles, role] };
            }
        });
    };

    const handleSaveUser = () => {
        if (!formData.fullName || !formData.email || !formData.username) {
            alert("Please fill in all required fields");
            return;
        }

        if (!formData.roles || formData.roles.length === 0) {
            alert("Please assign at least one role");
            return;
        }

        if (editingUser) {
            // Update existing user
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
            alert("User updated successfully");
        } else {
            // Create new user
            const newUser = {
                id: users.length + 1,
                ...formData,
            };
            setUsers([...users, newUser]);
            alert("User created successfully");
        }

        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleToggleStatus = (user) => {
        const newStatus = user.status === "Active" ? "Suspended" : "Active";
        if (window.confirm(`Are you sure you want to ${newStatus === "Active" ? "activate" : "suspend"} this user?`)) {
            setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
            alert(`User ${newStatus === "Active" ? "activated" : "suspended"} successfully`);
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
            selector: (row) => row.roles,
            sortable: false,
            cell: (row) => (
                <div className="flex flex-wrap gap-1 py-2">
                    {row.roles && row.roles.length > 0 ? (
                        row.roles.map((role, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
                            >
                                {role}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">No roles</span>
                    )}
                </div>
            ),
            width: "200px",
        },
        {
            name: "Status",
            cell: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : row.status === "Suspended"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
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
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleOpenModal(row)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                        title="Edit User"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => handleToggleStatus(row)}
                        className={`p-2 rounded transition ${
                            row.status === "Active"
                                ? "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                                : "text-green-600 hover:text-green-800 hover:bg-green-50"
                        }`}
                        title={row.status === "Active" ? "Suspend User" : "Activate User"}
                    >
                        <Power size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "120px",
            center: true,
        },
    ];

    const breadcrumbItems = [
        { label: "Super Admin", href: "/super-admin/dashboard" },
        { label: "User Maintenance", href: "/super-admin/user-maintenance" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-3xl font-bold text-gray-900 mt-2">User Maintenance</h2>
                <p className="text-gray-600 mt-1">Manage system users, roles, and access permissions</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header & Filters */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <UserCog size={28} className="text-blue-600" />
                            <h3 className="text-xl font-bold text-gray-900">User Directory</h3>
                        </div>
                        <OutlineBlueBtn
                            label="Create New User"
                            icon={<Plus size={18} />}
                            onClick={() => handleOpenModal()}
                        />
                    </div>

                    {/* Search & Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <select
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                        >
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept === "All" ? "All Departments" : dept}
                                </option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="All">All Roles</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status === "All" ? "All Status" : status}
                                </option>
                            ))}
                        </select>
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
                            <UserCog size={48} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">No users found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                    }
                />
            </div>

            {/* Create/Edit User Modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Edit User" : "Create New User"}
                body={
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="user@setonedu.ph"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                disabled={!!editingUser}
                            />
                            {editingUser && (
                                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                >
                                    {departments.filter(d => d !== "All").map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        checked={formData.status === "Active"}
                                        onChange={(e) =>
                                            setFormData({ ...formData, status: e.target.checked ? "Active" : "Inactive" })
                                        }
                                    />
                                    <span className="text-sm font-medium text-gray-700">Active Status</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-8">
                                    Active users can log in to the system
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign Roles <span className="text-red-500">*</span>
                            </label>
                            <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                                {roles.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No roles available</p>
                                ) : (
                                    <div className="space-y-2">
                                        {roles.map((role) => (
                                            <label
                                                key={role}
                                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                                    checked={formData.roles && formData.roles.includes(role)}
                                                    onChange={() => handleToggleRole(role)}
                                                />
                                                <span className="text-sm text-gray-700">{role}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {formData.roles && formData.roles.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="text-xs font-medium text-gray-600">Selected roles:</span>
                                    {formData.roles.map((role, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
                                        >
                                            {role}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleRole(role)}
                                                className="hover:bg-blue-200 rounded-full p-0.5 transition"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Select one or more roles for this user
                            </p>
                        </div>
                    </div>
                }
                size="w-[700px]"
                buttons={[
                    {
                        label: editingUser ? "Update User" : "Create User",
                        type: "blue",
                        onClick: handleSaveUser,
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

export default UserMaintenance;
