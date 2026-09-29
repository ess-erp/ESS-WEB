import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
        setIsValid(false);
        navigate("/");
        return;
      }

      // Merge decoded JWT with userData to preserve UserRoleId
      const savedUser = localStorage.getItem("userData");
      const userData = savedUser ? JSON.parse(savedUser) : {};
      setUser({ ...userData, ...decoded }); // Keep userData fields, but allow JWT to override
      setIsValid(true);
    } catch (err) {
      // Invalid token
      localStorage.removeItem("token");
      setIsValid(false);
      navigate("/");
    }
  }, [navigate]);

  // While checking token
  if (isValid === null) return null;

  console.log(user);
  // Role restriction check
  if (allowedRoles && user && !allowedRoles.includes(parseInt(user.UserRoleId))) {
    return <Navigate to="/accessdenied" replace />;
  }

  return children;
};

export default ProtectedRoutes;
