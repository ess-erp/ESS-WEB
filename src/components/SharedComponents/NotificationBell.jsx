import { Bell } from "lucide-react";
import { useSelector } from "react-redux";

const NotificationBell = () => {
    const unreadCount = useSelector(
        (state) => state.notification?.unreadCount || 0
    );

    return (
        <div className="relative cursor-pointer">
            <Bell className={`w-5 h-5 ${unreadCount > 0 ? "text-red-500" : "text-gray-600"}`} />

            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                </span>
            )}
        </div>
    );
};

export default NotificationBell;