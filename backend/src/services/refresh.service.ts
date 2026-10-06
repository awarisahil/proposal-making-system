import { prisma } from "../config/database.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "./token.service.js";

export async function refreshUserSession(refreshToken: string) {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const tokenHash = hashRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  if (storedToken.revokedAt) {
    throw new Error("Refresh token has been revoked");
  }

  if (storedToken.expiresAt <= new Date()) {
    throw new Error("Refresh token has expired");
  }

  if (storedToken.user.status !== "ACTIVE") {
    throw new Error("User account is not active");
  }

  if (storedToken.user.organization.status !== "ACTIVE") {
    throw new Error("Organization is not active");
  }

  const newAccessToken = generateAccessToken({
    userId: storedToken.user.id,
    organizationId: storedToken.user.organizationId,
  });

  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const newRefreshTokenExpiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    }),

    prisma.refreshToken.create({
      data: {
        userId: storedToken.user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt: newRefreshTokenExpiresAt,
      },
    }),
  ]);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}