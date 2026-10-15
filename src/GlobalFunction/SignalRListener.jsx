/**
 * SignalRListener.jsx
 * 
 * Role-Based SignalR Hub Connection Manager
 * 
 * This component establishes and maintains a single SignalR connection
 * for the entire application. It listens to real-time events based on
 * the user's role:
 * 
 * Role-Based Event Subscriptions:
 * - Role 1 (Admission): ReceiveNotification, UpdateEnrollmentCount, NewTestPermit
 * - Role 2 (CFW): ReceiveNotification, UpdateCfwEnrollmentCount
 * - Role 3 (Cashier): ReceiveNotification, NewTestPermit, PaymentReceived
 * - Role 4 (Accounting): ReceiveNotification, NewTransaction
 * - Role 5 (SRU): ReceiveNotification, StudentUpdate
 * - Role 6 (Academic): ReceiveNotification, GradeUpdate
 * - Role 7-10 (HR/Management): ReceiveNotification, EmployeeUpdate
 * - Role 11 (SAC): ReceiveNotification
 * - Role 12 (AP): ReceiveNotification
 * - Role 13 (Principal): ReceiveNotification, GlobalUpdate
 * - Role 14-15 (Teacher): ReceiveNotification, ClassUpdate
 * - Role 16 (Student): ReceiveNotification (student-specific)
 * - Role 17 (Parent): ReceiveNotification, NewTestPermit (parent-specific, child's test permit)
 * - Role 18 (Accounting): ReceiveNotification, NewTransaction
 * 
 * All real-time events are dispatched to Redux for state management.
 * 
 * Usage: Include this component once at the app root level with userId and userRole.
 */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as signalR from "@microsoft/signalr";

import {
    showToast,
    receiveSignalRNotification
} from "../states/NotificationState/Action";
import { updateEnrollmentCountRealtime } from "../states/AdmissionState/Action";
import { updateCfwEnrollmentCountRealtime } from "../states/CfwState/Action";

let connection = null;

// Role-based event configuration
// Define which events each role should listen to
const ROLE_EVENT_MAP = {
    1: ['ReceiveNotification', 'UpdateEnrollmentCount', 'NewTestPermit'], // Admission
    2: ['ReceiveNotification', 'UpdateCfwEnrollmentCount'], // CFW
    3: ['ReceiveNotification', 'NewTestPermit', 'PaymentReceived'], // Cashier
    4: ['ReceiveNotification', 'NewTransaction'], // Accounting
    5: ['ReceiveNotification', 'StudentUpdate'], // SRU
    6: ['ReceiveNotification', 'GradeUpdate'], // Academic
    7: ['ReceiveNotification', 'EmployeeUpdate'], // HR
    8: ['ReceiveNotification', 'EmployeeUpdate'], // HR
    9: ['ReceiveNotification', 'EmployeeUpdate'], // HR
    10: ['ReceiveNotification', 'EmployeeUpdate'], // HR
    11: ['ReceiveNotification'], // SAC
    12: ['ReceiveNotification'], // AP (Assistant Principal)
    13: ['ReceiveNotification', 'GlobalUpdate'], // Principal
    14: ['ReceiveNotification', 'ClassUpdate'], // Teacher
    15: ['ReceiveNotification', 'ClassUpdate'], // Teacher
    16: ['ReceiveNotification'], // Student (student-specific notifications)
    17: ['ReceiveNotification', 'NewTestPermit'], // Parent (receives test permit notifications for their children)
    18: ['ReceiveNotification', 'NewTransaction'], // Accounting
};

