/**
 * Role Utilities for Multi-Role Support
 * Provides helper functions for role-based access control
 */

/**
 * Normalize user roles to always return an array
 * @param {number|number[]|string|string[]} roles - User role(s)
 * @returns {number[]} - Array of role IDs
 */
export const normalizeRoles = (roles) => {
  if (!roles) return [];
  
  // If already an array, ensure all items are numbers
  if (Array.isArray(roles)) {
    return roles.map(role => typeof role === 'string' ? parseInt(role) : role).filter(r => !isNaN(r));
  }
  
  // If single value, convert to array
  const roleNum = typeof roles === 'string' ? parseInt(roles) : roles;
  return isNaN(roleNum) ? [] : [roleNum];
};

/**
 * Check if user has any of the allowed roles
 * @param {number|number[]} userRoles - User's role ID(s)
 * @param {number[]} allowedRoles - Array of allowed role IDs
 * @returns {boolean} - True if user has at least one allowed role
 */
export const hasAnyRole = (userRoles, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  
  const normalizedUserRoles = normalizeRoles(userRoles);
  
  // Super Admin (role 20) has access to everything
  if (normalizedUserRoles.includes(20)) return true;
  
  // Check if user has any of the allowed roles
  return normalizedUserRoles.some(role => allowedRoles.includes(role));
};

/**
 * Check if user has a specific role
 * @param {number|number[]} userRoles - User's role ID(s)
 * @param {number} roleId - Role ID to check
 * @returns {boolean} - True if user has the specific role
 */
export const hasRole = (userRoles, roleId) => {
  const normalizedUserRoles = normalizeRoles(userRoles);
  return normalizedUserRoles.includes(roleId);
};

/**
 * Get the primary role (first role or highest priority role)
 * @param {number|number[]} userRoles - User's role ID(s)
 * @returns {number|null} - Primary role ID or null
 */
export const getPrimaryRole = (userRoles) => {
  const normalizedUserRoles = normalizeRoles(userRoles);
  
  if (normalizedUserRoles.length === 0) return null;
  
  // If user has Super Admin role, that's always primary
  if (normalizedUserRoles.includes(20)) return 20;
  
  // Otherwise return first role
  return normalizedUserRoles[0];
};

/**
 * Get dashboard path based on user's roles
 * @param {number|number[]} userRoles - User's role ID(s)
 * @returns {string} - Dashboard path
 */
export const getDashboardPath = (userRoles) => {
  const primaryRole = getPrimaryRole(userRoles);
  
  const roleDashboardMap = {
    1: "/admission/dashboard",
    2: "/cfw/dashboard",
    3: "/cashier/dashboard",
    4: "/finance/dashboard",
    5: "/sru/dashboard",
    6: "/academic/dashboard",
    7: "/hrd/dashboard",
    8: "/hrd/dashboard",
    9: "/hrd/dashboard",
    10: "/hrd/dashboard",
    11: "/sac/dashboard",
    12: "/ap/dashboard",
    13: "/principal/dashboard",
    14: "/teacher/dashboard",
    15: "/teacher/dashboard",
    16: "/student/dashboard",
    17: "/parent/dashboard",
    18: "/accounting/dashboard",
    19: "/purchasing/dashboard",
    20: "/super-admin/dashboard",
  };
  
  return roleDashboardMap[primaryRole] || "/";
};

/**
 * Role ID to Name mapping
 */
export const ROLE_NAMES = {
  1: "Admission Officer",
  2: "CFW Staff",
  3: "Cashier",
  4: "Finance Officer",
  5: "Registrar Staff",
  6: "Academic Head",
  7: "HR Admin",
  8: "HR Time",
  9: "HR Staff",
  10: "HR Admin",
  11: "SAC Staff",
  12: "Assistant Principal",
  13: "Principal",
  14: "Adviser",
  15: "Faculty",
  16: "Student",
  17: "Parent",
  18: "Accountant",
  19: "Purchasing Officer",
  20: "Super Admin",
};

/**
 * Get role name from role ID
 * @param {number} roleId - Role ID
 * @returns {string} - Role name
 */
export const getRoleName = (roleId) => {
  return ROLE_NAMES[roleId] || "Unknown Role";
};

/**
 * Get multiple role names
 * @param {number[]} roleIds - Array of role IDs
 * @returns {string[]} - Array of role names
 */
export const getRoleNames = (roleIds) => {
  const normalizedRoles = normalizeRoles(roleIds);
  return normalizedRoles.map(getRoleName);
};

/**
 * Filter menu items based on user's roles
 * @param {Array} menuItems - Menu configuration items
 * @param {number|number[]} userRoles - User's role ID(s)
 * @returns {Array} - Filtered menu items
 */
export const filterMenuByRoles = (menuItems, userRoles) => {
  if (!menuItems || menuItems.length === 0) return [];
  
  return menuItems.filter(item => {
    // Keep separators
    if (item.separator) return true;
    
    // If no role restriction, show to everyone
    if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
    
    // Check if user has access
    return hasAnyRole(userRoles, item.allowedRoles);
  }).map(item => {
    // Recursively filter children
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: item.children.filter(child => {
          if (!child.allowedRoles || child.allowedRoles.length === 0) return true;
          return hasAnyRole(userRoles, child.allowedRoles);
        })
      };
    }
    return item;
  });
};

/**
 * Check if user data contains valid roles
 * @param {Object} userData - User data object
 * @returns {boolean} - True if user has valid roles
 */
export const hasValidRoles = (userData) => {
  if (!userData) return false;
  
  // Check for UserRoleId (legacy single role)
  if (userData.UserRoleId) return true;
  
  // Check for roles array
  if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) return true;
  
  // Check for userRoleIds array
  if (userData.userRoleIds && Array.isArray(userData.userRoleIds) && userData.userRoleIds.length > 0) return true;
  
  return false;
};

/**
 * Extract roles from user data (supports multiple formats)
 * @param {Object} userData - User data object
 * @returns {number[]} - Array of role IDs
 */
export const extractUserRoles = (userData) => {
  if (!userData) return [];
  
  // Check for roles array first (new format)
  if (userData.roles && Array.isArray(userData.roles)) {
    return normalizeRoles(userData.roles);
  }
  
  // Check for userRoleIds array
  if (userData.userRoleIds && Array.isArray(userData.userRoleIds)) {
    return normalizeRoles(userData.userRoleIds);
  }
  
  // Fall back to single UserRoleId (legacy format)
  if (userData.UserRoleId) {
    return normalizeRoles(userData.UserRoleId);
  }
  
  return [];
};
