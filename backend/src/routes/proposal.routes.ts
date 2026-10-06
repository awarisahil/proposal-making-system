import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  createProposalController,
  getProposalsController,
  getProposalController,
  updateProposalController,
  deleteProposalController,

  addProposalSectionController,
  updateProposalSectionController,
  deleteProposalSectionController,

  addProposalItemController,
  updateProposalItemController,
  deleteProposalItemController,

  changeProposalStatusController,

  createProposalVersionController,
  getProposalVersionsController,
  getProposalVersionController,

  getProposalActivitiesController,

  generateProposalPdfController,

  getProposalTemplatesController,
} from "../controllers/proposal.controller.js";

const router = Router();

router.use(authenticate);

// ======================================================
// Proposal Templates
// IMPORTANT: Must be before /:id
// ======================================================

router.get(
  "/templates",
  getProposalTemplatesController
);

// ======================================================
// Proposals
// ======================================================

router.post(
  "/",
  createProposalController
);

router.get(
  "/",
  getProposalsController
);

router.get(
  "/:id",
  getProposalController
);

router.put(
  "/:id",
  updateProposalController
);

router.delete(
  "/:id",
  deleteProposalController
);

// ======================================================
// Sections
// ======================================================

router.post(
  "/:id/sections",
  addProposalSectionController
);

router.put(
  "/:id/sections/:sectionId",
  updateProposalSectionController
);

router.delete(
  "/:id/sections/:sectionId",
  deleteProposalSectionController
);

// ======================================================
// Items
// ======================================================

router.post(
  "/:id/items",
  addProposalItemController
);

router.put(
  "/:id/items/:itemId",
  updateProposalItemController
);

router.delete(
  "/:id/items/:itemId",
  deleteProposalItemController
);

// ======================================================
// Workflow
// ======================================================

router.post(
  "/:id/status",
  changeProposalStatusController
);

// ======================================================
// Versions
// ======================================================

router.post(
  "/:id/versions",
  createProposalVersionController
);

router.get(
  "/:id/versions",
  getProposalVersionsController
);

router.get(
  "/:id/versions/:version",
  getProposalVersionController
);

// ======================================================
// Activities
// ======================================================

router.get(
  "/:id/activities",
  getProposalActivitiesController
);

// ======================================================
// Documents
// ======================================================

router.post(
  "/:id/documents/pdf",
  generateProposalPdfController
);

export default router;