const SignalRListener = ({ userId, userRole }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Don't initialize if no userId (user not logged in)
        if (!userId) {
            console.log("⚠️ SignalR: No userId provided. Skipping connection.");
            return;
        }

        // Don't initialize if no userRole
        if (!userRole) {
            console.log("⚠️ SignalR: No userRole provided. Skipping connection.");
            return;
        }

        // Don't initialize if no token
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("⚠️ SignalR: No token found. Skipping connection.");
            return;
        }

        // Get allowed events for this role
        const allowedEvents = ROLE_EVENT_MAP[userRole] || ['ReceiveNotification'];
        console.log(`📡 SignalR: Role ${userRole} will listen to:`, allowedEvents);

        // Prevent duplicate connection creation
        if (!connection) {
            connection = new signalR.HubConnectionBuilder()
                .withUrl(import.meta.env.VITE_REALTIME_URL, {
                    accessTokenFactory: () => localStorage.getItem("token"),
                })
                .withAutomaticReconnect()
                .build();

            // ========== ROLE-BASED EVENT SUBSCRIPTIONS ==========

            // ReceiveNotification - Available to all roles
            if (allowedEvents.includes('ReceiveNotification')) {
                connection.on("ReceiveNotification", (data) => {
                    console.log(`📬 [Role ${userRole}] Notification:`, data);

                    // Store notification in state
                    dispatch(receiveSignalRNotification(data));

                    // Handle different notification types with custom formatting
                    const notificationType = data.TypeOfNotification || data.typeOfNotification;

                    // Special handling for TEST_PERMIT notifications
                    if (notificationType === 'TEST_PERMIT') {
                        // For Parent role, show notification about their child's test permit
                        if (userRole === 17) {
                            dispatch(showToast({
                                title: data.Title || data.title || "Test Permit Issued",
                                message: data.Message || data.message,
                                type: "info"
                            }));
                        } 
                        // For Cashier role, show with payment action
                        else if (userRole === 3) {
                            // Extract app number from message if available
                            const appNumberMatch = (data.Message || data.message || '').match(/Application Number: (\w+)/);
                            const appNumber = appNumberMatch ? appNumberMatch[1] : '';

                            dispatch(showToast({
                                title: data.Title || data.title || "New Test Permit",
                                message: data.Message || data.message,
                                type: "info",
                                action: appNumber ? {
                                    label: "View Payment",
                                    url: `/cashier/paymentform?appNumber=${appNumber}`
                                } : undefined
                            }));
                        }
                        // For Admission role, show with action
                        else if (userRole === 1) {
                            dispatch(showToast({
                                title: data.Title || data.title || "Test Permit Issued",
                                message: data.Message || data.message,
                                type: "success"
                            }));
                        }
                        else {
                            // Default toast for other roles
                            dispatch(showToast(data));
                        }
                    } else {
                        // Default notification handling for other types
                        dispatch(showToast(data));
                    }
                });
            }

            // UpdateEnrollmentCount - Admission role only
            if (allowedEvents.includes('UpdateEnrollmentCount')) {
                connection.on("UpdateEnrollmentCount", (countData) => {
                    console.log(`📊 [Role ${userRole}] Enrollment Count Update:`, countData);
                    dispatch(updateEnrollmentCountRealtime(countData));
                });
            }

            // UpdateCfwEnrollmentCount - CFW role only
            if (allowedEvents.includes('UpdateCfwEnrollmentCount')) {
                connection.on("UpdateCfwEnrollmentCount", (countData) => {
                    console.log(`📊 [Role ${userRole}] CFW Enrollment Count Update:`, countData);
                    dispatch(updateCfwEnrollmentCountRealtime(countData));
                });
            }

            // NewTestPermit - Admission, Cashier, and Parent roles
            if (allowedEvents.includes('NewTestPermit')) {
                connection.on("NewTestPermit", (data) => {
                    console.log(`🎫 [Role ${userRole}] New Test Permit Issued:`, data);
                    
                    // Role-specific toast notifications
                    if (userRole === 17) {
                        // Parent role - Show student-friendly notification
                        dispatch(showToast({
                            title: data.title || "Test Permit Issued",
                            message: data.message || `Test permit has been issued for ${data.fullName}`,
                            type: "info"
                        }));
                    } else {
                        // Admission and Cashier roles - Show with action button
                        dispatch(showToast({
                            title: data.title || "New Test Permit Issued",
                            message: data.message,
                            type: "info",
                            action: {
                                label: "View Payment",
                                url: `/cashier/paymentform?appNumber=${data.appNumber}`
                            }
                        }));
                    }

                    // Store in notification state (redirect handled by NotificationPanel/NotificationToast)
                    dispatch(receiveSignalRNotification({
                        title: data.title,
                        message: data.message,
                        type: "TEST_PERMIT",
                        appNumber: data.appNumber,
                        fullName: data.fullName,
                        dateCreated: data.dateCreated,
                        isRead: false
                    }));
                });
            }

            // PaymentReceived - Cashier and Accounting roles
            if (allowedEvents.includes('PaymentReceived')) {
                connection.on("PaymentReceived", (data) => {
                    console.log(`💰 [Role ${userRole}] Payment Received:`, data);
                    
                    dispatch(receiveSignalRNotification(data));
                    dispatch(showToast({
                        title: "Payment Received",
                        message: data.message,
                        type: "success"
                    }));
                });
            }

            // NewTransaction - Accounting roles
            if (allowedEvents.includes('NewTransaction')) {
                connection.on("NewTransaction", (data) => {
                    console.log(`📝 [Role ${userRole}] New Transaction:`, data);
                    
                    dispatch(receiveSignalRNotification(data));
                    dispatch(showToast({
                        title: "New Transaction",
                        message: data.message,
                        type: "info"
                    }));
                });
            }

            // StudentUpdate - SRU role
            if (allowedEvents.includes('StudentUpdate')) {
                connection.on("StudentUpdate", (data) => {
                    console.log(`👨‍🎓 [Role ${userRole}] Student Update:`, data);
                    
                    dispatch(receiveSignalRNotification(data));
                    dispatch(showToast(data));
                });
            }

            // GradeUpdate - Academic role
            if (allowedEvents.includes('GradeUpdate')) {
                connection.on("GradeUpdate", (data) => {
                    console.log(`📚 [Role ${userRole}] Grade Update:`, data);
                    
                    dispatch(receiveSignalRNotification(data));
                    dispatch(showToast(data));
                });
            }

            // EmployeeUpdate - HR roles (7-10)
            if (allowedEvents.includes('EmployeeUpdate')) {
                connection.on("EmployeeUpdate", (data) => {
                    console.log(`👥 [Role ${userRole}] Employee Update:`, data);
                    
                    dispatch(receiveSignalRNotification(data));
                    dispatch(showToast(data));
                });
            }

            // ClassUpdate - Teacher roles (14-15)
            if (allowedEvents.includes('ClassUpdate')) {
                connection.on("ClassUpdate", (data) => {
                    console.log(`🏫 [Role ${userRole}] Class Update:`, data);
                    
                    dispatch(receiveSignalRNotification(data));
                    dispatch(showToast(data));
                });
            }

            // GlobalUpdate - Principal role
            if (allowedEvents.includes('GlobalUpdate')) {
                connection.on("GlobalUpdate", (data) => {
                    console.log(`🌐 [Role ${userRole}] Global Update:`, data);
                    
                    dispatch(receiveSignalRNotification(data));
                    dispatch(showToast(data));
                });
            }

            // CONNECTION EVENTS
            connection.onclose(() => {
                console.log(`❌ SignalR Disconnected [Role ${userRole}]`);
            });

            connection.onreconnecting(() => {
                console.log(`🔄 SignalR Reconnecting... [Role ${userRole}]`);
            });

            connection.onreconnected(() => {
                console.log(`✅ SignalR Reconnected [Role ${userRole}]`);
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
                    console.log(`✅ SignalR Connected [User: ${userId}, Role: ${userRole}]`);
                    console.log(`📡 Listening to:`, allowedEvents);
                }
            } catch (err) {
                console.error("❌ SignalR Start Error:", err);
                setTimeout(() => {
                    startConnection();
                }, 5000);
            }
        };

        startConnection();

        // Cleanup function
        return () => {
            // Stop connection when user logs out or component unmounts
            if (connection && connection.state === signalR.HubConnectionState.Connected) {
                console.log(`🔌 SignalR: Disconnecting [Role ${userRole}]`);
                connection.stop();
                connection = null;
            }
        };

    }, [dispatch, userId, userRole]);

    return null;
};

export default SignalRListener;
