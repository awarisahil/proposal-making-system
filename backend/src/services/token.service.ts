import crypto from "crypto";
import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth.js";

export interface AccessTokenPayload {
  userId: string;
  organizationId: string;
}

export function generateAccessToken(
  payload: AccessTokenPayload
): string {
  return jwt.sign(
    payload,
    authConfig.accessTokenSecret,
    {
      expiresIn: authConfig.accessTokenExpiresIn,
    }
  );
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}