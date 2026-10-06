import type { Response } from "express";
import { generateProposalPdf } from "../services/proposal-document.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { changeProposalStatus } from "../services/proposal-workflow.service.js";
import {
  getProposalTemplates,
} from "../services/proposal-template.service.js";
import {
  getProposalActivities,
} from "../services/proposal-activity.service.js";
import {
  createProposalVersion,
  getProposalVersions,
  getProposalVersion,
} from "../services/proposal-version.service.js";
import {
  createProposal,
  getProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
  addProposalSection,
  updateProposalSection,
  deleteProposalSection,
  addProposalItem,
  updateProposalItem,
  deleteProposalItem,
} from "../services/proposal.service.js";

import {
  createProposalSchema,
  updateProposalSchema,
  createProposalSectionSchema,
  updateProposalSectionSchema,
  createProposalItemSchema,
  updateProposalItemSchema,
} from "../validators/proposal.validator.js";

function validationErrors(error: any) {
  return error.issues.map((issue: any) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

function requireUser(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });

    return null;
  }

  return req.user;
}

export async function createProposalController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const validation = createProposalSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const proposal = await createProposal(
      user.organizationId,
      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Proposal created successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("Create proposal error:", error);

    if (
      error instanceof Error &&
      error.message === "Client not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to create proposal",
    });
  }
}

export async function getProposalsController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const proposals = await getProposals(
      user.organizationId
    );

    res.status(200).json({
      success: true,
      data: proposals,
    });
  } catch (error) {
    console.error("Get proposals error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch proposals",
    });
  }
}

export async function getProposalController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const proposal = await getProposalById(
      user.organizationId,
req.params.id as string,    );

    if (!proposal) {
      res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    console.error("Get proposal error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch proposal",
    });
  }
}

export async function updateProposalController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const validation = updateProposalSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const proposal = await updateProposal(
      user.organizationId,
req.params.id as string,      validation.data
    );

    res.status(200).json({
      success: true,
      message: "Proposal updated successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("Update proposal error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Proposal not found" ||
        error.message === "Client not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to update proposal",
    });
  }
}

export async function deleteProposalController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    await deleteProposal(
      user.organizationId,
req.params.id as string,    );

    res.status(200).json({
      success: true,
      message: "Proposal cancelled successfully",
    });
  } catch (error) {
    console.error("Delete proposal error:", error);

    if (
      error instanceof Error &&
      error.message === "Proposal not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to cancel proposal",
    });
  }
}

export async function addProposalSectionController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const validation =
      createProposalSectionSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const section = await addProposalSection(
      user.organizationId,
req.params.id as string,      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Proposal section added successfully",
      data: section,
    });
  } catch (error) {
    console.error("Add proposal section error:", error);

    if (
      error instanceof Error &&
      error.message === "Proposal not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to add proposal section",
    });
  }
}

export async function updateProposalSectionController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const validation =
      updateProposalSectionSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const section = await updateProposalSection(
      user.organizationId,
req.params.id as string,      req.params.sectionId as string,
      validation.data
    );

    res.status(200).json({
      success: true,
      message: "Proposal section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Update proposal section error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Proposal not found" ||
        error.message === "Proposal section not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to update proposal section",
    });
  }
}

export async function deleteProposalSectionController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    await deleteProposalSection(
      user.organizationId,
req.params.id as string,      req.params.sectionId as string

    );

    res.status(200).json({
      success: true,
      message: "Proposal section deleted successfully",
    });
  } catch (error) {
    console.error("Delete proposal section error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Proposal not found" ||
        error.message === "Proposal section not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to delete proposal section",
    });
  }
}

export async function addProposalItemController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const validation =
      createProposalItemSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const item = await addProposalItem(
      user.organizationId,
req.params.id as string,      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Proposal item added successfully",
      data: item,
    });
  } catch (error) {
    console.error("Add proposal item error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Proposal not found" ||
        error.message === "Product not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to add proposal item",
    });
  }
}

export async function updateProposalItemController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const validation =
      updateProposalItemSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const item = await updateProposalItem(
      user.organizationId,
req.params.id as string,
      req.params.sectionId as string
,
      validation.data
    );

    res.status(200).json({
      success: true,
      message: "Proposal item updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("Update proposal item error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Proposal not found" ||
        error.message === "Proposal item not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to update proposal item",
    });
  }
}

