import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { hasAnyRole, extractUserRoles } from "../utils/roleUtils";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isValid, setIsValid] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsValid(false);
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds

      if (decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setIsValid(false);
        navigate("/");
        return;
      }

      // Merge decoded JWT with userData to preserve role information
      const savedUser = localStorage.getItem("userData");
      const userData = savedUser ? JSON.parse(savedUser) : {};
      setUser({ ...userData, ...decoded }); // Keep userData fields, but allow JWT to override
      setIsValid(true);
    } catch (err) {
      // Invalid token
      console.error("Token validation error:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setIsValid(false);
      navigate("/");
    }
  }, [navigate]);

  // While checking token
  if (isValid === null) return null;

  // Role restriction check using multi-role support
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRoles = extractUserRoles(user);
    
    if (!hasAnyRole(userRoles, allowedRoles)) {
      console.warn("Access denied. User roles:", userRoles, "Required roles:", allowedRoles);
      return <Navigate to="/accessdenied" replace />;
    }
  }

  return children;
};

export default ProtectedRoutes;
