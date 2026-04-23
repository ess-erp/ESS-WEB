import * as signalR from "@microsoft/signalr";

let connection = null;

/**
 * Start the SignalR connection
 * @param {string} userId - ID of logged-in user
 * @param {function} onMessageReceived - callback for incoming messages
 */
export const startNotificationHub = (userId, onMessageReceived) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_API_URL}/notificationHub`, {
      accessTokenFactory: () => localStorage.getItem("token") // optional if using JWT
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", (message) => {
    console.log("Notification received:", message);
    if (onMessageReceived) onMessageReceived(message);
  });

  connection.start()
    .then(() => {
      console.log("Connected to SignalR hub");

      // Optionally, register user ID on server if needed
      connection.invoke("RegisterUser", userId).catch(console.error);
    })
    .catch(console.error);
};

export const stopNotificationHub = () => {
  if (connection) connection.stop().catch(console.error);
};