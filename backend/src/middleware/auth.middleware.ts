import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth.js";

export interface AuthenticatedUser {
  userId: string;
  organizationId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

interface AccessTokenPayload {
  userId: string;
  organizationId: string;
}

function isAccessTokenPayload(
  value: unknown
): value is AccessTokenPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.userId === "string" &&
    typeof payload.organizationId === "string"
  );
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });

      return;
    }

    const decoded: unknown = jwt.verify(
      token,
      authConfig.accessTokenSecret
    );

    if (!isAccessTokenPayload(decoded)) {
      res.status(401).json({
        success: false,
        message: "Invalid access token",
      });

      return;
    }

    req.user = {
      userId: decoded.userId,
      organizationId: decoded.organizationId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Access token expired",
      });

      return;
    }

    res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }
}