// src/components/GoogleModal.jsx
import { useEffect, useRef } from 'react';

const GoogleModal = ({ onSuccess, onFailure }) => {
  const googleButtonRef = useRef();

  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Put this in .env
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: "250",
      });
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const idToken = response.credential;

      // Send token to your backend to verify and login
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message || "Login failed");

      onSuccess(data); // handle login success (store token, redirect, etc.)
    } catch (error) {
      console.error("Google login failed:", error);
      onFailure?.(error.message);
    }
  };

  return (
    <div>
      <h3>Sign in with Google</h3>
      <div ref={googleButtonRef}></div>
    </div>
  );
};

export default GoogleModal;
