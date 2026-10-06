import { prisma } from "../config/database.js";

import { hashRefreshToken } from "./token.service.js";

export async function logoutUser(refreshToken: string) {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const tokenHash = hashRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!storedToken) {
    // Return successfully so logout remains idempotent.
    return;
  }

  if (storedToken.revokedAt) {
    return;
  }

  await prisma.refreshToken.update({
    where: {
      id: storedToken.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}