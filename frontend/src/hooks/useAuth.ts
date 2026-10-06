import {
  getAccessToken,
  getStoredUser,
  getStoredOrganization,
  getStoredRoles,
  clearAuthStorage,
} from "../utils/auth-storage";

export function useAuth() {
  const token = getAccessToken();

  const user = getStoredUser();

  const organization = getStoredOrganization();

  const roles = getStoredRoles() || [];

  const permissions = roles.flatMap((role) => role.permissions);

  const hasPermission = (permission: string) =>
    permissions.includes(permission);

  const logout = () => {
    clearAuthStorage();
    window.location.href = "/login";
  };

  return {
    token,
    user,
    organization,
    roles,
    permissions,
    hasPermission,
    isAuthenticated: !!token,
    logout,
  };
}