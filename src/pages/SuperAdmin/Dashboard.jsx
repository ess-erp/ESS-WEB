import { useEffect, useState } from "react";
import { 
    Users, 
    Shield, 
    Bell, 
    Plus, 
    Edit, 
    Trash2, 
    Pin, 
    AlertCircle,
    Info,
    Calendar as CalendarIcon,
    TrendingUp,
    Activity
} from "lucide-react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import ModalComponent from "../../components/ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../../components/ButtonsComponents/OutlineBlueBtn";

const Dashboard = () => {
    useEffect(() => {
        document.title = "Dashboard | Super Admin";
    }, []);

    // ── Mock Announcements Data ──────────────────────────────────────────────
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: "System Maintenance Scheduled",
            message: "The system will undergo scheduled maintenance on November 30, 2024, from 10:00 PM to 2:00 AM. Please save your work before this time.",
            department: "All",
            priority: "Urgent",
            isPinned: true,
            author: "System Administrator",
            createdAt: "2024-11-25T08:00:00",
        },
        {
            id: 2,
            title: "New Payroll Module Released",
            message: "We're excited to announce the release of the new payroll processing module with enhanced features including automated deductions and customizable reports.",
            department: "Human Resources",
            priority: "Info",
            isPinned: true,
            author: "HR Department",
            createdAt: "2024-11-24T14:30:00",
        },
        {
            id: 3,
            title: "End of Semester Activities",
            message: "All department heads are requested to submit their semester-end reports by December 5, 2024. Forms are available in the registrar's office.",
            department: "Academic",
            priority: "Event",
            isPinned: false,
            author: "Academic Affairs",
            createdAt: "2024-11-23T10:15:00",
        },
        {
            id: 4,
            title: "Security Policy Update",
            message: "New password requirements have been implemented. All users must update their passwords to meet the new security standards within 7 days.",
            department: "All",
            priority: "Urgent",
            isPinned: false,
            author: "IT Security",
            createdAt: "2024-11-22T16:45:00",
        },
        {
            id: 5,
            title: "Holiday Schedule Announcement",
            message: "The school will be closed for the Christmas break from December 20, 2024, to January 5, 2025. Regular operations will resume on January 6, 2025.",
            department: "All",
            priority: "Event",
            isPinned: false,
            author: "Administration",
            createdAt: "2024-11-21T09:00:00",
        },
    ]);

    const departments = ["All", "Academic", "CFW", "SRU", "Admission", "Sac", "Principal", "Parent Portal", "Finance", "Human Resources", "Student", "Cashier", "Assistant Principal", "Accounting", "Purchasing"];
    const priorities = ["Info", "Urgent", "Event"];

    // ── State ────────────────────────────────────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        department: "All",
        priority: "Info",
        isPinned: false,
    });

    // ── Mock Statistics ──────────────────────────────────────────────────────
    const stats = {
        totalUsers: 156,
        activeUsers: 142,
        loginToday: 89,
        failedLogins: 7,
    };

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleOpenModal = (announcement = null) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setFormData({
                title: announcement.title,
                message: announcement.message,
                department: announcement.department,
                priority: announcement.priority,
                isPinned: announcement.isPinned,
            });
        } else {
            setEditingAnnouncement(null);
            setFormData({
                title: "",
                message: "",
                department: "All",
                priority: "Info",
                isPinned: false,
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveAnnouncement = () => {
        if (!formData.title || !formData.message) {
            alert("Please fill in all required fields");
            return;
        }

        if (editingAnnouncement) {
            // Update existing announcement
            setAnnouncements(
                announcements.map((a) =>
                    a.id === editingAnnouncement.id
                        ? { ...a, ...formData }
                        : a
                )
            );
            alert("Announcement updated successfully");
        } else {
            // Create new announcement
            const newAnnouncement = {
                id: announcements.length + 1,
                ...formData,
                author: "System Administrator",
                createdAt: new Date().toISOString(),
            };
            setAnnouncements([newAnnouncement, ...announcements]);
            alert("Announcement posted successfully");
        }

        setIsModalOpen(false);
        setEditingAnnouncement(null);
    };

    const handleDeleteAnnouncement = (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            setAnnouncements(announcements.filter((a) => a.id !== id));
            alert("Announcement deleted successfully");
        }
    };

    const handleTogglePin = (id) => {
        setAnnouncements(
            announcements.map((a) =>
                a.id === id ? { ...a, isPinned: !a.isPinned } : a
            )
        );
    };

    // ── Helper Functions ─────────────────────────────────────────────────────
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Urgent":
                return "bg-red-100 text-red-700 border-red-200";
            case "Event":
                return "bg-purple-100 text-purple-700 border-purple-200";
            default:
                return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "Urgent":
                return <AlertCircle size={16} />;
            case "Event":
                return <CalendarIcon size={16} />;
            default:
                return <Info size={16} />;
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    // Sort announcements: pinned first, then by date
    const sortedAnnouncements = [...announcements].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const breadcrumbItems = [
        { label: "Super Admin", href: "/super-admin/dashboard" },
        { label: "Dashboard", href: "/super-admin/dashboard" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-3xl font-bold text-gray-900 mt-2">Super Admin Dashboard</h2>
                <p className="text-gray-600 mt-1">System overview and announcements</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                            <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Users className="text-blue-600" size={28} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Active Users</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">{stats.activeUsers}</p>
                            <p className="text-xs text-gray-500 mt-1">Currently enabled</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-xl">
                            <Activity className="text-green-600" size={28} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Logins Today</p>
                            <p className="text-3xl font-bold text-purple-600 mt-1">{stats.loginToday}</p>
                            <p className="text-xs text-gray-500 mt-1">Successful sessions</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <TrendingUp className="text-purple-600" size={28} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Failed Logins</p>
                            <p className="text-3xl font-bold text-red-600 mt-1">{stats.failedLogins}</p>
                            <p className="text-xs text-gray-500 mt-1">Security alerts</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-xl">
                            <Shield className="text-red-600" size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcements Board */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                <Bell size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Announcements Board</h3>
                                <p className="text-sm text-gray-600">System-wide communications and updates</p>
                            </div>
                        </div>
                        <OutlineBlueBtn
                            label="Post Announcement"
                            icon={<Plus size={18} />}
                            onClick={() => handleOpenModal()}
                        />
                    </div>
                </div>

                {/* Announcements List */}
                <div className="p-6">
                    {sortedAnnouncements.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                            <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">No announcements yet</p>
                            <p className="text-sm">Create your first announcement to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedAnnouncements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className={`relative bg-gradient-to-r ${
                                        announcement.isPinned
                                            ? "from-yellow-50 to-white border-yellow-200"
                                            : "from-gray-50 to-white border-gray-200"
                                    } border rounded-lg p-5 hover:shadow-md transition group`}
                                >
                                    {/* Pin Indicator */}
                                    {announcement.isPinned && (
                                        <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-tl-lg rounded-br-lg flex items-center gap-1">
                                            <Pin size={12} />
                                            Pinned
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            {/* Title & Priority */}
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-bold text-gray-900">
                                                    {announcement.title}
                                                </h4>
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                                                        announcement.priority
                                                    )}`}
                                                >
                                                    {getPriorityIcon(announcement.priority)}
                                                    {announcement.priority}
                                                </span>
                                            </div>

                                            {/* Message */}
                                            <p className="text-gray-700 mb-3 leading-relaxed">
                                                {announcement.message}
                                            </p>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    <span className="font-medium">{announcement.department}</span>
                                                </span>
                                                <span>•</span>
                                                <span>Posted by {announcement.author}</span>
                                                <span>•</span>
                                                <span>{formatTimestamp(announcement.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={() => handleTogglePin(announcement.id)}
                                                className={`p-2 rounded-lg transition ${
                                                    announcement.isPinned
                                                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                                title={announcement.isPinned ? "Unpin" : "Pin"}
                                            >
                                                <Pin size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(announcement)}
                                                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Post/Edit Announcement Modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAnnouncement ? "Edit Announcement" : "Post New Announcement"}
                body={
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Announcement Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter announcement title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="5"
                                placeholder="Enter announcement message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                >
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    {priorities.map((priority) => (
                                        <option key={priority} value={priority}>
                                            {priority}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    checked={formData.isPinned}
                                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Pin this announcement</span>
                                    <p className="text-xs text-gray-500">Pinned announcements appear at the top</p>
                                </div>
                            </label>
                        </div>
                    </div>
                }
                size="w-[700px]"
                buttons={[
                    {
                        label: editingAnnouncement ? "Update Announcement" : "Post Announcement",
                        type: "blue",
                        onClick: handleSaveAnnouncement,
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

export default Dashboard;
