// Role-wise permissions
export const PERMISSIONS = {
  Admin: ["CREATE_USER", "UPDATE_USER", "DELETE_USER", "VIEW_USERS", "MANAGE_ROLES", "VIEW_REPORTS", "CREATE_POST", "EDIT_POST", "DELETE_POST"],
  Editor: ["CREATE_POST", "EDIT_POST", "DELETE_OWN_POST", "VIEW_POSTS"],
  Viewer: ["VIEW_POSTS", "READ_ARTICLES"],
};
export const hasPermission = (role, permission) => { if (!role || !permission) return false; return PERMISSIONS[role]?.includes(permission); };
export const getPermissions = (role) => PERMISSIONS[role] || [];
export const isAdmin = (role) => role === "Admin";
export const isEditor = (role) => role === "Editor";
export const isViewer = (role) => role === "Viewer";
export const hasRole = (role, allowedRoles = []) => allowedRoles.includes(role);
export const canEditContent = (role) => hasPermission(role, "EDIT_POST");
export const canCreateContent = (role) => hasPermission(role, "CREATE_POST");
export const canDeleteContent = (role) => hasPermission(role, "DELETE_POST") || hasPermission(role, "DELETE_OWN_POST");
export const canManageUsers = (role) => hasPermission(role, "MANAGE_ROLES");
export const canViewReports = (role) => hasPermission(role, "VIEW_REPORTS");
export default { PERMISSIONS, hasPermission, getPermissions, isAdmin, isEditor, isViewer, hasRole, canEditContent, canCreateContent, canDeleteContent, canManageUsers, canViewReports };
