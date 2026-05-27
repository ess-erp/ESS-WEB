import { useEffect, useState } from "react";

const NotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, [pageNumber]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `https://localhost:44301/api/notification/get-notifications?pageNumber=${pageNumber}&pageSize=${pageSize}`
            );

            const data = await response.json();

            setNotifications(data.data);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (pageNumber < totalPages) {
            setPageNumber((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (pageNumber > 1) {
            setPageNumber((prev) => prev - 1);
        }
    };

    return (
        <div className="w-[400px] rounded-xl border border-gray-200 bg-white shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Notifications
                </h2>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                    {totalCount}
                </span>
            </div>

            {/* Body */}
            <div className="max-h-[450px] overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center p-6 text-sm text-gray-500">
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex items-center justify-center p-6 text-sm text-gray-500">
                        No notifications found.
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.notificationId}
                            className="border-b border-gray-100 p-4 transition hover:bg-gray-50"
                        >
                            <div className="mb-1 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    {notification.title}
                                </h3>

                                {!notification.isRead && (
                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                )}
                            </div>

                            <p className="mb-2 text-sm text-gray-600">
                                {notification.message}
                            </p>

                            <span className="text-xs text-gray-400">
                                {notification.dateCreated}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between border-t border-gray-100 p-4">
                <button
                    onClick={handlePrevious}
                    disabled={pageNumber === 1}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm text-gray-600">
                    Page {pageNumber} of {totalPages || 1}
                </span>

                <button
                    onClick={handleNext}
                    disabled={pageNumber === totalPages}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;