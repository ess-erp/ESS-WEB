import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchNotificationCountData } from "../../states/NotificationState/Action";

const NotificationBell = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const dispatch = useDispatch();

    const notificationCountState = useSelector((state) => state.notification.notificationCountState || {});

    useEffect(() => {
        if (user && user.UserId) {
            console.log("User logged in, fetching notifications for user ID:", user.UserId);

            dispatch(fetchNotificationCountData(user.UserId));
        }
    }, [user, dispatch]);
    console.log(notificationCountState)

    const unreadCount = notificationCountState?.data.NotificationCount;


    // Fallback to 0 if state isn't populated yet



    // 🧪 TESTING LOG: Open your browser console to see what value Redux is giving you!
    // console.log("Current Redux unreadCount on render:", unreadCount);

    return (
        <div className="relative cursor-pointer flex items-center justify-center">
            {/* Changed condition to always make it blue or change color so you can see it working */}
            <Bell
                className={`w-5 h-5 text-blue-600`}
            />

            {/* Render a badge if there are notifications, OR show a dot if it's 0 so you know it's your custom component */}
            {unreadCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-pulse">
                    {unreadCount}
                </span>
            ) : (
                // Little blue indicator dot to prove your custom component is active
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
            )}
        </div>
    );
};

export default NotificationBell;