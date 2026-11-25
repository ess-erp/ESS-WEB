// services/authRedirect.js
import { getDashboardPath, extractUserRoles } from '../utils/roleUtils';

/**
 * Redirect user to appropriate dashboard based on their roles
 * Supports both single role (UserRoleId) and multiple roles (roles array)
 */
export const handleAuthRedirect = (navigate) => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log("User data:", userData);
    
    // Extract roles (supports both legacy single role and new multiple roles)
    const userRoles = extractUserRoles(userData);
    console.log("User roles:", userRoles);
    
    if (userRoles.length === 0) {
      console.warn("No valid roles found for user");
      navigate("/");
      return;
    }
    
    // Get dashboard path based on user's primary role
    const dashboardPath = getDashboardPath(userRoles);
    console.log("Redirecting to:", dashboardPath);
    
    navigate(dashboardPath);
  } catch (err) {
    console.error("Error parsing userData:", err);
    navigate("/");
  }
};