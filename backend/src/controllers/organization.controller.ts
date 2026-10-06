import { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import fs from "fs/promises";
import path from "path";
import {
  getOrganization,
  updateOrganization,
} from "../services/organization.service.js";

import {
  updateOrganizationSchema,
} from "../validators/organization.validator.js";

export async function getOrganizationController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
  res.status(401).json({
    success: false,
    message: "Authentication required",
  });
  return;
}
    const organizationId = req.user.organizationId;

    const organization = await getOrganization(
      organizationId
    );

    if (!organization) {
      res.status(404).json({
        success: false,
        message: "Organization not found",
      });
      return;
    }

    res.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error(
      "Get organization error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to get organization",
    });
  }
}

export async function updateOrganizationController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const organizationId = req.user.organizationId;

    const parsed =
      updateOrganizationSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
      return;
    }

    const organization =
      await updateOrganization(
        organizationId,
        parsed.data
      );

    res.json({
      success: true,
      message: "Organization updated successfully",
      data: organization,
    });
  } catch (error) {
    console.error(
      "Update organization error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update organization",
    });
  }
}
export const uploadOrganizationLogoController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const organizationId = req.user.organizationId;

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Logo file is required",
      });
      return;
    }

    const logoUrl = `/uploads/organizations/${req.file.filename}`;

    const organization = await updateOrganization(
      organizationId,
      {
        logoUrl,
      }
    );

    res.json({
      success: true,
      message: "Organization logo uploaded successfully",
      data: {
        logoUrl: organization.logoUrl,
        organization,
      },
    });
  } catch (error) {
    console.error(
      "Upload organization logo error:",
      error
    );

    if (req.file) {
      try {
        await fs.unlink(
          path.resolve(
            process.cwd(),
            "uploads",
            "organizations",
            req.file.filename
          )
        );
      } catch {
        // Ignore cleanup failure
      }
    }

    res.status(500).json({
      success: false,
      message: "Unable to upload organization logo",
    });
  }
};