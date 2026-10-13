import { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import SignalRListener from "./GlobalFunction/SignalRListener";

function App() {
  const [userId, setUserId] = useState(null);

  // Monitor localStorage for user changes
  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user?.UserId || null);
        } catch (error) {
          console.error("Failed to parse userData:", error);
          setUserId(null);
        }
      } else {
        setUserId(null);
      }
    };

    // Check on mount
    checkUser();

    // Listen for storage changes (handles logout/login in other tabs)
    window.addEventListener("storage", checkUser);

    // Optional: Poll for changes in same tab (if you update localStorage directly)
    const interval = setInterval(checkUser, 1000);

    return () => {
      window.removeEventListener("storage", checkUser);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {userId && <SignalRListener userId={userId} />}
      <AppRoutes />
    </>
  );
}

export default App;