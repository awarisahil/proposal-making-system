import { api } from "../../lib/api";
import type { LoginResponse } from "../../types/auth.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    payload
  );

  return response.data;
}