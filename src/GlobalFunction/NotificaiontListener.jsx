// shared/NotificationListener.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as signalR from "@microsoft/signalr";

import { showToast, receiveSignalRNotification } from "../states/NotificationState/Action";

let connection = null;

const NotificationListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {

        connection = new signalR.HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_NOTIFICATION_URL, {
                accessTokenFactory: () => localStorage.getItem("token"),
            })
            .withAutomaticReconnect()
            .build();

        // RECEIVE NOTIFICATION
        connection.on("ReceiveNotification", (data) => {
            console.log("SignalR:", data);

            dispatch(receiveSignalRNotification(data));
            dispatch(showToast(data.message));
        });

        const startConnection = async () => {
            try {
                await connection.start();
                console.log("SignalR Connected");

                connection.onclose((err) => {
                    console.log("❌ SignalR Disconnected", err);
                });

                connection.onreconnecting((err) => {
                    console.log("🔄 SignalR Reconnecting...", err);
                });

                connection.onreconnected((id) => {
                    console.log("✅ SignalR Reconnected", id);
                });

            } catch (err) {
                console.error("SignalR Connection Error:", err);
            }
        };

        startConnection();

        return () => {
            connection?.stop();
        };

    }, [dispatch]);

    return null;
};

export default NotificationListener;