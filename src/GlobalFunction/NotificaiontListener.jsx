// // shared/NotificationListener.jsx
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import * as signalR from "@microsoft/signalr";

// import { showToast, receiveSignalRNotification } from "../states/NotificationState/Action";

// let connection = null;

// const NotificationListener = () => {
//     const dispatch = useDispatch();

//     useEffect(() => {

//         connection = new signalR.HubConnectionBuilder()
//             .withUrl(import.meta.env.VITE_NOTIFICATION_URL, {
//                 accessTokenFactory: () => localStorage.getItem("token"),
//             })
//             .withAutomaticReconnect()
//             .build();

//         // RECEIVE NOTIFICATION
//         connection.on("ReceiveNotification", (data) => {
//             console.log("SignalR:", data);

//             dispatch(receiveSignalRNotification(data));
//             dispatch(showToast(data.message));
//         });

//         const startConnection = async () => {
//             try {
//                 await connection.start();
//                 console.log("SignalR Connected");

//                 connection.onclose((err) => {
//                     console.log("❌ SignalR Disconnected", err);
//                 });

//                 connection.onreconnecting((err) => {
//                     console.log("🔄 SignalR Reconnecting...", err);
//                 });

//                 connection.onreconnected((id) => {
//                     console.log("✅ SignalR Reconnected", id);
//                 });

//             } catch (err) {
//                 console.error("SignalR Connection Error:", err);
//             }
//         };

//         startConnection();

//         return () => {
//             connection?.stop();
//         };

//     }, [dispatch]);

//     return null;
// };

// export default NotificationListener;

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import * as signalR from "@microsoft/signalr";

// import {
//     showToast,
//     receiveSignalRNotification
// } from "../states/NotificationState/Action";

// let connection = null;

// const NotificationListener = ({ userId }) => {
//     const dispatch = useDispatch();

//     useEffect(() => {
//         if (connection) return;

//         connection = new signalR.HubConnectionBuilder()
//             .withUrl(import.meta.env.VITE_NOTIFICATION_URL, {
//                 accessTokenFactory: () => localStorage.getItem("token"),
//             })
//             .withAutomaticReconnect()
//             .build();

//         connection.on("ReceiveNotification", (data) => {
//             console.log("SignalR:", data);

//             dispatch(receiveSignalRNotification(data));

//             const message =
//                 data?.message || data?.Message || "New notification";

//             dispatch(showToast(message));
//         });

//         const start = async () => {
//             try {
//                 await connection.start();
//                 console.log("SignalR Connected");
//             } catch (err) {
//                 console.error(err);
//                 setTimeout(start, 3000);
//             }
//         };

//         start();

//         connection.onclose(() => console.log("Disconnected"));
//         connection.onreconnecting(() => console.log("Reconnecting"));
//         connection.onreconnected(() => console.log("Reconnected"));

//         return () => {
//             connection?.stop();
//             connection = null;
//         };
//     }, [dispatch, userId]);

//     return null;
// };

// export default NotificationListener;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as signalR from "@microsoft/signalr";

import {
    showToast,
    receiveSignalRNotification
} from "../states/NotificationState/Action";

let connection = null;

const NotificationListener = ({ userId }) => {
    console.log(userId);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!userId) return;

        // Prevent duplicate connection creation
        if (!connection) {
            connection = new signalR.HubConnectionBuilder()
                .withUrl(import.meta.env.VITE_NOTIFICATION_URL, {
                    accessTokenFactory: () => localStorage.getItem("token"),
                })
                .withAutomaticReconnect()
                .build();

            connection.on("ReceiveNotification", (data) => {
                console.log("SignalR:", data);

                dispatch(receiveSignalRNotification(data));

                // const message =
                //     data?.message ||
                //     data?.Message ||
                //     "New notification";

                dispatch(showToast(data));
            });
            // CONNECTION EVENTS
            connection.onclose(() => {
                console.log("SignalR Disconnected");
            });

            connection.onreconnecting(() => {
                console.log("SignalR Reconnecting...");
            });

            connection.onreconnected(() => {
                console.log("SignalR Reconnected");
            });
        }

        // START CONNECTION SAFELY
        const startConnection = async () => {
            try {

                // ONLY start if disconnected
                if (
                    connection.state ===
                    signalR.HubConnectionState.Disconnected
                ) {
                    await connection.start();

                    console.log("SignalR Connected");
                }

            } catch (err) {
                console.error("SignalR Start Error:", err);

                setTimeout(() => {
                    startConnection();
                }, 5000);
            }
        };

        startConnection();

        return () => {
            // Optional cleanup
            // Usually avoid stopping global SignalR connection
            // unless app is fully unloading

            // connection.stop();

        };

    }, [dispatch, userId]);

    return null;
};

export default NotificationListener;