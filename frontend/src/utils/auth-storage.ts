import type {
  AuthUser,
  AuthOrganization,
  AuthRole,
} from "../types/auth.types";

const ACCESS_TOKEN_KEY =
  "proposal_access_token";

const REFRESH_TOKEN_KEY =
  "proposal_refresh_token";

const USER_KEY =
  "proposal_user";

const ORGANIZATION_KEY =
  "proposal_organization";

const ROLES_KEY =
  "proposal_roles";

export function getAccessToken(): string | null {
  return localStorage.getItem(
    ACCESS_TOKEN_KEY
  );
}

export function setAccessToken(
  token: string
): void {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    token
  );
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(
    REFRESH_TOKEN_KEY
  );
}

export function setRefreshToken(
  token: string
): void {
  localStorage.setItem(
    REFRESH_TOKEN_KEY,
    token
  );
}

export function getStoredUser(): AuthUser | null {
  const value =
    localStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function setStoredUser(
  user: AuthUser
): void {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}

export function getStoredOrganization():
  | AuthOrganization
  | null {
  const value =
    localStorage.getItem(
      ORGANIZATION_KEY
    );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function setStoredOrganization(
  organization: AuthOrganization
): void {
  localStorage.setItem(
    ORGANIZATION_KEY,
    JSON.stringify(organization)
  );
}

export function getStoredRoles():
  | AuthRole[]
  | null {
  const value =
    localStorage.getItem(ROLES_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function setStoredRoles(
  roles: AuthRole[]
): void {
  localStorage.setItem(
    ROLES_KEY,
    JSON.stringify(roles)
  );
}

export function clearAuthStorage(): void {
  localStorage.removeItem(
    ACCESS_TOKEN_KEY
  );

  localStorage.removeItem(
    REFRESH_TOKEN_KEY
  );

  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(
    ORGANIZATION_KEY
  );
  localStorage.removeItem(ROLES_KEY);
}