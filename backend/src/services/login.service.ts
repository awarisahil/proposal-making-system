import bcrypt from "bcrypt";

import { prisma } from "../config/database.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "./token.service.js";

interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser(input: LoginInput) {
  const email = input.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      organization: true,

      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User account is not active");
  }

  if (user.organization.status !== "ACTIVE") {
    throw new Error("Organization is not active");
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    organizationId: user.organizationId,
  });

  const refreshToken = generateRefreshToken();

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const refreshTokenExpiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
    },
  });

  const roles = user.roles.map((userRole) => ({
    id: userRole.role.id,
    name: userRole.role.name,

    permissions: userRole.role.permissions.map(
      (rolePermission) => rolePermission.permission.name
    ),
  }));

  return {
    accessToken,
    refreshToken,

    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },

    organization: {
      id: user.organization.id,
      name: user.organization.name,
      slug: user.organization.slug,
    },

    roles,
  };
}