export async function deleteProposalItemController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    await deleteProposalItem(
      user.organizationId,
      req.params.id as string,
      req.params.sectionId as string

    );

    res.status(200).json({
      success: true,
      message: "Proposal item deleted successfully",
    });
  } catch (error) {
    console.error("Delete proposal item error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Proposal not found" ||
        error.message === "Proposal item not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to delete proposal item",
    });
  }
}

export async function changeProposalStatusController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const allowedActions = [
      "SUBMIT_FOR_REVIEW",
      "APPROVE",
      "SEND",
      "MARK_VIEWED",
      "ACCEPT",
      "REJECT",
      "CANCEL",
      "RETURN_TO_DRAFT",
    ] as const;


    const action = req.body.action;
    console.log("WORKFLOW URL:", req.originalUrl);
console.log("WORKFLOW METHOD:", req.method);
console.log("WORKFLOW BODY:", req.body);
console.log("WORKFLOW ACTION:", action);
    if (!allowedActions.includes(action)) {
      res.status(400).json({
        success: false,
        message: "Invalid workflow action",
      });
      return;
    }

    const proposal = await changeProposalStatus(
      user.organizationId,
      String(req.params.id),
      user.userId,
      action,
      req.body.description
    );

    res.status(200).json({
      success: true,
      message: "Proposal status updated successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("Change proposal status error:", error);

    if (
      error instanceof Error &&
      error.message === "Proposal not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      error instanceof Error &&
      (
        error.message === "Invalid workflow action" ||
        error.message.startsWith("Cannot perform")
      )
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to update proposal status",
    });
  }
}

export async function createProposalVersionController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const version = await createProposalVersion(
      user.organizationId,
      String(req.params.id),
      user.userId
    );

    res.status(201).json({
      success: true,
      message: "Proposal version created successfully",
      data: version,
    });
 } catch (error) {
  console.error("Create proposal version error:", error);

  res.status(500).json({
    success: false,
    message:
      error instanceof Error
        ? error.message
        : "Unable to create proposal version",
  });
}
}

export async function getProposalVersionsController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const versions = await getProposalVersions(
      user.organizationId,
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      data: versions,
    });
  } catch (error) {
    console.error("Get proposal versions error:", error);

    if (
      error instanceof Error &&
      error.message === "Proposal not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to fetch proposal versions",
    });
  }
}

export async function getProposalVersionController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const versionNumber = Number(
      req.params.version
    );

    if (
      !Number.isInteger(versionNumber) ||
      versionNumber < 1
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid version number",
      });
      return;
    }

    const version = await getProposalVersion(
      user.organizationId,
      String(req.params.id),
      versionNumber
    );

    res.status(200).json({
      success: true,
      data: version,
    });
  } catch (error) {
    console.error("Get proposal version error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Proposal not found" ||
        error.message === "Proposal version not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to fetch proposal version",
    });
  }
}
export async function getProposalActivitiesController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const activities = await getProposalActivities(
      user.organizationId,
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Get proposal activities error:", error);

    if (
      error instanceof Error &&
      error.message === "Proposal not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to fetch proposal activities",
    });
  }
}

export async function generateProposalPdfController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = requireUser(req, res);
    if (!user) return;
const template =
  typeof req.body?.template === "string"
    ? req.body.template
    : "modern";

if (
  template !== "modern" &&
  template !== "corporate" &&
  template !== "minimal"
) {
  res.status(400).json({
    success: false,
    message: "Unsupported proposal template",
  });
  return;
}
const pdf = await generateProposalPdf(
  user.organizationId,
  String(req.params.id),
  template
);

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="proposal-${req.params.id}.pdf"`
    );
    res.setHeader("Content-Length", pdf.length);

    res.send(pdf);
  } catch (error) {
    console.error("Generate proposal PDF error:", error);

    if (
      error instanceof Error &&
      error.message === "Proposal not found"
    ) {
      res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to generate proposal PDF",
    });
  }
}

export function getProposalTemplatesController(
  _req: AuthenticatedRequest,
  res: Response
): void {
  res.json({
    success: true,
    data: getProposalTemplates(),
  });
}