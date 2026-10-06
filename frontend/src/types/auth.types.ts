export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthOrganization {
  id: string;
  name: string;
  slug: string;
}

export interface AuthRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  organization: AuthOrganization;
  roles: AuthRole[];
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: AuthData;
}