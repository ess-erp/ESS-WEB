import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {
    fetchNotificationListData,
    fetchUpdateNotificationStatusData,
} from "../../states/NotificationState/Action";

const NotificationPanel = ({ userId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notificationState = useSelector(
        (state) => state.notification.notificationState || {}
    );

    const { loading } = notificationState;

    // Local pagination state
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);

    // Local data state (from API response)
    const [notifications, setNotifications] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, [pageNumber]);

    const fetchNotifications = async () => {
        const response = await dispatch(
            fetchNotificationListData(userId, pageNumber, pageSize)
        );

        if (response.ok) {
            const data = response.data || [];

            setNotifications(data);
            setTotalCount(response.totalRecords || 0);
            setTotalPages(Math.ceil((response.totalRecords || 0) / pageSize));
        }
    };
    console.log(notifications);
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

    const handleNotificationClick = (data) => {
        const typeOfNotification = data?.TypeOfNotification;
        
        switch (typeOfNotification) {
            case "StudentOnlineApp":
                dispatch(fetchUpdateNotificationStatusData(data?.NotificationId));
                navigate(`/admission/studentappform?AppId=${data?.SenderId}`);
                break;

            default:
                return;
        };
    };

    return (
        <div className="w-full bg-white rounded shadow">

            {/* HEADER */}
            <div className="p-3 border-b flex justify-between items-center">
                <h2 className="font-semibold text-green-600">Notifications</h2>

                <span className="text-xs text-gray-500">
                    Total: {totalCount}
                </span>
            </div>

            {/* LIST */}
            <div>
                {loading ? (
                    <div className="p-4 text-gray-500">Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-4 text-gray-500">No notifications</div>
                ) : (
                    notifications.map((notification) => {
                        const isUnread = notification.ActiveStatus === "P";

                        return (
                            <div
                                key={notification.NotificationId}
                                onClick={() => handleNotificationClick(notification)}
                                className={`border-b p-4 cursor-pointer hover:bg-gray-50 
                                ${isUnread ? "bg-blue-50" : "bg-white"}`}
                            >
                                <div className="flex justify-between items-center">
                                    <h3
                                        className={`text-sm font-semibold 
                                        ${isUnread ? "text-blue-800" : "text-gray-800"}`}
                                    >
                                        {notification.NotificationTitle}
                                    </h3>

                                    {isUnread && (
                                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 mt-1">
                                    {notification.NotificationMessage}
                                </p>

                                <span className="text-xs text-gray-400">
                                    {new Date(notification.DateCreated).toLocaleString()}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between p-3 border-t">
                <button
                    onClick={handlePrevious}
                    disabled={pageNumber === 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm text-gray-600">
                    Page {pageNumber} of {totalPages || 1}
                </span>

                <button
                    onClick={handleNext}
                    disabled={pageNumber === totalPages || totalPages === 0}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;