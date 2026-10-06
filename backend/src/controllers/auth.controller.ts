import type { Request, Response } from "express";
import { logoutUser } from "../services/logout.service.js";
import { registerUser } from "../services/auth.service.js";
import { loginUser } from "../services/login.service.js";
import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";
import { refreshUserSession } from "../services/refresh.service.js";
export async function register(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const result = await registerUser(validationResult.data);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (
      error instanceof Error &&
      error.message === "An account with this email already exists"
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to create account",
    });
  }
  
}
export async function login(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const result = await loginUser(validationResult.data);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Invalid email or password" ||
        error.message === "User account is not active" ||
        error.message === "Organization is not active"
      )
    ) {
      res.status(401).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
}

export async function refresh(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const refreshToken = req.body?.refreshToken;

    if (
      typeof refreshToken !== "string" ||
      refreshToken.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });

      return;
    }

    const result = await refreshUserSession(refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error instanceof Error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(401).json({
      success: false,
      message: "Unable to refresh session",
    });
  }
}
export async function logout(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const refreshToken = req.body?.refreshToken;

    if (
      typeof refreshToken !== "string" ||
      refreshToken.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });

      return;
    }

    await logoutUser(refreshToken);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to logout",
    });
  }
}